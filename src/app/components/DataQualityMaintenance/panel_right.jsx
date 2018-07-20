import React, { Component } from 'react';

import DataQuality from 'constants/actionType/data_quality.jsx';
import Panel from 'controls/toggle_icon_panel.jsx';
import TagContentField from './tag_content_field.jsx';
import SummaryContentField from './summary_content_field.jsx';

export default class Right extends Component {
  render() {
    let { selectedNode ,showLeft, onToggle ,filterType, startTime, endTime} = this.props;

    if( selectedNode ){
      // TagContentField 数据点，SummaryContentField网关 ,selectedNode.get("NodeType")是5,6等
       return(
        selectedNode.get("NodeType")===DataQuality.nodeType.Tag
        ?  <TagContentField nodeData={selectedNode}
                            showLeft={showLeft}
                            onToggle={onToggle}
                            anomalyType={filterType}/>
        : <SummaryContentField  nodeData={selectedNode}
                                showLeft={showLeft}
                                onToggle={onToggle}
                                anomalyType={filterType}
                                startTime={startTime}
                                endTime={endTime}
                                />
        )
    }else{
      return(<Panel onToggle={onToggle} isFolded={showLeft}>
            <div className='flex-center' style={{fontSize: '16px', color: '#626469',}}>{I18N.VEE.NoChoiceTip}</div>
          </Panel>)
    }
  }
}
