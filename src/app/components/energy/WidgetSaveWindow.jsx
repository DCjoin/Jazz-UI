
'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { Dialog, FlatButton, CircularProgress } from 'material-ui';
import Copy from '../../controls/OperationTemplate/Copy.jsx';
import FolderStore from '../../stores/FolderStore.jsx';
import FolderAction from '../../actions/FolderAction.jsx';

var WidgetSaveWindow = React.createClass({
  propTypes: {
    onDismiss: React.PropTypes.func,
    chartTitle: React.PropTypes.string,
    onSave: React.PropTypes.func,
  },
  _onWidgetSave: function(destNode, newName) {
    this.props.onSave(destNode);
    this.setState({
      loading: true
    });
  },
  _onWidgetSaveError: function() {
    this.setState({
      errorText: I18N.Folder.Copy.Error,
      loading: false
    });
  },
  _onWidgetSaveSuccess: function() {
    this.props.onDismiss();
    this.setState({
      errorText: null,
      loading: false
    });
  },
  _onFolderTreeLoad: function() {
    this.setState({
      treeLoading: false
    });
  },
  componentDidMount: function() {
    FolderStore.addWidgetSaveErrorListener(this._onWidgetSaveError);
    FolderStore.addWidgetSaveSuccessListener(this._onWidgetSaveSuccess);
    FolderAction.getFolderTreeByCustomerId(window.currentCustomerId);
    FolderStore.addFolderTreeListener(this._onFolderTreeLoad);
    this.setState({
      treeLoading: true
    });
  },
  componentWillUnmount: function() {
    FolderStore.removeWidgetSaveErrorListener(this._onWidgetSaveError);
    FolderStore.removeWidgetSaveSuccessListener(this._onWidgetSaveSuccess);
    FolderStore.removeFolderTreeListener(this._onFolderTreeLoad);
  },
  getInitialState: function() {
    return {
      errorText: null,
      loading: false,
      treeLoading: true
    };
  },
  render: function() {
    var title = I18N.ALarm.Save.Title,
      label = I18N.ALarm.Save.Label;

    let Props = {
      title: title, //复制文件夹 or 复制图表
      label: label, //文件夹名称 or 图表名称
      labelName: this.props.chartTitle,
      firstActionLabel: I18N.ALarm.Save.Save, //复制 or 保存
      onFirstActionTouchTap: this._onWidgetSave,
      onDismiss: this.props.onDismiss,
      errorText: this.state.errorText,
      loading: this.state.loading
    };
    if (this.state.treeLoading) {
      return (
        <CircularProgress  mode="indeterminate" size={1} />
        )
    } else {
      return (
        <Copy {...Props}/>
        )
    }

  }
});
module.exports = WidgetSaveWindow;
