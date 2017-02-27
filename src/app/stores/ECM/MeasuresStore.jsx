
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,Status} from '../../constants/actionType/Measures.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import _ from 'lodash';
import CommonFuns from 'util/Util.jsx';
import moment from 'moment';

var _solutionList=null,
    _checkList=[],
    _text=null;
const MeasuresStore = assign({}, PrototypeStore, {
  init(){
    _solutionList=null;
    _checkList=[];
  },
  setSolutionList(data,status){
    this.init();
    _solutionList=Immutable.fromJS(data);
    if(status===Status.NotPush){
      _solutionList.forEach(solution=>{
        _checkList.push({
          checked:false,
          disabled:this.IsSolutionDisable(solution.get('EnergySolution').toJS())
        })
      })
    }
  },
  getSolutionList(){
    return _solutionList
  },
  getCheckList(){
    return Immutable.fromJS(_checkList)
  },
  checkSolution(item,checked){
    if(item==='all'){
      _checkList.forEach((el,index)=>{
        if(!el.disabled){
          _checkList[index].checked=checked
        }
      })
    }
    else {
      _checkList[item].checked=checked
    }
  },
  initText(text){
    _text=text;
  },
  merge(paths,value){
    _solutionList=_solutionList.setIn(paths,value);
  },
  getText(){
    return _text
  },
  getIds(index){
    var ids=[];
    if(index==='Batch'){
      _solutionList.forEach((solution,index)=>{
        if(_checkList[index].checked){
          ids.push(solution.getIn(['EnergyProblem','Id']))
        }
      })
    }
    else {
      ids.push(_solutionList.getIn([index,'EnergyProblem','Id']))
    }
    return ids
  },
  getNamesById(index){
    var names=null;
    if(index==='Batch'){
      _solutionList.forEach((solution,index)=>{
        if(_checkList[index].checked){
          var name=`“${solution.getIn(['EnergySolution','Name'])}”`;
          if(names===null){
            return names=name;
          }else {
            names+= name;
          }
        }
      })
    }
    else {
      names=_solutionList.getIn([index,'EnergySolution','Name'])?`“${_solutionList.getIn([index,'EnergySolution','Name'])}”`:''
    }
    return names
  },
  getAllEnergySys(){
    return{
        'AirConditioning':{label:I18N.Setting.ECM.AirConditioning,value:1},
        'Boiler':{label:I18N.Setting.ECM.Boiler,value:2},
        'StrongElectricity':{label:I18N.Setting.ECM.StrongElectricity,value:3},
        'WeakElectricity':{label:I18N.Setting.ECM.WeakElectricity,value:4},
        'Drainage':{label:I18N.Setting.ECM.Drainage,value:5},
        'AirCompression':{label:I18N.Setting.ECM.AirCompression,value:6},
        'Other':{label:I18N.Setting.ECM.Other,value:20}
      }
  },
  getEnergySys(value){
    var energySys=Immutable.fromJS(this.getAllEnergySys())
    return energySys.find(item=>(item.get('value')===value)).get('label')
  },
  IsSolutionDisable(solution){
    return solution.Name===null || solution.ExpectedAnnualEnergySaving===null
              || solution.EnergySavingUnit===null || solution.ExpectedAnnualCostSaving===null || solution.Description===null
  },
  getAllSelectedStatus(){
    var abledAndunCheck=Immutable.fromJS(_checkList).findIndex(item=>(!item.get('disabled') && !item.get('checked')))>-1;
    var abled=Immutable.fromJS(_checkList).findIndex(item=>(!item.get('disabled')))>-1;
    return abled && !abledAndunCheck
  },
  IsPushAllDisabled(){
    return _.findIndex(_checkList,item=>item.checked)===-1
  },
  IsAllCheckDisabled(){
    return !(Immutable.fromJS(_checkList).findIndex(item=>(!item.get('disabled')))>-1)
  },
  getInvestmentReturnCycle(amount,cost){
    if(cost===null || cost*1===0){
      return null
    }
    else {
      var cycle=amount/cost;
      if(cycle===0){
        return I18N.Setting.ECM.InvestmentReturnCycle.ImmediateRecovery
      }
      else {
        return I18N.format(I18N.Setting.ECM.InvestmentReturnCycle.Other,cycle.toFixed(1))
      }
    }
  },
  getDisplayText(text){
    return text===null?'-':text
  },
  validateNumber(number){
    //null
    if(number===null) return true
    //不合法字符
    if(!CommonFuns.isNumeric(number)) return false
    //小于0
    if(number*1<0) return false
    //一位小数
    if((number+'').indexOf('.')>-1 && (number+'').length-(number+'').indexOf('.')!==2) return false
    return true
  },
  isSolutionValid(timeType,time){
    var now=moment(new Date());
    var date=moment(time);
    if(timeType===1 && date.month()===now.month() && date.year()===now.year()) return true
    if(timeType===2){
      var last3Month=moment(new Date()).add(-3,'M');
      if(date.month()!==now.month() && last3Month.isBefore(date)) return true
    }
    if(timeType===3){
      var last3Month=moment(new Date()).add(-3,'M');
      if(date.isBefore(last3Month)) return true
    }
  },
  getStatusText(status){
    switch (status) {
      case Status.ToBe:
            return I18N.Setting.ECM.PushPanel.ToBe
        break;
      case Status.Being:
            return I18N.Setting.ECM.PushPanel.Being
          break;
      case Status.Done:
            return I18N.Setting.ECM.PushPanel.Done
          break;
      case Status.Canceled:
            return I18N.Setting.ECM.PushPanel.Canceled
          break;
      default:

    }

  }
});

MeasuresStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_ENERGY_SOLUTION_SUCCESS:
        MeasuresStore.setSolutionList(action.data,action.status);
        MeasuresStore.emitChange()
        break;
    case Action.CHECK_SOLUTION:
        MeasuresStore.checkSolution(action.item,action.checked);
        MeasuresStore.emitChange()
        break;
    case Action.PUSH_PROBLEM_SUCCESS:
        MeasuresStore.initText(I18N.Setting.ECM.PushSuccess);
        MeasuresStore.emitChange();
        break;
    case Action.RESET_SNACKBAR_TEXT:
        MeasuresStore.initText(null);
        MeasuresStore.emitChange()
        break;
    case Action.MERGE_MEASURE:
        MeasuresStore.merge(action.paths,action.value);
        MeasuresStore.emitChange()
        break;
      default:
    }
  });

  export default MeasuresStore;
