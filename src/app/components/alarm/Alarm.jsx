'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';

import assign from "object-assign";

import LeftPanel from './AlarmLeftPanel.jsx';
import ChartPanel from './ChartPanel.jsx';

let Alarm = React.createClass({
    mixins:[Navigation,State],

    render() {

          return(
            <div style={{display:'flex', height:'100%'}}>
              <LeftPanel ></LeftPanel>
              <ChartPanel ></ChartPanel>
            </div>
          );
      }
});

module.exports = Alarm;
