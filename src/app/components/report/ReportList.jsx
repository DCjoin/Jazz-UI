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
    if (reportList && reportList.size !== 0) {
      reportItems = reportList.map(function(item) {
        let props = {
          id: item.get('Id'),
          templateId: item.get('TemplateId'),
          name: item.get('Name'),
          createUser: item.get('CreateUser'),
          data: item.get('CriteriaList'),
          version: item.get('Version'),
          onItemClick: me._onReportItemSelected,
          selectedReport: me.state.selectedReport || me.props.reportItem
        };
        return (
          <ReportItem {...props}></ReportItem>
          );
      });
    }

    return (
      <div>
        {reportItems}
      </div>
      );
  }
});

module.exports = ReportList;
