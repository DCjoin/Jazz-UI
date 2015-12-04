'use strict';

import React from 'react';

import Router from 'react-router';
import injectTapEventPlugin from "react-tap-event-plugin";
//import * as polyfill from 'babel/polyfill';
require("babel-polyfill");

import JazzApp from './components/JazzApp.jsx';
import MainApp from './components/MainApp.jsx';
import MapPanel from './components/map/MapPanel.jsx';
import Alarm from './components/alarm/Alarm.jsx';
import Setting from './components/setting/Setting.jsx';
import Mail from './components/mail/Mail.jsx';
import Report from './components/report/Report.jsx';
import Template from './components/report/Template.jsx';
import { getCookie } from './util/Util.jsx';
import { Styles } from 'material-ui';
let {ThemeManager, LightRawTheme} = Styles;
import AppTheme from './AppTheme.jsx';
import main from './less/main.less';
import Platform from './components/platform/Platform.jsx';
import Test from './components/setting/Test.jsx';
import PlatformApp from './components/platform/PlatformApp.jsx';
// var theme = new ThemeManager();
import './less/main.less';

let {Route, DefaultRoute, Redirect, RouteHandler, Link, Navigation, State} = Router;

injectTapEventPlugin();

window.currentUserId = getCookie('currentUserId');
window.currentCustomerId = getCookie('currentCustomerId');

function getLessVar(name) {
  return main["@" + name];
}
var routes = (
<Route name="app" path="/:lang?" handler={JazzApp}>
      <Route name="main" path="main" handler={MainApp}>
        <Route name='map' path='map' handler={MapPanel}></Route>
        <Route name="alarm" path="alarm" handler={Alarm}></Route>
        <Route name="setting" path="setting" handler={Setting}></Route>
        <Route name="daily_report" path="report" handler={Report}></Route>
        <Route name="template" path="template" handler={Template}></Route>
      </Route>
      <Route name="platform" path="platform" handler={PlatformApp}>
        <Route name='config' path='config' handler={Platform}></Route>
        <Route name="mail" path="mail" handler={Mail}></Route>
      </Route>


   </Route>
);

Router.run(routes, Router.HashLocation, (Root, state) => {
  //var muiTheme = ThemeManager.getMuiTheme(LightRawTheme);
  var muiTheme = ThemeManager.getMuiTheme(AppTheme.rawTheme);
  muiTheme.flatButton.disabledTextColor = '#c2c5c4';
  muiTheme.flatButton.textColor = '#1ca8dd';
  muiTheme.flatButton.primaryTextColor = '#ff4081';
  muiTheme.flatButton.secondaryTextColor = '#1ca8dd';
  muiTheme.linkbutton = {

    labelStyle: {
      color: "#767a7a",
      cursor: "pointer",
      opacity: 0.9 //must have this, for right color #1ca8dd
    },
    hoverColor: "#1ca8dd",
    disableColor: "#abafae"

  };
  //muiTheme = AppTheme.setComponentThemes(muiTheme);
  muiTheme.fontFamily = 'LantingHei sc,Microsoft YaHei Light,Microsoft YaHei';
  React.render(<Root {...state} muiTheme={muiTheme}  getLessVar={getLessVar}/>, document.getElementById('emopapp'));

});
