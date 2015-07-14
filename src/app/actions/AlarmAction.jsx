'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import CommonFuns from '../util/Util.jsx';
import {Action} from '../constants/actionType/Alarm.jsx';
import {DataConverter} from '../util/Util.jsx';
import Ajax from '../ajax/ajax.jsx';

const MONTHSTEP = 3,
      DAYSTEP = 2,
      HOURSTEP = 1;

let AlarmAction = {
  getHierarchyListByDate(date,step){
    Ajax.post('/TargetBaseline.svc/GetAlarmTagIdsByDate', {
        params: {date:date,customerId:window.currentCustomerId, step: step},
        success: function(alarmList){
          AppDispatcher.dispatch({
              type: Action.DATALIST_CHANGED,
              alarmList: alarmList
          });
        },
        error: function(err, res){
          AppDispatcher.dispatch({
              type: Action.GET_HIERARCHY_LIST_ERROR
          });
        }
    });
  },
  //only for alarm tag to get energy data.
  getAlarmTagData(date, step, tagOptions){

    let dateArray = AlarmAction.getDateByStep(date, step);
    let timeRange = [{StartTime:dateArray[0], EndTime:dateArray[1]}];
    let tagId = tagOptions[0].tagId;

    var submitParams = { tagIds:[tagId],
                         viewOption:{ DataUsageType: 1,
                                      IncludeNavigatorData: true,
                                      Step: step,
                                      TimeRanges: timeRange
                                   }
                       };

    AppDispatcher.dispatch({
         type: Action.GET_ALARM_TAG_DATA_LOADING,
         submitParams: submitParams,
         tagOptions: tagOptions
    });

    Ajax.post('/Energy.svc/GetTagsData', {
         params:submitParams,
         success: function(energyData){
           AppDispatcher.dispatch({
               type: Action.GET_TAG_DATA_SUCCESS,
               energyData: energyData,
               submitParams: submitParams
           });
         },
         error: function(err, res){
           AppDispatcher.dispatch({
               type: Action.GET_TAG_DATA_ERROR,
               submitParams: submitParams
           });
         }
       });
  },
  //for select tags from taglist and click search button.
  getEnergyData(date, step, tagOptions, relativeDate){
    var timeRange = date;

    var tagIds = AlarmAction.getTagIdsFromTagOptions(tagOptions);
    var submitParams = { tagIds:tagIds,
                         viewOption:{ DataUsageType: 1,
                                      IncludeNavigatorData: true,
                                      Step: step,
                                      TimeRanges: timeRange
                                   }
                       };

    AppDispatcher.dispatch({
         type: Action.GET_TAG_DATA_LOADING,
         submitParams: submitParams,
         tagOptions: tagOptions,
         relativeDate: relativeDate
    });

    Ajax.post('/Energy.svc/GetTagsData', {
         params:submitParams,
         success: function(energyData){
           AppDispatcher.dispatch({
               type: Action.GET_TAG_DATA_SUCCESS,
               energyData: energyData,
               submitParams: submitParams
           });
         },
         error: function(err, res){
           AppDispatcher.dispatch({
               type: Action.GET_TAG_DATA_ERROR,
               submitParams: submitParams
           });
         }
       });
  },
  getTagIdsFromTagOptions(tagOptions){
    let tagIds =[];
    for(let i=0,len=tagOptions.length; i<len; i++){
      tagIds.push(tagOptions[i].tagId);
    }

    return tagIds;
  },
  getDateByStep(dateStr, step){
    let startDate, endDate;
    if(step === HOURSTEP){
      startDate = new Date(parseInt(dateStr.substr(0,4)),parseInt(dateStr.substr(4,2))-1, parseInt(dateStr.substr(6,2)));
      endDate = new Date(parseInt(dateStr.substr(0,4)),parseInt(dateStr.substr(4,2))-1, parseInt(dateStr.substr(6,2)), 24);
    }else if(step === DAYSTEP){
      startDate = new Date(parseInt(dateStr.substr(0,4)),parseInt(dateStr.substr(4,2))-1, 1);
      endDate = new Date(parseInt(dateStr.substr(0,4)),parseInt(dateStr.substr(4,2)), 1);
    }else{
      startDate = new Date(parseInt(dateStr.substr(0,4)), 0, 1);
      endDate = new Date(parseInt(dateStr.substr(0,4)) + 1, 0, 1);
    }
    return [DataConverter.DatetimeToJson(startDate), DataConverter.DatetimeToJson(endDate)];
  },
  getDashboardByHierachy(hierId){
    Ajax.post('/DashBoard.svc/GetDashboardByHierachy', {
         params:{hierarchyId:hierId, userId: window.currentUserId},
         success: function(dashboardList){
           AppDispatcher.dispatch({
               type: Action.GET_DASHBOARD_BY_HIERARCHY_SUCCESS,
               dashboardList: dashboardList
           });
         },
         error: function(err, res){
           AppDispatcher.dispatch({
               type: Action.GET_DASHBOARD_BY_HIERARCHY_ERROR
           });
         }
       });
  },
  save2Dashboard(params, createNewDashboard){
    let url;
    if(!createNewDashboard){
      url = '/DashBoard.svc/CreateWidget';
    }else{
      url = '/DashBoard.svc/CreateDashboard';
    }
    Ajax.post(url, {
         params:params,
         commonErrorHandling:false,
         success: function(dashboardList){
           AppDispatcher.dispatch({
               type: Action.SAVE_TO_DASHBOARD_SUCESS
           });
         },
         error: function(err, res){
           AppDispatcher.dispatch({
               type: Action.SAVE_TO_DASHBOARD_ERROR,
               res:res
           });
         }
       });
  },
  ignoreAlarm(ids, isBatch){
    let url, dto={};
    if(isBatch){
      url = '/TargetBaseline.svc/IgnoreAlarmContinuousPoints';
      dto.ids = ids;
    }else{
      url = '/TargetBaseline.svc/IgnoreAlarmPoint';
      dto.id = ids;
    }

    Ajax.post(url, {
         params: dto,
         success: function(){

         },
         error: function(err, res){

         }
       });
  }
};

module.exports = AlarmAction;
