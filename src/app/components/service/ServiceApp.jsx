'use strict';

import React from 'react';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import MainAppBar from '../MainAppBar.jsx';
import assign from 'object-assign';
import NetworkChecker from '../../controls/NetworkChecker.jsx';
import CookieUtil from '../../util/cookieUtil.jsx';
import { getCookie } from '../../util/Util.jsx';

let ServiceApp = React.createClass({
  //mixins: [Navigation, State],

  _redirectRouter : function(target, params) {
      if (!target) {
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
    window.currentCustomerId = getCookie('currentCustomerId');
    window.toMainApp = true;
    if(this.props.params.cusnum && this.props.params.cusnum > 0){
      this._redirectRouter({
          name: 'map',
          title: I18N.MainMenu.Map
      },assign({}, this.props.params, {customerId: window.currentCustomerId}));
    }
  },

  render: function() {
    var menuItems = [
      {
        name: 'calendar',
        title: I18N.MainMenu.Calendar,
        children: [{
          list: [
            {
              name: 'workday',
              title: I18N.MainMenu.WorkdaySetting
            },
            {
              name: 'worktime',
              title: I18N.MainMenu.WorktimeSetting
            },
            {
              name: 'coldwarm',
              title: I18N.MainMenu.ColdwarmSetting
            },
            {
              name: 'daynight',
              title: I18N.MainMenu.DaynightSetting
            }
          ]
        }]
      },
      {
        name: 'convert',
        title: I18N.MainMenu.EnergyConvert,
        children: [{
          list: [
            {
              name: 'price',
              title: I18N.MainMenu.Price
            },
            {
              name: 'carbon',
              title: I18N.MainMenu.Carbon
            }
          ]
        }]
      },
      {
        name: 'statistics',
        title: I18N.MainMenu.Statistics,
        children: [{
          list: [
            {
              name: 'benchmark',
              title: I18N.MainMenu.Benchmark
            },
            {
              name: 'labeling',
              title: I18N.MainMenu.Labeling
            }
          ]
        }]
      },
      {
        name: 'customer',
        title: I18N.MainMenu.Customer,
      },
      {
        name: 'userManagement',
        title: I18N.MainMenu.User,
        children: [{
          list: [
            {
              name: 'user',
              title: I18N.MainMenu.User
            },
            {
              name: 'privilege',
              title: I18N.MainMenu.Privilege
            }
          ]
        }]
      }
    ];

    return (
      <div className='jazz-main'>
            <MainAppBar items={menuItems} title={I18N.Setting.SPManagement}  showCustomerList={this._showCustomerList}/>
            {this.props.children}
            <NetworkChecker></NetworkChecker>
        </div>
      );
  },
});

module.exports = ServiceApp;
