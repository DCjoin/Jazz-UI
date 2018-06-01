'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
var createReactClass = require('create-react-class');
let SelectableItem = createReactClass({
  propTypes: {
    index: PropTypes.number,
    //the first line
    label: PropTypes.string,
    //the second line
    text: PropTypes.string,
    selectedIndex: PropTypes.number,
    onItemClick: PropTypes.func,
  },
  onClick: function() {
    this.props.onItemClick(this.props.index);
  },
  render: function() {
    return (
      <div className={classNames({
        "jazz-selectable-item": true,
        "isSelected": this.props.index == this.props.selectedIndex,
      })} onClick={this.onClick}>
        <div className='label' title={this.props.label}>
          {this.props.label}
        </div>
        <div className='text' title={this.props.text}>
          {this.props.text}
        </div>
      </div>
      )
  },
});
module.exports = SelectableItem;
