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

const TipMessage = (props, context, updater) => {
	return (<div className='jazz-actuality flex-center'><b>{props.message}</b></div>)
}


@ReduxDecorator
export default class Actuality extends Component {

	static getStores() {
		return [/*{
			store: HierarchyStore,
			add: ['addBuildingListListener'],
			remove: ['removeBuildingListListener'],
		},*/ /*UserStore, */ReportStore];
	};

	static calculateState(prevState) {
		return {
			buildingList: HierarchyStore.getBuildingList(),
			userCustomers: UserStore.getUserCustomers(),
			allBuildingsExistence: ReportStore.getAllBuildingsExistence(),
		};
	};

	static contextTypes = {
		hierarchyId: React.PropTypes.string
	};

	componentWillMount() {
		this._configCB = this._configCB.bind(this);
		this._onPreActopn = this._onPreActopn.bind(this);
		this._showReportEdit = this._showReportEdit.bind(this);
		this._removeEditPage = this._removeEditPage.bind(this);

		// HierarchyStore.addBuildingListListener(this._onPreActopn);
		UserStore.addChangeListener(this._onPreActopn);

		this._getInitialState(this.props);
		this._loadInitData(this.props, this.context);

	}
	componentWillReceiveProps(nextProps, nextContext) {
		if( !util.shallowEqual(nextContext.hierarchyId, this.context.hierarchyId) ) {
			this._getInitialState(nextProps);
			this._loadInitData(nextProps, nextContext);
		} else if(!this._getHierarchyId(nextContext)) {
			this._onPreActopn();
		}
	}
	componentWillUnmount() {		
		// HierarchyStore.removeBuildingListListener(this._onPreActopn);
		// UserStore.removeChangeListener(this._onPreActopn);
	}
	_getInitialState(props) {
		this.setState({
			edit: null,
			show: isFull() ? {
					kpi: true,
					report: true,
				} : (
					props.router.location.query.kpiId ? {
						report: false,
					} : {}
				),
		});
	}
	_onPreActopn() {
		// if( this.state.userCustomers && this.state.userCustomers.size > 0 && this.state.buildingList ) {
		// 	if(this._privilegedCustomer()) {
		// 		this.props.router.push( this.props.router.location.pathname + '?hierarchyId=' + this._getCustomerId());
		// 	} else if(this.state.buildingList.length === 1){
		// 		this.props.router.push( this.props.router.location.pathname + '?hierarchyId=' + this.state.buildingList[0].Id);
		// 	}
		// }
	}
	_loadInitData(props, context) {
		if( canView() ) {
			this.setState({
				buildingList: null,
				userCustomers: null,
				allBuildingsExistence: null,
			});
			// HierarchyAction.getBuildingListByCustomerId(props.router.params.customerId);
			// UserAction.getCustomerByUser(CurrentUserStore.getCurrentUser().Id);
			ReportAction.allBuildingsExistence(props.router.params.customerId);
		}
	}
	_configCB(type, value) {
		if( this.state.show[type] !== value ) {
			this.setState({
				show: {...this.state.show, ...{
					[type]: value
				}}
			});			
		}
	}
	_getParams(props) {
		return props.router.params;
	}
	_getCustomerId() {
		return this.props.router.params.customerId;
	}
	_getHierarchyId(context) {
		return +context.hierarchyId || null;
	}
	_getSelectedHierarchy() {
		let selectedHierarchyId = this._getHierarchyId(this.context);
		return find(HierarchyStore.getBuildingList().concat(getCustomerById(this.props.router.params.customerId)), building => building.Id === selectedHierarchyId) || null;
	}
	_privilegedCustomer() {
		return getCustomerPrivilageById( this._getCustomerId() );
	}
	_isSingleKPI() {
		return this.props.router.location.query.kpiId;
	}
	_isCustomer() {
		return this.props.router.params.customerId*1 === this.context.hierarchyId;
	}
	_routerPush(path) {
		this.props.router.push(path);
	}
	_renderActuality() {
		if( !this._getHierarchyId(this.context) ) {
			return null;
		}
		let singleKPI = this._isSingleKPI();
		let title = I18N.Kpi.KPIActual;
		let prefixTitle = '';
		let kpiHide = this.state.show.kpi === false;
		let reportHide = this.state.show.report === false;
		let isCustomer = this._isCustomer();
		let hasKPIEdit = isCustomer && isFull();
		if(singleKPI) {
		    // chartData = SingleKPIStore.getKPIChart();
    		prefixTitle = 
    			I18N.Setting.KPI.Building + 
    			this._getSelectedHierarchy().Name + '-' + 
    			this.props.router.location.query.kpiName + '-';
			// title = this._getSelectedHierarchy().Name + '-' +  + '-' + I18N.Kpi.KPIActual;
		}
		return (<div className='jazz-actuality-content'>
			{!kpiHide && <div className='jazz-actuality-item'>
				<div className='jazz-actuality-item-title'>{prefixTitle + I18N.Kpi.KPIActual}</div>
				{hasKPIEdit &&
		    	<IconButton iconClassName="fa icon-edit" onClick={() => {
			      	// onRefresh(data.get('id'));
			      	this.props.router.push(RoutePath.KPIGroupConfig(this.props.router.params));
			      }}/>}
				<KPIActuality configCB={isOnlyView() && this._configCB} router={this.props.router} hierarchyId={this._getHierarchyId(this.context)}/>
			</div>}
			{!singleKPI && !reportHide && <div className='jazz-actuality-item'>
				<div className='jazz-actuality-item-title'>{'报表'}</div>
				{isFull() &&
		    	<IconButton iconClassName="fa icon-add" onClick={() => {
			      	this._showReportEdit();
			      }}/>}
				<ReportPreview 
					configCB={isOnlyView() && this._configCB}
					ref={'report_preview'}
					preview={true}
					showAll={isCustomer}
					hasAll={this.state.allBuildingsExistence}
					showReportEdit={this._showReportEdit}
					router={this.props.router} 
					hierarchyId={this._getHierarchyId(this.context)}/>
			</div>}
		</div>);
	}
	_renderEditPage() {
		if(this.state.edit && this._getHierarchyId(this.context)) {
			let {type, data} = this.state.edit,
			content = null;
			// if( type === 'kpi' ) {
			// 	content = (<ConfigMenu {...this.props.router}>
			// 	</ConfigMenu>);
			// }
			if( type === 'report' ) {
				content = (<ReportConfig 
								hierarchyId={this._getHierarchyId(this.context)}
								hierarchyName={this._getSelectedHierarchy().Name} 
								report={data} 
								onSave={(id) => {
									this.refs.report_preview.update(id);
									this._removeEditPage();
								}} 
								onCancel={this._removeEditPage}/>);
			}
			return (<div className='jazz-actuality-edit'>{content}</div>);
		}
		return null;
	}
	_renderOverlay() {
		return (<div className='jazz-actuality-overlay flex-center'><CircularProgress mode="indeterminate" size={80} /></div>)
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
		let {buildingList, userCustomers, show} = this.state,
		message;
		if( !buildingList || !userCustomers || userCustomers.size === 0 ) {
			return (<div className='jazz-actuality flex-center'><CircularProgress mode="indeterminate" size={80} /></div>); 
		}
		if( buildingList.length !== 1 ) {			
			if( this._privilegedCustomer() ) {
				if( !buildingList.length ) {
					if( isOnlyView() ) {
						message = I18N.Kpi.Error.KPINonBuilding;
					} else {
						message = I18N.Kpi.Error.KPINonBuildingAdmin;
					}
				}
			} else {
				if( buildingList.length > 1 ) {
					// message = I18N.Kpi.Error.KPIConguredMoreBuilding;
				} else {
					if( isOnlyView() ) {
						message = I18N.Kpi.Error.KPIConguredNotAnyBuilding;
					} else {
						message = I18N.Kpi.Error.KPIConguredNotAnyBuildingAdmin;
					}
					
				}				
			}
		}
		if( show.kpi === false && show.report === false ) {
			message = I18N.Kpi.Error.NonKPIConguredSingleBuilding;
		}
		if( message ) {
			return (<TipMessage message={message}/>);
		}
		let {router} = this.props,
		hierarchyId = this._getHierarchyId(this.context);
		return (
			<div className='jazz-actuality'>
				{!hierarchyId && (<div className='flex-center'><b>{I18N.Kpi.Error.SelectBuilding}</b></div>)}
				{this._renderActuality()}
				{this._renderEditPage()}
				{ (!show || Object.keys(show).length !== 2) && this._renderOverlay()}
			</div>
		);
	}
}
