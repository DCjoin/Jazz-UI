'use strict';

import React from 'react';
import { FlatButton, CircularProgress } from 'material-ui';
import MailField from './MailField.jsx';
import Users from './MailUsers.jsx';
import MailAction from '../../actions/MailAction.jsx';


let MailContent = React.createClass({
  _onSendBtnClick: function() {
    MailAction.sendEamilOrMessage(false);
  },
  render: function() {
    // var sendBtnStyle = {
    //   marginLeft: '168px',
    //   marginTop: '18px'
    // };
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
