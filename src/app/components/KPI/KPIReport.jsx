import React, { Component } from 'react';
import classnames from 'classnames';
import {find, partial} from 'lodash-es';
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

let getTextByHover = partial(getTextByFilter, true);
let getTextByNoHover = partial(getTextByFilter, false);

let getTextByHoverIndex = function(isDosage, isThisYear) {
	return getTextByHover(isDosage, true, isThisYear);
}

let getTextByHoverSaving = function(isDosage, isThisYear) {
	return getTextByHover(isDosage, false, isThisYear);
}

function getTextByFilter(isHover, isDosage, isIndex, isThisYear) {
	let {
		IndexValue, 
		SavingValue, 
		ActualSum, 
		PredictSum, 
		ActualSaving, 
		PredictSaving,
		ByYearUntilNowValue,
		ByYearValue,
		ByYearUntilNowSavingValue,
		ByYearSavingRatioValue,
		ByYearKPIUsagedPredict,
		ByYearKPIUsagedValue,
		ByYearUsagedTarget,
		ByYearUsagedPredict,
		ByYearSavingPredict,
		ByYearUsagedValue,
		ByYearSavingValue,
		ByYearKPI,
		ByYearUntilNowKPIUsaged,
	} = I18N.Kpi;
	// mouseover 显示
	if( isHover ) {

		// 用量指标
		if( isDosage ) {

			// 定额
			if( isIndex ) {

				// 今年
				if( isThisYear ) {
					return [];
				// 往年
				} else {
					return [];
				}

			// 节能率
			} else {

				// 今年
				if( isThisYear ) {
					return [ByYearUsagedTarget, ByYearUsagedPredict, ByYearSavingPredict];
				// 往年
				} else {
					return [ByYearUsagedTarget, ByYearUsagedValue, ByYearSavingValue];
				}

			}

		// 比值类指标
		} else {

			// 定额
			if( isIndex ) {

				// 今年
				if( isThisYear ) {
					return [ByYearUntilNowKPIUsaged];
				// 往年
				} else {
					return [ByYearUntilNowKPIUsaged];
				}

			// 节能率
			} else {

				// 今年
				if( isThisYear ) {
					return [ByYearKPI, ByYearUntilNowValue];
				// 往年
				} else {
					return [ByYearKPI, ByYearValue];
				}

			}
		}

	// 外部直接显示
	} else {
		// 用量指标
		if( isDosage ) {
			
			// 定额
			if( isIndex ) {

				// 今年
				if( isThisYear ) {
					return [IndexValue, PredictSum];
				// 往年
				} else {
					return [IndexValue, ActualSum];
				}

			// 节能率
			} else {

				// 今年
				if( isThisYear ) {
					return [SavingValue, PredictSaving];
				// 往年
				} else {
					return [SavingValue, ActualSaving];
				}

			}

		// 比值类指标
		} else {

			// 定额
			if( isIndex ) {

				// 今年
				if( isThisYear ) {
					return [IndexValue, ByYearUntilNowValue];
				// 往年
				} else {
					return [IndexValue, ByYearValue];
				}

			// 节能率
			} else {

				// 今年
				if( isThisYear ) {
					return [SavingValue, ByYearUntilNowSavingValue];
				// 往年
				} else {
					return [SavingValue, ByYearSavingRatioValue];
				}

			}
		}
	}
}


function getUnit(id, RatioUomId) {
	let code = find(UOMStore.getUoms(), uom => uom.Id === id).Code;
	if( code === 'null' ) {
		code = '';
	}
	if( RatioUomId ) {
		let rationCode = find(UOMStore.getUoms(), uom => uom.Id === RatioUomId).Code;
		if( rationCode === 'null' ) {
			rationCode = '';
		}
		if( rationCode === code ) {
			return '';
		}
		return code + '/' + rationCode;
	}
	return code;
}
function isFull() {
	return privilegeUtil.isFull(PermissionCode.INDEX_AND_REPORT, CurrentUserStore.getCurrentPrivilege());
}

function getValueWithUnit(value, unit, RatioUomId) {
	if( !util.isNumber(value) ) {
		return '';
	}
	return util.getLabelData(value) + getUnit(unit, RatioUomId);
}

export default class KPIReport extends Component {
	static contextTypes = {
		router: React.PropTypes.object
	};
	/*指标值*/
	getValueSummaryItem() {
		let {data, summaryData, currentYearDone} = this.props;

		let isIndex = data.get('type') === 1,
		isDosage = data.get('IndicatorClass') === IndicatorClass.Dosage;

		return (
		<div className='summary-item'>
			<div className='summary-title'>{
				getTextByNoHover(isDosage, isIndex, !currentYearDone)[0]
				/*isIndex ? I18N.Kpi.IndexValue : I18N.Kpi.SavingValue*/
			}</div>
			{isIndex ?/*定额指标值*/
			(<div className='summary-value'>
				{summaryData.IndexValue !== null && <span>{util.getLabelData(summaryData.IndexValue)}</span>}
				{summaryData.IndexValue !== null && <span>{getUnit(data.get('unit'), data.get('RatioUomId'))}</span>}
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

		let isIndex = data.get('type') === 1,
		isDosage = data.get('IndicatorClass') === IndicatorClass.Dosage;

		let overproof = util.isNumber(summaryData.PredictSum) && util.isNumber(summaryData.IndexValue) && summaryData.IndexValue < summaryData.PredictSum ;
		return (
		<div className={classnames('summary-item', {overproof: overproof})}>
			<div className='summary-title'>{
				getTextByNoHover(isDosage, isIndex, !currentYearDone)[1]
				/*isIndex ? 
					(currentYearDone ? I18N.Kpi.ActualSum : I18N.Kpi.PredictSum) :
					(currentYearDone ? I18N.Kpi.ActualSaving : I18N.Kpi.PredictSaving)*/}</div>
			{isIndex ?/*定额预测值*/
			(<div className='summary-value'>
				<span>{util.getLabelData(summaryData.PredictSum)}</span>
				<span>{summaryData.PredictSum !== null && getUnit(data.get('unit'), data.get('RatioUomId'))}</span>
				{this._renderTooltip(overproof, isIndex, isDosage, currentYearDone)}
			</div>) :/*节能率预测值*/
			(<div className='summary-value'>
				<span>{(typeof summaryData.PredictRatio !== 'number' ? 0 : summaryData.PredictRatio).toFixed(1) * 1 + '%'}</span>
				{this._renderTooltip(overproof, isIndex, isDosage, currentYearDone)}
			</div>)}
		</div>
		);
	}
	_renderTooltip(overproof, isIndex, isDosage, currentYearDone) {
		let iconProps = {
			style: {
				fontSize: 24,
				color: overproof ? '#FF0000' : '#25C61D'
			},
			className: 'kpi-report-tooltip-icon ' + (overproof ? 'icon-unhappy' : 'icon-happy')
		}
		return (
			<FontIcon {...iconProps} >
				{isIndex ? this._renderIndexTooltip(overproof, isDosage, currentYearDone) : this._renderSavingTooltip(overproof, isDosage, currentYearDone) }
			</FontIcon>
		);
	}
	_renderIndexTooltip(overproof, isDosage, currentYearDone) {
		let {summaryData} = this.props;
		if( !isDosage ) {
			return null;
		}
		return (<div className='kpi-report-tooltip'>
			<div className='kpi-report-tooltip-title'>{getTextByHoverIndex(isDosage, !currentYearDone)}</div>
			<div style={{fontSize: '18px', color: overproof ? '#dc0a0a' : '#0f0f0f'}}>{(!summaryData.PredictRatio ? 0 : summaryData.PredictRatio).toFixed(1) * 1 + '%'}</div>
		</div>);
	}
	_renderSavingTooltip(overproof, isDosage, currentYearDone) {
		let {data, summaryData} = this.props,
		{IndexValue, PredictSum} = summaryData,
		actualSum = data.get('actual').toJS().reduce((prev, curr) => prev + +curr, 0),
		unit = data.get('unit'),
		RatioUomId = data.get('RatioUomId'),
		indicatorClass = data.get('IndicatorClass'),
		firstTitle = getTextByHoverSaving(isDosage, !currentYearDone)[0];
		if(!firstTitle) {
			return null;
		}
		return (
			<div className='kpi-report-tooltip'>
				<div style={{paddingBottom: 5, borderBottom: '1px solid #cbcbcb'}}>
					<div className='kpi-report-tooltip-title'>{firstTitle}</div>
					<div style={{fontSize: '18px', color: overproof ? '#dc0a0a' : '#0f0f0f'}}>{getValueWithUnit(IndexValue - actualSum, unit, RatioUomId)}</div>
				</div>
				<div style={{marginTop: 10}}>
					<div className='kpi-report-tooltip-title'>{getTextByHoverSaving(isDosage, !currentYearDone)[1]}</div>
					<div>{getValueWithUnit(IndexValue, unit, RatioUomId)}</div>
				</div>
				{indicatorClass === IndicatorClass.Dosage && <div style={{marginTop: 10}}>
					<div className='kpi-report-tooltip-title'>{getTextByHoverSaving(isDosage, !currentYearDone)[2]}</div>
					<div>{getValueWithUnit(PredictSum, unit, RatioUomId)}</div>
				</div>}
			</div>
		);
	}
	_renderTip() {
		let hasPermission = privilegeUtil.canView(PermissionCode.PUSH_SOLUTION, CurrentUserStore.getCurrentPrivilege())
							|| privilegeUtil.isFull(PermissionCode.SENIOR_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege());
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
				    {isFull() && !isGroup && data.get('IndicatorClass') === IndicatorClass.Dosage &&
				    	<LinkButton iconName="icon-edit" onClick={() => {
					      	onRefresh(data.get('id'));
					      }} label={I18N.Common.Button.Edit}/>}
				</div>
				<div className='jazz-kpi-report-header'>{data.get('name')}</div>
				<div className='jazz-kpi-report'>
					<div className='jazz-kpi-report-chart'>
						<KPIChart LastMonthRatio={summaryData && summaryData.LastMonthRatio} period={period} data={data}/>
					</div>
					<div className='jazz-kpi-report-summary'>
						{this.getValueSummaryItem()}
						{this.getPredictSummaryItem()}
						{!!overproof && !currentYearDone && !isGroup && this._renderTip()}
					</div>
				</div>
			</div>
		);
	}
}