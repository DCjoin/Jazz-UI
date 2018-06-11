'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _assign from "lodash-es/assign";
import _isFunction from "lodash-es/isFunction";
var createReactClass = require('create-react-class');
var _ = {
  assign: _assign,
  isFunction: _isFunction
};


var SectionPanel = createReactClass({

  propTypes: {
    actionLabel: PropTypes.string,
    actionComponent: PropTypes.object,
    onAction: PropTypes.func,
    hasAction: PropTypes.bool,

    title: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object,
    hasBorder: PropTypes.bool,

    titleClassName: PropTypes.string,
    titleStyle: PropTypes.object
  },

  getDefaultProps: function() {
    return {
      actionLabel: null,
      hasAction: true,
      hasBorder: true
    };
  },

  _handleAddBtn: function() {
    if (this.props.hasAction && _.isFunction(this.props.onAction)) {
      this.props.onAction();
    }
  },

  _renderTitle: function() {

    var {title, titleStyle, titleClassName, actionLabel, actionComponent, onAction, hasAction} = this.props;

    if (!title) {
      return null;
    }

    var action = null;
    if (hasAction) {
      if (actionComponent) {
        action = actionComponent;
      } else if (_.isFunction(onAction)) {
        action = <span onClick={this._handleAddBtn} style={{
          fontSize: '14px'
        }}>{actionLabel}</span>
      }
    }

    if (titleClassName) {
      titleClassName += " section-panel-title";
    } else {
      titleClassName = "section-panel-title";
    }

    return (
      <div className={titleClassName} style={titleStyle}>
				<h3>{title}</h3>
				{action}
			</div>
      );

  },

  render: function() {

    var title = this._renderTitle(),
      {className, style, hasBorder} = this.props;

    className = className || "";
    if (className.length > 0) {
      className += " ";
    }
    className += "section-panel";

    if (!hasBorder) {
      style = _.assign({
        borderTop: "none"
      }, style);
    }

    return (
      <div style={style} className={className}>
				{title}
				{this.props.children}
			</div>
      );
  }

});

module.exports = SectionPanel;
