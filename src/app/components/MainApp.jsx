'use strict';

import React from 'react';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import keyMirror from 'keymirror';
import { LeftNav, CircularProgress } from 'material-ui';
import assign from 'object-assign';
import {remove} from 'lodash';
import {find} from 'lodash';
import querystring from 'querystring';

import { viewState } from 'constants/MainAppStatus.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';

import CookieUtil from 'util/cookieUtil.jsx';
import util, { getCookie } from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';
import PrivilegeUtil from 'util/privilegeUtil.jsx';

import NetworkChecker from 'controls/NetworkChecker.jsx';
import CusFlatButton from 'controls/FlatButton.jsx';
import Dialog from 'controls/NewDialog.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';

import lang from '../lang/lang.jsx';
import ExportChart from './energy/ExportChart.jsx';
import MainAppBar from './MainAppBar.jsx';
import SelectCustomer from './SelectCustomer.jsx';

import MainAction from 'actions/MainAction.jsx';
import UserAction from 'actions/UserAction.jsx';
import HierarchyAction from 'actions/HierarchyAction.jsx';
import FolderAction from '../actions/FolderAction.jsx';

import UOMStore from 'stores/UOMStore.jsx';
import AllCommodityStore from 'stores/AllCommodityStore.jsx';
import UserStore from 'stores/UserStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';
import LoginStore from 'stores/LoginStore.jsx';
import MeasuresAction from 'actions/ECM/MeasuresAction.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import {Status} from 'constants/actionType/Measures.jsx';

function getFirstMenuPathFunc(menu) {
  let firstMenu = menu[0];
  if( !firstMenu ) {
    return function() {
      console.error('No has any menu');
    }
  }
  if(firstMenu.children && firstMenu.children.length > 0) {
    let firstChild = firstMenu.children[0];
    if(firstChild.list && firstChild.list.length > 0) {
      return firstChild.list[0].getPath;
    }
  }
  return  firstMenu.getPath;
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
      Name: I18N.Setting.KPI.Building
    }].concat(HierarchyStore.getBuildingList());
}
function groupProjectMenuItems(customerId) {
  if( !CurrentUserCustomerStore.getAll() || CurrentUserCustomerStore.getAll().length === 0 || (getCustomerPrivilageById( customerId ) && !getCustomerPrivilageById( customerId ).get('WholeCustomer')) ) {
    return [];
  }
  return [{
      Id: -1,
      disabled: true,
      Name: I18N.Kpi.GroupProject
    }].concat(getCustomerById(customerId));
}

function getCustomerPrivilageById(customerId) {
  return UserStore.getUserCustomers().find(customer => customer.get('CustomerId') === customerId * 1 );
}

function privilegeWithPushAndNotPush( privilegeCheck ) {
  // return true
	return privilegeCheck(PermissionCode.SOLUTION_FULL, CurrentUserStore.getCurrentPrivilege());
}
  //顾问
function PushAndNotPushIsFull() {
	return privilegeWithPushAndNotPush(privilegeUtil.isFull.bind(privilegeUtil));
}

function privilegeWithECM(){
  return CurrentUserStore.permit(PermissionCode.SENIOR_DATA_ANALYSE.FULL) ||
        CurrentUserStore.permit(PermissionCode.PUSH_SOLUTION.READONLY)
}

let MainApp = React.createClass({
  statics: {
    prepareShow: (customerId) => {
      return UOMStore.getUoms() &&
        AllCommodityStore.getAllCommodities() &&
        CurrentUserCustomerStore.getAll() &&
        CurrentUserStore.getCurrentPrivilege() &&
        CurrentUserStore.getCurrentUser() &&
        UserStore.getUserCustomers() &&
        ( !customerId || HierarchyStore.getBuildingList() );
    },
    needDefaultReplace: (router) => {
      if(CurrentUserStore.getCurrentUser().Id === 1) {
        return RoutePath.config(assign({}, router.params));
      }
      if( CurrentUserCustomerStore.getAll().length > 1 ) {
        return false;
      }
      let isAdmin = LoginStore.checkHasSpAdmin();
      if( CurrentUserCustomerStore.getAll().length === 1 ) {
        if( !isAdmin && CurrentUserStore.getMainMenuItems().map(menu => getFirstMenuPathFunc([menu])(router.params)).indexOf(router.getCurrentLocation().pathname) === -1 ) {
          return getFirstMenuPathFunc(CurrentUserStore.getMainMenuItems())(
            assign({}, router.params, {
              customerId: CurrentUserCustomerStore.getAll()[0].Id
            })
          );
        }
      } else if( isAdmin ) {
        if( router.params.cusnum === null || router.params.cusnum === undefined ) {
          return RoutePath.workday(assign({}, router.params, {
            cusnum: CurrentUserCustomerStore.getAll().length
          }));
        }
      }
      return false;
    },
  },
  childContextTypes: {
    hierarchyId: React.PropTypes.string,
  },
  getChildContext() {
    return {
      hierarchyId: this.state.hierarchyId,
    };
  },
  _onAllUOMSChange() {
    window.uoms = UOMStore.getUoms();
    this._onChange();
  },
  _onAllCommoditiesChange() {
    window.allCommodities = AllCommodityStore.getAllCommodities();
    this._onChange();
  },
  _getECMUnread(){
    if(this.state.hierarchyId && privilegeWithECM()){
      var statusArr=[];
      if(PushAndNotPushIsFull()){
        statusArr=[Status.Being]
      }else {
        statusArr=[Status.ToBe,Status.Done]
      }
      MeasuresAction.getContainsunread(this.state.hierarchyId,statusArr);
    }
  },
  _getDiagnoseProblem(){
    if(this.state.hierarchyId){
      DiagnoseAction.getDiagnoseStatic(this.state.hierarchyId);
    }
  },
  _dataReady: function() {
    let {router, params} = this.props,
    {customerId} = params;
    if( MainApp.prepareShow(customerId) ) {
      let defaultReplace = MainApp.needDefaultReplace(router);
      if(defaultReplace && !router.isActive(defaultReplace)) {
        router.replace(defaultReplace);
      } else {
        this.forceUpdate();
      }

      if( customerId && !this.state.hierarchyId ) {
        let WholeCustomer = getCustomerPrivilageById( customerId ) && getCustomerPrivilageById( customerId ).get('WholeCustomer');
        let initHierarchyId = router.location.query.init_hierarchy_id;
        let hierarchyId = customerId * 1;
        if(!WholeCustomer && HierarchyStore.getBuildingList()[0]) {
          hierarchyId = HierarchyStore.getBuildingList()[0].Id * 1;
        }
        this.setState({
          hierarchyId
        },()=>{
          this._getECMUnread();
          this._getDiagnoseProblem();
        });
        if( initHierarchyId ) {
          let {pathname, query} = router.location,
          search = '';
          delete query.init_hierarchy_id;
          if(Object.keys(query).length > 0) {
            search = '?' + querystring.stringify(query);
          }
          this.setState({
            hierarchyId: initHierarchyId * 1
          }, () => {
            // router.push(pathname + search );
            this._getECMUnread();
            this._getDiagnoseProblem();
          });
        }
      }
    }
  },
  _onChange: function() {
    this._dataReady();
  },

  _getCustomerId: function(customerId) {
    HierarchyAction.getBuildingListByCustomerId(customerId);
    this.setState({
      hierarchyId: null
    });
  },

  _setHierarchyId: function(hierarchyId) {
    let callback = () => {
      this.setState({
        hierarchyId
      }, () => {
        let {pathname, query} = this.props.router.location;
        query.init_hierarchy_id = hierarchyId;
        this.props.router.push(pathname + '?' + querystring.stringify(query) );
        this._getECMUnread();
        this._getDiagnoseProblem();
      });
    };
    let doned = false;
    FolderAction.checkWidgetUpdate(callback, null, () => {doned = true});
    if( !doned ) {
      callback();
    }
  },

  _renderTopSelectHierarchy: function() {
    let customerId = this.props.params.customerId;
    let isFull = PrivilegeUtil.isFull(PermissionCode.BUILDING_LIST, CurrentUserStore.getCurrentPrivilege());
    return this.state.hierarchyId && (<div className='jazz-top-select-hierarchy' style={{
          marginTop: isFull ? 10 : 20,
          marginLeft : isFull ? 10 : 30,
          color: '#fff'
        }}>
      <ViewableDropDownMenu
            isViewStatus={!isFull}
            defaultValue={this.state.hierarchyId}
            style={{
              width: 200,
              margin: '0 20px'
            }}
            labelStyle={{
              color: '#fff',
            }}
            listStyle={{
              width: 200,
            }}
            underlineStyle={{
              display: 'none',
            }}
            didChanged={this._setHierarchyId}
            disabled={!HierarchyStore.getBuildingList()
              || HierarchyStore.getBuildingList().length === 0
              || +customerId !== HierarchyStore.getBuildingList()[0].CustomerId}
            textField={'Name'}
            valueField={'Id'}
            dataItems={groupProjectMenuItems(customerId).concat(singleProjectMenuItems())}/>
    </div>);
  },

  render: function() {
    let customerId = this.props.params.customerId;
    let hierarchyId = this.state.hierarchyId;
    if(MainApp.prepareShow(customerId)) {
      if( customerId ) {
        let menuItems = CurrentUserStore.getMainMenuItems();
        if( customerId != hierarchyId ) {
          remove(menuItems, (item) => {
            return item.title === I18N.MainMenu.Map
          });
        }
        if( !hierarchyId || customerId == hierarchyId ||
          ( !PrivilegeUtil.canView(PermissionCode.PUSH_SOLUTION, CurrentUserStore.getCurrentPrivilege())
              && !PrivilegeUtil.isFull(PermissionCode.SOLUTION_FULL, CurrentUserStore.getCurrentPrivilege()) ) ) {
          remove(menuItems, (item) => {
            return item.title === I18N.MainMenu.SaveSchemeTab
          });
        }
        if(!hierarchyId || customerId == hierarchyId){
          remove(menuItems, (item) => {
            return item.title === I18N.MainMenu.SmartDiagnose
          });
        }
        return (
          <div className='jazz-main'>
            <MainAppBar
              topSelectHierarchy={this._renderTopSelectHierarchy()}
              disabledSelectCustomer={MainApp.needDefaultReplace(this.props.router)}
              items={menuItems}
              logoUrl={customerId && 'Logo.aspx?hierarchyId=' + customerId}/>
            {customerId && this.props.children}
            <NetworkChecker />
            <ExportChart />
          </div>
        );
      } else {
        return ( <SelectCustomer />);
      }
    }
    return (
      <div className='jazz-main'>
          <div style={{
        display: 'flex',
        flex: 1,
        'alignItems': 'center',
        'justifyContent': 'center'
      }}>
            <CircularProgress  mode="indeterminate" size={80} />
          </div>
        </div>
      );
  },
  componentWillMount() {
    this.state = {};
  },
  componentDidMount() {
    UOMStore.addChangeListener(this._onAllUOMSChange);
    UserStore.addChangeListener(this._onChange);
    AllCommodityStore.addChangeListener(this._onAllCommoditiesChange);
    CurrentUserStore.addCurrentrivilegeListener(this._onChange);
    CurrentUserCustomerStore.addChangeListener(this._onChange);
    CurrentUserStore.addCurrentUserListener(this._onChange);
    HierarchyStore.addBuildingListListener(this._onChange);

    MainAction.getAllUoms();
    MainAction.getAllCommodities();
    UserAction.getCustomerByUser(LoginStore.getCurrentUserId());

    if(this.props.params.customerId) {
      this._getCustomerId(this.props.params.customerId);
    }
  },
  componentWillReceiveProps(nextProps) {
    if( nextProps.params.customerId && nextProps.params.customerId !== this.props.params.customerId ) {
      this._getCustomerId(nextProps.params.customerId);
    }
  },
  componentWillUnmount: function() {
    UOMStore.removeChangeListener(this._onAllUOMSChange);
    AllCommodityStore.removeChangeListener(this._onAllCommoditiesChange);
    CurrentUserStore.removeCurrentrivilegeListener(this._onChange);
    CurrentUserCustomerStore.removeChangeListener(this._onChange);
    CurrentUserStore.removeCurrentUserListener(this._onChange);
    HierarchyStore.removeBuildingListListener(this._onChange);
  }
});

var MessageDialog = React.createClass({
  _cancelApply: function() {
    this.props.onCancel();
  },
  render: function() {
    let cancelProps = {
      onClick: this._cancelApply,
      label: I18N.Login.NoPriButton
    };
    let actions = [<CusFlatButton {...cancelProps} />];
    return (
      <Dialog title={I18N.Login.NoPriTitle} actions={actions} modal={true} open={true}  contentStyle={{
        width: '640px'
      }}>
				<div style={{fontSize:'14px'}}>{I18N.Login.NoPriDetail}</div>
			</Dialog>
      );
  }

});

module.exports = MainApp;
