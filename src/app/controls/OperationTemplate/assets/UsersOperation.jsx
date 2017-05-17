'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {Dialog,FlatButton,TextField,Paper} from 'material-ui';
import AllUser from './AllUsers.jsx';
import SelectedUsers from './SelectedUsers.jsx';

var UsersOperation = React.createClass({
  propTypes: {
    type:React.PropTypes.string,//共享 or 发送
    users:React.PropTypes.object,
    titleStyle:React.PropTypes.object,
    contentStyle:React.PropTypes.object,
    boxStyle:React.PropTypes.object,
  },
  render:function(){

    return(
      <div className='jazz-folder-user' style={this.props.contentStyle}>
        <AllUser users={this.props.users} titleStyle={this.props.titleStyle} boxStyle={this.props.boxStyle}/>
        <div className='usericon'>
          <div className='icon-arrow-right'/>
        </div>
        <SelectedUsers type={this.props.type} titleStyle={this.props.titleStyle} boxStyle={this.props.boxStyle}/>
      </div>
    )
  }
});

module.exports = UsersOperation;
