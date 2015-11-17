'use strict';

import React from 'react';
import ReportItem from './AlarmTagItem.jsx';
import ReportAction from '../../actions/AlarmAction.jsx';
import ReportStore from '../../stores/AlarmAction.jsx';


let ReportList = React.createClass({
  _onReportItemSelected(reportOption) {
    if (this.props.onItemClick) {
      this.props.onItemClick(reportOption);
    }
    this.setState({
      selectedReport: reportOption
    });
  },
  getInitialState: function() {
    return {
      reportList: ReportStore.getReportList()
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
