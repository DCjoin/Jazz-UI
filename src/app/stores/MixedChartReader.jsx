'use strict';

import moment from 'moment';
import assign from 'object-assign';
import CommonFuns from '../util/Util.jsx';

let {DataConverter} = CommonFuns;
let j2d = DataConverter.JsonToDateTime,
  d2j = DataConverter.DatetimeToJson;

let ReaderFuncs = {
  convert: function(data, obj) {
    var timeRanges = obj.timeRanges,
      returnDatas;

    if (!timeRanges || timeRanges.length <= 1) {
      returnDatas = ReaderFuncs.convertSingleTimeData(data, obj);
    } else {
      returnDatas = ReaderFuncs.convertMultiTimeData(data, obj);
    }

    return returnDatas;
  },
  convertSingleTimeData: function(data, obj) {
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
          localTime = j2d(energyData[0].UtcTime);
          if (localTime < earliestTime) {
            earliestTime = localTime;
          }
        }
      }
    }

    if (navigatorData && navigatorData.EnergyData && navigatorData.EnergyData.length > 0) {
      var arr = [];
      if (j2d(navigatorData.EnergyData[0].UtcTime) != earliestTime) {
        arr.push([ReaderFuncs.translateDate(earliestTime, null, step), null]);
      }
      for (var j = 0; j < navigatorData.EnergyData.length; j++) {
        d = navigatorData.EnergyData[j];
        arr.push([ReaderFuncs.translateDate(d.UtcTime, null, step), d.DataValue]);
      }
      nav = arr;
    } else {
      nav = [[earliestTime, null]];
    }

    var calendar = data.Calendars && data.Calendars.length > 0 ? data.Calendars : null;

    if (data.TargetEnergyData && data.TargetEnergyData.length > 0) {
      d = ReaderFuncs.getSeriesInternal(data.TargetEnergyData, ReaderFuncs.tagSeriesConstructor, undefined, step, start, end);
    }

    return {
      Data: d,
      Navigator: nav,
      Calendar: calendar
    };
  },
  translateDate: function(val, s, targetStep) {
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
  },
  getSeriesInternal(data, seriesConstructorFn, setter, step, start, end) {
    var ret = [], eData, t, arr, series, obj,
      uom = 'null';
    for (var i = 0; i < data.length; i++) {
      arr = [];
      series = data[i];
      if (series.EnergyData) {
        for (var j = 0; j < series.EnergyData.length; j++) {
          eData = series.EnergyData[j];
          arr.push([ReaderFuncs.translateDate(eData.UtcTime, null, step), eData.DataValue]);
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
  },
  tagSeriesConstructor: function(target) {
    var obj = {
      dType: target.Type,
      name: target.Name,
      uid: target.TargetId,
      option: {
        commodityId: target.CommodityId
      }
    };
    var name = target.Name || '';

    switch (target.Type) {
      case 11:
        obj.name = name + I18N.EM.Ratio.CaculateValue;
        break;
      case 12:
        obj.name = name + I18N.EM.Ratio.RawValue;
        obj.disableDelete = true;
        break;
      case 13:
        obj.name = name /*+ I18N.EM.Ratio.TargetValue*/ ;
        obj.disableDelete = true;
        break;
      case 14:
        obj.name = name /*+ I18N.EM.Ratio.BaseValue*/ ;
        obj.disableDelete = true;
        break;
      default:
        break;
    }
    return obj;
  },
};
module.exports = ReaderFuncs;
