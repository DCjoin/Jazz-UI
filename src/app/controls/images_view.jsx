'use strict';

/*jshint esversion: 6 */
import PropTypes from 'prop-types';

import React, { Component } from "react";
import Immutable from 'immutable';
import moment from 'moment';
import classnames from 'classnames';
import assign from 'object-assign';
import Events from 'material-ui/utils/events';
import Config from 'config';
import FontIcon from 'material-ui/FontIcon';
import SingleImageView from '../sections/SingleImageView.jsx';

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_ESC = 27;
const FILE_TYPE_IMAGE_REG = /(png|jpe?g|bmp|gif)/;

export default class ImagesView extends Component {

        static defaultProps = {
		            idx: 0,
		            editable: false,
		            data: Immutable.fromJS({}),
		            onRequestClose: ()=>{
			            console.log('ImagesView\'s function \'onRequestClose\' is undefined.');
		            },
	  };

        static propTypes = {
		            idx: PropTypes.number,
		            editable: PropTypes.bool,
		            data: PropTypes.object.isRequired,
		            onRequestClose: PropTypes.func.isRequired,
	    };

        constructor(props) {
		        super(props);
            this._handleKeyInput = this._handleKeyInput.bind(this);
		        this.state = {
                        idx: this.props.idx,
			                  data: this.props.data,
		        };
	      }

         componentDidMount() {
		        Events.on(document, "keyup", this._handleKeyInput);
	        }

	        componentWillUnmount() {
		        Events.off(document, "keyup", this._handleKeyInput);
	        }

          _handleKeyInput(evt) {
            if(evt.target.type !== "textarea") {
              var idx = this.state.idx;
                  if(evt.which == KEY_ESC){
                      this.props.onRequestClose(evt);
                  } else if ((evt.which == KEY_LEFT || evt.which == KEY_UP) && this._hasLeft()) {
                this._goLeft();
              } else if ((evt.which == KEY_RIGHT || evt.which == KEY_DOWN) && this._hasRight()) {
                this._goRight();
              }
            }
          }

        _hasLeft() {
		        return this.state.idx > 0;
	      }

	     _hasRight() {
	        	return this.state.idx < this.props.data.get("Pictures").size - 1;
	      }

        _goLeft() {
		        let currentIdx = this.state.idx;
		        if (this._hasLeft()) {
                        if(this.refs.image){
                                this.refs.image.handleDefaultClick();
                         }
			      this.setState({
				          idx: currentIdx - 1,
				          data: this.props.data,
			      });
		      }
	      }

        _goRight() {
          let currentIdx = this.state.idx;
          if (this._hasRight()) {
                              if(this.refs.image){
                                      this.refs.image.handleDefaultClick();
                              }
            this.setState({
              idx: currentIdx + 1,
              data: this.props.data,
            });
          }
        }

        render() {
          let {data, onRequestClose} = this.props;
                      let idx = this.state.idx,
            logPictures = this.props.data.get("Pictures");

            return (
                    <div className="overlay-background" style={{zIndex:1400}}>
                        <div className="images-container">
                            <div className="images-close">
                                <em className="icon-close" onClick={onRequestClose} color="white" style={{fontSize:"24px", marginRight:"8px", marginLeft:"20px", cursor:"pointer"}}/>
                            </div>
                            <div className="images-content">
                                <div className="images-arrow">
                                    {this._hasLeft() && <em className="icon-arrow-left arrow" onClick={:: this._goLeft}/>}
                                </div>
                                <div className="images-image">
                      {(logPictures && logPictures.size === 0) ? null : (<div className="images-image-bg">
                                                                        <SingleImageView ref="image" url={this.props.data.getIn(["Pictures",idx,'ImageUrl'])}/>
                                                                                                                  </div>) }
                      {(logPictures && logPictures.size > 0) ? (<div className="image-seq-num">{idx + 1}/{logPictures.size}</div>) : null}
                                </div>
                                <div className="images-arrow">
                                    {this._hasRight() && <em className="icon-arrow-right arrow" onClick={:: this._goRight}/>}
                                </div>
                            </div>
                        </div>
                    </div>
            );
	}
}