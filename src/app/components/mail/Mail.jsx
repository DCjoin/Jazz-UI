'use strict';

import React from 'react';

import MainMenu from '../MainMenu.jsx';
import NetworkChecker from '../../controls/NetworkChecker.jsx';
import Content from './MailContent.jsx';
import Dialog from './MailDialog.jsx';

let Mail = React.createClass({
  render: function() {
    var logoUrl = 'Logo.aspx?hierarchyId=' + window.currentCustomerId;
    return (
      <div className='jazz-main'>
            <MainMenu logoUrl={logoUrl} />
            <Content/>
            <Dialog/>
            <NetworkChecker></NetworkChecker>
        </div>
      );
  },
});
module.exports = Mail;
