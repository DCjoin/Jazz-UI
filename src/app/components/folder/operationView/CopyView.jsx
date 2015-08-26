'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {Dialog,FlatButton} from 'material-ui';
import Copy from '../../../controls/OperationTemplate/Copy.jsx';
import FolderStore from '../../../stores/FolderStore.jsx';
import FolderAction from '../../../actions/FolderAction.jsx';
import {nodeType} from '../../../constants/TreeConstants.jsx';

var CopyView = React.createClass({
  propTypes: {
    onDismiss: React.PropTypes.func,
    copyNode:React.PropTypes.object,
  },
  _onCopyItem:function(destNode,newName){
    FolderAction.copyItem(this.props.copyNode,destNode,newName);
  },
  _onCopyItemError:function(){
    this.setState({
      errorText:I18N.Folder.Copy.Error
    });
  },
  _onCopyItemSuccess:function(){
    this.setState({
      errorText:null
    });
  },
  componentDidMount:function(){
    FolderStore.addCopyItemErrorListener(this._onCopyItemError);
    FolderStore.addCopyItemSuccessListener(this._onCopyItemSuccess);
  },
  componentWillUnmount:function(){
    FolderStore.removeCopyItemErrorListener(this._onCopyItemError);
    FolderStore.removeCopyItemSuccessListener(this._onCopyItemSuccess);
  },
  getInitialState:function(){
    return{
      errorText:null
    }
  },
  render:function(){
    var title,label;
   if(this.props.copyNode.get('Type')==nodeType.Folder){
     title=I18N.format(I18N.Folder.Copy.Title,I18N.Folder.FolderName);
     label=I18N.format(I18N.Folder.Copy.Label,I18N.Folder.FolderName);
   }
   else {
     title=I18N.format(I18N.Folder.Copy.Title,I18N.Folder.WidgetName);
     label=I18N.format(I18N.Folder.Copy.Label,I18N.Folder.WidgetName);
   }
    let Props={
      title:title,//复制文件夹 or 复制图表
      label:label,//文件夹名称 or 图表名称
      labelName:FolderStore.getCopyLabelName(this.props.copyNode,this.props.copyNode.get('Type')),
      firstActionLabel:I18N.Folder.Copy.firstActionLabel,//复制 or 保存
      treeNode:FolderStore.getParent(this.props.copyNode),
      onFirstActionTouchTap:this._onCopyItem,
      onDismiss:this.props.onDismiss,
      errorText:this.state.errorText
    };

    return(
      <Copy {...Props}/>
    )
  }
});
module.exports = CopyView;
