'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Commodity.jsx';
import Ajax from '../ajax/ajax.jsx';

let CommodityAction = {
  loadCommodityList(hierId, dimId) {
    Ajax.post('/Energy.svc/GetCommodities', {
      params: {
        hierarchyId: hierId,
        areaDimensionId: dimId,
        limit: 25,
        page: 1,
        start: 0
      },
      success: function(CommodityList) {
        AppDispatcher.dispatch({
          type: Action.GET_COMMODITY_DATA_SUCCESS,
          CommodityList: CommodityList
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  loadRankingCommodityList(list) {
    var hierarchyIds = [];
    list.forEach(function(node) {
      hierarchyIds.push(node.get('Id'))
    });
    Ajax.post('/Energy.svc/RankingGetCommodities', {
      params: {
        hierarchyIds: hierarchyIds,
        limit: 25,
        page: 1,
        start: 0
      },
      success: function(CommodityList) {
        AppDispatcher.dispatch({
          type: Action.GET_RANKING_COMMODITY_DATA_SUCCESS,
          CommodityList: CommodityList,
          treeList: list,
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  setEnergyConsumptionType: function(typeData) {
    AppDispatcher.dispatch({
      type: Action.SET_ENERGY_CONSUMPTION_TYPE,
      typeData: typeData
    });
  },
  setRankingECType: function(typeData) {
    AppDispatcher.dispatch({
      type: Action.SET_RANKING_EC_TYPE,
      typeData: typeData
    });
  },
  setCurrentHierarchyInfo: function(node) {
    // setTimeout(()=>{
    // AppDispatcher.dispatch({
    //   type: Action.SET_CURRENT_HIERARCHY_ID,
    //   hierId:hierId,
    //   hierName:hierName
    // });
    //   },0);
    AppDispatcher.dispatch({
      type: Action.SET_CURRENT_HIERARCHY_ID,
      hierId: node.Id,
      hierName: node.Name,
      node: node
    });
  },
  setCurrentDimInfo: function(dimNode) {
    AppDispatcher.dispatch({
      type: Action.SET_CURRENT_DIM_INFO,
      dimNode: dimNode
    });
  },
  resetData: function() {
    AppDispatcher.dispatch({
      type: Action.RESET_DATA,
    });
  },
  setCommoditySelectStatus: function(commodityId, commodityName, selected) {
    AppDispatcher.dispatch({
      type: Action.SET_COMMODITY_STATUS,
      commodityId: commodityId,
      commodityName: commodityName,
      selected: selected
    });
  },
  //ranking
  setRankingCommodity: function(commodityId, commodityName) {
    AppDispatcher.dispatch({
      type: Action.SET_RANKING_COMMODITY,
      commodityId: commodityId,
      commodityName: commodityName,
    });
  },
  setDefaultCommodityStatus: function(list) {
    AppDispatcher.dispatch({
      type: Action.SET_DEFAULT_COMMODITY_STATUS,
      list: list
    });
  },
  clearCommodity: function() {
    AppDispatcher.dispatch({
      type: Action.CLEAR_COMMODITY,
    });
  },
  clearRankingCommodity: function() {
    AppDispatcher.dispatch({
      type: Action.CLEAR_RANKING_COMMODITY,
    });
  }
};

module.exports = CommodityAction;
