'use strict';
import React from "react";

import {Dialog, Snackbar, FlatButton} from 'material-ui';

let GlobalErrorMessageDialog = React.createClass({
  getInitialState(){
    return {
             isShowed: false,
             errorMessage:''
           };
  },
  _onDismiss(){
    this.setState({isShowed: false});
  },
  _show(){
    this.refs.errorMessageDialog.show();
  },
  _hide(){
    this.refs.errorMessageDialog.dismiss();
  },
  render(){
    let me = this;
    var snackbar = <Snackbar
      message={me.state.errorMessage}
<<<<<<< HEAD
      action="确定"
      onActionTouchTap={me._hide}
=======
>>>>>>> parent of e0f8a75... for pull
      onDismiss={me._onDismiss}
      ref='errorMessageDialog' />;

    return  <div>{snackbar} </div>;
  },
  componentDidUpdate(){
    if(this.state.isShowed){
      this._show();
    }
  },
});

module.exports = GlobalErrorMessageDialog;
