'use strict';
import React from "react";

import {Dialog, FlatButton} from 'material-ui';

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
    var _buttonActions = [
            <FlatButton
            label="确定"
            secondary={true}
            onClick={this._hide} />
        ];

    var dialog = <Dialog title="Error Message" openImmediately={this.state.isShowed} actions={_buttonActions} modal={false} ref='errorMessageDialog'>
      <div> {this.state.errorMessage}</div>
    </Dialog>;

    return  <div>{dialog} </div>;
  },
  componentDidUpdate(){
    if(this.state.isShowed){
      this._show();
    }
  },
});

module.exports = GlobalErrorMessageDialog;
