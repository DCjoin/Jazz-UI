
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,DataStatus } from 'constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {List} from 'immutable';
import _ from 'lodash-es';
import SingleKPIStore from './SingleKPIStore.jsx';
import CommonFuns from 'util/Util.jsx';

function emptyList() {
      return new List();
    }

let _monthKpi=null,
    _hasHistory=false,
    _calcSum=null,
    _annualValueSum=null;
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
      _hasHistory=data;
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

  getValueSum(calcSum,
              values,
              validateQuota=SingleKPIStore.validateQuota
            ){
    if(!calcSum){
      return _annualValueSum
    }
    else {
      var resValid=_.filter(values,({Value})=>CommonFuns.isValidText(Value));
      var resInvalid=_.filter(values,({Value})=>validateQuota(Value)===false);
      if(resInvalid.length!==0 || values.length===0 || resValid.length===0){
        _annualValueSum=null
      }
      else {
        _annualValueSum=_.sum(_.map(values,(value)=>{
          return parseFloat(value.Value===null || value.Value===''?0:value.Value)}));
      }
    }

    return _annualValueSum
  },

  validateMonthInfo(
    month,
    quotaValidator = SingleKPIStore.validateQuota,
    savingRateValidator = SingleKPIStore.validateSavingRate){
      let {TargetMonthValues,TagSavingRates,MonthPredictionValues,ActualTagId,AnnualQuota,AnnualSavingRate}=month.toJS();
      TagSavingRates=TagSavingRates || [];

      if(!AnnualQuota && !AnnualSavingRate) return false;

      if(AnnualQuota && !quotaValidator(AnnualQuota)) return false;

      if(AnnualSavingRate && !savingRateValidator(AnnualSavingRate)) return false;

      if(!_.isNumber(ActualTagId)) return false;

      let res=_.filter(TargetMonthValues,({Value})=>quotaValidator(Value)===false);
      if(res.length!==0) return false;

       res=_.filter(MonthPredictionValues,({Value})=>quotaValidator(Value)===false);
      if(res.length!==0) return false;

      res=_.filter(TagSavingRates,({SavingRate})=>savingRateValidator(SavingRate)===false);
     if(res.length!==0) return false;

     return true
    },

    validateRatioMonthInfo(
      month,
      quotaValidator = SingleKPIStore.validateQuota,
      savingRateValidator = SingleKPIStore.validateSavingRate){
        let {TargetMonthValues,ActualTagId,ActualRatioTagId}=month.toJS();


        if(!_.isNumber(ActualTagId) || !_.isNumber(ActualRatioTagId)) return false;

        let res=_.filter(TargetMonthValues,({Value})=>quotaValidator(Value)===false);
        if(res.length!==0) return false;

       return true
      },

  dispose(){
        _monthKpi=null;
        _hasHistory=false;
        _calcSum=null;
        _annualValueSum=null;
  }

});

MonthKPIStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.SET_MONTH_KPI_INFO:
         MonthKPIStore.setMonthKpi(action.data);
         MonthKPIStore.emitChange();
         break;
    // case Action.MERGE_MONTH_KPI_INFO:
    //      MonthKPIStore.merge(action.data);
    //      MonthKPIStore.emitChange();
    //     break;
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
    case Action.GET_CALC_PREDICATE:
        MonthKPIStore.merge([{
            path:'MonthPredictionValues',
            value:Immutable.fromJS(action.data)
          }]);
       MonthKPIStore.emitChange();
        break;

    default:
  }
});

export default MonthKPIStore;
