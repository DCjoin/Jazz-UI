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
    MERGE_KPI_SINGLE_INFO:null,
    GET_QUOTAPERIOD_BY_YEAR:null,
    GET_CALC_VALUE:null,
    GET_CALC_PREDICATE:null,
    IS_AUTO_CALCUL_ABLE:null,
    KPI_SUCCESS:null,
    KPI_ERROR:null,
    GROUP_SETTINGS_LIST:null,
    GET_KPI_GROUP_CONTINUOUS:null,
    GET_KPI_GROUP_BY_YEAR:null,
    GET_KPI_BUILDING_LIST_BY_CUSTOMER_ID:null,
    GET_KPI_GROUP_SETTINGS:null,
    MERGE_KPI_GROUP_INFO:null,
    KPI_GROUP_SUCCESS:null,
    KPI_GROUP_ERROR:null,
    GET_GROUP_KPIS:null,
    SET_MONTH_KPI_INFO:null,
    MERGE_MONTH_KPI_INFO:null,
    GET_GROUP_CLAC_SUM_VALUE:null
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
  }),
  KpiType:{
    single:1,
    group:2
  },
  KpiSettingsModel:{
    "Id": null,
    "KpiType": null,
    "CustomerId": null,
    "HierarchyId": null,
    "HierarchyName": null,
    "IndicatorName": null,
    "ActualTagId": null,
    "ActualTagName": null,
    "UomId": null,
    "CommodityId":null,
    "AdvanceSettings": {
      "Year": null,
      "IndicatorType": null,
      "AnnualQuota": null,
      "AnnualSavingRate": null,
      "TargetTagId": null,
      "TargetMonthValues": [
        {
          "Month": null,
          "Value": null,
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        }
      ],
    "PredictionSetting": {
      "PredictionTagId": null,
      "KpiSettingsId": null,
      "TagSavingRates": [],
      "MonthPredictionValues": [
        {
          "Month": null,
          "Value": null,
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        },
        {
          "Month": null,
          "Value": null
        }
    ]
  }
  }
  }

};
