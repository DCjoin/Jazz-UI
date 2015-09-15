'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { Dialog, FlatButton, TextField, Paper } from 'material-ui';
import UserAction from '../../actions/UserAction.jsx';
import UserStore from '../../stores/UserStore.jsx';
import UsersOperation from './assets/UsersOperation.jsx';

var Share = React.createClass({
  propTypes: {
    userId: React.PropTypes.number,
    onFirstActionTouchTap: React.PropTypes.func,
    onSecondActionTouchTap: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      users: null,
      btnDisabled: true
    };
  },
  _onUserStatus: function() {
    if (UserStore.getUserStatus().size === 0) {
      this.setState({
        btnDisabled: true
      });
    } else {
      this.setState({
        btnDisabled: false
      });
    }

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
  _onLoadUserList: function() {
    this.setState({
      users: UserStore.getUserList()
    });
  },
  componentDidMount: function() {
    UserAction.resetUserList();
    UserStore.addUserListListener(this._onLoadUserList);
    UserStore.addUserStatusListener(this._onUserStatus);
    UserAction.getUserList(this.props.userId, window.currentCustomerId);
  },
  componentWillUnmount: function() {
    UserStore.removeUserListListener(this._onLoadUserList);
    UserStore.removeUserStatusListener(this._onUserStatus);
  },
  render: function() {
    //style
    let titleStyle = {
      fontSize: '20px',
      color: '#464949',
      marginLeft: '26px'
    };

    let actions = [
      <FlatButton
      label={I18N.Template.Share.Share}
      onTouchTap={this._onFirstActionTouchTap}
      disabled={this.state.btnDisabled}
      />,
      <FlatButton
      label={I18N.Template.Share.Cancel}
      onTouchTap={this._onSecondActionTouchTap}
      />
    ];
    let dialogProps = {
      ref: 'dialog',
      title: I18N.Template.Share.Title,
      actions: actions,
      modal: true,
      openImmediately: true,
      onDismiss: this.props.onDismiss,
      titleStyle: titleStyle
    };
    let content = (this.state.users != null) ? <UsersOperation users={this.state.users} type={I18N.Template.Share.Share}/> : null;
    return (
      <div className='jazz-copytemplate-dialog'>
        <div className={classNames({
        "disable": this.state.btnDisabled,
        'able': !this.state.btnDisabled
      })}>
          <Dialog {...dialogProps}>
            {content}
          </Dialog>
        </div>
      </div>
      )
  }
});

module.exports = Share;
