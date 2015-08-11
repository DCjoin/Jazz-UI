'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {Dialog,FlatButton} from 'material-ui';
import Copy from '../../controls/Copy.jsx';
import FolderStore from '../../stores/FolderStore.jsx';
import FolderAction from '../../actions/FolderAction.jsx';

var CopyView = React.createClass({
  propTypes: {
    onDismiss: React.PropTypes.func,
    copyNode:React.PropTypes.object,
  },
  _onCopyItem:function(destNode,newName){
    FolderAction.copyItem(this.props.copyNode,destNode,newName);
  },
  render:function(){

    let Props={
      title:I18N.Folder.Copy.Title,//复制文件夹 or 图表另存为
      label:I18N.Folder.Copy.Label,//文件夹名称 or 图表名称
      labelName:FolderStore.getCopyLabelName(this.props.copyNode.get('Name'),6),
      firstActionLabel:I18N.Folder.Copy.firstActionLabel,//复制 or 保存
      onFirstActionTouchTap:this._onCopyItem,
      onDismiss:this.props.onDismiss
    }

    return(
      <Copy {...Props}/>
    )
  }
});
module.exports = CopyView;
