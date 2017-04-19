import React, { Component } from 'react';
import Immutable from 'immutable';
import {curry, flowRight} from 'lodash/function'
import moment from 'moment';

import {isNumber, isEmptyStr} from 'util/Util.jsx';

import ChartBasicComponent from 'components/DataAnalysis/Basic/ChartBasicComponent.jsx'

const ALARM_COLOR = '#ff4b00';
const GRAY_COLOR = 'gary';
const PLOT_BACKGROUND_COLOR = '#ecfaf8';
const CHART_TYPE = 'line';
const TRIGGER_DATA_QUALITY = 10;
const IGNORE_DATA_QUALITY = 11;
const CALENDAR_TYPE_WORKTIME = 2;
const CALENDAR_TYPE_NO_WORKTIME = 3;

function mapSeriesDataWithMax(isTriggerVal, isIgnoreVal, isEdit, isHistory, serie, serieIdx, series) {
  return {...serie, ...{
    turboThreshold: null,
    enableHide: false,
    enableDelete: isEdit && series.length > 1,
    color: isHistory(serieIdx) ? ALARM_COLOR : undefined,
    stacking: null,
    data: serie.data.map(
      (data, dataIdx) => {
        let isTrigger = isTriggerVal(serieIdx, dataIdx);
        let isIgnore = isIgnoreVal(serieIdx, dataIdx);
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
    let vals = data
      .getIn(['EnergyViewData', 'TargetEnergyData', 0, 'EnergyData'])
      .map(eData => eData.get('DataValue')).toJS(),
    max = Math.max(...vals),
    min = Math.min(...vals);

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

	return (
		<ChartBasicComponent {...chartProps}/>
	);
}
