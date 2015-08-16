'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import Immutable from 'immutable';

import AnalysisPanel from '../energy/AnalysisPanel.jsx';
import DataSelectPanel from '../DataSelectPanel.jsx';

import CommodityContainer from '../commodity/CommonCommodityPanel.jsx';
import RankingContainer from '../commodity/ranking/RankingCommodityPanel.jsx';
import RightPanel from '../../controls/RightPanel.jsx';
import ChartAction from '../../actions/ChartAction.jsx';

//for test commoditypanel
import CommodityAction from '../../actions/CommodityAction.jsx';


let MapPanel = React.createClass({
  mixins:[Navigation,State],
  getInitialState: function() {
      return {
        showRightPanel: false
      };
  },
  _onSwitchButtonClick(){
    this.setState({
      showRightPanel:!this.state.showRightPanel
    }, ChartAction.redrawChart);
  },
  //just for test commoditypanel
  componentWillMount:function(){
    CommodityAction.setEnergyConsumptionType('Cost');
  },
  render(){
    var checkedCommodity={
      commodityId:-1,
      commodityName:'介质总览'
    };
  //如果checkedTreeNodes为一个普通数组，转换成immutable
    var checkedTreeNodes=Immutable.fromJS([
    {Id:100008,
    Name:"园区B"},
    {Id:100006,
    Name:"组织B"}
    ]);
    let chartPanel = <AnalysisPanel></AnalysisPanel>;
    var RankingPanel=(<RightPanel onButtonClick={this._onSwitchButtonClick}
                                   defaultStatus={this.state.showRightPanel}
                                   container={<RankingContainer checkedCommodity={checkedCommodity} checkedTreeNodes={checkedTreeNodes}/>}/>);
    let dataSelectPanel = <DataSelectPanel  defaultStatus={false}></DataSelectPanel>;

    return <div style={{display:'flex', flex:1}}>
        {chartPanel}
        {dataSelectPanel}
      </div>;
  }

});
module.exports = MapPanel;
