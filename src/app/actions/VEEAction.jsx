'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/VEE.jsx';
import Ajax from '../ajax/ajax.jsx';

let VEEAction = {
  GetVEERules: function() {
    Ajax.post('/Administration.svc/GetTouTariff', {
      filter: {
        CustomerId: window.currentCustomerId,
      },
      success: function(rules) {
        AppDispatcher.dispatch({
          type: Action.GET_VEE_RULES,
          rules: rules
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  setCurrentSelectedId: function(id) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_RULE_ID,
      id: id
    });
  },
};

module.exports = VEEAction;
