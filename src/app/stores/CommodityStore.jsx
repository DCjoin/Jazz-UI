'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Commodity from '../constants/actionType/Commodity.jsx';
import AlarmTag from '../constants/actionType/AlarmTag.jsx';
import Immutable from 'immutable';

const ENERGY_CONSUMPTION_TYPE_CHANGED_EVENT = 'energyconsumptiontypechanged',
      COMMODITY_LIST_CHANGED_EVENT = 'commoditylistchanged',
      COMMODITY_STATUS_CHANGED_EVENT = 'commoditystatuschanged';

let _energyConsumptionType=null,// Carbon or Cost
    _currentHierId=null,
    _currentHierName=null,
    _currentDimId=null,
    _commodityList=[],
    _commodityStatus=[];

var CommodityStore = assign({},PrototypeStore,{

  setEnergyConsumptionType:function(type){
    _energyConsumptionType=type;
  },
  getEnergyConsumptionType:function(){
    return _energyConsumptionType;
  },
  setCurrentHierarchyInfo:function(id,name){
    _currentHierId=id;
    _currentHierName=name;
    _currentDimId=null;
  },
  getCurrentHierarchyId:function(){
    return _currentHierId;
  },
  getCurrentHierarchyName:function(){
    return _currentHierName;
  },
  setCurrentDimId:function(id){
    _currentDimId=id;
  },
  getCurrentDimId:function(){
    return _currentDimId;
  },
  setCommodityList:function(list){
    var listArray=list;
    _commodityList=[];
    listArray.forEach(function(element){
      let node={
        Id:element.Id,
        Comment:element.Comment
      };
      _commodityList.push(node);
    });
  },
  getCommodityList:function(){
    return _commodityList;
  },
  resetData:function(){
      _energyConsumptionType=null;
      _currentHierId=null;
      _currentHierName=null;
      _currentDimId=null;
      _commodityList=[];
  },
  setCommodityStatus:function(id,name,selected){
    var hasCommodity=false;
    if(_commodityStatus){
      _commodityStatus.forEach(function(element){
        if(element.hierId==_currentHierId){
          hasCommodity=true;
          if(selected){
            element.statusList=element.statusList.push(id)
          }
          else {
            let index=element.statusList.indexOf(id);
            element.statusLists=element.statusList.delete(index);
          }
        }
      });
      if(!hasCommodity){
        _commodityStatus.push({
          hierId:_currentHierId,
          statusList:Immutable.List.of(id),
        });
      }

    }
    else {
      _commodityStatus.push({
        hierId:_currentHierId,
        statusList:Immutable.List.of(id),
      });
    }
  },
  removeCommodityStatus:function(node){
    if(node.commodityId){
      _commodityStatus.forEach(function(element){
        if(element.hierId==_currentHierId){
            let index=element.statusList.indexOf(node.commodityId);
            element.statusLists=element.statusList.delete(index);
          }
        });
      }
  },
  clearCommodityStatus:function(){
    _commodityStatus=[];
  },
  getCurrentHierIdCommodityStatus:function(){
   var statusList=Immutable.List([]);
    _commodityStatus.forEach(function(element){
  if(element.hierId==_currentHierId){
    statusList=element.statusList;
    }
  });
  return statusList;
  },
  addEnergyConsumptionTypeListener: function(callback) {
    this.on(ENERGY_CONSUMPTION_TYPE_CHANGED_EVENT, callback);
  },
  emitEnergyConsumptionType: function() {
    this.emit(ENERGY_CONSUMPTION_TYPE_CHANGED_EVENT);
  },
  removeEnergyConsumptionTypeListener: function(callback) {
    this.removeListener(ENERGY_CONSUMPTION_TYPE_CHANGED_EVENT, callback);
  },
  addCommoddityListListener: function(callback) {
    this.on(COMMODITY_LIST_CHANGED_EVENT, callback);
  },
  emitCommoddityList: function() {
    this.emit(COMMODITY_LIST_CHANGED_EVENT);
  },
  removeCommoddityListListener: function(callback) {
    this.removeListener(COMMODITY_LIST_CHANGED_EVENT, callback);
  },
  addCommoddityStautsListener: function(callback) {
    this.on(COMMODITY_STATUS_CHANGED_EVENT, callback);
  },
  emitCommoddityStauts: function() {
    this.emit(COMMODITY_STATUS_CHANGED_EVENT);
  },
  removeCommoddityStautsListener: function(callback) {
    this.removeListener(COMMODITY_STATUS_CHANGED_EVENT, callback);
  },
});

let CommodityAction=Commodity.Action,
    AlarmTagAction = AlarmTag.Action;
CommodityStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case CommodityAction.SET_ENERGY_CONSUMPTION_TYPE:
        CommodityStore.setEnergyConsumptionType(action.typeData);
        CommodityStore.emitEnergyConsumptionType();
        break;
      case CommodityAction.SET_CURRENT_HIERARCHY_ID:
        CommodityStore.setCurrentHierarchyInfo(action.hierId,action.hierName);
        break;
      case CommodityAction.SET_CURRENT_DIM_ID:
        CommodityStore.setCurrentDimId(action.dimId);
        break;
      case CommodityAction.RESET_DATA:
        CommodityStore.resetData();
        break;
      case CommodityAction.GET_COMMODITY_DATA_SUCCESS:
        CommodityStore.setCommodityList(action.CommodityList);
        CommodityStore.emitCommoddityList();
        break;
      case CommodityAction.SET_COMMODITY_STATUS:
        CommodityStore.setCommodityStatus(action.commodityId,action.commodityName,action.selected);
        CommodityStore.emitCommoddityStauts();
        break;
      case AlarmTagAction.REMOVE_SEARCH_TAGLIST_CHANGED:
          CommodityStore.removeCommodityStatus(action.tagNode);
          CommodityStore.emitCommoddityStauts();
      break;
      case AlarmTagAction.CLEAR_SEARCH_TAGLIST:
          CommodityStore.clearCommodityStatus();
          CommodityStore.emitCommoddityStauts();
      break;

    }
});
module.exports = CommodityStore;
