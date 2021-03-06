
'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { Dialog, FlatButton, CircularProgress } from 'material-ui';
import Copy from '../../controls/OperationTemplate/Copy.jsx';
import FolderStore from '../../stores/FolderStore.jsx';
import FolderAction from '../../actions/FolderAction.jsx';
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';
var WidgetSaveWindow = createReactClass({
  propTypes: {
    onDismiss: PropTypes.func,
    chartTitle: PropTypes.string,
    onSave: PropTypes.func,
  },
  contextTypes:{
      currentRoute: PropTypes.object
  },
  _onWidgetSave: function(destNode, newName) {
    this.props.onSave(destNode, newName);
    this.setState({
      loading: true,
      title: newName
    });
  },
  _onWidgetSaveError: function() {
    this.setState({
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
    FolderAction.getFolderTreeByHierarchyId(this.context.currentRoute.params.customerId);
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
      treeLoading: true,
      title: (!!this.props.chartTitle) ? this.props.chartTitle : null
    };
  },
  render: function() {
    var title = I18N.ALarm.Save.Title,
      label = I18N.ALarm.Save.Label;

    let Props = {
      title: title, //复制文件夹 or 复制图表
      label: label, //文件夹名称 or 图表名称
      labelName: this.state.title,
      firstActionLabel: I18N.ALarm.Save.Save, //复制 or 保存
      onFirstActionTouchTap: this._onWidgetSave,
      onDismiss: this.props.onDismiss,
      errorText: this.state.errorText,
      loading: this.state.loading
    };
    // if (this.state.treeLoading) {
    //   return (
    //     <CircularProgress  mode="indeterminate" size={1} />
    //     )
    // } else {
    return (
      <Copy {...Props}/>
      )
      //  }

  }
});
module.exports = WidgetSaveWindow;
