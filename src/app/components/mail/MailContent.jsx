'use strict';

import React from 'react';
import { FlatButton, CircularProgress } from 'material-ui';
import MailField from './MailField.jsx';
import Users from './MailUsers.jsx';


let MailContent = React.createClass({
  render: function() {

    return (
      <div className='jazz-mail'>
        <div className='header'>
          <FlatButton label={I18N.Mail.SendButton}/>
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
