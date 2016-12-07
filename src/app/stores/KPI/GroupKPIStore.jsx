
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

var _kpiInfo=null,
    _groupInfo=null;

const GroupKPIStore = assign({}, PrototypeStore, {
  setGroupContinuous(data){
    _kpiInfo=Immutable.fromJS(data);
  },

  getKpiInfo(){
    return _kpiInfo;
  },

  setGroupByYear(data){
    _groupInfo=Immutable.fromJS(data)
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
      text: I18N.Setting.KPI.Group.Prolongkpi,
      disabled:true,
    });
    return group
  },

  getGroupInfo(){
    return  _groupInfo
  },

  getCommodityList(){
    return([
      {
        payload: -1,
        text: I18N.Setting.KPI.Group.Commodity,
        disabled:true,
        commodityId:-1
      },
      {
        payload: 1,
        text: I18N.Common.Commodity.ElectricOther,
        commodityId:1
      },
      {
        payload: 2,
        text: I18N.Common.Commodity.Water,
        commodityId:5
      },
      {
        payload: 3,
        text: I18N.Common.Commodity.Gas,
        commodityId:1
      },
      {
        payload: 5,
        text: I18N.Common.Commodity.Petrol,
        commodityId:8
      },
      {
        payload: 7,
        text: I18N.Common.Commodity.DieselOil,
        commodityId:8
      },
      {
        payload: 11,
        text: I18N.Common.Commodity.Kerosene ,
        commodityId:8
      },
      {
        payload: i,
        text: I18N.Common.Commodity.Steam = '蒸汽',
        commodityId:1
      },
      {
        payload: 9,
        text: I18N.Common.Commodity.CoolQ = '冷量',
        commodityId:1
      },
      {
        payload: 9,
        text: I18N.Common.Commodity.HeatQ = '热量',
        commodityId:1
      },
      {
        payload: 10,
        text: I18N.Common.Commodity.CoalOther,
        commodityId:8
      },
    ])
  }
});

GroupKPIStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_KPI_GROUP_CONTINUOUS:
      GroupKPIStore.setGroupContinuous(action.data);
      GroupKPIStore.emitChange();
      break;
    case Action.GET_KPI_GROUP_BY_YEAR:
      GroupKPIStore.setGroupByYear(action.data);
      GroupKPIStore.emitChange();
      break;
      default:
    }
  });

  export default GroupKPIStore;
