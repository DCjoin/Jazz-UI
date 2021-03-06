'use strict';

import React, { Component}  from "react";
import DataQualityMaintenanceAction from 'actions/data_quality_maintenance.jsx';
import DataQualityMaintenanceStore from 'stores/data_quality_maintenance.jsx';
import NoticeBox from './notice_box.jsx';


export default class NoticeList extends Component {

  constructor(props) {
		super(props);
		this.state = {
      notice:null
		};
		this._onChange = this._onChange.bind(this);
	}

  _onChange(){
    this.setState({
      notice:DataQualityMaintenanceStore.getVEETagAnomaly()
    })
  }

  componentDidMount() {
    DataQualityMaintenanceStore.addChangeListener(this._onChange);
    if(this.props.anomalyType!==0){
       DataQualityMaintenanceAction.getAnomalyNotification(this.props.selectedNode.get("Id"),this.props.selectedNode.get("NodeType"),this.props.anomalyType)
    }
   
    // DataQualityMaintenanceAction.getAnomalyNotification(662400,999,2)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.selectedNode.get("Id")!==nextProps.selectedNode.get("Id") && this.props.anomalyType!==0){
      DataQualityMaintenanceAction.getAnomalyNotification(nextProps.selectedNode.get("Id"),nextProps.selectedNode.get("NodeType"),nextProps.anomalyType);
      this.setState({
        notice:null
      })
    }
  }

  componentWillUnmount() {
    DataQualityMaintenanceStore.removeChangeListener(this._onChange);
  }

  render(){
    if(this.props.anomalyType===0){
      return(
        <div className="notice-box">
            <div className="notice-box-title">{I18N.VEE.Notice.Title}</div>
              <div className="notice-box-list" style={{justifyContent: 'center',
    alignItems: 'center',fontSize: '14px',color: '#626469'}}>
                {I18N.VEE.abnormalTooltip}
              </div>
        </div>
        
      )
    }
    return(
        <NoticeBox list={this.state.notice}/>
    )
  }
}