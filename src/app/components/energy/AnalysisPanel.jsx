'use strict';
import React from "react";
import Immutable from 'immutable';
import assign from "object-assign";
import {FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress} from 'material-ui';

import CommonFuns from '../../util/Util.jsx';
import ChartStrategyFactor from './ChartStrategyFactor.jsx';
import ChartMixins from './ChartMixins.jsx';
import TagStore from '../../stores/TagStore.jsx';
import EnergyStore from '../../stores/EnergyStore.jsx';
import ErrorStepDialog from '../alarm/ErrorStepDialog.jsx';

const searchDate = [{value:'Customerize',text:'自定义'},{value: 'Last7Day', text: '最近7天'}, {value: 'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
 {value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'}, {value: 'LastWeek', text: '上周'},
 {value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];

let ChartPanel = React.createClass({
    mixins:[ChartMixins],
    propTypes:{
      chartTitle:  React.PropTypes.string,
      busTypes: React.PropTypes.oneOf(['energy', 'unit','ratio','labelling','ranking'])
    },
    getDefaultProps(){
      return {
        busTypes:'energy'
      };
    },
    getInitialState(){
      let chartStrategy = ChartStrategyFactor.getStrategyByStoreType('Energy');
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
        chartStrategy: chartStrategy
      };
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
      let last7Days = CommonFuns.dateAdd(date, -6, 'days');
      let endDate = CommonFuns.dateAdd(date, 1, 'days');

      this.refs.dateTimeSelector.setDateField(last7Days, endDate);

      this.state.chartStrategy.bindStoreListenersFn(me);
    },
    componentWillUnmount: function() {
      let me = this;
      this.state.chartStrategy.unbindStoreListenersFn(me);
    },
    getEnergyTypeCombo(){
      let busTypes = [{text:'能耗',value:'energy'},{text:'成本',value:'cost'},{text:'碳排放',value:'carbon'}];
      return <DropDownMenu menuItems={busTypes}></DropDownMenu>;
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
    onSearchDataButtonClick(){
      let dateSelector = this.refs.dateTimeSelector,
          dateRange = dateSelector.getDateTime(),
          startDate = dateRange.start,
          endDate = dateRange.end,
          nodeOptions;

      if(startDate.getTime()>= endDate.getTime()){
         window.alert('请选择正确的时间范围');
        return;
      }

      nodeOptions = this.state.chartStrategy.getSelectedNodesFn();

      if( !nodeOptions || nodeOptions.length === 0){
        this.setState({energyData:null});
        return;
      }
      let relativeDateValue = this._getRelativeDateValue();
      this._setFitStepAndGetData(startDate, endDate, nodeOptions, relativeDateValue);
    },
    _getRelativeDateValue(){
      let relativeDateIndex = this.refs.relativeDate.state.selectedIndex,
          obj = searchDate[relativeDateIndex];
      return obj.value;
    },
    _setFitStepAndGetData(startDate, endDate, tagOptions, relativeDate){
      let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
          step = this.state.step,
          limitInterval = CommonFuns.getLimitInterval(timeRanges),
          stepList = limitInterval.stepList;
      if( stepList.indexOf(step) == -1){
        step = limitInterval.display;
      }
      this.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, relativeDate);
    },
    _onRelativeDateChange(e, selectedIndex, menuItem){
      let value = menuItem.value,
          dateSelector = this.refs.dateTimeSelector;

      if(value && value !=='Customerize'){
        var timeregion = CommonFuns.GetDateRegion(value.toLowerCase());
        dateSelector.setDateField(timeregion.start, timeregion.end);
      }
    },
    _onGetEnergyDataError(){
      let errorObj = this.errorProcess();
      this._onEnergyDataChange(true, errorObj);
    },
    _onBaselineBtnDisabled:function(){
      this.setState({
          baselineBtnStatus:TagStore.getBaselineBtnDisabled()
      });
    },
    _onSearchBtnItemTouchTap(e, child){
      this.setState({selectedChartType:child.props.value});
    },
});

module.exports = ChartPanel;
