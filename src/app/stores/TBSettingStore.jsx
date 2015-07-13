'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import TBSetting from '../constants/actionType/TBSetting.jsx';

var _tbSetting = null;
var _calcData = null;
var _hierId=null;
var _tagId=null;
var _calDetail=null;
var _year=null;
var _isCalDetailLoading=false;

let CHANGE_TAG_EVENT = 'changetag';
let CHANGE_TBYEAR_EVENT = 'changetbyear';
let CHANGE_CALDETAIL_EVENT= 'changecaldetail';
let CALDETAIL_LOADING_EVENT='caldetailloading';


var TBSettingStore = assign({},PrototypeStore,{
  getData(){
    return _tbSetting;
  },
  setData(data){
    _tbSetting = data;
  },
  getCalDetailData(){
    var selectCal=null;
    if(_calDetail!==null){
      _calDetail.forEach(function(calData,i){
      if(_year>=calData.EffectiveTime){
          selectCal=calData
        }
      });
    }

    return selectCal;
  },
  setCalDetailData(data,year){
    _calDetail = null;
    if(data.CalendarItemGroups.length!=0){
        data.CalendarItemGroups[0].CalendarItems.sort(function(a,b){return a.EffectiveTime>b.EffectiveTime?1:-1});
        _calDetail=data.CalendarItemGroups[0].CalendarItems
      }
    _isCalDetailLoading=false;
  },
  emitCalDetailChange: function() {
        this.emit(CHANGE_CALDETAIL_EVENT);
      },

  addCalDetailListener: function(callback) {
        this.on(CHANGE_CALDETAIL_EVENT, callback);
      },

  removeCalDetailListener: function(callback) {
        this.removeListener(CHANGE_CALDETAIL_EVENT, callback);
        this.dispose();
      },
  setHierId(hierId){
    _hierId=hierId;
  },
  getHierId(){
    return _hierId;
  },
  setTagId(tagId){
    _tagId=tagId;
  },
  getTagId(){
    return _tagId;
  },
  resetHierId(){
    _hierId=null;
  },
  resetTagId(){
    _tagId=null;
  },
  setYear(year){
    _year=year;
  },
  getYear(){
    return _year;
  },
  setCalDetailLoading(){
    _isCalDetailLoading=true;
  },
  getCalDetailLoading(){
    return _isCalDetailLoading;
  },
  emitCalDetailLoadingChange: function() {
        this.emit(CALDETAIL_LOADING_EVENT);
        },

  addCalDetailLoadingListener: function(callback) {
       this.on(CALDETAIL_LOADING_EVENT, callback);
        },

  removeCalDetailLoadingListener: function(callback) {
      this.removeListener(CALDETAIL_LOADING_EVENT, callback);
      this.dispose();
        },
});

var Action = TBSetting.Action;
TBSettingStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.LOADED_TBSETTING:
      TBSettingStore.setData(action.setting);
      TBSettingStore.emitChange();
      break;
    case Action.SAVE_TBSETTING:
      TBSettingStore.setData(action.setting);
      TBSettingStore.emitChange();
      break;
    case Action.LOAD_CALDETAIL:
      TBSettingStore.setCalDetailData(action.data);
      TBSettingStore.emitCalDetailChange();
        break;
    case Action.SET_HIERID:
      TBSettingStore.setHierId(action.hierId);
      break;
    case Action.SET_TAGID:
      TBSettingStore.setTagId(action.tagId);
      break;
    case Action.RESET_HIERID:
      TBSettingStore.resetHierId();
      break;
    case Action.RESET_TAGID:
      TBSettingStore.resetTagId();
      break;
    case Action.SET_YEAR:
      TBSettingStore.setYear(action.year);
      break;
    case Action.SET_CALDETAIL_LOAGDING:
      TBSettingStore.setCalDetailLoading();
      TBSettingStore.emitCalDetailLoadingChange();
      break;
  }
});

module.exports = TBSettingStore;
