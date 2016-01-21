'use strict';

import React from 'react';
import _assign from "lodash/object/assign";
import _isFunction from "lodash/lang/isFunction";

var _={assign:_assign,isFunction:_isFunction};


var SectionPanel = React.createClass({

	propTypes: {
		actionLabel: React.PropTypes.string,
		actionComponent: React.PropTypes.object,
		onAction: React.PropTypes.func,
		hasAction: React.PropTypes.bool,

		title: React.PropTypes.string,

		className: React.PropTypes.string,
		style: React.PropTypes.object,
		hasBorder: React.PropTypes.bool,

		titleClassName: React.PropTypes.string,
		titleStyle: React.PropTypes.object
	},

	getDefaultProps: function() {
		return {
			actionLabel: "添加",
			hasAction: true,
			hasBorder: true
		};
	},

	_handleAddBtn: function() {
		if( this.props.hasAction && _.isFunction( this.props.onAction ) ) {
			this.props.onAction();
		}
	},

	_renderTitle: function() {

		var {
			title,
			titleStyle,
			titleClassName,

			actionLabel,
			actionComponent,
			onAction,
			hasAction

		} = this.props;

		if( !title ) {
			return null;
		}

		var action = null;
		if( hasAction ) {
			if( actionComponent ) {
				action = actionComponent;
			} else if(_.isFunction( onAction )) {
				action = <span onClick={this._handleAddBtn}>{actionLabel}</span>
			}
		}

		if( titleClassName ) {
			titleClassName += " section-panel-title";
		} else {
			titleClassName = "section-panel-title";
		}

		return (
			<div className={titleClassName} style={titleStyle}>
				<h3>{title}</h3>
				{action}
			</div>
		);

	},

	render: function() {

		var title = this._renderTitle(),
			{ className, style, hasBorder } = this.props;

		className = className || "";
		if( className.length > 0 ) {
			className += " ";
		}
		className += "section-panel";

		if( !hasBorder ) {
			style = _.assign( {
				borderTop: "none"
			}, style );
		}

		return (
			<div style={style} className={className}>
				{title}
				{this.props.children}
			</div>
		);
	}

});

module.exports = SectionPanel;
