'use strict';
import React from "react";
import {Checkbox, Dialog, FlatButton, RaisedButton} from 'material-ui';

let AlarmIgnoreWindow = React.createClass({
  propTypes:{
    _onIgnoreDialogSubmit:React.PropTypes.func,
    _onIgnoreDialogCancel: React.PropTypes.func
  },
  dismiss(){
    this.refs.ignoreDialog.dismiss();
  },
  show(){
    this.refs.ignoreDialog.show();
  },
  render(){
    var _buttonActions = [
            <FlatButton
            label="忽略"
            secondary={true}
            onClick={this.props._onIgnoreDialogSubmit} />,
            <FlatButton
            label="放弃"
            primary={true}
            onClick={this.props._onIgnoreDialogCancel} style={{marginRight:'364px'}}/>
        ];

    var dialog = <Dialog actions={_buttonActions} modal={true} ref="ignoreDialog" contentStyle={{width:'600px'}}>
      <div style={{fontSize:'20px', fontWeight:'bold', padding:'0px 0 0 24px'}}>忽略该点报警吗？</div>
      <div style={{margin:'30px auto 10px 24px'}}> <Checkbox ref='batchIgnore'  label='忽略该点后的连续报警'/></div>
    </Dialog>;
    return dialog;
  }
});

module.exports = AlarmIgnoreWindow;
