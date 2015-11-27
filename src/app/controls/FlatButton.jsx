'use strict';

import React from 'react';


import { FlatButton } from 'material-ui';
import _assign from "lodash/object/assign";
var _={assign:_assign};
const disabledColor = "#abafae";
const grayColor = "#767a7a";
const blueColor = "#1ca8dd";
const blueColorBackgroundColor = "#e1fcff";
const redColor = "#f46a58";
const redColorBackgroundColor = "#fcd2cd";

var CustomFlatButton = React.createClass({

	contextTypes: {
		getLessVar: React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		return {
			hovered: false
		};
	},

	_getContextProps: function() {
		var that = this,
			props = _.assign( {}, this.props, {
				onMouseEnter: that._handleMouseEnter,
				onMouseLeave: that._handleMouseLeave
			} );

		props.style = props.style || {};

		if( !props.disabled ) {

			if( !that.state.hovered ) {
				props.style.color = this.context.getLessVar("schneiderNormal");
				delete props.style.backgroundColor;
			} else {

				if( props.primary ) {
					props.style.color = this.context.getLessVar("warningRed");
					props.style.backgroundColor = this.context.getLessVar("warningRedBackground");
				} else {
					props.style.color = this.context.getLessVar("schneiderBlue");
					props.style.backgroundColor = this.context.getLessVar("schneiderBlueBackground");
				}

			}

			if( props.primary && props.inDialog ) {
				props.style.color = this.context.getLessVar("warningRed");
			}
		} else {
			props.style.color = this.context.getLessVar("schneiderGray");
			delete props.style.backgroundColor;
		}

		return props;
	},

	_handleMouseEnter: function(e) {
		this.setState({hovered: true});
		if( this.props.onMouseEnter ) {
			this.props.onMouseEnter(e);
		}
	},

	_handleMouseLeave: function(e) {
		this.setState({hovered: false});
		if( this.props.onMouseLeave ) {
			this.props.onMouseLeave(e);
		}
	},

	render: function() {
		return (
			<FlatButton {...this._getContextProps() } />
		);
	}

});

module.exports = CustomFlatButton;
