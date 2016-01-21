'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Customer.jsx';
import Ajax from '../ajax/ajax.jsx';
import Immutable from 'immutable';
import CommonFuns from '../util/Util.jsx';

let _Column = null;
let CustomerAction = {
  GetCustomers: function(Column) {
    //Column:Name,StartDate
    _Column = Column;
    Ajax.post('/Customer.svc/GetCustomersByFilter', {
      params: {
        filter: {
          UserId: null,
          Order: {
            Column: Column,
            Type: 0
          }
        }
      },
      success: function(customers) {
        AppDispatcher.dispatch({
          type: Action.GET_CUSTOMERS,
          customers: customers
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  GetCustomerEnergyInfos: function(id) {
    Ajax.post('/Customer.svc/GetCustomerEnergyInfosByCustomerId', {
      params: {
        customerId: id
      },
      success: function(energyInfo) {
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_INFO,
          energyInfo: energyInfo
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  setCurrentSelectedId: function(id) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_COSTOMER_ID,
      id: id
    });
  },
  merge: function(data) {
    AppDispatcher.dispatch({
      type: Action.MERGE_CUSTOMER,
      data: data
    });
  },
  mergeEnergy: function(data) {
    AppDispatcher.dispatch({
      type: Action.MERGE_CUSTOMER_ENERGYINFO,
      data: data
    });
  },
  reset: function() {
    AppDispatcher.dispatch({
      type: Action.RESET_CUSTOMER,
    });
  },
  SaveCustomerEnergyInfo: function(info) {
    var that = this;
    Ajax.post('/Customer.svc/SaveCustomerEnergyInfo', {
      params: {
        customerEnergyInfo: info
      },
      commonErrorHandling: false,
      success: function(customer) {
        AppDispatcher.dispatch({
          type: Action.SAVE_CUATOMER_ENERGYINFO_SUCCESS,
          energyInfo: customer
        });
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.CUSTOMER_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
};
module.exports = CustomerAction;
