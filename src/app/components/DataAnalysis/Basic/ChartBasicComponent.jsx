'use strict';
import React, { Component, PropTypes }  from "react";
import Immutable from 'immutable';

import ChartComponentBox from 'components/energy/ChartComponentBox.jsx';

import MixedChartReader from 'stores/MixedChartReader.jsx';

import ChartReaderStrategyFactor from 'stores/Energy/ChartReaderStrategyFactor.jsx';

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

export default class ChartComponent extends Component {
  static propTypes = {
    node: PropTypes.object,
    tagData: PropTypes.object,
    yaxisConfig: PropTypes.object,
  }
  constructor(props) {
     super(props);
     this.getYaxisConfig = this.getYaxisConfig.bind(this);
  }

  getEnergyRawDataFn(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize){
    analysisPanel.getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize)
  }

  getYaxisConfig(){
    return this.props.yaxisConfig || {}
  }

  render(){
    let {node, tagData, chartType, widgetStatus, widgetSeriesArray} = this.props,
    target = tagData.getIn(['TargetEnergyData', 0, 'Target']),
    timeSpan = target.get('TimeSpan'),
    startTime = timeSpan.get('StartTime'),
    endTime = timeSpan.get('EndTime'),
    step = target.get('Step'),

    strategy = ChartReaderStrategyFactor.getStrategyByBizChartType( getStrategyByChartType(chartType) ),

    energy = Immutable.fromJS(strategy.convert(tagData.toJS(), {
      start: startTime,
      end: endTime,
      step,
      timeRanges: [timeSpan.toJS()],
    }));

    energy = energy.set('Data', energy.get('Data').map( (data) => {
      return data.set('enableDelete', false);
    } ) )

    let {ChartType, Id} = node.toJS(),
    chartCmpObj = {
      ref: 'chart',
      bizType: 'Energy',
      energyType: 'Energy',
      chartType: chartType,
      energyData: energy,
      energyRawData: tagData.toJS(),
      getYaxisConfig:this.getYaxisConfig,
      timeRanges:[timeSpan.toJS()],
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
      afterChartCreated: () => { this.props.afterChartCreated(Id) },
      assignStatus: (config) => {
        return assignStatus(config, widgetStatus);
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