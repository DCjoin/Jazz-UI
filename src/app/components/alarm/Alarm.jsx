'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';

import assign from "object-assign";

import LeftPanel from './AlarmLeftPanel.jsx';
import ChartPanel from './ChartPanel.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import DataSelectPanel from '../DataSelectPanel.jsx';

import EnergyStore from '../../stores/EnergyStore.jsx';

let Alarm = React.createClass({
    mixins:[Navigation,State],

    _onSwitchButtonClick(){
      this.setState({
        showLeftPanel:!this.state.showLeftPanel
      });
    },
    _onLoadingStatusChange(){
      if(!this.state.showDataSelectPanelButton){
        this.setState({showDataSelectPanelButton:true});
      }
    },
    getInitialState: function() {
        return {
          showLeftPanel: true,
          showDataSelectPanelButton: false
        };
    },
    render() {
      var LeftPanelField, dataSelectPanel;
      if(this.state.showLeftPanel){
          LeftPanelField= <div style={{display:'flex'}}> <LeftPanel ></LeftPanel> </div> ;
      }else{
        LeftPanelField= <div style={{display:'none'}}> <LeftPanel ></LeftPanel> </div> ;
      }

      if(this.state.showDataSelectPanelButton){
        dataSelectPanel = <DataSelectPanel onButtonClick={this._onSwitchButtonClick} linkFrom="Alarm" defaultStatus={false}></DataSelectPanel>;
      }
      return(
        <div style={{display:'flex', flex:1}}>
          {LeftPanelField}
          <ChartPanel isSettingChart={false}></ChartPanel>
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
