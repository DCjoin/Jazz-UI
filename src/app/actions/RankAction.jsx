'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import CommonFuns from '../util/Util.jsx';
import {Action} from '../constants/actionType/Ranking.jsx';
import {DataConverter} from '../util/Util.jsx';
import Ajax from '../ajax/ajax.jsx';

let RankAction = {
  //for select tags from taglist and click search button.
  getRankTrendChartData(timeRanges, rankType, selectedList, relativeDate){
    var commodityList = selectedList.commodityList;
    var hierarchyList = selectedList.hierarchyList;
    var hierarchyIds = RankAction.getHierarchyIdsFromList(hierarchyList);
    var commodityIds = RankAction.getCommodityIdsFromList(commodityList);

    var submitParams = { hierarchyIds:hierarchyIds,
                         commodityIds:commodityIds,
                         rankType: rankType,
                         viewOption:{TimeRanges: timeRanges}
                       };

    AppDispatcher.dispatch({
         type: Action.GET_RANK_DATA_LOADING,
         submitParams: submitParams,
         selectedList: selectedList,
         relativeDate: relativeDate
    });

    Ajax.post('/Energy.svc/RankingEnergyUsageData', {
         params:submitParams,
         commonErrorHandling: false,
         success: function(energyData){
           AppDispatcher.dispatch({
               type: Action.GET_RANK_DATA_SUCCESS,
               energyData: energyData,
               submitParams: submitParams
           });
         },
         error: function(err, res){
           AppDispatcher.dispatch({
               type: Action.GET_RANK_DATA_ERROR,
               errorText: res.text,
               submitParams: submitParams
           });
         }
       });
  },
  getHierarchyIdsFromList(hierarchyList){
    let hierarchyIds =[];
    for(let i=0,len=hierarchyList.length; i<len; i++){
      hierarchyIds.push(hierarchyList[i].Id);
    }
    return hierarchyIds;
  },
  getCommodityIdsFromList(commodityList){
    let commodityIds =[];
    commodityIds.push(commodityList.commodityId);
    return commodityIds;
  }
};

module.exports = RankAction;
