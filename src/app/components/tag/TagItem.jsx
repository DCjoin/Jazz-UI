'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {Checkbox} from 'material-ui';
import classnames from 'classnames';
import TagAction from '../../actions/TagAction.jsx';

var TagItem=React.createClass({
  mixins:[Navigation,State],
  propTypes: {
      title: React.PropTypes.string.isRequired,
      label:React.PropTypes.number,
      nodeData:React.PropTypes.object,
      status:React.PropTypes.bool,
      disable:React.PropTypes.bool,
      widgetType:React.PropTypes.string
      },
  _onClick:function(){
    TagAction.setTagStatusByTag(this.props.nodeData,!this.props.status);
  },
  getInitialState: function() {
    return {
      disable:false
    };
  },
  render:function(){
    var alarm,baseline,checkBox,
        boxDisabledStatus=false;
    switch(this.props.label){
      case 0:
        alarm=<div className="disable">基准值未配置,</div>;
        baseline=<div className="disable">报警未配置</div>;
        break;
      case 1:
        alarm=<div className="able">基准值已配置,</div>;
        baseline=<div className="disable">报警未配置</div>;
        break;
      case 2:
        alarm=<div className="able">基准值已配置,</div>;
        baseline=<div className="able">报警已配置</div>;
        break;
    };
    var boxStyle={
      marginLeft:'20px',
      width:'24px'
    },
      iconstyle={
      width:'24px'
    },
      labelstyle={
      width:'0px',
      height:'0px'
    };
   if((this.props.status==false) && (this.props.disable==true)){
     boxDisabledStatus=true
   };
   var alarmInfo=(this.props.widgetType=='energy')?(<div className="font">
                                                    {alarm}
                                                    {baseline}
                                                  </div>):null;
    return(
      <div className="taglist"  onClick={this._onClick} title={this.props.title}>
        <Checkbox
            checked={this.props.status}
            disabled={boxDisabledStatus}
            style={boxStyle}
            iconStyle={iconstyle}
            labelStyle={labelstyle}
            />
          <div className="label">
            <div className="title">
            {this.props.title}
            </div>
            {alarmInfo}

          </div>



      </div>
    )
  }
});
module.exports = TagItem;
