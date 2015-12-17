'use strict';

import React from 'react';
import ReportItem from './ReportItem.jsx';
import ReportAction from '../../actions/ReportAction.jsx';
import ReportStore from '../../stores/ReportStore.jsx';


let ReportList = React.createClass({
  getInitialState: function() {
    return {
      reportItem: ReportStore.getSelectedReportItem()
    };
  },
  _onChange: function() {
    var reportItem = ReportStore.getSelectedReportItem();
    this.setState({
      reportItem: reportItem
    });
  },
  _onReportItemSelected(reportItem) {
    ReportAction.setSelectedReportItem(reportItem);
  },
  componentDidMount: function() {
    ReportStore.addReportItemChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    ReportStore.removeReportItemChangeListener(this._onChange);
  },
  render() {
    let me = this;
    let reportList = this.props.reportList;
    let reportItems = null;
    if (reportList && reportList.size !== 0) {
      reportItems = reportList.map(function(item) {
        let props = {
          key: item.get('Id'),
          id: item.get('Id'),
          templateId: item.get('TemplateId'),
          name: item.get('Name'),
          createUser: item.get('CreateUser'),
          data: item.get('CriteriaList'),
          version: item.get('Version'),
          onItemClick: me._onReportItemSelected,
          selectedReport: me.state.reportItem
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
