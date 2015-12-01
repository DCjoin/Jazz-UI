'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Action } from '../constants/actionType/Report.jsx';

let _reportList = null,
  _templateList = null,
  _tagList = [],
  _selectedTagList = [],
  _totalPage = 0,
  _reportItem = null;

let CHANGE_REPORT_LIST_EVENT = 'changereportlist';
let CHANGE_TEMPLATE_LIST_EVENT = 'changetemplatelist';
var CHANGE_SELECTED_REPORT_ITEM = 'changereportitem';
var CHANGE_TAG_LIST_EVENT = 'changetaglist';
var CHANGE_SELECTED_TAG_LIST_EVENT = 'changeselectedtaglist';
var ReportStore = assign({}, PrototypeStore, {
  getReportList() {
    return _reportList;
  },
  setReportList(reportList) {
    if (!reportList || reportList.length === 0) {
      _reportList = null;
    } else {
      _reportList = Immutable.fromJS(reportList);
    }
  },
  getTemplateList() {
    return _templateList;
  },
  setTemplateList(templateList) {
    if (!templateList || templateList.length === 0) {
      _templateList = null;
    } else {
      _templateList = Immutable.fromJS(templateList);
    }
  },
  getTagList() {
    return _tagList;
  },
  getTagTotalPage() {
    return _totalPage;
  },
  getSelectedTagList() {
    return _selectedTagList;
  },
  setTagData(tagData) {
    _totalPage = tagData.total;
    _tagList = Immutable.fromJS(tagData.GetTagsByFilterResult);
  },
  setSelctedTagData(tagData) {
    _selectedTagList = Immutable.fromJS(tagData.GetTagsByFilterResult);
  },
  setSelectedReportItem: function(reportItem) {
    _reportItem = Immutable.fromJS(reportItem);
  },
  defalutSelectFirstReport: function() {
    var reportItem = null;
    if (_reportList !== null && _reportList.size !== 0) {
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
    var reportItem = {
      id: curReport.Id,
      templateId: curReport.TemplateId,
      name: curReport.Name,
      createUser: curReport.CreateUser,
      data: curReport.CriteriaList,
      version: curReport.Version
    };
    ReportStore.setSelectedReportItem(reportItem);
    var index = _reportList.findIndex((item) => {
      if (item.get('Id') === curReport.Id) {
        return true;
      }
    });
    _reportList = _reportList.set(index, Immutable.fromJS(curReport));
  },
  deleteReportbyId: function(id) {
    var index = _reportList.findIndex((item) => {
      if (item.get('Id') === id) {
        return true;
      }
    });
    _reportList = _reportList.delete(index);
  },
  getSelectedReportItem: function() {
    return _reportItem;
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
  }
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
    case Action.GET_REPORT_LIST_ERROR:
      ReportStore.setTemplateList([]);
      ReportStore.emitTemplateListChange();
      break;
    case Action.SAVE_REPORT_SUCCESS:
      ReportStore.updateReportItem(action.curReport);
      ReportStore.emitReportItemChange();
      ReportStore.emitReportListChange();
      break;
    case Action.DELETE_REPORT_SUCCESS:
      ReportStore.deleteReportbyId(action.id);
      ReportStore.defalutSelectFirstReport();
      ReportStore.emitReportItemChange();
      ReportStore.emitReportListChange();
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
  }
});

module.exports = ReportStore;
