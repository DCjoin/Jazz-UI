
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
import moment from 'moment';
import { Map } from 'immutable';
import assign from 'object-assign';
import {Type} from '../../constants/actionType/KPI.jsx';

function emptyMap() {
  return new Map();
}

let kpiInfo=emptyMap();
let _quotaperiod=null,
    _quotaperiodYear=null;

const KPIStore = assign({}, PrototypeStore, {
  setKpiInfo(data){
    kpiInfo=Immutable.fromJS(data);
  },

  getKpiInfo(){
    return kpiInfo;
  },

  setQuotaperiod(data) {
    _quotaperiod = data;
  },

  getQuotaperiod(){
    return _quotaperiod;
  },

  setYearQuotaperiod(data) {
    _quotaperiodYear = data.map(el=>{
      return moment(el)
    });
  },

  getYearQuotaperiod(){
    return _quotaperiodYear;
  },

  clearParam(){
    if(!kpiInfo.get('AdvanceSettings')) return;
    let {Year,IndicatorType}=kpiInfo.get('AdvanceSettings').toJS();
    kpiInfo=kpiInfo.set('AdvanceSettings',emptyMap());
    kpiInfo=kpiInfo.setIn(['AdvanceSettings','Year'],Year);
    kpiInfo=kpiInfo.setIn(['AdvanceSettings','IndicatorType'],IndicatorType);
  },

  merge(data){
    let refresh=false;
    data.forEach(el=>{
      let paths = el.path.split(".");
      refresh= el.path.indexOf('IndicatorType')>-1 || el.path.indexOf('ActualTagName')>-1;
      kpiInfo=kpiInfo.setIn(paths,el.value);
    })
    if(refresh){
      this.clearParam();
    }
  },

  _getYearList(){
    let currentYear=(new Date()).getFullYear(),yearList=[];
    for(var i=currentYear+1;i>=currentYear-3;i--){
      yearList.push({
        payload: i,
        text: i
      })
    }
    return yearList
  },

  validateQuota(value){
    let temp=parseFloat(value);
    if(temp<0 || temp>100 || value.indexOf('.')>-1) return I18N.Setting.KPI.Parameter.QuotaErrorText;
    return ''
  },

  validateSavingRate(value){
    let temp=parseFloat(value),
        index=value.indexOf('.');
    if(temp<-100 || temp>100) return I18N.Setting.KPI.Parameter.QuotaErrorText;
    if(index>-1 && value.length-index>2) return I18N.Setting.KPI.Parameter.QuotaErrorText;
    return ''
  },

  dispose(){
    kpiInfo=Immutable.fromJS({});
    _quotaperiod=null;
  }

});

KPIStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_QUOTAPERIOD:
      KPIStore.setQuotaperiod(action.data);
      KPIStore.emitChange();
      break;
    case Action.GET_KPI_INFO_SUCCESS:
         KPIStore.setKpiInfo(action.data);
         KPIStore.emitChange();
         break;
    case Action.MERGE_KPI_INFO:
         KPIStore.merge(action.data);
         KPIStore.emitChange();
         break;
    case Action.GET_QUOTAPERIOD_BY_YEAR:
         KPIStore.setYearQuotaperiod(action.data);
         KPIStore.emitChange();
         break;
    case Action.GET_CALC_VALUE:
        KPIStore.merge([{
          path:'AdvanceSettings.TargetMonthValues',
          value:Immutable.fromJS(action.data)
        }]);
        KPIStore.emitChange();
        break;
    default:
  }
});

export default KPIStore;
