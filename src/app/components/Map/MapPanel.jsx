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
  mixins: [Navigation, State],
  getInitialState: function() {
    return {
      showRightPanel: false
    };
  },
  _map: null,
  _poiEventHandler: [],
  _onSwitchButtonClick() {
    this.setState({
      showRightPanel: !this.state.showRightPanel
    }, ChartAction.redrawChart);
  },
  _clearMap() {
    this._map.clearMap();
    for (var i = 0; i < this._poiEventHandler.length; i++) {
      var handler = this._poiEventHandler[i];
      AMap.event.removeListener(handler);
    }
  },
  componentDidMount: function() {
    if (!this._map) {
      this._map = new AMap.Map("_map", {
        resizeEnable: true,
        view: new AMap.View2D({
          center: new AMap.LngLat(116.397428, 39.90923),
          zoom: 5
        })
      });
      var that = this;
      this._map.plugin(["AMap.ToolBar"], function() {
        var toolBar = new AMap.ToolBar({
          direction: false, //隐藏方向导航
          ruler: true, //隐藏视野级别控制尺
          autoPosition: false //禁止自动定位
        });
        that._map.addControl(toolBar);
        toolBar.show();
      });

    // this._moveToCurrent(this.props);
    }
  },
  componentWillUnmount: function() {
    if (this._map) {
      this._clearMap();
      this._map.destroy();
    }

  },
  render() {
    var styleMap = {
      "width": '100%'
    };
    return (
      <div style={{
        "flex": "1",
        "display": "flex"
      }}>
      <div style={styleMap} id="_map"></div>
    </div>
      )
  }

});
module.exports = MapPanel;
