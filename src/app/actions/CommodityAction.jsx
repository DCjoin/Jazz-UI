'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import {Action} from '../constants/actionType/Commodity.jsx';
import Ajax from '../ajax/ajax.jsx';

let CommodityAction = {
  loadCommodityList(hierId,dimId){
    Ajax.post('/Energy.svc/GetCommodities', {
      params: {
        hierarchyId: hierId,
        areaDimensionId:dimId,
        limit: 25,
        page: 1,
        start: 0
      },
      success: function(CommodityList){
        AppDispatcher.dispatch({
          type: Action.GET_COMMODITY_DATA_SUCCESS,
          CommodityList: CommodityList
        });
      },
      error: function(err, res){
        console.log(err,res);
      }
    });
  },
  setEnergyConsumptionType:function(typeData){
    AppDispatcher.dispatch({
      type: Action.SET_ENERGY_CONSUMPTION_TYPE,
      typeData:typeData
    });
  },
  setCurrentHierarchyInfo:function(hierId,hierName){
    AppDispatcher.dispatch({
      type: Action.SET_CURRENT_HIERARCHY_ID,
      hierId:hierId,
      hierName:hierName
    });
  },
  setCurrentDimId:function(dimId){
      AppDispatcher.dispatch({
        type: Action.SET_CURRENT_DIM_ID,
        dimId:dimId
      });
  },
  resetData:function(){
      AppDispatcher.dispatch({
        type: Action.RESET_DATA,
      });
  },
  setCommoditySelectStatus:function(commodityId,commodityName,selected){
    AppDispatcher.dispatch({
      type: Action.SET_COMMODITY_STATUS,
      commodityId:commodityId,
      commodityName:commodityName,
      selected:selected
    });
  }
};

module.exports = CommodityAction;
