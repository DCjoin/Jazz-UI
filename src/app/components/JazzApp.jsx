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
import LoginStore from 'stores/LoginStore.jsx';
import AjaxStore from 'stores/AjaxStore.jsx';
var createReactClass = require('create-react-class');
import getLessVar from 'util/GetLessVar.jsx';
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
import PropTypes from 'prop-types';
let JazzApp = createReactClass({
  contextTypes: {
    router: PropTypes.object
  },
  childContextTypes: {
    getLessVar: PropTypes.func,
    muiTheme: PropTypes.object.isRequired,
    pianoTheme: PropTypes.object,
    currentRoute: PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: getMuiTheme(AppTheme),
      pianoTheme:{primaryColor : getLessVar('medium-green'),errorColor: getLessVar('normal-red'),borderColor:getLessVar('border-gray')},
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
  _onLanguageSwitchLoading: function() {
    this.setState({
      loading: true
    });
  },
  componentWillMount() {
    this._setHighchartConfig();
    GlobalErrorMessageStore.addChangeListener(this._onErrorMessageChanged);
    GlobalErrorMessageStore.addClearGlobalErrorListener(this._onClearGlobalError);
    AjaxStore.addErrorListener(this._globalError);

    LanguageAction.firstLanguageNotice(this.props.router.params.lang);
    if( LoginStore.hasLoggedin() ) {
      CurrentUserAction.getInitData(getCookie('UserId'));
    }
    
  },

  componentWillReceiveProps(nextProps) {
    if(this.props.router.params.lang !== nextProps.router.params.lang) {
      LanguageAction.firstLanguageNotice(this.props.router.params.lang);
    }
  },

  _globalError:function(httpStatusCode){
		if(httpStatusCode == 401){
			var buttonActions=[{
        label:I18N.ServerError.BtnLabel,
        onClick:() => {
          this.refs.ajax._hide();
  				LoginActionCreator.logout();
          RoutePath.login(this.props.router.params);
          // var _redirectFunc = this.props.router.replace;
          // _redirectFunc('login', {
          //   lang: ((window.currentLanguage === 0) ? 'zh-cn' : 'en-us')
          // });
  			}
      }];
      this.refs.ajax._error(I18N.ServerError.Title, I18N.ServerError.Message, buttonActions, true);
		}
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
