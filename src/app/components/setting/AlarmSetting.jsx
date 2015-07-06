import React from "react";
import {Route, DefaultRoute, RouteHandler, Link, Navigation, State} from 'react-router';
import {Toggle, Checkbox, RaisedButton, TextField} from 'material-ui';
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
    this.setState({
      threshold: alarmSettingData.AlarmThreshold
    });
    this.refs.openAlarm.setToggled(alarmSettingData.EnableStatus);
    var stepValue = alarmSettingData.AlarmSteps;
    this.refs.alarmSteps.setValue(stepValue);
	},

  getValue: function(){
    var alarmSteps = this.refs.alarmSteps.getValue();

    return {
      tbId: this.props.tbId,
      alarmSteps: alarmSteps,
      thresholdValue: this.state.threshold,
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

  _validate: function(val){
    var value = val.replace(/[^\d\.]/g,'');
    var dotIndex = value.indexOf('.');
    if(dotIndex != -1){
      if(dotIndex === 0){
        value = '0' + value;
      }
      value = value.split('.').join('');
      value = [value.slice(0, dotIndex), '.', value.slice(dotIndex)].join('');
    }

    this.refs.threshold.getDOMNode().value = value;
    if(value === ''){
      this.setState({error: "必填项"});
      return false;
    }
    else{
      this.setState({error: ""});
      return true;
    }
  },

  changeThreshold: function(e){
    if(this._validate(e.target.value)){
      this.setState({
        threshold: e.target.value
      });
    }
  },

  getInitialState: function(){
    return {
      disable: true,
      threshold: 100,
      error: ""
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
    var inputStyle = {
      width: '45px',
      height: '30px',
      marginLeft: '10px',
      marginRight: '10px',
      fontSize: '14px',
      color: '#767a7a',
      backgroundColor: 'transparent',
      border: '1px solid #e4e7e6'
    };
    return (
      <div className="jazz-setting-alarm-container">
        <div className='jazz-setting-alarm-content'>
          <div>
            <Toggle ref="openAlarm" label="开启能耗报警" labelPosition="right" disabled={this.state.disable}/>
          </div>
          <div className='jazz-setting-alarm-threshold'>
            报警敏感度<TextField ref="threshold" value={this.state.threshold} style={inputStyle} className="jazz-setting-input" disabled={this.state.disable} onChange={this.changeThreshold}/>%
          </div>
          <div className='jazz-setting-alarm-tip'>
            当数据高于基准值所设敏感度时，显示报警。
          </div>
          <div className='jazz-setting-alarm-text'>
            对以下时段产生报警
          </div>
          <div>
            <Checkboxes ref="alarmSteps" disabled={this.state.disable}/>
          </div>
        </div>
        <div>
          <button className='jazz-setting-basic-editbutton' hidden={!this.state.disable} onClick={this.handleEdit}> 编辑 </button>
          <span>
            <button className='jazz-setting-basic-editbutton' hidden={this.state.disable} onClick={this.handleSave}> 保存 </button>
            <button className='jazz-setting-basic-editbutton' hidden={this.state.disable} onClick={this.handleCancel}> 放弃 </button>
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
  clearValue: function(){
    this.refs.year.setChecked(false);
    this.refs.month.setChecked(false);
    this.refs.day.setChecked(false);
  },
  setValue: function(stepValue){
    this.clearValue();
    if(stepValue !== null){
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
    }
  },
	render: function(){
    let checkWidth = {width: '60px'};
		return (
			<div className="jazz-setting-alarm-checkbox">
				<Checkbox style={checkWidth} ref="day" label="日" disabled={this.props.disabled}/>
				<Checkbox style={checkWidth} ref="month" label="月" disabled={this.props.disabled}/>
				<Checkbox style={checkWidth} ref="year" label="年" disabled={this.props.disabled}/>
			</div>
    );
  }
});

module.exports = AlarmSetting;
