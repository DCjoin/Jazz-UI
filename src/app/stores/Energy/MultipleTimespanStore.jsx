'use strict';

import PopAppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../../constants/actionType/Energy.jsx';

const _relativeTypes =[ 'Customerize', 'Last7Day', 'Last30Day', 'Last12Month', 'Today', 'Yesterday',
                      'ThisWeek', 'LastWeek', 'ThisMonth', 'LastMonth', 'ThisYear', 'LastYear'];

let _relativeList = null,
    _originalType = null,//原始时间的相对时间类型
    _uomString = null;

let MultipleTimespanStore = assign({},PrototypeStore,{
  reset(){
     _relativeList = null;
  },
  initData(originalType, startDate, endDate){
    let me = this;
    _originalType = originalType;

    if(_relativeList === null || _relativeList.length === 0 || _relativeList.length === 1){
      _relativeList = [];
      _relativeList.push(me.generateTimespanItem(true, originalType, null, startDate, endDate, null, null));
      _relativeList.push(me.generateTimespanItem(false, originalType, null, null, null, null, 1));

    }else if(this.isOriginalDateChanged(_relativeList, originalType, startDate, endDate)){
        let mainItem = _relativeList[0],
            dateInterval = startDate.getTime() - mainItem.startDate.getTime(),
            dateSpan = mainItem.endDate.getTime() - mainItem.startDate.getTime();
        let newRelativeList = [];
        newRelativeList.push(me.generateTimespanItem(true, originalType, null, startDate, endDate, null, null));

        _relativeList.forEach((item, index)=>{
          let startDate = new Date(item.startDate.getTime() + dateInterval),
              endDate = new Date(startDate.getTime()+dateSpan);

          let newItem = me.generateTimespanItem(false, 'Customerize', null, startDate, endDate, null, index);
          newRelativeList.push(newItem);
      });
      _relativeList = newRelativeList;
    }
  },
  generateTimespanItem(isOriginalDate, relativeType, relativeValue, startDate, endDate, dateDescription, compareIndex){
    let item = { isOriginalDate: isOriginalDate,
                 relativeType: relativeType,
                 relativeValue: relativeValue,
                 startDate: startDate,
                 endDate: endDate,
                 dateDescription: dateDescription
               };
    if(isOriginalDate){
      item.title = '原始时间';
    }else{
      item.title = '对比时间段' + compareIndex;
      item.compareIndex = compareIndex;
    }
    return item;
  },
  isOriginalDateChanged(relativeList, originalType, startDate, endDate){
    let mainItem = relativeList[0];
    let ischanged = false;

    if(mainItem.relativeType !== originalType){
      ischanged = true;
    }else if(originalType === 'Customerize' &&
         (mainItem.startDate.getTime() !== startDate.getTime() || mainItem.endDate.getTime() !== endDate.getTime() )){
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
  getCustomerizeType(){
    return 'Customerize';
  },
  getRelativeList(){
    return _relativeList;
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
  }
});
MultipleTimespanStore.dispatchToken = PopAppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.INIT_MULTITIMESPAN_DATA:
        MultipleTimespanStore.initData(action.relativeType, action.startDate, action.endDate);
        break;
    }
});

module.exports = MultipleTimespanStore;
