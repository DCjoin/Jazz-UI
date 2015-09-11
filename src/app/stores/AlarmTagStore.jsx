'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import AlarmTag from '../constants/actionType/AlarmTag.jsx';
import Tag from '../constants/actionType/Tag.jsx';
import Commodity from '../constants/actionType/Commodity.jsx';
import Folder from '../constants/actionType/Folder.jsx';
import CommodityStore from '../stores/CommodityStore.jsx';

let searchTagList=[];
let interData=null;
let AlarmTagAction=AlarmTag.Action;
let TagAction=Tag.Action;
let CommodityAction=Commodity.Action;
let FolderAction=Folder.Action;
/*
 if change checked state of the tags from the tag list,than it is true;
 when select item of alarm list, set it false in AlarmList.jsx
*/
let _useTaglistSelect = false;

const INTER_DATA_CHANGED_EVENT = 'interdatachanged',
      CLEAR_DATA_CHANGED_EVENT = 'cleardatachanged';

var AlarmTagStore = assign({},PrototypeStore,{

  getSearchTagList(){
    return searchTagList;
  },
  setUseTagListSelect(useTaglistSelect){
    _useTaglistSelect = useTaglistSelect;
  },
  getUseTaglistSelect(){
    return _useTaglistSelect;
  },
  addSearchTagList(tagNode){
    var flag=false;
    AlarmTagStore.setUseTagListSelect(true);

    searchTagList.forEach(function(nodeData,i){

      if(tagNode.tagId==nodeData.tagId){
        flag=true;
      }
    });
      if(!flag){
        searchTagList.push(tagNode);
      }

    },
  removeSearchTagList(tagNode){

    AlarmTagStore.setUseTagListSelect(true);
    searchTagList.forEach(function(nodeData,i){
    if(tagNode.tagId==nodeData.tagId){
      searchTagList.splice(i,1);
    }
    });

  },
  searchTagChange(tagNode,selected){

    let tagData={
      hierId:tagNode.HierarchyId,
      hierName:tagNode.HierarchyName,
      tagId:tagNode.Id,
      tagName:tagNode.Name,
      uomId: tagNode.UomId,
      commodityId:tagNode.CommodityId,
      commodityName:tagNode.Comment,
    };

    if(selected){
      this.addSearchTagList(tagData);
    }
    else{
      this.removeSearchTagList(tagData);
    }
  },
  searchTagListChange(tagList,selected){

    var that=this;
    tagList.forEach(function(tagNode){
      let tagData={
        hierId:tagNode.HierarchyId,
        hierName:tagNode.HierarchyName,
        tagId:tagNode.Id,
        tagName:tagNode.Name,
        uomId: tagNode.UomId,
        commodityId:tagNode.CommodityId,
        commodityName:tagNode.Comment,
      };
      if(selected){
        that.addSearchTagList(tagData);
      }
      else{
        that.removeSearchTagList(tagData);
      }
    })

  },
  CommodityDataChange(commodityId,commodityName,selected){

      if(selected){
        let commodityData={
          hierId:CommodityStore.getCurrentHierarchyId(),
          hierName:CommodityStore.getCurrentHierarchyName(),
          commodityId:commodityId,
          commodityName:commodityName
        };
        searchTagList.push(commodityData);
      }
      else{
        searchTagList.forEach(function(nodeData,i){
          if(nodeData.commodityId){
            if(commodityId==nodeData.commodityId){
              searchTagList.splice(i,1);
            }
          }

        });
      }


  },
  clearSearchTagList(){
    AlarmTagStore.setUseTagListSelect(true);
    searchTagList.length=0;
  },
  getInterData(){
    return interData;
  },
  setInterData(iaData){
    interData=iaData;
  },
  doWidgetDtos:function(widgetDto){
    let that=this;
    let convertWidgetOptions2TagOption = function(WidgetOptions){
      let tagOptions = [];
      WidgetOptions.forEach(item=>{
        tagOptions.push({
            hierId: item.HierId,
            hierName: item.NodeName,
            tagId: item.TargetId,
            tagName: item.TargetName
        });
      });
      return tagOptions;
    };
    let tagOptions = convertWidgetOptions2TagOption(widgetDto.WidgetOptions);
    tagOptions.forEach(item=>{
      that.addSearchTagList(item);
    });
  },
  addInterDataListener: function(callback) {
    this.on(INTER_DATA_CHANGED_EVENT, callback);
  },
  emitInterData: function() {
    this.emit(INTER_DATA_CHANGED_EVENT);
  },
  removeInterDataListener: function(callback) {
    this.removeListener(INTER_DATA_CHANGED_EVENT, callback);
  },
  addAddSearchTagListListener: function(callback) {
    this.on(INTER_DATA_CHANGED_EVENT, callback);
  },
  emitAddSearchTagList: function() {
    this.emit(INTER_DATA_CHANGED_EVENT);
  },
  removeAddSearchTagListListener: function(callback) {
    this.removeListener(INTER_DATA_CHANGED_EVENT, callback);
  },
  addRemoveSearchTagListListener: function(callback) {
    this.on(INTER_DATA_CHANGED_EVENT, callback);
  },
  emitRemoveSearchTagList: function() {
    this.emit(INTER_DATA_CHANGED_EVENT);
  },
  removeRemoveSearchTagListListener: function(callback) {
    this.removeListener(INTER_DATA_CHANGED_EVENT, callback);
  },
  addClearDataListener: function(callback) {
    this.on(CLEAR_DATA_CHANGED_EVENT, callback);
  },
  emitClearData: function() {
    this.emit(CLEAR_DATA_CHANGED_EVENT);
  },
  removeClearDataListener: function(callback) {
    this.removeListener(CLEAR_DATA_CHANGED_EVENT, callback);
  },
});
AlarmTagStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {

      case AlarmTagAction.ADD_SEARCH_TAGLIST_CHANGED:
        AlarmTagStore.addSearchTagList(action.tagNode);
        AlarmTagStore.emitAddSearchTagList();
        break;

      case AlarmTagAction.REMOVE_SEARCH_TAGLIST_CHANGED:
        AlarmTagStore.removeSearchTagList(action.tagNode);
        AlarmTagStore.emitRemoveSearchTagList();
        break;
      case AlarmTagAction.INTER_DATA_CHANGED:
        AlarmTagStore.setInterData(action.tagNode);
        AlarmTagStore.emitInterData();
        break;
      case AlarmTagAction.CLEAR_SEARCH_TAGLIST:
        AlarmTagStore.clearSearchTagList();
        AlarmTagStore.emitClearData();
        break;
      case TagAction.SET_TAGSTATUS_TAG:
        AlarmTagStore.searchTagChange(action.node,action.selected);
        break;
      case TagAction.SET_TAGSTATUS_TAGLIST:
          AlarmTagStore.searchTagListChange(action.tagList,action.add);
        break;
      case TagAction.CLEAR_ALARM_SEARCH_TAGLIST:
          AlarmTagStore.clearSearchTagList();
        break;
      case CommodityAction.SET_COMMODITY_STATUS:
          AlarmTagStore.CommodityDataChange(action.commodityId,action.commodityName,action.selected);
        break;
      case FolderAction.GET_WIDGETDTOS_SUCCESS:
          AlarmTagStore.doWidgetDtos(action.widgetDto[0]);
        break;
    }
});

module.exports = AlarmTagStore;
