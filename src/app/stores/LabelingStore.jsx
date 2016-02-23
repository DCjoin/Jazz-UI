'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Action } from '../constants/actionType/Labeling.jsx';


var _industryData = Immutable.fromJS([]);
var _zoneData = Immutable.fromJS([]);
var _labelingData = Immutable.fromJS([]);
var _selectedLabelingIndex = null;
var _selectedLabeling = null;
var INDUSTRY_DATA_CHANGE_EVENT = 'industrydatachange';
var ZONE_DATA_CHANGE_EVENT = 'zonedatachange';
var LABELING_DATA_CHANGE_EVENT = 'labelingdatachange';
let SELECTED_LABELING_CHANGE_EVENT = 'selectedlabelingchange';
let ERROR_CHANGE_EVENT = 'errorchange';

var LabelingStore = assign({}, PrototypeStore, {
  getLabelingData() {
    return _labelingData;
  },
  setLabelingData(labelingData) {
    _labelingData = Immutable.fromJS(labelingData);
    if (_labelingData && _labelingData.size !== 0) {
      if (_selectedLabelingIndex === null) {
        _selectedLabelingIndex = 0;
        _selectedLabeling = _labelingData.get(0);
      } else {
        var index = _labelingData.findIndex((item) => {
          if (item.get('IndustryId') === _selectedLabeling.get('IndustryId') && item.get('ZoneId') === _selectedLabeling.get('ZoneId')) {
            return true;
          }
        });
        if (index !== -1 && _selectedLabelingIndex !== index) {
          _selectedLabelingIndex = index;
        }
      }
    } else {
      _selectedLabelingIndex = null;
      _selectedLabeling = null;
    }
  },
  getIndustryData() {
    return _industryData;
  },
  setIndustryData(industryData) {
    _industryData = Immutable.fromJS(industryData);
  },
  getZoneData() {
    return _zoneData;
  },
  setZoneData(zoneData) {
    _zoneData = Immutable.fromJS(zoneData);
  },
  getSelectedLabeling() {
    return _selectedLabeling;
  },
  getSelectedLabelingIndex() {
    return _selectedLabelingIndex;
  },
  setSelectedLabeling(labeling) {
    _selectedLabeling = Immutable.fromJS(labeling);
  },
  setSelectedLabelingIndex(index) {
    if (index === null) {
      _selectedLabelingIndex = null;
      _selectedLabeling = null;
    } else {
      _selectedLabelingIndex = index;
      _selectedLabeling = _labelingData.get(_selectedLabelingIndex);
    }
  },
  deleteLabeling() {
    _labelingData = _labelingData.delete(_selectedLabelingIndex);
    var length = _labelingData.size;
    if (length !== 0) {
      if (_selectedLabelingIndex === length) {
        _selectedLabelingIndex = length - 1;
      }
      _selectedLabeling = _labelingData.get(_selectedLabelingIndex);
    } else {
      _selectedLabelingIndex = null;
      _selectedLabeling = null;
    }
  },
  addIndustryDataChangeListener: function(callback) {
    this.on(INDUSTRY_DATA_CHANGE_EVENT, callback);
  },
  emitIndustryDataChange: function() {
    this.emit(INDUSTRY_DATA_CHANGE_EVENT);
  },
  removeIndustryDataChangeListener: function(callback) {
    this.removeListener(INDUSTRY_DATA_CHANGE_EVENT, callback);
  },
  addZoneDataChangeListener: function(callback) {
    this.on(ZONE_DATA_CHANGE_EVENT, callback);
  },
  emitZoneDataChange: function() {
    this.emit(ZONE_DATA_CHANGE_EVENT);
  },
  removeZoneDataChangeListener: function(callback) {
    this.removeListener(ZONE_DATA_CHANGE_EVENT, callback);
  },
  addLabelingDataChangeListener: function(callback) {
    this.on(LABELING_DATA_CHANGE_EVENT, callback);
  },
  emitLabelingDataChange: function() {
    this.emit(LABELING_DATA_CHANGE_EVENT);
  },
  removeLabelingDataChangeListener: function(callback) {
    this.removeListener(LABELING_DATA_CHANGE_EVENT, callback);
  },
  addSelectedLabelingChangeListener: function(callback) {
    this.on(SELECTED_LABELING_CHANGE_EVENT, callback);
  },
  emitSelectedLabelingChange: function() {
    this.emit(SELECTED_LABELING_CHANGE_EVENT);
  },
  removeSelectedLabelingChangeListener: function(callback) {
    this.removeListener(SELECTED_LABELING_CHANGE_EVENT, callback);
  },
  addErrorChangeListener(callback) {
    this.on(ERROR_CHANGE_EVENT, callback);
  },
  removeErrorChangeListener(callback) {
    this.removeListener(ERROR_CHANGE_EVENT, callback);
  },
  emitErrorhange() {
    this.emit(ERROR_CHANGE_EVENT);
  }
});

LabelingStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_ALL_INDUSTRIES_SUCCESS:
      LabelingStore.setIndustryData(action.industryData);
      LabelingStore.emitIndustryDataChange();
      break;
    case Action.GET_ALL_ZONES_SUCCESS:
      LabelingStore.setZoneData(action.zoneData);
      LabelingStore.emitZoneDataChange();
      break;
    case Action.GET_ALL_LABELS_SUCCESS:
      LabelingStore.setLabelingData(action.labelingData);
      LabelingStore.emitLabelingDataChange();
      LabelingStore.emitSelectedLabelingChange();
      break;
    case Action.SET_SELECTED_LABELING:
      LabelingStore.setSelectedLabelingIndex(action.index);
      LabelingStore.emitSelectedLabelingChange();
      break;
    case Action.CANCEL_SAVE_LABELING:
      LabelingStore.emitSelectedLabelingChange();
      break;
    case Action.MODIFT_LABELING_SUCCESS:
    case Action.CREATE_LABELING_SUCCESS:
      LabelingStore.setSelectedLabeling(action.labeling);
      break;
    case Action.DELETE_LABELING_SUCCESS:
      LabelingStore.deleteLabeling();
      LabelingStore.emitLabelingDataChange();
      LabelingStore.emitSelectedLabelingChange();
      break;
    case Action.MODIFT_LABELING_ERROR:
    case Action.CREATE_LABELING_ERROR:
    case Action.DELETE_LABELING_ERROR:
      LabelingStore.emitErrorhange();
      break;
  }
});

module.exports = LabelingStore;
