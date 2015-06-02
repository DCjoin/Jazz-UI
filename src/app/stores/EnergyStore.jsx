'use strict';


import PopAppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import {dateType} from '../constants/AlarmConstants.jsx';
import {Action} from '../constants/actionType/Alarm.jsx';

let TAG_DATA_LOADING_EVENT = 'tagdataloading',
    TAG_DATA_CHANGED_EVENT = 'tagdatachanged';

let _isLoading = false,
    _energyData = null,
    _energyRawData = null,
    _submitParams = null;

var EnergyStore = assign({},PrototypeStore,{
  getLoadingStatus(){
    return _isLoading;
  },
  getEnergyData(){
    return _energyData;
  },
  getSubmitParams(){
    return _submitParams;
  },
  _onDataLoading(params){
    _submitParams = params;
    _isLoading = true;
  },
  _onDataChanged(data, params){
    _isLoading = false;
    _energyRawData = data;
  },
  addTagDataLoadingListener: function(callback) {
    this.on(TAG_DATA_LOADING_EVENT, callback);
  },
  emitTagDataLoading: function() {
    this.emit(TAG_DATA_LOADING_EVENT);
  },
  addTagDataChangeListener: function(callback) {
    this.on(TAG_DATA_CHANGED_EVENT, callback);
  },
  emitTagDataChange: function() {
    this.emit(TAG_DATA_CHANGED_EVENT);
  }
});

EnergyStore.dispatchToken = PopAppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_TAG_DATA_LOADING:
        EnergyStore._onDataLoading(action.submitParams);
        EnergyStore.emitTagDataLoading();
        break;
      case Action.GET_TAG_DATA_SUCCESS:
        EnergyStore._onDataChanged(action.energyData, action.submitParams);
        EnergyStore.emitTagDataChange();
        break;
      case Action.GET_TAG_DATA_ERROR:
        EnergyStore._onDataChanged(null, action.submitParams);
        EnergyStore.emitTagDataChange();
        break;
    }
});

module.exports = EnergyStore;
