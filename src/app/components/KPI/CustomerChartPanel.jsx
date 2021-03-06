import React, { Component} from 'react';
import Immutable from 'immutable';
import {isNull, isUndefined, find, last} from 'lodash-es';
import PropTypes from 'prop-types';
import KPIReport from './KPIReport.jsx';
import RankChart from './Group/RankChart.jsx';

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

export default function CustomerChartPanel(props) {
	let {period, tags, isGroup, summaryData, ranks, year} = props;

	return (
		<div>
			{(period && period.length > 0 && tags && tags.size > 0) ?
				tags.map( (tag, i) => <KPIReport
					idx={i}
					currentYearDone={last(period).clone().add(1, 'months').isBefore(new Date())}
					isGroup={true}
					period={period}
					data={tag}
					summaryData={find(summaryData, sum => sum.KpiId === tag.get('id')) || {}}
					key={tag.get('id')}/> ) :
			<div className='jazz-kpi-report flex-center' style={{height: 400}}><b>{I18N.Kpi.Error.NonKPIConguredInThisYear}</b></div>}
			{safeArr(ranks).map((rank, i) => rank && (<RankChart disabledToggle={ranks.filter(rank => rank.MobileViewState).length >= 2} idx={i} year={year} {...rank}/>) )}
		</div>
	);
}