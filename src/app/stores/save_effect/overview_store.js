import Immutable from 'immutable';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import AjaxConstants from 'constants/AjaxConstants.jsx';
import { Action,Model } from 'constants/actionType/Effect.jsx';
import TimeGranularity from 'constants/TimeGranularity.jsx';

let 
  _overviewData,
  OverviewStore;

function init() {
  _overviewData = undefined;
}

init();

export default OverviewStore = Object.assign({}, PrototypeStore, {
  setOverview: data => {
    _overviewData = Immutable.fromJS(data);
  },
  getOverview: () => {
    return _overviewData;
  },
});
OverviewStore.dispatchToken = AppDispatcher.register( action => {
  switch(action.type) {
    case Action.UPDATE_OVERVIEW:
        OverviewStore.setOverview(action.data);
        OverviewStore.emitChange(true);
        break;
    default:
  }

});
