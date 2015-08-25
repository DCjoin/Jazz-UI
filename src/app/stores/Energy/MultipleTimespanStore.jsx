'use strict';

import PopAppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../../util/Util.jsx';
import {Action} from '../../constants/actionType/Energy.jsx';

const _relativeTypes =[ 'Customerize', 'Last7Day', 'Last30Day', 'Last12Month', 'Today', 'Yesterday',
                      'ThisWeek', 'LastWeek', 'ThisMonth', 'LastMonth', 'ThisYear', 'LastYear'];

let _relativeList = null,
    _originalType = null,//原始时间的相对时间类型
    _uomString = null,
    _tempRelativeList = null;

let MultipleTimespanStore = assign({},PrototypeStore,{
  reset(){
     _relativeList = null;
  },
  initData(originalType, startDate, endDate){
    let me = this;
    _originalType = originalType;

    if(_relativeList === null || _relativeList.size === 0 || _relativeList.size === 1){
      _relativeList = Immutable.List([]);
      _relativeList = _relativeList.push(me.generateTimespanItem(true, originalType, null, startDate, endDate, null));
      _relativeList = _relativeList.push(me.generateTimespanItem(false, originalType, null, null, null, 1));

    }else if(this.isOriginalDateChanged(_relativeList, originalType, startDate, endDate)){
        let mainItem = _relativeList.get(0),
            dateInterval = startDate.getTime() - mainItem.get('startDate').getTime(),
            dateSpan = mainItem.endDate.getTime() - mainItem.get('startDate').getTime();
        let newRelativeList = Immutable.List([]);
        newRelativeList = newRelativeList.push(me.generateTimespanItem(true, originalType, null, startDate, endDate, null));

        _relativeList.forEach((item, index)=>{
          let startDate = new Date(item.get('startDate').getTime() + dateInterval),
              endDate = new Date(startDate.getTime()+dateSpan);

          let newItem = me.generateTimespanItem(false, 'Customerize', null, startDate, endDate, index);
          newRelativeList = newRelativeList.push(newItem);
      });
      _relativeList = newRelativeList;
    }
  },
  generateTimespanItem(isOriginalDate, relativeType, relativeValue, startDate, endDate, compareIndex){
    let item = { isOriginalDate: isOriginalDate,
                 relativeType: relativeType,
                 relativeValue: relativeValue,
                 startDate: startDate,
                 endDate: endDate,
                 dateDescription: null
               };
    if(isOriginalDate){
      item.title = '原始时间';
    }else{
      item.title = '对比时间段' + compareIndex;
      item.compareIndex = compareIndex;

      if(relativeType !== 'Customerize'){
        let defaultRelativeValue = relativeValue || 1;

        let timeregion = this.getDateByRelativeTypeAndValue(relativeType, defaultRelativeValue);
        let start = timeregion.start;
        let end = timeregion.end;

        let dateDescription = this._getDateDescription(start, end);

        item.startDate = start;
        item.endDate = end;
        item.dateDescription = dateDescription;
      }
    }
    return Immutable.fromJS(item);
  },
  getDateByRelativeTypeAndValue: function (relativeType, relativeValue) {
    let mainItem =( _tempRelativeList || _relativeList).get(0),
        mainStart = mainItem.get('startDate'),
        marinEnd =  mainItem.get('endDate'),
        dateAdd = CommonFuns.dateAdd,
        num = relativeValue,
        start, end;

    switch (relativeType) {
        case 'Customerize':
            break;
        case 'Today':
        case 'Yesterday':
            start = dateAdd(mainStart, -1 * num, 'days');
            end = dateAdd(marinEnd, -1 * num, 'days');
            break;
        case 'ThisWeek':
        case 'LastWeek':
        case 'Last7Day':
            start = dateAdd(mainStart, -7 * num, 'days');
            end = dateAdd(marinEnd, -7 * num, 'days');
            break;
        case 'ThisMonth':
        case 'LastMonth':
            start = dateAdd(mainStart, -1 * num, 'months');
            end = dateAdd(marinEnd, -1 * num, 'months');
            break;
        case 'Last30Day':
            start = dateAdd(mainStart, -30 * num, 'days');
            end = dateAdd(marinEnd, -30 * num, 'days');
            break;
        case 'ThisYear':
        case 'LastYear':
        case 'Last12Month':
            start = dateAdd(mainStart, -12 * num, 'months');
            end = dateAdd(marinEnd, -12 * num, 'months');
            break;
    }
    return {start:start, end: end};
  },
  _getDateDescription(startDate, endDate){
    let ft = I18N.DateTimeFormat.IntervalFormat, str,
        dateFormat= CommonFuns.dateFormat;

    str = dateFormat(startDate, ft.FullDay) + ' 到 ' + dateFormat(endDate, ft.FullDay);
    return str;
  },
  _initTempRelativeList(){
    if(_tempRelativeList === null){
      _tempRelativeList = _relativeList;
    }
  },
  addNewCompareDate(){
    let me = this;
    me._initTempRelativeList();
    if(_tempRelativeList.size < 4)
      _tempRelativeList = _tempRelativeList.push(me.generateTimespanItem(false, _originalType, null, null, null, _tempRelativeList.size));
  },
  removeCompareDate(compareIndex){
    let me = this;
    me._initTempRelativeList();

    _tempRelativeList = _tempRelativeList.delete(compareIndex);
    _tempRelativeList.forEach((item, index)=>{
      if(index !== 0){
        _tempRelativeList = _tempRelativeList.setIn([index,'compareIndex'], index);
        _tempRelativeList = _tempRelativeList.setIn([index,'title'], '对比时间段' + index);
        //item.compareIndex = index;
        //item.title = '对比时间段' + index;
      }
    });
  },
  isOriginalDateChanged(relativeList, originalType, startDate, endDate){
    let mainItem = relativeList.get(0);
    let ischanged = false;

    if(mainItem.get('relativeType') !== originalType){
      ischanged = true;
    }else if(originalType === 'Customerize' &&
         (mainItem.get('startDate').getTime() !== startDate.getTime() || mainItem.get('endDate').getTime() !== endDate.getTime() )){
           ischanged = true;
    }
    return ischanged;
  },
  getRelativeTypes(){
    return _relativeTypes;
  },
  getRelativeItems(){
    let menuItems = _relativeTypes.map((type)=>{
      return {value: type, text: I18N.Common.DateRange[type]};
    });
    return menuItems;
  },
  getCompareMenuItems(){
    if(_originalType === 'Customerize')
      return [{value: 'Customerize', text: I18N.Common.DateRange.Customerize }];
    else{
      return [{value: 'Customerize', text: I18N.Common.DateRange.Customerize },{value: _originalType, text: '相对时间' }];
    }
  },
  getCustomerizeType(){
    return 'Customerize';
  },
  getRelativeList(){
    return (_tempRelativeList ? _tempRelativeList.toJS() : _relativeList.toJS());
  },
  getOriginalType(){
    return _originalType;
  },
  getAvailableRelativeValues: function (originalType) {
    var offsetMenuItems = [];
    var offsetTopValue = 0;
    switch (originalType) {
        case 'Customerize':
            break;
        case 'Today':
        case 'Yesterday':
            offsetTopValue = 31;
            break;
        case 'ThisWeek':
        case 'LastWeek':
            offsetTopValue = 10;
            break;
        case 'ThisMonth':
        case 'LastMonth':
            offsetTopValue = 24;
            break;
        case 'Last30Day':
            offsetTopValue = 24;
            break;
        case 'ThisYear':
        case 'LastYear':
            offsetTopValue = 10;
            break;
        case 'Last12Month':
            offsetTopValue = 10;
            break;
        case 'Last7Day':
            offsetTopValue = 10;
            break;
        default:
            break;
      }
      for(let i = 1; i <= offsetTopValue; i++){
        offsetMenuItems.push(i);
      }
      return offsetMenuItems;
  },
  getRelativeUOM(originalType){
    let uomLabel;
    switch (originalType) {
        case 'Customerize':
          uomLabel = '';
          break;
        case 'Today':
        case 'Yesterday':
          uomLabel = I18N.EM.Day;
          break;
        case 'ThisWeek':
        case 'LastWeek':
          uomLabel = I18N.EM.Week;
          break;
        case 'ThisMonth':
        case 'LastMonth':
          uomLabel = I18N.EM.Month;
          break;
        case 'Last30Day':
          uomLabel = I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious30Day;
          break;
        case 'ThisYear':
        case 'LastYear':
          uomLabel = I18N.EM.Year;
          break;
        case 'Last12Month':
          uomLabel = I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious12Month;
          break;
        case 'Last7Day':
        uomLabel = I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious7Day;
        break;
    }
    return uomLabel;
  },
  handleRelativeTypeChange(isOriginalDate, relativeType, compareIndex){
    let me = this;
    me._initTempRelativeList();

    if(isOriginalDate){
      _originalType = relativeType;
      if(relativeType === 'Customerize'){
        let mainItem = _tempRelativeList.get(0);
        mainItem.set('relativeType', relativeType);
        _tempRelativeList = Immutable.List([]);
        _tempRelativeList = _tempRelativeList.push(mainItem);
      }else{
          let timeregion = CommonFuns.GetDateRegion(relativeType.toLowerCase());
          _tempRelativeList = Immutable.List([]);
          _tempRelativeList = _tempRelativeList.push(me.generateTimespanItem(true, relativeType, null, timeregion.start, timeregion.end, null));
      }
      _tempRelativeList = _tempRelativeList.push(me.generateTimespanItem(false, relativeType, null, null, null, 1));
    }else{
      _tempRelativeList = _tempRelativeList.set(compareIndex, me.generateTimespanItem(false, relativeType, null, null, null, compareIndex));
    }
  },
  handleRelativeValueChange(relativeValue, compareIndex){
    let me = this;
    me._initTempRelativeList();
    _tempRelativeList = _tempRelativeList.set(compareIndex, me.generateTimespanItem(false, _originalType, relativeValue, null, null, compareIndex));
  },
  handleDateTimeSelectorChange(isOriginalDate, compareIndex, startDate, endDate){
    let me = this;
    me._initTempRelativeList();

    if(isOriginalDate){
      if(_originalType === 'Customerize'){
        _tempRelativeList.set( 0, me.generateTimespanItem(true, 'Customerize', null, startDate, endDate, null));
      }else{
        _originalType = 'Customerize';
        _tempRelativeList = Immutable.List([]);
        _tempRelativeList = _tempRelativeList.push(me.generateTimespanItem(true, 'Customerize', null, startDate, endDate, null));
        _tempRelativeList = _tempRelativeList.push(me.generateTimespanItem(false, 'Customerize', null, null, null, 1));
      }
    }else{
      _tempRelativeList.set( compareIndex, me.generateTimespanItem(false, 'Customerize', null, startDate, endDate, compareIndex));
    }
  }
});
MultipleTimespanStore.dispatchToken = PopAppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.INIT_MULTITIMESPAN_DATA:
        MultipleTimespanStore.initData(action.relativeType, action.startDate, action.endDate);
        break;
      case Action.ADD_MULTITIMESPAN_DATA:
        MultipleTimespanStore.addNewCompareDate();
        MultipleTimespanStore.emitChange();
        break;
      case Action.REMOVE_MULTITIMESPAN_DATA:
        MultipleTimespanStore.removeCompareDate(action.compareIndex);
        MultipleTimespanStore.emitChange();
        break;
      case Action.RELATIVE_TYPE_CHANGE:
        MultipleTimespanStore.handleRelativeTypeChange(action.isOriginalDate, action.relativeType, action.compareIndex);
        MultipleTimespanStore.emitChange();
        break;
      case Action.RELATIVE_VALUE_CHANGE:
        MultipleTimespanStore.handleRelativeValueChange(action.relativeValue, action.compareIndex);
        MultipleTimespanStore.emitChange();
        break;
      case Action.DATETIME_SELECTOR_CHANGE:
        MultipleTimespanStore.handleDateTimeSelectorChange(action.isOriginalDate, action.compareIndex, action.startDate, action.endDate);
        MultipleTimespanStore.emitChange();
    }
});

module.exports = MultipleTimespanStore;
