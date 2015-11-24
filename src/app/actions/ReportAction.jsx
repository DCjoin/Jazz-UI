'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Report.jsx';
import Ajax from '../ajax/ajax.jsx';
let ReportAction = {
  getReportListByCustomerId(customerId) {
    Ajax.post('/DataReport.svc/GetExportByCustomerId', {
      params: {
        customerId: customerId
      },
      success: function(reportList) {
        AppDispatcher.dispatch({
          type: Action.GET_REPORT_LIST_SUCCESS,
          reportList: reportList
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_REPORT_LIST_ERROR
        });
      }
    });
  },
  getTemplateListByCustomerId(customerId) {
    Ajax.post('/DataReport.svc/GetExportTemplateByCustomerId', {
      params: {
        customerId: customerId
      },
      success: function(templateList) {
        AppDispatcher.dispatch({
          type: Action.GET_TEMPLATE_LIST_SUCCESS,
          templateList: templateList
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_TEMPLATE_LIST_ERROR
        });
      }
    });
  },
  setSelectedReportItem(reportItem) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_REPORT_ITEM,
      reportItem: reportItem
    });
  },
  saveCustomerReport(data) {
    Ajax.post('/DataReport.svc/SaveCustomerReport', {
      params: {
        dto: data
      },
      success: function(curReport) {
        AppDispatcher.dispatch({
          type: Action.SAVE_REPORT_SUCCESS,
          curReport: curReport
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.SAVE_REPORT_ERROR
        });
      }
    });
  },
  deleteReportById(id) {
    Ajax.post('/DataReport.svc/DeleteReportById', {
      params: {
        id: id
      },
      success: function() {
        AppDispatcher.dispatch({
          type: Action.DELETE_REPORT_SUCCESS,
          id: id
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.DELETE_REPORT_ERROR
        });
      }
    });
  }
};
module.exports = ReportAction;
