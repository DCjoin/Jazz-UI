'use strict';

import React from "react";
import assign from 'object-assign';
import classNames from 'classnames';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

let SideNav = React.createClass({

	propTypes: {
		side: React.PropTypes.string,
		onClose:React.PropTypes.func,
		width: React.PropTypes.number
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

					<ReactCSSTransitionGroup transitionName="pop-side-left" transitionAppear={true}>
						{animChild}
					</ReactCSSTransitionGroup>
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
					<ReactCSSTransitionGroup transitionName="pop-side-right" transitionAppear={true}>
						{animChild}
					</ReactCSSTransitionGroup>

				</div>
				);

		}

	}


});

module.exports = SideNav;
