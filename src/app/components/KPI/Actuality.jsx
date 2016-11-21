import React, { Component } from 'react';

import KPIAction from 'actions/KPI/KPIAction.jsx'
import KPIStore from 'stores/KPI/KPIStore.jsx'

export default class Actuality extends Component {
	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
	}
	componentWillMount() {
		KPIAction.getQuotaperiod(this.props.router.params.customerId);		
		KPIStore.addChangeListener(this._onChange);
	}
	componentWillUnmount() {
		KPIStore.removeChangeListener(this._onChange);
	}
	_onChange() {
		this.forceUpdate();
	}
	render() {
		if(!KPIStore.getQuotaperiod()) {
			return (
				<div>{I18N.Kpi.Error.NonQuotaperiod}</div>
			)
		}
		return (
			<div>指标现状</div>
		);
	}
}
