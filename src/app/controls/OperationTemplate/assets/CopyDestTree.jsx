'use strict';
import React from "react";
import PropTypes from 'prop-types';
import { Navigation, State } from 'react-router';
import classNames from 'classnames';
import { Paper, Mixins } from 'material-ui';
import Tree from '../../tree/Tree.jsx';
import { treeSource } from '../../../constants/TreeSource.jsx';
import ClickAway from '../../ClickAwayListener.jsx';
var createReactClass = require('create-react-class');
var CopyDestTree = createReactClass({
  //mixins: [Mixins.ClickAwayable],
  propTypes: {
    show: PropTypes.bool,
    onTreeClickAway: PropTypes.func,
    allNode: PropTypes.object,
    onSelectNode: PropTypes.func,
    selectedNode: PropTypes.object,
  },
  onClickAway: function() {
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

module.exports = ClickAway(CopyDestTree);
