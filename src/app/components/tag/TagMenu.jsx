'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {Checkbox} from 'material-ui';
import classnames from 'classnames';
import TagItem from './TagItem.jsx';
import TagStore from '../../stores/TagStore.jsx';
import TagAction from '../../actions/TagAction.jsx';

let pageX=0,pageY=0;

var TagMenu=React.createClass({

  propTypes: {
      tagList:React.PropTypes.object,
  },
  _onTagStatusChange:function(){
    this.setState({
      tagStatus:TagStore.getCurrentHierIdTagStatus(),
      checked:TagStore.getCheckAllCheckedStatus(),
    })
  },
  _onAllCheck:function(){
    var checked=this.refs.checkall.isChecked();
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
  _onMouseOver:function(e){
    pageX=e.pageX;
    pageY=e.pageY+20;
    this.setState({
      toolTipShow:true
    })
  },

  _onMouseLeave:function(){
    this.setState({
      toolTipShow:false
    })
  },
  getInitialState: function() {
    return {
      allDisable:false,
      tagStatus:TagStore.getCurrentHierIdTagStatus(),
      tagTotal:false,
      checked:TagStore.getCheckAllCheckedStatus(),
      toolTipShow:false,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    console.log("**wyh**TagMenu_componentWillReceiveProps");
    this.setState({
      allCheckDisable:TagStore.getCheckAllDisabledStatus(),
      tagStatus:TagStore.getCurrentHierIdTagStatus(),
      checked:TagStore.getCheckAllCheckedStatus(),
      toolTipShow:false,
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
    let tooltip=null;
    let nodemenuItems=[];
    let menuItem=null;
    var buttonStyle = {
         height:'25px',
       },
       tooltipStyle={
         display:'flex',
        position:'absolute',
        left:pageX,
        top:pageY,
        backgroundColor:'#ffffff',
        zIndex:'200',
        maxWidth:'200px',
        color:'#464949',
        fontSize:'14px',
        border:'1px solid #efefef'
       };
    if(this.state.toolTipShow){
      var tooltipText="已选择数据点 "+TagStore.getTagTotal()+'/30';
      if(this.state.allCheckDisable){
        tooltipText+="新增全选的数据点数量超出了可选范围，无法全选，请注意选择布标数据点"
      }
      tooltip=<div style={tooltipStyle}>{tooltipText}</div>
    }
    else{
        tooltip=<div style={{display:'none'}}></div>
    }
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
       marginLeft:'20px',
       width:'24px',
           },
           labelstyle={
             width:'0px',
             height:'0px'
           },
           boxStyle={
              marginLeft:'20px',
              width:'30px'
           };

  return(
    <div style={{display:'flex','flex-direction':'column', flex:1}}>
      <div className="allcheck" onMouseOut={this._onMouseLeave}>
          <Checkbox
            onClick={this._onAllCheck}
            ref="checkall"
            checked={this.state.checked}
            disabled={this.state.allCheckDisable}
            style={allCheckStyle}
            labelStyle={labelstyle}
            onMouseEnter={this._onMouseOver}

            />




        <div>
          全选
        </div>
      </div>
      {tooltip}
      <div style={{'overflow':'auto',display:'flex','flex-direction':'column',flex:'1'}}>
        {nodemenuItems}
      </div>


  </div>


  )
  }
});

module.exports = TagMenu;
