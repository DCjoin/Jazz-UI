'use strict';
import React from "react";
import PropTypes from 'prop-types';
import { Navigation, State } from 'react-router';
import classNames from 'classnames';
import { Dialog, FlatButton, TextField, Paper, CircularProgress } from 'material-ui';
import UserAction from '../../actions/UserAction.jsx';
import UserStore from '../../stores/UserStore.jsx';
import UsersOperation from './assets/UsersOperation.jsx';
var createReactClass = require('create-react-class');
var Share = createReactClass({
  propTypes: {
    userId: PropTypes.number,
    onFirstActionTouchTap: PropTypes.func,
    onSecondActionTouchTap: PropTypes.func,
    onDismiss: PropTypes.func,
  },
  getInitialState: function() {
    return {
      users: null,
      btnDisabled: true,
      isLoading: false,
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
    // this.refs.dialog.dismiss();
    if (this.props.onFirstActionTouchTap) {
      this.props.onFirstActionTouchTap();
    }
  },
  _onSecondActionTouchTap: function() {
    // this.refs.dialog.dismiss();
    if (this.props.onSecondActionTouchTap) {
      this.props.onSecondActionTouchTap();
    }
  },
  _onLoadUserList: function() {
    this.setState({
      users: UserStore.getUserList(),
      isLoading: false
    });
  },
  componentDidMount: function() {
    UserAction.resetUserList();
    UserStore.addUserListListener(this._onLoadUserList);
    UserStore.addUserStatusListener(this._onUserStatus);
    UserAction.getUserList(this.props.userId, window.currentCustomerId);
    this.setState({
      isLoading: true
    })
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
      open: true,
      onDismiss: this.props.onDismiss,
      titleStyle: titleStyle
    };
    let content;
    if (this.state.isLoading) {
      content = <CircularProgress  mode="indeterminate" size={1} />
    } else {
      content = (this.state.users != null) ? <UsersOperation users={this.state.users} type={I18N.Template.Send.Send}/> : null;
    }
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
