'use strict';
import React from "react";
import ReactDom from 'react-dom';
import { Navigation, State } from 'react-router';
import { FontIcon } from 'material-ui';
import AllUser from './AllUsers.jsx';
import classNames from 'classnames';
import Immutable from 'immutable';
import UserStore from '../../../stores/UserStore.jsx';
import UserAction from '../../../actions/UserAction.jsx';

var UserItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
  },
  _onCleanButtonClick: function() {
    UserAction.setUserStatus(this.props.user, false);
  },
  _onMouserOver: function() {
    ReactDom.findDOMNode(this.refs.cleanIcon).style.display = 'block';
  },
  _onMouserOut: function() {
    ReactDom.findDOMNode(this.refs.cleanIcon).style.display = 'none';
  },

  render: function() {
    var cleanIconStyle = {
      marginTop: '3px',
      fontSize: '16px',
      display: 'none',
      marginLeft: '50px',
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
      <div className='jazz-folder-selectedusers-useritem' onMouseOver={this._onMouserOver} onMouseOut={this._onMouserOut}>
          <div className='name' title={this.props.user.get('RealName')}>
            {this.props.user.get('RealName')}
          </div>
          <div className='type' title={userTitle[this.props.user.get('Title')]}>
            {userTitle[this.props.user.get('Title')]}
          </div>
          <div style={{
        float: 'right'
      }}>
            <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>

          </div>

      </div>
      )


  }
});
var SelectedUsers = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      users: UserStore.getUserStatus()
    };
  },
  _onUsersChange: function() {
    this.setState({
      users: UserStore.getUserStatus()
    });
  },
  componentDidMount: function() {
    UserStore.addUserStatusListener(this._onUsersChange);
  },
  componentWillUnmount: function() {
    UserStore.removeUserListListener(this._onUsersChange);
  },
  render: function() {
    var fontStyle = {
      fontSize: '14px',
      color: '#abafae'
    };
    var content = [];
    if (this.state.users) {
      this.state.users.forEach(function(user) {
        content.push(<UserItem user={user}/>)
      })
    }
    return (
      <div>
        <div style={fontStyle}>
          {I18N.format(I18N.Template.User.Selected, this.props.type)}
        </div>
        <div className='jazz-folder-selectedusers'>
          <div className='title'>
            <div className='name'>
                {I18N.Template.User.Name}
            </div>
            <div style={{
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

module.exports = SelectedUsers;
