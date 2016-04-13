/*jshint esversion: 6 */
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import SelectCustomerActionType from '../constants/actionType/SelectCustomer.jsx';
import Ajax from '../ajax/Ajax.jsx';
import Path from '../constants/Path.jsx';
import Util from '../util/util.jsx';

let {Action} = SelectCustomerActionType;

var listener = null;


module.exports = {
  selectCustomer: function(customer) {
    AppDispatcher.dispatch({type: Action.SELECT_ACCOUNT_SUCCESS, data: customer});
  },

  getCustomer: function(userId) {
    console.log('*****userId is:'+userId);
    Ajax.post('/Customer.svc/GetCustomersByFilter', {
      params : {
        "SpId":1,
        "CustomerId": 100002,
        "Order": {
            "Column": "Name",
            "Type": 0
        }
      },
      success: function(data) {
        console.log('*****data is:'+ data);
        AppDispatcher.dispatch({type: Action.GET_CUSTOMERS, data: data});
      },
    });
  }
};
