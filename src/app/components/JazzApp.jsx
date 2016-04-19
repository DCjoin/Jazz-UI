'use strict';

import React from 'react';
import Router from 'react-router';
import GlobalErrorMessageDialog from './GlobalErrorMessageDialog.jsx';
import GlobalErrorMessageStore from '../stores/GlobalErrorMessageStore.jsx';
import LanguageStore from '../stores/LanguageStore.jsx';
import CurrentUserAction from '../actions/CurrentUserAction.jsx';

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
    var lang = (window.currentLanguage === 0) ? 'zh-cn' : 'en-us';
    var me = this;
    var afterLoadLang = function(b) {
      window.I18N = b;
      me._setHighchartConfig();
      me.setState({
        isLangLoaded: true
      }, () => {
        var url = window.location.toLocaleString();
        let subUrl = url.split('#');
        if (subUrl.length === 2 && subUrl[1].indexOf('main/') > -1) {
          return;
        }
        if (url.indexOf('menutype=platform') > -1) {
          if (url.indexOf('config') > -1) {
            me.replaceWith('config', {
              lang: lang
            });
          } else {
            me.replaceWith('mail', {
              lang: lang
            });
          }

        } else if (url.indexOf('menutype=service') > -1) {
          if (url.indexOf('workday') > -1) {
            me.replaceWith('workday', {
              lang: lang
            });
          } else if (url.indexOf('worktime') > -1) {
            me.replaceWith('worktime', {
              lang: lang
            });
          } else if (url.indexOf('coldwarm') > -1) {
            me.replaceWith('coldwarm', {
              lang: lang
            });
          } else if (url.indexOf('daynight') > -1) {
            me.replaceWith('daynight', {
              lang: lang
            });
          } else if (url.indexOf('price') > -1) {
            me.replaceWith('price', {
              lang: lang
            });
          } else if (url.indexOf('carbon') > -1) {
            me.replaceWith('carbon', {
              lang: lang
            });
          } else if (url.indexOf('benchmark') > -1) {
            me.replaceWith('benchmark', {
              lang: lang
            });
          } else if (url.indexOf('labeling') > -1) {
            me.replaceWith('labeling', {
              lang: lang
            });
          } else if (url.indexOf('customer') > -1) {
            me.replaceWith('customer', {
              lang: lang
            });
          } else if (url.indexOf('user') > -1) {
            me.replaceWith('user', {
              lang: lang
            });
          } else {
            me.replaceWith('privilege', {
              lang: lang
            });
          }
        } else if (url.indexOf('menutype=energy') > -1) {
          me.replaceWith('setting', {
            lang: lang
          });
        } else if (url.indexOf('menutype=alarm') > -1) {
          me.replaceWith('alarm', {
            lang: lang
          });
        } else if (url.indexOf('menutype=map') > -1) {
          me.replaceWith('map', {
            lang: lang
          });
        }
      });
    };
    this._onClearGlobalError();
    if (lang == 'en-us') {
      require(['../lang/en-us.js'], afterLoadLang); //should be changed when support english
    } else {
      require(['../lang/zh-cn.js'], afterLoadLang);
    }
  },
  componentDidMount: function() {
    var params = this.getParams();
    var lang = params.lang;
    var query = this.getQuery();
    var routes = this.getRoutes();
    var me = this;

    //console.log('JazzApp params:' + JSON.stringify(params,0,1));

    var afterLoadLang = function(b) {
      window.I18N = b;

      //由于登录未完成，临时获取window.currentCustomerId
      var customerCode = params.customerId || query.customerId  || window.currentCustomerId;
      //console.log('JazzApp customerId:' + customerCode);

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
          me.replaceWith('config', { lang: lang , customerId: customerCode});
        } else if (url.indexOf('menutype=service') > -1) {
          me.replaceWith('workday', { lang: lang , customerId: customerCode});
        } else if (url.indexOf('menutype=energy') > -1) {
          me.replaceWith('setting', { lang: lang , customerId: customerCode});
        } else if (url.indexOf('menutype=alarm') > -1) {
          me.replaceWith('alarm', { lang: lang , customerId: customerCode});
        } else if (url.indexOf('menutype=map') > -1) {
          me.replaceWith('map', { lang: lang , customerId: customerCode});
        }
      });
    };

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

      this.replaceWith('app', {
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
    // CurrentUserAction.getUser(window.currentUserId);
    //CurrentUserAction.getRoles(window.currentUserId);
    LanguageStore.addSwitchLanguageListener(this._onLanguageSwitch);
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
      loading = ''; //(<AjaxDialog ref="ajax" />);
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
