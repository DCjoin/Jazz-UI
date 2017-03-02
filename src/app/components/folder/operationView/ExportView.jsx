'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import ExportChartStore from '../../../stores/Energy/ExportChartStore.jsx';
import ExportChartAction from '../../../actions/ExportChartAction.jsx';

var ExportView = React.createClass({
  propTypes: {
    onDismiss: React.PropTypes.func,
    params: React.PropTypes.object,
    path: React.PropTypes.string,
  },
  _onExportWidgetSuccess: function() {
    this.props.onDismiss();
  },
  componentDidMount: function() {
    ExportChartStore.addChangeListener(this._onExportWidgetSuccess);
    ExportChartAction.getTagsData4Export(this.props.params, this.props.path);
  },
  componentWillUnmount: function() {
    ExportChartStore.removeChangeListener(this._onExportWidgetSuccess);
  },
  render: function() {
    return (
      <div/>
      )
  }
});
module.exports = ExportView;
