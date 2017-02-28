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
  createSolution(dto){
    var that=this;
    Ajax.post(Path.ECM.createSolution,
      {
      params: dto,
      success: function(resBody) {
        that.getGroupSettingsList();
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
  }
}

export default MeasuresAction;
