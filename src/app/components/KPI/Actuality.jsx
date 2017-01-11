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
import ReportConfig from './Group/ReportConfig.jsx';

import UserAction from 'actions/UserAction.jsx';
import HierarchyAction from 'actions/HierarchyAction.jsx';
// import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx';

import HierarchyStore from 'stores/HierarchyStore.jsx';
import UserStore from 'stores/UserStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';

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

@ReduxDecorator
export default class Actuality extends Component {

	static getStores() {
		return [{
			store: HierarchyStore,
			add: ['addBuildingListListener'],
			remove: ['removeBuildingListListener'],
		}, UserStore];
	}

	static calculateState(prevState) {
		return {
			buildingList: HierarchyStore.getBuildingList(),
			userCustomers: UserStore.getUserCustomers(),
		};
	}

	componentWillMount() {
		this._loadInitData(this.props, this.context);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if( nextProps.router.params !== this.props.router.params ) {
			this._loadInitData(nextProps, nextContext);
		}
	}
	_loadInitData(props, context) {
		if( canView() ) {
			HierarchyAction.getBuildingListByCustomerId(props.router.params.customerId);
			UserAction.getCustomerByUser(CurrentUserStore.getCurrentUser().Id);
		}
	}
	_getParams(props) {
		return props.router.params;
	}
	_getHierarchyId(props) {
		return +props.router.location.query.hierarchyId || null;
	}
	_routerPush(path) {
		this.props.router.push(path);
	}
	_renderActuality() {
		if( !this._getHierarchyId(this.props) ) {
			return null;
		}
		return (<div className='jazz-actuality-content'>
			<div className='jazz-actuality-item'>
				<div className='jazz-actuality-item-title'>{I18N.Kpi.KPIActual}</div>
				{isFull() &&
		    	<IconButton iconClassName="fa icon-edit" onClick={() => {
			      	// onRefresh(data.get('id'));
			      }}/>}
				{/*<KPIActuality router={this.props.router} hierarchyId={this._getHierarchyId(this.props)}/>*/}
			</div>
			<div className='jazz-actuality-item'>
				<div className='jazz-actuality-item-title'>{'报表'}</div>
				{isFull() &&
		    	<IconButton iconClassName="fa icon-add" onClick={() => {
			      	this._showReportEdit();
			      }}/>}
				<ReportPreview 
					showReportEdit={this._showReportEdit}
					router={this.props.router} 
					hierarchyId={this._getHierarchyId(this.props)}/>
			</div>
		</div>);
	}
	_renderEditPage() {
		if(this.state.edit) {
			let {type, data} = this.state.edit;
			content = null;
			if( type === 'kpi' ) {
				content = (<ConfigMenu {...this.props.router}>
				</ConfigMenu>);
			}
			if( type === 'report' ) {
				content = (<ReportConfig 
								hierarchyName={''} 
								report={data} 
								onSave={() => {}} 
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
				data: data,
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
				{isFull() && <ViewableDropDownMenu {...buildingProps}/>}
				{!hierarchyId && (<div className='flex-center'><b>{I18N.Kpi.Error.SelectBuilding}</b></div>)}
				{this._renderActuality()}
				{this._renderEditPage()}
			</div>
		);
	}
}
