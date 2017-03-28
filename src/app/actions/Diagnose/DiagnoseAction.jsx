import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action} from '../../constants/actionType/Diagnose.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';
var _hierarchyId,_gradeType,_diagnoseListType;
const DiagnoseAction = {
  getDiagnosisList(HierarchyId=_hierarchyId,GradeType=_gradeType,DiagnoseListType=_diagnoseListType,callback){
    _hierarchyId=HierarchyId;
    _gradeType=GradeType;
    _diagnoseListType=DiagnoseListType;
    Ajax.post(Path.Diagnose.diagnosislist,
      {
      params: {HierarchyId,GradeType,DiagnoseListType},
      tag: 'getDiagnosisList',
      avoidDuplicate: true,
      success: function(res) {
        if(callback) callback();
        AppDispatcher.dispatch({
          type: Action.GET_DIAGNOSIS_LIST,
          data:res
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getDiagnoseStatic(hierarchyId){
    Ajax.get(util.replacePathParams(Path.Diagnose.getdiagnosestatic, hierarchyId), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_DIAGNOSIS_STATIC,
          data: res,
        })
      }
    } );
  },
  getDiagnose(diagnoseId){
    Ajax.get(util.replacePathParams(Path.Diagnose.getDiagnose, diagnoseId), {
      tag: 'getDiagnosis',
      avoidDuplicate: true,
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_DIAGNOSIS_BY_ID,
          data: res,
        })
      }
    } );
  },
  deletediagnose(diagnoseId){
    var me=this;
    Ajax.get(util.replacePathParams(Path.Diagnose.deletediagnose, diagnoseId), {
      success: (res) => {
        me.getDiagnosisList();
      }
    } );
  },
  getTagsList() {
    Ajax.get('/diagnose/tags/list', {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_TAGS_LIST,
          data: res,
        })
      }
    });
  },
  getChartData() {
    Ajax.post('/diagnose/chart/data', {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_CHART_DATA,
          data: res,
        })
      }
    });
  }
}

export default DiagnoseAction;
