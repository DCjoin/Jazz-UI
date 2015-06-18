'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, RaisedButton, DatePicker} from 'material-ui';
import assign from "object-assign";
import CommonFuns from '../../util/Util.jsx';
import EnergyStore from '../../stores/EnergyStore.jsx';
import AlarmTagStore from '../../stores/AlarmTagStore.jsx';

import YaxisSelector from '../energy/YaxisSelector.jsx';
import StepSelector from '../energy/StepSelector.jsx';
import ChartComponent from '../energy/ChartComponent.jsx';
import WidgetSaveWindow from '../energy/WidgetSaveWindow.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';

import BaselineCfg from '../setting/BaselineCfg.jsx';

let {hourPickerData, isArray} = CommonFuns;

const searchDate = [{value:'Customerize',text:'自定义'},{value: 'Last7Day', text: '最近7天'}, {value: 'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
 {value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'}, {value: 'LastWeek', text: '上周'},
 {value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];

const dateTime = hourPickerData();

let ChartPanel = React.createClass({
    mixins:[Navigation,State],
    propTypes:{
      isSettingChart: React.PropTypes.bool
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

        this.refs.startDate.setDate(startDate);
        this.refs.endDate.setDate(endDate);
      }
    },
    _onEnergyDataChange(){
      let isLoading = EnergyStore.getLoadingStatus();
      let energyData = EnergyStore.getEnergyData();
      let paramsObj = assign({},EnergyStore.getParamsObj());
      this.setState({ isLoading: isLoading,
                      energyData: energyData,
                      paramsObj: paramsObj,
                      dashboardOpenImmediately: false});
    },
    _onStepChange(step){
      let tagOptions = EnergyStore.getTagOpions();
      let paramsObj = EnergyStore.getParamsObj();
      let timeRanges = paramsObj.timeRanges;

      this.setState({step:step, dashboardOpenImmediately: false});
      AlarmAction.getEnergyDate(timeRanges, step, tagOptions);
    },
    onSearchDataButtonClick(){
      let startDate = this.refs.startDate.getDate(),
          endDate = this.refs.endDate.getDate(),
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
        return;
      }
      let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
      let step = this.state.step;

      let limitInterval = CommonFuns.getLimitInterval(timeRanges);
      let stepList = limitInterval.stepList;
      if( stepList.indexOf(step) == -1){
        step = limitInterval.display;
      }

      AlarmAction.getEnergyDate(timeRanges, step, tagOptions);
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
      let startField = this.refs.startDate;
      let startTimeField = this.refs.startTime;
      let endField = this.refs.endDate;
      let endTimeField = this.refs.endTime;

      if(value && value !=='Customerize'){
        var timeregion = CommonFuns.GetDateRegion(value.toLowerCase());
        startField.setDate(timeregion.start);
        endField.setDate(timeregion.end);

        startTimeField.setState({selectedIndex:0});
        endTimeField.setState({selectedIndex:0});
      }

    },
    getContentSyntax(){
      let tagOptions = EnergyStore.getTagOpions(), options;

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
      var submitParams = EnergyStore.getSubmitParams();
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
    getInitialState() {
        let state = {
          isLoading: false,
          energyData: null,
          hierName: null,
          submitParams: null,
          step: 2,
          dashboardOpenImmediately: false
        };
        if(this.props.chartTitle){
          state.chartTitle = this.props.chartTitle;
        }
        return state;
    },
    render: function () {
      let date = new Date();
      let me = this;
      let energyPart=null;

      if(!me.state.chartTitle){
         return null;
      }

      if(this.state.isLoading){
        energyPart = <div style={{margin:'auto'}}>{'loading...'}</div>;
      }else if(!!this.state.energyData){
        energyPart = <div style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px'}}>
                        <div style={{display:'flex'}}>
                          <YaxisSelector initYaxisDialog={me._initYaxisDialog}/>
                          <StepSelector stepValue={me.state.step} onStepChange={me._onStepChange} timeRanges={me.state.timeRanges}/>

                        </div>
                        <ChartComponent ref='ChartComponent' energyData={this.state.energyData} {...this.state.paramsObj} onDeleteButtonClick={me._onDeleteButtonClick}/>
                      </div>;
      }
      let title = <div style={{height:'30px',paddingBottom:'10px'}}>
                    <span >{me.state.chartTitle}</span>
                    <IconButton iconClassName="fa fa-floppy-o" style={{'marginLeft':'10px'}} onClick={this._onChart2WidgetClick}/>
                 </div>;

      return (
        <div style={{flex:1, display:'flex','flex-direction':'column', marginLeft:'10px'}}>
          <WidgetSaveWindow ref={'saveChartDialog'} openImmediately={me.state.dashboardOpenImmediately} tagOption={this.state.tagOption} contentSyntax={this.state.contentSyntax}></WidgetSaveWindow>
          {title}
          <div style={{display:'flex', 'flexFlow':'row', 'alignItems':'center', height:'60px'}}>
            <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'140px'}} onChange={me._onRelativeDateChange}></DropDownMenu>
            <DatePicker className='jazz-alarm-datepicker' defaultDate={date} ref='startDate' style={{width:'90px', padding:'13px 0'}}/>
            <DropDownMenu menuItems={dateTime} ref='startTime'></DropDownMenu>
            <span style={{'marginLeft':'10px'}}> {'到'} </span>
            <DatePicker className='jazz-alarm-datepicker' defaultDate={date} ref='endDate' style={{width:'90px', padding:'13px 0', marginLeft:'10px'}}/>
            <DropDownMenu menuItems={dateTime} ref='endTime'></DropDownMenu>
            <RaisedButton label='查看' secondary={true} ref='searchBtn' onClick={me.onSearchDataButtonClick}/>
            <BaselineCfg  ref="baselineCfg"/>
            <RaisedButton style={{marginLeft:'10px'}} label='BaselineBasic' secondary={true} onClick={this.handleBaselineCfg}/>
          </div>
          {energyPart}
        </div>
      );
  },
  _onDeleteButtonClick(obj){
    let uid = obj.uid;

    let userTagListSelect = AlarmTagStore.getUseTaglistSelect();

    //unselect tags in taglist of right panel
    if(userTagListSelect){
      AlarmTagStore.removeSearchTagList({tagId:uid});
    }

    let needReload = EnergyStore.removeSeriesDataByUid(uid);
    if(needReload){
      let tagOptions = AlarmTagStore.getSearchTagList(),
          paramsObj = EnergyStore.getParamsObj(),
          timeRanges = paramsObj.timeRanges,
          step = paramsObj.step;

      AlarmAction.getEnergyDate(timeRanges, step, tagOptions);
    }else{
      let energyData = EnergyStore.getEnergyData();
      this.setState({ energyData: energyData});
    }
  },
  componentDidMount: function() {
    EnergyStore.addTagDataLoadingListener(this._onLoadingStatusChange);
    EnergyStore.addTagDataChangeListener(this._onEnergyDataChange);

    if(this.props.isSettingChart){
      this.refs.relativeDate.setState({selectedIndex:1});

      let startField = this.refs.startDate;
      let startTimeField = this.refs.startTime;
      let endField = this.refs.endDate;
      let endTimeField = this.refs.endTime;
      let date = new Date();
      date.setHours(0,0,0);
      let last7Days = CommonFuns.dateAdd(date, -7, 'days');

      startField.setDate(last7Days);
      endField.setDate(date);

      startTimeField.setState({selectedIndex:0});
      endTimeField.setState({selectedIndex:0});
    }
  },
  componentWillUnmount: function() {
    EnergyStore.removeTagDataLoadingListener(this._onLoadingStatusChange);
    EnergyStore.removeTagDataChangeListener(this._onEnergyDataChange);
  },
  handleBaselineCfg: function(e){
    this.refs.baselineCfg.showDialog();
  }
});

module.exports = ChartPanel;
