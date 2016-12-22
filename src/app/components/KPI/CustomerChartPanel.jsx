import React, { Component, PropTypes } from 'react';
import {find} from 'lodash/collection';

import KPIReport from './KPIReport.jsx';

/*export default class CustomerChartPanel extends Component {
	render() {
		let {period, tags, isGroup, summaryData} = this.props;
		return (
			<div>
				{(period && period.length > 0 && tags && tags.size > 0) ?
					tags.map( (tag, i) => <KPIReport
						isGroup={true}
						period={period}
						data={tag}
						summaryData={find(summaryData, sum => sum.KpiId === tag.get('id'))}
						key={tag.get('id')}/> ) :
				<div className='jazz-kpi-report flex-center' style={{height: 400}}>{I18N.Kpi.Error.NonKPIConguredInThisYear}</div>}
			</div>
		);
	}
}

CustomerChartPanel.propTypes = {

};
*/

export default function CustomerChartPanel(props) {
	let {period, tags, isGroup, summaryData} = props;
	return (
		<div>
			{(period && period.length > 0 && tags && tags.size > 0) ?
				tags.map( (tag, i) => <KPIReport
					isGroup={true}
					period={period}
					data={tag}
					summaryData={find(summaryData, sum => sum.KpiId === tag.get('id'))}
					key={tag.get('id')}/> ) :
			<div className='jazz-kpi-report flex-center' style={{height: 400}}>{I18N.Kpi.Error.NonKPIConguredInThisYear}</div>}
		</div>
	);
}