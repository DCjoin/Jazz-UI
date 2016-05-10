/*jshint esversion: 6 */
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import ResetPSWActionType from '../constants/actionType/ResetPassword.jsx';

import Ajax from '../ajax/ajax.jsx';

let { Action } = ResetPSWActionType;

module.exports = {
	resetPassword:function(data){
		Ajax.post('/Common/resetpwd', {
			params: {
        "u": data.user,
        "t": data.token,
        "password": data.password
      },
			success: function(res) {
				AppDispatcher.dispatch({
					type: Action.RESET_PASSWORD_SUCCESS,
					data: res
				});
			},
			error: function(err, res) {
				AppDispatcher.dispatch({
					type: Action.RESET_PASSWORD_ERROR,
					data: res.body
				});
			}
		});

	},
};
