'use strict';

import React from "react";
import PropTypes from 'prop-types';
import assign from 'object-assign';
import classNames from 'classnames';

import { TransitionGroup } from 'react-transition-group';
var createReactClass = require('create-react-class');
let SideNav = createReactClass({

	propTypes: {
		side: PropTypes.string,
		onClose:PropTypes.func,
		width: PropTypes.number
	},

	closeNav() {
		this.setState({open:false});
	},

	openNav() {
		this.setState({ open: true });
	},

	getDefaultProps() {
		return {
			side:'left',
			width:320

		};
	},

	getInitialState() {
		return {
			open:true
		};
	},

	componentDidUpdate: function(prevProps, prevState) {
		if(prevState.open != this.state.open && this.state.open === false){
			if(this.props.onClose){

				setTimeout((()=>{
					this.props.onClose();

				}).bind(this),500);
			}
		}
	},


	render() {

		var content = this.props.children;


		if (this.props.title){
			content = (<div>
				<div>{this.props.title}</div>
				<div>{this.props.children}</div>
			</div>);
		}


		var contentClass=null, animChild = null,cClass = null;

		var overlayClass = classNames({
			"pop-overlay": true,
			"pop-is-shown": this.state.open
		});

		if (this.props.side == "left"){
			contentClass=classNames({
				"pop-left-side-bar-content":true,
				'pop-side-left':true
			});

			cClass = classNames({
				"pop-left-side-bar": true,
				"pop-closed": !this.state.open
			});
			if(this.state.open){
				animChild = (
					<div ref="cc" key="pop-sidebar-anim"  className={contentClass} style={{width:this.props.width}}>
						{content}
					</div>);
			}
			return (
				<div className={cClass}>
					<div className={overlayClass}  onClick={this.closeNav} />

					<TransitionGroup timeout={300}>
						{animChild}
					</TransitionGroup>
				</div>

			);

		}
		else{
			contentClass=classNames({
				"pop-right-side-bar-content":true,
				"pop-side-right":true
			});
			cClass = classNames({
				"pop-right-side-bar": true,
				"pop-closed": !this.state.open
			});
			if(this.state.open){
				animChild = (
					<div ref="cc" key="pop-sidebar-anim"  className={contentClass} style={{width:this.props.width}}>
						{content}
					</div>);
			}
			return (
				<div className={cClass}>
					<div className={overlayClass}   onClick={this.closeNav} />
					<TransitionGroup timeout={300}>
						{animChild}
					</TransitionGroup>

				</div>
				);

		}

	}


});

module.exports = SideNav;
