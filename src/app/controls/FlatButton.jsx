'use strict';

import React from 'react';

import getLessVar from '../util/GetLessVar.jsx';

import FlatButton from 'material-ui/FlatButton';
import _assign from "lodash/object/assign";
var _ = {
  assign: _assign
};
const disabledColor = "#abafae";
const grayColor = "#767a7a";
const blueColor = "#1ca8dd";
const blueColorBackgroundColor = "#e1fcff";
const redColor = "#f46a58";
const redColorBackgroundColor = "#fcd2cd";

var CustomFlatButton = React.createClass({

  getInitialState: function() {
    return {
      hovered: false
    };
  },

  _getContextProps: function() {
    var that = this,
      props = _.assign({}, this.props, {
        onMouseEnter: that._handleMouseEnter,
        onMouseLeave: that._handleMouseLeave
      });

    props.style = props.style || {};

    if (!props.disabled) {

      if (!that.state.hovered) {
        props.style.color = getLessVar("schneiderNormal");
        delete props.style.backgroundColor;
      } else {

        if (props.primary) {
          props.style.color = getLessVar("warningRed");
          props.style.backgroundColor = getLessVar("warningRedBackground");
        } else {
          props.style.color = getLessVar("schneiderBlue");
          props.style.backgroundColor = getLessVar("schneiderBlueBackground");
        }

      }

      if (props.primary && props.inDialog) {
        props.style.color = getLessVar("warningRed");
      }

      if (props.highlight && props.inDialog) {
        props.style.color = getLessVar("schneiderBlue");
      }
    } else {
      props.style.color = getLessVar("schneiderGray");
      delete props.style.backgroundColor;
    }
    delete props.inDialog;
    delete props.highlight;
    return props;
  },

  _handleMouseEnter: function(e) {
    this.setState({
      hovered: true
    });
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(e);
    }
  },

  _handleMouseLeave: function(e) {
    this.setState({
      hovered: false
    });
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(e);
    }
  },

  render: function() {
    return (
      <FlatButton {...this._getContextProps() } />
      );
  }

});

module.exports = CustomFlatButton;
