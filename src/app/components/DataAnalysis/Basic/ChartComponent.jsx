'use strict';
import React, { Component }  from "react";
import AlarmTagStore from 'stores/AlarmTagStore.jsx';
import EnergyStore from 'stores/energy/EnergyStore.jsx';
import MultiTimespanAction from 'actions/MultiTimespanAction.jsx';
import AlarmTagAction from 'actions/AlarmTagAction.jsx';
import ChartComponentBox from '../../energy/ChartComponentBox.jsx';
import {dateAdd} from 'util/Util.jsx';
import MultipleTimespanStore from 'stores/energy/MultipleTimespanStore.jsx';
import EnergyAction from 'actions/EnergyAction.jsx';
import GridComponent from '../../energy/GridComponent.jsx';

var analysisPanel=null;
export default class ChartComponent extends Component {

  constructor(props) {
     super(props);
     this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    // this._onConfigBtnItemTouchTap = this._onConfigBtnItemTouchTap.bind(this);
  }

  _onDeleteButtonClick(obj) {
  let uid = obj.uid;
  let id = obj.id;
  var index = id.indexOf('Type');
  var type = parseInt(id.slice(index + 4));
  let tagOptions = AlarmTagStore.getSearchTagList(),
    paramsObj = EnergyStore.getParamsObj(),
    timeRanges = paramsObj.timeRanges,
    submitParams = EnergyStore.getSubmitParams(),
    step = paramsObj.step;
  let weather;
  if (type === 18) {
    // weather = {
    //   IncludeTempValue: false,
    //   IncludeHumidityValue: wasHumi
    // };
    // analysisPanel.setState({
    //   weatherOption: weather
    // });
    analysisPanel.energyDataLoad(timeRanges, step, tagOptions, false, weather);
  } else if (type === 19) {
    // weather = {
    //   IncludeTempValue: wasTemp,
    //   IncludeHumidityValue: false
    // };
    // analysisPanel.setState({
    //   weatherOption: weather
    // });
    analysisPanel.energyDataLoad(timeRanges, step, tagOptions, false, weather);
  } else {
    let multiTimespanIndex = EnergyStore.getMultiTimespanIndex(uid);

    if (multiTimespanIndex !== -1) {
      MultiTimespanAction.removeMultiTimespanData(multiTimespanIndex, true);
    } else {
      AlarmTagAction.removeSearchTagList({
        tagId: uid
      });
    }

    let needReload = EnergyStore.removeSeriesDataByUid(uid);

    if (needReload) {
      if (multiTimespanIndex !== -1) {
        timeRanges = [timeRanges[0]];
        MultiTimespanAction.clearMultiTimespan('both');
      }
      var chartType = analysisPanel.state.selectedChartType;
      if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
        analysisPanel.energyDataLoad(timeRanges, step, tagOptions, false);
      } else if (chartType === 'pie') {
        analysisPanel.pieEnergyDataLoad(timeRanges, 2, tagOptions, false);
      }
    } else {
      let energyData = EnergyStore.getEnergyData();
      analysisPanel.setState({
        energyData: energyData
      });
    }
  }
  }

  _onDeleteAllButtonClick(){

  }

  _afterChartCreated(chartObj) {
  if (chartObj.options.scrollbar && chartObj.options.scrollbar.enabled) {
      chartObj.xAxis[0].bind('setExtremes', this._onNavigatorChanged);
    }
  }

  _onNavigatorChanged(obj) {
    console.log('OnNavigatorChanged');
    var chart = obj.target.chart,
      scroller = chart.scroller,
      min = obj.min,
      max = obj.max,
      start = Math.round(min),
      end = Math.round(max),
      type = 'resize',
      startTime,
      endTime;

  if (scroller.grabbedLeft) {
    startTime = new Date(start);
    startTime.setMinutes(0, 0, 0);
    endTime = new Date(end);
    endTime.setMinutes(0, 0, 0);
    this.needRollback = true;
  } else if (scroller.grabbedRight) {
    endTime = new Date(end);
    endTime.setMinutes(0, 0, 0);

    startTime = new Date(start);
    startTime.setMinutes(0, 0, 0);
    this.needRollback = true;
  } else {
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

  if (startTime.getTime() === endTime.getTime()) {
    if (scroller.grabbedLeft) {
      startTime = dateAdd(endTime, -1, 'hours');
    } else {
      endTime = dateAdd(startTime, 1, 'hours');
    }
  }
  if (this.state.chartStrategy.handleNavigatorChangeTimeFn) {
    this.state.chartStrategy.handleNavigatorChangeTimeFn(startTime, endTime);
  }
  this.handleNavigatorChangeTime(startTime, endTime);
  this.dateChanged(chart, startTime, endTime, type);
  }

  handleNavigatorChangeTime(startTime, endTime) {
    var timeRanges = EnergyStore.getParamsObj().timeRanges;
    if (timeRanges.length > 1) {
      MultipleTimespanStore.convertMultiTimespansByNavigator(startTime, endTime);
    } else {
      EnergyAction.setTimeRangeByNavigator(startTime, endTime);
    }
  }

  dateChanged(chart, start, end, type) {
    analysisPanel.refs.dateTimeSelector.setDateField(start, end);
    analysisPanel.refs.relativeDate.setState({
      selectedIndex: 0
    });

  if (type === 'resize' || this.refs.chart.navCache === false) {
    this._onNavigatorChangeLoad();
  }

  }

  _onNavigatorChangeLoad() {
    let tagOptions = EnergyStore.getTagOpions(),
          dateSelector = analysisPanel.refs.dateTimeSelector,
          dateRange = dateSelector.getDateTime(),
          startDate = dateRange.start,
          endDate = dateRange.end;
    analysisPanel.setFitStepAndGetData(startDate, endDate, tagOptions, 'Customerize')
  }

  getChartTooltiphasTotal(data) {
    let hasTotal = true;
    if (data.TargetEnergyData && data.TargetEnergyData.length > 1) {
      var targetEnergyData = data.TargetEnergyData,
        targetP,
        targetN;

    for (var i = 0, len = targetEnergyData.length; i < len - 1; i++) {
      targetP = targetEnergyData[i].Target;
      targetN = targetEnergyData[i + 1].Target;

        if (targetP.CommodityId !== targetN.CommodityId || targetP.Uom !== targetN.Uom || targetN.Type === 13 || targetN.Type === 12 || targetN.Type === 14) {
          hasTotal = false;
          break;
        }
      }
    }
    return hasTotal;
  }

  getEnergyRawDataFn(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize){
    analysisPanel.getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize)
  }

  getYaxisConfig(){
    return analysisPanel.state.yaxisConfig
  }
  componentWillMount(){
    analysisPanel=this.props.AnalysisPanel;
  }

  render(){
    let energyPart;
    let chartType = analysisPanel.state.selectedChartType;
    if (chartType === 'rawdata') {
      let properties = {
        ref: 'chart',
        energyData: analysisPanel.state.energyData,
        energyRawData: analysisPanel.state.energyRawData,
        chartStrategy: this
      };
      energyPart = <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '20px',
          overflow: 'hidden'
        }}>

                  <GridComponent {...properties}></GridComponent>


              </div>;
            } else {
              let chartCmpObj = {
                ref: 'chart',
                bizType: 'Energy',
                energyType: 'Energy',
                chartType: analysisPanel.state.selectedChartType,
                energyData: analysisPanel.state.energyData,
                energyRawData: analysisPanel.state.energyRawData,
                onDeleteButtonClick: this._onDeleteButtonClick,
                onDeleteAllButtonClick: this._onDeleteAllButtonClick,
                getYaxisConfig:this.getYaxisConfig,
                chartTooltipHasTotal: this.getChartTooltiphasTotal(analysisPanel.state.energyRawData)
              };
              energyPart = <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '0px',
                  marginLeft: '9px'
                }}>
                 <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={this._afterChartCreated}/>
               </div>;
             }
             return energyPart;

  }
}

ChartComponent.propTypes = {
  AnalysisPanel:React.PropTypes.object,
};