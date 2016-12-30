import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import {slice, fill} from 'lodash/array';
import {isNull, isUndefined} from 'lodash/lang';

import KPIType from 'constants/actionType/KPI.jsx';
import util from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';

import LinkButton from 'controls/LinkButton.jsx';

import Highcharts from '../../highcharts/Highcharts.jsx';

import UOMStore from 'stores/UOMStore.jsx';

function noValue(value) {
	return isUndefined(value) || isNull(value);
}

const DEFAULT_OPTIONS = {
    credits: {
        enabled: false
    },

    chart: {
        type: 'column'
    },
    title: {
    	text: '',
    },
    plotOptions: {
        series: {
            dataLabels: {
            	verticalAlign: 'top',
                inside: true,
                enabled: true
            }
        }
    },

    legend: {
        enabled: false
    },


    yAxis: {
    	type: 'column',
    	title: {
    		y: -20,
    		offset: 15,
    		align: 'high',
    		rotation: 0,
    	}
    },

};

function SwitchBar(props) {
	let {onLeft, onRight, label, className} = props;
	return (
		<div className={classnames('switch-action-bar', {[className]: className})}>
			<LinkButton iconName={ "icon-arrow-left" } disabled={ !onLeft } onClick={onLeft}/>
			<span className='current-label'>{label}</span>
			<LinkButton iconName={ "icon-arrow-right" } disabled={ !onRight } onClick={onRight}/>
		</div>
	);
}

function getRank(props) {
	if(!props) {
		return null;
	}
	let {DIndex, Index, Count} = props,
	flag = '--';

	if(DIndex === 0) {
		flag = '→';
	}
	if(DIndex > 0) {
		flag = '↑ ' + DIndex;
	}
	if(DIndex < 0) {
		flag = '↓ ' + DIndex * -1;
	}

	return `${Index}/${Count}<span class='rank-flag' style='margin-left: 2px'>${flag}</span>`;
}

function fillArrayToTen(arr) {
	while(arr.length < 10) {
		arr.push('');
	}
	return arr;
}

function isScale(UnitType) {
	return UnitType === KPIType.UnitType.MonthRatio || UnitType === KPIType.UnitType.MonthScale;
}

function getUnitLabel({UnitType, UomId}) {
	if( isScale(UnitType) ) {
		return '%';
	}
	return UOMStore.getUomById(UomId);
}

function getValueLabel(value, data) {
	if( noValue(value) ) {
		return '';
	}
	return (isScale(data.UnitType) ? value.toFixed(1)*1 : util.getLabelData(value)) + getUnitLabel(data);
}

export default class RankChart extends Component {
	static contextTypes = {
		router: React.PropTypes.object
	};
	constructor(props) {
		super(props);

		this._getTooltip = this._getTooltip.bind(this);
		this._getDataLabel = this._getDataLabel.bind(this);
		this._jumpToSingle = this._jumpToSingle.bind(this);
		this.state = {
			monthIndex: props.MonthRank.length - 1,
			rankIndex: 0,
		}
	}
	_jumpToSingle(index) {
		let {BuildingId, GroupKpiId, KpiId} = this._getRankByIndex(index);
		window.open(
			window.location.href.split('#')[0] + '#' + RoutePath.KPIActuality(this.context.router.params)
			 + '?buildingId='+BuildingId
			 + '&groupKpiId='+GroupKpiId
			 + '&kpiId='+KpiId
		);
	}
	_getCurrentMonthRank() {
		return this.props.MonthRank[this.state.monthIndex];
	}
	_getCurrentAllBuildingRank() {
		return this._getCurrentMonthRank().BuildingRank;
	}
	_getCurrentRangeBuildingRank() {
		return slice(this._getCurrentAllBuildingRank(), this.state.rankIndex, 10);
	}
	_getRankByIndex(index) {
		return this._getCurrentAllBuildingRank()[this.state.rankIndex + index];
	}
	_getTooltip(index) {
		let {BuildingName, DIndex, Index, Count, RankValue} = this._getRankByIndex(index);
		let tooltip = `
		<b>${this._getDateLabel()}</b><br/>
		${I18N.Setting.KPI.Building + BuildingName}: ${getValueLabel(RankValue, this.props)}<br/>
		${I18N.Setting.KPI.Rank.Name}: ${getRank({DIndex, Index, Count})}
		`;
		return tooltip;
	}
	_getDateLabel() {
		let jsonstring = this._getCurrentMonthRank().Date,
		date = new Date(parseInt(jsonstring.substr(6, jsonstring.length - 8)));
		return util.replacePathParams(I18N.Kpi.YearMonth, date.getFullYear(), date.getMonth() + 1);
	}
	_getRankLabel() {
		let rankIndex = this.state.rankIndex;
		return (rankIndex + 1) + '-' + Math.min(rankIndex + 10, this._getCurrentAllBuildingRank().length) + '名';
	}
	_getDataLabel(index) {
		let rank = this._getRankByIndex(index);
		if( rank ) {
			return rank.Index
		}
		return '';
	}
	_getCategories() {
		return fillArrayToTen(this._getCurrentRangeBuildingRank()
						.map(rank => rank.BuildingName));
	}
	_getSeries() {
		return [{data: fillArrayToTen(this._getCurrentRangeBuildingRank()
						.map(rank => rank.RankValue))}];
	}
	_generatorOptions() {
		let {RankName, RankType} = this.props,
		{rankIndex} = this.state,
		{_getTooltip, _getDataLabel, _jumpToSingle} = this,
		options = util.merge(true, {}, DEFAULT_OPTIONS, {
			series: this._getSeries(),
		    xAxis: {
			    categories: this._getCategories(),
		    },
		    yAxis: {
		    	title:{ 
		    		text: getUnitLabel(this.props),
		    	},
		    },
		    tooltip: {
		    	useHTML: true,
		    	formatter: function() {
		    		return _getTooltip(this.point.index);
		    	}
		    },
		    plotOptions: {
		        series: {
		            dataLabels: {
		            	formatter: function() {
		            		return _getDataLabel(this.point.index);
		            	},
			        }
		        }
		    },
		});
		if( RankType === KPIType.RankType.GroupRank ) {
			options.plotOptions.series.cursor = 'pointer';
			options.plotOptions.series.events = {				
				click: function (event) {
					_jumpToSingle(event.point.index);
				}
			};
		}
		return options;
	}

	render() {
		let {
			RankName, 
			RankType,
			MonthRank,
		} = this.props,
		{
			monthIndex,
			rankIndex,
		} = this.state,
		onLastMonth, onNextMonth, onLastRank, onNextRank;

		if(monthIndex > 0) {
			onLastMonth = () => {
				this.setState({
					monthIndex: --monthIndex,
					rankIndex: 0,
				});
			};
		}
		if(monthIndex + 1 < MonthRank.length) {
			onNextMonth = () => {
				this.setState({
					monthIndex: ++monthIndex,
					rankIndex: 0,
				});
			};
		}
		if(rankIndex > 10) {
			onLastRank = () => {
				this.setState({
					rankIndex: rankIndex - 10
				});
			};
		}

		if( rankIndex + 10 < this._getCurrentAllBuildingRank().length ) {
			onNextRank = () => {
				this.setState({
					rankIndex: rankIndex + 10
				});
			};			
		}

        return (
        	<div className='kpi-rank-chart'>
        		<div className='kpi-rank-chart-title'>{RankName}</div>
        		<SwitchBar 
        			className='switch-month'
        			label={this._getDateLabel()}
        			onLeft={onLastMonth}
        			onRight={onNextMonth}
        		/>
        		<SwitchBar 
        			className='switch-range'
        			label={this._getRankLabel()}
        			onLeft={onLastRank}
        			onRight={onNextRank}
        			/>
	            <Highcharts
	                ref="highcharts"
	                options={this._generatorOptions()}/>
            </div>
        );
	}
}
