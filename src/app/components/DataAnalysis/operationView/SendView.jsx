'use strict';
import React, {Component, PropTypes} from "react";
import {Dialog, CircularProgress} from 'material-ui';

import NewAppTheme from 'decorator/NewAppTheme.jsx';

import {nodeType} from 'constants/TreeConstants.jsx';

import NewFlatButton from 'controls/NewFlatButton.jsx';
import UsersOperation from 'controls/OperationTemplate/assets/UsersOperation.jsx';

import UserAction from 'actions/UserAction.jsx';
import FolderAction from 'actions/FolderAction.jsx';
import UserStore from 'stores/UserStore.jsx';

@NewAppTheme
export default class SendView extends Component {
  static propTypes = {
    userId: PropTypes.number,
    type: PropTypes.string, //文件夹 or 图表
    onSendItem: PropTypes.func,
    onDismiss: PropTypes.func,
  };
  static contextTypes = {
    router: PropTypes.object,
  };
  constructor(props, cxt) {
    super(props);

    this._onLoadUserList = this._onLoadUserList.bind(this);
    this._onUserStatus = this._onUserStatus.bind(this);
    this._dismiss = this._dismiss.bind(this);
    this._onSubmitActionTouchTap = this._onSubmitActionTouchTap.bind(this);
    this._onCancelActionTouchTap = this._onCancelActionTouchTap.bind(this);

    UserAction.resetUserList();
    UserStore.addUserListListener(this._onLoadUserList);
    UserStore.addUserStatusListener(this._onUserStatus);

    this.state ={
      users: null,
      isLoading: false,
      btnDisabled: true,
      open:true
    };

    UserAction.getUserList(this.props.userId, cxt.router.params.customerId);

  }
  componentWillReceiveProps(){
    this.setState({
      open:true
    });
  }
  componentDidMount() {
    UserAction.resetUserList();
    UserStore.addUserListListener(this._onLoadUserList);
    UserStore.addUserStatusListener(this._onUserStatus);
    UserAction.getUserList(this.props.userId, this.context.router.params.customerId);
    this.setState({
      isLoading: true
    })
  }
  componentWillUnmount() {
    UserStore.removeUserListListener(this._onLoadUserList);
    UserStore.removeUserStatusListener(this._onUserStatus);
  }
  _dismiss(){
    this.setState({
      open:false
    })
  }
  _onUserStatus() {
    if (UserStore.getUserStatus().size === 0) {
      this.setState({
        btnDisabled: true
      });
    } else {
      this.setState({
        btnDisabled: false
      });
    }

  }
  _onSubmitActionTouchTap() {
    this._dismiss();
    if(this.props.onSendItem) {
      this.props.onSendItem();
    }
  }
  _onCancelActionTouchTap() {
    this._dismiss();
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  }
  _onLoadUserList() {
    this.setState({
      users: UserStore.getUserList(),
      isLoading: false
    });
  }
  render() {
    let props = {
      title: (
        <header style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#0d0d0d',
        }}>
        {I18N.format( I18N.Template.Share.Title, this.props.type)}
        </header>
      ),
      modal: true,
      open: this.state.open,
      actionsContainerStyle: {
        textAlign: 'left',
      },  
      actions: [
        <NewFlatButton
          secondary={true}
          label={I18N.Common.Button.Cancel2}
          onTouchTap={this._onCancelActionTouchTap}
          style={{
            minWidth: 68,
            marginLeft: 14,
          }}
        />,
        <NewFlatButton
          primary={true}
          label={I18N.Template.Send.Send}
          onTouchTap={this._onSubmitActionTouchTap}
          disabled={this.state.btnDisabled}
          style={{
            minWidth: 68,
            marginLeft: 20,
          }}
        />,
      ]
    },
    content;

    if (this.state.isLoading) {
      content = (<div className='flex-center'>
          <CircularProgress color='#32ad3d' size={80} />
        </div>);
    } else if(this.state.users != null) {
      content = (
        <UsersOperation 
          users={this.state.users} 
          type={I18N.Template.Send.Send}
          titleStyle={{color: '#626469'}}
          contentStyle={{
            paddingTop: 15,
            borderTop: '1px solid #e6e6e6',
          }}
          boxStyle={{
            marginLeft: 4,
          }}
        />
      );;
    }
    return (
      <Dialog {...props}>{content}</Dialog>
    );
  }
}

/*
var SendView = React.createClass({
  propTypes: {
    onDismiss: React.PropTypes.func,
    sendNode:React.PropTypes.object,
    isNew:React.PropTypes.bool,
  },
  _onSendItem:function(){
    this.props.onDismiss();
    FolderAction.sendFolderCopy(this.props.getNode ? this.props.getNode() : this.props.sendNode,UserStore.getUserIds(), this.props.isNew);
  },
  render:function(){
    var type=(this.props.sendNode.get('Type')==nodeType.Folder)?I18N.Folder.FolderName:I18N.Folder.WidgetName;
    let Props={
      userId:this.props.sendNode.get('UserId'),
      type:type,
      onFirstActionTouchTap:this._onSendItem,
      onSecondActionTouchTap:this.props.onDismiss,
      isNew: this.props.isNew
    };

    return(
      <Send {...Props}/>
    )
  }
});

module.exports = SendView;*/