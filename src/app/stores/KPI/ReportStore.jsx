
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
    _errorCode = null,
    _errorMessage = null,
    _errorReport = null,
    _selectedTagList=null;
var CHANGE_TAG_LIST_EVENT = 'changetaglist';
var CHANGE_SELECTED_TAG_LIST_EVENT = 'changeselectedtaglist';
var CHANGE_SAVE_SUCCESS_EVENT = 'changesavesuccess';
var CHANGE_SAVE_ERROR_EVENT = 'changesaveerror';

const ReportStore = assign({}, PrototypeStore, {
  getDefalutReport(report){
    var reportItem = {
      id: report.Id,
      createUser: report.CreateUser,
      version: report.Version,
      templateId: report.TemplateId,
      name: report.Name,
      data: report.CriteriaList,
      year:report.Year,
    };
    return Immutable.fromJS(reportItem)
  },
  getTemplateList() {
    return _templateList;
  },
  setTemplateList(templateList) {
      _templateList = Immutable.fromJS(templateList);
  },
  getSheetNamesByTemplateId(templateId) {
    var templateList = _templateList;
    var sheetNames = null;
    var template = null;
    if (templateList !== null && templateList.size !== 0 && templateId !== null) {
      template = templateList.find((item) => {
      if (templateId === item.get('Id')) {
        return true;
      }
    });
    if (template) {
      sheetNames = template.get('SheetNames');
    }
  }
  return sheetNames;
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
  getHierarchyNameByTagId(id,tag){
    var HierName=_.last(tag.get('HierarchyName').split('\\'));
    if(tag.get('AreaDimensionName')){
        var  AreaName=_.last(tag.get('AreaDimensionName').split('\\'));
        return `${HierName}-${AreaName}`
    }else {
      return HierName
    }
  },
  getTagList() {
    return _tagList;
  },
  getSelectedTagList() {
    return _selectedTagList;
  },
  _initErrorText(errorText, errorReport) {
    let error = JSON.parse(errorText).error;
    let errorCode = CommonFuns.processErrorCode(error.Code).errorCode;
    _errorCode = errorCode;
    _errorMessage = error.Messages;
    _errorReport = errorReport;
  },
  getErrorMessage() {
    return _errorMessage;
  },
  getErrorCode() {
    return _errorCode;
  },
  getErrorReport() {
    return _errorReport;
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
  emitSaveSuccessChange: function() {
    this.emit(CHANGE_SAVE_SUCCESS_EVENT);
  },
  addSaveSuccessChangeListener: function(callback) {
    this.on(CHANGE_SAVE_SUCCESS_EVENT, callback);
  },
  removeSaveSuccessChangeListener: function(callback) {
    this.removeListener(CHANGE_SAVE_SUCCESS_EVENT, callback);
  },
  emitSaveErrorChange: function() {
    this.emit(CHANGE_SAVE_ERROR_EVENT);
  },
  addSaveErrorChangeListener: function(callback) {
    this.on(CHANGE_SAVE_ERROR_EVENT, callback);
  },
  removeSaveErrorChangeListener: function(callback) {
    this.removeListener(CHANGE_SAVE_ERROR_EVENT, callback);
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
    case Action.SAVE_REPORT_SUCCESS:
      //ReportStore.updateReportItem(action.curReport);
      ReportStore.emitSaveErrorChange();
      break;
    case Action.SAVE_REPORT_ERROR:
      ReportStore._initErrorText(action.errorText, action.errorReport);
      ReportStore.emitSaveErrorChange();
      break;
    default:
  }
});

export default ReportStore;
