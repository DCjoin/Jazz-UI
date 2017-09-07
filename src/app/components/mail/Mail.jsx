'use strict';

import React from 'react';

import MainAppBar from '../MainAppBar.jsx';
import NetworkChecker from '../../controls/NetworkChecker.jsx';
import Content from './MailContent.jsx';
import Dialog from './MailDialog.jsx';

let Mail = React.createClass({
  contextTypes:{
      currentRoute: React.PropTypes.object
  },
  render: function() {
    return (
      <div className='jazz-content' style={{
        flex: 1,
        backgroundColor: '#fbfbfb'
      }}>
            <Content/>
            <Dialog/>
            <NetworkChecker></NetworkChecker>
        </div>
      );
  },
});
module.exports = Mail;
