'use strict';

import React from 'react';
import { FlatButton, CircularProgress } from 'material-ui';
import MailField from './MailField.jsx';
import Users from './MailUsers.jsx';


let MailContent = React.createClass({
  render: function() {
    // var sendBtnStyle = {
    //   marginLeft: '168px',
    //   marginTop: '18px'
    // };
    return (
      <div className='jazz-mail'>
        <div className='header'>
          <div className='sendBtn'>
            <FlatButton label={I18N.Mail.SendButton}/>
          </div>

        </div>
        <div className='content'>
          <MailField/>
          <Users/>
        </div>
        </div>
      );
  },
});
module.exports = MailContent;
