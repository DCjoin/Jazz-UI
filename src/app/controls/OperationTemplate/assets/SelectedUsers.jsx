'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {FontIcon} from 'material-ui';
import AllUser from './AllUsers.jsx';
import classNames from 'classnames';
import Immutable from 'immutable';
import UserStore from '../../../stores/UserStore.jsx';
import UserAction from '../../../actions/UserAction.jsx';

var UserItem= React.createClass({
  propTypes: {
    user:React.PropTypes.object,
  },
  _onCleanButtonClick:function(){
    UserAction.setUserStatus(this.props.user,false);
  },
  _onMouserOver:function(){
     React.findDOMNode(this.refs.cleanIcon).style.display='block';
  },
  _onMouserOut:function(){
  React.findDOMNode(this.refs.cleanIcon).style.display='none';
  },

  render:function(){
    var cleanIconStyle={
      marginTop:'3px',
      fontSize:'16px',
      display:'none'
    };
    return(
      <div className='jazz-folder-selectedusers-useritem' onMouseOver={this._onMouserOver} onMouseOut={this._onMouserOut}>
          <div className='name'>
            {this.props.user.get('RealName')}
          </div>
          <div className='type'>
            {this.props.user.get('UserTypeName')}
          </div>
          <div style={{float:'right'}}>
            <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>

          </div>

      </div>
    )


  }
});
var SelectedUsers = React.createClass({
  propTypes: {
    type:React.PropTypes.string,
  },
  getInitialState:function(){
    return{
      users:UserStore.getUserStatus()
    };
  },
  _onUsersChange:function(){
    this.setState({
      users:UserStore.getUserStatus()
    });
  },
  componentDidMount:function(){
    UserStore.addUserStatusListener(this._onUsersChange);
  },
  componentWillUnmount:function(){
    UserStore.removeUserListListener(this._onUsersChange);
  },
  render:function(){
    var fontStyle={
      fontSize:'14px',
      color:'#abafae'
    };
    var content=[];
    if(this.state.users){
      this.state.users.forEach(function(user){
        content.push(<UserItem user={user}/>)
      })
    }
    return(
      <div>
        <div style={fontStyle}>
          {I18N.format(I18N.Template.User.Selected,this.props.type)}
        </div>
        <div className='jazz-folder-selectedusers'>
          <div className='title'>
              姓名
          </div>
          <div className='content'>
              {content}
          </div>
        </div>
      </div>
    )
  }
});

module.exports = SelectedUsers;
