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
import ChartAction from '../../actions/ChartAction.jsx';

let Alarm = React.createClass({
  //mixins: [Navigation, State],
  contextTypes:{
      currentRoute: React.PropTypes.object
  },
  _onLeftSwitchButtonClick() {
    var leftShow, rightShow;
    leftShow = !this.state.showLeftPanel;
    if (this.state.showLeftPanel) {
      rightShow = this.state.showRightPanel;
    } else {
      if (this.state.showRightPanel) {
        rightShow = false;
      } else {
        rightShow = this.state.showRightPanel;
      }
    }
    this.setState({
      showLeftPanel: leftShow,
      showRightPanel: rightShow
    }, ChartAction.redrawChart);
  },
  _onRightSwitchButtonClick() {
    var leftShow, rightShow;
    rightShow = !this.state.showRightPanel;
    if (this.state.showRightPanel) {
      leftShow = this.state.showLeftPanel;
    } else {
      if (this.state.showLeftPanel) {
        leftShow = false;
      } else {
        leftShow = this.state.showLeftPanel;
      }
    }
    this.setState({
      showLeftPanel: leftShow,
      showRightPanel: rightShow
    }, ChartAction.redrawChart);
  },
  // _onSwitchButtonClick() {
  //   this.setState({
  //     showLeftPanel: !this.state.showLeftPanel
  //   });
  // },
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
      showRightPanel: false,
      showDataSelectPanelButton: false,
      widgetDto: null,
      title: null,
      refreshAnalysisPanel: false
    };
  },
  componentWillMount: function() {
    document.title = I18N.Title.Alarm;
  },
  componentDidUpdate: function() {
    if (window.lastLanguage != window.currentLanguage) {
      document.title = I18N.Title.Alarm;
      window.lastLanguage = window.currentLanguage;
    }
  },
  render() {
    var LeftPanelField,
      dataSelectPanel = null,
      mainPanel = (<div style={{
        marginTop: '-16px',
        backgroundColor: '#ffffff',
        position: 'relative',
        flex: 1
      }}>
      <OrigamiPanel/>
    </div>);

    var me = this;
    if (this.state.showLeftPanel) {
      LeftPanelField = <div style={{
        display: 'flex'
      }}><LeftPanel lang={ (window.currentLanguage === 0) ? 'zh_cn' : 'en'} onItemClick={this._onItemClick}/></div> ;
    } else {
      LeftPanelField = <div style={{
        display: 'none'
      }}><LeftPanel lang={ (window.currentLanguage === 0) ? 'zh_cn' : 'en'} onItemClick={this._onItemClick}/></div> ;
    }

    if (this.state.showDataSelectPanelButton) {
      dataSelectPanel = <RightPanel onButtonClick={this._onRightSwitchButtonClick}
      defaultStatus={this.state.showRightPanel}
      container={<DataSelectMainPanel linkFrom='Alarm'></DataSelectMainPanel>}/>;
    }
    if (me.state.title) {
      if (me.state.refreshAnalysisPanel) {
        mainPanel = <div style={{
          marginTop: '-16px',
          backgroundColor: '#ffffff',
          position: 'relative',
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
          onCollapseButtonClick: this._onLeftSwitchButtonClick
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
      FolderAction.getFolderTreeByCustomerId(this.context.currentRoute.params.customerId);
    }
  },
  componentWillUnmount: function() {
    EnergyStore.removeTagDataLoadingListener(this._onLoadingStatusChange);
    AlarmTagAction.clearSearchTagList();
  }
});

module.exports = Alarm;
