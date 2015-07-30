import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, Overlay} from 'material-ui';
import assign from "object-assign";
import AlarmSetting from './AlarmSetting.jsx';
import BaselineModify from './BaselineModify.jsx';

import CommodityPanel from '../commodity/CommonCommodityPanel.jsx';

import DataSelectPanel from '../DataSelectPanel.jsx';
import ChartPanel from '../alarm/ChartPanel.jsx';
import ChartAction from '../../actions/ChartAction.jsx';
//for test commoditypanel
import CommodityAction from '../../actions/CommodityAction.jsx';

import LeftPanel from '../file/FileLeftPanel.jsx';

let Setting = React.createClass({

  mixins:[Navigation,State],
  getInitialState: function() {
      return {
        showRightPanel: false
      };
  },
  _onSwitchButtonClick(){
    this.setState({
      showRightPanel:!this.state.showRightPanel
    }, ChartAction.redrawChart);
  },
  //just for test commoditypanel
componentWillMount:function(){
  CommodityAction.setEnergyConsumptionType('Cost');
},
  render: function () {
    return (
      <div style={{display:'flex', flex:1}}>
        <LeftPanel isShow={!this.state.showRightPanel} onToggle={this._onSwitchButtonClick}/>
        <ChartPanel chartTitle='能效分析' isSettingChart={true}></ChartPanel>
        <CommodityPanel onButtonClick={this._onSwitchButtonClick} defaultStatus={this.state.showRightPanel}/>
      </div>
    );
  }
});

module.exports = Setting;
