'use strict';
import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/hierarchySetting/Hierarchy.jsx';
import Ajax from '../../ajax/ajax.jsx';
let HierarchyAction = {
  GetHierarchys: function() {
    let customerId = parseInt(window.currentCustomerId);
    Ajax.post('/Hierarchy.svc/GetHierarchyTreeDtosRecursive', {
      params: {
        customerId: customerId,
      },
      success: function(hierarchys) {
        AppDispatcher.dispatch({
          type: Action.GET_HIERARCHY_TREE_DTOS,
          hierarchys: hierarchys
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  setCurrentSelectedNode: function(node) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_HIERARCHY_NODE,
      node: node
    });
  },
  //for customer
  getCustomersByFilter: function(customerId) {
    Ajax.post('/Customer.svc/GetCustomersByFilter', {
      params: {
        filter: {
          CustomerId: customerId,
        }
      },
      success: function(customer) {
        AppDispatcher.dispatch({
          type: Action.GET_CUSTOMER_FOR_HIERARCHY,
          customer: customer
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getLogListByCustomerId: function() {
    Ajax.post('/Hierarchy.svc/GetHierarchyImportHistory', {
      params: {
        customerId: parseInt(window.currentCustomerId)
      },
      success: function(logList) {
        AppDispatcher.dispatch({
          type: Action.GET_LOG_LIST_SUCCESS,
          logList: logList
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_LOG_LIST_ERROR,
        });
      }
    });
  },
};

module.exports = HierarchyAction;
