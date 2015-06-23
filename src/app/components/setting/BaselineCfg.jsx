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
    tagId: React.PropTypes.number
  },

  getDefaultProps: function(){
    return {
      tagId: 100006
    };
  },

  getInitialState: function() {
    return {
      tbId: this.props.tbId,
      year: (new Date()).getFullYear()
    };
  },

  refreshData: function(){
    var me = this;
    TBAction.loadData(this.props.tagId);
    var tbs = TBStore.getData();
    if(tbs && tbs.length > 0){
      for(var i=0; i< tbs.length; i++){
        if(tbs[i].TBType == 2){
          this.setState({
            tbId: tbs[i].Id,
            name: tbs[i].Name,
            onNameChanged: function(newName){
              if(this.state.name != newName){
                this.setState({name: newName});
                tbs[i].Name = newName;
                TBAction.saveData(tbs[i]);
              }
            },
            onYearChanged: function(year){
              if(this.state.year != year){
                this.setState({year: year});
              }
            }
          });
        }
      }
    }
  },

  componentDidMount: function() {
    this.refreshData();
  },

  componentWillReceiveProps: function(){
    this.refreshData();
  },

  showDialog: function(){
    this.refs.cfgDialog.show();
  },

  _onTabChanged: function(tabIndex, tab){
    if(tabIndex === 0){
      if(this.refs.baselineBasic){
        this.refs.baselineBasic.loadDataByYear(this.state.year);
      }
      else{

      }
    }else if(tabIndex == 1){
      if(this.refs.baselineModify){
        this.refs.baselineModify.loadDataByYear(this.state.year);
      } else{

      }
    }else if(tabIndex == 2){
      if(this.refs.alarmSetting){
        this.refs.alarmSetting.loadDataByYear(this.state.year);
      } else{

      }
    }
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

    var modifyProps = {

    };

    var tabsProps = {
      tabItemContainerStyle:{
        backgroundColor: 'transparent',
        borderBottom: '1px solid #ddd',
        height: '30px',
        marginTop: '-31px',
      },
      tabWidth: 150,
      style:{
        width: '760px',
        paddingLeft: '15px',
      },
      onChange: this._onTabChanged
    }, tabProps = {
      style:{
        display: 'block',
        float: 'left',
        height: '20px',
        color:'#1ca8dd',
        fontWeight:'bold',
        fontFamily: 'Microsoft YaHei'
      }
    }, lnProps={
      style:{
        marginTop: '16px',
        position: 'relative',
        height: '1px',
        backgroundColor: '#ddd',
      }
    };

    return (
      <Dialog title="基准值配置" ref="cfgDialog" style={dialogStyle}>
        <div {...lnProps}>
        </div>
        <Tabs {...tabsProps}>
          <Tab label="基准值配置" {...tabProps}>
            <BaselineBasic  ref="baselineBasic" {...basicProps} />
          </Tab>
          <Tab label="计算值修正"  {...tabProps}>
            <BaselineModify  ref="baselineModify" />
          </Tab>
          <Tab label="报警设置"  {...tabProps}>
            <AlarmSetting  ref="alarmSetting" tbId={this.state.tbId} />
          </Tab>
        </Tabs>
      </Dialog>
    );
  }
});

module.exports = BaselineCfg;
