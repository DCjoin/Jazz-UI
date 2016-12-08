
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,KpiSettingsModel,SettingStatus,KpiType,DataStatus} from '../../constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import _ from 'lodash';
import { Map,List} from 'immutable';

var _kpiInfo=null,
    _groupInfo=null,
    _buildings=null;

function emptyMap() {
      return new Map();
    }

function emptyList() {
      return new List();
    }

const GroupKPIStore = assign({}, PrototypeStore, {

  init(info){
    if(_buildings){
      _kpiInfo=Immutable.fromJS({
        ...info,
        Buildings:Array(_buildings.length)
      });
      _buildings.forEach((building,index)=>{
        let defaultBuilding={
          HierarchyId:building.Id,
          HierarchyName:building.Name,
          TargetMonthValues:_.fill(Array(12), {Month:null,value:null}),
          TagSavingRates:[],
          MonthPredictionValues:_.fill(Array(12), {Month:null,value:null})
        }
        // _kpiInfo=_kpiInfo.setIn(["buildings",index,'KpiType'],KpiType.single);
        _kpiInfo=_kpiInfo.setIn(["Buildings",index],Immutable.fromJS(defaultBuilding));
        // _kpiInfo=_kpiInfo.setIn(["BuildingKpiSettingsList",index,'AdvanceSettings','IndicatorType'],indicatorType);
      })
    }
    else {
      _kpiInfo=Immutable.fromJS(info);
    }


    // _kpiInfo=_kpiInfo.set('GroupKpiSetting',Immutable.fromJS(KpiSettingsModel));
    // _kpiInfo=_kpiInfo.set('BuildingKpiSettingsList',Immutable.fromJS(_.fill(Array(_buildings.length), KpiSettingsModel)));
    // _kpiInfo=_kpiInfo.setIn(['GroupKpiSetting','KpiType'],KpiType.group);
    // _kpiInfo=_kpiInfo.setIn(['GroupKpiSetting','CustomerId'],customerId);
    // _kpiInfo=_kpiInfo.setIn(['GroupKpiSetting','HierarchyId'],customerId);
    // _kpiInfo=_kpiInfo.setIn(['GroupKpiSetting','AdvanceSettings','Year'],year);
    // _kpiInfo=_kpiInfo.setIn(['GroupKpiSetting','AdvanceSettings','IndicatorType'],indicatorType);


  },

  setKpiInfo(data){
    let {CustomerId,CommodityId,IndicatorName,AdvanceSettings}=data.GroupKpiSetting;
    let {Year,IndicatorType,AnnualQuota,AnnualSavingRate}=AdvanceSettings;

    _kpiInfo=Immutable.fromJS({
      CustomerId,Year,IndicatorType,AnnualQuota,AnnualSavingRate,
      Buildings:data.BuildingKpiSettingsList.length?
                data.BuildingKpiSettingsList.map(building=>{
                  let {HierarchyId,HierarchyName,ActualTagId,ActualTagName,AdvanceSettings}=building;
                  let {AnnualQuota,AnnualSavingRate,TargetMonthValues,PredictionSetting}=AdvanceSettings;
                  let {TagSavingRates,MonthPredictionValues}=PredictionSetting;
                  return{
                    CommodityId,IndicatorName,
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
    this.init(info);
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
    this.init(info);
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

  getCommodityList(){
    return([
      {
        payload: -1,
        text: I18N.EM.Report.Select,
        disabled:true,
        commodityId:-1
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
        text: I18N.Common.Commodity.Kerosene ,
        uomId:8
      },
      {
        payload: 9,
        text: I18N.Common.Commodity.CoolQ,
        uomId:10
      },
      {
        payload: 9,
        text: I18N.Common.Commodity.HeatQ,
        uomId:10
      },
      {
        payload: 10,
        text: I18N.Common.Commodity.CoalOther,
        uomId:8
      },
    ])
  }
});

GroupKPIStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_KPI_GROUP_CONTINUOUS:
      GroupKPIStore.setKpiInfo(action.data);
      GroupKPIStore.emitChange();
      break;
    case Action.GET_KPI_GROUP_BY_YEAR:
      GroupKPIStore.setGroupByYear(action.data,action.info);
      GroupKPIStore.emitChange();
      break;
    case Action.GET_KPI_BUILDING_LIST_BY_CUSTOMER_ID:
        GroupKPIStore.setBuildings(action.data,action.info);
        GroupKPIStore.emitChange();
        break;
    case Action.GET_KPI_GROUP_SETTINGS:
        GroupKPIStore.setKpiInfo(action.data);
        GroupKPIStore.emitChange();
        break;
    case Action.MERGE_KPI_GROUP_INFO:
         GroupKPIStore.merge(action.data);
         GroupKPIStore.emitChange();
          break;
      default:
    }
  });

  export default GroupKPIStore;
