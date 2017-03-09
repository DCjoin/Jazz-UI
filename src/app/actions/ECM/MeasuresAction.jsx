import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,ThumbnailSize,DetailSize } from '../../constants/actionType/Measures.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';
var _hierarchyId=null,_status=null;

const MeasuresAction = {
  getGroupSettingsList(hierarchyId=_hierarchyId,status=_status ) {
    _hierarchyId=hierarchyId;
    _status=status;
    Ajax.get( util.replacePathParams(Path.ECM.getEnergysolution, hierarchyId,status,ThumbnailSize,DetailSize), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_SOLUTION_SUCCESS,
          status,
          data: res,
        })
      }
    } );
  },
  checkSolution(item,checked){
    AppDispatcher.dispatch({
      type: Action.CHECK_SOLUTION,
      item,
      checked
    })
  },
  pushProblem(ids){
    var that=this;
    Ajax.post(Path.ECM.pushProblem,
      {
      params: ids,
      success: function(resBody) {
        that.getGroupSettingsList();
        AppDispatcher.dispatch({
          type: Action.PUSH_PROBLEM_SUCCESS
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  deleteProblem(ids){
    var that=this;
    Ajax.post(util.replacePathParams(Path.ECM.deleteProblem, ids[0]),
      {
      success: function(resBody) {
        that.getGroupSettingsList();
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  updateSolution(dto,callback){
    var that=this;
    Ajax.post(Path.ECM.updateSolution,
      {
      params: dto,
      success: function(resBody) {
        if(callback) callback()
        else that.getGroupSettingsList();
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  resetErrorText(){
    AppDispatcher.dispatch({
      type: Action.RESET_SNACKBAR_TEXT
    });
  },
  merge(paths,value){
    AppDispatcher.dispatch({
      type: Action.MERGE_MEASURE,
      paths,value
    });
  },
  getSupervisor(hierarchyId=_hierarchyId){
    Ajax.get(util.replacePathParams(Path.ECM.getSupervisor, hierarchyId), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_SUPERVISOR_SUCCESS,
          data: res,
        })
      }
    } );
  },
  saveSupervisor(dto,callback){
    if(!dto.hierarchyId){
      dto.hierarchyId=_hierarchyId
    }
    Ajax.post(Path.ECM.saveSupervisor,
      {
      params: dto,
      success: function(resBody) {
        if(callback) callback(resBody)
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  assignSupervisor(problemId,supervisorId,callback){
    var that=this;
    Ajax.post(util.replacePathParams(Path.ECM.assignSupervisor, problemId,supervisorId),
      {
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.ASSIGN_SUPERVISOR_SUCCESS
        });
        that.getSupervisor();
        if(callback) callback()
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getActivecounts(hierarchyId,callback){
    Ajax.get(util.replacePathParams(Path.ECM.activecounts, hierarchyId), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_ACTIVE_COUNTS,
          data: res,
        });
        if(callback) callback()
      }
    } );
  },
  getContainsunread(hierarchyId,statusArr,callback){
    Ajax.post(util.replacePathParams(Path.ECM.containsunread, hierarchyId),
      {
      params: statusArr,
      success: function(res) {
        AppDispatcher.dispatch({
          type: Action.GET_CONTAINS_UNREAD,
          data:res
        });
        if(callback) callback()
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  readProblem(problemId){
    Ajax.post(util.replacePathParams(Path.ECM.readProblem, problemId),
      {
      success: function(res) {
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getRemarkList(problemId){
    Ajax.get(util.replacePathParams(Path.ECM.remarkList, problemId), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_REMARK_LIST_SUCCESS,
          data: res,
        });
      }
    } );
  },
  addRemark(problemId,dto){
    var me=this;
    Ajax.post(util.replacePathParams(Path.ECM.addRemark),
      {
      params: dto,
      success: function(res) {
        me.getRemarkList(problemId)
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  deleteRemark(problemId,remarkId){
    var me=this;
    Ajax.post(util.replacePathParams(Path.ECM.deleteRemark, remarkId),
      {
      success: function(res) {
        me.getRemarkList(problemId)
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  setSnackBarText(status){
    AppDispatcher.dispatch({
      type: Action.SET_SNACKBAR_TEXT,
      data: status,
    });

  }
}

export default MeasuresAction;
