'use strict';

import React from 'react';
import { FlatButton, CircularProgress, Dialog } from 'material-ui';
import MailField from './MailField.jsx';
import Users from './MailUsers.jsx';
import MailAction from '../../actions/MailAction.jsx';
import MailStore from '../../stores/MailStore.jsx';


let MailContent = React.createClass({
  _onSendBtnClick: function() {
    MailAction.sendEamilOrMessage(false);
    this.setState({
      isLoading: true
    });
  },
  _onLoadingChanged: function() {
    this.setState({
      isLoading: false
    });
  },
  getInitialState() {
    return {
      isLoading: false
    };
  },
  componentDidMount: function() {
    MailStore.addSendErroListener(this._onLoadingChanged);
  },
  componentWillUnmount: function() {
    MailStore.removeSendErroListener(this._onLoadingChanged);
  },
  render: function() {
    let titleStyle = {
        fontSize: '20px',
        color: '#464949',
        marginLeft: '26px'
      },
      dialogProps = {
        ref: 'dialog',
        title: I18N.Mail.Send.Title,
        modal: true,
        openImmediately: true,
        titleStyle: titleStyle
      };
    var loading = this.state.isLoading ?
      <Dialog {...dialogProps}>
        <div style={{
        'margin-left': '300px'
      }}>
          <CircularProgress  mode="indeterminate" size={1} />
        </div>

    </Dialog> : null;
    return (
      <div className='jazz-mail'>
        <div className='header'>
          <div className='sendBtn'>
            <FlatButton label={I18N.Mail.SendButton} onClick={this._onSendBtnClick}/>
          </div>

        </div>
          <div className='content'>
            <div className='field'>
              <MailField/>
              <Users/>
              {loading}
            </div>
          </div>

        </div>
      );
  },
});
module.exports = MailContent;
