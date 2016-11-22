import React, { Component, PropTypes } from 'react';

import KPIAction from 'actions/KPI/KPIAction.jsx';
import KPIStore from 'stores/KPI/KPIStore.jsx';

import { formStatus } from 'constants/FormStatus.jsx';
import util from 'util/Util.jsx';

import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';

function calcShowCycle(month, day) {
	let firstYear = month < 7 ? I18N.Setting.KPICycle.ThisYear : I18N.Setting.KPICycle.LastYear;
	let lastYear = month < 7 ? I18N.Setting.KPICycle.NextYear : I18N.Setting.KPICycle.ThisYear;

	let showMonth = day < 16 ? month - 1 : month;

	return util.replacePathParams(I18N.Setting.KPICycle.Date, 
									firstYear, showMonth, day,
									lastYear, showMonth, day);
}

function getMonthData() {
	let result = [];
	for(let i = 1; i <= 12; i++) {
		result.push({
			payload: i,
			text: util.replacePathParams(I18N.Setting.KPICycle.Month, i)
		});
	}
	return result;
}

function getDayData() {
	let result = [];
	for(let i = 1; i <= 28; i++) {
		result.push({
			payload: i,
			text: util.replacePathParams(I18N.Setting.KPICycle.Day, i)
		});
	}
	return result;
}

class KPICycleDetail extends Component {

	render() {
		let {data, status} = this.props;
	    let selectMonthProps = {
	        key: 'select_month',
	        isViewStatus: false,
	        defaultValue: data && data.Month,
	        dataItems: getMonthData(),
	        didChanged: value => {
	        	this.props.onChange('Month', value);
	        }
	    },
	    selectDayProps = {
	        key: 'select_day',
	        isViewStatus: false,
	        defaultValue: data && data.Day,
	        dataItems: getDayData(),
	        didChanged: value => {
	        	this.props.onChange('Day', value);
	        }
	    };
		return (
		<div>
			{!data && <div>{I18N.Setting.KPICycle.Non}</div>}
			{status === formStatus.EDIT && 
			<div>
				<ViewableDropDownMenu {...selectMonthProps}/>
				<ViewableDropDownMenu {...selectDayProps}/>
			</div>}
			{data && <div>{	calcShowCycle(data.Month, data.Year)}</div>}
		</div>)
	}
}

KPICycleDetail.PropTypes ={
	status: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
};


export default class KPICycle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: formStatus.VIEW,
			KPICycle: null
		};
		this._onChange = this._onChange.bind(this);
		this._onSave = this._onSave.bind(this);
		this._onEdit = this._onEdit.bind(this);
		this._onCancel = this._onCancel.bind(this);
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
	_onChange() {
		this.setState({
			KPICycle: KPIStore.getQuotaperiod()
		});
	}
	_onSave() {
		this.setState({
			status: formStatus.VIEW
		});
	}
	_onEdit() {
		this.setState({
			status: formStatus.EDIT,
			KPICycle: KPIStore.getQuotaperiod()
		});
	}
	_onCancel() {
		this.setState({
			status: formStatus.VIEW,
			KPICycle: KPIStore.getQuotaperiod()
		});
	}
	render() {
		let {status, KPICycle} = this.state;
		return (
			<div>
				<div>{I18N.Setting.KPICycle.Title}</div>
				<KPICycleDetail 
					status={status} 
					data={KPICycle} 
					onChange={(path, value) => {
						KPICycle[path] = value;
						this.setState({
							KPICycle: KPICycle
						});
					}}/>
				<FormBottomBar 
					isShow={true}
					allowEdit={true}
					allowDelete={false}
					enableSave={KPICycle && KPICycle.Month && KPICycle.Day}
					status={status}
					onSave={this._onSave}
					onEdit={this._onEdit}
					onCancel={this._onCancel}
					/>
			</div>
		);
	}
}
