
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action} from '../../constants/actionType/Measures.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

const MeasuresStore = assign({}, PrototypeStore, {
  getAllEnergySys(){
    return{
        'AirConditioning':{label:I18N.Setting.ECM.AirConditioning,value:1},
        'Boiler':{label:I18N.Setting.ECM.Boiler,value:2},
        'StrongElectricity':{label:I18N.Setting.ECM.StrongElectricity,value:3},
        'WeakElectricity':{label:I18N.Setting.ECM.WeakElectricity,value:4},
        'Drainage':{label:I18N.Setting.ECM.Drainage,value:5},
        'AirCompression':{label:I18N.Setting.ECM.AirCompression,value:6},
        'Other':{label:I18N.Setting.ECM.Other,value:20}
      }
  },
  getEnergySys(value){
    var energySys=Immutable.fromJS(this.getAllEnergySys())
    return energySys.find(item=>(item.get('value')===value)).get('label')
  },
  IsSolutionDisable(solution){
    return solution.Name===null || solution.ExpectedAnnualEnergySaving===null
              || solution.EnergySavingUnit===null || solution.ExpectedAnnualCostSaving===null || solution.Description===null
  }

});

MeasuresStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_KPI_GROUP_CONTINUOUS:
        break;
      default:
    }
  });

  export default MeasuresStore;
