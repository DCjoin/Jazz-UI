import React, { Component } from 'react';

import SwitchBar from 'controls/SwitchBar.jsx';

import ReportChart from './ReportChart.jsx';

export default class ReportPreview extends Component {
	componentWillMount() {
		document.title = I18N.MainMenu.KPI;

		this._preAction(this.props.router.params.customerId);

		// SingleKPIStore.addPreListener(this._onPreAction);
		// SingleKPIStore.addChangeListener(this._onChange);
	}
	componentWillReceiveProps(nextProps) {
	}
	componentWillUnmount() {
		// SingleKPIStore.removePreListener(this._onChange);
		// SingleKPIStore.removeChangeListener(this._onChange);
	}
	_getInitialState() {
		return {
			year: null,
		}
	}
	_preAction() {

	}
	_getDateLabel() {
		return '2016';
	}
	render() {
		let onLastMonth, onNextMonth;
		return (
			<div>
				<SwitchBar 
					className='switch-year'
        			label={this._getDateLabel()}
        			onLeft={onLastMonth}
        			onRight={onNextMonth}/>
				<ReportChart />
			</div>
		);
	}
}
