import React, { Component } from 'react';

export default class ActionComp extends Component {
	constructor(props) {
		super(props);
		this.props.action();
	}
	render() {
		return null;
	}
}