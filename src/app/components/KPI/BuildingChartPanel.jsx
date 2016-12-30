import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import {first} from 'lodash/array';
import {find} from 'lodash/collection';
import {isNull, isUndefined} from 'lodash/lang';

import KPIType from 'constants/actionType/KPI.jsx';
import util from 'util/Util.jsx';

import LinkButton from 'controls/LinkButton.jsx';

import KPIReport from './KPIReport.jsx';
import RankHistory from './Single/RankHistory.jsx';

import UOMStore from 'stores/UOMStore.jsx';

const KPI_RANK_TYPE = 1,
TOP_RANK_TYPE = 2;

function noValue(value) {
	return isUndefined(value) || isNull(value);
}

function safeValue(safe) {
	return (value) => {
		if(noValue(value)) {
			return safe;
		}
		return value;
	}
}

const safeObj = safeValue({});
const safeArr = safeValue([]);
const safeImmuArr = safeValue(Immutable.fromJS([]));
const safeImmuObj = safeValue(Immutable.fromJS({}));

function isScale(UnitType) {
	return UnitType === KPIType.UnitType.MonthRatio || UnitType === KPIType.UnitType.MonthScale;
}

function getUnitLabel({UnitType, UomId}) {
	if( isScale(UnitType) ) {
		return '%';
	}
	return UOMStore.getUomById(UomId) + util.getPerByUnitType(UnitType);
}

function getValueLabel(value, data) {
	if( noValue(value) ) {
		return '';
	}
	return (isScale(data.UnitType) ? value.toFixed(1)*1 : util.getLabelData(value)) + getUnitLabel(data);
}

function RankNumber(props) {
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

	return (
		<div className='building-rank-number'>
			<span className='self-number'>{Index}</span>
			<span>/{Count}</span>
			<span className='rank-flag'>{flag}</span>
		</div>
	);
}

function getRanlLabelDate() {
	let lastMonth = new moment().subtract('month', 1);
	return util.replacePathParams(I18N.Kpi.YearMonth, lastMonth.get('year'), lastMonth.get('month') + 1);
}

export default class BuildingChartPanel extends Component {
	static contextTypes = {
		router: React.PropTypes.object
	};
	constructor(props) {
		super(props);

		this.state = {
			selectedRank: null
		};
	}
	render() {
		let {period, tags, isGroup, summaryData, ranks, buildingId, onRefresh, year} = this.props,
		selectedRank = this.state.selectedRank,
		isThisYear = year === new Date().getFullYear(),
		KPIRank = safeArr(ranks).filter( rank => safeObj(rank).RankType === KPI_RANK_TYPE),
		topRank = find(safeArr(ranks), rank => safeObj(rank).RankType === TOP_RANK_TYPE);

		return (
			<div>
				{isThisYear && topRank && 
				<div className='jazz-building-top-rank'>
					<div className='top-rank-item'>
						<div className='jazz-building-top-rank-title hiddenEllipsis'>{topRank.RankName}</div>
						<div>{getRanlLabelDate()}</div>
						<LinkButton 
							className='jazz-building-top-rank-his' 
							label={I18N.Setting.KPI.Rank.ShowHistory + '>>'}
							onClick={() => {
								this.setState({selectedRank: topRank});
							}}/>
					</div>
					<div className='top-rank-item'>
						<div>{I18N.Setting.KPI.Rank.Name}</div>
						{RankNumber(topRank)}
					</div>
					<div className='top-rank-item'>
						<div>{I18N.Setting.KPI.Rank.UsageAmount}</div>
						<div className='jazz-building-top-rank-total'>
							<span className='jazz-building-top-rank-total-number hiddenEllipsis'>{getValueLabel(topRank.RankValue, topRank)}</span>
							
						</div>
					</div>
				</div>}
				{(safeArr(period).length > 0 && safeImmuArr(tags).size > 0) ?
					tags.map( (tag, i) => {
						let currentTag = safeImmuObj(tag),
						currentKPIId = currentTag.get('id'),
						currentSummaryData = find(safeArr(summaryData), sum => sum.KpiId === currentKPIId),
						currentRank = find(KPIRank, rank => rank.KpiId === currentKPIId);
					if( !isThisYear || !currentRank ) {
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
							<LinkButton 
								className='jazz-building-kpi-rank-footer' 
								label={I18N.Setting.KPI.Rank.ShowHistory + '>>'}
								onClick={() => {
									this.setState({selectedRank: currentRank});
								}}/>
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
				{selectedRank && <RankHistory
					name={selectedRank.RankType === TOP_RANK_TYPE 
						? selectedRank.RankName
						: safeImmuObj(tags.find(tag => tag.get('id') === selectedRank.KpiId)).get('name')}
					rankType={selectedRank.RankType}
					groupKpiId={selectedRank.GroupKpiId}
					customerId={this.context.router.params.customerId}
					buildingId={buildingId}
					onClose={() => {this.setState({selectedRank: null})}}
				/>}
			</div>
		);
	}
}
