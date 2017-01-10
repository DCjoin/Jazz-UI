
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,DataStatus } from 'constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {List} from 'immutable';
import _ from 'lodash';
import CommonFuns from 'util/Util.jsx';

let _templateList=null,
    _tagList=null,
    _selectedTagList=null;
var CHANGE_TAG_LIST_EVENT = 'changetaglist';
var CHANGE_SELECTED_TAG_LIST_EVENT = 'changeselectedtaglist';
const ReportStore = assign({}, PrototypeStore, {
  getTemplateList() {
    return _templateList;
  },
  setTemplateList(templateList) {
      _templateList = Immutable.fromJS(templateList);
  },
  getTemplateItems: function(templateList) {
    var Items=[];
  if (templateList && templateList.size !== 0) {
    Items=templateList.map(function(item) {
      return {
        payload: item.get('Id'),
        text: item.get('Name')
      };
    }).toJS();
  }
  Items.unshift({
    payload: -1,
    text:I18N.EM.Report.Select
  });
  return Items
  },
  deleteTemplateById: function(id) {
    var index = _templateList.findIndex((item) => {
      if (item.get('Id') === id) {
        return true;
      }
    });
    _templateList = _templateList.delete(index);
  },
  setTagData(tagData) {
    _tagList = Immutable.fromJS(tagData.Data);
  },
  setSelctedTagData(tagData) {
    _selectedTagList = Immutable.fromJS(tagData.Data);
  },
  getHierarchyNameByTagId(id){
    var tag=_tagList.find(item=>item.get('Id')===id);
    var HierName=_.last(tag.get('HierarchyName').split('\\')),
        AreaName=_.last(tag.get('AreaDimensionName').split('\\'));
    return `${HierName}-${AreaName}`
  },
  getTagList() {
    return _tagList;
  },
  getSelectedTagList() {
    return _selectedTagList;
  },
  dispose(){
    _templateList=null;
  },
  emitTagListChange: function() {
    this.emit(CHANGE_TAG_LIST_EVENT);
  },
  addTagListChangeListener: function(callback) {
    this.on(CHANGE_TAG_LIST_EVENT, callback);
  },
  removeTagListChangeListener: function(callback) {
    this.removeListener(CHANGE_TAG_LIST_EVENT, callback);
  },
  emitSelectedTagListChange: function() {
    this.emit(CHANGE_SELECTED_TAG_LIST_EVENT);
  },
  addSelectedTagListChangeListener: function(callback) {
    this.on(CHANGE_SELECTED_TAG_LIST_EVENT, callback);
  },
  removeSelectedTagListChangeListener: function(callback) {
    this.removeListener(CHANGE_SELECTED_TAG_LIST_EVENT, callback);
  },

});

ReportStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_REPORT_TEMPLATE_LIST_SUCCESS:
      ReportStore.setTemplateList(action.templateList);
      ReportStore.emitChange();
      break;
    case Action.GET_REPORT_TEMPLATE_LIST_ERROR:
      ReportStore.setTemplateList([]);
      ReportStore.emitChange();
      break;
    case Action.DELETE_TEMPLATE_SUCCESS:
      ReportStore.deleteTemplateById(action.id);
      ReportStore.emitChange();
      break;
    case Action.GET_REPORT_TAG_DATA_SUCCESS:
      ReportStore.setTagData(action.tagData);
      ReportStore.emitTagListChange();
      break;
    case Action.GET_SELECTED_REPORT_TAG_DATA_SUCCESS:
      ReportStore.setSelctedTagData(action.tagData);
      ReportStore.emitSelectedTagListChange();
      break;
    default:
  }
});

export default ReportStore;
