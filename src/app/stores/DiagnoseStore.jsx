
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action,EnergyLabel} from '../constants/actionType/Diagnose.jsx';
import Hierarchy from '../constants/actionType/hierarchySetting/Hierarchy.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

var HierarchyAction=Hierarchy.Action;

var _diagnoseList=null,
    _diagnoseStatic=null,
    _currentDiagnose=null,
    _tagsList=null,
    _chartData=null,
    _chartDataLoading=false,
    _calendar=null;

const DiagnoseStore = assign({}, PrototypeStore, {
  setDiagnoseList(data){
    _diagnoseList=Immutable.fromJS(data);
  },
  getDiagnosisList(){
    return _diagnoseList;
  },
  setDiagnoseStatic(data){
    _diagnoseStatic=data
  },
  getDiagnoseStatic(){
    return _diagnoseStatic
  },
  setDiagnose(data){
    _currentDiagnose=data
  },
  getDiagnose(){
    return _currentDiagnose
  },
  setTagsList(data){
    _tagsList=Immutable.fromJS(data);
  },
  getTagsList(){
    return _tagsList;
  },
  setLoading(data){
    _chartDataLoading = data;
  },
  isLoading() {
    return _chartDataLoading;
  },
  setChartData(data){
    _chartData=Immutable.fromJS(data);
  },
  getChartData(){
    return _chartData;
  },
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
        {value:I18N.Setting.Diagnose.TransformerLoadRate,Id:EnergyLabel.TransformerLoadRate},
        {value:I18N.Setting.Diagnose.Demand,Id:EnergyLabel.Demand},
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
        {value:I18N.Setting.Diagnose.CoolingTower,Id:EnergyLabel.CoolingTower},
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
  },
  getContentText(isFromProbem,selectedNode){
    if(_diagnoseList===null) return null
    var hasProblem=false;
    _diagnoseList.forEach(item=>{
      if(item.get('Children').findIndex(child=>child.get('ChildrenCount')!==0)>-1) hasProblem=true
    })
    if(hasProblem===false){
      return isFromProbem?I18N.Setting.Diagnose.HasNoProblem:I18N.Setting.Diagnose.HasNoList
    }
    else {
      if(selectedNode===null){
        return isFromProbem?I18N.Setting.Diagnose.SelectProblemTip:I18N.Setting.Diagnose.SelectListTip
      }
    }
    return ''
  },
  setCalendar(calendar){
    _calendar=calendar;
  },
  hasCalendar(){
    if(_calendar===null) return null
    return !(_calendar.CalendarItemGroups[0].CalendarItems===null)
  }


})

DiagnoseStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_DIAGNOSIS_LIST:
        DiagnoseStore.setDiagnoseList(action.data);
        DiagnoseStore.emitChange()
        break;
    case Action.GET_DIAGNOSIS_STATIC:
        DiagnoseStore.setDiagnoseStatic(action.data);
        DiagnoseStore.emitChange()
        break;
    case Action.GET_DIAGNOSIS_BY_ID:
          DiagnoseStore.setDiagnose(action.data);
          DiagnoseStore.emitChange()
          break;
    case Action.GET_TAGS_LIST:
          DiagnoseStore.setTagsList(action.data);
          DiagnoseStore.emitChange()
          break;
    case Action.GET_CHART_DATA:
          DiagnoseStore.setLoading(false);
          DiagnoseStore.setChartData(action.data);
          DiagnoseStore.emitChange()
          break;
    case HierarchyAction.GET_CALENDAR_FOR_HIERARCHY:
          DiagnoseStore.setCalendar(action.calendar);
          DiagnoseStore.emitChange()
          break;
    case Action.GET_CHART_DATAING:
          DiagnoseStore.setLoading(true);
          DiagnoseStore.emitChange()
          break;
    case Action.CLEAR_CREATE_DATA:
          DiagnoseStore.setChartData(null);
          DiagnoseStore.setTagsList(null);
          DiagnoseStore.emitChange()
          break;
  }
})

export default DiagnoseStore;
