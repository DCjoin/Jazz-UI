'use strict';

import React from 'react';
// import {Navigation, State} from 'react-router';

import {
    Menu,
    Mixins,
    IconButton,
    FlatButton,
    FontIcon,
    TextField,
    Dialog
} from 'material-ui';
// import classnames from "classnames";
import {assign, get, set} from "lodash/object";
import {isObject} from "lodash/lang";
import lang from '../lang/lang.jsx';


import ResetPasswordAction from '../actions/ResetPasswordAction.jsx';
import ResetPasswordStore from '../stores/ResetPasswordStore.jsx';
import CusFlatButton from '../controls/FlatButton.jsx';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';

const MAX_LENGTH = 200;

var resetPSW = React.createClass({
    contextTypes: {
      router: React.PropTypes.func
    },
    _bindMergeTemp: function(path) {
        return this._mergeTemp.bind(this, path);
    },
    _mergeTemp: function(path, event, value = "") {
        if (!isObject(event)) {
            value = event;
        } else {
            value = get(event, "target.value");
            if (isObject(value)) {
                value = value.text;
            }
        }
        var tempData = assign({}, this.state.tempData);
        if (tempData) {
            set(tempData, path, value);
            this.setState({tempData});
        }
    },
    getInitialState: function() {
        // console.log(this.props.params);
        return {
          tempData: {},
          reqStatus:null,
        };
    },
    _onChange: function(){
      if(ResetPasswordStore.getResetPSW()){
        this.setState({ reqStatus:true });
      }
    },
    _savePassword: function() {
      var data = {
        user: this.props.params.user,
        password: this.state.tempData.newPassword,
        token: this.props.params.token
      };
      ResetPasswordAction.resetPassword(data);
    },
    _returnLogin: function() {
      var that = this;
      that.setState({
        isLangLoaded: true
      },() => {
        that.context.router.replaceWith('login', { lang: this.props.params.lang });
      });
    },
    _getEditPasswordDialog: function() {
        let {newPassword, confirmNewPassword} = this.state.tempData,
            newPasswordProps = {
                floatingLabelText: I18N.Platform.Password.NewPassword,
                value: newPassword,
                onChange: this._bindMergeTemp("newPassword")
            },
            confirmNewPasswordProps = {
                floatingLabelText: I18N.Platform.Password.confirmNewPassword,
                value: confirmNewPassword,
                onChange: this._bindMergeTemp("confirmNewPassword")
            },
            saveButtonDisabled = false;

        if (!newPassword) {
            newPasswordProps.errorText = I18N.Platform.Password.Error02;
            saveButtonDisabled = true;
        } else if (newPassword.length > MAX_LENGTH) {
            newPasswordProps.errorText = I18N.Platform.MaxLengthError;
            saveButtonDisabled = true;
        }
        if (newPassword !== confirmNewPassword) {
            confirmNewPasswordProps.errorText = I18N.Platform.Password.Error03;
            saveButtonDisabled = true;
        }

        let actions = [< CusFlatButton disabled = {
                saveButtonDisabled
            }
            label = {
                I18N.Platform.Password.Confirm
            }
            onClick = {
                this._savePassword
            } />];

        return (
            <Dialog actions={actions} openImmediately={true} title={I18N.ResetPassword.Title} modal={true} contentStyle={{ width: '600px' }}>
                <div>{I18N.ResetPassword.Welcome1} {this.props.params.user} {I18N.ResetPassword.Welcome2}</div>
                <ul className="pop-userprofile-edit">
                    <li>
                        <TextField {...newPasswordProps}>
                            <input type="password"/>
                        </TextField>
                    </li>
                    <li>
                        <TextField {...confirmNewPasswordProps}>
                            <input type="password"/>
                        </TextField>
                    </li>
                </ul>
            </Dialog>
        );
    },
    _getSussDialog:function(){
      let goonProps = {
    		onClick: this._returnLogin,
    		label: I18N.Common.Button.GoOn
    	};
      let actions = [
  			<CusFlatButton {...goonProps} />
  		];
      return(
        <Dialog title={I18N.ResetPassword.SuccessTitle} actions={actions} modal={true} openImmediately={true}  contentStyle={{ width: '600px' }}>
          <div>{I18N.ResetPassword.SuccessTips}</div>
  			</Dialog>
      );
    },

    componentDidMount: function() {
      ResetPasswordStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
      ResetPasswordStore.removeChangeListener(this._onChange);
    },
    render: function() {
      if(this.state.reqStatus == true){
        return (
            <div>
                <div className="jazz-selectbg"></div>
                <div className="jazz-customerList">
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        {this._getSussDialog()}
                    </div>
                </div>
            </div>
        );
      }else{
        return (
            <div>
                <div className="jazz-selectbg"></div>
                <div className="jazz-customerList">
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        {this._getEditPasswordDialog()}
                    </div>
                </div>
            </div>
        );
      }

    }
});

module.exports = resetPSW;
