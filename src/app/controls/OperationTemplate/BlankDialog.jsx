'use strict';
import React from "react";
import { TextField, Paper, CircularProgress } from 'material-ui';
import PropTypes from 'prop-types';
import NewDialog from '../NewDialog.jsx';
import FlatButton from '../FlatButton.jsx';
var createReactClass = require('create-react-class');
var BlankDialog = createReactClass({
  propTypes: {
    title: PropTypes.string,
    firstActionLabel: PropTypes.string,
    secondActionLabel: PropTypes.string,
    onFirstActionTouchTap: PropTypes.func,
    onSecondActionTouchTap: PropTypes.func,
    content: PropTypes.string,
    onDismiss: PropTypes.func,
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
