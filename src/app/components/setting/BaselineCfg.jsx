import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {Tabs, Tab} from 'material-ui';
import assign from "object-assign";
import BaselineBasic from './BaselineBasic.jsx';
import AlarmSetting from './AlarmSetting.jsx';
import BaselineModify from './BaselineModify.jsx';
import Dialog from "../../controls/Dialog.jsx";
import TBStore from "../../stores/TBStore.jsx";
import TBAction from "../../actions/TBAction.jsx";

let BaselineCfg = React.createClass({
  mixins:[Navigation,State],

  propTypes: {
    tagId: React.PropTypes.number,
    tbId: React.PropTypes.number,

    name: React.PropTypes.string,
    year: React.PropTypes.number,
    items: React.PropTypes.array,

    isViewStatus: React.PropTypes.bool
  },

  getDefaultProps: function(){
    return {
      tagId: 100006
    }
  },

  getInitialState: function() {
    return {
      tbId: this.props.tbId,
      name: this.props.name || "",
    };
  },

  setTB: function(){
    TBAction.loadData(this.props.tagId);
    var tbs = TBStore.getData();
    if(tbs && tbs.length > 0){
      for(var i=0; i< tbs.length; i++){
        if(tbs[i].TBType == 2){
          this.setState({
            tbId: tbs[i].Id,
            name: tbs[i].Name,
          });
          this.refs.baselineBasic.name = tbs[i].Name;
          this.refs.baselineBasic.tbId = tbs[i].Id;
          break;
        }
      }
    }
  },

  componentDidMount: function() {
    this.setTB();
  },

  componentWillReceiveProps: function(){
    this.setTB();
  },

  showDialog: function(){
    this.refs.cfgDialog.show();
  },

  render: function () {
    var dialogStyle = {
      fontFamily: "Microsoft YaHei",
    };

    var basicProps = {
      tagId: this.props.tagId,
      name: this.state.name || null,
      tbId: this.state.tbId || null,
    };

    return (
      <Dialog title="基准值配置" ref="cfgDialog" style={dialogStyle}>
        <Tabs>
          <Tab label="基准值配置" >
            <BaselineBasic  ref="baselineBasic" {...basicProps}/>
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
