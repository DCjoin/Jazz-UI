'use strict';

import React from 'react';
import { TextField, CircularProgress } from 'material-ui';


let MailField = React.createClass({
  render: function() {

    return (
      <div className='jazz-mailfield'>
        <div className='jazz-mailfield-reciever'>
          <div className='title'>
            {I18N.Mail.Reciever}
          </div>
          <div className='content'>
            <input/>
          </div>
        </div>
        </div>
      );
  },
});
module.exports = MailField;
