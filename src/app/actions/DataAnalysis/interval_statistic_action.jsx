import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/DataAnalysis.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';

const IntervalStatisticAction = {
  getSplitGatherInfo(params){
    Ajax.post(Path.DataAnalysis.getWidgetsplitgatherinfo, {
      params,
      success: function(infos) {
        AppDispatcher.dispatch({
          type: Action.GET_SPLIT_GATHER_INFO,
          infos
        });
      },
      error: function(err, res) {
      }
    })
  },
  modifySplit(index,status,split){
    AppDispatcher.dispatch({
      type: Action.MODIFY_SPLIT,
        index,split,status
      });
  }
}

export default IntervalStatisticAction;