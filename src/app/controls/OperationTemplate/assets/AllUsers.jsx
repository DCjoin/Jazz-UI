'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { Checkbox, FlatButton, TextField, Paper } from 'material-ui';
import UserAction from '../../../actions/UserAction.jsx';
import UserStore from '../../../stores/UserStore.jsx';
import Immutable from 'immutable';

var UserItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    status: React.PropTypes.bool,
  },
  _onClick: function() {
    UserAction.setUserStatus(this.props.user, !this.props.status);
  },
  render: function() {
    var boxStyle = {
        marginLeft: '20px',
        width: '24px'
      },
      iconstyle = {
        width: '24px'
      },
      labelstyle = {
        width: '0px',
        height: '0px'
      };
    var userTitle = [
      I18N.Setting.User.EnergyConsultant,
      I18N.Setting.User.Technicist,
      I18N.Setting.User.CustomerManager,
      I18N.Setting.User.PlatformManager,
      I18N.Setting.User.EnergyManager,
      I18N.Setting.User.EnergyEngineer,
      I18N.Setting.User.DeptManager,
      I18N.Setting.User.Manager,
      I18N.Setting.User.BusinessPerson,
      I18N.Setting.User.Sales,
      I18N.Setting.User.ServerManager
    ];
    return (
      <div className='jazz-folder-alluser-useritem' onClick={this._onClick}>
        <Checkbox
      checked={this.props.status}
      style={boxStyle}
      iconStyle={iconstyle}
      labelStyle={labelstyle}
      />
    <div className='name' title={this.props.user.get('RealName')}>
            {this.props.user.get('RealName')}
          </div>
          <div className='type' title={userTitle[this.props.user.get('Title')]}>
            {userTitle[this.props.user.get('Title')]}
          </div>
      </div>
      )
  }
});
var AllUsers = React.createClass({
  propTypes: {
    users: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      userStatusList: Immutable.List([])
    }
  },
  _onUserStatusChange: function() {
    this.setState({
      userStatusList: UserStore.getUserStatus()
    })
  },
  _onAllCheck: function(event, checked) {
    UserAction.setUsersStatusByAllCheck(checked);
  },
  componentDidMount: function() {
    UserStore.addUserStatusListener(this._onUserStatusChange);
  },
  componentWillUnmount: function() {
    UserStore.removeUserStatusListener(this._onUserStatusChange);
  },
  render: function() {
    var content = [];
    var that = this;
    var allCheckStyle = {
        marginLeft: '20px',
        width: '36px',
      },
      labelstyle = {
        width: '0px',
        height: '0px'
      },
      fontStyle = {
        fontSize: '14px',
        color: '#abafae'
      };

    this.props.users.forEach(function(user) {
      let status = (that.state.userStatusList.findIndex(item => item.get('Id') == user.get('Id')) >= 0);
      content.push(<UserItem user={user} status={status}/>);
    })
    return (
      <div>
        <div style={fontStyle}>
          {I18N.Template.User.Alluser}
        </div>
        <div className='jazz-folder-allusers'>
          <div className='allcheck'>
            <Checkbox
      onCheck={this._onAllCheck}
      ref="checkall"
      style={allCheckStyle}
      labelStyle={labelstyle}
      />
            <div style={fontStyle} className='name'>
              {I18N.Template.User.Name}
            </div>
            <div style={{
        'font-size': '14px',
        color: '#abafae',
        'margin-left': '10px'
      }} className='positon'>
              {I18N.Template.User.Position}
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
