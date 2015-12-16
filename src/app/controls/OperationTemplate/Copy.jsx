'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import classNames from 'classnames';
import { Dialog, FlatButton, TextField, Paper, CircularProgress } from 'material-ui';
import Tree from './assets/CopyDestTree.jsx';
import FolderStore from '../../stores/FolderStore.jsx';

var Copy = React.createClass({
  propTypes: {
    title: React.PropTypes.string, //复制文件夹 or 图表另存为
    label: React.PropTypes.string, //文件夹名称 or 图表名称
    labelName: React.PropTypes.string,
    firstActionLabel: React.PropTypes.string, //复制 or 保存
    onFirstActionTouchTap: React.PropTypes.func,
    onSecondActionTouchTap: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
    errorText: React.PropTypes.string,
    treeNode: React.PropTypes.object,
    loading: React.PropTypes.bool,
  },
  _onFirstActionTouchTap: function() {
    if (this.props.onFirstActionTouchTap) {
      this.props.onFirstActionTouchTap(this.state.selectedNode, this.state.labelName);
    }
  },
  _onSecondActionTouchTap: function() {
    this.refs.dialog.dismiss();
    if (this.props.onSecondActionTouchTap) {
      this.props.onSecondActionTouchTap();
    }
  },
  _onNameChanged: function(e) {
    var value = e.target.value;
    if (value.length > 100) {
      this.setState({
        errorText: I18N.Folder.Copy.NameLongError,
        btnDisabled: true
      });
    } else {
      this.setState({
        labelName: e.target.value,
        errorText: null,
        btnDisabled: false
      });
    }

  },
  _onTreeSelect: function() {
    this.setState({
      treeShow: true
    })
  },
  _onTreeHide: function() {
    this.setState({
      treeShow: false
    })
  },
  _onSelectNode: function(node) {
    this.setState({
      selectedNode: node,
      treeShow: false
    });
  },
  getInitialState: function() {
    return {
      labelName: this.props.labelName,
      allNode: FolderStore.getFolderTree(),
      selectedNode: (!!this.props.treeNode ? this.props.treeNode : FolderStore.getFolderTree()),
      treeShow: false,
      errorText: this.props.errorText,
      btnDisabled: false
    };
  },
  componentWillReceiveProps: function(nextProps) {
    // var selectedNode = FolderStore.getSelectedNode();
    // if (selectedNode === null) {
    //   selectedNode = FolderStore.getFolderTree()
    // }
    this.setState({
      allNode: FolderStore.getFolderTree(),
      selectedNode: (!!nextProps.treeNode ? nextProps.treeNode : FolderStore.getFolderTree()),
      treeShow: false,
      errorText: nextProps.errorText,
      btnDisabled: false
    });
  },
  render: function() {
    //style
    let titleStyle = {
      fontSize: '20px',
      color: '#464949',
      marginLeft: '26px'
    };

    let actions = [
      <FlatButton
      label={this.props.firstActionLabel}
      onTouchTap={this._onFirstActionTouchTap}
      disabled={this.state.btnDisabled}
      />,
      <FlatButton
      label={I18N.Template.Copy.Cancel}
      onTouchTap={this._onSecondActionTouchTap}
      />
    ];
    //props
    let treeProps = {
        show: this.state.treeShow,
        onTreeClickAway: this._onTreeHide,
        allNode: this.state.allNode,
        onSelectNode: this._onSelectNode,
        selectedNode: this.state.selectedNode,

      },
      dialogProps = {
        ref: 'dialog',
        title: this.props.title,
        actions: actions,
        modal: true,
        openImmediately: true,
        onDismiss: this.props.onDismiss,
        titleStyle: titleStyle
      };

    //component
    let nameField = (
    <div>
                  <div>
                    {this.props.label}
                  </div>
                  <TextField style={{
      width: '390px'
    }} value={this.state.labelName} onChange={this._onNameChanged} errorText={this.state.errorText}/>
                </div>
    );
    let icon = (
    <div className="icon">
                  <div className="icon-arrow-down"/>
                </div>
    );
    let FolderTreeField = (
    <div style={{
      marginTop: '20px'
    }}>
                    <div>
                      {I18N.Template.Copy.DestinationFolder}
                    </div>
                    <div className='jazz-copytemplate-treeselect' onClick={this._onTreeSelect}>
                      {this.state.selectedNode.get('Name')}
                      {icon}
                    </div>
                  </div>
    );
    let FolderTree = (this.state.treeShow ? <Tree {...treeProps}/> : null);


    if (this.props.loading) {
      return (
        <div className='jazz-copytemplate-dialog'>
          <div className={classNames({
          "disable": this.state.btnDisabled,
          'able': !this.state.btnDisabled
        })}>
          <Dialog {...dialogProps}>
            <CircularProgress  mode="indeterminate" size={1} />
          </Dialog>
        </div>
      </div>

        )
    } else {
      return (
        <div className='jazz-copytemplate-dialog'>
          <div className={classNames({
          "disable": this.state.btnDisabled,
          'able': !this.state.btnDisabled
        })}>
            <Dialog {...dialogProps}>
              {nameField}
              {FolderTreeField}
              {FolderTree}
            </Dialog>
          </div>
        </div>


        )
    }

  }

});

module.exports = Copy;
