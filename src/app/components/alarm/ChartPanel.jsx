'use strict';
import React from "react";
import Immutable from 'immutable';
import ChartMixins from '../energy/ChartMixins.jsx';
import {FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress} from 'material-ui';
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
import GlobalErrorMessageAction from '../../actions/GlobalErrorMessageAction.jsx';
import ErrorStepDialog from './ErrorStepDialog.jsx';
import BaselineCfg from '../setting/BaselineCfg.jsx';
import ButtonMenu from '../../controls/ButtonMenu.jsx';
import ExtendableMenuItem from '../../controls/ExtendableMenuItem.jsx';

let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');

let {hourPickerData, isArray, getUomById, JazzCommon, DataConverter, dateAdd} = CommonFuns;

const searchDate = [{value:'Customerize',text:'自定义'},{value: 'Last7Day', text: '最近7天'}, {value: 'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
 {value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'}, {value: 'LastWeek', text: '上周'},
 {value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];

let ChartPanel = React.createClass({
    mixins:[ChartMixins],
    propTypes:{
      isSettingChart: React.PropTypes.bool
    },
    _onLoadingStatusChange(){
      let isSettingChart = this.props.isSettingChart,
          isLoading = EnergyStore.getLoadingStatus(),
          paramsObj = EnergyStore.getParamsObj(),
          tagOption = EnergyStore.getTagOpions()[0],
          obj = assign({}, paramsObj);

      obj.isLoading = isLoading;
      obj.tagName = tagOption.tagName;
      obj.dashboardOpenImmediately = false;
      obj.tagOption = tagOption;
      obj.energyData = null;

      if(!isSettingChart){
        let chartTitle = EnergyStore.getChartTitle();
        obj.chartTitle = chartTitle;
      }

      this.setState(obj);
    },
    componentDidUpdate(){
      if((!this.props.isSettingChart) && EnergyStore.getAlarmLoadingStatus()){
        let paramsObj = EnergyStore.getParamsObj(),
            startDate = CommonFuns.DataConverter.JsonToDateTime(paramsObj.startTime, false),
            endDate = CommonFuns.DataConverter.JsonToDateTime(paramsObj.endTime, false);

        this.refs.dateTimeSelector.setDateField(startDate, endDate);
      }
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
    _onStepChange(step){
      let tagOptions = EnergyStore.getTagOpions(),
          paramsObj = EnergyStore.getParamsObj(),
          timeRanges = paramsObj.timeRanges;

      this.setState({step:step, dashboardOpenImmediately: false});
      AlarmAction.getEnergyData(timeRanges, step, tagOptions, false);
    },
    _onNavigatorChangeLoad(){
      let tagOptions = EnergyStore.getTagOpions(),
          paramsObj = EnergyStore.getParamsObj(),
          dateSelector = this.refs.dateTimeSelector,
          dateRange = dateSelector.getDateTime(),
          startDate = dateRange.start,
          endDate = dateRange.end;

      this._setFitStepAndGetData(startDate, endDate, tagOptions, false);
    },
    onSearchDataButtonClick(){
      let dateSelector = this.refs.dateTimeSelector,
          dateRange = dateSelector.getDateTime(),
          startDate = dateRange.start,
          endDate = dateRange.end,
          userTagListSelect = AlarmTagStore.getUseTaglistSelect(),
          tagOptions;

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
      let value = menuItem.value,
          dateSelector = this.refs.dateTimeSelector;

      if(value && value !=='Customerize'){
        var timeregion = CommonFuns.GetDateRegion(value.toLowerCase());
        dateSelector.setDateField(timeregion.start, timeregion.end);
      }
    },
    _onDateSelectorChanged(){
      this.refs.relativeDate.setState({selectedIndex:0});
    },
    getContentSyntax(){
      let tagOptions = EnergyStore.getTagOpions(), options,
          relativeDate = EnergyStore.getRelativeDate();

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
      var chartCmp = this.refs.ChartComponent,
          chartObj = chartCmp.refs.highstock.getPaper();

      return chartObj;
    },
    onWidgetSaveWindowDismiss(){
      this.setState({dashboardOpenImmediately:false});
    },
    _onErrorDialogAction(step){
      this.setState({errorObj:null});
      if(step !== 'cancel'){
        this._onStepChange(step);
      }
    },
    getInitialState() {
      let state = {
        isLoading: false,
        energyData: null,
        energyRawData: null,
        hierName: null,
        submitParams: null,
        step: null,
        yaxisConfig: null,
        dashboardOpenImmediately: false,
        baselineBtnStatus:TagStore.getBaselineBtnDisabled(),
        selectedChartType:'line'
      };
      if(this.props.chartTitle){
        state.chartTitle = this.props.chartTitle;
      }
      return state;
    },
    render: function () {
      let me = this, errorDialog, energyPart = null;
      if(!me.state.chartTitle){
         return null;
      }
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
        let chartCmpObj ={  ref:'ChartComponent',
                            energyData: this.state.energyData,
                            energyRawData: this.state.energyRawData,
                            onDeleteButtonClick: me._onDeleteButtonClick,
                            onDeleteAllButtonClick: me._onDeleteAllButtonClick,
                            getYaxisConfig: me.getYaxisConfig
                        };
        energyPart = <div style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px'}}>
                        <div style={{display:'flex'}}>
                          <YaxisSelector initYaxisDialog={me._initYaxisDialog} onYaxisSelectorDialogSubmit={me._onYaxisSelectorDialogSubmit}/>
                          <StepSelector stepValue={me.state.step} onStepChange={me._onStepChange} timeRanges={me.state.timeRanges}/>
                        </div>
                        <ChartComponent {...this.state.paramsObj} {...chartCmpObj} afterChartCreated={this._afterChartCreated}/>
                      </div>;
      }
      let title = <div className='jazz-alarm-chart-title'>
                    <span>{me.state.chartTitle}</span>
                    <IconButton iconClassName="icon-send" style={{'marginLeft':'2px'}} onClick={this._onChart2WidgetClick} disabled={!this.state.energyData}/>
                  </div>;
      let widgetWd;
      if(me.state.dashboardOpenImmediately){
        widgetWd = <WidgetSaveWindow ref={'saveChartDialog'}  onWidgetSaveWindowDismiss={me.onWidgetSaveWindowDismiss} chartTitle={me.state.chartTitle}
                      tagOption={this.state.tagOption} contentSyntax={this.state.contentSyntax}></WidgetSaveWindow>;
      }
      else{
        widgetWd=null;
      }
      let searchButton = <ButtonMenu label='查看' onButtonClick={me.onSearchDataButtonClick} desktop={true}
        value={this.state.selectedChartType} onItemTouchTap={this._onSearchBtnItemTouchTap}>
         <MenuItem primaryText="折线图" value='line'/>
         <MenuItem primaryText="柱状图"  value='column'/>
         <MenuItem primaryText="堆积图"  value='stack'/>
         <MenuItem primaryText="饼状图"  value='pie'/>
         <MenuItem primaryText="原始数据"  value='rawdata'/>
      </ButtonMenu>;
      let configButton =<ButtonMenu label='辅助对比' style={{marginLeft:'10px'}} desktop={true}
                                    onItemTouchTap={this._onConfigBtnItemTouchTap}>
        <MenuItem primaryText="历史对比" value='history'/>
        <MenuItem primaryText="基准值设置" value='config' disabled={this.state.baselineBtnStatus}/>
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

      return (
        <div style={{flex:1, display:'flex','flex-direction':'column', backgroundColor:'#fbfbfb'}}>
          {widgetWd}
          {title}
          <div className={'jazz-alarm-chart-toolbar-container'}>
            <div className={'jazz-full-border-dropdownmenu-container'} >
              <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'92px'}} onChange={me._onRelativeDateChange}></DropDownMenu>
            </div>
            <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={this._onDateSelectorChanged}/>
            <div className={'jazz-flat-button'}>
              {searchButton}
            </div>
            <BaselineCfg  ref="baselineCfg"/>
            <div className={'jazz-flat-button'}>
              {configButton}
            </div>

        </div>
          {energyPart}
          {errorDialog}
        </div>
      );
  },
  _onSearchBtnItemTouchTap(e, child){
    this.setState({selectedChartType:child.props.value});
  },
  _onConfigBtnItemTouchTap(e, child){
    let itemValue = child.props.value;
    switch (itemValue) {
      case 'history':
        console.log('history');
        break;
      case 'config':
        this.handleBaselineCfg();
        break;
      case 'sum':
        console.log('sum');
        break;
    }
  },
  _onYaxisSelectorDialogSubmit(config){
    this.setState({yaxisConfig:config});
  },
  getYaxisConfig(){
    return this.state.yaxisConfig;
  },
  _afterChartCreated(chartObj){
    if (chartObj.options.scrollbar.enabled) {
        chartObj.xAxis[0].bind('setExtremes', this.OnNavigatorChanged);
    }
  },
  _onDeleteButtonClick(obj){
    let uid = obj.uid,
        needReload = EnergyStore.removeSeriesDataByUid(uid);

    AlarmTagAction.removeSearchTagList({tagId:uid});

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
    AlarmTagAction.clearSearchTagList();
    EnergyStore.clearEnergyDate();
    this.setState({ energyData: null});
  },
  _onGetEnergyDataError(){
    let errorObj = this.errorProcess();
    this._onEnergyDataChange(true, errorObj);
  },
  errorProcess(){
    let code = EnergyStore.getErrorCode(),
        messages = EnergyStore.getErrorMessage();

    if (code.toString() == '02004') {
        let errorObj = this.showStepError(messages[0]);
        return errorObj;
    }else{
      let errorMsg = CommonFuns.getErrorMessage(code);
      GlobalErrorMessageAction.fireGlobalErrorMessage(errorMsg);
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
      let endDate = CommonFuns.dateAdd(date, 1, 'days');

      this.refs.dateTimeSelector.setDateField(last7Days, endDate);
    }
  },
  componentWillUnmount: function() {
    EnergyStore.removeTagDataLoadingListener(this._onLoadingStatusChange);
    EnergyStore.removeTagDataChangeListener(this._onEnergyDataChange);
    EnergyStore.removeGetTagDataErrorListener(this._onGetEnergyDataError);
    TagStore.removeBaselineBtnDisabledListener(this._onBaselineBtnDisabled);

    YaxisSelector.reset();
  },
  getSelectedTagOptions(){
    let tagOptions,
        userTagListSelect = AlarmTagStore.getUseTaglistSelect();

    if(!userTagListSelect){
      tagOptions = EnergyStore.getTagOpions();
    }else{
      tagOptions = AlarmTagStore.getSearchTagList();
    }
    return tagOptions;
  },
  handleBaselineCfg: function(e){
    let tagOption, tagObj,
        tagOptions = this.getSelectedTagOptions();

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
    var chart = obj.target.chart,
        scroller = chart.scroller,
        min = obj.min,
        max = obj.max,
        start = Math.round(min),
        end = Math.round(max),
        validator = JazzCommon.IsValidDate,
        converter = DataConverter.JsonToDateTime,
        type = 'resize',
        startTime,
        endTime;

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

    if (startTime.getTime() == endTime.getTime()) {
        if (scroller.grabbedLeft) {
            startTime = dateAdd(endTime, -1, 'hours');
        }
        else {
            endTime = dateAdd(startTime, 1, 'hours');
        }
    }

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
