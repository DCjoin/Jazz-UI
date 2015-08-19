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
      widgetType:React.PropTypes.string,
  },
  _onTagStatusChange:function(){
    this.setState({
      tagStatus:TagStore.getCurrentHierIdTagStatus(),
      allCheckDisable:TagStore.getCheckAllDisabledStatus(),
      checked:TagStore.getCheckAllCheckedStatus(),
      tagTotal:TagStore.getTagTotalStatus(),
    })
  },
  _onAllCheck:function(){
    var checked=this.refs.checkall.isChecked();
    TagAction.setTagStatusByTagList(this.props.tagList,checked);
    this.setState({
    checked:!this.state.checked
  });
  },
  getInitialState: function() {
    return {
      tagStatus:TagStore.getCurrentHierIdTagStatus(),
      allCheckDisable:TagStore.getCheckAllDisabledStatus(),
      tagTotal:TagStore.getTagTotalStatus(),
      checked:TagStore.getCheckAllCheckedStatus(),
      toolTipShow:false,
    };
  },
  /*
  componentWillReceiveProps:function(){
    this.setState({
      tagStatus:TagStore.getCurrentHierIdTagStatus(),
      allCheckDisable:TagStore.getCheckAllDisabledStatus(),
      tagTotal:TagStore.getTagTotalStatus(),
      checked:TagStore.getCheckAllCheckedStatus(),
      toolTipShow:false,
    })
  },
  */
  componentDidMount: function() {
    TagStore.addTagStatusListener(this._onTagStatusChange);

    },
  componentWillUnmount: function() {
    TagStore.removeTagStatusListener(this._onTagStatusChange);
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

      var tooltipText=I18N.format(I18N.Tag.Tooltip,TagStore.getTagTotal(),TagStore.getTagSum());
      if(this.state.allCheckDisable){
        tooltipText+=I18N.Tag.ExceedTooltip
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
                          widgetType={that.props.widgetType}/>;
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
    <div style={{display:'flex','flex-direction':'column', flex:1,overflow:'hidden'}}>
      <div className="allcheck" >
          <Checkbox
            onClick={this._onAllCheck}
            ref="checkall"
            checked={this.state.checked}
            disabled={this.state.allCheckDisable}
            style={allCheckStyle}
            labelStyle={labelstyle}
            title={tooltipText}
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
