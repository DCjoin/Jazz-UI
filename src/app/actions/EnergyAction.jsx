'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import CommonFuns from '../util/Util.jsx';
import { Action } from '../constants/actionType/Energy.jsx';
import Ajax from '../ajax/ajax.jsx';

let {DataConverter, isNumber} = CommonFuns;

let getTagIdsFromTagOptions = function(tagOptions) {
  let tagIds = [];
  for (let i = 0, len = tagOptions.length; i < len; i++) {
    tagIds.push(tagOptions[i].tagId);
  }
  return tagIds;
};


let EnergyAction = {
  //for select tags from taglist and click search button.
  getPieEnergyData(date, step, tagOptions, relativeDate) {
    var timeRange = date;

    var tagIds = getTagIdsFromTagOptions(tagOptions);
    var submitParams = {
      tagIds: tagIds,
      viewOption: {
        DataUsageType: 4,
        IncludeNavigatorData: false,
        Step: 2,
        TimeRanges: timeRange
      }
    };

    AppDispatcher.dispatch({
      type: Action.GET_ENERGY_DATA_LOADING,
      submitParams: submitParams,
      tagOptions: tagOptions,
      relativeDate: relativeDate
    });
    let path = '/Energy/AggregateTagsData';
    if (timeRange.length > 1) {
      path = '/Energy/AggregateTimeSpansData';
    }

    Ajax.post(path, {
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getEnergyTrendChartData(date, step, tagOptions, relativeDate, weatherOption, widgetId) {
    var timeRange = date;

    var tagIds = getTagIdsFromTagOptions(tagOptions);
    var submitParams = {
      tagIds: tagIds,
      viewOption: {
        DataUsageType: 1,
        IncludeNavigatorData: true,
        Step: step,
        TimeRanges: timeRange
      }
    };
    if (weatherOption && weatherOption.IncludeTempValue)
      submitParams.viewOption.IncludeTempValue = true;
    if (weatherOption && weatherOption.IncludeHumidityValue)
      submitParams.viewOption.IncludeHumidityValue = true;

    AppDispatcher.dispatch({
      type: Action.GET_ENERGY_DATA_LOADING,
      submitParams: submitParams,
      tagOptions: tagOptions,
      relativeDate: relativeDate,
      widgetId,
    });
    // console.log('/Energy/GetTagsData');

    Ajax.post('/Energy/GetTagsData', {
      avoidDuplicate:true,
      tag:submitParams.tagIds,
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams,
          widgetId,
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams,
          widgetId,
        });
      }
    });
  },
  getPieCostData(date, step, selectedList, relativeDate) {
    var timeRange = date;
    var commodityList = selectedList.commodityList;
    var hierarchyNode = selectedList.hierarchyNode;
    var hierarchyId = hierarchyNode.hierId;
    var commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
    var dimNode = selectedList.dimNode;
    var viewAssociation = CommonFuns.getViewAssociation(hierarchyId, dimNode);
    var submitParams = {
      commodityIds: commodityIds,
      viewAssociation: viewAssociation,
      viewOption: {
        DataUsageType: 4,
        IncludeNavigatorData: false,
        //Step: step,
        TimeRanges: timeRange
      }
    };

    AppDispatcher.dispatch({
      type: Action.GET_COST_DATA_LOADING,
      submitParams: submitParams,
      selectedList: selectedList,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy/AggregateCostData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getCostTrendChartData(date, step, selectedList, relativeDate) {
    var timeRange = date;
    var commodityList = selectedList.commodityList;
    var hierarchyNode = selectedList.hierarchyNode;
    var hierarchyId = hierarchyNode.hierId;
    var commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
    var dimNode = selectedList.dimNode;
    var viewAssociation = CommonFuns.getViewAssociation(hierarchyId, dimNode);

    var submitParams = {
      commodityIds: commodityIds,
      viewAssociation: viewAssociation,
      viewOption: {
        DataUsageType: 1,
        IncludeNavigatorData: true,
        Step: step,
        TimeRanges: timeRange
      }
    };

    AppDispatcher.dispatch({
      type: Action.GET_COST_DATA_LOADING,
      submitParams: submitParams,
      selectedList: selectedList,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy/GetCostData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getElectricityPieCostData(date, step, selectedList, relativeDate) {
    var timeRange = date;
    var commodityList = selectedList.commodityList;
    var hierarchyNode = selectedList.hierarchyNode;
    var hierarchyId = hierarchyNode.hierId;
    var commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
    var dimNode = selectedList.dimNode;
    var viewAssociation = CommonFuns.getViewAssociation(hierarchyId, dimNode);

    var submitParams = {
      commodityIds: commodityIds,
      viewAssociation: viewAssociation,
      viewOption: {
        DataUsageType: 3,
        IncludeNavigatorData: false,
        //Step: step,
        TimeRanges: timeRange
      }
    };

    AppDispatcher.dispatch({
      type: Action.GET_COST_DATA_LOADING,
      submitParams: submitParams,
      selectedList: selectedList,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy/AggregateElectricityCostData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getElectricityCostTrendChartData(date, step, selectedList, relativeDate) {
    var timeRange = date;
    var commodityList = selectedList.commodityList;
    var hierarchyNode = selectedList.hierarchyNode;
    var hierarchyId = hierarchyNode.hierId;
    var commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
    var dimNode = selectedList.dimNode;
    var viewAssociation = CommonFuns.getViewAssociation(hierarchyId, dimNode);
    var submitParams = {
      commodityIds: commodityIds,
      viewAssociation: viewAssociation,
      viewOption: {
        DataUsageType: 3,
        IncludeNavigatorData: true,
        Step: step,
        TimeRanges: timeRange
      }
    };

    AppDispatcher.dispatch({
      type: Action.GET_COST_DATA_LOADING,
      submitParams: submitParams,
      selectedList: selectedList,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy/GetElectricityCostData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getEnergyRawData(date, step, tagOptions, relativeDate, pageNum, pageSize) {
    var timeRange = date;
    var pageIdx = isNumber(pageNum) ? pageNum : 1;
    var tagIds = getTagIdsFromTagOptions(tagOptions);
    var submitParams = {
      tagIds: tagIds,
      viewOption: {
        DataOption: {
          OriginalValue: true,
          WithoutAdditionalValue: true
        },
        PagingOrder: {
          PageIdx: pageIdx,
          PageSize: pageSize || 20
        },
        DataUsageType: null,
        IncludeNavigatorData: false,
        Step: step,
        TimeRanges: timeRange
      }
    };

    AppDispatcher.dispatch({
      type: Action.GET_ENERGY_DATA_LOADING,
      submitParams: submitParams,
      tagOptions: tagOptions,
      relativeDate: relativeDate
    });
    // console.log('/Energy/GetTagsData');
    Ajax.post('/Energy/GetTagsData', {
      avoidDuplicate:true,
      tag:submitParams.tagIds,
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getRatioTrendChartData(timeRange, step, tagOptions, ratioType, relativeDate, benchmarkOption) {
    var tagIds = getTagIdsFromTagOptions(tagOptions);
    var submitParams = {
      tagIds: tagIds,
      ratioType: ratioType,
      benchmarkOption: benchmarkOption || null,
      viewOption: {
        DataUsageType: 1,
        IncludeNavigatorData: true,
        Step: step,
        TimeRanges: timeRange,
        DataOption: {
          RatioType: ratioType
        }
      }
    };

    AppDispatcher.dispatch({
      type: Action.GET_RATIO_DATA_LOADING,
      submitParams: submitParams,
      tagOptions: tagOptions,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy/RatioGetTagsData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_RATIO_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_RATIO_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getUnitEnergyTrendChartData(timeRange, step, tagOptions, unitType, relativeDate, benchmarkOption) {
    var tagIds = getTagIdsFromTagOptions(tagOptions);
    var submitParams = {
      tagIds: tagIds,
      benchmarkOption: benchmarkOption || null,
      viewOption: {
        DataUsageType: 1,
        IncludeNavigatorData: true,
        Step: step,
        TimeRanges: timeRange,
        DataOption: {
          UnitType: unitType
        }
      }
    };

    AppDispatcher.dispatch({
      type: Action.GET_ENERGY_DATA_LOADING,
      submitParams: submitParams,
      tagOptions: tagOptions,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy/GetEnergyUsageUnitData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getUnitCostTrendChartData(timeRange, step, selectedList, unitType, relativeDate, benchmarkOption) {
    var commodityList = selectedList.commodityList;
    var hierarchyNode = selectedList.hierarchyNode;
    var hierarchyId = hierarchyNode.hierId;
    var commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
    var dimNode = selectedList.dimNode;
    var viewAssociation = CommonFuns.getViewAssociation(hierarchyId, dimNode);
    var submitParams = {
      commodityIds: commodityIds,
      viewAssociation: viewAssociation,
      benchmarkOption: benchmarkOption || null,
      viewOption: {
        DataUsageType: 1,
        IncludeNavigatorData: true,
        Step: step,
        TimeRanges: timeRange,
        DataOption: {
          UnitType: unitType
        }
      }
    };

    AppDispatcher.dispatch({
      type: Action.GET_COST_DATA_LOADING,
      submitParams: submitParams,
      selectedList: selectedList,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy/GetCostUnitData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getLabelChartData(viewOption, tagOptions, benchmarkOption, labelingType) {
    var tagIds = getTagIdsFromTagOptions(tagOptions);

    var submitParams = {
      tagIds: tagIds,
      viewOption: viewOption,
      benchmarkOption: benchmarkOption,
      labelingType: labelingType
    };

    AppDispatcher.dispatch({
      type: Action.GET_LABEL_DATA_LOADING,
      submitParams: submitParams,
      tagOptions: tagOptions,
      labelingType: labelingType
    });

    Ajax.post('/Energy/LabelingGetTagsData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_LABEL_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_LABEL_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getEnergyRankChartData(timeRanges, rankType, selectedList, relativeDate) {
    var commodityNode = selectedList.commodityNode;
    var hierarchyList = selectedList.hierarchyList;
    var hierarchyIds = CommonFuns.getHierarchyIdsFromList(hierarchyList);
    var commodityIds = [];
    commodityIds.push(commodityNode.Id);

    var submitParams = {
      hierarchyIds: hierarchyIds,
      commodityIds: commodityIds,
      rankType: rankType,
      viewOption: {
        TimeRanges: timeRanges
      }
    };

    AppDispatcher.dispatch({
      type: Action.GET_RANK_DATA_LOADING,
      submitParams: submitParams,
      selectedList: selectedList,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy/RankingEnergyUsageData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_RANK_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_RANK_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getCarbonRankChartData(timeRanges, rankType, selectedList, relativeDate, destination) {
    var commodityNode = selectedList.commodityNode;
    var hierarchyList = selectedList.hierarchyList;
    var hierarchyIds = CommonFuns.getHierarchyIdsFromList(hierarchyList);
    var commodityIds = [];
    commodityIds.push(commodityNode.Id);


    var submitParams = {
      hierarchyIds: hierarchyIds,
      destination: destination,
      commodityIds: commodityIds,
      rankType: rankType,
      viewOption: {
        TimeRanges: timeRanges
      }
    };

    AppDispatcher.dispatch({
      type: Action.GET_RANK_DATA_LOADING,
      submitParams: submitParams,
      selectedList: selectedList,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy/RankingCarbonData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_RANK_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_RANK_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getCostRankChartData(timeRanges, rankType, selectedList, relativeDate, destination) {
    var commodityNode = selectedList.commodityNode;
    var hierarchyList = selectedList.hierarchyList;
    var hierarchyIds = CommonFuns.getHierarchyIdsFromList(hierarchyList);
    var commodityIds = [];
    commodityIds.push(commodityNode.Id);


    var submitParams = {
      hierarchyIds: hierarchyIds,
      commodityIds: commodityIds,
      rankType: rankType,
      viewOption: {
        TimeRanges: timeRanges
      }
    };

    AppDispatcher.dispatch({
      type: Action.GET_RANK_DATA_LOADING,
      submitParams: submitParams,
      selectedList: selectedList,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy/RankingCostData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(energyData) {
        AppDispatcher.dispatch({
          type: Action.GET_RANK_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_RANK_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  setTimeRangeByNavigator(startTime, endTime) {
    AppDispatcher.dispatch({
      type: Action.SET_ENERGY_TIME_RANGE,
      startTime: startTime,
      endTime: endTime
    });
  },
  setCostTimeRangeByNavigator(startTime, endTime) {
    AppDispatcher.dispatch({
      type: Action.SET_COST_TIME_RANGE,
      startTime: startTime,
      endTime: endTime
    });
  },
  setRatioTimeRangeByNavigator(startTime, endTime) {
    AppDispatcher.dispatch({
      type: Action.SET_RATIO_TIME_RANGE,
      startTime: startTime,
      endTime: endTime
    });
  }
};
module.exports = EnergyAction;
