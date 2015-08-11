'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import CommonFuns from '../util/Util.jsx';
import ActionTypes from '../constants/actionType/Energy.jsx';
import {DataConverter} from '../util/Util.jsx';
import Ajax from '../ajax/ajax.jsx';


let getTagIdsFromTagOptions = function(tagOptions){
  let tagIds =[];
  for(let i=0,len=tagOptions.length; i<len; i++){
    tagIds.push(tagOptions[i].tagId);
  }

  return tagIds;
};

let EnergyAction = {
  //for select tags from taglist and click search button.
  getPieEnergyData(date, step, tagOptions, relativeDate){
    var timeRange = date;

    var tagIds = getTagIdsFromTagOptions(tagOptions);
    var submitParams = { tagIds:tagIds,
                         viewOption:{ DataUsageType: 4,
                                      IncludeNavigatorData: false,
                                    //  Step: step,
                                      TimeRanges: timeRange
                                   }
                       };

    AppDispatcher.dispatch({
         type: ActionTypes.GET_ENERGY_DATA_LOADING,
         submitParams: submitParams,
         tagOptions: tagOptions,
         relativeDate: relativeDate
    });

    Ajax.post('/Energy.svc/AggregateTagsData', {
         params:submitParams,
         commonErrorHandling: false,
         success: function(energyData){
           AppDispatcher.dispatch({
               type: ActionTypes.GET_ENERGY_DATA_SUCCESS,
               energyData: energyData,
               submitParams: submitParams
           });
         },
         error: function(err, res){
           AppDispatcher.dispatch({
               type: ActionTypes.GET_ENERGY_DATA_ERROR,
               errorText: res.text,
               submitParams: submitParams
           });
         }
       });
  },
  getEnergyTrendChartData(date, step, tagOptions, relativeDate){
    var timeRange = date;

    var tagIds = getTagIdsFromTagOptions(tagOptions);
    var submitParams = { tagIds:tagIds,
                         viewOption:{ DataUsageType: 1,
                                      IncludeNavigatorData: true,
                                      Step: step,
                                      TimeRanges: timeRange
                                   }
                       };

    AppDispatcher.dispatch({
         type: ActionTypes.GET_ENERGY_DATA_LOADING,
         submitParams: submitParams,
         tagOptions: tagOptions,
         relativeDate: relativeDate
    });

    Ajax.post('/Energy.svc/GetTagsData', {
         params:submitParams,
         commonErrorHandling: false,
         success: function(energyData){
           AppDispatcher.dispatch({
               type: ActionTypes.GET_ENERGY_DATA_SUCCESS,
               energyData: energyData,
               submitParams: submitParams
           });
         },
         error: function(err, res){
           AppDispatcher.dispatch({
               type: ActionTypes.GET_ENERGY_DATA_ERROR,
               errorText: res.text,
               submitParams: submitParams
           });
         }
       });
  },
  getEnergyRawData(date, step, tagOptions, relativeDate){
    var timeRange = date;

    var tagIds = getTagIdsFromTagOptions(tagOptions);
    var submitParams = { tagIds:tagIds,
                         viewOption:{
                           DataOption:{
                             OriginalValue: true,
                             WithoutAdditionalValue: true
                           },
                           DataUsageType: null,
                           IncludeNavigatorData: false,
                           Step: step,
                           TimeRanges: timeRange
                          }
                       };

    AppDispatcher.dispatch({
         type: ActionTypes.GET_ENERGY_DATA_LOADING,
         submitParams: submitParams,
         tagOptions: tagOptions,
         relativeDate: relativeDate
    });

    Ajax.post('/Energy.svc/GetTagsData', {
         params:submitParams,
         commonErrorHandling: false,
         success: function(energyData){
           AppDispatcher.dispatch({
               type: ActionTypes.GET_ENERGY_DATA_SUCCESS,
               energyData: energyData,
               submitParams: submitParams
           });
         },
         error: function(err, res){
           AppDispatcher.dispatch({
               type: ActionTypes.GET_ENERGY_DATA_ERROR,
               errorText: res.text,
               submitParams: submitParams
           });
         }
       });
  }
};
module.exports = EnergyAction;
