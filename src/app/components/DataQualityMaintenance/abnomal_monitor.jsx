'use strict';

import React, { Component}  from "react";
import Spin from '@emop-ui/piano/spin';
import PropTypes from 'prop-types';
import {nodeType} from 'constants/actionType/data_quality.jsx';
import TagChart from './tag_chart.jsx';

export default class AbnomalMonitor extends Component {

    state={
      isLoading:false
    }

    _renderChart(){
      // return this.props.nodeData.get("NodeType")===nodeType.Tag?<TagChart selectedTag={this.props.nodeData} showLeft={this.props.showLeft}/>:null
      return <TagChart selectedTag={this.props.nodeData} showLeft={this.props.showLeft}/>
  }

    _renderNotice(){
      return null
    }

    render() {
      var style={
        display:'flex',
        flex:'1'
      };
      if(this.state.isLoading){
        return <div style={style}>
          <Spin/>
        </div>
      }
      return(
         <div style={style}>
           {this._renderChart()}
           {this._renderNotice()}
         </div>
     )
   }

}

AbnomalMonitor.propTypes= {
  nodeData:PropTypes.object,
  showLeft:PropTypes.bool,
};