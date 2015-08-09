'use strict';

import moment from 'moment';
import assign from 'object-assign';
import _ from 'lodash';
import CommonFuns from '../../util/Util.jsx';

let {DataConverter} = CommonFuns;
let j2d = DataConverter.JsonToDateTime,
    d2j = DataConverter.DatetimeToJson;

let ChartReaderStrategyFactor = {
  defaultStrategy: {
    convertFn:'convert',
  },
  pieReaderBase:{
    convertFn:'pieConvert'
  },
  strategyConfiguration: {
    EnergyTrendReader:{
      convertSingleTimeDataFn:'convertSingleTimeData',
      translateDateFn:'translateDate',
      getSeriesInternalFn:'getSeriesInternal',
      tagSeriesConstructorFn:'tagSeriesConstructor'
    },
    EnergyPieReader:{
      baseReader:'pieReaderBase',
      setItemByTarget:'setItemByTarget'
    }
  },
  convertFnStrategy:{
    convert(data, obj){
      var timeRanges = obj.timeRanges,
          returnDatas;

      if (!timeRanges || timeRanges.length <= 1) {
          returnDatas = ChartReaderStrategyFactor.convertSingleTimeDataFnStrategy.convertSingleTimeData(data, obj);
      } else {
          returnDatas = ChartReaderStrategyFactor.convertMultiTimeDataFnStrategy.convertMultiTimeData(data, obj);
      }

      return returnDatas;
    },
    pieConvert(data, obj){
      if (!data) return;
         var d = data.TargetEnergyData,
             bizDelegator = obj.bizDelegator;

         if (!d) return {};

         var arr = [], uom, t, item;
         for (var i = 0; i < d.length; ++i) {
             t = d[i].Target;
             item = {};
             this.setItemByTargetStrategy.setItemByTarget(item, t, i);
             if (!item.option) item.option = {};
             if (t.Uom) {
                 uom = t.Uom;
             }
             else {
                 uom = t.UomId < 1 ? '' : CommonFuns.getUomById(t.UomId).Code;
             }
             if (uom == 'null') uom = '';
             item.option.uom = uom;
             item.y = d[i].EnergyData.length > 0 ? d[i].EnergyData[0].DataValue : 0;

             if (t.Type == 13 || t.Type == 14) {
                 item.disableDelete = true;
             }
             if (item.y === null || item.y === 'null') item.y = 0;
             var seriesState = !bizDelegator ? undefined : bizDelegator.getInitialSeriesState(t, i);
             if (!!seriesState) {
                 seriesState.applyToSeriesConfig(item);
             }
             arr.push(item);
         }

         return { Data: arr };
    }
  },
  setItemByTargetStrategy:{
    setItemByTarget(item, target){
      item.name = target.Name;
      item.uid = target.TargetId;
      item.option = {};
    }
  },
  convertSingleTimeDataFnStrategy:{
    convertSingleTimeData(data, obj){
      if (!data) return;
      var start = j2d(obj.start);
      var end = j2d(obj.end);
      var step = obj.step;
      var nav = null, d, date;
      var navigatorData = data.NavigatorData;
      var energyData, localTime;
      var earliestTime = Number.MAX_VALUE;//2000 年1月1日

      if (data.TargetEnergyData && data.TargetEnergyData.length > 0) {
          for (var i = 0, len = data.TargetEnergyData.length; i < len; i++) {
              energyData = data.TargetEnergyData[i].EnergyData;
              if (energyData && energyData.length > 0) {
                  localTime = j2d(energyData[0].LocalTime);
                  if ( localTime < earliestTime) {
                      earliestTime = localTime;
                  }
              }
          }
      }

      if (navigatorData && navigatorData.EnergyData && navigatorData.EnergyData.length > 0) {
          var arr = [];
          if (j2d(navigatorData.EnergyData[0].LocalTime) != earliestTime) {
              arr.push([ChartReaderStrategyFactor.translateDateFnStrategy.translateDate(earliestTime, null, step), null]);
          }
          for (var j = 0; j < navigatorData.EnergyData.length; j++) {
              d = navigatorData.EnergyData[j];
              arr.push([ChartReaderStrategyFactor.translateDateFnStrategy.translateDate(d.LocalTime, null, step), d.DataValue]);
          }
          nav = arr;
      } else {
          nav = [[earliestTime,null]];
      }

      var calendar = data.Calendars && data.Calendars.length > 0 ? data.Calendars : null;

      if (data.TargetEnergyData && data.TargetEnergyData.length > 0) {
          d = ChartReaderStrategyFactor.getSeriesInternalFnStrategy.getSeriesInternal(data.TargetEnergyData, ChartReaderStrategyFactor.tagSeriesConstructorFnStrategy.tagSeriesConstructor, undefined, step, start, end);
      }

      return { Data: d, Navigator: nav, Calendar: calendar };
    }
  },
  convertMultiTimeDataFnStrategy:{
    convertMultiTimeData(){

    }
  },
  translateDateFnStrategy:{
    translateDate(val, s, targetStep){
      var step = targetStep,
          sign = CommonFuns.isNumber(s)? s : 1,
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
              newDate = date.add( -7.5 * sign, 'minutes');
              break;
          case 7: //30mins
              newDate = date.add(-15 * sign, 'minutes');
              break;
      }

      return j2d(d2j(newDate._d));
    }
  },
  getSeriesInternalFnStrategy:{
    getSeriesInternal(data, seriesConstructorFn, setter, step, start, end){
      var ret = [], eData, t, arr, series, obj, uom='null';
      for (var i = 0; i < data.length; i++) {
          arr = [];
          series = data[i];
          if (series.EnergyData) {
              for (var j = 0; j < series.EnergyData.length; j++) {
                  eData = series.EnergyData[j];
                  arr.push([ChartReaderStrategyFactor.translateDateFnStrategy.translateDate(eData.LocalTime, null, step), eData.DataValue]);
              }
          }
          obj = seriesConstructorFn(series.Target);
          if (!obj) continue;
          if (!obj.option) obj.option = {};
          t = series.Target;
          if (t.Uom) {
              uom = t.Uom;
          }
          if (uom == 'null') uom = '';
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
  tagSeriesConstructorFnStrategy:{
    tagSeriesConstructor(target){
      var obj = {
          dType: target.Type,
          name: target.Name,
          uid: target.TargetId,
          option: { commodityId: target.CommodityId }
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
              obj.name = name /*+ I18N.EM.Ratio.TargetValue*/;
              obj.disableDelete = true;
              break;
          case 14:
              obj.name = name /*+ I18N.EM.Ratio.BaseValue*/;
              obj.disableDelete = true;
              break;
          default:
              break;
      }
      return obj;
    }
  },
  getStrategyByBizChartType (bizChartType) {
        return ChartReaderStrategyFactor.getStrategyByConfig(ChartReaderStrategyFactor.strategyConfiguration[bizChartType]);
  },
  getStrategyByConfig: function (strategyConfig) {
      var strategyObj = {},
          cloneConfig = _.cloneDeep(strategyConfig);

      if(strategyConfig.baseReader){
          cloneConfig = CommonFuns.applyIf(cloneConfig, strategyConfig.baseReader);
      }

      cloneConfig = CommonFuns.applyIf(cloneConfig, this.defaultStrategy);

      for (var n in cloneConfig) {
          strategyObj[n] = this[n + 'Strategy'][cloneConfig[n]];
      }
      return strategyObj;
  }
};
module.exports = ChartReaderStrategyFactor;
