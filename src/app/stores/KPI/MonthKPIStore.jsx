
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,DataStatus } from 'constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {List} from 'immutable';

function emptyList() {
      return new List();
    }

let _monthKpi=null,
    _hasHistory=false,
    _calcSum=null;
const MonthKPIStore = assign({}, PrototypeStore, {

  setMonthKpi(data){
    _monthKpi=data;
  },

  getMonthKpi(){
    return _monthKpi;
  },

  merge(data){
      data.forEach(el=>{
        let {path,status,value}=el;
        let paths = path.split(".");
        if(status===DataStatus.ADD){
          let {index,length}=el;
          var children = _monthKpi.getIn(paths);
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

          _monthKpi = _monthKpi.setIn(paths, value);
        }
        else if(status===DataStatus.DELETE){
          _monthKpi = _monthKpi.deleteIn(paths);
        }
        else {
          _monthKpi=_monthKpi.setIn(paths,value);
        }
      })

    },

  setHasHistory(data){
      _hasHistory=data.has;
  },

  getHasHistory(){
    return _hasHistory;
  },

  setCalcSumValue(data){
    _calcSum=data;
  },

  getCalcSumValue(){
    return _calcSum
  },

  dispose(){
    _monthKpi=null;
    _hasHistory=false;
  }

});

MonthKPIStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.SET_MONTH_KPI_INFO:
         MonthKPIStore.setMonthKpi(action.data);
         MonthKPIStore.emitChange();
         break;
    case Action.MERGE_MONTH_KPI_INFO:
         MonthKPIStore.merge(action.data);
         MonthKPIStore.emitChange();
        break;
    case Action.MERGE_MONTH_KPI_INFO:
         MonthKPIStore.merge(action.data);
         MonthKPIStore.emitChange();
         break;
    case Action.IS_AUTO_CALCUL_ABLE:
         MonthKPIStore.setHasHistory(action.data.has)
         MonthKPIStore.emitChange();
        break;
    case Action.GET_GROUP_CLAC_SUM_VALUE:
         MonthKPIStore.setCalcSumValue(action.data)
         MonthKPIStore.emitChange();
         break;
    case Action.GET_CALC_VALUE:
         MonthKPIStore.merge([{
            path:'TargetMonthValues',
            value:Immutable.fromJS(action.data)
          }]);
         MonthKPIStore.emitChange();
        break;
    default:
  }
});

export default MonthKPIStore;
