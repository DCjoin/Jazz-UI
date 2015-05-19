'use strict';

import React from 'react';

import Router  from 'react-router';
import injectTapEventPlugin from "react-tap-event-plugin";

import JazzApp from './components/JazzApp.jsx';
import MainApp from './components/MainApp.jsx';
import Alarm from './components/alarm/Alarm.jsx';
import Setting from './components/setting/Setting.jsx';

import './less/main.less';

let { Route, DefaultRoute, Redirect, RouteHandler, Link,Navigation,State } = Router;
//import {Styles} from 'material-ui';
//let {ThemeManager} = Styles;

//var theme = new ThemeManager();



//Theme.set({});

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();






var routes = (
    <Route name="app" path="/:lang?" handler={JazzApp}>
      <Route name="main" path="main" handler={MainApp}>
        <Route name="alarm" path="alarmsetting" handler={Alarm}>
        </Route>
        <Route name="setting" path="setting" handler={Setting}>
        </Route>
      </Route>
   </Route>
);



Router.run(routes, Router.HistoryLocation, (Root, state) => {
    //var muiTheme=theme.getCurrentTheme();
    var muiTheme=null;
    React.render(<Root {...state} muiTheme={muiTheme} />, document.getElementById('emopapp'));

});
