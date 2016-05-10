/*jshint esversion: 6 */
'use strict';

import React from 'react';
import assign from 'object-assign';
import {RaisedButton, Snackbar} from 'material-ui';
//import Authentication from './Auth.jsx';
import LoginActionCreator from '../actions/LoginActionCreator.jsx';
import LoginStore from '../stores/LoginStore.jsx';
import CusFlatButton from '../controls/FlatButton.jsx';
import { FlatButton } from 'material-ui';
import Dialog from '../controls/PopupDialog.jsx';
import LanguageAction from '../actions/LanguageAction.jsx';
import ViewableTextField from '../controls/ViewableTextField.jsx';
import Regex from '../constants/Regex.jsx';

const MAX_LENGTH = 200;
const MAX_LENGTH_ERROR = "不能大于" + MAX_LENGTH;
const DEFAULT_COUNT_DOWN = 59;

let Login = React.createClass({
  propTypes: {
    query: React.PropTypes.object,
    params: React.PropTypes.object
  },
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      username: "",
      password: "",
      // username: "Ally_Test",
      // password: "123456qq",
      // username: "0123456",
      // password: "0123456",
      // username: "SchneiderElectricChina",
      // password: "P@ssw0rdChina",
      // username: "platformadmin",
      // password: "P@ssw0rd",
      error: null,
      showQRCodeDialog: false,
      showForgetPSWDialog: false,
      demoEmail: "",
      mobileNumber: "",
      authCode: "",
      hasGetAuthCode: false,
      getAuthCodeDisabled: false,
      counting: false,
      countDown: DEFAULT_COUNT_DOWN,
      timer: null
    };
  },
  _onChange : function(argument) {
    var _redirectFunc = this.context.router.transitionTo;
    if (this.props.routes.length < 3) {
        _redirectFunc = this.context.router.replaceWith;
    }
    if (LoginStore.hasLoggedin()) {
      // console.log('***********************************************');
      // console.log(JSON.stringify(this.props.query,0,1));
      // console.log(JSON.stringify(this.props.query.next,0,1));
      // console.log(JSON.stringify(this.props.params,0,1));
      // console.log('***********************************************');
      this.context.router.replaceWith('main', this.props.params, assign({}, this.props.query, {from: 'app'}));
    } else {
      console.log('login or get auth code error');
    }
  },
  _onKeyPress: function(event) {
    if (event.charCode === 13) {
      this._login(event);
    }
  },
  _onUsernameChange: function(event) {
    this.setState({username: event.target.value, error: null});
  },
  _onPasswordChange: function(event) {
    if (this.state.error) {
      if (this.state.error.Error && this.state.error.Error.substr(this.state.error.Error.length - 5, 5) === "12008") {
        this.setState({password: event.target.value});
        return;
      }
    }
    this.setState({password: event.target.value, error: null});
  },
  _login: function(event) {
    event.preventDefault();
    var that = this,
      {username, password} = this.state;
    if (!username || username.length > MAX_LENGTH || !password || password.length > MAX_LENGTH) {
      return false;
    }
    LoginActionCreator.login({userName:username,password:password});
  },

  _showQRCodeDialog() {
      this.setState({showQRCodeDialog: true});
  },
  _doneQRCodeDialog() {
    this.setState({showQRCodeDialog: false});
  },
  _dismissQRCodeDialog() {
    this.setState({showQRCodeDialog: false});
  },
  _renderQRCodeDialog() {
    if (this.state.showQRCodeDialog) {
      return (
        <QRCodeDialog onCancel={this._dismissQRCodeDialog}/>
      );
    }else{
      return null;
    }
  },

  _showForgetPSWDialog() {
      this.setState({showForgetPSWDialog: true});
  },
  _dismissForgetPSWDialog() {
    this.setState({showForgetPSWDialog: false});
  },
  _renderForgetPSWDialog(){
    if (this.state.showForgetPSWDialog) {
      return (
        <ForgetPSWDialog onCancel={this._dismissForgetPSWDialog}/>
      );
    }else{
      return null;
    }
  },

  _onLangSwitch: function() {
    LanguageAction.switchLanguage();
    var lang = (window.currentLanguage === 0) ? 'zh-cn' : 'en-us';
    var currentRoutes = this.context.router.getCurrentRoutes();
    var activeRouteName = currentRoutes[currentRoutes.length - 1].name;
    this.context.router.transitionTo(activeRouteName, {lang: lang});
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

    return (
      <div className="jazz-login">
        <div className="jazz-login-content">
          <div className="jazz-login-content-container">
            <div className="jazz-login-content-logo"></div>
            <div className="jazz-login-form-handler">
              <LoginForm username={username} password={password} onKeyPress={this._onKeyPress} errorMsg={errorMsg}
                 userNameChanged={this._onUsernameChange} passwordChanged={this._onPasswordChange} login={this._login} forgetPSW={this._showForgetPSWDialog}/>
                 <div className="jazz-login-demo-link">
                   <span>{I18N.Login.tryProduct}</span>
                   <em className="icon-next-arrow-right"/>
                 </div>
            </div>
          </div>
        </div>
        <div className="jazz-public-footer">
          <div className="jazz-public-footer-about">
            <a href="http://www.schneider-electric.com/" target="_blank">{I18N.Login.AboutUS}</a>|
          	<a href="http://e.weibo.com/schneidercn" target="_blank">{I18N.Login.Weibo}</a>|
            <div style={{cursor: 'pointer'}} onClick={this._showQRCodeDialog}>{I18N.Login.iPad}</div>|
          	<a href="#">{I18N.Login.ContactUS}</a>|
            <FlatButton label={I18N.Platform.InEnglish} onClick={this._onLangSwitch} hoverColor={'transparent'} rippleColor={'transparent'}
              backgroundColor={'transparent'} labelStyle={{color: '#c4bbe2','padding': '0'}}
               style={{'padding': '0','margin': '0', lineHeight: '18px'}} linkButton={true}></FlatButton>
          </div>
          <div className="jazz-public-footer-about">
            <div style={{marginRight: "2em"}}>{I18N.Login.Copyright}</div>
          	<a href="http://www.miibeian.gov.cn/" target="_blank">京ICP备05053940号-5</a>
          </div>
        </div>
        {this._renderQRCodeDialog()}
        {this._renderForgetPSWDialog()}
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
          <div className="jazz-login-form-content-title">
            {I18N.Login.Title}
          </div>
          <div className="jazz-login-form-content-input">
            <input type="text" className="username" onKeyPress={this.props.onKeyPress} onChange={this.props.userNameChanged}
               value={username} ref="username" placeholder={I18N.Login.UserName}/>
            <input type="password" className="password" onKeyPress={this.props.onKeyPress} onChange={this.props.passwordChanged}
               value={password} ref="password" placeholder={I18N.Login.Password}/>
            <div className="jazz-login-error">{errorMsg}</div>
          </div>
          <div className="jazz-login-form-content-button">
            <RaisedButton disabled={!username.length || !password.length} primary label={I18N.Login.Login} style={{ width: '300px',height:'46px'}} onClick={this.props.login}/>
          </div>
          <div className="jazz-login-form-content-forgetPSW">
            <div style={{cursor: 'pointer'}} onClick={this.props.forgetPSW}>{I18N.Login.forgetPSW}</div>
          </div>
        </div>
      </div>
    );
  }
});

var QRCodeDialog = React.createClass({
  _cancelApply:function(){
    this.props.onCancel();
	},
	render:function(){
    let cancelProps = {
  			onClick: this._cancelApply,
  			label: I18N.Common.Button.Cancel
  		};
    let actions = [<CusFlatButton {...cancelProps} />];
    return(
      <Dialog title={I18N.Login.iPad} actions={actions} modal={true} openImmediately={true}  contentStyle={{ width: '600px' }}>
				<div>{I18N.Login.iPadDetail}</div>
        <div className="jazz-login-ipad"></div>
			</Dialog>
    );
  }
});

var ForgetPSWDialog = React.createClass({
  getInitialState() {
    return {
      username:"",
      email: "",
      // username:"vonqi",
      // email: "qi.feng@schneider-electric.com",
      reqStatus:null,
    };
  },
  _onChange:function(){
    if(LoginStore.getreqPSWReset()){
      this.setState({reqStatus:true});
    }
  },
  _sendApply:function(){
    LoginActionCreator.reqPwdReset(this.state.username, this.state.email);
  },
  _cancelApply:function(){
    this.props.onCancel();
	},
  componentDidMount: function() {
    LoginStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    LoginStore.removeChangeListener(this._onChange);
  },
	render:function(){
    let email = this.state.email,
		sendProps = {
			disabled: !email || !Regex.Email.test( email ) || email.length > 254,
			onClick: this._sendApply,
			label: I18N.Common.Button.GoOn
		},
		cancelProps = {
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
			maxLen:254,
      didChanged: value => { this.setState({ username: value }) }
		},
		emailProps = {
			autoFocus: false,
			isViewStatus: false,
			title: I18N.Login.Email,
			defaultValue: this.state.email,
			isRequired: true,
			regex: Regex.Email,
			errorMessage: I18N.Login.WrongEmail,
			maxLen:254,
			didChanged: value => { this.setState({ email: value }) }
		};

    if(this.state.reqStatus == true){
      let actions = [
  			<CusFlatButton {...goonProps} />
  		];
      return(
        <Dialog title={I18N.Login.ForgerPSW} actions={actions} modal={true} openImmediately={true}  contentStyle={{ width: '530px' }}>
          <div>{I18N.Login.ReqPSWResetTip1}<b>{this.state.email}</b>{I18N.Login.ReqPSWResetTip3}<br></br>{I18N.Login.ReqPSWResetTip2}</div>
  			</Dialog>
      );
    }else {
      let actions = [
  			<FlatButton {...sendProps} />,
  			<CusFlatButton {...cancelProps} />
  		];
      return(
        <Dialog title={I18N.Login.ForgerPSW} actions={actions} modal={true} openImmediately={true}  contentStyle={{ width: '530px' }}>
          <div>{I18N.Login.ForgerPSWTips}</div>
          <br></br>
          <ViewableTextField {...usernameProps} />
          <ViewableTextField {...emailProps} />
  			</Dialog>
      );
    }
  }
});

module.exports = Login;
