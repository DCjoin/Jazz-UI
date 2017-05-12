import React, { Component, PropTypes } from 'react';

const PrimaryStyleNormal = {
	backgroundColor: '#32ad3d',
	color: '#ffffff',
};
const PrimaryStyleHover = {
	backgroundColor: '#3dcd58',
	color: '#ffffff',
};

const SecondaryStyleNormal = {
	backgroundColor: '#ffffff',
	color: '#32ad3d',
};
const SecondaryStyleHover = {
	color: '#3dcd58',
	backgroundColor: '#ffffff',
};

export default class NewFlatButton extends Component {
	render() {
		return (
			<div></div>
		);
	}
}

NewFlatButton.propTypes = {
	primary: PropTypes.bool,
	secondary: PropTypes.bool,
};
