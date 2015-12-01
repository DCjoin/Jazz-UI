'use strict';

import React from 'react';

import MainAppBar from '../MainAppBar.jsx';
import NetworkChecker from '../../controls/NetworkChecker.jsx';

let Platform = React.createClass({
  render: function() {
    var logoUrl = 'Logo.aspx?hierarchyId=' + window.currentCustomerId;
    return (
      <div className='jazz-content'>
    <div style={{
        height: '100px',
        width: '500px',
        border: '1px solid black'
      }}>Platform</div>
            <NetworkChecker></NetworkChecker>
        </div>
      );
  },
});
module.exports = Platform;
