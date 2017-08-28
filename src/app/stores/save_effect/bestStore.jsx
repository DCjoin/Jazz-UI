import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
// import events from 'events';
import assign from 'object-assign';
import { Action } from 'constants/actionType/Effect.jsx';

var _best=null;


var BestStore = assign({}, PrototypeStore, {
  setBest(data){
    _best=Immutable.fromJS(data)
  },
  getBest(){
    return _best
  }

});

BestStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.GET_BEST_SOLUTION:
        BestStore.setBest(action.effect);
        BestStore.emitChange();
        break;
   
    default:
      // do nothing
  }

});

module.exports = BestStore;
