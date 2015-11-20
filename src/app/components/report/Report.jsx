'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';

import assign from "object-assign";

import LeftPanel from './ReportLeftPanel.jsx';
import RightPanel from './ReportRightPanel.jsx';
import ReportStore from '../../stores/ReportStore.jsx';
import ReportAction from '../../actions/ReportAction.jsx';


let Report = React.createClass({
  mixins: [Navigation, State],
  getInitialState: function() {
    return {

    };
  },
  _onChange() {
    this.setState({
      templateList: ReportStore.getTemplateList()
    });
  },
  componentDidMount: function() {
    ReportAction.getTemplateListByCustomerId(window.currentCustomerId);
    ReportStore.addTemplateListChangeListener(this._onChange);
  },
  componentWillMount: function() {
    ReportStore.removeTemplateListChangeListener(this._onChange);
  },
  render() {
    var LeftPanelField, mainPanel;
    var me = this;
    LeftPanelField = <div style={{
      display: 'flex'
    }}> <LeftPanel onItemClick={this._onItemClick}></LeftPanel></div> ;

    mainPanel = <div style={{
      'margin-top': '-16px',
      'background-color': '#ffffff',
      position: 'relative',
      display: 'flex',
      flex: 1
    }}>
          <RightPanel templateList={this.state.templateList}></RightPanel>
        </div>;

    return (
      <div style={{
        display: 'flex',
        flex: 1
      }}>
          {LeftPanelField}
          {mainPanel}
        </div>
      );
  },
});

module.exports = Report;
