'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Labeling.jsx';
import Ajax from '../ajax/ajax.jsx';
let LabelingAction = {
  getAllIndustries() {
    Ajax.post('/Administration.svc/GetAllIndustries', {
      params: {
        includeRoot: true,
        onlyLeaf: false
      },
      success: function(industryData) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_INDUSTRIES_SUCCESS,
          industryData: industryData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_INDUSTRIES_ERROR
        });
      }
    });
  },
  getAllZones() {
    Ajax.post('/Administration.svc/GetAllZones', {
      params: {
        includeRoot: true
      },
      success: function(zoneData) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_ZONES_SUCCESS,
          zoneData: zoneData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_ZONES_ERROR
        });
      }
    });
  },
  getAllLabelings() {
    Ajax.post('/Administration.svc/GetAllLabelings', {
      params: {},
      success: function(labelingData) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_LABELS_SUCCESS,
          labelingData: labelingData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_LABELS_ERROR
        });
      }
    });
  },
  setSelectedLabelingIndex(index) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_LABELING,
      index: index
    });
  },
  cancelSaveLabeling() {
    AppDispatcher.dispatch({
      type: Action.CANCEL_SAVE_LABELING
    });
  },
  modifyLabeling(data) {
    var me = this;
    Ajax.post('/Administration.svc/ModifyLabeling', {
      params: {
        labeling: data
      },
      success: function(labeling) {
        AppDispatcher.dispatch({
          type: Action.MODIFT_LABELING_SUCCESS,
          labeling: labeling
        });
        me.getAllLabelings();
      },
      error: function(err, res) {
        console.log(err, res);
        me.getAllLabelings();
      }
    });
  },
  createLabeling(data) {
    var me = this;
    Ajax.post('/Administration.svc/CreateLabeling', {
      params: {
        labeling: data
      },
      success: function(labeling) {
        AppDispatcher.dispatch({
          type: Action.CREATE_LABELING_SUCCESS,
          labeling: labeling
        });
        me.getAllLabelings();
      },
      error: function(err, res) {
        console.log(err, res);
        me.getAllLabelings();
      }
    });
  },
  deleteLabelingById(industryId, zoneId, version) {
    Ajax.post('/Administration.svc/DeleteLabeling', {
      params: {
        labeling: {
          IndustryId: industryId,
          ZoneId: zoneId,
          Version: version
        }
      },
      success: function() {
        AppDispatcher.dispatch({
          type: Action.DELETE_LABELING_SUCCESS
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  }
};
module.exports = LabelingAction;
