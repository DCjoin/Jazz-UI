'use strict';

import React from 'react';

import Regex from '../../constants/Regex.jsx';

import LoginActionCreator from '../../actions/LoginActionCreator.jsx';

import FlatButton from '../../controls/FlatButton.jsx';
import Dialog from '../../controls/Dialog.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';

let DemoApplyDialog = React.createClass({

	getInitialState() {
		return {
			email: ""
		};
	},

	_sendApply() {
		LoginActionCreator.demoApply( this.state.email );
		if( this.props.onDone ) {
			this.props.onDone( this.state.email );
		}
	},

	_cancelApply() {
		if( this.props.onCancel ) {
			this.props.onCancel( this.state.email );
		}
	},

	render() {
		let email = this.state.email,
		sendProps = {
			disabled: !email || !Regex.Email.test( email ) || email.length > 254,
			onClick: this._sendApply,
			label: "发送"
		},
		cancelProps = {
			onClick: this._cancelApply,
			label: "放弃"
		},
		actions = [
			<FlatButton {...sendProps} />,
			<FlatButton {...cancelProps} />
		],
		emailProps = {
			autoFocus: false,
			isViewStatus: false,
			title: "电子邮箱",
			defaultValue: this.state.email,
			isRequired: true,
			regex: Regex.Email,
			errorMessage: "请按照\"user@example.com\"的格式输入",
			maxLen:254,
			didChanged: value => { this.setState({
				email: value
			}) }
		};

		return (
			<Dialog title={"欢迎试用施耐德电气千里眼远程资产管理平台"} openImmediately={true} modal={true} actions={actions}>
				<div>请填写邮箱地址，用来接收产品试用链接。</div>
				<ViewableTextField {...emailProps} />
			</Dialog>
		);
	}

});

module.exports = DemoApplyDialog;
