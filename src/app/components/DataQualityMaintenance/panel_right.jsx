import React, { Component } from 'react';
import DataQualityMaintenanceAction from 'actions/data_quality_maintenance.jsx';
import DataQuality from 'constants/actionType/data_quality.jsx';
import Panel from 'controls/toggle_icon_panel.jsx';
import TagContentField from './tag_content_field.jsx';
import SummaryContentField from './summary_content_field.jsx';
import BuildingContentField from './building_content_field.jsx';
import Organization from './organization.jsx'
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import moment from 'moment';
export default class Right extends Component {
  _changeReadStatus(nodeData,filterType){
    if(nodeData && nodeData.get("IsNotRead")){
      DataQualityMaintenanceAction.updatereadstatus( {"Id": nodeData.get('Id'),
                                                      "NodeType": nodeData.get('NodeType'),
                                                      "UpdateTime": moment().utc().format('YYYY-MM-DDTHH:mm:ss'),
                                                      "IsNotRead": false,
                                                      "UserId": CurrentUserStore.getCurrentUser().Id,
                                                      "ExceptionType": filterType},nodeData);
    }
  }
  componentDidMount(){
    this._changeReadStatus(this.props.selectedNode,this.props.filterType)
  }
  componentWillReceiveProps(nextProps){
    this._changeReadStatus(nextProps.selectedNode,nextProps.filterType)
  }
  render() {
    let { selectedNode ,showLeft, onToggle ,filterType, startTime, endTime} = this.props;
    if( selectedNode ){
      // TagContentField 数据点，SummaryContentField网关 ,selectedNode.get("NodeType")是5,6等

      switch(selectedNode.get("NodeType")){
        case DataQuality.nodeType.Tag:
            return <TagContentField nodeData={selectedNode}
                                    showLeft={showLeft}
                                    onToggle={onToggle}
                                    anomalyType={filterType}/>;
        // 5
        case DataQuality.nodeType.Device:
        return <SummaryContentField nodeData={selectedNode}
                                    showLeft={showLeft}
                                    onToggle={onToggle}
                                    anomalyType={filterType}
                                    startTime={startTime}
                                    endTime={endTime}
                                    />;
          // 6
        case DataQuality.nodeType.GateWay:
            return <SummaryContentField nodeData={selectedNode}
                                        showLeft={showLeft}
                                        onToggle={onToggle}
                                        anomalyType={filterType}
                                        startTime={startTime}
                                        endTime={endTime}
                                        />;

        case DataQuality.nodeType.Building:
            return <BuildingContentField nodeData={selectedNode}/>;
        case DataQuality.nodeType.Organization:
            return <Organization  nodeData={selectedNode}
                                  showLeft={showLeft}
                                  onToggle={onToggle}/>;
        case DataQuality.nodeType.Site:
            return <Organization  nodeData={selectedNode}
                                  showLeft={showLeft}
                                  onToggle={onToggle}/>;
      }
    }else{
      return(<Panel onToggle={onToggle} isFolded={showLeft} toggleEnabled={false}>
            <div className='flex-center' style={{fontSize: '16px', color: '#666666'}}>{I18N.VEE.NoChoiceTip}</div>
          </Panel>)
    }
  }
}
