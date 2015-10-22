'use strict';

import React from 'react';
import { FlatButton, CircularProgress, Tabs, Tab } from 'material-ui';
import MailAction from '../../actions/MailAction.jsx';
import MailStore from '../../stores/MailStore.jsx';
import Tree from '../../controls/tree/Tree.jsx';

let GropNodeContent = React.createClass({
  propTypes: {
    nodeData: React.PropTypes.object,
  },
  _onClick: function() {
    MailAction.addReceivers(this.props.nodeData);
  },
  _onMouserOver: function() {
    React.findDOMNode(this.refs.groupselect).style.display = 'block';
  },
  _onMouserOut: function() {
    React.findDOMNode(this.refs.groupselect).style.display = 'none';
  },
  render: function() {

    return (
      <div className='tree-node-content' onMouseOver={this._onMouserOver} onMouseOut={this._onMouserOut}>
          <div className='node-content-text'>
            {this.props.nodeData.get('Name')}
          </div>
          <div className='jazz-platformuser-groupselect' ref='groupselect' onClick={this._onClick}>
          {I18N.Mail.SelectAll}
        </div>
        </div>

      )
  }
});
let NodeContent = React.createClass({
  propTypes: {
    nodeData: React.PropTypes.object,
  },
  _onClick: function() {
    MailAction.addReceiver(this.props.nodeData);
  },
  render: function() {
    return (
      <div className='tree-node-content' title={name} onClick={this._onClick}>
          <div className='node-content-text'>
            {this.props.nodeData.get('Name')}
          </div>

        </div>
      )

  }
});
let Providers = React.createClass({

  propTypes: {
    users: React.PropTypes.object,
    isLoading: React.PropTypes.bool,
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
    if (nodeData.get('Id') == -1) {
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
      collapsedLevel: 0,
      allNode: this.props.users,
      allHasCheckBox: false,
      allDisabled: false,
      onSelectNode: this._onSelectNode,
      selectedNode: this.state.selectedNode,
      generateNodeConent: this.generateNodeConent,
    };
    var style = {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '185px'
    };
    if (this.props.isLoading) {
      return (
        <div style={style}>
          <CircularProgress  mode="indeterminate" size={1} />
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

module.exports = Providers;
