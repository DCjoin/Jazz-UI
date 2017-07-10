import React, { Component } from 'react';
import {find} from 'lodash-es';
import {last, findLastIndex, fill} from 'lodash-es';

import util from 'util/Util.jsx';

import UOMStore from 'stores/UOMStore.jsx';

import Highcharts from '../highcharts/Highcharts.jsx';

const IndicatorClass = {
	Dosage: 1,
	Ratio: 2,
}

function getUnit(id) {
	let code = find(UOMStore.getUoms(), uom => uom.Id === id).Code;
	if( code === 'null' ) {
		return '';
	}
	return code;
}

function changeLegendStyle(item) {
	item.setAttribute('width', 16);
	item.setAttribute('height', 12);
	item.setAttribute('y', 5);
	item.setAttribute('stroke', '#0cad04');
	item.setAttribute('stroke-width', 1);
	item.setAttribute('stroke-dasharray', '4,3');
}

const DEFAULT_OPTIONS = {
    credits: {
        enabled: false
    },
    chart: {
    	spacingBottom: 0,
      	events: {
          	load: function () {
              	let lastLegendItems = document.querySelectorAll('.highcharts-legend .highcharts-legend-item:nth-of-type(3) rect');
              	if(lastLegendItems ) {
              		for(let i = 0; i < lastLegendItems.length; i++) {
              			let item = lastLegendItems[i];
              			changeLegendStyle(item);
              		}
              	}
          	}
      	},
      	height: 220,
      	backgroundColor: '#ffffff',
    },
    title: null,
    legend: {
        align: 'top',
        verticalAlign: 'top',
        layout: 'horizontal',
        y: -15,
        x: 200,
    },
    xAxis: {
    	tickLength: 0,
    	lineColor: '#9fa0a4',
    },
    yAxis: {
    	lineColor: '#9fa0a4',
    	lineWidth: 1,
    	labels: {
	    	formatter: function() {
	    		return util.getLabelData(this.value)
	    	},
    	},
    	type: 'column',
        min: 0,
        gridLineWidth: 0,
        title: {
            align: 'high',
            rotation: 0,
            offset: 0,
            y: -20,
            x: -10,
        }
    },
    tooltip: {
        crosshairs: {
            width: 1.5,
            color: 'black',
        	zIndex: 3
        },
	    borderWidth: 0,
	    backgroundColor: "rgba(255,255,255,0)",
	    borderRadius: 0,
        shared: true,
        useHTML: true,
        shadow: false,
    },
    plotOptions: {
        column: {
            grouping: false,
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [ {
        type: 'line',
        marker: {
	        lineWidth: 1,
	        lineColor: '#0cad04',//window.Highcharts.getOptions().colors[0],
	        fillColor: 'white',
	        radius: 2,
	    },
        zIndex: 2,
        color: '#0cad04',
        lineWidth: 1,
    },{
        type: 'column',
        pointPadding: 0.4,
        pointPlacement: 0,
        color: '#0cad04',
        pointWidth: 30,
        borderWidth: 1,
    }, {
        type: 'column',
        pointPadding: 0.2,
        pointPlacement: 0,
		borderColor: '#0cad04',
        borderWidth: 1,
		dashStyle: 'dash',
		color: 'rgba(255, 255, 255, 0)',
        pointWidth: 34,

    },]
};

export default class KPIChart extends Component {
	_generatorOptions() {
		let {data, period, LastMonthRatio} = this.props;
		let currentMonthIndex = findLastIndex(period,  date => date.isBefore(new Date()) );
		if(last(period).clone().add(1, 'months').isBefore(new Date())) {
			currentMonthIndex = 12;
		}

		let ratioMonth = data.get('ratioMonth');

		let options = util.merge(true, {}, DEFAULT_OPTIONS, {
		});

		let unit = getUnit(data.get('unit'));
		options.xAxis.categories = util.getDateLabelsFromMomentToKPI(period);
		options.yAxis.title.text = unit;
	    options.tooltip.formatter = function() {
	    	var data1 = this.points[0];
	    	var data2 = this.points[1];
	    	var data3 = this.points[2];
	    	let list = '';
	    	let title = '<br/>';
	    	let targetVal = 0;
	    	let actualVal = 0;
	    	let predictionVal = 0;
    		let currentDataIndex = data1.point.index;
	    	let header = util.replacePathParams(I18N.Kpi.YearMonth, period[currentDataIndex].year(), period[currentDataIndex].month() + 1);
	    	this.points.forEach(data => {
	    		if(data) {
	    			if(data.series.name === I18N.Kpi.TargetValues) {
	    				targetVal = data.y;
			    		list += `
			    		<tr>
					    	<td style="color:${data.series.color};padding:0">● ${data.series.name}: </td>
					    	<td style="padding:0">${util.getLabelData(data.y) + ' ' + unit}</td>
				    	</tr>
			    		`;
	    			}
	    			if(data.series.name === I18N.Kpi.ActualValues) {
	    				actualVal = data.y;
			    		list += `
			    		<tr>
					    	<td style="color:${data.series.color};padding:0">■ ${data.series.name}: </td>
					    	<td style="padding:0">${util.getLabelData(data.y) + ' ' + unit}</td>
				    	</tr>
			    		`;
	    			}
	    			if(data.series.name === I18N.Kpi.PredictionValues) {
	    				predictionVal = data.y;
			    		list += `
			    		<tr>
					    	<td style="color:#434348;padding:0"><div style='    margin-right: 4px;border-color:#434348;border-width:1px;border-style:dotted;display:inline-block;width:6px;height:6px'></div>${data.series.name}: </td>
					    	<td style="padding:0">${util.getLabelData(data.y) + ' ' + unit}</td>
				    	</tr>
			    		`;
	    			}
	    		}
	    	});
	    	if( targetVal ) {
	    		if(currentDataIndex <= currentMonthIndex || currentMonthIndex === -1) {
	    			title += `<b>${util.replacePathParams(I18N.Kpi.MonthUsaged, (actualVal * 100 / targetVal).toFixed(1) * 1)}</b>`;
	    		} else {
	    			title += `<b>${util.replacePathParams(I18N.Kpi.MonthUsagedPrediction, (predictionVal * 100 / targetVal).toFixed(1) * 1)}</b>`;
	    		}
	    	}
	    	// } else if(data.get('type') === 2 && ratioMonth) {
	    	// 	let value = ratioMonth.get(currentDataIndex) !== null ? ratioMonth.get(currentDataIndex).toFixed(1) * 1 : 0;
	    	// 	if(currentDataIndex <= currentMonthIndex || currentMonthIndex === -1) {
	    	// 		title += `<b>${util.replacePathParams(I18N.Kpi.RatioMonthUsaged, value)}</b>`;
	    	// 	} else {
	    	// 		title += `<b>${util.replacePathParams(I18N.Kpi.RatioMonthUsagedPrediction, value)}</b>`;
	    	// 	}
	    	// }
	    	return `
	    	<table>
	    		<b>${header}</b>
	    		${title}
	    		${list}
	    	</table>
	    	`;
	    };

		// options.title.text = data.get('name');

		options.series[0].data = data.get('target') && data.get('target').toJS().slice(0, 12);
		options.series[0].name = I18N.Kpi.TargetValues;
		options.series[1].data = data.get('actual') && data.get('actual').toJS().slice(0, 12).map((data, i) => {
			// if(i === 5) {
			// 	return {
			// 		x: i,
			// 		y: data,
			// 		color: "#FF00FF",
			// 	};
			// }
			return {
				x: i,
				y: data,
			};
		});
		options.series[1].name = I18N.Kpi.ActualValues;
		if(data.get('IndicatorClass') === IndicatorClass.Dosage) {
			options.series[2].data = data.get('prediction') && fill(data.get('prediction').toJS(), null, 0, currentMonthIndex === -1 ? 0 : currentMonthIndex).slice(0, 12).map((data, i) => {
				// if(i === 10) {
				// 	return {
				// 		x: i,
				// 		y: data,
				// 		borderColor: "#FF00FF",
				// 	};
				// }
				return {
					x: i,
					y: data,
				};
			});
			options.series[2].name = I18N.Kpi.PredictionValues;
		}

		return options;
	}
	shouldComponentUpdate(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	}
    render () {
        return (
            <Highcharts
                ref="highcharts"
                options={this._generatorOptions()}/>
        );
    }
}