
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
import assign from 'object-assign';

let _dimensions=null;
let _KPIPeriod=null;
const KPIStore = assign({}, PrototypeStore, {
  setDimensions(data){
    _dimensions=Immutable.fromJS(data);
  },

  getDimensions(){
    return _dimensions;
  },

  setKPIPeriod(data) {
    _KPIPeriod = data;
  },

  getKPIPeriod(){
    return assign({}, _KPIPeriod);
  },

  dispose(){
    //ticketList = Immutable.fromJS({});
  }

});

KPIStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_QUOTAPERIOD:
      KPIStore.setKPIPeriod(action.data);
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
