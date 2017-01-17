import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import {find} from 'lodash/collection';

import ReduxDecorator from '../../decorator/ReduxDecorator.jsx';

import PermissionCode from 'constants/PermissionCode.jsx';

import util from 'util/Util.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import RoutePath from 'util/RoutePath.jsx';

import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';

import KPIActuality from './KPIActuality.jsx';
import ReportPreview from './ReportPreview.jsx';
import ConfigMenu from './Group/ConfigMenu.jsx';
import ReportConfig from './Report/ReportConfig.jsx';

import UserAction from 'actions/UserAction.jsx';
import HierarchyAction from 'actions/HierarchyAction.jsx';
import ReportAction from 'actions/ReportAction.jsx';

import HierarchyStore from 'stores/HierarchyStore.jsx';
import UserStore from 'stores/UserStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';
import ReportStore from 'stores/ReportStore.jsx';

function privilegeWithIndexAndReport( privilegeCheck ) {
	return privilegeCheck(PermissionCode.INDEX_AND_REPORT, CurrentUserStore.getCurrentPrivilege());
}
function canView() {
	return privilegeWithIndexAndReport(privilegeUtil.canView.bind(privilegeUtil));
}
function isOnlyView() {
	return privilegeWithIndexAndReport(privilegeUtil.isView.bind(privilegeUtil));
}
function isFull() {
	return privilegeWithIndexAndReport(privilegeUtil.isFull.bind(privilegeUtil));
}

function getCustomerById(customerId) {
	return find(CurrentUserCustomerStore.getAll(), customer => customer.Id === customerId * 1 );
}
function getCustomerPrivilageById(customerId) {
	let customer = UserStore.getUserCustomers().find(customer => customer.get('CustomerId') === customerId * 1 );
	return customer && customer.get('WholeCustomer')
}

function singleProjectMenuItems() {
	if( !HierarchyStore.getBuildingList() || HierarchyStore.getBuildingList().length === 0 ) {
		return [];
	}
	return [{
    	Id: -2,
    	disabled: true,
    	Name: I18N.Setting.KPI.Building
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

@ReduxDecorator
export default class Actuality extends Component {

	static getStores() {
		return [{
			store: HierarchyStore,
			add: ['addBuildingListListener'],
			remove: ['removeBuildingListListener'],
		}, UserStore, ReportStore];
	}

	static calculateState(prevState) {
		return {
			buildingList: HierarchyStore.getBuildingList(),
			userCustomers: UserStore.getUserCustomers(),
			allBuildingsExistence: ReportStore.getAllBuildingsExistence(),
		};
	}

	componentWillMount() {
		this._onCheckSingleOnly = this._onCheckSingleOnly.bind(this);
		this._onGetCustomerByUser = this._onGetCustomerByUser.bind(this);
		this._loadInitData(this.props, this.context);
		this._showReportEdit = this._showReportEdit.bind(this);
		this._removeEditPage = this._removeEditPage.bind(this);
		HierarchyStore.addBuildingListListener(this._onCheckSingleOnly);
		UserStore.addChangeListener(this._onGetCustomerByUser);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if( !util.shallowEqual(nextProps.params, this.props.params) ) {
			this._loadInitData(nextProps, nextContext);
		}
	}
	componentWillUnmount() {		
		HierarchyStore.removeBuildingListListener(this._onCheckSingleOnly);
		UserStore.removeChangeListener(this._onGetCustomerByUser);
	}
	// componentWillUpdate(lastProps, lastState) {
	// 	console.log(this.state.buildingList && this.state.buildingList.length);
	// 	if( this.state.buildingList && this.state.buildingList.length === 1 && isOnlyView() &&
	// 		+this.props.router.location.query.hierarchyId !== this.state.buildingList[0].Id ) {
	// 		console.log('componentWillUpdate');
	// 	}
		
	// }
	_onCheckSingleOnly() {
		if( this.state.buildingList && this.state.buildingList.length === 1 && isOnlyView() &&
			+this.props.router.location.query.hierarchyId !== this.state.buildingList[0].Id ) {
			this.props.router.push( this.props.router.location.pathname + '?hierarchyId=' + this.state.buildingList[0].Id);
		}

	}
	_onGetCustomerByUser() {
		if( this._privilegedCustomer() && isFull() ) {
			this.props.router.push( this.props.router.location.pathname + '?hierarchyId=' + this._getCustomerId());
		}
	}
	_loadInitData(props, context) {
		if( canView() ) {
			this.setState({
				buildingList: null,
				userCustomers: null,
				allBuildingsExistence: null,
			});
			HierarchyAction.getBuildingListByCustomerId(props.router.params.customerId);
			UserAction.getCustomerByUser(CurrentUserStore.getCurrentUser().Id);
			ReportAction.allBuildingsExistence(props.router.params.customerId);
		}
	}
	_getParams(props) {
		return props.router.params;
	}
	_getCustomerId() {
		return this.props.router.params.customerId;
	}
	_getHierarchyId(props) {
		return +props.router.location.query.hierarchyId || null;
	}
	_getSelectedHierarchy() {
		let selectedHierarchyId = this._getHierarchyId(this.props);
		return find(HierarchyStore.getBuildingList().concat(getCustomerById(this.props.router.params.customerId)), building => building.Id === selectedHierarchyId) || null;
	}
	_privilegedCustomer() {
		return getCustomerPrivilageById( this._getCustomerId() );
	}
	_isSingleKPI() {
		return this.props.router.location.query.kpiId;
	}
	_routerPush(path) {
		this.props.router.push(path);
	}
	_renderActuality() {
		if( !this._getHierarchyId(this.props) ) {
			return null;
		}
		let singleKPI = this._isSingleKPI();
		let title = I18N.Kpi.KPIActual;
		let prefixTitle = '';
		if(singleKPI) {
		    // chartData = SingleKPIStore.getKPIChart();
    		prefixTitle = 
    			I18N.Setting.KPI.Building + 
    			this._getSelectedHierarchy().Name + '-' + 
    			this.props.router.location.query.kpiName + '-';
			// title = this._getSelectedHierarchy().Name + '-' +  + '-' + I18N.Kpi.KPIActual;
		}
		return (<div className='jazz-actuality-content'>
			<div className='jazz-actuality-item'>
				<div className='jazz-actuality-item-title'>{prefixTitle + I18N.Kpi.KPIActual}</div>
				{isFull() &&
		    	<IconButton iconClassName="fa icon-edit" onClick={() => {
			      	// onRefresh(data.get('id'));
			      	this.props.router.push(RoutePath.KPIGroupConfig(this.props.router.params));
			      }}/>}
				<KPIActuality router={this.props.router} hierarchyId={this._getHierarchyId(this.props)}/>
			</div>
			{!singleKPI && <div className='jazz-actuality-item'>
				<div className='jazz-actuality-item-title'>{'报表'}</div>
				{isFull() &&
		    	<IconButton iconClassName="fa icon-add" onClick={() => {
			      	this._showReportEdit();
			      }}/>}
				<ReportPreview 
					ref={'report_preview'}
					preview={true}
					hasAll={this.state.allBuildingsExistence}
					showReportEdit={this._showReportEdit}
					router={this.props.router} 
					hierarchyId={this._getHierarchyId(this.props)}/>
			</div>}
		</div>);
	}
	_renderEditPage() {
		if(this.state.edit && this._getHierarchyId(this.props)) {
			let {type, data} = this.state.edit,
			content = null;
			// if( type === 'kpi' ) {
			// 	content = (<ConfigMenu {...this.props.router}>
			// 	</ConfigMenu>);
			// }
			if( type === 'report' ) {
				content = (<ReportConfig 
								hierarchyId={this._getHierarchyId(this.props)}
								hierarchyName={this._getSelectedHierarchy().Name} 
								report={data} 
								onSave={() => {
									this.refs.report_preview.update(data && data.get('Id'));
									this._removeEditPage();
								}} 
								onCancel={this._removeEditPage}/>);
			}
			return (<div className='jazz-actuality-edit'>{content}</div>);
		}
		return null;
	}
	_removeEditPage() {
		this.setState({
			edit: null
		});
	}
	_showReportEdit(data) {
		this.setState({
			edit: {
				type: 'report',
				data: data || null,
			}
		});
	}
	render() {
		let {buildingList, userCustomers} = this.state;
		if( !buildingList || !userCustomers ) {
			return (<div className='jazz-actuality flex-center'><CircularProgress mode="indeterminate" size={80} /></div>); 
		}
		let {router} = this.props,
		hierarchyId = this._getHierarchyId(this.props),
		buildingProps = {
	        isViewStatus: false,
	        defaultValue: hierarchyId,
	        style: {
	        	width: 240,
	        	margin: '0 20px',
	        },
	        didChanged: (hierarchyId) => {
	        	this._routerPush(
	        		RoutePath.Actuality(this._getParams(this.props))
	        		+ '?hierarchyId=' + hierarchyId
	        	);
	        },
	        disabled: false,
	        textField: 'Name',
	        valueField: 'Id',
	        dataItems: [{
	        	Id: null,
	        	disabled: true,
	        	Name: I18N.Setting.KPI.SelectProject
	        }].concat(groupProjectMenuItems(router.params.customerId))
	        .concat(singleProjectMenuItems()),
	    };
		return (
			<div className='jazz-actuality'>
				{!this._isSingleKPI() && isFull() && <ViewableDropDownMenu {...buildingProps}/>}
				{!hierarchyId && (<div className='flex-center'><b>{I18N.Kpi.Error.SelectBuilding}</b></div>)}
				{this._renderActuality()}
				{this._renderEditPage()}
			</div>
		);
	}
}
