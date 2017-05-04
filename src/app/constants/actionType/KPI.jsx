import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_QUOTAPERIOD:null,
    CUSTOMER_CURRENT_YEAR:null,
    GET_KPI_DIMENSION_SUCCESS:null,
    GET_KPI_TAGS_SUCCESS:null,
    GET_KPI_INFO_SUCCESS:null,
    GET_KPI_CONFIGURED:null,
    GET_KPI_CHART:null,
    GET_KPI_CHART_SUMMARY:null,
    INIT_KPI_CHART_DATA:null,
    EMPTY_KPI_CHART_DATA:null,
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
    GET_GROUP_CLAC_SUM_VALUE:null,
    NOT_NEED_RANK:null,
    GET_GROUP_KPI_BUILDING_RANK:null,
    GET_BUILDING_RANK:null,
    GET_GROUP_RANK:null,
    MERGE_GROUP_RANKING:null,
    GET_GROUP_RANKING:null,
    SET_GROUP_RANKING:null,
    GET_RANK_RECORD:null,
    GET_KPI_REPORT_TEMPLATE_LIST_SUCCESS:null,
    GET_KPI_REPORT_TEMPLATE_LIST_ERROR:null,
    DELETE_KPI_TEMPLATE_SUCCESS:null,
    GET_KPI_REPORT_TAG_DATA_SUCCESS:null,
    GET_SELECTED_KPI_REPORT_TAG_DATA_SUCCESS:null,
    SAVE_KPI_REPORT_SUCCESS:null,
    SAVE_KPI_REPORT_ERROR:null,
    CLEAN_ACTUALITY:null,
    GET_KPI_RANK_BY_YEAR:null,
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
  },
  UnitType:{
    TotalPersonUnit:2,
    TotalAreaUnit:3,
    CoolingAreaUnit:4,
    HeatingAreaUnit:5,
    OrignValue:6,
    TotalRoomUnit:7,
    UsedRoomUnit:8,
    TotalBedUnit:9,
    UsedBedUnit:10,
    MonthRatio:11,
    None:12,
    /// 逐月使用量
    /// </summary>
    MonthScale: 13,
  },
  RankType:{
    GroupRank:1,
    TopRank:2,

  }

};
