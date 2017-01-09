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
}

export default ReportAction;
