import React from "react";
import ReactDom from 'react-dom';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {Tabs, Tab, CircularProgress} from 'material-ui';
import assign from "object-assign";
import BaselineBasic from './BaselineBasic.jsx';
import AlarmSetting from './AlarmSetting.jsx';
import BaselineModify from './BaselineModify.jsx';
import Dialog from "../../controls/Dialog.jsx";
import TBStore from "../../stores/TBStore.jsx";
import TBAction from "../../actions/TBAction.jsx";
import PropTypes from 'prop-types';
var lastTab = null;
var createReactClass = require('create-react-class');
let BaselineCfg = createReactClass({
  //mixins: [Navigation, State, mui.Mixins.StylePropable],

  propTypes: {
    tag: PropTypes.object
  },

  getInitialState: function() {
    return {
      dateRange: null,
      tag: this.props.tag,
      firstTabStyle: {
        color: '#32ad3c'
      },
      activeTabIndex: 0,
    };
  },

  refreshData: function(tagId, dateRange, callback) {
    var me = this;
    TBAction.loadData(tagId, function(tbs) {
      if (tbs && tbs.length > 0) {
        for (var i = 0; i < tbs.length; i++) {
          if (tbs[i].TBType == 2) {
            var tb = tbs[i];
            me.setState({
              tbId: tb.Id,
              name: tb.Name
            });
            if (callback) callback(tb);
          }
        }
      }
    });
  },


  componentWillReceiveProps: function(nextProps) {
    if (nextProps && nextProps.tag && nextProps.tag.tagId) {
      this.setState({
        tag: nextProps.tag
      });
    //this.refreshData(nextProps.tag.tagId);
    }
  },

  showDialog: function(tag, dateRange) {
    var me = this;
    this.setState({
      tag: tag,
      dateRange: dateRange,
      activeTabIndex: 0
    });
    this.refreshData(tag.tagId, dateRange, function(tb) {
      me.refs.cfgDialog.show();
      me.showMask();
    });
  },

  showMask: function() {
    this.refs.cvrDialog.show();
  },

  hideMask: function() {
    this.refs.cvrDialog.closeable = true;
    this.refs.cvrDialog.dismiss();
  },

  _onTabChanged: function(value, e, tab) {

    if (!!tab) {
      this.setState({
        firstTabStyle: {
          color: '#767a7a'
        }
      });
      ReactDom.findDOMNode(tab).style.color = '#32ad3c';

      if (lastTab) {
        ReactDom.findDOMNode(lastTab).style.color = '#767a7a';
      }
      lastTab = tab;
    }


  },
  _onDismiss: function() {
    lastTab = null;
    this.setState({
      firstTabStyle: {
        color: '#32ad3c'
      }
    });
  },
  _tab0Active(tab) {
    this.setState({
      activeTabIndex: 0
    });
    var ctrl = this.refs.baselineBasic;
    if (ctrl) {
      ctrl.fetchServerData(true);
    }
  },
  _tab1Active(tab) {
    this.setState({
      activeTabIndex: 1
    });
    var ctrl = this.refs.baselineModify;
    if (ctrl) {
    }
  },
  _tab2Active(tab) {
    this.setState({
      activeTabIndex: 2
    });
    var ctrl = this.refs.alarmSetting;
    if (ctrl) {
    }
  },
  render: function() {
    var dialogProps = {
        style: {
          fontFamily: "Microsoft YaHei",
          backgroundColor: '#171919 opacity(0.7)',
          zIndex: '6'
        },
        contentStyle: {
          height: '550px',
          width: '830px',
          zIndex: '6',
          opacity: 1,
        },
        titleStyle: {
          paddingTop: '24px',
          color: '#464949',
          fontSize: '20px'
        },
        onDismiss: this._onDismiss
      },
      cvrProps = {
        titleStyle: {
          display: 'none',
        },
        style: {
          background: 'transparent',
          zIndex: '7',
          opacity: 1,
        },
        contentStyle: {
          background: 'rgb(255,255,255)',
          height: '550px',
          opacity: 0.5,
        },

      };
    var me = this;
    var cusTag = {};
    if (this.state.tag) {
      cusTag.tagId = this.state.tag.tagId;
      cusTag.hierarchyId = this.state.tag.hierarchyId;
      cusTag.uom = this.state.tag.uom.Comment;
    }

    var basicProps = {
      tag: cusTag,
      name: this.state.name || null,
      tbId: this.state.tbId || null,
      dateRange: this.state.dateRange,
      year: this.state.year,
      shouldLoad: (this.state.activeTabIndex === 0),
      isViewStatus: (this.state.activeTabIndex === 0),
      onNameChanged: function(newName) {
        if (me.state.name != newName) {
          me.setState({
            name: newName
          });
          var tbs = TBStore.getData();
          for (var i = 0; i < tbs.length; i++) {
            if (tbs[i].TBType == 2) {
              var tb = tbs[i];
              tb.Name = newName;
              TBAction.saveData(tb);
            }
          }
        }
      },
      onDataLoaded: function(obj) {
        me.hideMask();
      },
      onRequestShowMask: function(obj) {
        me.showMask();
      },
      onRequestHideMask: function(obj) {
        me.hideMask();
      },
    };

    var tabsProps = {
      inkBarStyle:{
        backgroundColor:'red'
      },
        tabItemContainerStyle: {
          backgroundColor: 'transparent',
          // borderBottom: '1px solid #e4e7e6',
          height: '28px',
          //    color: 'red',
          width: '330px'
        },
        style: {
          width: '790px',
          paddingLeft: '30px',
        //  color: 'red'
        },
        tabTemplateStyle:{
          height:'28px'
        },
        contentContainerStyle: {
          borderTop: '1px solid #ececec'
        },
        onChange: this._onTabChanged
      },
      tabStyle = {
        display: 'block',
        float: 'left',
        fontSize: '14px',
        height: '18px',
        color: '#767a7a',
        fontWeight: 'bold',
        fontFamily: 'Microsoft YaHei',
      };
    var firstTabStyles = assign({},tabStyle, this.state.firstTabStyle);
    return (
      <div>
        <Dialog title={I18N.Baseline.Basic} ref="cfgDialog" {...dialogProps}>
          <div className="jazz-tabs">
            <Tabs {...tabsProps}>
              <Tab label={I18N.Baseline.Basic} style={firstTabStyles} onActive={this._tab0Active}>
                <BaselineBasic  ref="baselineBasic" {...basicProps} />
              </Tab>
              <Tab label={I18N.Baseline.Modify} style={tabStyle}  onActive={this._tab1Active}>
                <BaselineModify  ref="baselineModify" tbId={this.state.tbId} shouldLoad= {this.state.activeTabIndex === 1}/>
              </Tab>
              <Tab label={I18N.Baseline.AlarmSetting}  style={tabStyle}  onActive={this._tab2Active}>
                <AlarmSetting  ref="alarmSetting" tbId={this.state.tbId} shouldLoad= {this.state.activeTabIndex === 2}/>
              </Tab>
            </Tabs>
          </div>
        </Dialog>
        <Dialog  ref="cvrDialog" {...cvrProps}>
          <div style={{
        margin: "0 auto 0",
        width: 154,
        paddingTop: 255
      }}>
            <CircularProgress mode="indeterminate"  size={80} />
          </div>
        </Dialog>
      </div>
      );
  }
});

module.exports = BaselineCfg;
