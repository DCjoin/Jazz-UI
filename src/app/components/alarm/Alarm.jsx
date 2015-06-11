'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';

import assign from "object-assign";

import LeftPanel from './AlarmLeftPanel.jsx';
import ChartPanel from './ChartPanel.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import DataSelectPanel from '../DataSelectPanel.jsx';

let Alarm = React.createClass({
    mixins:[Navigation,State],

    _onSwitchButtonClick(){
      this.setState({
        switchButton:!this.state.switchButton
      })
    },

    getInitialState: function() {
        return {
          switchButton: true
        };
      },
    componentDidMount: function() {
        //AlarmAction.tryAjax();
    },
    render() {
      var LeftPanelField;
      if(this.state.switchButton){
        LeftPanelField=<LeftPanel ></LeftPanel>;
        }
          return(
            <div style={{display:'flex', flex:1}}>
              {LeftPanelField}
              <ChartPanel ></ChartPanel>
              <DataSelectPanel onButtonClick={this._onSwitchButtonClick}></DataSelectPanel>
            </div>
          );
      }
});

module.exports = Alarm;
