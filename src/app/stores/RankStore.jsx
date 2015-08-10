'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import {dateType} from '../constants/AlarmConstants.jsx';
import {Action} from '../constants/actionType/Ranking.jsx';
import ReaderFuncs from './MixedChartReader.jsx';
import CommonFuns from '../util/Util.jsx';

const TAG_DATA_LOADING_EVENT = 'tagdataloading',
      TAG_DATA_CHANGED_EVENT = 'tagdatachanged',
      GET_DATA_ERROR_EVENT = 'gettagdataerror';

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
  _onDataLoading(params, selectedList, relativeDate, isAlarmLoading){
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
    for(var i=0,len=commodityList.length; i<len; i++){
      if(commodityList[i].Id === commodityId){
        d1.option.commodity = commodityList[i].Comment;
        break;
      }
    }
    for (i = 0; i < series.length; ++i) {
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
  addTagDataLoadingListener: function(callback) {
    this.on(TAG_DATA_LOADING_EVENT, callback);
  },
  emitTagDataLoading: function() {
    this.emit(TAG_DATA_LOADING_EVENT);
  },
  removeTagDataLoadingListener: function(callback) {
    this.removeListener(TAG_DATA_LOADING_EVENT, callback);
  },
  addTagDataChangeListener: function(callback) {
    this.on(TAG_DATA_CHANGED_EVENT, callback);
  },
  emitTagDataChange: function() {
    this.emit(TAG_DATA_CHANGED_EVENT);
  },
  removeTagDataChangeListener: function(callback) {
    this.removeListener(TAG_DATA_CHANGED_EVENT, callback);
  },
  addGetTagDataErrorListener:function(callback) {
    this.on(GET_DATA_ERROR_EVENT, callback);
  },
  emitGetTagDataErrorListener:function(callback) {
    this.emit(GET_DATA_ERROR_EVENT);
  },
  removeGetTagDataErrorListener: function(callback) {
    this.removeListener(GET_DATA_ERROR_EVENT, callback);
  }
});

RankStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_TAG_DATA_LOADING:
        RankStore._onDataLoading(action.submitParams, action.selectedList, action.relativeDate);
        RankStore.emitTagDataLoading();
        break;
      case Action.GET_TAG_DATA_SUCCESS:
        RankStore._onDataChanged(action.energyData, action.submitParams);
        RankStore.emitTagDataChange();
        break;
      case Action.GET_TAG_DATA_ERROR:
        RankStore._onDataChanged(null, action.submitParams);
        RankStore._initErrorText(action.errorText);
        RankStore.emitGetTagDataErrorListener();
        break;
    }
});

module.exports = RankStore;
