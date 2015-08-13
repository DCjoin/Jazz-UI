'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import CommonFuns from '../util/Util.jsx';
import ActionTypes from '../constants/actionType/Carbon.jsx';
import {DataConverter} from '../util/Util.jsx';
import Ajax from '../ajax/ajax.jsx';


let getTagIdsFromcommOptions = function(commOptions){
  let tagIds =[];
  for(let i=0,len=commOptions.length; i<len; i++){
    tagIds.push(commOptions[i].tagId);
  }

  return tagIds;
};

let CarbonAction = {
  //for select tags from taglist and click search button.
  getPieCarbonData(date, step, commOptions, relativeDate){
    var timeRange = date;

    var tagIds = getTagIdsFromcommOptions(commOptions);
    var submitParams = { tagIds:tagIds,
                         viewOption:{ DataUsageType: 4,
                                      IncludeNavigatorData: false,
                                    //  Step: step,
                                      TimeRanges: timeRange
                                   }
                       };

    AppDispatcher.dispatch({
         type: ActionTypes.GET_CARBON_DATA_LOADING,
         submitParams: submitParams,
         commOptions: commOptions,
         relativeDate: relativeDate
    });

    Ajax.post('/Energy.svc/AggregateCarbonUsageData', {
         params:submitParams,
         commonErrorHandling: false,
         success: function(carbonData){
           AppDispatcher.dispatch({
               type: ActionTypes.GET_CARBON_DATA_SUCCESS,
               carbonData: carbonData,
               submitParams: submitParams
           });
         },
         error: function(err, res){
           AppDispatcher.dispatch({
               type: ActionTypes.GET_CARBON_DATA_ERROR,
               errorText: res.text,
               submitParams: submitParams
           });
         }
       });
  },
  getCarbonTrendChartData(date, step, commOptions, relativeDate){
    var timeRange = date;

    var tagIds = getTagIdsFromcommOptions(commOptions);
    var submitParams = { tagIds:tagIds,
                         viewOption:{ DataUsageType: 1,
                                      IncludeNavigatorData: true,
                                      Step: step,
                                      TimeRanges: timeRange
                                   }
                       };

    AppDispatcher.dispatch({
         type: ActionTypes.GET_CARBON_DATA_LOADING,
         submitParams: submitParams,
         commOptions: commOptions,
         relativeDate: relativeDate
    });

    Ajax.post('/Carbon.svc/GetCarbonUsageData', {
         params:submitParams,
         commonErrorHandling: false,
         success: function(carbonData){
           AppDispatcher.dispatch({
               type: ActionTypes.GET_CARBON_DATA_SUCCESS,
               carbonData: carbonData,
               submitParams: submitParams
           });
         },
         error: function(err, res){
           AppDispatcher.dispatch({
               type: ActionTypes.GET_CARBON_DATA_ERROR,
               errorText: res.text,
               submitParams: submitParams
           });
         }
       });
  }
};
module.exports = CarbonAction;
