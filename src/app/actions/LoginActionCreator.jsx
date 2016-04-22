/*jshint esversion: 6 */
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import LoginActionType from '../constants/actionType/Login.jsx';

import Ajax from '../ajax/ajax.jsx';

let { Action } = LoginActionType;

module.exports = {
	login: function(params) {
    //console.log(JSON.stringify(params,0,1));
		//由于"/webhost/API"未完全被替换，因此，临时使用newPost
		Ajax.newPost('/AccessControl/ValidateUser', {
			params: params,
			success: function(res) {
        //console.log('LoginActionCreator:'+JSON.stringify(res,0,1));
				AppDispatcher.dispatch({
					type: Action.LOGIN_SUCCESS,
					data: res
				});
			},
			error: function(err, res) {
        //console.log(JSON.stringify(err,0,1) + JSON.stringify(res,0,1));
				AppDispatcher.dispatch({
					type: Action.LOGIN_ERROR,
					data: res.body
				});
			}
		});
	},
};
