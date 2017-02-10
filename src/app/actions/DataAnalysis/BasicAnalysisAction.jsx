import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/DataAnalysis.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from 'constants/Path.jsx';

const BasicAnalysisAction = {

  getWidgetGatherInfo(dto){
    var url = Path.DataAnalysis.getWidgetGatherInfo;
    Ajax.post(url,
      {
      params: dto,
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_WIDGET_GATHER_INFO,
          data:resBody
        });
      },
      error: function(err, res) {
        // let ErrorMsg = I18N.format(util.getErrorMessageByRes(res.text),params.GroupKpiSetting.IndicatorName);
        // AppDispatcher.dispatch({
        //   type: Action.KPI_GROUP_ERROR,
        //   title: I18N.Platform.ServiceProvider.ErrorNotice,
        //   content: ErrorMsg,
        // });
        console.log(err, res);
      }
    });
  },
}

export default BasicAnalysisAction;
