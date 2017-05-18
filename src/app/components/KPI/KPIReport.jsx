import React, { Component } from 'react';
import classnames from 'classnames';
import {find} from 'lodash';
import IconButton from 'material-ui/IconButton';

import NewAppTheme from 'decorator/NewAppTheme.jsx';

import PermissionCode from 'constants/PermissionCode.jsx';

import util from 'util/Util.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';

import UOMStore from 'stores/UOMStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';

import KPIChart from './KPIChart.jsx';

function getUnit(id) {
	return find(UOMStore.getUoms(), uom => uom.Id === id).Code;
}
function isFull() {
	return privilegeUtil.isFull(PermissionCode.INDEX_AND_REPORT, CurrentUserStore.getCurrentPrivilege());
}

@NewAppTheme
export default class KPIReport extends Component {
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
				{summaryData.IndexValue !== null && <span>{util.getLabelData(summaryData.IndexValue)}</span>}
				{summaryData.IndexValue !== null && <span title={getUnit(data.get('unit'))}>{getUnit(data.get('unit'))}</span>}
			</div>)}
		</div>
		);
	}
	/*预测值*/
	getPredictSummaryItem() {
		let {data, summaryData, currentYearDone} = this.props;
		let isIndex = data.get('type') === 1;
		let overproof = summaryData.PredictSum && summaryData.IndexValue && summaryData.IndexValue < summaryData.PredictSum ;
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
				<span title={(!summaryData.PredictRatio ? 0 : summaryData.PredictRatio).toFixed(1) * 1 + '%'}>{(!summaryData.PredictRatio ? 0 : summaryData.PredictRatio).toFixed(1) * 1 + '%'}</span>
			</div>) :/*节能率预测值*/
			(<div className='summary-value'>
				<span>{(typeof summaryData.PredictRatio !== 'number' ? 0 : summaryData.PredictRatio).toFixed(1) * 1 + '%'}</span>
				<span>{util.getLabelData(summaryData.PredictSum)}</span>
				{util.isNumber(summaryData.PredictSum) && <span title={getUnit(data.get('unit'))}>{getUnit(data.get('unit'))}</span>}
			</div>)}
		</div>
		);
	}
	render() {
		let {data, summaryData, period, onEdit, onRefresh, isGroup} = this.props;
		return (
			<div className='jazz-kpi-report-wrapper'>
				<div style={{
					position: 'absolute',
    				right: 0,
    				top: -8,
				}}>
				    {isFull() && !isGroup &&
				    	<IconButton iconClassName="fa icon-edit" onClick={() => {
					      	onRefresh(data.get('id'));
					      }}/>}
				</div>
				<div className='jazz-kpi-report-header'>{data.get('name')}</div>
				<div className='jazz-kpi-report'>
					<div className='jazz-kpi-report-chart'>
						<KPIChart  LastMonthRatio={summaryData && summaryData.LastMonthRatio} period={period} data={data}/>
					</div>
					<div className='jazz-kpi-report-summary'>
						{this.getValueSummaryItem()}
						{this.getPredictSummaryItem()}
					</div>
				</div>
			</div>
		);
	}
}