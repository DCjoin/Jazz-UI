'use strict';

import React from 'react';

var OrigamiPanel = React.createClass({

	_getStyles: function() {
		return {
			position: "absolute",
		  left: -4,
		  top: -1,
		  border: "16px solid rgba(0, 0, 0, 0.38)",
		  borderLeft: "none",
		  width: 0,
		  height: 0,
		  borderTopColor: "transparent",
		  borderBottom: "none",
		  borderRightWidth: 4
		};
	},

	render: function() {
		var style = this._getStyles();
		return (
			<div style={style} />
		);
	}

});

module.exports = OrigamiPanel;
