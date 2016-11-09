'use strict';
import React from "react";
import { TextField, Paper, CircularProgress } from 'material-ui';

import NewDialog from '../NewDialog.jsx';
import FlatButton from '../FlatButton.jsx';

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

  _onFirstActionTouchTap: function() {
    this.props.onDismiss();
    if (this.props.onFirstActionTouchTap) {
      this.props.onFirstActionTouchTap();
    }
  },
  _onSecondActionTouchTap: function() {
    this.props.onDismiss();
    if (this.props.onSecondActionTouchTap) {
      this.props.onSecondActionTouchTap();
    }
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
      open: true,
      // onDismiss: this.props.onDismiss,
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
          <NewDialog {...dialogProps}>
            {content}
          </NewDialog>
        </div>
      </div>
      )
  }
});
module.exports = BlankDialog;
