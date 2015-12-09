'use strict';

import React from 'react';

import MainAppBar from '../MainAppBar.jsx';
import NetworkChecker from '../../controls/NetworkChecker.jsx';
import Content from './MailContent.jsx';
import Dialog from './MailDialog.jsx';

let Mail = React.createClass({
  componentWillUnmount: function() {
    console.log();
  },
  render: function() {
    var logoUrl = 'Logo.aspx?hierarchyId=' + window.currentCustomerId;
    return (
      <div className='jazz-content'>
            <Content/>
            <Dialog/>
            <NetworkChecker></NetworkChecker>
        </div>
      );
  },
});
module.exports = Mail;
