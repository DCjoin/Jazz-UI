import React, { Component } from 'react';

import util from 'util/Util.jsx';

import Highcharts from 'components/highcharts/Highcharts.jsx';


function getOptions(categories, series, unit, colors, currentYear){
	return {
		colors: colors,
	    credits: {
	        enabled: false
	    },
	    chart: {
	      	height: 265,
	      	backgroundColor: '#f7faff',
	        type: 'area',
	    },
	    title: null,
	    xAxis: {
	    	tickLength: 0,
	        categories: categories,
	    },
	    yAxis: {
	    	labels: {
		    	formatter: function() {
		    		return util.getLabelData(this.value)
		    	},
	    	},
	        min: 0,
	        gridLineWidth: 1,
	        gridLineDashStyle: 'longdash',
	        title: {
	            align: 'high',
	            rotation: 0,
	            offset: 0,
	            y: -20,
	            x: -10,
	            text: unit,
	        }
	    },
	    legend: {
	        align: 'top',
	        verticalAlign: 'top',
	        layout: 'horizontal',
	        y: -15,
	        x: 200,
	    },
	    tooltip: {
	        crosshairs: {
	            width: 1,
	            color: '#505559',
	        	zIndex: 3
	        },
		    borderWidth: 1,
		    backgroundColor: "rgba(255,255,255,1)",
		    borderColor: '#e6e6e6',
		    borderRadius: 1,
	        useHTML: true,
	        formatter: function() {
    	    	let header = '';
    	    	let list = '';
	    		let i = this.series.index,
	    		data = this;
	    		if(data) {
	    			if(currentYear && i === 0) {
	    				header = data.point.tooltipTitle;
			    		list += `
			    		<tr>
					    	<td style="color:${data.series.color};padding:0">● ${data.point.tooltipName}: </td>
					    	<td style="padding:0">${util.getLabelData(data.y) + ' ' + unit}</td>
				    	</tr>
			    		`;
	    			} else {
			    		list += `
			    		<tr>
					    	<td style="color:${data.series.color};padding:0">■ ${data.point.tooltipName}: </td>
					    	<td style="padding:0">${util.getLabelData(data.y) + ' ' + unit}</td>
				    	</tr>
			    		`;
	    			}
	    		}
    	    	return `
    	    	<table>
    	    		<b>${header}</b>
    	    		${list}
    	    	</table>
    	    	`;
    	    }
	    },
	    plotOptions: {
	        area: {
	            stacking: 'normal',
	            lineColor: '#666666',
	            lineWidth: 1,
	            marker: {
	                enabled: false
	            },
	        }
	    },
	    series: series
	};
}

export default class BasicStack extends Component {
	render () {
		let {series, categories, unit, colors, currentYear} = this.props;
	    return (<Highcharts options={getOptions(categories, series, unit, colors, currentYear)} className='save_effect_chart'/>);
	}
}