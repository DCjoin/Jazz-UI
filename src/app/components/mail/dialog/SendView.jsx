'use strict';
import React from "react";
import CircularProgress from 'material-ui/CircularProgress';
import MailAction from '../../../actions/MailAction.jsx';
import NewDialog from '../../../controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import PropTypes from 'prop-types';
var createReactClass = require('create-react-class');
var Send = createReactClass({
  propTypes: {
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
      title: I18N.Mail.Send.Title,
      actions: actions,
      modal: true,
      open: true,
      // onDismiss: this.props.onDismiss,
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
          <NewDialog {...dialogProps}>
            {content}
          </NewDialog>
        </div>
      </div>
      )
  }
});
var SendView = createReactClass({
  propTypes: {
    type: PropTypes.string,
    onDismiss: PropTypes.func,
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
