
'use strict';

import AppDispatcher from 'dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';

let _monthKpi=null;
const MonthKPIStore = assign({}, PrototypeStore, {
  setMonthKpi(data){
    _monthKpi=data;
  },

  getMonthKpi(){
    return _monthKpi;
  },

  dispose(){
    _monthKpi=null;
  }

});

MonthKPIStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.SET_MONTH_KPI_INFO:
         MonthKPIStore.setMonthKpi(action.data);
         MonthKPIStore.emitChange();
         break;
    default:
  }
});

export default MonthKPIStore;
