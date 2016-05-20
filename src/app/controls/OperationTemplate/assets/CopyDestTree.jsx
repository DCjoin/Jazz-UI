'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import classNames from 'classnames';
import { Paper, Mixins } from 'material-ui';
import Tree from '../../tree/Tree.jsx';
import { treeSource } from '../../../constants/TreeSource.jsx';

var CopyDestTree = React.createClass({
  mixins: [Mixins.ClickAwayable],
  propTypes: {
    show: React.PropTypes.bool,
    onTreeClickAway: React.PropTypes.func,
    allNode: React.PropTypes.object,
    onSelectNode: React.PropTypes.func,
    selectedNode: React.PropTypes.object,
  },
  componentClickAway: function() {
    if (this.props.show) {
      this.props.onTreeClickAway();
    }
  },
  render: function() {
    let paperStyle = {
      backgroundColor: '#ffffff',
      zIndex: '100',
      width: '320px',
      height: '220px',
      position: 'absolute',
      border: '1px solid #c9c8c8',
      overflow: 'auto'
    };
    let treeProps = {
      key: 'copytree',
      collapsedLevel: 0,
      allNode: this.props.allNode,
      allHasCheckBox: false,
      allDisabled: false,
      onSelectNode: this.props.onSelectNode,
      selectedNode: this.props.selectedNode,
      treeSource: treeSource.FolderOperation,
      treeNodeClass: 'jazz-copy-tree'
    };
    return (
      <Paper style={paperStyle}>
          <Tree {...treeProps}/>
        </Paper>
      )
  }
});

module.exports = CopyDestTree;
