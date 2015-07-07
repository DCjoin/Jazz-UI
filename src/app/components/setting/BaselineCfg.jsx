import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State} from 'react-router';
import mui from 'material-ui';
import assign from "object-assign";
import BaselineBasic from './BaselineBasic.jsx';
import AlarmSetting from './AlarmSetting.jsx';
import BaselineModify from './BaselineModify.jsx';
import Dialog from "../../controls/Dialog.jsx";
import TBStore from "../../stores/TBStore.jsx";
import TBAction from "../../actions/TBAction.jsx";
var lastTab=null;

let {Tabs, Tab} = mui;

let BaselineCfg = React.createClass({
  mixins:[Navigation,State,mui.Mixins.StylePropable],

  propTypes: {
    tag: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      tag: this.props.tag,
      year: (new Date()).getFullYear(),
      firstTabStyle:{
        color:'#1ca8dd'
      }
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
              name: tb.Name,
              // onNameChanged: function(newName){
              //   if(me.state.name != newName){
              //     me.setState({name: newName});
              //     tb.Name = newName;
              //     TBAction.saveData(tb);
              //   }
              // },
              // onYearChanged: function(year){
              //   if(me.state.year != year){
              //     me.setState({year: year});
              //   }
              // }
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
    };
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
    });
  },

  _onTabChanged: function(tabIndex, tab){
    this.setState({
      firstTabStyle:{
        color:'#767a7a'
      }
    });
    tab.getDOMNode().style.color='#1ca8dd';
    if(lastTab){
        lastTab.getDOMNode().style.color='#767a7a';
    }
    lastTab=tab;
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
      }
    };

    var modifyProps = {

    };

    var tabsProps = {
      tabItemContainerStyle:{
        backgroundColor: 'transparent',
        borderBottom: '1px solid #e4e7e6',
        height: '28px',
        color:'red',
      },
      tabWidth: 110,
      style:{
        width: '790px',
        paddingLeft: '30px',
        color:'red'
      },
     onChange: this._onTabChanged
   },
   tabStyle={
     display: 'block',
     float: 'left',
     fontSize: '14px',
     height:'18px',
     color:'#767a7a',
     fontWeight:'bold',
     fontFamily: 'Microsoft YaHei'
   };
   var firstTabStyles=this.mergeAndPrefix(tabStyle,this.state.firstTabStyle);

    return (
        <Dialog title="基准值配置" ref="cfgDialog" {...dialogProps}>
          <div className="jazz-tabs">
            <Tabs {...tabsProps}>
              <Tab label="基准值配置" style={firstTabStyles}>
                <BaselineBasic  ref="baselineBasic" {...basicProps} />
              </Tab>
              <Tab label="计算值修正" style={tabStyle}>
                <BaselineModify  ref="baselineModify" tbId={this.state.tbId}/>
              </Tab>
              <Tab label="报警设置"  style={tabStyle}>
                <AlarmSetting  ref="alarmSetting" tbId={this.state.tbId} />
              </Tab>
            </Tabs>
          </div>

        </Dialog>


    );
  }
});

module.exports = BaselineCfg;
