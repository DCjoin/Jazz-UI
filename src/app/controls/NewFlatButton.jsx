import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';

const PrimaryStyleNormal = {
	backgroundColor: '#32ad3d',
	color: '#ffffff',
};
const PrimaryStyleHover = {
	backgroundColor: '#3dcd58',
	color: '#ffffff',
};
const PrimaryStyleDisable = {
	backgroundColor: '#aae5b8',
	color: '#ffffff',
};

const SecondaryStyleNormal = {
	color: '#32ad3d',
	border: '1px solid #32ad3d',
	backgroundColor: 'rgba(0, 0, 0, 0)',
};
const SecondaryStyleHover = {
	color: '#3dcd58',
	border: '1px solid #3dcd58',
	backgroundColor: 'rgba(0, 0, 0, 0)',
};
const SecondaryStyleDisable = {
	color: '#aae5b8',
	border: '1px solid #aae5b8',
	backgroundColor: 'rgba(0, 0, 0, 0)',
};

export default class NewFlatButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hovered: false,
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.disabled) {
		  this.setState({
		    hovered: false
		  });
		}
	}
	render() {
		let {primary, secondary, style, ...other} = this.props,
		{hovered} = this.state,
		props = {
			onMouseEnter: () => {
				if(!other.disabled) {
					this.setState({
						hovered: true
					});
				}
			},
			onMouseLeave: () => {
				this.setState({
					hovered: false
				});
			}
		};
		if( primary ) {
			props.style = other.disabled ? PrimaryStyleDisable :
				hovered ? PrimaryStyleHover : PrimaryStyleNormal;	
		} else if( secondary ) {
			props.style = other.disabled ? SecondaryStyleDisable :
				hovered ? SecondaryStyleHover : SecondaryStyleNormal;			
		}
		if( style ) {
			props.style = {...style, ...props.style};
		}
		return (
			<FlatButton {...other} {...props}/>
		);
	}
}

NewFlatButton.propTypes = {
	primary: PropTypes.bool,
	secondary: PropTypes.bool,
};
