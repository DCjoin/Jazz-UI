'use strict';
import React from "react";
import PropTypes from 'prop-types';
import { Navigation, State } from 'react-router';
import { Dialog, FlatButton } from 'material-ui';
import Delete from '../../../controls/OperationTemplate/Delete.jsx';
import FolderStore from '../../../stores/FolderStore.jsx';
import FolderAction from '../../../actions/FolderAction.jsx';
import { nodeType } from '../../../constants/TreeConstants.jsx';
var createReactClass = require('create-react-class');
var DeleteView = createReactClass({
  propTypes: {
    onDismiss: PropTypes.func,
    deleteNode: PropTypes.object,
    isLoadByWidget: PropTypes.bool,
  },
  _onDeleteItem: function() {
    FolderAction.deleteItem(this.props.deleteNode, this.props.isLoadByWidget);
  },
  render: function() {
    var type = (this.props.deleteNode.get('Type') == nodeType.Folder) ? I18N.Folder.FolderName : I18N.Folder.WidgetName;

    let Props = {
      type: type, //文件夹 or 图表
      name: this.props.deleteNode.get('Name'),
      onFirstActionTouchTap: this._onDeleteItem,
      onDismiss: this.props.onDismiss
    };

    return (
      <Delete {...Props}/>
      )
  }
});
module.exports = DeleteView;
