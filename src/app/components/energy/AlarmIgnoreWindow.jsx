'use strict';
import React from "react";
import { Checkbox, FlatButton, RaisedButton } from 'material-ui';
import Dialog from '../../controls/NewDialog.jsx';

let AlarmIgnoreWindow = React.createClass({
  propTypes: {
    _onIgnoreDialogSubmit: React.PropTypes.func,
    _onIgnoreDialogCancel: React.PropTypes.func
  },
  getInitialState(){
    return{
      show:false
    }
  },
  dismiss() {
    this.setState({
      show:false
    })
  },
  show() {
    this.setState({
      show:true
    })
  },
  render() {
    var _buttonActions = [
      <FlatButton
      label={I18N.ALarm.IgnoreWindow.Ignore}
      secondary={true}
      onClick={this.props._onIgnoreDialogSubmit} />,
      <FlatButton
      label={I18N.ALarm.IgnoreWindow.Quit}
      primary={true}
      onClick={this.props._onIgnoreDialogCancel} style={{
        marginRight: '364px'
      }}/>
    ];

    var dialog = <Dialog actions={_buttonActions} modal={true} open={this.state.show} ref="ignoreDialog" contentStyle={{
      width: '600px'
    }}>
      <div style={{
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '0px 0 0 24px'
    }}>{I18N.ALarm.IgnoreWindow.Title}</div>
      <div style={{
      margin: '30px auto 10px 24px'
    }}> <Checkbox ref='batchIgnore'  label={I18N.ALarm.IgnoreWindow.content}/></div>
    </Dialog>;
    return dialog;
  }
});

module.exports = AlarmIgnoreWindow;
