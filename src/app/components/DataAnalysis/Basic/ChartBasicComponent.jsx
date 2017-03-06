'use strict';
import React, { Component, PropTypes }  from "react";
import Immutable from 'immutable';
import Util from 'util/Util.jsx';

import ChartComponentBox from 'components/energy/ChartComponentBox.jsx';
import CalendarManager from 'components/energy/CalendarManager.jsx';

import MultipleTimespanStore from 'stores/Energy/MultipleTimespanStore.jsx';

import ChartReaderStrategyFactor from 'stores/Energy/ChartReaderStrategyFactor.jsx';

function getIdByTarget(target, _bizType, _energyType, _submitParams, i) {
  if (_bizType === 'Energy' && _energyType === 'Energy') {
    if (_submitParams.viewOption.TimeRanges.length > 1) {
      return 'Id' + target.TimeSpan.StartTime + target.TimeSpan.EndTime + 'Index' + i + 'Type' + undefined;
    } else {
      return 'Id' + target.TargetId + 'Type' + target.Type;
    }
  } else if (_bizType === 'Unit' && _energyType === 'Energy') {
    return 'Id' + target.TargetId + 'Type' + target.Type;
  } else if ((_bizType === 'Energy' || _bizType === 'Unit') && _energyType === 'Cost') {
    return 'Id' + target.CommodityId + 'Type' + target.Type;
  } else if ((_bizType === 'Energy' || _bizType === 'Unit') && _energyType === 'Carbon') {
    return 'Id' + target.CommodityId + 'Type' + target.Type;
  }
  return '1';
};

function getSeriesStatus(TargetEnergyData, WidgetSeriesArray, _bizType, _energyType, _submitParams) {
  let _seriesStatus = [];
  if (!TargetEnergyData) {
    return;
  } else {
    if (WidgetSeriesArray && WidgetSeriesArray.length > 0) {
      let widgetSeriesArr = WidgetSeriesArray;
      let seriesLength = widgetSeriesArr.length;
      let targetEnergyData = TargetEnergyData;
      for (let i = 0, len = targetEnergyData.length; i < len; i++) {
        let target = targetEnergyData[i].Target;
        let status = {
          id: getIdByTarget(target, _bizType, _energyType, _submitParams, i)
        };
        if (i < seriesLength) { //如果有对应的状态，则保存；如果没有，则统一在assignStatus方法中添加状态
          let serie = widgetSeriesArr[i];
          status.ChartType = serie.ChartType;
          status.IsDisplay = serie.IsDisplay;
          status.SeriesType = serie.SeriesType;

          _seriesStatus.push(status);
        }
      }
    }
  }
  return _seriesStatus;
}

function assignStatus(config, _seriesStatus) {
  let newConfig = {...config};
  let chartTypeMap = {
    1: 'line',
    2: 'column',
    4: 'stack',
    8: 'pie'
  };
  let series = newConfig.series;
  if (series && series[0]) {
    if (series[0].type === 'pie') {
      series = series[0].data;
    }
  }
  let map = {};
  // var seriesStatus = [];
  if (_seriesStatus && _seriesStatus.length > 0) {
    _seriesStatus.forEach((item, index) => {
      map[item.id] = item;
      // var flag = false;
      // series.forEach((series_item) => {
      //   if (series_item.id == item.id) {
      //     flag = true;
      //   }
      // });
      // if (flag) {
      //   seriesStatus.push(_seriesStatus[index]);
      // }
    });
  }

  series.forEach((item, index) => {
    if (item.id && map[item.id]) {
      item.visible = map[item.id].IsDisplay;
      if (map[item.id].ChartType === '4' || map[item.id].ChartType === 4) {
        item.type = 'column';
        item.stacking = 'normal';
      } else {
        item.type = chartTypeMap[map[item.id].ChartType];
        item.stacking = undefined;
      }
    } else if (item.id) {
      // let chartType = item.type;
      // if (chartType === 'column' && item.stacking === 'normal') {
      //   chartType = 'stack';
      // }
      // seriesStatus.push({
      //   id: item.id,
      //   IsDisplay: item.visible,
      //   SeriesType: item.dType,
      //   ChartType: me.getNumByChartType(chartType)
      // });
    }
  });
  // _seriesStatus=seriesStatus;
  return newConfig;
}

function getStrategyByChartType(chartType) {
  switch (chartType) {
    case 'line':
    case 'column':
    case 'stack':
      return 'EnergyTrendReader';
      break;
    case 'pie':
      return 'EnergyPieReader'
      break;
    case 'rawdata':
    return 'EnergyRawGridReader'
      break;
  }
}

export default class ChartBasicComponent extends Component {
  static propTypes = {
    node: PropTypes.object,
    tagData: PropTypes.object,
    chartType: PropTypes.string,
    widgetSeriesArray: PropTypes.object,
    widgetStatus: PropTypes.object,
  }
  constructor(props) {
     super(props);
     this.getYaxisConfig = this.getYaxisConfig.bind(this);
  }

  getEnergyRawDataFn(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize){
    analysisPanel.getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize)
  }

  getYaxisConfig(){
    let widgetStatus = this.props.widgetStatus;
    return widgetStatus ? Util.getYaxisConfig(JSON.parse(this.props.widgetStatus)) : {};
  }

  render(){
    let {node, tagData, chartType, widgetStatus, widgetSeriesArray, contentSyntax} = this.props,
    target = tagData.getIn(['TargetEnergyData', 0, 'Target']),
    timeSpan = target.get('TimeSpan'),
    startTime = timeSpan.get('StartTime'),
    endTime = timeSpan.get('EndTime'),
    step = target.get('Step'),

    strategy = ChartReaderStrategyFactor.getStrategyByBizChartType( getStrategyByChartType(chartType) );

    let timeRanges = [timeSpan.toJS()]/* || [
      {"StartTime":"2015-12-31T16:00:00","EndTime":"2016-12-31T16:00:00"},
      {"StartTime":"2014-12-31T16:00:00","EndTime":"2015-12-31T16:00:00"}
    ]*/;
    if( contentSyntax ) {
      let syntaxObj = JSON.parse(contentSyntax);
      if( syntaxObj && syntaxObj.viewOption && syntaxObj.viewOption.TimeRanges ) {
        let TimeRanges = syntaxObj.viewOption.TimeRanges;
        if( TimeRanges.length > 1 ) {
          MultipleTimespanStore.initDataByWidgetTimeRanges(timeRanges);
          timeRanges = MultipleTimespanStore.getSubmitTimespans(TimeRanges);
        }
      }
    }
    let plotBands = null;
    let wss = JSON.parse(widgetStatus);
    if( wss && wss.length > 0 ) {
      let calcType = "";
      for (var i = 0, len = wss.length; i < len; i++) {
        if (wss[i].WidgetStatusKey === "calendar") {
          if (wss[i].WidgetStatusValue === "hc") {
            calcType = "hc";
            break;
          } else if (wss[i].WidgetStatusValue === "work") {
            calcType = "work";
            break;
          }
        }
      }
      if(tagData.get('Calendars')) {
        plotBands = CalendarManager.convertData(
          CalendarManager.getTimeRange(step, calcType, tagData.get('Calendars').toJS() )
        );        
      }
    }


    let energy = Immutable.fromJS(strategy.convertFn(tagData.toJS(), {
      start: startTime,
      end: endTime,
      step,
      timeRanges: timeRanges,
    }, {readerStrategy:strategy}));

    energy = energy.set('Data', energy.get('Data').map( (data) => {
      return data.set('enableDelete', false);
    } ) );


    let {ChartType, Id} = node.toJS(),
    chartCmpObj = {
      ref: 'chart',
      bizType: 'Energy',
      energyType: 'Energy',
      chartType: chartType,
      energyData: energy,
      energyRawData: tagData.toJS(),
      getYaxisConfig:this.getYaxisConfig,
      timeRanges:timeRanges,
      startTime,
      endTime,
      step,
      config: {
        animation: false,
        navigator: {
          enabled: false
        },
        scrollbar: {
          enabled: false
        },
      },
      plotBands: plotBands,
      afterChartCreated: () => { this.props.afterChartCreated(Id) },
      assignStatus: (config) => {
        return assignStatus(config, getSeriesStatus(
                  tagData.get('TargetEnergyData').toJS(),
                  widgetSeriesArray.toJS(), 'Energy', 'Energy',
                  { viewOption: {TimeRanges:timeRanges}}
                ));
      }
    };
    return (
      <div id={'chart_basic_component_' + Id} style={{
          flex: 1,
          position: 'absolute',
          width: 610,
          height: 320,
          display: 'flex',
          opacity: 0,
          flexDirection: 'column',
          marginBottom: '0px',
          marginLeft: '9px'
        }}>
         <ChartComponentBox {...chartCmpObj}/>
       </div>
    );
  }
}
