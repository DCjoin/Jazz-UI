import React, { Component } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import assign from 'object-assign';
import {findLastIndex, fill, map} from 'lodash/array';
import {find} from 'lodash/collection';
import {sum} from 'lodash/math';
import CircularProgress from 'material-ui/CircularProgress';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import UserAction from 'actions/UserAction.jsx';
import HierarchyAction from 'actions/HierarchyAction.jsx';
import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';
import UserStore from 'stores/UserStore.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';

import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import LinkButton from 'controls/LinkButton.jsx';

import PermissionCode from 'constants/PermissionCode.jsx';

import util from 'util/Util.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';

// import KPIReport from './KPIReport.jsx';
import CustomerChartPanel from './CustomerChartPanel.jsx';
import BuildingChartPanel from './BuildingChartPanel.jsx';
import CreateKPI from './single/KPI.jsx';
import UpdatePrediction from './single/UpdatePrediction.jsx';

function canView() {
	return privilegeUtil.canView(PermissionCode.INDEX_AND_REPORT, CurrentUserStore.getCurrentPrivilege());
}
function isOnlyView() {
	return privilegeUtil.isView(PermissionCode.INDEX_AND_REPORT, CurrentUserStore.getCurrentPrivilege());
}

function isFull() {
	return privilegeUtil.isFull(PermissionCode.INDEX_AND_REPORT, CurrentUserStore.getCurrentPrivilege());
}
function isSingleBuilding() {
	return (HierarchyStore.getBuildingList() && HierarchyStore.getBuildingList().length === 1);
}

function getHierarchyNameById(Id) {
	if(getCustomerById(Id)) {
		return getCustomerById(Id).Name;
	}
	return HierarchyStore.getBuildingList().filter( building => building.Id === Id )[0].Name;
}

function getCustomerById(customerId) {
	return find(CurrentUserCustomerStore.getAll(), customer => customer.Id === customerId * 1 );
}
function getCustomerPrivilageById(customerId) {
	return UserStore.getUserCustomers().find(customer => customer.get('CustomerId') === customerId * 1 );
}

function singleProjectMenuItems() {
	if( !HierarchyStore.getBuildingList() || HierarchyStore.getBuildingList().length === 0 ) {
		return [];
	}
	return [{
    	Id: -2,
    	disabled: true,
    	Name: I18N.Kpi.SingleProject
    }].concat(HierarchyStore.getBuildingList());
}
function groupProjectMenuItems(customerId) {
	if( !CurrentUserCustomerStore.getAll() || CurrentUserCustomerStore.getAll().length === 0 ) {
		return [];
	}
	return [{
    	Id: -1,
    	disabled: true,
    	Name: I18N.Kpi.GroupProject
    }].concat( getCustomerById(customerId) );
}

function ActualityHeader(props) {
	let {buildingProps, prefixTitle} = props;

	return (
		<div className='header-bar'>
			<div>{prefixTitle + I18N.Kpi.KPIActual}</div>
			{!prefixTitle && isFull() && <ViewableDropDownMenu {...buildingProps}/>}
		</div>
	);
}

class ActualityContent extends Component {
	render() {
		let {data, summaryData, period, year, onChangeYear, hierarchyId, onEdit, onRefresh, chartReady} = this.props;
		if( !chartReady ) {
			return (<div className="content flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>);
		}
		if( isFull() ) {
			// if( !hierarchyId ) {
			// 	return (<div className="content flex-center"><b>{I18N.Kpi.Error.SelectBuilding}</b></div>);
			// }
			if( !data ) {
				return (<div className="content flex-center"><b>{I18N.Kpi.Error.NonKPICongured}</b></div>);
			}
		}
		let tags = data.get('data');
		let isGroup = !!getCustomerById(hierarchyId);
		let baseProps = {period, tags, summaryData, year, ranks: SingleKPIStore.getKPIRank()};
		return (
			<div className='content'>
				<div className='action-bar'>
					<LinkButton iconName={ "icon-arrow-left" } disabled={ !SingleKPIStore.hasLastYear(year) } onClick={() => {
						if( SingleKPIStore.hasLastYear(year) ) {
							onChangeYear(year * 1 - 1);
						}
					}}/>
					<span className='current-year'>{year}</span>
					<LinkButton iconName={ "icon-arrow-right" } disabled={ !SingleKPIStore.hasNextYear(year) } onClick={() => {
						if( SingleKPIStore.hasNextYear(year) ) {
							onChangeYear(year * 1 + 1);
						}
					}}/>
				</div>
				{isGroup
				? <CustomerChartPanel {...baseProps}/>
				: <BuildingChartPanel {...baseProps} buildingId={hierarchyId} onRefresh={onRefresh}/>}
			</div>
		);
	}
}

const TipMessage = (props, context, updater) => {
	return (<div className='jazz-kpi-actuality flex-center'><b>{props.message}</b></div>)
}

export default class Actuality extends Component {
	constructor(props) {
		super(props);
		this._goCreate = this._goCreate.bind(this);
		this._onChange = this._onChange.bind(this);
		this._reload = this._reload.bind(this);
		this._cancleRefreshDialog = this._cancleRefreshDialog.bind(this);
		this._onPreAction = this._onPreAction.bind(this);
		this._getKPIRank = this._getKPIRank.bind(this);
		this.state = this._getInitialState();
	}
	componentWillMount() {
		document.title = I18N.MainMenu.KPI;

		this._preAction(this.props.router.params.customerId);

		// HierarchyStore.addBuildingListListener(this._onPreAction);
		// UserStore.addChangeListener(this._onPreAction);
		SingleKPIStore.addPreListener(this._onPreAction);
		SingleKPIStore.addChangeListener(this._onChange);
	}
	componentWillReceiveProps(nextProps) {
		if( !util.shallowEqual(nextProps.router.params, this.props.router.params)
		 || this.props.hierarchyId !== nextProps.hierarchyId ) {
			this._preAction(nextProps.hierarchyId);
		}
		// this.setState(assign({}, this._getInitialState()), () => {
		// 	this._preAction(nextProps.router.params.customerId);
		// });
	}
	componentWillUnmount() {
		// HierarchyStore.removeBuildingListListener(this._onPreAction);
		// UserStore.removeChangeListener(this._onPreAction);
		SingleKPIAction.cleanActuality();
		SingleKPIStore.removePreListener(this._onPreAction);
		SingleKPIStore.removeChangeListener(this._onChange);
	}
	_getInitialState() {
		return {
			loading: canView(),
			showCreate: false,
			showRefreshDialog: false,
			kpiId: null,
			kpiIdFromGroup: null,
			year: null,
			// hierarchyId: this._getBuildingId()
		}
	}
	_onChange() {
		this.setState({
			year: this.state.year || SingleKPIStore.getKPIDefaultYear(),
			loading: false
		});
	}
	_privilegedCustomer() {
		return getCustomerPrivilageById( this._getCustomerId() ) && getCustomerPrivilageById( this._getCustomerId() ).get('WholeCustomer');
	}
	_getBuildingId() {
		let buildingId = this.props.router.location.query.buildingId;
		if( util.isNumeric(buildingId) ) return buildingId * 1;
		return null;
	}
	_getGroupKpiId() {
		return this.props.router.location.query.groupKpiId || null;
	}
	_getKpiId() {
		return this.props.router.location.query.kpiId || null;
	}
	_validBuilding(buildingId) {
		return !!find(HierarchyStore.getBuildingList(), building => building.Id === buildingId);
	}
	_preAction(customerId) {
		if( canView() ) {
			// HierarchyAction.getBuildingListByCustomerId(customerId);
			SingleKPIAction.customerCurrentYear(customerId);
			// UserAction.getCustomerByUser(CurrentUserStore.getCurrentUser().Id);
		}
	}
	_loadInitData() {
		
	}
	_onPreAction() {

		if( SingleKPIStore.getCustomerCurrentYear() ) {
			// let hierarchyId;
			// // 从多项目点入单项目时，url记录参数，优先查询kpiid
			// if(this.state.hierarchyId) {
			// 	if(this._validBuilding(this.state.hierarchyId) && this._getKpiId()) {
			// 		hierarchyId = this.state.hierarchyId;
			// 	}
			// }
			// if( !hierarchyId ) {
			// 	// 无全客户 & 单楼 显示单楼图标
			// 	if( !this._privilegedCustomer() ) {
			// 		if( isSingleBuilding() ) {
			// 			hierarchyId = HierarchyStore.getBuildingList()[0].Id;
			// 		}
			// 	// 有全客户 & 仅查看 (能源经理) 显示多项目图标
			// 	} else if( isOnlyView() ) {
			// 		hierarchyId = this._getCustomerId();
			// 	}				
			// }
			// if( hierarchyId ) {
			// 	this.setState({
			// 		year: null,
			// 		hierarchyId,
			// 	});
			// 	SingleKPIAction.getKPIConfigured(
			// 		this._getCustomerId(), 
			// 		null, 
			// 		hierarchyId,
			// 		this._getKpiId(),
			// 		this._getKPIRank(hierarchyId));
			// 	return;
			// }
			let hierarchyId = this._getHierarchyId();
			if( hierarchyId ) {
				SingleKPIAction.getKPIConfigured(
					this._getCustomerId(), 
					null, 
					hierarchyId,
					this._getKpiId(),
					this._getKPIRank(hierarchyId));
				return;
			}
			this.setState({
				loading: false
			});
		}
	}
	_goCreate() {
		this.setState({
			showCreate: true
		});
	}
	_cancleRefreshDialog() {
		this.setState({
			showRefreshDialog: false,
			kpiId: null
		});
	}
	_reload(year = this.state.year) {
		let hierarchyId = this._getHierarchyId();
		SingleKPIAction.getKPIConfigured(
			this.props.router.params.customerId, 
			year, 
			hierarchyId,
			this._getKpiId(),
			this._getKPIRank(hierarchyId));
		this.setState({
			showRefreshDialog: false,
			showCreate: false,
			kpiId: null,
			loading: true,
		});
	}
	_preCheckThisYear(callRank) {
		return function(year) {
			if(year === SingleKPIStore.getCustomerCurrentYear() ) {
				callRank(year);
			} else {
				SingleKPIAction.notNeedRank();
			}
		}
	}
	_getKPIRank(hierarchyId) {
		let isGroup = !!getCustomerById(hierarchyId);
		let customerId = this.props.router.params.customerId;
		if(isGroup) {
			return SingleKPIAction.getCustomerRank.bind(SingleKPIAction, customerId);
		} else {
			let groupKPIId = this._getGroupKpiId();
			if(groupKPIId) {
				return this._preCheckThisYear(SingleKPIAction.getGroupKPIBuildingRank.bind(SingleKPIAction, customerId, groupKPIId, hierarchyId));
			}
			return this._preCheckThisYear(SingleKPIAction.getBuildingRank.bind(SingleKPIAction, customerId, hierarchyId));
		}
	}
	_getData(customerId, year, hierarchyId) {
		SingleKPIAction.initKPIChartData();
		SingleKPIAction.getKPIPeriodByYear(customerId, year);
		SingleKPIAction.getKPIChart(this._getKpiId(), year, hierarchyId);
		SingleKPIAction.getKPIChartSummary(customerId, year, hierarchyId, this._getKpiId());
		this._getKPIRank(hierarchyId)(year);
	}
	_getCustomerId() {
		return this.props.router.params.customerId;
	}
	_getHierarchyId() {
		return +this.props.router.location.query.hierarchyId || null;
	}
	render() {
		if( this.state.loading ) {
			return (
				<div className='jazz-kpi-actuality flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>
			);
		}
		if( !canView() ) {
			return (<TipMessage message={I18N.Kpi.Error.KPIConguredNotAnyBuilding}/>);
		}
		let wholeCustomer = this._privilegedCustomer();
		if( isOnlyView() ) {
			if( !wholeCustomer && !isSingleBuilding() ) {
				return (<TipMessage message={I18N.Kpi.Error.KPIConguredMoreBuilding}/>);
			}

			if( SingleKPIStore.chartReady() && !SingleKPIStore.getKPIChart() ) {
				return (<TipMessage message={I18N.Kpi.Error.NonKPIConguredSingleBuilding}/>);
			}
		}
		// let disabledSelectedProject = isFull() && !wholeCustomer;

		// if( this.state.showCreate ) {
		// 	return (<CreateKPI
		// 		hierarchyId={this.state.hierarchyId}
		// 		hierarchyName={getHierarchyNameById(this.state.hierarchyId)}
		// 		kpiId={this.state.kpiId}
		// 		isCreate={!this.state.kpiId}
		// 		onSave={this._reload}
		// 		onCancel={this._reload}
		// 		year={this.state.year || SingleKPIStore.getCustomerCurrentYear()}/>);
		// } else {
			// let buildingProps = {
		 //        // ref: 'commodity',
		 //        isViewStatus: false,
		 //        defaultValue: this.state.hierarchyId,
		 //        style: {
		 //        	width: 240,
		 //        	margin: '0 20px',
		 //        },
		 //        didChanged: (hierarchyId) => {
		 //        	SingleKPIAction.getKPIConfigured(
		 //        		this.props.router.params.customerId, 
		 //        		null, 
		 //        		hierarchyId,
			// 			this._getKpiId(),
		 //        		this._getKPIRank(hierarchyId));
			// 		this.setState({year: null,hierarchyId});
		 //        },
		 //        disabled: disabledSelectedProject,
		 //        textField: 'Name',
		 //        valueField: 'Id',
		 //        dataItems: [{
		 //        	Id: null,
		 //        	disabled: true,
		 //        	Name: I18N.Setting.KPI.SelectProject
		 //        }].concat(groupProjectMenuItems(this._getCustomerId()))
		 //        .concat(singleProjectMenuItems()),
		 //    };
		    // let showTitle = true,
		    // prefixTitle = '',
		    // chartData = SingleKPIStore.getKPIChart();
		    // if( this._getGroupKpiId()) {
		    // 	if( chartData && chartData.get('data').size === 1 ) {
		    // 		prefixTitle = 
		    // 			I18N.Setting.KPI.Building + 
		    // 			getHierarchyNameById(this.state.hierarchyId) + '-' + 
		    // 			chartData.getIn(['data', 0, 'name']) + '-';
		    // 	} else {
		    // 		showTitle = false;
		    // 	}
		    // }
			return (
				<div className='jazz-kpi-actuality'>
					<ActualityContent
						chartReady={SingleKPIStore.chartReady()}
						period={SingleKPIStore.getYearQuotaperiod()}
						hierarchyId={this._getHierarchyId()}
						data={SingleKPIStore.getKPIChart()}
						year={this.state.year}
						summaryData={SingleKPIStore.getKPIChartSummary()}
						onChangeYear={(year) => {
			        		this._getData(this._getCustomerId(), year, this._getHierarchyId());
							this.setState({year});
						}}
						onEdit={(Id) => {
							this.setState({
								showCreate: true,
								kpiId: Id
							});
						}}
						onRefresh={(Id) => {
							this.setState({
								showRefreshDialog: true,
								kpiId: Id
							});
						}}
					/>
					{this.state.showRefreshDialog && <UpdatePrediction
						hierarchyId={this._getHierarchyId()}
						hierarchyName={getHierarchyNameById(this._getHierarchyId())}
						kpiId={this.state.kpiId}
						isCreate={!this.state.kpiId}
						onSave={this._reload}
						onCancel={this._cancleRefreshDialog}
						year={this.state.year}/>}
				</div>
			);
		// }
	}
}
