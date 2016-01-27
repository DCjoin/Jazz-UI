'use strict';
import React from "react";

import { Snackbar, FlatButton } from 'material-ui';
import Dialog from '../controls/PopupDialog.jsx';

let GlobalErrorMessageDialog = React.createClass({
  getInitialState() {
    return {
      isShowed: false,
      errorMessage: '',
      errorCode: '',
      dialogShow: false
    };
  },
  _onDismiss() {
    this.setState({
      isShowed: false
    });
  },
  componentDidUpdate: function() {
    if (this.state.isShowed) {
      this.refs.errorMessageDialog.show();
    }
  },
  render() {
    var errorCodeArr = ['21802', '1', '03054'];
    var output = null;
    if (this.state.isShowed) {
      var snackbar = <Snackbar style={{
        maxWidth: 'none'
      }} message={this.state.errorMessage} openOnMount={true} onDismiss={this._onDismiss} ref='errorMessageDialog' />;
      var dialog = <Dialog title={I18N.Platform.ServiceProvider.ErrorNotice} openImmediately={true} modal={false} onClose={this._onDismiss} ref='errorMessageDialog'>
        {this.state.errorMessage}
      </Dialog>;
      if (errorCodeArr.indexOf(this.state.errorCode) !== -1 || this.state.dialogShow) {
        output = dialog;
      } else {
        output = snackbar;
      }
    }
    return <div>{output}</div>;
  }
});

module.exports = GlobalErrorMessageDialog;
