import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import AjaxConstants from 'constants/AjaxConstants.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
// import events from 'events';
import assign from 'object-assign';

let {AjaxActionType} = AjaxConstants;

var ListStore = assign({}, PrototypeStore, {
  getAllEnergySystem(){
    return{
        'AirConditioning':{label:I18N.Setting.Effect.AirConditioning,value:1},
        'Power':{label:I18N.Setting.Effect.Power,value:2},
        'Lighting':{label:I18N.Setting.Effect.Lighting,value:3},
        'Product':{label:I18N.Setting.Effect.Product,value:4},
        'AirCompressor':{label:I18N.Setting.Effect.AirCompressor,value:5},
        'Heating':{label:I18N.Setting.Effect.Heating,value:6},
        'Water':{label:I18N.Setting.Effect.Water,value:7},
        'Other':{label:I18N.Setting.Effect.Other,value:8},
      }
  },
  getEnergySystem(value){
    var energySys=Immutable.fromJS(this.getAllEnergySystem())
    return energySys.find(item=>(item.get('value')===value)).get('label')
  },

});

ListStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case AjaxActionType.AJAX_END_ERROR:
        AjaxStore.emitError(action.httpStatusCode);
        break;
    default:
      // do nothing
  }

});

module.exports = ListStore;
