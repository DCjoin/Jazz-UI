import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import assign from 'object-assign';

import KPIAction from 'actions/KPI/KPIAction.jsx';
import KPIStore from 'stores/KPI/KPIStore.jsx';

import { formStatus } from 'constants/FormStatus.jsx';
import util from 'util/Util.jsx';

import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';

function calcShowCycle(month, day) {
	let firstYear = month < 7 ? I18N.Setting.KPICycle.ThisYear : I18N.Setting.KPICycle.LastYear;
	let lastYear = month < 7 ? I18N.Setting.KPICycle.NextYear : I18N.Setting.KPICycle.ThisYear;

	let showMonth = day < 16 && month > 1 ? month - 1 : month;

	return util.replacePathParams(I18N.Setting.KPICycle.Date, 
									firstYear, showMonth, day,
									lastYear, showMonth, day - 1);
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

function validData(data) {
	return data && data.Day && data.Month;
}

function isNewData(data) {
	return !(validData(data) && data.CreateTime);
}

class KPICycleDetail extends Component {

	render() {
		let {data, status} = this.props;
	    let selectMonthProps = {
	        key: 'select_month',
	        style: {
	        	width: 160,
	        },
	        isViewStatus: false,
	        defaultValue: data && data.Month,
	        dataItems: getMonthData(),
	        didChanged: value => {
	        	this.props.onChange('Month', value);
	        }
	    },
	    selectDayProps = {
	        key: 'select_day',
	        style: {
	        	width: 160,
	        	marginLeft: 10,
	        },
	        isViewStatus: false,
	        defaultValue: data && data.Day,
	        dataItems: getDayData(),
	        didChanged: value => {
	        	this.props.onChange('Day', value);
	        }
	    };
		return (
		<div className='content'>
			{isNewData(data) && <div className='non-tip'>{I18N.Setting.KPICycle.Non}</div>}
			{status === formStatus.EDIT && 
			<div className='select-panel'>
				<div className="select-panel-title">{I18N.Setting.KPICycle.StartTime}</div>
				<div className="select-panel-value">
					<ViewableDropDownMenu {...selectMonthProps}/>
					<ViewableDropDownMenu {...selectDayProps}/>
				</div>
			</div>}
			{validData(data) && <div className='result-panel'>
				<div className='result-panel-title'>{I18N.Setting.KPICycle.Title}</div>
				<div className='result-panel-value'>{calcShowCycle(data.Month, data.Day)}</div>				
			</div>}
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
			loading: true,
			KPICycle: null
		};
		this._onChange = this._onChange.bind(this);
		this._onSave = this._onSave.bind(this);
		this._onEdit = this._onEdit.bind(this);
		this._onCancel = this._onCancel.bind(this);
	}
	componentWillMount() {
		KPIAction.getKPIPeriod(this.props.router.params.customerId);
		KPIStore.addChangeListener(this._onChange);
	}
	componentWillReceiveProps(nextProps) {
		KPIAction.getKPIPeriod(this.props.router.params.customerId);		
	}
	componentWillUnmount() {
		KPIStore.removeChangeListener(this._onChange);
	}
	_onChange() {
		this.setState({
			loading: false,
			KPICycle: KPIStore.getKPIPeriod(),
			status: formStatus.VIEW
		});
	}
	_onSave() {
		this.setState({
			loading: true
		});
		KPIAction.setKPIPeriod(assign({
			CustomerId: this.props.router.params.customerId
		}, this.state.KPICycle));
	}
	_onEdit() {
		this.setState({
			status: formStatus.EDIT,
			KPICycle: KPIStore.getKPIPeriod()
		});
	}
	_onCancel() {
		this.setState({
			status: formStatus.VIEW,
			KPICycle: KPIStore.getKPIPeriod()
		});
	}
	render() {
		let {status, KPICycle, loading} = this.state;
		return (
			<div className={'jazz-kpi-cycle'}>
				<div className='header-bar'>{I18N.Setting.KPICycle.Title}</div>
				{loading && <div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>}
				{!loading && <KPICycleDetail 
					status={status} 
					data={KPICycle} 
					onChange={(path, value) => {
						KPICycle[path] = value;
						this.setState({
							KPICycle: KPICycle
						});
					}}/>}
				{!loading && <FormBottomBar 
					isShow={true}
					allowEdit={true}
					allowDelete={false}
					enableSave={validData(KPICycle)}
					status={status}
					onSave={this._onSave}
					onEdit={this._onEdit}
					onCancel={this._onCancel}
					/>}
			</div>
		);
	}
}
