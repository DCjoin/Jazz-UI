import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/Energy.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';


const ScatterPlotAction = {
  getEnergyData(XAxisTagId,YAxisTagId,timeRange, step){
    Ajax.post(Path.DataAnalysis.getScatterPlotData, {
      avoidDuplicate:true,
      tag:[XAxisTagId,YAxisTagId],
      params: {
        XAxisTagId,
        YAxisTagId,
        TimeRanges:timeRange,
        Step:step
      },
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_SCATTER_PLOT_DATA,
          energyData,
          XAxisTagId,YAxisTagId
        });
      },
      error: function(err, res) {
      }
    });
  },
  setAxisData(xAxis,yAxis){
      AppDispatcher.dispatch({
          type: Action.SET_SCATTER_AXIS_DATA,
          xAxis,yAxis
        })
  },
  clearAxis(){
      AppDispatcher.dispatch({
          type: Action.CLEAR_AXIS_DATA,
        })
  }
}

export default ScatterPlotAction;