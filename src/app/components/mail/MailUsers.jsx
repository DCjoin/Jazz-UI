'use strict';

import React from 'react';
import { FlatButton, CircularProgress, Tabs, Tab } from 'material-ui';
import MailAction from '../../actions/MailAction.jsx';
import MailStore from '../../stores/MailStore.jsx';
import Tree from '../../controls/tree/Tree.jsx';
import PlatformUser from './MailPlatformUser.jsx';
import Providers from './MailProviders.jsx';

let MailUsers = React.createClass({

  _handleContactorTabActive: function() {
    this.refs.providers.reset();
    React.findDOMNode(this.refs.tab1).style.opacity = '1';
    React.findDOMNode(this.refs.tab2).style.opacity = '0.5';
    if (MailStore.getServiceProviders() === null) {
      MailAction.GetServiceProviders();
      this.setState({
        isLoading: true,
        users: null,
      });
    } else {
      this.setState({
        isLoading: false,
        users: MailStore.getMailUsers(),
      });
    }
  },
  _handlePlatformUserTabActive: function() {
    this.refs.users.reset();
    React.findDOMNode(this.refs.tab1).style.opacity = '0.5';
    React.findDOMNode(this.refs.tab2).style.opacity = '1';
    if (MailStore.getPlatFormUserGroupDto() === null) {
      MailAction.GetPlatFormUserGroupDto();
      this.setState({
        isLoading: true,
        users: null,
      });
    } else {
      this.setState({
        isLoading: false,
        users: MailStore.getMailUsers(),
      });
    }
  },
  _onMailUsersChanged: function() {
    this.setState({
      isLoading: false,
      users: MailStore.getMailUsers()
    });
  },
  _onSendSuccessChanged: function() {
    this.setState({
      tabsValue: 'tab1',
      users: null
    });
    MailAction.GetServiceProviders();
    React.findDOMNode(this.refs.tab1).style.opacity = '1';
    React.findDOMNode(this.refs.tab2).style.opacity = '0.5';
    this.refs.providers.reset();
    this.refs.users.reset();
  },
  _handleTabsChange: function(value, e, tab) {
    this.setState({
      tabsValue: value
    });
  },
  getInitialState: function() {
    return {
      users: null,
      isLoading: true,
      tabsValue: null
    };
  },
  componentDidMount: function() {
    MailStore.addMailUsersListener(this._onMailUsersChanged);
    MailStore.addSendSuccessListener(this._onSendSuccessChanged);
    MailAction.GetServiceProviders();
    React.findDOMNode(this.refs.tab1).style.opacity = '1';
    React.findDOMNode(this.refs.tab2).style.opacity = '0.5';
  },
  componentWillUnmount: function() {
    MailStore.removeMailUsersListener(this._onMailUsersChanged);
    MailStore.removeSendSuccessListener(this._onSendSuccessChanged);
  },
  render: function() {
    var itemStyle = {
      height: '30px',
      backgroundColor: '#efefef'
    };
    return (
      <div className='jazz-mailuser'>
        <Tabs tabItemContainerStyle={itemStyle} valueLink={{
        value: this.state.tabsValue,
        requestChange: this._handleTabsChange.bind(this)
      }}>
          <Tab ref='tab1' value='tab1' label={I18N.Mail.Contactor} onActive={this._handleContactorTabActive}>
            <Providers ref='providers' users={this.state.users} isLoading={this.state.isLoading}/>
          </Tab>
          <Tab ref='tab2' value='tab2' label={I18N.Mail.User} onActive={this._handlePlatformUserTabActive}>
            <PlatformUser ref="users" users={this.state.users} isLoading={this.state.isLoading}/>
          </Tab>
        </Tabs>
      </div>
      );
  },
});
module.exports = MailUsers;