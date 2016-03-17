'use strict';

import React from 'react';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import MainAppBar from './MainAppBar.jsx';
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

  render: function() {
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
            children: [
              {
                name: 'dailyReport',
                title: I18N.MainMenu.DailyReport
              },
              {
                name: 'template',
                title: I18N.MainMenu.Template
              }
            ]
          }
        );
      }
      if (this.state.rivilege.indexOf('1208') > -1 || this.state.rivilege.indexOf('1217') > -1) {
        var customerChildren = [];
        if (this.state.rivilege.indexOf('1208') > -1) {
          customerChildren = [
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
          ];
          if (this.state.rivilege.indexOf('1217') > -1) {
            customerChildren.push({
              name: 'customerLabeling',
              title: I18N.MainMenu.CustomizedLabeling
            });
          }
        }
        if (customerChildren.length !== 0) {
          menuItems.push(
            {
              name: 'customerSetting',
              title: I18N.MainMenu.CustomerSetting,
              children: customerChildren
            }
          );
        }
      }
      var logoUrl = 'Logo.aspx?hierarchyId=' + window.currentCustomerId;
      return (
        <div className='jazz-main'>
              <MainAppBar items={menuItems} logoUrl={logoUrl} />
              <RouteHandler {...this.props} />
              <NetworkChecker></NetworkChecker>
              <ExportChart></ExportChart>
          </div>
        );
    } else {
      return (
        <div className='jazz-main'>
          <div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center'
        }}>
        <CircularProgress  mode="indeterminate" size={2} />
        </div>
          </div>
        );
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
