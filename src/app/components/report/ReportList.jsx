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

    };
  },
  componentDidMount: function() {},
  render() {
    let me = this;
    let reportList = this.props.reportList;
    let reportItems = null;

    reportItems = reportList.map(function(item) {
      let props = {
        id: item.Id,
        templateId: item.TemplateId,
        name: item.Name,
        user: item.CreateUser,
        data: item.CriteriaList,
        version: item.Version,
        onItemClick: me._onReportItemSelected,
        selectedReport: me.state.selectedReport || me.props.reportItem
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
