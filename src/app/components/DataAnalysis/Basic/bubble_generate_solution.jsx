'use strict';
import React, { Component }  from "react";
import CircularProgress from 'material-ui/CircularProgress';
import BubbleAction from 'actions/DataAnalysis/bubble_action.jsx';
import BubbleStore from 'stores/DataAnalysis/bubble_store.jsx';
import Bubble from './bubble.jsx';

export default class BubbleView extends Component {

  constructor(props) {
    super(props);
    this._onChanged = this._onChanged.bind(this);
  }

  state={
    energyData:null,
  }

  _onChanged(){
    this.setState({
      energyData:BubbleStore.getEnergyDataForSolution()
    })
  }

  componentDidMount(){
    BubbleStore.addChangeListener(this._onChanged);

    var {xAxisTagId,yAxisTagId,areaTagId,step, timeRanges}=this.props;
    BubbleAction.getEnergyData(xAxisTagId,yAxisTagId,areaTagId,timeRanges, step)
  }

    componentWillUnmount() {
    BubbleStore.removeChangeListener(this._onChanged);
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
        <Bubble energyData={this.state.energyData} afterChartCreated={this.props.afterChartCreated} isFromSolution={true}/>
      )
    }  
  }

}

BubbleView.propTypes = {
	xAxisTagId:React.PropTypes.number,
  yAxisTagId:React.PropTypes.number,
  areaTagId:React.PropTypes.number,
  step:React.PropTypes.number,
  timeRanges:React.PropTypes.number,
  afterChartCreated:React.PropTypes.func,
};