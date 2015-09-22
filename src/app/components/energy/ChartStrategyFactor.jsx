'use strict';
import React from "react";
import assign from "object-assign";
import Immutable from 'immutable';
import _ from 'lodash';
import { FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress, IconMenu } from 'material-ui';
import BaselineCfg from '../setting/BaselineCfg.jsx';
import CommonFuns from '../../util/Util.jsx';
import DateTimeSelector from '../../controls/DateTimeSelector.jsx';
import ButtonMenu from '../../controls/ButtonMenu.jsx';
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
import EnergyStore from '../../stores/energy/EnergyStore.jsx';
import CostStore from '../../stores/CostStore.jsx';
import CarbonStore from '../../stores/CarbonStore.jsx';
import LabelStore from '../../stores/LabelStore.jsx';
import RatioStore from '../../stores/RatioStore.jsx';
import LabelMenuStore from '../../stores/LabelMenuStore.jsx';
import RankStore from '../../stores/RankStore.jsx';
import CommodityStore from '../../stores/CommodityStore.jsx';
import TagStore from '../../stores/TagStore.jsx';
import ChartStatusStore from '../../stores/energy/ChartStatusStore.jsx';
import AddIntervalWindow from './energy/AddIntervalWindow.jsx';
import SumWindow from './energy/SumWindow.jsx';
import MultipleTimespanStore from '../../stores/energy/MultipleTimespanStore.jsx';
import MultiTimespanAction from '../../actions/MultiTimespanAction.jsx';
import CalendarManager from './CalendarManager.jsx';
import WidgetSaveWindow from './WidgetSaveWindow.jsx';
import { dateAdd, dateFormat, DataConverter, isArray, isNumber, formatDateByStep, getDecimalDigits, toFixed, JazzCommon } from '../../util/Util.jsx';

let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');


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
      save2DashboardFn: 'save2Dashboard',
      save2DashboardForAlarmFn: 'save2DashboardForAlarm',
      initChartPanelByWidgetDtoFn: 'initChartPanelByWidgetDto',
      clearChartDataFn: 'clearChartData',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      initAlarmChartPanelByWidgetDtoFn: 'initAlarmChartPanelByWidgetDto',
      getWidgetSaveWindowFn: 'getAlarmWidgetSaveWindow',
      resetYaxisSelectorFn: 'resetYaxisSelector',
      onDeleteButtonClickFn: 'onDeleteButtonClick'
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
      save2DashboardFn: 'saveCost2Dashboard',
      initChartPanelByWidgetDtoFn: 'initCostChartPanelByWidgetDto',
      isCalendarDisabledFn: 'isCostCalendarDisabled',
      onAnalysisPanelDidUpdateFn: 'onCostAnalysisPanelDidUpdate',
      handleCalendarChangeFn: 'handleCalendarChange',
      clearChartDataFn: 'clearCostChartData',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      resetYaxisSelectorFn: 'resetYaxisSelector',
      onDeleteButtonClickFn: 'onCostDeleteButtonClick'
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
      exportChartFn: 'exportCarbonChart',
      save2DashboardFn: 'saveCarbon2Dashboard',
      initChartPanelByWidgetDtoFn: 'initCarbonChartPanelByWidgetDto',
      isCalendarDisabledFn: 'isCarbonCalendarDisabled',
      onAnalysisPanelDidUpdateFn: 'onCarbonAnalysisPanelDidUpdate',
      handleCalendarChangeFn: 'handleCalendarChange',
      handleConfigBtnItemTouchTapFn: 'handleCarbonConfigBtnItemTouchTap',
      clearChartDataFn: 'clearCarbonChartData',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      resetYaxisSelectorFn: 'resetYaxisSelector'
    },
    RatioUsage: {
      searchBarGenFn: 'ratioUsageSearchBarGen',
      getEnergyTypeComboFn: 'empty',
      getSelectedNodesFn: 'getSelectedTagList',
      onSearchDataButtonClickFn: 'onRatioSearchDataButtonClick',
      onSearchBtnItemTouchTapFn: 'onCostSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn: 'initEnergyStoreByBizChartType',
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
      save2DashboardFn: 'saveRatio2Dashboard',
      isCalendarDisabledFn: 'isCalendarDisabled',
      onAnalysisPanelDidUpdateFn: 'onRatioAnalysisPanelDidUpdate',
      handleCalendarChangeFn: 'handleCalendarChange',
      clearChartDataFn: 'clearRatioChartData',
      initChartPanelByWidgetDtoFn: 'initRatioChartPanelByWidgetDto',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      resetYaxisSelectorFn: 'resetYaxisSelector'
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
      save2DashboardFn: 'saveUnit2Dashboard',
      initChartPanelByWidgetDtoFn: 'initUnitChartPanelByWidgetDto',
      handleCalendarChangeFn: 'handleCalendarChange',
      onAnalysisPanelDidUpdateFn: 'onAnalysisPanelDidUpdate',
      isCalendarDisabledFn: 'isCalendarDisabled',
      clearChartDataFn: 'clearUnitChartData',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      resetYaxisSelectorFn: 'resetYaxisSelector'
    },
    UnitCost: {
      searchBarGenFn: 'unitEnergySearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn: 'getCostSelectedTagList',
      onSearchDataButtonClickFn: 'onUnitCostSearchDataButtonClick',
      onSearchBtnItemTouchTapFn: 'onCostSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn: 'initUnitCostStoreByBizChartType',
      setFitStepAndGetDataFn: 'setUnitEnergyFitStepAndGetData',
      getInitialStateFn: 'getUnitEnergyInitialState',
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
      save2DashboardFn: 'saveUnitCost2Dashboard',
      initChartPanelByWidgetDtoFn: 'initUnitCostChartPanelByWidgetDto',
      isCalendarDisabledFn: 'isCostCalendarDisabled',
      onAnalysisPanelDidUpdateFn: 'onCostAnalysisPanelDidUpdate',
      handleCalendarChangeFn: 'handleCalendarChange',
      clearChartDataFn: 'clearUnitCostChartData',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      resetYaxisSelectorFn: 'resetYaxisSelector',
      onDeleteButtonClickFn: 'onUnitCostDeleteButtonClick'
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
      save2DashboardFn: 'saveUnitCarbon2Dashboard',
      initChartPanelByWidgetDtoFn: 'initUnitCarbonChartPanelByWidgetDto',
      isCalendarDisabledFn: 'isCarbonCalendarDisabled',
      onAnalysisPanelDidUpdateFn: 'onCarbonAnalysisPanelDidUpdate',
      handleCalendarChangeFn: 'handleCalendarChange',
      clearChartDataFn: 'clearUnitCarbonChartData',
      getWidgetOptMenuFn: 'getWidgetOptMenu',
      resetYaxisSelectorFn: 'resetYaxisSelector'
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
      resetYaxisSelectorFn: 'empty'
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
      resetYaxisSelectorFn: 'resetYaxisSelector'
    }
  },
  onDeleteButtonClickFnStrategy: {
    onDeleteButtonClick(analysisPanel, obj) {
      let uid = obj.uid,
        needReload = EnergyStore.removeSeriesDataByUid(uid);

      AlarmTagAction.removeSearchTagList({
        tagId: uid
      });

      if (needReload) {
        let tagOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn(),
          paramsObj = EnergyStore.getParamsObj(),
          timeRanges = paramsObj.timeRanges,
          step = paramsObj.step;

        analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false);
      } else {
        let energyData = EnergyStore.getEnergyData();
        analysisPanel.setState({
          energyData: energyData
        });
      }
    },
    onCostDeleteButtonClick(analysisPanel, obj) {
      let uid = obj.uid,
        needReload = CostStore.removeSeriesDataByUid(uid);

      CommodityAction.setCommoditySelectStatus(uid, null, false);

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
    onUnitCostDeleteButtonClick(analysisPanel, obj) {
      let uid = obj.uid,
        needReload = CostStore.removeSeriesDataByUid(uid);

      CommodityAction.setCommoditySelectStatus(uid, null, false);

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
  },
  resetYaxisSelectorFnStrategy: {
    empty() {},
    resetYaxisSelector() {
      YaxisSelector.reset();
    }
  },
  getWidgetOptMenuFnStrategy: {
    getWidgetOptMenu(analysisPanel) {
      var IconButtonElement = <IconButton iconClassName="icon-arrow-down"/>;
      var iconMenuProps = {
        iconButtonElement: IconButtonElement,
        openDirection: "bottom-right",
        desktop: true
      };
      let widgetOptMenu = analysisPanel.props.isFromAlarm ? null : <IconMenu {...iconMenuProps} onItemTouchTap={analysisPanel._onTitleMenuSelect}>
                              <MenuItem key={1} primaryText={'另存为'} />
                              <MenuItem key={2} primaryText={'发送'} />
                              <MenuItem key={3} primaryText={'共享'} />
                              <MenuItem key={4} primaryText={'导出'} />
                              <MenuItem key={5} primaryText={'删除'} />
                           </IconMenu>;
      return widgetOptMenu;
    },
    getLabelWidgetOptMenu(analysisPanel) {
      var IconButtonElement = <IconButton iconClassName="icon-arrow-down"/>;
      var iconMenuProps = {
        iconButtonElement: IconButtonElement,
        openDirection: "bottom-right",
        desktop: true
      };
      let widgetOptMenu = analysisPanel.props.isFromAlarm ? null : <IconMenu {...iconMenuProps} onItemTouchTap={analysisPanel._onTitleMenuSelect}>
                              <MenuItem key={1} primaryText={'另存为'} />
                              <MenuItem key={2} primaryText={'发送'} />
                              <MenuItem key={3} primaryText={'共享'} />
                              <MenuItem key={5} primaryText={'删除'} />
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
        chartType = widgetDto.ChartType;

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
          analysisPanel.refs.dateTimeSelector.setDateField(start, end);
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
        selectedChartType: typeMap[chartType],
        yaxisConfig: yaxisConfig,
        sumBtnStatus: sumBtnStatus,
        step: step
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
        contentSyntax = widgetDto.ContentSyntax,
        contentObj = JSON.parse(contentSyntax),
        viewOption = contentObj.viewOption,
        step = viewOption.Step,
        timeRanges = viewOption.TimeRanges,
        chartType = widgetDto.ChartType;

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
          analysisPanel.refs.dateTimeSelector.setDateField(start, end);
        }
      };

      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      if (bizType == 'CostElectric') {
        touBtnSelected = true;
      }
      let yaxisConfig = null;
      if (WidgetStatusArray) {
        yaxisConfig = CommonFuns.getYaxisConfig(WidgetStatusArray);
      }

      analysisPanel.setState({
        step: step,
        yaxisConfig: yaxisConfig,
        selectedChartType: typeMap[chartType],
        touBtnStatus: CommodityStore.getECButtonStatus(),
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
        contentSyntax = widgetDto.ContentSyntax,
        contentObj = JSON.parse(contentSyntax),
        viewOption = contentObj.viewOption,
        timeRanges = viewOption.TimeRanges,
        dest = contentObj.destination,
        chartType = widgetDto.ChartType;
      CarbonStore.setDestination(dest);

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
          analysisPanel.refs.dateTimeSelector.setDateField(start, end);
        }
      };

      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      analysisPanel.state.selectedChartType = typeMap[chartType];
      analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);

      ChartStatusAction.setWidgetDto(widgetDto, analysisPanel.props.bizType, analysisPanel.props.energyType, analysisPanel.state.selectedChartType);
      analysisPanel.setCalendarTypeFromWidget(widgetDto);
    },
    initRatioChartPanelByWidgetDto(analysisPanel) {
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      let widgetDto = analysisPanel.props.widgetDto,
        contentSyntax = widgetDto.ContentSyntax,
        contentObj = JSON.parse(contentSyntax),
        benchmarkOption = contentObj.benchmarkOption,
        viewOption = contentObj.viewOption,
        step = viewOption.Step,
        timeRanges = viewOption.TimeRanges,
        chartType = widgetDto.ChartType,
        ratioType = viewOption.DataOption.RatioType;

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
          analysisPanel.refs.dateTimeSelector.setDateField(start, end);
        }
      };

      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      let bo = null;
      if (benchmarkOption && benchmarkOption.IndustryId !== null) {
        bo = benchmarkOption;
      }

      setTimeout(() => {
        analysisPanel.setState({
          step: step,
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
        chartType = widgetDto.ChartType;

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
          analysisPanel.refs.dateTimeSelector.setDateField(start, end);
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

      analysisPanel.setCalendarTypeFromWidget(widgetDto);
    },
    initUnitCarbonChartPanelByWidgetDto(analysisPanel) {
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      let widgetDto = analysisPanel.props.widgetDto,
        contentSyntax = widgetDto.ContentSyntax,
        contentObj = JSON.parse(contentSyntax),
        benchmarkOption = contentObj.benchmarkOption,
        viewOption = contentObj.viewOption,
        timeRanges = viewOption.TimeRanges,
        unitType = viewOption.DataOption.UnitType,
        dest = contentObj.destination,
        chartType = widgetDto.ChartType;
      CarbonStore.setDestination(dest);

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
          analysisPanel.refs.dateTimeSelector.setDateField(start, end);
        }
      };

      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      let bo = null;
      if (benchmarkOption && benchmarkOption.IndustryId !== null) {
        bo = benchmarkOption;
      }

      setTimeout(() => {
        analysisPanel.setState({
          unitType: unitType,
          benchmarkOption: bo,
          selectedChartType: typeMap[chartType]
        }, () => {
          CommonFuns.setSelectedIndexByValue(analysisPanel.refs.unitTypeCombo, unitType);
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
        chartType = widgetDto.ChartType;

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
          analysisPanel.refs.dateTimeSelector.setDateField(start, end);
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
          step: step,
          yaxisConfig: yaxisConfig,
          unitType: unitType,
          benchmarkOption: bo,
          selectedChartType: typeMap[chartType],
          baselineBtnStatus: CommodityStore.getUCButtonStatus()
        }, () => {
          CommonFuns.setSelectedIndexByValue(analysisPanel.refs.unitTypeCombo, unitType);
          analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
        });
        ChartStatusAction.setWidgetDto(widgetDto, analysisPanel.props.bizType, analysisPanel.props.energyType, analysisPanel.state.selectedChartType);
      });
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
        step = viewOption.Step;
      if (benchmarkOption === null)
        return;
      let initPanelDate = function(timeRange) {
        let start = j2d(timeRange.StartTime, false);
        let end = j2d(timeRange.EndTime, false);
        var year = start.getFullYear();
        var month = start.getMonth();
        var monthIndex;
        analysisPanel.refs.yearSelector.setState({
          selectedYear: year
        });
        if (step === 4) {
          monthIndex = 0;
        } else {
          monthIndex = month + 1;
        }
        analysisPanel.setState({
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
      var map = {}, hierId, i,
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
      analysisPanel.setState({
        benchmarkOption: benchmarkOption,
        kpiTypeValue: labelingType
      });


      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      //init selected tags is done in the other part

      analysisPanel.state.selectedChartType = "column";
      var nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
      analysisPanel.state.chartStrategy.getEnergyDataFn(viewOption, nodeOptions, benchmarkOption, labelingType);
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
        viewOption = contentObj.viewOption,
        timeRanges = viewOption.TimeRanges;


      let initPanelDate = function(timeRange) {
        if (timeRange.relativeDate) {
          analysisPanel._setRelativeDateByValue(timeRange.relativeDate);
        } else {
          analysisPanel._setRelativeDateByValue('Customerize');
          let start = j2d(timeRange.StartTime, false);
          let end = j2d(timeRange.EndTime, false);
          analysisPanel.refs.dateTimeSelector.setDateField(start, end);
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
        timeRanges = widgetDto.timeRange;

      let initPanelDate = function(timeRange) {
        if (timeRange.relativeDate) {
          analysisPanel._setRelativeDateByValue(timeRange.relativeDate);
        } else {
          let start = timeRange.StartTime;
          let end = timeRange.EndTime;
          analysisPanel.refs.dateTimeSelector.setDateField(start, end);
          analysisPanel.refs.relativeDate.setState({
            selectedIndex: 0
          });
        }
      };
      //init timeRange
      let timeRange = timeRanges[0];
      initPanelDate(timeRange);

      //init selected tags is done in the other part

      analysisPanel.state.selectedChartType = 'line';
      analysisPanel.setState({
        step: widgetDto.step
      });
      analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
    },
  },
  save2DashboardForAlarmFnStrategy: {
    save2DashboardForAlarm(analysisPanel) {
      let tagOptions = EnergyStore.getTagOpions(), options,
        relativeDate = EnergyStore.getRelativeDate();

      if (tagOptions) {
        if (isArray(tagOptions)) {
          options = [];
          for (let i = 0, len = tagOptions.length; i < len; i++) {
            let tag = tagOptions[i];
            options.push({
              Id: tag.tagId,
              Name: tag.tagName,
              HierId: tag.hierId,
              NodeName: tag.hierName
            });
          }
        } else {
          options = [{
            Id: tagOptions.tagId,
            Name: tagOptions.tagName,
            HierId: tagOptions.hierId,
            NodeName: tagOptions.hierName
          }];
        }
      }
      let submitParams = EnergyStore.getSubmitParams();
      if (relativeDate !== 'Customerize' && relativeDate !== null) {
        let immutableSubmitParams = Immutable.fromJS(submitParams);
        let immutableSubmitParamsClone = immutableSubmitParams.setIn(['viewOption', 'TimeRanges'], [{
          relativeDate: relativeDate
        }]);
        submitParams = immutableSubmitParamsClone.toJS();
      }
      var contentSyntax = {
        xtype: 'widgetcontainer',
        params: {
          submitParams: {
            options: options,
            tagIds: submitParams.tagIds,
            interval: [],
            viewOption: submitParams.viewOption
          },
          config: {
            type: "line",
            xtype: "mixedtrendchartcomponent",
            reader: "mixedchartreader",
            storeType: "energy.Energy",
            searcherType: "analysissearcher",
            widgetStyler: "widgetchartstyler",
            maxWidgetStyler: "maxchartstyler"
          }
        }
      };
      analysisPanel.setState({
        dashboardOpenImmediately: true,
        contentSyntax: JSON.stringify(contentSyntax)
      });
    }
  },
  save2DashboardFnStrategy: {
    save2Dashboard(analysisPanel) {
      let chartType = analysisPanel.state.selectedChartType;
      let tagOptions = EnergyStore.getTagOpions();
      let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions);
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
          viewOption.IncludeTempValue = vo.IncludeHumidityValue;
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
      FolderAction.updateWidgetDtos(widgetDto);
    },
    saveRatio2Dashboard(analysisPanel) {
      let chartType = analysisPanel.state.selectedChartType;
      let tagOptions = RatioStore.getRatioOpions();
      let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions);
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
      widgetDto.WidgetSeriesArray = ChartStatusStore.getWidgetSaveStatus();
      FolderAction.updateWidgetDtos(widgetDto);
    },
    saveUnit2Dashboard(analysisPanel) {
      let chartType = analysisPanel.state.selectedChartType;
      let tagOptions = EnergyStore.getTagOpions();
      let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions);
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

      widgetDto.WidgetSeriesArray = ChartStatusStore.getWidgetSaveStatus();

      FolderAction.updateWidgetDtos(widgetDto);
    },
    saveCost2Dashboard(analysisPanel) {
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
      FolderAction.updateWidgetDtos(widgetDto);
    },
    saveUnitCost2Dashboard(analysisPanel) {
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
      FolderAction.updateWidgetDtos(widgetDto);
    },
    saveCarbon2Dashboard(analysisPanel) {
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
      widgetDto.ContentSyntax = JSON.stringify(contentSyntax);
      FolderAction.updateWidgetDtos(widgetDto);
    },
    saveUnitCarbon2Dashboard(analysisPanel) {
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
      widgetDto.ContentSyntax = JSON.stringify(contentSyntax);
      FolderAction.updateWidgetDtos(widgetDto);
    },
    saveLabel2Dashboard(analysisPanel) {
      let chartType = analysisPanel.state.selectedChartType;
      let tagOptions = LabelStore.getTagOpions();
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions);
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
      FolderAction.updateWidgetDtos(widgetDto);
    },
    saveRank2Dashboard(analysisPanel) {
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
      FolderAction.updateWidgetDtos(widgetDto);
    }
  },
  handleNavigatorChangeLoadFnStrategy: {
    handleNavigatorChangeLoad(analysisPanel) {
      let tagOptions = EnergyStore.getTagOpions(),
        paramsObj = EnergyStore.getParamsObj(),
        dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end;

      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, tagOptions, 'Customerize', analysisPanel);
    },
    handleCostNavigatorChangeLoad(analysisPanel) {
      let tagOptions = CostStore.getSelectedList(),
        paramsObj = CostStore.getParamsObj(),
        dateSelector = analysisPanel.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end;

      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, tagOptions, 'Customerize', analysisPanel);
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
    isWeatherDisabled() {
      let tagOptions = EnergyStore.getTagOpions();
      if (!tagOptions) return I18N.EM.WeatherSupportsOnlySingleHierarchy;
      let paramsObj = EnergyStore.getParamsObj(),
        step = paramsObj.step;
      if (step != 1) return I18N.EM.WeatherSupportsOnlyHourlyStep;
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

      analysisPanel.setState({
        step: step,
        isCalendarInited: false
      });
      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false);
    },
    handleCostStepChange(analysisPanel, step) {
      let tagOptions = CostStore.getSelectedList(),
        paramsObj = CostStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges;

      analysisPanel.setState({
        step: step,
        isCalendarInited: false
      });
      analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false, analysisPanel);
    },
    handleCarbonStepChange(analysisPanel, step) {
      let paramsObj = CarbonStore.getSubmitParams();
      let hierarchyId = paramsObj.hierarchyId,
        commodityIds = paramsObj.commodityIds,
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
      let tagOptions = EnergyStore.getTagOpions(),
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
      let tagOptions = CostStore.getSelectedList(),
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
      let hierarchyId = paramsObj.hierarchyId,
        commodityIds = paramsObj.commodityIds,
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
          display: 'flex'
        }}>
             <div style={{
          margin: '10px 0 0 23px'
        }}>{chartTypeIconMenu}</div>
             <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
             <StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
             <div style={{
          margin: '5px 30px 5px auto'
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
          display: 'flex'
        }}>
             <div style={{
          margin: '10px 0 0 23px'
        }}>{chartTypeIconMenu}</div>
             <div style={{
          margin: '5px 30px 5px auto'
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
          display: 'flex'
        }}>
             <div style={{
          margin: '10px 0 0 23px'
        }}>{chartTypeIconMenu}</div>
             <div style={{
          margin: '5px 30px 5px auto'
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
          display: 'flex'
        }}>
             <div style={{
          margin: '10px 0 0 23px'
        }}>{chartTypeIconMenu}</div>
             <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
             <StepSelector minStep={1} stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
             <div style={{
          margin: '5px 30px 5px auto'
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
          display: 'flex'
        }}>
             <div style={{
          margin: '10px 0 0 23px'
        }}>{chartTypeIconMenu}</div>
             <div style={{
          margin: '5px 30px 5px auto'
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
      let menuItemChange = function(e, selectedIndex, menuItem) {
        CarbonStore.setDestination(menuItem.value);
        analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
        return true;
      };
      var selectedIndex = CarbonStore.getDestination() - 2;
      var carbonDest = <DropDownMenu menuItems={menuItems} selectedIndex={selectedIndex} onChange={menuItemChange} style={{
        display: "inline-block",
        float: "left",
        height: 36,
        width: 152
      }} />;

      if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
        toolElement = <div style={{
          display: 'flex'
        }}>
             <div style={{
          margin: '10px 0 0 23px'
        }}>{chartTypeIconMenu}</div>
             <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
             <StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
             <div className={'jazz-full-border-dropdownmenu-container'} style={{
          margin: '5px 30px 5px auto'
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
          display: 'flex'
        }}>
             <div style={{
          margin: '10px 0 0 23px'
        }}>{chartTypeIconMenu}</div>
             <div style={{
          margin: '5px 30px 5px auto'
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
        display: 'flex'
      }}>
           <div style={{
        margin: '10px 0 0 23px'
      }}>{chartTypeIconMenu}</div>
           <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
           <StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
           <div style={{
        margin: '5px 30px 5px auto'
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
        display: 'flex'
      }}>
           <div style={{
        margin: '10px 0 0 23px'
      }}>{chartTypeIconMenu}</div>
           <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
           <StepSelector minStep={1} stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
           <div style={{
        margin: '5px 30px 5px auto'
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
      let menuItemChange = function(e, selectedIndex, menuItem) {
        CarbonStore.setDestination(menuItem.value);
        analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
        return true;
      };
      var selectedIndex = CarbonStore.getDestination() - 2;
      var carbonDest = <DropDownMenu menuItems={menuItems} selectedIndex={selectedIndex} onChange={menuItemChange} style={{
        display: "inline-block",
        float: "left",
        height: 36,
        width: 152
      }} />;
      let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);
      toolElement = <div style={{
        display: 'flex'
      }}>
           <div style={{
        margin: '10px 0 0 23px'
      }}>{chartTypeIconMenu}</div>
           <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
           <StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
           <div style={{
        margin: '5px 30px 5px auto'
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
        display: 'flex'
      }}>
           <div style={{
        margin: '10px 0 0 23px'
      }}>{chartTypeIconMenu}</div>
           <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
           <StepSelector minStep={minStep} stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
           <div style={{
        margin: '5px 30px 5px auto'
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
      var toolElement,
        clearChartBtnEl = ChartStrategyFactor.getClearChartBtn(analysisPanel);
      var carbonTypeBtn = null;
      if (energyType === 'Carbon') {
        carbonTypeBtn = <DropDownMenu selectedIndex={analysisPanel.state.destination - 2} menuItems={ConstStore.getCarbonTypeItem()} ref='carbonType' onChange={analysisPanel._onCarbonTypeChange}></DropDownMenu>;
      }
      var orderItem = ConstStore.getOrderItem();
      var rangeItem = ConstStore.getRangeItem();
      var orderCombo = <DropDownMenu menuItems={orderItem} selectedIndex={analysisPanel.state.order - 1} ref='orderCombo' onChange={analysisPanel._onOrderChange}></DropDownMenu>;
      var rangeCombo = <DropDownMenu menuItems={rangeItem} selectedIndex={analysisPanel.getRangeIndex()} ref='rangeCombo' onChange={analysisPanel._onRangeChange}></DropDownMenu>;
      toolElement = <div style={{
        display: 'flex'
      }}>
         <div style={{
        margin: '10px 0 0 23px'
      }}>
           {orderCombo}
           {rangeCombo}
         </div>
         <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog} onYaxisSelectorDialogSubmit={analysisPanel._onYaxisSelectorDialogSubmit} yaxisConfig={analysisPanel.state.yaxisConfig}/>
         <div style={{
        margin: '5px 30px 5px auto'
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
    handleEnergyConfigBtnItemTouchTap(analysisPanel, menuParam, menuItem) {
      let itemValue = menuItem.props.value;
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
          var subMenuValue = menuParam.props.value;
          if (subMenuValue === 'work' || subMenuValue === 'hc') {
            analysisPanel.state.chartStrategy.handleCalendarChangeFn(subMenuValue, analysisPanel);
          }
          break;
          }
        case 'weather': {
          var subMenuValue = menuParam.props.value;
          if (subMenuValue === 'temperature') {
            analysisPanel.state.chartStrategy.handleWeatherMenuItemClickFn(analysisPanel, true, false);
          } else if (subMenuValue === 'humidity') {
            analysisPanel.state.chartStrategy.handleWeatherMenuItemClickFn(analysisPanel, false, true);
          }
          break;
          }

      }
    },
    handleUnitEnergyConfigBtnItemTouchTap(analysisPanel, subMenuItem, firstMenuItem) {
      let firstMenuItemValue = firstMenuItem.props.value;
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
    handleCostConfigBtnItemTouchTap(analysisPanel, menuParam, menuItem) {
      let itemValue = menuItem.props.value;
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
          var subMenuValue = menuParam.props.value;
          if (subMenuValue === 'work' || subMenuValue === 'hc') {
            analysisPanel.state.chartStrategy.handleCalendarChangeFn(subMenuValue, analysisPanel);
          }
          break;
          }
      }
    },
    handleCarbonConfigBtnItemTouchTap(analysisPanel, menuParam, menuItem) {
      let itemValue = menuItem.props.value;
      switch (itemValue) {
        case 'background':{
          var subMenuValue = menuParam.props.value;
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
      var index = 0;
      switch (analysisPanel.state.energyType) {
        case "Energy":
          index = 0;
          break;
        case "Cost":
          index = 1;
          break;
        case "Carbon":
          index = 2;
          break;
      }
      let types = [{
        text: I18N.EM.KpiModeEM,
        value: 'Energy'
      },
        {
          text: I18N.EM.KpiModeCost,
          value: 'Cost'
        },
        {
          text: I18N.EM.KpiModeCarbon,
          value: 'Carbon'
        }];
      return <DropDownMenu selectedIndex={index} menuItems={types} style={{
          width: '92px',
          marginRight: '10px'
        }} onChange={analysisPanel.state.chartStrategy.onEnergyTypeChangeFn.bind(analysisPanel, analysisPanel)}></DropDownMenu>;
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
    onEnergyTypeChange(analysisPanel, e, selectedIndex, menuItem) {
      if (analysisPanel.props.onEnergyTypeChange) {
        let menuItemVal = menuItem.value;
        let capMenuItemVal = menuItemVal[0].toUpperCase() + menuItemVal.substring(1);
        let chartSttg = ChartStrategyFactor.getStrategyByStoreType(capMenuItemVal);
        if (analysisPanel) analysisPanel.setState({
            chartStrategy: chartSttg
          });
        analysisPanel.props.onEnergyTypeChange(menuItem.value);
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
    getCostInitialState() {
      let state = {
        touBtnStatus: CommodityStore.getECButtonStatus(),
        touBtnSelected: false,
        calendarType: "",
      };
      return state;
    },
    getUnitEnergyInitialState() {
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
        kpiTypeIndex: 0,
        labelDisable: true,
        kpiTypeDisable: false,
        month: curMonth + 1,
        benchmarkOption: null
      };
      return state;
    }
  },
  onSearchDataButtonClickFnStrategy: {
    onSearchDataButtonClick(analysisPanel, invokeFromMultiTime) { //invokeFromMultiTime 来判断是不是点击多时间段的绘制按钮进行查看。
      analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);
      let dateSelector = analysisPanel.refs.dateTimeSelector;
      let dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end;
      // deal with multi time submit
      if (!!invokeFromMultiTime) {
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
        if (timeRanges !== null) {
          let multiRelativeType = MultipleTimespanStore.getOriginalType();
          let relativeDateValue = analysisPanel._getRelativeDateValue();
          if (multiRelativeType !== 'Customerize' && multiRelativeType === relativeDateValue) {

          } else {
            MultipleTimespanStore.initData(relativeDateValue, startDate, endDate);
          }
        }
      }


      let clearWeatherflag = false,
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
        analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, relativeDateValue, analysisPanel);
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
      if (!hierCommIds.communityIds || hierCommIds.communityIds.length === 0 || !hierCommIds.hierarchyId) {
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
        analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, hierCommIds.hierarchyId, hierCommIds.communityIds, dest, relativeDateValue, analysisPanel);
      } else if (chartType === 'pie') {
        let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
        let viewOption = {
          DataUsageType: 4,
          IncludeNavigatorData: false,
          TimeRanges: timeRanges,
          Step: 2
        };
        //analysisPanel.state.chartStrategy.getPieEnergyDataFn(timeRanges, 2, nodeOptions, relativeDateValue);
        analysisPanel.state.chartStrategy.getPieEnergyDataFn(hierCommIds.hierarchyId, hierCommIds.communityIds, dest, viewOption, relativeDateValue, analysisPanel);
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

      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, ratioType, relativeDateValue, analysisPanel);
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
      if (!hierCommIds.communityIds || hierCommIds.communityIds.length === 0 || !hierCommIds.hierarchyId) {
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
        hierCommIds.communityIds, dest, unitType, relativeDateValue, analysisPanel);
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
      ChartStatusAction.clearStatus();
      if (analysisPanel.state.chartStrategy.canShareDataWithFn(curChartType, nextChartType) && !!analysisPanel.state.energyData) {
        analysisPanel.setState({
          selectedChartType: nextChartType
        });
      } else { //if(nextChartType === 'pie'){
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
      ChartStatusAction.clearStatus();
      if (analysisPanel.state.chartStrategy.canShareDataWithFn(curChartType, nextChartType) && !!analysisPanel.state.energyData) {
        analysisPanel.setState({
          selectedChartType: nextChartType
        });
      } else { //if(nextChartType === 'pie'){
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
      let timeRanges, weather;
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
      if (stepList.indexOf(step) == -1) {
        step = limitInterval.display;
      }
      if (ratioType == 1 && (step == 0 || step == 1))
        step = 2;
      if (ratioType == 2 && (step == 0 || step == 1 || step == 2))
        step = 3;
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

      return <div className={'jazz-alarm-chart-toolbar'}>
       <div className={'jazz-full-border-dropdownmenu-container'} >
         {chartTypeCmp}
         <DropDownMenu menuItems={ConstStore.getSearchDate()} ref='relativeDate' style={{
          width: '92px'
        }} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
       </div>
       <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
       <div className={'jazz-flat-button'}>
         {searchButton}
       </div>
     </div>;
    },
    CostSearchBarGen(analysisPanel) {
      var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
      var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel);

      return <div className={'jazz-alarm-chart-toolbar'}>
      <div className={'jazz-full-border-dropdownmenu-container'} >
        {chartTypeCmp}
        <DropDownMenu menuItems={ConstStore.getSearchDate()} ref='relativeDate' style={{
          width: '92px'
        }} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
      </div>
      <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
      <div className={'jazz-flat-button'}>
        {searchButton}
      </div>
    </div>;
    },
    carbonSearchBarGen(analysisPanel) {
      var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
      var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel, ['line', 'column', 'stack', 'pie']);

      return <div className={'jazz-alarm-chart-toolbar'}>
      <div className={'jazz-full-border-dropdownmenu-container'} >
        {chartTypeCmp}
        <DropDownMenu menuItems={ConstStore.getSearchDate()} ref='relativeDate' style={{
          width: '92px'
        }} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
      </div>
      <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
      <div className={'jazz-flat-button'}>
        {searchButton}
      </div>
  </div>;
    },
    unitEnergySearchBarGen(analysisPanel) {
      var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
      var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel, ['line', 'column']);
      return <div className={'jazz-alarm-chart-toolbar'}>
       <div className={'jazz-full-border-dropdownmenu-container'}>
         {chartTypeCmp}
         <DropDownMenu menuItems={ConstStore.getSearchDate()} ref='relativeDate' style={{
          width: '92px'
        }} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
       </div>
       <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
       <div className={'jazz-full-border-dropdownmenu-container'} >
         <DropDownMenu ref='unitTypeCombo' menuItems={ConstStore.getUnits()} style={{
          width: '102px',
          marginRight: '10px'
        }} onChange={(e, selectedIndex, menuItem) => {
          analysisPanel.setState({
            unitType: menuItem.value
          });
        }}></DropDownMenu>
       </div>
       <div className={'jazz-flat-button'}>
         {searchButton}
       </div>
   </div>;
    },
    ratioUsageSearchBarGen(analysisPanel) {
      var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
      var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel, ['line', 'column']);
      var ratios = [{
        text: I18N.EM.DayNightRatio,
        name: 'RationDayNight',
        value: 1
      }, {
        text: I18N.EM.WorkHolidayRatio,
        name: 'RationWorkday',
        value: 2
      }];
      return <div className={'jazz-alarm-chart-toolbar'}>
       <div className={'jazz-full-border-dropdownmenu-container'}>
         {chartTypeCmp}
         <DropDownMenu menuItems={ConstStore.getSearchDate()} ref='relativeDate' style={{
          width: '92px'
        }} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
       </div>
       <DateTimeSelector ref='dateTimeSelector' showTime={false} _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
       <div className={'jazz-full-border-dropdownmenu-container'} >
         <DropDownMenu ref='ratioTypeCombo' menuItems={ratios} style={{
          width: '102px',
          marginRight: '10px'
        }} onChange={(e, selectedIndex, menuItem) => {
          analysisPanel.setState({
            ratioType: menuItem.value
          });
        }}></DropDownMenu>
       </div>
       <div className={'jazz-flat-button'}>
         {searchButton}
       </div>
   </div>;
    },
    rankSearchBarGen(analysisPanel) {
      var rankTypeItem = ConstStore.getRankTypeItem();
      var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
      return <div className={'jazz-alarm-chart-toolbar'}>
      <div className={'jazz-full-border-dropdownmenu-container'}>
        {chartTypeCmp}
        <DropDownMenu menuItems={ConstStore.getSearchDate()} ref='relativeDate' style={{
          width: '92px'
        }} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
      </div>
      <DateTimeSelector ref='dateTimeSelector' showTime={false} _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
      <div className={'jazz-full-border-dropdownmenu-container'} >
        <DropDownMenu menuItems={rankTypeItem} ref='rankType' style={{
          width: '140px'
        }} onChange={analysisPanel._onRankTypeChange}></DropDownMenu>
      </div>
      <div className={'jazz-flat-button'}>
        <RaisedButton style={{
          marginLeft: '10px'
        }} label={I18N.Common.Button.Show} onClick={analysisPanel.onSearchDataButtonClick}></RaisedButton>
      </div>
    </div>;
    },
    labelSearchBarGen(analysisPanel) {
      var curYear = (new Date()).getFullYear();
      var yearProps = {
        ref: "yearSelector",
        selectedIndex: 10,
        style: {
          border: '1px solid #efefef',
          margin: '0px 10px 0px 0px'
        }
      };
      var YearSelect = <YearPicker {...yearProps}/>;
      var labelBtn = ChartStrategyFactor.getLabelBtn(analysisPanel);
      var kpiTypeBtn = ChartStrategyFactor.getKpiTypeBtn(analysisPanel);
      var monthItem = ConstStore.getLabelMonth();
      return <div className={'jazz-alarm-chart-toolbar'}>
      <div className={'jazz-full-border-dropdownmenu-container'}>
      {YearSelect}
      <DropDownMenu menuItems={monthItem} selectedIndex={analysisPanel.state.month} onChange={analysisPanel._onChangeMonth} ref='monthSelector'></DropDownMenu>
      </div>
      <div className={'jazz-full-border-dropdownmenu-container'} >
      {labelBtn}
    </div>

      <div className={'jazz-full-border-dropdownmenu-container'} >
        {kpiTypeBtn}
      </div>
      <div className={'jazz-flat-button'}>
        <RaisedButton style={{
          marginLeft: '10px'
        }} label={I18N.Common.Button.Show} onClick={analysisPanel.onSearchDataButtonClick}></RaisedButton>
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
        communityIds: commIds
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
          'flex-direction': 'column',
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
          'flex-direction': 'column',
          marginBottom: '20px'
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
        'flex-direction': 'column',
        marginBottom: '20px'
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
        'flex-direction': 'column',
        marginBottom: '20px'
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
        'flex-direction': 'column',
        marginBottom: '20px'
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
        'flex-direction': 'column',
        marginBottom: '20px'
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
        'flex-direction': 'column',
        marginBottom: '20px'
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
        'flex-direction': 'column',
        marginBottom: '20px'
      }}>
                     <div style={{
        display: 'flex'
      }}>
                       <div style={{
        margin: '5px 30px 5px auto'
      }}>
                         <div style={{
        display: 'inline-block',
        marginLeft: '30px'
      }}>{clearChartBtnEl}</div>
                       </div>
                     </div>;
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
      let submitParams = EnergyStore.getSubmitParams();
      let viewOp = submitParams.viewOption;
      if (viewOp && viewOp.IncludeTempValue)
        weatherSubItems[0].checked = true;
      if (viewOp && viewOp.IncludeHumidityValue)
        weatherSubItems[1].checked = true;
      let weatherEl;
      let isWeatherDisabled = analysisPanel.state.chartStrategy.isWeatherDisabledFn();
      if (isWeatherDisabled === false) {
        weatherEl = <ExtendableMenuItem primaryText={I18N.EM.Tool.Weather.WeatherInfo} value='weather' subItems={weatherSubItems}/>;
      } else {
        weatherEl = <ExtendableMenuItem primaryText={I18N.EM.Tool.Weather.WeatherInfo} value='weather' disabled={true} tooltip={isWeatherDisabled} />;
      }
      let configButton = <ButtonMenu label={I18N.EM.Tool.AssistCompare} style={{
        marginLeft: '10px'
      }} desktop={true}
      onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       <MenuItem primaryText={I18N.EM.Tool.HistoryCompare} value='history' disabled={analysisPanel.state.baselineBtnStatus}/>
       <MenuItem primaryText={I18N.EM.Tool.BenchmarkSetting} value='config' disabled={analysisPanel.state.baselineBtnStatus}/>
       <MenuDivider />
       <MenuItem primaryText={I18N.EM.Tool.DataSum} value='sum' disabled={analysisPanel.state.sumBtnStatus}/>
       {calendarEl}
       {weatherEl}
     </ButtonMenu>;

      return configButton;
    },
    getCarbonAuxiliaryCompareBtn(analysisPanel) {
      let calendarEl = analysisPanel.getCalenderBgBtnEl();
      let configButton = <ButtonMenu label={I18N.EM.Tool.AssistCompare} style={{
        marginLeft: '10px'
      }} desktop={true}
      onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       {calendarEl}
     </ButtonMenu>;

      return configButton;
    },
    getRatioAuxiliaryCompareBtn(analysisPanel) {
      let calendarEl = analysisPanel.getCalenderBgBtnEl();
      let tagOptions = RatioStore.getRatioOpions();
      let benchmarks = CommonFuns.filterBenchmarksByTagOptions(tagOptions);

      let configButton = <ButtonMenu label={I18N.EM.Tool.AssistCompare} style={{
        marginLeft: '10px'
      }} desktop={true}
      onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       {calendarEl}
       <ExtendableMenuItem primaryText={I18N.EM.Tool.Benchmark} value='benchmark' subItems={benchmarks} disabled={!benchmarks}/>
       </ButtonMenu>;
      return configButton;
    },
    getUnitEnergyAuxiliaryCompareBtn(analysisPanel) {
      let calendarEl = analysisPanel.getCalenderBgBtnEl();
      let tagOptions = EnergyStore.getTagOpions();
      let benchmarks = CommonFuns.filterBenchmarksByTagOptions(tagOptions);

      let configButton = <ButtonMenu label={I18N.EM.Tool.AssistCompare} style={{
        marginLeft: '10px'
      }} desktop={true}
      onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       {calendarEl}
       <ExtendableMenuItem primaryText={I18N.EM.Tool.Benchmark} value='benchmark' subItems={benchmarks} disabled={!benchmarks}/>
       </ButtonMenu>;
      return configButton;
    },
    getUnitCostAuxiliaryCompareBtn(analysisPanel) {
      let calendarEl = analysisPanel.getCalenderBgBtnEl();
      let tagOptions = CostStore.getSelectedList();
      let benchmarks = CommonFuns.filterBenchmarksByCostSelectedList(tagOptions);
      let configButton = <ButtonMenu label={I18N.EM.Tool.AssistCompare} style={{
        marginLeft: '10px'
      }} desktop={true}
      onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       {calendarEl}
       <ExtendableMenuItem primaryText={I18N.EM.Tool.Benchmark} value='benchmark' subItems={benchmarks} disabled={analysisPanel.state.baselineBtnStatus}/>
       </ButtonMenu>;
      return configButton;
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
      }} desktop={true}
      onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       {calendarEl}
       <ExtendableMenuItem primaryText={I18N.EM.Tool.Benchmark} value='benchmark' subItems={benchmarks} disabled={analysisPanel.state.baselineBtnStatus}/>
       </ButtonMenu>;
      return configButton;
    },
    getCostAuxiliaryCompareBtn(analysisPanel) {
      let calendarEl = analysisPanel.getCalenderBgBtnEl();
      let configButton = <ButtonMenu label={I18N.EM.Tool.AssistCompare} style={{
        marginLeft: '10px'
      }} desktop={true}
      onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       <MenuItem primaryText={I18N.EM.ByPeakValley} value='touCompare' checked={analysisPanel.state.touBtnSelected} disabled={analysisPanel.state.touBtnStatus}/>
       {calendarEl}
     </ButtonMenu>;

      return configButton;
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
      TagStore.addBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
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
      TagStore.removeBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
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
      analysisPanel.state.energyData = null;
      analysisPanel.state.energyRawData = null;
      AlarmTagAction.clearSearchTagList();
      EnergyStore.clearEnergyStore();
      analysisPanel.state.selectedChartType = 'line';
      analysisPanel.state.sumBtnStatus = false;
      analysisPanel.state.step = null;
      analysisPanel.state.weatherOption = null;
      analysisPanel.forceUpdate();
    },
    clearCarbonChartData(analysisPanel) {
      analysisPanel.state.energyData = null;
      analysisPanel.state.energyRawData = null;
      CommodityAction.clearCommodity();
      CarbonStore.clearCarbonStore();
      analysisPanel.state.selectedChartType = 'line';
      analysisPanel.state.destination = 2;
      analysisPanel.state.step = null;
      analysisPanel.forceUpdate();
    },
    clearCostChartData(analysisPanel) {
      analysisPanel.state.energyData = null;
      analysisPanel.state.energyRawData = null;
      CommodityAction.clearCommodity();
      CostStore.clearCostStore();
      analysisPanel.state.selectedChartType = 'line';
      analysisPanel._onTouBtnDisabled();
      analysisPanel.state.step = null;
      analysisPanel.forceUpdate();
    },
    clearUnitChartData(analysisPanel) {
      analysisPanel.state.energyData = null;
      analysisPanel.state.energyRawData = null;
      AlarmTagAction.clearSearchTagList();
      EnergyStore.clearEnergyStore();
      analysisPanel.state.selectedChartType = 'line';
      analysisPanel.state.step = null;
      analysisPanel.state.benchmarkOption = null;
      analysisPanel.state.benchmarks = null;
      analysisPanel.forceUpdate();
    },
    clearUnitCostChartData(analysisPanel) {
      analysisPanel.state.energyData = null;
      analysisPanel.state.energyRawData = null;
      CommodityAction.clearCommodity();
      CostStore.clearCostStore();
      analysisPanel.state.selectedChartType = 'line';
      analysisPanel._onUnitCostBaselineBtnDisabled();
      analysisPanel.state.step = null;
      analysisPanel.state.benchmarkOption = null;
      analysisPanel.state.benchmarks = null;
      analysisPanel.forceUpdate();
    },
    clearUnitCarbonChartData(analysisPanel) {
      analysisPanel.state.energyData = null;
      analysisPanel.state.energyRawData = null;
      CommodityAction.clearCommodity();
      analysisPanel.state.selectedChartType = 'line';
      analysisPanel.state.destination = 2;
      analysisPanel.state.benchmarkOption = null;
      analysisPanel.state.benchmarks = null;
      analysisPanel.forceUpdate();
    },
    clearRatioChartData(analysisPanel) {
      analysisPanel.state.energyData = null;
      analysisPanel.state.energyRawData = null;
      AlarmTagAction.clearSearchTagList();
      analysisPanel.state.selectedChartType = 'line';
      analysisPanel.state.step = null;
      analysisPanel.state.benchmarkOption = null;
      analysisPanel.state.benchmarks = null;
      analysisPanel.forceUpdate();
    },
    clearLabelChartData(analysisPanel) {
      analysisPanel.state.energyData = null;
      analysisPanel.state.energyRawData = null;
      AlarmTagAction.clearSearchTagList();
      LabelStore.clearLabelStore();
      analysisPanel.state.selectedChartType = 'line';
      analysisPanel.state.weatherOption = null;
      analysisPanel.forceUpdate();
    },
    clearRankChartData(analysisPanel) {
      analysisPanel.state.energyData = null;
      analysisPanel.state.energyRawData = null;
      CommodityAction.clearRankingCommodity();
      AlarmTagStore.clearSearchTagList();
      RankStore.clearRankStore();
      analysisPanel.state.selectedChartType = 'column';
      analysisPanel.forceUpdate();
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

      path = '/Energy.svc/GetTagsData4Export';
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions);
      params.nodeNameAssociation = nodeNameAssociation;

      let charTypes = [];
      if (chartType !== 'rawdata') {
        let seriesNumber = EnergyStore.getEnergyData().get('Data').size;
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
                curChartType = null;
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
      let path = '/Energy.svc/GetCostData4Export';
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
        commodityIds: commodityIds,
        viewOption: viewOption,
        viewAssociation: viewAssociation,
        nodeNameAssociation: nodeNameAssociation
      };

      let charTypes = [];

      let seriesNumber = CostStore.getEnergyData().get('Data').size;
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
              curChartType = null;
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
      let path = '/Energy.svc/GetCarbonUsageData4Export';
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

      let seriesNumber = CarbonStore.getCarbonData().get('Data').size;
      let charTypes = [];
      for (let i = 0; i < seriesNumber; i++) {
        charTypes.push(chartType); //暂且全部用chartType，以后可以修改每个series type之后要做更改
      }
      params.charTypes = charTypes;
      ExportChartAction.getTagsData4Export(params, path);
    },
    exportChart4UnitEnergy(analysisPanel) {
      if (!analysisPanel.state.energyData) {
        return;
      }
      let path = '/Energy.svc/GetEnergyUsageUnitData4Export';
      let chartType = analysisPanel.state.selectedChartType;
      let tagOptions = EnergyStore.getTagOpions();
      let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
      let submitParams = EnergyStore.getSubmitParams();
      let benchmarkOption = submitParams.benchmarkOption;
      let viewOption = submitParams.viewOption;
      let title = analysisPanel.props.chartTitle || I18N.Folder.NewWidget.Menu1;
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions);
      let params = {
        title: title,
        tagIds: tagIds,
        viewOption: viewOption,
        nodeNameAssociation: nodeNameAssociation,
        benchmarkOption: benchmarkOption
      };

      let seriesNumber = EnergyStore.getEnergyData().get('Data').size;
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
              curChartType = null;
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
      let path = '/Energy.svc/RatioGetTagsData4Export';
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
      let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions);
      let params = {
        ratioType: ratioType,
        title: title,
        tagIds: tagIds,
        viewOption: viewOption,
        nodeNameAssociation: nodeNameAssociation,
        benchmarkOption: benchmarkOption
      };

      let seriesNumber = RatioStore.getEnergyData().get('Data').size;
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
      let path = '/Energy.svc/GetCostUnitData4Export';
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

      let seriesNumber = EnergyStore.getEnergyData().get('Data').size;
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
              curChartType = null;
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
      let path = '/Energy.svc/GetCarbonUsageUnitData4Export';
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
      if (benchmarkOption == undefined)
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

      let seriesNumber = CarbonStore.getCarbonData().get('Data').size;
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
      let widgetWd = <WidgetSaveWindow ref={'saveChartDialog'}  onWidgetSaveWindowDismiss={analysisPanel.onWidgetSaveWindowDismiss} chartTitle={analysisPanel.props.chartTitle}
      tagOption={analysisPanel.state.tagOption} contentSyntax={analysisPanel.state.contentSyntax}></WidgetSaveWindow>;
      return widgetWd
    }
  },
  getChartTypeIconMenu(analysisPanel, types) {
    let menuMap = {
      line: {
        primaryText: I18N.EM.CharType.Line,
        icon: <FontIcon className="icon-line" />
      },
      column: {
        primaryText: I18N.EM.CharType.Bar,
        icon: <FontIcon className="icon-column" />
      },
      stack: {
        primaryText: I18N.EM.CharType.Stack,
        icon: <FontIcon className="icon-stack" />
      },
      pie: {
        primaryText: I18N.EM.CharType.Pie,
        icon: <FontIcon className="icon-pie" />
      },
      rawdata: {
        primaryText: I18N.EM.CharType.RawData,
        icon: <FontIcon className="icon-raw-data" />
      }
    };
    let chartType = analysisPanel.state.selectedChartType || 'line';
    let mainIcon = menuMap[chartType].icon;
    let IconButtonElement = mainIcon;
    let iconMenuProps = {
      iconButtonElement: IconButtonElement,
      openDirection: "bottom-right",
      desktop: true,
      onItemTouchTap: analysisPanel._onSearchBtnItemTouchTap
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
    var btn = <RaisedButton label={I18N.EM.Tool.ClearChart} onClick={analysisPanel.state.chartStrategy.clearChartDataFn.bind(analysisPanel, analysisPanel)}/>;
    return btn;
  },
  getSearchBtn(analysisPanel) {
    var searchButton = <RaisedButton label={I18N.Common.Button.Show} onClick={analysisPanel.onSearchDataButtonClick}/>;
    return searchButton;
  },
  getLabelBtn(analysisPanel) {
    var industySubItems = analysisPanel.state.industyMenuItems;
    var customizedSubItems = analysisPanel.state.customerMenuItems;
    let labelButton = <ButtonMenu label={analysisPanel.state.selectedLabelItem.text} style={{
      marginLeft: '10px',
      fontSize: '14px',
      width: '140px'
    }} desktop={true}
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
      width: '128px',
      height: '32px',
      lineHeight: '32px',
      border: '1px solid #efefef',
      margin: '0px 0px 0px 10px',
      fontSize: '15px',
      color: '#b3b3b3',
      textAlign: 'center'
    };
    var kpiTypeItem = ConstStore.getKpiTypeItem();

    if (!analysisPanel.state.kpiTypeDisable) {
      kpiTypeButton = <DropDownMenu style={{
        marginLeft: '10px'
      }} selectedIndex={analysisPanel.state.kpiTypeIndex} menuItems={kpiTypeItem} ref='kpiType' onChange={analysisPanel.onChangeKpiType}></DropDownMenu>;
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
