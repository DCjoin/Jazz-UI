'use strict';

import React from 'react';
import classNames from 'classnames';


let ReportItem = React.createClass({
  _onItemSelected() {
    if (this.props.onItemClick) {
      var reportOption = {
        id: this.props.id,
        templateId: this.props.templateId,
        name: this.props.name,
        user: this.props.user,
        data: this.props.data
      };
      this.props.onItemClick(reportOption);
    }
  },

  render() {
    var me = this;
    let isSeleted = false;
    if (this.props.selectedReport) {
      isSeleted = (this.props.id === this.props.selectedTag.id);
    }

    return (
      <div className={classNames(
        {
          'jazz-report-grid-tr-item': true,
          'jazz-report-grid-tr-item-selected': !!isSeleted
        }
      )} onClick={me._onItemSelected}>
      <div>{me.props.name}</div>
      <div>{me.props.user}</div>
    </div>
      );
  }
});

module.exports = ReportItem;
