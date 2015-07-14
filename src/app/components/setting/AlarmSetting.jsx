import React from "react";
import {Route, DefaultRoute, RouteHandler, Link, Navigation, State} from 'react-router';
import {Toggle, Checkbox, RaisedButton, TextField} from 'material-ui';
import assign from "object-assign";

import AlarmSettingStore from '../../stores/AlarmSettingStore.jsx';
import AlarmSettingAction from "../../actions/AlarmSettingAction.jsx";

var extractNumber = function(str){
  var value = str.replace(/[^\d\.]/g,'');
  var dotIndex = value.indexOf('.');
  if(dotIndex != -1){
    if(dotIndex === 0) value = '0' + value;
    dotIndex = value.indexOf('.');
    value = value.split('.').join('');
    value = [value.slice(0, dotIndex), '.', value.slice(dotIndex)].join('');
  }
  return value;
};

const YEARSTEP = 3,
      MONTHSTEP = 2,
      DAYSTEP = 1;

let AlarmSetting = React.createClass({
  mixins:[Navigation,State,React.addons.LinkedStateMixin],

	_onChange: function(){
    var alarmSettingData = AlarmSettingStore.getData();
    this.setValue(alarmSettingData);
	},
  getValue: function(){
    var alarmSteps = this.refs.alarmSteps.getValue();
    return {
      tbId: this.props.tbId,
      alarmSteps: alarmSteps,
      thresholdValue: this.refs.threshold.getValue(),
      enableStatus: this.refs.openAlarm.isToggled()
    };
  },
  setValue: function(alarmSettingData){
    this.refs.openAlarm.setToggled(alarmSettingData.EnableStatus);
    this.refs.threshold.setValue(alarmSettingData.AlarmThreshold);
    this.refs.alarmSteps.setValue(alarmSettingData.AlarmSteps);
  },
  handleEdit: function(){
    this.setState({
      isDisplay: false,
      disable: !this.refs.openAlarm.isToggled()
    });
	},
  handleSave: function(){
    if(this._validate()){
      this.setState({
        isDisplay: true,
        disable: true
      });
      var val = this.getValue();
      AlarmSettingAction.saveData(val);
    }
  },
  handleCancel: function(){
    this.setState({
      isDisplay: true,
      disable: true,
      errorText: ""
    });
    this._onChange();
  },
  _validate: function(){
    var val = this.refs.threshold.getValue();
    return this._validateValue(val) !== '';
  },
  _validateValue: function(val){
    var value = extractNumber(val);
    if(val !== value){
      this.refs.threshold.setValue(value);
    }
    this.setState({errorText: (value === '' ? '必填项' : '')});
    return value;
  },
  changeThreshold: function(e){
    var value = this._validateValue(e.target.value);
  },
  changeToggle: function(){
    this.setState({
      disable: !this.refs.openAlarm.isToggled()
    });
  },
  getInitialState: function(){
    return {
      disable: true,
      isDisplay: true,
      threshold: 100,
      errorText: ""
    };
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.shouldLoad){
      AlarmSettingAction.loadData(this.props.tbId);
    }
  },
  componentDidMount: function(){
    AlarmSettingStore.addSettingDataListener(this._onChange);
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
      fontFamily: 'Microsoft YaHei',
      color: '#767a7a',
      backgroundColor: 'transparent',
      border: '1px solid #e4e7e6'
    },
    buttonStyle = {
      width: '80px',
      minWidth: "80px",
      height: '30px',
      marginRight: '10px'
    },
    labelStyle = {
      fontSize: '14px',
      color: '#767a7a',
      lineHeight: '30px',
    };
    return (
      <div className="jazz-setting-alarm-container">
        <div className='jazz-setting-alarm-content'>
          <div style={{width:'160px'}}>
            <Toggle ref="openAlarm" label="开启能耗报警" labelPosition="left" onToggle={this.changeToggle} disabled={this.state.disable&&this.state.isDisplay}/>
          </div>
          <div className='jazz-setting-alarm-threshold'>
            报警敏感度<TextField ref="threshold" defaultValue={this.state.threshold} style={inputStyle}  className="jazz-setting-input" errorText={this.state.errorText} disabled={this.state.disable} onChange={this.changeThreshold}/>%
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
          <div hidden={!this.state.isDisplay}>
            <RaisedButton label="编辑" style={buttonStyle} labelStyle={labelStyle} onClick={this.handleEdit}/>
          </div>
          <div hidden={this.state.isDisplay}>
            <RaisedButton label="保存" style={buttonStyle} labelStyle={labelStyle} onClick={this.handleSave}/>
            <RaisedButton label="放弃" style={buttonStyle} labelStyle={labelStyle} onClick={this.handleCancel}/>
          </div>
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
