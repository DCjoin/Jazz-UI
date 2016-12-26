import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import {first} from 'lodash/array';
import {find} from 'lodash/collection';
import {isNull, isUndefined} from 'lodash/lang';

import util from 'util/Util.jsx';

import LinkButton from 'controls/LinkButton.jsx';

import KPIReport from './KPIReport.jsx';

const KPI_RANK_TYPE = 1,
TOP_RANK_TYPE = 2;

// const noValue = 

function safeValue(safe) {
	return (value) => {
		if(isUndefined(value) || isNull(value)) {
			return safe;
		}
		return value;
	}
}

const safeArray = safeValue([]);
const safeImmuArray = safeValue(Immutable.fromJS([]));
const safeImmuObject = safeValue(Immutable.fromJS({}));

function RankNumber(props) {
	if(!props) {
		return null;
	}
	let {DIndex, Index, Count} = props,
	flag = '--';

	if(DIndex > 0) {
		flag = '&uarr; ' + DIndex;
	}
	if(DIndex < 0) {
		flag = '&darr; ' + DIndex * -1;
	}

	return (
		<div className='building-rank-number'>
			<span className='self-number'>{Index}</span>
			<span>/{Count}</span>
			<span className='rank-flag'>{flag}</span>
		</div>
	);
}

function getRanlLabelDate() {
	return util.replacePathParams(I18N.Kpi.YearMonth, new Date().getFullYear(), new Date().getMonth() + 1);
}

export default function BuildingChartPanel(props) {
	let {period, tags, isGroup, summaryData, ranks, onRefresh} = props,
	KPIRank = safeArray(ranks).filter( rank => rank.RankType === KPI_RANK_TYPE),
	topRank = safeArray(ranks).filter( rank => rank.RankType === TOP_RANK_TYPE);
	// test data
	// KPIRank = safeArray(ranks);
	// topRank = safeArray(ranks).filter( (rank, i) => !i);
	return (
		<div>
			{topRank.length === 1 && 
			<div className='jazz-building-top-rank'>
				<div className='top-rank-item'>
					<div className='jazz-building-top-rank-title hiddenEllipsis'>{topRank.RankName}</div>
					<div>{getRanlLabelDate()}</div>
					<LinkButton className='jazz-building-top-rank-his' label={I18N.Setting.KPI.Rank.ShowHistory + '>>'}/>
				</div>
				<div className='top-rank-item'>
					<div>{I18N.Setting.KPI.Rank.Name}</div>
					{RankNumber(first(topRank))}
				</div>
				<div className='top-rank-item'>
					<div>{I18N.Setting.KPI.Rank.UsageAmount}</div>
					<div className='jazz-building-top-rank-total'>
						<span className='jazz-building-top-rank-total-number hiddenEllipsis'>{util.getLabelData(topRank.Value)}</span>
						<span>{topRank.Value && UOMStore.getUomById(topRank.UomId)}</span>
					</div>
				</div>
			</div>}
			{(safeArray(period).length > 0 && safeImmuArray(tags).size > 0) ?
				tags.map( (tag, i) => {
					let currentTag = safeImmuObject(tag),
					currentKPIId = currentTag.get('id'),
					currentSummaryData = find(safeArray(summaryData), sum => sum.KpiId === currentKPIId),
					currentRank = find(KPIRank, rank => rank.KpiId === currentKPIId);
				if( !currentRank ) {
					return (
						<KPIReport
							isGroup={false}
							period={period}
							onRefresh={onRefresh}
							data={currentTag}
							summaryData={currentSummaryData}
							key={currentKPIId}/>);
				}
				return (
				<div className='jazz-building-kpi-rank-wrapper'>
					<div className='jazz-building-kpi-rank'>
						<header className='jazz-building-kpi-rank-header hiddenEllipsis'>{currentTag.get('name')}</header>
						<content className='jazz-building-kpi-rank-content'>
							<div>{currentTag.get('type') === 1 ? I18N.Setting.KPI.Rank.UsageAmountRank : I18N.Setting.KPI.Rank.RatioMonthSavingRank}</div>
							<div className='jazz-building-kpi-rank-time'>{getRanlLabelDate()}</div>
							{RankNumber(currentRank)}
						</content>
						<LinkButton className='jazz-building-kpi-rank-footer' label={I18N.Setting.KPI.Rank.ShowHistory + '>>'}/>
					</div>
					<div className='jazz-building-kpi-rank-report'>
						<KPIReport
							isGroup={false}
							period={period}
							onRefresh={onRefresh}
							data={currentTag}
							summaryData={currentSummaryData}
							key={currentKPIId}/>
					</div>	
				</div> )}) :
			<div className='jazz-kpi-report flex-center' style={{height: 400}}>{I18N.Kpi.Error.NonKPIConguredInThisYear}</div>}
		</div>
	);
}