'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { TextField, Mixins, Snackbar } from 'material-ui';
import TreeConstants from '../../constants/TreeConstants.jsx';
import classNames from 'classnames';
let {nodeType} = TreeConstants;
import FolderAction from '../../actions/FolderAction.jsx';
import FolderStore from '../../stores/FolderStore.jsx';

var TreeNodeContent = React.createClass({
  mixins: [Mixins.ClickAwayable],

  propTypes: {
    nodeData: React.PropTypes.object,
    selectedNode: React.PropTypes.object,
    panel: React.PropTypes.object,
  },
  _onClick: function() {
    if (this.state.isSelect === null) {
      this.setState({
        isSelect: true,
      });
      this.props.panel.setEditNode(this.props.nodeData);
    }

    if (this.props.nodeData.get('IsSenderCopy') && !this.props.nodeData.get('IsRead')) {
      FolderAction.modifyFolderReadStatus(this.props.nodeData);
    }

  },
  _onChanged: function(e) {
    this.setState({
      text: e.target.value
    });
  },

  getInitialState: function() {
    return {
      isSelect: (this.props.nodeData.get('Id') == this.props.selectedNode.get('Id')),
      text: this.props.nodeData.get("Name"),
      readStatus: true
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      text: nextProps.nodeData.get("Name"),
    })
  },
  componentDidMount: function() {
    if (this.props.nodeData.get('Id') < -1) {
      this.refs.textField.focus();
    }
  },
  componentClickAway: function() {
    this.setState({
      isSelect: null,
    });

    if (this.props.nodeData.get("Name") != this.state.text) {
      FolderAction.modifyFolderName(this.props.nodeData, this.state.text);
    }


  },
  render: function() {
    var type = this.props.nodeData.get("Type");
    var isSenderCopy = this.props.nodeData.get("IsSenderCopy");
    var isRead = this.props.nodeData.get("IsRead");
    var icon = (
    <div className="node-content-icon" style={{
      color: '#ffffff'
    }}>
        <div className={classNames({
      //add for file operation
      "icon-column-fold": type == nodeType.Folder,
      "icon-image": type == nodeType.Widget
    })}/>
      </div>
    );
    var textStyle = {
      marginLeft: '10px',
      fontSize: '14px',
      color: '#ffffff'
    };
    var text;
    if (this.props.nodeData.get('Id') < -1) {
      text = <div className='jazz-foldertree-node-textfield'><TextField ref="textField" style={textStyle} value={this.state.text} onChange={this._onChanged}/></div>
    } else {
      text = (!this.state.isSelect ?
        <div className="node-content-text" style={{
          color: '#ffffff'
        }} title={this.state.text}>{this.state.text}</div> :
        <div className='jazz-foldertree-node-textfield'><TextField ref="textField" style={textStyle} value={this.state.text} onChange={this._onChanged}/></div>
      );
    }
    ;

    var isSenderCopyIcon = <div className={classNames({
      //add for file operation
      // "icon-humidity" : (isSenderCopy && !isRead && !this.props.readStatus && this.state.readStatus),
      "jazz-icon-read": (isSenderCopy && !isRead)
    })}/>;


    return (
      <div className="tree-node-content" onClick={this._onClick} style={{
        color: '#ffffff'
      }}>
               {icon}
               {text}
               {isSenderCopyIcon}
        </div>
      )
      // return (
      //   <div className="tree-node-content" style={{
      //     color: '#ffffff'
      //   }}>
      //           <div className='jazz-foldertree-node-textfield'><TextField ref="textField" style={textStyle} defaultValue='XX' /></div>
      //         </div>
      //   )

  }
});

module.exports = TreeNodeContent;
