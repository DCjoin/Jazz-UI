//ar React = require('react');
import React from 'react';
import ReactDom from 'react-dom';
import ViewableTextField from "./ViewableTextField.jsx";
import GetLessVar from '../util/GetLessVar.jsx';
import PropTypes from 'prop-types';
const ZOOM_LEVEL = 15;
var createReactClass = require('create-react-class');
var ViewableMap = createReactClass({

  propTypes: {
    isView: PropTypes.bool.isRequired,
    isAdd: PropTypes.bool,
    lng: PropTypes.number,
    lat: PropTypes.number,
    address: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    title: PropTypes.string,
    didChanged: PropTypes.func
  },

  getDefaultProps() {
    return {
      address: "",
      title: '',
      width: 430, //widget width if no provided
      height: 140 //widget heightif no provided
    };
  },

  _map: null,

  _timeoutHandler: null,

  _defaultPositionLabel: null,
  _defaultCity: null,

  _initMap(props=this.props) {
    if (this._map != null) {
      this._map.destroy();
    }
    this._map = new AMap.Map("_viewable_map", {
      resizeEnable: false,
      view: new AMap.View2D({})
    });
    this._map.setStatus({
      dragEnable: !props.isView,
    });
    if (!props.isView) {
      AMap.event.addListener(this._map, 'moveend', this._onMapMove);
    }

    if (props.lng && props.lat) {
      this._map.setZoomAndCenter(ZOOM_LEVEL, new AMap.LngLat(props.lng, props.lat));
    } else if (props.address) {
      this._locationTextChanged(props.address, 0);
    }


  },

  _onTextFieldFocus() {
    var node = ReactDom.findDOMNode(this.refs.map);
    if (node.style.display === "none") {
      node.style.display = "block";
    }
    if (this.props.isAdd) {
      this._initMap();
    }
  },

  _onMapMove() {
    var center = this._map.getCenter();
    var that = this;
    AMap.service(["AMap.Geocoder"], function() {
      var MGeocoder = new AMap.Geocoder({
        extensions: "base"
      });

      MGeocoder.getAddress(center, function(status, result) {
        var city=result.regeocode.addressComponent.city?result.regeocode.addressComponent.city:result.regeocode.addressComponent.province;
        if (status === 'complete' && result.info === 'OK') {
          that._defaultPositionLabel = result.regeocode.formattedAddress;
          that._defaultCity = city;
          that._changeTip(result.regeocode.formattedAddress);
        } else {
          that._changeTip(I18N.Setting.Building.MapTip1, "showWarning");
        }
        if (that.props.didChanged) {
          var text = that.refs.mapText.getValue();
          that.props.didChanged(center.lng, center.lat, text,city);
        }
      });
    });
  },

  _changeTip(text, type = "showAddress") {
    if (type === "showAddress") {
      ReactDom.findDOMNode(this.refs.tip).setAttribute("title", text);
      text = I18N.Setting.Building.MapTip2 + text;
      ReactDom.findDOMNode(this.refs.tip).innerHTML = text;
      ReactDom.findDOMNode(this.refs.warningContainer).style.display = "none";
      ReactDom.findDOMNode(this.refs.tipContainer).style.display = "block";
    } else if (type === "hide") {
      ReactDom.findDOMNode(this.refs.warningContainer).style.display = "none";
      ReactDom.findDOMNode(this.refs.tipContainer).style.display = "none";
    } else if (type === "showWarning") {
      ReactDom.findDOMNode(this.refs.warning).innerHTML = text;
      ReactDom.findDOMNode(this.refs.tipContainer).style.display = "none";
      ReactDom.findDOMNode(this.refs.warningContainer).style.display = "block";
    }
  },

  _useLocation() {
    if (this.props.didChanged) {
      var center = this._map.getCenter();
      var text = this._defaultPositionLabel;
      var city=this._defaultCity;
      this.props.didChanged(center.lng, center.lat, text,city);
    }
    this._changeTip(null, 'hide');
  },

  _locationTextChanged(text, delay = 1000) {
    if (this._timeoutHandler !== null) {
      clearTimeout(this._timeoutHandler);
    }
    if (text === null || text === "" || text.trim() === "") {
      this.props.didChanged(null, null, null,null);
      return;
    }
    this._timeoutHandler = setTimeout(() => {
      if (this.props.didChanged) {
        var center = this._map.getCenter();
        this.props.didChanged(center.lng, center.lat, text,this._defaultCity);
      }
      AMap.service(["AMap.Geocoder"], () => {
        var MGeocoder = new AMap.Geocoder();
        MGeocoder.getLocation(text, (status, result) => {
          if (status === 'complete' && result.info === 'OK' && result.resultNum > 0) {
            var loc = result.geocodes[0].location;
            var city=result.geocodes[0].addressComponent.city?result.geocodes[0].addressComponent.city:result.geocodes[0].addressComponent.province;
            this._map.setZoomAndCenter(ZOOM_LEVEL, new AMap.LngLat(loc.lng, loc.lat));
            if (this.props.didChanged) {
              this.props.didChanged(loc.lng, loc.lat, text,city);
            }
          } else {
            this._changeTip(I18N.Setting.Building.MapTip3, "showWarning");
          }
        });
      });
    }, delay);
  },

  _onTipHover(isHover) {
    var target = ReactDom.findDOMNode(this.refs.tipContainer);
    if (isHover) {
      target.style.color = GetLessVar("primaryColor");
      target.style.opacity = "1";
    } else {
      target.style.color = '#767a7a';
      target.style.opacity = "0.88";
    }
  },
  componentDidMount: function() {
    if (!this.props.isAdd) {
      this._initMap();
    } else {
      var node = ReactDom.findDOMNode(this.refs.map);
      node.style.display = "none";
    }

  },
  componentWillReceiveProps: function(nextProps) {

    var node = ReactDom.findDOMNode(this.refs.map);

    var text = nextProps.address;
    if (this.props.address !== text && text !== null && text.trim() !== "") {
      //node.style.display = "block";
      this._initMap(nextProps);
    }
    if (this.props.isView!==nextProps.isView) {
      this._initMap(nextProps);
    }
    if (!nextProps.isAdd) {
      var node = ReactDom.findDOMNode(this.refs.map);
      node.style.display = "block";
    }



  },

  componentWillUnmount() {
    if (this._map) {
      this._map.destroy();
    }
  },

  render: function() {
    var textFieldProps = {
      isViewStatus: this.props.isView,
      defaultValue: this.props.address,
      title: this.props.title,
      didChanged: this._locationTextChanged,
      didFocus: this._onTextFieldFocus,
      maxLen: -1
    };

    var containerStyle = {
      border: "1px solid #ececec",
      position: "relative",
      width: this.props.width,
      height: this.props.height,
    //display: "none"
    };

    return (
      <div>
        <ViewableTextField ref="mapText" style={{
        width: this.props.width
      }} {...textFieldProps}/>
        <div ref="map" style={containerStyle}>
          <div style={{
        pointerEvents: "none",
        position: "absolute",
        top: "50%",
        left: "50%",
        zIndex: 2,
        color: 'red',
        width: 21,
        height: 35,
        marginLeft: -11,
        marginTop: -34,
        backgroundImage: "url(" + require('../less/images/marker.png') + ")",
        "userSelect": "none",
        "WebkitUserSelect": "none",
        "MozUserSelect": "none"
      }} ></div>
          <div ref="tipContainer"  onMouseOver={this._onTipHover.bind(null, true)} onMouseOut={this._onTipHover.bind(null, false)} onClick={this._useLocation} style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 2,
        backgroundColor: '#fff',
        width: "100%",
        opacity: 0.88,
        height: 28,
        lineHeight: "28px",
        display: "none",
        color: "#767a7a",
        cursor: "pointer"
      }} >
              <div ref="tip" style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        wordBreak: "keep-all",
        textAlign: "center",
        fontSize: "14px"
      }}></div>
            </div>
            <div ref="warningContainer" style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 2,
        backgroundColor: '#fff',
        width: "100%",
        opacity: 0.88,
        height: 28,
        lineHeight: "28px",
        display: "none",
        color: "#767a7a"
      }} >
                <div ref="warning" style={{

        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        wordBreak: "keep-all",
        textAlign: "center",
        fontSize: "14px"
      }}></div>
              </div>
          <div style={{
        width: this.props.width,
        height: this.props.height
      }} id="_viewable_map"></div>
        </div>
      </div>
      );
  }

});

module.exports = ViewableMap;
