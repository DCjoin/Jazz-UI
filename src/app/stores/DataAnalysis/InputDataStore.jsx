'use strict';

import React from 'react';
import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/DataAnalysis.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {DataConverter,DateComputer} from 'util/Util.jsx';
import _ from 'lodash';
import TimeGranularity from 'constants/TimeGranularity.jsx';
import MenuItem from 'material-ui/MenuItem';
import Tag from 'constants/actionType/customerSetting/Tag.jsx';

var _total=0,
    _tagList=null,
    _rawData=null,
    dataArr=[];

let CHANGE_EVENT = 'change',
    CHANGE_LEAVE_EVENT = 'changeleave',
    CHANGE_SELECTED_TAB_EVENT='changeselectedtag';

const InputDataStore = assign({}, PrototypeStore, {
  setTagList(tagData){
    if (tagData !== null) {
      _total = tagData.total;
      _tagList = Immutable.fromJS(tagData.Data);
    } else {
      _total = 0;
      _tagList = Immutable.fromJS([]);
    }
  },
  getTagList(){
    return _tagList;
  },
  getTotal(){
    return _total;
  },
  setLatestRawData(data){
    _rawData=data
  },
  getLatestRawData(){
    return _rawData
  },
  getRawDataList(startDate,endDate,step){
    dataArr=[];
    var startTime=startDate.getTime(),endTime=endDate.getTime();
    startTime=DateComputer.AddSevralStep(startDate,step,1).getTime();
    while(startTime<=endTime){
        if(_rawData===null){
          dataArr.push({
            UtcTime:DataConverter.DatetimeToJson(startTime),
            DataValue:'',
            DataQuality:0,
          });
        }
        else {
          dataArr.push({
            UtcTime:DataConverter.DatetimeToJson(startTime),
            DataValue:startTime===DataConverter.JsonToDateTime(_rawData.UtcTime,true)?_rawData.DataValue:'',
            DataQuality:startTime===DataConverter.JsonToDateTime(_rawData.UtcTime,true)?_rawData.DataQuality:0,
          });
        }
      startTime=DateComputer.AddSevralStep(new Date(startTime),step,1).getTime();
    }
    return Immutable.fromJS(dataArr);

  },
  getDataList(){
    return Immutable.fromJS(dataArr);
  },
  getSearchDateByStep(step){
    if(step===TimeGranularity.Min15 || step===TimeGranularity.Min30 || step===TimeGranularity.Hourly){
      return([
        <MenuItem value='Customerize' primaryText={I18N.Common.DateRange.Customerize} />,
        <MenuItem value='Last7Day' primaryText={I18N.Common.DateRange.Last7Day} />,
        <MenuItem value='Last31Day' primaryText={I18N.Common.DateRange.Last31Day} />,
        <MenuItem value='Today' primaryText={I18N.Common.DateRange.Today} />,
        <MenuItem value='Yesterday' primaryText={I18N.Common.DateRange.Yesterday} />,
        <MenuItem value='ThisWeek' primaryText={I18N.Common.DateRange.ThisWeek} />,
        <MenuItem value='LastWeek' primaryText={I18N.Common.DateRange.LastWeek} />,
        <MenuItem value='ThisMonth' primaryText={I18N.Common.DateRange.ThisMonth} />,
        <MenuItem value='LastMonth' primaryText={I18N.Common.DateRange.LastMonth} />
      ])
    }else {
      return ([
        <MenuItem value='Customerize' primaryText={I18N.Common.DateRange.Customerize} />,
        <MenuItem value='Last7Day' primaryText={I18N.Common.DateRange.Last7Day} />,
        <MenuItem value='Last31Day' primaryText={I18N.Common.DateRange.Last31Day} />,
        <MenuItem value='Last12Month' primaryText={I18N.Common.DateRange.Last12Month} />,
        <MenuItem value='Today' primaryText={I18N.Common.DateRange.Today} />,
        <MenuItem value='Yesterday' primaryText={I18N.Common.DateRange.Yesterday} />,
        <MenuItem value='ThisWeek' primaryText={I18N.Common.DateRange.ThisWeek} />,
        <MenuItem value='LastWeek' primaryText={I18N.Common.DateRange.LastWeek} />,
        <MenuItem value='ThisMonth' primaryText={I18N.Common.DateRange.ThisMonth} />,
        <MenuItem value='LastMonth' primaryText={I18N.Common.DateRange.LastMonth} />,
        <MenuItem value='ThisYear' primaryText={I18N.Common.DateRange.ThisYear} />,
        <MenuItem value='LastYear' primaryText={I18N.Common.DateRange.LastYear} />,
        <MenuItem value='Last5Year' primaryText={I18N.Common.DateRange.Last5Year} />
      ])
    }
  },
  setDataList(tagDatas){
    dataArr=tagDatas;
  },
  dispose(){
    console.log('dispose');
    _tagList=null
  },
  emitChange: function(args) {
    this.emit(CHANGE_EVENT, args);
  },
  emitLeaveChange: function(args) {
    this.emit(CHANGE_LEAVE_EVENT,args);
  },
  addLeaveChangeListener: function(callback) {
    this.on(CHANGE_LEAVE_EVENT, callback);
  },
  removeLeaveChangeListener: function(callback) {
    this.removeListener(CHANGE_LEAVE_EVENT, callback);
    this.dispose();
  },
  emitSelectedTagChange: function(args) {
    this.emit(CHANGE_SELECTED_TAB_EVENT,args);
  },
  addSelectedTagChangeListener: function(callback) {
    this.on(CHANGE_SELECTED_TAB_EVENT, callback);
  },
  removeSelectedTagChangeListener: function(callback) {
    this.removeListener(CHANGE_SELECTED_TAB_EVENT, callback);
    this.dispose();
  },
})

var TagAction=Tag.Action;
InputDataStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_MANUAL_TAGS:
          InputDataStore.setTagList(action.tagData);
          InputDataStore.emitChange()
      break;
    case Action.GET_LATEST_RAW_DATA:
          InputDataStore.setLatestRawData(action.data);
          InputDataStore.emitChange()
      break;
    case Action.SAVE_RAW_DATA_SUCCESS:
            InputDataStore.setDataList(action.alldata.toJS())
            InputDataStore.emitChange(true)
      break;
      case TagAction.GET_TAG_DATAS_SUCCESS:
              InputDataStore.setDataList(action.tagDatas.TargetEnergyData[0].EnergyData);
              InputDataStore.emitChange()
        break;
      case Action.JUDGET_IF_LEAVE:
            InputDataStore.emitLeaveChange()
        break;
        case Action.SELECTED_TAG_CHANGE:
              InputDataStore.emitSelectedTagChange()
          break;
    default:
  }
});

export default InputDataStore
