'use strict';

import React from 'react';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import keyMirror from 'keymirror';
import { LeftNav, CircularProgress } from 'material-ui';
import assign from 'object-assign';
import {find} from 'lodash/collection';

import { viewState } from 'constants/MainAppStatus.jsx';

import CookieUtil from 'util/cookieUtil.jsx';
import util, { getCookie } from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';

import NetworkChecker from 'controls/NetworkChecker.jsx';
import CusFlatButton from 'controls/FlatButton.jsx';
import Dialog from 'controls/NewDialog.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';

import lang from '../lang/lang.jsx';
import ExportChart from './energy/ExportChart.jsx';
import MainAppBar from './MainAppBar.jsx';
import SelectCustomer from './SelectCustomer.jsx';

import MainAction from 'actions/MainAction.jsx';
import HierarchyAction from 'actions/HierarchyAction.jsx';

import UOMStore from 'stores/UOMStore.jsx';
import AllCommodityStore from 'stores/AllCommodityStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';
import LoginStore from 'stores/LoginStore.jsx';

function getFirstMenuPathFunc(menu) {
  let firstMenu = menu[0];
  if( !firstMenu ) {
    return function() {
      console.err('No has any menu');
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
  if( !CurrentUserCustomerStore.getAll() || CurrentUserCustomerStore.getAll().length === 0 ) {
    return [];
  }
  return [{
      Id: -1,
      disabled: true,
      Name: I18N.Kpi.GroupProject
    }].concat( getCustomerById(customerId) );
}

let MainApp = React.createClass({
  statics: {
    prepareShow: (customerId) => {
      return UOMStore.getUoms() && 
        AllCommodityStore.getAllCommodities() && 
        CurrentUserCustomerStore.getAll() && 
        CurrentUserStore.getCurrentPrivilege() && 
        CurrentUserStore.getCurrentUser() &&
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
        if( !isAdmin ) {
          return getFirstMenuPathFunc(CurrentUserStore.getMainMenuItems())(
            assign({}, router.params, {
              customerId: CurrentUserCustomerStore.getAll()[0].Id
            })
          );
        }
      } else if( isAdmin ) {
        return RoutePath.workday(assign({}, router.params, {
          cusnum: CurrentUserCustomerStore.getAll().length
        }));
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

  _dataReady: function() {
    if( MainApp.prepareShow(this.props.params.customerId) ) {
      let defaultReplace = MainApp.needDefaultReplace(this.props.router);
      if(defaultReplace && !this.props.router.isActive(defaultReplace)) {
        this.props.router.replace(defaultReplace);
      } else {
        this.forceUpdate();
      }
    }
  },
  _onChange: function() {
    this._dataReady();
  },

  _getCustomerId: function(customerId) {
    HierarchyAction.getBuildingListByCustomerId(customerId);
    this._setHierarchyId(+customerId);
  },

  _setHierarchyId: function(hierarchyId) {
    this.setState({
      hierarchyId
    });
  },

  _renderTopSelectHierarchy: function() {
    let customerId = this.props.params.customerId;
    if(true
      // privilegeUtil.isFull
      // && privilegeUtil.isFull(PermissionCode.SENIOR_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege())
      ) {
      return (<div className='jazz-top-select-hierarchy'>
        <ViewableDropDownMenu
              isViewStatus={false}
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
    }
    return null;
  },

  render: function() {
    let customerId = this.props.params.customerId;
    if(MainApp.prepareShow(customerId)) {
      if( customerId ) {
        return (
          <div className='jazz-main'>
            <MainAppBar
              topSelectHierarchy={this._renderTopSelectHierarchy()}
              disabledSelectCustomer={MainApp.needDefaultReplace(this.props.router)}
              items={CurrentUserStore.getMainMenuItems()}
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
    AllCommodityStore.addChangeListener(this._onAllCommoditiesChange);
    MainAction.getAllUoms();
    MainAction.getAllCommodities();
    CurrentUserStore.addCurrentrivilegeListener(this._onChange);
    CurrentUserCustomerStore.addChangeListener(this._onChange);
    CurrentUserStore.addCurrentUserListener(this._onChange);
    HierarchyStore.addBuildingListListener(this._onChange);
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
    HierarchyStore.removeCurrentUserListener(this._onChange);
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
