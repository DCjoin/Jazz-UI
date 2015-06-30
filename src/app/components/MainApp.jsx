'use strict';

import React from 'react';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import MainMenu from './MainMenu.jsx';
import lang from '../lang/lang.jsx';
import keyMirror from 'keymirror';
import {LeftNav} from 'material-ui';
import assign from 'object-assign';
import UOMStore from '../stores/UOMStore.jsx';
import MainAction from '../actions/MainAction.jsx';

let MainApp = React.createClass({
    mixins:[Navigation,State],

    _onAllUOMSChange(){
      window.uoms = UOMStore.getUoms();
    },

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
    },
    componentDidMount(){
      UOMStore.addChangeListener(this._onAllUOMSChange);
      MainAction.getAllUoms();
    },
    componentWillUnmount: function() {
      UOMStore.removeChangeListener(this._onAllUOMSChange);
    }
});

module.exports = MainApp;
