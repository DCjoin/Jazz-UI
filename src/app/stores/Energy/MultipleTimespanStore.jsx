'use strict';

import PopAppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../../constants/actionType/Energy.jsx';

const _relativeTypes =[ 'Customerize', 'Last7Day', 'Last30Day', 'Last12Month', 'Today', 'Yesterday',
                      'ThisWeek', 'LastWeek', 'ThisMonth', 'LastMonth', 'ThisYear', 'LastYear'];

let _relativeList = null;
let MultipleTimespanStore = assign({},PrototypeStore,{
  reset(){
     _relativeList = null;
  },
  initData(rawRelativeType, startDate, endDate){
    let me = this;
    if(_relativeList === null || _relativeList.length === 0 || _relativeList.length === 1){
      _relativeList = [];
      _relativeList.push(me.generateTimespanItem(true, rawRelativeType, null, startDate, endDate, null, null));
      _relativeList.push(me.generateTimespanItem(false, rawRelativeType, null, null, null, null, 1));

    }else if(this.isOriginalDateChanged(_relativeList, rawRelativeType, startDate, endDate)){
        let mainItem = _relativeList[0],
            dateInterval = startDate.getTime() - mainItem.startDate.getTime(),
            dateSpan = mainItem.endDate.getTime() - mainItem.startDate.getTime();
        let newRelativeList = [];
        newRelativeList.push(me.generateTimespanItem(true, rawRelativeType, null, startDate, endDate, null, null));

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
  },
  isOriginalDateChanged(relativeList, rawRelativeType, startDate, endDate){
    let mainItem = relativeList[0];
    let ischanged = false;

    if(mainItem.relativeType !== rawRelativeType){
      ischanged = true;
    }else if(rawRelativeType === 'Customerize' &&
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
  getAailableRelativeValues(){
    return [1,2,3,4,5];
  },
  getRelativeUOM(){
    return '天';
  },
  getRelativeList(){
    return _relativeList;
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
