'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { Dialog, FlatButton } from 'material-ui';
import Copy from '../../../controls/OperationTemplate/Copy.jsx';
import FolderStore from '../../../stores/FolderStore.jsx';
import FolderAction from '../../../actions/FolderAction.jsx';
import { nodeType } from '../../../constants/TreeConstants.jsx';

var SaveAsView = React.createClass({
  propTypes: {
    onDismiss: React.PropTypes.func,
    saveAsNode: React.PropTypes.object,
    widgetDto: React.PropTypes.object,
  },
  _onCopyItem: function(destNode, newName) {
    FolderAction.SaveAsItem(this.props.saveAsNode.toJS(), destNode, newName, this.props.widgetDto, this.props.isNew);
    this.setState({
      loading: true
    });
  },
  _onCopyItemError: function() {
    this.setState({
      errorText: I18N.Folder.Copy.Error,
      loading: false
    });
  },
  _onCopyItemSuccess: function() {
    this.props.onDismiss();
    this.setState({
      errorText: null,
      loading: false
    });
  },
  componentDidMount: function() {
    FolderStore.addCopyItemErrorListener(this._onCopyItemError);
    FolderStore.addCopyItemSuccessListener(this._onCopyItemSuccess);
  },
  componentWillUnmount: function() {
    FolderStore.removeCopyItemErrorListener(this._onCopyItemError);
    FolderStore.removeCopyItemSuccessListener(this._onCopyItemSuccess);
  },
  getInitialState: function() {
    return {
      errorText: null,
      loading: false
    };
  },
  render: function() {

    let Props = {
      title: I18N.Folder.SaveAs.Title, //复制文件夹 or 复制图表
      label: I18N.Folder.SaveAs.Label, //文件夹名称 or 图表名称
      labelName: FolderStore.getCopyLabelName(this.props.saveAsNode, this.props.saveAsNode.get('Type')),
      firstActionLabel: I18N.Folder.SaveAs.firstActionLabel, //复制 or 保存
      treeNode: FolderStore.getParent(this.props.saveAsNode),
      onFirstActionTouchTap: this._onCopyItem,
      onDismiss: this.props.onDismiss,
      errorText: this.state.errorText,
      loading: this.state.loading
    }

    return (
      <Copy {...Props}/>
      )
  }
});
module.exports = SaveAsView;
