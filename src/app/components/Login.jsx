/*jshint esversion: 6 */
'use strict';

import React from 'react';
import assign from 'object-assign';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import LoginActionCreator from '../actions/LoginActionCreator.jsx';
import LoginStore from '../stores/LoginStore.jsx';
// import CusFlatButton from 'controls/FlatButton.jsx';
let CusFlatButton = {};
import NewDialog from '../controls/NewDialog.jsx';
import LanguageAction from '../actions/LanguageAction.jsx';
import ViewableTextField from '../controls/ViewableTextField.jsx';
import Regex from '../constants/Regex.jsx';
import CurrentUserAction from '../actions/CurrentUserAction.jsx';
import _trimEnd from 'lodash-es/trimEnd';
import _lang from '../lang/lang.jsx';
import RoutePath from '../util/RoutePath.jsx';

var _ = {
  trimEnd: _trimEnd
};

const MAX_LENGTH = 200;
const MAX_LENGTH_ERROR = "不能大于" + MAX_LENGTH;
const DEFAULT_COUNT_DOWN = 59;

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

let Login = React.createClass({
  propTypes: {
    query: React.PropTypes.object,
    params: React.PropTypes.object
  },
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState: function() {
    document.title = I18N.Login.Login;
    return {
      username: "",
      password: "",
      error: null,
      showQRCodeDialog: false,
      showForgetPSWDialog: false,
      showTrialUseDialog: false,
      demoEmail: "",
      resetEmail: "",
      mobileNumber: "",
      authCode: "",
      hasGetAuthCode: false,
      counting: false,
      countDown: DEFAULT_COUNT_DOWN,
      timer: null
    };
  },
  _onChange: function(argument) {
    if (LoginStore.hasLoggedin()) {
      CurrentUserAction.getInitData(LoginStore.getCurrentUserId(), LoginStore.getCurrentUser().SpId);
      replaceWith(this.props.router, 'main', this.props.params);
    } else {
      this.setState({
        error: LoginStore.getLastError()
      });
    }
  },
  _onKeyPress: function(event) {
    if (event.charCode === 13) {
      this._login(event);
    }
  },
  _onUsernameChange: function(event) {
    this.setState({
      username: event.target.value,
      error: null
    });
  },
  _onPasswordChange: function(event) {
    if (this.state.error) {
      if (this.state.error.error && this.state.error.error.Code.substr(this.state.error.error.Code.length - 5, 5) === "12008") {
        this.setState({
          password: event.target.value
        });
        return;
      }
    }
    this.setState({
      password: event.target.value,
      error: null
    });
  },
  _login: function(event) {
    event.preventDefault();
    var that = this,
      {username, password} = this.state;
    if (!username || username.length > MAX_LENGTH || !password || password.length > MAX_LENGTH) {
      return false;
    }
    LoginActionCreator.login({
      userName: _.trimEnd(username),
      password: password
    });
  },

  _showQRCodeDialog() {
    this.setState({
      showQRCodeDialog: true
    });
  },
  _doneQRCodeDialog() {
    this.setState({
      showQRCodeDialog: false
    });
  },
  _dismissQRCodeDialog() {
    this.setState({
      showQRCodeDialog: false
    });
  },
  _renderQRCodeDialog() {
    if (this.state.showQRCodeDialog) {
      return (
        <QRCodeDialog onCancel={this._dismissQRCodeDialog}/>
        );
    } else {
      return null;
    }
  },

  _showForgetPSWDialog() {
    this.setState({
      showForgetPSWDialog: true
    });
  },
  _dismissForgetPSWDialog() {
    this.setState({
      showForgetPSWDialog: false
    });
  },
  _doneForgetPSWDialog(resetEmail) {
    this.setState({
      showForgetPSWDialog: false,
      resetEmail: resetEmail,
    });
  },
  _renderForgetPSWDialog() {
    return (
      <ForgetPSWDialog open={this.state.showForgetPSWDialog} onDone={this._doneForgetPSWDialog} onCancel={this._dismissForgetPSWDialog}/>
    );
  },

  _dismissForgetPSWSnackbar() {
    this.setState({
      resetEmail: ""
    });
  },
  _renderForgetPSWSnackbar() {
    var resetEmail = this.state.resetEmail;
    if (resetEmail && LoginStore.getreqPSWReset()) {
      return (<Snackbar message={I18N.Login.ReqPSWResetTip1 + resetEmail} openOnMount={true}  onDismiss={this._dismissForgetPSWSnackbar}/>);
    }
    return null;
  },

  _showTrialUseDialog() {
    this.setState({
      showTrialUseDialog: true
    });
  },
  _dismissTrialUseDialog() {
    this.setState({
      showTrialUseDialog: false
    });
  },
  _doneTrialUseDialog(demoEmail) {
    this.setState({
      showTrialUseDialog: false,
      demoEmail: demoEmail,
    });
  },
  _renderTrialUseDialog() {
    return (
      <DemoApplyDialog open={this.state.showTrialUseDialog} onDone={this._doneTrialUseDialog} onCancel={this._dismissTrialUseDialog}/>
    );
  },

  _dismissTrialUseSnackbar() {
    this.setState({
      demoEmail: ""
    });
  },
  _renderTrialUseSnackbar() {
    var demoEmail = this.state.demoEmail;
    if (demoEmail) {
      return (<Snackbar message={I18N.Login.TrialUseSussTip1 + demoEmail} openOnMount={true} onDismiss={this._dismissTrialUseSnackbar}/>);
    }
    return null;
  },

  _onLangSwitch: function() {
    LanguageAction.switchLanguage();
    var lang = (window.currentLanguage === 0) ? 'zh-cn' : 'en-us';
    var currentRoutes = this.context.router.getCurrentRoutes();
    var activeRouteName = currentRoutes[currentRoutes.length - 1].name;
    this.context.router.transitionTo(activeRouteName, {
      lang: lang
    });
  },

  componentDidMount: function() {
    LoginStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    LoginStore.removeChangeListener(this._onChange);
  },
  render: function() {
    var errorMsg = null,
      {username, password, authCode} = this.state;
    var lang = (this.props.router.params.lang === 'en-us') ? 'zh-cn' : 'en-us';
    var _contactHref = '#/' + lang + '/contactus';
    var _switchLanguageHref = `#${RoutePath.login({lang})}`;
    if (this.state.error) {
      if (this.state.error.error) {
        var errorCode = this.state.error.error.Code.substr(this.state.error.error.Code.length - 5, 5);
        errorMsg = _lang.getMessage(errorCode);
      }
      errorMsg = errorMsg || this.state.error;
    }

    if (!errorMsg && username.length > MAX_LENGTH) {
      errorMsg = "用户名长度" + MAX_LENGTH_ERROR;
    }
    if (!errorMsg && password.length > MAX_LENGTH) {
      errorMsg = "密码长度" + MAX_LENGTH_ERROR;
    }

    return (
      <div className="jazz-login">
        <div className="jazz-login-content">
          <div className="jazz-login-content-container">
              <LoginForm username={username} password={password} onKeyPress={this._onKeyPress} errorMsg={errorMsg}
                  userNameChanged={this._onUsernameChange} passwordChanged={this._onPasswordChange} login={this._login} forgetPSW={this._showForgetPSWDialog}/>
          </div>
        </div>
        <div className="jazz-public-footer">
          <div className="jazz-public-footer-about">
            <a href="http://www.schneider-electric.com/" target="_blank">{I18N.Login.AboutUS}</a>|
          	<a href="http://e.weibo.com/schneidercn" target="_blank">{I18N.Login.Weibo}</a>|
            <div style={{
        cursor: 'pointer' }} onClick={this._showQRCodeDialog}>{I18N.Login.iPad}</div>|
          	<a href={_contactHref} target="_blank">{I18N.Login.ContactUS}</a>|
            <a href={_switchLanguageHref} target="_blank">{I18N.Platform.InEnglish}</a>
          </div>
          <div className="jazz-public-footer-about">
            <div style={{ marginRight: "2em" }}>{I18N.Login.Copyright}</div>
          	<a href="http://www.miibeian.gov.cn/" target="_blank">京ICP备05053940号-5</a>
          </div>
        </div>
        {this._renderQRCodeDialog()}
        {this._renderForgetPSWDialog()}
        {this._renderForgetPSWSnackbar()}
        {this._renderTrialUseDialog()}
        {this._renderTrialUseSnackbar()}
      </div>
      );
  }
});

var LoginForm = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    username: React.PropTypes.string,
    password: React.PropTypes.string,
    errorMsg: React.PropTypes.string,
    login: React.PropTypes.func,
    userNameChanged: React.PropTypes.func,
    passwordChanged: React.PropTypes.func,
    onKeyPress: React.PropTypes.func,
    changeLoginMethod: React.PropTypes.func
  },

  render: function() {
    var {username, password, errorMsg} = this.props;
    return (
      <div className="jazz-login-form">
        <div className="jazz-login-form-content">
            <div className="jazz-login-form-logo">
                <div className="jazz-login-form-logo-title">
                  {I18N.Login.Title}
                </div>
            </div>
          <div className="jazz-login-form-content-title">
            {I18N.Login.Title2}
          </div>
          <div className="jazz-login-form-content-input">
            <input type="text" className="username" onKeyPress={this.props.onKeyPress} onChange={this.props.userNameChanged}
                value={username} ref="username" placeholder={I18N.Login.UserName}/>
            <input type="password" className="password" onKeyPress={this.props.onKeyPress} onChange={this.props.passwordChanged}
                value={password} ref="password" placeholder={I18N.Login.Password}/>
            <div className="jazz-login-error">{errorMsg}</div>
          </div>
          <div className="jazz-login-form-content-button">
            <RaisedButton
              disabled={!username.length || !password.length}
              primary label={I18N.Login.Login}
              style={{
                width: 300,
                height: 46
              }}
              labelStyle={{
                lineHeight: '42px',
                fontSize: 16,
                padding: 0
              }}
              onClick={this.props.login}/>
          </div>
          <div className="jazz-login-form-content-forgetPSW">
            <div style={{
                cursor: 'pointer'
              }} onClick={this.props.forgetPSW}>{I18N.Login.forgetPSW}</div>
          </div>
        </div>
      </div>
      );
  }
});

var QRCodeDialog = React.createClass({
  _cancelApply: function() {
    this.props.onCancel();
  },
  render: function() {
    let cancelProps = {
      onClick: this._cancelApply,
      label: I18N.Common.Button.Cancel
    };
    let actions = [<CusFlatButton {...cancelProps} />];
    return (
      <Dialog title={I18N.Login.iPad} actions={actions} modal={true} openImmediately={true}  contentStyle={{
        width: '600px'
      }}>
				<div>{I18N.Login.iPadDetail}</div>
        <div className="jazz-login-ipad"></div>
			</Dialog>
      );
  }
});

var ForgetPSWDialog = React.createClass({
  getInitialState() {
    return {
      username: "",
      email: "",
      // username:"vonqi",
      // email: "qi.feng@schneider-electric.com",
      reqResetPSWStatus: null,
    };
  },
  _sendApply: function() {
    LoginActionCreator.reqPwdReset(this.state.username, this.state.email);
    this.setState({
      state: this.getInitialState()
    });
    if (this.props.onDone) {
      this.props.onDone(this.state.email);
    }
  },
  _cancelApply: function() {
    this.setState({
      state: this.getInitialState()
    });
    this.props.onCancel();
  },
  render: function() {
    let email = this.state.email,
      username = this.state.username,
      sendProps = {
        inDialog: true,
        highlight: true,
        key: 'send_email',
        disabled: !email || !Regex.Email.test(email) || email.length > 254 || !username || username.length > 254,
        onClick: this._sendApply,
        label: I18N.Common.Button.GoOn
      },
      cancelProps = {
        key: 'cancel_email',
        onClick: this._cancelApply,
        label: I18N.Common.Button.Cancel
      },
      goonProps = {
        onClick: this._cancelApply,
        label: I18N.Common.Button.GoOn
      },
      usernameProps = {
        autoFocus: true,
        isViewStatus: false,
        title: I18N.Login.UserName,
        defaultValue: this.state.username,
        isRequired: true,
        maxLen: 254,
        didChanged: value => {
          this.setState({
            username: value
          })
        }
      },
      emailProps = {
        autoFocus: false,
        isViewStatus: false,
        title: I18N.Login.Email,
        defaultValue: this.state.email,
        isRequired: true,
        regex: Regex.Email,
        errorMessage: I18N.Login.WrongEmail,
        maxLen: 254,
        didChanged: value => {
          this.setState({
            email: value
          })
        }
      },
      actions = [
        <CusFlatButton {...sendProps} />,
        <CusFlatButton {...cancelProps} />
      ];

    return (
      <NewDialog title={I18N.Login.ForgerPSW} actions={actions} modal={true} open={this.props.open} contentStyle={{
        width: '590px'
      }}>
            <div style={{fontSize:'14px'}}>{I18N.Login.ForgerPSWTips}</div>
            <br></br>
            <ViewableTextField {...usernameProps}/>
            <ViewableTextField {...emailProps}/>
            <div style={{fontSize:'14px'}}>{I18N.Login.ForgeremailTips}</div>
        </NewDialog>
      );
  }
});

var DemoApplyDialog = React.createClass({
  getInitialState() {
    return {
      email: "",
      reqTrialUseStatus: null,
    };
  },
  _sendApply() {
    LoginActionCreator.reqDemoApply(this.state.email);
    if (this.props.onDone) {
      this.props.onDone(this.state.email);
    }
  },
  _cancelApply() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  },
  render() {
    let email = this.state.email,
      sendProps = {
        key: 'send_email',
        disabled: !email || !Regex.Email.test(email) || email.length > 254,
        onClick: this._sendApply,
        label: I18N.Common.Button.GoOn
      },
      cancelProps = {
        key: 'cancel_email',
        onClick: this._cancelApply,
        label: I18N.Common.Button.Cancel
      },
      goonProps = {
        onClick: this._cancelApply,
        label: I18N.Common.Button.GoOn
      },
      emailProps = {
        autoFocus: true,
        isViewStatus: false,
        title: I18N.Login.Email,
        defaultValue: this.state.email,
        isRequired: true,
        regex: Regex.Email,
        errorMessage: I18N.Login.WrongEmail,
        maxLen: 254,
        didChanged: value => {
          this.setState({
            email: value
          })
        }
      },
      actions = [
        <CusFlatButton {...sendProps} />,
        <CusFlatButton {...cancelProps} />
      ];

    return (
      <NewDialog title={I18N.Login.TrialUse} open={this.props.open} modal={true} actions={actions}>
              <div style={{fontSize:'14px'}}>{I18N.Login.TrialUseTips}</div>
              <ViewableTextField {...emailProps}/>
          </NewDialog>
      );
  }
});

module.exports = Login;

/*
import React, { Component } from 'react';

export default class Login extends Component {
  render() {
    return (
      <div>123</div>
    );
  }
}
*/
