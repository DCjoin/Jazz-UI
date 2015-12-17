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
      showLeftPanel: true
    };
  },
  _onLeftSwitchButtonClick() {
    var leftShow;
    leftShow = !this.state.showLeftPanel;
    this.setState({
      showLeftPanel: leftShow
    });
  },
  componentDidMount: function() {},
  componentWillUnMount: function() {},
  render() {
    var mainPanel;
    var me = this;
    let LeftPanelField = (this.state.showLeftPanel) ? <div style={{
      display: 'flex'
    }}><LeftPanel/></div> : <div style={{
      display: 'none'
    }}><LeftPanel/></div>;

    mainPanel = <div style={{
      marginTop: '-16px',
      backgroundColor: '#ffffff',
      position: 'relative',
      display: 'flex',
      flex: 1
    }}>
          <RightPanel onCollapseButtonClick={me._onLeftSwitchButtonClick}></RightPanel>
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
