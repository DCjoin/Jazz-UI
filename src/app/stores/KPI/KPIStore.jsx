
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
import assign from 'object-assign';

let kpiInfo=Immutable.fromJS({});
let _quotaperiod=null;
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

  merge(data){
    data.forEach(el=>{
      let paths = el.path.split(".");
      kpiInfo=kpiInfo.setIn(paths,el.value);
    })
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
    default:
  }
});

export default KPIStore;
