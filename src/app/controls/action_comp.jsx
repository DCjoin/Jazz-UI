import React, { Component } from 'react';

export default class ActionComp extends Component {
	constructor(props) {
		super(props);
		this.props.action();
	}
	componentWillReceiveProps(nextProps) {
		if( this.props.triggerKey && this.props.triggerKey !== nextProps.triggerKey ) {
			nextProps.action();
		}
	}
	render() {
		return null;
	}
}