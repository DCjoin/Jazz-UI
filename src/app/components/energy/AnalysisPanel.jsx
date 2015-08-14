'use strict';
import React from "react";
import Immutable from 'immutable';
import assign from "object-assign";
import {FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress} from 'material-ui';

import CommonFuns from '../../util/Util.jsx';
import ChartStrategyFactor from './ChartStrategyFactor.jsx';
import ChartMixins from './ChartMixins.jsx';
import TagStore from '../../stores/TagStore.jsx';
import RankStore from '../../stores/RankStore.jsx';
import LabelMenuStore from '../../stores/LabelMenuStore.jsx';
import EnergyStore from '../../stores/energy/EnergyStore.jsx';
import ErrorStepDialog from '../alarm/ErrorStepDialog.jsx';
import GlobalErrorMessageAction from '../../actions/GlobalErrorMessageAction.jsx';

let MenuItem = require('material-ui/lib/menus/menu-item');

const searchDate = [{value:'Customerize',text:'自定义'},{value: 'Last7Day', text: '最近7天'}, {value: 'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
 {value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'}, {value: 'LastWeek', text: '上周'},
 {value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];

let AnalysisPanel = React.createClass({
    mixins:[ChartMixins],
    propTypes:{
      chartTitle:  React.PropTypes.string,
      bizType: React.PropTypes.oneOf(['Energy', 'Unit','Ratio','Label','Rank'])
    },
    getDefaultProps(){
      return {
        bizType:'Energy'
      };
    },
    getInitialState(){
      let chartStrategy = ChartStrategyFactor.getStrategyByStoreType(this.props.bizType);
      let state = {
        isLoading: false,
        energyData: null,
        energyRawData: null,
        hierName: null,
        submitParams: null,
        step: null,
        dashboardOpenImmediately: false,
        baselineBtnStatus:TagStore.getBaselineBtnDisabled(),
        selectedChartType:'line',
        energyType:'energy',//'one of energy, cost carbon'
        chartStrategy: chartStrategy
      };

      var obj = chartStrategy.getInitialStateFn();

      assign(state, obj);

      if(this.props.chartTitle){
        state.chartTitle = this.props.chartTitle;
      }
      return state;
    },
    render(){
      let me = this, errorDialog, energyPart = null;

      if(me.state.errorObj){
        errorDialog = <ErrorStepDialog {...me.state.errorObj} onErrorDialogAction={me._onErrorDialogAction}></ErrorStepDialog>;
      }else{
        errorDialog = <div></div>;
      }

      if(this.state.isLoading){
        energyPart = <div style={{margin:'auto',width:'100px'}}>
          <CircularProgress  mode="indeterminate" size={2} />
        </div>;
      }else if(!!this.state.energyData){
        energyPart = this.state.chartStrategy.getChartComponentFn(me);
      }

      return <div style={{flex:1, display:'flex','flex-direction':'column', backgroundColor:'#fbfbfb'}}>
        <div style={{margin:'20px 35px'}}>最近7天能耗分析</div>
        <div className={'jazz-alarm-chart-toolbar-container'}>
            {me.getEnergyTypeCombo()}
            {me.state.chartStrategy.searchBarGenFn(me)}
        </div>
        {energyPart}
        {errorDialog}
      </div>;
    },
    componentDidMount: function() {
      let me = this;
      let date = new Date();
      date.setHours(0,0,0);
      let last7Days = CommonFuns.dateAdd(date, -7, 'days');
      let endDate = CommonFuns.dateAdd(date, 0, 'days');
      this.refs.relativeDate.setState({selectedIndex: 1});
      this.refs.dateTimeSelector.setDateField(last7Days, endDate);
      this.state.chartStrategy.getAllDataFn();
      this.state.chartStrategy.bindStoreListenersFn(me);
    },
    componentWillUnmount: function() {
      let me = this;
      this.state.chartStrategy.unbindStoreListenersFn(me);
    },
    _onErrorDialogAction(step){
      this.setState({errorObj:null});
      if(step !== 'cancel'){
        this._onStepChange(step);
      }
    },
    getEnergyTypeCombo(){
      let types = [{text:'能耗',value:'energy'},{text:'成本',value:'cost'},{text:'碳排放',value:'carbon'}];
      return <DropDownMenu menuItems={types} onChange={this.state.chartStrategy.onEnegyTypeChangeFn}></DropDownMenu>;
    },
    _onStepChange(step){
      let tagOptions = EnergyStore.getTagOpions(),
          paramsObj = EnergyStore.getParamsObj(),
          timeRanges = paramsObj.timeRanges;

      this.setState({step:step});
      this.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false);
    },
    _onDateSelectorChanged(){
      this.refs.relativeDate.setState({selectedIndex:0});
    },
    _onLoadingStatusChange(){
      let isLoading = EnergyStore.getLoadingStatus(),
          paramsObj = EnergyStore.getParamsObj(),
          tagOption = EnergyStore.getTagOpions()[0],
          obj = assign({}, paramsObj);

      obj.isLoading = isLoading;
      obj.tagName = tagOption.tagName;
      obj.dashboardOpenImmediately = false;
      obj.tagOption = tagOption;
      obj.energyData = null;

      this.setState(obj);
    },
    _onRankLoadingStatusChange(){
      let isLoading = RankStore.getLoadingStatus(),
          paramsObj = RankStore.getParamsObj(),
          selectedList = RankStore.getSelectedList(),
          obj = assign({}, paramsObj);

      obj.isLoading = isLoading;
      obj.dashboardOpenImmediately = false;
      obj.selectedList = selectedList;
      obj.energyData = null;

      this.setState(obj);
    },
    _onEnergyDataChange(isError, errorObj){
      let isLoading = EnergyStore.getLoadingStatus(),
          energyData = EnergyStore.getEnergyData(),
          energyRawData = EnergyStore.getEnergyRawData(),
          paramsObj = assign({},EnergyStore.getParamsObj()),
          state = { isLoading: isLoading,
                    energyData: energyData,
                    energyRawData: energyRawData,
                    paramsObj: paramsObj,
                    dashboardOpenImmediately: false};
      if(isError === true){
        state.step = null;
        state.errorObj = errorObj;
      }
      this.setState(state);
    },
    _onRankDataChange(isError, errorObj){
      let isLoading = RankStore.getLoadingStatus(),
          energyData = RankStore.getEnergyData(),
          energyRawData = RankStore.getEnergyRawData(),
          paramsObj = assign({},EnergyStore.getParamsObj()),
          state = { isLoading: isLoading,
                    energyData: energyData,
                    energyRawData: energyRawData,
                    paramsObj: paramsObj,
                    dashboardOpenImmediately: false};
      if(isError === true){
        state.errorObj = errorObj;
      }
      this.setState(state);
    },
    onSearchDataButtonClick(){
      this.state.chartStrategy.onSearchDataButtonClickFn(this);
    },
    exportChart(){
        this.state.chartStrategy.exportChartFn(this);
    },
    _getRelativeDateValue(){
      let relativeDateIndex = this.refs.relativeDate.state.selectedIndex,
          obj = searchDate[relativeDateIndex];
      return obj.value;
    },
    _setFitStepAndGetData(startDate, endDate, tagOptions, relativeDate){
      this.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, tagOptions, relativeDate. this);
    },
    _onRelativeDateChange(e, selectedIndex, menuItem){
      let value = menuItem.value,
          dateSelector = this.refs.dateTimeSelector;

      if(value && value !=='Customerize'){
        var timeregion = CommonFuns.GetDateRegion(value.toLowerCase());
        dateSelector.setDateField(timeregion.start, timeregion.end);
      }
    },
    _onRangeChange(e, selectedIndex, menuItem){
      var range = parseInt(menuItem.value);
      this.setState({range: range});
    },
    _onOrderChange(e, selectedIndex, menuItem){
      var order = selectedIndex + 1;
      this.setState({order: order});
    },
    _onGetEnergyDataError(){
      let errorObj = this.errorProcess();
      this._onEnergyDataChange(true, errorObj);
    },
    _onGetRankDataError(){
      let errorObj = this.errorProcess();
      this._onRankDataChange(true, errorObj);
    },
    errorProcess(){
      let code = EnergyStore.getErrorCode(),
          messages = EnergyStore.getErrorMessage();

      if (code.toString() == '02004') {
          let errorObj = this.showStepError(messages[0]);
          return errorObj;
      }else{
        let errorMsg = CommonFuns.getErrorMessage(code);
        setTimeout(()=>{
          GlobalErrorMessageAction.fireGlobalErrorMessage(errorMsg);
        },0);
        return null;
      }
    },
    showStepError(step){
      let btns = [], msg = [], map = { Hour: 1, Day: 2, Week: 5, Month: 3, Year: 4 },
          paramsObj = EnergyStore.getParamsObj(),
          timeRanges = paramsObj.timeRanges,
          limitInterval = CommonFuns.getLimitInterval(timeRanges),
          availableList = limitInterval.stepList;

      switch (step) {
        case 'Hourly':
            btns = ['Hour', 'Day', 'Week'];
            msg = ['UseRaw'];
            break;
        case 'Daily':
            btns = ['Day', 'Week', 'Month'];
            msg = ['UseHour'];
            break;
        case 'Weekly':
            btns = ['Week', 'Month', 'Year'];
            msg = ['UseHour', 'UseDay'];
            break;
        case 'Monthly':
            btns = ['Month', 'Year'];
            msg = ['UseHour', 'UseDay', 'UseWeek'];
            break;
        case 'Yearly':
            btns = ['Year'];
            msg = ['UseHour', 'UseDay', 'UseMonth'];
            break;
      }
      var newBtns = [];
      btns.forEach(btn => {
        let code = map[btn];
        if( availableList.indexOf(code) != -1){
         newBtns.push({text: btn, code:code});
        }
      });
      btns = newBtns;
      var msg1 = [];
      msg.forEach(item =>{
        msg1.push('"' + I18N.EM[item] + '"');
      });
      return {stepBtnList: btns, errorMessage: I18N.format(I18N.EM.StepError, msg1.join(','))};
    },
    _onBaselineBtnDisabled:function(){
      this.setState({
          baselineBtnStatus:TagStore.getBaselineBtnDisabled()
      });
    },
    _onSearchBtnItemTouchTap(e, child){
      //this.setState({selectedChartType:child.props.value});
      this.state.chartStrategy.onSearchBtnItemTouchTapFn(this.state.selectedChartType, child.props.value, this);
    },
    getIndustyLabelMenu(){
      var labelItems = this.state.industyLabelMenuItems;
      var labelMenuItems = labelItems.map(function(item) {
        let props = {
          value: item.value,
          primaryText: item.text
        };
        return (
          <MenuItem {...props}/>
        );
      });
    },
    getIndustyLabelItems(){
      var industryStore = LabelMenuStore.getIndustryData();
      var labelingsStore = LabelMenuStore.getLabelData();
      var zoneStore = LabelMenuStore.getZoneData();
      var hierNode = LabelMenuStore.getHierNode();
      var industryId, zoneId, parentId, items = [];
      if(!!hierNode){
        industryId = hierNode.industryId;
        zoneId = hierNode.zoneId;
        if(hierNode.Type !== 2){
          return;
        }
        this.addIndustyLabelItem(labelingsStore, industryId, zoneId);
        var industryNode = industryStore.find((item, index)=>{
          return (item.Id === industryId);
        });
        parentId = industryNode.ParentId;
        if(parentId !== 0) {
          this.addIndustyLabelItem(labelingsStore, parentId, zoneId);
        }
        this.addIndustyLabelItem(labelingsStore, 0, zoneId);
      }
    },
    addIndustyLabelItem(labelingsStore, industryId, zoneId){
      let labelItem = null;
      labelItem = labelingsStore.find((item, index)=>{
        return (item.IndustryId === industryId && item.ZoneId === zoneId);
      });
      if(!!labelItem){
        this.pushIndustryLabelItem(industryId, zoneId, labelItem);
      }
      labelItem = labelingsStore.find((item, index)=>{
        return (item.IndustryId === industryId && item.ZoneId === 0);
      });
      if(!!labelItem){
        this.pushIndustryLabelItem(industryId, 0, labelItem);
      }
    },
    pushIndustryLabelItem(industryId, zoneId, labelItem){
      var labelMenuItem = {};
      labelMenuItem.industryId = industryId;
      labelMenuItem.ZoneId = zoneId;
      labelMenuItem.text = labelItem.ZoneComment + labelItem.IndustryComment;
      labelMenuItem.value = "" + zoneId + "/" + industryId;
      var labelMenuItems = this.state.industyLabelMenuItems;
      labelMenuItems.push(labelMenuItem);
      this.setState({industyLabelMenuItems: labelMenuItems});
    }
});

module.exports = AnalysisPanel;
