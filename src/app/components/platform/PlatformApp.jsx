'use strict';

import React from 'react';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import MainAppBar from '../MainAppBar.jsx';
import assign from 'object-assign';
import NetworkChecker from '../../controls/NetworkChecker.jsx';
import PlatformAction from '../../actions/PlatformAction.jsx';

let PlatformApp = React.createClass({
  mixins: [Navigation, State],
  componentDidMount: function() {
    PlatformAction.getServiceProviders('Name', 0);
  },
  render: function() {
    var menuItems = [
      {
        name: 'config',
        title: I18N.Platform.Config
      }
    ];
    var title = I18N.Platform.Title;

    return (
      <div className='jazz-main'>
            <MainAppBar items={menuItems} title={title} />
            <RouteHandler {...this.props} />
            <NetworkChecker></NetworkChecker>
        </div>
      );
  },
});

module.exports = PlatformApp;
