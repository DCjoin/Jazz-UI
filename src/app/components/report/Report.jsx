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
  componentDidMount: function() {},
  componentWillMount: function() {},
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
          <RightPanel></RightPanel>
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
