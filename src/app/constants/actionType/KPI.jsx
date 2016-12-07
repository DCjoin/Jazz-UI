import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_QUOTAPERIOD:null,
    GET_KPI_DIMENSION_SUCCESS:null,
    GET_KPI_TAGS_SUCCESS:null,
    GET_KPI_INFO_SUCCESS:null,
    GET_KPI_CONFIGURED:null,
    GET_KPI_CHART:null,
    INIT_KPI_CHART_DATA:null,
    MERGE_KPI_INFO:null,
    GET_QUOTAPERIOD_BY_YEAR:null,
    GET_CALC_VALUE:null,
    GET_CALC_PREDICATE:null,
    IS_AUTO_CALCUL_ABLE:null,
    KPI_SUCCESS:null,
    KPI_ERROR:null,
    GET_KPI_GROUP_CONTINUOUS:null,
    GET_KPI_GROUP_BY_YEAR:null,
  }),

  Type:{
    Quota:1,
    SavingRate:2,
    MonthValue:3,
    MonthPrediction:4
  },
  DataStatus:keyMirror({
    ADD:null,
    DELETE:null
  }),
  SettingStatus:keyMirror({
    New:null,
    Edit:null,
    Prolong:null
  })

};
