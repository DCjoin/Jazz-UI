'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';

import AnalysisPanel from '../energy/AnalysisPanel.jsx';
import DataSelectPanel from '../DataSelectPanel.jsx';

let MapPanel = React.createClass({
  render(){
    let chartPanel = <AnalysisPanel></AnalysisPanel>;
    let dataSelectPanel = <DataSelectPanel  defaultStatus={false}></DataSelectPanel>;

    return <div style={{display:'flex', flex:1}}>
        {chartPanel}
        {dataSelectPanel}
      </div>;
  }

});
module.exports = MapPanel;
