'use strict';
import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/customerSetting/Label.jsx';
import Ajax from '../../ajax/ajax.jsx';

let LabelAction = {
  getLabelList: function() {
    Ajax.post('/Customer.svc/GetCustomerLabellings', {
      params: {
        filter: {
          CustomerId: parseInt(window.currentCustomerId)
        }
      },
      success: function(labelList) {
        AppDispatcher.dispatch({
          type: Action.GET_LABEL_LIST_SUCCESS,
          labelList: labelList
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_LABEL_LIST_ERROR
        });
      }
    });
  },
  setSelectedLabelIndex(index) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_LABEL,
      index: index
    });
  },
  cancelSaveLabel() {
    AppDispatcher.dispatch({
      type: Action.CANCEL_SAVE_LABEL
    });
  },
  modifyLabel(data) {
    var me = this;
    Ajax.post('/Customer.svc/ModifyCustomerLabelling', {
      params: {
        dto: data
      },
      success: function(label) {
        AppDispatcher.dispatch({
          type: Action.MODIFT_LABEL_SUCCESS,
          label: label
        });
        me.getLabelList();
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.MODIFT_LABEL_ERROR,
          errorText: res.text
        });
      }
    });
  },
  createLabel(data) {
    var me = this;
    Ajax.post('/Customer.svc/CreateCustomerLabelling', {
      params: {
        dto: data
      },
      success: function(label) {
        AppDispatcher.dispatch({
          type: Action.CREATE_LABEL_SUCCESS,
          tag: label
        });
        me.getLabelList();
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.CREATE_LABEL_ERROR,
          errorText: res.text
        });
      }
    });
  },
  deleteLabelById(id) {
    Ajax.post('/Customer.svc/DeleteCustomerLabelling', {
      params: {
        labellingId: id
      },
      success: function() {
        AppDispatcher.dispatch({
          type: Action.DELETE_LABEL_SUCCESS
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.DELETE_LABEL_ERROR,
          errorText: res.text
        });
      }
    });
  }
};

module.exports = LabelAction;
