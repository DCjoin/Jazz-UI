'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { Dialog, FlatButton } from 'material-ui';
import Delete from '../../../controls/OperationTemplate/Delete.jsx';
import { nodeType } from '../../../constants/TreeConstants.jsx';
import MailAction from '../../../actions/MailAction.jsx';
import MailStore from '../../../stores/MailStore.jsx';

var DeleteView = React.createClass({
  propTypes: {
    onDismiss: React.PropTypes.func,
  },
  _onDeleteItem: function() {
    MailAction.deleteNotificationTemplate(MailStore.getDialogInfo());
  },
  render: function() {
    var deleteTemplate = MailStore.getDialogInfo();

    let Props = {
      type: I18N.Mail.Template,
      name: deleteTemplate.templateName,
      onFirstActionTouchTap: this._onDeleteItem,
      onDismiss: this.props.onDismiss
    };

    return (
      <Delete {...Props}/>
      )
  }
});
module.exports = DeleteView;
