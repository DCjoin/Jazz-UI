'use strict';

import React from 'react';
import _capitalize from 'lodash/string/capitalize';
var _ = {capitalize:_capitalize};
var Loading = React.createClass({

	propTypes: {
		showImmediately: React.PropTypes.bool,
		loadingType: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			showImmediately: false,
			loadingType: "circle"
		};
	},

	getInitialState() {
		return {
			show: this.props.showImmediately
		};
	},

	render() {
		let style = {
				display: this.state.show ? "flex" : "none"
			},
			loadingContent = this._renderCircleLoading(),
			methodName = "_render" + _.capitalize(this.props.loadingType) + "Loading";

		if(this[methodName]) {
			loadingContent = this[methodName]();
		}

		return (
			<div className="pop-loading-overley" style={style}>
				{loadingContent}
			</div>
		);
	},

	_renderCircleLoading() {
		return (
			<div className="pop-loading-circle-wrapper">
			    <div className="pop-loading-circle-item-01">
			    </div>
			    <div className="pop-loading-circle-item-02">
			    </div>
			    <div className="pop-loading-circle-item-03">
			    </div>
			    <div className="pop-loading-circle-item-04">
			    </div>
			    <div className="pop-loading-circle-item-05">
			    </div>
			    <div className="pop-loading-circle-item-06">
			    </div>
			    <div className="pop-loading-circle-item-07">
			    </div>
			    <div className="pop-loading-circle-item-08">
			    </div>
			</div>
		);
	},

	_renderBounceLoading() {
		return (
			<div className="pop-loading-bounce-wrapper">
				<div className="pop-loading-bounce-item-01">
				</div>
				<div className="pop-loading-bounce-item-02">
				</div>
				<div className="pop-loading-bounce-item-03">
				</div>
				<div className="pop-loading-bounce-item-04">
				</div>
				<div className="pop-loading-bounce-item-05">
				</div>
			</div>
		);
	},

	show() {
		this.setState({
			show: true
		});
	},

	dismiss() {
		this.setState({
			show: false
		});
	}

});

module.exports = Loading;
