import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/Energy.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';
import {DataUsageType} from 'constants/ChartConstants.jsx';

const ScatterPlotAction = {
  getScatterPlotData(XAxisTagId,YAxisTagId,TimeRanges,Step,tagOptions,relativeDate,widgetId){
    var tagIds = [XAxisTagId,YAxisTagId];
    var submitParams = {
      tagIds: tagIds,
      viewOption: {
        DataUsageType: DataUsageType.Scatter,
        IncludeNavigatorData: true,
        Step,
        TimeRanges
      }
    };
    AppDispatcher.dispatch({
      type: Action.GET_ENERGY_DATA_LOADING,
      submitParams: submitParams,
      tagOptions: tagOptions,
      widgetId
    });

     Ajax.post(Path.DataAnalysis.getScatterPlotData, {
      avoidDuplicate:true,
      tag:submitParams.tagIds,
      params: {
        XAxisTagId,
        YAxisTagId,
        TimeRanges,
        Step
      },
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_SCATTER_PLOT_DATA,
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams,
          widgetId,
        });
      }
    });
  },
  setAxisData(xAxis,yAxis){
      AppDispatcher.dispatch({
          type: Action.SET_SCATTER_AXIS_DATA,
          xAxis,yAxis
        })
  },
}

export default ScatterPlotAction;