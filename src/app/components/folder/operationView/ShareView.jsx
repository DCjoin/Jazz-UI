'use strict';
import React from "react";
import PropTypes from 'prop-types';
import {Navigation, State } from 'react-router';
import {Dialog,FlatButton} from 'material-ui';
import Share from '../../../controls/OperationTemplate/Share.jsx';
import FolderStore from '../../../stores/FolderStore.jsx';
import UserStore from '../../../stores/UserStore.jsx';
import FolderAction from '../../../actions/FolderAction.jsx';
import {nodeType} from '../../../constants/TreeConstants.jsx';
var createReactClass = require('create-react-class');
var ShareView = createReactClass({
  propTypes: {
    onDismiss: PropTypes.func,
    shareNode:PropTypes.object,
  },
  _onShareItem:function(){
    FolderAction.shareItemCopy(this.props.shareNode,UserStore.getUserIds(), this.props.isNew);
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
