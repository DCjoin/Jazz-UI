import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {Tabs, Tab, CircularProgress} from 'material-ui';
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
    tag: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      tag: this.props.tag,
      year: (new Date()).getFullYear()
    };
  },

  refreshData: function(tagId, callback){
    var me = this;
    TBAction.loadData(tagId, function(tbs){
      if(tbs && tbs.length > 0){
        for(var i=0; i< tbs.length; i++){
          if(tbs[i].TBType == 2){
            var tb = tbs[i];
            me.setState({
              tbId: tb.Id,
              name: tb.Name
            });
            if(callback) callback(tb);
          }
        }
      }
    });
  },

  componentDidMount: function() {
    if(this.state.tag){
      this.refreshData(this.state.tag.tagId);
    }
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps && nextProps.tag && nextProps.tag.tagId){
      this.setState({tag: nextProps.tag});
      this.refreshData(nextProps.tag.tagId);
    }
  },

  showDialog: function(tag){
    var me = this;
    this.setState({tag: tag});
    this.refreshData(tag.tagId, function(tb){
      me.refs.cfgDialog.show();
      //me.showMask();
    });
  },

  showMask: function(){
    this.refs.cvrDialog.show();
  },

  hideMask: function(){
    this.refs.cvrDialog.closeable = true;
    this.refs.cvrDialog.dismiss();
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
        height:'550px',
        width:'830px',
        zIndex:'110',
        opacity: 1,
      },
      titleStyle:{
        paddingTop:'24px',
        color:'#464949',
        fontSize:'20px'
      }
    },
    cvrProps = {
      titleStyle:{
        display: 'none',
      },
      style:{
        background:'rgb(255,255,255,0.9)',
        zIndex:'111',
        opacity: 1,
      },
      contentStyle:{
        background:'rgb(255,255,255,0.9)',
        height:'650px',
        opacity: 0.5,
      },
    };
    var me = this;
    var cusTag = {};
    if(this.state.tag){
      cusTag.tagId = this.state.tag.tagId;
      cusTag.hierarchyId = this.state.tag.hierarchyId;
      cusTag.uom = this.state.tag.uom.Comment;
    }

    var basicProps = {
      tag: cusTag,
      name: this.state.name || null,
      tbId: this.state.tbId || null,
      onNameChanged: function(newName){
        if(me.state.name != newName){
          me.setState({name: newName});
          var tbs = TBStore.getData();
          for(var i=0; i< tbs.length; i++){
            if(tbs[i].TBType == 2){
              var tb = tbs[i];
              tb.Name = newName;
              TBAction.saveData(tb);
            }
          }
        }
      },
      onRequestShowMask: function(obj){
        me.showMask();
      },
      onRequestHideMask: function(obj){
        me.hideMask();
      },
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
      <div>
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
        <Dialog  ref="cvrDialog" {...cvrProps}>
          <div style={{margin:"0 auto 0", width:50, paddingTop: 255}}>
            <CircularProgress mode="indeterminate"  size={1.5} />
          </div>
        </Dialog>
      </div>
    );
  }
});

module.exports = BaselineCfg;
