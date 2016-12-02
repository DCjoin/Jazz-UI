'use strict';

import querystring from 'querystring';

import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from "react-tap-event-plugin";

import {Router, hashHistory} from 'react-router';

import assign from 'object-assign';
//import * as polyfill from 'babel/polyfill';
// require("babel-polyfill");
import BlankPage from './components/BlankPage.jsx';
import JazzApp from './components/JazzApp.jsx';
import SelectCustomer from './components/SelectCustomer.jsx';
import Login from './components/Login.jsx';
import MainApp from './components/MainApp.jsx';
import resetPSWApp from './components/resetPSWApp.jsx';
import demoLoginApp from './components/DemoLogin.jsx';
import initChangePSWApp from './components/initChangePSW.jsx';
import contactusApp from './components/ContactUS.jsx';
import KPI from './components/KPI';
import MapPanel from './components/map/MapPanel.jsx';
import Alarm from './components/alarm/Alarm.jsx';
import Setting from './components/setting/Setting.jsx';
import Mail from './components/mail/Mail.jsx';
import Report from './components/report/Report.jsx';
import Template from './components/report/Template.jsx';
import { getCookie } from './util/Util.jsx';
import RoutePath from './util/RoutePath.jsx';
import { Styles } from 'material-ui';
// let {ThemeManager} = Styles;
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
import KPICycle from './components/customerSetting/KPICycle';
//for hierarchySetting
import Hierarchy from './components/hierarchySetting/Hierarchy.jsx';
import HierarchyLog from './components/hierarchySetting/importLog/HierarchyLog.jsx';
// var theme = new ThemeManager();
import './less/main.less';
let {Route, DefaultRoute, Redirect, RouteHandler, Link, Navigation, State} = Router;

// window._tempUserInfo = getCookie('UserInfo');
// if(window._tempUserInfo){
//   window.currentUserId = JSON.parse(getCookie('UserInfo')).Id;
// }else {
//   window.currentUserId = getCookie('UserId');
// }
// window.currentCustomerId = getCookie('currentCustomerId');
// window.toMainApp = null;

window.currentUserId = getCookie('UserId');
window.currentCustomerId = getCookie('currentCustomerId');
window.toMainApp = null;
injectTapEventPlugin();
function getLessVar(name) {
  return main["@" + name];
}

// var routes = (
//     <Route name="app" path="/:lang?" handler={JazzApp}>
//       <Route name="login" path="login" handler={Login}/>
//       <Route name="contactus" path="contactus" handler={contactusApp}/>
//       <Route name="resetPSW" path="u=:user&t=:token&a=resetpwd&lang=:lang" handler={resetPSWApp}/>
//       <Route name="demoLogin" path="u=:user&t=:token&a=demologin&lang=:lang" handler={demoLoginApp}/>
//       <Route name="initChangePSW" path="u=:user&t=:token&a=initpwd&lang=:lang" handler={initChangePSWApp}/>
//       <Route name="main" path=":customerId?" handler={MainApp}>
//         <Route name='map' path='map' handler={MapPanel}></Route>
//         <Route name="alarm" path="alarm" handler={Alarm}></Route>
//         <Route name="setting" path="setting" handler={Setting}></Route>
//         <Route name="dailyReport" path="dailyReport" handler={Report}></Route>
//         <Route name="template" path="template" handler={Template}></Route>
//         <Route name="ptag" path="ptag" handler={PTag}></Route>
//         <Route name="vtag" path="vtag" handler={VTag}></Route>
//         <Route name="vee" path="vee" handler={VEE}></Route>
//         <Route name="log" path="log" handler={TagLog}></Route>
//         <Route name="customerLabeling" path="customerLabeling" handler={Label}></Route>
//         <Route name="hierNode" path="hierNode" handler={Hierarchy}></Route>
//         <Route name="hierLog" path="hierLog" handler={HierarchyLog}></Route>
//       </Route>
//       <Route name="platform" path="platform" handler={PlatformApp}>
//         <Route name='config' path='config' handler={Platform}></Route>
//         <Route name="mail" path="mail" handler={Mail}></Route>
//       </Route>
//       <Route name="service" path="service/:cusnum" handler={ServiceApp}>
//         <Route name="workday" path="workday" handler={WorkDay}></Route>
//         <Route name="worktime" path="worktime" handler={WorkTime}></Route>
//         <Route name="coldwarm" path="coldwarm" handler={ColdWarm}></Route>
//         <Route name="daynight" path="daynight" handler={DayNight}></Route>

//         <Route name='price' path='price' handler={Tariff}></Route>
//         <Route name='carbon' path='carbon' handler={Carbon}></Route>

//         <Route name='benchmark' path='benchmark' handler={Benchmark}></Route>
//         <Route name='labeling' path='labeling' handler={Labeling}></Route>

//         <Route name="customer" path="customer" handler={Customer}></Route>
//         <Route name="user" path="user" handler={User}></Route>
//         <Route name="privilege" path="privilege" handler={Role}></Route>
//       </Route>
//     </Route>
// );

/*Router.run(routes, Router.HashLocation, (Root, state) => {
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

});*/
const SUPPORT_LANGUAGES = {
  'zh-cn': true,
  'en-us': true,
};
function loadLanguage({location, params, routes}, replace, callback) {
  let lang = params.lang;
  if( !lang || !SUPPORT_LANGUAGES[lang] ) {
    if( location.query.langNum === '0' ) {
      lang = 'zh-cn';
    } else if( location.query.langNum === '1' ) {
      lang = 'en-us';
    } else {
      lang = window.navigator.language.toLowerCase();
    }
  }
  require(['./lang/' + lang + '.js'], function(i18n) {
    window.I18N = i18n;
    if( params.lang !== lang ) {
      replace(RoutePath.base({lang}));
    }
    callback();
  });
}
function isLogin(global) {
  return !!window.currentUserId;
}

function checkAuth({location, params, routes}, replaceState) {
  if( !isLogin(window) && routes.reduce((prev, curr) => {return prev||curr._auth;}, false)) {
    replaceState(RoutePath.login(params) + '?' + querystring.stringify({
      next: location.pathname
    }) );
  }
}
ReactDom.render(<Router history={hashHistory} routes={{
  path: '/',
  onEnter: loadLanguage,
  childRoutes: [{
    path: ':lang',
    component: JazzApp,
    onEnter: checkAuth,
    indexRoute: {
      onEnter: (router, replaceState) => {
        if( !isLogin(window) ) {
          replaceState(RoutePath.login(router.params));
        } else {
          if(MainApp.prepareShow()) {
            let defaultReplace = MainApp.needDefaultReplace(router);
            if(defaultReplace) {
              replaceState(defaultReplace);
            }
          }
        }
      },
      component: MainApp,
    },
    childRoutes: [{
      path: 'login',
      component: Login
    }, {
      path: 'contactus',
      component: contactusApp
    }, {
      path: 'u=:user&t=:token&a=resetpwd&lang=:lang2',
      component: resetPSWApp
    }, {
      path: 'u=:user&t=:token&a=demologin&lang=:lang2',
      component: demoLoginApp
    }, {
      path: 'u=:user&t=:token&a=initpwd&lang=:lang2',
      component: initChangePSWApp
    }, {
      _auth: true,
      path: '(:customerId)',
      component: MainApp,
      childRoutes: [
        {
          path: 'blankPage',
          component: BlankPage
        },{
        path: 'kpi',
        component: KPI
      }, {
        path: 'map',
        component: MapPanel
      }, {
        path: 'alarm',
        component: Alarm
      }, {
        path: 'setting',
        component: Setting
        //component: KPI
      }, {
        path: 'dailyReport',
        component: Report
      }, {
        path: 'template',
        component: Template
      }, {
        path: 'ptag',
        component: PTag
      }, {
        path: 'vtag',
        component: VTag
      }, {
        path: 'vee',
        component: VEE
      }, {
        path: 'log',
        component: TagLog
      }, {
        path: 'customerLabeling',
        component: Label
      }, {
        path: 'hierNode',
        component: Hierarchy
      }, {
        path: 'hierLog',
        component: HierarchyLog
      }, {
        path: 'KPICycle',
        component: KPICycle
      }, ]
    }, {
      _auth: true,
      path: 'platform',
      component: PlatformApp,
      childRoutes: [{
        path: 'config',
        component: Platform
      }, {
        path: 'mail',
        component: Mail
      }]
    }, {
      path: 'service/:cusnum',
      component: ServiceApp,
      indexRoute: {
        component: MainApp,
      },
      _auth: true,
      childRoutes: [{
        path: 'workday',
        component: WorkDay
      }, {
        path: 'worktime',
        component: WorkTime
      }, {
        path: 'coldwarm',
        component: ColdWarm
      }, {
        path: 'daynight',
        component: DayNight
      }, {
        path: 'price',
        component: Tariff
      }, {
        path: 'carbon',
        component: Carbon
      }, {
        path: 'benchmark',
        component: Benchmark
      }, {
        path: 'labeling',
        component: Labeling
      }, {
        path: 'customer',
        component: Customer
      }, {
        path: 'user',
        component: User
      }, {
        path: 'privilege',
        component: Role
      }]
    }]
  }]
}} />, document.getElementById('emopapp'));
