'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Action } from '../constants/actionType/Labeling.jsx';


var _industryData = Immutable.fromJS([]);
var _zoneData = Immutable.fromJS([]);
var _labelingData = Immutable.fromJS([]);
var _selecteLabelingIndex = null;
var _selecteLabeling = null;
var INDUSTRY_DATA_CHANGE_EVENT = 'industrydatachange';
var ZONE_DATA_CHANGE_EVENT = 'zonedatachange';
var LABELING_DATA_CHANGE_EVENT = 'labelingdatachange';
let SELECTED_LABELING_CHANGE_EVENT = 'selectedlabelingchange';

var LabelingStore = assign({}, PrototypeStore, {
  getLabelingData() {
    return _labelingData;
  },
  setLabelingData(labelingData) {
    _labelingData = Immutable.fromJS(labelingData);
    if (_labelingData.size !== 0) {
      if (_selecteLabelingIndex === null) {
        _selecteLabelingIndex = 0;
        _selecteLabeling = _labelingData.get(0);
      } else {
        var index = _labelingData.findIndex((item) => {
          if (item.get('IndustryId') === _selecteLabeling.get('IndustryId') && item.get('ZoneId') === _selecteLabeling.get('ZoneId')) {
            return true;
          }
        });
        if (index !== -1 && _selecteLabelingIndex !== index) {
          _selecteLabelingIndex = index;
        }
      }
    } else {
      _selecteLabelingIndex = null;
      _selecteLabeling = null;
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
    return _selecteLabeling;
  },
  getSelectedLabelingIndex() {
    return _selecteLabelingIndex;
  },
  setSelectedLabeling(labeling) {
    _selecteLabeling = Immutable.fromJS(labeling);
  },
  setSelectedLabelingIndex(index) {
    if (index === null) {
      _selecteLabelingIndex = null;
      _selecteLabeling = null;
    } else {
      _selecteLabelingIndex = index;
      _selecteLabeling = _labelingData.get(_selecteLabelingIndex);
    }
  },
  deleteLabeling() {
    _labelingData = _labelingData.delete(_selecteLabelingIndex);
    var length = _labelingData.size;
    if (length !== 0) {
      if (_selecteLabelingIndex === length) {
        _selecteLabelingIndex = length - 1;
      }
      _selecteLabeling = _labelingData.get(_selecteLabelingIndex);
    } else {
      _selecteLabelingIndex = null;
      _selecteLabeling = null;
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
  }
});

module.exports = LabelingStore;
