'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {Dialog,FlatButton} from 'material-ui';
import Share from '../../../controls/OperationTemplate/Share.jsx';
import FolderStore from '../../../stores/FolderStore.jsx';
import UserStore from '../../../stores/UserStore.jsx';
import FolderAction from '../../../actions/FolderAction.jsx';
import {nodeType} from '../../../constants/TreeConstants.jsx';

var ShareView = React.createClass({
  propTypes: {
    onDismiss: React.PropTypes.func,
    shareNode:React.PropTypes.object,
  },
  _onShareItem:function(){
    FolderAction.ShareItemCopy(this.props.shareNode,UserStore.getUserIds());
  },
  render:function(){
    let Props={
      userId:this.props.shareNode.get('UserId'),
      onFirstActionTouchTap:this._onShareItem,
      onDismiss:this.props.onDismiss
    };

    return(
      <Share {...Props}/>
    )
  }
});
module.exports = ShareView;
