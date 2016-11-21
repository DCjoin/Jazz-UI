import React, { Component } from 'react';

import KPIAction from 'actions/KPI/KPIAction.jsx'
import KPIStore from 'stores/KPI/KPIStore.jsx'
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import FlatButton from 'controls/FlatButton.jsx';

import CreateKPI from './KPI.jsx';

export default class Actuality extends Component {
	constructor(props) {
		super(props);
		this._goCreate = this._goCreate.bind(this);
		this._onChange = this._onChange.bind(this);
		this.state = {
			showCreate: false
		}
	}
	componentWillMount() {
		KPIAction.getQuotaperiod(this.props.router.params.customerId);
		KPIStore.addChangeListener(this._onChange);
	}
	componentWillReceiveProps(nextProps) {
		KPIAction.getQuotaperiod(this.props.router.params.customerId);
		
	}
	componentWillUnmount() {
		KPIStore.removeChangeListener(this._onChange);
	}
	_init() {
		this.actioning = {
			quotaperiod: true,
			buildinglist: true,
			tagsData: true,
			tagsFullVal: true,
		}
	}
	_onChange() {
		this.forceUpdate();
	}
	_goCreate() {
		this.setState({
			showCreate: true
		});
	}
	_backCreate() {
		this.setState({
			showCreate: false
		});
	}
	render() {
		if(!KPIStore.getQuotaperiod()) {
			return (
				<div>{I18N.Kpi.Error.NonQuotaperiod}</div>
			)
		}
		if( this.state.showCreate ) {
			return (<CreateKPI/>);
		} else {
			let buildingProps = {
		        ref: 'commodity',
		        isViewStatus: false,
		        title: I18N.Setting.KPI.SelectBuilding,
		        dataItems: [{
		        	payload: 0,
		        	text: '长城脚下的公社'
		        }, {
		        	payload: 1,
		        	text: '朝阳门SOHO'
		        }, {
		        	payload: 2,
		        	text: '丹棱SOHO'
		        }, {
		        	payload: 3,
		        	text: '银河SOHO'
		        }, ],
		    };
			return (
				<div>
					<div>指标现状</div>
					<ViewableDropDownMenu {...buildingProps}/>
					<FlatButton label={'添加'} onClick={this._goCreate}/>
				</div>
			);
		}
	}
}
