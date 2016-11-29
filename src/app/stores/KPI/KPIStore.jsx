
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
import moment from 'moment';
import { Map,List} from 'immutable';
import assign from 'object-assign';
import {Status,Type} from '../../constants/actionType/KPI.jsx';
import CommonFuns from '../../util/Util.jsx';

// let {DataConverter} = CommonFuns;
// let j2d = DataConverter.JsonToDateTime,
//   d2j = DataConverter.DatetimeToJson;

// let j2d=CommonFuns.DataConverter.JsonToDateTime;
// CommonFuns.DataConverter.JsonToDateTime(paramsObj.startTime, false),
//
function JsonToDateTime(jsonstring, outintval) {
  outintval = typeof (outintval) === 'boolean' ? outintval : true;
  jsonstring = jsonstring.substr(6, jsonstring.length - 8);

  var timezoneoffset = new Date().getTimezoneOffset() * 60000;
  var mydate;
  if (outintval) {
    mydate = parseInt(jsonstring) + timezoneoffset;
  } else {
    mydate = parseInt(jsonstring) + timezoneoffset;
    mydate = new Date(mydate);
  }

  return mydate;
}
function emptyMap() {
  return new Map();
}

function emptyList() {
  return new List();
}

function coverageRawToHighChartData(data) {
  if(!data) {
    return null;
  }
  return {
    year: data.year,
    data: data.IndicatorCharts.map( indicator => {
      return {
        type: indicator.IndicatorType,
        unit: indicator.UomId,
        name: indicator.IndicatorName,
        id: indicator.KpiId,
        lastMonthSaving: indicator.LstMonthSaving,
        actual: indicator.ActualMonthValues && indicator.ActualMonthValues.map( val => val.Value ),
        target: indicator.TargetMonthValues && indicator.TargetMonthValues.map( val => val.Value ),
        prediction: indicator.PredictionMonthValues && indicator.PredictionMonthValues.map( val => val.Value ),
      }
    } )
  }
}

let kpiInfo=emptyMap();
let _KPIPeriod=null,
    _KPIConfiguredLoading=false,
    _KPIConfigured=null,
    _KPIChart=null,
    _KPIChartSummary=null,
    _KPIChartLoading=false,
    _KPIChartSummaryLoading=false,
    _quotaperiodYear=null,
    _hasHistory=false;

function _init() {
  kpiInfo=emptyMap();
  _KPIPeriod=null;
  _KPIConfiguredLoading=true;
  _KPIConfigured=null;
  _KPIChart=null;
  _KPIChartSummary=null;
  _KPIChartLoading=false;
  _KPIChartSummaryLoading=false;
  _quotaperiodYear=null;
  _hasHistory=false;
}

let KPI_SUCCESS_EVENT = 'kpisuccess',
  KPI_ERROR_EVENT = 'kpierror';
const KPIStore = assign({}, PrototypeStore, {
  setKpiInfo(data){
    kpiInfo=Immutable.fromJS(data);
  },

  getKpiInfo(){
    return kpiInfo;
  },

  setKPIPeriod(data) {
    _KPIPeriod = data;
  },

  getKPIPeriod(){
    return assign({}, _KPIPeriod);
  },

  setKpiConfiguredLoading() {
    _KPIConfiguredLoading = true;
  },
  getKpiConfiguredLoading() {
    return _KPIConfiguredLoading;
  },

  setKpiConfigured(value) {
    _KPIConfiguredLoading = false;
    _KPIConfigured = value;
  },

  getKPIConfigured() {
    return  !!_KPIConfigured;
  },

  setKPIChart(data) {
    _KPIChartLoading = false;
    _KPIChart = Immutable.fromJS(coverageRawToHighChartData(data));
  },
  getKPIChart() {
    return _KPIChart;
  },

  setKPIChartSummary(data) {
    _KPIChartSummaryLoading = false;
    _KPIChartSummary = data;
  },
  getKPIChartSummary() {
    return _KPIChartSummary;
  },
  _initKpiChartData() {
    _KPIChartSummaryLoading = true;
    _KPIChartLoading = true;
  },

  chartReady() {
    return !(_KPIChartSummaryLoading || _KPIChartLoading)
  },

  setYearQuotaperiod(data) {
    _quotaperiodYear = data.map(el=>{
      return moment(JsonToDateTime(el))
    });
  },

  getYearQuotaperiod(){
    return _quotaperiodYear;
  },

  clearParam(){
    if(!kpiInfo.get('AdvanceSettings')) return;
    let {Year,IndicatorType}=kpiInfo.get('AdvanceSettings').toJS();
    kpiInfo=kpiInfo.set('AdvanceSettings',emptyMap());
    kpiInfo=kpiInfo.setIn(['AdvanceSettings','Year'],Year);
    kpiInfo=kpiInfo.setIn(['AdvanceSettings','IndicatorType'],IndicatorType);
  },

  merge(data){
    let refresh=false;
    data.forEach(el=>{
      let {path,status,value}=el;
      let paths = path.split(".");
      refresh= path.indexOf('IndicatorType')>-1 || path.indexOf('ActualTagName')>-1;
      if(status===Status.ADD){
        var children = kpiInfo.getIn(paths);
        if (!children) {
          children = emptyList();
        }
        if (Immutable.List.isList(children)) {
            value = children.push(value);
        }
        kpiInfo = kpiInfo.setIn(paths, value);
      }
      else if(status===Status.DELETE){
        kpiInfo = kpiInfo.deleteIn(paths);
      }
      else {
        kpiInfo=kpiInfo.setIn(paths,value);
      }
    })
    if(refresh){
      this.clearParam();
    }
  },

  setHasHistory(data){
    _hasHistory=data.has;
    this.merge([{path:'AdvanceSettings.Year',value:data.year}])
  },

  getHasHistory(){
    return _hasHistory;
  },

  getTagTable(TagSavingRates){
    var tags=[];
    if(TagSavingRates){
      tags=TagSavingRates.map(rate=>{
        return rate.TagName
      })
    }
    tags.unshift(I18N.Setting.Tag.Tag);
    return tags
  },

  getRatesTable(TagSavingRates){
    var rates=[];
    if(TagSavingRates){
      rates=TagSavingRates.map(rate=>{
        return rate.SavingRate
      })
    }
    rates.unshift(I18N.Setting.KPI.Parameter.SavingRates)
    return rates
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

  validateQuota(value=''){
    value=value===0 || value?value+'':value;
    let temp=parseFloat(value);
    if(!value || value==='-') return true;
    if((temp+'').length!==value.length || temp<0 || value.indexOf('.')>-1) return false;
    return true
  },

  validateSavingRate(value=''){
    value=value===0 || value?value+'':value;
    let temp=parseFloat(value),
        index=value.indexOf('.');
    if(!value || value==='-') return true;
    if(parseInt(value.slice(index,value.length))!==0 && (temp+'').length!==value.length) return false;
    if(temp<-100 || temp>100) return false;
    if(index>-1 && value.length-index>2) return false;
    return true
  },

  validateKpiInfo(kpi){
    var validDate=true;
    var {IndicatorName,ActualTagName,AdvanceSettings}=kpi.toJS();

    var {AnnualQuota,AnnualSavingRate,TargetMonthValues,PredictionSetting}=AdvanceSettings || {};

    if(!IndicatorName || IndicatorName==='') return false;

    if(!ActualTagName || ActualTagName==='') return false;

    if(AnnualQuota && !this.validateQuota(AnnualQuota)) return false;

    if(AnnualSavingRate && !this.validateSavingRate(AnnualSavingRate)) return false;

    if(TargetMonthValues && TargetMonthValues.length>0){
      TargetMonthValues.forEach(value=>{
        if(!this.validateQuota(value.Value)){
          validDate=false
        }
      });
    }

    if(PredictionSetting){
      let {TagSavingRates,MonthPredictionValues}=PredictionSetting;
      if(TagSavingRates && TagSavingRates.length>0){
        TagSavingRates.forEach(rate=>{
          if(!this.validateSavingRate(rate.SavingRate)){
            validDate=false
          }
        });
      }
      if(MonthPredictionValues && MonthPredictionValues.length>0){
        MonthPredictionValues.forEach(value=>{
          if(!this.validateQuota(value.Value)){
            validDate=false
          }
        });
      }
    }
    return validDate
  },

  transit(kpi){
    var period=this.getYearQuotaperiod();
    var {AdvanceSettings}=kpi.toJS();

    var {TargetMonthValues,PredictionSetting}=AdvanceSettings || {};

    if(TargetMonthValues && TargetMonthValues.length>0){
      for(let index=0;index<12;index++){
        let value=TargetMonthValues[index];
        if(value){
          if(value.Value===''){
            kpi=kpi.setIn(['AdvanceSettings','TargetMonthValues',index,'Value'],null)
          }
        }
        else {
          kpi=kpi.setIn(['AdvanceSettings','TargetMonthValues',index,'Month'],period[index]._i);
          kpi=kpi.setIn(['AdvanceSettings','TargetMonthValues',index,'Value'],null);
        }
      }
    }

    if(PredictionSetting){
      let {MonthPredictionValues}=PredictionSetting;

      if(MonthPredictionValues && MonthPredictionValues.length>0){
        MonthPredictionValues.forEach((value,index)=>{
          if(value){
            if(value.Value===''){
              kpi=kpi.setIn(['AdvanceSettings','PredictionSetting','MonthPredictionValues',index,'Value'],null)
            }
          }
          else {
            kpi=kpi.setIn(['AdvanceSettings','PredictionSetting','MonthPredictionValues',index,'Month'],period[index]._i);
            kpi=kpi.setIn(['AdvanceSettings','PredictionSetting','MonthPredictionValues',index,'Value'],null);
          }
        });
      }
    }

    return kpi.toJS()
  },

  getCalcPredicateParam(CustomerId,TagId,Year,QuotaType,value){
    let param={CustomerId,TagId,Year,QuotaType};
    if(QuotaType===Type.Quota){
      param.IndexValue=value
    }else {
      param.RatioValue=value
    }
    return param
  },

  dispose(){
    kpiInfo=Immutable.fromJS({});
    _KPIPeriod=null;
  },
  emitSuccessChange: function() {
    this.emit(KPI_SUCCESS_EVENT);
  },
  addSuccessListener: function(callback) {
    this.on(KPI_SUCCESS_EVENT, callback);
  },

  removeSuccessListener: function(callback) {
    this.removeListener(KPI_SUCCESS_EVENT, callback);
    this.dispose();
  },
  emitErrorChange: function(args) {
    this.emit(KPI_ERROR_EVENT,args);
  },
  addErrorListener: function(callback) {
    this.on(KPI_ERROR_EVENT, callback);
  },

  removeErrorListener: function(callback) {
    this.removeListener(KPI_ERROR_EVENT, callback);
    this.dispose();
  },

});

KPIStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_QUOTAPERIOD:
      KPIStore.setKPIPeriod(action.data);
      KPIStore.emitChange();
      break;
    case Action.GET_KPI_INFO_SUCCESS:
         KPIStore.setKpiInfo(action.data);
         KPIStore.emitChange();
         break;
    case Action.GET_KPI_CONFIGURED:
         KPIStore.setKpiConfigured(action.data);
         KPIStore.emitChange();
         break;
    case Action.GET_KPI_CONFIGURED_LOADING:
         KPIStore.setKpiConfiguredLoading();
         break;
    case Action.GET_KPI_CHART:
         KPIStore.setKPIChart(action.data);
         KPIStore.emitChange();
         break;
    case Action.GET_KPI_CHART_SUMMARY:
         KPIStore.setKPIChartSummary(action.data);
         KPIStore.emitChange();
         break;
    case Action.INIT_KPI_CHART_DATA:
         KPIStore._initKpiChartData();
         KPIStore.emitChange();
         break;
    case Action.MERGE_KPI_INFO:
         KPIStore.merge(action.data);
         KPIStore.emitChange();
         break;
    case Action.GET_QUOTAPERIOD_BY_YEAR:
         KPIStore.setYearQuotaperiod(action.data);
         KPIStore.emitChange();
         break;
    case Action.GET_CALC_VALUE:
        KPIStore.merge([{
          path:'AdvanceSettings.TargetMonthValues',
          value:Immutable.fromJS(action.data)
        }]);
        KPIStore.emitChange();
        break;
    case Action.GET_CALC_PREDICATE:
         KPIStore.merge([{
              path:'AdvanceSettings.PredictionSetting.MonthPredictionValues',
              value:Immutable.fromJS(action.data)
            }]);
            KPIStore.emitChange();
            break;
    case Action.IS_AUTO_CALCUL_ABLE:
        KPIStore.setHasHistory(action.data)
        KPIStore.emitChange();
        break;
    case Action.KPI_SUCCESS:
        KPIStore.emitSuccessChange();
        break;
    case Action.KPI_ERROR:
        KPIStore.emitErrorChange({
          title: action.title,
          content: action.content
        });
        break;

    default:
  }
});

export default KPIStore;
