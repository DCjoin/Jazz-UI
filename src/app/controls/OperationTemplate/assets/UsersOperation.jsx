'use strict';
import React from "react";
import PropTypes from 'prop-types';
import {Navigation, State } from 'react-router';
import {Dialog,FlatButton,TextField,Paper} from 'material-ui';
import AllUser from './AllUsers.jsx';
import SelectedUsers from './SelectedUsers.jsx';
var createReactClass = require('create-react-class');
var UsersOperation = createReactClass({
  propTypes: {
    type:PropTypes.string,//共享 or 发送
    users:PropTypes.object,
    titleStyle:PropTypes.object,
    contentStyle:PropTypes.object,
    boxStyle:PropTypes.object,
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
