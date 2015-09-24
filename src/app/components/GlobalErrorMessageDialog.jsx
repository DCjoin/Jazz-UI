'use strict';
import React from "react";

import { Dialog, Snackbar, FlatButton } from 'material-ui';

let GlobalErrorMessageDialog = React.createClass({
  getInitialState() {
    return {
      isShowed: false,
      errorMessage: '',
      errorCode: ''
    };
  },
  _onDismiss() {
    this.setState({
      isShowed: false
    });
  },
  _show() {
    this.refs.errorMessageDialog.show();
  },
  _hide() {
    this.refs.errorMessageDialog.dismiss();
  },
  render() {
    var output = null;
    var _buttonActions = [
      <FlatButton label="确定" secondary={true} onClick={this._hide} />
    ];
    var snackbar = <Snackbar message={this.state.errorMessage} onDismiss={this._onDismiss} ref='errorMessageDialog' />;
    var dialog = <Dialog title="Error Message" openImmediately={this.state.isShowed} actions={_buttonActions} modal={false} ref='errorMessageDialog' contentStyle={{
      width: '500px',
      color: '#464949'
    }}>
      <div> {this.state.errorMessage}</div>
    </Dialog>;
    if (this.state.errorCode == '1') {
      output = dialog;
    } else {
      output = snackbar;
    }

    return <div className='jazz-error-div'>{output} </div>;
  },
  componentDidUpdate() {
    if (this.state.isShowed) {
      this._show();
    }
  },
});

module.exports = GlobalErrorMessageDialog;
