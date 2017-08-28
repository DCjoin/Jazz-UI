import React, { Component } from 'react';

import util from 'util/Util.jsx';

import Highcharts from 'components/highcharts/Highcharts.jsx';

function getOptions(categories, series, unit){
	return {
	    credits: {
	        enabled: false
	    },
	    chart: {
	      	height: 265,
	      	backgroundColor: '#f7faff',
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
	        shared: true,
	        useHTML: true,
	        formatter: function() {
    	    	let list = '';
    	    	let title = '<br/>';
    	    	let header = this.points[0].point.tooltipTitle;
    	    	this.points.forEach((data, i) => {
    	    		if(data) {
    	    			if(i === 0) {
    			    		list += `
    			    		<tr>
    					    	<td style="color:${data.series.color};padding:0">● ${data.series.name}: </td>
    					    	<td style="padding:0">${util.getLabelData(data.y) + ' ' + unit}</td>
    				    	</tr>
    			    		`;
    	    			} else {
    			    		list += `
    			    		<tr>
    					    	<td style="color:${data.series.color};padding:0">■ ${data.series.name}: </td>
    					    	<td style="padding:0">${util.getLabelData(data.y) + ' ' + unit}</td>
    				    	</tr>
    			    		`;
    	    			}
    	    		}
    	    	});
    	    	return `
    	    	<table>
    	    		<b>${header}</b>
    	    		${title}
    	    		${list}
    	    	</table>
    	    	`;
    	    }
	    },
	    series: [ {
		        type: 'column',
		        color: '#4caf50',
		        name: series[0].name,
		        data: series[0].data
		    }, {
		        type: 'line',
		        marker: {
			        lineWidth: 1,
			        lineColor: '#ff5722',
			        fillColor: 'white',
			        radius: 2,
			    },
		        zIndex: 2,
		        color: '#ff5722',
		        lineWidth: 1,
		        name: series[1].name,
		        data: series[1].data,
		    },
		],
	};
}

export default class BasicColumn extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	}
	render () {
		let {series, categories, unit} = this.props;
	    return (<Highcharts options={getOptions(categories, series, unit)} className='save_effect_chart'/>);
	}
}