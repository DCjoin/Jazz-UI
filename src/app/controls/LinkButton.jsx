'use strict';

import React from 'react';
import _ from 'lodash';

const DEFAULT_STYLE = {
	labelStyle: {
  	color: "#abafae",
  	cursor: "pointer",
	  opacity:0.9//must have this, for right color #1ca8dd
	},
	hoverColor: "#1ca8dd",
	disableColor: "#C2C5C4"
};

var LinkButton = React.createClass({

	propTypes: {
	    className: React.PropTypes.string,
		iconName:React.PropTypes.string,
	    disabled: React.PropTypes.bool,
	    hoverColor: React.PropTypes.string,
	    disableColor: React.PropTypes.string,
	    label: React.PropTypes.string.isRequired,
	    labelStyle: React.PropTypes.object,
	},

  getInitialState: function() {
  	return {
  		hovered: false
  	};
  },

  _getStyles: function() {
  	var style = _.assign( {}, DEFAULT_STYLE.labelStyle, this.props.labelStyle );
  	if( this.props.disabled ) {
  		style.color = this.props.disableColor || DEFAULT_STYLE.disableColor;
  		style.cursor = "default";
  	} else if( this.state.hovered ) {
  		style.color = this.props.hoverColor || DEFAULT_STYLE.hoverColor;
  	}
  	return style;
  },

  _handleMouseOver: function(e) {
    this.setState({hovered: true});
    if (this.props.onMouseOver) {
      this.props.onMouseOver(e);
    }
  },

  _handleMouseOut: function(e) {
    this.setState({hovered: false});
    if (this.props.onMouseOut) {
      this.props.onMouseOut(e);
    }
  },

  _handleClick: function(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  },

	render: function() {

		var { label } = this.props,
			style = this._getStyles();


		var props = {
			style: style,
			onMouseOver: this._handleMouseOver,
			onMouseOut: this._handleMouseOut,
			onClick: this._handleClick
		};

		var className = '';
		if(this.props.className){
			className = this.props.className;
		}

		var icon=null;
		if(this.props.iconName){
			icon = (<em className={this.props.iconName} style={{marginRight:'5px'}} />);
		}

		return (
			<div className={className} {...props}>{icon}<span style={style}>{label}</span></div>
		);
	}

});

module.exports = LinkButton;
