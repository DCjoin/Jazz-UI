import Immutable from 'immutable';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import AjaxConstants from 'constants/AjaxConstants.jsx';
import { Action,Model } from 'constants/actionType/Effect.jsx';
import TimeGranularity from 'constants/TimeGranularity.jsx';
let {AjaxActionType} = AjaxConstants;

let CreateStore,
_tags,
_chartData2,
_chartData3;

(function init() {
  _tags = undefined;
  _chartData2 = undefined;
  _chartData3 = undefined;
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
  getBenchmarkModelById:(id)=>{
  return Immutable.fromJS([
    	{ id: Model.Easy, label: I18N.SaveEffect.Model.Easy },
    	{ id: Model.Contrast, label: I18N.SaveEffect.Model.Contrast },
    	{ id: Model.Manual, label: I18N.SaveEffect.Model.Manual },
    	{ id: Model.Increment, label: I18N.SaveEffect.Model.Increment },
    	{ id: Model.Relation, label: I18N.SaveEffect.Model.Relation },
    	{ id: Model.Efficiency, label: I18N.SaveEffect.Model.Efficiency },
    	{ id: Model.Simulation, label: I18N.SaveEffect.Model.Simulation },
    ]).find(item=>(item.get('id')===id)).get('label')
  },
  getCalculationStepByStep:(step)=>{
  return Immutable.fromJS([
    { id: TimeGranularity.Minite, label: I18N.EM.Raw },
    { id: TimeGranularity.Hourly, label: I18N.EM.Hour },
    { id: TimeGranularity.Daily, label: I18N.EM.Day },
    { id: TimeGranularity.Monthly, label: I18N.EM.Month },
    ]).find(item=>(item.get('id')===step)).get('label')
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
