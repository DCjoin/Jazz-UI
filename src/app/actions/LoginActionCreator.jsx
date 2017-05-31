/*jshint esversion: 6 */
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import LoginActionType from '../constants/actionType/Login.jsx';

import Ajax from '../ajax/Ajax.jsx';

let { Action } = LoginActionType;

module.exports = {
	authLogin: (UserId, Token) => {
		Ajax.post('/AccessControl/ValidateUserWithToken ', {
			params: {
				Key: UserId,
				Value: Token,
			},
			success: function(res) {
				AppDispatcher.dispatch({
					type: Action.LOGIN_SUCCESS,
					data: res
				});
			},
			commonErrorHandling: false,
			error: function(err, res) {
				AppDispatcher.dispatch({
					type: Action.LOGIN_ERROR,
					data: res.body
				});
			}
		});		
	},
	login: function(params) {
		Ajax.post('/AccessControl/ValidateUser', {
			params: params,
			success: function(res) {
				AppDispatcher.dispatch({
					type: Action.LOGIN_SUCCESS,
					data: res
				});
			},
			commonErrorHandling: false,
			error: function(err, res) {
				AppDispatcher.dispatch({
					type: Action.LOGIN_ERROR,
					data: res.body
				});
			}
		});
	},
	logout: function(params) {
		AppDispatcher.dispatch({
			type: Action.LOGOUT
		});
	},

	reqPwdReset:function(username, email){
		Ajax.post('/Common/ReqPwdReset', {
			params: {
				"username": username,
				"email": email,
				"language":'en-us'
			},
			success: function(res) {
				AppDispatcher.dispatch({
					type: Action.REQ_PSWRESET_SUCCESS,
					data: res
				});
			},
			error: function(err, res) {
				// console.log(JSON.stringify(err,0,1) + JSON.stringify(res,0,1));
				AppDispatcher.dispatch({
					type: Action.REQ_PSWRESET_ERROR,
					data: res.body
				});
			}
		});
	},
	reqDemoApply:function(email){
		// console.log(email);
		Ajax.post('/Common/reqdemo', {
			params: {
				"email": email
			},
			success: function(res) {
				AppDispatcher.dispatch({
					type: Action.REQ_DEMO_APPLY_SUCCESS,
					data: res
				});
			},
			error: function(err, res) {
				console.log(JSON.stringify(err,0,1) + JSON.stringify(res,0,1));
				AppDispatcher.dispatch({
					type: Action.REQ_DEMO_APPLY_ERROR,
					data: res.body
				});
			}
		});
	},

	demoLogin:function(params){
		Ajax.post('/Common/demologin', {
			params: {
				"u": params.UserName,
				"t": params.Password,
			},
			success: function(res) {
        // console.log('LoginActionCreator:'+JSON.stringify(res,0,1));
				AppDispatcher.dispatch({
					type: Action.LOGIN_SUCCESS,
					data: res
				});
			},
			error: function(err, res) {
        // console.log(JSON.stringify(err,0,1) + JSON.stringify(res,0,1));
				AppDispatcher.dispatch({
					type: Action.LOGIN_ERROR,
					data: res.body
				});
			}
		});
	},

};
