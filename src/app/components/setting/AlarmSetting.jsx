import React from "react";
import {Route, DefaultRoute, RouteHandler, Link, Navigation, State} from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, Overlay} from 'material-ui';
import assign from "object-assign";

import AlarmSettingStore from '../../stores/AlarmSettingStore.jsx';
import AlarmSettingAction from "../../actions/AlarmSettingAction.jsx";

let AlarmSetting = React.createClass({
  mixins:[Navigation,State,React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      disable: true,
      threshold: 100
      };
  },


	_onChange(){
    var alarmSettingData = AlarmSettingStore.getData();
    this.setState({
      threshold: alarmSettingData.AlarmThreshold
    });
	},

  loadDataByYear: function(year){

  },


  handleCheck: function(e) {
    console.log(e.target.value);
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
  },

  handleChange: function(event) {
    this.setState({
      threshold: event.target.value
    });
  },

  render: function() {
    return (
      <div ref="alarmSettingDialog">
        <div className='jazz-setting-alarm-content'>
          <span>
            <input className="jazz-setting-alarm-checkbox" type="checkbox" disabled={this.state.disable} />
            <span>开启能耗报警</span>
          </span>
          <span className='jazz-setting-alarm-top'>
            报警敏感度<input className='jazz-setting-alarm-input' type="text" value={this.state.threshold} disabled={this.state.disable} onChange={this.handleChange}/>%
          </span>
          <span className='jazz-setting-alarm-top'>
            当数据高于基准值所设敏感度时，显示报警。
          </span>
          <span className='jazz-setting-alarm-top'>
            对以下时段产生报警
          </span>
          <span className='jazz-setting-alarm-top'>
            <Checkboxes handleCheck={this.handleCheck} disabled={this.state.disable} />
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
				<input onClick={this.props.handleCheck}  name="stepCheckbox" type="checkbox" value="day"  disabled={this.props.disabled} />
        日
				<input onClick={this.props.handleCheck} name="stepCheckbox" type="checkbox" value="month"  disabled={this.props.disabled} />
			  月
				<input onClick={this.props.handleCheck} name="stepCheckbox" type="checkbox" value="year"  disabled={this.props.disabled} />
        年
			</span>
    );
  }
});

module.exports = AlarmSetting;
