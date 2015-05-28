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
    componentDidMount: function() {
        //AlarmAction.tryAjax();
    },
    render() {

          return(
            <div style={{display:'flex', height:'100%'}}>
              <LeftPanel ></LeftPanel>
              <ChartPanel ></ChartPanel>
              <DataSelectPanel ></DataSelectPanel>
            </div>
          );
      }
});

module.exports = Alarm;
