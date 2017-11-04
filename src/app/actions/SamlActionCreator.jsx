/*jshint esversion: 6 */
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Saml.jsx';
import Ajax from '../ajax/Ajax.jsx';

module.exports = {

	getId: function(params) {
		Ajax.sso('/saml/acs?id=' + params, {
			success: function(res) {
				AppDispatcher.dispatch({
					type: Action.GET_ACS_SUCCESS,
					data: res
				});
			},
			error: function(err, res) {
			}
		});
	},

};
