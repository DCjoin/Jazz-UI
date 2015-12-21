'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import CommonFuns from '../../util/Util.jsx';
import { CircularProgress, Paper } from 'material-ui';
import _escape from 'lodash/string/escape';
import Immutable from 'immutable';
import DatePicker from './DatePicker.jsx';
import MapAction from '../../actions/MapAction.jsx';
import MapStore from '../../stores/MapStore.jsx';
import LanguageStore from '../../stores/LanguageStore.jsx';
const ZOOM_LEVEL = 17;

const POPUP_POSITION_RIGHT_TOP_X = 130;
const POPUP_POSITION_RIGHT_TOP_Y = -35;

const POPUP_POSITION_RIGHT_BOTTOM_X = 130;
const POPUP_POSITION_RIGHT_BOTTOM_Y = 225;

const POPUP_POSITION_LEFT_TOP_X = -135;
const POPUP_POSITION_LEFT_TOP_Y = -35;

const POPUP_POSITION_LEFT_BOTTOM_X = -135;
const POPUP_POSITION_LEFT_BOTTOM_Y = 225;


let MapPanel = React.createClass({
  mixins: [Navigation, State],
  getInitialState: function() {
    return {
      //  isloading: false,
      markers: null,
      popup: {
        "show": false,
        "id": -1
      },
      item: null
    };
  },
  _map: null,
  _poiEventHandler: [],
  _markerHandler: null,
  _clearMap() {
    this._map.clearMap();
    for (var i = 0; i < this._poiEventHandler.length; i++) {
      var handler = this._poiEventHandler[i];
      AMap.event.removeListener(handler);
    }
  },
  _genIconHtml(id, hover) {
    var marker = this.state.markers[id];
    var bgColor;
    // if (marker.dataValues[0].IsQualified === null) {
    //   bgColor = 'blue';
    // } else {
    //   if (marker.dataValues[0].IsQualified) {
    //     bgColor = 'green';
    //   } else {
    //     bgColor = 'red';
    //   }
    // }

    var hoverStyle = "";
    if (hover) {
      hoverStyle = "lg fix-position";
    }

    var div = document.createElement("div");
    div.className = "bubble-icon " + 'blue' + " " + hoverStyle;
    return div;
  },
  _addMarkers: function() {
    this._clearMap();
    var markers = this.state.markers;
    this._markerHandler = {};
    markers.forEach((marker, markerId) => {
      if (marker.lat != null && marker.lon != null) {
        var iconHtml = this._genIconHtml(markerId);
        var point = new AMap.Marker({
          content: iconHtml,
          position: new AMap.LngLat(marker.lon, marker.lat)
        });
        point.setExtData({
          "id": markerId
        });
        point.setMap(this._map);
        this._markerHandler[markerId] = point;
        //set click
        // var handler = AMap.event.addListener(point, 'click', function(params) {
        //   var target = params.target;
        //   var id = target.getExtData()["id"];
        //   this.transitionTo('asset-info', assign({}, this.getParams(), {
        //     hierarchyCode: Util.encodeId(id)
        //   }));
        // }.bind(this));
        // this._poiEventHandler.push(handler);

        //add mouse over
        var handler = AMap.event.addListener(point, 'mouseover', function(params) {
          var target = params.target;
          target.setTop(true);
          var id = target.getExtData()["id"];
          var html = this._genIconHtml(id, true);
          var marker = this.state.markers[id];
          MapAction.GetMapBuildingByBuildingId(marker.id);
          target.setContent(html);
          this.setState({
            "popup": {
              "show": true,
              "id": id
            }
          });
          // this._showEnergyCost(id);

        }.bind(this));
        this._poiEventHandler.push(handler);

        //add mouse out
        handler = AMap.event.addListener(point, 'mouseout', function(params) {
          var target = params.target;
          var id = target.getExtData()["id"];
          var html = this._genIconHtml(id);
          target.setContent(html);
          this.setState({
            "popup": {
              "show": false,
              "id": -1
            },
            item: null
          });
        }.bind(this));
        this._poiEventHandler.push(handler);
      }

    });

  },
  _onMapInfoChanged: function() {
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
    var markers = MapStore.getMarkers();
    this.setState({
      "markers": markers
    });
    this._addMarkers();
    //this._map.setFitView();
    // this.setState({
    //   isloading: false
    // });

  },
  _onDateChanged: function(dateId) {
    MapAction.getMapBuildingsByCustomerId(dateId);
  // this.setState({
  //   isloading: true
  // });
  },
  _createPopupUI: function(marker) {
    // var id = this.state.popup.id;
    // var marker = this.state.markers[id];
    var RelativeDateType = ['', I18N.Map.Date.Today, I18N.Map.Date.Yesterday, '', '', I18N.Map.Date.ThisMonth, I18N.Map.Date.LastMonth, I18N.Map.Date.ThisYear, I18N.Map.Date.LastYear];
    var EnergyInfo = [I18N.Map.EnergyInfo.CarbonEmission,
      I18N.Map.EnergyInfo.Cost, '',
      I18N.Map.EnergyInfo.Electricity,
      I18N.Map.EnergyInfo.Water,
      I18N.Map.EnergyInfo.Gas,
      I18N.Map.EnergyInfo.SoftWater,
      I18N.Map.EnergyInfo.Petrol,
      I18N.Map.EnergyInfo.LowPressureSteam,
      I18N.Map.EnergyInfo.DieselOi,
      I18N.Map.EnergyInfo.Heat,
      I18N.Map.EnergyInfo.CoolQ,
      I18N.Map.EnergyInfo.Coal,
      I18N.Map.EnergyInfo.CoalOil];
    var Qualify = [I18N.Map.EnergyInfo.TargetValue.Qualified, I18N.Map.EnergyInfo.TargetValue.NotQualified];
    var imgUrl = marker.imageId == null ? require("../../less/images/defaultBuilding.png") : 'BuildingPicture.aspx?pictureId=' + marker.imageId + '&usedInMap=true';
    var bgColor = 'blue';
    // if (marker.dataValues[0].IsQualified === null) {
    //   bgColor = 'blue';
    // } else {
    //   if (marker.dataValues[0].IsQualified) {
    //     bgColor = 'green';
    //   } else {
    //     bgColor = 'red';
    //   }
    // }
    var energyInfoContent = null;
    var preTitle = RelativeDateType[MapStore.getSelectedDateType()];
    // var value = CommonFuns.convertDataByUom(2245531, 'COM');
    // var uom = CommonFuns.convertUom(2245531, 'COM');
    marker.dataValues.forEach(value => {
      let content = null;
      if (value.EnergyDataValue !== null) {
        let valueStr = CommonFuns.convertDataByUom(value.EnergyDataValue, value.EnergyDataUom);
        let uom = CommonFuns.convertUom(value.EnergyDataValue, value.EnergyDataUom);
        content = "<div class='firstline'>" +
          "<div>" + preTitle + EnergyInfo[value.EnergyDataType + 2] + "</div>" +
          "<div>" + valueStr + uom + "</div>" +
          "</div>";
      }
      if (value.Ranking !== null) {
        content += "<div class='secondline'>" + I18N.Folder.NewWidget.Menu5 + ' ' + value.Ranking + '/' + value.TotalCount + "</div>";
      }
      // if (value.IsQualified !== null) {
      //   let color = (value.IsQualified) ? 'red' : 'green';
      //   let valueStr = CommonFuns.convertDataByUom(value.TargetDataValue, value.TargetDataUom);
      //   let uom = CommonFuns.convertUom(value.TargetDataValue, value.TargetDataUom);
      //   content += "<div class='thirdline " + color + "'>" +
      //     Qualify[value.IsQualified + 0] + "(" + valueStr + " " + uom + ")" +
      //     "</div>";
      // }
      if (content !== null) {
        energyInfoContent = (energyInfoContent === null) ? "<div class='map-energyinfo-content'>" + content + "</div>" : energyInfoContent + "<div class='map-energyinfo-content'>" + content + "</div>";
      }
    });
    if (energyInfoContent === null) {
      energyInfoContent = "<div class='map-energyinfo-content'>" + I18N.Map.EnergyInfo.NonMessage + "</div>";
    }
    var html = "<div class='pop-info'>" +
      "<div class='pic'><img src='" + imgUrl + "' /></div>" +
      "<p title='" + _escape(marker.name) + "' class='hiddenEllipsis title " + bgColor + "'><em>" + _escape(marker.name) + "</em></p>" +
      energyInfoContent +
      "</div>";
    return html;
  },
  _showPopup: function() {
    if (this._map) {
      if (!this.state.popup.show) {
        this._map.clearInfoWindow();
      } else {
        if (this.state.item !== null) {
          var marker = this.state.item;
          var position = this._determinePopupPosition(marker);
          this._popupWindow = new AMap.InfoWindow({
            content: this._createPopupUI(marker),
            offset: position,
            isCustom: true
          });
          this._popupWindow.open(this._map, new AMap.LngLat(marker.lon, marker.lat));
        }
      }

    }
  },
  _determinePopupPosition(marker) {
    var mapSize = this._map.getSize();
    var markerPosition = this._map.lngLatToContainer(new AMap.LngLat(marker.lon, marker.lat));
    var count = marker.dataValues.length;
    var x = 0,
      y = 0;
    if (markerPosition.x <= mapSize.width / 2 && markerPosition.y <= mapSize.height / 2) {

      x = POPUP_POSITION_RIGHT_BOTTOM_X;
      y = POPUP_POSITION_RIGHT_BOTTOM_Y;
      if (count === 0) {
        y -= 43;
      }
    } else if (markerPosition.x >= mapSize.width / 2 && markerPosition.y <= mapSize.height / 2) {
      x = POPUP_POSITION_LEFT_BOTTOM_X;
      y = POPUP_POSITION_LEFT_BOTTOM_Y;
      if (count === 0) {
        y -= 43;
      }
    } else if (markerPosition.x <= mapSize.width / 2 && markerPosition.y >= mapSize.height / 2) {
      x = POPUP_POSITION_RIGHT_TOP_X;
      y = POPUP_POSITION_RIGHT_TOP_Y;
    } else {
      x = POPUP_POSITION_LEFT_TOP_X;
      y = POPUP_POSITION_LEFT_TOP_Y;
    }
    return new AMap.Pixel(x, y);
  },
  _onBuildingInfoChanged: function() {
    this.setState({
      item: MapStore.getBuildingInfo()
    });
  // var marker = MapStore.getBuildingInfo();
  // var position = this._determinePopupPosition(marker);
  // this._popupWindow = new AMap.InfoWindow({
  //   content: this._createPopupUI(maker),
  //   offset: position,
  //   isCustom: true
  // });
  // this._popupWindow.open(this._map, new AMap.LngLat(marker.lon, marker.lat));
  },
  _onLanguageSwitch: function() {
    var lang = (window.currentLanguage === 0) ? 'zh_cn' : 'en';
    this._map.setLang(lang);
  },
  componentDidUpdate: function() {
    this._showPopup();
  },
  componentDidMount: function() {
    MapStore.addMapInfoListener(this._onMapInfoChanged);
    MapStore.addBuildingInfoListener(this._onBuildingInfoChanged);
    LanguageStore.addSwitchLanguageListener(this._onLanguageSwitch);
    MapAction.getMapBuildingsByCustomerId(5);
  // this.setState({
  //   isloading: true
  // });
  },
  componentWillUnmount: function() {
    MapStore.removeMapInfoListener(this._onMapInfoChanged);
    MapStore.removeBuildingInfoListener(this._onBuildingInfoChanged);
    LanguageStore.removeSwitchLanguageListener(this._onLanguageSwitch);
    if (this._map) {
      this._clearMap();
      this._map.destroy();
    }
  },
  render() {
    var styleMap = {
      "width": '100%',
      flex: 1
    };
    var paperStyle = {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '81px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
    //var content = (this.state.isloading ? <Paper style={paperStyle}><CircularProgress  mode="indeterminate" size={1} /></Paper> : null);
    return (
      <div style={{
        "flex": "1",
        "display": "flex",
        flexDirection: 'column',
        marginTop: '-16px'
      }}>
    <div className='map-timepickerbar'><DatePicker onMenuItemClick={this._onDateChanged}/></div>
    <div style={styleMap} id="_map"></div>
  </div>
      )


  }

});
module.exports = MapPanel;
