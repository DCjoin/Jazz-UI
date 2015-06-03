'use strict';

import React from 'react';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import MainMenu from './MainMenu.jsx';
import lang from '../lang/lang.jsx';
import keyMirror from 'keymirror';
import {LeftNav} from 'material-ui';
import assign from 'object-assign';


let MainApp = React.createClass({
    mixins:[Navigation,State],

render: function () {
  var   menuItems = [
          {
            name:'alarm',
            title:'报警'
          },
          {
            name:'setting',
            title:'报警设置'
          }
      ];

  var logoUrl="http://112.124.7.117/v1.9.1.299/hardcore/simple/sejazz-test/img-logo-100001";

      return (
        <div className='jazz-main'>
            <MainMenu items={menuItems} logoUrl={logoUrl} />
            <RouteHandler {...this.props} />
        </div>
      );
  }
});

module.exports = MainApp;
