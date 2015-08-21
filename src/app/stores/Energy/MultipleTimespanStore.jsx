'use strict';

import PopAppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../../constants/actionType/Energy.jsx';

const _relativeTypes =[ 'Customerize', 'Last7Day', 'Last30Day', 'Last12Month', 'Today', 'Yesterday',
                      'ThisWeek', 'LastWeek', 'ThisMonth', 'LastMonth', 'ThisYear', 'LastYear'];

let _relativeType = null,
    _relativeList = null,
    _convertedList = null;
let MultipleTimespanStore = assign({},PrototypeStore,{
  initData(rawRelativeType, startDate, endDate){
    if(_relativeList === null || _relativeList.length === 0){
      _relativeList.push({relativeType: rawRelativeType, startDate: startDate, endDate: endDate});
      _relativeList.push({relativeType: rawRelativeType});
    }else{

    }
  },
  getRelativeType(){
    return _relativeTypes;
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
  },
  getConvertedList(){
    return _convertedList;
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
