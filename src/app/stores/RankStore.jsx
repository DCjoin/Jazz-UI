'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import {dateType} from '../constants/AlarmConstants.jsx';
import {Action} from '../constants/actionType/Ranking.jsx';
import ReaderFuncs from './MixedChartReader.jsx';
import CommonFuns from '../util/Util.jsx';

const RANK_DATA_LOADING_EVENT = 'rankdataloading',
      RANK_DATA_LOADED_EVENT = 'rankdatachanged',
      RANK_DATA_LOAD_ERROR_EVENT = 'rankdataloaderror';

let _isLoading = false,
    _energyData = null,
    _energyRawData = null,
    _submitParams = null,
    _paramsObj = null,
    _selectedList = null,
    _rankType = null,
    _chartTitle = null,
    _relativeDate = null,
    _errorCode = null,
    _errorMessage = null;

var RankStore = assign({},PrototypeStore,{
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
  getRankType(){
    return _rankType;
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



    _paramsObj = {hierarchyIds: params.hierarchyIds,
               commodityIds: params.hierarchyIds,
               rankType: params.rankType,
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
    if(_energyData){
      let latestDataList = [];
      let dataList = _energyData.toJS().Data;

      for(let i=0,len=dataList.length; i<len; i++){
        let data = dataList[i];
        if(data.uid !== uid){
          latestDataList.push(data);
        }
      }
      if(latestDataList.length === 1){
        return true;
      }else if(latestDataList.length > 0){
        _energyData = _energyData.set('Data', latestDataList);
      }else{
        _energyData = null;
      }
    }
    return false;
  },
  addRankDataLoadingListener: function(callback) {
    this.on(RANK_DATA_LOADING_EVENT, callback);
  },
  emitRankDataLoading: function() {
    this.emit(RANK_DATA_LOADING_EVENT);
  },
  removeRankDataLoadingListener: function(callback) {
    this.removeListener(RANK_DATA_LOADING_EVENT, callback);
  },
  addRankDataLoadedListener: function(callback) {
    this.on(RANK_DATA_LOADED_EVENT, callback);
  },
  emitRankDataLoaded: function() {
    this.emit(RANK_DATA_LOADED_EVENT);
  },
  removeRankDataLoadedListener : function(callback) {
    this.removeListener(RANK_DATA_LOADED_EVENT, callback);
  },
  addRankDataLoadErrorListener: function(callback) {
    this.on(RANK_DATA_LOAD_ERROR_EVENT, callback);
  },
  emitRankDataLoadErrorListener:function() {
    this.emit(RANK_DATA_LOAD_ERROR_EVENT);
  },
  removeRankDataLoadErrorListener:function(callback) {
    this.removeListener(RANK_DATA_LOAD_ERROR_EVENT, callback);
  }
});

RankStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_RANK_DATA_LOADING:
        RankStore._onDataLoading(action.submitParams, action.selectedList, action.relativeDate);
        RankStore.emitRankDataLoading();
        break;
      case Action.GET_RANK_DATA_SUCCESS:
        RankStore._onDataChanged(action.energyData, action.submitParams);
        RankStore.emitRankDataLoaded();
        break;
      case Action.GET_RANK_DATA_ERROR:
        RankStore._onDataChanged(null, action.submitParams);
        RankStore._initErrorText(action.errorText);
        RankStore.emitRankDataLoadErrorListener();
        break;
    }
});

module.exports = RankStore;
