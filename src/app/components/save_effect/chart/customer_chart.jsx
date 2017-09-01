import React, { Component } from 'react';
import moment from 'moment';
import find from 'lodash-es/find';

import util from 'util/Util.jsx';

import BasicStack from './basic_stack.jsx';
import BasicStackColumn from './basic_stack_column.jsx';
import ListStore from 'stores/save_effect/ListStore.jsx';

const CommodityMap = {
	ElectricOther: 1,
	Water: 2,
	Gas: 3,
	CoolQ: 9,
	HeatQ: 8,
	LiquidGas: 14,
	CoalOther: 10,
	DieselOil: 7,
	HeavyOil: 15,
	Kerosene: 11,
};

function getSystemNameById(sysId) {
	let name = '';
	Object.keys( ListStore.getAllEnergySystem() ).map( key => {
		if( ListStore.getAllEnergySystem()[key].value === sysId ) {
			name = ListStore.getAllEnergySystem()[key].label
		}
	} );
	return name;
}

// function getColorByCommodityId(commodityId) {
// 	switch(commodityId) {
// 		case CommodityMap.ElectricOther:
// 			return {
// 				color: ['#1B5E20', '#2E7D32', '#388E3C', '#43A047', '#4CAF50', '#66BB6A', '#81C784', '#C8E6C9'],
// 			};
// 			break;
// 		case CommodityMap.Water:
// 			return {
// 				color: ['#0D47A1', '#1976D2', '#2196F3', '#64B5F6'],
// 			};
// 			break;
// 		case CommodityMap.Gas:
// 			return {
// 				color: ['#283BBA', '#4255D4', '#6C7FFE', '#B4BEFF'],
// 			};
// 			break;
// 		case CommodityMap.CoolQ:
// 			return {
// 				color: ['#5599ec', '#86bafd'],
// 			};
// 			break;
// 		case CommodityMap.HeatQ:
// 			return {
// 				color: ['#f68024', '#ffb300', '#ffd54f'],
// 			};
// 			break;
// 		case CommodityMap.LiquidGas:
// 			return {
// 				color: ['#4dd5ff', '#82e2ff'],
// 			};
// 			break;
// 		case CommodityMap.CoalOther:
// 			return {
// 				color: ['#445773', '#7a91b5'],
// 			};
// 			break;
// 		case CommodityMap.DieselOil:
// 			return {
// 				color: ['#8e24aa', '#ab47bc'],
// 			};
// 			break;
// 		case CommodityMap.HeavyOil:
// 			return {
// 				color: ['#00695c', '#009688'],
// 			};
// 			break;
// 		case CommodityMap.Kerosene:
// 			return {
// 				color: ['#4e342e', '#795548'],
// 			};
// 			break;
// 		default:
// 			return {
// 				color: ['#38503a', '#59715b'],
// 			};
// 			break;
// 	}
// }

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
			return UTC2Local(item.Time).format('YYYY/MM')
		}
		return UTC2Local(item.Time).format('MM');
	} );
}

function getSeries(data, isStack, isWater, color, currentYear) {
	let base = 0;
	let predBase = 0;
	let series = [];
	if( currentYear ) {
		series.push({
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
			name: isWater ? I18N.SaveEffect.Chart.PredictSavingWater : I18N.SaveEffect.Chart.PredictSaving,
			data: data.PredictionSavingValues.map( item => {
				let result = predBase + item.Value;
				if(isStack) {
					predBase = result;
				}
				return {
					y: item.Value !== null ? result : null,
					tooltipName: isWater ? I18N.SaveEffect.Chart.PredictSavingWater : I18N.SaveEffect.Chart.PredictSaving,
					tooltipTitle: UTC2Local(item.Time).format('YYYY/MM'),
				};
			}),
		});
	}
	series.push({
        color: color,
		name: isWater ? I18N.SaveEffect.Chart.ActualSavingWater : I18N.SaveEffect.Chart.ActualSaving,
		data: data.ActualSavingValues.map( item => {
			let result = base + item.Value;
			if(isStack) {
				base = result;
			}
			return {
				y: item.Value !== null ? result : null,
				tooltipName: isWater ? I18N.SaveEffect.Chart.ActualSavingWater : I18N.SaveEffect.Chart.ActualSaving,
				tooltipTitle: UTC2Local(item.Time).format('YYYY/MM'),
			};
		}),
	});

	return series;
}

export default function CustomerChart(props) {
	let childProps = {
		// colors: getColorByCommodityId(props.data.CommodityId).color,
		unit: util.getUomById(props.data.UomId).Code,
		categories: getCategories(props.data),
		series: getSeries(props.data, props.isStack, props.isWater, props.color, props.currentYear),
		currentYear: props.currentYear,
	};
	if( props.isStack ) {
		return (<BasicStack {...childProps}/>);
	}
	return (<BasicStackColumn {...childProps}/>)
}
