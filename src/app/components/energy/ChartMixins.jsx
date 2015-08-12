'use strict';
import React from "react";
import assign from "object-assign";

let ChartMixins ={
  childContextTypes:{
      muiTheme: React.PropTypes.object.isRequired
  },
  contextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext() {
    let childContext = assign({}, this.context.muiTheme);
    childContext.spacing = assign({}, childContext.spacing);
    childContext.spacing.desktopToolbarHeight = 32;
    childContext.spacing.desktopSubheaderHeight = 32;
    childContext.component.tableRow.stripeColor = '#fbfbfb';
    return {
        muiTheme: childContext
    };
  },
};
module.exports = ChartMixins;
