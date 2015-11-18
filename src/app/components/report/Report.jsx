'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';

import assign from "object-assign";

import LeftPanel from './ReportLeftPanel.jsx';
//import rightPanel from './ReportRightPanel.jsx';


let Report = React.createClass({
  mixins: [Navigation, State],
  getInitialState: function() {
    return {

    };
  },
  componentWillMount: function() {},
  render() {
    var LeftPanelField, mainPanel;
    var me = this;

    LeftPanelField = <div style={{
      display: 'flex'
    }}> <LeftPanel onItemClick={this._onItemClick}></LeftPanel></div> ;

    // mainPanel = <div style={{
    //   'margin-top': '-16px',
    //   'background-color': '#ffffff',
    //   position: 'relative',
    //   flex: 1
    // }}>
    //       <rightPanel></rightPanel>
    //     </div>;

    return (
      <div style={{
        display: 'flex',
        flex: 1
      }}>
          {LeftPanelField}
        </div>
      );
  },
  componentDidMount: function() {},
  componentWillUnmount: function() {}
});

module.exports = Report;
