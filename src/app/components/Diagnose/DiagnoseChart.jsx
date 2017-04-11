import React, { Component } from 'react';
import Immutable from 'immutable';
import {curry, flowRight} from 'lodash/function'

import {isNumber, isEmptyStr} from 'util/Util.jsx';

import ChartBasicComponent from 'components/DataAnalysis/Basic/ChartBasicComponent.jsx'

const ALARM_COLOR = '#ff4b00';
const PLOT_BACKGROUND_COLOR = '#ecfaf8';
const CHART_TYPE = 'line';
const TRIGGER_DATA_QUALITY = 10;
const CALENDAR_TYPE_WORKTIME = 2;
const CALENDAR_TYPE_NO_WORKTIME = 3;

function mapSeriesDataWithMax(isTriggerVal, serie, serieIdx, series) {
  return {...serie, ...{
    enableHide: false,
    enableDelete: series.length > 1,
    data: serie.data.map(
      (data, dataIdx) => {
        if( isTriggerVal(serieIdx, dataIdx) ) {
          return {
            x: data[0],
            y: data[1],
            color: ALARM_COLOR,
            marker: {
              states: {
                hover: {
                  fillColor: ALARM_COLOR,
                }
              }
            }
          }          
        }
        return data;
      })
  }}
}

function postNewConfig(data, newConfig) {
  let triggerVal = data.get('TriggerValue'),
  Calendars = data.getIn(['EnergyViewData', 'Calendars']);
  newConfig.series = newConfig.series.map(
    curry(mapSeriesDataWithMax)((serieIdx, dataIdx) => data.getIn([
      'EnergyViewData', 
      'TargetEnergyData', 
      serieIdx,
      'EnergyData',
      dataIdx, 
      'DataQuality']) === TRIGGER_DATA_QUALITY)
  );
  isNumber(triggerVal) && newConfig.series.push({
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
      newConfig.xAxis.plotBands = CalendarTimeRanges.map(({StartTime, EndTime}) => {
        return {
          color: PLOT_BACKGROUND_COLOR,
          from: new Date(StartTime).valueOf(),
          to: new Date(EndTime).valueOf()        
        }
      });

    }
  }
}

export default function DiagnoseChart(props) {
	let {data,afterChartCreated, onDeleteButtonClick} = props,

	chartProps = {
		chartType: CHART_TYPE,
		tagData: data.get('EnergyViewData'),
		postNewConfig: curry(postNewConfig)(data),
		afterChartCreated,
    onDeleteButtonClick,
	};

	return (
		<ChartBasicComponent {...chartProps}/>
	);
}
