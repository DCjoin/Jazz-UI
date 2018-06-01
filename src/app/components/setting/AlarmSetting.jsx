import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import { Toggle, Checkbox, RaisedButton, TextField } from 'material-ui';
import assign from "object-assign";

import AlarmSettingStore from '../../stores/AlarmSettingStore.jsx';
import AlarmSettingAction from "../../actions/AlarmSettingAction.jsx";
import { DataSelectMainPanel } from "../DataSelectMainPanel.jsx";

var extractNumber = function(str) {
  var value = str.replace(/[^\d\.]/g, '');
  var dotIndex = value.indexOf('.');
  if (dotIndex !== -1) {
    if (dotIndex === 0)
      value = '0' + value;
    dotIndex = value.indexOf('.');
    value = value.split('.').join('');
    value = [value.slice(0, dotIndex), '.', value.slice(dotIndex)].join('');
  }
  return value;
};

const YEARSTEP = 3,
  MONTHSTEP = 2,
  DAYSTEP = 1;
var createReactClass = require('create-react-class');
let AlarmSetting = createReactClass({
  //mixins: [Navigation, State, React.addons.LinkedStateMixin],

  _onChange: function() {
    var alarmSettingData = AlarmSettingStore.getData();
    this.setValue(alarmSettingData);
  //DataSelectMainPanel.resetTagNode();
  },
  getValue: function() {
    var alarmSteps = this.refs.alarmSteps.getValue();
    return {
      tbId: this.props.tbId,
      alarmSteps: alarmSteps,
      thresholdValue: this.refs.threshold.getValue(),
      enableStatus: this.refs.openAlarm.isToggled()
    };
  },
  setValue: function(alarmSettingData) {
    this.refs.openAlarm.setToggled(alarmSettingData.EnableStatus);
    this.setState({
      threshold:alarmSettingData.AlarmThreshold,
      // alarmSteps:alarmSettingData.AlarmSteps
    })
    // this.refs.threshold.setValue(alarmSettingData.AlarmThreshold);
     this.refs.alarmSteps.setValue(alarmSettingData.AlarmSteps);
  },
  handleEdit: function() {
    this.setState({
      isDisplay: false,
      disable: !this.refs.openAlarm.isToggled()
    });
  },
  handleSave: function() {
    if (this._validate()) {
      this.setState({
        isDisplay: true,
        disable: true
      });
      var val = this.getValue();
      AlarmSettingAction.saveData(val);
    }
  },
  handleCancel: function() {
    this.setState({
      isDisplay: true,
      disable: true,
      errorText: ""
    });
    this._onChange();
  },
  _validate: function() {
    var val = this.refs.threshold.getValue();
    return this._validateValue(val) !== '';
  },
  _validateValue: function(val) {
    var value = extractNumber(val);
    if (val === value) {
      //this.refs.threshold.setValue(value);
      this.setState({
        threshold: value,
        errorText: (value === '' ? I18N.Baseline.Error.TbnameError : '')
      });
    }
    else {
      this.setState({
        errorText: (value === '' ? I18N.Baseline.Error.TbnameError : '')
      });
    }

    return value;
  },
  changeThreshold: function(e) {
    var value = this._validateValue(e.target.value);
  },
  changeToggle: function() {
    this.setState({
      disable: !this.refs.openAlarm.isToggled()
    });
  },
  getInitialState: function() {
    return {
      disable: true,
      isDisplay: true,
      threshold: 100,
      errorText: ""
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.shouldLoad) {
      AlarmSettingAction.loadData(this.props.tbId);
    }
  },
  componentDidMount: function() {
    AlarmSettingStore.addSettingDataListener(this._onChange);
  },
  componentWillUnmount: function() {
    AlarmSettingStore.removeSettingDataListener(this._onChange);
  },
  render: function() {
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
          <div style={{
        width: '130px'
      }}>
            <Toggle ref="openAlarm" label={I18N.ALarm.Alarm} labelPosition="left" onToggle={this.changeToggle} disabled={this.state.disable && this.state.isDisplay}/>
          </div>
          <div className='jazz-setting-alarm-threshold'>
            {I18N.Setting.TargetBaseline.AlarmThreshold}<TextField ref="threshold" value={this.state.threshold} style={inputStyle}  className="jazz-setting-input" errorText={this.state.errorText} disabled={this.state.disable} onChange={this.changeThreshold}/>%
          </div>
          <div className='jazz-setting-alarm-tip'>
            {I18N.Setting.TargetBaseline.AlarmThresholdTip}
          </div>
          <div className='jazz-setting-alarm-text'>
            {I18N.Baseline.BaselineBasic.AlarmText}
          </div>
          <div>
            <Checkboxes ref="alarmSteps" disabled={this.state.disable}/>
          </div>
        </div>
        <div>
          <div hidden={!this.state.isDisplay}>
            <RaisedButton label={I18N.Baseline.Button.Edit} style={buttonStyle} labelStyle={labelStyle} onClick={this.handleEdit}/>
          </div>
          <div hidden={this.state.isDisplay}>
            <RaisedButton label={I18N.Baseline.Button.Save} style={buttonStyle} labelStyle={labelStyle} onClick={this.handleSave}/>
            <RaisedButton label={I18N.Baseline.Button.Cancel} style={buttonStyle} labelStyle={labelStyle} onClick={this.handleCancel}/>
          </div>
        </div>
      </div>
      );
  }
});

var Checkboxes = createReactClass({
  getValue: function() {
    var alarmSteps = [];
    if (this.refs.year.isChecked()) {
      alarmSteps.push(YEARSTEP);
    }
    if (this.refs.month.isChecked()) {
      alarmSteps.push(MONTHSTEP);
    }
    if (this.refs.day.isChecked()) {
      alarmSteps.push(DAYSTEP);
    }
    return alarmSteps;
  },
  clearValue: function() {
    this.refs.year.setChecked(false);
    this.refs.month.setChecked(false);
    this.refs.day.setChecked(false);
  },
  setValue: function(stepValue) {
    this.clearValue();
    if (stepValue !== null) {
      for (var i = 0; i < stepValue.length; i++) {
        if (stepValue[i] === YEARSTEP) {
          this.refs.year.setChecked(true);
        } else if (stepValue[i] === MONTHSTEP) {
          this.refs.month.setChecked(true);
        } else if (stepValue[i] === DAYSTEP) {
          this.refs.day.setChecked(true);
        }
      }
    }
  },
  render: function() {
    let checkWidth = {
      width: '80px'
    };
    return (
      <div className="jazz-setting-alarm-checkbox">
				<Checkbox style={checkWidth} ref="day" label={I18N.ALarm.Uom.Day} disabled={this.props.disabled}/>
				<Checkbox style={checkWidth} ref="month" label={I18N.ALarm.Uom.Month} disabled={this.props.disabled}/>
				<Checkbox style={checkWidth} ref="year" label={I18N.ALarm.Uom.Year} disabled={this.props.disabled}/>
			</div>
      );
  }
});

module.exports = AlarmSetting;
