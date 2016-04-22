/*jshint esversion: 6 */
'use strict';

import React from 'react';
import assign from 'object-assign';
import {RaisedButton, Snackbar} from 'material-ui';
//import Authentication from './Auth.jsx';
import LoginActionCreator from '../actions/LoginActionCreator.jsx';
import LoginStore from '../stores/LoginStore.jsx';
import FlatButton from '../controls/FlatButton.jsx';
import Dialog from '../controls/PopupDialog.jsx';

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
      username: "SchneiderElectricChina",
      password: "P@ssw0rdChina",
      // username: "",
      // password: "",
      error: null,
      showQRCodeDialog: false,
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
  _renderDemoApplyDialog() {
    if (this.state.showQRCodeDialog) {
      return (
        <DemoApplyDialog onCancel={this._dismissQRCodeDialog}/>
      );
    }else{
      return null;
    }
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
            <div className="jazz-login-form-handler">
              <LoginForm username={username} password={password} onKeyPress={this._onKeyPress} errorMsg={errorMsg}
                 userNameChanged={this._onUsernameChange} passwordChanged={this._onPasswordChange} login={this._login} />
            </div>
          </div>
        </div>
        <div className="jazz-public-footer">
          <div className="jazz-public-footer-about">
            <a href="http://www.schneider-electric.com/" target="_blank">About us</a>|
          	<a href="http://e.weibo.com/schneidercn" target="_blank">Schneider Electric official Weibo</a>|
            <div style={{cursor: 'pointer'}} onClick={this._showQRCodeDialog}>EnergyMost for iPad</div>|
          	<a href="#">Contact us</a>|
            <a href="#">中文版</a>
          </div>
          <div className="jazz-public-footer-about">
            <span style={{marginRight: "2em"}}>© Copyright. All rights reserved. Schneider Electric (China) Co.,Ltd.</span>
          	<a href="http://www.miibeian.gov.cn/" target="_blank">京ICP备05053940号-5</a>
          </div>
        </div>
        <div className="jazz-login-demo-link">
          <span>产品试用</span>
          <em className="icon-next-arrow-right"/>
        </div>
        {this._renderDemoApplyDialog()}
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
        <div className="jazz-login-form-header">
          <div className="icon-schneider-en"></div>
        </div>
        <div className="jazz-login-form-content">
          <div className="jazz-login-form-content-title">
            Schneider Electric<br/><br/>EnergyMost
            <span className="jazz-login-form-content-subTitle">TM</span>
          </div>
          <div className="jazz-login-form-content-input">
            <input type="text" className="username" onKeyPress={this.props.onKeyPress} onChange={this.props.userNameChanged}
               value={username} ref="username" placeholder={I18N.Login.UserName}/>
            <input type="password" className="password" onKeyPress={this.props.onKeyPress} onChange={this.props.passwordChanged}
               value={password} ref="password" placeholder={I18N.Login.Password}/>
            <div className="jazz-login-error">{errorMsg}</div>
          </div>
          <div className="jazz-login-form-content-button">
            <RaisedButton disabled={!username.length || !password.length} primary label={I18N.Login.Login} style={{ width: 287 }} onClick={this.props.login}/>
          </div>
        </div>
      </div>
    );
  }
});

var DemoApplyDialog = React.createClass({
  _cancelApply:function(){
    this.props.onCancel();
	},
	render:function(){
    let cancelProps = {
  			onClick: this._cancelApply,
  			label: I18N.Common.Button.Cancel
  		};
    let actions = [<FlatButton {...cancelProps} />];
    return(
      <Dialog title={"云能效iPad客户端"} actions={actions} modal={true} openImmediately={true}  contentStyle={{ width: '500px' }}>
				<div>使用iPad上的二维码扫描软件，拍摄下方二维码即可下载。</div>
        <div className="jazz-login-ipad"></div>
			</Dialog>
    );
  }

});

module.exports = Login;
