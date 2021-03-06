
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,Status,Msg} from '../../constants/actionType/Measures.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import _ from 'lodash-es';
import CommonFuns from 'util/Util.jsx';
import moment from 'moment';

var _solutionList=null,
    _checkList=[],
    _text=null,
    _supervisors=null,
    _activeCounts=[],
    _unRead=[],
    _remarkList=null;
var CHANGE_EVENT = 'change';

const DEFAULT_SOLUTION={
    "Problem": {
      "Id": 0,
      "TagIds": [
        0
      ],
      "HierarchyId": 0,
      "Name": "string",
      "EnergySys": 1,
      "Description": "string",
      "Status": 0,
      "IsRead": true,
      "CreateUserId": 0,
      "CreateUserName": "string",
      "IsConsultant": true,
      "CreateTime": "2018-05-11T06:19:36.799Z",
      "ThumbnailUrl": "http://se-test-data.oss-cn-hangzhou.aliyuncs.com/EnergyWidgetGraph_763_0?x-oss-process=image/resize,w_146,h_97/format,png",
      "EnergyProblemImages": [
        {
          Content:null,
          EnergyProblemId:763,
          Id:965,
          ImageUrl:"http://se-test-data.oss-cn-hangzhou.aliyuncs.com/EnergyWidgetGraph_763_0?x-oss-process=image/resize,w_600,h_400/format,png",
          Name:"bug 20065",
          OssKey:"EnergyWidgetGraph_763_0"
        }
      ],
      "Supervisor": {
        "Id": 0,
        "HierarchyId": 0,
        "Name": "string",
        "PhoneNumber": "string",
        "EnergySys": 1,
        "CreateTime": "2018-05-11T06:19:36.799Z"
      },
      "ProblemTypeId": 0,
      "SolutionTitle": null
    },
    "Solutions": [
      {
        "Id": 0,
        "Name": "string",
        "ExpectedAnnualEnergySaving": 0,
        "EnergySavingUnit": "string",
        "ExpectedAnnualCostSaving": 0,
        "InvestmentAmount": 0,
        "ROI": 0,
        "SolutionDescription": "string",
        "ProblemTypeName": "string",
        "EnergeyLabel": "string",
        "IndustryDesc": "string",
        "CreatorUserId": 0,
        "CreatorUserName": "string",
        "SolutionImages": [
          {
            "Id": 0,
            "EnergySolutionId": 0,
            "Name": "string",
            "ImageUrl": "http://se-test-data.oss-cn-hangzhou.aliyuncs.com/EnergyWidgetGraph_763_0?x-oss-process=image/resize,w_146,h_97/format,png",
            "Content": "string",
            "OssKey": "string"
          },
                    {
            "Id": 0,
            "EnergySolutionId": 0,
            "Name": "string",
            "ImageUrl": "http://se-test-data.oss-cn-hangzhou.aliyuncs.com/EnergyWidgetGraph_763_0?x-oss-process=image/resize,w_146,h_97/format,png",
            "Content": "string",
            "OssKey": "string"
          },          {
            "Id": 0,
            "EnergySolutionId": 0,
            "Name": "string",
            "ImageUrl": "http://se-test-data.oss-cn-hangzhou.aliyuncs.com/EnergyWidgetGraph_763_0?x-oss-process=image/resize,w_146,h_97/format,png",
            "Content": "string",
            "OssKey": "string"
          }
        ]
      },
            {
        "Id": 0,
        "Name": "string",
        "ExpectedAnnualEnergySaving": 0,
        "EnergySavingUnit": "string",
        "ExpectedAnnualCostSaving": 0,
        "InvestmentAmount": 0,
        "ROI": 0,
        "SolutionDescription": "string",
        "ProblemTypeName": "string",
        "EnergeyLabel": "string",
        "IndustryDesc": "string",
        "CreatorUserId": 0,
        "CreatorUserName": "string",
        "SolutionImages": [
          {
            "Id": 0,
            "EnergySolutionId": 0,
            "Name": "string",
            "ImageUrl": "string",
            "Content": "string",
            "OssKey": "string"
          }
        ]
      },      {
        "Id": 0,
        "Name": "string",
        "ExpectedAnnualEnergySaving": 0,
        "EnergySavingUnit": "string",
        "ExpectedAnnualCostSaving": 0,
        "InvestmentAmount": 0,
        "ROI": 0,
        "SolutionDescription": "string",
        "ProblemTypeName": "string",
        "EnergeyLabel": "string",
        "IndustryDesc": "string",
        "CreatorUserId": 0,
        "CreatorUserName": "string",
        "SolutionImages": [
          {
            "Id": 0,
            "EnergySolutionId": 0,
            "Name": "string",
            "ImageUrl": "string",
            "Content": "string",
            "OssKey": "string"
          }
        ]
      }
    ]
  }

const MeasuresStore = assign({}, PrototypeStore, {
  init(){
    _solutionList=null;
    _checkList=[];
  },
  setSolutionList(data,status){
    this.init();
    _solutionList=Immutable.fromJS(data);

    // _solutionList=Immutable.fromJS(_.fill(Array(data.length),DEFAULT_SOLUTION));
    if(status===Status.NotPush){
      _solutionList.forEach(solution=>{
        _checkList.push({
          checked:false,
          disabled:this.IsSolutionDisable(solution.toJS())
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
    if(_checkList.length!==0){
      _solutionList.forEach((solution,index)=>{
        _checkList[index].disabled=this.IsSolutionDisable(solution.toJS())
      })
    }
  },
  getText(){
    return _text
  },
  getIds(index){
    var ids=[];
    if(index==='Batch'){
      _solutionList.forEach((solution,index)=>{
        if(_checkList[index].checked){
          ids.push(solution.getIn(['Problem','Id']))
        }
      })
    }
    else {
      ids.push(_solutionList.getIn([index,'Problem','Id']))
    }
    return ids
  },
  getNamesById(index){
    var names=null;
    if(index==='Batch'){
      _solutionList.forEach((solution,index)=>{
        if(_checkList[index].checked){
          var name=`“${solution.getIn(['Problem','SolutionTitle'])}”`;
          if(names===null){
            return names=name;
          }else {
            names+= '、'+name;
          }
        }
      })
    }
    else {
      names=_solutionList.getIn([index,'Problem','SolutionTitle'])?`“${_solutionList.getIn([index,'Problem','SolutionTitle'])}”`:''
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
  IsSolutionDisable(measure){
    var {Solutions,Problem}=measure;
    var disabled=Problem.SolutionTitle===null || Problem.Name===null || Problem.Description===null
                  || Problem.SolutionTitle==='' || Problem.Name==='' || Problem.Description===''

    Solutions.forEach(solution=>{
      disabled=disabled || solution.Name===null || solution.Description===null || solution.ExpectedAnnualEnergySaving===null
              || solution.EnergySavingUnit===null || solution.ExpectedAnnualCostSaving===null
              || solution.Name==='' || solution.Description==='' || solution.ExpectedAnnualEnergySaving===''
              || solution.EnergySavingUnit==='' || solution.ExpectedAnnualCostSaving===''
    })

    return disabled

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
  getInvestmentReturnNum(amount,cost){
        if(cost===null || cost*1===0 || amount===null){
      return null
    }
    else {
      var cycle=amount/cost;
      cycle=parseFloat(cycle.toFixed(1));
        return cycle

    }
  },
  getInvestmentReturnCycle(amount,cost){
      var cycle=this.getInvestmentReturnNum(amount,cost);
      if(cycle===0){
        return I18N.Setting.ECM.InvestmentReturnCycle.ImmediateRecovery
      }else{
        if( cycle === null || !this.validateNumber(cycle) ) {
          return 0;
        }
        return cycle
      }
  },
  getDisplayText(text){
    return text===null?' — ':CommonFuns.getLabelData(text*1)
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

  },
  getValidParams(dto){
    let {ExpectedAnnualEnergySaving,ExpectedAnnualCostSaving,InvestmentAmount}=dto.get('EnergySolution');
    if(!this.validateNumber(ExpectedAnnualEnergySaving)) {dto=dto.setIn(['EnergySolution','ExpectedAnnualEnergySaving'],null)}
    if(!this.validateNumber(ExpectedAnnualCostSaving)) {dto=dto.setIn(['EnergySolution','ExpectedAnnualCostSaving'],null)}
    if(!this.validateNumber(InvestmentAmount)) {dto=dto.setIn(['EnergySolution','InvestmentAmount'],null)}

    return dto
  },
  setSupervisor(data){
    _supervisors=Immutable.fromJS(data);
  },
  getSupervisor(){
    return _supervisors
  },
  deleteSupervisor(id){
    let index=_supervisors.findIndex(item=>item.get('Supervisors').findIndex(item=>item.get('Id')===id)>-1),
        supervisorId=_supervisors.getIn([index,'Supervisors']).findIndex(item=>item.get('Id')===id);
        if(supervisorId===0){
          _supervisors=_supervisors.deleteIn([index])
        }
        else {
          _supervisors=_supervisors.deleteIn([index,'Supervisors',supervisorId])
        }

  },
  setActiveCounts(data){
    _activeCounts=data
  },
  getActiveCounts(){
    return _activeCounts
  },
  setUnread(data){
    _unRead=data
  },
  getUnread(){
    return _unRead
  },
  setRemarkList(data){
    _remarkList=Immutable.fromJS(data)
  },
  getRemarkList(){
    return _remarkList
  },
  setSnackBarText(status){
    switch (status) {
      case Status.ToBe:
          this.initText(I18N.Setting.ECM.StatusToBeText)
        break;
      case Status.Done:
          this.initText(I18N.Setting.ECM.StatusToDoneText)
          break;
        case Status.Canceled:
            this.initText(I18N.Setting.ECM.StatusToCancelText)
          break;
      default:

    }
  },
  getSupervisorListByEnergySys(list,energySys){
    if(list===null) return null;
    var list1=list.filter(item=>(item.get('EnergySys')===energySys)),
        list2=list.filter(item=>(item.get('EnergySys')!==energySys));
        return list1.concat(list2)
  },
  getErrorMsg(text,id){
    let index=_supervisors.findIndex(item=>item.get('Supervisors').findIndex(item=>item.get('Id')===id)>-1),
        supervisorId=_supervisors.getIn([index,'Supervisors']).findIndex(item=>item.get('Id')===id);
    let supervisor=_supervisors.getIn([index,'Supervisors',supervisorId]),
    {Name,PhoneNumber}=supervisor.toJS(),
        error = JSON.parse(text).error,
        _errorMessage = error.Messages,
        solutions=_errorMessage.map((item,index)=>{
          return index===0?item:'；'+item});
    return {
      supervisor:I18N.format(I18N.Setting.ECM.DeleteSuperviorError,Name+' '+PhoneNumber,_errorMessage.length),
      solutions:solutions
    }
  },
  emitChange(...args) {
    this.emit(CHANGE_EVENT, ...args);
  },
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
    case Action.GET_SUPERVISOR_SUCCESS:
        MeasuresStore.setSupervisor(action.data);
        MeasuresStore.emitChange()
        break;
    case Action.ASSIGN_SUPERVISOR_SUCCESS:
        let text=action.IsConsultant?I18N.Setting.ECM.AndConsultant:'';
        MeasuresStore.initText(I18N.format(I18N.Setting.ECM.AssignSuperviorSuccess,text));
        MeasuresStore.emitChange()
        break;
    case Action.GET_ACTIVE_COUNTS:
        MeasuresStore.setActiveCounts(action.data);
        break;
    case Action.GET_CONTAINS_UNREAD:
        MeasuresStore.setUnread(action.data);
          break;
    case Action.GET_REMARK_LIST_SUCCESS:
        MeasuresStore.setRemarkList(action.data);
        MeasuresStore.emitChange()
        break;
    case Action.SET_SNACKBAR_TEXT:
        MeasuresStore.setSnackBarText(action.data);
        MeasuresStore.emitChange()
        break;
    case Action.DELETE_SUPERVISOR_SUCCESS:
        MeasuresStore.deleteSupervisor(action.data);
        MeasuresStore.emitChange(Msg.DELETE_SUPERVISOR_SUCCESS)
        break;
    case Action.DELETE_SUPERVISOR_ERROR:
        MeasuresStore.emitChange(Msg.DELETE_SUPERVISOR_ERROR,MeasuresStore.getErrorMsg(action.err,action.supervisorId));
        break;
          default:
    }
  });

  export default MeasuresStore;
