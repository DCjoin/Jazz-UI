'use strict';

import React from 'react';
import classNames from 'classnames';
import ChartStatusAction from '../../actions/ChartStatusAction.jsx';


let AlarmTagItem = React.createClass({
  _onTagItemSelected() {
    ChartStatusAction.clearStatus();
    if (this.props.onTagItemClick) {
      //this.props.onTagItemClick(this.props.hierarchyId, this.props.tagId, this.props.hierarchyName);
      var tagOption = {
        tagId: this.props.tagId,
        tagName: this.props.tagName,
        hierId: this.props.hierarchyId,
        hierName: this.props.hierarchyName,
        uomId: this.props.uomId
      };
      this.props.onTagItemClick([tagOption]);
    }
  },

  render() {
    var me = this;
    let isSeleted = false;
    if (this.props.selectedTag) {
      isSeleted = (this.props.tagId === this.props.selectedTag.tagId);
    }

    return (
      <div className={classNames(
        {
          'jazz-alarm-grid-tr-item': true,
          'jazz-alarm-grid-tr-item-extended': !!me.props.extended,
          'jazz-alarm-grid-tr-item-selected': !!isSeleted
        }
      )} onClick={me._onTagItemSelected}>{me.props.tagName}</div>
      );
  }
});

module.exports = AlarmTagItem;
