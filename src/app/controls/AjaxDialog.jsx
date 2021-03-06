'use strict';

import React from 'react';
import mui from 'material-ui';
import classSet from 'classnames';
import keyMirror from 'keymirror';
import NewDialog from "controls/NewDialog.jsx";
import FlatButton from "controls/FlatButton.jsx";
var createReactClass = require('create-react-class');
var viewState = keyMirror({
  EMPTY: null,
  LOADING: null,
  ERROR: null
});


var AjaxDialog = createReactClass({

  // _show:function(argument) {
  //     this.setState({viewState:viewState.LOADING},function(argument) {
  //         this.refs.dialog.show();
  //     });
  // },

  _hide: function(argument) {
    // setTimeout((() => {
    //   this.refs.dialog.dismiss();
    // }).bind(this), 250);
    this.setState(this.getInitialState());
  },

  _error: function(title, msg, buttonActions, modal = false) {
    // var standardActions = [
    //   <FlatButton label={'buttonLabel'} primary />
    // ];
    this.setState({
      viewState: viewState.ERROR,
      errorMessage: msg,
      errorTitle: title,
      modal,
      buttonActions
    }, function(argument) {
      // this.refs.dialog.show();
    });
  },

  // noerror

  getInitialState: function() {
    return {
      viewState: viewState.EMPTY,
      errorMessage: ''
    };
  },

  handleClickBtn: function() {
    this.refs.errorDialog.dismiss();
  },

  // _confirm:function(){
  //   this.refs.dialog.dismiss();
  //   if (this.state.onConfirm) this.state.onConfirm();
  // },

  render: function() {
    var dialog = null;

    // if(this.state.viewState == viewState.LOADING){
    //
    //     dialog =  (
    //         <Dialog ref="dialog" modal={true}>
    //             <div>{"Loading"}</div>
    //         </Dialog>
    //     );
    // }
    // else
    // if (this.state.viewState == viewState.ERROR) {
      var errorMsg = this.state.errorMessage || "服务器错误！";
      var standardActions = [];
      if (this.state.buttonActions && this.state.buttonActions.length > 0) {
        for (var i = 0; i < this.state.buttonActions.length; i++) {
          var label = this.state.buttonActions[i].label;
          var onClick = this.state.buttonActions[i].onClick;
          standardActions.push(<FlatButton label={label} onClick={onClick} />);
        }
      }
      dialog = (
        <NewDialog open={this.state.viewState == viewState.ERROR} title={this.state.errorTitle} modal={this.state.modal} actions={standardActions} onRequestClose={this._hide}>
                    {errorMsg}
                </NewDialog>
      );
    // }

    return dialog;
  }
});

module.exports = AjaxDialog;
