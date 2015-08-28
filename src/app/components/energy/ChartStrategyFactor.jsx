'use strict';
import React from "react";
import assign from "object-assign";
import _ from 'lodash';
import {FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress, IconMenu} from 'material-ui';
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
import ExportChartAction from '../../actions/ExportChartAction.jsx';
import CommodityAction from '../../actions/CommodityAction.jsx';
import YaxisSelector from './YaxisSelector.jsx';
import StepSelector from './StepSelector.jsx';
import ChartComponentBox from './ChartComponentBox.jsx';
import LabelChartComponent from './LabelChartComponent.jsx';
import GridComponent from './GridComponent.jsx';
import EnergyStore from '../../stores/energy/EnergyStore.jsx';
import CostStore from '../../stores/CostStore.jsx';
import CarbonStore from '../../stores/CarbonStore.jsx';
import LabelStore from '../../stores/LabelStore.jsx';
import RatioStore from '../../stores/RatioStore.jsx';
import LabelMenuStore from '../../stores/LabelMenuStore.jsx';
import RankStore from '../../stores/RankStore.jsx';
import CommodityStore from '../../stores/CommodityStore.jsx';
import TagStore from '../../stores/TagStore.jsx';
import AddIntervalWindow from './energy/AddIntervalWindow.jsx';
import MultipleTimespanStore from '../../stores/energy/MultipleTimespanStore.jsx';
import MultiTimespanAction from '../../actions/MultiTimespanAction.jsx';

let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');

const searchDate = [{value:'Customerize',text:'自定义'},{value: 'Last7Day', text: '最近7天'}, {value: 'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
 {value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'}, {value: 'LastWeek', text: '上周'},
 {value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];
const carbonTypeItem = [{value:2,text:'标煤'},{value:3,text:'二氧化碳'},{value:4,text:'树'}];
const units = [{text: '单位人口', name:'UnitPopulation', value: 2}, {text:'单位面积',name:'UnitArea', value: 3},{text:'单位供冷面积',name:'UnitColdArea', value: 4},
              {text:'单位采暖面积',name:'UnitWarmArea', value: 5},{text:'单位客房',name:'UnitRoom', value: 7},{text:'单位已用客房',name:'UnitUsedRoom', value: 8},
              {text:'单位床位',name:'UnitBed', value: 9},{text:'单位已用床位',name:'UnitUsedBed', value: 10}];



let ChartStrategyFactor = {
  defaultStrategy: {

  },
  strategyConfiguration: {
    Energy: {
      searchBarGenFn:'energySearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn:'getSelectedTagList',
      onSearchDataButtonClickFn:'onSearchDataButtonClick',
      onSearchBtnItemTouchTapFn:'onSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn:'initEnergyStoreByBizChartType',
      setFitStepAndGetDataFn:'setFitStepAndGetData',
      getInitialStateFn:'getEnergyInitialState',
      getAllDataFn: 'empty',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn:'energyDataLoad',
      getPieEnergyDataFn:'pieEnergyDataLoad',
      getChartComponentFn:'getEnergyChartComponent',
      bindStoreListenersFn:'energyBindStoreListeners',
      unbindStoreListenersFn:'energyUnbindStoreListeners',
      canShareDataWithFn:'canShareDataWith',
      getEnergyRawDataFn:'getEnergyRawData',
      exportChartFn:'exportChart',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getChartSubToolbarFn:'getEnergySubToolbar',
      getAuxiliaryCompareBtnFn:'getEnergyAuxiliaryCompareBtn',
      handleConfigBtnItemTouchTapFn:'handleEnergyConfigBtnItemTouchTap',
      handleStepChangeFn:'handleEnergyStepChange'
    },
    Cost: {
      searchBarGenFn: 'CostSearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn: 'getCostSelectedTagList',
      onSearchDataButtonClickFn:'onCostSearchDataButtonClick',
      onSearchBtnItemTouchTapFn:'onSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn:'initCostStoreByBizChartType',
      setFitStepAndGetDataFn:'setCostFitStepAndGetData',
      getInitialStateFn: 'getCostInitialState',
      getAllDataFn: 'empty',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn: 'costDataLoad',
      getPieEnergyDataFn:'pieCostDataLoad',
      getChartComponentFn:'getCostChartComponent',
      bindStoreListenersFn:'costBindStoreListeners',
      unbindStoreListenersFn:'costUnbindStoreListeners',
      canShareDataWithFn: 'canShareDataWith',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getChartSubToolbarFn:'getCostSubToolbar',
      getAuxiliaryCompareBtnFn:'getCostAuxiliaryCompareBtn',
      handleConfigBtnItemTouchTapFn:'handleCostConfigBtnItemTouchTap',
      handleStepChangeFn:'handleCostStepChange'
    },
    MultiIntervalDistribution:{

    },Carbon:{
      searchBarGenFn:'carbonSearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn:'getSelectedHierCommodityList',
      onSearchDataButtonClickFn:'onCarbonSearchDataButtonClick',
      onSearchBtnItemTouchTapFn:'onCarbonSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn:'initCarbonStoreByBizChartType',
      setFitStepAndGetDataFn:'setCarbonFitStepAndGetData',
      getInitialStateFn:'getCarbonInitialState',
      getEnergyDataFn:'carbonDataLoad',
      getPieEnergyDataFn:'pieCarbonDataLoad',
      getChartComponentFn:'getCarbonChartComponent',
      bindStoreListenersFn:'carbonBindStoreListeners',
      unbindStoreListenersFn:'carbonUnbindStoreListeners',
      canShareDataWithFn:'canShareDataWith',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getEnergyRawDataFn:'empty',
      getInitParamFn: 'getInitParam',
      getAllDataFn: 'empty',
      getChartSubToolbarFn:'getCarbonSubToolbar',
      getAuxiliaryCompareBtnFn:'getCarbonAuxiliaryCompareBtn',
      handleStepChangeFn:'handleCarbonStepChange',
    },RatioUsage:{
      searchBarGenFn:'ratioUsageSearchBarGen',
      getEnergyTypeComboFn: 'empty',
      getSelectedNodesFn:'getSelectedTagList',
      onSearchDataButtonClickFn:'onRatioSearchDataButtonClick',
      onSearchBtnItemTouchTapFn:'onSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn:'initEnergyStoreByBizChartType',
      setFitStepAndGetDataFn:'setRatioFitStepAndGetData',
      getInitialStateFn:'getRatioInitialState',
      getAllDataFn: 'unitGetAllData',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn:'ratioDataLoad',
      getChartComponentFn:'getRatioChartComponent',
      bindStoreListenersFn:'ratioBindStoreListeners',
      unbindStoreListenersFn:'ratioUnbindStoreListeners',
      canShareDataWithFn:'canShareDataWith',
      exportChartFn:'exportChart',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getAuxiliaryCompareBtnFn:'getRatioAuxiliaryCompareBtn',
      getChartSubToolbarFn:'getRatioSubToolbar',
      handleConfigBtnItemTouchTapFn:'handleUnitEnergyConfigBtnItemTouchTap',
      handleBenchmarkMenuItemClickFn:'handleUnitBenchmarkMenuItemClick',
      handleStepChangeFn:'handleRatioStepChange',
    },UnitEnergyUsage:{
      searchBarGenFn:'unitEnergySearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn:'getSelectedTagList',
      onSearchDataButtonClickFn:'onUnitEnergySearchDataButtonClick',
      onSearchBtnItemTouchTapFn:'onSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn:'initEnergyStoreByBizChartType',
      setFitStepAndGetDataFn:'setUnitEnergyFitStepAndGetData',
      getInitialStateFn:'getUnitEnergyInitialState',
      getAllDataFn: 'unitGetAllData',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn:'unitEnergyDataLoad',
      getChartComponentFn:'getUnitEnergyChartComponent',
      bindStoreListenersFn:'unitEnergyBindStoreListeners',
      unbindStoreListenersFn:'unitEnergyUnbindStoreListeners',
      canShareDataWithFn:'canShareDataWith',
      exportChartFn:'exportChart4UnitEnergy',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getAuxiliaryCompareBtnFn:'getUnitEnergyAuxiliaryCompareBtn',
      getChartSubToolbarFn:'getUnitEnergySubToolbar',
      handleConfigBtnItemTouchTapFn:'handleUnitEnergyConfigBtnItemTouchTap',
      handleBenchmarkMenuItemClickFn:'handleUnitBenchmarkMenuItemClick',
      handleStepChangeFn: 'handleUnitEnergyStepChange'
    },UnitCost:{
      searchBarGenFn:'unitEnergySearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn:'getCostSelectedTagList',
      onSearchDataButtonClickFn:'onUnitCostSearchDataButtonClick',
      onSearchBtnItemTouchTapFn:'onSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn:'initCostStoreByBizChartType',
      setFitStepAndGetDataFn:'setUnitEnergyFitStepAndGetData',
      getInitialStateFn:'getUnitEnergyInitialState',
      getAllDataFn: 'unitGetAllData',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn:'unitCostDataLoad',
      getChartComponentFn:'getUnitEnergyChartComponent',
      bindStoreListenersFn:'unitCostBindStoreListeners',
      unbindStoreListenersFn:'unitCostUnbindStoreListeners',
      canShareDataWithFn:'canShareDataWith',
      exportChartFn:'exportChart',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getAuxiliaryCompareBtnFn:'getUnitCostAuxiliaryCompareBtn',
      getChartSubToolbarFn:'getUnitCostSubToolbar',
      handleConfigBtnItemTouchTapFn:'handleUnitEnergyConfigBtnItemTouchTap',
      handleBenchmarkMenuItemClickFn:'handleUnitCostBenchmarkMenuItemClick',
      handleStepChangeFn:'handleUnitCostStepChange'
    }, UnitCarbon:{
      searchBarGenFn:'unitEnergySearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn:'getSelectedHierCommodityList',
      onSearchDataButtonClickFn:'onUnitCarbonSearchDataButtonClick',
      onSearchBtnItemTouchTapFn:'onSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn:'initCarbonStoreByBizChartType',
      setFitStepAndGetDataFn:'setUnitCarbonFitStepAndGetData',
      getInitialStateFn:'getUnitEnergyInitialState',
      getAllDataFn: 'unitGetAllData',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn:'unitCarbonDataLoad',
      getChartComponentFn:'getCarbonChartComponent',
      bindStoreListenersFn:'unitCarbonBindStoreListeners',
      unbindStoreListenersFn:'unitCarbonUnbindStoreListeners',
      canShareDataWithFn:'canShareDataWith',
      exportChartFn:'exportChart',
      onEnergyTypeChangeFn: 'onEnergyTypeChange',
      getAuxiliaryCompareBtnFn:'getUnitCarbonAuxiliaryCompareBtn',
      getChartSubToolbarFn:'getUnitCarbonSubToolbar',
      handleConfigBtnItemTouchTapFn:'handleUnitEnergyConfigBtnItemTouchTap',
      handleBenchmarkMenuItemClickFn:'handleUnitBenchmarkMenuItemClick',
      handleStepChangeFn:'handleRatioStepChange',
    }, Label:{
      searchBarGenFn:'labelSearchBarGen',
      getEnergyTypeComboFn: 'empty',
      getSelectedNodesFn:'getSelectedTagList',
      onSearchDataButtonClickFn:'onLabelSearchDataButtonClick',
      //setFitStepAndGetDataFn:'setLabelTypeAndGetData',
      getInitialStateFn:'getLabelInitialState',
      getAllDataFn: 'getAllData',
      getInitParamFn: 'empty',
      getEnergyDataFn: 'labelDataLoad',
      getChartComponentFn:'getLabelChartComponent',
      bindStoreListenersFn:'labelBindStoreListeners',
      unbindStoreListenersFn:'labelUnbindStoreListeners',
      canShareDataWithFn:'canRankShareDataWith',
      onEnergyTypeChangeFn:'empty',
      onHierNodeChangeFn:'onHierNodeChange'
    },Rank:{
      searchBarGenFn:'rankSearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn:'getRankSelectedTagList',
      onSearchDataButtonClickFn:'onRankSearchDataButtonClick',
      setFitStepAndGetDataFn:'setRankTypeAndGetData',
      getInitialStateFn:'getRankInitialState',
      getAllDataFn: 'empty',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn: 'rankDataLoad',
      getChartComponentFn:'getRankChartComponent',
      bindStoreListenersFn:'rankBindStoreListeners',
      unbindStoreListenersFn:'rankUnbindStoreListeners',
      canShareDataWithFn:'canRankShareDataWith',
      onEnergyTypeChangeFn:'onEnergyTypeChange',
      getChartSubToolbarFn:'getRankSubToolbar',
    }
 },
 handleStepChangeFnStrategy:{
   handleEnergyStepChange(analysisPanel, step){
     let tagOptions = EnergyStore.getTagOpions(),
         paramsObj = EnergyStore.getParamsObj(),
         timeRanges = paramsObj.timeRanges;

     analysisPanel.setState({step:step});
     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false);
   },
   handleCostStepChange(analysisPanel, step){
     let tagOptions = CostStore.getSelectedList(),
         paramsObj = CostStore.getParamsObj(),
         timeRanges = paramsObj.timeRanges;

     analysisPanel.setState({step:step});
     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false, analysisPanel);
   },
   handleCarbonStepChange(analysisPanel, step){
     let paramsObj = CarbonStore.getSubmitParams();
     let hierarchyId = paramsObj.hierarchyId, commodityIds=paramsObj.commodityIds,
        destination = paramsObj.destination, viewOp = paramsObj.viewOption;
        viewOp.Step = step;

     analysisPanel.setState({step:step});
     analysisPanel.state.chartStrategy.getEnergyDataFn(hierarchyId, commodityIds, destination, viewOp, false, analysisPanel);
   },
   handleUnitEnergyStepChange(analysisPanel, step){
     let tagOptions = EnergyStore.getTagOpions(),
         paramsObj = EnergyStore.getParamsObj(),
         timeRanges = paramsObj.timeRanges,
         submitParams = EnergyStore.getSubmitParams(),
         benchmarkOption = submitParams.benchmarkOption,
         unitType = submitParams.viewOption.DataOption.UnitType;

     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, unitType, false, benchmarkOption);
     analysisPanel.setState({step:step});
   },
   handleUnitCostStepChange(analysisPanel, step){
     let tagOptions = CostStore.getSelectedList(),
         paramsObj = CostStore.getParamsObj(),
         timeRanges = paramsObj.timeRanges,
         submitParams = CostStore.getSubmitParams(),
         benchmarkOption = submitParams.benchmarkOption,
         unitType = submitParams.viewOption.DataOption.UnitType;

     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, unitType, false, benchmarkOption);
     analysisPanel.setState({step:step});
   },
   handleUnitCarbonStepChange(analysisPanel, step){
     let paramsObj = CarbonStore.getSubmitParams();
     let hierarchyId = paramsObj.hierarchyId, commodityIds=paramsObj.commodityIds,
        destination = paramsObj.destination, viewOp = paramsObj.viewOption;
        viewOp.Step = step, benchmarkOption = paramsObj.benchmarkOption;

     analysisPanel.setState({step:step});
     analysisPanel.state.chartStrategy.getEnergyDataFn(hierarchyId, commodityIds, destination, viewOp, false, benchmarkOption);
   },
 },
 handleBenchmarkMenuItemClickFnStrategy:{
   handleUnitBenchmarkMenuItemClick(analysisPanel,benchmarkOption){
     let tagOptions = EnergyStore.getTagOpions(),
         paramsObj = EnergyStore.getParamsObj(),
         timeRanges = paramsObj.timeRanges,
         step = paramsObj.step,
         unitType = EnergyStore.getSubmitParams().viewOption.DataOption.UnitType;
     if(benchmarkOption.IndustryId === -1){
       benchmarkOption = null;
     }
     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, unitType, false, benchmarkOption);
   },
   handleUnitCostBenchmarkMenuItemClick(analysisPanel,benchmarkOption){
     let tagOptions = CostStore.getSelectedList(),
         paramsObj = CostStore.getParamsObj(),
         timeRanges = paramsObj.timeRanges,
         step = paramsObj.step,
         unitType = CostStore.getSubmitParams().viewOption.DataOption.UnitType;
     if(benchmarkOption.IndustryId === -1){
       benchmarkOption = null;
     }
     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, unitType, false, benchmarkOption);
   },
   handleUnitCarbonBenchmarkMenuItemClick(analysisPanel,benchmarkOption){
     let paramsObj = CarbonStore.getSubmitParams();
     let hierarchyId = paramsObj.hierarchyId, commodityIds=paramsObj.commodityIds,
        destination = paramsObj.destination, viewOp = paramsObj.viewOption;
      if(benchmarkOption.IndustryId === -1){
        benchmarkOption = null;
      }
     analysisPanel.state.chartStrategy.getEnergyDataFn(hierarchyId, commodityIds, destination, viewOp, false, benchmarkOption);
   },
   handleRatioBenchmarkMenuItemClick(analysisPanel,benchmarkOption){
     let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
         step = analysisPanel.state.step,
         limitInterval = CommonFuns.getLimitInterval(timeRanges),
         stepList = limitInterval.stepList;
     if( stepList.indexOf(step) == -1){
       step = limitInterval.display;
     }
     let viewOp = {
        DataUsageType: 4,
        IncludeNavigatorData: true,
        TimeRanges: timeRanges,
        Step: step,
     };
     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, hierId, commIds, dest, viewOptions, false, benchmarkOption);
   },
 },
 getChartSubToolbarFnStrategy:{
   getEnergySubToolbar(analysisPanel){
     var toolElement;
     let chartType = analysisPanel.state.selectedChartType;
     let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel,['line','column','stack','pie','rawdata']);
     let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);
     if(chartType === 'line' || chartType === 'column' || chartType === 'stack'){
       toolElement =
           <div style={{display:'flex'}}>
             <div style={{margin:'10px 0 0 23px'}}>{chartTypeIconMenu}</div>
             <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog}/>
             <StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
             <div style={{margin:'5px 30px 5px auto'}}>
               {configBtn}
               <div style={{display:'inline-block', marginLeft:'30px'}}>清空图标</div>
             </div>
             <BaselineCfg  ref="baselineCfg"/>
           </div>;
     }else if( chartType === 'rawdata'){
       toolElement =
           <div style={{display:'flex'}}>
             <div style={{margin:'10px 0 0 23px'}}>{chartTypeIconMenu}</div>
             <div style={{margin:'5px 30px 5px auto'}}>
               {configBtn}
               <div style={{display:'inline-block', marginLeft:'30px'}}>清空图标</div>
             </div>
             <BaselineCfg  ref="baselineCfg"/>
           </div>;
     }else if(chartType === 'pie'){
       toolElement =
           <div style={{display:'flex'}}>
             <div style={{margin:'10px 0 0 23px'}}>{chartTypeIconMenu}</div>
             <div style={{margin:'5px 30px 5px auto'}}>
               {configBtn}
               <div style={{display:'inline-block', marginLeft:'30px'}}>清空图标</div>
             </div>
             <BaselineCfg  ref="baselineCfg"/>
           </div>;
     }
     return toolElement;
   },
   getCostSubToolbar(analysisPanel){
     var toolElement;
     let chartType = analysisPanel.state.selectedChartType;
     let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel,['line','column','stack','pie']);
     let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);

     if(chartType === 'line' || chartType === 'column' || chartType === 'stack'){
       toolElement =
           <div style={{display:'flex'}}>
             <div style={{margin:'10px 0 0 23px'}}>{chartTypeIconMenu}</div>
             <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog}/>
             <StepSelector minStep={1} stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
             <div style={{margin:'5px 30px 5px auto'}}>
               {configBtn}
               <div style={{display:'inline-block', marginLeft:'30px'}}>清空图表</div>
             </div>
           </div>;
     }else if(chartType === 'pie'){
       toolElement =
           <div style={{display:'flex'}}>
             <div style={{margin:'10px 0 0 23px'}}>{chartTypeIconMenu}</div>
             <div style={{margin:'5px 30px 5px auto'}}>
               {configBtn}
               <div style={{display:'inline-block', marginLeft:'30px'}}>清空图表</div>
             </div>
           </div>;
     }
     return toolElement;
   },
   getCarbonSubToolbar(analysisPanel){
     var toolElement;
     let chartType = analysisPanel.state.selectedChartType;
     let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel,['line','column','stack','pie']);
     let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);
     let menuItems = [
       { payload: '1', text: '标煤', value: 2},
       { payload: '2', text: '二氧化碳', value: 3 },
       { payload: '3', text: '树', value: 4 },
    ];
    let menuItemChange = function(e, selectedIndex, menuItem){
      CarbonStore.setDestination(menuItem.value);
      analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
      return true;
    };
    var carbonDest = <DropDownMenu menuItems={menuItems} onChange={menuItemChange} style={{display:"inline-block",float:"left", height:36, width:152}} />;

     if(chartType === 'line' || chartType === 'column' || chartType === 'stack'){
       toolElement =
           <div style={{display:'flex'}}>
             <div style={{margin:'10px 0 0 23px'}}>{chartTypeIconMenu}</div>
             <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog}/>
             <StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
             <div className={'jazz-full-border-dropdownmenu-container'} style={{margin:'5px 30px 5px auto'}}>
               {carbonDest}
               {configBtn}
               <div style={{display:'inline-block', marginLeft:'30px'}}>清空图标</div>
             </div>
             <BaselineCfg  ref="baselineCfg"/>
           </div>;
     }else if(chartType === 'pie'){
       toolElement =
           <div style={{display:'flex'}}>
             <div style={{margin:'10px 0 0 23px'}}>{chartTypeIconMenu}</div>
             <div style={{margin:'5px 30px 5px auto'}}>
               {configBtn}
               <div style={{display:'inline-block', marginLeft:'30px'}}>清空图标</div>
             </div>
             <BaselineCfg  ref="baselineCfg"/>
           </div>;
     }
     return toolElement;
   },
   getUnitEnergySubToolbar(analysisPanel){
     var toolElement;
     let chartType = analysisPanel.state.selectedChartType;
     let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel,['line','column']);
     let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);
     toolElement =
         <div style={{display:'flex'}}>
           <div style={{margin:'10px 0 0 23px'}}>{chartTypeIconMenu}</div>
           <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog}/>
           <StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
           <div style={{margin:'5px 30px 5px auto'}}>
             {configBtn}
             <div style={{display:'inline-block', marginLeft:'30px'}}>清空图标</div>
           </div>
           <BaselineCfg  ref="baselineCfg"/>
         </div>;

      return toolElement;
   },
   getUnitCostSubToolbar(analysisPanel){
     var toolElement;
     let chartType = analysisPanel.state.selectedChartType;
     let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel,['line','column']);
     let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);
     toolElement =
         <div style={{display:'flex'}}>
           <div style={{margin:'10px 0 0 23px'}}>{chartTypeIconMenu}</div>
           <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog}/>
           <StepSelector minStep={1} stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
           <div style={{margin:'5px 30px 5px auto'}}>
             {configBtn}
             <div style={{display:'inline-block', marginLeft:'30px'}}>清空图标</div>
           </div>
         </div>;

      return toolElement;
   },
   getUnitCarbonSubToolbar(analysisPanel){
     var toolElement;
     let chartType = analysisPanel.state.selectedChartType;
     let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel,['line','column']);
     let menuItems = [
       { payload: '1', text: '标煤', value: 2},
       { payload: '2', text: '二氧化碳', value: 3 },
       { payload: '3', text: '树', value: 4 },
    ];
    let menuItemChange = function(e, selectedIndex, menuItem){
      CarbonStore.setDestination(menuItem.value);
      analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
      return true;
    };
    var carbonDest = <DropDownMenu menuItems={menuItems} onChange={menuItemChange} style={{display:"inline-block",float:"left",height:36, width:152}} />
     let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);
     toolElement =
         <div style={{display:'flex'}}>
           <div style={{margin:'10px 0 0 23px'}}>{chartTypeIconMenu}</div>
           <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog}/>
           <StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
           <div style={{margin:'5px 30px 5px auto'}}>
             {carbonDest}
             {configBtn}
             <div style={{display:'inline-block', marginLeft:'30px'}}>清空图标</div>
           </div>
           <BaselineCfg  ref="baselineCfg"/>
         </div>;

      return toolElement;
   },
   getRatioSubToolbar(analysisPanel){
     var toolElement;
     let chartType = analysisPanel.state.selectedChartType;
     let chartTypeIconMenu = ChartStrategyFactor.getChartTypeIconMenu(analysisPanel,['line','column']);
     let configBtn = analysisPanel.state.chartStrategy.getAuxiliaryCompareBtnFn(analysisPanel);
     toolElement =
         <div style={{display:'flex'}}>
           <div style={{margin:'10px 0 0 23px'}}>{chartTypeIconMenu}</div>
           <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog}/>
           <StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
           <div style={{margin:'5px 30px 5px auto'}}>
             {configBtn}
             <div style={{display:'inline-block', marginLeft:'30px'}}>清空图标</div>
           </div>
           <BaselineCfg  ref="baselineCfg"/>
         </div>;

      return toolElement;
   },
   getRankSubToolbar(analysisPanel){
     var energyType = analysisPanel.state.energyType;
     var toolElement;
     var carbonTypeBtn = null;
     if(energyType === 'Carbon'){
       carbonTypeBtn = <DropDownMenu selectedIndex={analysisPanel.state.destination-2} menuItems={carbonTypeItem} ref='carbonType' onChange={analysisPanel._onCarbonTypeChange}></DropDownMenu>;
     }
     var orderItem = [{value:1,text:'降序',name:'Descending'}, {value:2,text:'升序',name:'Ascending'}];
     var rangeItem = [{value:3,text:'前3名'},{value:5,text:'前5名'},{value:10,text:'前10名'},
     {value:20,text:'前20名'},{value:50,text:'前50名'},{value:1000,text:'全部'}];
     var orderCombo = <DropDownMenu menuItems={orderItem} ref='orderCombo' onChange={analysisPanel._onOrderChange}></DropDownMenu>;
     var rangeCombo = <DropDownMenu menuItems={rangeItem} ref='rangeCombo' onChange={analysisPanel._onRangeChange}></DropDownMenu>;
     toolElement =
       <div style={{display:'flex'}}>
         <div style={{margin:'10px 0 0 23px'}}>
           {orderCombo}
           {rangeCombo}
         </div>
         <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog}/>
         <div style={{margin:'5px 30px 5px auto'}}>
           {carbonTypeBtn}
           <div style={{display:'inline-block', marginLeft:'30px'}}>清空图表</div>
         </div>
       </div>;
     return toolElement;
   }
 },
 handleConfigBtnItemTouchTapFnStrategy:{
   handleEnergyConfigBtnItemTouchTap(analysisPanel, menuParam, menuItem){
     let itemValue = menuItem.props.value;
     switch (itemValue) {
       case 'history':
         console.log('history');

         analysisPanel.setState({showAddIntervalDialog: true});
         break;
       case 'config':
         analysisPanel.handleBaselineCfg();
         break;
       case 'sum':
         console.log('sum');
         break;
     }
   },
   handleUnitEnergyConfigBtnItemTouchTap(analysisPanel, subMenuItem, firstMenuItem){
     let firstMenuItemValue = firstMenuItem.props.value;
     if(firstMenuItemValue === 'background'){

     }else if(firstMenuItemValue === 'benchmark'){
       var benchmarkOption = { IndustryId: subMenuItem.props.industryId,
                               ZoneId: subMenuItem.props.zoneId,
                               benchmarkText: subMenuItem.props.primaryText
                             };
      analysisPanel.state.chartStrategy.handleBenchmarkMenuItemClickFn(analysisPanel, benchmarkOption);
     }
   },
   handleCostConfigBtnItemTouchTap(analysisPanel, menuParam, menuItem){
     let itemValue = menuItem.props.value;
     switch (itemValue) {
       case 'touCompare':
         var touBtnSelected = !analysisPanel.state.touBtnSelected;
         analysisPanel.setState({touBtnSelected: touBtnSelected},()=>{
           analysisPanel.onSearchDataButtonClick();
         });
         break;
       case 'background':
         console.log('background');
         break;
     }
   }
 },
 getEnergyTypeComboFnStrategy:{
   empty(){},
   getEnergyTypeCombo(analysisPanel){
     var index = 0;
     switch(analysisPanel.state.energyType){
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
     let types = [{text:'能耗',value:'Energy'},{text:'成本',value:'Cost'},{text:'碳排放',value:'Carbon'}];
     return <DropDownMenu selectedIndex={index} menuItems={types} style={{width:'92px',marginRight:'10px'}} onChange={analysisPanel.state.chartStrategy.onEnergyTypeChangeFn.bind(analysisPanel, analysisPanel)}></DropDownMenu>;
   }
 },
 getInitParamFnStrategy:{
   empty(){},
   getInitParam(analysisPanel){
     let date = new Date();
     date.setHours(0,0,0);
     let last7Days = CommonFuns.dateAdd(date, -6, 'days');
     let endDate = CommonFuns.dateAdd(date, 1, 'days');
     analysisPanel.refs.relativeDate.setState({selectedIndex: 1});
     analysisPanel.refs.dateTimeSelector.setDateField(last7Days, endDate);
   }
 },
 onHierNodeChangeFnStrategy:{
   empty(){},
   onHierNodeChange(analysisPanel){
     var industyMenuItems = analysisPanel.getIndustyMenuItems();
     var customerMenuItems = analysisPanel.getCustomizedMenuItems();
     var hierNode = LabelMenuStore.getHierNode();
     if(!industyMenuItems){
       return;
     }
     analysisPanel.setState({
       industyMenuItems: industyMenuItems,
       customerMenuItems: customerMenuItems
     },()=>{
       analysisPanel.enableLabelButton(true);
     });
   },
   unitEnergyOnHierNodeChange(analysisPanel){
    //  var industryData = LabelMenuStore.getIndustryData();
    //  var zoneData = LabelMenuStore.getZoneData();
    //  var hierNode = LabelMenuStore.getHierNode();
    //  var benchmarkData = LabelMenuStore.getBenchmarkData();
    //  analysisPanel.setState({benchmarks:CommonFuns.filterBenchmarks(hierNode, industryData, zoneData, benchmarkData)});
     //return CommonFuns.filterBenchmarks(hierNode, industryData, zoneData, benchmarkData);
   }
 },
 onEnergyTypeChangeFnStrategy:{
   empty(){},
    onEnergyTypeChange(analysisPanel, e, selectedIndex, menuItem){
      if(analysisPanel.props.onEnergyTypeChange){
        let menuItemVal = menuItem.value;
        let capMenuItemVal = menuItemVal[0].toUpperCase() + menuItemVal.substring(1);
        let chartSttg = ChartStrategyFactor.getStrategyByStoreType(capMenuItemVal);
        if(analysisPanel) analysisPanel.setState({chartStrategy: chartSttg});
        analysisPanel.props.onEnergyTypeChange(menuItem.value);
      }
   }
 },
 getAllDataFnStrategy:{
   empty(){},
   getAllData(){
     LabelMenuAction.getAllIndustries();
     LabelMenuAction.getAllZones();
     LabelMenuAction.getAllLabels();
     LabelMenuAction.getCustomerLabels();
   },
   unitGetAllData(){
     LabelMenuAction.getAllIndustries();
     LabelMenuAction.getAllZones();
     LabelMenuAction.getAllBenchmarks();
   }
 },
 initEnergyStoreByBizChartTypeFnStrategy:{
   initEnergyStoreByBizChartType(analysisPanel){
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
      case 'rawdata':
        EnergyStore.initReaderStrategy('EnergyRawGridReader');
        break;
     }
   },
   initCostStoreByBizChartType(analysisPanel){
     let chartType = analysisPanel.state.selectedChartType;
     switch (chartType) {
       case 'line':
       case 'column':
       case 'stack':
         CostStore.initReaderStrategy('CostTrendReader');
         break;
       case 'pie':
         CostStore.initReaderStrategy('CostPieReader');
         break;
     }
   },
   initCarbonStoreByBizChartType(analysisPanel){
     let chartType = analysisPanel.state.selectedChartType;
     switch (chartType) {
       case 'line':
       case 'column':
       case 'stack':
         CarbonStore.initReaderStrategy('CarbonTrendReader');
         break;
       case 'pie':
        CarbonStore.initReaderStrategy('CarbonPieReader');
        break;
     }
   },
 },

 getInitialStateFnStrategy:{
   empty(){},
   getEnergyInitialState(){
     return {
       showAddIntervalDialog: false
     };
   },
   getCostInitialState(){
     let state = {
       touBtnStatus: true,
       touBtnSelected: false
     };
     return state;
   },
   getUnitEnergyInitialState(){
     let state = {
       unitType: 2,
       benchmarks: null
     };
      return state;
   },
   getRatioInitialState(){
     let state = {
       ratioType: 1,
       benchmarks: null
     };
      return state;
   },
   getCarbonInitialState(){
     let state = {};
     return state;
   },
   getRankInitialState(){
     let state = {
       order: 1,
       range: 3,
       destination: 2,
       selectedChartType:'column'
     };
     return state;
   },
   getLabelInitialState(analysisPanel){
     var selectedLabelItem = analysisPanel.initSlectedLabelItem();
     var curMonth = (new Date()).getMonth();
     let state = {
       labelType: "industryZone",//industry,customized
       industyMenuItems: [],
       customerMenuItems: [],
       selectedLabelItem: selectedLabelItem,
       kpiTypeValue: 1,
       kpiTypeIndex: 0,
       labelDisable: true,
       kpiTypeDisable: false,
       month: curMonth+1
     };
     return state;
   }
 },
 onSearchDataButtonClickFnStrategy:{
   onSearchDataButtonClick(analysisPanel){
     analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

     let dateSelector = analysisPanel.refs.dateTimeSelector,
         dateRange = dateSelector.getDateTime(),
         startDate = dateRange.start,
         endDate = dateRange.end,
         nodeOptions;

     if(startDate.getTime()>= endDate.getTime()){
         GlobalErrorMessageAction.fireGlobalErrorMessage('请选择正确的时间范围');
       return;
     }

     nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
     if( !nodeOptions || nodeOptions.length === 0){
       analysisPanel.setState({energyData:null});
       return;
     }
     let relativeDateValue = analysisPanel._getRelativeDateValue();

     let chartType = analysisPanel.state.selectedChartType;
     if(chartType ==='line' || chartType === 'column' || chartType === 'stack'){
        analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, relativeDateValue, analysisPanel);
     }else{
       let timeRanges;
       if(nodeOptions.length > 1){
         MultiTimespanAction.clearMultiTimespan('both');
         timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
       }else if(chartType === 'pie'){
         let timeRanges;
         if(nodeOptions.length > 1){
           MultiTimespanAction.clearMultiTimespan('both');
           timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
         }else{
           timeRanges = MultipleTimespanStore.getSubmitTimespans();
           if(timeRanges === null){
             timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
           }
         }
         analysisPanel.state.chartStrategy.getPieEnergyDataFn(timeRanges, 2, nodeOptions, relativeDateValue);
       }else if(chartType === 'rawdata'){
         MultiTimespanAction.clearMultiTimespan('both');
         let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
         analysisPanel.state.chartStrategy.getEnergyRawDataFn(timeRanges, 0, nodeOptions, relativeDateValue);
       }
     }
   },
   onCostSearchDataButtonClick(analysisPanel){
     analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

     let dateSelector = analysisPanel.refs.dateTimeSelector,
         dateRange = dateSelector.getDateTime(),
         startDate = dateRange.start,
         endDate = dateRange.end,
         nodeOptions;

     if(startDate.getTime()>= endDate.getTime()){
         GlobalErrorMessageAction.fireGlobalErrorMessage('请选择正确的时间范围');
       return;
     }

     nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
     if( !nodeOptions.hierarchyList || nodeOptions.hierarchyList.length === 0 || !nodeOptions.commodityList || nodeOptions.commodityList.length === 0){
       analysisPanel.setState({energyData:null});
       return;
     }
     let relativeDateValue = analysisPanel._getRelativeDateValue();

     let chartType = analysisPanel.state.selectedChartType;
     if(chartType ==='line' || chartType === 'column' || chartType === 'stack'){
        analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, relativeDateValue, analysisPanel);
     }else if(chartType === 'pie'){
        let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
        analysisPanel.state.chartStrategy.getPieEnergyDataFn(timeRanges, 2, nodeOptions, relativeDateValue, analysisPanel);
     }
   },
   onCarbonSearchDataButtonClick(analysisPanel){
     analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

     let dateSelector = analysisPanel.refs.dateTimeSelector,
         dateRange = dateSelector.getDateTime(),
         startDate = dateRange.start,
         endDate = dateRange.end;

     if(startDate.getTime()>= endDate.getTime()){
         GlobalErrorMessageAction.fireGlobalErrorMessage('请选择正确的时间范围');
       return;
     }

     let hierCommIds = analysisPanel.state.chartStrategy.getSelectedNodesFn();
     if( !hierCommIds.communityIds || hierCommIds.communityIds.length === 0 || !hierCommIds.hierarchyId){
       analysisPanel.setState({energyData:null});
       return;
     }
     let relativeDateValue = analysisPanel._getRelativeDateValue();

     let chartType = analysisPanel.state.selectedChartType;
     let dest = CarbonStore.getDestination();
     if(!dest) dest = 2;
     if(chartType ==='line' || chartType === 'column' || chartType === 'stack'){
        analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, hierCommIds.hierarchyId, hierCommIds.communityIds, dest, relativeDateValue, analysisPanel);
     }else if(chartType === 'pie'){
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
   onRatioSearchDataButtonClick(analysisPanel){
     analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

     let dateSelector = analysisPanel.refs.dateTimeSelector,
         dateRange = dateSelector.getDateTime(),
         startDate = dateRange.start,
         endDate = dateRange.end,
         nodeOptions;

     if(startDate.getTime()>= endDate.getTime()){
         GlobalErrorMessageAction.fireGlobalErrorMessage('请选择正确的时间范围');
       return;
     }

     nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
     if( !nodeOptions || nodeOptions.length === 0){
       analysisPanel.setState({energyData:null});
       return;
     }
     let relativeDateValue = analysisPanel._getRelativeDateValue();
     let ratioType = analysisPanel.state.ratioType;
     if(!ratioType) ratioType = 1;
     let benchmark = null;

     analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, ratioType, relativeDateValue, benchmark, analysisPanel);
   },
   onUnitEnergySearchDataButtonClick(analysisPanel){
     analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

     let dateSelector = analysisPanel.refs.dateTimeSelector,
         dateRange = dateSelector.getDateTime(),
         startDate = dateRange.start,
         endDate = dateRange.end,
         nodeOptions;

     if(startDate.getTime()>= endDate.getTime()){
         GlobalErrorMessageAction.fireGlobalErrorMessage('请选择正确的时间范围');
       return;
     }

     nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
     if( !nodeOptions || nodeOptions.length === 0){
       analysisPanel.setState({energyData:null});
       return;
     }
     let relativeDateValue = analysisPanel._getRelativeDateValue();

     let unitType = analysisPanel.state.unitType;
     analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, unitType, relativeDateValue, analysisPanel);
   },
   onUnitCostSearchDataButtonClick(analysisPanel){
     analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

     let dateSelector = analysisPanel.refs.dateTimeSelector,
         dateRange = dateSelector.getDateTime(),
         startDate = dateRange.start,
         endDate = dateRange.end,
         nodeOptions;

     if(startDate.getTime()>= endDate.getTime()){
         GlobalErrorMessageAction.fireGlobalErrorMessage('请选择正确的时间范围');
       return;
     }

     nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
     if( !nodeOptions.hierarchyList || nodeOptions.hierarchyList.length === 0 || !nodeOptions.commodityList || nodeOptions.commodityList.length === 0){
       analysisPanel.setState({energyData:null});
       return;
     }
     let relativeDateValue = analysisPanel._getRelativeDateValue();

     let unitType = analysisPanel.state.unitType;
     analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, unitType, relativeDateValue, analysisPanel);
   },
   onUnitCarbonSearchDataButtonClick(analysisPanel){
     analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

     let dateSelector = analysisPanel.refs.dateTimeSelector,
         dateRange = dateSelector.getDateTime(),
         startDate = dateRange.start,
         endDate = dateRange.end;

     if(startDate.getTime()>= endDate.getTime()){
         GlobalErrorMessageAction.fireGlobalErrorMessage('请选择正确的时间范围');
       return;
     }

     let hierCommIds = analysisPanel.state.chartStrategy.getSelectedNodesFn();
     if( !hierCommIds.communityIds || hierCommIds.communityIds.length === 0 || !hierCommIds.hierarchyId){
       analysisPanel.setState({energyData:null});
       return;
     }
     let relativeDateValue = analysisPanel._getRelativeDateValue();

     let chartType = analysisPanel.state.selectedChartType;
     let dest = CarbonStore.getDestination();
     if(!dest) dest = 2;

      let unitType = analysisPanel.state.unitType;
      analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, hierCommIds.hierarchyId, hierCommIds.communityIds, dest, unitType, relativeDateValue, analysisPanel);
   },
   onRankSearchDataButtonClick(analysisPanel){
     //analysisPanel.state.chartStrategy.initEnergyStoreByBizChartTypeFn(analysisPanel);

     let dateSelector = analysisPanel.refs.dateTimeSelector,
         dateRange = dateSelector.getDateTime(),
         startDate = dateRange.start,
         endDate = dateRange.end,
         nodeOptions;

     if(startDate.getTime()>= endDate.getTime()){
         GlobalErrorMessageAction.fireGlobalErrorMessage('请选择正确的时间范围');
       return;
     }

     nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
     if( !nodeOptions.hierarchyList || nodeOptions.hierarchyList.length === 0 || !nodeOptions.commodityList || nodeOptions.commodityList.length === 0){
       analysisPanel.setState({energyData:null});
       return;
     }
     let relativeDateValue = analysisPanel._getRelativeDateValue();
     analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, relativeDateValue, analysisPanel);
   },
   onLabelSearchDataButtonClick(analysisPanel){
     var nodeOptions = analysisPanel.state.chartStrategy.getSelectedNodesFn();
     if( !nodeOptions || nodeOptions.length === 0){
       analysisPanel.setState({energyData:null});
       return;
     }
     var viewOption = analysisPanel.getViewOption();
     var benchmarkOption = analysisPanel.getBenchmarkOption();
     var labelingType = analysisPanel.getKpiType();
     analysisPanel.state.chartStrategy.getEnergyDataFn(viewOption, nodeOptions, benchmarkOption, labelingType);
   }
 },
 onSearchBtnItemTouchTapFnStrategy:{
   onSearchBtnItemTouchTap(curChartType, nextChartType, analysisPanel){

     if(analysisPanel.state.chartStrategy.canShareDataWithFn(curChartType, nextChartType) && !!analysisPanel.state.energyData){
       analysisPanel.setState({selectedChartType:nextChartType});
     }else{ //if(nextChartType === 'pie'){
       analysisPanel.setState({selectedChartType:nextChartType, energyData:null}, function(){analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);});
     }
   },
   onCarbonSearchBtnItemTouchTap(curChartType, nextChartType, analysisPanel){

     if(analysisPanel.state.chartStrategy.canShareDataWithFn(curChartType, nextChartType) && !!analysisPanel.state.energyData){
       analysisPanel.setState({selectedChartType:nextChartType});
     }else{ //if(nextChartType === 'pie'){
       analysisPanel.setState({selectedChartType:nextChartType, energyData:null}, function(){analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);});
     }
   }
 },
 setFitStepAndGetDataFnStrategy:{
   setFitStepAndGetData(startDate, endDate, tagOptions, relativeDate, analysisPanel){
     let timeRanges;
     if(tagOptions.length > 1){
       MultiTimespanAction.clearMultiTimespan('both');
       timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
     }else{
       timeRanges = MultipleTimespanStore.getSubmitTimespans();
       if(timeRanges === null){
         timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
       }
     }

     let step = analysisPanel.state.step,
         limitInterval = CommonFuns.getLimitInterval(timeRanges),
         stepList = limitInterval.stepList;
     if( stepList.indexOf(step) == -1){
       step = limitInterval.display;
     }
     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, relativeDate);
   },
   setCostFitStepAndGetData(startDate, endDate, tagOptions, relativeDate, analysisPanel){
     let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
         step = analysisPanel.state.step,
         limitInterval = CommonFuns.getLimitInterval(timeRanges),
         stepList = limitInterval.stepList;
     if( stepList.indexOf(step) == -1){
       step = limitInterval.display;
     }
     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, relativeDate, analysisPanel);
   },
   setCarbonFitStepAndGetData(startDate, endDate, hierarchyId, commodityIds, destination, relativeDate, analysisPanel){
     let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
         step = analysisPanel.state.step,
         limitInterval = CommonFuns.getLimitInterval(timeRanges),
         stepList = limitInterval.stepList;
     if( stepList.indexOf(step) == -1){
       step = limitInterval.display;
     }
     let viewOp = {
        DataUsageType: 4,
        IncludeNavigatorData: true,
        TimeRanges: timeRanges,
        Step: step,
     };
     analysisPanel.state.chartStrategy.getEnergyDataFn(hierarchyId, commodityIds, destination, viewOp, relativeDate, analysisPanel);
   },
   setRatioFitStepAndGetData(startDate, endDate, tagOptions, ratioType, relativeDate, benchmarkOption, analysisPanel){
     let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
         step = analysisPanel.state.step,
         limitInterval = CommonFuns.getLimitInterval(timeRanges),
         stepList = limitInterval.stepList;
     if(stepList.indexOf(step) == -1){
       step = limitInterval.display;
     }
     if(ratioType==1 && (step==0||step==1))step=2;
     if(ratioType==2 && (step==0||step==1||step==2))step=3;
     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, ratioType, relativeDate, benchmarkOption, analysisPanel);
   },
   setUnitEnergyFitStepAndGetData(startDate, endDate, tagOptions, unitType, relativeDate, analysisPanel){
     let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
         step = analysisPanel.state.step,
         limitInterval = CommonFuns.getLimitInterval(timeRanges),
         stepList = limitInterval.stepList;
     if( stepList.indexOf(step) == -1){
       step = limitInterval.display;
     }
     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, unitType, relativeDate);
   },
   setUnitCarbonFitStepAndGetData(startDate, endDate, hierarchyId, commodityIds, destination, unitType, relativeDate, benchmarkOption, analysisPanel){
     let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
         step = analysisPanel.state.step,
         limitInterval = CommonFuns.getLimitInterval(timeRanges),
         stepList = limitInterval.stepList;
     if( stepList.indexOf(step) == -1){
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
     analysisPanel.state.chartStrategy.getEnergyDataFn(hierarchyId, commodityIds, destination, viewOp, relativeDate, benchmarkOption);
   },
   setRankTypeAndGetData(startDate, endDate, tagOptions, relativeDate, analysisPanel){
     let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
     let rankType = analysisPanel.refs.rankType.state.selectedIndex + 1;
     let energyType = analysisPanel.state.energyType;
     let destination = analysisPanel.state.destination;

     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, rankType, tagOptions, relativeDate, destination, energyType);
   }
 },
 searchBarGenFnStrategy:{
   energySearchBarGen(analysisPanel){
     var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
     var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel);

     return <div className={'jazz-alarm-chart-toolbar'}>
       <div className={'jazz-full-border-dropdownmenu-container'} >
         {chartTypeCmp}
         <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'92px'}} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
       </div>
       <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
       <div className={'jazz-flat-button'}>
         {searchButton}
       </div>
     </div>;
   },
  CostSearchBarGen(analysisPanel){
    var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
    var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel);

    return <div className={'jazz-alarm-chart-toolbar'}>
      <div className={'jazz-full-border-dropdownmenu-container'} >
        {chartTypeCmp}
        <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'92px'}} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
      </div>
      <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
      <div className={'jazz-flat-button'}>
        {searchButton}
      </div>
    </div>;
  },
  carbonSearchBarGen(analysisPanel){
    var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
    var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel,['line','column','stack','pie']);

    return <div className={'jazz-alarm-chart-toolbar'}>
      <div className={'jazz-full-border-dropdownmenu-container'} >
        {chartTypeCmp}
        <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'92px'}} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
      </div>
      <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
      <div className={'jazz-flat-button'}>
        {searchButton}
      </div>
  </div>;
},
  unitEnergySearchBarGen(analysisPanel){
     var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
     var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel,['line','column']);
     return <div className={'jazz-alarm-chart-toolbar'}>
       <div className={'jazz-full-border-dropdownmenu-container'}>
         {chartTypeCmp}
         <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'92px'}} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
       </div>
       <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
       <div className={'jazz-full-border-dropdownmenu-container'} >
         <DropDownMenu menuItems={units} style={{width:'102px', marginRight:'10px'}} onChange={(e, selectedIndex, menuItem)=>{analysisPanel.setState({unitType: menuItem.value});}}></DropDownMenu>
       </div>
       <div className={'jazz-flat-button'}>
         {searchButton}
       </div>
   </div>;
  },
  /*
  unitCarbonSearchBarGen(analysisPanel){
     var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
     var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel,['line','column']);
     return <div className={'jazz-alarm-chart-toolbar'}>
       <div className={'jazz-full-border-dropdownmenu-container'}>
         {chartTypeCmp}
         <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'92px'}} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
       </div>
       <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
       <div className={'jazz-full-border-dropdownmenu-container'} >
         <DropDownMenu menuItems={units} style={{width:'102px', marginRight:'10px'}} onChange={(e, selectedIndex, menuItem)=>{analysisPanel.setState({unitType: menuItem.value});}}></DropDownMenu>
       </div>
       <div className={'jazz-flat-button'}>
         {searchButton}
       </div>
   </div>;
  },*/
  ratioUsageSearchBarGen(analysisPanel){
     var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
     var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel,['line','column']);
     var ratios  = [{text: '昼夜比', name:'RationDayNight', value: 1},{text: '工休比', name:'RationWorkday', value: 2}];
     return <div className={'jazz-alarm-chart-toolbar'}>
       <div className={'jazz-full-border-dropdownmenu-container'}>
         {chartTypeCmp}
         <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'92px'}} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
       </div>
       <DateTimeSelector ref='dateTimeSelector' showTime={false} _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
       <div className={'jazz-full-border-dropdownmenu-container'} >
         <DropDownMenu menuItems={ratios} style={{width:'102px', marginRight:'10px'}} onChange={(e, selectedIndex, menuItem)=>{analysisPanel.setState({ratioType: menuItem.value});}}></DropDownMenu>
       </div>
       <div className={'jazz-flat-button'}>
         {searchButton}
       </div>
   </div>;
  },
  rankSearchBarGen(analysisPanel){
    var rankTypeItem = [{value:'TotalRank',text:'总排名'},{value:'RankByPeople',text:'人均排名'},
    {value:'RankByArea', text:'单位面积排名'},{value:'RankByCoolArea',text:'单位供冷面积排名'},
    {value:'RankByHeatArea',text:'单位采暖面积排名'},{value:'RankByRoom',text:'单位客房排名'},
    {value:'RankByUsedRoom',text:'单位已用客房排名'},{value:'RankByBed',text:'单位床位排名'},
    {value:'RankByUsedBed',text:'单位已用床位排名'}];
    var chartTypeCmp = analysisPanel.state.chartStrategy.getEnergyTypeComboFn(analysisPanel);
    return <div className={'jazz-alarm-chart-toolbar'}>
      <div className={'jazz-full-border-dropdownmenu-container'}>
        {chartTypeCmp}
        <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'92px'}} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
      </div>
      <DateTimeSelector ref='dateTimeSelector' showTime={false} _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
      <div className={'jazz-full-border-dropdownmenu-container'} >
        <DropDownMenu menuItems={rankTypeItem} ref='rankType' style={{width:'140px'}} onChange={analysisPanel._onRankTypeChange}></DropDownMenu>
      </div>
      <div className={'jazz-flat-button'}>
        <RaisedButton style={{marginLeft:'10px'}} label="查看" onClick={analysisPanel.onSearchDataButtonClick}></RaisedButton>
      </div>
    </div>;
  },
  labelSearchBarGen(analysisPanel){
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
    var monthItem =  [{value:13,text:'全年'},{value:1,text:'01'},{value:2,text:'02'},{value:3,text:'03'},
    {value:4,text:'04'},{value:5,text:'05'},{value:6,text:'06'},{value:7,text:'07'},
    {value:8,text:'08'},{value:9,text:'09'},{value:10,text:'10'},
    {value:11,text:'11'},{value:12,text:'12'}];
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
        <RaisedButton style={{marginLeft:'10px'}} label="查看" onClick={analysisPanel.onSearchDataButtonClick}></RaisedButton>
      </div>
    </div>;
  }
},
 getSelectedNodesFnStrategy:{
   getSelectedTagList(){
     return AlarmTagStore.getSearchTagList();
   },
   getCostSelectedTagList(){
     var selectedList = {};
     var hierarchyList = CommodityStore.getHierNode();
     var commodityList = CommodityStore.getCommonCommodityList();
     var dimId = CommodityStore.getCurrentDimId();
     selectedList.hierarchyList = hierarchyList;
     selectedList.commodityList = commodityList;
     selectedList.dimId = dimId;
     return selectedList;
   },
   getSelectedHierCommodityList(){
     let communities = CommodityStore.getCommonCommodityList();
     let commIds = [];
     for (var i = 0; i < communities.length; i++) {
       commIds.push(communities[i].Id);
     }
     let hierId =  CommodityStore.getCurrentHierarchyId();
     return {hierarchyId: hierId, communityIds:commIds };
     //return CommodityStore.getCurrentHierIdCommodityStatus();
   },
   getRankSelectedTagList(){
     var selectedList = {};
     var hierarchyList = CommodityStore.getRankingTreeList();
     var commodityList = CommodityStore.getRankingCommodity();
     selectedList.hierarchyList = hierarchyList;
     selectedList.commodityList = commodityList;
     return selectedList;
   }
 },
 getEnergyDataFnStrategy:{
   energyDataLoad(timeRanges, step, tagOptions, relativeDate){
     EnergyAction.getEnergyTrendChartData(timeRanges, step, tagOptions, relativeDate);
   },
   costDataLoad(timeRanges, step, tagOptions, relativeDate, analysisPanel){
     if(analysisPanel.state.touBtnSelected){
       EnergyAction.getElectricityCostTrendChartData(timeRanges, step, tagOptions, relativeDate);
     }
     else{
       EnergyAction.getCostTrendChartData(timeRanges, step, tagOptions, relativeDate);
     }
   },
   carbonDataLoad(hierId, commIds, dest, viewOptions, relativeDate){
     CarbonAction.getCarbonTrendChartData(hierId, commIds, dest, viewOptions, relativeDate);
   },
   ratioDataLoad(timeRanges, step, tagOptions, ratioType, relativeDate, benchmarkOption){
     EnergyAction.getRatioTrendChartData(timeRanges, step, tagOptions, ratioType, relativeDate, benchmarkOption);
   },
   unitEnergyDataLoad(timeRanges, step, tagOptions, unitType, relativeDate, benchmarkOption){
     EnergyAction.getUnitEnergyTrendChartData(timeRanges, step, tagOptions, unitType, relativeDate, benchmarkOption);
   },
   unitCostDataLoad(timeRanges, step, tagOptions, unitType, relativeDate, benchmarkOption){
     EnergyAction.getUnitCostTrendChartData(timeRanges, step, tagOptions, unitType, relativeDate, benchmarkOption);
   },
   unitCarbonDataLoad(hierId, commIds, dest, viewOptions, relativeDate, benchmarkOption){
     CarbonAction.getCarbonUsageUnitData(hierId, commIds, dest, viewOptions, relativeDate, benchmarkOption);
   },
   rankDataLoad(timeRanges, rankType, tagOptions, relativeDate, destination, energyType){
     if(energyType === "Energy"){
       EnergyAction.getEnergyRankChartData(timeRanges, rankType, tagOptions, relativeDate);
     }
     else if(energyType === "Carbon"){
       EnergyAction.getCarbonRankChartData(timeRanges, rankType, tagOptions, relativeDate, destination);
     }
     else{
       EnergyAction.getCostRankChartData(timeRanges, rankType, tagOptions, relativeDate);
     }
   },
   labelDataLoad(viewOption, tagOptions, benchmarkOption, labelingType){
     EnergyAction.getLabelChartData(viewOption, tagOptions, benchmarkOption, labelingType);
   }
 },
 getPieEnergyDataFnStrategy:{
   pieEnergyDataLoad(timeRanges, step, tagOptions, relativeDate){
     EnergyAction.getPieEnergyData(timeRanges, step, tagOptions, relativeDate);
   },
   pieCostDataLoad(timeRanges, step, tagOptions, relativeDate, analysisPanel){
     if(analysisPanel.state.touBtnSelected){
       EnergyAction.getElectricityPieCostData(timeRanges, step, tagOptions, relativeDate);
     }
     else{
       EnergyAction.getPieCostData(timeRanges, step, tagOptions, relativeDate);
     }
   },
   pieCarbonDataLoad(hierId, commIds, destination, viewOption, relativeDate){
     CarbonAction.getPieCarbonData(hierId, commIds, destination, viewOption, relativeDate);
   }
 },
 getEnergyRawDataFnStrategy:{
   empty(){},
   getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize){
     EnergyAction.getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize);
   }
 },
 getChartComponentFnStrategy:{
   getEnergyChartComponent(analysisPanel){
     let energyPart;
     let chartType = analysisPanel.state.selectedChartType;
     let subToolbar = analysisPanel.state.chartStrategy.getChartSubToolbarFn(analysisPanel);
     let historyCompareEl = null;
     if(chartType !=='rawdata' & analysisPanel.state.showAddIntervalDialog === true){
       let relativeType = analysisPanel._getRelativeDateValue();
       let timeRange = analysisPanel.refs.dateTimeSelector.getDateTime();
       MultiTimespanAction.initMultiTimespanData(relativeType, timeRange.start, timeRange.end);
       historyCompareEl = <AddIntervalWindow openImmediately={true} analysisPanel={analysisPanel}/>;
     }
     if(chartType === 'rawdata'){
       let properties = {energyData: analysisPanel.state.energyData,
                         energyRawData: analysisPanel.state.energyRawData,
                         chartStrategy: analysisPanel.state.chartStrategy };
       energyPart = <div style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px', overflow:'hidden'}}>
                      {subToolbar}
                      <GridComponent {...properties}></GridComponent>
                    </div>;
     }else{
       let chartCmpObj ={ref:'ChartComponent',
                         bizType:analysisPanel.props.bizType,
                         energyType: analysisPanel.state.energyType,
                         chartType: analysisPanel.state.selectedChartType,
                         energyData: analysisPanel.state.energyData,
                         energyRawData: analysisPanel.state.energyRawData,
                         onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
                         onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
                       };
        energyPart = <div style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px'}}>
                       {subToolbar}
                       {historyCompareEl}
                       <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                     </div>;
     }
      return energyPart;
   },
   getCostChartComponent(analysisPanel){
     let energyPart;
     let chartType = analysisPanel.state.selectedChartType;
     let subToolbar = analysisPanel.state.chartStrategy.getChartSubToolbarFn(analysisPanel);
     let chartCmpObj ={ref:'ChartComponent',
                       bizType:analysisPanel.props.bizType,
                       energyType: analysisPanel.state.energyType,
                       chartType: analysisPanel.state.selectedChartType,
                       energyData: analysisPanel.state.energyData,
                       energyRawData: analysisPanel.state.energyRawData,
                       onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
                       onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
                     };

      energyPart = <div style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px'}}>
                     {subToolbar}
                     <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                   </div>;

     return energyPart;
   },
   getUnitEnergyChartComponent(analysisPanel){
     let energyPart;
     let chartType = analysisPanel.state.selectedChartType;
     let subToolbar = analysisPanel.state.chartStrategy.getChartSubToolbarFn(analysisPanel);

     let chartCmpObj ={ref:'ChartComponent',
                       bizType:analysisPanel.props.bizType,
                       energyType: analysisPanel.state.energyType,
                       chartType: analysisPanel.state.selectedChartType,
                       energyData: analysisPanel.state.energyData,
                       energyRawData: analysisPanel.state.energyRawData,
                       onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
                       onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
                     };

      energyPart = <div style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px'}}>
                     {subToolbar}
                     <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                   </div>;

       return energyPart;
   },
   getCarbonChartComponent(analysisPanel){
     let energyPart;
     let chartType = analysisPanel.state.selectedChartType;
     let subToolbar = analysisPanel.state.chartStrategy.getChartSubToolbarFn(analysisPanel);
     let chartCmpObj ={ref:'ChartComponent',
                       bizType:analysisPanel.props.bizType,
                       energyType: analysisPanel.state.energyType,
                       chartType: analysisPanel.state.selectedChartType,
                       energyData: analysisPanel.state.energyData,
                       energyRawData: analysisPanel.state.energyRawData,
                       onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
                       onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
                     };

       let paramsObj = CarbonStore.getParamsObj();
      energyPart = <div style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px'}}>
                    {subToolbar}
                     <ChartComponentBox {...paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                   </div>;

      return energyPart;
   },
   getRatioChartComponent(analysisPanel){
     let energyPart;
     let chartType = analysisPanel.state.selectedChartType;
     let subToolbar = analysisPanel.state.chartStrategy.getChartSubToolbarFn(analysisPanel);

     let chartCmpObj ={ref:'ChartComponent',
                       bizType:analysisPanel.props.bizType,
                       energyType: analysisPanel.state.energyType,
                       chartType: analysisPanel.state.selectedChartType,
                       energyData: analysisPanel.state.energyData,
                       energyRawData: analysisPanel.state.energyRawData,
                       onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
                       onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
                     };

     let paramsObj = RatioStore.getParamsObj();
      energyPart = <div style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px'}}>
                    {subToolbar}
                     <ChartComponentBox {...paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                   </div>;
      return energyPart;
   },
   getRankChartComponent(analysisPanel){
     let energyPart;
     let subToolbar = analysisPanel.state.chartStrategy.getChartSubToolbarFn(analysisPanel);
     let chartCmpObj ={ref:'ChartComponent',
                       bizType:analysisPanel.props.bizType,
                       energyType: analysisPanel.state.energyType,
                       chartType: analysisPanel.state.selectedChartType,
                       range: analysisPanel.state.range,
                       order: analysisPanel.state.order,
                       energyData: analysisPanel.state.energyData,
                       energyRawData: analysisPanel.state.energyRawData,
                       onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
                       onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
                     };

      energyPart = <div style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px'}}>
                     {subToolbar}
                     <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                   </div>;
      return energyPart;
   },
   getLabelChartComponent(analysisPanel){
     let energyPart;
     let chartCmpObj ={ref:'ChartComponent',
                       bizType:analysisPanel.props.bizType,
                       energyData: analysisPanel.state.energyData,
                       energyRawData: analysisPanel.state.energyRawData,
                       onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
                       onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
                     };

      energyPart = <div ref="chartContainer" style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px'}}>
                     <div style={{display:'flex'}}>
                       <div style={{margin:'5px 30px 5px auto'}}>
                         <div style={{display:'inline-block', marginLeft:'30px'}}>清空图表</div>
                       </div>
                     </div>;
                     <LabelChartComponent ref="chartComponent" {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                   </div>;
      return energyPart;
    }
 },
 getAuxiliaryCompareBtnFnStrategy:{
   getEnergyAuxiliaryCompareBtn(analysisPanel){
     let calendarSubItems = [{ primaryText:'非工作时间', value:'noneWorkTime'},
                             {primaryText:'冷暖季', value:'hotColdSeason'}];
     let weatherSubItems = [ {primaryText:'温度', value:'temperature'},
                             {primaryText:'湿度', value:'humidity'}];

     let configButton =<ButtonMenu label='辅助对比' style={{marginLeft:'10px'}} desktop={true}
                                  onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       <MenuItem primaryText="历史对比" value='history' disabled={analysisPanel.state.baselineBtnStatus}/>
       <MenuItem primaryText="基准值设置" value='config' disabled={analysisPanel.state.baselineBtnStatus}/>
       <MenuDivider />
       <MenuItem primaryText="数据求和" value='sum'/>
       <ExtendableMenuItem primaryText="日历背景色" value='background' subItems={calendarSubItems}/>
       <ExtendableMenuItem primaryText="天气信息" value='weather' subItems = {weatherSubItems}/>
     </ButtonMenu>;

     return configButton;
   },
   getCarbonAuxiliaryCompareBtn(analysisPanel){
     let calendarSubItems = [{ primaryText:'非工作时间', value:'noneWorkTime'},
                             {primaryText:'冷暖季', value:'hotColdSeason'}];
     let weatherSubItems = [ {primaryText:'温度', value:'temperature'},
                             {primaryText:'湿度', value:'humidity'}];

     let configButton =<ButtonMenu label='辅助对比' style={{marginLeft:'10px'}} desktop={true}
                                  onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       <ExtendableMenuItem primaryText="日历背景色" value='background' subItems={calendarSubItems}/>
     </ButtonMenu>;

     return configButton;
   },
   getRatioAuxiliaryCompareBtn(analysisPanel){
     let calendarSubItems = [{ primaryText:'非工作时间', value:'noneWorkTime'},
                             {primaryText:'冷暖季', value:'hotColdSeason'}];

     let tagOptions = EnergyStore.getTagOpions();
     let benchmarks = CommonFuns.filterBenchmarksByTagOptions(tagOptions);

     let configButton =<ButtonMenu label='辅助对比' style={{marginLeft:'10px'}} desktop={true}
                                  onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       <ExtendableMenuItem primaryText="日历背景色" value='background' subItems={calendarSubItems}/>
       <ExtendableMenuItem primaryText="行业基准值" value='benchmark' subItems={benchmarks} disabled={!benchmarks}/>
       </ButtonMenu>;
       return configButton;
   },
   getUnitEnergyAuxiliaryCompareBtn(analysisPanel){
     let calendarSubItems = [{ primaryText:'非工作时间', value:'noneWorkTime'},
                             {primaryText:'冷暖季', value:'hotColdSeason'}];

     let tagOptions = EnergyStore.getTagOpions();
     let benchmarks = CommonFuns.filterBenchmarksByTagOptions(tagOptions);

     let configButton =<ButtonMenu label='辅助对比' style={{marginLeft:'10px'}} desktop={true}
                                  onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       <ExtendableMenuItem primaryText="日历背景色" value='background' subItems={calendarSubItems}/>
       <ExtendableMenuItem primaryText="行业基准值" value='benchmark' subItems={benchmarks} disabled={!benchmarks}/>
       </ButtonMenu>;
       return configButton;
   },
   getUnitCostAuxiliaryCompareBtn(analysisPanel){
     let calendarSubItems = [{ primaryText:'非工作时间', value:'noneWorkTime'},
                             {primaryText:'冷暖季', value:'hotColdSeason'}];

     let tagOptions = CostStore.getSelectedList();
     let benchmarks = CommonFuns.filterBenchmarksByCostSelectedList(tagOptions);
     let configButton =<ButtonMenu label='辅助对比' style={{marginLeft:'10px'}} desktop={true}
                                  onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       <ExtendableMenuItem primaryText="日历背景色" value='background' subItems={calendarSubItems}/>
       <ExtendableMenuItem primaryText="行业基准值" value='benchmark' subItems={benchmarks} disabled={analysisPanel.state.baselineBtnStatus}/>
       </ButtonMenu>;
       return configButton;
   },
   getUnitCarbonAuxiliaryCompareBtn(analysisPanel){
     let calendarSubItems = [{ primaryText:'非工作时间', value:'noneWorkTime'},
                             {primaryText:'冷暖季', value:'hotColdSeason'}];

     let tagOptions = {}, hierarchyList = CommodityStore.getHierNode(), commodityList = CommodityStore.getCommonCommodityList();
     tagOptions.hierarchyList = hierarchyList;
     tagOptions.commodityList = commodityList;
     let benchmarks = CommonFuns.filterBenchmarksByCostSelectedList(tagOptions);

     let configButton =<ButtonMenu label='辅助对比' style={{marginLeft:'10px'}} desktop={true}
                                  onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       <ExtendableMenuItem primaryText="日历背景色" value='background' subItems={calendarSubItems}/>
       <ExtendableMenuItem primaryText="行业基准值" value='benchmark' subItems={benchmarks} disabled={analysisPanel.state.baselineBtnStatus}/>
       </ButtonMenu>;
       return configButton;
   },
   getCostAuxiliaryCompareBtn(analysisPanel){
     let calendarSubItems = [{ primaryText:'非工作时间', value:'noneWorkTime'},
                             {primaryText:'冷暖季', value:'hotColdSeason'}];

     let configButton =<ButtonMenu label='辅助对比' style={{marginLeft:'10px'}} desktop={true}
                                  onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
       <MenuItem primaryText="峰谷展示" value='touCompare' checked={analysisPanel.state.touBtnSelected} disabled={analysisPanel.state.touBtnStatus}/>
       <ExtendableMenuItem primaryText="日历背景色" value='background' subItems={calendarSubItems}/>
     </ButtonMenu>;

     return configButton;
   }
 },
 canShareDataWithFnStrategy:{
   canShareDataWith(curChartType, nextChartType){
     if((curChartType==='line'||curChartType==='column'||curChartType==='stack')&&(nextChartType==='line'||nextChartType==='column'||nextChartType==='stack')){
       return true;
     }else{
       return false;
     }
   },
   canRankShareDataWith(curChartType, nextChartType){
     return false;
   }
 },
 bindStoreListenersFnStrategy:{
   energyBindStoreListeners(analysisPanel){
     EnergyStore.addEnergyDataLoadingListener(analysisPanel._onLoadingStatusChange);
     EnergyStore.addEnergyDataLoadedListener(analysisPanel._onEnergyDataChange);
     EnergyStore.addEnergyDataLoadErrorListener(analysisPanel._onGetEnergyDataError);
     TagStore.addBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
   },
   costBindStoreListeners(analysisPanel){
     CostStore.addCostDataLoadingListener(analysisPanel._onCostLoadingStatusChange);
     CostStore.addCostDataLoadedListener(analysisPanel._onCostDataChange);
     CostStore.addCostDataLoadErrorListener(analysisPanel._onGetCostDataError);
     CommodityStore.addECButtonStatusListener(analysisPanel._onTouBtnDisabled);
   },
   carbonBindStoreListeners(analysisPanel){
     CarbonStore.addCarbonDataLoadingListener(analysisPanel._onCarbonLoadingStatusChange);
     CarbonStore.addCarbonDataLoadedListener(analysisPanel._onCarbonDataChange);
     CarbonStore.addCarbonDataLoadErrorListener(analysisPanel._onGetCarbonDataError);
   },
   ratioBindStoreListeners(analysisPanel){
     RatioStore.addRatioDataLoadingListener(analysisPanel._onRatioLoadingStatusChange);
     RatioStore.addRatioDataLoadedListener(analysisPanel._onRatioDataChange);
     RatioStore.addRatioDataLoadErrorListener(analysisPanel._onGetRatioDataError);
   },
   unitEnergyBindStoreListeners(analysisPanel){
     EnergyStore.addEnergyDataLoadingListener(analysisPanel._onLoadingStatusChange);
     EnergyStore.addEnergyDataLoadedListener(analysisPanel._onEnergyDataChange);
     EnergyStore.addEnergyDataLoadErrorListener(analysisPanel._onGetEnergyDataError);
     TagStore.addBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
   },
   unitCostBindStoreListeners(analysisPanel){
     CostStore.addCostDataLoadingListener(analysisPanel._onCostLoadingStatusChange);
     CostStore.addCostDataLoadedListener(analysisPanel._onCostDataChange);
     CostStore.addCostDataLoadErrorListener(analysisPanel._onGetCostDataError);
     CommodityStore.addUCButtonStatusListener(analysisPanel._onCostBaselineBtnDisabled);
   },
   unitCarbonBindStoreListeners(analysisPanel){
     CarbonStore.addCarbonDataLoadingListener(analysisPanel._onCarbonLoadingStatusChange);
     CarbonStore.addCarbonDataLoadedListener(analysisPanel._onCarbonDataChange);
     CarbonStore.addCarbonDataLoadErrorListener(analysisPanel._onGetCarbonDataError);
   },
   rankBindStoreListeners(analysisPanel){
     RankStore.addRankDataLoadingListener(analysisPanel._onRankLoadingStatusChange);
     RankStore.addRankDataLoadedListener(analysisPanel._onRankDataChange);
     RankStore.addRankDataLoadErrorListener(analysisPanel._onGetRankDataError);
   },
   labelBindStoreListeners(analysisPanel){
     LabelMenuStore.addHierNodeChangeListener(analysisPanel._onHierNodeChange);
     LabelStore.addLabelDataLoadingListener(analysisPanel._onLabelLoadingStatusChange);
     LabelStore.addLabelDataLoadedListener(analysisPanel._onLabelDataChange);
     LabelStore.addLabelDataLoadErrorListener(analysisPanel._onGetLabelDataError);
   }
 },
 unbindStoreListenersFnStrategy:{
   energyUnbindStoreListeners(analysisPanel){
     EnergyStore.removeEnergyDataLoadingListener(analysisPanel._onLoadingStatusChange);
     EnergyStore.removeEnergyDataLoadedListener(analysisPanel._onEnergyDataChange);
     EnergyStore.removeEnergyDataLoadErrorListener(analysisPanel._onGetEnergyDataError);
     TagStore.removeBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
   },
   carbonUnbindStoreListeners(analysisPanel){
     CarbonStore.removeCarbonDataLoadingListener(analysisPanel._onCarbonLoadingStatusChange);
     CarbonStore.removeCarbonDataLoadedListener(analysisPanel._onCarbonDataChange);
     CarbonStore.removeCarbonDataLoadErrorListener(analysisPanel._onGetCarbonDataError);
   },

    ratioUnbindStoreListeners(analysisPanel){
      RatioStore.removeRatioDataLoadingListener(analysisPanel._onRatioLoadingStatusChange);
      RatioStore.removeRatioDataLoadedListener(analysisPanel._onRatioDataChange);
      RatioStore.removeRatioDataLoadErrorListener(analysisPanel._onGetRatioDataError);
    },

   costUnbindStoreListeners(analysisPanel){
     CostStore.removeCostDataLoadingListener(analysisPanel._onCostLoadingStatusChange);
     CostStore.removeCostDataLoadedListener(analysisPanel._onCostDataChange);
     CostStore.removeCostDataLoadErrorListener(analysisPanel._onGetCostDataError);
     CommodityStore.removeECButtonStatusListener(analysisPanel._onTouBtnDisabled);
   },

   unitEnergyUnbindStoreListeners(analysisPanel){
     EnergyStore.removeEnergyDataLoadingListener(analysisPanel._onLoadingStatusChange);
     EnergyStore.removeEnergyDataLoadedListener(analysisPanel._onEnergyDataChange);
     EnergyStore.removeEnergyDataLoadErrorListener(analysisPanel._onGetEnergyDataError);
     TagStore.removeBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
     LabelMenuStore.removeHierNodeChangeListener(analysisPanel._onHierNodeChange);
   },

   unitCostUnbindStoreListeners(analysisPanel){
     CostStore.removeCostDataLoadingListener(analysisPanel._onCostLoadingStatusChange);
     CostStore.removeCostDataLoadedListener(analysisPanel._onCostDataChange);
     CostStore.removeCostDataLoadErrorListener(analysisPanel._onGetCostDataError);
     CommodityStore.removeUCButtonStatusListener(analysisPanel._onCostBaselineBtnDisabled);
   },

   unitCarbonUnbindStoreListeners(analysisPanel){
     CarbonStore.removeCarbonDataLoadingListener(analysisPanel._onCarbonLoadingStatusChange);
     CarbonStore.removeCarbonDataLoadedListener(analysisPanel._onCarbonDataChange);
     CarbonStore.removeCarbonDataLoadErrorListener(analysisPanel._onGetCarbonDataError);
   },

   rankUnbindStoreListeners(analysisPanel){
     RankStore.removeRankDataLoadingListener(analysisPanel._onRankLoadingStatusChange);
     RankStore.removeRankDataLoadedListener(analysisPanel._onRankDataChange);
     RankStore.removeRankDataLoadErrorListener(analysisPanel._onGetRankDataError);
   },
   labelUnbindStoreListeners(analysisPanel){
     LabelMenuStore.removeHierNodeChangeListener(analysisPanel._onHierNodeChange);
     LabelStore.removeLabelDataLoadingListener(analysisPanel._onLabelLoadingStatusChange);
     LabelStore.removeLabelDataLoadedListener(analysisPanel._onLabelDataChange);
     LabelStore.removeLabelDataLoadErrorListener(analysisPanel._onGetLabelDataError);
   }
 },
 exportChartFnStrategy:{
   exportChart(analysisPanel){
     if(!analysisPanel.state.energyData){
       return;
     }
     let path;
     let chartType = analysisPanel.state.selectedChartType;
     let tagOptions = EnergyStore.getTagOpions();
     let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
     let viewOption = EnergyStore.getSubmitParams().viewOption;
     let title = analysisPanel.props.chartTitle || '能耗分析';

     let params = {
       title: title,
       tagIds: tagIds,
       viewOption: viewOption
     };

     if(chartType === 'pie'){
       path = 'API/Energy.svc/AggregateTagsData4Export';
     }else{
       path = 'API/Energy.svc/GetTagsData4Export';
       let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions);
           params.nodeNameAssociation = nodeNameAssociation;
     }

     let seriesNumber = EnergyStore.getEnergyData().get('Data').size;
     let charTypes = [];
     for(let i = 0; i < seriesNumber; i++){
       charTypes.push(chartType);//暂且全部用chartType，以后可以修改每个series type之后要做更改
     }

     params.charTypes = charTypes;
     ExportChartAction.getTagsData4Export(params, path);
   },
   exportChart4UnitEnergy(analysisPanel){
     if(!analysisPanel.state.energyData){
       return;
     }
     let path = 'API/Energy.svc/GetEnergyUsageUnitData4Export';
     let chartType = analysisPanel.state.selectedChartType;
     let tagOptions = EnergyStore.getTagOpions();
     let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
     let submitParams = EnergyStore.getSubmitParams();
     let benchmarkOption = submitParams.benchmarkOption;
     let viewOption = submitParams.viewOption;
     let title = analysisPanel.props.chartTitle || '能耗分析';
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
     for(let i = 0; i < seriesNumber; i++){
       charTypes.push(chartType);//暂且全部用chartType，以后可以修改每个series type之后要做更改
     }
     params.charTypes = charTypes;

     ExportChartAction.getTagsData4Export(params, path);
   }
 },
 getChartTypeIconMenu(analysisPanel, types){
   var IconButtonElement = <IconButton iconClassName="icon-power"/>;
   var iconMenuProps= {
                       iconButtonElement:IconButtonElement,
                       openDirection:"bottom-right",
                       desktop: true,
                       onItemTouchTap: analysisPanel._onSearchBtnItemTouchTap
                     };

   let menuMap = { line: {primaryText:'折线图', icon:<FontIcon className="icon-power" />},
                   column:{primaryText:'柱状图', icon:<FontIcon className="icon-current" />},
                   stack:{primaryText:'堆积图', icon:<FontIcon className="icon-customer" />},
                   pie:{primaryText:'饼状图', icon:<FontIcon className="icon-delete" />},
                   rawdata:{primaryText:'原始数据', icon:<FontIcon className="icon-device" />}};

   let typeItems = types.map((item)=>{
     return <MenuItem primaryText={menuMap[item].icon} value={item} />;
   });

   let widgetOptMenu = <IconMenu {...iconMenuProps}>
                         {typeItems}
                      </IconMenu>;
   return widgetOptMenu;
 },
 getSearchBtn(analysisPanel){
   var searchButton = <RaisedButton label='查看' onClick={analysisPanel.onSearchDataButtonClick}/>;
    return searchButton;
  },
  getLabelBtn(analysisPanel){
    var industySubItems = analysisPanel.state.industyMenuItems;
    var customizedSubItems = analysisPanel.state.customerMenuItems;
    let labelButton = <ButtonMenu label={analysisPanel.state.selectedLabelItem.text} style={{marginLeft:'10px'}} desktop={true}
      disabled={analysisPanel.state.labelDisable} onItemTouchTap={analysisPanel._onChangeLabelType}>
      <ExtendableMenuItem primaryText="行业能效标识" value='industryZone' subItems={industySubItems}>
      </ExtendableMenuItem>
      <ExtendableMenuItem primaryText="自定义能效标识" value='customized' subItems={customizedSubItems}>
      </ExtendableMenuItem>
    </ButtonMenu>;
    return labelButton;
  },
  getKpiTypeBtn(analysisPanel){
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
    var kpiTypeItem = [
     {value:1,index:0,text:'单位人口',name:'UnitPopulation'},
     {value:2,index:1,text:'单位面积',name:'UnitArea'},
     {value:3,index:2,text:'单位供冷面积',name:'UnitColdArea'},
     {value:4,index:3,text:'单位采暖面积',name:'UnitWarmArea'},
     {value:8,index:4,text:'单位客房',name:'UnitRoom'},
     {value:9,index:5,text:'单位已用客房',name:'UnitUsedRoom'},
     {value:10,index:6,text:'单位床位',name:'UnitBed'},
     {value:11,index:7,text:'单位已用床位',name:'UnitUsedBed'},
     {value:5,index:8,text:'昼夜比',name:'DayNightRatio'},
     {value:6,index:9,text:'公休比',name:'WorkHolidayRatio'}];

    if(!analysisPanel.state.kpiTypeDisable){
      kpiTypeButton = <DropDownMenu style={{marginLeft:'10px'}} selectedIndex={analysisPanel.state.kpiTypeIndex} menuItems={kpiTypeItem} ref='kpiType' onChange={analysisPanel.onChangeKpiType}></DropDownMenu>;
      }
    else{
      var kpiTypeText = analysisPanel.getKpiText();
      kpiTypeButton = <span style={kpiSpanStyle}>{kpiTypeText}</span>;
    }
    return kpiTypeButton;
  },
  getStrategyByStoreType: function (storeType) {
    return ChartStrategyFactor.getStrategyByConfig(ChartStrategyFactor.strategyConfiguration[storeType]);
  },
  getStrategyByConfig: function (strategyConfig) {
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
