import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/Energy.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from 'constants/Path.jsx';

const BubbleAction = {
  getEnergyData(XAxisTagId,YAxisTagId,AreaTagId,timeRange, step){
    Ajax.post(Path.DataAnalysis.getBubbleData, {
      avoidDuplicate:true,
      tag:[XAxisTagId,YAxisTagId,AreaTagId],
      params: {
        XAxisTagId,
        YAxisTagId,
        AreaTagId,
        TimeRanges:timeRange,
        Step:step
      },
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_BUBBLE_DATA,
          energyData,
          XAxisTagId,YAxisTagId,AreaTagId
        });
      },
      error: function(err, res) {
      }
    });
  },
  setAxisData(xAxis,yAxis,area){
      AppDispatcher.dispatch({
          type: Action.SET_BUBBLE_AXIS_DATA,
          xAxis,yAxis,area
        })
  },
  clearAxis(){
      AppDispatcher.dispatch({
          type: Action.CLEAR_BUBBLE_AXIS_DATA,
        })
  }
}

export default BubbleAction;