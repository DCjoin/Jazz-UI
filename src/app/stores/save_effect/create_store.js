import Immutable from 'immutable';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import AjaxConstants from 'constants/AjaxConstants.jsx';
import { Action } from 'constants/actionType/Effect.jsx';

let {AjaxActionType} = AjaxConstants;

let CreateStore,
_tags,
_chartData2;

(function init() {
  _tags = undefined;
  _chartData2 = undefined;
})();

export default CreateStore = Object.assign({}, PrototypeStore, {
  setTagsByPlan: tags => {
    _tags = Immutable.fromJS(tags);
  },
  getTagsByPlan: () => {
    return _tags;
  },
  setChartData2: data => {
    _chartData2 = Immutable.fromJS(data);
  },
  getChartData2: () => {
    return _chartData2;
  },
  setChartData3: data => {
    _chartData3 = Immutable.fromJS(data);
  },
  getChartData3: () => {
    return _chartData3;
  },
});
CreateStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.UPDATE_TAGS:
        CreateStore.setTagsByPlan(action.tags);
        CreateStore.emitChange();
        break;
    case Action.GET_PREVIEW_CHART2:
        CreateStore.setChartData2(action.data);
        CreateStore.emitChange();
        break;
    case Action.GET_PREVIEW_CHART3:
        CreateStore.setChartData3(action.data);
        CreateStore.emitChange();
        break;
    default:
  }

});
