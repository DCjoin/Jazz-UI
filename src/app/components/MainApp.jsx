'use strict';

import React from 'react';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import MainAppBar from './MainAppBar.jsx';
import SelectCustomer from './SelectCustomer.jsx';

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

var viewState = keyMirror({
  SELECT_CUSTOMER: null,
  SPADMIN: null,
  MAIN: null,
  EMPTY: null,
  NO_SELECT_CUSTOMERS: null,
  NO_CURRENT_CUSTOMER: null,
  NO_ALL_CUSTOMERS: null
});

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
    console.log('1x....................');
    this.setState({
      rivilege: CurrentUserStore.getCurrentPrivilege()
    });
  },
  getInitialState: function() {
    return {
      rivilege: CurrentUserStore.getCurrentPrivilege()
    };
  },

_showCustomerList : function(argument) {
    this.setState({viewState: viewState.SELECT_CUSTOMER});
},
_closeSelectCustomer : function() {
      this.setState({viewState: viewState.MAIN});
},

  render: function() {
    console.log('开始渲染'+'this.state.viewState:' + this.state.viewState);
    console.log('viewState.SELECT_CUSTOMER' + viewState.SELECT_CUSTOMER);
    if(this.state.viewState == viewState.SELECT_CUSTOMER){
      return(
        <SelectCustomer close={this._closeSelectCustomer}/>
      );
    }else{
      var menuItems;
      if (this.state.rivilege !== null) {
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

        var logoUrl = 'Logo.aspx?hierarchyId=' + window.currentCustomerId;
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
  },
  componentWillUnmount: function() {
    UOMStore.removeChangeListener(this._onAllUOMSChange);
    AllCommodityStore.removeChangeListener(this._onAllCommoditiesChange);
    CurrentUserStore.removeCurrentrivilegeListener(this._onCurrentrivilegeChanged);
  }
});

module.exports = MainApp;
