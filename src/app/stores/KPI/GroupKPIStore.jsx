
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,KpiSettingsModel,SettingStatus,KpiType,DataStatus} from '../../constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {fill, remove, findIndex, flatten} from 'lodash/array';
import {sortBy, map, find,filter} from 'lodash/collection';
import { Map,List} from 'immutable';
import SingleKPIStore from './SingleKPIStore.jsx';
import UOMStore from 'stores/UOMStore.jsx';
import AllCommodityStore from 'stores/AllCommodityStore.jsx';

var _kpiInfo=null,
    _groupInfo=null,
    _buildings=null,
    _annualSum='-',
    _rawData=null,
    _info=null,
    _groupSettingsList = null,
    _groupKpis=null,
    _KpiSettings=Immutable.fromJS(KpiSettingsModel);

function emptyList() {
      return new List();
    }

let KPI_SUCCESS_EVENT = 'kpigroupsuccess',
      KPI_ERROR_EVENT = 'kpigrouperror';
const GroupKPIStore = assign({}, PrototypeStore, {

  init(info){
    if(_buildings!==null){
      _kpiInfo=Immutable.fromJS({
        ...info,
        Buildings:Array(_buildings.length)
      });
      let values=_KpiSettings.getIn(['AdvanceSettings','TargetMonthValues']).toJS();
      _buildings.forEach((building,index)=>{
        let defaultBuilding={
          HierarchyId:building.Id,
          HierarchyName:building.Name,
          TargetMonthValues:assign([],values),
          TagSavingRates:[],
          MonthPredictionValues:assign([],values),
        }
        _kpiInfo=_kpiInfo.setIn(["Buildings",index],Immutable.fromJS(defaultBuilding));
      })
    }
    else {
      _kpiInfo=Immutable.fromJS(info);
    }

    _info=null;
  },

  setKpiInfo(data){
    _rawData=Immutable.fromJS(data);
    let {CustomerId,UomId,CommodityId,IndicatorName,AdvanceSettings}=data.GroupKpiSetting;
    let {Year,IndicatorType,AnnualQuota,AnnualSavingRate}=AdvanceSettings;

    _kpiInfo=Immutable.fromJS({
      CustomerId,Year,IndicatorType,AnnualQuota,AnnualSavingRate,UomId,IndicatorName,CommodityId,
      Buildings:data.BuildingKpiSettingsList.length?
                data.BuildingKpiSettingsList.map(building=>{
                  let {HierarchyId,HierarchyName,ActualTagId,ActualTagName,AdvanceSettings}=building;
                  let {AnnualQuota,AnnualSavingRate,TargetMonthValues,PredictionSetting}=AdvanceSettings;
                  let {TagSavingRates,MonthPredictionValues}=PredictionSetting;
                  return{
                    HierarchyId,HierarchyName,ActualTagId,ActualTagName,AnnualQuota,AnnualSavingRate,
                    TargetMonthValues,TagSavingRates,MonthPredictionValues
                  }
                }):[]
    });
  },

  getKpiInfo(){
    return _kpiInfo;
  },

  setGroupByYear(data,info){
    _groupInfo=Immutable.fromJS(data);
    var thisYearKpiList=Immutable.fromJS(_groupSettingsList).filter(item=>(item.get('Year')===info.Year && item.get('GroupKpiItems').size>0)).first();
    if(thisYearKpiList){
      thisYearKpiList.getIn(['GroupKpiItems']).forEach(item=>{
        let index=_groupInfo.findIndex(kpi=>kpi.get('IndicatorName')===item.get('IndicatorName'));
        if(index>-1){
          _groupInfo=_groupInfo.delete(index)
        }
      })
    }
    _info=info;
    //this.init(info);
  },

  updateGroupSettingsList( data ) {
    let nextYear = new Date().getFullYear() + 1,
      convertedData = [];
    for( let i = nextYear; i > nextYear - 5; i--) {
      let currentDataIndex = findIndex(data, setting => setting.Year === i);
      if( currentDataIndex > -1 ) {
        data[currentDataIndex].add = true;
        convertedData.push(data[currentDataIndex]);
        remove( data, (setting, i) => {i === currentDataIndex} );
      } else {
        convertedData.push({
          Year: i,
          GroupKpiItems: [],
          add: true,
        })
      }
    }
    convertedData = convertedData.concat(data);
    _groupSettingsList = sortBy(convertedData, ['Year']);
  },
  getGroupSettingsList() {
    return _groupSettingsList;
  },
  findKPISettingByKPISettingId(kpiSettingsId) {
    if(!kpiSettingsId) {
      return {};
    }
    return find(flatten(map(this.getGroupSettingsList(), (yearIem) => {
      return yearIem.GroupKpiItems;
    })), item => item.KpiSettingsId === kpiSettingsId);
  },

  getGroupList(){
    let group=[]
    group=_groupInfo.map(info=>{
      return{
        payload:info.get("KpiId"),
        text:info.get("IndicatorName"),
      }
    });
    group=group.unshift({
      payload: -1,
      text: I18N.EM.Report.Select,
      disabled:true,
    });
    return group.toJS()
  },

  getGroupInfo(){
    return  _groupInfo
  },

  setBuildings(data,info){
    _buildings=data;
    _info=info;
    //this.init(info);
  },

  getTitleByStatus(status,year,name){
    switch (status) {
      case SettingStatus.New:
            return I18N.format(I18N.Setting.KPI.Group.New,year);
        break;
      case SettingStatus.Edit:
          return I18N.format(I18N.Setting.KPI.Group.Edit,year,name);
        break;
      case SettingStatus.Prolong:
          return I18N.format(I18N.Setting.KPI.Group.Prolong,year,name);
        break;
      default:

    }
  },

  clearParam(){
    let values=_KpiSettings.getIn(['AdvanceSettings','TargetMonthValues']).toJS();
    _kpiInfo=_kpiInfo.set('AnnualQuota',null);
    _kpiInfo=_kpiInfo.set('AnnualSavingRate',null);
    _kpiInfo.get('Buildings').forEach((building,index)=>{
      _kpiInfo=_kpiInfo.mergeIn(['Buildings',index],Map({
        AnnualQuota:null,
        AnnualSavingRate:null,
        TargetMonthValues:assign([],values),
        MonthPredictionValues:assign([],values)
      }))
    })
  },

  merge(data){
    let refresh=false;
    data.forEach(el=>{
      let {path,status,value}=el;
      let paths = path.split(".");
      refresh= path.indexOf('IndicatorType')>-1 || path.indexOf('ActualTagName')>-1;
      if(status===DataStatus.ADD){
        let {index,length}=el;
        var children = _kpiInfo.getIn(paths);
        if(length){
          if (!children) {
            children = emptyList();
            children=children.setSize(length);
          }
          if (Immutable.List.isList(children)) {
              value = children.setIn([index],value);
          }
        }
        else {
          if (!children) {
            children = emptyList();
          }
          if (Immutable.List.isList(children)) {
              value = children.push(value);
          }
        }

        _kpiInfo = _kpiInfo.setIn(paths, value);
      }
      else if(status===DataStatus.DELETE){
        _kpiInfo = _kpiInfo.deleteIn(paths);
      }
      else {
        _kpiInfo=_kpiInfo.setIn(paths,value);
      }
    })
    if(refresh){
      this.clearParam();
    }
  },

  mergeMonthValue(data){
    var values=data.map(item=>{
      return{Month:item,Value:null}
    });
    var setting={
      AdvanceSettings:{
        TargetMonthValues:assign([],values),
        PredictionSetting:{
          MonthPredictionValues:assign([],values)
        }
      }
    };
    _KpiSettings=_KpiSettings.mergeDeep(setting);
    this.init(_info);
  },

  IsActive(status,kpiInfo){
    switch (status) {
      case SettingStatus.New:
            var {CommodityId}=kpiInfo.toJS();
            return CommodityId?true:false;
        break;
      case SettingStatus.Edit:
          return true;
        break;
      case SettingStatus.Prolong:
           var {Buildings}=kpiInfo.toJS();
          return Buildings?true:false;
        break;
      default:

    }
  },

  getCommodityList(){
    return([
      {
        payload: -1,
        text: I18N.EM.Report.Select,
        disabled:true,
        uomId:-1
      },
      {
        payload: 1,
        text: I18N.Common.Commodity.ElectricOther,
        uomId:1
      },
      {
        payload: 2,
        text: I18N.Common.Commodity.Water,
        uomId:5
      },
      {
        payload: 3,
        text: I18N.Common.Commodity.Gas,
        uomId:1
      },
      {
        payload: 5,
        text: I18N.Common.Commodity.Petrol,
        uomId:8
      },
      {
        payload: 7,
        text: I18N.Common.Commodity.DieselOil,
        uomId:8
      },
      {
        payload: 11,
        text: I18N.Common.Commodity.Kerosene,
        uomId:8
      },
      {
        payload: 9,
        text: I18N.Common.Commodity.CoolQ,
        uomId:10
      },
      {
        payload: 8,
        text: I18N.Common.Commodity.HeatQ,
        uomId:10
      },
      {
        payload: 10,
        text: I18N.Common.Commodity.CoalOther,
        uomId:8
      },
    ])
  },

  getCurrentCommodityList(){
    if(_groupKpis===null) return [];
    var list=this.getCommodityList();//_groupKpis
    var result=filter(list,(item)=>_groupKpis.findIndex(kpi=>kpi.CommodityId===item.payload)===-1);
    return result
  },

  getUomByCommodityId(id){
    var list=Immutable.fromJS(this.getCommodityList());
    var index=list.findIndex(item=>item.get('payload')===id);
    return list.getIn([index,'uomId'])
  },

  getBuildingSum(calcSum){
    if(!calcSum){
      return _annualSum
    }
    else {
      _annualSum=0;
      _kpiInfo.get('Buildings').forEach(building=>{
        if(SingleKPIStore.validateQuota(building.get('AnnualQuota')) && _annualSum!=='-'){
          _annualSum=building.get('AnnualQuota')?_annualSum+parseFloat(building.get('AnnualQuota')):_annualSum;
        } else {
          _annualSum='-'
        }
      })
    }
    return _annualSum
  },

  validateKpiInfo(kpiInfo,
      quotaValidator = SingleKPIStore.validateQuota,
      savingRateValidator = SingleKPIStore.validateSavingRate){

    var validDate=true;

    var {IndicatorName,CommodityId,AnnualQuota,AnnualSavingRate,Buildings}=kpiInfo.toJS();

    if(!CommodityId || CommodityId===-1) return false;

    if(!IndicatorName || IndicatorName==='') return false;

    if(AnnualQuota && !quotaValidator(AnnualQuota)) return false;

    if(AnnualSavingRate && !savingRateValidator(AnnualSavingRate)) return false;

    Buildings.forEach(building=>{

      var {AnnualQuota,AnnualSavingRate}=building;

      if(AnnualQuota && !quotaValidator(AnnualQuota)) validDate=false;

      if(AnnualSavingRate && !savingRateValidator(AnnualSavingRate)) validDate=false;
    });

    // Buildings.filter(({AnnualQuota,AnnualSavingRate}) => {
    //   if(AnnualQuota && !SingleKPIStore.validateQuota(AnnualQuota)){
    //     return false;
    //   }
    // })

    // it("", () => {
    //   let buildings = [];
    //   let validator = spy().return(false);
    //   let validator1 = spy().return(false);
    //   validateKpiInfo(buildings,validator,validator)
    //
    // })

     return validDate
  },

  transit(){
    var result=_rawData;
    if(_rawData===null){
      result=Immutable.fromJS({
        GroupKpiSetting:_KpiSettings,
        BuildingKpiSettingsList:_.fill(Array(_buildings.length), assign({},KpiSettingsModel))
      })
    }
    let GroupKpiSetting=result.get('GroupKpiSetting');
    var {CustomerId,Year,IndicatorName,UomId,CommodityId,IndicatorType,AnnualQuota,AnnualSavingRate,Buildings}=_kpiInfo.toJS();
    //for GroupKpiSetting
    result=result.set('GroupKpiSetting',GroupKpiSetting.mergeDeep(
      {
        KpiType:KpiType.group,
        HierarchyId:CustomerId,
        CustomerId,IndicatorName,UomId,CommodityId,
        AdvanceSettings:{
          Year,IndicatorType,AnnualQuota,AnnualSavingRate
        }
        }
      )
    );
    //for BuildingKpiSettingsList
    Buildings.forEach((building,index)=>{
      var kpi=result.getIn(['BuildingKpiSettingsList',index]);
      var {HierarchyId,HierarchyName,ActualTagId,ActualTagName,AnnualQuota,AnnualSavingRate,TargetMonthValues,
        TagSavingRates,MonthPredictionValues}=building;
      var setting={
        KpiType:KpiType.single,
        HierarchyId,HierarchyName,ActualTagId,ActualTagName,
        AdvanceSettings:{
          IndicatorType,AnnualQuota,AnnualSavingRate,
          TargetMonthValues,
          PredictionSetting:{
            TagSavingRates,MonthPredictionValues
          }
        }
      };
      result=result.setIn(['BuildingKpiSettingsList',index],kpi.mergeDeep(setting));
    });

    return result.toJS();

  },

  setGroupKpis(data){
    _groupKpis=data;
  },

    dispose(){
      _kpiInfo=null;
      _groupInfo=null;
      _buildings=null;
      _annualSum='-';
      _rawData=null;
    },
    emitSuccessChange: function() {
      this.emit(KPI_SUCCESS_EVENT);
    },
    addSuccessListener: function(callback) {
      this.on(KPI_SUCCESS_EVENT, callback);
    },

    removeSuccessListener: function(callback) {
      this.removeListener(KPI_SUCCESS_EVENT, callback);
      this.dispose();
    },
    emitErrorChange: function(args) {
      this.emit(KPI_ERROR_EVENT,args);
    },
    addErrorListener: function(callback) {
      this.on(KPI_ERROR_EVENT, callback);
    },

    removeErrorListener: function(callback) {
      this.removeListener(KPI_ERROR_EVENT, callback);
      this.dispose();
    },
});

GroupKPIStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_KPI_GROUP_CONTINUOUS:
          GroupKPIStore.setKpiInfo(action.data);
          GroupKPIStore.emitChange();
        break;
    case Action.GET_KPI_GROUP_BY_YEAR:
          GroupKPIStore.setGroupByYear(action.data,action.info);
          //GroupKPIStore.emitChange();
          break;
    case Action.GET_KPI_BUILDING_LIST_BY_CUSTOMER_ID:
        GroupKPIStore.setBuildings(action.data,action.info);
        //GroupKPIStore.emitChange();
        break;
    case Action.GET_GROUP_KPIS:
        GroupKPIStore.setGroupKpis(action.data);
        break;
    case Action.GET_KPI_GROUP_SETTINGS:
        GroupKPIStore.setKpiInfo(action.data);
        GroupKPIStore.emitChange();
        break;
    case Action.MERGE_KPI_GROUP_INFO:
         GroupKPIStore.merge(action.data);
         GroupKPIStore.emitChange();
          break;
    case Action.KPI_GROUP_SUCCESS:
         GroupKPIStore.emitSuccessChange(action.year);
         break;
    case Action.KPI_GROUP_ERROR:
        GroupKPIStore.emitErrorChange({
          title: action.title,
            content: action.content
        });
        break;
    case Action.GROUP_SETTINGS_LIST:
      GroupKPIStore.updateGroupSettingsList(action.data);
      GroupKPIStore.emitChange();
      break;

    case Action.GET_QUOTAPERIOD_BY_YEAR:
  	GroupKPIStore.mergeMonthValue(action.data);
      GroupKPIStore.emitChange();
      break;

      default:
    }
  });

  export default GroupKPIStore;