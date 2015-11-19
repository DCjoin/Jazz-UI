'use strict';

import React from 'react';
import classNames from 'classnames';


let ReportItem = React.createClass({
  _onItemSelected() {
    if (this.props.onItemClick) {
      var reportItem = {
        id: this.props.id,
        templateId: this.props.templateId,
        name: this.props.name,
        user: this.props.user,
        data: this.props.data,
        version: this.props.verson
      };
      this.props.onItemClick(reportItem);
    }
  },

  render() {
    var me = this;
    let isSeleted = false;
    if (this.props.selectedReport) {
      isSeleted = (this.props.id === this.props.selectedReport.id);
    }

    return (
      <div className={classNames(
        {
          'jazz-report-grid-tr-item': true,
          'jazz-report-grid-tr-item-selected': !!isSeleted
        }
      )} onClick={me._onItemSelected}>
        <span>{me.props.name}</span>
        <span>{me.props.user}</span>
      </div>
      );
  }
});

module.exports = ReportItem;
