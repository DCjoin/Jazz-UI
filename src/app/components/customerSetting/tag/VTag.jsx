'use strict';

import React from "react";
import Tag from './Tag.jsx';
var createReactClass = require('create-react-class');
var VTag = createReactClass({
  componentWillMount: function() {
    document.title = I18N.MainMenu.CustomerSetting;
  },
  render: function() {
    return <Tag tagType={2}/>;
  },
});

module.exports = VTag;
