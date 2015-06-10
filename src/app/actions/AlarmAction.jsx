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
  changeDateType(dateType){
    AppDispatcher.dispatch({
        type: Action.DATETYPE_CHANGED,
        dateType: dateType
    });
  },
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
  /*
   date format:'20150101' or timeRange like

  */
  getAlarmTagData(tagIds, date, step, hierName){
    var timeRange;
    if(CommonFuns.isArray(date)){
      timeRange = date;
    }else{
      let dateArray = AlarmAction.getDateByStep(date, step);
      timeRange = [{StartTime:dateArray[0], EndTime:dateArray[1]}];
    }

    var tags = CommonFuns.isArray(tagIds) ? tagIds:[tagIds];
    var submitParams = { tagIds:tags,
                         viewOption:{ DataUsageType: 1,
                                      IncludeNavigatorData: true,
                                      Step: step,
                                      TimeRanges: timeRange
                                   }
                       };

    AppDispatcher.dispatch({
         type: Action.GET_TAG_DATA_LOADING,
         submitParams: submitParams,
         hierName: hierName
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
  getDateByStep(dateStr, step){
    let startDate, endDate;
    if(step === HOURSTEP){
      startDate = new Date(parseInt(dateStr.substr(0,4)),parseInt(dateStr.substr(4,2)), parseInt(dateStr.substr(6,2)));
      endDate = new Date(parseInt(dateStr.substr(0,4)),parseInt(dateStr.substr(4,2)), parseInt(dateStr.substr(6,2)), 24);
    }else if(step === DAYSTEP){
      startDate = new Date(parseInt(dateStr.substr(0,4)),parseInt(dateStr.substr(4,2)), 1);
      endDate = new Date(parseInt(dateStr.substr(0,4)),parseInt(dateStr.substr(4,2)) + 1, 1);
    }else{
      startDate = new Date(parseInt(dateStr.substr(0,4)), 0, 1);
      endDate = new Date(parseInt(dateStr.substr(0,4)) + 1, 0, 1);
    }
    return [DataConverter.DatetimeToJson(startDate), DataConverter.DatetimeToJson(endDate)];
  },
  getDashboardByHierachy(hierId){
    Ajax.post('/DashBoard.svc/GetDashboardByHierachy', {
        params: {userId:parseInt(window.currentUserId), hierarchyId: hierId},
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
  }
};

module.exports = AlarmAction;
