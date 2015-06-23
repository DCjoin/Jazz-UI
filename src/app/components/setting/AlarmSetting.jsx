import React from "react";
import {Route, DefaultRoute, RouteHandler, Link, Navigation, State} from 'react-router';
import {Toggle, Checkbox} from 'material-ui';
import assign from "object-assign";

import AlarmSettingStore from '../../stores/AlarmSettingStore.jsx';
import AlarmSettingAction from "../../actions/AlarmSettingAction.jsx";


const YEARSTEP = 4,
      MONTHSTEP = 3,
      DAYSTEP = 2;

let AlarmSetting = React.createClass({
  mixins:[Navigation,State,React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      disable: true
      };
  },


	_onChange(){
    var alarmSettingData = AlarmSettingStore.getData();
    this.refs.threshold.getDOMNode().value = alarmSettingData.AlarmThreshold;
    this.refs.openAlarm.setToggled(alarmSettingData.EnableStatus);
    var stepValue = alarmSettingData.AlarmSteps;
    for(var i = 0; i < stepValue.length; i++){
      if(stepValue[i] === YEARSTEP){
        this.refs.alarmSteps.refs.year.setChecked(true);
      }
      else if(stepValue[i] === MONTHSTEP){
        this.refs.alarmSteps.refs.month.setChecked(true);
      }
      else if(stepValue[i] === DAYSTEP){
        this.refs.alarmSteps.refs.day.setChecked(true);
      }
    }
	},


  handleEdit: function() {
    this.setState({
      disable: false
    });
    console.log("handle Edit");
	},

  handleSave: function() {
    //save
    console.log("handleSave");
    this.setState({
      disable: true
    });
  },

  handleCancel: function() {
    console.log("handleCancel");
    this.setState({
      disable: true
    });
    var alarmSettingData = AlarmSettingStore.getData();
    this.refs.threshold.getDOMNode().value = alarmSettingData.AlarmThreshold;
    this.refs.openAlarm.setToggled(alarmSettingData.EnableStatus);
    var stepValue = alarmSettingData.AlarmSteps;
    for(var i = 0; i < stepValue.length; i++){
      if(stepValue[i] === YEARSTEP){
        this.refs.alarmSteps.refs.year.setChecked(true);
      }
      else if(stepValue[i] === MONTHSTEP){
        this.refs.alarmSteps.refs.month.setChecked(true);
      }
      else if(stepValue[i] === DAYSTEP){
        this.refs.alarmSteps.refs.day.setChecked(true);
      }
    }
  },

  render: function() {
    return (
      <div ref="alarmSettingDialog">
        <div className='jazz-setting-alarm-content'>
          <span>
            <Toggle ref="openAlarm" label="开启能耗报警" labelPosition="right" disabled={this.state.disable}/>
          </span>
          <span className='jazz-setting-alarm-top'>
            报警敏感度<input ref="threshold" className='jazz-setting-alarm-input' type="text" disabled={this.state.disable}/>%
          </span>
          <span className='jazz-setting-alarm-top'>
            当数据高于基准值所设敏感度时，显示报警。
          </span>
          <span className='jazz-setting-alarm-top'>
            对以下时段产生报警
          </span>
          <span className='jazz-setting-alarm-top'>
            <Checkboxes ref="alarmSteps" disabled={this.state.disable}/>
          </span>
          <button type="submit" hidden={!this.state.disable} style={{width:'50px'}} onClick={this.handleEdit}> 编辑 </button>
          <span>
            <button type="submit" hidden={this.state.disable} style={{width:'50px'}} onClick={this.handleSave}> 保存 </button>
            <button type="submit" hidden={this.state.disable} style={{width:'50px'}} onClick={this.handleCancel}> 放弃 </button>
          </span>
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    AlarmSettingStore.addSettingDataListener(this._onChange);
    AlarmSettingAction.loadData(this.props.tbId);
  },

  componentWillUnmount: function() {
    AlarmSettingStore.removeSettingDataListener(this._onChange);
  }
});

var Checkboxes = React.createClass({
	render: function(){
		return (
			<span>
				<Checkbox ref="day"  label="日" disabled={this.props.disabled}/>
				<Checkbox ref="month"  label="月" disabled={this.props.disabled}/>
				<Checkbox ref="year"  label="年" disabled={this.props.disabled}/>
			</span>
    );
  }
});

module.exports = AlarmSetting;
