'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import MainAppBar from '../MainAppBar.jsx';
import NetworkChecker from '../../controls/NetworkChecker.jsx';
import Content from './MailContent.jsx';
import Dialog from './MailDialog.jsx';
var createReactClass = require('create-react-class');
let Mail = createReactClass({
  contextTypes:{
      currentRoute: PropTypes.object
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
