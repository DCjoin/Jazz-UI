import React, { Component } from 'react';
import Immutable from 'immutable';
import {curry, flowRight} from 'lodash-es'
import moment from 'moment';
import numeral from 'numeral';

import {isNumber, isEmptyStr, getUomById} from 'util/Util.jsx';
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

function mapSeriesDataWithMax(isEdit, isTypeC, isHistory, energyData, serie, serieIdx, series) {
  let history = isHistory(serieIdx),
  enableDelete = isEdit;
  if( enableDelete ) {
    if( energyData.size < 2 || history ) {
      enableDelete = false;
    }
  }
  // let name = serie.name;
  // if( isTypeC && serieIdx === series.length - 1 ) {
  //   name += '<br/>（关联）';
  // }
  return {...serie, ...{
    name: serie.name,
    turboThreshold: null,
    enableHide: false,
    enableDelete: enableDelete,
    color: history ? ALARM_COLOR : undefined,
    stacking: null,
    data: serie.data.map(
      data => {
        if( data && data.length > 2 ) {
          let isTrigger = data[2].DataQuality === TRIGGER_DATA_QUALITY;
          let isIgnore = data[2].DataQuality === IGNORE_DATA_QUALITY;
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
        }
        return data;
      })
  }}
}

function postNewConfig(data, isEdit, isTypeC, newConfig) {
  let triggerVal = data.get('TriggerValue'),
  Calendars = data.getIn(['EnergyViewData', 'Calendars']),
  Step = data.getIn(['EnergyViewData', 'TargetEnergyData', 0, 'Target', 'Step']);
  newConfig.series = newConfig.series.map(
    curry(mapSeriesDataWithMax)(
      isEdit,
      isTypeC,
      serieIdx => data.getIn([
      'EnergyViewData', 
      'TargetEnergyData', 
      serieIdx,
      'Target',
      'Code']) === 'TriggerValue', 
      data.getIn(['EnergyViewData', 'TargetEnergyData'])
        .filter( energyData => energyData.getIn(['Target', 'Code']) !== 'TriggerValue' )
    )
  );
  if(isTypeC) {
    newConfig.legend.labelFormatter = function() {
      if( this.index === data.getIn(['EnergyViewData', 'TargetEnergyData']).size -1 ) {
        return this.name + '<br>(关联)';
      }
      return this.name;
    }
  }
  if( isNumber(triggerVal) ) {
    newConfig.series.push({
        lockLegend: true,
        enableDelete: false,
        name: I18N.Setting.Diagnose.TriggerValue,
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
  if( Step !== Daily && Step !== Monthly && Calendars && Calendars.size > 0 ) {
    let {CalendarType, CalendarTimeRanges} = Calendars.get(0).toJS();
    if( CalendarType === CALENDAR_TYPE_WORKTIME || CalendarType === CALENDAR_TYPE_NO_WORKTIME 
      && CalendarTimeRanges && CalendarTimeRanges.length > 0 ) {

      newConfig.series.unshift({
          lockLegend: true,
          enableDelete: false,
          name: CalendarType === CALENDAR_TYPE_WORKTIME ? I18N.Setting.Diagnose.Runtime : I18N.Setting.Diagnose.Resttime,
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
  newConfig.legendSwitchList = ['line', 'column'];
  newConfig.chart.backgroundColor = '#ffffff';

  if( triggerVal ) {    
    let oldTooltipFormatter = newConfig.tooltip.formatter;
    newConfig.tooltip.formatter = function() {
      let uomId = data.getIn(['EnergyViewData', 'TargetEnergyData', 0, 'Target', 'UomId']);
      return oldTooltipFormatter.call(this) + 
      `<span style="color:${ALARM_COLOR}">${I18N.Setting.Diagnose.TriggerValue}: 
        <b>${numeral(triggerVal).format('0,0.' + 
          ((triggerVal + '').indexOf('.') === -1 ? '' :
          new Array((triggerVal + '').substr((triggerVal + '').indexOf('.')).length - 1).fill(0).join(''))
        ) + getUomById(uomId).Code}</b>
      </span><br/>`;
    }
  }
}

export default function DiagnoseChart(props) {
	let {data,afterChartCreated, onDeleteButtonClick, isEdit, isTypeC} = props,

	chartProps = {
		chartType: CHART_TYPE,
		tagData: data.get('EnergyViewData'),
		postNewConfig: curry(postNewConfig)(data, isEdit, isTypeC),
		afterChartCreated,
    onDeleteButtonClick,
    isEdit,
	};
  // 由于API返回的数据为请求时间的后一个步长，所以为了数据点可以正常显示，加入如下逻辑
  // Law 2017/04/20
  let target = data.getIn(['EnergyViewData', 'TargetEnergyData', 0, 'Target'])
  if( target && target.get('TimeSpan') && target.get('TimeSpan').size > 0 ) {
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