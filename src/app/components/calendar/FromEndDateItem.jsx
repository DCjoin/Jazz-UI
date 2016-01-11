'use strict';

import React from 'react';
import { Mixins, Styles, ClearFix, FontIcon } from 'material-ui';
import ViewableDropDownMenu from './ViewableDropDownMenu.jsx';
import FromEndDate from './FromEndDate.jsx';
import FlatButton from './FlatButton.jsx';

var FromEndDateItem = React.createClass({
  getInitialState: function() {
    return {
      typeValue: this.props.typeValue,
      typeText: this.props.typeText,
      typeItem: this.props.typeItem,
      startMonth: this.props.startMonth,
      startDay: this.props.startDay,
      endMonth: this.props.endMonth,
      endDay: this.props.endDay
    };
  },
  render: function() {}
});

module.exports = FromEndDateItem;
