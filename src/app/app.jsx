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
import Actuality from './components/KPI/Actuality.jsx';
import ReportActuality from './components/KPI/ReportActuality.jsx';
import KPIConfig from './components/KPI/Group/ConfigMenu.jsx';
import KPIConfigList from './components/KPI/Group/KPIConfigList.jsx';
import KPIRanking from './components/KPI/Group/Ranking.jsx';
import KPITemplate from './components/KPI/Report/Template.jsx';
import MapPanel from './components/map/MapPanel.jsx';
import Alarm from './components/alarm/Alarm.jsx';
import Setting from './components/setting/Setting.jsx';
import Mail from './components/mail/Mail.jsx';

// import Report from './components/report/Report.jsx';
import DataAnalysis from './components/DataAnalysis';
import AnalysisPanel from './components/DataAnalysis/Basic/AnalysisPanel.jsx';
//for Test
import Report from './components/ECM/test.jsx';
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


window.currentUserId = getCookie('UserId');
window.currentCustomerId = getCookie('currentCustomerId');
window.toMainApp = null;
injectTapEventPlugin();
function getLessVar(name) {
  return main["@" + name];
}

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
          path: 'actuality',
          indexRoute: {
            component: Actuality,
          },
          onEnter: () => {
            document.title = I18N.MainMenu.KPI;
          },
          childRoutes: [{
            path: 'report',
            component: ReportActuality,
          }, {
            path: 'config',
            component: KPIConfig,
            indexRoute: {
                onEnter: (router, replaceState) => {
                  replaceState(RoutePath.KPIConfig(router.params));
                },
            },
            childRoutes: [
              {
                 path: 'kpiconfig',
                 component: KPIConfigList
               },
               {
                 path: 'rankconfig',
                 component: KPIRanking
             }]
          },
          {
            path: 'template',
            component: KPITemplate
          }]
      }, {
        onEnter: () => {
          document.title = I18N.MainMenu.DataAnalysis;
        },
        path: 'data_analysis',
        component: DataAnalysis,
        childRoutes: [{path:':nodeId', component: AnalysisPanel} ]
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
