'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {Dialog,FlatButton,TextField,Paper,CircularProgress} from 'material-ui';
import UserAction from '../../actions/UserAction.jsx';
import UserStore from '../../stores/UserStore.jsx';
import UsersOperation from './assets/UsersOperation.jsx';

var Send = React.createClass({
  propTypes: {
    userId:React.PropTypes.number,
    type:React.PropTypes.string,//文件夹 or 图表
    onFirstActionTouchTap:React.PropTypes.func,
    onSecondActionTouchTap:React.PropTypes.func,
    onDismiss: React.PropTypes.func,
  },
  getInitialState:function(){
    return{
      users:null,
      isLoading:false
    }
  },
_onFirstActionTouchTap:function(){
  this.refs.dialog.dismiss();
  if(this.props.onFirstActionTouchTap){
    this.props.onFirstActionTouchTap();
  }
},
_onSecondActionTouchTap:function(){
  this.refs.dialog.dismiss();
  if(this.props.onSecondActionTouchTap){
    this.props.onSecondActionTouchTap();
  }
},
_onLoadUserList:function(){
  this.setState({
    users:UserStore.getUserList(),
    isLoading:false
  });
},
componentDidMount:function(){
  UserStore.addUserListListener(this._onLoadUserList);
  UserAction.getUserList(this.props.userId,window.currentCustomerId);
  this.setState({
    isLoading:true
  })
},
componentWillUnmount:function(){
  UserStore.removeUserListListener(this._onLoadUserList);
},
  render:function(){
    //style
    let titleStyle={
          fontSize:'20px',
          color:'#464949',
          marginLeft:'26px'
        };

    let actions = [
          <FlatButton
            label={I18N.Template.Send.Send}
            onTouchTap={this._onFirstActionTouchTap}
          />,
          <FlatButton
            label={I18N.Template.Send.Cancel}
            onTouchTap={this._onSecondActionTouchTap}
          />
          ];
    let dialogProps={
            ref:'dialog',
            title:I18N.format(I18N.Template.Send.Title,this.props.type),
            actions:actions,
            modal:true,
            openImmediately:true,
            onDismiss:this.props.onDismiss,
            titleStyle:titleStyle
          };
  let content;
  if(this.state.isLoading){
    content=<CircularProgress  mode="indeterminate" size={1} />
  }
  else {
    content=(this.state.users!=null)?<UsersOperation users={this.state.users} type={I18N.Template.Share.Share}/>:null;
  }

    return(
      <div className='jazz-copytemplate-dialog'>
        <Dialog {...dialogProps}>
          {content}
        </Dialog>
      </div>
    )
  }
});

module.exports = Send;
