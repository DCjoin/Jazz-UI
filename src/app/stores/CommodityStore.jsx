'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Commodity from '../constants/actionType/Commodity.jsx';
import AlarmTag from '../constants/actionType/AlarmTag.jsx';
import Immutable from 'immutable';

const ENERGY_CONSUMPTION_TYPE_CHANGED_EVENT = 'energyconsumptiontypechanged',
      COMMODITY_LIST_CHANGED_EVENT = 'commoditylistchanged',
      COMMODITY_STATUS_CHANGED_EVENT = 'commoditystatuschanged',
      RANKING_EC_TYPE_CHANGED_EVENT= 'rankingectypechanged',
      GET_RANKING_COMMODITY_LIST_CHANGED_EVENT = 'getrankingcommoditylistchanged',
      SET_RANKING_COMMODITY_CHANGED_EVENT='setrankingcommoditychanged';

let _energyConsumptionType=null,// Carbon or Cost
    _rankingECType=null,//Energy Carbon or Cost
    _hierNode=null,
    _currentHierId=null,
    _currentHierName=null,
    _currentDimId=null,
    _commodityList=[],
    _commodityStatus=Immutable.List([]),
    _RankingTreeList=[],
    _RankingCommodity=null;

var CommodityStore = assign({},PrototypeStore,{

  setEnergyConsumptionType:function(type){
    _energyConsumptionType=type;
  },
  getEnergyConsumptionType:function(){
    return _energyConsumptionType;
  },

  setRankingECType:function(type){
    _rankingECType=type;
  },
  getRankingECType:function(){
    return _rankingECType;
  },
  setCurrentHierarchyInfo:function(id,name){
    this.resetData();
    _currentHierId=id;
    _currentHierName=name;
    _currentDimId=null;
    _hierNode={
      hierId:id,
      hierName:name
    }
  },
  getCurrentHierarchyId:function(){
    return _currentHierId;
  },
  getCurrentHierarchyName:function(){
    return _currentHierName;
  },
  getHierNode:function(){
    return _hierNode
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
      _hierNode=null;
      _commodityStatus=Immutable.List([]);
  },
  setDefaultCommodityStatus:function(list){
    _commodityStatus-list
  },
  setCommodityStatus:function(id,name,selected){
    var hasCommodity=false;
      if(selected){
      _commodityStatus= _commodityStatus.push(Immutable.fromJS(
        {
            Id:id,
            Comment:name
          })
      );
      }
      else {
        _commodityStatus=_commodityStatus.delete(_commodityStatus.findIndex(item=>item.get('Id')==id))
      }

  },
  getCommonCommodityList:function(){
    return _commodityStatus.toJSON();
  },
  getCommodityStatus:function(){
    return _commodityStatus;
  },
  removeCommodityStatus:function(node){

  },
  clearCommodityStatus:function(){
    _commodityStatus=[];
  },
  //for Ranking
  setRankingTreeList:function(treeList){
    _RankingTreeList=[];
    treeList.forEach(function(treeNode){
      _RankingTreeList.push({
        hierId:treeNode.get('Id'),
        hierName:treeNode.get('Name')
      });
    });
  },
  getRankingTreeList:function(){
    return _RankingTreeList;
  },
  setRankingCommodity:function(commodityId,commodityName){
    _RankingCommodity={
      Id:commodityId,
      Comment:commodityName
    };
  },
  getRankingCommodity:function(){
    return _RankingCommodity;
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
  addRankingECTypeListener: function(callback) {
    this.on(RANKING_EC_TYPE_CHANGED_EVENT, callback);
  },
  emitRankingECType: function() {
    this.emit(RANKING_EC_TYPE_CHANGED_EVENT);
  },
  removeRankingECTypeListener: function(callback) {
    this.removeListener(RANKING_EC_TYPE_CHANGED_EVENT, callback);
  },
  addRankingCommodityListListener: function(callback) {
    this.on(GET_RANKING_COMMODITY_LIST_CHANGED_EVENT, callback);
  },
  emitRankingCommodityList: function() {
    this.emit(GET_RANKING_COMMODITY_LIST_CHANGED_EVENT);
  },
  removeRankingCommodityListListener: function(callback) {
    this.removeListener(GET_RANKING_COMMODITY_LIST_CHANGED_EVENT, callback);
  },
  addRankingCommodityListener: function(callback) {
    this.on(SET_RANKING_COMMODITY_CHANGED_EVENT, callback);
  },
  emitRankingCommodity: function() {
    this.emit(SET_RANKING_COMMODITY_CHANGED_EVENT);
  },
  removeRankingCommodityListener: function(callback) {
    this.removeListener(SET_RANKING_COMMODITY_CHANGED_EVENT, callback);
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
      case CommodityAction.SET_RANKING_EC_TYPE:
        CommodityStore.setRankingECType(action.typeData);
        CommodityStore.emitRankingECType();
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
      case CommodityAction.GET_RANKING_COMMODITY_DATA_SUCCESS:
        CommodityStore.setCommodityList(action.CommodityList);
        //for ranking
        CommodityStore.setRankingTreeList(action.treeList);
        CommodityStore.emitRankingCommodityList();
        break;
      case CommodityAction.SET_COMMODITY_STATUS:
        CommodityStore.setCommodityStatus(action.commodityId,action.commodityName,action.selected);
        CommodityStore.emitCommoddityStauts();
        break;
      case CommodityAction.SET_DEFAULT_COMMODITY_STATUS:
        CommodityStore.setDefaultCommodityStatus(action.list);
        break;
      case AlarmTagAction.REMOVE_SEARCH_TAGLIST_CHANGED:
          CommodityStore.removeCommodityStatus(action.tagNode);
          CommodityStore.emitCommoddityStauts();
      break;
      case AlarmTagAction.CLEAR_SEARCH_TAGLIST:
          CommodityStore.clearCommodityStatus();
          CommodityStore.emitCommoddityStauts();
      break;
      case CommodityAction.SET_RANKING_COMMODITY:
          CommodityStore.setRankingCommodity(action.commodityId,action.commodityName);
          CommodityStore.emitRankingCommodity();
      break;


    }
});
module.exports = CommodityStore;
