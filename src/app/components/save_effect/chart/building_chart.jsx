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

function getColorByCommodityId(commodityId) {
	switch(commodityId) {
		case CommodityMap.ElectricOther:
			return {
				color: ['#4CAF50', '#388E3C', '#81C784', '#1B5E20', '#C8E6C9', '#2E7D32', '#66BB6A', '#43A047'],
			};
			break;
		case CommodityMap.Water:
			return {
				color: ['#2196F3', '#1976D2', '#64B5F6', '#0D47A1'],
			};
			break;
		case CommodityMap.Gas:
			return {
				color: ['#6C7FFE', '#4255D4', '#B4BEFF', '#283BBA'],
			};
			break;
		case CommodityMap.CoolQ:
			return {
				color: ['#86bafd', '#5599ec'],
			};
			break;
		case CommodityMap.HeatQ:
			return {
				color: ['#ffb300', '#f68025', '#ffd54f'],
			};
			break;
		case CommodityMap.LiquidGas:
			return {
				color: ['#82e2ff', '#4dd5ff'],
			};
			break;
		case CommodityMap.CoalOther:
			return {
				color: ['#7a91b5', '#445773'],
			};
			break;
		case CommodityMap.DieselOil:
			return {
				color: ['#ab47bc', '#8e24aa'],
			};
			break;
		case CommodityMap.HeavyOil:
			return {
				color: ['#009688', '#00695c'],
			};
			break;
		case CommodityMap.Kerosene:
			return {
				color: ['#795548', '#4e342e'],
			};
			break;
		default:
			return {
				color: ['#59715b', '#38503a'],
			};
			break;
	}
}

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

function getSeries(data, isStack, isWater, currentYear) {
	let predBase = 0;
	let series = [];
	if(currentYear) {
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
	return series.concat(data.EnergySystemSavings.map( (sys, i) => {
		let base = 0;
		return {
			name: getSystemNameById(sys.EnergySystem),
			data: sys.EnergySavingValues.map( item => {
				let result = base + item.Value;
				if(isStack) {
					base = result;
				}
				return {
					y: item.Value !== null ? result : null,
					tooltipName: getSystemNameById(sys.EnergySystem) + (isWater ? I18N.SaveEffect.EnergySavingWater : I18N.SaveEffect.EnergySaving),
					tooltipTitle: UTC2Local(item.Time).format('YYYY/MM'),
				};
			}),
		}
	}));
}

export default function BuildChart(props) {
	let childProps = {
		colors: getColorByCommodityId(props.data.CommodityId).color,
		unit: util.getUomById(props.data.UomId).Code,
		categories: getCategories(props.data),
		series: getSeries(props.data, props.isStack, props.isWater, props.currentYear),
		currentYear: props.currentYear,
	};
	if( props.isStack ) {
		return (<BasicStack {...childProps}/>);
	}
	return (<BasicStackColumn {...childProps}/>)
}
