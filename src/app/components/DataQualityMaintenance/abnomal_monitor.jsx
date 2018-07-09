'use strict';

import React, { Component}  from "react";
import Spin from '@emop-ui/piano/spin';
import PropTypes from 'prop-types';
import {nodeType} from 'constants/actionType/data_quality.jsx';
import TagChart from './tag_chart.jsx';
import TagNotice from './notice_list.jsx';
import SummaryChart from './summary_chart.jsx';

export default class AbnomalMonitor extends Component {

    _renderChart(){
      return this.props.nodeData.get("NodeType")===nodeType.Tag
              ?<TagChart selectedTag={this.props.nodeData} 
                         showLeft={this.props.showLeft}/>
              :<SummaryChart selectedNode={this.props.nodeData} 
                         showLeft={this.props.showLeft}
                         anomalyType={this.props.anomalyType}/>
  }

    _renderNotice(){
      return <TagNotice  selectedNode={this.props.nodeData}
                         anomalyType={this.props.anomalyType}/>
    }

    render() {
      var style={
        display:'flex',
        flex:'1'
      };
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