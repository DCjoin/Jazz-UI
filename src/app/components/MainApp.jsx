'use strict';

import React from 'react';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import MainAppBar from './MainAppBar.jsx';
import SelectCustomer from './SelectCustomer.jsx';
import util from '../util/Util.jsx';

import SelectCustomerActionCreator from '../actions/SelectCustomerActionCreator.jsx';
import { viewState } from '../constants/MainAppStatus.jsx';
import CookieUtil from '../util/cookieUtil.jsx';
import { getCookie } from '../util/Util.jsx';

import lang from '../lang/lang.jsx';
import keyMirror from 'keymirror';
import { LeftNav, CircularProgress } from 'material-ui';
import assign from 'object-assign';
import UOMStore from '../stores/UOMStore.jsx';
import AllCommodityStore from '../stores/AllCommodityStore.jsx';
import MainAction from '../actions/MainAction.jsx';
import NetworkChecker from '../controls/NetworkChecker.jsx';
import ExportChart from './energy/ExportChart.jsx';
import CurrentUserStore from '../stores/CurrentUserStore.jsx';
import CurrentUserCustomerStore from '../stores/CurrentUserCustomerStore.jsx';
import LoginStore from '../stores/LoginStore.jsx';
import CurrentUserAction from '../actions/CurrentUserAction.jsx';
import LoginActionCreator from '../actions/LoginActionCreator.jsx';
import CusFlatButton from '../controls/FlatButton.jsx';
import Dialog from '../controls/NewDialog.jsx';

import RoutePath from '../util/RoutePath.jsx';

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

let MainApp = React.createClass({
  statics: {
    prepareShow: () => {
      return UOMStore.getUoms() && AllCommodityStore.getAllCommodities() && CurrentUserCustomerStore.getAll() && CurrentUserStore.getCurrentPrivilege() && CurrentUserStore.getCurrentUser();
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
  _onAllUOMSChange() {
    window.uoms = UOMStore.getUoms();
    this._onChange();
  },
  _onAllCommoditiesChange() {
    window.allCommodities = AllCommodityStore.getAllCommodities();
    this._onChange();
  },

  _dataReady: function() {
    if( MainApp.prepareShow() ) {
      let defaultReplace = MainApp.needDefaultReplace(this.props.router);
      if(defaultReplace) {
        this.props.router.replace(defaultReplace);
      } else {
        this.forceUpdate();
      }
    }
  },
  _onChange: function() {
    this._dataReady();
  },

  render: function() {
    if(MainApp.prepareShow()) {
      let customerId = this.props.router.params.customerId;
      if( customerId ) {
        return (
          <div className='jazz-main'>
            <MainAppBar
              disabledSelectCustomer={MainApp.prepareShow() && MainApp.needDefaultReplace(this.props.router)}
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
  componentDidMount() {
    UOMStore.addChangeListener(this._onAllUOMSChange);
    AllCommodityStore.addChangeListener(this._onAllCommoditiesChange);
    MainAction.getAllUoms();
    MainAction.getAllCommodities();
    CurrentUserStore.addCurrentrivilegeListener(this._onChange);
    CurrentUserCustomerStore.addChangeListener(this._onChange);
    CurrentUserStore.addCurrentUserListener(this._onChange);
  },
  componentWillUnmount: function() {
    UOMStore.removeChangeListener(this._onAllUOMSChange);
    AllCommodityStore.removeChangeListener(this._onAllCommoditiesChange);
    CurrentUserStore.removeCurrentrivilegeListener(this._onChange);
    CurrentUserCustomerStore.removeChangeListener(this._onChange);
    CurrentUserStore.removeCurrentUserListener(this._onChange);
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
