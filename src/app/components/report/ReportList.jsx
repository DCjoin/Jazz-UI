'use strict';

import React from 'react';
import ReportItem from './ReportItem.jsx';
import ReportAction from '../../actions/ReportAction.jsx';
import ReportStore from '../../stores/ReportStore.jsx';


let ReportList = React.createClass({
  _onReportItemSelected(reportItem) {
    ReportAction.setSelectedReportItem(reportItem);
    this.setState({
      selectedReport: reportItem
    });
  },
  getInitialState: function() {
    return {
      reportList: this.props.reportList
    };
  },
  render() {
    let me = this;
    let reportList = this.props.reportList;
    let reportItems = null;

    reportItems = reportList.map(function(item) {
      let props = {
        id: item.Id,
        templateId: item.TemplateIdId,
        name: item.Name,
        user: item.CreateUser,
        data: item.CriteriaList,
        onItemClick: me._onReportItemSelected,
        selectedReport: me.state.selectedReport
      };
      return (
        <ReportItem {...props}></ReportItem>
        );
    });

    return (
      <div>
        {reportItems}
      </div>
      );
  }
});

module.exports = ReportList;
