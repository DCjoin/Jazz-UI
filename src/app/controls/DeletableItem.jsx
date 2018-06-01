import React from 'react';
import classnames from "classnames";
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';
var DeletableItem = createReactClass({
  propTypes: {
    isDelete: PropTypes.bool,
    onDelete: PropTypes.func
  },
  render: function() {
    return (
      <div className='jazz-deletable-item'>
        <div className={classnames({
        "jazz-deletable-item-icon": true,
        "inactive": !this.props.isDelete
      })} onClick={this.props.onDelete}>{I18N.Common.Button.Delete}</div>
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
