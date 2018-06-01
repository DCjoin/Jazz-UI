'use strict';

/*jshint esversion: 6 */
import PropTypes from 'prop-types';

import React, {Component} from "react";
import {assign as _assign} from 'lodash/object';
import classnames from 'classnames';
import Config from 'config';
import Util from "./Util.jsx";
var _ = {assign:_assign};

const MIN_ZOOM_LEVEL = 0;
const MAX_ZOOM_LEVEL = 8;
const ZOOM_RATIO = 1.3;
const ZOOM_BUTTON_INCREMENT_SIZE = 1;
const ACTION_NONE   = 0;
const ACTION_MOVE   = 1;

const _ieVersion = Util.getIEVersion();

function getWindowWidth() {
  if (typeof window === 'undefined') {
    return 0;
  }

  return window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
}

function getWindowHeight() {
  if (typeof window === 'undefined') {
    return 0;
  }

  return window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
}

function getTransform({ x = null, y = null, zoom = null }) {
  const isOldIE = _ieVersion < 10;
  const transforms = [];
  if (x !== null || y !== null) {
    transforms.push(isOldIE ?
        `translate(${x || 0}px,${y || 0}px)` :
        `translate3d(${x || 0}px,${y || 0}px,0)`
    );
  }

  if (zoom !== null) {
    transforms.push(isOldIE ?
        `scale(${zoom})` :
        `scale3d(${zoom},${zoom},1)`
    );
  }

  return {
    [isOldIE ? 'msTransform' : 'transform']:
        transforms.length === 0 ? 'none' : transforms.join(' '),
  };
}


export default class SingleImageView extends Component{
  static propTypes= {
    imageId: PropTypes.string,
    link: PropTypes.string,
    url: PropTypes.string,
    imageContent: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.any,
    mode: PropTypes.string, //contain,cover
    width: PropTypes.number,
    height: PropTypes.number
  }

  constructor(props) {
		super(props);
		this.handleZoomInButtonClick = this.handleZoomInButtonClick.bind(this);
    this.handleZoomOutButtonClick = this.handleZoomOutButtonClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleImageMouseWheel = this.handleImageMouseWheel.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleDefaultClick = this.handleDefaultClick.bind(this);
    this.state = {
      zoomLevel: MIN_ZOOM_LEVEL,
      // Horizontal offset from center
      offsetX: 0,
      // Vertical offset from center
      offsetY: 0,

    };

	}

  getZoomMultiplier(zoomLevel = this.state.zoomLevel) {
    return ZOOM_RATIO ** zoomLevel;
  }


  getMaxOffsets(zoomLevel = this.state.zoomLevel) {
    const currentImageInfo = this.refs.image;
    if (currentImageInfo === null) {
      return { maxX: 0, minX: 0, maxY: 0, minY: 0 };
    }

    const boxSize        = this.getLightboxRect();
    const zoomMultiplier = this.getZoomMultiplier(zoomLevel);

    let maxX = 0;
    if ((zoomMultiplier * currentImageInfo.offsetWidth) - boxSize.width < 0) {
      // if there is still blank space in the X dimension, don't limit except to the opposite edge
      maxX = (boxSize.width - (zoomMultiplier * currentImageInfo.offsetWidth)) / 2;
    } else {
      maxX = ((zoomMultiplier * currentImageInfo.offsetWidth) - boxSize.width) / 2;
    }

    let maxY = 0;
    if ((zoomMultiplier * currentImageInfo.offsetHeight) - boxSize.height < 0) {
      // if there is still blank space in the Y dimension, don't limit except to the opposite edge
      maxY = (boxSize.height - (zoomMultiplier * currentImageInfo.offsetHeight)) / 2;
    } else {
      maxY = ((zoomMultiplier * currentImageInfo.offsetHeight) - boxSize.height) / 2;
    }

    return {
      maxX,
      maxY,
      minX: -1 * maxX,
      minY: -1 * maxY,
    };
  }

  getLightboxRect() {
    if (this.refs.container) {
      return this.refs.container.getBoundingClientRect();
    }

    return {
      width:  getWindowWidth(),
      height: getWindowHeight(),
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
  }

  // Change zoom level
  changeZoom(zoomLevel, clientX, clientY) {

    // Constrain zoom level to the set bounds
    const nextZoomLevel = Math.max(MIN_ZOOM_LEVEL, Math.min(MAX_ZOOM_LEVEL, zoomLevel));


    // Ignore requests that don't change the zoom level
    if (nextZoomLevel === this.state.zoomLevel) {
      return;
    } else if (nextZoomLevel === MIN_ZOOM_LEVEL) {
      // Snap back to center if zoomed all the way out
      return this.setState({
          zoomLevel: nextZoomLevel,
          offsetX:   0,
          offsetY:   0,
      });
    }


    const currentZoomMultiplier = this.getZoomMultiplier();
    const nextZoomMultiplier    = this.getZoomMultiplier(nextZoomLevel);

    // Default to the center of the image to zoom when no mouse position specified
    const boxRect = this.getLightboxRect();
    const pointerX = typeof clientX !== 'undefined' ? clientX - boxRect.left : boxRect.width / 2;
    const pointerY = typeof clientY !== 'undefined' ? clientY - boxRect.top : boxRect.height / 2;

    const imageBaseSize = this.getLightboxRect();
    if (imageBaseSize === null) {
      return;
    }

    const currentImageOffsetX = ((boxRect.width - (imageBaseSize.width * currentZoomMultiplier)) / 2);
    const currentImageOffsetY = ((boxRect.height - (imageBaseSize.height * currentZoomMultiplier)) / 2);

    const currentImageRealOffsetX = currentImageOffsetX - this.state.offsetX;
    const currentImageRealOffsetY = currentImageOffsetY - this.state.offsetY;

    const currentPointerXRelativeToImage = (pointerX - currentImageRealOffsetX) / currentZoomMultiplier;
    const currentPointerYRelativeToImage = (pointerY - currentImageRealOffsetY) / currentZoomMultiplier;

    const nextImageRealOffsetX = pointerX - (currentPointerXRelativeToImage * nextZoomMultiplier);
    const nextImageRealOffsetY = pointerY - (currentPointerYRelativeToImage * nextZoomMultiplier);

    const nextImageOffsetX = ((boxRect.width - (imageBaseSize.width * nextZoomMultiplier)) / 2);
    const nextImageOffsetY = ((boxRect.height - (imageBaseSize.height * nextZoomMultiplier)) / 2);

    let nextOffsetX = nextImageOffsetX - nextImageRealOffsetX;
    let nextOffsetY = nextImageOffsetY - nextImageRealOffsetY;

    // When zooming out, limit the offset so things don't get left askew
    const maxOffsets = this.getMaxOffsets(nextZoomLevel);//fix bug: zoom out should use next zoomLeval
    if (this.state.zoomLevel > nextZoomLevel) {
      nextOffsetX = Math.max(maxOffsets.minX, Math.min(maxOffsets.maxX, nextOffsetX));
      nextOffsetY = Math.max(maxOffsets.minY, Math.min(maxOffsets.maxY, nextOffsetY));
    }

    this.setState({
      zoomLevel: nextZoomLevel,
      offsetX:   nextOffsetX,
      offsetY:   nextOffsetY,
    });
  }
  
  handleMouseDown(event){
    if(this.state.zoomLevel === MIN_ZOOM_LEVEL) {
      return;
    }
    this.currentAction    = ACTION_MOVE;
    this.moveStartX       = parseInt(event.clientX, 10);
    this.moveStartY       = parseInt(event.clientY, 10);
    this.moveStartOffsetX = this.state.offsetX;
    this.moveStartOffsetY = this.state.offsetY;
  }
  handleMouseMove(event){
    if(this.state.zoomLevel === MIN_ZOOM_LEVEL || this.currentAction !== ACTION_MOVE) {
      return;
    }
    var clientX = parseInt(event.clientX, 10);
    var clientY = parseInt(event.clientY, 10);
    const newOffsetX = (this.moveStartX - clientX) + this.moveStartOffsetX;
    const newOffsetY = (this.moveStartY - clientY) + this.moveStartOffsetY;
    if (this.state.offsetX !== newOffsetX || this.state.offsetY !== newOffsetY) {
      this.setState({
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      });
    }
  }

  handleMouseUp(ebent){
    if(this.state.zoomLevel === MIN_ZOOM_LEVEL || this.currentAction !== ACTION_MOVE) {
      return;
    }
    this.currentAction    = ACTION_NONE;
    this.moveStartX       = 0;
    this.moveStartY       = 0;
    this.moveStartOffsetX = 0;
    this.moveStartOffsetY = 0;
    // Snap image back into frame if outside max offset range
    const maxOffsets = this.getMaxOffsets();
    const nextOffsetX = Math.max(maxOffsets.minX, Math.min(maxOffsets.maxX, this.state.offsetX));
    const nextOffsetY = Math.max(maxOffsets.minY, Math.min(maxOffsets.maxY, this.state.offsetY));
    if (nextOffsetX !== this.state.offsetX || nextOffsetY !== this.state.offsetY) {
      this.setState({
        offsetX:       nextOffsetX,
        offsetY:       nextOffsetY,
        shouldAnimate: true,
      });
    }
  }

  handleImageMouseWheel(event){
    event.preventDefault();
    this.changeZoom(this.state.zoomLevel - event.deltaY/100);
  }

  handleWindowResize() {
    this.clearTimeout(this.resizeTimeout);
    this.resizeTimeout = this.setTimeout(this.forceUpdate.bind(this), 100);
  }

  handleDefaultClick(){
    this.setState({
      zoomLevel:MIN_ZOOM_LEVEL,
      offsetX: 0,
      offsetY: 0
    });
  }

  handleZoomInButtonClick(){
    if(this.state.zoomLevel === MAX_ZOOM_LEVEL) {
      return;
    }
    this.changeZoom(this.state.zoomLevel + ZOOM_BUTTON_INCREMENT_SIZE);
  }

  handleZoomOutButtonClick() {
    if(this.state.zoomLevel === MIN_ZOOM_LEVEL) {
      return;
    }
    this.changeZoom(this.state.zoomLevel - ZOOM_BUTTON_INCREMENT_SIZE);
  }

  renderOperations(){
    return (
      <div className="image-operations">
        <a className="operation-btn" title="默认" onClick={this.handleDefaultClick}>
          <em className="icon-fit" color="white" style={{fontSize:"18px"}}/>
        </a>
        <a className={classnames("operation-btn", {
          "disabled": this.state.zoomLevel === MAX_ZOOM_LEVEL
        })} title="放大" onClick={this.handleZoomInButtonClick}>
          <em className="icon-add" color="white" style={{fontSize:"18px"}}/>
        </a>
        <a  className={classnames("operation-btn", {
          "disabled": this.state.zoomLevel === MIN_ZOOM_LEVEL
        })} title="缩小" onClick={this.handleZoomOutButtonClick}>
          <em className="icon-hide" color="white" style={{fontSize:"18px"}}/>
        </a>
        {this.props.link && <a className="operation-btn" title="下载" href={this.props.link}>
          <em className="icon-download" color="white" style={{fontSize:"18px"}}/>
        </a>}
      </div>
    );
  }

  setTimeout(func, time) {
    const id = setTimeout(() => {
      this.timeouts = this.timeouts.filter(tid => tid !== id);
      func();
    }, time);
    this.timeouts.push(id);
    return id;
  }

  clearTimeout(id) {
    this.timeouts = this.timeouts.filter(tid => tid !== id);
    clearTimeout(id);
  }

  attachListeners(){
    if (!this.listenersAttached && typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleWindowResize);
      window.addEventListener('mouseup', this.handleMouseUp);
      this.listenersAttached = true;
    }
  }

  detachListeners() {
    if (this.listenersAttached) {
      window.removeEventListener('resize', this.handleWindowResize);
      window.removeEventListener('mouseup', this.handleMouseUp);
      this.listenersAttached = false;
    }
  }

  componentWillMount() {

    this.timeouts = [];

    // Current action
    this.currentAction = ACTION_NONE;

    this.resizeTimeout = null;

    // Whether event listeners for keyboard and mouse input have been attached or not
    this.listenersAttached = false;

    // Used in panning zoomed images
    this.moveStartX       = 0;
    this.moveStartY       = 0;
    this.moveStartOffsetX = 0;
    this.moveStartOffsetY = 0;
  }
  componentDidMount(){
    this.attachListeners();
  }
  componentWillUnmount() {
    this.detachListeners();
    this.timeouts.forEach(tid => clearTimeout(tid));
  }
  

  render() {
    const zoomMultiplier = this.getZoomMultiplier();
    const {
        zoomLevel,
        offsetX,
        offsetY,
    } = this.state;
    var transform = getTransform({
        x: -1 * offsetX,
        y: -1 * offsetY,
        zoom: zoomMultiplier,
    });
    var style = imageStyle = _.assign({}, this.props.style);
    var imageStyle = _.assign({
      backgroundSize: this.props.mode || "contain"
    }, transform);
    var url = "url()";


    if(this.props.imageContent){
      url = "url(data:image/png;base64,"+this.props.imageContent+")";
    }
    else if(this.props.imageId){
      var parmas = "";
      if (this.props.width && this.props.height){
          parmas += "?width=" + this.props.width + "&height=" + this.props.height;
          parmas += "&mode=" + (this.props.mode === 'cover' ? 2 : 1);
      }
      url = "url(" + Config.APIBasePath + "/picture/"+this.props.imageId + parmas + ")";
    }
    else if(this.props.url){
      url = 'url(' + this.props.url + ')';
    }

    imageStyle.backgroundImage = url;
    if (zoomLevel > MIN_ZOOM_LEVEL) {
        style.cursor = 'move';
    }
    return (
      <div 
        ref="container" 
        key={this.props.imageId} 
        className={"image-container"}
        style={style}
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
      >
        <div ref="image" className={"image-content"} style={imageStyle} onWheel={this.handleImageMouseWheel}></div>
        {this.props.children}
        {this.renderOperations()}
      </div>
    );
  }

}