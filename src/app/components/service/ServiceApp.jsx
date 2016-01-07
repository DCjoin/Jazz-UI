'use strict';

import React from 'react';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import MainAppBar from '../MainAppBar.jsx';
import assign from 'object-assign';
import NetworkChecker from '../../controls/NetworkChecker.jsx';

let ServiceApp = React.createClass({
  mixins: [Navigation, State],
  componentDidMount: function() {},
  render: function() {
    var menuItems = [
      {
        name: 'calendar',
        title: I18N.MainMenu.Calendar,
        children: [
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
      },
      {
        name: 'convert',
        title: I18N.MainMenu.EnergyConvert,
        children: [
          {
            name: 'price',
            title: I18N.MainMenu.Price
          },
          {
            name: 'carbon',
            title: I18N.MainMenu.Carbon
          }
        ]
      },
      {
        name: 'subline',
        title: I18N.MainMenu.EnergySubline,
        children: [
          {
            name: 'benchmark',
            title: I18N.MainMenu.IndustryBenchmark
          },
          {
            name: 'Labelling',
            title: I18N.MainMenu.Labelling
          }
        ]
      },
      {
        name: 'customer',
        title: I18N.MainMenu.Customer,
      },
      {
        name: 'UserManagement',
        title: I18N.MainMenu.User,
        children: [
          {
            name: 'user',
            title: I18N.MainMenu.User
          },
          {
            name: 'privilege',
            title: I18N.MainMenu.Privilege
          }
        ]
      }
    ];

    return (
      <div className='jazz-main'>
            <MainAppBar items={menuItems} />
            <RouteHandler {...this.props} />
            <NetworkChecker></NetworkChecker>
        </div>
      );
  },
});

module.exports = ServiceApp;
