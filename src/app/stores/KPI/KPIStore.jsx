
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
import assign from 'object-assign';

let _dimensions=null;
let _quotaperiod=null;
const KPIStore = assign({}, PrototypeStore, {
  setDimensions(data){
    _dimensions=Immutable.fromJS(data);
  },

  getDimensions(){
    return _dimensions;
  },

  setQuotaperiod(data) {
    _quotaperiod = data;
  },

  getQuotaperiod(){
    return _quotaperiod;
  },

  dispose(){
    //ticketList = Immutable.fromJS({});
  }

});

KPIStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_QUOTAPERIOD:
      KPIStore.setQuotaperiod(action.data);
      KPIStore.emitChange();
      break;
    case Action.GET_DIMENSION_SUCCESS:
        //  KPIStore.setDimensions(action.data);
        //  KPIStore.emitChange();
         break;
    default:
  }
});

export default KPIStore;
