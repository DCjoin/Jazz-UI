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
  setDefaultReportItem() {
    AppDispatcher.dispatch({
      type: Action.SET_DEFAULT_REPORT_ITEM
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
        console.log(err, res);
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
        console.log(err, res);
      }
    });
  },
  getTagData(nodeId, option, page, filters) {
    Ajax.post('/Tag.svc/GetTagsByFilter?', {
      params: {
        filter: {
          Association: {
            AssociationId: nodeId,
            AssociationOption: option
          },
          CustomerId: parseInt(window.currentCustomerId),
          IncludeAssociationName: true
        },
        filters: filters,
        limit: 20,
        page: page,
        size: 20,
        start: 20 * (page - 1)
      },
      success: function(tagData) {
        AppDispatcher.dispatch({
          type: Action.GET_REPORT_TAG_DATA_SUCCESS,
          tagData: tagData
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getSelectedTagData(ids) {
    Ajax.post('/Tag.svc/GetTagsByFilter?', {
      params: {
        filter: {
          Ids: ids,
          CustomerId: parseInt(window.currentCustomerId),
          IncludeAssociationName: true
        },
        limit: 20,
        page: 1,
        size: 0,
        start: 0
      },
      success: function(tagData) {
        AppDispatcher.dispatch({
          type: Action.GET_SELECTED_REPORT_TAG_DATA_SUCCESS,
          tagData: tagData
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  }
};
module.exports = ReportAction;
