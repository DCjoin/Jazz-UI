'use strict';
import React from "react";
import PropTypes from 'prop-types';
import { Navigation, State } from 'react-router';
import ExportChartStore from '../../../stores/Energy/ExportChartStore.jsx';
import ExportChartAction from '../../../actions/ExportChartAction.jsx';
var createReactClass = require('create-react-class');
var ExportView = createReactClass({
  propTypes: {
    onDismiss: PropTypes.func,
    params: PropTypes.object,
    path: PropTypes.string,
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
