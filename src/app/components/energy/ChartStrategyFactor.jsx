'use strict';
import React from "react";
import assign from "object-assign";
import Immutable from 'immutable';
import _ from 'lodash-es';
import { FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress, IconMenu, TextField } from 'material-ui';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import MenuDivider from 'material-ui/Divider';
import BaselineCfg from '../setting/BaselineCfg.jsx';
import CommonFuns from '../../util/Util.jsx';
import DateTimeSelector from '../../controls/DateTimeSelector.jsx';
import ButtonMenu from '../../controls/CustomButtonMenu.jsx';
import YearPicker from '../../controls/YearPicker.jsx';
import ExtendableMenuItem from '../../controls/ExtendableMenuItem.jsx';
import AlarmTagStore from '../../stores/AlarmTagStore.jsx';
import GlobalErrorMessageAction from '../../actions/GlobalErrorMessageAction.jsx';
import LabelMenuAction from '../../actions/LabelMenuAction.jsx';
import EnergyAction from '../../actions/EnergyAction.jsx';
import CarbonAction from '../../actions/CarbonAction.jsx';
import AlarmTagAction from '../../actions/AlarmTagAction.jsx';
import ExportChartAction from '../../actions/ExportChartAction.jsx';
import CommodityAction from '../../actions/CommodityAction.jsx';
import FolderAction from '../../actions/FolderAction.jsx';
import ChartAction from '../../actions/ChartAction.jsx';
import ChartStatusAction from '../../actions/ChartStatusAction.jsx';
import YaxisSelector from './YaxisSelector.jsx';
import StepSelector from './StepSelector.jsx';
import ChartComponentBox from './ChartComponentBox.jsx';
import LabelChartComponent from './LabelChartComponent.jsx';
import GridComponent from './GridComponent.jsx';
import ConstStore from '../../stores/ConstStore.jsx';
import EnergyStore from '../../stores/Energy/EnergyStore.jsx';
import CostStore from '../../stores/CostStore.jsx';
import CarbonStore from '../../stores/CarbonStore.jsx';
import LabelStore from '../../stores/LabelStore.jsx';
import RatioStore from '../../stores/RatioStore.jsx';
import LabelMenuStore from '../../stores/LabelMenuStore.jsx';
import RankStore from '../../stores/RankStore.jsx';
import CommodityStore from '../../stores/CommodityStore.jsx';
import TagStore from '../../stores/TagStore.jsx';
import ChartStatusStore from '../../stores/Energy/ChartStatusStore.jsx';
import AddIntervalWindow from './energy/AddIntervalWindow.jsx';
import SumWindow from './energy/SumWindow.jsx';
import MultipleTimespanStore from '../../stores/Energy/MultipleTimespanStore.jsx';
import MultiTimespanAction from '../../actions/MultiTimespanAction.jsx';
import CalendarManager from './CalendarManager.jsx';
import WidgetSaveWindow from './WidgetSaveWindow.jsx';
import FolderStore from '../../stores/FolderStore.jsx';
import { dateAdd, dateFormat, DataConverter, isArray, isNumber, formatDateByStep, getDecimalDigits, toFixed, JazzCommon } from '../../util/Util.jsx';
import CurrentUserStore from '../../stores/CurrentUserStore.jsx';

import { getCookie } from '../../util/Util.jsx';
import PermissionCode from '../../constants/PermissionCode.jsx';

// let Menu = require('material-ui/Menu');
// let MenuItem = require('material-ui/MenuItem');
// let MenuDivider = require('material-ui/Divider');

function currentUser() {
  return CurrentUserStore.getCurrentUser();
}

let ChartStrategyFactor = {
  defaultStrategy: {

  },
  strategyConfiguration: {
    Energy: {
      searchBarGenFn: 'energySearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn: 'getSelectedTagList',
      onSearchDataButtonClickFn: 'onSearchDataButtonClick',
      onSearchBtnItemTouchTapFn: 'onSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn: 'initEnergyStoreByBizChartType',
      setFitStepAndGetDataFn: 'setFitStepAndGetData',
      getInitialStateFn: 'getEnergyInitialState',
      getAllDataFn: 'empty',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn: 'energyDataLoad',
      getPieEnergyDataFn: 'pieEnergyDataLoad',
      getChartComponentFn: 'getEnergyChartComponent',
      bindStoreListenersFn: 'energyBindStoreListeners',
      unbindStoreListenersFn: 'energyUnbindStoreListeners',
      canShareDataWithFn: 'canShareDataWith',
      getEnergyRawDataFn: 'getEnergyRawData',
      exportChartFn: 'exportChart',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getChartSubToolbarFn: 'getEnergySubToolbar',
      getAuxiliaryCompareBtnFn: 'getEnergyAuxiliaryCompareBtn',
      handleConfigBtnItemTouchTapFn: 'handleEnergyConfigBtnItemTouchTap',
      handleStepChangeFn: 'handleEnergyStepChange',
      handleCalendarChangeFn: 'handleCalendarChange',
      onAnalysisPanelDidUpdateFn: 'onAnalysisPanelDidUpdate',
      isCalendarDisabledFn: 'isCalendarDisabled',
      handleWeatherMenuItemClickFn: 'handleWeatherMenuItemClick',
      isWeatherDisabledFn: 'isWeatherDisabled',
      handleNavigatorChangeLoadFn: 'handleNavigatorChangeLoad',
      handleNavigatorChangeTimeFn: 'handleNavigatorChangeTime',
      save2DashboardFn: 'save2Dashboard',
      save2DashboardForAlarmFn: 'save2DashboardForAlarm',
      initChartPanelByWidgetDtoFn: 'initChartPanelByWidgetDto',
      clearChartDataFn: 'clearChartData',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      initAlarmChartPanelByWidgetDtoFn: 'initAlarmChartPanelByWidgetDto',
      getWidgetSaveWindowFn: 'getAlarmWidgetSaveWindow',
      resetYaxisSelectorFn: 'resetYaxisSelector',
      onDeleteButtonClickFn: 'onDeleteButtonClick',
      resetCalendarTypeFn: 'resetCalendarType'
    },
    Cost: {
      searchBarGenFn: 'CostSearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn: 'getCostSelectedTagList',
      onSearchDataButtonClickFn: 'onCostSearchDataButtonClick',
      onSearchBtnItemTouchTapFn: 'onCostSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn: 'initCostStoreByBizChartType',
      setFitStepAndGetDataFn: 'setCostFitStepAndGetData',
      getInitialStateFn: 'getCostInitialState',
      getAllDataFn: 'empty',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn: 'costDataLoad',
      getPieEnergyDataFn: 'pieCostDataLoad',
      getChartComponentFn: 'getCostChartComponent',
      bindStoreListenersFn: 'costBindStoreListeners',
      unbindStoreListenersFn: 'costUnbindStoreListeners',
      canShareDataWithFn: 'canShareDataWith',
      exportChartFn: 'exportCostChart',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getChartSubToolbarFn: 'getCostSubToolbar',
      getAuxiliaryCompareBtnFn: 'getCostAuxiliaryCompareBtn',
      handleConfigBtnItemTouchTapFn: 'handleCostConfigBtnItemTouchTap',
      handleStepChangeFn: 'handleCostStepChange',
      handleNavigatorChangeLoadFn: 'handleCostNavigatorChangeLoad',
      handleNavigatorChangeTimeFn: 'handleCostNavigatorChangeTime',
      save2DashboardFn: 'saveCost2Dashboard',
      initChartPanelByWidgetDtoFn: 'initCostChartPanelByWidgetDto',
      isCalendarDisabledFn: 'isCostCalendarDisabled',
      onAnalysisPanelDidUpdateFn: 'onCostAnalysisPanelDidUpdate',
      handleCalendarChangeFn: 'handleCalendarChange',
      clearChartDataFn: 'clearCostChartData',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      resetYaxisSelectorFn: 'resetYaxisSelector',
      onDeleteButtonClickFn: 'onCostDeleteButtonClick',
      resetCalendarTypeFn: 'resetCalendarType'
    },
    MultiIntervalDistribution: {

    },
    Carbon: {
      searchBarGenFn: 'carbonSearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn: 'getSelectedHierCommodityList',
      onSearchDataButtonClickFn: 'onCarbonSearchDataButtonClick',
      onSearchBtnItemTouchTapFn: 'onCostSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn: 'initCarbonStoreByBizChartType',
      setFitStepAndGetDataFn: 'setCarbonFitStepAndGetData',
      getInitialStateFn: 'getCarbonInitialState',
      getEnergyDataFn: 'carbonDataLoad',
      getPieEnergyDataFn: 'pieCarbonDataLoad',
      getChartComponentFn: 'getCarbonChartComponent',
      bindStoreListenersFn: 'carbonBindStoreListeners',
      unbindStoreListenersFn: 'carbonUnbindStoreListeners',
      canShareDataWithFn: 'canShareDataWith',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getEnergyRawDataFn: 'empty',
      getInitParamFn: 'getInitParam',
      getAllDataFn: 'empty',
      getChartSubToolbarFn: 'getCarbonSubToolbar',
      getAuxiliaryCompareBtnFn: 'getCarbonAuxiliaryCompareBtn',
      handleStepChangeFn: 'handleCarbonStepChange',
      handleNavigatorChangeLoadFn: 'handleCarbonNavigatorChangeLoad',
      handleNavigatorChangeTimeFn: 'handleCarbonNavigatorChangeTime',
      exportChartFn: 'exportCarbonChart',
      save2DashboardFn: 'saveCarbon2Dashboard',
      initChartPanelByWidgetDtoFn: 'initCarbonChartPanelByWidgetDto',
      isCalendarDisabledFn: 'isCarbonCalendarDisabled',
      onAnalysisPanelDidUpdateFn: 'onCarbonAnalysisPanelDidUpdate',
      handleCalendarChangeFn: 'handleCalendarChange',
      handleConfigBtnItemTouchTapFn: 'handleCarbonConfigBtnItemTouchTap',
      clearChartDataFn: 'clearCarbonChartData',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      resetYaxisSelectorFn: 'resetYaxisSelector',
      onDeleteButtonClickFn: 'onCarbonDeleteButtonClick',
      resetCalendarTypeFn: 'resetCalendarType'
    },
    RatioUsage: {
      searchBarGenFn: 'ratioUsageSearchBarGen',
      getEnergyTypeComboFn: 'empty',
      getSelectedNodesFn: 'getSelectedTagList',
      onSearchDataButtonClickFn: 'onRatioSearchDataButtonClick',
      onSearchBtnItemTouchTapFn: 'onCostSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn: 'initRatioStoreByBizChartType',
      setFitStepAndGetDataFn: 'setRatioFitStepAndGetData',
      getInitialStateFn: 'getRatioInitialState',
      getAllDataFn: 'unitGetAllData',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn: 'ratioDataLoad',
      getChartComponentFn: 'getRatioChartComponent',
      bindStoreListenersFn: 'ratioBindStoreListeners',
      unbindStoreListenersFn: 'ratioUnbindStoreListeners',
      canShareDataWithFn: 'canShareDataWith',
      exportChartFn: 'exportChart4Ratio',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getAuxiliaryCompareBtnFn: 'getRatioAuxiliaryCompareBtn',
      getChartSubToolbarFn: 'getRatioSubToolbar',
      handleConfigBtnItemTouchTapFn: 'handleUnitEnergyConfigBtnItemTouchTap',
      handleBenchmarkMenuItemClickFn: 'handleRatioBenchmarkMenuItemClick',
      handleStepChangeFn: 'handleRatioStepChange',
      handleNavigatorChangeLoadFn: 'handleRatioNavigatorChangeLoad',
      handleNavigatorChangeTimeFn: 'handleRatioNavigatorChangeTime',
      save2DashboardFn: 'saveRatio2Dashboard',
      isCalendarDisabledFn: 'isCalendarDisabled',
      onAnalysisPanelDidUpdateFn: 'onRatioAnalysisPanelDidUpdate',
      handleCalendarChangeFn: 'handleCalendarChange',
      clearChartDataFn: 'clearRatioChartData',
      initChartPanelByWidgetDtoFn: 'initRatioChartPanelByWidgetDto',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      resetYaxisSelectorFn: 'resetYaxisSelector',
      onDeleteButtonClickFn: 'onRatioDeleteButtonClick',
      resetCalendarTypeFn: 'resetCalendarType'
    },
    UnitEnergyUsage: {
      searchBarGenFn: 'unitEnergySearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn: 'getSelectedTagList',
      onSearchDataButtonClickFn: 'onUnitEnergySearchDataButtonClick',
      onSearchBtnItemTouchTapFn: 'onCostSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn: 'initEnergyStoreByBizChartType',
      setFitStepAndGetDataFn: 'setUnitEnergyFitStepAndGetData',
      getInitialStateFn: 'getUnitEnergyInitialState',
      getAllDataFn: 'unitGetAllData',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn: 'unitEnergyDataLoad',
      getChartComponentFn: 'getUnitEnergyChartComponent',
      bindStoreListenersFn: 'unitEnergyBindStoreListeners',
      unbindStoreListenersFn: 'unitEnergyUnbindStoreListeners',
      canShareDataWithFn: 'canShareDataWith',
      exportChartFn: 'exportChart4UnitEnergy',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getAuxiliaryCompareBtnFn: 'getUnitEnergyAuxiliaryCompareBtn',
      getChartSubToolbarFn: 'getUnitEnergySubToolbar',
      handleConfigBtnItemTouchTapFn: 'handleUnitEnergyConfigBtnItemTouchTap',
      handleBenchmarkMenuItemClickFn: 'handleUnitBenchmarkMenuItemClick',
      handleStepChangeFn: 'handleUnitEnergyStepChange',
      handleNavigatorChangeLoadFn: 'handleUnitEnergyNavigatorChangeLoad',
      handleNavigatorChangeTimeFn: 'handleNavigatorChangeTime',
      save2DashboardFn: 'saveUnit2Dashboard',
      initChartPanelByWidgetDtoFn: 'initUnitChartPanelByWidgetDto',
      handleCalendarChangeFn: 'handleCalendarChange',
      onAnalysisPanelDidUpdateFn: 'onAnalysisPanelDidUpdate',
      isCalendarDisabledFn: 'isCalendarDisabled',
      clearChartDataFn: 'clearUnitChartData',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      resetYaxisSelectorFn: 'resetYaxisSelector',
      onDeleteButtonClickFn: 'onUnitDeleteButtonClick',
      resetCalendarTypeFn: 'resetCalendarType'
    },
    UnitCost: {
      searchBarGenFn: 'unitEnergySearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn: 'getCostSelectedTagList',
      onSearchDataButtonClickFn: 'onUnitCostSearchDataButtonClick',
      onSearchBtnItemTouchTapFn: 'onCostSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn: 'initUnitCostStoreByBizChartType',
      setFitStepAndGetDataFn: 'setUnitEnergyFitStepAndGetData',
      getInitialStateFn: 'getUnitCostInitialState',
      getAllDataFn: 'unitGetAllData',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn: 'unitCostDataLoad',
      getChartComponentFn: 'getUnitEnergyChartComponent',
      bindStoreListenersFn: 'unitCostBindStoreListeners',
      unbindStoreListenersFn: 'unitCostUnbindStoreListeners',
      canShareDataWithFn: 'canShareDataWith',
      exportChartFn: 'exportChart4UnitCost',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getAuxiliaryCompareBtnFn: 'getUnitCostAuxiliaryCompareBtn',
      getChartSubToolbarFn: 'getUnitCostSubToolbar',
      handleConfigBtnItemTouchTapFn: 'handleUnitEnergyConfigBtnItemTouchTap',
      handleBenchmarkMenuItemClickFn: 'handleUnitCostBenchmarkMenuItemClick',
      handleStepChangeFn: 'handleUnitCostStepChange',
      handleNavigatorChangeLoadFn: 'handleUnitCostNavigatorChangeLoad',
      handleNavigatorChangeTimeFn: 'handleCostNavigatorChangeTime',
      save2DashboardFn: 'saveUnitCost2Dashboard',
      initChartPanelByWidgetDtoFn: 'initUnitCostChartPanelByWidgetDto',
      isCalendarDisabledFn: 'isCostCalendarDisabled',
      onAnalysisPanelDidUpdateFn: 'onCostAnalysisPanelDidUpdate',
      handleCalendarChangeFn: 'handleCalendarChange',
      clearChartDataFn: 'clearUnitCostChartData',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      resetYaxisSelectorFn: 'resetYaxisSelector',
      onDeleteButtonClickFn: 'onUnitCostDeleteButtonClick',
      resetCalendarTypeFn: 'resetCalendarType'
    },
    UnitCarbon: {
      searchBarGenFn: 'unitEnergySearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn: 'getSelectedHierCommodityList',
      onSearchDataButtonClickFn: 'onUnitCarbonSearchDataButtonClick',
      onSearchBtnItemTouchTapFn: 'onCostSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn: 'initUnitCarbonStoreByBizChartType',
      setFitStepAndGetDataFn: 'setUnitCarbonFitStepAndGetData',
      getInitialStateFn: 'getUnitCarbonInitialState',
      getAllDataFn: 'unitGetAllData',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn: 'unitCarbonDataLoad',
      getChartComponentFn: 'getCarbonChartComponent',
      bindStoreListenersFn: 'unitCarbonBindStoreListeners',
      unbindStoreListenersFn: 'unitCarbonUnbindStoreListeners',
      canShareDataWithFn: 'canShareDataWith',
      exportChartFn: 'exportChart4UnitCarbon',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getAuxiliaryCompareBtnFn: 'getUnitCarbonAuxiliaryCompareBtn',
      getChartSubToolbarFn: 'getUnitCarbonSubToolbar',
      handleConfigBtnItemTouchTapFn: 'handleUnitEnergyConfigBtnItemTouchTap',
      handleBenchmarkMenuItemClickFn: 'handleUnitCarbonBenchmarkMenuItemClick',
      handleStepChangeFn: 'handleUnitCarbonStepChange',
      handleNavigatorChangeLoadFn: 'handleUnitCarbonNavigatorChangeLoad',
      handleNavigatorChangeTimeFn: 'handleCarbonNavigatorChangeTime',
      save2DashboardFn: 'saveUnitCarbon2Dashboard',
      initChartPanelByWidgetDtoFn: 'initUnitCarbonChartPanelByWidgetDto',
      isCalendarDisabledFn: 'isCarbonCalendarDisabled',
      onAnalysisPanelDidUpdateFn: 'onCarbonAnalysisPanelDidUpdate',
      handleCalendarChangeFn: 'handleCalendarChange',
      clearChartDataFn: 'clearUnitCarbonChartData',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      resetYaxisSelectorFn: 'resetYaxisSelector',
      onDeleteButtonClickFn: 'onUnitCarbonDeleteButtonClick',
      resetCalendarTypeFn: 'resetCalendarType'
    },
    Label: {
      searchBarGenFn: 'labelSearchBarGen',
      getEnergyTypeComboFn: 'empty',
      getSelectedNodesFn: 'getSelectedTagList',
      onSearchDataButtonClickFn: 'onLabelSearchDataButtonClick',
      //setFitStepAndGetDataFn:'setLabelTypeAndGetData',
      getInitialStateFn: 'getLabelInitialState',
      getAllDataFn: 'getAllData',
      getInitParamFn: 'empty',
      getEnergyDataFn: 'labelDataLoad',
      getChartComponentFn: 'getLabelChartComponent',
      bindStoreListenersFn: 'labelBindStoreListeners',
      unbindStoreListenersFn: 'labelUnbindStoreListeners',
      canShareDataWithFn: 'canRankShareDataWith',
      onEnergyTypeChangeFn: 'empty',
      onHierNodeChangeFn: 'onHierNodeChange',
      save2DashboardFn: 'saveLabel2Dashboard',
      initChartPanelByWidgetDtoFn: 'initLabelChartPanelByWidgetDto',
      clearChartDataFn: 'clearLabelChartData',
      getWidgetOptMenuFn: 'getLabelWidgetOptMenu',
      resetYaxisSelectorFn: 'empty',
      resetCalendarTypeFn: 'empty'
    },
    Rank: {
      searchBarGenFn: 'rankSearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn: 'getRankSelectedTagList',
      onSearchDataButtonClickFn: 'onRankSearchDataButtonClick',
      setFitStepAndGetDataFn: 'setRankTypeAndGetData',
      getInitialStateFn: 'getRankInitialState',
      getAllDataFn: 'empty',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn: 'rankDataLoad',
      getChartComponentFn: 'getRankChartComponent',
      bindStoreListenersFn: 'rankBindStoreListeners',
      unbindStoreListenersFn: 'rankUnbindStoreListeners',
      canShareDataWithFn: 'canRankShareDataWith',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getChartSubToolbarFn: 'getRankSubToolbar',
      save2DashboardFn: 'saveRank2Dashboard',
      initChartPanelByWidgetDtoFn: 'initRankChartPanelByWidgetDto',
      clearChartDataFn: 'clearRankChartData',
      getWidgetOptMenuFn: 'getLabelWidgetOptMenu',
      resetYaxisSelectorFn: 'resetYaxisSelector',
      resetCalendarTypeFn: 'empty'
    }
  },
  handleNavigatorChangeTimeFnStrategy: {
    handleNavigatorChangeTime(startTime, endTime) {
      var timeRanges = EnergyStore.getParamsObj().timeRanges;
      if (timeRanges.length > 1) {
        MultipleTimespanStore.convertMultiTimespansByNavigator(startTime, endTime);
      } else {
        EnergyAction.setTimeRangeByNavigator(startTime, endTime);
      }
    },
    handleCostNavigatorChangeTime(startTime, endTime) {
      EnergyAction.setCostTimeRangeByNavigator(startTime, endTime);
    },
    handleCarbonNavigatorChangeTime(startTime, endTime) {
      CarbonAction.setCarbonTimeRangeByNavigator(startTime, endTime);
    },
    handleRatioNavigatorChangeTime(startTime, endTime) {
      EnergyAction.setRatioTimeRangeByNavigator(startTime, endTime);
    }
  },
  onDeleteButtonClickFnStrategy: {
    onDeleteButtonClick(analysisPanel, obj) {
      let uid = obj.uid;
      let id = obj.id;
      var index = id.indexOf('Type');
      var type = parseInt(id.slice(index + 4));
      let tagOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn(),
        paramsObj = EnergyStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        submitParams = EnergyStore.getSubmitParams(),
        step = paramsObj.step;
      let wasTemp = !!submitParams.viewOption.IncludeTempValue,
        wasHumi = !!submitParams.viewOption.IncludeHumidityValue,
        weather;
      if (type === 18) {
        weather = {
          IncludeTempValue: false,
          IncludeHumidityValue: wasHumi
        };
        analysisPanel.setState({
          weatherOption: weather
        });
        analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false, weather);
      } else if (type === 19) {
        weather = {
          IncludeTempValue: wasTemp,
          IncludeHumidityValue: false
        };
        analysisPanel.setState({
          weatherOption: weather
        });
        analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false, weather);
      } else {
        let multiTimespanIndex = EnergyStore.getMultiTimespanIndex(uid);

        if (multiTimespanIndex !== -1) {
          MultiTimespanAction.removeMultiTimespanData(multiTimespanIndex, true);
        } else {
          AlarmTagAction.removeSearchTagList({
            tagId: uid
          });
        }

        let needReload = EnergyStore.removeSeriesDataByUid(uid);

        if (needReload) {
          // if (multiTimespanIndex !== -1) {
          //   timeRanges = [timeRanges[0]];
          //   MultiTimespanAction.clearMultiTimespan('both');
          // }

          if (multiTimespanIndex !== -1) {
            var multiTimespanList=MultipleTimespanStore.getRelativeList();
            if(multiTimespanList===2){
              timeRanges = [timeRanges[0]];
              MultiTimespanAction.clearMultiTimespan('both');
            }
            else {
              timeRanges=MultipleTimespanStore.getSubmitTimespans();
            }

          }
          var chartType = analysisPanel.state.selectedChartType;
          if (chartType == 'line' || chartType == 'column' || chartType == 'stack') {
            analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false);
          } else if (chartType == 'pie') {
            analysisPanel.state.chartStrategy.getPieEnergyDataFn(timeRanges, 2, tagOptions, false);
          }
        } else {
          let energyData = EnergyStore.getEnergyData();
          analysisPanel.setState({
            energyData: energyData
          });
        }
      }
    },
    onUnitDeleteButtonClick(analysisPanel, obj) {
      let uid = obj.uid;

      AlarmTagAction.removeSearchTagList({
        tagId: uid
      });

      let needReload = EnergyStore.removeSeriesDataByUid(uid);

      if (needReload) {
        let tagOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn(),
          submitParams = EnergyStore.getSubmitParams(),
          paramsObj = EnergyStore.getParamsObj(),
          timeRanges = paramsObj.timeRanges,
          step = paramsObj.step,
          unitType = submitParams.viewOption.DataOption.UnitType,
          benchmarkOption = submitParams.benchmarkOption;

        analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, unitType, false, benchmarkOption);
      } else {
        let energyData = EnergyStore.getEnergyData();
        analysisPanel.setState({
          energyData: energyData
        });
      }
    },
    onCarbonDeleteButtonClick(analysisPanel, obj) {
      let uid = obj.uid,
        commodityId = uid,
        needReload = CarbonStore.removeSeriesDataByUid(uid);
      if (uid === 0) {
        commodityId = -1;
      }

      CommodityAction.setCommoditySelectStatus(commodityId, null, false);

      if (needReload) {
        let hierCommIds = analysisPanel.state.chartStrategy.getSelectedNodesFn();
        if (!hierCommIds.commodityIds || hierCommIds.commodityIds.length === 0 || !hierCommIds.hierarchyId) {
          analysisPanel.setState({
            energyData: null
          });
          return;
        }

        let paramsObj = CarbonStore.getSubmitParams();
        let hierarchyId = paramsObj.hierarchyId,
          commodityIds = paramsObj.commodityIds,
          destination = paramsObj.destination,
          viewOp = paramsObj.viewOption;

        analysisPanel.state.chartStrategy.getEnergyDataFn(hierCommIds.hierarchyId, hierCommIds.commodityIds, destination, viewOp, false, analysisPanel);
      } else {
        let energyData = CarbonStore.getCarbonData();
        analysisPanel.setState({
          energyData: energyData
        });
      }
    },
    onCostDeleteButtonClick(analysisPanel, obj) {
      let uid = obj.uid,
        commodityId = uid,
        needReload = CostStore.removeSeriesDataByUid(uid);
      if (uid === 0) {
        commodityId = -1;
      }

      CommodityAction.setCommoditySelectStatus(commodityId, null, false);

      if (needReload) {
        let tagOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn(),
          paramsObj = CostStore.getParamsObj(),
          timeRanges = paramsObj.timeRanges,
          step = paramsObj.step;

        analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false, analysisPanel);
      } else {
        let energyData = CostStore.getEnergyData();
        analysisPanel.setState({
          energyData: energyData
        });
      }
    },
    onRatioDeleteButtonClick(analysisPanel, obj) {
      let uid = obj.uid,
        needReload = RatioStore.removeSeriesDataByUid(uid);

      AlarmTagAction.removeSearchTagList({
        tagId: uid
      });

      if (needReload) {
        let paramsObj = RatioStore.getSubmitParams();
        let tagOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();

        let viewOp = paramsObj.viewOption,
          timeRanges = viewOp.TimeRanges,
          benchmarkOption = paramsObj.paramsObj,
          ratioType = paramsObj.ratioType,
          step = viewOp.Step;

        analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, ratioType, false, benchmarkOption);
      } else {
        let energyData = RatioStore.getEnergyData();
        analysisPanel.setState({
          energyData: energyData
        });
      }
    },
    onUnitCostDeleteButtonClick(analysisPanel, obj) {
      let uid = obj.uid,
        commodityId = uid,
        needReload = CostStore.removeSeriesDataByUid(uid);
      if (uid === 0) {
        commodityId = -1;
      }

      CommodityAction.setCommoditySelectStatus(commodityId, null, false);

      if (needReload) {
        let tagOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn(),
          paramsObj = CostStore.getParamsObj(),
          timeRanges = paramsObj.timeRanges,
          step = paramsObj.step,
          submitParams = EnergyStore.getSubmitParams(),
          benchmarkOption = submitParams.benchmarkOption,
          unitType = submitParams.viewOption.DataOption.UnitType;

        analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, unitType, false, benchmarkOption);
      } else {
        let energyData = CostStore.getEnergyData();
        analysisPanel.setState({
          energyData: energyData
        });
      }
    },
    onUnitCarbonDeleteButtonClick(analysisPanel, obj) {
      let uid = obj.uid,
        commodityId = uid,
        needReload = CarbonStore.removeSeriesDataByUid(uid);
      if (uid === 0) {
        commodityId = -1;
      }

      CommodityAction.setCommoditySelectStatus(commodityId, null, false);

      if (needReload) {
        let paramsObj = CarbonStore.getSubmitParams();
        let hierarchyId = paramsObj.hierarchyId,
          commodityIds = paramsObj.commodityIds,
          destination = paramsObj.destination,
          viewOp = paramsObj.viewOption,
          benchmarkOption = paramsObj.benchmarkOption;

        analysisPanel.state.chartStrategy.getEnergyDataFn(hierarchyId, commodityIds, destination, viewOp, false, benchmarkOption);
      } else {
        let energyData = CarbonStore.getCarbonData();
        analysisPanel.setState({
          energyData: energyData
        });
      }
    }
  },
  resetYaxisSelectorFnStrategy: {
    empty() {},
    resetYaxisSelector() {
      YaxisSelector.reset();
    }
  },
  resetCalendarTypeFnStrategy: {
    empty() {},
    resetCalendarType() {
      CalendarManager.resetShowType();
    }
  },
  getWidgetOptMenuFnStrategy: {
    getWidgetOptMenu(analysisPanel) {
      var user=window.currentUser || currentUser();
      let widgetOptMenu = null;
      // add for PM2.5
      if(user.Name==='se'){
        return widgetOptMenu
      }

      var IconButtonElement = <IconButton iconClassName="icon-arrow-down" iconStyle={{
        fontSize: '16px'
      }} style={{
        padding: '0px',
        height: '18px',
        width: '18px',
        marginLeft: '10px',
        marginTop: '5px'
      }}/>;
      var iconMenuProps = {
        iconButtonElement: IconButtonElement,
        openDirection: "bottom-right",
        desktop: true
      };
      let selectedWidget = FolderStore.getSelectedNode();
      let buttonDisabled = (!analysisPanel.state.energyData || !selectedWidget.get('ChartType'));

      if (!analysisPanel.props.isFromAlarm) {
        //  CurrentUserStore.getCurrentPrivilege().indexOf('1205') > -1
        if (CurrentUserStore.permit(PermissionCode.ENERGY_EXPORT.FULL)) {
          widgetOptMenu = <IconMenu {...iconMenuProps} onItemClick={analysisPanel._onTitleMenuSelect}>
                                  <MenuItem key={1} primaryText={I18N.Folder.Detail.WidgetMenu.Menu1} disabled={buttonDisabled}/>
                                  <MenuItem key={2} primaryText={I18N.Folder.Detail.WidgetMenu.Menu2} disabled={buttonDisabled}/>
                                  <MenuItem key={4} primaryText={I18N.Folder.Detail.WidgetMenu.Menu4} disabled={buttonDisabled}/>
                                  <MenuItem key={5} primaryText={I18N.Folder.Detail.WidgetMenu.Menu5} />
                               </IconMenu>;
        } else {
          widgetOptMenu = <IconMenu {...iconMenuProps} onItemClick={analysisPanel._onTitleMenuSelect}>
                                  <MenuItem key={1} primaryText={I18N.Folder.Detail.WidgetMenu.Menu1} disabled={buttonDisabled}/>
                                  <MenuItem key={2} primaryText={I18N.Folder.Detail.WidgetMenu.Menu2} disabled={buttonDisabled}/>
                                  <MenuItem key={5} primaryText={I18N.Folder.Detail.WidgetMenu.Menu5} />
                               </IconMenu>;
        }

      }
      return widgetOptMenu;
    },
    getLabelWidgetOptMenu(analysisPanel) {
      var user=window.currentUser || currentUser();
      let widgetOptMenu = null;
      // add for PM2.5
      if(user.Name==='se'){
        return widgetOptMenu
      }
      var IconButtonElement = <IconButton iconClassName="icon-arrow-down" iconStyle={{
        fontSize: '16px'
      }} style={{
        padding: '0px',
        height: '18px',
        width: '18px',
        marginLeft: '10px',
        marginTop: '5px'
      }}/>;
      var iconMenuProps = {
        iconButtonElement: IconButtonElement,
        openDirection: "bottom-right",
        desktop: true
      };
      let selectedWidget = FolderStore.getSelectedNode();
      let buttonDisabled = (!analysisPanel.state.energyData || !selectedWidget.get('ChartType'));
      widgetOptMenu = analysisPanel.props.isFromAlarm ? null : <IconMenu {...iconMenuProps} onItemClick={analysisPanel._onTitleMenuSelect}>
                              <MenuItem key={1} primaryText={I18N.Folder.Detail.WidgetMenu.Menu1} disabled={buttonDisabled}/>
                              <MenuItem key={2} primaryText={I18N.Folder.Detail.WidgetMenu.Menu2} disabled={buttonDisabled}/>
                              <MenuItem key={5} primaryText={I18N.Folder.Detail.WidgetMenu.Menu5} />
                           </IconMenu>;
      return widgetOptMenu;
    }
  },
  initChartPanelByWidgetDtoFnStrategy: {
    initChartPanelByWidgetDto(analysisPanel) {
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      let widgetDto = analysisPanel.props.widgetDto,
        WidgetStatusArray = widgetDto.WidgetStatusArray,
        contentSyntax = widgetDto.ContentSyntax,
        contentObj = JSON.parse(contentSyntax),
        viewOption = contentObj.viewOption,
        step = viewOption.Step,
        timeRanges = viewOption.TimeRanges,
        sumBtnStatus = false,
        chartType = widgetDto.ChartType,
        remarkText = widgetDto.Comment;

      var remarkDisplay = false;
      if (remarkText !== '' && remarkText !== null) {
        remarkDisplay = true;
      }

      let wasTemp = !!viewOption.IncludeTempValue,
        wasHumi = !!viewOption.IncludeHumidityValue,
        weather = {
          IncludeTempValue: wasTemp,
          IncludeHumidityValue: wasHumi
        };
      analysisPanel.setState({
        weatherOption: weather
      });

      let typeMap = {
        Line: 'line',
        Column: 'column',
        Stack: 'stack',
        Pie: 'pie',
        DataTable: 'rawdata',
        original: 'rawdata'
      };

      if (typeMap[chartType] === "rawdata" || typeMap[chartType] === "pie") {
        sumBtnStatus = true;
      }
      let initPanelDate = function(timeRange) {
        if (timeRange.relativeDate) {
          analysisPanel._setRelativeDateByValue(timeRange.relativeDate);
        } else {
          analysisPanel._setRelativeDateByValue('Customerize');
          let start = j2d(timeRange.StartTime, false);
          let end = j2d(timeRange.EndTime, false);
          if (analysisPanel.refs.dateTimeSelector) {
            analysisPanel.refs.dateTimeSelector.setDateField(start, end);
          }
        }
      };

      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);
      if (timeRanges.length !== 1) {
        MultipleTimespanStore.initDataByWidgetTimeRanges(timeRanges);
      }

      let yaxisConfig = null;
      if (WidgetStatusArray) {
        yaxisConfig = CommonFuns.getYaxisConfig(WidgetStatusArray);
      }
      //init selected tags is done in the other part
      analysisPanel.setState({
        remarkText: remarkText,
        remarkDisplay: remarkDisplay,
        selectedChartType: typeMap[chartType],
        yaxisConfig: yaxisConfig,
        sumBtnStatus: sumBtnStatus,
        step: step,
        weatherBtnStatus: TagStore.getWeatherBtnDisabled()
      }, () => {
        analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
      });
      ChartStatusAction.setWidgetDto(widgetDto, analysisPanel.props.bizType, analysisPanel.props.energyType, analysisPanel.state.selectedChartType);
      analysisPanel.setCalendarTypeFromWidget(widgetDto);
    },

    initCostChartPanelByWidgetDto(analysisPanel) {
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      let widgetDto = analysisPanel.props.widgetDto,
        bizType = widgetDto.BizType,
        WidgetStatusArray = widgetDto.WidgetStatusArray,
        touBtnSelected = false,
        touBtnStatus = true,
        contentSyntax = widgetDto.ContentSyntax,
        contentObj = JSON.parse(contentSyntax),
        viewOption = contentObj.viewOption,
        step = viewOption.Step,
        timeRanges = viewOption.TimeRanges,
        chartType = widgetDto.ChartType,
        remarkText = widgetDto.Comment;

      var remarkDisplay = false;
      if (remarkText !== '' && remarkText !== null) {
        remarkDisplay = true;
      }

      let typeMap = {
        Line: 'line',
        Column: 'column',
        Stack: 'stack',
        Pie: 'pie'
      };

      let initPanelDate = function(timeRange) {
        if (timeRange.relativeDate) {
          analysisPanel._setRelativeDateByValue(timeRange.relativeDate);
        } else {
          analysisPanel._setRelativeDateByValue('Customerize');
          let start = j2d(timeRange.StartTime, false);
          let end = j2d(timeRange.EndTime, false);
          if (analysisPanel.refs.dateTimeSelector) {
            analysisPanel.refs.dateTimeSelector.setDateField(start, end);
          }
        }
      };

      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      var newStatus = CommodityStore.getECButtonStatus();
      if (!newStatus && step === null) {
        touBtnStatus = false;
      } else if (!newStatus && step !== null && step > 1) {
        touBtnStatus = false;
      } else {
        touBtnStatus = true;
      }

      if (bizType == 'CostElectric') {
        touBtnSelected = true;
      }

      let yaxisConfig = null;
      if (WidgetStatusArray) {
        yaxisConfig = CommonFuns.getYaxisConfig(WidgetStatusArray);
      }

      analysisPanel.setState({
        remarkText: remarkText,
        remarkDisplay: remarkDisplay,
        step: step,
        yaxisConfig: yaxisConfig,
        selectedChartType: typeMap[chartType],
        touBtnStatus: touBtnStatus,
        touBtnSelected: touBtnSelected
      }, () => {
        analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
      });
      ChartStatusAction.setWidgetDto(widgetDto, analysisPanel.props.bizType, analysisPanel.props.energyType, analysisPanel.state.selectedChartType);
      analysisPanel.setCalendarTypeFromWidget(widgetDto);
    },
    initCarbonChartPanelByWidgetDto(analysisPanel) {
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      let widgetDto = analysisPanel.props.widgetDto,
        WidgetStatusArray = widgetDto.WidgetStatusArray,
        contentSyntax = widgetDto.ContentSyntax,
        contentObj = JSON.parse(contentSyntax),
        viewOption = contentObj.viewOption,
        step = viewOption.Step,
        timeRanges = viewOption.TimeRanges,
        dest = contentObj.destination,
        chartType = widgetDto.ChartType,
        remarkText = widgetDto.Comment;

      var remarkDisplay = false;
      if (remarkText !== '' && remarkText !== null) {
        remarkDisplay = true;
      }
      if (!!dest) {
        CarbonStore.setDestination(dest);
      }


      let typeMap = {
        Line: 'line',
        Column: 'column',
        Stack: 'stack',
        Pie: 'pie',
        DataTable: 'rawdata',
        original: 'rawdata'
      };

      let initPanelDate = function(timeRange) {
        if (timeRange.relativeDate) {
          analysisPanel._setRelativeDateByValue(timeRange.relativeDate);
        } else {
          analysisPanel._setRelativeDateByValue('Customerize');
          let start = j2d(timeRange.StartTime, false);
          let end = j2d(timeRange.EndTime, false);
          if (analysisPanel.refs.dateTimeSelector) {
            analysisPanel.refs.dateTimeSelector.setDateField(start, end);
          }
        }
      };

      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      let yaxisConfig = null;
      if (WidgetStatusArray) {
        yaxisConfig = CommonFuns.getYaxisConfig(WidgetStatusArray);
      }

      analysisPanel.setState({
        remarkText: remarkText,
        remarkDisplay: remarkDisplay,
        step: step,
        yaxisConfig: yaxisConfig,
        selectedChartType: typeMap[chartType]
      }, () => {
        analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
      });

      ChartStatusAction.setWidgetDto(widgetDto, analysisPanel.props.bizType, analysisPanel.props.energyType, analysisPanel.state.selectedChartType);
      analysisPanel.setCalendarTypeFromWidget(widgetDto);
    },
    initRatioChartPanelByWidgetDto(analysisPanel) {
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      let widgetDto = analysisPanel.props.widgetDto,
        WidgetStatusArray = widgetDto.WidgetStatusArray,
        contentSyntax = widgetDto.ContentSyntax,
        contentObj = JSON.parse(contentSyntax),
        benchmarkOption = contentObj.benchmarkOption,
        viewOption = contentObj.viewOption,
        step = viewOption.Step,
        timeRanges = viewOption.TimeRanges,
        chartType = widgetDto.ChartType,
        ratioType = viewOption.DataOption.RatioType,
        remarkText = widgetDto.Comment;

      var remarkDisplay = false;
      if (remarkText !== '' && remarkText !== null) {
        remarkDisplay = true;
      }

      let typeMap = {
        Line: 'line',
        Column: 'column',
      };

      let initPanelDate = function(timeRange) {
        if (timeRange.relativeDate) {
          analysisPanel._setRelativeDateByValue(timeRange.relativeDate);
        } else {
          analysisPanel._setRelativeDateByValue('Customerize');
          let start = j2d(timeRange.StartTime, false);
          let end = j2d(timeRange.EndTime, false);
          if (analysisPanel.refs.dateTimeSelector) {
            analysisPanel.refs.dateTimeSelector.setDateField(start, end);
          }
        }
      };

      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      let bo = null;
      if (benchmarkOption && benchmarkOption.IndustryId !== null) {
        bo = benchmarkOption;
      }
      let yaxisConfig = null;
      if (WidgetStatusArray) {
        yaxisConfig = CommonFuns.getYaxisConfig(WidgetStatusArray);
      }

      setTimeout(() => {
        analysisPanel.setState({
          remarkText: remarkText,
          remarkDisplay: remarkDisplay,
          step: step,
          yaxisConfig: yaxisConfig,
          ratioType: ratioType,
          benchmarkOption: bo,
          selectedChartType: typeMap[chartType]
        }, () => {
          CommonFuns.setSelectedIndexByValue(analysisPanel.refs.ratioTypeCombo, ratioType);
          analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
        });
      });

      ChartStatusAction.setWidgetDto(widgetDto, analysisPanel.props.bizType, analysisPanel.props.energyType, analysisPanel.state.selectedChartType);
      analysisPanel.setCalendarTypeFromWidget(widgetDto);
    },
    initUnitChartPanelByWidgetDto(analysisPanel) {
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      let widgetDto = analysisPanel.props.widgetDto,
        WidgetStatusArray = widgetDto.WidgetStatusArray,
        contentSyntax = widgetDto.ContentSyntax,
        contentObj = JSON.parse(contentSyntax),
        benchmarkOption = contentObj.benchmarkOption,
        viewOption = contentObj.viewOption,
        timeRanges = viewOption.TimeRanges,
        step = viewOption.Step,
        unitType = viewOption.DataOption.UnitType,
        chartType = widgetDto.ChartType,
        remarkText = widgetDto.Comment;

      var remarkDisplay = false;
      if (remarkText !== '' && remarkText !== null) {
        remarkDisplay = true;
      }

      let typeMap = {
        Line: 'line',
        Column: 'column',
      };

      let initPanelDate = function(timeRange) {
        if (timeRange.relativeDate) {
          analysisPanel._setRelativeDateByValue(timeRange.relativeDate);
        } else {
          analysisPanel._setRelativeDateByValue('Customerize');
          let start = j2d(timeRange.StartTime, false);
          let end = j2d(timeRange.EndTime, false);
          if (analysisPanel.refs.dateTimeSelector) {
            analysisPanel.refs.dateTimeSelector.setDateField(start, end);
          }
        }
      };

      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      let bo = null;
      if (benchmarkOption && benchmarkOption.IndustryId !== null) {
        bo = benchmarkOption;
      }
      let yaxisConfig = null;
      if (WidgetStatusArray) {
        yaxisConfig = CommonFuns.getYaxisConfig(WidgetStatusArray);
      }

      setTimeout(() => {
        analysisPanel.setState({
          remarkText: remarkText,
          remarkDisplay: remarkDisplay,
          unitType: unitType,
          benchmarkOption: bo,
          step: step,
          yaxisConfig: yaxisConfig,
          selectedChartType: typeMap[chartType]
        }, () => {
          CommonFuns.setSelectedIndexByValue(analysisPanel.refs.unitTypeCombo, unitType);
          analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
        });
      });
      ChartStatusAction.setWidgetDto(widgetDto, analysisPanel.props.bizType, analysisPanel.props.energyType, analysisPanel.state.selectedChartType);
      analysisPanel.setCalendarTypeFromWidget(widgetDto);
    },
    initUnitCarbonChartPanelByWidgetDto(analysisPanel) {
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      let widgetDto = analysisPanel.props.widgetDto,
        WidgetStatusArray = widgetDto.WidgetStatusArray,
        contentSyntax = widgetDto.ContentSyntax,
        contentObj = JSON.parse(contentSyntax),
        benchmarkOption = contentObj.benchmarkOption,
        viewOption = contentObj.viewOption,
        timeRanges = viewOption.TimeRanges,
        step = viewOption.Step,
        unitType = viewOption.DataOption.UnitType,
        dest = contentObj.destination,
        chartType = widgetDto.ChartType,
        remarkText = widgetDto.Comment;

      var remarkDisplay = false;
      if (remarkText !== '' && remarkText !== null) {
        remarkDisplay = true;
      }
      if (!!dest) {
        CarbonStore.setDestination(dest);
      }


      let typeMap = {
        Line: 'line',
        Column: 'column',
      };

      let initPanelDate = function(timeRange) {
        if (timeRange.relativeDate) {
          analysisPanel._setRelativeDateByValue(timeRange.relativeDate);
        } else {
          analysisPanel._setRelativeDateByValue('Customerize');
          let start = j2d(timeRange.StartTime, false);
          let end = j2d(timeRange.EndTime, false);
          if (analysisPanel.refs.dateTimeSelector) {
            analysisPanel.refs.dateTimeSelector.setDateField(start, end);
          }
        }
      };

      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      let bo = null;
      if (benchmarkOption && benchmarkOption.IndustryId !== null) {
        bo = benchmarkOption;
      }

      let yaxisConfig = null;
      if (WidgetStatusArray) {
        yaxisConfig = CommonFuns.getYaxisConfig(WidgetStatusArray);
      }

      setTimeout(() => {
        analysisPanel.setState({
          remarkText: remarkText,
          remarkDisplay: remarkDisplay,
          unitType: unitType,
          benchmarkOption: bo,
          step: step,
          yaxisConfig: yaxisConfig,
          selectedChartType: typeMap[chartType]
        }, () => {
          //CommonFuns.setSelectedIndexByValue(analysisPanel.refs.unitTypeCombo, unitType);
          analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
        });
      });

      ChartStatusAction.setWidgetDto(widgetDto, analysisPanel.props.bizType, analysisPanel.props.energyType, analysisPanel.state.selectedChartType);
      analysisPanel.setCalendarTypeFromWidget(widgetDto);
    },
    initUnitCostChartPanelByWidgetDto(analysisPanel) {
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      let widgetDto = analysisPanel.props.widgetDto,
        WidgetStatusArray = widgetDto.WidgetStatusArray,
        contentSyntax = widgetDto.ContentSyntax,
        contentObj = JSON.parse(contentSyntax),
        benchmarkOption = contentObj.benchmarkOption,
        viewOption = contentObj.viewOption,
        step = viewOption.Step,
        timeRanges = viewOption.TimeRanges,
        unitType = viewOption.DataOption.UnitType,
        chartType = widgetDto.ChartType,
        remarkText = widgetDto.Comment;

      var remarkDisplay = false;
      if (remarkText !== '' && remarkText !== null) {
        remarkDisplay = true;
      }

      let typeMap = {
        Line: 'line',
        Column: 'column',
      };

      let initPanelDate = function(timeRange) {
        if (timeRange.relativeDate) {
          analysisPanel._setRelativeDateByValue(timeRange.relativeDate);
        } else {
          analysisPanel._setRelativeDateByValue('Customerize');
          let start = j2d(timeRange.StartTime, false);
          let end = j2d(timeRange.EndTime, false);
          if (analysisPanel.refs.dateTimeSelector) {
            analysisPanel.refs.dateTimeSelector.setDateField(start, end);
          }
        }
      };

      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      let bo = null;
      if (benchmarkOption && benchmarkOption.IndustryId !== null) {
        bo = benchmarkOption;
      }

      let yaxisConfig = null;
      if (WidgetStatusArray) {
        yaxisConfig = CommonFuns.getYaxisConfig(WidgetStatusArray);
      }

      setTimeout(() => {
        analysisPanel.setState({
          remarkText: remarkText,
          remarkDisplay: remarkDisplay,
          step: step,
          yaxisConfig: yaxisConfig,
          unitType: unitType,
          benchmarkOption: bo,
          selectedChartType: typeMap[chartType],
          baselineBtnStatus: CommodityStore.getUCButtonStatus()
        }, () => {
          //CommonFuns.setSelectedIndexByValue(analysisPanel.refs.unitTypeCombo, unitType);
          analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
        });
      });
      ChartStatusAction.setWidgetDto(widgetDto, analysisPanel.props.bizType, analysisPanel.props.energyType, analysisPanel.state.selectedChartType);
      analysisPanel.setCalendarTypeFromWidget(widgetDto);
    },
    initLabelChartPanelByWidgetDto(analysisPanel) {
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      let widgetDto = analysisPanel.props.widgetDto,
        contentSyntax = widgetDto.ContentSyntax,
        contentObj = JSON.parse(contentSyntax),
        benchmarkOption = contentObj.benchmarkOption,
        labelingType = contentObj.labelingType,
        viewOption = contentObj.viewOption,
        timeRanges = viewOption.TimeRanges,
        step = viewOption.Step,
        remarkText = widgetDto.Comment;

      var remarkDisplay = false;
      if (remarkText !== '' && remarkText !== null) {
        remarkDisplay = true;
      }
      if (benchmarkOption === null)
        return;
      let initPanelDate = function(timeRange) {
        let start = j2d(timeRange.StartTime, false);
        let end = j2d(timeRange.EndTime, false);
        var year = start.getFullYear();
        var month = start.getMonth();
        var monthIndex;
        let date = new Date();
        if (step === 4) {
          monthIndex = 0;
        } else {
          monthIndex = month + 1;
        }
        analysisPanel.setState({
          selectedYear: year - date.getFullYear() + 10,
          month: monthIndex
        });
      };
      let convertWidgetOptions2TagOption = function(WidgetOptions) {
        let tagOptions = [];
        WidgetOptions.forEach(item => {
          tagOptions.push({
            hierId: item.HierId,
            hierName: item.NodeName,
            tagId: item.TargetId,
            tagName: item.TargetName
          });
        });
        return tagOptions;
      };
      let tagOptions = convertWidgetOptions2TagOption(widgetDto.WidgetOptions);
      var map = {},
        hierId,
        i,
        hierIds = [];
      for (i = 0; i < tagOptions.length; i++) {
        hierId = tagOptions[i].hierId;
        if (!map[hierId]) {
          map[hierId] = hierId;
        }
      }
      for (i in map) {
        hierIds.push(map[i]);
      }
      LabelMenuAction.getHierNodes(hierIds);
      var kpiTypeItem = ConstStore.getKpiTypeItem();
      // var kpiTypeIndex;
      // kpiTypeItem.forEach(item => {
      //   if (item.value === labelingType) {
      //     kpiTypeIndex = item.index;
      //     return;
      //   }
      // });
      analysisPanel.setState({
        benchmarkOption: benchmarkOption,
        kpiTypeValue: labelingType,
        //kpiTypeIndex: kpiTypeIndex
      });


      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      //init selected tags is done in the other part

      var nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      analysisPanel.setState({
        remarkText: remarkText,
        remarkDisplay: remarkDisplay,
        selectedChartType: "column"
      }, () => {
        analysisPanel.state.chartStrategy.getEnergyDataFn(viewOption, nodeOptions, benchmarkOption, labelingType);
      });
    },
    initRankChartPanelByWidgetDto(analysisPanel) {
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      let widgetDto = analysisPanel.props.widgetDto,
        WidgetStatusArray = widgetDto.WidgetStatusArray,
        contentSyntax = widgetDto.ContentSyntax,
        contentObj = JSON.parse(contentSyntax),
        rankType = contentObj.rankType,
        diagramConfig = contentObj.diagramConfig,
        range = diagramConfig.rangeCode,
        order = diagramConfig.orderCode,
        destination = contentObj.destination,
        viewOption = contentObj.viewOption,
        timeRanges = viewOption.TimeRanges,
        remarkText = widgetDto.Comment;

      var remarkDisplay = false;
      if (remarkText !== '' && remarkText !== null) {
        remarkDisplay = true;
      }


      let initPanelDate = function(timeRange) {
        if (timeRange.relativeDate) {
          analysisPanel._setRelativeDateByValue(timeRange.relativeDate);
        } else {
          analysisPanel._setRelativeDateByValue('Customerize');
          let start = j2d(timeRange.StartTime, false);
          let end = j2d(timeRange.EndTime, false);
          if (analysisPanel.refs.dateTimeSelector) {
            analysisPanel.refs.dateTimeSelector.setDateField(start, end);
          }
        }
      };

      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      let yaxisConfig = null;
      if (WidgetStatusArray) {
        yaxisConfig = CommonFuns.getYaxisConfig(WidgetStatusArray);
      }

      analysisPanel.state.selectedChartType = "column";
      setTimeout(() => {
        analysisPanel.setState({
          destination: destination,
          remarkText: remarkText,
          remarkDisplay: remarkDisplay,
          rankType: rankType,
          yaxisConfig: yaxisConfig,
          order: order,
          range: range
        }, () => {
          CommonFuns.setSelectedIndexByValue(analysisPanel.refs.rankType, rankType);
          analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
        });
      });
    }
  },
  initAlarmChartPanelByWidgetDtoFnStrategy: {
    initAlarmChartPanelByWidgetDto(analysisPanel) {
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      let widgetDto = analysisPanel.props.widgetDto,
        timeRanges = widgetDto.timeRange,
        remarkText = widgetDto.Comment;

      var remarkDisplay = false;
      if (remarkText !== '' && remarkText !== null) {
        remarkDisplay = true;
      }

      let initPanelDate = function(timeRange) {
        if (timeRange.relativeDate) {
          analysisPanel._setRelativeDateByValue(timeRange.relativeDate);
        } else {
          let start = timeRange.StartTime;
          let end = timeRange.EndTime;
          analysisPanel.refs.dateTimeSelector.setDateField(start, end);
          analysisPanel._setRelativeDateByValue('Customerize');
        }
      };
      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      //init selected tags is done in the other part

      analysisPanel.setState({
        remarkText: remarkText,
        remarkDisplay: remarkDisplay,
        step: widgetDto.step,
        selectedChartType: 'line'
      }, () => {
        analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
      });
    },
  },
  save2DashboardForAlarmFnStrategy: {
    save2DashboardForAlarm(analysisPanel) {
      // let tagOptions = EnergyStore.getTagOpions(), options,
      //   relativeDate = EnergyStore.getRelativeDate();
      //
      // if (tagOptions) {
      //   if (isArray(tagOptions)) {
      //     options = [];
      //     for (let i = 0, len = tagOptions.length; i < len; i++) {
      //       let tag = tagOptions[i];
      //       options.push({
      //         Id: tag.tagId,
      //         Name: tag.tagName,
      //         HierId: tag.hierId,
      //         NodeName: tag.hierName
      //       });
      //     }
      //   } else {
      //     options = [{
      //       Id: tagOptions.tagId,
      //       Name: tagOptions.tagName,
      //       HierId: tagOptions.hierId,
      //       NodeName: tagOptions.hierName
      //     }];
      //   }
      // }
      // let submitParams = EnergyStore.getSubmitParams();
      // if (relativeDate !== 'Customerize' && relativeDate !== null) {
      //   let immutableSubmitParams = Immutable.fromJS(submitParams);
      //   let immutableSubmitParamsClone = immutableSubmitParams.setIn(['viewOption', 'TimeRanges'], [{
      //     relativeDate: relativeDate
      //   }]);
      //   submitParams = immutableSubmitParamsClone.toJS();
      // }
      // var contentSyntax = {
      //   xtype: 'widgetcontainer',
      //   params: {
      //     submitParams: {
      //       options: options,
      //       tagIds: submitParams.tagIds,
      //       interval: [],
      //       viewOption: submitParams.viewOption
      //     },
      //     config: {
      //       type: "line",
      //       xtype: "mixedtrendchartcomponent",
      //       reader: "mixedchartreader",
      //       storeType: "energy.Energy",
      //       searcherType: "analysissearcher",
      //       widgetStyler: "widgetchartstyler",
      //       maxWidgetStyler: "maxchartstyler"
      //     }
      //   }
      // };
      analysisPanel.setState({
        dashboardOpenImmediately: true,
      });
    }
  },
  save2DashboardFnStrategy: {
    save2Dashboard(analysisPanel, destNode, newName) {
      let chartType = analysisPanel.state.selectedChartType;
      let tagOptions = EnergyStore.getTagOpions();
      let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions, TagStore.getCurrentDimInfo());
      let widgetDto = _.cloneDeep(analysisPanel.props.widgetDto);
      let submitParams1 = EnergyStore.getSubmitParams();
      let paramsObj = EnergyStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        step = paramsObj.step,
        widgetTimeRanges;

      //submitParams part
      let submitParams = {
        options: nodeNameAssociation,
        tagIds: tagIds
      };
      //time range part
      if (timeRanges.length === 1) {
        let relativeDate = EnergyStore.getRelativeDate();
        if (relativeDate !== 'Customerize') {
          widgetTimeRanges = [{
            relativeDate: relativeDate
          }];
        } else {
          widgetTimeRanges = timeRanges;
        }
      } else {
        widgetTimeRanges = MultipleTimespanStore.getSave2DashboardTimespans();
      }
      // viewOption part
      let viewOption = {
        TimeRanges: widgetTimeRanges,
        Step: step
      };

      let includeNavigatorData = !(chartType === 'pie' || chartType === 'rawdata');
      viewOption.IncludeNavigatorData = includeNavigatorData;

      if (submitParams1 && submitParams1.viewOption) {
        let vo = submitParams1.viewOption;
        if (vo.IncludeTempValue)
          viewOption.IncludeTempValue = vo.IncludeTempValue;
        if (vo.IncludeHumidityValue)
          viewOption.IncludeHumidityValue = vo.IncludeHumidityValue;
      }

      let bizMap = {
        Energy: 1,
        Unit: 2,
        Ratio: 3,
        Label: 4,
        Rank: 5
      };
      let dataUsageType = bizMap[analysisPanel.props.bizType];
      viewOption.DataUsageType = dataUsageType;

      if (chartType === 'rawdata') {
        let dataOption = {
          OriginalValue: true,
          WithoutAdditionalValue: true
        };
        viewOption.DataOption = dataOption;

        let pagingObj = analysisPanel.refs.ChartComponent.getPageObj();
        let pagingOrder = {
          PageSize: 20,
          PageIdx: pagingObj.pageIdx,
          Order: {
            Column: 1,
            Type: 0
          },
          PreviousEndTime: null,
          Operation: 1
        };
        viewOption.PagingOrder = pagingOrder;
        chartType = 'original';
      } else {
        widgetDto.WidgetSeriesArray = ChartStatusStore.getWidgetSaveStatus();
      }

      submitParams.viewOption = viewOption;

      //storeType part
      let storeType;
      if (chartType === 'pie') {
        storeType = 'energy.Distribution';
      } else {
        storeType = 'energy.Energy';
      }

      let config = {
        type: chartType,
        storeType: storeType
      };

      let params = {
        submitParams: submitParams,
        config: config,
        calendar: analysisPanel.state.calendarType
      };
      if (analysisPanel.state.yaxisConfig !== null) {
        params.yaxisConfig = analysisPanel.state.yaxisConfig;
      }
      let contentSyntax = {
        params: params
      };
      widgetDto.ContentSyntax = JSON.stringify(contentSyntax);
      widgetDto.Comment = analysisPanel.state.remarkText;
      if (!!analysisPanel.props.isFromAlarm) {
        widgetDto.DashboardId = destNode.get('Id');
        widgetDto.Name = newName;
        FolderAction.WidgetSave(widgetDto, analysisPanel.context.router.params.customerId);
      } else {
        //for this situation destNode is menuIndex
        if (!!destNode) {
          return widgetDto;
        } else {
          FolderAction.updateWidgetDtos(widgetDto);
        }

      }

    },
    saveRatio2Dashboard(analysisPanel, menuIndex) {
      let chartType = analysisPanel.state.selectedChartType;
      let tagOptions = RatioStore.getRatioOpions();
      let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions, TagStore.getCurrentDimInfo());
      let widgetDto = _.cloneDeep(analysisPanel.props.widgetDto);
      let submitParams1 = RatioStore.getSubmitParams(),
        timeRanges = submitParams1.viewOption.TimeRanges,
        step = submitParams1.viewOption.Step,
        ratioType = submitParams1.ratioType,
        benchmarkOption = submitParams1.benchmarkOption || null,
        widgetTimeRanges;

      //submitParams part
      let submitParams = {
        options: nodeNameAssociation,
        tagIds: tagIds,
        ratioType: ratioType,
      };
      //time range part
      let relativeDate = RatioStore.getRelativeDate();
      if (relativeDate !== 'Customerize') {
        widgetTimeRanges = [{
          relativeDate: relativeDate
        }];
      } else {
        widgetTimeRanges = timeRanges;
      }
      // viewOption part
      let viewOption = {
        TimeRanges: widgetTimeRanges,
        Step: step
      };

      let includeNavigatorData = !(analysisPanel.state.selectedChartType === 'pie' || analysisPanel.state.selectedChartType === 'rawdata');
      viewOption.IncludeNavigatorData = includeNavigatorData;

      let bizMap = {
        Energy: 1,
        Unit: 2,
        Ratio: 3,
        Label: 4,
        Rank: 5
      };
      let dataUsageType = bizMap[analysisPanel.props.bizType];
      viewOption.DataUsageType = dataUsageType;

      submitParams.viewOption = viewOption;
      submitParams.benchmarkOption = benchmarkOption;

      //storeType part
      let storeType;
      if (analysisPanel.state.selectedChartType === 'pie') {
        storeType = 'energy.RatioDistribution';
      } else {
        storeType = 'energy.RatioUsage';
      }

      let config = {
        type: analysisPanel.state.selectedChartType,
        storeType: storeType
      };

      let params = {
        submitParams: submitParams,
        config: config,
        calendar: analysisPanel.state.calendarType
      };
      if (analysisPanel.state.yaxisConfig !== null) {
        params.yaxisConfig = analysisPanel.state.yaxisConfig;
      }

      let contentSyntax = {
        params: params
      };
      widgetDto.ContentSyntax = JSON.stringify(contentSyntax);
      widgetDto.Comment = analysisPanel.state.remarkText;
      widgetDto.WidgetSeriesArray = ChartStatusStore.getWidgetSaveStatus();
      if (!!menuIndex) {
        return widgetDto;
      } else {
        FolderAction.updateWidgetDtos(widgetDto);
      }

    },
    saveUnit2Dashboard(analysisPanel, menuIndex) {
      let chartType = analysisPanel.state.selectedChartType;
      let tagOptions = EnergyStore.getTagOpions();
      let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions, TagStore.getCurrentDimInfo());
      let widgetDto = _.cloneDeep(analysisPanel.props.widgetDto);
      let submitParams1 = EnergyStore.getSubmitParams(),
        benchmarkOption = submitParams1.benchmarkOption || null,
        unitType = submitParams1.viewOption.DataOption.UnitType;

      let paramsObj = EnergyStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        step = paramsObj.step,
        widgetTimeRanges;

      //submitParams part
      let submitParams = {
        options: nodeNameAssociation,
        tagIds: tagIds,
        benchmarkOption: benchmarkOption

      };
      //time range part
      let relativeDate = EnergyStore.getRelativeDate();
      if (relativeDate !== 'Customerize') {
        widgetTimeRanges = [{
          relativeDate: relativeDate
        }];
      } else {
        widgetTimeRanges = timeRanges;
      }

      // viewOption part
      let viewOption = {
        TimeRanges: widgetTimeRanges,
        DataOption: {
          UnitType: unitType
        },
        Step: step,
        IncludeNavigatorData: true
      };

      let bizMap = {
        Energy: 1,
        Unit: 2,
        Ratio: 3,
        Label: 4,
        Rank: 5
      };
      let dataUsageType = bizMap[analysisPanel.props.bizType];
      viewOption.DataUsageType = dataUsageType;

      submitParams.viewOption = viewOption;

      //storeType part
      let config = {
        type: analysisPanel.state.selectedChartType,
        storeType: 'energy.UnitEnergyUsage'
      };

      let params = {
        submitParams: submitParams,
        config: config,
        calendar: analysisPanel.state.calendarType
      };
      if (analysisPanel.state.yaxisConfig !== null) {
        params.yaxisConfig = analysisPanel.state.yaxisConfig;
      }

      let contentSyntax = {
        params: params
      };
      widgetDto.ContentSyntax = JSON.stringify(contentSyntax);
      widgetDto.Comment = analysisPanel.state.remarkText;
      widgetDto.WidgetSeriesArray = ChartStatusStore.getWidgetSaveStatus();
      if (!!menuIndex) {
        return widgetDto;
      } else {
        FolderAction.updateWidgetDtos(widgetDto);
      }
    //FolderAction.updateWidgetDtos(widgetDto, menuIndex);
    },
    saveCost2Dashboard(analysisPanel, menuIndex) {
      let chartType = analysisPanel.state.selectedChartType;
      let selectedList = CostStore.getSelectedList();
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationBySelectedList(selectedList);
      let widgetDto = _.cloneDeep(analysisPanel.props.widgetDto);
      let submitParams1 = CostStore.getSubmitParams();
      var commodityIds = submitParams1.commodityIds;
      var viewAssociation = submitParams1.viewAssociation;
      let paramsObj = CostStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        step = paramsObj.step,
        widgetTimeRanges;


      //submitParams part
      let submitParams = {
        options: nodeNameAssociation,
        viewAssociation: viewAssociation,
        commodityIds: commodityIds
      };
      //time range part

      let relativeDate = CostStore.getRelativeDate();
      if (relativeDate !== 'Customerize') {
        widgetTimeRanges = [{
          relativeDate: relativeDate
        }];
      } else {
        widgetTimeRanges = timeRanges;
      }

      // viewOption part
      let viewOption = {
        TimeRanges: widgetTimeRanges,
        Step: step
      };

      let includeNavigatorData = (analysisPanel.state.selectedChartType !== 'pie');
      viewOption.IncludeNavigatorData = includeNavigatorData;

      let bizMap = {
        Energy: 1,
        Unit: 2,
        Ratio: 3,
        Label: 4,
        Rank: 5
      };
      let dataUsageType = bizMap[analysisPanel.props.bizType];
      viewOption.DataUsageType = dataUsageType;

      submitParams.viewOption = viewOption;
      if (analysisPanel.state.touBtnSelected) {
        submitParams.isElec = true;
      }

      widgetDto.WidgetSeriesArray = ChartStatusStore.getWidgetSaveStatus();

      //storeType part
      let storeType;
      if (analysisPanel.state.touBtnSelected) {
        storeType = 'energy.CostElectricityUsage';
      } else if (analysisPanel.state.selectedChartType === 'pie') {
        storeType = 'energy.CostUsageDistribution';
      } else {
        storeType = 'energy.CostUsage';
      }

      let config = {
        type: analysisPanel.state.selectedChartType,
        storeType: storeType
      };

      let params = {
        submitParams: submitParams,
        config: config,
        calendar: analysisPanel.state.calendarType,
      };
      if (analysisPanel.state.yaxisConfig !== null) {
        params.yaxisConfig = analysisPanel.state.yaxisConfig;
      }
      let contentSyntax = {
        params: params
      };
      widgetDto.ContentSyntax = JSON.stringify(contentSyntax);
      widgetDto.Comment = analysisPanel.state.remarkText;
      if (!!menuIndex) {
        return widgetDto;
      } else {
        FolderAction.updateWidgetDtos(widgetDto);
      }
    //FolderAction.updateWidgetDtos(widgetDto, menuIndex);
    },
    saveUnitCost2Dashboard(analysisPanel, menuIndex) {
      let chartType = analysisPanel.state.selectedChartType;
      let selectedList = CostStore.getSelectedList();
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationBySelectedList(selectedList);
      let widgetDto = _.cloneDeep(analysisPanel.props.widgetDto);
      let submitParams1 = CostStore.getSubmitParams();
      var commodityIds = submitParams1.commodityIds;
      var viewAssociation = submitParams1.viewAssociation;
      var benchmarkOption = submitParams1.benchmarkOption || null;
      var unitType = submitParams1.viewOption.DataOption.UnitType;

      let paramsObj = CostStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        step = paramsObj.step,
        widgetTimeRanges;

      //submitParams part
      let submitParams = {
        options: nodeNameAssociation,
        viewAssociation: viewAssociation,
        commodityIds: commodityIds,
        benchmarkOption: benchmarkOption

      };
      //time range part
      let relativeDate = CostStore.getRelativeDate();
      if (relativeDate !== 'Customerize') {
        widgetTimeRanges = [{
          relativeDate: relativeDate
        }];
      } else {
        widgetTimeRanges = timeRanges;
      }

      // viewOption part
      let viewOption = {
        TimeRanges: widgetTimeRanges,
        DataOption: {
          UnitType: unitType
        },
        Step: step,
        IncludeNavigatorData: true
      };

      let bizMap = {
        Energy: 1,
        Unit: 2,
        Ratio: 3,
        Label: 4,
        Rank: 5
      };
      let dataUsageType = bizMap[analysisPanel.props.bizType];
      viewOption.DataUsageType = dataUsageType;

      submitParams.viewOption = viewOption;

      widgetDto.WidgetSeriesArray = ChartStatusStore.getWidgetSaveStatus();

      //storeType part
      let config = {
        type: analysisPanel.state.selectedChartType,
        storeType: 'energy.UnitCostUsage'
      };

      let params = {
        submitParams: submitParams,
        config: config,
        calendar: analysisPanel.state.calendarType,
      };
      if (analysisPanel.state.yaxisConfig !== null) {
        params.yaxisConfig = analysisPanel.state.yaxisConfig;
      }

      let contentSyntax = {
        params: params
      };
      widgetDto.ContentSyntax = JSON.stringify(contentSyntax);
      widgetDto.Comment = analysisPanel.state.remarkText;
      if (!!menuIndex) {
        return widgetDto;
      } else {
        FolderAction.updateWidgetDtos(widgetDto);
      }
    //FolderAction.updateWidgetDtos(widgetDto, menuIndex);
    },
    saveCarbon2Dashboard(analysisPanel, menuIndex) {
      let chartType = analysisPanel.state.selectedChartType;
      let selectedList = {},
        hierarchyNode = CommodityStore.getHierNode(),
        commodityList = CommodityStore.getCommonCommodityList();
      selectedList.hierarchyNode = hierarchyNode;
      selectedList.commodityList = commodityList;
      let hierarchyId = hierarchyNode.hierId;
      let commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationBySelectedList(selectedList);
      let widgetDto = _.cloneDeep(analysisPanel.props.widgetDto);
      let submitParams1 = CarbonStore.getSubmitParams(),
        benchmarkOption = submitParams1.benchmarkOption || null,
        viewOption1 = submitParams1.viewOption,
        step = viewOption1.Step,
        timeRanges = viewOption1.TimeRanges,
        widgetTimeRanges;

      //submitParams part
      let submitParams = {
        options: nodeNameAssociation,
        hierarchyId: hierarchyId,
        commodityIds: commodityIds
      };
      //time range part
      if (timeRanges.length === 1) {
        let relativeDate = CarbonStore.getRelativeDate();
        if (relativeDate !== 'Customerize') {
          widgetTimeRanges = [{
            relativeDate: relativeDate
          }];
        } else {
          widgetTimeRanges = timeRanges;
        }
      }
      // viewOption part
      let viewOption = {
        TimeRanges: widgetTimeRanges,
        Step: step
      };

      let includeNavigatorData = (analysisPanel.state.selectedChartType !== 'pie');
      viewOption.IncludeNavigatorData = includeNavigatorData;

      let bizMap = {
        Energy: 1,
        Unit: 2,
        Ratio: 3,
        Label: 4,
        Rank: 5
      };
      let dataUsageType = bizMap[analysisPanel.props.bizType];
      viewOption.DataUsageType = dataUsageType;

      submitParams.hierarchyId = hierarchyId;
      submitParams.viewOption = viewOption;
      submitParams.destination = submitParams1.destination;

      //storeType part
      let storeType;
      if (analysisPanel.state.selectedChartType === 'pie') {
        storeType = 'energy.CarbonUsageDistribution';
      } else {
        storeType = 'energy.CarbonUsage';
      }

      let config = {
        type: analysisPanel.state.selectedChartType,
        storeType: storeType
      };

      let params = {
        submitParams: submitParams,
        config: config,
        calendar: analysisPanel.state.calendarType,
      };
      if (analysisPanel.state.yaxisConfig !== null) {
        params.yaxisConfig = analysisPanel.state.yaxisConfig;
      }

      let contentSyntax = {
        params: params
      };
      widgetDto.WidgetSeriesArray = ChartStatusStore.getWidgetSaveStatus();
      widgetDto.ContentSyntax = JSON.stringify(contentSyntax);
      widgetDto.Comment = analysisPanel.state.remarkText;
      if (!!menuIndex) {
        return widgetDto;
      } else {
        FolderAction.updateWidgetDtos(widgetDto);
      }
    //  FolderAction.updateWidgetDtos(widgetDto, menuIndex);
    },
    saveUnitCarbon2Dashboard(analysisPanel, menuIndex) {
      let chartType = analysisPanel.state.selectedChartType;
      let selectedList = {},
        hierarchyNode = CommodityStore.getHierNode(),
        commodityList = CommodityStore.getCommonCommodityList();
      selectedList.hierarchyNode = hierarchyNode;
      selectedList.commodityList = commodityList;
      let hierarchyId = hierarchyNode.hierId;
      let commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
      let dimNode = selectedList.dimNode;
      let viewAssociation = CommonFuns.getViewAssociation(hierarchyId, dimNode);
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationBySelectedList(selectedList);
      let widgetDto = _.cloneDeep(analysisPanel.props.widgetDto);
      let submitParams1 = CarbonStore.getSubmitParams(),
        benchmarkOption = submitParams1.benchmarkOption || null,
        viewOption1 = submitParams1.viewOption,
        step = viewOption1.Step,
        timeRanges = viewOption1.TimeRanges,
        unitType = viewOption1.DataOption.UnitType,
        widgetTimeRanges;

      //submitParams part
      let submitParams = {
        options: nodeNameAssociation,
        hierarchyId: hierarchyId,
        commodityIds: commodityIds,
        benchmarkOption: benchmarkOption
      };
      //time range part
      let relativeDate = CarbonStore.getRelativeDate();
      if (relativeDate !== 'Customerize') {
        widgetTimeRanges = [{
          relativeDate: relativeDate
        }];
      } else {
        widgetTimeRanges = timeRanges;
      }

      // viewOption part
      let viewOption = {
        TimeRanges: widgetTimeRanges,
        DataOption: {
          UnitType: unitType
        },
        Step: step,
        IncludeNavigatorData: true,
      };

      let bizMap = {
        Energy: 1,
        Unit: 2,
        Ratio: 3,
        Label: 4,
        Rank: 5
      };
      let dataUsageType = bizMap[analysisPanel.props.bizType];
      viewOption.DataUsageType = dataUsageType;

      submitParams.hierarchyId = hierarchyId;
      submitParams.destination = submitParams1.destination;
      submitParams.viewOption = viewOption;

      //storeType part
      let config = {
        type: analysisPanel.state.selectedChartType,
        storeType: 'energy.UnitCarbonUsage'
      };

      let params = {
        submitParams: submitParams,
        config: config,
        calendar: analysisPanel.state.calendarType,
      };
      if (analysisPanel.state.yaxisConfig !== null) {
        params.yaxisConfig = analysisPanel.state.yaxisConfig;
      }

      let contentSyntax = {
        params: params
      };
      widgetDto.WidgetSeriesArray = ChartStatusStore.getWidgetSaveStatus();
      widgetDto.ContentSyntax = JSON.stringify(contentSyntax);
      widgetDto.Comment = analysisPanel.state.remarkText;
      if (!!menuIndex) {
        return widgetDto;
      } else {
        FolderAction.updateWidgetDtos(widgetDto);
      }
    //FolderAction.updateWidgetDtos(widgetDto, menuIndex);
    },
    saveLabel2Dashboard(analysisPanel, menuIndex) {
      let chartType = analysisPanel.state.selectedChartType;
      let tagOptions = LabelStore.getTagOpions();
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions, TagStore.getCurrentDimInfo());
      let widgetDto = _.cloneDeep(analysisPanel.props.widgetDto);
      let submitParams1 = LabelStore.getSubmitParams();
      var tagIds = submitParams1.tagIds;
      var labelingType = submitParams1.labelingType;
      var viewOption = submitParams1.viewOption;
      var benchmarkOption = submitParams1.benchmarkOption;


      //submitParams part
      let submitParams = {
        tagIds: tagIds,
        options: nodeNameAssociation,
        labelingType: labelingType,
        viewOption: viewOption,
        benchmarkOption: benchmarkOption
      };

      let config = {
        type: 'labeling',
        storeType: 'energy.Labeling'
      };

      let params = {
        submitParams: submitParams,
        config: config,
        calendar: null
      };

      let contentSyntax = {
        params: params
      };
      widgetDto.ContentSyntax = JSON.stringify(contentSyntax);
      widgetDto.Comment = analysisPanel.state.remarkText;
      if (!!menuIndex) {
        return widgetDto;
      } else {
        FolderAction.updateWidgetDtos(widgetDto);
      }
    //FolderAction.updateWidgetDtos(widgetDto, menuIndex);
    },
    saveRank2Dashboard(analysisPanel, menuIndex) {
      let chartType = analysisPanel.state.selectedChartType;
      let widgetDto = _.cloneDeep(analysisPanel.props.widgetDto);
      let submitParams1 = RankStore.getSubmitParams();
      var commodityIds = submitParams1.commodityIds;
      var hierarchyIds = submitParams1.hierarchyIds;
      var rankType = submitParams1.rankType;
      let paramsObj = RankStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        widgetTimeRanges;

      //submitParams part
      let submitParams = {
        options: null,
        commodityIds: commodityIds,
        hierarchyIds: hierarchyIds,
        rankType: rankType
      };

      //time range part
      let relativeDate = RankStore.getRelativeDate();
      if (relativeDate !== 'Customerize') {
        widgetTimeRanges = [{
          relativeDate: relativeDate
        }];
      } else {
        widgetTimeRanges = timeRanges;
      }

      // viewOption part
      let viewOption = {
        TimeRanges: widgetTimeRanges
      };
      submitParams.viewOption = viewOption;

      var energyType = analysisPanel.state.energyType;
      var api = '';

      if (energyType === "Energy") {
        api = 'RankingEnergyUsageData';
      } else if (energyType === "Carbon") {
        api = 'RankingCarbonData';
        submitParams.destination = submitParams1.destination;
      } else {
        api = 'RankingCostData';
      }
      submitParams.api = api;

      let config = {
        type: 'column',
        storeType: 'energy.RankUsage'
      };
      let diagramConfig = {
        rangeCode: analysisPanel.state.range,
        orderCode: analysisPanel.state.order,
        minPosition: 0
      };
      let params = {
        submitParams: submitParams,
        config: config,
        diagramConfig: diagramConfig,
        calendar: null
      };
      if (analysisPanel.state.yaxisConfig !== null) {
        params.yaxisConfig = analysisPanel.state.yaxisConfig;
      }

      let contentSyntax = {
        params: params
      };
      widgetDto.ContentSyntax = JSON.stringify(contentSyntax);
      widgetDto.Comment = analysisPanel.state.remarkText;
      if (!!menuIndex) {
        return widgetDto;
      } else {
        FolderAction.updateWidgetDtos(widgetDto);
      }
    //FolderAction.updateWidgetDtos(widgetDto, menuIndex);
    }
  },
  handleNavigatorChangeLoadFnStrategy: {
    handleNavigatorChangeLoad(analysisPanel) {
      let tagOptions = EnergyStore.getTagOpions(),
        dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end;

      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, tagOptions, 'Customerize', analysisPanel);
    },
    handleCostNavigatorChangeLoad(analysisPanel) {
      let tagOptions = CostStore.getSelectedList(),
        dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end;

      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, tagOptions, 'Customerize', analysisPanel);
    },
    handleCarbonNavigatorChangeLoad(analysisPanel) {
      let paramsObj = CarbonStore.getSubmitParams();
      let tagOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      let hierarchyId = tagOptions.hierarchyId,
        commodityIds = tagOptions.commodityIds,
        destination = paramsObj.destination,
        dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end;
      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, hierarchyId, commodityIds, destination, 'Customerize', analysisPanel);
    },
    handleUnitEnergyNavigatorChangeLoad(analysisPanel) {
      let tagOptions = EnergyStore.getTagOpions(),
        dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end,
        submitParams = EnergyStore.getSubmitParams(),
        unitType = submitParams.viewOption.DataOption.UnitType,
        benchmarkOption = submitParams.benchmarkOption;

      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, tagOptions, unitType, 'Customerize', analysisPanel, benchmarkOption);
    },
    handleUnitCostNavigatorChangeLoad(analysisPanel) {
      let tagOptions = CostStore.getSelectedList(),
        dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end,
        submitParams = CostStore.getSubmitParams(),
        unitType = submitParams.viewOption.DataOption.UnitType,
        benchmarkOption = submitParams.benchmarkOption;

      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, tagOptions, unitType, 'Customerize', analysisPanel, benchmarkOption);
    },
    handleUnitCarbonNavigatorChangeLoad(analysisPanel) {
      let paramsObj = CarbonStore.getSubmitParams();
      let tagOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      let hierarchyId = tagOptions.hierarchyId,
        commodityIds = tagOptions.commodityIds,
        destination = paramsObj.destination,
        dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end,
        unitType = paramsObj.viewOption.DataOption.UnitType,
        benchmarkOption = paramsObj.benchmarkOption;

      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, hierarchyId, commodityIds, destination, unitType, 'Customerize', analysisPanel, benchmarkOption);
    },
    handleRatioNavigatorChangeLoad(analysisPanel) {
      let paramsObj = RatioStore.getSubmitParams();
      let tagOptions = RatioStore.getRatioOpions();
      let ratioType = paramsObj.ratioType,
        dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end;

      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, tagOptions, ratioType, 'Customerize', analysisPanel);
    }
  },
  isCalendarDisabledFnStrategy: {
    isCalendarDisabled(analysisPanel) {
      let tagOptions = EnergyStore.getTagOpions();
      if (!tagOptions) {
        return false;
      }
      let paramsObj = EnergyStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges;

      let disabled = false;

      if (timeRanges.length > 1) {
        disabled = true;
      } else if (tagOptions.length > 1) {
        let hierId = null;
        tagOptions.forEach(option => {
          if (!hierId) {
            hierId = option.hierId;
          } else if (hierId !== option.hierId) {
            disabled = true;
            return;
          }
        });
      }
      if (analysisPanel.state.selectedChartType === 'pie' || analysisPanel.state.selectedChartType === 'rawdata') {
        disabled = true;
      }
      return disabled;
    },
    isCarbonCalendarDisabled() {
      return false;
    },
    isCostCalendarDisabled() {
      return false;
    },
  },
  handleWeatherMenuItemClickFnStrategy: {
    handleWeatherMenuItemClick(analysisPanel, toggleTemp, toggleHumi) {
      let paramsObj = EnergyStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        tagOptions = EnergyStore.getTagOpions(),
        submitParams = EnergyStore.getSubmitParams(),
        step = paramsObj.step;
      let wasTemp = !!submitParams.viewOption.IncludeTempValue,
        wasHumi = !!submitParams.viewOption.IncludeHumidityValue,
        weather;

      if (toggleTemp === true) {
        weather = {
          IncludeTempValue: !wasTemp,
          IncludeHumidityValue: wasHumi
        };
      }
      if (toggleHumi === true) {
        weather = {
          IncludeTempValue: wasTemp,
          IncludeHumidityValue: !wasHumi
        };
      }
      analysisPanel.setState({
        weatherOption: weather
      });
      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false, weather);
    },
  },
  isWeatherDisabledFnStrategy: {
    isWeatherDisabled(analysisPanel) {
      let disabled = TagStore.getWeatherBtnDisabled();
      if (disabled) {
        return I18N.EM.WeatherSupportsOnlySingleHierarchy;
      }
      let paramsObj = EnergyStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        step = paramsObj.step;
      if (timeRanges.length !== 1) {
        return I18N.EM.WeatherSupportsNotMultiTime;
      }
      if (step === 0) {
        return I18N.EM.WeatherSupportsNotMinuteStep;
      }
      if (analysisPanel.state.selectedChartType === 'pie') {
        return I18N.EM.WeatherSupportsNotPie;
      }
      let errors = EnergyStore.getErrorCodes();
      if (!!errors && errors.length && (errors[0] + '' === '02810' || errors[0] + '' === '02809')) {
        analysisPanel.state.weatherOption = null;
      }
      return false;
    }
  },
  onAnalysisPanelDidUpdateFnStrategy: {
    onAnalysisPanelDidUpdate(analysisPanel) {
      if (analysisPanel.state.chartStrategy.isCalendarDisabledFn(analysisPanel)) { //不符合日历本景色条件的。

      } else if (analysisPanel.state.energyRawData && !analysisPanel.state.isCalendarInited) {
        let paramsObj = EnergyStore.getParamsObj(),
          step = paramsObj.step,
          timeRanges = paramsObj.timeRanges,
          as = analysisPanel.state;

        if (analysisPanel.refs.ChartComponent) {
          var chartCmp = analysisPanel.refs.ChartComponent,
            chartObj = chartCmp.refs.highstock;

          CalendarManager.init(as.selectedChartType, step, as.energyRawData.Calendars, chartObj, timeRanges);
          analysisPanel.setState({
            isCalendarInited: true
          });
        }
      }
    },
    onRatioAnalysisPanelDidUpdate(analysisPanel) {
      if (analysisPanel.state.chartStrategy.isCalendarDisabledFn(analysisPanel)) { //不符合日历本景色条件的。

      } else if (analysisPanel.state.energyRawData && !analysisPanel.state.isCalendarInited) {
        let paramsObj = RatioStore.getParamsObj(),
          step = paramsObj.step,
          timeRanges = paramsObj.timeRanges,
          as = analysisPanel.state;

        if (analysisPanel.refs.ChartComponent) {
          var chartCmp = analysisPanel.refs.ChartComponent,
            chartObj = chartCmp.refs.highstock;

          CalendarManager.init(as.selectedChartType, step, as.energyRawData.Calendars, chartObj, timeRanges);
          analysisPanel.setState({
            isCalendarInited: true
          });
        }
      }
    },
    onCarbonAnalysisPanelDidUpdate(analysisPanel) {
      if (analysisPanel.state.chartStrategy.isCalendarDisabledFn()) { //不符合日历本景色条件的。

      } else if (analysisPanel.state.energyRawData && !analysisPanel.state.isCalendarInited) {
        let paramsObj = CarbonStore.getParamsObj(),
          step = paramsObj.step,
          timeRanges = paramsObj.timeRanges,
          as = analysisPanel.state;

        var chartCmp = analysisPanel.refs.ChartComponent;
        if (!!chartCmp) {
          var chartObj = chartCmp.refs.highstock;
          if (!!chartObj) {
            CalendarManager.init(as.selectedChartType, step, as.energyRawData.Calendars, chartObj, timeRanges);
          }
        }

        analysisPanel.setState({
          isCalendarInited: true
        });
      }
    },
    onCostAnalysisPanelDidUpdate(analysisPanel) {
      if (analysisPanel.state.chartStrategy.isCalendarDisabledFn()) { //不符合日历本景色条件的。

      } else if (analysisPanel.state.energyRawData && !analysisPanel.state.isCalendarInited) {
        let paramsObj = CostStore.getParamsObj(),
          step = paramsObj.step,
          timeRanges = paramsObj.timeRanges,
          as = analysisPanel.state;

        var chartCmp = analysisPanel.refs.ChartComponent,
          chartObj = chartCmp.refs.highstock;

        CalendarManager.init(as.selectedChartType, step, as.energyRawData.Calendars, chartObj, timeRanges);
        analysisPanel.setState({
          isCalendarInited: true
        });
      }
    },
  },
  handleCalendarChangeFnStrategy: {
    handleCalendarChange(calendarType, analysisPanel) {
      var chartCmp = analysisPanel.refs.ChartComponent,
        chartObj = chartCmp.refs.highstock;

      if (!CalendarManager.getShowType()) {
        CalendarManager.showCalendar(chartObj, calendarType);
      } else if (CalendarManager.getShowType() === calendarType) {
        CalendarManager.hideCalendar(chartObj);
      } else {
        CalendarManager.hideCalendar(chartObj);
        CalendarManager.showCalendar(chartObj, calendarType);
      }
      analysisPanel.setState({
        calendarType: CalendarManager.getShowType()
      });
    }
  },
  handleStepChangeFnStrategy: {
    handleEnergyStepChange(analysisPanel, step) {
      let tagOptions = EnergyStore.getTagOpions(),
        paramsObj = EnergyStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges;
      var weatherOption = analysisPanel.state.weatherOption;
      if (step === 0) {
        weatherOption = null;
      }
      analysisPanel.setState({
        step: step,
        isCalendarInited: false,
        weatherOption: weatherOption
      });

      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false, weatherOption);
    },
    handleCostStepChange(analysisPanel, step) {
      let tagOptions = CostStore.getSelectedList(),
        paramsObj = CostStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges;

      analysisPanel.setState({
        step: step,
        isCalendarInited: false
      });
      analysisPanel._onTouBtnDisabled(step);
      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false, analysisPanel);
    },
    handleCarbonStepChange(analysisPanel, step) {
      let paramsObj = CarbonStore.getSubmitParams();
      let tagOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      let hierarchyId = tagOptions.hierarchyId,
        commodityIds = tagOptions.commodityIds,
        destination = paramsObj.destination,
        viewOp = paramsObj.viewOption;
      viewOp.Step = step;

      analysisPanel.setState({
        step: step,
        isCalendarInited: false
      });
      analysisPanel.state.chartStrategy.getEnergyDataFn(hierarchyId, commodityIds, destination, viewOp, false, analysisPanel);
    },
    handleRatioStepChange(analysisPanel, step) {
      let paramsObj = RatioStore.getSubmitParams();
      let tagOptions = RatioStore.getRatioOpions();

      let viewOp = paramsObj.viewOption,
        timeRanges = viewOp.TimeRanges,
        benchmarkOption = paramsObj.paramsObj,
        ratioType = paramsObj.ratioType;

      analysisPanel.setState({
        step: step,
        isCalendarInited: false
      });
      if (ratioType === 1 && (step === 0 || step === 1))
        step = 2;
      if (ratioType === 2 && (step === 0 || step === 1 || step === 2))
        step = 3;
      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, ratioType, false, benchmarkOption);
    },
    handleUnitEnergyStepChange(analysisPanel, step) {
      let tagOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn(),
        paramsObj = EnergyStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        submitParams = EnergyStore.getSubmitParams(),
        benchmarkOption = submitParams.benchmarkOption,
        unitType = submitParams.viewOption.DataOption.UnitType;

      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, unitType, false, benchmarkOption);
      analysisPanel.setState({
        step: step,
        isCalendarInited: false
      });
    },
    handleUnitCostStepChange(analysisPanel, step) {
      let tagOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn(),
        paramsObj = CostStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        submitParams = CostStore.getSubmitParams(),
        benchmarkOption = submitParams.benchmarkOption,
        unitType = submitParams.viewOption.DataOption.UnitType;

      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, unitType, false, benchmarkOption);
      analysisPanel.setState({
        step: step,
        isCalendarInited: false
      });
    },
    handleUnitCarbonStepChange(analysisPanel, step) {
      let paramsObj = CarbonStore.getSubmitParams();
      let tagOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      let hierarchyId = tagOptions.hierarchyId,
        commodityIds = tagOptions.commodityIds,
        destination = paramsObj.destination,
        viewOp = paramsObj.viewOption,
        benchmarkOption = paramsObj.benchmarkOption;
      viewOp.Step = step;

      analysisPanel.setState({
        step: step,
        isCalendarInited: false
      });
      analysisPanel.state.chartStrategy.getEnergyDataFn(hierarchyId, commodityIds, destination, viewOp, false, benchmarkOption);
    },
  },
  handleBenchmarkMenuItemClickFnStrategy: {
    handleUnitBenchmarkMenuItemClick(analysisPanel, benchmarkOption) {
      let tagOptions = EnergyStore.getTagOpions(),
        paramsObj = EnergyStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        step = paramsObj.step,
        unitType = EnergyStore.getSubmitParams().viewOption.DataOption.UnitType;
      if (benchmarkOption.IndustryId === -1) {
        benchmarkOption = null;
      }
      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, unitType, false, benchmarkOption);
      analysisPanel.setState({
        benchmarkOption: benchmarkOption
      });
    },
    handleUnitCostBenchmarkMenuItemClick(analysisPanel, benchmarkOption) {
      let tagOptions = CostStore.getSelectedList(),
        paramsObj = CostStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        step = paramsObj.step,
        unitType = CostStore.getSubmitParams().viewOption.DataOption.UnitType;
      if (benchmarkOption.IndustryId === -1) {
        benchmarkOption = null;
      }
      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, unitType, false, benchmarkOption);
    },
    handleUnitCarbonBenchmarkMenuItemClick(analysisPanel, benchmarkOption) {
      let paramsObj = CarbonStore.getSubmitParams();
      let hierarchyId = paramsObj.hierarchyId,
        commodityIds = paramsObj.commodityIds,
        destination = paramsObj.destination,
        viewOp = paramsObj.viewOption;
      if (benchmarkOption.IndustryId === -1) {
        benchmarkOption = null;
      }
      analysisPanel.state.chartStrategy.getEnergyDataFn(hierarchyId, commodityIds, destination, viewOp, false, benchmarkOption);
    },
    handleRatioBenchmarkMenuItemClick(analysisPanel, benchmarkOption) {
      let tagOptions = RatioStore.getRatioOpions(),
        paramsObj = RatioStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        step = paramsObj.step,
        ratioType = RatioStore.getSubmitParams().viewOption.DataOption.RatioType;
      if (benchmarkOption.IndustryId === -1) {
        benchmarkOption = null;
      }
      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, ratioType, false, benchmarkOption);
    },
  },
  getChartSubToolbarFnStrategy: {
    getEnergySubToolbar(analysisPanel) {
      var toolElement,
        clearChartBtnEl = ChartStrategyFactor.getClearChartBtn(analysisPanel);
      let chartType = analysisPanel.state.selectedChartType;
      let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel, ['line', 'column', 'stack', 'pie', 'rawdata']);
      let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);
      if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
        toolElement = <div style={{
          display: 'flex',
          minHeight: '48px',
          height: '48px'
        }}>
        <div style={{
          marginLeft: '10px'
        }}>
         <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
       </div>
        <div style={{
          margin: '14px 20px 0 23px'
        }}>{chartTypeIconMenu}</div>

      {analysisPanel.state.timeRanges?<StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>:null}
             <div style={{
          margin: '5px 30px 0px auto'
        }}>
               {configBtn}
               <div style={{
          display: 'inline-block',
          marginLeft: '30px'
        }}>{clearChartBtnEl}</div>
             </div>
             <BaselineCfg  ref="baselineCfg"/>
           </div>;
      } else if (chartType === 'rawdata') {
        toolElement = <div style={{
          display: 'flex',
          minHeight: '48px',
          height: '48px'
        }}>
             <div style={{
          margin: '14px 0 0 30px'
        }}>{chartTypeIconMenu}</div>
             <div style={{
          margin: '5px 30px 0px auto'
        }}>
               {configBtn}
               <div style={{
          display: 'inline-block',
          marginLeft: '30px'
        }}>{clearChartBtnEl}</div>
             </div>
             <BaselineCfg  ref="baselineCfg"/>
           </div>;
      } else if (chartType === 'pie') {
        toolElement = <div style={{
          display: 'flex',
          minHeight: '48px',
          height: '48px'
        }}>
             <div style={{
          margin: '14px 0 0 23px'
        }}>{chartTypeIconMenu}</div>
             <div style={{
          margin: '5px 30px 0px auto'
        }}>
               {configBtn}
               <div style={{
          display: 'inline-block',
          marginLeft: '30px'
        }}>{clearChartBtnEl}</div>
             </div>
             <BaselineCfg  ref="baselineCfg"/>
           </div>;
      }
      return toolElement;
    },
    getCostSubToolbar(analysisPanel) {
      var toolElement,
        clearChartBtnEl = ChartStrategyFactor.getClearChartBtn(analysisPanel);
      let chartType = analysisPanel.state.selectedChartType;
      let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel, ['line', 'column', 'stack', 'pie']);
      let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);

      if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
        toolElement = <div style={{
          display: 'flex',
          minHeight: '48px',
          height: '48px'
        }}>
        <div style={{
          marginLeft: '10px'
        }}>
          <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
        </div>
        <div style={{
          margin: '14px 20px 0 23px'
        }}>{chartTypeIconMenu}</div>

      {analysisPanel.state.timeRanges?<StepSelector minStep={1} stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>:null}
             <div style={{
          margin: '5px 30px 0px auto'
        }}>
               {configBtn}
               <div style={{
          display: 'inline-block',
          marginLeft: '30px'
        }}>{clearChartBtnEl}</div>
             </div>
           </div>;
      } else if (chartType === 'pie') {
        toolElement = <div style={{
          display: 'flex',
          minHeight: '48px',
          height: '48px'
        }}>
             <div style={{
          margin: '14px 0 0 23px'
        }}>{chartTypeIconMenu}</div>
             <div style={{
          margin: '5px 30px 0px auto'
        }}>
               {configBtn}
               <div style={{
          display: 'inline-block',
          marginLeft: '30px'
        }}>{clearChartBtnEl}</div>
             </div>
           </div>;
      }
      return toolElement;
    },
    getCarbonSubToolbar(analysisPanel) {
      var toolElement,
        clearChartBtnEl = ChartStrategyFactor.getClearChartBtn(analysisPanel);
      let chartType = analysisPanel.state.selectedChartType;
      let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel, ['line', 'column', 'stack', 'pie']);
      let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);
      let menuItems = ConstStore.getCarbonTypeItem();
      let menuItemChange = function(e, selectedIndex, value) {
        CarbonStore.setDestination(value);
        analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
        return true;
      };
      var value = CarbonStore.getDestination();
      var labelStyle={fontSize:'12px',lineHeight:'32px',paddingRight:'0'};
      var carbonDest = <div className='jazz-energy-carbon-dest'><DropDownMenu style={{
        width: '90px'
      }} labelStyle={labelStyle} value={value} onChange={menuItemChange}>{menuItems}</DropDownMenu></div>;

      if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
        toolElement = <div style={{
          display: 'flex',
          minHeight: '48px',
          height: '48px'
        }}>
        <div style={{
          marginLeft: '10px'
        }}>
          <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
        </div>
        <div style={{
          margin: '14px 20px 0 23px'
        }}>{chartTypeIconMenu}</div>
      {analysisPanel.state.timeRanges?<StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>:null}
             <div style={{
          margin: '5px 30px 0px auto'
        }}>
               {carbonDest}
               {configBtn}
               <div style={{
          display: 'inline-block',
          marginLeft: '30px'
        }}>{clearChartBtnEl}</div>
             </div>
             <BaselineCfg  ref="baselineCfg"/>
           </div>;
      } else if (chartType === 'pie') {
        toolElement = <div style={{
          display: 'flex',
          minHeight: '48px',
          height: '48px'
        }}>
             <div style={{
          margin: '14px 0 0 23px'
        }}>{chartTypeIconMenu}</div>
             <div style={{
          margin: '5px 30px 0px auto'
        }}>
               {carbonDest}
               {configBtn}
               <div style={{
          display: 'inline-block',
          marginLeft: '30px'
        }}>{clearChartBtnEl}</div>
             </div>
             <BaselineCfg  ref="baselineCfg"/>
           </div>;
      }
      return toolElement;
    },
    getUnitEnergySubToolbar(analysisPanel) {
      var toolElement,
        clearChartBtnEl = ChartStrategyFactor.getClearChartBtn(analysisPanel);
      let chartType = analysisPanel.state.selectedChartType;
      let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel, ['line', 'column']);
      let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);
      toolElement = <div style={{
        display: 'flex',
        minHeight: '48px',
        height: '48px'
      }}>
      <div style={{
        marginLeft: '10px'
      }}>
      <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
      </div>
      <div style={{
        margin: '14px 20px 0 23px'
      }}>{chartTypeIconMenu}</div>

    {analysisPanel.state.timeRanges?<StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>:null}
           <div style={{
        margin: '5px 30px 0px auto'
      }}>
             {configBtn}
             <div style={{
        display: 'inline-block',
        marginLeft: '30px'
      }}>{clearChartBtnEl}</div>
           </div>
           <BaselineCfg  ref="baselineCfg"/>
         </div>;

      return toolElement;
    },
    getUnitCostSubToolbar(analysisPanel) {
      var toolElement,
        clearChartBtnEl = ChartStrategyFactor.getClearChartBtn(analysisPanel);
      let chartType = analysisPanel.state.selectedChartType;
      let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel, ['line', 'column']);
      let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);
      toolElement = <div style={{
        display: 'flex',
        minHeight: '48px',
        height: '48px'
      }}>
      <div style={{
        marginLeft: '10px'
      }}>
      <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
      </div>
      <div style={{
        margin: '14px 20px 0 23px'
      }}>{chartTypeIconMenu}</div>

    {analysisPanel.state.timeRanges?<StepSelector minStep={1} stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>:null}
           <div style={{
        margin: '5px 30px 0px auto'
      }}>
             {configBtn}
             <div style={{
        display: 'inline-block',
        marginLeft: '30px'
      }}>{clearChartBtnEl}</div>
           </div>
         </div>;

      return toolElement;
    },
    getUnitCarbonSubToolbar(analysisPanel) {
      var toolElement,
        clearChartBtnEl = ChartStrategyFactor.getClearChartBtn(analysisPanel);
      let chartType = analysisPanel.state.selectedChartType;
      let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel, ['line', 'column']);
      let menuItems = ConstStore.getCarbonTypeItem();
      let menuItemChange = function(e, selectedIndex, value) {
        CarbonStore.setDestination(value);
        analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
        return true;
      };
      var labelStyle={fontSize:'12px',lineHeight:'32px',paddingRight:'0'};
      var value = CarbonStore.getDestination();
      var carbonDest = <div className='jazz-energy-carbon-dest'><DropDownMenu value={value} style={{
        width: '90px'
      }} labelStyle={labelStyle} onChange={menuItemChange}>{menuItems}</DropDownMenu></div>;
      let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);
      toolElement = <div style={{
        display: 'flex',
        minHeight: '48px',
        height: '48px'
      }}>
      <div style={{
        marginLeft: '10px'
      }}>
      <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
      </div>
      <div style={{
        margin: '14px 20px 0 23px'
      }}>{chartTypeIconMenu}</div>

    {analysisPanel.state.timeRanges?<StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>:null}
           <div style={{
        margin: '5px 30px 0px auto'
      }}>
             {carbonDest}
             {configBtn}
             <div style={{
        display: 'inline-block',
        marginLeft: '30px'
      }}>{clearChartBtnEl}</div>
           </div>
           <BaselineCfg  ref="baselineCfg"/>
         </div>;

      return toolElement;
    },
    getRatioSubToolbar(analysisPanel) {
      var toolElement,
        clearChartBtnEl = ChartStrategyFactor.getClearChartBtn(analysisPanel);
      let chartType = analysisPanel.state.selectedChartType;
      let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel, ['line', 'column']);
      let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);

      let ratioType = analysisPanel.state.ratioType;
      let minStep = 2; //HOUR 1, DAY 2, Week 5, Month 3, Year 4
      if (ratioType == 2) {
        minStep = 5;
      }

      toolElement = <div style={{
        display: 'flex',
        minHeight: '48px',
        height: '48px'
      }}>
      <div style={{
        marginLeft: '10px'
      }}>
        <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
      </div>
      <div style={{
        margin: '14px 20px 0 23px'
      }}>{chartTypeIconMenu}</div>

    {analysisPanel.state.timeRanges?<StepSelector minStep={minStep} stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>:null}
           <div style={{
        margin: '5px 30px 0px auto'
      }}>
             {configBtn}
             <div style={{
        display: 'inline-block',
        marginLeft: '30px'
      }}>{clearChartBtnEl}</div>
           </div>
           <BaselineCfg  ref="baselineCfg"/>
         </div>;

      return toolElement;
    },
    getRankSubToolbar(analysisPanel) {
      var energyType = analysisPanel.state.energyType;
      var labelStyle={fontSize:'12px',lineHeight:'32px',paddingRight:'0'};
      var toolElement,
        clearChartBtnEl = ChartStrategyFactor.getClearChartBtn(analysisPanel);
      var carbonTypeBtn = null;
      if (energyType === 'Carbon') {
        carbonTypeBtn = <DropDownMenu labelStyle={labelStyle} value={analysisPanel.state.destination} ref='carbonType' onChange={analysisPanel._onCarbonTypeChange}>{ConstStore.getCarbonTypeItem()}</DropDownMenu>;
      }
      var orderItem = ConstStore.getOrderItem();
      var rangeItem = ConstStore.getRangeItem();
      var orderCombo = <DropDownMenu labelStyle={labelStyle} value={analysisPanel.state.order} ref='orderCombo' onChange={analysisPanel._onOrderChange} style={{
        width: '90px'
      }}>{orderItem}</DropDownMenu>;
      var rangeCombo = <DropDownMenu labelStyle={labelStyle} value={analysisPanel.getRangeIndex()} ref='rangeCombo' onChange={analysisPanel._onRangeChange} style={{
        width: '90px',
        marginLeft: '30px'
      }}>{rangeItem}</DropDownMenu>;
      toolElement = <div style={{
        display: 'flex',
        minHeight: '48px',
        height: '48px'
      }}>
      <div style={{
        marginLeft: '10px'
      }}>
      <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
      </div>
         <div className='jazz-energy-rank-container'>
           {orderCombo}
           {rangeCombo}
         </div>

         <div style={{
        margin: '5px 30px 0px auto'
      }}>
           {carbonTypeBtn}
           <div style={{
        display: 'inline-block',
        marginLeft: '30px'
      }}>{clearChartBtnEl}</div>
         </div>
       </div>;
      return toolElement;
    }
  },
  handleConfigBtnItemTouchTapFnStrategy: {
    handleEnergyConfigBtnItemTouchTap(analysisPanel, menuParam, value) {
      let itemValue = value;
      var subMenuValue;
      switch (itemValue) {
        case 'history':
          analysisPanel.setState({
            showAddIntervalDialog: true
          });
          break;
        case 'config':
          analysisPanel.handleBaselineCfg();
          break;
        case 'sum':
          analysisPanel.setState({
            showSumDialog: true
          });
          break;
        case 'background':{
          subMenuValue = menuParam.props.value;
          if (subMenuValue === 'work' || subMenuValue === 'hc') {
            analysisPanel.state.chartStrategy.handleCalendarChangeFn(subMenuValue, analysisPanel);
          }
          break;
          }
        case 'weather': {
          subMenuValue = menuParam.props.value;
          if (subMenuValue === 'temperature') {
            analysisPanel.state.chartStrategy.handleWeatherMenuItemClickFn(analysisPanel, true, false);
          } else if (subMenuValue === 'humidity') {
            analysisPanel.state.chartStrategy.handleWeatherMenuItemClickFn(analysisPanel, false, true);
          }
          break;
          }

      }
    },
    handleUnitEnergyConfigBtnItemTouchTap(analysisPanel, subMenuItem, value) {
      let firstMenuItemValue = value;
      if (firstMenuItemValue === 'background') {
        var subMenuValue = subMenuItem.props.value;
        if (subMenuValue === 'work' || subMenuValue === 'hc') {
          analysisPanel.state.chartStrategy.handleCalendarChangeFn(subMenuValue, analysisPanel);
        }
      } else if (firstMenuItemValue === 'benchmark') {
        var benchmarkOption = {
          IndustryId: subMenuItem.props.industryId,
          ZoneId: subMenuItem.props.zoneId,
          benchmarkText: subMenuItem.props.primaryText
        };
        analysisPanel.state.chartStrategy.handleBenchmarkMenuItemClickFn(analysisPanel, benchmarkOption);
      }
    },
    handleCostConfigBtnItemTouchTap(analysisPanel, menuParam, value) {
      let itemValue = value;
      switch (itemValue) {
        case 'touCompare':
          var touBtnSelected = !analysisPanel.state.touBtnSelected;
          analysisPanel.setState({
            touBtnSelected: touBtnSelected
          }, () => {
            analysisPanel.onSearchDataButtonClick();
          });
          break;
        case 'background': {
          var subMenuValue = menuParam.props?menuParam.props.value:'';
          if (subMenuValue === 'work' || subMenuValue === 'hc') {
            analysisPanel.state.chartStrategy.handleCalendarChangeFn(subMenuValue, analysisPanel);
          }
          break;
          }
      }
    },
    handleCarbonConfigBtnItemTouchTap(analysisPanel, menuParam, value) {
      let itemValue = value;
      switch (itemValue) {
        case 'background':{
          var subMenuValue = menuParam.props?menuParam.props.value:'';
          if (subMenuValue === 'work' || subMenuValue === 'hc') {
            analysisPanel.state.chartStrategy.handleCalendarChangeFn(subMenuValue, analysisPanel);
          }
          break;
          }
      }
    },
  },
  getEnergyTypeComboFnStrategy: {
    empty() {},
    getEnergyTypeCombo(analysisPanel) {
      let types = [
        <MenuItem value='Energy' primaryText={I18N.EM.KpiModeEM} />,
        <MenuItem value='Cost' primaryText={I18N.EM.KpiModeCost} />,
        <MenuItem value='Carbon' primaryText={I18N.EM.KpiModeCarbon} />];
      return <DropDownMenu style={{
          width: '90px',
          marginRight: '10px'
        }} labelStyle={{fontSize:'12px',lineHeight:'32px',paddingRight:'0'}} value={analysisPanel.state.energyType} onChange={(e, selectedIndex, value)=>{analysisPanel.state.chartStrategy.onEnergyTypeChangeFn(analysisPanel, e, selectedIndex, value)}}>{types}</DropDownMenu>;
    }
  },
  getInitParamFnStrategy: {
    empty() {},
    getInitParam(analysisPanel) {
      let date = new Date();
      date.setHours(0, 0, 0);
      let last7Days = CommonFuns.dateAdd(date, -6, 'days');
      let endDate = CommonFuns.dateAdd(date, 1, 'days');
      analysisPanel.refs.relativeDate.setState({
        selectedIndex: 1
      });
      analysisPanel.refs.dateTimeSelector.setDateField(last7Days, endDate);
    }
  },
  onHierNodeChangeFnStrategy: {
    empty() {},
    onHierNodeChange(analysisPanel) {
      var industyMenuItems = analysisPanel.getIndustyMenuItems();
      var customerMenuItems = analysisPanel.getCustomizedMenuItems();
      if (!industyMenuItems) {
        return;
      }
      analysisPanel.setState({
        industyMenuItems: industyMenuItems,
        customerMenuItems: customerMenuItems
      }, () => {
        analysisPanel.enableLabelButton(true);
      });
    },
    unitEnergyOnHierNodeChange(analysisPanel) {
      //  var industryData = LabelMenuStore.getIndustryData();
      //  var zoneData = LabelMenuStore.getZoneData();
      //  var hierNode = LabelMenuStore.getHierNode();
      //  var benchmarkData = LabelMenuStore.getBenchmarkData();
      //  analysisPanel.setState({benchmarks:CommonFuns.filterBenchmarks(hierNode, industryData, zoneData, benchmarkData)});
      //return CommonFuns.filterBenchmarks(hierNode, industryData, zoneData, benchmarkData);
    }
  },
  onEnergyTypeChangeFnStrategy: {
    empty() {},
    onEnergyTypeChange(analysisPanel, e, selectedIndex, value) {
      if (analysisPanel.props.onEnergyTypeChange) {
        let menuItemVal = value;
        let capMenuItemVal = menuItemVal[0].toUpperCase() + menuItemVal.substring(1);
        // let chartSttg = ChartStrategyFactor.getStrategyByStoreType(capMenuItemVal);
        // if (analysisPanel) analysisPanel.setState({
        //     chartStrategy: chartSttg
        //   });
        // analysisPanel.props.onEnergyTypeChange(menuItem.value);
        FolderAction.setDisplayDialog('switchec', menuItemVal);
      }
    }
  },
  getAllDataFnStrategy: {
    empty() {},
    getAllData() {
      LabelMenuAction.getAllIndustries();
      LabelMenuAction.getAllZones();
      LabelMenuAction.getAllLabels();
      LabelMenuAction.getCustomerLabels();
    },
    unitGetAllData() {
      LabelMenuAction.getAllIndustries();
      LabelMenuAction.getAllZones();
      LabelMenuAction.getAllBenchmarks();
    }
  },
  initEnergyStoreByBizChartTypeFnStrategy: {
    initEnergyStoreByBizChartType(analysisPanel) {
      let chartType = analysisPanel.state.selectedChartType;
      switch (chartType) {
        case 'line':
        case 'column':
        case 'stack':
          EnergyStore.initReaderStrategy('EnergyTrendReader');
          break;
        case 'pie':
          EnergyStore.initReaderStrategy('EnergyPieReader');
          break;
        case 'rawdata': EnergyStore.initReaderStrategy('EnergyRawGridReader');
          break;
      }
    },
    initRatioStoreByBizChartType(analysisPanel) {
      let chartType = analysisPanel.state.selectedChartType;
      switch (chartType) {
        case 'line':
        case 'column': RatioStore.initReaderStrategy('EnergyTrendReader');
          break;
      }
    },
    initCostStoreByBizChartType(analysisPanel) {
      let chartType = analysisPanel.state.selectedChartType;
      switch (chartType) {
        case 'line':
        case 'column':
        case 'stack':
          CostStore.initReaderStrategy('CostTrendReader');
          break;
        case 'pie': CostStore.initReaderStrategy('CostPieReader');
          break;
      }
    },
    initUnitCostStoreByBizChartType(analysisPanel) {
      let chartType = analysisPanel.state.selectedChartType;
      CostStore.initReaderStrategy('UnitCostTrendReader');
    },
    initCarbonStoreByBizChartType(analysisPanel) {
      let chartType = analysisPanel.state.selectedChartType;
      switch (chartType) {
        case 'line':
        case 'column':
        case 'stack':
          CarbonStore.initReaderStrategy('CarbonTrendReader');
          break;
        case 'pie': CarbonStore.initReaderStrategy('CarbonPieReader');
          break;
      }
    },
    initUnitCarbonStoreByBizChartType(analysisPanel) {
      let chartType = analysisPanel.state.selectedChartType;
      CarbonStore.initReaderStrategy('UnitCarbonTrendReader');
    },
  },

  getInitialStateFnStrategy: {
    empty() {},
    getEnergyInitialState() {
      return {
        showAddIntervalDialog: false,
        showSumDialog: false,
        sumBtnStatus: false,
        weatherOption: null,
        calendarType: "",
      };
    },
    getUnitEnergyInitialState() {
      let state = {
        unitType: 2,
        benchmarks: null,
        benchmarkOption: null,
        calendarType: "",
      };
      return state;
    },
    getCostInitialState() {
      let state = {
        touBtnStatus: true,
        touBtnSelected: false,
        touBtnTooltip: '',
        calendarType: "",
      };
      return state;
    },
    getUnitCostInitialState() {
      let state = {
        unitType: 2,
        benchmarks: null,
        benchmarkOption: null,
        unitBaselineBtnStatus: CommodityStore.getUCButtonStatus(),
        calendarType: "",
      };
      return state;
    },
    getRatioInitialState() {
      let state = {
        ratioType: 1,
        benchmarks: null,
        calendarType: "",
      };
      return state;
    },
    getCarbonInitialState() {
      let state = {
        destination: 2,
        calendarType: "",
      };
      return state;
    },
    getUnitCarbonInitialState() {
      let state = {
        destination: 2,
        unitType: 2,
        benchmarks: null,
        benchmarkOption: null,
        unitBaselineBtnStatus: CommodityStore.getUCButtonStatus(),
        calendarType: "",
      };
      return state;
    },
    getRankInitialState() {
      let state = {
        rankType: 1,
        order: 1,
        range: 3,
        destination: 2,
        selectedChartType: 'column'
      };
      return state;
    },
    getLabelInitialState(analysisPanel) {
      var selectedLabelItem = analysisPanel.initSlectedLabelItem();
      var curMonth = (new Date()).getMonth();
      let state = {
        labelType: "industryZone", //industry,customized
        industyMenuItems: [],
        customerMenuItems: [],
        selectedLabelItem: selectedLabelItem,
        kpiTypeValue: 1,
        //kpiTypeIndex: 0,
        labelDisable: true,
        kpiTypeDisable: false,
        month: curMonth + 1,
        benchmarkOption: null,
        selectedYear: 10
      };
      return state;
    }
  },
  onSearchDataButtonClickFnStrategy: {
    onSearchDataButtonClick(analysisPanel, invokeFromMultiTime) {
      //invokeFromMultiTime 来判断是不是点击多时间段的绘制按钮进行查看。
      let clearWeatherflag = false;
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end;
      if (analysisPanel.state.selectedChartType == 'rawdata' && (endDate - startDate > 604800000)) {
        FolderAction.setDisplayDialog('errornotice', null, I18N.EM.RawData.ErrorForEnergy);
      } else {
        analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

        // deal with multi time submit
        if (!!invokeFromMultiTime) {
          if (analysisPanel.state.weatherOption !== null) {
            clearWeatherflag = true;
          }
          let multiRelativeType = MultipleTimespanStore.getOriginalType();
          let relativeDateValue = analysisPanel._getRelativeDateValue();

          if (multiRelativeType === 'Customerize') {
            let multiDateRange = MultipleTimespanStore.getMainDateRange();
            if (multiDateRange[0].getTime() !== startDate.getTime() || multiDateRange[1].getTime() !== endDate.getTime()) {
              dateSelector.setDateField(multiDateRange[0], multiDateRange[1]);
            }
            if (relativeDateValue !== 'Customerize') {
              analysisPanel._setRelativeDateByValue(multiRelativeType);
            }
          } else {

            if (relativeDateValue !== multiRelativeType) {
              analysisPanel._setRelativeDateByValue(multiRelativeType);
            }
          }
        } else {
          let timeRanges = MultipleTimespanStore.getSubmitTimespans();
          if (timeRanges !== null && timeRanges.length !== 1) {
            let multiRelativeType = MultipleTimespanStore.getOriginalType();
            let relativeDateValue = analysisPanel._getRelativeDateValue();
            if (multiRelativeType !== 'Customerize' && multiRelativeType === relativeDateValue) {

            } else {
              MultipleTimespanStore.initData(relativeDateValue, startDate, endDate);
            }
          }
        }



        var nodeOptions;

        if (startDate.getTime() >= endDate.getTime()) {
          GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.EM.ErrorNeedValidTimeRange);
          return;
        }

        nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
        if (!nodeOptions || nodeOptions.length === 0) {
          analysisPanel.setState({
            energyData: null
          });
          return;
        } else {
          if (analysisPanel.state.weatherOption !== null) {
            let hierId = null;

            nodeOptions.forEach(item => {
              if (hierId === null) {
                hierId = item.hierId;
              } else if (hierId !== item.hierId) {
                clearWeatherflag = true;
                return;
              }
            });
          }
        }

        let relativeDateValue = analysisPanel._getRelativeDateValue();

        let chartType = analysisPanel.state.selectedChartType;
        if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
          analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, relativeDateValue, analysisPanel, clearWeatherflag);
        } else {
          let timeRanges;
          if (chartType === 'pie') {
            let timeRanges;
            if (nodeOptions.length > 1) {
              MultiTimespanAction.clearMultiTimespan('both');
              timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
            } else {
              timeRanges = MultipleTimespanStore.getSubmitTimespans();
              if (timeRanges === null) {
                timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
              }
            }
            analysisPanel.state.chartStrategy.getPieEnergyDataFn(timeRanges, 2, nodeOptions, relativeDateValue);
          } else if (chartType === 'rawdata') {
            MultiTimespanAction.clearMultiTimespan('both');
            let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
            analysisPanel.state.chartStrategy.getEnergyRawDataFn(timeRanges, 0, nodeOptions, relativeDateValue);
          }
        }

        if (clearWeatherflag) {
          analysisPanel.setState({
            weatherOption: null
          });
        }
      }


    },
    onCostSearchDataButtonClick(analysisPanel) {
      analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

      let dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end,
        nodeOptions;

      if (startDate.getTime() >= endDate.getTime()) {
        GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.EM.ErrorNeedValidTimeRange);
        return;
      }

      nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      if (!nodeOptions.hierarchyNode || !nodeOptions.commodityList || nodeOptions.commodityList.length === 0) {
        analysisPanel.setState({
          energyData: null
        });
        return;
      }
      let relativeDateValue = analysisPanel._getRelativeDateValue();

      let chartType = analysisPanel.state.selectedChartType;
      if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
        analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, relativeDateValue, analysisPanel);
      } else if (chartType === 'pie') {
        let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
        analysisPanel.state.chartStrategy.getPieEnergyDataFn(timeRanges, 2, nodeOptions, relativeDateValue, analysisPanel);
      }
    },
    onCarbonSearchDataButtonClick(analysisPanel) {
      analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

      let dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end;

      if (startDate.getTime() >= endDate.getTime()) {
        GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.EM.ErrorNeedValidTimeRange);
        return;
      }

      let hierCommIds = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      if (!hierCommIds.commodityIds || hierCommIds.commodityIds.length === 0 || !hierCommIds.hierarchyId) {
        analysisPanel.setState({
          energyData: null
        });
        return;
      }
      let relativeDateValue = analysisPanel._getRelativeDateValue();

      let chartType = analysisPanel.state.selectedChartType;
      let dest = CarbonStore.getDestination();
      if (!dest)
        dest = 2;
      if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
        analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, hierCommIds.hierarchyId, hierCommIds.commodityIds, dest, relativeDateValue, analysisPanel);
      } else if (chartType === 'pie') {
        let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
        let viewOption = {
          DataUsageType: 4,
          IncludeNavigatorData: false,
          TimeRanges: timeRanges,
          Step: 2
        };
        //analysisPanel.state.chartStrategy.getPieEnergyDataFn(timeRanges, 2, nodeOptions, relativeDateValue);
        analysisPanel.state.chartStrategy.getPieEnergyDataFn(hierCommIds.hierarchyId, hierCommIds.commodityIds, dest, viewOption, relativeDateValue, analysisPanel);
      }
    },
    onRatioSearchDataButtonClick(analysisPanel) {
      analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

      let dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end,
        nodeOptions;

      if (startDate.getTime() >= endDate.getTime()) {
        GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.EM.ErrorNeedValidTimeRange);
        return;
      }

      nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      if (!nodeOptions || nodeOptions.length === 0) {
        analysisPanel.setState({
          energyData: null
        });
        return;
      }
      let relativeDateValue = analysisPanel._getRelativeDateValue();
      let ratioType = analysisPanel.state.ratioType;
      if (!ratioType)
        ratioType = 1;
      if (ratioType == 2 && endDate - startDate <= 604800000) {
        FolderAction.setDisplayDialog('errornotice', null, I18N.EM.Ratio.Error);
      } else {
        analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, ratioType, relativeDateValue, analysisPanel);
      }

    },
    onUnitEnergySearchDataButtonClick(analysisPanel) {
      analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

      let dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end,
        nodeOptions,
        benchmarkOption = analysisPanel.state.benchmarkOption;

      if (startDate.getTime() >= endDate.getTime()) {
        GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.EM.ErrorNeedValidTimeRange);
        return;
      }

      nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      let clearBmflag = false;
      if (!nodeOptions || nodeOptions.length === 0) {
        analysisPanel.setState({
          energyData: null
        });
        return;
      } else {
        if (analysisPanel.state.benchmarkOption !== null) {
          let hierId = null;

          nodeOptions.forEach(item => {
            if (hierId === null) {
              hierId = item.hierId;
            } else if (hierId !== item.hierId) {
              clearBmflag = true;
              return;
            }
          });
          if (clearBmflag) {
            benchmarkOption = null;
          }
        }
      }
      let relativeDateValue = analysisPanel._getRelativeDateValue();

      let unitType = analysisPanel.state.unitType;
      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, unitType, relativeDateValue, analysisPanel, benchmarkOption);
      if (clearBmflag) {
        analysisPanel.setState({
          benchmarkOption: null
        });
      }
    },
    onUnitCostSearchDataButtonClick(analysisPanel) {
      analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

      let dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end,
        nodeOptions;

      if (startDate.getTime() >= endDate.getTime()) {
        GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.EM.ErrorNeedValidTimeRange);
        return;
      }

      nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      if (!nodeOptions.hierarchyNode || !nodeOptions.commodityList || nodeOptions.commodityList.length === 0) {
        analysisPanel.setState({
          energyData: null
        });
        return;
      }
      let relativeDateValue = analysisPanel._getRelativeDateValue();

      let unitType = analysisPanel.state.unitType;
      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, unitType, relativeDateValue, analysisPanel);
    },
    onUnitCarbonSearchDataButtonClick(analysisPanel) {
      analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

      let dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end;

      if (startDate.getTime() >= endDate.getTime()) {
        GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.EM.ErrorNeedValidTimeRange);
        return;
      }

      let hierCommIds = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      if (!hierCommIds.commodityIds || hierCommIds.commodityIds.length === 0 || !hierCommIds.hierarchyId) {
        analysisPanel.setState({
          energyData: null
        });
        return;
      }
      let relativeDateValue = analysisPanel._getRelativeDateValue();

      let chartType = analysisPanel.state.selectedChartType;
      let dest = CarbonStore.getDestination();
      if (!dest)
        dest = 2;

      let unitType = analysisPanel.state.unitType;
      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, hierCommIds.hierarchyId,
        hierCommIds.commodityIds, dest, unitType, relativeDateValue, analysisPanel);
    },
    onRankSearchDataButtonClick(analysisPanel) {
      //analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

      let dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end,
        nodeOptions;

      if (startDate.getTime() >= endDate.getTime()) {
        GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.EM.ErrorNeedValidTimeRange);
        return;
      }

      nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      if (!nodeOptions.hierarchyList || nodeOptions.hierarchyList.length === 0 || !nodeOptions.commodityNode) {
        analysisPanel.setState({
          energyData: null
        });
        return;
      }
      let relativeDateValue = analysisPanel._getRelativeDateValue();
      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, relativeDateValue, analysisPanel);
    },
    onLabelSearchDataButtonClick(analysisPanel) {
      var nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      if (!nodeOptions || nodeOptions.length === 0) {
        analysisPanel.setState({
          energyData: null
        });
        return;
      }
      var viewOption = analysisPanel.getViewOption();
      var benchmarkOption = analysisPanel.getBenchmarkOption();
      var labelingType = analysisPanel.getKpiType();
      analysisPanel.state.chartStrategy.getEnergyDataFn(viewOption, nodeOptions, benchmarkOption, labelingType);
    }
  },
  onSearchBtnItemTouchTapFnStrategy: {
    onSearchBtnItemTouchTap(curChartType, nextChartType, analysisPanel) {
      if (analysisPanel.state.chartStrategy.canShareDataWithFn(curChartType, nextChartType) && !!analysisPanel.state.energyData) {
        ChartStatusAction.modifyChartType(nextChartType);
        analysisPanel.setState({
          selectedChartType: nextChartType
        });
      } else { //if(nextChartType === 'pie'){
        ChartStatusAction.clearStatus();
        analysisPanel.setState({
          selectedChartType: nextChartType,
          energyData: null
        }, function() {
          analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
        });
      }
      if (nextChartType === "line" || nextChartType === "column" || nextChartType === "stack") {
        analysisPanel.setState({
          sumBtnStatus: false
        });
      } else {
        analysisPanel.setState({
          sumBtnStatus: true
        });
      }
    },
    onCostSearchBtnItemTouchTap(curChartType, nextChartType, analysisPanel) {
      if (analysisPanel.state.chartStrategy.canShareDataWithFn(curChartType, nextChartType) && !!analysisPanel.state.energyData) {
        ChartStatusAction.modifyChartType(nextChartType);
        analysisPanel.setState({
          selectedChartType: nextChartType
        });
      } else { //if(nextChartType === 'pie'){
        ChartStatusAction.clearStatus();
        analysisPanel.setState({
          selectedChartType: nextChartType,
          energyData: null
        }, function() {
          analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
        });
      }
    },
  },
  setFitStepAndGetDataFnStrategy: {
    setFitStepAndGetData(startDate, endDate, tagOptions, relativeDate, analysisPanel, clearWeatherflag) {
      let timeRanges,
        weather;
      if (tagOptions.length > 1) {
        MultiTimespanAction.clearMultiTimespan('both');
        timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
      } else {
        timeRanges = MultipleTimespanStore.getSubmitTimespans();
        if (timeRanges === null) {
          timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
        }
      }

      let step = analysisPanel.state.step,
        limitInterval = CommonFuns.getLimitInterval(timeRanges),
        stepList = limitInterval.stepList;
      if (stepList.indexOf(step) == -1) {
        step = limitInterval.display;
      }
      analysisPanel.setState({
        isCalendarInited: false
      });
      if (!clearWeatherflag) {
        weather = analysisPanel.state.weatherOption;
      }
      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, relativeDate, weather);
    },
    setCostFitStepAndGetData(startDate, endDate, tagOptions, relativeDate, analysisPanel) {
      let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
        step = analysisPanel.state.step,
        limitInterval = CommonFuns.getLimitInterval(timeRanges),
        stepList = limitInterval.stepList;
      if (stepList.indexOf(step) == -1) {
        step = limitInterval.display;
      }
      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, relativeDate, analysisPanel);
    },
    setCarbonFitStepAndGetData(startDate, endDate, hierarchyId, commodityIds, destination, relativeDate, analysisPanel) {
      let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
        step = analysisPanel.state.step,
        limitInterval = CommonFuns.getLimitInterval(timeRanges),
        stepList = limitInterval.stepList;
      if (stepList.indexOf(step) == -1) {
        step = limitInterval.display;
      }
      let viewOp = {
        DataUsageType: 1,
        IncludeNavigatorData: true,
        TimeRanges: timeRanges,
        Step: step,
      };
      analysisPanel.state.chartStrategy.getEnergyDataFn(hierarchyId, commodityIds, destination, viewOp, relativeDate, analysisPanel);
    },
    setRatioFitStepAndGetData(startDate, endDate, tagOptions, ratioType, relativeDate, analysisPanel) {
      let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
        step = analysisPanel.state.step,
        limitInterval = CommonFuns.getLimitInterval(timeRanges),
        stepList = limitInterval.stepList;
      if (stepList.indexOf(step) === -1) {
        step = limitInterval.display;
      }
      if (ratioType === 1 && (step === 0 || step === 1))
        step = 2;
      if (ratioType === 2 && (step === 0 || step === 1 || step === 2))
        step = 5;
      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, ratioType, relativeDate);
    },
    setUnitEnergyFitStepAndGetData(startDate, endDate, tagOptions, unitType, relativeDate, analysisPanel, benchmarkOption) {
      let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
        step = analysisPanel.state.step,
        limitInterval = CommonFuns.getLimitInterval(timeRanges),
        stepList = limitInterval.stepList;
      if (stepList.indexOf(step) == -1) {
        step = limitInterval.display;
      }
      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, unitType, relativeDate, benchmarkOption);
    },
    setUnitCarbonFitStepAndGetData(startDate, endDate, hierarchyId, commodityIds, destination, unitType, relativeDate, analysisPanel) {
      let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
        step = analysisPanel.state.step,
        limitInterval = CommonFuns.getLimitInterval(timeRanges),
        stepList = limitInterval.stepList;
      if (stepList.indexOf(step) == -1) {
        step = limitInterval.display;
      }
      let viewOp = {
        DataUsageType: 4,
        IncludeNavigatorData: true,
        TimeRanges: timeRanges,
        Step: step,
        DataOption: {
          UnitType: unitType
        }
      };
      analysisPanel.state.chartStrategy.getEnergyDataFn(hierarchyId, commodityIds, destination, viewOp, relativeDate);
    },
    setRankTypeAndGetData(startDate, endDate, tagOptions, relativeDate, analysisPanel) {
      let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
      let rankType = analysisPanel.state.rankType;
      let energyType = analysisPanel.state.energyType;
      let destination = analysisPanel.state.destination;

      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, rankType, tagOptions, relativeDate, destination, energyType);
    }
  },
  searchBarGenFnStrategy: {
    energySearchBarGen(analysisPanel) {
      var chartTypeCmp = analysisPanel.props.isFromAlarm ? null : analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
      var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel);
      var relativeDate=analysisPanel._getRelativeDateValue();
      return <div className={'jazz-alarm-chart-toolbar'} style={{
          marginTop: '30px'
        }}>
       <div className={'jazz-full-border-dropdownmenu-container'} style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          height: '38px',
          marginTop: '-4px'
        }}>
         {chartTypeCmp}
         <DropDownMenu ref='relativeDate'style={{
          width: '90px',
        }} labelStyle={{fontSize:'12px',lineHeight:'32px',paddingRight:'0'}} value={relativeDate} onChange={analysisPanel._onRelativeDateChange}>{ConstStore.getSearchDate()}</DropDownMenu>
       </div>

       <DateTimeSelector ref='dateTimeSelector' endLeft='-100px' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged} showTime={true}/>

       <div className={'jazz-flat-button'}>
         {searchButton}
       </div>
     </div>;
    },
    CostSearchBarGen(analysisPanel) {
      var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
      var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel);
      var relativeDate=analysisPanel._getRelativeDateValue();
      return <div className={'jazz-alarm-chart-toolbar'} style={{
          marginTop: '30px'
        }}>
      <div className={'jazz-full-border-dropdownmenu-container'} style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          height: '38px',
          marginTop: '-4px'
        }}>
        {chartTypeCmp}
        <DropDownMenu ref='relativeDate' style={{
          width: '90px'
        }} labelStyle={{fontSize:'12px',lineHeight:'32px',paddingRight:'0'}} value={relativeDate} onChange={analysisPanel._onRelativeDateChange}>{ConstStore.getSearchDate()}</DropDownMenu>
      </div>
      <DateTimeSelector ref='dateTimeSelector' endLeft='-100px' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged} showTime={true}/>
      <div className={'jazz-flat-button'}>
        {searchButton}
      </div>
    </div>;
    },
    carbonSearchBarGen(analysisPanel) {
      var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
      var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel, ['line', 'column', 'stack', 'pie']);
      var relativeDate=analysisPanel._getRelativeDateValue();
      return <div className={'jazz-alarm-chart-toolbar'} style={{
          marginTop: '30px'
        }}>
      <div className={'jazz-full-border-dropdownmenu-container'} style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          height: '38px',
          marginTop: '-4px'
        }}>
        {chartTypeCmp}
        <DropDownMenu ref='relativeDate' style={{
          width: '90px'
        }} labelStyle={{fontSize:'12px',lineHeight:'32px',paddingRight:'0'}} value={relativeDate} onChange={analysisPanel._onRelativeDateChange}>{ConstStore.getSearchDate()}</DropDownMenu>
      </div>
      <DateTimeSelector ref='dateTimeSelector' endLeft='-100px' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged} showTime={true}/>
      <div className={'jazz-flat-button'}>
        {searchButton}
      </div>
  </div>;
    },
    unitEnergySearchBarGen(analysisPanel) {
      var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
      var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel, ['line', 'column']);
      var relativeDate=analysisPanel._getRelativeDateValue();
      var unitType=analysisPanel.state.unitType;
      return <div className={'jazz-alarm-chart-toolbar'} style={{
          marginTop: '30px'
        }}>
       <div className={'jazz-full-border-dropdownmenu-container'} style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          height: '38px',
          marginTop: '-4px'
        }}>
         {chartTypeCmp}
         <DropDownMenu ref='relativeDate' style={{
          width: '90px'
        }} labelStyle={{fontSize:'12px',lineHeight:'32px',paddingRight:'0'}} value={relativeDate} onChange={analysisPanel._onRelativeDateChange}>{ConstStore.getSearchDate()}</DropDownMenu>
       </div>
       <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged} showTime={true}/>
       <div className={'jazz-full-border-dropdownmenu-container'} >
         <DropDownMenu ref='unitTypeCombo' style={{
          width: '130px',
          marginRight: '10px'
        }} labelStyle={{fontSize:'12px',lineHeight:'32px',paddingRight:'0'}} value={unitType} onChange={(e, selectedIndex, value) => {
          analysisPanel.setState({
            unitType: value
          });
        }}>{ConstStore.getUnits()}</DropDownMenu>
       </div>
       <div className={'jazz-flat-button'}>
         {searchButton}
       </div>
   </div>;
    },
    ratioUsageSearchBarGen(analysisPanel) {
      var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
      var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel, ['line', 'column']);
      var relativeDate=analysisPanel._getRelativeDateValue();
      var ratioType=analysisPanel.state.ratioType;
      var ratios = [
        <MenuItem value={1} primaryText={I18N.EM.DayNightRatio} />,
        <MenuItem value={2} primaryText={I18N.EM.WorkHolidayRatio} />];
      return <div className={'jazz-alarm-chart-toolbar'} style={{
          marginTop: '30px'
        }}>
       <div className={'jazz-full-border-dropdownmenu-container'} style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          height: '38px',
          marginTop: '-4px'
        }}>
         {chartTypeCmp}
         <DropDownMenu ref='relativeDate' style={{
          width: '90px'
        }} labelStyle={{fontSize:'14px',lineHeight:'32px',paddingRight:'0'}} value={relativeDate} onChange={analysisPanel._onRelativeDateChange}>{ConstStore.getSearchDate()}</DropDownMenu>
       </div>
       <DateTimeSelector ref='dateTimeSelector' showTime={false} _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
       <div className={'jazz-full-border-dropdownmenu-container'} >
         <DropDownMenu ref='ratioTypeCombo' style={{
          width: '90px',
          marginRight: '10px'
        }} labelStyle={{fontSize:'12px',lineHeight:'32px',paddingRight:'0'}} value={ratioType}
        onChange={(e, selectedIndex, value) => {
          analysisPanel.setState({
            ratioType: value
          });
        }}>{ratios}</DropDownMenu>
       </div>
       <div className={'jazz-flat-button'}>
         {searchButton}
       </div>
   </div>;
    },
    rankSearchBarGen(analysisPanel) {
      var rankTypeItem = ConstStore.getRankTypeItem();
      var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
      var relativeDate=analysisPanel._getRelativeDateValue();
      var rankType=analysisPanel.state.rankType;
      return <div className={'jazz-alarm-chart-toolbar'} style={{
          marginTop: '30px'
        }}>
      <div className={'jazz-full-border-dropdownmenu-container'} style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          height: '38px',
          marginTop: '-4px'
        }}>
        {chartTypeCmp}
        <DropDownMenu ref='relativeDate' style={{
          width: '90px'
        }} labelStyle={{fontSize:'12px',lineHeight:'32px',paddingRight:'0'}} value={relativeDate} onChange={analysisPanel._onRelativeDateChange}>{ConstStore.getSearchDate()}</DropDownMenu>
      </div>
      <DateTimeSelector ref='dateTimeSelector' showTime={false} _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
      <div className={'jazz-full-border-dropdownmenu-container'} >
        <DropDownMenu ref='rankType' style={{
          width: '130px'
        }} labelStyle={{fontSize:'12px',lineHeight:'32px',paddingRight:'0'}} value={rankType} onChange={analysisPanel._onRankTypeChange}>{rankTypeItem}</DropDownMenu>
      </div>
      <div className={'jazz-flat-button'}>
        <RaisedButton style={{
          marginLeft: '10px'
        }} label={I18N.Common.Button.Show}  backgroundColor='#32ad3c' labelStyle={{
          color: 'white',
          fontWeight: '100',
          fontSize: '12px'
        }} onClick={analysisPanel.onSearchDataButtonClick}></RaisedButton>
      </div>
    </div>;
    },
    labelSearchBarGen(analysisPanel) {
      var yearProps = {
        ref: "yearSelector",
        selectedIndex: analysisPanel.state.selectedYear,
        isViewStatus: false,
        style: {
          width: '90px',
          margin: '0px 10px 0px 0px'
        }
      };
      var YearSelect = <div className='jazz-label-year'><YearPicker {...yearProps}/></div>;
      var labelBtn = ChartStrategyFactor.getLabelBtn(analysisPanel);
      var kpiTypeBtn = ChartStrategyFactor.getKpiTypeBtn(analysisPanel);
      var monthItem = ConstStore.getLabelMonth();
      return <div className={'jazz-alarm-chart-toolbar'} style={{
          marginTop: '30px'
        }}>
      {YearSelect}
      <div className={'jazz-full-border-dropdownmenu-container'} style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          height: '38px',
          marginTop: '-4px'
        }}>
      <DropDownMenu style={{
          width: '90px'
        }} labelStyle={{fontSize:'12px',lineHeight:'32px',paddingRight:'0'}} value={analysisPanel.state.month}onChange={analysisPanel._onChangeMonth} ref='monthSelector'>{monthItem}</DropDownMenu>
      </div>
      <div className={'jazz-label-btn'} >
        {labelBtn}
      </div>
      <div className={'jazz-full-border-dropdownmenu-container'} >
        {kpiTypeBtn}
      </div>
      <div className={'jazz-flat-button'}>
        <RaisedButton style={{
          marginLeft: '10px'
        }} label={I18N.Common.Button.Show}  backgroundColor='#32ad3c' labelStyle={{
          color: 'white',
          fontWeight: '100',
          fontSize: '12px'
        }} onClick={analysisPanel.onSearchDataButtonClick}></RaisedButton>
      </div>
    </div>;
    }
  },
  getSelectedNodesFnStrategy: {
    getSelectedTagList() {
      return AlarmTagStore.getSearchTagList();
    },
    getCostSelectedTagList() {
      var selectedList = {};
      var hierarchyNode = CommodityStore.getHierNode();
      var commodityList = CommodityStore.getCommonCommodityList();
      var dimNode = CommodityStore.getCurrentDimNode();
      selectedList.hierarchyNode = hierarchyNode;
      selectedList.commodityList = commodityList;
      selectedList.dimNode = dimNode;
      return selectedList;
    },
    getSelectedHierCommodityList() {
      let communities = CommodityStore.getCommonCommodityList();
      let commIds = [];
      for (var i = 0; i < communities.length; i++) {
        commIds.push(communities[i].Id);
      }
      let hierId = CommodityStore.getCurrentHierarchyId();
      return {
        hierarchyId: hierId,
        commodityIds: commIds
      };
    //return CommodityStore.getCurrentHierIdCommodityStatus();
    },
    getRankSelectedTagList() {
      var selectedList = {};
      var hierarchyList = CommodityStore.getRankingTreeList();
      var commodityNode = CommodityStore.getRankingCommodity();
      selectedList.hierarchyList = hierarchyList;
      selectedList.commodityNode = commodityNode;
      return selectedList;
    }
  },
  getEnergyDataFnStrategy: {
    energyDataLoad(timeRanges, step, tagOptions, relativeDate, weatherOption) {
      EnergyAction.getEnergyTrendChartData(timeRanges, step, tagOptions, relativeDate, weatherOption);
    },
    costDataLoad(timeRanges, step, tagOptions, relativeDate, analysisPanel) {
      if (analysisPanel.state.touBtnSelected) {
        EnergyAction.getElectricityCostTrendChartData(timeRanges, step, tagOptions, relativeDate);
      } else {
        EnergyAction.getCostTrendChartData(timeRanges, step, tagOptions, relativeDate);
      }
    },
    carbonDataLoad(hierId, commIds, dest, viewOptions, relativeDate) {
      CarbonAction.getCarbonTrendChartData(hierId, commIds, dest, viewOptions, relativeDate);
    },
    ratioDataLoad(timeRanges, step, tagOptions, ratioType, relativeDate, benchmarkOption) {
      EnergyAction.getRatioTrendChartData(timeRanges, step, tagOptions, ratioType, relativeDate, benchmarkOption);
    },
    unitEnergyDataLoad(timeRanges, step, tagOptions, unitType, relativeDate, benchmarkOption) {
      EnergyAction.getUnitEnergyTrendChartData(timeRanges, step, tagOptions, unitType, relativeDate, benchmarkOption);
    },
    unitCostDataLoad(timeRanges, step, tagOptions, unitType, relativeDate, benchmarkOption) {
      EnergyAction.getUnitCostTrendChartData(timeRanges, step, tagOptions, unitType, relativeDate, benchmarkOption);
    },
    unitCarbonDataLoad(hierId, commIds, dest, viewOptions, relativeDate, benchmarkOption) {
      CarbonAction.getCarbonUsageUnitData(hierId, commIds, dest, viewOptions, relativeDate, benchmarkOption);
    },
    rankDataLoad(timeRanges, rankType, tagOptions, relativeDate, destination, energyType) {
      if (energyType === "Energy") {
        EnergyAction.getEnergyRankChartData(timeRanges, rankType, tagOptions, relativeDate);
      } else if (energyType === "Carbon") {
        EnergyAction.getCarbonRankChartData(timeRanges, rankType, tagOptions, relativeDate, destination);
      } else {
        EnergyAction.getCostRankChartData(timeRanges, rankType, tagOptions, relativeDate);
      }
    },
    labelDataLoad(viewOption, tagOptions, benchmarkOption, labelingType) {
      EnergyAction.getLabelChartData(viewOption, tagOptions, benchmarkOption, labelingType);
    }
  },
  getPieEnergyDataFnStrategy: {
    pieEnergyDataLoad(timeRanges, step, tagOptions, relativeDate) {
      EnergyAction.getPieEnergyData(timeRanges, step, tagOptions, relativeDate);
    },
    pieCostDataLoad(timeRanges, step, tagOptions, relativeDate, analysisPanel) {
      if (analysisPanel.state.touBtnSelected) {
        EnergyAction.getElectricityPieCostData(timeRanges, step, tagOptions, relativeDate);
      } else {
        EnergyAction.getPieCostData(timeRanges, step, tagOptions, relativeDate);
      }
    },
    pieCarbonDataLoad(hierId, commIds, destination, viewOption, relativeDate) {
      CarbonAction.getPieCarbonData(hierId, commIds, destination, viewOption, relativeDate);
    }
  },
  getEnergyRawDataFnStrategy: {
    empty() {},
    getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize) {
      EnergyAction.getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize);
    }
  },
  getChartComponentFnStrategy: {
    getEnergyChartComponent(analysisPanel) {
      let energyPart;
      let chartType = analysisPanel.state.selectedChartType;
      let subToolbar = analysisPanel.state.chartStrategy.getChartSubToolbarFn(analysisPanel);
      let historyCompareEl = null;
      let dataSum = null;
      if (chartType !== 'rawdata' & analysisPanel.state.showAddIntervalDialog === true) {
        let relativeType = analysisPanel._getRelativeDateValue();
        let timeRange = analysisPanel.refs.dateTimeSelector.getDateTime();
        MultiTimespanAction.initMultiTimespanData(relativeType, timeRange.start, timeRange.end);
        historyCompareEl = <AddIntervalWindow openImmediately={true} analysisPanel={analysisPanel}/>;
      }
      if ((chartType === 'line' || chartType === 'column' || chartType === 'stack') && analysisPanel.state.showSumDialog === true) {
        dataSum = <SumWindow  openImmediately={true} analysisPanel={analysisPanel}></SumWindow>;
      }
      if (chartType === 'rawdata') {
        let properties = {
          ref: 'ChartComponent',
          energyData: analysisPanel.state.energyData,
          energyRawData: analysisPanel.state.energyRawData,
          chartStrategy: analysisPanel.state.chartStrategy
        };
        energyPart = <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '20px',
          overflow: 'hidden'
        }}>
                      {subToolbar}

                        <GridComponent {...properties}></GridComponent>


                    </div>;
      } else {
        let chartCmpObj = {
          ref: 'ChartComponent',
          bizType: analysisPanel.props.bizType,
          energyType: analysisPanel.state.energyType,
          chartType: analysisPanel.state.selectedChartType,
          energyData: analysisPanel.state.energyData,
          energyRawData: analysisPanel.state.energyRawData,
          onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
          onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick,
          getYaxisConfig: analysisPanel.getYaxisConfig,
          chartTooltipHasTotal: analysisPanel.getChartTooltiphasTotal(analysisPanel.state.energyRawData)
        };
        energyPart = <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '0px',
          marginLeft: '9px'
        }}>
                       {subToolbar}
                       {historyCompareEl}
                       {dataSum}
                       <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                     </div>;
      }
      return energyPart;
    },
    getCostChartComponent(analysisPanel) {
      let energyPart;
      let chartType = analysisPanel.state.selectedChartType;
      let subToolbar = analysisPanel.state.chartStrategy.getChartSubToolbarFn(analysisPanel);
      let chartCmpObj = {
        ref: 'ChartComponent',
        bizType: analysisPanel.props.bizType,
        energyType: analysisPanel.state.energyType,
        chartType: analysisPanel.state.selectedChartType,
        energyData: analysisPanel.state.energyData,
        energyRawData: analysisPanel.state.energyRawData,
        getYaxisConfig: analysisPanel.getYaxisConfig,
        onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
        onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
      };

      energyPart = <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
        marginLeft: '9px'
      }}>
                     {subToolbar}
                     <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                   </div>;

      return energyPart;
    },
    getUnitEnergyChartComponent(analysisPanel) {
      let energyPart;
      let chartType = analysisPanel.state.selectedChartType;
      let subToolbar = analysisPanel.state.chartStrategy.getChartSubToolbarFn(analysisPanel);

      let chartCmpObj = {
        ref: 'ChartComponent',
        bizType: analysisPanel.props.bizType,
        energyType: analysisPanel.state.energyType,
        chartType: analysisPanel.state.selectedChartType,
        energyData: analysisPanel.state.energyData,
        energyRawData: analysisPanel.state.energyRawData,
        getYaxisConfig: analysisPanel.getYaxisConfig,
        onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
        onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
      };

      energyPart = <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
        marginLeft: '9px'
      }}>
                     {subToolbar}
                     <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                   </div>;

      return energyPart;
    },
    getCarbonChartComponent(analysisPanel) {
      let energyPart;
      let chartType = analysisPanel.state.selectedChartType;
      let subToolbar = analysisPanel.state.chartStrategy.getChartSubToolbarFn(analysisPanel);
      let chartCmpObj = {
        ref: 'ChartComponent',
        bizType: analysisPanel.props.bizType,
        energyType: analysisPanel.state.energyType,
        chartType: analysisPanel.state.selectedChartType,
        energyData: analysisPanel.state.energyData,
        energyRawData: analysisPanel.state.energyRawData,
        getYaxisConfig: analysisPanel.getYaxisConfig,
        onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
        onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
      };

      let paramsObj = CarbonStore.getParamsObj();
      energyPart = <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
        marginLeft: '9px'
      }}>
                    {subToolbar}
                     <ChartComponentBox {...paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                   </div>;

      return energyPart;
    },
    getRatioChartComponent(analysisPanel) {
      let energyPart;
      let chartType = analysisPanel.state.selectedChartType;
      let subToolbar = analysisPanel.state.chartStrategy.getChartSubToolbarFn(analysisPanel);

      let chartCmpObj = {
        ref: 'ChartComponent',
        bizType: analysisPanel.props.bizType,
        energyType: analysisPanel.state.energyType,
        chartType: analysisPanel.state.selectedChartType,
        energyData: analysisPanel.state.energyData,
        energyRawData: analysisPanel.state.energyRawData,
        getYaxisConfig: analysisPanel.getYaxisConfig,
        onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
        onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
      };

      let paramsObj = RatioStore.getParamsObj();
      energyPart = <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
        marginLeft: '9px'
      }}>
                    {subToolbar}
                     <ChartComponentBox {...paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                   </div>;
      return energyPart;
    },
    getRankChartComponent(analysisPanel) {
      let energyPart;
      let subToolbar = analysisPanel.state.chartStrategy.getChartSubToolbarFn(analysisPanel);
      let chartCmpObj = {
        ref: 'ChartComponent',
        bizType: analysisPanel.props.bizType,
        energyType: analysisPanel.state.energyType,
        chartType: analysisPanel.state.selectedChartType,
        range: analysisPanel.state.range,
        order: analysisPanel.state.order,
        energyData: analysisPanel.state.energyData,
        energyRawData: analysisPanel.state.energyRawData,
        getYaxisConfig: analysisPanel.getYaxisConfig,
        onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
        onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
      };

      energyPart = <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
        marginLeft: '9px'
      }}>
                     {subToolbar}
                     <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj}/>
                   </div>;
      return energyPart;
    },
    getLabelChartComponent(analysisPanel) {
      let clearChartBtnEl = ChartStrategyFactor.getClearChartBtn(analysisPanel);
      let energyPart;
      let chartCmpObj = {
        ref: 'ChartComponent',
        bizType: analysisPanel.props.bizType,
        energyData: analysisPanel.state.energyData,
        energyRawData: analysisPanel.state.energyRawData,
        onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
        onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
      };

      energyPart = <div ref="chartContainer" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
        marginLeft: '9px'
      }}>
                     <div style={{
        display: 'flex'
      }}>
                       <div style={{
        margin: '5px 30px 0px auto'
      }}>
                         <div style={{
        display: 'inline-block',
        marginLeft: '30px'
      }}>{clearChartBtnEl}</div>
                       </div>
                     </div>
                     <LabelChartComponent ref="chartComponent" {...analysisPanel.state.paramsObj} {...chartCmpObj}/>
                   </div>;
      return energyPart;
    }
  },
  getAuxiliaryCompareBtnFnStrategy: {
    getEnergyAuxiliaryCompareBtn(analysisPanel) {
      let calendarEl = analysisPanel.getCalenderBgBtnEl();
      let weatherSubItems = [{
        primaryText: I18N.EM.Tool.Weather.Temperature,
        value: 'temperature'
      },
        {
          primaryText: I18N.EM.Tool.Weather.Humidity,
          value: 'humidity'
        }];
      var submitParams = EnergyStore.getSubmitParams();
      let viewOp = submitParams.viewOption;
      if (viewOp && viewOp.IncludeTempValue)
        weatherSubItems[0].checked = true;
      if (viewOp && viewOp.IncludeHumidityValue)
        weatherSubItems[1].checked = true;
      let weatherEl;
      let isWeatherDisabled = analysisPanel.state.chartStrategy.isWeatherDisabledFn(analysisPanel);
      let errors = EnergyStore.getErrorCodes();
      if (!!errors && errors.length && (errors[0] + '' === '02810' || errors[0] + '' === '02809')) {
        if (weatherSubItems[0].checked) {
          weatherSubItems[0].checked = false;
        }
        if (weatherSubItems[1].checked) {
          weatherSubItems[1].checked = false;
        }
      }
      if (isWeatherDisabled === false) {
        weatherEl = <ExtendableMenuItem primaryText={I18N.EM.Tool.Weather.WeatherInfo} value='weather' subItems={weatherSubItems}/>;
      } else {
        weatherEl = <ExtendableMenuItem primaryText={I18N.EM.Tool.Weather.WeatherInfo} value='weather' disabled={true} tooltip={isWeatherDisabled} />;
      }

      let sumBtnStatus = analysisPanel.state.sumBtnStatus;
      if (analysisPanel.state.selectedChartType === 'rawdata' || analysisPanel.state.selectedChartType === 'pie') {
        sumBtnStatus = true;
      }

      let baselineBtnStatus = analysisPanel.state.baselineBtnStatus;
      if (analysisPanel.state.selectedChartType === 'rawdata' || submitParams.tagIds.length > 1) {
        baselineBtnStatus = true;
      }
      let configButton;
      if (analysisPanel.state.baselineRivilege) {
        configButton = (<ButtonMenu label={I18N.EM.Tool.AssistCompare}  style={{
          marginLeft: '10px'
        }} backgroundColor='#fbfbfb'
        onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       <MenuItem primaryText={I18N.EM.Tool.HistoryCompare} value='history' disabled={baselineBtnStatus}/>
       <MenuItem primaryText={I18N.EM.Tool.BenchmarkSetting} value='config' disabled={baselineBtnStatus}/>
       <MenuDivider />
       <MenuItem primaryText={I18N.EM.Tool.DataSum} value='sum' disabled={sumBtnStatus}/>
         {calendarEl}
         {weatherEl}
     </ButtonMenu>);
      } else {
        configButton = (<ButtonMenu label={I18N.EM.Tool.AssistCompare}  style={{
          marginLeft: '10px'
        }} desktop={true} backgroundColor='#fbfbfb'
        onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       <MenuItem primaryText={I18N.EM.Tool.HistoryCompare} value='history' disabled={baselineBtnStatus}/>
       <MenuDivider />
       <MenuItem primaryText={I18N.EM.Tool.DataSum} value='sum' disabled={sumBtnStatus}/>
       {calendarEl}
       {weatherEl}
     </ButtonMenu>);
      }

      return <div className='jazz-AuxiliaryCompareBtn-container'>{configButton}</div>;
    },
    getCarbonAuxiliaryCompareBtn(analysisPanel) {
      let calendarEl = analysisPanel.getCalenderBgBtnEl();
      let configButton = <ButtonMenu label={I18N.EM.Tool.AssistCompare} style={{
        marginLeft: '10px'
      }} desktop={true} backgroundColor="#fbfbfb"
      onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       {calendarEl}
     </ButtonMenu>;

      return <div className='jazz-AuxiliaryCompareBtn-container'>{configButton}</div>;
    },
    getRatioAuxiliaryCompareBtn(analysisPanel) {
      let calendarEl = analysisPanel.getCalenderBgBtnEl();
      let tagOptions = RatioStore.getRatioOpions();
      let benchmarks = CommonFuns.filterBenchmarksByTagOptions(tagOptions);

      let configButton = <ButtonMenu label={I18N.EM.Tool.AssistCompare} style={{
        marginLeft: '10px'
      }} desktop={true} backgroundColor="#fbfbfb"
      onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       {calendarEl}
       <ExtendableMenuItem primaryText={I18N.EM.Tool.Benchmark} value='benchmark' subItems={benchmarks} disabled={!benchmarks}/>
       </ButtonMenu>;
      return <div className='jazz-AuxiliaryCompareBtn-container'>{configButton}</div>;
    },
    getUnitEnergyAuxiliaryCompareBtn(analysisPanel) {
      let calendarEl = analysisPanel.getCalenderBgBtnEl();
      let tagOptions = EnergyStore.getTagOpions();
      let benchmarks = CommonFuns.filterBenchmarksByTagOptions(tagOptions);

      let configButton = <ButtonMenu label={I18N.EM.Tool.AssistCompare} style={{
        marginLeft: '10px'
      }} desktop={true} backgroundColor="#fbfbfb"
      onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       {calendarEl}
       <ExtendableMenuItem primaryText={I18N.EM.Tool.Benchmark} value='benchmark' subItems={benchmarks} disabled={!benchmarks}/>
       </ButtonMenu>;
      return <div className='jazz-AuxiliaryCompareBtn-container'>{configButton}</div>;
    },
    getUnitCostAuxiliaryCompareBtn(analysisPanel) {
      let calendarEl = analysisPanel.getCalenderBgBtnEl();
      let tagOptions = CostStore.getSelectedList();
      let benchmarks = CommonFuns.filterBenchmarksByCostSelectedList(tagOptions);
      let configButton = <ButtonMenu label={I18N.EM.Tool.AssistCompare} style={{
        marginLeft: '10px'
      }} desktop={true} backgroundColor="#fbfbfb"
      onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       {calendarEl}
       <ExtendableMenuItem primaryText={I18N.EM.Tool.Benchmark} value='benchmark' subItems={benchmarks} disabled={analysisPanel.state.unitBaselineBtnStatus}/>
       </ButtonMenu>;
      return <div className='jazz-AuxiliaryCompareBtn-container'>{configButton}</div>;
    },
    getUnitCarbonAuxiliaryCompareBtn(analysisPanel) {
      let calendarEl = analysisPanel.getCalenderBgBtnEl();
      let tagOptions = {},
        hierarchyNode = CommodityStore.getHierNode(),
        commodityList = CommodityStore.getCommonCommodityList();
      tagOptions.hierarchyNode = hierarchyNode;
      tagOptions.commodityList = commodityList;
      let benchmarks = CommonFuns.filterBenchmarksByCostSelectedList(tagOptions);

      let configButton = <ButtonMenu label={I18N.EM.Tool.AssistCompare} style={{
        marginLeft: '10px'
      }} desktop={true} backgroundColor="#fbfbfb"
      onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       {calendarEl}
       <ExtendableMenuItem primaryText={I18N.EM.Tool.Benchmark} value='benchmark' subItems={benchmarks} disabled={analysisPanel.state.unitBaselineBtnStatus}/>
       </ButtonMenu>;
      return <div className='jazz-AuxiliaryCompareBtn-container'>{configButton}</div>;
    },
    getCostAuxiliaryCompareBtn(analysisPanel) {
      let calendarEl = analysisPanel.getCalenderBgBtnEl();
      let configButton = <ButtonMenu label={I18N.EM.Tool.AssistCompare} style={{
        marginLeft: '10px'
      }} desktop={true} backgroundColor="#fbfbfb"
      onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
        <ExtendableMenuItem primaryText={I18N.EM.ByPeakValley} value='touCompare' disabled={analysisPanel.state.touBtnStatus} tooltip={analysisPanel.state.touBtnTooltip} checked={analysisPanel.state.touBtnSelected} />
       {calendarEl}
     </ButtonMenu>;

      return <div className='jazz-AuxiliaryCompareBtn-container'>{configButton}</div>;
    }
  },
  canShareDataWithFnStrategy: {
    canShareDataWith(curChartType, nextChartType) {
      if ((curChartType === 'line' || curChartType === 'column' || curChartType === 'stack') && (nextChartType === 'line' || nextChartType === 'column' || nextChartType === 'stack')) {
        return true;
      } else {
        return false;
      }
    },
    canRankShareDataWith(curChartType, nextChartType) {
      return false;
    }
  },
  bindStoreListenersFnStrategy: {
    energyBindStoreListeners(analysisPanel) {
      EnergyStore.addEnergyDataLoadingListener(analysisPanel._onLoadingStatusChange);
      EnergyStore.addEnergyDataLoadedListener(analysisPanel._onEnergyDataChange);
      EnergyStore.addEnergyDataLoadErrorListener(analysisPanel._onGetEnergyDataError);
      EnergyStore.addEnergyDataLoadErrorsListener(analysisPanel._onGetEnergyDataErrors);
      TagStore.addBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
      TagStore.addWeatherBtnDisabledListener(analysisPanel._onWeatherBtnDisabled);
    },
    costBindStoreListeners(analysisPanel) {
      CostStore.addCostDataLoadingListener(analysisPanel._onCostLoadingStatusChange);
      CostStore.addCostDataLoadedListener(analysisPanel._onCostDataChange);
      CostStore.addCostDataLoadErrorListener(analysisPanel._onGetCostDataError);
      CostStore.addCostDataLoadErrorsListener(analysisPanel._onGetCostDataErrors);
      CommodityStore.addECButtonStatusListener(analysisPanel._onTouBtnDisabled);
    },
    carbonBindStoreListeners(analysisPanel) {
      CarbonStore.addCarbonDataLoadingListener(analysisPanel._onCarbonLoadingStatusChange);
      CarbonStore.addCarbonDataLoadedListener(analysisPanel._onCarbonDataChange);
      CarbonStore.addCarbonDataLoadErrorListener(analysisPanel._onGetCarbonDataError);
      CarbonStore.addCarbonDataLoadErrorsListener(analysisPanel._onGetCarbonDataErrors);
    },
    ratioBindStoreListeners(analysisPanel) {
      RatioStore.addRatioDataLoadingListener(analysisPanel._onRatioLoadingStatusChange);
      RatioStore.addRatioDataLoadedListener(analysisPanel._onRatioDataChange);
      RatioStore.addRatioDataLoadErrorListener(analysisPanel._onGetRatioDataError);
    },
    unitEnergyBindStoreListeners(analysisPanel) {
      EnergyStore.addEnergyDataLoadingListener(analysisPanel._onLoadingStatusChange);
      EnergyStore.addEnergyDataLoadedListener(analysisPanel._onEnergyDataChange);
      EnergyStore.addEnergyDataLoadErrorListener(analysisPanel._onGetEnergyDataError);
      EnergyStore.addEnergyDataLoadErrorsListener(analysisPanel._onGetEnergyDataErrors);
      TagStore.addBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
    },
    unitCostBindStoreListeners(analysisPanel) {
      CostStore.addCostDataLoadingListener(analysisPanel._onCostLoadingStatusChange);
      CostStore.addCostDataLoadedListener(analysisPanel._onCostDataChange);
      CostStore.addCostDataLoadErrorListener(analysisPanel._onGetCostDataError);
      CostStore.addCostDataLoadErrorsListener(analysisPanel._onGetCostDataErrors);
      CommodityStore.addUCButtonStatusListener(analysisPanel._onUnitCostBaselineBtnDisabled);
    },
    unitCarbonBindStoreListeners(analysisPanel) {
      CarbonStore.addCarbonDataLoadingListener(analysisPanel._onCarbonLoadingStatusChange);
      CarbonStore.addCarbonDataLoadedListener(analysisPanel._onCarbonDataChange);
      CarbonStore.addCarbonDataLoadErrorListener(analysisPanel._onGetCarbonDataError);
      CarbonStore.addCarbonDataLoadErrorsListener(analysisPanel._onGetCarbonDataErrors);
      CommodityStore.addUCButtonStatusListener(analysisPanel._onUnitCostBaselineBtnDisabled);
    },
    rankBindStoreListeners(analysisPanel) {
      RankStore.addRankDataLoadingListener(analysisPanel._onRankLoadingStatusChange);
      RankStore.addRankDataLoadedListener(analysisPanel._onRankDataChange);
      RankStore.addRankDataLoadErrorListener(analysisPanel._onGetRankDataError);
    },
    labelBindStoreListeners(analysisPanel) {
      LabelMenuStore.addHierNodeChangeListener(analysisPanel._onHierNodeChange);
      LabelMenuStore.addHierNodesChangeListener(analysisPanel._onHierNodesChange);
      LabelMenuStore.addIndustryDataChangeListener(analysisPanel._onHierNodesChange);
      LabelMenuStore.addZoneDataChangeListener(analysisPanel._onHierNodesChange);
      LabelMenuStore.addLabelDataChangeListener(analysisPanel._onHierNodesChange);
      LabelMenuStore.addCustomerDataChangeListener(analysisPanel._onHierNodesChange);
      LabelStore.addLabelDataLoadingListener(analysisPanel._onLabelLoadingStatusChange);
      LabelStore.addLabelDataLoadedListener(analysisPanel._onLabelDataChange);
      LabelStore.addLabelDataLoadErrorListener(analysisPanel._onGetLabelDataError);
    }
  },
  unbindStoreListenersFnStrategy: {
    energyUnbindStoreListeners(analysisPanel) {
      EnergyStore.removeEnergyDataLoadingListener(analysisPanel._onLoadingStatusChange);
      EnergyStore.removeEnergyDataLoadedListener(analysisPanel._onEnergyDataChange);
      EnergyStore.removeEnergyDataLoadErrorListener(analysisPanel._onGetEnergyDataError);
      EnergyStore.removeEnergyDataLoadErrorsListener(analysisPanel._onGetEnergyDataErrors);
      TagStore.removeBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
      TagStore.removeWeatherBtnDisabledListener(analysisPanel._onWeatherBtnDisabled);
      MultiTimespanAction.clearMultiTimespan('both');
      CalendarManager.hideCalendar();
    },
    carbonUnbindStoreListeners(analysisPanel) {
      CarbonStore.removeCarbonDataLoadingListener(analysisPanel._onCarbonLoadingStatusChange);
      CarbonStore.removeCarbonDataLoadedListener(analysisPanel._onCarbonDataChange);
      CarbonStore.removeCarbonDataLoadErrorListener(analysisPanel._onGetCarbonDataError);
      CarbonStore.removeCarbonDataLoadErrorsListener(analysisPanel._onGetCarbonDataErrors);
    },

    ratioUnbindStoreListeners(analysisPanel) {
      RatioStore.removeRatioDataLoadingListener(analysisPanel._onRatioLoadingStatusChange);
      RatioStore.removeRatioDataLoadedListener(analysisPanel._onRatioDataChange);
      RatioStore.removeRatioDataLoadErrorListener(analysisPanel._onGetRatioDataError);
    },

    costUnbindStoreListeners(analysisPanel) {
      CostStore.removeCostDataLoadingListener(analysisPanel._onCostLoadingStatusChange);
      CostStore.removeCostDataLoadedListener(analysisPanel._onCostDataChange);
      CostStore.removeCostDataLoadErrorListener(analysisPanel._onGetCostDataError);
      CostStore.removeCostDataLoadErrorsListener(analysisPanel._onGetCostDataErrors);
      CommodityStore.removeECButtonStatusListener(analysisPanel._onTouBtnDisabled);
    },

    unitEnergyUnbindStoreListeners(analysisPanel) {
      EnergyStore.removeEnergyDataLoadingListener(analysisPanel._onLoadingStatusChange);
      EnergyStore.removeEnergyDataLoadedListener(analysisPanel._onEnergyDataChange);
      EnergyStore.removeEnergyDataLoadErrorListener(analysisPanel._onGetEnergyDataError);
      EnergyStore.removeEnergyDataLoadErrorsListener(analysisPanel._onGetEnergyDataErrors);
      TagStore.removeBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
      LabelMenuStore.removeHierNodeChangeListener(analysisPanel._onHierNodeChange);
      CalendarManager.hideCalendar();
    },

    unitCostUnbindStoreListeners(analysisPanel) {
      CostStore.removeCostDataLoadingListener(analysisPanel._onCostLoadingStatusChange);
      CostStore.removeCostDataLoadedListener(analysisPanel._onCostDataChange);
      CostStore.removeCostDataLoadErrorListener(analysisPanel._onGetCostDataError);
      CostStore.removeCostDataLoadErrorsListener(analysisPanel._onGetCostDataErrors);
      CommodityStore.removeUCButtonStatusListener(analysisPanel._onUnitCostBaselineBtnDisabled);
    },

    unitCarbonUnbindStoreListeners(analysisPanel) {
      CarbonStore.removeCarbonDataLoadingListener(analysisPanel._onCarbonLoadingStatusChange);
      CarbonStore.removeCarbonDataLoadedListener(analysisPanel._onCarbonDataChange);
      CarbonStore.removeCarbonDataLoadErrorListener(analysisPanel._onGetCarbonDataError);
      CarbonStore.removeCarbonDataLoadErrorsListener(analysisPanel._onGetCarbonDataErrors);
      CommodityStore.removeUCButtonStatusListener(analysisPanel._onUnitCostBaselineBtnDisabled);
    },

    rankUnbindStoreListeners(analysisPanel) {
      RankStore.removeRankDataLoadingListener(analysisPanel._onRankLoadingStatusChange);
      RankStore.removeRankDataLoadedListener(analysisPanel._onRankDataChange);
      RankStore.removeRankDataLoadErrorListener(analysisPanel._onGetRankDataError);
    },
    labelUnbindStoreListeners(analysisPanel) {
      LabelMenuStore.removeHierNodeChangeListener(analysisPanel._onHierNodeChange);
      LabelMenuStore.removeHierNodesChangeListener(analysisPanel._onHierNodesChange);
      LabelMenuStore.removeIndustryDataChangeListener(analysisPanel._onHierNodesChange);
      LabelMenuStore.removeZoneDataChangeListener(analysisPanel._onHierNodesChange);
      LabelMenuStore.removeLabelDataChangeListener(analysisPanel._onHierNodesChange);
      LabelMenuStore.removeCustomerDataChangeListener(analysisPanel._onHierNodesChange);
      LabelStore.removeLabelDataLoadingListener(analysisPanel._onLabelLoadingStatusChange);
      LabelStore.removeLabelDataLoadedListener(analysisPanel._onLabelDataChange);
      LabelStore.removeLabelDataLoadErrorListener(analysisPanel._onGetLabelDataError);
    }
  },
  clearChartDataFnStrategy: {
    clearChartData(analysisPanel) {
      AlarmTagAction.clearSearchTagList();
      EnergyStore.clearEnergyStore();
      MultipleTimespanStore.clearMultiTimespan('both');
      analysisPanel.setState({
        energyData: null,
        energyRawData: null,
        weatherOption: null,
        remarkText: '',
        remarkDisplay: false
      });
    },
    clearCarbonChartData(analysisPanel) {
      CommodityAction.clearCommodity();
      CarbonStore.clearCarbonStore();
      analysisPanel.setState({
        energyData: null,
        energyRawData: null,
        destination: 2,
        remarkText: '',
        remarkDisplay: false
      });
    },
    clearCostChartData(analysisPanel) {
      CommodityAction.clearCommodity();
      CostStore.clearCostStore();
      analysisPanel.setState({
        energyData: null,
        energyRawData: null,
        remarkText: '',
        remarkDisplay: false
      });
    },
    clearUnitChartData(analysisPanel) {
      AlarmTagAction.clearSearchTagList();
      EnergyStore.clearEnergyStore();
      analysisPanel.setState({
        energyData: null,
        energyRawData: null,
        benchmarkOption: null,
        benchmarks: null,
        remarkText: '',
        remarkDisplay: false
      });
    },
    clearUnitCostChartData(analysisPanel) {
      CommodityAction.clearCommodity();
      CostStore.clearCostStore();
      analysisPanel.setState({
        energyData: null,
        energyRawData: null,
        benchmarkOption: null,
        benchmarks: null,
        remarkText: '',
        remarkDisplay: false
      });
    },
    clearUnitCarbonChartData(analysisPanel) {
      CommodityAction.clearCommodity();
      CarbonStore.clearCarbonStore();
      analysisPanel.setState({
        energyData: null,
        energyRawData: null,
        benchmarkOption: null,
        benchmarks: null,
        destination: 2,
        remarkText: '',
        remarkDisplay: false
      });
    },
    clearRatioChartData(analysisPanel) {
      AlarmTagAction.clearSearchTagList();
      EnergyStore.clearEnergyStore();
      analysisPanel.setState({
        energyData: null,
        energyRawData: null,
        benchmarkOption: null,
        benchmarks: null,
        remarkText: '',
        remarkDisplay: false
      });

    },
    clearLabelChartData(analysisPanel) {
      AlarmTagAction.clearSearchTagList();
      LabelStore.clearLabelStore();
      analysisPanel.setState({
        energyData: null,
        energyRawData: null,
        remarkText: '',
        remarkDisplay: false
      });
    },
    clearRankChartData(analysisPanel) {
      CommodityAction.clearRankingCommodity();
      RankStore.clearRankStore();
      analysisPanel.setState({
        energyData: null,
        energyRawData: null,
        remarkText: '',
        remarkDisplay: false
      });
    },
  },
  exportChartFnStrategy: {
    exportChart(analysisPanel) {
      if (!analysisPanel.state.energyData) {
        return;
      }
      let path;
      let chartType = analysisPanel.state.selectedChartType;
      let tagOptions = EnergyStore.getTagOpions();
      let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
      let viewOption = EnergyStore.getSubmitParams().viewOption;
      let title = analysisPanel.props.chartTitle || I18N.Folder.NewWidget.Menu1;

      let params = {
        title: title,
        tagIds: tagIds,
        viewOption: viewOption
      };

      path = '/Energy/GetTagsData4Export';
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions, {
        dimName: null,
        dimId: null
      });
      params.nodeNameAssociation = nodeNameAssociation;

      let charTypes = [];
      if (chartType !== 'rawdata') {
        let seriesNumber = EnergyStore.getEnergyData().toJS().Data.length;
        let seriesStatusArray = ChartStatusStore.getSeriesStatus();
        let sslength = seriesStatusArray.length;
        for (let i = 0; i < seriesNumber; i++) {
          let curChartType;
          if (i < sslength) {
            let serie = seriesStatusArray[i];
            if (serie) {
              if (serie.IsDisplay) {
                curChartType = ChartStatusStore.getChartTypeByNum(serie.ChartType);
              } else {
                curChartType = 'null';
              }
            } else {
              curChartType = chartType;
            }
          } else {
            curChartType = chartType;
          }
          charTypes.push(curChartType);
        }
      }
      params.charTypes = charTypes;
      ExportChartAction.getTagsData4Export(params, path);
    },
    exportCostChart(analysisPanel) {
      if (!analysisPanel.state.energyData) {
        return;
      }
      var path;
      if (analysisPanel.state.touBtnSelected) {
        path = '/Energy/GetElectricityCostData4Export';
      } else {
        path = '/Energy/GetCostData4Export';
      }
      let chartType = analysisPanel.state.selectedChartType;
      let selectedList = CostStore.getSelectedList();
      let submitParams = CostStore.getSubmitParams();
      let commodityIds = submitParams.commodityIds;
      let viewOption = submitParams.viewOption;
      let viewAssociation = submitParams.viewAssociation;
      let title = analysisPanel.props.chartTitle || I18N.Folder.NewWidget.Menu1;
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationBySelectedList(selectedList);

      let params = {
        title: title,
        viewOption: viewOption,
        viewAssociation: viewAssociation,
        nodeNameAssociation: nodeNameAssociation
      };
      if (!analysisPanel.state.touBtnSelected) {
        params.commodityIds = commodityIds;
      }

      let charTypes = [];

      let seriesNumber = CostStore.getEnergyData().toJS().Data.length;
      let seriesStatusArray = ChartStatusStore.getSeriesStatus();
      let sslength = seriesStatusArray.length;
      for (let i = 0; i < seriesNumber; i++) {
        let curChartType;
        if (i < sslength) {
          let serie = seriesStatusArray[i];
          if (serie) {
            if (serie.IsDisplay) {
              curChartType = ChartStatusStore.getChartTypeByNum(serie.ChartType);
            } else {
              curChartType = 'null';
            }
          } else {
            curChartType = chartType;
          }
        } else {
          curChartType = chartType;
        }
        charTypes.push(curChartType);
      }
      params.charTypes = charTypes;
      ExportChartAction.getTagsData4Export(params, path);
    },
    exportCarbonChart(analysisPanel) {
      if (!analysisPanel.state.energyData) {
        return;
      }
      let path = '/Energy/GetCarbonUsageData4Export';
      let chartType = analysisPanel.state.selectedChartType;
      let selectedList = {},
        hierarchyNode = CommodityStore.getHierNode(),
        commodityList = CommodityStore.getCommonCommodityList();
      selectedList.hierarchyNode = hierarchyNode;
      selectedList.commodityList = commodityList;
      let commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
      let submitParams = CarbonStore.getSubmitParams();
      let viewOption = submitParams.viewOption;
      let viewAssociation = submitParams.viewAssociation;
      let title = analysisPanel.props.chartTitle || I18N.Folder.NewWidget.Menu1;
      let destination = CarbonStore.getDestination();
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationBySelectedList(selectedList);

      let params = {
        title: title,
        commodityIds: commodityIds,
        hierarchyId: hierarchyNode.hierId,
        viewOption: viewOption,
        destination: destination,
        viewAssociation: viewAssociation,
        nodeNameAssociation: nodeNameAssociation
      };

      let seriesNumber = CarbonStore.getCarbonData().toJS().Data.length;
      let charTypes = [];
      // for (let i = 0; i < seriesNumber; i++) {
      //   charTypes.push(chartType); //暂且全部用chartType，以后可以修改每个series type之后要做更改
      // }
      // params.charTypes = charTypes;
      // ExportChartAction.getTagsData4Export(params, path);
      let seriesStatusArray = ChartStatusStore.getSeriesStatus();
      let sslength = seriesStatusArray.length;
      for (let i = 0; i < seriesNumber; i++) {
        let curChartType;
        if (i < sslength) {
          let serie = seriesStatusArray[i];
          if (serie) {
            if (serie.IsDisplay) {
              curChartType = ChartStatusStore.getChartTypeByNum(serie.ChartType);
            } else {
              curChartType = 'null';
            }
          } else {
            curChartType = chartType;
          }
        } else {
          curChartType = chartType;
        }
        charTypes.push(curChartType);
      }
      params.charTypes = charTypes;
      ExportChartAction.getTagsData4Export(params, path);
    },
    exportChart4UnitEnergy(analysisPanel) {
      if (!analysisPanel.state.energyData) {
        return;
      }
      let path = '/Energy/GetEnergyUsageUnitData4Export';
      let chartType = analysisPanel.state.selectedChartType;
      let tagOptions = EnergyStore.getTagOpions();
      let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
      let submitParams = EnergyStore.getSubmitParams();
      let benchmarkOption = submitParams.benchmarkOption;
      let viewOption = submitParams.viewOption;
      let title = analysisPanel.props.chartTitle || I18N.Folder.NewWidget.Menu1;
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions, {
        dimName: null,
        dimId: null
      });
      let params = {
        title: title,
        tagIds: tagIds,
        viewOption: viewOption,
        nodeNameAssociation: nodeNameAssociation,
        benchmarkOption: benchmarkOption
      };

      let seriesNumber = EnergyStore.getEnergyData().toJS().Data.length;
      let charTypes = [];
      let seriesStatusArray = ChartStatusStore.getSeriesStatus();
      let sslength = seriesStatusArray.length;
      for (let i = 0; i < seriesNumber; i++) {
        let curChartType;
        if (i < sslength) {
          let serie = seriesStatusArray[i];
          if (serie) {
            if (serie.IsDisplay) {
              curChartType = ChartStatusStore.getChartTypeByNum(serie.ChartType);
            } else {
              curChartType = 'null';
            }
          } else {
            curChartType = chartType;
          }
        } else {
          curChartType = chartType;
        }
        charTypes.push(curChartType);
      }
      params.charTypes = charTypes;

      ExportChartAction.getTagsData4Export(params, path);
    },
    exportChart4Ratio(analysisPanel) {
      if (!analysisPanel.state.energyData) {
        return;
      }
      let path = '/Energy/RatioGetTagsData4Export';
      let chartType = analysisPanel.state.selectedChartType;
      //let tagOptions = RatioStore.getTagOpions();
      let tagOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      //let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
      let submitParams = RatioStore.getSubmitParams();
      let tagIds = submitParams.tagIds;
      let ratioType = submitParams.ratioType;
      let benchmarkOption = submitParams.benchmarkOption;
      let viewOption = submitParams.viewOption;
      let title = analysisPanel.props.chartTitle || I18N.Folder.NewWidget.Menu3;
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions, {
        dimName: null,
        dimId: null
      });
      let params = {
        ratioType: ratioType,
        title: title,
        tagIds: tagIds,
        viewOption: viewOption,
        nodeNameAssociation: nodeNameAssociation,
        benchmarkOption: benchmarkOption
      };

      let seriesNumber = RatioStore.getEnergyData().toJS().Data.length;
      let charTypes = [];
      for (let i = 0; i < seriesNumber; i++) {
        charTypes.push(chartType); //暂且全部用chartType，以后可以修改每个series type之后要做更改
      }
      params.charTypes = charTypes;

      ExportChartAction.getTagsData4Export(params, path);
    },
    exportChart4UnitCost(analysisPanel) {
      if (!analysisPanel.state.energyData) {
        return;
      }
      let path = '/Energy/GetCostUnitData4Export';
      let chartType = analysisPanel.state.selectedChartType;
      let selectedList = CostStore.getSelectedList();
      let submitParams = CostStore.getSubmitParams();
      let commodityIds = submitParams.commodityIds;
      let benchmarkOption = submitParams.benchmarkOption;
      let viewOption = submitParams.viewOption;
      let viewAssociation = submitParams.viewAssociation;
      let title = analysisPanel.props.chartTitle || I18N.Folder.NewWidget.Menu1;
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationBySelectedList(selectedList);
      let params = {
        title: title,
        commodityIds: commodityIds,
        viewOption: viewOption,
        viewAssociation: viewAssociation,
        nodeNameAssociation: nodeNameAssociation,
        benchmarkOption: benchmarkOption
      };

      let seriesNumber = CostStore.getEnergyData().toJS().Data.length;
      let charTypes = [];
      let seriesStatusArray = ChartStatusStore.getSeriesStatus();
      let sslength = seriesStatusArray.length;
      for (let i = 0; i < seriesNumber; i++) {
        let curChartType;
        if (i < sslength) {
          let serie = seriesStatusArray[i];
          if (serie) {
            if (serie.IsDisplay) {
              curChartType = ChartStatusStore.getChartTypeByNum(serie.ChartType);
            } else {
              curChartType = 'null';
            }
          } else {
            curChartType = chartType;
          }
        } else {
          curChartType = chartType;
        }
        charTypes.push(curChartType);
      }
      params.charTypes = charTypes;

      ExportChartAction.getTagsData4Export(params, path);
    },
    exportChart4UnitCarbon(analysisPanel) {
      if (!analysisPanel.state.energyData) {
        return;
      }
      let path = '/Energy/GetCarbonUsageUnitData4Export';
      let chartType = analysisPanel.state.selectedChartType;
      let selectedList = {},
        hierarchyNode = CommodityStore.getHierNode(),
        commodityList = CommodityStore.getCommonCommodityList();
      selectedList.hierarchyNode = hierarchyNode;
      selectedList.commodityList = commodityList;
      let commodityIds = CommonFuns.getCommodityIdsFromList(commodityList);
      let submitParams = CarbonStore.getSubmitParams();
      let viewOption = submitParams.viewOption;
      let viewAssociation = submitParams.viewAssociation;
      let title = analysisPanel.props.chartTitle || I18N.Folder.NewWidget.Menu1;
      let destination = CarbonStore.getDestination();
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationBySelectedList(selectedList);
      let benchmarkOption = submitParams.benchmarkOption;
      if (benchmarkOption === undefined)
        benchmarkOption = null;

      let params = {
        title: title,
        commodityIds: commodityIds,
        hierarchyId: hierarchyNode.hierId,
        viewOption: viewOption,
        destination: destination,
        viewAssociation: viewAssociation,
        nodeNameAssociation: nodeNameAssociation,
        benchmarkOption: benchmarkOption
      };

      let seriesNumber = CarbonStore.getCarbonData().toJS().Data.length;
      let charTypes = [];
      for (let i = 0; i < seriesNumber; i++) {
        charTypes.push(chartType); //暂且全部用chartType，以后可以修改每个series type之后要做更改
      }
      params.charTypes = charTypes;
      ExportChartAction.getTagsData4Export(params, path);
    },
  },
  getWidgetSaveWindowFnStrategy: {
    getAlarmWidgetSaveWindow: function(analysisPanel) {
      let widgetWd = <WidgetSaveWindow ref={'saveChartDialog'}  onDismiss={analysisPanel.onWidgetSaveWindowDismiss} chartTitle={analysisPanel.props.chartTitle}
      onSave={analysisPanel.onWidgetSaveWindow}></WidgetSaveWindow>;
      return widgetWd;
    }
  },
  getChartTypeIconMenu(analysisPanel, types) {
    let iconStyle = {
        fontSize: '16px'
      },
      style = {
        padding: '0px',
        height: '18px',
        width: '18px',
        fontSize: '18px'
      };
    let menuMap = {
      line: {
        primaryText: I18N.EM.CharType.Line,
        icon: <FontIcon className="icon-line" iconStyle ={iconStyle} style = {style} />
      },
      column: {
        primaryText: I18N.EM.CharType.Bar,
        icon: <FontIcon className="icon-column" iconStyle ={iconStyle} style = {style}  />
      },
      stack: {
        primaryText: I18N.EM.CharType.Stack,
        icon: <FontIcon className="icon-stack" iconStyle ={iconStyle} style = {style} />
      },
      pie: {
        primaryText: I18N.EM.CharType.Pie,
        icon: <FontIcon className="icon-pie" iconStyle ={iconStyle} style = {style} />
      },
      rawdata: {
        primaryText: I18N.EM.CharType.RawData,
        icon: <FontIcon className="icon-raw-data" iconStyle ={iconStyle} style = {style} />
      }
    };
    let chartType = analysisPanel.state.selectedChartType || 'line';
    let mainIcon = menuMap[chartType].icon;
    let IconButtonElement = mainIcon;
    let iconMenuProps = {
      iconButtonElement: IconButtonElement,
      openDirection: "bottom-right",
      onChange: analysisPanel._onSearchBtnItemTouchTap
    };

    let typeItems = types.map((item) => {
      return <MenuItem primaryText={menuMap[item].icon} value={item} />;
    });

    let widgetOptMenu = <IconMenu {...iconMenuProps}>
                         {typeItems}
                      </IconMenu>;
    return widgetOptMenu;
  },
  getClearChartBtn(analysisPanel) {
    var icon = <div><FontIcon className="icon-delete" style={{
      fontSize: '14px'
    }}/></div>;
    var btn = <RaisedButton label={I18N.EM.Tool.ClearChart} style={{backgroundColor:'#fbfbfb'}} onClick={analysisPanel.state.chartStrategy.clearChartDataFn.bind(analysisPanel, analysisPanel)}/>;
    return <div className='jazz-no-background-button-container'>{icon}{btn}</div>;
  },
  getSearchBtn(analysisPanel) {
    var searchButton = <RaisedButton label={I18N.Common.Button.Show} onClick={analysisPanel.onSearchDataButtonClick} backgroundColor='#32ad3c' labelStyle={{
      color: 'white',
      fontWeight: '100',
      fontSize: '12px'
    }}/>;
    return searchButton;
  },
  getLabelBtn(analysisPanel) {
    var industySubItems = analysisPanel.state.industyMenuItems;
    var customizedSubItems = analysisPanel.state.customerMenuItems;
    let labelButton = <ButtonMenu label={analysisPanel.state.selectedLabelItem.text} style={{
      marginLeft: '10px',
      fontSize: '12px',
      width: '132px'
    }} desktop={true} backgroundColor="#fbfbfb"
    disabled={analysisPanel.state.labelDisable} onItemTouchTap={analysisPanel._onChangeLabelType}>
      <ExtendableMenuItem primaryText={I18N.Setting.Labeling.Label.IndustryLabeling} value='industryZone' subItems={industySubItems}>
      </ExtendableMenuItem>
      <ExtendableMenuItem primaryText={I18N.Setting.Labeling.Label.CustomizedLabeling} value='customized' subItems={customizedSubItems}>
      </ExtendableMenuItem>
    </ButtonMenu>;
    return labelButton;
  },
  getKpiTypeBtn(analysisPanel) {
    let kpiTypeButton;
    var kpiSpanStyle = {
      width: '130px',
      height: '32px',
      lineHeight: '32px',
      border: '1px solid #efefef',
      margin: '-4px 0px 0px 10px',
      fontSize: '12px',
      color: '#b3b3b3',
      textAlign: 'left',
      paddingLeft: '15px',
      display: 'block'
    };
    var labelStyle={fontSize:'12px',lineHeight:'32px',paddingRight:'0'};
    var kpiTypeItem = ConstStore.getKpiTypeItem();

    if (!analysisPanel.state.kpiTypeDisable) {
      kpiTypeButton = <DropDownMenu style={{
        marginLeft: '10px',
        width: '130px'
      }} labelStyle={labelStyle} value={analysisPanel.state.kpiTypeValue} ref='kpiType' onChange={analysisPanel.onChangeKpiType}>{kpiTypeItem}</DropDownMenu>;
    } else {
      var kpiTypeText = analysisPanel.getKpiText();
      kpiTypeButton = <span style={kpiSpanStyle}>{kpiTypeText}</span>;
    }
    return kpiTypeButton;
  },
  getStrategyByStoreType: function(storeType) {
    return ChartStrategyFactor.getStrategyByConfig(ChartStrategyFactor.strategyConfiguration[storeType]);
  },
  getStrategyByConfig: function(strategyConfig) {
    var strategyObj = {},
      cloneConfig = _.cloneDeep(strategyConfig);

    cloneConfig = CommonFuns.applyIf(cloneConfig, this.defaultStrategy);

    for (var n in cloneConfig) {
      strategyObj[n] = this[n + 'Strategy'][cloneConfig[n]];
    }
    return strategyObj;
  }
};

module.exports = ChartStrategyFactor;
