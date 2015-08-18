'use strict';
import React from "react";
import assign from "object-assign";
import _ from 'lodash';
import {FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress} from 'material-ui';

import CommonFuns from '../../util/Util.jsx';
import DateTimeSelector from '../../controls/DateTimeSelector.jsx';
import DateSelector from '../../controls/DateSelector.jsx';
import ButtonMenu from '../../controls/ButtonMenu.jsx';
import YearPicker from '../../controls/YearPicker.jsx';
import ExtendableMenuItem from '../../controls/ExtendableMenuItem.jsx';
import AlarmTagStore from '../../stores/AlarmTagStore.jsx';
import GlobalErrorMessageAction from '../../actions/GlobalErrorMessageAction.jsx';
import LabelMenuAction from '../../actions/LabelMenuAction.jsx';
import LabelAction from '../../actions/LabelAction.jsx';
import RankAction from '../../actions/RankAction.jsx';
import EnergyAction from '../../actions/EnergyAction.jsx';
import ExportChartAction from '../../actions/ExportChartAction.jsx';
import CommodityAction from '../../actions/CommodityAction.jsx';
import YaxisSelector from './YaxisSelector.jsx';
import StepSelector from './StepSelector.jsx';
import ChartComponentBox from './ChartComponentBox.jsx';
import LabelChartComponent from './LabelChartComponent.jsx';
import GridComponent from './GridComponent.jsx';
import EnergyStore from '../../stores/energy/EnergyStore.jsx';
import LabelStore from '../../stores/LabelStore.jsx';
import LabelMenuStore from '../../stores/LabelMenuStore.jsx';
import RankStore from '../../stores/LabelMenuStore.jsx';
import CommodityStore from '../../stores/CommodityStore.jsx';
import TagStore from '../../stores/TagStore.jsx';

let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');

const searchDate = [{value:'Customerize',text:'自定义'},{value: 'Last7Day', text: '最近7天'}, {value: 'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
 {value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'}, {value: 'LastWeek', text: '上周'},
 {value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];
 const rankTypeItem = [{value:'TotalRank',text:'总排名'},{value:'RankByPeople',text:'人均排名'},
 {value:'RankByArea', text:'单位面积排名'},{value:'RankByHeatArea',text:'单位供冷面积排名'},
 {value:'RankByCoolArea',text:'单位采暖面积排名'},{value:'RankByRoom',text:'单位客房排名'},
 {value:'RankByUsedRoom',text:'单位已用客房排名'},{value:'RankByBed',text:'单位床位排名'}];
 const kpiTypeItem = [{value:'UnitPopulation',text:'单位人口'},{value:'UnitArea',text:'单位面积'},
 {value:'UnitColdArea',text:'单位供冷面积'},{value:'UnitWarmArea',text:'单位采暖面积'},
 {value:'UnitRoom',text:'单位客房'},{value:'UnitUsedRoom',text:'单位已用客房'},
 {value:'UnitBed',text:'单位床位'},{value:'DayNightRatio',text:'昼夜比'},
 {value:'WorkHolidayRatio',text:'公休比'}];
 const orderItem = [{value:'1',text:'降序'}, {value:'2',text:'升序'}];
 const rangeItem = [{value:'3',text:'前3名'},{value:'5',text:'前5名'},{value:'10',text:'前10名'},
 {value:'20',text:'前20名'},{value:'50',text:'前50名'},{value:'1000',text:'全部'}];
 const monthItem =  [{value:'13',text:'全年'},{value:'1',text:'01'},{value:'2',text:'02'},{value:'3',text:'03'},
 {value:'4',text:'04'},{value:'5',text:'05'},{value:'6',text:'06'},{value:'7',text:'07'},
 {value:'8',text:'08'},{value:'9',text:'09'},{value:'10',text:'10'},
 {value:'11',text:'11'},{value:'12',text:'12'}];

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
      getInitialStateFn:'empty',
      getAllDataFn: 'empty',
      getCustomizedLabelItemsFn: 'empty',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn:'energyDataLoad',
      getPieEnergyDataFn:'pieEnergyDataLoad',
      getChartComponentFn:'getEnergyChartComponent',
      bindStoreListenersFn:'energyBindStoreListeners',
      unbindStoreListenersFn:'energyUnbindStoreListeners',
      canShareDataWithFn:'canShareDataWith',
      getEnergyRawDataFn:'getEnergyRawData',
      exportChartFn:'exportChart',
      onHierNodeChangeFn:'empty'
    },
    MultiIntervalDistribution:{

    },RatioUsage:{

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
      getCustomizedLabelItemsFn: 'empty',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn:'unitEnergyDataLoad',
      getChartComponentFn:'getEnergyChartComponent',
      bindStoreListenersFn:'unitEnergyBindStoreListeners',
      unbindStoreListenersFn:'unitEnergyUnbindStoreListeners',
      canShareDataWithFn:'canShareDataWith',
      exportChartFn:'exportChart',
      onHierNodeChangeFn:'unitEnergyOnHierNodeChange'

    },Label:{
      searchBarGenFn:'labelSearchBarGen',
      getEnergyTypeComboFn: 'empty',
      getSelectedNodesFn:'getSelectedTagList',
      onSearchDataButtonClickFn:'onLabelSearchDataButtonClick',
      onEnegyTypeChangeFn:'empty',
      onHierNodeChangeFn:'onHierNodeChange',
      setFitStepAndGetDataFn:'setLabelTypeAndGetData',
      getInitialStateFn:'getLabelInitialState',
      getAllDataFn: 'getAllData',
      getCustomizedLabelItemsFn: 'getCustomizedLabelItems',
      getInitParamFn: 'empty',
      getEnergyDataFn: 'labelDataLoad',
      getChartComponentFn:'getLabelChartComponent',
      bindStoreListenersFn:'labelBindStoreListeners',
      unbindStoreListenersFn:'labelUnbindStoreListeners',
      canShareDataWithFn:'canRankShareDataWith'
    },Rank:{
      searchBarGenFn:'rankSearchBarGen',
      getEnergyTypeComboFn: 'getEnergyTypeCombo',
      getSelectedNodesFn:'getSelectedList',
      onSearchDataButtonClickFn:'onRankSearchDataButtonClick',
      onEnegyTypeChangeFn:'onRankEnegyTypeChange',
      onHierNodeChangeFn:'empty',
      setFitStepAndGetDataFn:'setRankTypeAndGetData',
      getInitialStateFn:'getRankInitialState',
      getAllDataFn: 'empty',
      getCustomizedLabelItemsFn: 'empty',
      getInitParamFn: 'getInitParam',
      getEnergyDataFn: 'rankDataLoad',
      getChartComponentFn:'getRankChartComponent',
      bindStoreListenersFn:'rankBindStoreListeners',
      unbindStoreListenersFn:'rankUnbindStoreListeners',
      canShareDataWithFn:'canRankShareDataWith'
    }
 },
 getEnergyTypeComboFnStrategy:{
   empty(){},
   getEnergyTypeCombo(analysisPanel){
     let types = [{text:'能耗',value:'energy'},{text:'成本',value:'cost'},{text:'碳排放',value:'carbon'}];
     return <DropDownMenu menuItems={types} onChange={analysisPanel.state.chartStrategy.onEnegyTypeChangeFn}></DropDownMenu>;
   }
 },
 getInitParamFnStrategy:{
   empty(){},
   getInitParam(analysisPanel){
     let date = new Date();
     date.setHours(0,0,0);
     let last7Days = CommonFuns.dateAdd(date, -7, 'days');
     let endDate = CommonFuns.dateAdd(date, 0, 'days');
     analysisPanel.refs.relativeDate.setState({selectedIndex: 1});
     analysisPanel.refs.dateTimeSelector.setDateField(last7Days, endDate);
   }
 },
 onHierNodeChangeFnStrategy:{
   empty(){},
   onHierNodeChange(analysisPanel){
     var industyMenuItems = analysisPanel.getIndustyMenuItems();
     var customerMenuItems = analysisPanel.getCustomizedMenuItems();
     analysisPanel.setState({
       industyMenuItems: industyMenuItems,
       customerMenuItems: customerMenuItems
     },()=>{
       analysisPanel.enableLabelButton(true);
     });

     analysisPanel.refs.kpiType.setState({selectedIndex: analysisPanel.state.kpiTypeValue});
   },
   unitEnergyOnHierNodeChange(analysisPanel){
     var industryData = LabelMenuStore.getIndustryData();
     var zoneData = LabelMenuStore.getZoneData();
     var hierNode = LabelMenuStore.getHierNode();
     var benchmarkData = LabelMenuStore.getBenchmarkData();
     return CommonFuns.filterBenchmarks(hierNode, industryData, zoneData, benchmarkData);
   }
 },
 onEnegyTypeChangeFnStrategy:{
   empty(){},
   onRankEnegyTypeChange(e, selectedIndex, menuItem){
     CommodityAction.setRankingECType(menuItem.value);
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
 getCustomizedLabelItemsFnStrategy:{
   empty(){},
   getCustomizedLabelItems(analysisPanel){
     var menuItems = [];
     var customizedStore = LabelMenuStore.getCustomerLabelData();
     if(!analysisPanel.hasCustomizedMenuItems()){
       customizedStore.forEach((item, index) => {
         menuItems.push({
           value: item.get('Id'),
           customerizedId: item.get('Id'),
           primaryText: item.get('Name'),
           kpiType: item.get('LabellingType'),
           parent: 'customized'
         });
       });
     }
     if(menuItems.length === 0){
       menuItems = analysisPanel.getNoneMenuItem(false);
     }
     analysisPanel.setState({customerMenuItems: menuItems});
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
   }
 },

 getInitialStateFnStrategy:{
   empty(){},
   getUnitEnergyInitialState(){
     let state = {
       unitType: 2,
       benchmarks: null
     };
      return state;
   },
   getRankInitialState(){
     let state = {
       order: 1,
       range: 3,
       selectedChartType:'column'
     };
     return state;
   },
   getLabelInitialState(analysisPanel){
     var selectedLabelItem = analysisPanel.initSlectedLabelItem();
     let state = {
       labelType: "industryZone",//industry,customized
       industyMenuItems: [],
       customerMenuItems: [],
       selectedLabelItem: selectedLabelItem,
       kpiTypeValue: 0,
       labelDisable: true,
       kpiTypeDisable: false
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
     }else if(chartType === 'pie'){
        let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
        analysisPanel.state.chartStrategy.getPieEnergyDataFn(timeRanges, 2, nodeOptions, relativeDateValue);
     }else if(chartType === 'rawdata'){
       let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
       analysisPanel.state.chartStrategy.getEnergyRawDataFn(timeRanges, 0, nodeOptions, relativeDateValue);
     }
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

     //let chartType = analysisPanel.state.selectedChartType;
     let unitType = analysisPanel.state.unitType;
     analysisPanel.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, nodeOptions, unitType, relativeDateValue, analysisPanel);
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
   }
 },
 setFitStepAndGetDataFnStrategy:{
   setFitStepAndGetData(startDate, endDate, tagOptions, relativeDate, analysisPanel){
     let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
         step = analysisPanel.state.step,
         limitInterval = CommonFuns.getLimitInterval(timeRanges),
         stepList = limitInterval.stepList;
     if( stepList.indexOf(step) == -1){
       step = limitInterval.display;
     }
     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, relativeDate);
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
   setRankTypeAndGetData(startDate, endDate, tagOptions, relativeDate, analysisPanel){
     let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
     let rankType = analysisPanel.refs.rankType.state.selectedIndex + 1;

     analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, rankType, tagOptions, relativeDate);
   }
 },
 searchBarGenFnStrategy:{
   energySearchBarGen(analysisPanel){
     var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel,['line','column','stack','pie','rawdata']);
     var configBtn = ChartStrategyFactor.getConfigBtn(analysisPanel);

     return <div className={'jazz-alarm-chart-toolbar-container'}>
       <div className={'jazz-full-border-dropdownmenu-relativedate-container'} >
         <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'92px'}} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
       </div>
       <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
       <div className={'jazz-flat-button'}>
         {searchButton}
         {configBtn}
         <RaisedButton label='导出' onClick={analysisPanel.exportChart}></RaisedButton>
       </div>
   </div>;
  },
  unitEnergySearchBarGen(analysisPanel){
     var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel,['line','column']);
     var units  = [{text: '单位人口', name:'UnitPopulation', value: 2}, {text:'单位面积',name:'UnitArea', value: 3},{text:'单位供冷面积',name:'UnitColdArea', value: 4},
                   {text:'单位采暖面积',name:'UnitWarmArea', value: 5},{text:'单位客房',name:'UnitRoom', value: 7},{text:'单位已用客房',name:'UnitUsedRoom', value: 8},
                   {text:'单位床位',name:'UnitBed', value: 9},{text:'单位已用床位',name:'UnitUsedBed', value: 10}];
     return <div className={'jazz-alarm-chart-toolbar-container'}>
       <div className={'jazz-full-border-dropdownmenu-relativedate-container'} >
         <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'92px'}} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
       </div>
       <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
       <DropDownMenu menuItems={units} onChange={(e, selectedIndex, menuItem)=>{analysisPanel.setState({unitType: menuItem.value});}}></DropDownMenu>
       <div className={'jazz-flat-button'}>
         {searchButton}
       </div>
   </div>;
  },
  rankSearchBarGen(analysisPanel){
    return <div className={'jazz-alarm-chart-toolbar-container'}>
      <div className={'jazz-full-border-dropdownmenu-relativedate-container'} >
        <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'92px'}} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
      </div>
      <DateSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
      <div className={'jazz-full-border-dropdownmenu-ranktype-container'} >
        <DropDownMenu menuItems={rankTypeItem} ref='rankType' style={{width:'140px'}} onChange={analysisPanel._onRankTypeChange}></DropDownMenu>
      </div>
      <div className={'jazz-flat-button'}>
        <RaisedButton label="查看" onClick={analysisPanel.onSearchDataButtonClick}></RaisedButton>
      </div>
    </div>;
  },
  labelSearchBarGen(analysisPanel){
    var yearPickerStyle = {
      width: '128px',
      height: '32px',
      lineHeight: '32px',
      border: '1px solid #efefef',
      margin: '14px 0px 0px 10px',
      fontSize: '15px',
      color: '#b3b3b3',
      textAlign: 'center'
    };
    var curYear = (new Date()).getFullYear();
    var selectYear = curYear + '年';
    var yearProps = {
      ref: "yearSelector",
      selectedIndex: 10,
      style: {
        border: '1px solid #efefef',
        margin: '14px 0px 0px 10px'
      }
    };
    var YearSelect = <YearPicker {...yearProps}/>;
    var labelBtn = ChartStrategyFactor.getLabelBtn(analysisPanel);
    var kpiTypeBtn = ChartStrategyFactor.getKpiTypeBtn(analysisPanel);
    return <div className={'jazz-alarm-chart-toolbar-container'}>
      {YearSelect}
      <div className={'jazz-full-border-dropdownmenu-month-container'} >
        <DropDownMenu menuItems={monthItem} ref='monthSelector'></DropDownMenu>
      </div>
      {labelBtn}
      <div className={'jazz-full-border-dropdownmenu-ranktype-container'} >
        <DropDownMenu menuItems={kpiTypeItem} ref='kpiType' onChange={analysisPanel.onChangeKpiType}></DropDownMenu>
      </div>
      <div className={'jazz-flat-button'}>
        <RaisedButton label="查看" onClick={analysisPanel.onSearchDataButtonClick}></RaisedButton>
      </div>
    </div>;
  }
 },
 getSelectedNodesFnStrategy:{
   getSelectedTagList(){
     return AlarmTagStore.getSearchTagList();
   },
   getSelectedList(){
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
   unitEnergyDataLoad(timeRanges, step, tagOptions, unitType, relativeDate){
     EnergyAction.getUnitEnergyTrendChartData(timeRanges, step, tagOptions, unitType, relativeDate);
   },
   rankDataLoad(timeRanges, rankType, tagOptions, relativeDate){
     RankAction.getRankTrendChartData(timeRanges, rankType, tagOptions, relativeDate);
   },
   labelDataLoad(viewOption, tagOptions, benchmarkOption, labelingType){
     LabelAction.getLabelChartData(viewOption, tagOptions, benchmarkOption, labelingType);
   }
 },
 getPieEnergyDataFnStrategy:{
   pieEnergyDataLoad(timeRanges, step, tagOptions, relativeDate){
     EnergyAction.getPieEnergyData(timeRanges, step, tagOptions, relativeDate);
   }
 },
 getEnergyRawDataFnStrategy:{
   getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize){
     EnergyAction.getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize);
   }
 },
 getChartComponentFnStrategy:{
   getEnergyChartComponent(analysisPanel){
     let energyPart;
     let chartType = analysisPanel.state.selectedChartType;
     if(chartType === 'rawdata'){
       let properties = {energyData: analysisPanel.state.energyData,
                         energyRawData: analysisPanel.state.energyRawData,
                         chartStrategy: analysisPanel.state.chartStrategy };
       energyPart = <div style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px', overflow:'hidden'}}>
                      <GridComponent {...properties}></GridComponent>
                    </div>;
     }else if(chartType === 'pie'){
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
                       <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
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
                       <div style={{display:'flex'}}>
                         <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog}/>
                         <StepSelector stepValue={analysisPanel.state.step}      onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
                       </div>
                       <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                     </div>;
     }

      return energyPart;
   },
   getRankChartComponent(analysisPanel){
     let energyPart;
     var orderCombo = <DropDownMenu menuItems={orderItem} ref='orderCombo' onChange={analysisPanel._onOrderChange}></DropDownMenu>;
     var rangeCombo = <DropDownMenu menuItems={rangeItem} ref='rangeCombo' onChange={analysisPanel._onRangeChange}></DropDownMenu>;
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
                     <div style={{display:'flex'}}>
                       <YaxisSelector initYaxisDialog={analysisPanel._initYaxisDialog}/>
                       <div className='jazz-energy-step'>
                         {orderCombo}
                         {rangeCombo}
                       </div>
                     </div>
                     <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                   </div>;
      return energyPart;
   },
   getLabelChartComponent(analysisPanel){
     let energyPart;
     let chartCmpObj ={ref:'ChartComponent',
                       bizType:analysisPanel.props.bizType,
                       energyData: analysisPanel.state.energyData,
                       ctWidth: 1600,
                       ctHeight: 370,
                       energyRawData: analysisPanel.state.energyRawData,
                       onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
                       onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
                     };

      energyPart = <div ref="chartContainer" style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px'}}>
                     <LabelChartComponent ref="chartComponent" {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                   </div>;
      return energyPart;
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
   unitEnergyBindStoreListeners(analysisPanel){
     EnergyStore.addEnergyDataLoadingListener(analysisPanel._onLoadingStatusChange);
     EnergyStore.addEnergyDataLoadedListener(analysisPanel._onEnergyDataChange);
     EnergyStore.addEnergyDataLoadErrorListener(analysisPanel._onGetEnergyDataError);
     TagStore.addBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
     LabelMenuStore.addHierNodeChangeListener(analysisPanel._onHierNodeChange.bind(analysisPanel,analysisPanel));
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
   unitEnergyUnbindStoreListeners(analysisPanel){
     EnergyStore.removeEnergyDataLoadingListener(analysisPanel._onLoadingStatusChange);
     EnergyStore.removeEnergyDataLoadedListener(analysisPanel._onEnergyDataChange);
     EnergyStore.removeEnergyDataLoadErrorListener(analysisPanel._onGetEnergyDataError);
     TagStore.removeBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
     LabelMenuStore.removeLabelDataLoadingListener(analysisPanel._onHierNodeChange.bind(analysisPanel,analysisPanel));
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
     let tagOptions = EnergyStore.getTagOpions();
     let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
     let viewOption = EnergyStore.getSubmitParams().viewOption;
     let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions);

     let seriesNumber = EnergyStore.getEnergyData().get('Data').size;
     let charTypes = [];
     for(let i=0;i<seriesNumber;i++){
       charTypes.push(analysisPanel.state.selectedChartType);
     }

     ExportChartAction.getTagsData4Export(tagIds, viewOption, nodeNameAssociation,'能耗分析',charTypes);
   }
 },
 getSearchBtn(analysisPanel, types){
   let menuMap = { line:{primaryText:'折线图'},
                   column:{primaryText:'柱状图'},
                   stack:{primaryText:'堆积图'},
                   pie:{primaryText:'饼状图'},
                   rawdata:{primaryText:'原始数据'}};

   let typeItems = types.map((item)=>{
     return <MenuItem primaryText={menuMap[item].primaryText} value={item}/>;
   });
   var searchButton = <ButtonMenu label='查看' onButtonClick={analysisPanel.onSearchDataButtonClick} desktop={true}
     value={analysisPanel.state.selectedChartType} onItemTouchTap={analysisPanel._onSearchBtnItemTouchTap}>
      {typeItems}
    </ButtonMenu>;
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
    if(!analysisPanel.state.kpiTypeDisable){
      kpiTypeButton = <DropDownMenu menuItems={kpiTypeItem} onChange={analysisPanel.onChangeKpiStyle}
        ref='kpiType'></DropDownMenu>;
      }
    else{
      kpiTypeButton = <span>{kpiTypeItem[analysisPanel.state.kpiTypeValue].text}</span>;
    }
    return kpiTypeButton;
  },
  getConfigBtn(analysisPanel){
    let calendarSubItems = [{ primaryText:'非工作时间', value:'noneWorkTime'},
                            {primaryText:'冷暖季', value:'hotColdSeason'}];
    let weatherSubItems = [ {primaryText:'温度', value:'temperature'},
                            {primaryText:'湿度', value:'humidity'}];

    let configButton =<ButtonMenu label='辅助对比' style={{marginLeft:'10px'}} desktop={true}
                                 onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
      <MenuItem primaryText="历史对比" value='history'/>
      <MenuItem primaryText="基准值设置" value='config' disabled={analysisPanel.state.baselineBtnStatus}/>
      <MenuDivider />
      <MenuItem primaryText="数据求和" value='sum'/>
      <ExtendableMenuItem primaryText="日历背景色" value='background' subItems={calendarSubItems}/>
      <ExtendableMenuItem primaryText="天气信息" value='weather' subItems = {weatherSubItems}/>

    </ButtonMenu>;

    return configButton;
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
