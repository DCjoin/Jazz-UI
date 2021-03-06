import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import {find} from 'lodash-es';
import PropTypes from 'prop-types';
import DropdownButton from 'controls/NewDropdownButton.jsx';

import ReduxDecorator from 'decorator/ReduxDecorator.jsx';

import PermissionCode from 'constants/PermissionCode.jsx';

import util from 'util/Util.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import RoutePath from 'util/RoutePath.jsx';

import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';

import KPIActuality from './KPIActuality.jsx';
import ReportPreview from './ReportPreview.jsx';
import KPIConfigList from './Group/KPIConfigList.jsx';
import Ranking from './Group/Ranking.jsx';
import ReportConfig from './Report/ReportConfig.jsx';

import UserAction from 'actions/UserAction.jsx';
import HierarchyAction from 'actions/HierarchyAction.jsx';
import ReportAction from 'actions/ReportAction.jsx';

import HierarchyStore from 'stores/HierarchyStore.jsx';
import UserStore from 'stores/UserStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';
import ReportStore from 'stores/ReportStore.jsx';

import MenuItem from 'material-ui/MenuItem';

const CONFIG_TYPE = {
	KPI: 1,
	RANK: 2,
};

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

function isReport(props) {
	return props.router.params.type === 'report';
}


@ReduxDecorator
export default class Actuality extends Component {

	static getStores() {
		return [ReportStore, UserStore];
	};

	static calculateState(prevState) {
		return {
			buildingList: HierarchyStore.getBuildingList(),
			userCustomers: UserStore.getUserCustomers(),
			allBuildingsExistence: ReportStore.getAllBuildingsExistence(),
		};
	};

	static contextTypes = {
		hierarchyId: PropTypes.string
	};

	componentWillMount() {
		this._showReportEdit = this._showReportEdit.bind(this);
		this._removeEditPage = this._removeEditPage.bind(this);
		this._onBuildingChanged=this._onBuildingChanged.bind(this);


		this._getInitialState(this.props, this.context);
		this._loadInitData(this.props, this.context);

		if(!UserStore.getUserCustomers() || UserStore.getUserCustomers().size === 0) {
			UserAction.getCustomerByUser(CurrentUserStore.getCurrentUser().Id);
		}

	}

	componentDidMount(){
		HierarchyStore.addBuildingListListener(this._onBuildingChanged);
	}
	componentWillUnmount(){
		HierarchyStore.removeBuildingListListener(this._onBuildingChanged);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if( nextContext.hierarchyId && !util.shallowEqual(nextContext.hierarchyId, this.context.hierarchyId) || this.props.params.type !== nextProps.params.type ) {
			this._getInitialState(nextProps, nextContext);
			this._loadInitData(nextProps, nextContext);
		}
	}
	_getInitialState(props, ctx) {
		this.setState({
			edit: null,
			isCustomer: props.router.params.customerId*1 === ctx.hierarchyId,
			configType: null,
		});
	}

	_onBuildingChanged(){
		this.setState({
			buildingList: HierarchyStore.getBuildingList(),
		})
	}

	_loadInitData(props, context) {
		if( isReport(props) && canView() ) {
			this.setState({
				buildingList: null,
				userCustomers: null,
				allBuildingsExistence: null,
			});
			ReportAction.allBuildingsExistence(props.router.params.customerId);
		}
	}
	_getParams(props) {
		return props.router.params;
	}
	_getCustomerId() {
		return this.props.router.params.customerId;
	}
	_getHierarchyId(router, context) {
		return +router.location.query.init_hierarchy_id || +context.hierarchyId || null;
	}
	_getSelectedHierarchy() {
		let selectedHierarchyId = this._getHierarchyId(this.props.router, this.context);
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
		if( !this._getHierarchyId(this.props.router, this.context) ) {
			return null;
		}
		let singleKPI = this._isSingleKPI();
		let title = I18N.Kpi.KPIActual;
		let prefixTitle = '';
		// let kpiHide = this.state.show.kpi === false;
		// let reportHide = this.state.show.report === false;
		let isCustomer = this.state.isCustomer;
		let hasKPIEdit = isCustomer && isFull();
		var settingProps = {
      text: I18N.Common.Button.Setting,
      menuItems: [
				<MenuItem value={CONFIG_TYPE.KPI} primaryText={I18N.Setting.KPI.GroupList.Header} />,
				<MenuItem value={CONFIG_TYPE.RANK} primaryText={I18N.Setting.KPI.Group.Ranking.Title} />
			],
      onItemClick: (event, value)=>{
				this.setState((state, props) => {
		    			return {
		    				configType: value
		    			};
		    		});
 			 },
      buttonIcon: 'icon-arrow-unfold',
      buttonStyle:{
        marginLeft:'12px',
        width: 'auto',
        paddingLeft: 5,
        paddingRight: 5,
      }
    };
		if(singleKPI) {
    		prefixTitle =
    			I18N.Setting.KPI.Building +
    			this._getSelectedHierarchy().Name + '-' +
    			this.props.router.location.query.kpiName + '-';
		}
		return (<div className='jazz-actuality-content'>
			{!isReport(this.props) && <div className='jazz-actuality-item'>
				<div className='jazz-actuality-item-title'>{prefixTitle + I18N.Kpi.KPIActual}</div>
				{hasKPIEdit && !singleKPI && <DropdownButton {...settingProps}/>}
				<KPIActuality router={this.props.router} hierarchyId={this._getHierarchyId(this.props.router, this.context)}/>
			</div>}
			{isReport(this.props) && <div className='jazz-actuality-item'>
				<div className='jazz-actuality-item-title'>{I18N.MainMenu.ActualityReport}</div>
				{isFull() &&
				<div style={{marginLeft: 5, display: 'inline-block', height: 23, verticalAlign: 'top'}}>
					<a href="javascript:void(0)" className='icon-add' onClick={() => {
				      	this._showReportEdit();
				      }}/>
			    </div>
		    	}
				<ReportPreview
					ref={'report_preview'}
					isFull={isFull()}
					preview={true}
					showAll={isCustomer}
					hasAll={this.state.allBuildingsExistence}
					showReportEdit={this._showReportEdit}
					router={this.props.router}
					hierarchyId={this._getHierarchyId(this.props.router, this.context)}/>
			</div>}
		</div>);
	}
	_renderEditPage() {
		if(this.state.edit && this._getHierarchyId(this.props.router, this.context)) {
			let {type, data} = this.state.edit,
			content = null;
			if( type === 'report' ) {
				content = (<ReportConfig
								hierarchyId={this._getHierarchyId(this.props.router, this.context)}
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
	_renderConfig() {
		let configType = this.state.configType,
		props = {
			customerId: this.props.router.params.customerId * 1,
			onClose: () => {
				this.setState(() => {
					return {configType: null};
				});
			},
		};
		if( configType === CONFIG_TYPE.KPI ) {
			return (<KPIConfigList {...props} />);
		} else if( configType === CONFIG_TYPE.RANK ) {
			return (<Ranking {...props} />);
		}
		return null
	}
	render() {
		let {buildingList, userCustomers} = this.state,
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
		// if( show.kpi === false && show.report === false ) {
		// 	message = I18N.Kpi.Error.NonKPIConguredSingleBuilding;
		// }
		if( message ) {
			return (<TipMessage message={message}/>);
		}
		let {router} = this.props,
		hierarchyId = this._getHierarchyId(this.props.router, this.context);
		return (
			<div className='jazz-actuality'>
				{!hierarchyId && (<div className='flex-center'><b>{I18N.Kpi.Error.SelectBuilding}</b></div>)}
				{!this.state.configType && this._renderActuality()}
				{!this.state.configType && this._renderEditPage()}
				{this._renderConfig()}
			</div>
		);
	}
}
