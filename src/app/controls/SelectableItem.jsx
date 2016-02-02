'use strict';

import React from 'react';
import classNames from 'classnames';

let SelectableItem = React.createClass({
  propTypes: {
    index: React.PropTypes.number,
    //the first line
    label: React.PropTypes.string,
    //the second line
    text: React.PropTypes.string,
    selectedIndex: React.PropTypes.number,
    onItemClick: React.PropTypes.func,
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
