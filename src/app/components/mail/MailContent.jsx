'use strict';

import React from 'react';
import { FlatButton, Dialog } from 'material-ui';
import MailField from './MailField.jsx';
import Users from './MailUsers.jsx';
import MailAction from '../../actions/MailAction.jsx';
import MailStore from '../../stores/MailStore.jsx';


let MailContent = React.createClass({
  _onSendBtnClick: function() {
    var _errorCode = MailStore.GetSendError();
    if (_errorCode.receiver === null && _errorCode.template === null && _errorCode.newtemplate === null) {

      MailAction.sendEamilOrMessage(false);
    }

  },
  componentWillUnmount: function() {
    MailStore.resetSendInfo();
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
            </div>
          </div>

        </div>
      );
  },
});
module.exports = MailContent;
