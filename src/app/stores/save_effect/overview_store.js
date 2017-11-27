import Immutable from 'immutable';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import AjaxConstants from 'constants/AjaxConstants.jsx';
import { Action,Model } from 'constants/actionType/Effect.jsx';
import TimeGranularity from 'constants/TimeGranularity.jsx';

let 
  _overviewData,
  _overviewTotal,
  _minYear,
  _classificationData,
  OverviewStore;

function init() {
  _overviewData = undefined;
  _minYear = undefined;
  _classificationData = undefined;
  _overviewTotal=undefined;
}

init();

export default OverviewStore = Object.assign({}, PrototypeStore, {
  setOverview: data => {
    _overviewData = data;
  },
  getOverview: () => {
    return _overviewData;
  },
  setOverviewTotal:data=>{
    _overviewTotal=data;
  },
  getOverviewTotal:()=>_overviewTotal,
  setMinYear: data => {
    _minYear = data;
  },
  getMinYear: () => {
    return _minYear;
  },
  setClassificationData: data => {
    _classificationData = data;
  },
  getClassificationData: () => {
    return _classificationData;
  },
});
OverviewStore.dispatchToken = AppDispatcher.register( action => {
  switch(action.type) {
    case Action.GET_BUILDING_CHART:
    case Action.GET_GROUP_CHART:
        OverviewStore.setOverview(action.data);
        OverviewStore.emitChange();
        break;
    case Action.GET_GROUP_TOTAL:
    case Action.GET_BUILDING_TOTAL:
        OverviewStore.setOverviewTotal(action.data);
        OverviewStore.emitChange();
        break;
    case Action.GET_MIN_YEAR:
        OverviewStore.setMinYear(action.data);
        OverviewStore.emitChange();
        break;
    case Action.GET_CLASSIFICATION_DATA:
        OverviewStore.setClassificationData(action.data);
        OverviewStore.emitChange();
        break;
    case Action.INIT_STORE:
        init();
        break;
    default:
  }

});
