import React from 'react';
import classnames from "classnames";

var DeletableItem = React.createClass({
  propTypes: {
    isDelete: React.PropTypes.bool,
    onDelete: React.PropTypes.func
  },
  render: function() {
    return (
      <div className='jazz-deletable-item'>
        <div className={classnames({
        "jazz-deletable-item-icon": true,
        "inactive": !this.props.isDelete
      })} onClick={this.props.onDelete}>删除</div>
    <div className={classnames({
        "jazz-deletable-item-content": this.props.isDelete
      })}>
      {this.props.children}
    </div>

      </div>
      )
  },
});
module.exports = DeletableItem;
