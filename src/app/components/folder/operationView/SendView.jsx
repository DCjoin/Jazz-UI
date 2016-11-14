'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {Dialog,FlatButton} from 'material-ui';
import Send from '../../../controls/OperationTemplate/Send.jsx';
import UserStore from '../../../stores/UserStore.jsx';
import FolderAction from '../../../actions/FolderAction.jsx';
import {nodeType} from '../../../constants/TreeConstants.jsx';

var SendView = React.createClass({
  propTypes: {
    onDismiss: React.PropTypes.func,
    sendNode:React.PropTypes.object,
  },
  _onSendItem:function(){
    this.props.onDismiss();
    FolderAction.sendFolderCopy(this.props.sendNode,UserStore.getUserIds());
  },
  render:function(){
    var type=(this.props.sendNode.get('Type')==nodeType.Folder)?I18N.Folder.FolderName:I18N.Folder.WidgetName;
    let Props={
      userId:this.props.sendNode.get('UserId'),
      type:type,
      onFirstActionTouchTap:this._onSendItem,
      onDismiss:this.props.onDismiss
    };

    return(
      <Send {...Props}/>
    )
  }
});
module.exports = SendView;
