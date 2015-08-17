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
  },
  render:function(){

    return(
      <div className='jazz-folder-user'>
        <AllUser users={this.props.users}/>
        <div className='usericon'>
          <div className='icon-arrow-right'/>
        </div>
        <SelectedUsers type={this.props.type}/>
      </div>
    )
  }
});

module.exports = UsersOperation;
