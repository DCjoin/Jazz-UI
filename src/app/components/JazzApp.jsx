'use strict';

import React from 'react';
import Router from 'react-router';
import MainMenu from './MainMenu.jsx';
import GlobalErrorMessageDialog from './GlobalErrorMessageDialog.jsx';
import GlobalErrorMessageStore from '../stores/GlobalErrorMessageStore.jsx';

import keyMirror from 'keymirror';

let {Route, DefaultRoute, RouteHandler, Link, Navigation, State} = Router;

let JazzApp = React.createClass({
  mixins: [Navigation, State],
  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired
  },
  getChildContext() {
    return {
      muiTheme: this.props.muiTheme
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
  componentDidMount: function() {
    var params = this.getParams();
    var lang = params.lang;
    var query = this.getQuery();
    var routes = this.getRoutes();
    var me = this;
    var afterLoadLang = function(b) {
      window.I18N = b;
      me.setState({
        isLangLoaded: true
      }, () => {
        var url = window.location.toLocaleString();
        if (url.indexOf('menutype=energy') > -1) {
          me.replaceWith('setting', {
            lang: lang
          });
        } else {
          me.replaceWith('alarm', {
            lang: lang
          });
        }
        me._setHighchartConfig();
      });
    };

    if (!lang) {
      var url = window.location.toLocaleString();
      if (url.indexOf('langNum=0') > -1) { //Chinese
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

    if (lang.toLowerCase() == 'en-us') {
      require(['../lang/en-us.js'], afterLoadLang); //should be changed when support english
    } else {
      require(['../lang/zh-cn.js'], afterLoadLang);
    }
    GlobalErrorMessageStore.addChangeListener(this._onErrorMessageChanged);
  },
  _onErrorMessageChanged() {
    let errorMessage = GlobalErrorMessageStore.getErrorMessage();
    let errorCode = GlobalErrorMessageStore.getErrorCode();
    this.refs.globalErrorMessageDialog.setState({
      isShowed: true,
      errorMessage: errorMessage,
      errorCode: errorCode
    });
  },
  componentWillUnmount() {
    GlobalErrorMessageStore.removeChangeListener(this._onErrorMessageChanged);
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
