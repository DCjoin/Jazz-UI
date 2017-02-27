'use strict';
import React, { Component, PropTypes }  from "react";
import Immutable from 'immutable';

import ChartComponentBox from 'components/energy/ChartComponentBox.jsx';

import MixedChartReader from 'stores/MixedChartReader.jsx';

export default class ChartComponent extends Component {
  static propTypes = {
    node: PropTypes.object,
    tagData: PropTypes.object,
  }
  constructor(props) {
     super(props);
  }

  getEnergyRawDataFn(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize){
    analysisPanel.getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize)
  }

  getYaxisConfig(){
    return {}
  }

  render(){
    let {node, tagData, chartType} = this.props,
    target = tagData.getIn(['TargetEnergyData', 0, 'Target']),
    timeSpan = target.get('TimeSpan'),
    startTime = timeSpan.get('StartTime'),
    endTime = timeSpan.get('EndTime'),
    step = target.get('Step'),

    energy = Immutable.fromJS(MixedChartReader.convert(tagData.toJS(), {
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
      afterChartCreated: () => { this.props.afterChartCreated(Id) }
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