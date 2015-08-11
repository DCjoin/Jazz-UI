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
import EnergyStore from '../../stores/energy/EnergyStore.jsx';
import ErrorStepDialog from '../alarm/ErrorStepDialog.jsx';

const searchDate = [{value:'Customerize',text:'自定义'},{value: 'Last7Day', text: '最近7天'}, {value: 'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
 {value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'}, {value: 'LastWeek', text: '上周'},
 {value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];

let AnalysisPanel = React.createClass({
    mixins:[ChartMixins],
    propTypes:{
      chartTitle:  React.PropTypes.string,
      bizType: React.PropTypes.oneOf(['Energy', 'Unit','Ratio','Labelling','Rank'])
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
        selectedChartType:'column',
        energyType:'energy',//'one of energy, cost carbon'
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
      if(this.props.bizType === "Rank"){
        this.state.chartStrategy.getInitialStateFn(this);
      }

      this.state.chartStrategy.bindStoreListenersFn(me);
    },
    componentWillUnmount: function() {
      let me = this;
      this.state.chartStrategy.unbindStoreListenersFn(me);
    },
    getEnergyTypeCombo(){
      let types = [{text:'能耗',value:'energy'},{text:'成本',value:'cost'},{text:'碳排放',value:'carbon'}];
      return <DropDownMenu menuItems={types}></DropDownMenu>;
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
    _onOrderChange(order){
       if (!this.chartObj) {
            this.order = order;
            return;
        }
        var series = this.chartObj.series[0];
        if (!series) return;
        var list = series.options.option.list;
        var data = [];
        for (var i = 0; i < list.length; ++i) {
            data.unshift(list[i].val);
        }
        list.reverse();


        this.order = order;
        var config = { xAxis: {} };


        series.options.option.list = this.makePosition(list);
        //don't redraw
        this.chartObj.series[0].setData(data, false);
        //redraw with animiation
        var range = this.range;
        if (this.range == 1000) {
            range = data.length - 1;
        }

        if (list.length < this.range) {

            if (list.length > 1) {
                range = list.length - 1;
            }
            else {
                range = 1;
            }

        }
        this.chartObj.xAxis[0].setExtremes(0, range, true, true);
    },
    _onRangeChange(range){
      if (range == this.range) return;
        if (!this.chartObj) {
            this.range = range - 1;
            return;
        }
        var r = range;

        //var ext = this.chartObj.xAxis[0].getExtremes();
        //var min = ext.min, max = ext.max;
        var oldRange = this.range;
        var list = this.chartObj.series[0].options.option.list;

        if (list.length <= 10) return;

        var dataMax = list.length - 1;
        this.range = range - 1;
        var min = this.minPosition, max = 0;
        //this.minPosition = Math.floor(min) + 1;
        if (range == 1000) {
            min = 0;
            max = dataMax;
            r = range;
        }
        else {
            if (oldRange == 999) {
                min = 0;
                max = this.range;
                if (max > dataMax) {
                    max = dataMax;
                }
            }
            else {
                var delta = this.range - oldRange;


                //if (delta < 0) {
                max = this.minPosition + this.range;
                //}
                //else {
                //    max = max + delta;
                //}
                if (max > dataMax) {
                    min = min - (max - dataMax);
                    if (min < 0) min = 0;
                    max = dataMax;
                }

            }

        }
        //this.minPosition = Math.floor(min) + 1;
        this.maxPosition = max;
        this.chartObj.xAxis[0].setExtremes(min, max, true, true, { changeRange: true });
    },
    _onGetEnergyDataError(){
      let errorObj = this.errorProcess();
      this._onEnergyDataChange(true, errorObj);
    },
    _onGetRankDataError(){
      let errorObj = this.errorProcess();
      this._onRankDataChange(true, errorObj);
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
});

module.exports = AnalysisPanel;
