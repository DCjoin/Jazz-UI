import React from "react";
import {Route, DefaultRoute, RouteHandler, Link, Navigation, State} from 'react-router';
import {Toggle, Checkbox, RaisedButton} from 'material-ui';
import assign from "object-assign";

import AlarmSettingStore from '../../stores/AlarmSettingStore.jsx';
import AlarmSettingAction from "../../actions/AlarmSettingAction.jsx";


const YEARSTEP = 4,
      MONTHSTEP = 3,
      DAYSTEP = 2;

let AlarmSetting = React.createClass({
  mixins:[Navigation,State,React.addons.LinkedStateMixin],

	_onChange: function(){
    var alarmSettingData = AlarmSettingStore.getData();
    this.refs.threshold.getDOMNode().value = alarmSettingData.AlarmThreshold;
    this.refs.openAlarm.setToggled(alarmSettingData.EnableStatus);
    var stepValue = alarmSettingData.AlarmSteps;
    this.refs.alarmSteps.setValue(stepValue);
	},

  getValue: function(){
    var alarmSteps = this.refs.alarmSteps.getValue();

    return {
      tbId: this.props.tbId,
      alarmSteps: alarmSteps,
      thresholdValue: this.refs.threshold.getDOMNode().value,
      enableStatus: this.refs.openAlarm.isToggled()
    };
  },

  handleEdit: function(){
    this.setState({
      disable: false
    });
	},

  handleSave: function(){
    this.setState({
      disable: true
    });
    var val = this.getValue();
    AlarmSettingAction.saveData(val);
  },

  handleCancel: function(){
    this.setState({
      disable: true
    });
    this._onChange();
  },

  getInitialState: function(){
    return {
      disable: true
      };
  },

  componentDidMount: function(){
    AlarmSettingStore.addSettingDataListener(this._onChange);
    AlarmSettingAction.loadData(this.props.tbId);
  },

  componentWillUnmount: function(){
    AlarmSettingStore.removeSettingDataListener(this._onChange);
  },
  
  render: function(){
    return (
      <div className="jazz-setting-container">
        <div className='jazz-setting-content'>
          <span>
            <Toggle ref="openAlarm" label="开启能耗报警" labelPosition="right" disabled={this.state.disable}/>
          </span>
          <span className='jazz-setting-alarm-margin'>
            报警敏感度<input ref="threshold" className='jazz-setting-alarm-input' type="text" disabled={this.state.disable}/>%
          </span>
          <span className='jazz-setting-alarm-tip'>
            当数据高于基准值所设敏感度时，显示报警。
          </span>
          <span className='jazz-setting-alarm-margin'>
            对以下时段产生报警
          </span>
          <span>
            <Checkboxes ref="alarmSteps" disabled={this.state.disable}/>
          </span>
        </div>
        <div>
          <button className='jazz-setting-button' hidden={!this.state.disable} onClick={this.handleEdit}> 编辑 </button>
          <span>
            <button className='jazz-setting-button' hidden={this.state.disable} onClick={this.handleSave}> 保存 </button>
            <button className='jazz-setting-button' hidden={this.state.disable} onClick={this.handleCancel}> 放弃 </button>
          </span>
        </div>
      </div>
    );
  }
});

var Checkboxes = React.createClass({
  getValue: function(){
    var alarmSteps = [];

    if(this.refs.year.isChecked()){
      alarmSteps.push(YEARSTEP);
    }
    if(this.refs.month.isChecked()){
      alarmSteps.push(MONTHSTEP);
    }
    if(this.refs.day.isChecked()){
      alarmSteps.push(DAYSTEP);
    }

    return alarmSteps;
  },
  setValue: function(stepValue){
    for(var i = 0; i < stepValue.length; i++){
      if(stepValue[i] === YEARSTEP){
        this.refs.year.setChecked(true);
      }
      else if(stepValue[i] === MONTHSTEP){
        this.refs.month.setChecked(true);
      }
      else if(stepValue[i] === DAYSTEP){
        this.refs.day.setChecked(true);
      }
    }
  },
	render: function(){
		return (
			<span>
				<Checkbox ref="day" label="日" disabled={this.props.disabled}/>
				<Checkbox ref="month" label="月" disabled={this.props.disabled}/>
				<Checkbox ref="year" label="年" disabled={this.props.disabled}/>
			</span>
    );
  }
});

module.exports = AlarmSetting;
