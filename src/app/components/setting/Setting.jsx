import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, Overlay} from 'material-ui';
import assign from "object-assign";
import AlarmSetting from './AlarmSetting.jsx';
import BaselineModify from './BaselineModify.jsx';
import BaselineCfg from './BaselineCfg.jsx';
import DataSelectPanel from '../DataSelectPanel.jsx';
import ChartPanel from '../alarm/ChartPanel.jsx';

let Setting = React.createClass({
  mixins:[Navigation,State],
  handleAlarmSetting: function(e){

    console.log(e.nativeEvent);
    this.refs.alarmSetting.showDialog();
  },
  handleModify: function(e){
    console.log("handleModify");
    this.refs.baselineModify.showDialog();
  },
  handleBaselineCfg: function(e){
    console.log("handleCfg");
    this.refs.baselineCfg.showDialog();
  },
  render: function () {

    return (
      <div >
        <BaselineCfg  ref="baselineCfg"/>
        <button  onClick={this.handleBaselineCfg}>BaselineBasic</button>
        <br/>
        <ChartPanel chartTitle='能效分析' isSettingChart={true}></ChartPanel>
        <DataSelectPanel  onButtonClick={this._onSwitchButtonClick} linkFrom="Setting" defaultStatus={true}></DataSelectPanel>
      </div>
    );
  }
});

module.exports = Setting;
