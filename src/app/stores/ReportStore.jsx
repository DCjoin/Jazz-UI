'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../util/Util.jsx';
import { Action } from 'constants/actionType/Report.jsx';

let _reportList = Immutable.fromJS([]),
  _templateList = Immutable.fromJS([]),
  _errorCode = null,
  _errorMessage = null,
  _errorReport = null,
  _tagList = Immutable.fromJS([]),
  _selectedTagList = Immutable.fromJS([]),
  _total = 0,
  _previewUrl = null,
  _allBuildingsExistence = null,
  _reportItem = null;

let CHANGE_REPORT_LIST_EVENT = 'changereportlist';
let CHANGE_TEMPLATE_LIST_EVENT = 'changetemplatelist';
var CHANGE_SELECTED_REPORT_ITEM = 'changereportitem';
var CHANGE_TAG_LIST_EVENT = 'changetaglist';
var CHANGE_SELECTED_TAG_LIST_EVENT = 'changeselectedtaglist';
var REPORT_DATA_SAVE_ERROR_EVENT = 'reportdatasaveerror';
var REPORT_PREVIEW_URL_EVENT = 'PreviewUrl';
var ReportStore = assign({}, PrototypeStore, {
  getReportList() {
    return _reportList;
  },
  setReportList(reportList) {
    if (reportList) {
      _reportList = Immutable.fromJS(reportList);
    }
  },
  getTemplateList() {
    return _templateList;
  },
  setTemplateList(templateList) {
    if (templateList) {
      _templateList = Immutable.fromJS(templateList);
    }
  },
  getSelctedPreviewUrl() {
    return _previewUrl;
  },
  setSelctedPreviewUrl(url) {
    _previewUrl = url;
  },
  getTagList() {
    return _tagList;
  },
  getTagTotalNum() {
    return _total;
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
  setTagData(tagData) {
    _total = tagData.total;
    _tagList = Immutable.fromJS(tagData.Data);
  },
  setSelctedTagData(tagData) {
    _selectedTagList = Immutable.fromJS(tagData.Data);
  },
  setSelectedReportItem: function(reportItem) {
    _reportItem = Immutable.fromJS(reportItem);
  },
  defalutSelectFirstReport: function() {
    var reportItem = null;
    if (_reportList.size !== 0) {
      reportItem = {
        id: _reportList.getIn([0, 'Id']),
        createUser: _reportList.getIn([0, 'CreateUser']),
        version: _reportList.getIn([0, 'Version']),
        templateId: _reportList.getIn([0, 'TemplateId']),
        name: _reportList.getIn([0, 'Name']),
        data: _reportList.getIn([0, 'CriteriaList'])
      };
    }
    _reportItem = Immutable.fromJS(reportItem);
  },
  updateReportItem: function(curReport) {
    var index;
    var reportItem = {
      id: curReport.Id,
      templateId: curReport.TemplateId,
      name: curReport.Name,
      createUser: curReport.CreateUser,
      data: curReport.CriteriaList,
      version: curReport.Version
    };
    ReportStore.setSelectedReportItem(reportItem);
    if (_reportList.size !== 0) {
      index = _reportList.findIndex((item) => {
        if (item.get('Id') === curReport.Id) {
          return true;
        }
      });
    }
    if (index === -1 || _reportList.size === 0) {
      _reportList = _reportList.unshift(Immutable.fromJS(curReport));
    } else {
      _reportList = _reportList.set(index, Immutable.fromJS(curReport));
    }
  },
  deleteReportById: function(id) {
    var index = _reportList.findIndex((item) => {
      if (item.get('Id') === id) {
        return true;
      }
    });
    _reportList = _reportList.delete(index);
  },
  deleteTemplateById: function(id) {
    var index = _templateList.findIndex((item) => {
      if (item.get('Id') === id) {
        return true;
      }
    });
    _templateList = _templateList.delete(index);
  },
  getSelectedReportItem: function() {
    return _reportItem;
  },
  setFirst: function(reportId) {

    this.setReportList(
     this.getReportList()
        .filter( report => report.get('Id') !== reportId )
        // .sortBy( (first, second) => /((-)?(\d)+)/.exec(second.get('CreateTime'))[0] - /((-)?(\d)+)/.exec(first.get('CreateTime'))[0]
        .unshift( this.getReportList().find(  report => report.get('Id') === reportId ) )
    );

  },
  setAllBuildingsExistence: function(data) {
    _allBuildingsExistence = data;
  },
  getAllBuildingsExistence: function(data) {
    return _allBuildingsExistence;
  },
  emitReportListChange: function() {
    this.emit(CHANGE_REPORT_LIST_EVENT);
  },
  addReportListChangeListener: function(callback) {
    this.on(CHANGE_REPORT_LIST_EVENT, callback);
  },
  removeReportListChangeListener: function(callback) {
    this.removeListener(CHANGE_REPORT_LIST_EVENT, callback);
  },
  emitTemplateListChange: function() {
    this.emit(CHANGE_TEMPLATE_LIST_EVENT);
  },
  addTemplateListChangeListener: function(callback) {
    this.on(CHANGE_TEMPLATE_LIST_EVENT, callback);
  },
  removeTemplateListChangeListener: function(callback) {
    this.removeListener(CHANGE_TEMPLATE_LIST_EVENT, callback);
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
  emitReportItemChange: function() {
    this.emit(CHANGE_SELECTED_REPORT_ITEM);
  },
  addReportItemChangeListener: function(callback) {
    this.on(CHANGE_SELECTED_REPORT_ITEM, callback);
  },
  removeReportItemChangeListener: function(callback) {
    this.removeListener(CHANGE_SELECTED_REPORT_ITEM, callback);
  },
  emitSaveReportErrorListener: function(callback) {
    this.emit(REPORT_DATA_SAVE_ERROR_EVENT);
  },
  removeSaveReportErrorListener: function(callback) {
    this.removeListener(REPORT_DATA_SAVE_ERROR_EVENT, callback);
  },
  addSaveReportErrorListener: function(callback) {
    this.on(REPORT_DATA_SAVE_ERROR_EVENT, callback);
  },
  emitSelctedPreviewUrlChange: function(callback) {
    this.emit(REPORT_PREVIEW_URL_EVENT);
  },
  removeSelctedPreviewUrlChange: function(callback) {
    this.removeListener(REPORT_PREVIEW_URL_EVENT, callback);
  },
  addSelctedPreviewUrlChange: function(callback) {
    this.on(REPORT_PREVIEW_URL_EVENT, callback);
  },
});

ReportStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_REPORT_LIST_SUCCESS:
      ReportStore.setReportList(action.reportList);
      ReportStore.defalutSelectFirstReport();
      ReportStore.emitReportItemChange();
      ReportStore.emitReportListChange();
      break;
    case Action.GET_REPORT_LIST_ERROR:
      ReportStore.setReportList([]);
      ReportStore.emitReportListChange();
      break;
    case Action.SET_SELECTED_REPORT_ITEM:
      ReportStore.setSelectedReportItem(action.reportItem);
      ReportStore.emitReportItemChange();
      break;
    case Action.GET_REPORT_TEMPLATE_LIST_SUCCESS:
      ReportStore.setTemplateList(action.templateList);
      ReportStore.emitTemplateListChange();
      break;
    case Action.GET_REPORT_TEMPLATE_LIST_ERROR:
      ReportStore.setTemplateList([]);
      ReportStore.emitTemplateListChange();
      break;
    case Action.SAVE_REPORT_SUCCESS:
      ReportStore.updateReportItem(action.curReport);
      ReportStore.emitReportItemChange();
      ReportStore.emitReportListChange();
      break;
    case Action.SAVE_REPORT_ERROR:
      ReportStore._initErrorText(action.errorText, action.errorReport);
      ReportStore.emitSaveReportErrorListener();
      break;
    case Action.DELETE_REPORT_SUCCESS:
      ReportStore.deleteReportById(action.id);
      ReportStore.defalutSelectFirstReport();
      ReportStore.emitReportItemChange();
      ReportStore.emitReportListChange();
      break;
    case Action.DELETE_TEMPLATE_SUCCESS:
      ReportStore.deleteTemplateById(action.id);
      ReportStore.emitTemplateListChange();
      break;
    case Action.SET_DEFAULT_REPORT_ITEM:
      ReportStore.defalutSelectFirstReport();
      ReportStore.emitReportItemChange();
      break;
    case Action.GET_REPORT_TAG_DATA_SUCCESS:
      ReportStore.setTagData(action.tagData);
      ReportStore.emitTagListChange();
      break;
    case Action.GET_SELECTED_REPORT_TAG_DATA_SUCCESS:
      ReportStore.setSelctedTagData(action.tagData);
      ReportStore.emitSelectedTagListChange();
      break;
    case Action.GET_SELECTED_REPORT_PREVIEW_URL_SUCCESS:
      ReportStore.setSelctedPreviewUrl(action.data);
      ReportStore.emitSelctedPreviewUrlChange();
      break;
    case Action.GET_SELECTED_REPORT_PREVIEW_URL_ERROR:
      ReportStore.setSelctedPreviewUrl(false);
      ReportStore.emitSelctedPreviewUrlChange();
      break;
    case Action.SET_FIRST:
      ReportStore.setFirst(action.data);
      break;
    case Action.ALL_BUILDINGS_EXISTENCE:
      ReportStore.setAllBuildingsExistence(action.data);
      ReportStore.emitChange();
      break;
  }
});

module.exports = ReportStore;
