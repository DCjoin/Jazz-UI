import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, Overlay} from 'material-ui';
import assign from "object-assign";
import AlarmSetting from './AlarmSetting.jsx';
import BaselineModify from './BaselineModify.jsx';

import DataSelectPanel from '../DataSelectPanel.jsx';
import ChartPanel from '../alarm/ChartPanel.jsx';
import ChartAction from '../../actions/ChartAction.jsx';

let Setting = React.createClass({

  mixins:[Navigation,State],
  getInitialState: function() {
      return {
        showRightPanel: true
      };
  },
  _onSwitchButtonClick(){
    this.setState({
      showRightPanel:!this.state.showRightPanel
    }, ChartAction.redrawChart);
  },

  render: function () {
    return (
      <div style={{display:'flex', flex:1}}>
        <ChartPanel chartTitle='能效分析' isSettingChart={true}></ChartPanel>
        <DataSelectPanel linkFrom="Setting" defaultStatus={true} onButtonClick={this._onSwitchButtonClick}></DataSelectPanel>
      </div>
    );
  }
});

module.exports = Setting;
