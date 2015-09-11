'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import CommonFuns from '../util/Util.jsx';
import {Action} from '../constants/actionType/Energy.jsx';
import {DataConverter, isNumber} from '../util/Util.jsx';
import Ajax from '../ajax/ajax.jsx';


let getTagIdsFromTagOptions = function(tagOptions){
  let tagIds = [];
  for(let i=0,len=tagOptions.length; i<len; i++){
    tagIds.push(tagOptions[i].tagId);
  }
  return tagIds;
};


let EnergyAction = {
 //for select tags from taglist and click search button.
  getPieEnergyData(date, step, tagOptions, relativeDate){
    var timeRange = date;

    var tagIds = getTagIdsFromTagOptions(tagOptions);
    var submitParams = { tagIds:tagIds,
                         viewOption:{ DataUsageType: 4,
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
    let path = '/Energy.svc/AggregateTagsData';
    if(timeRange.length > 1){
      path = '/Energy.svc/AggregateTimeSpansData';
    }

    Ajax.post(path, {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
           type: Action.GET_ENERGY_DATA_SUCCESS,
           energyData: energyData,
           submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
           type: Action.GET_ENERGY_DATA_ERROR,
           errorText: res.text,
           submitParams: submitParams
        });
      }
    });
  },
  getEnergyTrendChartData(date, step, tagOptions, relativeDate, weatherOption){
    var timeRange = date;

    var tagIds = getTagIdsFromTagOptions(tagOptions);
    var submitParams = { tagIds:tagIds,
                         viewOption:{ DataUsageType: 1,
                                      IncludeNavigatorData: true,
                                      Step: step,
                                      TimeRanges: timeRange
                                   }
                       };
    if(weatherOption && weatherOption.IncludeTempValue) submitParams.viewOption.IncludeTempValue = true;
    if(weatherOption && weatherOption.IncludeHumidityValue) submitParams.viewOption.IncludeHumidityValue = true;

    AppDispatcher.dispatch({
      type: Action.GET_ENERGY_DATA_LOADING,
      submitParams: submitParams,
      tagOptions: tagOptions,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy.svc/GetTagsData', {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getPieCostData(date, step, selectedList, relativeDate){
    var timeRange = date;
    var commodityList = selectedList.commodityList;
    var hierarchyNode = selectedList.hierarchyNode;
    var hierarchyId = hierarchyNode.hierId;
    var commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
    var dimNode = selectedList.dimNode;
    var viewAssociation = CommonFuns.getViewAssociation(hierarchyId, dimNode);
    var submitParams = { commodityIds:commodityIds,
                         viewAssociation:viewAssociation,
                         viewOption:{ DataUsageType: 4,
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

    Ajax.post('/Energy.svc/AggregateCostData', {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getCostTrendChartData(date, step, selectedList, relativeDate){
    var timeRange = date;
    var commodityList = selectedList.commodityList;
    var hierarchyNode = selectedList.hierarchyNode;
    var hierarchyId = hierarchyNode.hierId;
    var commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
    var dimNode = selectedList.dimNode;
    var viewAssociation = CommonFuns.getViewAssociation(hierarchyId, dimNode);

    var submitParams = { commodityIds:commodityIds,
                         viewAssociation:viewAssociation,
                         viewOption:{ DataUsageType: 1,
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

    Ajax.post('/Energy.svc/GetCostData', {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getElectricityPieCostData(date, step, selectedList, relativeDate){
    var timeRange = date;
    var commodityList = selectedList.commodityList;
    var hierarchyNode = selectedList.hierarchyNode;
    var hierarchyId = hierarchyNode.hierId;
    var commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
    var dimNode = selectedList.dimNode;
    var viewAssociation = CommonFuns.getViewAssociation(hierarchyId, dimNode);

    var submitParams = { commodityIds:commodityIds,
                         viewAssociation:viewAssociation,
                         viewOption:{ DataUsageType: 3,
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

    Ajax.post('/Energy.svc/AggregateElectricityCostData', {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getElectricityCostTrendChartData(date, step, selectedList, relativeDate){
    var timeRange = date;
    var commodityList = selectedList.commodityList;
    var hierarchyNode = selectedList.hierarchyNode;
    var hierarchyId = hierarchyNode.hierId;
    var commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
    var dimNode = selectedList.dimNode;
    var viewAssociation = CommonFuns.getViewAssociation(hierarchyId, dimNode);
    var submitParams = { commodityIds:commodityIds,
                         viewAssociation:viewAssociation,
                         viewOption:{ DataUsageType: 3,
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

    Ajax.post('/Energy.svc/GetElectricityCostData', {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getEnergyRawData(date, step, tagOptions, relativeDate, pageNum, pageSize){
    var timeRange = date;
    var pageIdx = isNumber(pageNum)? pageNum:1;
    var tagIds = getTagIdsFromTagOptions(tagOptions);
    var submitParams = { tagIds:tagIds,
                         viewOption:{
                           DataOption:{
                             OriginalValue: true,
                             WithoutAdditionalValue: true
                           },
                           PagingOrder:{
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

    Ajax.post('/Energy.svc/GetTagsData', {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getRatioTrendChartData(timeRange, step, tagOptions, ratioType, relativeDate, benchmarkOption){
    var tagIds = getTagIdsFromTagOptions(tagOptions);
    var submitParams = { tagIds:tagIds,
                         ratioType:ratioType,
                         benchmarkOption: benchmarkOption || null,
                         viewOption:{ DataUsageType: 1,
                                      IncludeNavigatorData: true,
                                      Step: step,
                                      TimeRanges: timeRange,
                                      DataOption:{
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

    Ajax.post('/Energy.svc/RatioGetTagsData', {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
          type: Action.GET_RATIO_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_RATIO_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getUnitEnergyTrendChartData(timeRange, step, tagOptions, unitType, relativeDate, benchmarkOption){
    var tagIds = getTagIdsFromTagOptions(tagOptions);
    var submitParams = { tagIds:tagIds,
                         benchmarkOption: benchmarkOption || null,
                         viewOption:{ DataUsageType: 1,
                                      IncludeNavigatorData: true,
                                      Step: step,
                                      TimeRanges: timeRange,
                                      DataOption:{
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

    Ajax.post('/Energy.svc/GetEnergyUsageUnitData', {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_ENERGY_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getUnitCostTrendChartData(timeRange, step, selectedList, unitType, relativeDate, benchmarkOption){
    var commodityList = selectedList.commodityList;
    var hierarchyNode = selectedList.hierarchyNode;
    var hierarchyId = hierarchyNode.hierId;
    var commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
    var dimNode = selectedList.dimNode;
    var viewAssociation = CommonFuns.getViewAssociation(hierarchyId, dimNode);
    var submitParams = { commodityIds:commodityIds,
                         viewAssociation:viewAssociation,
                         benchmarkOption: benchmarkOption || null,
                         viewOption:{ DataUsageType: 1,
                                      IncludeNavigatorData: true,
                                      Step: step,
                                      TimeRanges: timeRange,
                                      DataOption:{
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

    Ajax.post('/Energy.svc/GetCostUnitData', {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_COST_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getLabelChartData(viewOption, tagOptions, benchmarkOption, labelingType){
    var tagIds = getTagIdsFromTagOptions(tagOptions);

    var submitParams = { tagIds:tagIds,
                         viewOption:viewOption,
                         benchmarkOption: benchmarkOption,
                         labelingType: labelingType
                       };

    AppDispatcher.dispatch({
      type: Action.GET_LABEL_DATA_LOADING,
      submitParams: submitParams,
      tagOptions: tagOptions,
      labelingType: labelingType
    });

    Ajax.post('/Energy.svc/LabelingGetTagsData', {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
          type: Action.GET_LABEL_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_LABEL_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getEnergyRankChartData(timeRanges, rankType, selectedList, relativeDate){
    var commodityNode = selectedList.commodityNode;
    var hierarchyList = selectedList.hierarchyList;
    var hierarchyIds = CommonFuns.getHierarchyIdsFromList(hierarchyList);
    var commodityIds = [];
    commodityIds.push(commodityNode.Id);

    var submitParams = { hierarchyIds:hierarchyIds,
                         commodityIds:commodityIds,
                         rankType: rankType,
                         viewOption:{TimeRanges: timeRanges}
                       };

    AppDispatcher.dispatch({
      type: Action.GET_RANK_DATA_LOADING,
      submitParams: submitParams,
      selectedList: selectedList,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy.svc/RankingEnergyUsageData', {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
          type: Action.GET_RANK_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_RANK_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getCarbonRankChartData(timeRanges, rankType, selectedList, relativeDate, destination){
    var commodityNode = selectedList.commodityNode;
    var hierarchyList = selectedList.hierarchyList;
    var hierarchyIds = CommonFuns.getHierarchyIdsFromList(hierarchyList);
    var commodityIds = [];
    if(commodityNode.Id !== -1){
      commodityIds.push(commodityNode.Id);
    }

    var submitParams = { hierarchyIds:hierarchyIds,
                         destination: destination,
                         commodityIds:commodityIds,
                         rankType: rankType,
                         viewOption:{TimeRanges: timeRanges}
                       };

    AppDispatcher.dispatch({
      type: Action.GET_RANK_DATA_LOADING,
      submitParams: submitParams,
      selectedList: selectedList,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy.svc/RankingCarbonData', {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
          type: Action.GET_RANK_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_RANK_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getCostRankChartData(timeRanges, rankType, selectedList, relativeDate, destination){
    var commodityNode = selectedList.commodityNode;
    var hierarchyList = selectedList.hierarchyList;
    var hierarchyIds = CommonFuns.getHierarchyIdsFromList(hierarchyList);
    var commodityIds = [];
    if(commodityNode.Id !== -1){
      commodityIds.push(commodityNode.Id);
    }

    var submitParams = { hierarchyIds:hierarchyIds,
                         commodityIds:commodityIds,
                         rankType: rankType,
                         viewOption:{TimeRanges: timeRanges}
                       };

    AppDispatcher.dispatch({
      type: Action.GET_RANK_DATA_LOADING,
      submitParams: submitParams,
      selectedList: selectedList,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy.svc/RankingCostData', {
      params:submitParams,
      commonErrorHandling: false,
      success: function(energyData){
        AppDispatcher.dispatch({
          type: Action.GET_RANK_DATA_SUCCESS,
          energyData: energyData,
          submitParams: submitParams
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_RANK_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  }
};
module.exports = EnergyAction;
