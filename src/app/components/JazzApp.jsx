'use strict';

import React from 'react';
import {getMuiTheme} from "material-ui/styles";
import { CircularProgress } from 'material-ui';
import assign from 'object-assign';

import AppTheme from '../AppTheme.jsx';

import { getCookie } from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';

import AjaxDialog from 'controls/AjaxDialog.jsx';

import GlobalErrorMessageDialog from './GlobalErrorMessageDialog.jsx';

import CurrentUserAction from 'actions/CurrentUserAction.jsx';
import LanguageAction from 'actions/LanguageAction.jsx';
import LoginActionCreator from 'actions/LoginActionCreator.jsx';

import GlobalErrorMessageStore from 'stores/GlobalErrorMessageStore.jsx';
import LanguageStore from 'stores/LanguageStore.jsx';
import LoginStore from 'stores/LoginStore.jsx';
import AjaxStore from 'stores/AjaxStore.jsx';

function replaceWith(router, name, params, query) {
  router.replace( RoutePath[name]( assign({}, getParams(router), params) ), query );
}
function getParams(router) {
  return router.params;
}
function getQuery(router) {
  return router.location.query;
}
function getRoutes(router) {
  return router.routers;
}
function getCurrentPath(router) {
  return router.location.pathname;
}

let JazzApp = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  childContextTypes: {
    getLessVar: React.PropTypes.func,
    muiTheme: React.PropTypes.object.isRequired,
    currentRoute: React.PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: getMuiTheme(AppTheme),
      getLessVar: this.props.getLessVar,
      currentRoute: {
          params: this.props.params,
          location: this.props.location,
      }
    };
  },
  _showLoading: function(argument) {
    this.setState({
      loading: true
    }, function(argument) {
      this.refs.ajax._show();
    });
  },
  _hideLoading: function(argument) {
    this.refs.ajax._hide();
  },
  _showError: function(msg) {
    this.setState({
      loading: true
    }, function(argument) {
      this.refs.ajax._error(msg);
    });
  },
  _setHighchartConfig() {
    window.Highcharts.setOptions({
      global: {
        useUTC: false
      },
      lang: (function() {
        var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          w = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          g = I18N.Common.Glossary,
          mn = g.MonthName,
          sn = g.ShortMonth,
          wk = g.WeekDay,
          ret = {
            months: [],
            shortMonths: [],
            weekdays: []
          };
        m.forEach(function(n) {
          ret.months.push(mn[n]);
          ret.shortMonths.push(sn[n]);
        });
        w.forEach(function(n) {
          ret.weekdays.push(wk[n]);
        });
        ret.thousandsSep = ',';
        return ret;
      })()
    });
  },
  _onLanguageSwitch: function() {
    var lang = (window.currentLanguage === 0) ? 'zh-cn' : 'en-us',
      url = location.href;
    var me = this;
    this._onClearGlobalError();
    if (lang === 'en-us') {
      url = url.replace('zh-cn', 'en-us');
    } else {
      url = url.replace('en-us', 'zh-cn');
    }
    me._setHighchartConfig();
    var index0 = url.indexOf('#'),
      index1 = url.indexOf('?'),
      pre = index1 > -1 ? url.slice(0, index1) : url.slice(0, index0),
      aft = url.slice(index0, url.length);
    window.location.href = pre + '?' + Math.random() + aft;
  },
  _onLanguageSwitchLoading: function() {
    this.setState({
      loading: true
    });
  },
  componentWillMount() {this._setHighchartConfig();
    GlobalErrorMessageStore.addChangeListener(this._onErrorMessageChanged);
    GlobalErrorMessageStore.addClearGlobalErrorListener(this._onClearGlobalError);
    LanguageStore.addSwitchLanguageListener(this._onLanguageSwitch);
    LanguageStore.addSwitchLanguageLoadingListener(this._onLanguageSwitchLoading);
    LanguageStore.addFirstLanguageNoticeLoadingListener(this._onFirstLanguageNotice);
    AjaxStore.addErrorListener(this._globalError);

    if(LoginStore.hasLoggedin()) {
      LanguageAction.firstLanguageNotice(this.props.router.params.lang);
      CurrentUserAction.getInitData(getCookie('UserId'));
    }
    
  },

  _globalError:function(httpStatusCode){
		if(httpStatusCode == 401){
			var buttonActions=[{
        label:I18N.ServerError.BtnLabel,
        onClick:() => {
          this.refs.ajax._hide();
  				LoginActionCreator.logout();
          var _redirectFunc = this.context.router.replaceWith;
          _redirectFunc('login', {
            lang: ((window.currentLanguage === 0) ? 'zh-cn' : 'en-us')
          });
  			}
      }];
      this.refs.ajax._error(I18N.ServerError.Title, I18N.ServerError.Message, buttonActions, true);
		}
	},

  _onFirstLanguageNotice: function() {
    var params = getParams(this.props.router);
    var query = getQuery(this.props.router);
    var routes = getRoutes(this.props.router);
    var me = this;
    var afterLoadLang = function(b) {
      window.I18N = b;
      var customerCode = params.customerId || query.customerId || window.currentCustomerId;
      var currentUser = window.currentUserId || getCookie('UserId');
      me._setHighchartConfig();
      if (getCurrentPath(me.props.router).indexOf('resetpwd') > -1) {
        var {user, token, lang} = me.context.router.getCurrentParams();
        me.setState({
          isLangLoaded: true,
          loading: false
        }, () => {
          replaceWith(me.props.router, 'resetPSW', {
            user: user,
            token: token,
            lang: lang
          });
        });
        return
      } else if (getCurrentPath(me.props.router).indexOf('contactus') > -1) {
        var {lang} = me.context.router.getCurrentParams();
        me.setState({
          isLangLoaded: true,
          loading: false
        }, () => {
          replaceWith(me.props.router, 'contactus', {
            lang: lang
          });
        });
        return
      } else if (getCurrentPath(me.props.router).indexOf('demologin') > -1) {
        var {user, token, lang} = me.context.router.getCurrentParams();
        me.setState({
          isLangLoaded: true,
          loading: false
        }, () => {
          replaceWith(me.props.router, 'demoLogin', {
            user: user,
            token: token,
            lang: lang
          });
        });
        return
      } else if (getCurrentPath(me.props.router).indexOf('initpwd') > -1) {
        var {lang} = me.context.router.getCurrentParams();
        me.setState({
          isLangLoaded: true,
          loading: false
        }, () => {
          replaceWith(me.props.router, 'initChangePSW', {
            lang: lang
          });
        });
        return
      }
      else if (!currentUser) {
        //console.log('登录');
      } else {
        //console.log('主页');
        CurrentUserAction.getUser(currentUser);
        me.setState({
          isLangLoaded: true,
          loading: false
        }, () => {
          var url = window.location.toLocaleString();
          let subUrl = url.split('#');
          if (subUrl.length === 2 && subUrl[1].indexOf('main/') > -1) {
            return;
          }
          if (url.indexOf('menutype=platform') > -1) {
            replaceWith(me.props.router, 'config', {
              lang: lang,
            });
          } else if (url.indexOf('menutype=service') > -1) {
            replaceWith(me.props.router, 'workday', {
              lang: lang,
            });
          } else if (url.indexOf('menutype=energy') > -1) {
            replaceWith(me.props.router, 'setting', {
              lang: lang,
              customerId: customerCode
            });
          } else if (url.indexOf('menutype=alarm') > -1) {
            replaceWith(me.props.router, 'alarm', {
              lang: lang,
              customerId: customerCode
            });
          } else if (url.indexOf('menutype=map') > -1) {
            replaceWith(me.props.router, 'map', {
              lang: lang,
              customerId: customerCode
            });
          }else{
            //当访问url为http://127.0.0.1:8080/时
            replaceWith(me.props.router, 'map', {
              lang: getParams(me.props.router).lang,
              customerId: customerCode
            });
          }
        });
      }
    };
  },
  _onClearGlobalError: function() {
    let errorMessage = GlobalErrorMessageStore.getErrorMessage();
    let errorCode = GlobalErrorMessageStore.getErrorCode();
    let dialogShow = GlobalErrorMessageStore.getDialogShow();
    this.refs.globalErrorMessageDialog.setState({
      isShowed: false,
      errorMessage: errorMessage,
      errorCode: errorCode,
      dialogShow: dialogShow
    });
    this.refs.globalErrorMessageDialog._onDismiss();
  },
  _onErrorMessageChanged() {
    let errorMessage = GlobalErrorMessageStore.getErrorMessage();
    let errorCode = GlobalErrorMessageStore.getErrorCode();
    let dialogShow = GlobalErrorMessageStore.getDialogShow();
    this.refs.globalErrorMessageDialog.setState({
      isShowed: true,
      errorMessage: errorMessage,
      errorCode: errorCode,
      dialogShow: dialogShow
    });
  },

  componentWillUnmount() {
    GlobalErrorMessageStore.removeChangeListener(this._onErrorMessageChanged);
    GlobalErrorMessageStore.removeClearGlobalErrorListener(this._onClearGlobalError);
    LanguageStore.removeSwitchLanguageListener(this._onLanguageSwitch);
    LanguageStore.removeSwitchLanguageLoadingListener(this._onLanguageSwitchLoading);
    LanguageStore.removeFirstLanguageNoticeLoadingListener(this._onFirstLanguageNotice);
    AjaxStore.removeErrorListener(this._globalError);
  },
  getInitialState: function() {
    return {
      loading: false,
      isLangLoaded: false
    };
  },
  render: function() {
    return (
      <div className="jazz-app">
          {this.props.children}
          <GlobalErrorMessageDialog ref='globalErrorMessageDialog'/>
          <AjaxDialog ref="ajax"/>
      </div>
      );
  }
});

module.exports = JazzApp;
