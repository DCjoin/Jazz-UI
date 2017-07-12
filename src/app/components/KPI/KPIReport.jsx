import React, { Component } from 'react';
import classnames from 'classnames';
import {find} from 'lodash-es';
import { FontIcon } from 'material-ui';

import PermissionCode from 'constants/PermissionCode.jsx';

import LinkButton from 'controls/LinkButton.jsx';

import util from 'util/Util.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import RoutePath from 'util/RoutePath.jsx';

import UOMStore from 'stores/UOMStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';

import KPIChart from './KPIChart.jsx';

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
function isFull() {
	return privilegeUtil.isFull(PermissionCode.INDEX_AND_REPORT, CurrentUserStore.getCurrentPrivilege());
}

function getValueWithUnit(value, unit) {
	if( !util.isNumber(value) ) {
		return '';
	}
	return util.getLabelData(value) + getUnit(unit);
}

export default class KPIReport extends Component {
	static contextTypes = {
		router: React.PropTypes.object
	};
	/*指标值*/
	getValueSummaryItem() {
		let {data, summaryData} = this.props;
		let isIndex = data.get('type') === 1;
		return (
		<div className='summary-item'>
			<div className='summary-title'>{isIndex ? I18N.Kpi.IndexValue : I18N.Kpi.SavingValue}</div>
			{isIndex ?/*定额指标值*/
			(<div className='summary-value'>
				{summaryData.IndexValue !== null && <span>{util.getLabelData(summaryData.IndexValue)}</span>}
				{summaryData.IndexValue !== null && <span>{getUnit(data.get('unit'))}</span>}
			</div>) : /*节能率指标值*/
			(<div className='summary-value'>
				{summaryData.RatioValue !== null && <span>{(summaryData.RatioValue || 0).toFixed(1) * 1 + '%'}</span>}
			</div>)}
		</div>
		);
	}
	/*预测值*/
	getPredictSummaryItem() {
		let {data, summaryData, currentYearDone} = this.props;
		let isIndex = data.get('type') === 1;
		let overproof = util.isNumber(summaryData.PredictSum) && util.isNumber(summaryData.IndexValue) && summaryData.IndexValue < summaryData.PredictSum ;
		return (
		<div className={classnames('summary-item', {overproof: overproof})}>
			<div className='summary-title'>{
				isIndex ? 
					(currentYearDone ? I18N.Kpi.ActualSum : I18N.Kpi.PredictSum) :
					(currentYearDone ? I18N.Kpi.ActualSaving : I18N.Kpi.PredictSaving)}</div>
			{isIndex ?/*定额预测值*/
			(<div className='summary-value'>
				<span>{util.getLabelData(summaryData.PredictSum)}</span>
				<span>{summaryData.PredictSum !== null && getUnit(data.get('unit'))}</span>
				{this._renderTooltip(overproof, isIndex)}
			</div>) :/*节能率预测值*/
			(<div className='summary-value'>
				<span>{(typeof summaryData.PredictRatio !== 'number' ? 0 : summaryData.PredictRatio).toFixed(1) * 1 + '%'}</span>
				{this._renderTooltip(overproof, isIndex)}
			</div>)}
		</div>
		);
	}
	_renderTooltip(overproof, isIndex) {
		let iconProps = {
			style: {
				fontSize: 24,
				color: overproof ? '#FF0000' : '#25C61D'
			},
			className: 'kpi-report-tooltip-icon ' + (overproof ? 'icon-unhappy' : 'icon-happy')
		}
		return (
			<FontIcon {...iconProps} >
				{isIndex ? this._renderIndexTooltip(overproof) : this._renderSavingTooltip(overproof) }
			</FontIcon>
		);
	}
	_renderIndexTooltip(overproof) {
		let {summaryData} = this.props;
		return (<div className='kpi-report-tooltip'>
			<div className='kpi-report-tooltip-title'>{'年度预测指标使用量'}</div>
			<div style={{fontSize: '18px', color: overproof ? '#dc0a0a' : '#0f0f0f'}}>{(!summaryData.PredictRatio ? 0 : summaryData.PredictRatio).toFixed(1) * 1 + '%'}</div>
		</div>);
	}
	_renderSavingTooltip(overproof) {
		let {data, summaryData, currentYearDone} = this.props,
		{IndexValue, PredictSum} = summaryData,
		actualSum = data.get('actual').toJS().reduce((prev, curr) => prev + +curr, 0),
		unit = data.get('unit'),
		indicatorClass = data.get('IndicatorClass');
		return (
			<div className='kpi-report-tooltip'>
				<div style={{paddingBottom: 5, borderBottom: '1px solid #cbcbcb'}}>
					<div className='kpi-report-tooltip-title'>{'年度节能量'}</div>
					<div style={{fontSize: '18px', color: overproof ? '#dc0a0a' : '#0f0f0f'}}>{getValueWithUnit(IndexValue - actualSum, unit)}</div>
				</div>
				<div style={{marginTop: 10}}>
					<div className='kpi-report-tooltip-title'>{'年度目标用量'}</div>
					<div>{getValueWithUnit(IndexValue, unit)}</div>
				</div>
				{indicatorClass === IndicatorClass.Dosage && <div style={{marginTop: 10}}>
					<div className='kpi-report-tooltip-title'>{'年度预测用量'}</div>
					<div>{getValueWithUnit(PredictSum, unit)}</div>
				</div>}
			</div>
		);
	}
	_renderTip() {
		let hasPermission = false && !this.props.isGroup && 
							(
								privilegeUtil.canView(PermissionCode.PUSH_SOLUTION, CurrentUserStore.getCurrentPrivilege())
							|| privilegeUtil.isFull(PermissionCode.SENIOR_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege())
							);
		return <div className={classnames('summary-item-tip', {
			hoverable: hasPermission
		})} onClick={() => {
			if( hasPermission ) {
				util.openTab(RoutePath.ecm(this.context.router.params)+'?init_hierarchy_id='+this.props.buildingId);
			}
		}}>
			<FontIcon style={{fontSize: '18px', color: '#ff0f0f', marginRight: 15}} className='icon-alarm-notification'/>
			<div>
				<div>{'预测全年用量将超标'}</div>
				<div>{'请及时采取节能措施'}</div>
			</div>
			{hasPermission && <FontIcon style={{fontSize: '14px'}} className='icon-arrow-right'/>}
		</div>
	}
	render() {
		let {data, summaryData, period, onEdit, onRefresh, isGroup, currentYearDone} = this.props;
		let overproof = util.isNumber(summaryData.PredictSum) && util.isNumber(summaryData.IndexValue) && summaryData.IndexValue < summaryData.PredictSum ;
		return (
			<div className='jazz-kpi-report-wrapper'>
				<div style={{
					position: 'absolute',
    				right: 20,
    				top: 10,
				}}>
				    {isFull() && !isGroup &&
				    	<LinkButton iconName="icon-edit" onClick={() => {
					      	onRefresh(data.get('id'));
					      }} label={I18N.Common.Button.Edit}/>}
				</div>
				<div className='jazz-kpi-report-header'>{data.get('name')}</div>
				<div className='jazz-kpi-report'>
					<div className='jazz-kpi-report-chart'>
						<KPIChart  LastMonthRatio={summaryData && summaryData.LastMonthRatio} period={period} data={data}/>
					</div>
					<div className='jazz-kpi-report-summary'>
						{this.getValueSummaryItem()}
						{this.getPredictSummaryItem()}
						{!!overproof && !currentYearDone && this._renderTip()}
					</div>
				</div>
			</div>
		);
	}
}