'use strict';

import React from 'react';
import classNames from 'classnames';
var createReactClass = require('create-react-class');

let ReportItem = createReactClass({
  _onItemSelected() {
    if (this.props.onItemClick) {
      var reportItem = {
        id: this.props.id,
        templateId: this.props.templateId,
        name: this.props.name,
        createUser: this.props.createUser,
        data: this.props.data,
        version: this.props.version
      };
      this.props.onItemClick(reportItem);
    }
  },

  render() {
    var me = this;
    let isSeleted = false;
    if (this.props.selectedReport) {
      isSeleted = (this.props.id === this.props.selectedReport.get('id'));
    }

    return (
      <div className={classNames(
        {
          'jazz-report-grid-tr-item': true,
          'jazz-report-grid-tr-item-selected': !!isSeleted
        }
      )} onClick={me._onItemSelected} title={me.props.name}>
        <div style={{
        color: '#ffffff',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }}>{me.props.name}</div>
        <div style={{
        color: '#adb0b8'
      }}>{me.props.createUser}</div>
      </div>
      );
  }
});

module.exports = ReportItem;
