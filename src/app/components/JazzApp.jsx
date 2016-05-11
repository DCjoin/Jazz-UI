'use strict';

import React from 'react';
import Router from 'react-router';
import GlobalErrorMessageDialog from './GlobalErrorMessageDialog.jsx';
import GlobalErrorMessageStore from '../stores/GlobalErrorMessageStore.jsx';
import LanguageStore from '../stores/LanguageStore.jsx';
import CurrentUserAction from '../actions/CurrentUserAction.jsx';
import { CircularProgress } from 'material-ui';

import keyMirror from 'keymirror';

let {Route, DefaultRoute, RouteHandler, Link, Navigation, State} = Router;

let JazzApp = React.createClass({
  mixins: [Navigation, State],
  contextTypes: {
    router: React.PropTypes.func
  },
  childContextTypes: {
    getLessVar: React.PropTypes.func,
    muiTheme: React.PropTypes.object.isRequired,
  },
  getChildContext() {
    return {
      muiTheme: this.props.muiTheme,
      getLessVar: this.props.getLessVar,
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
    // if (lang == 'en-us') {
    //   require(['../lang/en-us.js'], afterLoadLang); //should be changed when support english
    // } else {
    //   require(['../lang/zh-cn.js'], afterLoadLang);
    // }
    if (lang === 'en-us') {
      url = url.replace('zh-cn', 'en-us');
    } else {
      url = url.replace('en-us', 'zh-cn');
    }
    var index = url.indexOf('#'),
      pre = url.slice(0, index),
      aft = url.slice(index, url.length);
    window.location.href = pre + '?' + Math.random() + aft;
  //window.location.reload();
  },
  _onLanguageSwitchLoading: function() {
    this.setState({
      loading: true
    });
  },
  componentDidMount: function() {
    var params = this.getParams();
    var lang = params.lang;
    var query = this.getQuery();
    var routes = this.getRoutes();
    var me = this;

    // console.log('JAZZAPP params:' + JSON.stringify(params,0,1));
    // console.log('JAZZAPP query:' + JSON.stringify(query,0,1));
    // console.log('JAZZAPP routes:' + JSON.stringify(routes,0,1));

    var afterLoadLang = function(b) {
      window.I18N = b;
      var customerCode = params.customerId || query.customerId || window.currentCustomerId;

      if (me.context.router.getCurrentPath().indexOf('resetpwd') > -1) {
        var {user, token, lang} = me.context.router.getCurrentParams();
        me.setState({
          isLangLoaded: true,
        }, () => {
          me.replaceWith('resetPSW', {
            user: user,
            token: token,
            lang: lang
          });
        });
        return
      } else

      //routes.length === 1 || (routes.length === 2 && !customerCode)
      if (!window.currentUserId) {
        //console.log('登录');
        me.setState({
          isLangLoaded: true
        }, () => {
          me.replaceWith('login', {
            lang: me.getParams().lang
          });
        });
      } else {
        //console.log('主页');
        me._setHighchartConfig();
        CurrentUserAction.getUser(window.currentUserId);

        me.setState({
          isLangLoaded: true
        }, () => {
          var url = window.location.toLocaleString();
          let subUrl = url.split('#');
          if (subUrl.length === 2 && subUrl[1].indexOf('main/') > -1) {
            return;
          }
          if (url.indexOf('menutype=platform') > -1) {
            me.replaceWith('config', {
              lang: lang,
              customerId: customerCode
            });
          } else if (url.indexOf('menutype=service') > -1) {
            me.replaceWith('workday', {
              lang: lang,
              customerId: customerCode
            });
          } else if (url.indexOf('menutype=energy') > -1) {
            me.replaceWith('setting', {
              lang: lang,
              customerId: customerCode
            });
          } else if (url.indexOf('menutype=alarm') > -1) {
            me.replaceWith('alarm', {
              lang: lang,
              customerId: customerCode
            });
          } else if (url.indexOf('menutype=map') > -1) {
            me.replaceWith('map', {
              lang: lang,
              customerId: customerCode
            });
          }
        });
      }
    };
    // console.log('lang:'+ lang)

    if (!lang) {
      var url = window.location.toLocaleString();
      //currentLanguage： 0 中文, 1 英文
      if (url.indexOf('langNum=0') > -1) {
        //Chinese
        lang = 'zh-cn';
      } else if (url.indexOf('langNum=1') > -1) {
        lang = 'en-us';
      } else {
        lang = window.navigator.language.toLowerCase();
      }

      me.replaceWith('app', {
        lang: lang
      });
    }
    //currentLanguage： 0 中文, 1 英文
    if (lang === 'zh-cn') {
      window.currentLanguage = 0;
    } else {
      window.currentLanguage = 1;
    }
    window.lastLanguage = window.currentLanguage;

    if (lang.toLowerCase() == 'en-us') {
      require(['../lang/en-us.js'], afterLoadLang); //should be changed when support english
    } else {
      require(['../lang/zh-cn.js'], afterLoadLang);
    }
    GlobalErrorMessageStore.addChangeListener(this._onErrorMessageChanged);
    GlobalErrorMessageStore.addClearGlobalErrorListener(this._onClearGlobalError);
    LanguageStore.addSwitchLanguageListener(this._onLanguageSwitch);
    LanguageStore.addSwitchLanguageLoadingListener(this._onLanguageSwitchLoading);
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
  },
  getInitialState: function() {
    return {
      loading: false,
      isLangLoaded: false
    };
  },
  render: function() {
    var loading = null;
    if (this.state.loading) {
      loading = <div style={{
        display: 'flex',
        flex: 1,
        'alignItems': 'center',
        'justifyContent': 'center',
        position: 'fixed',
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        zIndex: 1000,
      }}>
              <CircularProgress  mode="indeterminate" size={2} />
            </div>; //(<AjaxDialog ref="ajax" />);
    }
    let mainPanel = null;
    if (this.state.isLangLoaded) {
      mainPanel = <RouteHandler {...this.props} showLoading={this._showLoading} hideLoading={this._hideLoading} showError={this._showError} />;
    }
    return (
      <div className="jazz-app">
          {mainPanel}
          {loading}
          <GlobalErrorMessageDialog ref='globalErrorMessageDialog'/>
      </div>
      );
  }
});

module.exports = JazzApp;
