'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';

import assign from "object-assign";
import Immutable from 'immutable';

import LeftPanel from './AlarmLeftPanel.jsx';
import ChartPanel from './ChartPanel.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import AlarmTagAction from '../../actions/AlarmTagAction.jsx';
import DataSelectPanel from '../DataSelectPanel.jsx';

import EnergyStore from '../../stores/EnergyStore.jsx';
import AnalysisPanel from '../energy/AnalysisPanel.jsx';
import RightPanel from '../../controls/RightPanel.jsx';
import DataSelectMainPanel from '../DataSelectMainPanel.jsx';
import FolderAction from '../../actions/FolderAction.jsx';
import FolderStore from '../../stores/FolderStore.jsx';
import OrigamiPanel from '../../controls/OrigamiPanel.jsx';

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
    let tagId = _tagOptions[0].tagId;

    var uom = '';
    if (step == 1) {
      uom = I18N.ALarm.Uom.Day;
    } else if (step == 2) {
      uom = I18N.ALarm.Uom.Month;
    } else if (step == 3) {
      uom = I18N.ALarm.Uom.Year;
    }
    var _chartTitle = tagName + uom + I18N.ALarm.Alarm;
    this.setState({
      refreshAnalysisPanel: true
    }, () => {
      me.setState({
        widgetDto: {
          timeRange: timeRange,
          step: step,
          tagId: tagId
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
  componentWillMount: function() {
    document.title = I18N.Title.Alarm;
  },
  render() {
    var LeftPanelField, dataSelectPanel,
      mainPanel = (<div style={{
        'margin-top': '-16px',
        'background-color': '#ffffff',
        flex: 1
      }}>
      <OrigamiPanel/>
    </div>);

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
      dataSelectPanel = <RightPanel onButtonClick={this._onSwitchButtonClick}
      defaultStatus={!this.state.showLeftPanel}
      container={<DataSelectMainPanel linkFrom='Alarm'></DataSelectMainPanel>}/>;
    }
    if (me.state.title) {
      if (me.state.refreshAnalysisPanel) {
        mainPanel = <div style={{
          'margin-top': '-16px',
          'background-color': '#ffffff',
          flex: 1
        }}>
          <OrigamiPanel/>
        </div>;
      } else {
        let mainPanelProps = {
          chartTitle: me.state.title,
          bizType: 'Energy',
          energyType: 'Energy',
          widgetDto: me.state.widgetDto,
          isFromAlarm: true,
          onCollapseButtonClick: this._onSwitchButtonClick
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
    if (FolderStore.getFolderTree() == Immutable.fromJS()) {
      FolderAction.getFolderTreeByCustomerId(window.currentCustomerId);
    }
  },
  componentWillUnmount: function() {
    EnergyStore.removeTagDataLoadingListener(this._onLoadingStatusChange);
    AlarmTagAction.clearSearchTagList();
  }
});

module.exports = Alarm;
