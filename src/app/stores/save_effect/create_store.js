import Immutable from 'immutable';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import AjaxConstants from 'constants/AjaxConstants.jsx';
import { Action } from 'constants/actionType/Effect.jsx';

let {AjaxActionType} = AjaxConstants;

let CreateStore,
_tags;

(function init() {
  _tags = undefined;
})();

export default CreateStore = Object.assign({}, PrototypeStore, {
  setTagsByPlan: tags => {
    _tags = Immutable.fromJS(tags);
  },
  getTagsByPlan: () => {
    return _tags;
  },
});
CreateStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.UPDATE_TAGS:
        CreateStore.setTagsByPlan(action.tags);
        CreateStore.emitChange();
        break;
    default:
  }

});
