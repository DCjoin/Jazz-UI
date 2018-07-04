'use strict';

import React, { Component}  from "react";
import DataQualityMaintenanceAction from 'actions/data_quality_maintenance.jsx';
import DataQualityMaintenanceStore from 'stores/data_quality_maintenance.jsx';
import NoticeBox from './notice_box.jsx';


export default class TagNotice extends Component {

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
    DataQualityMaintenanceAction.getAnomalyNotification(this.props.selectedTag.get("Id"),this.props.selectedTag.get("NodeType"),this.props.anomalyType)
    // DataQualityMaintenanceAction.getAnomalyNotification(662400,999,2)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.selectedTag.get("Id")!==nextProps.selectedTag.get("Id")){
      DataQualityMaintenanceAction.getAnomalyNotification(nextProps.selectedTag.get("Id"),nextProps.selectedTag.get("NodeType"),nextProps.anomalyType);
      this.setState({
        notice:null
      })
    }
  }

  componentWillUnmount() {
    DataQualityMaintenanceStore.removeChangeListener(this._onChange);
  }

  render(){
    return(
        <NoticeBox list={this.state.notice}/>
    )
  }
}