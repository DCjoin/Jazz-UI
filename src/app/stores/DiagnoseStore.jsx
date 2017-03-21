
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action,EnergyLabel} from '../constants/actionType/Diagnose.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

const DiagnoseStore = assign({}, PrototypeStore, {
  getAllLabel(){
    return Immutable.fromJS({
      LightingPower:[
        {value:I18N.Setting.Diagnose.OfficeLighting,Id:EnergyLabel.OfficeLighting},
        {value:I18N.Setting.Diagnose.CommerceLighting,Id:EnergyLabel.CommerceLighting},
        {value:I18N.Setting.Diagnose.Floodlight,Id:EnergyLabel.Floodlight},
        {value:I18N.Setting.Diagnose.UndergroundLighting,Id:EnergyLabel.UndergroundLighting},
        {value:I18N.Setting.Diagnose.Elevator,Id:EnergyLabel.Elevator},
        {value:I18N.Setting.Diagnose.Escalator,Id:EnergyLabel.Escalator},
        {value:I18N.Setting.Diagnose.ParkingFan,Id:EnergyLabel.ParkingFan},
        {value:I18N.Setting.Diagnose.ElectricTracing,Id:EnergyLabel.ElectricTracing},
        {value:I18N.Setting.Diagnose.TransformerPowerFactor,Id:EnergyLabel.TransformerPowerFactor},
        {value:I18N.Setting.Diagnose.DomesticWater,Id:EnergyLabel.DomesticWater},
      ],
      HVAC:[
        {value:I18N.Setting.Diagnose.WaterChillingUnit,Id:EnergyLabel.WaterChillingUnit},
        {value:I18N.Setting.Diagnose.WaterChillingUnitCOP,Id:EnergyLabel.WaterChillingUnitCOP},
        {value:I18N.Setting.Diagnose.FreshAirUnit,Id:EnergyLabel.FreshAirUnit},
        {value:I18N.Setting.Diagnose.AirConditioningFreshAir,Id:EnergyLabel.AirConditioningFreshAir},
        {value:I18N.Setting.Diagnose.FreshAirValve,Id:EnergyLabel.FreshAirValve},
        {value:I18N.Setting.Diagnose.AirConditioningUnit,Id:EnergyLabel.AirConditioningUnit},
        {value:I18N.Setting.Diagnose.ChilledWaterTemperature,Id:EnergyLabel.ChilledWaterTemperature},
        {value:I18N.Setting.Diagnose.ChilledWaterTemperatureDifference,Id:EnergyLabel.ChilledWaterTemperatureDifference},
        {value:I18N.Setting.Diagnose.CoolingWaterTemperature,Id:EnergyLabel.CoolingWaterTemperature},
        {value:I18N.Setting.Diagnose.CoolingRange,Id:EnergyLabel.CoolingRange},
        {value:I18N.Setting.Diagnose.ChilledWaterPump,Id:EnergyLabel.ChilledWaterPump},
        {value:I18N.Setting.Diagnose.CoolingPump,Id:EnergyLabel.CoolingPump},
      ],
      EnvironmentalParameters:[
        {value:I18N.Setting.Diagnose.IndoorCO2,Id:EnergyLabel.IndoorCO2},
        {value:I18N.Setting.Diagnose.IndoorCO,Id:EnergyLabel.IndoorCO},
        {value:I18N.Setting.Diagnose.IndoorTemperature,Id:EnergyLabel.IndoorTemperature},
        {value:I18N.Setting.Diagnose.DistrictTemperature,Id:EnergyLabel.DistrictTemperature},
        {value:I18N.Setting.Diagnose.OutdoorTemperature,Id:EnergyLabel.OutdoorTemperature},
        {value:I18N.Setting.Diagnose.IndoorAndOutdoorTemperatureDifference,Id:EnergyLabel.IndoorAndOutdoorTemperatureDifference}
      ]
    })
  },
  getLabelList(label){
    return this.getAllLabel().get(label)
  },
  getLabelById(id){
    var label=I18N.Common.CaculationType.Non;
    this.getAllLabel().forEach(item=>{
      let labelItem=item.find(el=>el.get('Id')===id);
      if(labelItem && labelItem.size!==0){
        label=labelItem.get('value')
      }
    })
    return label
  }


})

DiagnoseStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_ENERGY_SOLUTION_SUCCESS:
        DiagnoseStore.setSolutionList(action.data,action.status);
        DiagnoseStore.emitChange()
        break;
      }
    })

export default DiagnoseStore;
