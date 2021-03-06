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
  clearList(){
    //first clear list
    AppDispatcher.dispatch({
      type: Action.CLEAR_ALL_LIST,
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
        AppDispatcher.dispatch({
          type: Action.REMOVE_DIAGNOSE_SUCCESS,
          data:diagnoseId
        });
        me.getDiagnosisList();
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
  getDiagnoseAssociateTag(HierarchyId, EnergyLabelId, DiagnoseItemId) {
    Ajax.post(Path.Diagnose.getDiagnoseAssociateTag, {
      params: {
        HierarchyId,
        EnergyLabelId,
        DiagnoseItemId,
        LabelType: 1
      },
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_ASSOCIATE_TAG_LIST,
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
      tag: 'getChartDataStep1',
      avoidDuplicate: true,
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
  getChartData(params, oldChartData) {
    AppDispatcher.dispatch({
      type: Action.GET_CHART_DATAING,
    })
    Ajax.post('/diagnose/previewchart', {
      tag: 'getChartData',
      avoidDuplicate: true,
      params,
      commonErrorHandling: false,
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_CHART_DATA,
          data: res,
        })
      },
      error: (err, res) => {
        let {errorCode} = util.processErrorCode(res.body.error.Code);
        util.popupErrorMessage(util.getErrorMessage(errorCode), res.body.error.Code, true);
        AppDispatcher.dispatch({
          type: Action.GET_CHART_DATA,
          data: oldChartData,
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
    var path=util.replacePathParams(Path.Diagnose.getproblemdata, diagnoseId);
    Ajax.get(path, {
      tag: 'getproblemdata',
      avoidDuplicate: true,
      params:`startTime=${startTime || null}&endTime=${endTime || null}`,
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_DIAGNOSE_CHART_DATA_SUCCESS,
          data: res,
        })
      }
    } );
  },
  getSimilarProblemChart(diagnoseId){
    var path=util.replacePathParams(Path.Diagnose.getproblemdata, diagnoseId);
    Ajax.get(path, {
      params:`startTime=${null}&endTime=${null}`,
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.SIMILAR_PROBLEM_CHART,
          data: res,
          id: diagnoseId,
        })
      }
    } );
  },
  ignorediagnose(diagnoseId){
    var me=this;
    Ajax.get(util.replacePathParams(Path.Diagnose.ignorediagnose, diagnoseId), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.REMOVE_DIAGNOSE_SUCCESS,
          data:diagnoseId
        })
        me.getDiagnosisList();
        me.getDiagnoseStatic(_hierarchyId);
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
      commonErrorHandling: false,
      success: (res) => {
        that.getDiagnosisList();
        AppDispatcher.dispatch({
          type: Action.CREATE_DIAGNOSE,
          isClose,
          data: res
        })
      },
      error: (err, res) => {
        let {errorCode} = util.processErrorCode(res.body.error.Code);
        util.popupErrorMessage(
          util.replacePathParams(util.getErrorMessage(errorCode),
          JSON.parse(res.text).error.Messages && JSON.parse(res.text).error.Messages[0], '诊断名称'),
          res.body.error.Code, true
        );
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
  mergeDiagnose(paths,value){
    AppDispatcher.dispatch({
      type: Action.MERGE_DIAGNOSE_SUCCESS,
      paths,value
    })
  },
  generateSolution(diagnoseId){
    var me=this;
    Ajax.get(util.replacePathParams(Path.Diagnose.generatesolution, diagnoseId), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.REMOVE_DIAGNOSE_SUCCESS,
          data:diagnoseId
        })
        me.getDiagnosisList();
        me.getDiagnoseStatic(_hierarchyId);
      }
    } );
  },
  getConfigcalendar(hierarchyId,date=new Date()){
    var dueDate=util.DataConverter.DatetimeToJson(date);
    Ajax.get(util.replacePathParams(Path.Diagnose.isconfigcalendar, dueDate,hierarchyId), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_CONFIG_CALENDAR,
          data: res,
        })
      }
    } );
  },
  clearDiagnoseChartData(){
    AppDispatcher.dispatch({
      type: Action.CLEAR_DIAGNOSE_CHART_DATA,
    })
  },

  getConsultant(hierarchyId) {
    Ajax.get(util.replacePathParams(Path.Diagnose.getConsultant, hierarchyId), {
      success: res => {
        AppDispatcher.dispatch({
          type: Action.GET_CONSULTANT,
          data: res,
        });
      }
    });

  },

  createSolution(params, callback) {
    Ajax.post(Path.Diagnose.createSolution, {
      params,
      success: callback
    });
  },

  getSuggestSolutions(EnergyLabelId, HierarchyId, ProblemTypeId) {
    Ajax.post(Path.Diagnose.getSuggestSolutions, {
      params: {
        EnergyLabelId,
        HierarchyId,
        ProblemTypeId,
      },
      success: res => {
        AppDispatcher.dispatch({
          type: Action.GET_SUGGEST_SOLUTIONS,
          data: res,
        });
      }
    });
  },

  checkTitle(HierarchyId, CustomerId, SolutionTitle, cb,ProblemId) {
    Ajax.post(Path.Diagnose.checkTitle, {
      params: {
        HierarchyId,
        CustomerId,
        SolutionTitle,
        ProblemId
      },
      success: res => {
        if( cb && typeof cb === 'function' ) {
          cb(res);
        } else {
          AppDispatcher.dispatch({
            type: Action.GET_SUGGEST_SOLUTIONS,
            data: res,
          });
        }
      }
    });
  },
}

export default DiagnoseAction;
