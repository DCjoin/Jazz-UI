'use strict';
import React from "react";
import Immutable from 'immutable';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, RaisedButton, DatePicker} from 'material-ui';
import assign from "object-assign";
import CommonFuns from '../../util/Util.jsx';
import EnergyStore from '../../stores/EnergyStore.jsx';
import AlarmTagStore from '../../stores/AlarmTagStore.jsx';
import TagStore from '../../stores/TagStore.jsx';

import YaxisSelector from '../energy/YaxisSelector.jsx';
import StepSelector from '../energy/StepSelector.jsx';
import ChartComponent from '../energy/ChartComponent.jsx';
import WidgetSaveWindow from '../energy/WidgetSaveWindow.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import AlarmTagAction from '../../actions/AlarmTagAction.jsx';
import TBSettingAction from '../../actions/TBSettingAction.jsx';
import DateTimeSelector from '../../controls/DateTimeSelector.jsx';

import BaselineCfg from '../setting/BaselineCfg.jsx';

let {hourPickerData, isArray, getUomById, JazzCommon, DataConverter, dateAdd} = CommonFuns;

const searchDate = [{value:'Customerize',text:'自定义'},{value: 'Last7Day', text: '最近7天'}, {value: 'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
 {value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'}, {value: 'LastWeek', text: '上周'},
 {value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];

let ChartPanel = React.createClass({
    mixins:[Navigation,State],
    propTypes:{
      isSettingChart: React.PropTypes.bool
    },
    childContextTypes:{
        muiTheme: React.PropTypes.object.isRequired
    },
    contextTypes: {
      muiTheme: React.PropTypes.object
    },
    getChildContext() {
      let childContext = assign({}, this.context.muiTheme);
      childContext.spacing = assign({}, childContext.spacing);
      childContext.spacing.desktopToolbarHeight = 32;

      return {
          muiTheme: childContext
      };
    },
    _onLoadingStatusChange(){
      let isSettingChart = this.props.isSettingChart;

      let isLoading = EnergyStore.getLoadingStatus();
      let paramsObj = EnergyStore.getParamsObj();
      let tagOption = EnergyStore.getTagOpions()[0];


      var obj = assign({},paramsObj);
      obj.isLoading = isLoading;
      obj.tagName = tagOption.tagName;
      obj.dashboardOpenImmediately = false;
      obj.tagOption = tagOption;

      if(!isSettingChart){
        let chartTitle = EnergyStore.getChartTitle();
        obj.chartTitle = chartTitle;
      }

      this.setState(obj);
    },
    componentDidUpdate(){
      if((!this.props.isSettingChart) && EnergyStore.getAlarmLoadingStatus()){
        let paramsObj = EnergyStore.getParamsObj();

        let startDate = CommonFuns.DataConverter.JsonToDateTime(paramsObj.startTime, false);
        let endDate = CommonFuns.DataConverter.JsonToDateTime(paramsObj.endTime, false);

        this.refs.dateTimeSelector.setDateField(startDate, endDate);
      }
    },
    _onEnergyDataChange(){
      let isLoading = EnergyStore.getLoadingStatus();
      let energyData = EnergyStore.getEnergyData();
      let energyRawData = EnergyStore.getEnergyRawData();
      let paramsObj = assign({},EnergyStore.getParamsObj());
      this.setState({ isLoading: isLoading,
                      energyData: energyData,
                      energyRawData: energyRawData,
                      paramsObj: paramsObj,
                      dashboardOpenImmediately: false});
    },
    _onStepChange(step){
      let tagOptions = EnergyStore.getTagOpions();
      let paramsObj = EnergyStore.getParamsObj();
      let timeRanges = paramsObj.timeRanges;

      this.setState({step:step, dashboardOpenImmediately: false});
      AlarmAction.getEnergyData(timeRanges, step, tagOptions, false);
    },
    _onNavigatorChangeLoad(){
      let tagOptions = EnergyStore.getTagOpions();
      let paramsObj = EnergyStore.getParamsObj();

      let dateSelector = this.refs.dateTimeSelector;
      let dateRange = dateSelector.getDateTime();

      let startDate = dateRange.start,
          endDate = dateRange.end;

      this._setFitStepAndGetData(startDate, endDate, tagOptions, false);
    },
    onSearchDataButtonClick(){
      let dateSelector = this.refs.dateTimeSelector;
      let dateRange = dateSelector.getDateTime();

      let startDate = dateRange.start,
          endDate = dateRange.end,
          userTagListSelect = AlarmTagStore.getUseTaglistSelect();
      let tagOptions;

      if(startDate.getTime()>= endDate.getTime()){
         window.alert('请选择正确的时间范围');
        return;
      }

      if(!userTagListSelect){
        tagOptions = EnergyStore.getTagOpions();
      }else{
        tagOptions = AlarmTagStore.getSearchTagList();
      }
      if( !tagOptions || tagOptions.length === 0){
        this.setState({energyData:null});
        return;
      }
      let relativeDateValue = this._getRelativeDateValue();
      this._setFitStepAndGetData(startDate, endDate, tagOptions, relativeDateValue);
    },
    _getRelativeDateValue(){
      let relativeDateIndex = this.refs.relativeDate.state.selectedIndex;
      let obj = searchDate[relativeDateIndex];
      return obj.value;
    },
    _setFitStepAndGetData(startDate, endDate, tagOptions, relativeDate){
      let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
      let step = this.state.step;

      let limitInterval = CommonFuns.getLimitInterval(timeRanges);
      let stepList = limitInterval.stepList;
      if( stepList.indexOf(step) == -1){
        step = limitInterval.display;
      }

      AlarmAction.getEnergyData(timeRanges, step, tagOptions, relativeDate);
    },
    _onChart2WidgetClick(){
        if(!!this.state.energyData){
          let contentSyntax = JSON.stringify(this.getContentSyntax());
          this.setState({ dashboardOpenImmediately: true,
                          contentSyntax: contentSyntax});
        }
    },
    _onRelativeDateChange(e, selectedIndex, menuItem){
      let value = menuItem.value;
      let dateSelector = this.refs.dateTimeSelector;

      if(value && value !=='Customerize'){
        var timeregion = CommonFuns.GetDateRegion(value.toLowerCase());
        dateSelector.setDateField(timeregion.start, timeregion.end);
      }
    },
    _onDateSelectorChanged(){
        this.refs.relativeDate.setState({selectedIndex:0});
    },
    getContentSyntax(){
      let tagOptions = EnergyStore.getTagOpions(), options;
      let relativeDate = EnergyStore.getRelativeDate();

      if(tagOptions){
        if(isArray(tagOptions)){
          options = [];
          for(let i=0,len=tagOptions.length; i<len; i++){
            let tag = tagOptions[i];
            options.push({Id:tag.tagId, Name: tag.tagName, HierId: tag.hierId, NodeName: tag.hierName});
          }
        } else{
          options = [{Id:tagOptions.tagId, Name: tagOptions.tagName, HierId: tagOptions.hierId, NodeName: tagOptions.hierName}];
        }
      }
      let submitParams = EnergyStore.getSubmitParams();

      if(relativeDate !== 'Customerize' && relativeDate !== null){
        let immutableSubmitParams = Immutable.fromJS(submitParams);
        let immutableSubmitParamsClone = immutableSubmitParams.setIn(['viewOption','TimeRanges'], [{relativeDate: relativeDate}]);
        submitParams = immutableSubmitParamsClone.toJS();
      }

      var contentSyntax = { xtype:'widgetcontainer',
                            params:{ submitParams:{ options: options,
                                                   tagIds: submitParams.tagIds,
                                                   interval:[],
                                                   viewOption:submitParams.viewOption
                                                 },
                                     config:{ type:"line",xtype:"mixedtrendchartcomponent",reader:"mixedchartreader",
                                              storeType:"energy.Energy",searcherType:"analysissearcher",
                                              widgetStyler:"widgetchartstyler",maxWidgetStyler:"maxchartstyler"}
                                   }
                          };
      return contentSyntax;
    },
    _initYaxisDialog(){
      var chartCmp = this.refs.ChartComponent;
      var chartObj = chartCmp.refs.highstock.getPaper();

      return chartObj;
    },
    onWidgetSaveWindowDismiss(){
      this.setState({dashboardOpenImmediately:false});
    },
    getInitialState() {
        let state = {
          isLoading: false,
          energyData: null,
          energyRawData: null,
          hierName: null,
          submitParams: null,
          step: null,
          dashboardOpenImmediately: false,
          baselineBtnStatus:TagStore.getBaselineBtnDisabled()
        };
        if(this.props.chartTitle){
          state.chartTitle = this.props.chartTitle;
        }
        return state;
    },
    render: function () {
      let me = this;
      let energyPart=null;
      let paramsObj = EnergyStore.getParamsObj();
      var startDate = null,
          endDate = null;
      if(paramsObj){
        startDate = CommonFuns.DataConverter.JsonToDateTime(paramsObj.startTime, false);
        endDate = CommonFuns.DataConverter.JsonToDateTime(paramsObj.endTime, false);
      }
      if(!me.state.chartTitle){
         return null;
      }

      if(this.state.isLoading){
        energyPart = <div style={{margin:'auto'}}>{'loading...'}</div>;
      }else if(!!this.state.energyData){
        let chartCmpObj ={ref:'ChartComponent',
                          energyData: this.state.energyData,
                          energyRawData: this.state.energyRawData,
                          onDeleteButtonClick: me._onDeleteButtonClick,
                          onDeleteAllButtonClick: me._onDeleteAllButtonClick};
        energyPart = <div style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px'}}>
                        <div style={{display:'flex'}}>
                          <YaxisSelector initYaxisDialog={me._initYaxisDialog}/>
                          <StepSelector stepValue={me.state.step} onStepChange={me._onStepChange} timeRanges={me.state.timeRanges}/>

                        </div>
                        <ChartComponent {...this.state.paramsObj} {...chartCmpObj} afterChartCreated={this._afterChartCreated}/>
                      </div>;
      }
      let title = <div className='jazz-alarm-chart-title'>
                    <span>{me.state.chartTitle}</span>
                    <IconButton iconClassName="icon-send" style={{'marginLeft':'2px'}} onClick={this._onChart2WidgetClick}/>
                 </div>;
      let widgetWd;
      if(me.state.dashboardOpenImmediately){
        widgetWd = <WidgetSaveWindow ref={'saveChartDialog'}  onWidgetSaveWindowDismiss={me.onWidgetSaveWindowDismiss} chartTitle={me.state.chartTitle}
                                tagOption={this.state.tagOption} contentSyntax={this.state.contentSyntax}></WidgetSaveWindow>;
      }
      else{
        widgetWd=null;
      }
      return (
        <div style={{flex:1, display:'flex','flex-direction':'column', backgroundColor:'#fbfbfb'}}>
          {widgetWd}
          {title}
          <div className={'jazz-alarm-chart-toolbar-container'}>
            <div className={'jazz-full-border-dropdownmenu-relativedate-container'} >
              <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'100px'}} onChange={me._onRelativeDateChange}></DropDownMenu>
            </div>
            <DateTimeSelector ref='dateTimeSelector' startDate={startDate} endDate={endDate} _onDateSelectorChanged={this._onDateSelectorChanged}/>
            <RaisedButton label='查看' style={{height:'32px', marginBottom:'4px'}} ref='searchBtn' onClick={me.onSearchDataButtonClick}/>
            <BaselineCfg  ref="baselineCfg"/>
            <RaisedButton disabled={this.state.baselineBtnStatus} style={{marginLeft:'10px', height:'32px', marginBottom:'4px'}} label='BaselineBasic' onClick={this.handleBaselineCfg}/>
          </div>
          {energyPart}
        </div>
      );
  },
  _afterChartCreated(chartObj){
    if (chartObj.options.scrollbar.enabled) {
        chartObj.xAxis[0].bind('setExtremes', this.OnNavigatorChanged);
    }
  },
  _onDeleteButtonClick(obj){
    let uid = obj.uid;

    //let userTagListSelect = AlarmTagStore.getUseTaglistSelect();

    //unselect tags in taglist of right panel
    //if(userTagListSelect){
      AlarmTagAction.removeSearchTagList({tagId:uid});
    //}

    let needReload = EnergyStore.removeSeriesDataByUid(uid);
    if(needReload){
      let tagOptions = AlarmTagStore.getSearchTagList(),
          paramsObj = EnergyStore.getParamsObj(),
          timeRanges = paramsObj.timeRanges,
          step = paramsObj.step;

      AlarmAction.getEnergyData(timeRanges, step, tagOptions, false);
    }else{
      let energyData = EnergyStore.getEnergyData();
      this.setState({ energyData: energyData});
    }
  },
  _onDeleteAllButtonClick(){
    //let userTagListSelect = AlarmTagStore.getUseTaglistSelect();
    //if(userTagListSelect){
      AlarmTagAction.clearSearchTagList();
    //}

    EnergyStore.clearEnergyDate();
    this.setState({ energyData: null});
  },
  _onGetEnergyDataError(){
    this.setState({step:null});
    this._onEnergyDataChange();
  },
  _onBaselineBtnDisabled:function(){
    this.setState({
        baselineBtnStatus:TagStore.getBaselineBtnDisabled()
    });
  },
  componentDidMount: function() {
    EnergyStore.addTagDataLoadingListener(this._onLoadingStatusChange);
    EnergyStore.addTagDataChangeListener(this._onEnergyDataChange);
    EnergyStore.addGetTagDataErrorListener(this._onGetEnergyDataError);
    TagStore.addBaselineBtnDisabledListener(this._onBaselineBtnDisabled);
    if(this.props.isSettingChart){
      this.refs.relativeDate.setState({selectedIndex:1});

      let date = new Date();
      date.setHours(0,0,0);
      let last7Days = CommonFuns.dateAdd(date, -6, 'days');

      this.refs.dateTimeSelector.setDateField(last7Days, date);
    }
  },
  componentWillUnmount: function() {
    EnergyStore.removeTagDataLoadingListener(this._onLoadingStatusChange);
    EnergyStore.removeTagDataChangeListener(this._onEnergyDataChange);
    EnergyStore.removeGetTagDataErrorListener(this._onGetEnergyDataError);
    TagStore.removeBaselineBtnDisabledListener(this._onBaselineBtnDisabled);
  },
  getSelectedTagOptions(){
    let userTagListSelect = AlarmTagStore.getUseTaglistSelect();
    let tagOptions;
    if(!userTagListSelect){
      tagOptions = EnergyStore.getTagOpions();
    }else{
      tagOptions = AlarmTagStore.getSearchTagList();
    }
    return tagOptions;
  },
  handleBaselineCfg: function(e){
    let tagOptions = this.getSelectedTagOptions();
    let tagOption, tagObj;
    if(tagOptions && tagOptions.length === 1){
      tagOption = tagOptions[0];
      let uom = getUomById(tagOption.uomId);
      tagObj = {tagId: tagOption.tagId, hierarchyId: tagOption.hierId, uom:uom};
    }else{
      return ;
    }

    let dateSelector = this.refs.dateTimeSelector;
    let dateRange = dateSelector.getDateTime();

    this.refs.baselineCfg.showDialog(tagObj, dateRange);
    var year=(new Date()).getFullYear();
    TBSettingAction.setYear(year);
  },
  OnNavigatorChanged: function (obj) {
    var chart = obj.target.chart;
    var scroller = chart.scroller;

    var min = obj.min;
    var max = obj.max;

    var start = Math.round(min);
    var end = Math.round(max);
    var validator = JazzCommon.IsValidDate;

    var converter = DataConverter.JsonToDateTime;
    var type = 'resize';
    var startTime, endTime;

    //this.migrateAndHideAllCommentPanel();

    if (scroller.grabbedLeft) {
        startTime = new Date(start);
        startTime.setMinutes(0, 0, 0);
        endTime = new Date(end);
        endTime.setMinutes(0, 0, 0);
        this.needRollback = true;
    }
    else if (scroller.grabbedRight) {
        endTime = new Date(end);
        endTime.setMinutes(0, 0, 0);

        startTime = new Date(start);
        startTime.setMinutes(0, 0, 0);
        this.needRollback = true;
    }
    else {
        startTime = new Date(start);
        startTime.setMinutes(0, 0, 0);
        endTime = new Date(end);
        endTime.setMinutes(0, 0, 0);
        type = 'move';
    }

    if (startTime > endTime) {
        startTime = new Date(start);
        startTime.setMinutes(0, 0, 0);
        endTime = new Date(end);
        endTime.setMinutes(0, 0, 0);
    }

    //if (endTime > Ext.Date.now()) {
    //    endTime = new Date();
    //    endTime.setMinutes(0, 0, 0);
    //}

    if (startTime.getTime() == endTime.getTime()) {
        if (scroller.grabbedLeft) {
            startTime = dateAdd(endTime, -1, 'hours');
        }
        else {
            endTime = dateAdd(startTime, 1, 'hours');
        }
    }

    //this.navigatorChanged = true;
    //return this.fireEvent('eventfired', 'datechanged', { chart: this, start: startTime, end: endTime, type: type });
    this.dateChanged(chart, startTime, endTime, type);
  },
  dateChanged(chart, start, end, type){
    this.refs.dateTimeSelector.setDateField(start, end);
    this.refs.relativeDate.setState({selectedIndex:0});

     if (type === 'resize' || chart.navCache === false) {
       this._onNavigatorChangeLoad();
     }
  }
});

module.exports = ChartPanel;
