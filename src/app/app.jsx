'use strict';

import React from 'react';

import Router  from 'react-router';
import injectTapEventPlugin from "react-tap-event-plugin";

import JazzApp from './components/JazzApp.jsx';
import MainApp from './components/MainApp.jsx';
import Alarm from './components/alarm/Alarm.jsx';
import Setting from './components/setting/Setting.jsx';
import {getCookie} from './util/Util.jsx';

import './less/main.less';

let { Route, DefaultRoute, Redirect, RouteHandler, Link,Navigation,State } = Router;

injectTapEventPlugin();

window.currentUserId = getCookie('currentUserId');
window.currentCustomerId = getCookie('currentCustomerId');

var routes = (
    <Route name="app" path="/:lang?" handler={JazzApp}>
      <Route name="main" path="main" handler={MainApp}>
        <Route name="alarm" path="alarm" handler={Alarm}>
        </Route>
        <Route name="setting" path="setting" handler={Setting}>
        </Route>
      </Route>
   </Route>
);

Router.run(routes, Router.HashLocation, (Root, state) => {
    //var muiTheme=theme.getCurrentTheme();
    var muiTheme=null;
    React.render(<Root {...state} muiTheme={muiTheme} />, document.getElementById('emopapp'));

});
