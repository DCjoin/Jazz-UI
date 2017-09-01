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
				color: [{
					value: '#1B5E20',
					pri: 4,
				}, {
					value: '#2E7D32',
					pri: 6,
				}, {
					value: '#388E3C',
					pri: 2,
				}, {
					value: '#43A047',
					pri: 8,
				}, {
					value: '#4CAF50',
					pri: 1,
				}, {
					value: '#66BB6A',
					pri: 7,
				}, {
					value: '#81C784',
					pri: 3,
				}, {
					value: '#C8E6C9',
					pri: 5,
				}],
			};
			break;
		case CommodityMap.Water:
			return {
				color: [{
					value: '#0D47A1',
					pri: 4,
				}, {
					value: '#1976D2',
					pri: 2,
				}, {
					value: '#2196F3',
					pri: 1,
				}, {
					value: '#64B5F6',
					pri: 3,
				}],
			};
			break;
		case CommodityMap.Gas:
			return {
				color: [{
					value: '#283BBA',
					pri: 4,
				}, {
					value: '#4255D4',
					pri: 2,
				}, {
					value: '#6C7FFE',
					pri: 1,
				}, {
					value: '#B4BEFF',
					pri: 3,
				}],
			};
			break;
		case CommodityMap.CoolQ:
			return {
				color: [{
					value: '#5599ec',
					pri: 2,
				}, {
					value: '#86bafd',
					pri: 1,
				}],
			};
			break;
		case CommodityMap.HeatQ:
			return {
				color: [{
					value: '#f68024',
					pri: 2,
				}, {
					value: '#ffb300',
					pri: 1,
				}, {
					value: '#ffd54f',
					pri: 3,
				}],
			};
			break;
		case CommodityMap.LiquidGas:
			return {
				color: [{
					value: '#4dd5ff',
					pri: 2,
				}, {
					value: '#82e2ff',
					pri: 1,
				}],
			};
			break;
		case CommodityMap.CoalOther:
			return {
				color: [{
					value: '#445773',
					pri: 2,
				}, {
					value: '#7a91b5',
					pri: 1,
				}],
			};
			break;
		case CommodityMap.DieselOil:
			return {
				color: [{
					value: '#8e24aa',
					pri: 2,
				}, {
					value: '#ab47bc',
					pri: 1,
				}],
			};
			break;
		case CommodityMap.HeavyOil:
			return {
				color: [{
					value: '#00695c',
					pri: 2,
				}, {
					value: '#009688',
					pri: 1,
				}],
			};
			break;
		case CommodityMap.Kerosene:
			return {
				color: [{
					value: '#4e342e',
					pri: 2,
				}, {
					value: '#795548',
					pri: 1,
				}],
			};
			break;
		default:
			return {
				color: [{
					value: '#38503a',
					pri: 2,
				}, {
					value: '#59715b',
					pri: 1,
				}],
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
		colors: getColorByCommodityId(props.data.CommodityId).color.filter(color => color.pri <= props.data.EnergySystemSavings.length).map(color => color.value),
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
