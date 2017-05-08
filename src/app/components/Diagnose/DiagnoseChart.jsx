import React, { Component } from 'react';
import Immutable from 'immutable';
import {curry, flowRight} from 'lodash'
import moment from 'moment';

import {isNumber, isEmptyStr} from 'util/Util.jsx';
import {Minite,Min15,Min30,Hourly,Hour2,Hour4,Hour6,Hour8,Hour12,Daily,Weekly,Monthly,Yearly} from 'constants/TimeGranularity.jsx';

import ChartBasicComponent from 'components/DataAnalysis/Basic/ChartBasicComponent.jsx'

const ALARM_COLOR = '#ff4b00';
const GRAY_COLOR = 'gray';
const PLOT_BACKGROUND_COLOR = '#ecfaf8';
const CHART_TYPE = 'line';
const TRIGGER_DATA_QUALITY = 10;
const IGNORE_DATA_QUALITY = 11;
const CALENDAR_TYPE_WORKTIME = 2;
const CALENDAR_TYPE_NO_WORKTIME = 3;

function mapSeriesDataWithMax(isTriggerVal, isIgnoreVal, isEdit, isHistory, energyData, serie, serieIdx, series) {
  let history = isHistory(serieIdx),
  enableDelete = isEdit;
  if( enableDelete ) {
    if( energyData.size < 2 || history ) {
      enableDelete = false;
    }
  }
  return {...serie, ...{
    turboThreshold: null,
    enableHide: false,
    enableDelete: enableDelete,
    color: history ? ALARM_COLOR : undefined,
    stacking: null,
    data: serie.data.map(
      (data, dataIdx) => {
        // 由于API返回的数据为请求时间的后一个步长，所以为了数据点可以正常显示，图表会自动往前加一个步长的空数据
        // 所以从原数据获取状态时，index会比原数据的index多1，故-1
        // 为什么不在根源上解决这个问题？
        // 最古老的代码中有这样的逻辑，没有时间重新整理这么复杂的逻辑，我也是受害者
        // Law 2017/04/20
        let isTrigger = isTriggerVal(serieIdx, dataIdx - 1);
        let isIgnore = isIgnoreVal(serieIdx, dataIdx - 1);
        if( isTrigger || isIgnore ) {
          let color = ALARM_COLOR;
          if(isIgnore) {
            color = GRAY_COLOR;
          }
          return {
            x: data[0],
            y: data[1],
            color: color,
            marker: {
              states: {
                hover: {
                  fillColor: color,
                }
              }
            }
          }          
        }
        return data;
      })
  }}
}

function postNewConfig(data, isEdit, newConfig) {
  let triggerVal = data.get('TriggerValue'),
  Calendars = data.getIn(['EnergyViewData', 'Calendars']);
  newConfig.series = newConfig.series.map(
    curry(mapSeriesDataWithMax)(
      (serieIdx, dataIdx) => data.getIn([
      'EnergyViewData', 
      'TargetEnergyData', 
      serieIdx,
      'EnergyData',
      dataIdx, 
      'DataQuality']) === TRIGGER_DATA_QUALITY, 
      (serieIdx, dataIdx) => data.getIn([
      'EnergyViewData', 
      'TargetEnergyData', 
      serieIdx,
      'EnergyData',
      dataIdx, 
      'DataQuality']) === IGNORE_DATA_QUALITY, 
      isEdit,
      (serieIdx, dataIdx) => data.getIn([
      'EnergyViewData', 
      'TargetEnergyData', 
      serieIdx,
      'Target',
      'Code']) === 'TriggerValue', 
      data.getIn(['EnergyViewData', 'TargetEnergyData'])
        .filter( energyData => energyData.getIn(['Target', 'Code']) !== 'TriggerValue' )
    )
  );
  if( isNumber(triggerVal) ) {
    newConfig.series.push({
        lockLegend: true,
        enableDelete: false,
        name: '触发值',
        color: ALARM_COLOR, 
        lineWidth: 2,
        dashStyle: 'shortdash',
        marker: {
            symbol: 'null',
        }
    });
    newConfig.yAxis[0].plotLines = [{
      color: ALARM_COLOR,
      dashStyle: 'ShortDash',
      zIndex: 5,
      width: 2,
      value: triggerVal
    }];
    let vals = [];
    let max  = triggerVal;
    let min  = triggerVal;
    data.getIn(['EnergyViewData', 'TargetEnergyData'])
      .map( TargetEnergyData => TargetEnergyData.get('EnergyData').map(eData => {
        let val = eData.get('DataValue');
        if( val > max ) {
          max = val;
        }
        if( val < min ) {
          min = val
        }
        vals.push(eData.get('DataValue'));
      }) )
    // data
    //   .getIn(['EnergyViewData', 'TargetEnergyData', 0, 'EnergyData'])
    //   .map(eData => eData.get('DataValue')).toJS(),
    // max = Math.max(...vals),
    // min = Math.min(...vals);

    if(vals && vals.length > 0) {
      if(max < triggerVal) {
        newConfig.yAxis[0].max = triggerVal;
      }
      if( min > triggerVal ) {
        newConfig.yAxis[0].min = triggerVal;
      }
    }
  }
  if( Calendars && Calendars.size > 0 ) {
    let {CalendarType, CalendarTimeRanges} = Calendars.get(0).toJS();
    if( CalendarType === CALENDAR_TYPE_WORKTIME || CalendarType === CALENDAR_TYPE_NO_WORKTIME 
      && CalendarTimeRanges && CalendarTimeRanges.length > 0 ) {

      newConfig.series.unshift({
          lockLegend: true,
          enableDelete: false,
          name: CalendarType === CALENDAR_TYPE_WORKTIME ? '运行时间' : '非运行时间',
          color: PLOT_BACKGROUND_COLOR, 
          lineWidth: 12,
          marker: {
              symbol: 'null',
          }
      });
      let rate = data.getIn([
        'EnergyViewData', 
        'TargetEnergyData', 
        0,
        'Target',
        'Step'], 6) === 2 ? 16 : 8;
      newConfig.xAxis.plotBands = CalendarTimeRanges.map(({StartTime, EndTime}) => {
        return {
          color: PLOT_BACKGROUND_COLOR,
          from: moment(StartTime).add(rate, 'hours').valueOf(),
          to: moment(EndTime).add(rate, 'hours').valueOf()        
        }
      });

    }
  }

  newConfig.stacking = null;
}

export default function DiagnoseChart(props) {
	let {data,afterChartCreated, onDeleteButtonClick, isEdit} = props,

	chartProps = {
		chartType: CHART_TYPE,
		tagData: data.get('EnergyViewData'),
		postNewConfig: curry(postNewConfig)(data, isEdit),
		afterChartCreated,
    onDeleteButtonClick,
    isEdit,
	};
  // 由于API返回的数据为请求时间的后一个步长，所以为了数据点可以正常显示，加入如下逻辑
  // Law 2017/04/20
  let target = data.getIn(['EnergyViewData', 'TargetEnergyData', 0, 'Target'])
  if( target && target.get('TimeSpan').size > 0 ) {
    let step = target.get('Step');
    chartProps.contentSyntax = JSON.stringify({
      viewOption: {
        TimeRanges: [{
          StartTime: subtractStep(target.getIn(['TimeSpan', 'StartTime']), step),
          EndTime: subtractStep(target.getIn(['TimeSpan', 'EndTime']), step),
        }]
      }
    });
  }

	return (
		<ChartBasicComponent {...chartProps}/>
	);
}

const TIME_GRANULARITY_MAP_VAL = {
  [Minite]: 60,
  [Min15]: 15 * 60,
  [Min30]: 30 * 60,
  [Hourly]: 60 * 60,
  [Hour2]: 2 * 60 * 60,
  [Hour4]: 4 * 60 * 60,
  [Hour6]: 6 * 60 * 60,
  [Hour8]: 8 * 60 * 60,
  [Hour12]: 12 * 60 * 60,
  [Daily]: 24 * 60 * 60,
  [Weekly]: 7 * 24 * 60 * 60,
  [Monthly]: 30 * 24 * 60 * 60,
  [Yearly]: 365 * 24 * 60 * 60,
}
function subtractStep(time, step) {
  return moment(
    moment(time).valueOf() - TIME_GRANULARITY_MAP_VAL[step] * 1000
  ).format('YYYY-MM-DDTHH:mm:ss');
}