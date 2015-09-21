'use strict';

import React from 'react';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import MainMenu from './MainMenu.jsx';
import lang from '../lang/lang.jsx';
import keyMirror from 'keymirror';
import { LeftNav } from 'material-ui';
import assign from 'object-assign';
import UOMStore from '../stores/UOMStore.jsx';
import AllCommodityStore from '../stores/AllCommodityStore.jsx';
import MainAction from '../actions/MainAction.jsx';
import NetworkChecker from '../controls/NetworkChecker.jsx';
import ExportChart from './energy/ExportChart.jsx';

let MainApp = React.createClass({
  mixins: [Navigation, State],

  _onAllUOMSChange() {
    window.uoms = UOMStore.getUoms();
  },
  _onAllCommoditiesChange() {
    window.allCommodities = AllCommodityStore.getAllCommodities();
  },

  render: function() {
    var menuItems = [
      {
        name: 'map',
        title: I18N.MainMenu.Map,
        disabled: true
      },
      {
        name: 'alarm',
        title: I18N.MainMenu.Alarm
      },
      {
        name: 'setting',
        title: I18N.MainMenu.Energy
      },
      {
        name: 'report',
        title: I18N.MainMenu.report,
        disabled: true
      }
    ];

    var logoUrl = 'Logo.aspx?hierarchyId=' + window.currentCustomerId;

    return (
      <div className='jazz-main'>
            <MainMenu items={menuItems} logoUrl={logoUrl} />
            <RouteHandler {...this.props} />
            <NetworkChecker></NetworkChecker>
            <ExportChart></ExportChart>
        </div>
      );
  },
  componentDidMount() {
    UOMStore.addChangeListener(this._onAllUOMSChange);
    AllCommodityStore.addChangeListener(this._onAllCommoditiesChange);
    MainAction.getAllUoms();
    MainAction.getAllCommodities();
  },
  componentWillUnmount: function() {
    UOMStore.removeChangeListener(this._onAllUOMSChange);
    AllCommodityStore.removeChangeListener(this._onAllCommoditiesChange);
  }
});

module.exports = MainApp;
