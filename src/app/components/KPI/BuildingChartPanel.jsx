import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import {find} from 'lodash/collection';
import {isNull, isUndefined} from 'lodash/lang';

import LinkButton from 'controls/LinkButton.jsx';

import KPIReport from './KPIReport.jsx';

const KPI_RANK_TYPE = 1,
TOP_RANK_TYPE = 2;

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

export default function BuildingChartPanel(props) {
	let {period, tags, isGroup, summaryData, ranks, onRefresh} = props,
	KPIRank = safeArray(ranks).filter( rank => rank.RankType === KPI_RANK_TYPE),
	topRank = safeArray(ranks).filter( rank => rank.RankType === TOP_RANK_TYPE);
	KPIRank = safeArray(ranks);
	return (
		<div>
			{topRank.length === 1 && 
			<div>
				置顶排名
			</div>}
			{(safeArray(period).length > 0 && safeImmuArray(tags).size > 0) ?
				tags.map( (tag, i) => {
					let currentTag = safeImmuObject(tag),
					currentKPIId = currentTag.get('id'),
					currentSummaryData = find(safeArray(summaryData), sum => sum.KpiId === currentKPIId),
					currentRank = find(KPIRank, rank => rank.KpiId === currentKPIId);
				return (
				<div style={{display: 'flex'}}>
					<div style={{
						width: 300,
						flex: 'none',
					}} className='jazz-building-kpi-rank'>
						<header>{currentTag.get('Name')}</header>
						<content>
							<div>{'指标使用量排名'}</div>
							<div>{'2016年8月'}</div>
							<div>
								<span>5</span>
								<span>/25</span>
								<span>up 2</span>
							</div>
						</content>
						<LinkButton>{'查看排名历史'}</LinkButton>
					</div>
					<div style={{
						width: 20,
						flex: 'none',
					}}/>
					<KPIReport
						isGroup={false}
						period={period}
						onRefresh={onRefresh}
						data={currentTag}
						summaryData={currentSummaryData}
						key={currentKPIId}/>					
				</div> )}) :
			<div className='jazz-kpi-report flex-center' style={{height: 400}}>{I18N.Kpi.Error.NonKPIConguredInThisYear}</div>}
		</div>
	);
}