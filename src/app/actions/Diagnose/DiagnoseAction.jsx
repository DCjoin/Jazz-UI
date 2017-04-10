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
  getDiagnose(diagnoseId,callback){
    Ajax.get(util.replacePathParams(Path.Diagnose.getDiagnose, diagnoseId), {
      tag: 'getDiagnosis',
      avoidDuplicate: true,
      success: (res) => {
        if(callback) callback(res)
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
        AppDispatcher.dispatch({
          type: Action.REMOVE_DIAGNOSE_SUCCESS,
          data:diagnoseId
        })
      }
    } );
  },
  getDiagnoseTag(HierarchyId, EnergyLabelId, DiagnoseItemId, LabelType) {
    Ajax.post(Path.Diagnose.getDiagnoseTag, {
      params: {
        HierarchyId,
        EnergyLabelId,
        DiagnoseItemId,
        LabelType,
      },
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_TAGS_LIST,
          data: res,
        })
      }
    });
  },
  getChartDataStep1(params) {
    AppDispatcher.dispatch({
      type: Action.GET_CHART_DATAING,
    })
    Ajax.post('/Energy/GetTagsData', {
      params,
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_CHART_DATA,
          data: {
            EnergyViewData: res
          },
        })
      }
    });
  },
  getChartData(params) {
    AppDispatcher.dispatch({
      type: Action.GET_CHART_DATAING,
    })
    Ajax.post('/diagnose/previewchart', {
      params,
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_CHART_DATA,
          data: res,
        })
      }
    });
  },
  getdiagnosedata(diagnoseId){
    Ajax.get(util.replacePathParams(Path.Diagnose.getdiagnosedata, diagnoseId), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_DIAGNOSE_CHART_DATA_SUCCESS,
          data: res,
        })
      }
    } );
  },
  getproblemdata(diagnoseId,startTime,endTime){
    Ajax.get(util.replacePathParams(Path.Diagnose.getdiagnosedata, diagnoseId,
                                    `startTime=${startTime || null}`,`endTime=${endTime || null}`), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_DIAGNOSE_CHART_DATA_SUCCESS,
          data: res,
        })
      }
    } );
  },
  ignorediagnose(diagnoseId){
    var me=this;
    Ajax.get(util.replacePathParams(Path.Diagnose.ignorediagnose, diagnoseId), {
      success: (res) => {
        me.getDiagnosisList();
        AppDispatcher.dispatch({
          type: Action.REMOVE_DIAGNOSE_SUCCESS,
          data:diagnoseId
        })
      }
    } );
  },
  pauseorrecoverdiagnose(diagnoseId,status){
    var me=this;
    Ajax.get(util.replacePathParams(Path.Diagnose.pauseorrecoverdiagnose, diagnoseId,status), {
      success: (res) => {
        me.getDiagnosisList();
      }
    } );
  },
  previewchart(params){
    Ajax.post(Path.Diagnose.previewchart, {
      params,
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_PREVIEW_CHART_DATA,
          data: res,
        })
      }
    });
  },
  clearCreate() {
    AppDispatcher.dispatch({
      type: Action.CLEAR_CREATE_DATA,
      data: null,
    });
  },
  createDiagnose(params, isClose) {
    var that=this;
    Ajax.post('/diagnose/adddiagnose', {
      params,
      success: (res) => {
        that.getDiagnosisList();
        AppDispatcher.dispatch({
          type: Action.CREATE_DIAGNOSE,
          isClose,
        })
      }
    });
  },
  updateDiagnose(params) {
    var that=this;
    Ajax.post(Path.Diagnose.updateDiagnose, {
      params,
      commonErrorHandling: false,
      success: () => {
        that.getDiagnosisList();
        AppDispatcher.dispatch({
          type: Action.UPDATE_DIAGNOSE_SUCCESS,
        })
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.UPDATE_DIAGNOSE_ERROR,
        })
      }
    });
  },
}

export default DiagnoseAction;
