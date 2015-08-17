'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {Checkbox,FlatButton,TextField,Paper} from 'material-ui';
import UserAction from '../../../actions/UserAction.jsx';
import UserStore from '../../../stores/UserStore.jsx';
import Immutable from 'immutable';

var UserItem = React.createClass({
  propTypes: {
    user:React.PropTypes.object,
    status:React.PropTypes.bool,
  },
  _onClick:function(){
    UserAction.setUserStatus(this.props.user,!this.props.status);
  },
  render:function(){
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

    return(
      <div className='jazz-folder-alluser-useritem' onClick={this._onClick}>
        <Checkbox
            checked={this.props.status}
            style={boxStyle}
            iconStyle={iconstyle}
            labelStyle={labelstyle}
            />
          <div className='name'>
            {this.props.user.get('RealName')}
          </div>
          <div className='type'>
            {this.props.user.get('UserTypeName')}
          </div>
      </div>
    )
  }
});
var AllUsers = React.createClass({
  propTypes: {
    users:React.PropTypes.object,
  },
  getInitialState:function(){
    return{
      userStatusList:Immutable.List([])
    }
  },
  _onUserStatusChange:function(){
    this.setState({
      userStatusList:UserStore.getUserStatus()
    })
  },
  _onAllCheck:function(event, checked){
    UserAction.setUsersStatusByAllCheck(checked);
  },
  componentDidMount:function(){
    UserStore.addUserStatusListener(this._onUserStatusChange);
  },
  componentWillUnmount:function(){
    UserStore.removeUserStatusListener(this._onUserStatusChange);
  },
  render:function(){
    var content=[];
    var that=this;
    var allCheckStyle = {
        marginLeft:'20px',
        width:'36px',
      },
      labelstyle={
        width:'0px',
        height:'0px'
      },
      fontStyle={
        fontSize:'14px',
        color:'#abafae'
      };

    this.props.users.forEach(function(user){
      let status=(that.state.userStatusList.findIndex(item=>item.get('Id')==user.get('Id'))>=0);
      content.push(<UserItem user={user} status={status}/>);
    })
    return(
      <div>
        <div style={fontStyle}>
          全部人员
        </div>
        <div className='jazz-folder-allusers'>
          <div className='allcheck'>
            <Checkbox
              onCheck={this._onAllCheck}
              ref="checkall"
              style={allCheckStyle}
              labelStyle={labelstyle}
              />
            <div style={fontStyle}>
              姓名
            </div>
          </div>
          <div className='content'>
              {content}
          </div>
        </div>

      </div>

    )
  }
});

module.exports = AllUsers;
