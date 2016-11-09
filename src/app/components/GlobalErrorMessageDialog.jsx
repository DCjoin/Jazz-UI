'use strict';
import React from "react";

import { Snackbar, FlatButton } from 'material-ui';
import NewDialog from '../controls/NewDialog.jsx';

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
  render() {
    var errorCodeArr = ['21802', '1', '03054', '06182'];
    var content = this.state.errorCode === '06182' ? (<div dangerouslySetInnerHTML={{
      __html: this.state.errorMessage
    }}></div>) : (<div>{this.state.errorMessage}</div>);
    var output = null;
    if (this.state.isShowed) {
      var snackbar = <Snackbar style={{
        maxWidth: 'none'
      }} message={this.state.errorMessage} open={this.state.isShowed} onRequestClose={this._onDismiss} ref='errorMessageDialog' />;
      var dialog = (<NewDialog title={I18N.Platform.ServiceProvider.ErrorNotice} open={this.state.isShowed} modal={false} onClose={this._onDismiss} ref='errorMessageDialog'>
        {content}
      </NewDialog>);
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
