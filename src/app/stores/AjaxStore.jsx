import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import AjaxConstants from '../constants/AjaxConstants.jsx';
import PrototypeStore from './PrototypeStore.jsx';
// import events from 'events';
import assign from 'object-assign';

let {AjaxActionType} = AjaxConstants;

var AjaxStore = assign({}, PrototypeStore, {

});

AjaxStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case AjaxActionType.AJAX_END_ERROR:
        AjaxStore.emitError(action.httpStatusCode);
        break;
    default:
      // do nothing
  }

});

module.exports = AjaxStore;
