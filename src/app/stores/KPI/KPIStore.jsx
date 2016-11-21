
'use strict';

import PopAppDispatcher from '../../dispatcher/PopAppDispatcher.jsx';
import { Action } from '../../constants/actionType/Ticket.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
import assign from 'object-assign';

let _dimensions=null;
const KPIStore = assign({}, PrototypeStore, {
  setDimensions(data){
    _dimensions=Immutable.fromJS(data);
  },

  getDimensions(){
    return _dimensions;
  },

  dispose(){
    //ticketList = Immutable.fromJS({});
  }

});

KPIStore.dispatchToken = PopAppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_DIMENSION_SUCCESS:
        //  KPIStore.setDimensions(action.data);
        //  KPIStore.emitChange();
         break;
    default:
  }
});

export default KPIStore;
