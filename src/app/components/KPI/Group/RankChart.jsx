import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';

import util from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';

import LinkButton from 'controls/LinkButton.jsx';

import Highcharts from '../../highcharts/Highcharts.jsx';
const KPI_RANK_TYPE = 1,
TOP_RANK_TYPE = 2,
DEFAULT_OPTIONS = {
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
    		offset: 0,
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

	if(DIndex > 0) {
		flag = '↑ ' + DIndex;
	}
	if(DIndex < 0) {
		flag = '↓ ' + DIndex * -1;
	}

	return `${Index}/${Count}<span class='rank-flag' style='margin-left: 2px'>${flag}</span>`;
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
			date: new moment().subtract('month', 1),
			baseRankNum: 1,
		}
	}
	_jumpToSingle(index) {
		window.open(
			window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '') + '#' + RoutePath.KPIActuality(this.context.router.params)
		);
	}
	_getDateByIndex() {

	}
	_getDateLabel(momentDate) {
		return util.replacePathParams(I18N.Kpi.YearMonth, momentDate.get('year'), momentDate.get('month') + 1);
	}
	_getTooltip(index) {
		let {date, baseRankNum} = this.state;
		let tooltip = `
		<b>${this._getDateLabel(date)}</b><br/>
		${'建筑XXX'}: ${'75%'}<br/>
		${'排名'}: ${getRank({DIndex: 2, Index: 5, Count:25})}
		`;
		return tooltip;
	}
	_getDataLabel(index) {
		return index + this.state.baseRankNum;
	}
	_getCategories() {
		return [
	        '建筑XXX',
	        '建筑XXX',
	        '建筑XXX',
	        '建筑XXX',
	        '建筑XXX',
	        '建筑XXX',
	        '建筑XXX',
	        '建筑XXX',
	        '建筑XXX',
	        '建筑XXX',
	    ];
	}
	_getSeries() {
		let series = [];
		for(let i = 0; i < 10; i++) {
			// series[i] = (Math.random() * 100).toFixed() * 1;
			if( i < 9 ) {
				series[i] = 50
			} else {
				series[i] = 100
			}
		}
		return [{data: series}];
	}
	_generatorOptions() {
		let {name, type} = this.props,
		{baseRankNum} = this.state,
		{_getTooltip, _getDataLabel, _jumpToSingle} = this,
		options = util.merge(true, {}, DEFAULT_OPTIONS, {
			series: this._getSeries(),
		    xAxis: {
			    categories: this._getCategories(),
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
		if( type === KPI_RANK_TYPE ) {
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
			name, 
			type,
			data,
		} = this.props,
		{
			date,
			baseRankNum,
		} = this.state,
		onLastMonth, onNextMonth, onLastRank, onNextRank;

		if(baseRankNum > 10) {
			onLastRank = () => {
				this.setState({
					baseRankNum: baseRankNum - 10
				});
			};
		}

		if( baseRankNum + 10 < 100 ) {
			onNextRank = () => {
				this.setState({
					baseRankNum: baseRankNum + 10
				});
			};			
		}

        return (
        	<div className='kpi-rank-chart'>
        		<div className='kpi-rank-chart-title'>用水量</div>
        		<SwitchBar 
        			className='switch-month'
        			label={this._getDateLabel(date)}/>
        		<SwitchBar 
        			className='switch-range'
        			label={baseRankNum + '-' + (baseRankNum + 9) + '名'}
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
