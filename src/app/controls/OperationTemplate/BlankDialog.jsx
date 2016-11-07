'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { FlatButton, TextField, Paper, CircularProgress } from 'material-ui';
import Dialog from '../NewDialog.jsx';

var BlankDialog = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    firstActionLabel: React.PropTypes.string,
    secondActionLabel: React.PropTypes.string,
    onFirstActionTouchTap: React.PropTypes.func,
    onSecondActionTouchTap: React.PropTypes.func,
    content: React.PropTypes.string,
    onDismiss: React.PropTypes.func,
  },
  getInitialState(){
    return{
      open:true
    }
  },
  _dismiss(){
    this.setState({
      open:false
    })
  },
  _onFirstActionTouchTap: function() {
    this._dismiss();
    if (this.props.onFirstActionTouchTap) {
      this.props.onFirstActionTouchTap();
    }
  },
  _onSecondActionTouchTap: function() {
    this._dismiss();
    if (this.props.onSecondActionTouchTap) {
      this.props.onSecondActionTouchTap();
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      open:true
    });
  },
  render: function() {
    //style
    let titleStyle = {
      fontSize: '20px',
      color: '#464949',
      marginLeft: '26px'
    };

    let actions = (!this.props.secondActionLabel) ? [
      <FlatButton
      label={this.props.firstActionLabel}
      onTouchTap={this._onFirstActionTouchTap}
      />
    ] : [
      <FlatButton
      label={this.props.firstActionLabel}
      onTouchTap={this._onFirstActionTouchTap}
      />,
      <FlatButton
      label={this.props.secondActionLabel}
      onTouchTap={this._onSecondActionTouchTap}
      />
    ];
    let dialogProps = {
      ref: 'dialog',
      title: this.props.title,
      actions: actions,
      modal: true,
      open: this.state.open,
      onDismiss: ()=>{
        this._dismiss();
        this.props.onDismiss()
      },
      titleStyle: titleStyle
    };
    var content = this.props.content;
    if (this.props.loading) {
      content = <div style={{
        'margin-left': '300px'
      }}>
      <CircularProgress  mode="indeterminate" size={1} />
      </div>;
      dialogProps.actions = [];
    }
    return (
      <div className='jazz-copytemplate-dialog'>
        <div className='able'>
          <Dialog {...dialogProps}>
            {content}
          </Dialog>
        </div>
      </div>
      )
  }
});
module.exports = BlankDialog;
