'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import TextField from 'material-ui/TextField';
import TreeConstants from 'constants/TreeConstants.jsx';
import classNames from 'classnames';
let {nodeType} = TreeConstants;
import FolderAction from 'actions/FolderAction.jsx';
import FolderStore from 'stores/FolderStore.jsx';
import ClickAway from "controls/ClickAwayListener.jsx";

const normalStyle = {
  backgroundColor: '#ffffff',
  color: '#626469'
};
const selectedStyle = {
  backgroundColor: '#32ad3d',
  color: '#ffffff'
};
const parentStyle = {
  backgroundColor: '#ffffff',
  color: '#32ad3d'
};

var TreeNodeContent = React.createClass({

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
    } else if (this.state.isSelect) {
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
      isSelect: null,
      text: this.props.nodeData.get("Name"),
      readStatus: true
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      text: nextProps.nodeData.get("Name"),
    });
  },
  componentDidMount: function() {
    if (this.props.nodeData.get('Id') < -1) {
      this.refs.textField.focus();
    }
  },
  onClickAway: function() {
    this.setState({
      isSelect: null,
    });

    if (this.props.nodeData.get("Name") != this.state.text) {
      FolderAction.modifyFolderName(this.props.nodeData, this.state.text);
      this.props.panel.setEditNode(null);
    }


  },
  render: function() {
    var type = this.props.nodeData.get("Type");
    var isSenderCopy = this.props.nodeData.get("IsSenderCopy");
    var isRead = this.props.nodeData.get("IsRead");
    var icon = (
    <div className="node-content-icon">
        <div className={classNames({
      "icon-folder": type == nodeType.Folder,
      "icon-chart": type == nodeType.Widget
    })}/>
      </div>
    );
    var textStyle = {
      marginLeft: '10px',
      fontSize: '14px'
    };
    var text;
    if (this.props.nodeData.get('Id') < -1) {
      text = <div className='jazz-foldertree-node-textfield'>
        <TextField ref="textField" 
          style={textStyle} 
          value={this.state.text} 
          onChange={this._onChanged}/>
        </div>
    } else {
      text = (!this.state.isSelect || this.props.nodeData !== this.props.selectedNode || this.props.nodeData.get('Id') === -1 ?
        <div className="node-content-text" title={this.state.text}>{this.state.text}</div> :
        <div className='jazz-foldertree-node-textfield'>
          <TextField ref="textField" 
            style={textStyle} 
            value={this.state.text} 
            onChange={this._onChanged}/>
        </div>
      );
    }
    ;

    var isSenderCopyIcon = <div className={classNames({
      "jazz-icon-read": (isSenderCopy && !isRead)
    })}/>;

  var {indent,indentUnit,nodeOriginPaddingLeft}=this.props.panel.props;
    return (
      <div className="tree-node-content" onClick={this._onClick} style={{
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }}>
               {icon}
               {text}
               {isSenderCopyIcon}
        </div>
      );
  }
});

module.exports = ClickAway(TreeNodeContent);
