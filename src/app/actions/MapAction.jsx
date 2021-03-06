'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import CommonFuns from '../util/Util.jsx';
import { Action } from '../constants/actionType/Map.jsx';
import { DataConverter } from '../util/Util.jsx';
import Ajax from '../ajax/Ajax.jsx';

const MONTHSTEP = 3,
  DAYSTEP = 2,
  HOURSTEP = 1;
let _relativeDateType = null;

let MapAction = {
  setSelectedDate(dateId) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_DATE,
      dateId: dateId
    });
  },
  getMapBuildingsByCustomerId: function(relativeDateType,customerId) {
    //console.log('getMapBuildingsByCustomerId:'+ customerCode);
    _relativeDateType = relativeDateType;
    Ajax.post('/Energy/GetMapBuildingsByCustomerId', {
      params: {
        baseTime: DataConverter.DatetimeToJson(new Date()),
        customerId: customerId,
        //customerId: customerCode,
        relativeDateType: relativeDateType
      },
      success: function(mapList) {
        AppDispatcher.dispatch({
          type: Action.SET_MAP_LIST,
          mapList: mapList
        });
      },
      error: function(err, res) {}
    });
  },
  GetMapBuildingByBuildingId: function(buildingId) {
    Ajax.post('/Energy/GetMapBuildingByBuildingId', {
      params: {
        baseTime: DataConverter.DatetimeToJson(new Date()),
        buildingId: buildingId,
        relativeDateType: _relativeDateType
      },
      success: function(buildInfo) {
        AppDispatcher.dispatch({
          type: Action.SET_MAP_BUILDING,
          buildInfo: buildInfo
        });
      },
      error: function(err, res) {}
    });
  }

};

module.exports = MapAction;
