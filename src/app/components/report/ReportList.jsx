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
    let reportList = this.props.reportList;
    var reportItem;
    if (reportList !== null && reportList.size !== 0) {
      reportItem = {
        id: reportList.getIn([0, 'Id']),
        templateId: reportList.getIn([0, 'TemplateId']),
        name: reportList.getIn([0, 'Name']),
        createUser: reportList.getIn([0, 'CreateUser']),
        data: reportList.getIn([0, 'CriteriaList']),
        version: reportList.getIn([0, 'Version'])
      };
    }
    return {
      selectedReport: reportItem
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
          selectedReport: me.state.selectedReport
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
