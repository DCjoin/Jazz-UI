'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';

import assign from "object-assign";

import LeftPanel from './AlarmLeftPanel.jsx';
import ChartPanel from './ChartPanel.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import DataSelectPanel from '../DataSelectPanel.jsx';

import EnergyStore from '../../stores/EnergyStore.jsx';
import AnalysisPanel from '../energy/AnalysisPanel.jsx';

let Alarm = React.createClass({
  mixins: [Navigation, State],

  _onSwitchButtonClick() {
    this.setState({
      showLeftPanel: !this.state.showLeftPanel
    });
  },
  _onLoadingStatusChange() {
    if (!this.state.showDataSelectPanelButton) {
      this.setState({
        showDataSelectPanelButton: true
      });
    }
  },
  _onItemClick: function(date, step, tagOption) {
    let me = this;
    let dateArray = AlarmAction.getDateByStep(date, step);
    let timeRange = [{
      StartTime: dateArray[0],
      EndTime: dateArray[1]
    }];
    let _tagOptions = tagOption;

    let tagName = _tagOptions[0].tagName;

    var uom = '';
    if (step == 1) {
      uom = '小时';
    } else if (step == 2) {
      uom = '日';
    } else if (step == 3) {
      uom = '月';
    }
    var _chartTitle = tagName + uom + '能耗报警';
    this.setState({
      refreshAnalysisPanel: true
    }, () => {
      me.setState({
        widgetDto: {
          timeRange: timeRange,
          step: step
        },
        title: _chartTitle,
        refreshAnalysisPanel: false
      });
    });

    if (!this.state.showDataSelectPanelButton) {
      this.setState({
        showDataSelectPanelButton: true
      });
    }
  },
  getInitialState: function() {
    return {
      showLeftPanel: true,
      showDataSelectPanelButton: false,
      widgetDto: null,
      title: null,
      refreshAnalysisPanel: false
    };
  },
  render() {
    var LeftPanelField, dataSelectPanel, mainPanel;
    var me = this;
    if (this.state.showLeftPanel) {
      LeftPanelField = <div style={{
        display: 'flex'
      }}> <LeftPanel onItemClick={this._onItemClick}></LeftPanel> </div> ;
    } else {
      LeftPanelField = <div style={{
        display: 'none'
      }}> <LeftPanel onItemClick={this._onItemClick}></LeftPanel> </div> ;
    }

    if (this.state.showDataSelectPanelButton) {
      dataSelectPanel = <DataSelectPanel onButtonClick={this._onSwitchButtonClick} linkFrom="Alarm" defaultStatus={false}></DataSelectPanel>;
    }
    if (me.state.title) {
      if (me.state.refreshAnalysisPanel) {
        mainPanel = null;
      } else {
        let mainPanelProps = {
          chartTitle: me.state.title,
          bizType: 'Energy',
          energyType: 'Energy',
          widgetDto: me.state.widgetDto,
          isFromAlarm: true
        };

        mainPanel = <AnalysisPanel {...mainPanelProps}></AnalysisPanel>;
      }
    }

    return (
      <div style={{
        display: 'flex',
        flex: 1
      }}>
          {LeftPanelField}
          {mainPanel}
          {dataSelectPanel}
        </div>
      );
  },
  componentDidMount: function() {
    EnergyStore.addTagDataLoadingListener(this._onLoadingStatusChange);
  },
  componentWillUnmount: function() {
    EnergyStore.removeTagDataLoadingListener(this._onLoadingStatusChange);
  }
});

module.exports = Alarm;
