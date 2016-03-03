'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';

import assign from "object-assign";

import LeftPanel from './ReportLeftPanel.jsx';
import RightPanel from './ReportRightPanel.jsx';
import ReportStore from '../../stores/ReportStore.jsx';
import ReportAction from '../../actions/ReportAction.jsx';
import CurrentUserStore from '../../stores/CurrentUserStore.jsx';


let Report = React.createClass({
  mixins: [Navigation, State],
  getInitialState: function() {
    var rivilege = CurrentUserStore.getCurrentPrivilege();
    var onlyRead = this._getOnlyRead(rivilege);
    return {
      showLeftPanel: true,
      onlyRead: onlyRead
    };
  },
  _onCurrentrivilegeChanged: function() {
    var rivilege = CurrentUserStore.getCurrentPrivilege();
    var onlyRead = this._getOnlyRead(rivilege);
    this.setState({
      onlyRead: onlyRead
    });
  },
  _getOnlyRead(rivilege) {
    var onlyRead = false;
    if (rivilege !== null) {
      if ((rivilege.indexOf('1218') > -1) && (rivilege.indexOf('1219') === -1)) {
        onlyRead = true;
      }
    }
    return onlyRead;
  },
  _onLeftSwitchButtonClick() {
    var leftShow;
    leftShow = !this.state.showLeftPanel;
    this.setState({
      showLeftPanel: leftShow
    });
  },
  componentDidMount: function() {
    CurrentUserStore.addCurrentrivilegeListener(this._onCurrentrivilegeChanged);
  },
  componentWillUnmount: function() {
    CurrentUserStore.removeCurrentrivilegeListener(this._onCurrentrivilegeChanged);
  },
  componentWillMount: function() {
    document.title = I18N.MainMenu.Report;
  },
  componentDidUpdate: function() {
    if (window.lastLanguage != window.currentLanguage) {
      document.title = I18N.MainMenu.Report;
      window.lastLanguage = window.currentLanguage;
    }
  },
  render() {
    var mainPanel;
    var me = this;
    let LeftPanelField = (this.state.showLeftPanel) ? <div style={{
      display: 'flex'
    }}><LeftPanel onlyRead={this.state.onlyRead}/></div> : <div style={{
      display: 'none'
    }}><LeftPanel onlyRead={this.state.onlyRead}/></div>;

    mainPanel = <div style={{
      marginTop: '-16px',
      backgroundColor: '#ffffff',
      position: 'relative',
      display: 'flex',
      flex: 1
    }}>
          <RightPanel onlyRead={this.state.onlyRead} onCollapseButtonClick={me._onLeftSwitchButtonClick}></RightPanel>
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
