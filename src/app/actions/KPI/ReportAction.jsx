import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import { Action } from 'constants/actionType/KPI.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';


const ReportAction = {
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
  getTagData(cusomterId,nodeId, option, filters,type) {
    Ajax.post('/Tag/GetTagsByFilter?', {
      params: {
        filter: {
          Association: {
            AssociationId: nodeId,
            AssociationOption: option
          },
          Type:type===1?1:null,
          CustomerId: parseInt(cusomterId),
          IncludeAssociationName: true
        },
        filters: filters,
        limit: 20*10000,
        page: 1,
        size: 20*10000,
        start: 1
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
        limit: 20*10000,
        page: 1,
        size: 20*10000,
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
  },
  saveCustomerReport(data) {
    data.IsNew=true;
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
}

export default ReportAction;
