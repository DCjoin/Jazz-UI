'use strict';

import React, { Component}  from "react";
import Spin from '@emop-ui/piano/spin';
import PropTypes from 'prop-types';
import {nodeType} from 'constants/actionType/data_quality.jsx';
import TagChart from './tag_chart.jsx';
import TagNotice from './tag_notice.jsx';

export default class AbnomalMonitor extends Component {

    _renderChart(){
      return this.props.nodeData.get("NodeType")===nodeType.Tag
              ?<TagChart selectedTag={this.props.nodeData} 
                         showLeft={this.props.showLeft}/>:null
  }

    _renderNotice(){
      return this.props.nodeData.get("NodeType")===nodeType.Tag?<TagNotice  selectedTag={this.props.nodeData}
                                                                            anomalyType={1}/>:null
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