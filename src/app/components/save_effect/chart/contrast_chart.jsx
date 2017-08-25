import React, { Component } from 'react';
import moment from 'moment';
import CircularProgress from 'material-ui/CircularProgress';

import {Monthly} from 'constants/TimeGranularity.jsx';

import BasicColumn from './basic_column.jsx';

function date2UTC(date) {
	return moment(date).startOf('day').utcOffset(0);
}
function UTC2Local(date) {
	return moment(date).add(8, 'hours');
}

function getCategories(data) {
	let existYears = [],
	suffix = data.ContrastStep !== Monthly ? 'DD' + I18N.Map.Date.Day : '';
	return data.BenchmarkValues.map( item => {
		if( existYears.indexOf( UTC2Local(item.Time).get('year') ) === -1 ) {
			existYears.push( UTC2Local(item.Time).get('year') );
			return UTC2Local(item.Time).format('YYYY' + I18N.Map.Date.Year + 'MM' + I18N.Map.Date.Month + suffix);
		}
		return UTC2Local(item.Time).format('MM' + I18N.Map.Date.Month + suffix);
	} );
}

function getSeries(data) {
	let suffix = data.ContrastStep !== Monthly ? 'DD' + I18N.Map.Date.Day : '';
	return [
		{
			name: I18N.Kpi.ActualValues,
			data: data.ActualValues.map( item => {
				return {
					y: item.Value,
					tooltipTitle: UTC2Local(item.Time).format('YYYY' + I18N.Map.Date.Year + 'MM' + I18N.Map.Date.Month + suffix)
				}
			} )
		},
		{
			name: I18N.SaveEffect.Chart.Benchmark,
			data: data.BenchmarkValues.map( item => {
				return {
					y: item.Value,
					tooltipTitle: UTC2Local(item.Time).format('YYYY' + I18N.Map.Date.Year + 'MM' + I18N.Map.Date.Month + suffix)
				}
			} )
		},
	];
}

export default function SavingChart(props) {
	if( !props.data ) {
		return (<div className='flex-center' style={{height: 305}}><CircularProgress mode="indeterminate" size={80} /></div>);
	}
	return (
		<BasicColumn unit={props.unit}
			categories={getCategories(props.data)}
			series={getSeries(props.data)}
		/>
	);
}
