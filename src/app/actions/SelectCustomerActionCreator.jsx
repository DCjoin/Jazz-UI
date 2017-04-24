/*jshint esversion: 6 */
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import SelectCustomerActionType from '../constants/actionType/SelectCustomer.jsx';
import Ajax from '../ajax/Ajax.jsx';
import Util from '../util/Util.jsx';

let {Action} = SelectCustomerActionType;

var listener = null;

module.exports = {
  selectCustomer: function(customer) {
    AppDispatcher.dispatch({type: Action.SELECT_ACCOUNT_SUCCESS, data: customer});
  },

  getCustomer: function(userId) {
    Ajax.post('/Customer/GetCustomersByFilter', {
      params : {
          "filter": {
              "UserId": userId,
              "Order": {
                  "Column": "Id",
                  "Type": 0
              }
          }
      },
      success: function(data) {
        console.log('Get Customers Ready,Total Num is '+ data.length);
        AppDispatcher.dispatch({type: Action.GET_SELECT_CUSTOMERS, data: data});
      },
    });
  }
};
