'use strict';

import React from 'react';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import MainAppBar from './MainAppBar.jsx';
import SelectCustomer from './SelectCustomer.jsx';
import util from '../util/Util.jsx';

import SelectCustomerActionCreator from '../actions/SelectCustomerActionCreator.jsx';
import { viewState } from '../constants/MainAppStatus.jsx';
import CookieUtil from '../util/cookieUtil.jsx';

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


function getCurrentCustomers() {
  return CurrentUserCustomerStore.getAll();
}

function getCurrentCustomer() {
  return CurrentUserCustomerStore.getCurrentCustomer();
}

let MainApp = React.createClass({
  mixins: [Navigation, State],

  _onAllUOMSChange() {
    window.uoms = UOMStore.getUoms();
  },
  _onAllCommoditiesChange() {
    window.allCommodities = AllCommodityStore.getAllCommodities();
  },
  _onCurrentrivilegeChanged: function() {
    this.setState({
      rivilege: CurrentUserStore.getCurrentPrivilege()
    });
  },
  getInitialState: function() {
    return {
      rivilege: CurrentUserStore.getCurrentPrivilege()
    };
  },

  _redirectRouter : function(target, params) {
      if (!target) {
          //this.context.router.replaceWith(NO_PERMISSION_TIP_NAME, params);
          return;
      }
      var _redirectFunc = this.context.router.transitionTo;
      if (this.props.routes.length < 3) {
          _redirectFunc = this.context.router.replaceWith;
      }
      if (target.children && target.children.length > 0) {
          _redirectFunc(target.children[0].name, params);
      } else {
          _redirectFunc(target.name, params);
      }
  },

  _showCustomerList : function(argument) {
      this.setState({viewState: viewState.SELECT_CUSTOMER});
  },
  _closeSelectCustomer : function() {
      this.setState({viewState: viewState.MAIN});
  },
  _onChange: function(argument) {
    var params = this.props.params;
    var customerCode = params.customerId;
    //console.log('MainApp _onChange customerId:'+ this.props.params.customerId);

    var currentCustomer = getCurrentCustomer();
    if (!_.isEmpty(currentCustomer) && customerCode != currentCustomer.Id.toString()) {
      this._switchCustomer(currentCustomer);
      params.customerId = currentCustomer.Id;
      window.currentCustomerId = currentCustomer.Id;
      return;
    }

    // if(typeof(customerCode) !== "undefined"){
    // }else {
    //   params.customerId = window.currentCustomerId;
    //   this._redirectRouter(this._getMenuItems()[0], params);
    //   this.setState({viewState: viewState.MAIN});
    // }

  },
  _switchCustomer: function(customer) {
      var currentCustomer = getCurrentCustomer();

      //由于登录未完成，临时更新currentCustomerId
      CookieUtil.set('currentCustomerId', customer.Id, {'expires':5,'path':'/webhost'});

      this._redirectRouter(this._getMenuItems()[0], assign({}, this.props.params, {
        customerId: customer.Id
      }));

      this.setState({viewState: viewState.MAIN});
  },
  _getMenuItems:function(){
    var menuItems;

    if (this.state.rivilege.indexOf('1221') > -1) {
      menuItems = [
        {
          name: 'map',
          title: I18N.MainMenu.Map
        },
        {
          name: 'alarm',
          title: I18N.MainMenu.Alarm
        },
        {
          name: 'setting',
          title: I18N.MainMenu.Energy
        }
      ];
    } else {
      menuItems = [
        {
          name: 'map',
          title: I18N.MainMenu.Map
        },
        {
          name: 'setting',
          title: I18N.MainMenu.Energy
        }
      ];
    }
    if (this.state.rivilege.indexOf('1218') > -1 || this.state.rivilege.indexOf('1219') > -1) {
      menuItems.push(
        {
          name: 'report',
          title: I18N.MainMenu.Report,
          children: [{
            list: [
              {
                name: 'dailyReport',
                title: I18N.MainMenu.DailyReport
              },
              {
                name: 'template',
                title: I18N.MainMenu.Template
              }
            ]
          }]
        }
      );
    }
    if (this.state.rivilege.indexOf('1208') > -1 || this.state.rivilege.indexOf('1217') > -1) {
      var customerChildren = [];
      if (this.state.rivilege.indexOf('1208') > -1) {
        customerChildren = [{
          title: I18N.MainMenu.TagSetting,
          list: [
            {
              name: 'ptag',
              title: I18N.MainMenu.PTagManagement
            },
            {
              name: 'vtag',
              title: I18N.MainMenu.VTagManagement
            },
            {
              name: 'vee',
              title: I18N.MainMenu.VEEMonitorRule
            },
            {
              name: 'log',
              title: I18N.MainMenu.TagBatchImportLog
            }
          ]
        }, {
          title: I18N.MainMenu.HierarchySetting,
          list: [
            {
              name: 'hierNode',
              title: I18N.MainMenu.HierarchyNodeSetting
            },
            {
              name: 'hierLog',
              title: I18N.MainMenu.HierarchyLog
            }
          ]
        }];
      }
      if (this.state.rivilege.indexOf('1217') > -1) {
        customerChildren.push({
          title: I18N.MainMenu.CustomSetting,
          list: [
            {
              name: 'customerLabeling',
              title: I18N.MainMenu.CustomizedLabeling
            }
          ]
        });
      }
      menuItems.push(
        {
          name: 'customerSetting',
          title: I18N.MainMenu.CustomerSetting,
          children: customerChildren
        }
      );
    }

    return menuItems;
  },

  render: function() {
    var CustomersList = getCurrentCustomers();
    if(this.state.viewState == viewState.SELECT_CUSTOMER && CustomersList && CustomersList.length > 0){
      return(
        <SelectCustomer close={this._closeSelectCustomer}
                        currentCustomerId={parseInt(this.props.params.customerId)}
                        params={CustomersList}
                        userId={parseInt(window.currentUserId)}/>
      );
    }else{
      if (this.state.rivilege !== null) {
        var menuItems = this._getMenuItems();
        //console.log(JSON.stringify(menuItems,0,1));
        var logoUrl = 'Logo.aspx?hierarchyId=' + this.props.params.customerId;
        return (
            <div className='jazz-main'>
                <MainAppBar items={menuItems} logoUrl={logoUrl} showCustomerList={this._showCustomerList}/>
                <RouteHandler {...this.props} />
                <NetworkChecker></NetworkChecker>
                <ExportChart></ExportChart>
            </div>
          );
      } else {
        return (
          <div className='jazz-main'>
            <div style={{ display: 'flex', flex: 1, 'alignItems': 'center', 'justifyContent': 'center' }}>
              <CircularProgress  mode="indeterminate" size={2} />
            </div>
          </div>
        );
      }
    }
  },
  componentDidMount() {
    UOMStore.addChangeListener(this._onAllUOMSChange);
    AllCommodityStore.addChangeListener(this._onAllCommoditiesChange);
    MainAction.getAllUoms();
    MainAction.getAllCommodities();
    CurrentUserStore.addCurrentrivilegeListener(this._onCurrentrivilegeChanged);

    SelectCustomerActionCreator.getCustomer(window.currentUserId);
    CurrentUserCustomerStore.addChangeListener(this._onChange);

    // var params = this.getParams();
    // console.log('MainApp componentDidMount params:' + JSON.stringify(params,0,1));

  },
  componentWillUnmount: function() {
    UOMStore.removeChangeListener(this._onAllUOMSChange);
    AllCommodityStore.removeChangeListener(this._onAllCommoditiesChange);
    CurrentUserStore.removeCurrentrivilegeListener(this._onCurrentrivilegeChanged);

    CurrentUserCustomerStore.removeChangeListener(this._onChange);
  }
});

module.exports = MainApp;
