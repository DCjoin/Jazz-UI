import React, { Component } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import assign from 'object-assign';
import {findLastIndex, fill, map} from 'lodash';
import {find} from 'lodash';
import {sum} from 'lodash';
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
import CreateKPI from './Single/KPI.jsx';
import UpdatePrediction from './Single/UpdatePrediction.jsx';

import minHeightHOC from '../../decorator/minHeightHOC.jsx';

const MinHeight400 = minHeightHOC('div', 400);

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
		let {data, summaryData, period, year, onChangeYear, customerId, hierarchyId, onEdit, onRefresh, chartReady} = this.props,
		message;
		if( !chartReady ) {
			return (<div className="content flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>);
		}
		if( isFull() ) {
			if( !data ) {
				if( hierarchyId === customerId ) {
					message = I18N.Kpi.Error.NonKPICongured;
				} else {
					message = I18N.Kpi.Error.NonKPIConguredInBuilding;
				}
			}
		}
		if( message ) {
			return (<TipMessage message={message}/>);
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
	return (<MinHeight400 className='jazz-kpi-actuality flex-center'><b>{props.message}</b></MinHeight400>)
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

		SingleKPIStore.addPreListener(this._onPreAction);
		SingleKPIStore.addChangeListener(this._onChange);
	}
	componentWillReceiveProps(nextProps) {
		if( !util.shallowEqual(nextProps.router.params, this.props.router.params)
		 || this.props.hierarchyId !== nextProps.hierarchyId ) {
			this._preAction(nextProps.router.params.customerId);
		}
	}
	componentWillUnmount() {
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
		}
	}
	_onChange() {
		let configCB = this.props.configCB;
		if( configCB ) {
			if( SingleKPIStore.chartReady() && !SingleKPIStore.getKPIChart() ) {
				configCB('kpi', false);
			} else {
				configCB('kpi', true);
			}
		}
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
			SingleKPIAction.customerCurrentYear(customerId);
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
		return +this.props.hierarchyId || null;
	}
	render() {
		if( this.state.loading ) {
			return (
				<MinHeight400 className='jazz-kpi-actuality flex-center'><CircularProgress  mode="indeterminate" size={80} /></MinHeight400>
			);
		}
		if( !canView() ) {
			return (<TipMessage message={I18N.Kpi.Error.KPIConguredNotAnyBuilding}/>);
		}
		let wholeCustomer = this._privilegedCustomer();
		return (
			<MinHeight400 className='jazz-kpi-actuality'>
				<ActualityContent
					chartReady={SingleKPIStore.chartReady()}
					period={SingleKPIStore.getYearQuotaperiod()}
					customerId={+this._getCustomerId()}
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
			</MinHeight400>
		);
	}
}
