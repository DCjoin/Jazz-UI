import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/DataAnalysis.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from 'constants/Path.jsx';

let getTagIdsFromTagOptions = function(tagOptions) {
  let tagIds = [];
  for (let i = 0, len = tagOptions.length; i < len; i++) {
    tagIds.push(tagOptions[i].tagId);
  }
  return tagIds;
};

const BasicAnalysisAction = {

  getWidgetGatherInfo(timeRanges,step,tagOptions){
    var url = Path.DataAnalysis.getWidgetGatherInfo;
    var tagIds = getTagIdsFromTagOptions(tagOptions);
    Ajax.post(url,
      {
      params: {
        tagIds: tagIds,
        viewOption: {
          DataUsageType: 1,
          IncludeNavigatorData: true,
          Step: step,
          TimeRanges: timeRanges
        }
      },
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
  setInitialWidgetDto(dto){
    AppDispatcher.dispatch({
      type: Action.SET_INITIAL_WIDGET_DTO,
      dto
    });
  }
}

export default BasicAnalysisAction;
