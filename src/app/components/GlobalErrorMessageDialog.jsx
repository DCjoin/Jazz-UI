'use strict';
import React from "react";

import { Dialog, Snackbar, FlatButton } from 'material-ui';

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
    var errorCodeArr = ['21802', '1', '03054'];
    var output = null;
    var _buttonActions = [
      <FlatButton label={'确定'} secondary={true} onClick={this._onDismiss} />
    ];
    var snackbar = <Snackbar style={{
      maxWidth: 'none'
    }} message={this.state.errorMessage} openOnMount={true} onDismiss={this._onDismiss} ref='errorMessageDialog' />;
    var dialog = <Dialog title="" openImmediately={true} actions={_buttonActions} modal={false} ref='errorMessageDialog' contentStyle={{
      width: '500px',
      color: '#464949'
    }}>
      <div> {this.state.errorMessage}</div>
    </Dialog>;
    if (this.state.isShowed) {
      if (errorCodeArr.indexOf(this.state.errorCode) !== -1 || this.state.dialogShow) {
        output = dialog;
      } else {
        output = snackbar;
      }
    }
    return <div>{output} </div>;
  }
});

module.exports = GlobalErrorMessageDialog;
