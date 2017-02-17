'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import classNames from 'classnames';
import {TextField, Paper, CircularProgress } from 'material-ui';
import FlatButton from '../FlatButton.jsx';
import Dialog from '../NewDialog.jsx';
import UserAction from '../../actions/UserAction.jsx';
import UserStore from '../../stores/UserStore.jsx';
import UsersOperation from './assets/UsersOperation.jsx';

var Send = React.createClass({
  propTypes: {
    userId: React.PropTypes.number,
    type: React.PropTypes.string, //文件夹 or 图表
    onFirstActionTouchTap: React.PropTypes.func,
    onSecondActionTouchTap: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
    isNew: React.PropTypes.bool,
  },
  contextTypes: {
    router: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      users: null,
      isLoading: false,
      btnDisabled: true,
      open:true
    };
  },
  _dismiss(){
    this.setState({
      open:false
    })
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
  _onLoadUserList: function() {
    this.setState({
      users: UserStore.getUserList(),
      isLoading: false
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      open:true
    });
  },
  componentDidMount: function() {
    UserAction.resetUserList();
    UserStore.addUserListListener(this._onLoadUserList);
    UserStore.addUserStatusListener(this._onUserStatus);
    UserAction.getUserList(this.props.userId, this.context.router.params.customerId);
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
      label={this.props.isNew ? I18N.Template.Share.Share : I18N.Template.Send.Send}
      onTouchTap={this._onFirstActionTouchTap}
      disabled={this.state.btnDisabled}
      />,
      <FlatButton
      label={I18N.Template.Send.Cancel}
      onTouchTap={this._onSecondActionTouchTap}
      />
    ];
    let dialogProps = {
      ref: 'dialog',
      title: I18N.format(
        this.props.isNew ? I18N.Template.Share.Title : I18N.Template.Send.Title, 
        this.props.type),
      actions: actions,
      modal: true,
      open: this.state.open,
      onRequestClose: ()=>{
        this._dismiss();
        this.props.onDismiss()},
      titleStyle: titleStyle,
    };
    let content;
    if (this.state.isLoading) {
      content = <div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>
    } else {
      content = (this.state.users != null) ? <UsersOperation users={this.state.users} type={this.props.isNew ? I18N.Template.Share.User : I18N.Template.Send.Send}/> : null;
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

module.exports = Send;
