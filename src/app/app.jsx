'use strict';

import React from 'react';

import Router from 'react-router';
import injectTapEventPlugin from "react-tap-event-plugin";
//import * as polyfill from 'babel/polyfill';
require("babel-polyfill");

import JazzApp from './components/JazzApp.jsx';
import Login from './components/Login.jsx';
import MainApp from './components/MainApp.jsx';
import resetPSWApp from './components/resetPSWApp.jsx';
import demoLoginApp from './components/DemoLogin.jsx';
import contactusApp from './components/ContactUS.jsx';
import MapPanel from './components/map/MapPanel.jsx';
import Alarm from './components/alarm/Alarm.jsx';
import Setting from './components/setting/Setting.jsx';
import Mail from './components/mail/Mail.jsx';
import Report from './components/report/Report.jsx';
import Template from './components/report/Template.jsx';
import { getCookie } from './util/Util.jsx';
import { Styles } from 'material-ui';
let {ThemeManager} = Styles;
import AppTheme from './AppTheme.jsx';
import main from './less/main.less';
import Platform from './components/platform/Platform.jsx';
//import Test from './components/setting/Test.jsx';
import PlatformApp from './components/platform/PlatformApp.jsx';
//for user manage
import User from './components/userManage/user/User.jsx';
import Role from './components/userManage/role/Role.jsx';

import ServiceApp from './components/service/ServiceApp.jsx';
import WorkDay from './components/calendar/WorkDay.jsx';
import WorkTime from './components/calendar/WorkTime.jsx';
import ColdWarm from './components/calendar/ColdWarm.jsx';
import DayNight from './components/calendar/DayNight.jsx';
import Benchmark from './components/statistics/Benchmark.jsx';
import Labeling from './components/statistics/Labeling.jsx';
//for energy conversion
import Carbon from './components/energyConversion/carbon/Carbon.jsx';
import Tariff from './components/energyConversion/tariff/Tariff.jsx';
//for customer
import Customer from './components/customer/Customer.jsx';
//for customerSetting
import VEE from './components/customerSetting/VEERules/VEERules.jsx';
import PTag from './components/customerSetting/tag/PTag.jsx';
import VTag from './components/customerSetting/tag/VTag.jsx';
import TagLog from './components/customerSetting/importLog/TagLog.jsx';
import Label from './components/customerSetting/label/Label.jsx';
//for hierarchySetting
import Hierarchy from './components/hierarchySetting/Hierarchy.jsx';
import HierarchyLog from './components/hierarchySetting/importLog/HierarchyLog.jsx';
// var theme = new ThemeManager();
import './less/main.less';

let {Route, DefaultRoute, Redirect, RouteHandler, Link, Navigation, State} = Router;

injectTapEventPlugin();

window._tempUserInfo = getCookie('UserInfo');
if(window._tempUserInfo){
  window.currentUserId = JSON.parse(getCookie('UserInfo')).Id;
}else {
  window.currentUserId = getCookie('UserId');
}
window.currentCustomerId = getCookie('currentCustomerId');
window.toMainApp = null;

function getLessVar(name) {
  return main["@" + name];
}

var routes = (
    <Route name="app" path="/:lang?" handler={JazzApp}>
      <Route name="login" path="login" handler={Login}/>
      <Route name="contactus" path="contactus" handler={contactusApp}/>
      <Route name="resetPSW" path="u=:user&t=:token&a=resetpwd&lang=:lang" handler={resetPSWApp}/>
      <Route name="demoLogin" path="u=:user&t=:token&a=demologin&lang=:lang" handler={demoLoginApp}/>
      <Route name="main" path=":customerId?" handler={MainApp}>
        <Route name='map' path='map' handler={MapPanel}></Route>
        <Route name="alarm" path="alarm" handler={Alarm}></Route>
        <Route name="setting" path="setting" handler={Setting}></Route>
        <Route name="dailyReport" path="dailyReport" handler={Report}></Route>
        <Route name="template" path="template" handler={Template}></Route>
        <Route name="ptag" path="ptag" handler={PTag}></Route>
        <Route name="vtag" path="vtag" handler={VTag}></Route>
        <Route name="vee" path="vee" handler={VEE}></Route>
        <Route name="log" path="log" handler={TagLog}></Route>
        <Route name="customerLabeling" path="customerLabeling" handler={Label}></Route>
        <Route name="hierNode" path="hierNode" handler={Hierarchy}></Route>
        <Route name="hierLog" path="hierLog" handler={HierarchyLog}></Route>
      </Route>
      <Route name="platform" path="platform" handler={PlatformApp}>
        <Route name='config' path='config' handler={Platform}></Route>
        <Route name="mail" path="mail" handler={Mail}></Route>
      </Route>
      <Route name="service" path="service/:cusnum" handler={ServiceApp}>
        <Route name="workday" path="workday" handler={WorkDay}></Route>
        <Route name="worktime" path="worktime" handler={WorkTime}></Route>
        <Route name="coldwarm" path="coldwarm" handler={ColdWarm}></Route>
        <Route name="daynight" path="daynight" handler={DayNight}></Route>

        <Route name='price' path='price' handler={Tariff}></Route>
        <Route name='carbon' path='carbon' handler={Carbon}></Route>

        <Route name='benchmark' path='benchmark' handler={Benchmark}></Route>
        <Route name='labeling' path='labeling' handler={Labeling}></Route>

        <Route name="customer" path="customer" handler={Customer}></Route>
        <Route name="user" path="user" handler={User}></Route>
        <Route name="privilege" path="privilege" handler={Role}></Route>
      </Route>
    </Route>
);

Router.run(routes, Router.HashLocation, (Root, state) => {
  //var muiTheme = ThemeManager.getMuiTheme(LightRawTheme);
  //var muiTheme = ThemeManager.getMuiTheme(AppTheme.rawTheme);
  //muiTheme = AppTheme.setComponentThemes(muiTheme);
  // React.render(<Root {...state} muiTheme={muiTheme}  getLessVar={getLessVar}/>, document.getElementById('emopapp'));
  var muiTheme = ThemeManager.getMuiTheme(AppTheme);
  muiTheme.textField.focusColor = '#1ca8dd';
  muiTheme.checkbox.labelColor = "#767a7a";
  muiTheme.checkbox.labelDisabledColor = "#abafae";
  muiTheme.flatButton.disabledTextColor = '#c2c5c4';
  muiTheme.flatButton.textColor = '#1ca8dd';
  muiTheme.flatButton.primaryTextColor = '#ff4081';
  muiTheme.flatButton.secondaryTextColor = '#1ca8dd';
  muiTheme.snackbar.backgroundColor = "#323232";
  muiTheme.fontFamily = 'LantingHei sc,Microsoft YaHei Light,Microsoft YaHei';
  muiTheme.linkbutton = {
    labelStyle: {
      color: "#767a7a",
      cursor: "pointer",
      opacity: 0.9 //must have this, for right color #1ca8dd
    },
    hoverColor: "#1ca8dd",
    disableColor: "#abafae"
  };

 //console.log('state:'+JSON.stringify(state,0,1));

  React.render(
    <Root {...state} muiTheme={muiTheme}  getLessVar={getLessVar}/>,
    document.getElementById('emopapp')
  );

});
