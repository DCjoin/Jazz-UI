'use strict';

import moment from 'moment';
import assign from 'object-assign';
import _ from 'lodash';
import CommonFuns from '../../util/Util.jsx';

let {DataConverter, formatDateValue} = CommonFuns;
let j2d = DataConverter.JsonToDateTime,
  d2j = DataConverter.DatetimeToJson,
  compareStep = function(src, dest) {
    var stepOrder = [6, 7, 1, 2, 5, 3, 4];
    return _.indexOf(stepOrder, src) - _.indexOf(stepOrder, dest);
  };

let ChartReaderStrategyFactor = {
  defaultStrategy: {
    convertFn: 'convert',
  },
  pieReaderBase: {
    convertFn: 'pieConvert'
  },
  strategyConfiguration: {
    EnergyTrendReader: {
      convertSingleTimeDataFn: 'convertSingleTimeData',
      translateDateFn: 'translateDate',
      getSeriesInternalFn: 'getSeriesInternal',
      tagSeriesConstructorFn: 'tagSeriesConstructor',
      convertMultiTimeDataFn: 'convertMultiTimeData'
    },
    CostTrendReader: {
      convertSingleTimeDataFn: 'convertSingleTimeData',
      translateDateFn: 'translateDate',
      getSeriesInternalFn: 'getSeriesInternal',
      tagSeriesConstructorFn: 'costTagSeriesConstructor'
    },
    UnitCostTrendReader: {
      convertSingleTimeDataFn: 'convertSingleTimeData',
      translateDateFn: 'translateDate',
      getSeriesInternalFn: 'getSeriesInternal',
      tagSeriesConstructorFn: 'unitCostTagSeriesConstructor'
    },
    CarbonTrendReader: {
      convertSingleTimeDataFn: 'convertSingleTimeData',
      translateDateFn: 'translateDate',
      getSeriesInternalFn: 'getSeriesInternal',
      tagSeriesConstructorFn: 'carbonSeriesConstructor'
    },
    UnitCarbonTrendReader: {
      convertSingleTimeDataFn: 'convertSingleTimeData',
      translateDateFn: 'translateDate',
      getSeriesInternalFn: 'getSeriesInternal',
      tagSeriesConstructorFn: 'unitCarbonSeriesConstructor'
    },
    EnergyPieReader: {
      setItemByTargetFn: 'setItemByTarget',
      convertSingleTimeDataFn: 'convertPieSingleTimeData',
      convertMultiTimeDataFn: 'convertPieMultiTimeData',
      setItemByTargetFn4MultiplespanFn: 'setItemByTarget4MultiTimespanPie'
    },
    CostPieReader: {
      baseReader: 'pieReaderBase',
      setItemByTargetFn: 'setCostItemByTarget'
    },
    CarbonPieReader: {
      baseReader: 'pieReaderBase',
      setItemByTargetFn: 'setCarbonItemByTarget'
    },
    EnergyRawGridReader: {
      convertFn: 'rawGridConvert',
      getTargetKeyFn: 'getTargetKey',
      organizeFn: 'rawGridOrganize'
    }
  },
  convertFnStrategy: {
    convert(data, obj, energyStore) {
      var timeRanges = obj.timeRanges,
        returnDatas;

      if (!timeRanges || timeRanges.length <= 1) {
        returnDatas = energyStore.readerStrategy.convertSingleTimeDataFn(data, obj, energyStore);
      } else {
        returnDatas = energyStore.readerStrategy.convertMultiTimeDataFn(data, obj, energyStore);
      }

      return returnDatas;
    },
    pieConvert(data, obj) {
      if (!data) return;
      var d = data.TargetEnergyData,
        bizDelegator = obj.bizDelegator;

      if (!d) return {};

      var arr = [], uom, t, item;
      for (var i = 0; i < d.length; ++i) {
        t = d[i].Target;
        item = {};
        this.setItemByTargetFn(item, t, i);
        if (!item.option)
          item.option = {};
        if (t.Uom) {
          uom = t.Uom;
        } else {
          uom = t.UomId < 1 ? '' : CommonFuns.getUomById(t.UomId).Code;
        }
        if (uom == 'null')
          uom = '';
        item.option.uom = uom;
        item.y = d[i].EnergyData.length > 0 ? d[i].EnergyData[0].DataValue : 0;

        if (t.Type == 13 || t.Type == 14) {
          item.disableDelete = true;
        }
        if (item.y === null || item.y === 'null')
          item.y = 0;
        var seriesState = !bizDelegator ? undefined : bizDelegator.getInitialSeriesState(t, i);
        if (!!seriesState) {
          seriesState.applyToSeriesConfig(item);
        }
        arr.push(item);
      }

      return {
        Data: arr
      };
    },
    rawGridConvert(data, timeRange) {
      if (!data) return null;

      var targetEnergyData = data.TargetEnergyData;
      if (!targetEnergyData || targetEnergyData.length < 1) return [];

      var transfer = [],
        minStep = null;

      for (let i = 0, len = targetEnergyData.length; i < len; i++) {
        let targetDataItem = targetEnergyData[i],
          energy = targetDataItem.EnergyData,
          target = targetDataItem.Target;

        if (!energy || energy.length < 1) continue;

        energy = _.cloneDeep(energy);

        var item = {},
          targetKey = this.getTargetKeyFn(target);

        item.Target = _.cloneDeep(target);
        item.Target.TargetKey = targetKey;
        item.Energy = energy;

        transfer.push(item);
        if (minStep === null || compareStep(minStep, item.Target.Step) > 0) {
          minStep = item.Target.Step;
        }
      }
      return this.organizeFn(transfer, minStep);
    }
  },
  getTargetKeyFnStrategy: {
    getTargetKey(target) {
      return target.TargetId + '_' + target.Type;
    }
  },
  organizeFnStrategy: {
    rawGridOrganize(energyArray, step) {
      let length = energyArray.length,
        result = [];
      let energyData, dataArray, retItem, items, dataItem, dataValue, localTime;
      if (length > 0) {
        for (let i = 0; i < length; i++) {
          energyData = energyArray[i];
          retItem = energyData.Target;
          items = retItem.items = [];
          dataArray = energyData.Energy;
          step = retItem.Step;
          for (let j = 0, len = dataArray.length; j < len; j++) {
            dataItem = dataArray[j];
            dataValue = (dataItem.DataQuality == 7) ? 'NA' : dataItem.DataValue;
            localTime = formatDateValue(j2d(dataItem.LocalTime, true), step);
            items.push({
              value: dataValue,
              localTime: localTime,
              dataTime: dataItem.LocalTime
            });
          }
          result.push(retItem);
        }
      }
      return result;
    }
  },
  setItemByTargetFn4MultiplespanFnStrategy: {
    setItemByTarget4MultiTimespanPie(item, target, idx) {
      var j2d = CommonFuns.DataConverter.JsonToDateTime,
        f = CommonFuns.dateFormat,
        span = target.TimeSpan,
        dateAdd = CommonFuns.dateAdd,
        start = j2d(span.StartTime, false),
        end = j2d(span.EndTime, false),
        fs = 'YYYY-MM-DD HH:mm',
        startStr = f(start, fs),
        endStr = f(end, fs);
      if (end.getHours() === 0) {
        endStr = f(dateAdd(end, -1, 'days'), 'YYYY-MM-DD') + ' 24:00';
      }
      item.name = startStr + '<br/>' + endStr;
      item.option = {
        start: start.getTime(),
        end: end.getTime()
      };
      if (idx === 0) {
        item.disableDelete = true;
      }
    }
  },
  setItemByTargetFnStrategy: {
    setItemByTarget(item, target) {
      item.name = target.Name;
      item.uid = target.TargetId;
      item.dType = target.Type;
      item.option = {};
    },
    setCarbonItemByTarget(item, target) {
      var name = '',
        disableDelete = false,
        uid = target.CommodityId,
        tt = target.Type,
        graySerie = false;
      if (target.CommodityId < 1) {
        name = I18N.EM.Total /*'总览'*/ ;
      } else if (tt == 15) {
        name = target.Name;
        uid = 'benchmark';
      } else {
        name = CommonFuns.getCommodityById(target.CommodityId).Comment;
      }
      if (tt === 13) {
        item.name = name + I18N.EM.Ratio.TargetValue;
        item.disableDelete = true;
      } else if (target.Type === 14) {
        item.name = name + I18N.EM.Ratio.BaseValue;
        item.disableDelete = true;
      } else if (target.Type === 11) {
        item.name = name + I18N.EM.Ratio.CaculateValue /*I18N.Common.Glossary.Baseline'基准值'*/ ;
        item.disableDelete = true;
      } else if (target.Type === 12) {
        item.name = name + I18N.EM.Ratio.RawValue /*I18N.Common.Glossary.Baseline'基准值'*/ ;
        item.disableDelete = true;
      }
      item.option = {
        CommodityId: target.CommodityId
      };
      item.uid = target.CommodityId;
    },
    setCostItemByTarget(item, target) {
      var name = '',
        disableDelete = false,
        disableHide = false,
        uid = target.CommodityId,
        tt = target.Type;

      if (target.CommodityId < 1) {
        name = I18N.EM.Total /*'总览'*/ ;
      } else {
        name = CommonFuns.getCommodityById(target.CommodityId).Comment;
      }

      switch (tt) {
        case 6:
          name = I18N.EM.Plain /*'平时'*/ ;
          disableDelete = true;
          disableHide = true;
          break;
        case 7:
          name = I18N.EM.Peak /*'峰时'*/ ;
          disableDelete = true;
          disableHide = true;
          break;
        case 8:
          name = I18N.EM.Valley /*'谷时'*/ ;
          disableDelete = true;
          disableHide = true;
          break;
        case 13:
          name = I18N.EM.Ratio.TargetValue;
          disableDelete = true;
          break;
        case 14:
          name = I18N.EM.Ratio.BaseValue;
          disableDelete = true;
          break;
        default:
          break;
      }
      item.name = name;
      item.uid = uid;
      item.disableDelete = disableDelete;
      item.disableHide = disableHide;
      item.option = {
        CommodityId: target.CommodityId
      };
    }
  },
  convertSingleTimeDataFnStrategy: {
    convertSingleTimeData(data, obj, energyStore) {
      if (!data) return;
      var start = j2d(obj.start);
      var end = j2d(obj.end);
      var step = obj.step;
      var nav = null, d, date;
      var navigatorData = data.NavigatorData;
      var energyData, localTime;
      var earliestTime = Number.MAX_VALUE; //2000 年1月1日

      if (data.TargetEnergyData && data.TargetEnergyData.length > 0) {
        for (var i = 0, len = data.TargetEnergyData.length; i < len; i++) {
          energyData = data.TargetEnergyData[i].EnergyData;
          if (energyData && energyData.length > 0) {
            localTime = j2d(energyData[0].LocalTime);
            if (localTime < earliestTime) {
              earliestTime = localTime;
            }
          }
        }
      }

      if (navigatorData && navigatorData.EnergyData && navigatorData.EnergyData.length > 0) {
        var arr = [];
        if (j2d(navigatorData.EnergyData[0].LocalTime) != earliestTime) {
          arr.push([energyStore.readerStrategy.translateDateFn(earliestTime, null, step), null]);
        }
        for (var j = 0; j < navigatorData.EnergyData.length; j++) {
          d = navigatorData.EnergyData[j];
          arr.push([energyStore.readerStrategy.translateDateFn(d.LocalTime, null, step), d.DataValue]);
        }
        nav = arr;
      } else {
        nav = [[earliestTime, null]];
      }

      var calendar = data.Calendars && data.Calendars.length > 0 ? data.Calendars : null;

      if (data.TargetEnergyData && data.TargetEnergyData.length > 0) {
        d = energyStore.readerStrategy.getSeriesInternalFn(energyStore, data.TargetEnergyData, energyStore.readerStrategy.tagSeriesConstructorFn, undefined, step, start, end);
      }

      return {
        Data: d,
        Navigator: nav,
        Calendar: calendar
      };
    },
    convertPieSingleTimeData(data, obj) {
      if (!data) return;
      var d = data.TargetEnergyData,
        bizDelegator = obj.bizDelegator;

      if (!d) return {};

      var arr = [], uom, t, item;
      for (var i = 0; i < d.length; ++i) {
        t = d[i].Target;
        item = {};
        this.setItemByTargetFn(item, t, i);
        if (!item.option)
          item.option = {};
        if (t.Uom) {
          uom = t.Uom;
        } else {
          uom = t.UomId < 1 ? '' : CommonFuns.getUomById(t.UomId).Code;
        }
        if (uom == 'null')
          uom = '';
        item.option.uom = uom;
        item.y = d[i].EnergyData.length > 0 ? d[i].EnergyData[0].DataValue : 0;

        if (t.Type == 13 || t.Type == 14) {
          item.disableDelete = true;
        }
        if (item.y === null || item.y === 'null')
          item.y = 0;
        var seriesState = !bizDelegator ? undefined : bizDelegator.getInitialSeriesState(t, i);
        if (!!seriesState) {
          seriesState.applyToSeriesConfig(item);
        }
        arr.push(item);
      }

      return {
        Data: arr
      };
    }
  },
  convertMultiTimeDataFnStrategy: {
    convertMultiTimeData(data, obj, energyStore) {
      var stepStyle = ['minutes', 'hours', 'days', 'months', 'years'];
      if (!data) return;
      var start = j2d(obj.start),
        end = j2d(obj.end),
        step = obj.step,
        nav = null, d,
        navigatorData = data.NavigatorData;

      if (navigatorData && navigatorData.EnergyData && navigatorData.EnergyData.length > 0) {
        var navArr = [];
        for (let j = 0; j < navigatorData.EnergyData.length; j++) {
          d = navigatorData.EnergyData[j];
          navArr.push([energyStore.readerStrategy.translateDateFn(d.LocalTime, null, step), d.DataValue]);
        }
        nav = navArr;
      }

      var returndata = [];
      d = data.TargetEnergyData;

      if (d.length < 1) return;
      CommonFuns.prepareMultiTimeSpanData(data, step);

      var orgintime;
      for (var i = 0; i < d.length; ++i) {
        var timeTable = [];
        var arr = [];
        var eData = d[i].EnergyData;
        var t = d[i].Target;
        var timeRange = t.TimeSpan;
        step = d[i].Target.Step;
        var loopStart;
        var loopEnd;
        if (step < 5) {
          loopStart = CommonFuns.dateAdd(j2d(timeRange.StartTime, false), -1, stepStyle[step]);
          loopEnd = CommonFuns.dateAdd(j2d(timeRange.EndTime, false), -1, stepStyle[step]);
        } else {
          switch (step) {
            case 5:
              loopStart = CommonFuns.dateAdd(j2d(timeRange.StartTime, false), -7, 'days');
              loopEnd = CommonFuns.dateAdd(j2d(timeRange.EndTime, false), -7, 'days');
              break;
            case 6:
              loopStart = CommonFuns.dateAdd(j2d(timeRange.StartTime, false), -15, 'minutes');
              loopEnd = CommonFuns.dateAdd(j2d(timeRange.EndTime, false), -15, 'minutes');
              break;
            case 7:
              loopStart = CommonFuns.dateAdd(j2d(timeRange.StartTime, false), -30, 'minutes');
              loopEnd = CommonFuns.dateAdd(j2d(timeRange.EndTime, false), -30, 'minutes');
              break;
            case 8: //2 hours
              loopStart = CommonFuns.dateAdd(j2d(timeRange.StartTime, false), -2, 'hours');
              loopEnd = CommonFuns.dateAdd(j2d(timeRange.EndTime, false), -2, 'hours');
              break;
            case 9: //4 hours
              loopStart = CommonFuns.dateAdd(j2d(timeRange.StartTime, false), -4, 'hours');
              loopEnd = CommonFuns.dateAdd(j2d(timeRange.EndTime, false), -4, 'hours');
              break;
            case 10: //6 hours
              loopStart = CommonFuns.dateAdd(j2d(timeRange.StartTime, false), -6, 'hours');
              loopEnd = CommonFuns.dateAdd(j2d(timeRange.EndTime, false), -6, 'hours');
              break;
            case 11: //8 hours
              loopStart = CommonFuns.dateAdd(j2d(timeRange.StartTime, false), -8, 'hours');
              loopEnd = CommonFuns.dateAdd(j2d(timeRange.EndTime, false), -8, 'hours');
              break;
            case 12: //12hours
              loopStart = CommonFuns.dateAdd(j2d(timeRange.StartTime, false), -12, 'hours');
              loopEnd = CommonFuns.dateAdd(j2d(timeRange.EndTime, false), -12, 'hours');
              break;

          }
        }

        if (step === 2 || step === 3 || step === 4 || step === 5) {
          var navData = data.NavigatorData.EnergyData;
          if (!navData) return;
          var standardStart;
          if (i === 0) {
            standardStart = timeRange.StartTime;
            for (let j = 0, len = navData.length; j < len; j++) {
              orgintime = j2d(navData[j].LocalTime);
              arr.push([energyStore.readerStrategy.translateDateFn(orgintime, null, step), navData[j].DataValue]);
            }
          } else {
            var timeSpace = CommonFuns.DateComputer.firstValueTime(timeRange.StartTime, step) - CommonFuns.DateComputer.firstValueTime(standardStart, step);
            var stepSpan = CommonFuns.DateComputer.GetStepSpan(timeSpace, step);

            var xAxisdate;
            for (let j = 0, len = navData.length; j < len; j++) {
              orgintime = CommonFuns.DateComputer.AddSevralStep(new Date(j2d(navData[j].LocalTime)), step, -stepSpan) - 0;
              xAxisdate = energyStore.readerStrategy.translateDateFn(orgintime, null, step);
              arr.push([xAxisdate, navData[j].DataValue]);

              if (returndata[0].data[j]) {
                timeTable.push({
                  orig: xAxisdate,
                  offset: timeSpace
                });
              }
            }
          }
        } else {
          for (let j = 0; j < eData.length; j++) {
            orgintime = j2d(eData[j].LocalTime);
            arr.push([energyStore.readerStrategy.translateDateFn(orgintime, null, step), eData[j].DataValue]);
            if (i > 0) {
              if (returndata[0].data[j]) {
                timeTable.push({
                  orig: returndata[0].data[j][0],
                  offset: arr[j][0] - returndata[0].data[j][0]
                });
                arr[j][0] = returndata[0].data[j][0];
              } else {
                arr.pop();
              }
            }
          }
        }

        var uom = t.UomId < 1 ? '' : CommonFuns.getUomById(t.UomId).Code;
        if (uom == 'null')
          uom = '';
        var obj1 = {
          start: loopStart.getTime(),
          end: loopEnd.getTime(),
          timeTable: timeTable,
          uom: uom,
          step: obj.step,
          targetStep: t.Step
        };
        var dStart = loopStart;
        dStart.setMinutes(0, 0, 0);
        var dEnd = loopEnd;
        dEnd.setMinutes(0, 0, 0);
        var startStr = CommonFuns.dateFormat(dStart, 'YYYY-MM-DD HH:mm');
        var endStr;
        if (dEnd.getHours() === 0) {
          dEnd = CommonFuns.dateAdd(dEnd, -1, 'days'); //Ext.Date.add(dEnd, Ext.Date.DAY, -1);
          endStr = CommonFuns.dateFormat(dEnd, 'YYYY-MM-DD') + ' 24:00';
        } else {
          endStr = CommonFuns.dateFormat(dEnd, 'YYYY-MM-DD HH:mm');
        }
        returndata.push({
          name: startStr + "<br/>" + endStr,
          uid: timeRange.StartTime + timeRange.EndTime,
          option: obj1,
          data: arr
        });
      }

      //if (returndata.length > 1) {
      returndata[0].enableDelete = false;
      //}

      return {
        Data: returndata,
        Navigator: nav,
        Calendar: null
      };
    },
    convertPieMultiTimeData(data, obj) {
      var timeRanges = obj.timeRanges, returnDatas;

      if (!timeRanges || timeRanges.length <= 1) {
        returnDatas = this.callParent(arguments);
      } else {
        if (!data) return;
        var d = data.TargetEnergyData;
        if (!d) return {};

        var arr = [], uom, t, item;
        for (var j = 0; j < timeRanges.length; j++) {
          var timeRange = timeRanges[j];
          t = undefined;
          for (var i = 0; i < d.length; ++i) {
            if (!d[i].Target) continue;
            if (timeRange.StartTime == d[i].Target.TimeSpan.StartTime && timeRange.EndTime == d[i].Target.TimeSpan.EndTime) {
              t = d[i].Target;
              break;
            }
          }
          item = {};
          this.setItemByTargetFn4MultiplespanFn(item, t, i);
          item.uid = timeRange.StartTime + '-' + timeRange.EndTime;
          if (!item.option)
            item.option = {};
          if (t.Uom) {
            uom = t.Uom;
          } else {
            uom = t.UomId < 1 ? '' : CommonFuns.getUomById(t.UomId).Code;
          }
          if (uom == 'null')
            uom = '';
          item.option.uom = uom;
          item.y = null;
          item.y = (d[i].EnergyData && d[i].EnergyData.length > 0) ? d[i].EnergyData[0].DataValue : 0;
          if (item.y === null || item.y === 'null')
            item.y = 0;
          arr.push(item);
        }
        returnDatas = {
          Data: arr
        };
      }

      return returnDatas;
    }
  },
  translateDateFnStrategy: {
    translateDate(val, s, targetStep) {
      var step = targetStep,
        sign = CommonFuns.isNumber(s) ? s : 1,
        date = moment(CommonFuns.isNumber(val) ? val : j2d(val)),
        newDate;
      switch (step) {
        case 0: //raw
          //newDate = date;
          newDate = date.add(-7.5 * sign, 'minutes');
          break;
        case 1: //hour add 30mins
          newDate = date.add(-30 * sign, 'minutes');
          break;
        case 2: //day add 12hours
          newDate = date.add(-12 * sign, 'hours');
          break;
        case 3: //month add 15days
          newDate = date.add(-15 * sign, 'days');
          break;
        case 4: //2010年 add 6months
          newDate = date.add(-6 * sign, 'months');
          break;
        case 5: //week add 3days&12hours
          newDate = date.add(-4 * sign, 'days');
          newDate = newDate.add(12 * sign, 'hours');
          break;
        case 6: //15mins
          newDate = date.add(-7.5 * sign, 'minutes');
          break;
        case 7: //30mins
          newDate = date.add(-15 * sign, 'minutes');
          break;
        case 8: //2 hours
          newDate = date.add(-1 * sign, 'hours');
          break;
        case 9: //4 hours
          newDate = date.add(-2 * sign, 'hours');
          break;
        case 10: //6 hours
          newDate = date.add(-3 * sign, 'hours');
          break;
        case 11: //8 hours
          newDate = date.add(-4 * sign, 'hours');
          break;
        case 12: //12hours
          newDate = date.add(-6 * sign, 'hours');
          break;
      }

      return j2d(d2j(newDate._d));
    }
  },
  getSeriesInternalFnStrategy: {
    getSeriesInternal(energyStore, data, seriesConstructorFn, setter, step, start, end) {
      var ret = [], eData, t, arr, series, obj, eStep,
        uom = 'null';
      for (var i = 0; i < data.length; i++) {
        arr = [];
        series = data[i];
        eStep = series.Target.Step;
        if (series.EnergyData) {
          for (var j = 0; j < series.EnergyData.length; j++) {
            eData = series.EnergyData[j];
            arr.push([energyStore.readerStrategy.translateDateFn(eData.LocalTime, null, eStep), eData.DataValue]);
          }
        }
        obj = seriesConstructorFn(series.Target);
        if (!obj) continue;
        if (!obj.option)
          obj.option = {};
        t = series.Target;
        if (t.Uom) {
          uom = t.Uom;
        }
        if (uom == 'null')
          uom = '';
        obj.option = assign(obj.option, {
          start: start,
          end: end,
          step: step,
          targetStep: t.Step,
          uom: uom,
          uomId: t.UomId
        });
        obj.data = arr;
        if (setter) {
          setter(series.Target, obj);
        }

        ret.push(obj);
      }
      return ret;
    }
  },
  tagSeriesConstructorFnStrategy: {
    tagSeriesConstructor(target) {
      var obj = {
        dType: target.Type,
        name: target.Name,
        uid: target.TargetId,
        option: {
          commodityId: target.CommodityId
        },
        graySerie: false
      };
      var name = target.Name || '';

      switch (target.Type) {
        case 11:
          obj.name = name + I18N.EM.Ratio.CaculateValue;
          break;
        case 12:
          obj.name = name + I18N.EM.Ratio.RawValue;
          obj.graySerie = true;
          obj.disableDelete = true;
          break;
        case 13:
          obj.name = I18N.EM.Ratio.TargetValue;
          obj.disableDelete = true;
          break;
        case 14:
          obj.name = I18N.EM.Ratio.BaseValue;
          obj.disableDelete = true;
          break;
        case 18:
          obj.name = I18N.EM.Tool.Weather.Temperature;
          //obj.disableDelete = true;
          break;
        case 19:
          obj.name = I18N.EM.Tool.Weather.Humidity;
          //obj.disableDelete = true;
          break;
        default: break;
      }
      return obj;
    },
    carbonSeriesConstructor(target) {
      if (!target) return null;
      var name,
        disableDelete = false,
        tt = target.Type,
        uid = target.CommodityId;

      if (target.CommodityId < 1) {
        name = I18N.EM.Total /*'总览'*/ ;
      } else {
        name = CommonFuns.getCommodityById(target.CommodityId).Comment;
      }

      switch (tt) {
        case 13:
          name = I18N.EM.Ratio.TargetValue;
          disableDelete = true;
          break;
        case 14:
          name = I18N.EM.Ratio.BaseValue;
          disableDelete = true;
          break;
        default:
          break;
      }
      return {
        name: name,
        uid: uid,
        dType: tt,
        disableDelete: disableDelete,
        option: {
          CommodityId: target.CommodityId
        }
      };
    },
    unitCarbonSeriesConstructor(target) {
      if (!target) return null;
      var name,
        disableDelete = false,
        tt = target.Type,
        uid = target.CommodityId,
        graySerie = false;

      if (target.CommodityId < 1) {
        name = I18N.EM.Total /*'总览'*/ ;
      } else if (tt == 15) {
        name = target.Name;
        uid = 'benchmark';
      } else {
        name = CommonFuns.getCommodityById(target.CommodityId).Comment;
      }

      switch (tt) {
        case 11:
          name = name + I18N.EM.Ratio.CaculateValue;
          break;
        case 12:
          name = name + I18N.EM.Ratio.RawValue;
          graySerie = true;
          disableDelete = true;
          break;
        case 13:
          name = name + I18N.EM.Ratio.TargetValue;
          disableDelete = true;
          break;
        case 14:
          name = name + I18N.EM.Ratio.BaseValue;
          disableDelete = true;
          break;
        default:
          break;
      }
      return {
        name: name,
        uid: uid,
        dType: tt,
        disableDelete: disableDelete,
        option: {
          CommodityId: target.CommodityId
        },
        graySerie: graySerie
      };
    },
    costTagSeriesConstructor(target) {
      if (!target) return null;
      var name,
        disableDelete = false,
        tt = target.Type,
        uid = target.CommodityId;

      if (target.CommodityId < 1) {
        name = I18N.EM.Total /*'总览'*/ ;
      } else {
        name = CommonFuns.getCommodityById(target.CommodityId).Comment;
      }
      switch (tt) {
        case 6:
          name = I18N.EM.Plain /*'平时'*/ ;
          disableDelete = true;
          break;
        case 7:
          name = I18N.EM.Peak /*'峰时'*/ ;
          disableDelete = true;
          break;
        case 8:
          name = I18N.EM.Valley /*'谷时'*/ ;
          disableDelete = true;
          break;
        case 13:
          name = I18N.EM.Ratio.TargetValue;
          disableDelete = true;
          break;
        case 14:
          name = I18N.EM.Ratio.BaseValue;
          disableDelete = true;
          break;
        default:
          break;
      }
      return {
        name: name,
        uid: uid,
        dType: tt,
        disableDelete: disableDelete,
        option: {
          CommodityId: target.CommodityId
        }
      };
    },
    unitCostTagSeriesConstructor(target) {
      if (!target) return null;
      var name,
        disableDelete = false,
        tt = target.Type,
        uid = target.CommodityId,
        graySerie = false;


      if (target.CommodityId < 1) {
        name = I18N.EM.Total /*'总览'*/ ;
      } else {
        name = CommonFuns.getCommodityById(target.CommodityId).Comment;
      }
      switch (tt) {
        case 11:
          name = name + I18N.EM.Ratio.CaculateValue;
          break;
        case 12:
          name = name + I18N.EM.Ratio.RawValue;
          graySerie = true;
          disableDelete = true;
          break;
        case 13:
          name = I18N.EM.Ratio.TargetValue;
          disableDelete = true;
          break;
        case 14:
          name = I18N.EM.Ratio.BaseValue;
          disableDelete = true;
          break;
        case 15:
          name = name;
          uid = 'benchmark';
          break;
        default:
          break;
      }
      return {
        name: name,
        uid: uid,
        dType: tt,
        disableDelete: disableDelete,
        graySerie: graySerie,
        option: {
          CommodityId: target.CommodityId
        }
      };
    }
  },

  getStrategyByBizChartType(bizChartType) {
    return ChartReaderStrategyFactor.getStrategyByConfig(ChartReaderStrategyFactor.strategyConfiguration[bizChartType]);
  },
  getStrategyByConfig: function(strategyConfig) {
    var strategyObj = {},
      cloneConfig = _.cloneDeep(strategyConfig);

    if (strategyConfig.baseReader) {
      cloneConfig = CommonFuns.applyIf(cloneConfig, ChartReaderStrategyFactor[strategyConfig.baseReader]);
    }

    cloneConfig = CommonFuns.applyIf(cloneConfig, this.defaultStrategy);

    for (var n in cloneConfig) {
      if (n === 'baseReader') {

      } else {
        strategyObj[n] = this[n + 'Strategy'][cloneConfig[n]];
      }
    }
    return strategyObj;
  }
};
module.exports = ChartReaderStrategyFactor;
