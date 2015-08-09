'use strict';
import React from "react";
import assign from "object-assign";
import _ from 'lodash';
import {FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress} from 'material-ui';

import CommonFuns from '../../util/Util.jsx';
import DateTimeSelector from '../../controls/DateTimeSelector.jsx';
import ButtonMenu from '../../controls/ButtonMenu.jsx';
import ExtendableMenuItem from '../../controls/ExtendableMenuItem.jsx';
import AlarmTagStore from '../../stores/AlarmTagStore.jsx';
import GlobalErrorMessageAction from '../../actions/GlobalErrorMessageAction.jsx';
import EnergyAction from '../../actions/EnergyAction.jsx';
import YaxisSelector from './YaxisSelector.jsx';
import StepSelector from './StepSelector.jsx';
import ChartComponentBox from './ChartComponentBox.jsx';
import EnergyStore from '../../stores/energy/EnergyStore.jsx';
import TagStore from '../../stores/TagStore.jsx';

let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');

const searchDate = [{value:'Customerize',text:'自定义'},{value: 'Last7Day', text: '最近7天'}, {value: 'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
 {value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'}, {value: 'LastWeek', text: '上周'},
 {value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];

let ChartStrategyFactor = {
 defaultStrategy: {

 },
 strategyConfiguration: {
    // 碳排放
    Energy: {
      searchBarGenFn:'energySearchBarGen',
      getSelectedNodesFn:'getSelectedTagList',
      onSearchDataButtonClickFn:'onSearchDataButtonClick',
      onSearchBtnItemTouchTapFn:'onSearchBtnItemTouchTap',
      initEnergyStoreByBizChartTypeFn:'initEnergyStoreByBizChartType',
      setFitStepAndGetDataFn:'setFitStepAndGetData',
      getEnergyDataFn:'energyDataLoad',
      getPieEnergyDataFn:'pieEnergyDataLoad',
      getChartComponentFn:'getEnergyChartComponent',
      bindStoreListenersFn:'energyBindStoreListeners',
      unbindStoreListenersFn:'energyUnbindStoreListeners',
      canShareDataWithFn:'canShareDataWith'
    },
    MultiIntervalDistribution:{

    },RatioUsage:{

    },UnitEnergyUsage:{

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
     }
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
     }
   }
 },
 onSearchBtnItemTouchTapFnStrategy:{
   onSearchBtnItemTouchTap(curChartType, nextChartType, analysisPanel){
     if(analysisPanel.state.chartStrategy.canShareDataWithFn(curChartType, nextChartType)){
       analysisPanel.setState({selectedChartType:nextChartType});
     }else if(nextChartType === 'pie'){
       analysisPanel.setState({selectedChartType:nextChartType}, function(){analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);});
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
   }
 },
 searchBarGenFnStrategy:{
   energySearchBarGen(analysisPanel){
     var searchButton = ChartStrategyFactor.getSearchBtn(analysisPanel);
     var configBtn = ChartStrategyFactor.getConfigBtn(analysisPanel);

     return <div className={'jazz-alarm-chart-toolbar-container'}>
       <div className={'jazz-full-border-dropdownmenu-relativedate-container'} >
         <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'92px'}} onChange={analysisPanel._onRelativeDateChange}></DropDownMenu>
       </div>
       <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={analysisPanel._onDateSelectorChanged}/>
       <div className={'jazz-flat-button'}>
         {searchButton}
         {configBtn}
       </div>
   </div>;
   }
 },
 getSelectedNodesFnStrategy:{
   getSelectedTagList(){
     return  AlarmTagStore.getSearchTagList();
   }
 },
 getEnergyDataFnStrategy:{
   energyDataLoad(timeRanges, step, tagOptions, relativeDate){
     EnergyAction.getEnergyTrendChartData(timeRanges, step, tagOptions, relativeDate);
   }
 },
 getPieEnergyDataFnStrategy:{
   pieEnergyDataLoad(timeRanges, step, tagOptions, relativeDate){
     EnergyAction.getPieEnergyData(timeRanges, step, tagOptions, relativeDate);
   }
 },
 getChartComponentFnStrategy:{
   getEnergyChartComponent(analysisPanel){
     let energyPart;
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
                       <StepSelector stepValue={analysisPanel.state.step} onStepChange={analysisPanel._onStepChange} timeRanges={analysisPanel.state.timeRanges}/>
                     </div>
                     <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
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
   }
 },
 bindStoreListenersFnStrategy:{
   energyBindStoreListeners(analysisPanel){
     EnergyStore.addEnergyDataLoadingListener(analysisPanel._onLoadingStatusChange);
     EnergyStore.addEnergyDataLoadedListener(analysisPanel._onEnergyDataChange);
     EnergyStore.addEnergyDataLoadErrorListener(analysisPanel._onGetEnergyDataError);
     TagStore.addBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
   }
 },
 unbindStoreListenersFnStrategy:{
   energyUnbindStoreListeners(analysisPanel){
     EnergyStore.removeEnergyDataLoadingListener(analysisPanel._onLoadingStatusChange);
     EnergyStore.removeEnergyDataLoadedListener(analysisPanel._onEnergyDataChange);
     EnergyStore.removeEnergyDataLoadErrorListener(analysisPanel._onGetEnergyDataError);
     TagStore.removeBaselineBtnDisabledListener(analysisPanel._onBaselineBtnDisabled);
   }
 },

 getSearchBtn(analysisPanel){
   var searchButton = <ButtonMenu label='查看' onButtonClick={analysisPanel.onSearchDataButtonClick} desktop={true}
     value={analysisPanel.state.selectedChartType} onItemTouchTap={analysisPanel._onSearchBtnItemTouchTap}>
      <MenuItem primaryText="折线图" value='line'/>
      <MenuItem primaryText="柱状图"  value='column'/>
      <MenuItem primaryText="堆积图"  value='stack'/>
      <MenuItem primaryText="饼状图"  value='pie'/>
      <MenuItem primaryText="原始数据"  value='rawdata'/>
   </ButtonMenu>;
   return searchButton;
 },
 getConfigBtn(analysisPanel){
   let configButton =<ButtonMenu label='辅助对比' style={{marginLeft:'10px'}} desktop={true}
                                 onItemTouchTap={analysisPanel._onConfigBtnItemTouchTap}>
     <MenuItem primaryText="历史对比" value='history'/>
     <MenuItem primaryText="基准值设置" value='config' disabled={analysisPanel.state.baselineBtnStatus}/>
     <MenuDivider />
     <MenuItem primaryText="数据求和" value='sum'/>
     <ExtendableMenuItem primaryText="日历背景色" value='background'>
       <Menu>
         <MenuItem primaryText="非工作时间" value='noneWorkTime'/>
         <MenuItem primaryText="冷暖季" value='hotColdSeason'/>
       </Menu>
     </ExtendableMenuItem>
     <ExtendableMenuItem primaryText="天气信息" value='weather'>
               <Menu>
                 <MenuItem primaryText="温度" value='temperature'/>
                 <MenuItem primaryText="湿度" value='humidity'/>
               </Menu>
             </ExtendableMenuItem>
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
