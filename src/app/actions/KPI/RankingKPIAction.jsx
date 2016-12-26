import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import { Action } from 'constants/actionType/KPI.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';

const RankingKPIAction = {
  getRank(customerId){
    Ajax.get(util.replacePathParams(Path.KPI.Rank.getRank, customerId), {
      params: {customerId},
      success: function(rank) {
        AppDispatcher.dispatch({
          type: Action.GET_GROUP_RANKING,
          data: rank,
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  merge(data){
    AppDispatcher.dispatch({
      type: Action.MERGE_GROUP_RANKING,
      data: data
    });
  },
  getGroupKpis(customerId){
    var that=this;
    Ajax.get(util.replacePathParams(Path.KPI.Group.getGroupKpis, customerId), {
      params: {customerId},
      success: function(list) {
        if(list.length!==0){
          that.getRank(customerId)
        }
        AppDispatcher.dispatch({
          type: Action.GET_GROUP_KPIS,
          data: list,
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  setRank(dto){
    var url = Path.KPI.Rank.setRank;
    Ajax.post(url,
      {
      params:dto,
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.SET_GROUP_RANKING
        });
      }
    });
  },
  getRankRecord(customerId,groupKpiId,rankType,buildingId){
    Ajax.get(util.replacePathParams(Path.KPI.Rank.rankRecord,customerId,groupKpiId,rankType,buildingId),
      {
      params:{
        customerId,groupKpiId,rankType,buildingId
      },
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_RANK_RECORD,
          data:resBody
        });
      }
    });
  },
}

export default RankingKPIAction;
