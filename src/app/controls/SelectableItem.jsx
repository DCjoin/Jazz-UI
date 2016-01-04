'use strict';

import React from 'react';

let SelectableItem = React.createClass({
  propTypes: {
    index: React.PropTypes.number,
    //the first line
    Label: React.PropTypes.string,
    //the second line
    text: React.PropTypes.string,
    selectedIndex: React.PropTypes.number,
    onItemClick: React.PropTypes.object,
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
        <div className='label'>
          {this.props.Label}
        </div>
        <div className='text'>
          {this.props.text}
        </div>
      </div>
      )
  },
});
module.exports = SelectableItem;
