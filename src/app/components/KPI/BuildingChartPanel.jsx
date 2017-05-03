import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import {first, last} from 'lodash';
import {find} from 'lodash';
import {isNull, isUndefined} from 'lodash';

import KPIType from 'constants/actionType/KPI.jsx';
import util from 'util/Util.jsx';

import LinkButton from 'controls/LinkButton.jsx';

import KPIReport from './KPIReport.jsx';
import RankHistory from './Single/RankHistory.jsx';

import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';
import RankingKPIStore from 'stores/KPI/RankingKPIStore.jsx';
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

function getUnitLabel({RankValue, UnitType, UomId}, byValue) {
	if( byValue && noValue(RankValue) ) {
		return '';
	}
	if( isScale(UnitType) ) {
		return byValue ? '' : '%';
	}
	return UOMStore.getUomById(UomId) + util.getPerByUnitType(UnitType);
}
function getValue(data) {
	if( noValue(data.RankValue) ) {
		return I18N.Setting.KPI.Group.Ranking.History.NoValue;
	}
	if( isScale(data.UnitType) ) {
		return data.RankValue.toFixed(1) + '%';
	}
	return util.getLabelData(data.RankValue);
}

// function getValueLabel(value, data) {
// 	if( noValue(value) ) {
// 		return I18N.Setting.KPI.Group.Ranking.History.NoValue;
// 	}
// 	return (isScale(data.UnitType) ? value.toFixed(1)*1 : util.getLabelData(value)) + getUnitLabel(data);
// }

function RankNumber(props, isThisYear) {
	if(!props) {
		return null;
	}
	let {DIndex, Index, Count} = props,
	flag = '-';

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
			{isThisYear && <span className='rank-flag'>{flag}</span>}
		</div>
	);
}

function getRanlLabelDate(year) {
	if(year === new moment().year() ) {		
		let lastMonth = new moment().subtract('month', 1);
		return util.replacePathParams(I18N.Kpi.YearMonth, lastMonth.get('year'), lastMonth.get('month') + 1);
	} else {
		return year + I18N.Baseline.BaselineModify.YearValue;
	}
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
		isThisYear = year === SingleKPIStore.getCustomerCurrentYear(),
		KPIRank = safeArr(ranks).filter( rank => safeObj(rank).RankType === KPI_RANK_TYPE),
		topRank = find(safeArr(ranks), rank => safeObj(rank).RankType === TOP_RANK_TYPE);

		return (
			<div>
				{topRank && 
				<div className='jazz-building-top-rank'>
					<div className='top-rank-item'>
						<div className='jazz-building-top-rank-title'>{getRanlLabelDate(year)}</div>
						<div className='hiddenEllipsis'>{topRank.RankName}</div>
						<LinkButton 
							className='jazz-building-top-rank-his' 
							label={(isThisYear ? I18N.Setting.KPI.Rank.ShowHistory : I18N.Setting.KPI.Rank.ShowByMonth) + '>>'}
							onClick={() => {
								this.setState({selectedRank: topRank});
							}}/>
					</div>
					<div className='top-rank-item'>
						<div>{I18N.Setting.KPI.Rank.Name}</div>
						{RankNumber(topRank, isThisYear)}
					</div>
					<div className='top-rank-item'>
						<div>{RankingKPIStore.getUnitType(topRank.UnitType)}</div>
						<div className='jazz-building-top-rank-total'>
							<span className='jazz-building-top-rank-total-number hiddenEllipsis'>{getValue(topRank)}</span>
							<span>{getUnitLabel(topRank, true)}</span>
						</div>
					</div>
				</div>}
				{(safeArr(period).length > 0 && safeImmuArr(tags).size > 0) ?
					tags.map( (tag, i) => {
						let currentTag = safeImmuObj(tag),
						currentKPIId = currentTag.get('id'),
						currentSummaryData = find(safeArr(summaryData), sum => sum.KpiId === currentKPIId),
						currentRank = find(KPIRank, rank => rank.KpiId === currentKPIId);
					if( !currentRank ) {
						return (
							<KPIReport
								currentYearDone={last(period).clone().add(1, 'months').isBefore(new Date())}
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
								<div className='jazz-building-kpi-rank-time'>{this.context.router.location.query.groupKpiId ? I18N.Setting.KPI.Rank.LastRank : getRanlLabelDate(year)}</div>
								<div>{currentTag.get('type') === 1 ? I18N.Setting.KPI.Rank.UsageAmountRank : I18N.Setting.KPI.Rank.RatioMonthSavingRank}</div>
								{RankNumber(currentRank, isThisYear)}
							</content>
							<LinkButton 
								className='jazz-building-kpi-rank-footer' 
								label={(isThisYear ? I18N.Setting.KPI.Rank.ShowHistory : I18N.Setting.KPI.Rank.ShowByMonth) + '>>'}
								onClick={() => {
									this.setState({selectedRank: currentRank});
								}}/>
						</div>
						<div className='jazz-building-kpi-rank-report'>
							<KPIReport
								currentYearDone={last(period).clone().add(1, 'months').isBefore(new Date())}
								isGroup={false}
								period={period}
								onRefresh={onRefresh}
								data={currentTag}
								summaryData={currentSummaryData}
								key={currentKPIId}/>
						</div>	
					</div> )}) :
				<div className='jazz-kpi-report flex-center' style={{height: 400}}><b>{I18N.Kpi.Error.NonKPIConguredInThisYear}</b></div>}
				{selectedRank && <RankHistory
					renderTitle={!isThisYear && function() {
						return (<div style={{marginBottom: 20}}>
							<span style={{marginRight: 80}}>{year + I18N.Baseline.BaselineModify.YearValue}</span>
							<span style={{marginRight: 80}}>{I18N.Setting.KPI.Rank.Name + ' ' + selectedRank.Index + '/' + selectedRank.Count}</span>
							<span>{RankingKPIStore.getUnitType(selectedRank.UnitType) + ' ' + getValue(selectedRank)}</span>
						</div>)
					}}
					name={selectedRank.RankType === TOP_RANK_TYPE 
						? selectedRank.RankName
						: safeImmuObj(tags.find(tag => tag.get('id') === selectedRank.KpiId)).get('name')}
					uomLabel={getUnitLabel(selectedRank)}
					rankType={selectedRank.RankType}
					groupKpiId={selectedRank.GroupKpiId}
					customerId={this.context.router.params.customerId}
					buildingId={buildingId}
					onClose={() => {this.setState({selectedRank: null})}}
					year={year}
				/>}
			</div>
		);
	}
}
