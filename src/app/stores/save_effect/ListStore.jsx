import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import AjaxConstants from 'constants/AjaxConstants.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
// import events from 'events';
import assign from 'object-assign';
import { Action } from 'constants/actionType/Effect.jsx';

var _effect=null,_tags=null;

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
    default:
      // do nothing
  }

});

module.exports = ListStore;
