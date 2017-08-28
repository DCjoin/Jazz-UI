import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
// import events from 'events';
import assign from 'object-assign';
import { Action } from 'constants/actionType/Effect.jsx';

var _best=null;

let IGNORE_SUCCESS_EVENT = 'ignoresuccess';

var BestStore = assign({}, PrototypeStore, {
  setBest(data){
    _best=Immutable.fromJS(data)
  },
  getUsedBest(){
    return _best.get("UsedBestSolution")
  },
  getIgnoredBest(){
    return _best.get("IgnoredBestSolution")
  },

  emitIgnoreSuccessChange: function() {
      this.emit(IGNORE_SUCCESS_EVENT);
    },
  addIgnoreSuccessListener: function(callback) {
      this.on(IGNORE_SUCCESS_EVENT, callback);
    },

  removeIgnoreSuccessListener: function(callback) {
      this.removeListener(IGNORE_SUCCESS_EVENT, callback);
      this.dispose();
    },

});

BestStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.GET_BEST_SOLUTION:
        BestStore.setBest(action.data);
        BestStore.emitChange();
        break;
      case Action.IGNORE_SUCCESS:
        BestStore.emitIgnoreSuccessChange();
        break;
    default:
      // do nothing
  }

});

module.exports = BestStore;
