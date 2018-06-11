'use strict';
import React, { Component }  from "react";
import CircularProgress from 'material-ui/CircularProgress';
import ScatterPlotAction from 'actions/DataAnalysis/scatter_plot_action.jsx';
import ScatterPlotStore from 'stores/DataAnalysis/scatter_plot_store.jsx';
import ScatterPlot from './scatter_plot.jsx';
import PropTypes from 'prop-types';
export default class ScatterPlotView extends Component {

  constructor(props) {
    super(props);
    this._onChanged = this._onChanged.bind(this);
  }

  state={
    energyData:null,
  }

  _onChanged(){
    this.setState({
      energyData:ScatterPlotStore.getEnergyDataForSolution()
    })
  }

  componentDidMount(){
    ScatterPlotStore.addChangeListener(this._onChanged);

    var {xAxisTagId,yAxisTagId,step, timeRanges}=this.props;
    ScatterPlotAction.getEnergyData(xAxisTagId,yAxisTagId,timeRanges, step)
  }

    componentWillUnmount() {
    ScatterPlotStore.removeChangeListener(this._onChanged);
  }
  
  render(){
    if(this.state.energyData===null){
      return(
         <div className="flex-center">
           <CircularProgress  mode="indeterminate" size={80} />
         </div>

      )
    }else{
      return(
        <ScatterPlot energyData={this.state.energyData} afterChartCreated={this.props.afterChartCreated} isFromSolution={true}/>
      )
    }  
  }

}

ScatterPlotView.propTypes= {
	xAxisTagId:PropTypes.number,
  yAxisTagId:PropTypes.number,
  step:PropTypes.number,
  timeRanges:PropTypes.number,
  afterChartCreated:PropTypes.func,
};