'use strict';

import React from 'react';
import { FlatButton, CircularProgress } from 'material-ui';
import MailStore from '../../stores/MailStore.jsx';
import Delete from './dialog/DeleteView.jsx';


let MailDialog = React.createClass({
  _onDismiss: function() {
    this.setState({
      dialogType: 0,
      paperShow: false
    });
  },
  _onDialogShow: function() {
    this.setState({
      dialogType: MailStore.getDialogType(),
      paperShow: true
    });
  },
  componentDidMount: function() {
    MailStore.addShowDialogListener(this._onDialogShow);
  },
  componentWillUnmount: function() {
    MailStore.removeShowDialogListener(this._onDialogShow);
  },
  getInitialState: function() {
    return {
      dialogType: 0,
      paperShow: false
    };
  },
  render: function() {
    var content;
    switch (this.state.dialogType) {
      case 1:
        content = <Delete onDismiss={this._onDismiss}/>;
        break;
      case 2:
        break;
    }

    content = (this.state.paperShow) ? content : null;
    return (
      <div>
        {content}
      </div>
      );
  },
});
module.exports = MailDialog;
