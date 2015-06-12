import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {Tabs, Tab} from 'material-ui';
import assign from "object-assign";
import BaselineBasic from './BaselineBasic.jsx';
import AlarmSetting from './AlarmSetting.jsx';
import BaselineModify from './BaselineModify.jsx';
import Dialog from "../../controls/Dialog.jsx";

let BaselineCfg = React.createClass({
  mixins:[Navigation,State],

  showDialog: function(){
    this.refs.cfgDialog.show();
  },

  render: function () {

    return (
      <Dialog title="基准值配置" ref="cfgDialog">
        <Tabs>
          <Tab label="基准值配置" >
            <BaselineBasic  ref="baselineBasic"/>
          </Tab>
          <Tab label="计算值修正" >
            <BaselineModify  ref="baselineModify"/>
          </Tab>
          <Tab
            label="报警设置" >
            <AlarmSetting  ref="alarmSetting"/>
          </Tab>
        </Tabs>
      </Dialog>
    );
  }
});

module.exports = BaselineCfg;
