import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import AjaxConstants from 'constants/AjaxConstants.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
// import events from 'events';
import assign from 'object-assign';
import { Action } from 'constants/actionType/Effect.jsx';

var _effect=null,_tags=null,_detail=null,_drafts=null;
_effect=Immutable.fromJS({
"Drafts": [
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 1",
  "TagId": 4,
  "TagName": "sample string 5",
  EnergyEffectItemId:1
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 2",
  "TagId": 4,
  "TagName": "sample string 5",
  EnergyEffectItemId:2
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5",
  EnergyEffectItemId:3
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
},
{
  "ConfigStep": 1,
  "EnergyProblemId": 2,
  "EnergySolutionName": "sample string 3",
  "TagId": 4,
  "TagName": "sample string 5"
}
],
"EnergyEffects": [
{
  "AnnualCostSaving": 1.1,
  "CalcState": 20,
  "ConfigedTagCount": 0,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6,
  EnergyEffectItemId:1,
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 6,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 2,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
},
{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
  "ConfigedTagCount": 1,
  "EnergyProblemId": 3,
  "EnergySolutionName": "sample string 4",
  "EnergySystem": 10,
  "ExecutedTime": "2017-08-07T08:20:22",
  "TotalTagCount": 6
}
],
"SavingRateConfigState": 1
});

var ListStore = assign({}, PrototypeStore, {
  getAllEnergySystem(){
    return{
        'AirConditioning':{label:I18N.Setting.Effect.AirConditioning,value:10},
        'Power':{label:I18N.Setting.Effect.Power,value:20},
        'Lighting':{label:I18N.Setting.Effect.Lighting,value:30},
        'Product':{label:I18N.Setting.Effect.Product,value:40},
        'AirCompressor':{label:I18N.Setting.Effect.AirCompressor,value:50},
        'Heating':{label:I18N.Setting.Effect.Heating,value:60},
        'Water':{label:I18N.Setting.Effect.Water,value:70},
        'Other':{label:I18N.Setting.Effect.Other,value:200},
      }
  },
  getEnergySystem(value){
    var energySys=Immutable.fromJS(this.getAllEnergySystem())
    return energySys.find(item=>(item.get('value')===value)).get('label')
  },
  setEffect(effect){
  _effect=Immutable.fromJS(effect);
  },
  getEffect(){
    return _effect
  },
  getRateBtnDisabled(energyEffects){
    return energyEffects.findIndex(item=>(item.get("ConfigedTagCount")!==0))===-1
  },
  setRateTagList(tags){
    _tags=Immutable.fromJS(tags);
  },
  getRateTagList(){
    return _tags
  },
  setDetail(detail){
    _detail=Immutable.fromJS(detail)
  },
  getDetail(){
    return _detail
  },
  deleteEffectItem(energyEffectItemId){
      var index=_effect.get('Drafts').findIndex(item=>(item.get("EnergyEffectItemId")===energyEffectItemId));
      _effect=_effect.deleteIn(["Drafts",index]);
  },
  changeEnergySystem(sysId,energyEffectId){
    var index=_effect.get('EnergyEffects').findIndex(item=>(item.get("EnergyEffectId")===energyEffectId));
    _effect=_effect.setIn(["EnergyEffects",index,"EnergySystem"],energyEffectId);
  },
  setDrafts(drafts){
    _drafts=Immutable.fromJS(drafts)
  },
  getDrafts(){
    return _drafts
  }

});

ListStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.GET_ENERGY_EFFECT:
        ListStore.setEffect(action.effect);
        ListStore.emitChange();
        break;
    case Action.GET_EFFECT_RATE_TAG:
        ListStore.setRateTagList(action.tags);
        ListStore.emitChange();
        break;
    case Action.GET_EFFECT_DETAIL:
        ListStore.setDetail(action.detail);
        ListStore.emitChange();
        break;
    case Action.DELETE_EFFECT_ITEM:
        ListStore.deleteEffectItem(action.energyEffectItemId);
        ListStore.emitChange();
        break;
    case Action.CHANGE_ENERGY_SYSTEM_FOR_EFFECT:
        ListStore.changeEnergySystem(action.sysId,action.energyEffectId);
        ListStore.emitChange();
        break;
    case Action.GET_DRAFTS_SUCCESS:
        ListStore.setDrafts(action.drafts);
        ListStore.emitChange();
        break;

    default:
      // do nothing
  }

});

module.exports = ListStore;
