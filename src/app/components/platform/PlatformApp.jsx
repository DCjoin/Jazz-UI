'use strict';

import React from 'react';
// import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import MainAppBar from '../MainAppBar.jsx';
import assign from 'object-assign';
import NetworkChecker from '../../controls/NetworkChecker.jsx';
import PlatformAction from '../../actions/PlatformAction.jsx';

var createReactClass = require('create-react-class');
let PlatformApp = createReactClass({
  //mixins: [Navigation, State],

  // _redirectRouter : function(target, params) {
  //     if (!target) {
  //         return;
  //     }
  //     var _redirectFunc = this.context.router.transitionTo;
  //     if (this.props.routes.length < 3) {
  //         _redirectFunc = this.context.router.replaceWith;
  //     }
  //     if (target.children && target.children.length > 0) {
  //         _redirectFunc(target.children[0].name, params);
  //     } else {
  //         _redirectFunc(target.name, params);
  //     }
  // },
  // _showCustomerList : function(argument) {
  //   this._redirectRouter({
  //       name: 'map',
  //       title: I18N.MainMenu.Map
  //   },this.props.params);
  // },

  componentDidMount: function() {
    document.title = I18N.Platform.Config;
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
            <MainAppBar disabledSelectCustomer={true} items={menuItems} title={title}/>
            {this.props.children}
            <NetworkChecker></NetworkChecker>
        </div>
      );
  },
});

module.exports = PlatformApp;
