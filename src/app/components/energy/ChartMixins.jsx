'use strict';
import React from "react";
import assign from "object-assign";
import PropTypes from 'prop-types';
let ChartMixins = {
  childContextTypes: {
    muiTheme: PropTypes.object.isRequired
  },
  contextTypes: {
    muiTheme: PropTypes.object
  },
  getChildContext() {
    let childContext = assign({}, this.context.muiTheme);
    childContext.spacing = assign({}, childContext.spacing);
    childContext.spacing.desktopToolbarHeight = 32;
    childContext.spacing.desktopSubheaderHeight = 32;
    childContext.tableRow.stripeColor = '#fbfbfb';
    return {
      muiTheme: childContext
    };
  },
};
module.exports = ChartMixins;
