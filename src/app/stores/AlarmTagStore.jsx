'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import AlarmTag from '../constants/actionType/AlarmTag.jsx';
import Tag from '../constants/actionType/Tag.jsx';
import Commodity from '../constants/actionType/Commodity.jsx';
import Folder from '../constants/actionType/Folder.jsx';
import CommodityStore from '../stores/CommodityStore.jsx';
import Weather from 'constants/actionType/DataAnalysis.jsx';
import TagStore from './TagStore.jsx';
import Immutable from 'immutable';

let searchTagList = [];
let interData = null;
let AlarmTagAction = AlarmTag.Action;
let TagAction = Tag.Action;
let CommodityAction = Commodity.Action;
let FolderAction = Folder.Action;
let WeatherAction = Weather.Action;
/*
 if change checked state of the tags from the tag list,than it is true;
 when select item of alarm list, set it false in AlarmList.jsx
*/
let _useTaglistSelect = false;

const INTER_DATA_CHANGED_EVENT = 'interdatachanged',
  CLEAR_DATA_CHANGED_EVENT = 'cleardatachanged';

var AlarmTagStore = assign({}, PrototypeStore, {

  getSearchTagList() {
    return searchTagList;
  },
  setUseTagListSelect(useTaglistSelect) {
    _useTaglistSelect = useTaglistSelect;
  },
  getUseTaglistSelect() {
    return _useTaglistSelect;
  },
  addSearchTagList(tagNode,push=true) {
    var flag = false;
    AlarmTagStore.setUseTagListSelect(true);

    searchTagList.forEach(function(nodeData, i) {
      if(tagNode.tagId){
        if (tagNode.tagId == nodeData.tagId || tagNode.tagId == nodeData.TagId) {
        flag = true;
      }
      }else{
        if (tagNode.TagId == nodeData.tagId || tagNode.TagId == nodeData.TagId) {
        flag = true;
      }
      }

    });
    if (!flag) {
      if(push){searchTagList.push(tagNode);}
      else{searchTagList.unshift(tagNode);}
    }

  },
  removeSearchTagList(tagNode) {

    AlarmTagStore.setUseTagListSelect(true);
    searchTagList.forEach(function(nodeData, i) {
      if(tagNode.TagId){
        if(tagNode.TagId===nodeData.tagId || tagNode.TagId == nodeData.TagId){
          searchTagList.splice(i, 1);
        }
      }else{
        if(tagNode.tagId===nodeData.tagId || tagNode.tagId == nodeData.TagId){
          searchTagList.splice(i, 1);
        }
      }
    });

  },
  searchTagChange(tagNode, selected) {

    let tagData = {
      hierId: tagNode.HierarchyId,
      hierName: tagNode.HierarchyName,
      tagId: tagNode.Id,
      tagName: tagNode.Name,
      uomId: tagNode.UomId,
      commodityId: tagNode.CommodityId,
      commodityName: tagNode.Comment,
      DimensionName: TagStore.getCurrentDimInfo().dimName,
      DimensionId: TagStore.getCurrentDimInfo().dimId
    };

    if (selected) {
      this.addSearchTagList(tagData);
    } else {
      this.removeSearchTagList(tagData);
    }
  },
    searchTagChangeForWeather(tagNode, selected) {

    if (selected) {
      this.addSearchTagList(tagNode,false);
    } else {
      this.removeSearchTagList(tagNode);
    }
  },
  searchTagListChange(tagList, selected) {

    var that = this;
    tagList.forEach(function(tagNode) {
      let tagData = {
        hierId: tagNode.HierarchyId,
        hierName: tagNode.HierarchyName,
        tagId: tagNode.Id,
        tagName: tagNode.Name,
        uomId: tagNode.UomId,
        commodityId: tagNode.CommodityId,
        commodityName: tagNode.Comment,
        DimensionName: TagStore.getCurrentDimInfo().dimName,
        DimensionId: TagStore.getCurrentDimInfo().dimId
      };
      if (selected) {
        that.addSearchTagList(tagData);
      } else {
        that.removeSearchTagList(tagData);
      }
    })

  },
  // CommodityDataChange(commodityId,commodityName,selected){
  //
  //     if(selected){
  //       let commodityData={
  //         hierId:CommodityStore.getCurrentHierarchyId(),
  //         hierName:CommodityStore.getCurrentHierarchyName(),
  //         commodityId:commodityId,
  //         commodityName:commodityName
  //       };
  //       searchTagList.push(commodityData);
  //     }
  //     else{
  //       searchTagList.forEach(function(nodeData,i){
  //         if(nodeData.commodityId){
  //           if(commodityId==nodeData.commodityId){
  //             searchTagList.splice(i,1);
  //           }
  //         }
  //
  //       });
  //     }
  //
  //
  // },
  clearSearchTagList() {
    AlarmTagStore.setUseTagListSelect(true);
    searchTagList.length = 0;
  },
  getInterData() {
    return interData;
  },
  setInterData(iaData) {
    interData = iaData;
  },
  doWidgetDtos: function(widgetDto) {
    AlarmTagStore.setUseTagListSelect(true);
    searchTagList.length = 0;
    let that = this;
    if (widgetDto.WidgetType == 'Labelling' || widgetDto.WidgetType == 'Ratio' || widgetDto.BizType == 'Energy' || widgetDto.BizType == 'UnitEnergy') {
      let convertWidgetOptions2TagOption = function(WidgetOptions) {
        let tagOptions = [];
        WidgetOptions.forEach(item => {
          tagOptions.push({
            hierId: item.HierId,
            hierName: item.NodeName,
            tagId: item.TargetId,
            tagName: item.TargetName,
            DimensionId:item.DimensionId,
            DimensionName:item.DimensionName
          });
        });
        return tagOptions;
      };
      let tagOptions = convertWidgetOptions2TagOption(widgetDto.WidgetOptions);
      tagOptions.forEach(item => {
        that.addSearchTagList(item);
      });
    }
  },
  getTagNameById(id){
    return Immutable.fromJS(searchTagList).find(item=>(item.get("tagId")===id)).get("tagName")
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
  switch (action.type) {

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
      AlarmTagStore.searchTagChange(action.node, action.selected);
      AlarmTagStore.emitChange();
      break;
    case WeatherAction.CHECKED_TAG:
      AlarmTagStore.searchTagChangeForWeather(action.tag, action.ischecked);
      AlarmTagStore.emitChange();
      break;
    case TagAction.SET_TAGSTATUS_TAGLIST:
      AlarmTagStore.searchTagListChange(action.tagList, action.add);
      AlarmTagStore.emitChange();
      break;
    case TagAction.CLEAR_ALARM_SEARCH_TAGLIST:
      AlarmTagStore.clearSearchTagList();
      AlarmTagStore.emitChange();
      break;
    // case CommodityAction.SET_COMMODITY_STATUS:
    //     AlarmTagStore.CommodityDataChange(action.commodityId,action.commodityName,action.selected);
    //   break;
    case FolderAction.GET_WIDGETDTOS_SUCCESS:
      AlarmTagStore.doWidgetDtos(action.widgetDto[0]);
      break;
  }
});

module.exports = AlarmTagStore;
