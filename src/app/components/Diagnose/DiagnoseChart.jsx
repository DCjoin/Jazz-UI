import React, { Component } from 'react';
import Immutable from 'immutable';
import {curry, flowRight} from 'lodash/function'

import {isNumber, isEmptyStr} from 'util/Util.jsx';

import ChartBasicComponent from 'components/DataAnalysis/Basic/ChartBasicComponent.jsx'

const ALARM_COLOR = 'red';
const CHART_TYPE = 'line';

function mapSeriesDataWithMax(compare, serie) {
  return {...serie, ...{
    data: serie.data.map(
      data => {
        if( compare(data[1])) {
          return {
            x: data[0],
            y: data[1],
            fillColor: ALARM_COLOR,
            color: ALARM_COLOR,
            segmentColor: ALARM_COLOR,
                hover: {
                  marker: {
                    fillColor: ALARM_COLOR
                  }
                },
              states: {
                hover: {
                  marker: {
                    fillColor: ALARM_COLOR
                  }
                }
              },
            marker: {
              color: ALARM_COLOR,
              fillColor: ALARM_COLOR,
              states: {
                hover: {
                  marker: {
                    fillColor: ALARM_COLOR
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

const CALENDER_BGC = new Map([
	[1, '#eaeaea'],
	[3, '#eaeaea'],
	[4, '#fcf0e4'],
	[5, '#e3f0ff']
]);

function getColorByCalenderType(calcType) {
	return CALENDER_BGC.get(calcType);
}

function getCalendarTypeByWidgetStatus(wss) {
	if(wss && wss.length > 0) {
		if (wss[i].WidgetStatusKey === "calendar") {
		  	return wss[i].WidgetStatusValue
		}
	}
	return '';
}

function getCalenderTypeByData(data) {
	let step = data.getIn(['DiagnoseEnergyViewData', 'TargetEnergyData', 0, 'Target', 'Step']), 
	calcType = getCalendarTypeByWidgetStatus(JSON.parse(data.get('WidgetStatus'))),
	range = data.get('DiagnoseEnergyViewData').get('Calendars') ? data.get('DiagnoseEnergyViewData').get('Calendars').toJS(): [],
	checkCalendarTypeFilter = val => 
		range && range.filter(item => item.CalendarType === val).length > 0 
		? 0 
		: val;

	if( calcType === 'hc' ) {
		if( step !== 4 ) {
			return checkCalendarTypeFilter(4) || checkCalendarTypeFilter(5);
		}
	} else if(calcType === 'work') {
		if( step === 0 || step === 1 ) {
			return checkCalendarTypeFilter(3);
		}
		if( step === 2 ) {
			return checkCalendarTypeFilter(1);
		}
	}
	return 0;
}


function postNewConfig(triggerVal, focusBGC, newConfig) {
  newConfig.series = newConfig.series.map(
    curry(mapSeriesDataWithMax)(currentVal => currentVal > triggerVal)
  );
  !isEmptyStr(focusBGC) && newConfig.series.unshift({
      lockLegend: true,
      enableDelete: false,
      name: '非运行时间',
      color: focusBGC, 
      lineWidth: 12,
      marker: {
          symbol: 'null',
      }
  });
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
  }]
}

export default function DiagnoseChart(props) {
	let {data} = props,

	chartProps = {
		chartType: CHART_TYPE,
		tagData: data.get('DiagnoseEnergyViewData'),
		postNewConfig: curry(postNewConfig)(
			data.get('TriggerValue'),
			flowRight( getColorByCalenderType, getCalenderTypeByData )(data), 
		),
	};

	return (
		<ChartBasicComponent {...chartProps}/>
	);
}
