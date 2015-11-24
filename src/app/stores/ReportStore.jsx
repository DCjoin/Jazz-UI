'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Action } from '../constants/actionType/Report.jsx';

let _reportList = null,
  _templateList = null,
  _reportItem = null;

let CHANGE_REPORT_LIST_EVENT = 'changereportlist';
let CHANGE_TEMPLATE_LIST_EVENT = 'changetemplatelist';
var CHANGE_SELECTED_REPORT_ITEM = 'changereportitem';
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
  setSelectedReportItem: function(reportItem) {
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
      if (action.reportList !== null && action.reportList.length !== 0) {
        var reportItem = {
          id: action.reportList[0].Id,
          createUser: action.reportList[0].CreateUser,
          version: action.reportList[0].Version,
          templateId: action.reportList[0].TemplateId,
          name: action.reportList[0].Name,
          user: action.reportList[0].CreateUser,
          data: action.reportList[0].CriteriaList
        };
        ReportStore.setSelectedReportItem(reportItem);
        ReportStore.emitReportItemChange();
      }
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
    case Action.GET_TEMPLATE_LIST_SUCCESS:
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
  }
});

module.exports = ReportStore;
