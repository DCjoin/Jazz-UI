import React, { Component} from 'react';
import PropTypes from 'prop-types';
export default function minHeightHOC(Base, minHeight) {
	return function(props) {
		return (<div style={{
			minHeight,
			display: 'table',
			width: '100%',
		}}>
			<Base {...props} style={{...props.style, ...{
				minHeight: document.documentElement.className.indexOf('ie') === -1 && minHeight,
				height: '100%'
			}}}/>
		</div>)
	}
}