'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Report.jsx';
import Ajax from '../ajax/Ajax.jsx';
import util from 'util/Util.jsx'
import CustomForm from 'util/CustomForm.jsx'
let ReportAction = {
  getReportListByCustomerId(hierarchyId, sortBy, order) {
    Ajax.post('/DataReport/GetExportByHierarchyId', {
      params: {
        dto: {
          HierarchyId: hierarchyId,
          sortBy: sortBy,
          order: order
        }
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
  getTemplateListByCustomerId(customerId, sortBy, order) {
    Ajax.post('/DataReport/GetExportTemplateByCustomerId', {
      params: {
        dto: {
          customerId: customerId,
          sortBy: sortBy,
          order: order
        }
      },
      success: function(templateList) {
        AppDispatcher.dispatch({
          type: Action.GET_REPORT_TEMPLATE_LIST_SUCCESS,
          templateList: templateList
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_REPORT_TEMPLATE_LIST_ERROR
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
    Ajax.post('/DataReport/SaveReport', {
      params: {
        dto: data
      },
      commonErrorHandling:false,
      success: function(curReport) {
        AppDispatcher.dispatch({
          type: Action.SAVE_REPORT_SUCCESS,
          curReport: curReport
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.SAVE_REPORT_ERROR,
          errorText: res.text,
          errorReport: data
        });
      }
    });
  },
  deleteReportById(id) {
    Ajax.post('/DataReport/DeleteReportById', {
      params: {
        Id: id
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
  deleteTemplateById(id) {
    Ajax.post('/DataReport/DeleteTemplateById', {
      params: {
        id: id
      },
      success: function() {
        AppDispatcher.dispatch({
          type: Action.DELETE_TEMPLATE_SUCCESS,
          id: id
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getTagData(cusomterId,nodeId, option, page, filters) {
    Ajax.post('/Tag/GetTagsByFilter?', {
      params: {
        filter: {
          Association: {
            AssociationId: nodeId,
            AssociationOption: option
          },
          CustomerId: parseInt(cusomterId),
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
  getSelectedTagData(cusomterId,ids) {
    Ajax.post('/Tag/GetTagsByFilter?', {
      params: {
        filter: {
          Ids: ids,
          CustomerId: parseInt(cusomterId),
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
          tagData: ids ? {...tagData, ...{
                            Data: ids.map(id => tagData.filter(data => data.Id === id)[0])
                          }} : tagData
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getPreviewUrl(reportId, year) {
    return Ajax.get( util.replacePathParams('/datareport/previewurl/{reportId}/{year}', reportId, year), {
      success: function(res) {
        AppDispatcher.dispatch({
          type: Action.GET_SELECTED_REPORT_PREVIEW_URL_SUCCESS,
          data: res
        });
      },
      error: function(err, res) {
        util.popupErrorMessage(util.getErrorMessageByRes(res.text), '', false);
        AppDispatcher.dispatch({
          type: Action.GET_SELECTED_REPORT_PREVIEW_URL_ERROR,
        });
      }
    })
  },
  setFirst(hierarchyId, reportId) {
    AppDispatcher.dispatch({
      type: Action.SET_FIRST,
      data: reportId
    });
    // let getReportListByCustomerId = this.getReportListByCustomerId.bind(this);
    return Ajax.post( util.replacePathParams('/datareport/first/{hierarchyId}/{reportId}', hierarchyId, reportId), {
      success: function(res) {
        // getReportListByCustomerId(hierarchyId, 'createTime', 'asc');
      }
    })
  },
  allBuildingsExistence(customerid) {
    return Ajax.get( util.replacePathParams('/datareport/allbuildings/existence/{customerid}', customerid), {
      success: function(res) {
        AppDispatcher.dispatch({
          type: Action.ALL_BUILDINGS_EXISTENCE,
          data: res
        });
      }
    })
  },
  download(Id, Year) {
    // var iframe = document.createElement('iframe');
    // iframe.style.display = 'none';
    // iframe.src = `API/DataReport/ExportEnergyUsageDataAccordingToTemplate?Id=${Id}&Year=${Year}`;
    // iframe.onload = function() {
    //   document.body.removeChild(iframe);
    // };
    // document.body.appendChild(iframe);

    let form = new CustomForm({
      target: '_blank',
      action: window.location.href.split('#')[0] + 'API/DataReport/ExportEnergyUsageDataAccordingToTemplate'
    });
    form.setParams({
      Id,
      Year
    });
    form.submit();
  }
};
module.exports = ReportAction;
