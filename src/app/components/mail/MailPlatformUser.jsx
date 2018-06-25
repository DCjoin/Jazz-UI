'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { FlatButton, CircularProgress, Tabs, Tab } from 'material-ui';
import MailAction from '../../actions/MailAction.jsx';
import MailStore from '../../stores/MailStore.jsx';
import Tree from '../../controls/tree/Tree.jsx';
var createReactClass = require('create-react-class');
let GropNodeContent = createReactClass({
  propTypes: {
    nodeData: PropTypes.object,
  },
  _onClick: function(e) {
    e.stopPropagation();
    MailAction.addReceivers(this.props.nodeData);
  },
  _onMouserOver: function() {
    ReactDOM.findDOMNode(this.refs.groupselect).style.display = 'block';
  },
  _onMouserOut: function() {
    ReactDOM.findDOMNode(this.refs.groupselect).style.display = 'none';
  },
  render: function() {

    return (
      <div className='tree-node-content' onMouseOver={this._onMouserOver} onMouseOut={this._onMouserOut}>
          <div className='node-content-text' style={{
        maxWidth: '200px'
      }}>
            {this.props.nodeData.get('Name')}
          </div>
          <div className='jazz-platformuser-groupselect' ref='groupselect' onClick={this._onClick}>
          {I18N.Mail.SelectAll}
        </div>
        </div>

      )
  }
});
let NodeContent = createReactClass({
  propTypes: {
    nodeData: PropTypes.object,
  },
  _onClick: function() {
    MailAction.addReceiver(this.props.nodeData);
  },
  render: function() {
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
      I18N.Setting.User.ServerManager,
      I18N.Setting.User.RegisterEngr,
    ];
    var name = this.props.nodeData.get('Name') + userTitle[this.props.nodeData.get('Title')];
    return (
      <div className='tree-node-content' title={name} onClick={this._onClick}>
          <div className='jazz-platformuser-user'>
            {this.props.nodeData.get('Name')}
          </div>
          <div className='jazz-platformuser-position'>
          {userTitle[this.props.nodeData.get('Title')]}
        </div>
        </div>
      )

  }
});
let PlatformUser = createReactClass({

  propTypes: {
    users: PropTypes.object,
    isLoading: PropTypes.bool,
  },
  _onSelectNode: function(nodeData) {
    this.setState({
      selectedNode: nodeData
    });

  },
  reset: function() {
    this.setState({
      selectedNode: this.props.users
    });
  },
  generateNodeConent: function(nodeData) {
    if (!!nodeData.get('TotalUserCount')) {
      return (<GropNodeContent nodeData={nodeData}
        />);
    } else {
      return (<NodeContent nodeData={nodeData}
        />);
    }

  },
  getInitialState: function() {
    return {
      selectedNode: this.props.users
    };
  },
  render: function() {
    var treeProps = {
      key: 'mailtree',
      collapsedLevel: 0,
      allNode: this.props.users,
      allHasCheckBox: false,
      allDisabled: false,
      onSelectNode: this._onSelectNode,
      selectedNode: this.state.selectedNode,
      generateNodeConent: this.generateNodeConent,
      treeNodeClass: 'jazz-copy-tree'
    };
    var style = {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '185px'
    };
    if (this.props.isLoading) {
      return (
        <div style={style}>
          <CircularProgress  mode="indeterminate" size={80} />
        </div>
        );
    } else {
      return (
        <div className='jazz-mailuserfield'>
          <Tree {...treeProps}></Tree>
        </div>
        );
    }

  },
});

module.exports = PlatformUser;
