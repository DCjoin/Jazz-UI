import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import AjaxConstants from 'constants/AjaxConstants.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
// import events from 'events';
import assign from 'object-assign';
import { Action } from 'constants/actionType/Effect.jsx';

var _effect=null,_tags=null,_detail=null,_drafts=null,_detailChart=null;


var ListStore = assign({}, PrototypeStore, {
  getAllEnergySystem(){
    return{
        'AirConditioning':{label:I18N.Setting.Effect.AirConditioning,value:10,icon:'icon-air-conditioner'},
        'Power':{label:I18N.Setting.Effect.Power,value:20,icon:'icon-power1'},
        'Lighting':{label:I18N.Setting.Effect.Lighting,value:30,icon:'icon-illumination'},
        'Product':{label:I18N.Setting.Effect.Product,value:40,icon:'icon-machine'},
        'AirCompressor':{label:I18N.Setting.Effect.AirCompressor,value:50,icon:'icon-air-compression'},
        'Heating':{label:I18N.Setting.Effect.Heating,value:60,icon:'icon-heating'},
        'Water':{label:I18N.Setting.Effect.Water,value:70,icon:'icon-water-supply-and-drainage'},
        'Other':{label:I18N.Setting.Effect.Other,value:200,icon:'icon-others'},
      }
  },
  getEnergySystem(value){
    var energySys=Immutable.fromJS(this.getAllEnergySystem())
    return energySys.find(item=>(item.get('value')===value)).get('label')
  },
  getEnergySystemIcon(value){
    var energySys=Immutable.fromJS(this.getAllEnergySystem())
    return energySys.find(item=>(item.get('value')===value)).get('icon')
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
  deleteEffectItem(Id){
      var index=_drafts.findIndex(item=>(item.get("Id")===Id));
      _drafts=_drafts.delete(index);
  },
  changeEnergySystem(sysId,energyEffectId){
    var index=_effect.get('EnergyEffects').findIndex(item=>(item.get("EnergyEffectId")===energyEffectId));
    _effect=_effect.setIn(["EnergyEffects",index,"EnergySystem"],sysId);
  },
  setDrafts(drafts){
    _drafts=Immutable.fromJS(drafts)
  },
  getDrafts(){
    return _drafts
  },
  setDetailChart(data){
    _detailChart=data
  },
  getDetailChart(){
    return _detailChart
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
    case Action.GET_DETAIL_CHART:
        ListStore.setDetailChart(action.data);
        ListStore.emitChange();
        break;
    default:
      // do nothing
  }

});

module.exports = ListStore;
