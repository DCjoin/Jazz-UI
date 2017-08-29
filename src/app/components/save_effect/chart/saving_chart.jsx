import React, { Component } from 'react';
import moment from 'moment';
import CircularProgress from 'material-ui/CircularProgress';

import BasicColumn from './basic_column.jsx';

function date2UTC(date) {
	return moment(date).startOf('day').utcOffset(0);
}
function UTC2Local(date) {
	return moment(date).add(8, 'hours');
}

function getCategories(data) {
	let existYears = [];
	if( !data || !data.PredictionSavingValues ) {
		return existYears;
	}
	return data.PredictionSavingValues.map( item => {
		if( existYears.indexOf( UTC2Local(item.Time).get('year') ) === -1 ) {
			existYears.push( UTC2Local(item.Time).get('year') );
			return UTC2Local(item.Time).format('YYYY' + I18N.Map.Date.Year + 'MM' + I18N.Map.Date.Month)
		}
		return UTC2Local(item.Time).format('MM' + I18N.Map.Date.Month);
	} );
}

function getSeries(data) {
	return [
		{
			name: I18N.SaveEffect.Chart.ActualSaving,
			data: data.ActualSavingValues.map( item => {
				return {
					y: item.Value,
					tooltipTitle: UTC2Local(item.Time).format('YYYY' + I18N.Map.Date.Year + 'MM' + I18N.Map.Date.Month)
				}
			} )
		},
		{
			name: I18N.SaveEffect.Chart.PredictSaving,
			data: data.PredictionSavingValues.map( item => {
				return {
					y: item.Value,
					tooltipTitle: UTC2Local(item.Time).format('YYYY' + I18N.Map.Date.Year + 'MM' + I18N.Map.Date.Month)
				} 
			})
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
