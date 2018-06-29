'use strict';

import React, { Component}  from "react";
import TagContentField from './tag_content_field.jsx';
import Immutable from 'immutable';
var tag={
                "AlarmStatus":0,
                "AreaDimensionId":null,
                "AreaDimensionName":null,
                "Associatiable":null,
                "CalculationStep":6,
                "CalculationType":1,
                "ChannelId":1,
                "Code":"c31",
                "CollectionMethod":1,
                "Comment":null,
                "CommodityCode":null,
                "CommodityId":1,
                "CustomerId":100716,
                "DayNightRatio":null,
                "EnergyConsumption":2,
                "EnergyConsumptionFlag":0,
                "EnergyLabelId":null,
                "ErrorCode":null,
                "Formula":null,
                "FormulaRpn":null,
                "GuidCode":5684989041732177108,
                "HierarchyId":320811,
                "HierarchyName":null,
                "InvalidVars":null,
                "IsAccumulated":true,
                "IsValid":false,
                "MeterCode":"c31",
                "NewOffset":null,
                "NewOffsetStartTime":null,
                "Offset":null,
                "Slope":null,
                "StartTime":"2017-04-27T10:00:00",
                "SystemDimensionId":null,
                "SystemDimensionName":null,
                "TagGroupType":0,
                "TagModifyMode":0,
                "TimezoneId":1,
                "Type":1,
                "UomCode":null,
                "UomId":1,
                "Id":652335,
                "Name":"c31",
                "Version":14031792
            }
export default class MainPage extends Component {
  state={
    showLeft:true
  }
  render(){
    return(
      <div style={{display:'flex',flex:'1',flexDirection:'row'}}>
        {this.state.showLeft && <div style={{width:'320px',border:'1px solid red'}}/>}
        <TagContentField nodeData={Immutable.fromJS(tag)} showLeft={this.state.showLeft} onToggle={()=>{this.setState({showLeft:!this.state.showLeft})}}/>
      </div>
    )
  }
}