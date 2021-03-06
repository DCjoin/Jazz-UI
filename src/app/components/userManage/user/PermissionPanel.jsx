'use strict';

import React from 'react';


import Util from '../../util/Util.jsx';

import CurrentUserCustomerStore from '../../stores/CurrentUserCustomerStore.jsx';
var createReactClass = require('create-react-class');
var PermissionPanel = createReactClass({

  render: function() {

    var {showPermissionUpCode} = this.props;

    if (!Util.checkHasPermissionByCode(showPermissionUpCode, CurrentUserCustomerStore.getCurrentUser().PrivilegeCodes)) {
      return null;
    }

    return (
    this.props.children
    );
  }

});

module.exports = PermissionPanel;
