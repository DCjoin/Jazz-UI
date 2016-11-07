'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { Dialog, FlatButton, TextField, Paper, CircularProgress } from 'material-ui';
import MailAction from '../../../actions/MailAction.jsx';

var Send = React.createClass({
  propTypes: {
    firstActionLabel: React.PropTypes.string,
    secondActionLabel: React.PropTypes.string,
    onFirstActionTouchTap: React.PropTypes.func,
    onSecondActionTouchTap: React.PropTypes.func,
    content: React.PropTypes.string,
    onDismiss: React.PropTypes.func,
  },

  _onFirstActionTouchTap: function() {
    this.refs.dialog.dismiss();
    if (this.props.onFirstActionTouchTap) {
      this.props.onFirstActionTouchTap();
    }
  },
  _onSecondActionTouchTap: function() {
    this.refs.dialog.dismiss();
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
      title: I18N.Mail.Send.Title,
      actions: actions,
      modal: true,
      openImmediately: true,
      onDismiss: this.props.onDismiss,
      titleStyle: titleStyle
    };
    var content = this.props.content;
    if (this.props.loading) {
      content = <div style={{
        marginLeft: '300px'
      }}>
      <CircularProgress  mode="indeterminate" size={80} />
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
var SendView = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    onDismiss: React.PropTypes.func,
  },
  _onSendAgain: function() {
    MailAction.sendEamilOrMessage(true);
  },
  _onConfirm: function() {
    MailAction.resetSendInfo();
  },
  getDialog: function() {
    var content;
    switch (this.props.type) {
      case '1':
        content = <Send firstActionLabel={I18N.Mail.Send.Ok}
        onFirstActionTouchTap={this._onConfirm}
        content={I18N.Mail.Send.Success}
        onDismiss={this.props.onDismiss}/>;
        break;
      case '03092':
        content = <Send firstActionLabel={I18N.Mail.Send.Send}
        secondActionLabel={I18N.Mail.Send.Cancel}
        onFirstActionTouchTap={this._onSendAgain}
        content={I18N.Mail.Send.E03092}
        onDismiss={this.props.onDismiss}
        />;
        break;
      case '03099':
        content = <Send firstActionLabel={I18N.Mail.Send.Ok} content={I18N.Mail.Send.E03099} onDismiss={this.props.onDismiss}/>;
        break;
      case 'loading':
        content = <Send loading={true} onDismiss={this.props.onDismiss}/>;
        break;
    }
    return content;
  },
  render: function() {
    var content = this.getDialog();
    return (
      <div>
        {content}
      </div>
      )
  }
});

module.exports = SendView;
