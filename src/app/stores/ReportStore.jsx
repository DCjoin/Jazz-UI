'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import { Action } from '../constants/actionType/Report.jsx';

let _reportList = null,
  _reportItem = null;

let CHANGE_REPORT_LIST_EVENT = 'changealarmlist';
var ReportStore = assign({}, PrototypeStore, {
  getReportList() {
    return _reportList;
  },
  setReportList(reportList) {
    if (!reportList || reportList.length === 0) {
      _reportList = null;
    } else {
      _reportList = reportList;
    }
  },
  setSelectedReportItem: function(reportItem) {
    _reportItem = reportItem;
  },
  getSelectedReportItem: function() {
    return _reportItem;
  },
  emitReportlistChange: function() {
    this.emit(CHANGE_REPORT_LIST_EVENT);
  },
  addReportlistChangeListener: function(callback) {
    this.on(CHANGE_REPORT_LIST_EVENT, callback);
  },
  removeReportlistChangeListener: function(callback) {
    this.removeListener(CHANGE_REPORT_LIST_EVENT, callback);
  }
});

ReportStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_REPORT_LIST_SUCCESS:
      ReportStore.setReportList(action.reportList);
      ReportStore.emitReportlistChange();
      break;
    case Action.GET_REPORT_LIST_ERROR:
      ReportStore.setReportList([]);
      ReportStore.emitReportlistChange();
      break;
    case Action.SET_SELECTED_REPORT_ITEM:
      ReportStore.setSelectedReportItem(action.reportItem);
      break;
  }
});

module.exports = ReportStore;
