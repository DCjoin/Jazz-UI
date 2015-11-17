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
  setSelectedReportItem(reportId) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_REPORT_ITEM,
      tagId: reportId
    });
  }
};
module.exports = ReportAction;
