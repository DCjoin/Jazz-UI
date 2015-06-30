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
    TBAction.loadData(this.props.tagId, function(tbs){
      if(tbs && tbs.length > 0){
        for(var i=0; i< tbs.length; i++){
          if(tbs[i].TBType == 2){
            me.setState({
              tbId: tbs[i].Id,
              name: tbs[i].Name,
              onNameChanged: function(newName){
                if(me.state.name != newName){
                  me.setState({name: newName});
                  tbs[i].Name = newName;
                  TBAction.saveData(tbs[i]);
                }
              },
              onYearChanged: function(year){
                if(me.state.year != year){
                  me.setState({year: year});
                }
              }
            });
          }
        }
      }
    });
    //var tbs = TBStore.getData();
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
    var dialogProps={
      style:{
        fontFamily: "Microsoft YaHei",
        backgroundColor:'#171919 opacity(0.7)',
        zIndex:'110'
      },
      contentStyle:{
        width:'830px',
        height:'550px',
        zIndex:'110'
      },
      titleStyle:{
        paddingTop:'24px',
        color:'#464949',
        fontSize:'20px'
      }
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
        borderBottom: '1px solid #e4e7e6',
        height: '28px',
        color:'#1ca8dd',
      },
      tabWidth: 110,
      style:{
        width: '790px',
        paddingLeft: '30px',
      },
      onChange: this._onTabChanged
    }, tabProps = {
      style:{
        display: 'block',
        float: 'left',
        fontSize: '14px',
        height:'18px',
        color:'#1c8add',
        fontWeight:'bold',
        fontFamily: 'Microsoft YaHei'
      }

    };

    return (

        <Dialog title="基准值配置" ref="cfgDialog" {...dialogProps}>
          <div className="jazz-tabs">
            <Tabs {...tabsProps}>
              <Tab label="基准值配置" {...tabProps}>
                <BaselineBasic  ref="baselineBasic" {...basicProps} />
              </Tab>
              <Tab label="计算值修正"  {...tabProps}>
                <BaselineModify  ref="baselineModify" tbId={this.state.tbId} />
              </Tab>
              <Tab label="报警设置"  {...tabProps}>
                <AlarmSetting  ref="alarmSetting" tbId={this.state.tbId} />
              </Tab>
            </Tabs>
          </div>

        </Dialog>


    );
  }
});

module.exports = BaselineCfg;
