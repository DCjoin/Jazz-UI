'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import moment from 'moment';
import CommonFuns from '../../util/Util.jsx';
import { Action } from '../../constants/actionType/customerSetting/Tag.jsx';
import ChartReaderStrategyFactor from '../energy/ChartReaderStrategyFactor.jsx';
let {DataConverter, formatDateValue} = CommonFuns;
let j2d = DataConverter.JsonToDateTime,
  d2j = DataConverter.DatetimeToJson;

let _tagList = Immutable.fromJS([]),
  _allTagList = Immutable.fromJS([]),
  _logList = Immutable.fromJS([]),
  _filterObj = Immutable.fromJS({
    CommodityId: null,
    UomId: null,
    LikeCodeOrName: ''
  }),
  _formulaFilterObj = Immutable.fromJS({
    CommodityId: null,
    UomId: null,
    LikeCodeOrName: ''
  }),
  _allTotal = 0,
  _total = 0,
  _selectedTagIndex = null,
  _selectedTag = null,
  _errorCode = null,
  _errorMessage = null,
  _rawData = Immutable.fromJS([]),
  _tagStatus = Immutable.fromJS({}),
  _differenceTargetEnergyData = null;

let CHANGE_TAG_EVENT = 'changetag';
let CHANGE_ALL_TAG_EVENT = 'changealltag';
let CHANGE_LOG_EVENT = 'changelog';
let CHANGE_SELECTED_TAG_EVENT = 'changeselectedtag';
let ERROR_CHANGE_EVENT = 'errorchange';
let TAG_DATAS_CHANGE_EVENT = 'tagdataschange';
let POINT_TO_LIST_CHANGE_EVENT = 'pointtolistchange'


var TagStore = assign({}, PrototypeStore, {
  getTagList() {
    return _tagList;
  },
  getAllTagList() {
    return _allTagList;
  },
  getTagLogList() {
    return _logList;
  },
  getTagTotalNum() {
    return _total;
  },
  getTotal() {
    return _allTotal;
  },
  setTagList(tagData) {
    if (tagData !== null) {
      _total = tagData.total;
      _tagList = Immutable.fromJS(tagData.GetTagsByFilterResult);
      if (_tagList.size !== 0) {
        _selectedTagIndex = 0;
        _selectedTag = _tagList.get(0);
      } else {
        _selectedTagIndex = null;
        _selectedTag = null;
      }
    } else {
      _total = 0;
      _tagList = Immutable.fromJS([]);
      _selectedTagIndex = null;
      _selectedTag = null;
    }
  },
  setAllTagList(allTagData) {
    if (allTagData !== null) {
      _allTotal = allTagData.total;
      _allTagList = Immutable.fromJS(allTagData.GetTagsByFilterResult);
    } else {
      _allTotal = 0;
      _allTagList = Immutable.fromJS([]);
    }
  },
  setTagLogList(logList) {
    if (logList) {
      _logList = Immutable.fromJS(logList);
    }
  },
  setFilterObj: function(filterObj) {
    _filterObj = Immutable.fromJS(filterObj);
  },
  getFilterObj: function() {
    return _filterObj;
  },
  setFormulaFilterObj: function(filterObj) {
    _formulaFilterObj = Immutable.fromJS(filterObj);
  },
  getFormulaFilterObj: function() {
    return _formulaFilterObj;
  },
  deleteTag() {
    _tagList = _tagList.delete(_selectedTagIndex);
    var length = _tagList.size;
    if (length !== 0) {
      if (_selectedTagIndex === length) {
        _selectedTagIndex = length - 1;
      }
      _selectedTag = _tagList.get(_selectedTagIndex);
    } else {
      _selectedTagIndex = null;
      _selectedTag = null;
    }
  },
  setSelectedTag(tag) {
    _selectedTag = Immutable.fromJS(tag);
    _tagList = _tagList.set(_selectedTagIndex, _selectedTag);
  },
  addSelectedTag(tag) {
    _selectedTag = Immutable.fromJS(tag);
    _tagList = _tagList.unshift(_selectedTag);
    _selectedTagIndex = 0;
  },
  getSelectedTag() {
    return _selectedTag;
  },
  getSelectedTagIndex() {
    return _selectedTagIndex;
  },
  setSelectedTagIndex(index) {
    if (index === null) {
      _selectedTagIndex = null;
      _selectedTag = null;
    } else {
      _selectedTagIndex = index;
      _selectedTag = _tagList.get(_selectedTagIndex);
    }
  },
  getErrorMessage() {
    return _errorMessage;
  },
  getErrorCode() {
    return _errorCode;
  },
  getRuleType: function() {
    return ([
      {
        type: I18N.Setting.VEEMonitorRule.NegativeValue,
        id: 2
      },
      {
        type: I18N.Setting.VEEMonitorRule.ZeroValue,
        id: 3
      },
      {
        type: I18N.Setting.VEEMonitorRule.NullValue,
        id: 1
      }
    ]);
  },
  initErrorText(errorText) {
    let error = JSON.parse(errorText).error;
    let errorCode = CommonFuns.processErrorCode(error.Code).errorCode;
    _errorCode = errorCode;
    _errorMessage = error.Messages;
  },

  // for PtagRawData
  setTagDatas: function(tagDatas, tagStatus) {
    var that = this;
    if (tagDatas !== false) {
      _rawData = Immutable.fromJS(tagDatas);
      that.extractDifferenceData(tagDatas);
    }

    if (tagStatus !== false) {
      _tagStatus = tagStatus === null ? Immutable.fromJS({}) : Immutable.fromJS(tagStatus);
    }
  },
  extractDifferenceData: function(data) {
    var targetEnergyData = data.TargetEnergyData,
      item,
      target,
      differenceItem = null;
    if (targetEnergyData && targetEnergyData.length > 0) {
      for (var i = 0, len = targetEnergyData.length; i < len; i++) {
        item = targetEnergyData[i];
        target = item.Target;
        if (target.Type && target.Type === 17) {
          if (i === 0) {
            differenceItem = data.TargetEnergyData.shift();
          } else {
            differenceItem = data.TargetEnergyData.pop();
          }
          _rawData = Immutable.fromJS(data);
        }
      }
    }
    _differenceTargetEnergyData = differenceItem;
  },
  constituteDifferenceDataArray: function(rawData, differenceData) {
    var dataArray = rawData.TargetEnergyData[0].EnergyData,
      item,
      difArray = [],
      difItem;

    difArray[0] = this.getFirstDifferenceItem(dataArray[0], differenceData);

    for (var i = 1, len = dataArray.length; i < len; i++) {
      item = dataArray[i];
      difItem = this.getDifferenceItem(item, i - 1, dataArray, differenceData);
      difArray.push(difItem);
    }
    return difArray;
  },
  getFirstDifferenceItem: function(firstItem, differenceData) {
    var difItem = {
      DataValue: null,
      LocalTime: firstItem.LocalTime,
      DataQuality: firstItem.DataQuality
    };

    if (differenceData && differenceData.EnergyData && differenceData.EnergyData.length > 0 && differenceData.EnergyData[0].DataValue !== null) {
      var differenceValue = (firstItem.DataValue * 10 * 10 - differenceData.EnergyData[0].DataValue * 10 * 10) / 100;
      if (differenceValue >= 0) {
        difItem.DataValue = differenceValue;
      }
    }
    return difItem;

  },
  getDifferenceItem: function(currentItem, preIndex, dataArray, differenceData) {
    var preItem,
      difItem = {
        DataValue: null,
        LocalTime: currentItem.LocalTime,
        DataQuality: currentItem.DataQuality
      };

    if (currentItem.DataValue !== null) {
      preItem = this.getPreviousItem(preIndex, dataArray, differenceData);
      if (preItem) {
        var differenceValue = (currentItem.DataValue * 10 * 10 - preItem.DataValue * 10 * 10) / 100;
        // if (differenceValue >= 0) {
        difItem.DataValue = differenceValue;
      //}
      }
    }

    return difItem;
  },
  getPreviousItem: function(preIndex, dataArray, differenceData) {
    var item;
    for (var i = preIndex; i >= 0; i--) {
      item = dataArray[i];
      if (item.DataValue !== null) {
        return item;
      }
    }
    if (differenceData && differenceData.EnergyData && differenceData.EnergyData.length > 0 && differenceData.EnergyData[0].DataValue !== null) {
      return differenceData.EnergyData[0];
    }
    return null;
  },
  getRawData: function() {
    return _rawData;
  },
  getDifferenceData: function() {
    if (_rawData.size === 0) return _rawData;
    var rawData = _rawData.toJS(),
      difArray = this.constituteDifferenceDataArray(rawData, _differenceTargetEnergyData),
      templateED = rawData.TargetEnergyData[0].EnergyData;

    delete rawData.TargetEnergyData[0].EnergyData;

    var cloneData = assign({}, rawData);
    rawData.TargetEnergyData[0].EnergyData = templateED;

    cloneData.TargetEnergyData[0].EnergyData = difArray;
    return Immutable.fromJS(cloneData);
  },
  getDataForChart: function(data, obj) {
    var _energyData = Immutable.fromJS({});

    // let obj = {
    //   start: params.viewOption.TimeRanges[0].StartTime,
    //   end: params.viewOption.TimeRanges[0].EndTime,
    //   step: params.viewOption.Step,
    //   timeRanges: params.viewOption.TimeRanges
    // };

    //ChartStatusStore.onEnergyDataLoaded(data, _submitParams);
    this.readerStrategy = ChartReaderStrategyFactor.getStrategyByBizChartType('EnergyTrendReader');
    let tmp = this.readerStrategy.convertFn(data, obj, this);
    _energyData = _energyData.set('Data', tmp.Data);
    return _energyData
  },

  getTagStatus: function() {
    return _tagStatus;
  },
  translateDate(val, s, targetStep) {
    var step = targetStep,
      sign = CommonFuns.isNumber(s) ? s : 1,
      date = moment(CommonFuns.isNumber(val) ? val : j2d(val)),
      newDate;
    switch (step) {
      case 0: //raw
        //newDate = date;
        newDate = date.add(-7.5 * sign, 'minutes');
        break;
      case 1: //hour add 30mins
        newDate = date.add(-30 * sign, 'minutes');
        break;
      case 2: //day add 12hours
        newDate = date.add(-12 * sign, 'hours');
        break;
      case 3: //month add 15days
        newDate = date.add(-15 * sign, 'days');
        break;
      case 4: //2010年 add 6months
        newDate = date.add(-6 * sign, 'months');
        break;
      case 5: //week add 3days&12hours
        newDate = date.add(-4 * sign, 'days');
        newDate = newDate.add(12 * sign, 'hours');
        break;
      case 6: //15mins
        newDate = date.add(-7.5 * sign, 'minutes');
        break;
      case 7: //30mins
        newDate = date.add(-15 * sign, 'minutes');
        break;
      case 8: //2 hours
        newDate = date.add(-1 * sign, 'hours');
        break;
      case 9: //4 hours
        newDate = date.add(-2 * sign, 'hours');
        break;
      case 10: //6 hours
        newDate = date.add(-3 * sign, 'hours');
        break;
      case 11: //8 hours
        newDate = date.add(-4 * sign, 'hours');
        break;
      case 12: //12hours
        newDate = date.add(-6 * sign, 'hours');
        break;
    }

    return j2d(d2j(newDate._d));
  },
  emitTagListChange: function() {
    this.emit(CHANGE_TAG_EVENT);
  },
  addTagListChangeListener: function(callback) {
    this.on(CHANGE_TAG_EVENT, callback);
  },
  removeTagListChangeListener: function(callback) {
    this.removeListener(CHANGE_TAG_EVENT, callback);
  },
  emitAllTagListChange: function() {
    this.emit(CHANGE_ALL_TAG_EVENT);
  },
  addAllTagListChangeListener: function(callback) {
    this.on(CHANGE_ALL_TAG_EVENT, callback);
  },
  removeAllTagListChangeListener: function(callback) {
    this.removeListener(CHANGE_ALL_TAG_EVENT, callback);
  },
  emitTagLogListChange: function() {
    this.emit(CHANGE_LOG_EVENT);
  },
  addTagLogListChangeListener: function(callback) {
    this.on(CHANGE_LOG_EVENT, callback);
  },
  removeTagLogListChangeListener: function(callback) {
    this.removeListener(CHANGE_LOG_EVENT, callback);
  },
  emitSelectedTagChange: function() {
    this.emit(CHANGE_SELECTED_TAG_EVENT);
  },
  addSelectedTagChangeListener: function(callback) {
    this.on(CHANGE_SELECTED_TAG_EVENT, callback);
  },
  removeSelectedTagChangeListener: function(callback) {
    this.removeListener(CHANGE_SELECTED_TAG_EVENT, callback);
  },
  addErrorChangeListener(callback) {
    this.on(ERROR_CHANGE_EVENT, callback);
  },
  removeErrorChangeListener(callback) {
    this.removeListener(ERROR_CHANGE_EVENT, callback);
  },
  emitErrorChange() {
    this.emit(ERROR_CHANGE_EVENT);
  },
  addTagDatasChangeListener(callback) {
    this.on(TAG_DATAS_CHANGE_EVENT, callback);
  },
  removeTagDatasChangeListener(callback) {
    this.removeListener(TAG_DATAS_CHANGE_EVENT, callback);
  },
  emitTagDatasChange() {
    this.emit(TAG_DATAS_CHANGE_EVENT);
  },
  addPointToListChangeListener(callback) {
    this.on(POINT_TO_LIST_CHANGE_EVENT, callback);
  },
  removePointToListChangeListener(callback) {
    this.removeListener(POINT_TO_LIST_CHANGE_EVENT, callback);
  },
  emitPointToListChange(args) {
    this.emit(POINT_TO_LIST_CHANGE_EVENT, args);
  }
});
TagStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_TAG_LIST_SUCCESS:
      TagStore.setTagList(action.tagData);
      TagStore.emitTagListChange();
      TagStore.emitSelectedTagChange();
      break;
    case Action.GET_TAG_LIST_ERROR:
      TagStore.setTagList(null);
      TagStore.emitTagListChange();
      TagStore.emitSelectedTagChange();
      break;
    case Action.GET_ALL_TAG_LIST_SUCCESS:
      TagStore.setAllTagList(action.allTagData);
      TagStore.emitAllTagListChange();
      break;
    case Action.GET_ALL_TAG_LIST_ERROR:
      TagStore.setAllTagList(null);
      TagStore.emitAllTagListChange();
      break;
    case Action.GET_LOG_LIST_SUCCESS:
      TagStore.setTagLogList(action.logList);
      TagStore.emitTagLogListChange();
      break;
    case Action.GET_LOG_LIST_ERROR:
      TagStore.setTagLogList([]);
      TagStore.emitTemplateListChange();
      break;
    case Action.SET_SELECTED_TAG:
      TagStore.setSelectedTagIndex(action.index);
      TagStore.emitSelectedTagChange();
      break;
    case Action.CANCEL_SAVE_TAG:
      TagStore.emitSelectedTagChange();
      break;
    case Action.MODIFT_TAG_SUCCESS:
      TagStore.setSelectedTag(action.tag);
      TagStore.emitTagListChange();
      TagStore.emitSelectedTagChange();
      break;
    case Action.CREATE_TAG_SUCCESS:
      TagStore.addSelectedTag(action.tag);
      TagStore.emitTagListChange();
      TagStore.emitSelectedTagChange();
      break;
    case Action.DELETE_TAG_SUCCESS:
      TagStore.deleteTag();
      TagStore.emitTagListChange();
      TagStore.emitSelectedTagChange();
      break;
    case Action.MODIFT_TAG_ERROR:
    case Action.CREATE_TAG_ERROR:
    case Action.DELETE_TAG_ERROR:
      TagStore.initErrorText(action.errorText);
      TagStore.emitErrorChange();
      break;
    case Action.GET_TAG_DATAS_SUCCESS:
      TagStore.setTagDatas(action.tagDatas, action.tagStatus);
      TagStore.emitTagDatasChange();
      break;
    case Action.SET_FILTER_OBJ:
      TagStore.setFilterObj(action.filterObj);
      break;
    case Action.SET_FORMULA_FILTER_OBJ:
      TagStore.setFormulaFilterObj(action.filterObj);
      break;
    case Action.SET_POINT_TO_LIST:
      TagStore.emitPointToListChange(action.index);
      break;
  }
});

module.exports = TagStore;
