'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/Energy.jsx';
import CommonFuns from '../util/Util.jsx';

const COST_DATA_LOADING_EVENT = 'costdataloading',
      COST_DATA_LOADED_EVENT = 'costdatachanged',
      COST_DATA_LOAD_ERROR_EVENT = 'costdataloaderror';

let _isLoading = false,
    _energyData = null,
    _energyRawData = null,
    _submitParams = null,
    _paramsObj = null,
    _selectedList = null,
    _chartTitle = null,
    _relativeDate = null,
    _errorCode = null,
    _errorMessage = null;

var CostStore = assign({},PrototypeStore,{
  getLoadingStatus(){
    return _isLoading;
  },
  getEnergyData(){
    return _energyData;
  },
  clearEnergyDate(){
    _energyData = null;
  },
  getEnergyRawData(){
    return _energyRawData;
  },
  getSubmitParams(){
    return _submitParams;
  },
  getParamsObj(){
    return _paramsObj;
  },
  getSelectedList(){
    return _selectedList;
  },
  getChartTitle(){
    return _chartTitle;
  },
  getRelativeDate(){
    return _relativeDate;
  },
  getErrorMessage(){
    return _errorMessage;
  },
  getErrorCode(){
    return _errorCode;
  },
  _initErrorText(errorText){
    let error = JSON.parse(errorText).error;
    let errorCode = CommonFuns.processErrorCode(error.Code).errorCode;
    _errorCode = errorCode;
    _errorMessage = error.Messages;
  },
  //only one tagOptions if click tag in alarm list
  _onDataLoading(params, selectedList, relativeDate){
    _submitParams = params;
    _isLoading = true;
    _selectedList = selectedList;

    if(relativeDate !== false){
      _relativeDate = relativeDate;
    }

    _paramsObj = {hierarchyId: params.viewAssociation.HierarchyId,
               commodityIds: params.commodityIds,
               startTime: params.viewOption.TimeRanges[0].StartTime,
               endTime: params.viewOption.TimeRanges[0].EndTime,
               timeRanges: params.viewOption.TimeRanges};
  },
  _onDataChanged(data, params){
    _isLoading = false;
    _energyRawData = data;

    let obj = {start: params.viewOption.TimeRanges[0].StartTime,
               end: params.viewOption.TimeRanges[0].EndTime,
               timeRanges: params.viewOption.TimeRanges};

    //add this for test team start
    window.testObj = window.testObj || {};
    window.testObj._energyRawData = _energyRawData;
    //add this for test team end

    _energyData = Immutable.fromJS(this.convert(data, obj));
  },
  convert(data, obj){
    if (!data) return;
    var series = data.TargetEnergyData;
    if (!series) return;
    if (series.length === 0) return null;

    var ret = [];

    var d1 = { option: {} };


    var data1 = [], s, list = [], v,
        uom,
        uomId = series[0].Target.UomId,
        uomText = series[0].Target.Uom,
        commodityId = series[0].Target.CommodityId;
    if (uomText) {
        uom = uomText;
    }

    if (uom == 'null') uom = '';
    d1.option.uom = uom;
    var commodityList = _selectedList.commodityList;
    d1.option.commodity = commodityList.commodityName;
    for (var i = 0; i < series.length; ++i) {
        s = series[i];
        if (s.EnergyData.length > 0) {
            v = s.EnergyData[0].DataValue;
            data1.push(v);

            list.push({
                name: s.Target.Name,
                val: v
            });
        }
    }
    d1.data = data1;
    d1.option.list = list;
    ret.push(d1);

    return { Data: ret, Navigator: null, Calendar: null };
  },
  /*
    returns boolean: if only one tag left, then reload data.
  */
  removeSeriesDataByUid(uid){
  },
  addCostDataLoadingListener: function(callback) {
    this.on(COST_DATA_LOADING_EVENT, callback);
  },
  emitCostDataLoading: function() {
    this.emit(COST_DATA_LOADING_EVENT);
  },
  removeCostDataLoadingListener: function(callback) {
    this.removeListener(COST_DATA_LOADING_EVENT, callback);
  },
  addCostDataLoadedListener: function(callback) {
    this.on(COST_DATA_LOADED_EVENT, callback);
  },
  emitCostDataLoaded: function() {
    this.emit(COST_DATA_LOADED_EVENT);
  },
  removeCostDataLoadedListener : function(callback) {
    this.removeListener(COST_DATA_LOADED_EVENT, callback);
  },
  addCostDataLoadErrorListener: function(callback) {
    this.on(COST_DATA_LOAD_ERROR_EVENT, callback);
  },
  emitCostDataLoadErrorListener:function() {
    this.emit(COST_DATA_LOAD_ERROR_EVENT);
  },
  removeCostDataLoadErrorListener:function(callback) {
    this.removeListener(COST_DATA_LOAD_ERROR_EVENT, callback);
  }
});

CostStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_COST_DATA_LOADING:
        CostStore._onDataLoading(action.submitParams, action.selectedList, action.relativeDate);
        CostStore.emitRankDataLoading();
        break;
      case Action.GET_COST_DATA_SUCCESS:
        CostStore._onDataChanged(action.energyData, action.submitParams);
        CostStore.emitRankDataLoaded();
        break;
      case Action.GET_COST_DATA_ERROR:
        CostStore._onDataChanged(null, action.submitParams);
        CostStore._initErrorText(action.errorText);
        CostStore.emitRankDataLoadErrorListener();
        break;
    }
});

module.exports = CostStore;
