'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {Checkbox} from 'material-ui';
import classnames from 'classnames';
import TagItem from './TagItem.jsx';
import TagStore from '../../stores/TagStore.jsx';
import TagAction from '../../actions/TagAction.jsx';

var TagMenu=React.createClass({

  propTypes: {
      tagList:React.PropTypes.object,
  },
  _onCheckSelect:function(checkFlag){
    this.setState({
        allCheckDisable:checkFlag
      })
  },
  _onTagStatusChange:function(){
    this.setState({
      tagStatus:TagStore.getCurrentHierIdTagStatus(),
    })
  },
  _onAllCheck:function(e, checked){
    TagAction.setTagStatusByTagList(this.props.tagList,checked);
    this.setState({
    checked:!this.state.checked
  });
  },

  _onTagTotalChange:function(){
    this.setState({
      tagTotal:!this.state.tagTotal
    });
  },
  getInitialState: function() {
    return {
      allDisable:false,
      tagStatus:TagStore.getCurrentHierIdTagStatus(),
      tagTotal:false,
      checked:TagStore.getCheckAllCheckedStatus()
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      allCheckDisable:TagStore.getCheckAllDisabledStatus(),
      tagStatus:TagStore.getCurrentHierIdTagStatus(),
      checked:TagStore.getCheckAllCheckedStatus()
    });
  },
  componentDidMount: function() {
    TagStore.addTagStatusListener(this._onTagStatusChange);
    TagStore.addTagTotalListener(this._onTagTotalChange);

    },
  componentWillUnmount: function() {
    TagStore.removeTagStatusListener(this._onTagStatusChange);
    TagStore.removeTagTotalListener(this._onTagTotalChange);
  },
  render:function(){
    let that = this;
    let nodemenuItems=[];
    let menuItem=null;
    var buttonStyle = {
         height:'25px',
       };
    this.props.tagList.forEach(function(nodeData,i){
      var tagStatus=false;
      if(that.state.tagStatus.includes(nodeData.Id)){
        tagStatus=true;
      };
        menuItem=<TagItem style={buttonStyle}
                          nodeData={nodeData}
                          title={nodeData.Name}
                          label={nodeData.AlarmStatus}
                          status={tagStatus}
                          disable={that.state.tagTotal}
                          />;
        nodemenuItems.push(menuItem);

      });

     var allCheckStyle = {
             margin:'11px 0 0 20px',
             fontSize:'14px',
             color:'#464949'
           },
         iconStyle={
           marginRight:'10px'
         };

  return(
    <div style={{display:'flex','flex-direction':'column', flex:1}}>
      <div className="allcheck">
        <Checkbox
          label="全选"
          onCheck={this._onAllCheck}
          checked={this.state.checked}
          disabled={this.state.allCheckDisable}
          style={allCheckStyle}
          />
      </div>

      <div style={{'overflow':'auto',display:'flex','flex-direction':'column',flex:'1'}}>
        {nodemenuItems}
      </div>


  </div>


  )
  }
});

module.exports = TagMenu;
