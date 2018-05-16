
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action,EnergyLabel} from '../constants/actionType/Diagnose.jsx';
import Hierarchy from '../constants/actionType/hierarchySetting/Hierarchy.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

const CREATE_DIAGNOSE_EVENT = 'create_diagnose_event',
      UPDATE_DIAGNOSE_EVENT='update_diagnose_event',
      REMOVE_DIAGNOSE_EVENT='remove_diagnose_event',
      GET_CONSULTANT_EVENT='get_consultant_event',
      GET_ASSOCIATE_TAG_EVENT='get_associate_tags_event';

var HierarchyAction=Hierarchy.Action;

var _diagnoseList=null,
    _diagnoseStatic=null,
    _currentDiagnose=null,
    _tagsList=null,
    _tagsAssociateList=null,
    _chartData=null,
    _chartDataLoading=false,
    _calendar=null,
    _diagnoseChartData=null,
    _previewChartData=null,
    _consultant=null;

const DiagnoseStore = assign({}, PrototypeStore, {
  initList(){
    //add itemid for per label
    _diagnoseList=_diagnoseList.map(item=>{
      if(item.get('Children')){
        let children=item.get("Children").map(child=>(child.set('ItemId',item.get('Id'))));
        return item.set('Children',children)
      }
      else {
        return item
      }
    })
  },
  setDiagnoseList(data){
    _diagnoseList=Immutable.fromJS(data);
    this.initList();
  },
  getDiagnosisList(){
    return _diagnoseList;
  },
  setDiagnoseStatic(data){
    _diagnoseStatic={1:data[2],2:data[4]}
  },
  getDiagnoseStatic(){
    return _diagnoseStatic
  },
  setDiagnose(data){
    _currentDiagnose=Immutable.fromJS(data)
  },
  getDiagnose(){
    return _currentDiagnose
  },
  setTagsList(data){
    _tagsList= data && Immutable.fromJS(data).map(tag => tag.set('DiagnoseName', tag.get('Name')));
  },
  getTagsList(){
    return _tagsList;
  },
  setTagsAssociateList(data){
    _tagsAssociateList= data && Immutable.fromJS(data);
  },
  getTagsAssociateList(){
    return _tagsAssociateList;
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
        {value:I18N.Setting.Diagnose.TransformerLoadRate,Id:EnergyLabel.TransformerLoadRate},
        {value:I18N.Setting.Diagnose.Demand,Id:EnergyLabel.Demand},
        {value:I18N.Setting.Diagnose.DomesticWater,Id:EnergyLabel.DomesticWater},
        {value:I18N.Setting.Diagnose.KitchenFumeExhaust,Id:EnergyLabel.KitchenFumeExhaust},
        {value:I18N.Setting.Diagnose.AirCompressorLoadingRate,Id:EnergyLabel.AirCompressorLoadingRate},
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
    return _calendar
  },
  setDiagnoseChartData(data){
    _diagnoseChartData=Immutable.fromJS(data)
  },
  getDiagnoseChartData(){
    return _diagnoseChartData
  },
  clearDiagnoseChartData(){
    _diagnoseChartData=null
  },
  setPreviewChartData(data){
    _previewChartData=Immutable.fromJS(data)
  },
  getPreviewChartData(){
    return _previewChartData
  },
  setConsultant(data){
    _consultant = data;
  },
  getConsultant(){
    return _consultant;
  },
  findProblemById(id){
    if(_diagnoseList===null) return null
    var temp=null;
    _diagnoseList.forEach(diagnose=>{
      diagnose.get('Children').forEach(child=>{
        if(child.get('Children') && temp===null) {
          if( child.get('Children').find(item=>(item.get('Id')===id)) ) {
            temp = diagnose;
          }
        }
      })

    })
    return temp || Immutable.fromJS({});
  },
  findLabelById(id){
    if(_diagnoseList===null) return null
    var temp=null;
    _diagnoseList.forEach( diagnose =>{
      diagnose.get('Children').forEach(child=>{
        if(child.get('Children') && temp===null) {
          if( child.get('Children').find(item=>(item.get('Id')===id)) ) {
            temp = child;
          }
        }
      })

    })
    return temp || Immutable.fromJS({});
  },
  findDiagnoseById(id){
    if(_diagnoseList===null) return null
    var temp=null;
    _diagnoseList.forEach(diagnose=>{
      diagnose.get('Children').forEach(child=>{
        if(child.get('Children') && temp===null) {
          temp=child.get('Children').find(item=>(item.get('Id')===id)) || null
        }
      })

    })
    return temp
  },
  findItemById(itemId){
    if(_diagnoseList===null) return null
    var item=null;
    _diagnoseList.forEach(diagnose=>{
      if(diagnose.get('Id')===itemId) item=diagnose
    })
    return item
    },
  getNextId(diagnoseId){
    var id=null;
    _diagnoseList.forEach(diagnose=>{
      diagnose.get('Children').forEach(child=>{
        if(child.get('Children') && id===null) {
          var index=child.get('Children').findIndex(item=>(item.get('Id')===diagnoseId));
          if(index>-1){
            if(index===0) id=null
              else if(index===child.get('Children').size-1) id=child.getIn(['Children',child.get('Children').size-2,'Id'])
              else id=child.getIn(['Children',index+1,'Id'])
          }
        }
      })
    })
    return id
  },
  mergeDiagnose(paths,value){
    let immuVal = Immutable.fromJS(value);
    if(paths instanceof Array) {
      _currentDiagnose = _currentDiagnose.setIn(paths, immuVal);
    } else {
      _currentDiagnose = _currentDiagnose.set(paths, immuVal);
    }
  },
  emitCreatedDiagnose: function(isClose, data) {
    this.emit(CREATE_DIAGNOSE_EVENT, isClose, data);
  },
  addCreatedDiagnoseListener: function(callback) {
    this.on(CREATE_DIAGNOSE_EVENT, callback);
  },
  removeCreatedDiagnoseListener: function(callback) {
    this.removeListener(CREATE_DIAGNOSE_EVENT, callback);
    this.dispose();
  },
  emitUpdateDiagnose: function(args) {
    this.emit(UPDATE_DIAGNOSE_EVENT, args);
  },
  addUpdateDiagnoseListener: function(callback) {
    this.on(UPDATE_DIAGNOSE_EVENT, callback);
  },
  removeUpdateDiagnoseListener: function(callback) {
    this.removeListener(UPDATE_DIAGNOSE_EVENT, callback);
    this.dispose();
  },
  emitRemoveDiagnose: function(args) {
    this.emit(REMOVE_DIAGNOSE_EVENT, args);
  },
  addRemoveDiagnoseListener: function(callback) {
    this.on(REMOVE_DIAGNOSE_EVENT, callback);
  },
  removeRemoveDiagnoseListener: function(callback) {
    this.removeListener(REMOVE_DIAGNOSE_EVENT, callback);
    this.dispose();
  },
  emitConsultantChange: function(args) {
    this.emit(GET_CONSULTANT_EVENT, args);
  },
  addConsultantListener: function(callback) {
    this.on(GET_CONSULTANT_EVENT, callback);
  },
  removeConsultantListener: function(callback) {
    this.removeListener(GET_CONSULTANT_EVENT, callback);
    this.dispose();
  },
  emitAssociateTagChange: function(args) {
    this.emit(GET_ASSOCIATE_TAG_EVENT, args);
  },
  addAssociateTagListener: function(callback) {
    this.on(GET_ASSOCIATE_TAG_EVENT, callback);
  },
  removeAssociateTagListener: function(callback) {
    this.removeListener(GET_ASSOCIATE_TAG_EVENT, callback);
    this.dispose();
  },
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
    case Action.GET_ASSOCIATE_TAG_LIST:
          DiagnoseStore.setTagsAssociateList(action.data);
          DiagnoseStore.emitAssociateTagChange()
          break;
    case Action.GET_CHART_DATA:
          DiagnoseStore.setLoading(false);
          DiagnoseStore.setChartData(action.data);
          DiagnoseStore.emitChange()
          break;
    case Action.GET_CONFIG_CALENDAR:
          DiagnoseStore.setCalendar(action.data);
          DiagnoseStore.emitChange()
          break;
    case Action.GET_CHART_DATAING:
          DiagnoseStore.setLoading(true);
          DiagnoseStore.emitChange()
          break;
    case Action.GET_DIAGNOSE_CHART_DATA_SUCCESS:
          DiagnoseStore.setDiagnoseChartData(action.data);
          DiagnoseStore.emitChange()
          break;
    case Action.GET_PREVIEW_CHART_DATA:
          DiagnoseStore.setPreviewChartData(action.data);
          DiagnoseStore.emitChange()
          break;
    case Action.CLEAR_CREATE_DATA:
          DiagnoseStore.setChartData(null);
          DiagnoseStore.setTagsList(null);
          DiagnoseStore.emitChange()
          break;
    case Action.CREATE_DIAGNOSE:
          DiagnoseStore.emitCreatedDiagnose(action.isClose, action.data)
          break;
    case Action.UPDATE_DIAGNOSE_SUCCESS:
          DiagnoseStore.emitUpdateDiagnose(true)
         break;
    case Action.UPDATE_DIAGNOSE_ERROR:
          DiagnoseStore.emitUpdateDiagnose(false)
         break;
    case Action.REMOVE_DIAGNOSE_SUCCESS:
          DiagnoseStore.emitRemoveDiagnose(DiagnoseStore.getNextId(action.data))
         break;
    case Action.MERGE_DIAGNOSE_SUCCESS:
          DiagnoseStore.mergeDiagnose(action.paths,action.value);
          DiagnoseStore.emitChange()
          break;
    case Action.CLEAR_DIAGNOSE_CHART_DATA:
          DiagnoseStore.clearDiagnoseChartData()
          break;
    case Action.GET_CONSULTANT:
          DiagnoseStore.setConsultant(action.data);
          DiagnoseStore.emitConsultantChange();
          break;
    case Action.CLEAR_ALL_LIST:
          _diagnoseList=null;
          break;
  }
})

export default DiagnoseStore;
