'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import {
  Action
} from '../../constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
import moment from 'moment';
import {
  Map,
  List
} from 'immutable';
import assign from 'object-assign';
import {
  findLastIndex,
  last,
  first
} from 'lodash/array';
import {
  DataStatus,
  Type
} from '../../constants/actionType/KPI.jsx';
import CommonFuns from '../../util/Util.jsx';

// let j2d = DataConverter.JsonToDateTime,
//   d2j = DataConverter.DatetimeToJson;

// let j2d=CommonFuns.DataConverter.JsonToDateTime;
// CommonFuns.DataConverter.JsonToDateTime(paramsObj.startTime, false),
//
// function DatetimeToJson(datetime) {
//   var timezoneoffset = new Date().getTimezoneOffset() * 60000;
//   var l = datetime.getTime() + timezoneoffset;
//   return '\/Date(' + l + ')\/';
// }
// function JsonToDateTime(jsonstring, outintval) {
//   // outintval = typeof (outintval) === 'boolean' ? outintval : true;
//   jsonstring = jsonstring.substr(6, jsonstring.length - 8);
//   //
//   // var timezoneoffset = new Date().getTimezoneOffset() * 60000;
//   // var mydate;
//   // if (outintval) {
//   //   mydate = parseInt(jsonstring) + timezoneoffset;
//   // } else {
//   //   mydate = parseInt(jsonstring) + timezoneoffset;
//   //   mydate = new Date(mydate);
//   // }
//
//   return new Date(parseInt(jsonstring));
// }
function emptyMap() {
  return new Map();
}

function emptyList() {
  return new List();
}

function coverageRawToHighChartData(data) {
  if (!data) {
    return null;
  }
  return {
    year: data.year,
    data: data.IndicatorCharts.map(indicator => {
      return {
        type: indicator.IndicatorType,
        unit: indicator.UomId,
        name: indicator.IndicatorName,
        id: indicator.KpiId,
        lastMonthSaving: indicator.LstMonthSaving,
        actual: indicator.ActualMonthValues && indicator.ActualMonthValues.map( val => val.Value ),
        target: indicator.TargetMonthValues && indicator.TargetMonthValues.map( val => val.Value ),
        prediction: indicator.PredictionMonthValues && indicator.PredictionMonthValues.map( val => val.Value ),
        ratioMonth: indicator.RatioMonthValues && indicator.RatioMonthValues.map( val => val.Value ),
      }
    })
  }
}

let kpiInfo = emptyMap();
let _KPIPeriod = null,
  _customerCurrentYear = null,
  _KPIConfigured = null,
  _KPIChart = null,
  _KPIChartSummary = null,
  _KPIRank = null,
  _KPIChartLoading = false,
  _KPIChartSummaryLoading = false,
  _KPIRankLoading = false,
  _quotaperiodYear = null,
  _hasHistory = false;

function _init() {
  kpiInfo = emptyMap();
  _KPIPeriod = null;
  _customerCurrentYear = null;
  _KPIConfigured = null;
  _KPIChart = null;
  _KPIChartSummary = null;
  _KPIRank = null;
  _KPIChartLoading = false;
  _KPIChartSummaryLoading = false;
  _KPIRankLoading = false;
  _quotaperiodYear = null;
  _hasHistory = false;
}

let KPI_SUCCESS_EVENT = 'kpisuccess',
  KPI_ERROR_EVENT = 'kpierror',
  KPI_PRE_EVENT = 'kpipreevent';
const SingleKPIStore = assign({}, PrototypeStore, {

  DatetimeToJson(datetime) {
    // var timezoneoffset = new Date().getTimezoneOffset() * 60000;
    // var l = datetime.getTime();
    // return '\/Date(' + l + ')\/';
    return moment(datetime).format('YYYY-MM-DDTHH:mm:ss')
  },
  JsonToDateTime(jsonstring, outintval) {
    // outintval = typeof (outintval) === 'boolean' ? outintval : true;
    // jsonstring = jsonstring.substr(6, jsonstring.length - 8);
    // //
    // // var timezoneoffset = new Date().getTimezoneOffset() * 60000;
    // // var mydate;
    // // if (outintval) {
    // //   mydate = parseInt(jsonstring) + timezoneoffset;
    // // } else {
    // //   mydate = parseInt(jsonstring) + timezoneoffset;
    // //   mydate = new Date(mydate);
    // // }
    //
  // return parseInt(jsonstring);
    //
    return moment.utc(jsonstring).valueOf();
  },

  setKpiInfo(data) {
    kpiInfo = Immutable.fromJS(data);
  },

  getKpiInfo() {
    return kpiInfo;
  },

  setKPIPeriod(data) {
    _KPIPeriod = data;
  },

  getKPIPeriod() {
    return assign({}, _KPIPeriod);
  },

  setKpiConfigured(value) {
    _KPIConfigured = value;
  },

  getKPIConfigured() {
    return _KPIConfigured;
  },

  getKPIDefaultYear() {
    let years = this.getKPIConfigured();
    if (!years || years.length === 0) {
      return null;
    }
    if (years.length === 1) {
      return years[0];
    }
    let thisYear = this.getCustomerCurrentYear();
    if (years[0] * 1 > thisYear) {
      return years[0];
    }

    return years[findLastIndex(years, year => year <= thisYear)];
  },

  hasNextYear(year) {
    let years = this.getKPIConfigured();
    return last(years) * 1 > year;
  },

  hasLastYear(year) {
    let years = this.getKPIConfigured();
    return first(years) * 1 < year;
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

  setKPIRank(data) {
    _KPIRankLoading = false;
    _KPIRank = data;
  },
  getKPIRank() {
    if( !(_KPIRank instanceof Array) ) {
      return [_KPIRank];
    }
    return _KPIRank;
  },
  _initKpiChartData() {
    _KPIChartSummaryLoading = true;
    _KPIChartLoading = true;
    _KPIRankLoading = true;
    _quotaperiodYear = null;
  },
  _emptyKpiChartData() {
    _KPIChartSummaryLoading = false;
    _KPIChartLoading = false;
    _KPIRankLoading = false;
    this.setKPIChart(null);
    this.setKPIChartSummary(null);
    this.setKPIRank(null);
  },

  chartReady() {
    return !(_KPIChartSummaryLoading || _KPIChartLoading || _KPIRankLoading)
  },

  setYearQuotaperiod(data) {
    _quotaperiodYear = data.map(el => {
      return moment(this.JsonToDateTime(el))
    });
  },

  getYearQuotaperiod() {
    return _quotaperiodYear;
  },


  setCustomerCurrentYear(data) {
    _customerCurrentYear = data;
  },

  getCustomerCurrentYear() {
    return _customerCurrentYear;
  },

  clearParam() {
    if (!kpiInfo.get('AdvanceSettings')) return;
    let {
      Year,
      IndicatorType,
      PredictionSetting
    } = kpiInfo.get('AdvanceSettings').toJS();
    let {
      KpiSettingsId
    } = PredictionSetting ? PredictionSetting : {};
    kpiInfo = kpiInfo.set('AdvanceSettings', Immutable.fromJS({
      Year,
      IndicatorType,
      PredictionSetting: {
        KpiSettingsId
      }
    }));
    // kpiInfo=kpiInfo.setIn(['AdvanceSettings','Year'],Year);
    // kpiInfo=kpiInfo.setIn(['AdvanceSettings','IndicatorType'],IndicatorType);
  },

  merge(data) {
    let refresh = false;
    data.forEach(el => {
      let {
        path,
        status,
        value
      } = el;
      let paths = path.split(".");
      refresh = refresh || path.indexOf('IndicatorType') > -1 || path.indexOf('ActualTagName') > -1;
      if (status === DataStatus.ADD) {
        let {
          index,
          length
        } = el;
        var children = kpiInfo.getIn(paths);
        if (length) {
          if (!children) {
            children = emptyList();
            children = children.setSize(length);
          }
          if (Immutable.List.isList(children)) {
            value = children.setIn([index], value);
          }
        } else {
          if (!children) {
            children = emptyList();
          }
          if (Immutable.List.isList(children)) {
            value = children.push(value);
          }
        }

        kpiInfo = kpiInfo.setIn(paths, value);
      } else if (status === DataStatus.DELETE) {
        kpiInfo = kpiInfo.deleteIn(paths);
      } else {
        kpiInfo = kpiInfo.setIn(paths, value);
      }
    })
    if (refresh) {
      this.clearParam();
    }
  },

  setHasHistory(data) {
    _hasHistory = data.has;
    this.merge([{
      path: 'AdvanceSettings.Year',
      value: data.year
    }])
  },

  getHasHistory() {
    return _hasHistory;
  },

  getTagTable(TagSavingRates) {
    var tags = [];
    if (TagSavingRates) {
      tags = TagSavingRates.map(rate => {
        return rate.TagName
      })
    }
    tags.unshift(I18N.Setting.Tag.Tag);
    return tags
  },

  getRatesTable(TagSavingRates) {
    var rates = [];
    if (TagSavingRates) {
      rates = TagSavingRates.map(rate => {
        return rate.SavingRate
      })
    }
    rates.unshift(I18N.Setting.KPI.Parameter.SavingRates)
    return rates
  },

  _getYearList() {
    let currentYear = (new Date()).getFullYear(),
      yearList = [];
    for (var i = currentYear + 1; i >= currentYear - 3; i--) {
      yearList.push({
        payload: i,
        text: i
      })
    }
    return yearList
  },

  validateQuota(value = '') {
    if (value === null) {
      value = ''
    }
    value = value === 0 || value ? value + '' : value;
    let temp = parseFloat(value);
    if (!value || value === '-') return true;
    if (isNaN(temp)) return false;
    if ((temp + '').length !== value.length || temp < 0 || value.indexOf('.') > -1) return false;
    return true

    // if(typeof value !== 'number' && !value) return false; //empty string, null, undefined
    //
    // if(isNaN(parseFloat(value))) return false; //not a number
    //
    // if(parseFloat(value) < 0) return false; //negative value
    //
    // if(!value.toString().match(/\.\d$/)) return false; // only 1 digit
    //
    // return true;




  },

  validateSavingRate(value = '') {
    if (value === null) {
      value = ''
    }
    value = value === 0 || value ? value + '' : value;
    let temp = parseFloat(value),
      index = value.indexOf('.');
    if (!value || value === '-') return true;
    if (isNaN(temp)) return false;
    if (value.slice(index + 1, value.length) && parseInt(value.slice(index + 1, value.length)) !== 0 && (temp + '').length !== value.length) return false;
    if (temp < -100 || temp > 100) return false;
    if (index > -1 && value.length - index > 2) return false;
    return true
  },

  validateKpiInfo(kpi) {
    var validDate = true;
    var {
      IndicatorName,
      ActualTagName,
      AdvanceSettings
    } = kpi.toJS();

    var {
      AnnualQuota,
      AnnualSavingRate,
      TargetMonthValues,
      PredictionSetting
    } = AdvanceSettings || {};

    if (!IndicatorName || IndicatorName === '') return false;

    if (!ActualTagName || ActualTagName === '') return false;

    if (AnnualQuota && !this.validateQuota(AnnualQuota)) return false;

    if (AnnualSavingRate && !this.validateSavingRate(AnnualSavingRate)) return false;

    if (TargetMonthValues && TargetMonthValues.length > 0) {
      TargetMonthValues.forEach(value => {
        if (value && !this.validateQuota(value.Value)) {
          validDate = false
        }
      });
    }

    if (PredictionSetting) {
      let {
        TagSavingRates,
        MonthPredictionValues
      } = PredictionSetting;
      if (TagSavingRates && TagSavingRates.length > 0) {
        TagSavingRates.forEach(rate => {
          if (rate && !this.validateSavingRate(rate.SavingRate)) {
            validDate = false
          }
        });
      }
      if (MonthPredictionValues && MonthPredictionValues.length > 0) {
        MonthPredictionValues.forEach(value => {
          if (value && !this.validateQuota(value.Value)) {
            validDate = false
          }
        });
      }
    }
    return validDate
  },

  transit(kpi) {
    var period = this.getYearQuotaperiod();
    var {
      AdvanceSettings
    } = kpi.toJS();

    var {
      TargetMonthValues,
      PredictionSetting
    } = AdvanceSettings || {};
    for (let index = 0; index < 12; index++) {
      if (!TargetMonthValues) {
        TargetMonthValues = emptyList();
        TargetMonthValues = TargetMonthValues.setSize(12);
        kpi = kpi.setIn(['AdvanceSettings', 'TargetMonthValues'], TargetMonthValues);
        TargetMonthValues = TargetMonthValues.toJS()
      }
      let value = TargetMonthValues[index];
      if (value) {
        if (value.Value === '') {
          kpi = kpi.setIn(['AdvanceSettings', 'TargetMonthValues', index, 'Value'], null)
        }
      } else {
        kpi = kpi.setIn(['AdvanceSettings', 'TargetMonthValues', index], Immutable.fromJS({
          Month: this.DatetimeToJson(period[index]._d),
          Value: null
        }));
      }
    }


    if (!PredictionSetting) {
      PredictionSetting = {};
      kpi = kpi.setIn(['AdvanceSettings', 'PredictionSetting'], emptyMap());
    }

    let {
      MonthPredictionValues
    } = PredictionSetting;

    for (let index = 0; index < 12; index++) {
      if (!MonthPredictionValues) {
        MonthPredictionValues = emptyList();
        MonthPredictionValues = MonthPredictionValues.setSize(12);
        kpi = kpi.setIn(['AdvanceSettings', 'PredictionSetting', 'MonthPredictionValues'], MonthPredictionValues);
        MonthPredictionValues = MonthPredictionValues.toJS()
      }
      let value = MonthPredictionValues[index];
      if (value) {
        if (value.Value === '') {
          kpi = kpi.setIn(['AdvanceSettings', 'PredictionSetting', 'MonthPredictionValues', index, 'Value'], null)
        }
      } else {
        kpi = kpi.setIn(['AdvanceSettings', 'PredictionSetting', 'MonthPredictionValues', index], Immutable.fromJS({
          Month: this.DatetimeToJson(period[index]._d),
          Value: null
        }));
      }
    }




    return kpi.toJS()
  },

  getCalcPredicateParam(CustomerId, TagId, Year, QuotaType, value) {
    let param = {
      CustomerId,
      TagId,
      Year,
      QuotaType
    };
    if (QuotaType === Type.Quota) {
      param.IndexValue = value
    } else {
      param.RatioValue = value
    }
    return param
  },

  cleanActuality() {
    // this.setCustomerCurrentYear(null);
    _init();
  },

  dispose() {
    kpiInfo = Immutable.fromJS({});
    _KPIPeriod = null;
  },
  emitSuccessChange: function (args) {
    this.emit(KPI_SUCCESS_EVENT, args);
  },
  addSuccessListener: function (callback) {
    this.on(KPI_SUCCESS_EVENT, callback);
  },

  removeSuccessListener: function (callback) {
    this.removeListener(KPI_SUCCESS_EVENT, callback);
    this.dispose();
  },
  emitErrorChange: function (args) {
    this.emit(KPI_ERROR_EVENT, args);
  },
  addErrorListener: function (callback) {
    this.on(KPI_ERROR_EVENT, callback);
  },

  removeErrorListener: function (callback) {
    this.removeListener(KPI_ERROR_EVENT, callback);
    this.dispose();
  },
  emitPreChange: function (args) {
    this.emit(KPI_PRE_EVENT, args);
  },
  addPreListener: function (callback) {
    this.on(KPI_PRE_EVENT, callback);
  },

  removePreListener: function (callback) {
    this.removeListener(KPI_PRE_EVENT, callback);
    this.dispose();
  },

});

SingleKPIStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.type) {
    case Action.GET_QUOTAPERIOD:
      SingleKPIStore.setKPIPeriod(action.data);
      SingleKPIStore.emitChange();
      break;
    case Action.GET_KPI_INFO_SUCCESS:
      SingleKPIStore.setKpiInfo(action.data);
      SingleKPIStore.emitChange();
      break;
    case Action.GET_KPI_CONFIGURED:
      SingleKPIStore.setKpiConfigured(action.data);
      SingleKPIStore.emitChange();
      break;
    case Action.GET_KPI_CHART:
      SingleKPIStore.setKPIChart(action.data);
      SingleKPIStore.emitChange();
      break;
    case Action.GET_KPI_CHART_SUMMARY:
      SingleKPIStore.setKPIChartSummary(action.data);
      SingleKPIStore.emitChange();
      break;
    case Action.INIT_KPI_CHART_DATA:
      SingleKPIStore._initKpiChartData();
      SingleKPIStore.emitChange();
      break;
    case Action.EMPTY_KPI_CHART_DATA:
      SingleKPIStore._emptyKpiChartData();
      SingleKPIStore.emitChange();
      break;
    case Action.MERGE_KPI_SINGLE_INFO:
      SingleKPIStore.merge(action.data);
      SingleKPIStore.emitChange();
      break;
    case Action.GET_QUOTAPERIOD_BY_YEAR:
      SingleKPIStore.setYearQuotaperiod(action.data);
      SingleKPIStore.emitChange();
      break;
    case Action.GET_CALC_VALUE:
      SingleKPIStore.merge([{
        path: 'AdvanceSettings.TargetMonthValues',
        value: Immutable.fromJS(action.data)
      }]);
      SingleKPIStore.emitChange();
      break;
    case Action.GET_CALC_PREDICATE:
      SingleKPIStore.merge([{
        path: 'AdvanceSettings.PredictionSetting.MonthPredictionValues',
        value: Immutable.fromJS(action.data)
      }]);
      SingleKPIStore.emitChange();
      break;
    case Action.IS_AUTO_CALCUL_ABLE:
      SingleKPIStore.setHasHistory(action.data)
      SingleKPIStore.emitChange();
      break;
    case Action.KPI_SUCCESS:
      SingleKPIStore.emitSuccessChange(action.year);
      break;
    case Action.KPI_ERROR:
      SingleKPIStore.emitErrorChange({
        title: action.title,
        content: action.content
      });
      break;
    case Action.NOT_NEED_RANK:
      SingleKPIStore.setKPIRank(null);
      break;
    case Action.CUSTOMER_CURRENT_YEAR:
      SingleKPIStore.setCustomerCurrentYear(action.data);
      SingleKPIStore.emitPreChange(action.year);
      break;
    case Action.GET_GROUP_KPI_BUILDING_RANK:
    case Action.GET_BUILDING_RANK:
    case Action.GET_GROUP_RANK:
      SingleKPIStore.setKPIRank(action.data);
      SingleKPIStore.emitChange();
      break;
    case Action.CLEAN_ACTUALITY:
      SingleKPIStore.cleanActuality();
      break;

    default:
  }
});

export default SingleKPIStore;
