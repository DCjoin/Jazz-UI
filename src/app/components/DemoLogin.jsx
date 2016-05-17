'use strict';

import React from 'react';
import get from 'lodash/object/get';
import { CircularProgress, Snackbar } from 'material-ui';
import LoginActionCreator from '../actions/LoginActionCreator.jsx';
import LoginStore from '../stores/LoginStore.jsx';
import LinkButton from '../controls/LinkButton.jsx';
import Regex from '../constants/Regex.jsx';
import CusFlatButton from '../controls/FlatButton.jsx';
import { FlatButton } from 'material-ui';
import Dialog from '../controls/PopupDialog.jsx';
import ViewableTextField from '../controls/ViewableTextField.jsx';
import CurrentUserAction from '../actions/CurrentUserAction.jsx';

var DemoLogin = React.createClass({
	contextTypes: {
		router: React.PropTypes.func
	},
	getInitialState() {
		return {
			showApplyDlg: false,
			loginError: false,
			demoEmail: ""
		};
	},

	_onChange() {
		if( LoginStore.hasLoggedin() ){
			this._goMain();
		} else {
			this.setState({
				loginError: true
			});
		}
	},
	_showDialog() {
		this.setState({
			showApplyDlg: true
		});
	},
	_doneDialog( demoEmail ) {
		this.setState({
			showApplyDlg: false,
			demoEmail
		});
	},
	_dismissDialog() {
		this.setState({
			showApplyDlg: false
		});
	},
	_dismissDemoSnackbar() {
		this.setState({
			demoEmail: ""
		});
	},
	_renderDemoApplyDialog() {
		if( this.state.showApplyDlg ) {
			return (
        <DemoApplyDialog onCancel={this._dismissDialog}/>
      );
		}
		return null;
	},
	_renderDemoApplySnackbar() {
		var demoEmail = this.state.demoEmail;
		if( demoEmail ) {
			return (
				<Snackbar
					message={"产品试用链接已发送到 " + demoEmail }
					open={true}
					onRequestClose={this._dismissDemoSnackbar}/>
			);
		}
		return null;
	},
	_goMain() {
		CurrentUserAction.getUser(window.currentUserId);
		this.context.router.transitionTo('main', this.props.params);
	},
	_goLogin( demoEmail ) {
		this.context.router.transitionTo('login', this.props.params);
	},

	componentDidMount() {
		LoginStore.addChangeListener(this._onChange);
		LoginActionCreator.demoLogin( {
			UserName: this.props.params.user,
			Password: this.props.params.token
		} );
	},
	componentWillUnmount() {
		LoginStore.removeChangeListener(this._onChange);
	},

	render() {
		if( !this.state.loginError) {
			return (
        <div className="jazz-demo-login">
          <CircularProgress mode="indeterminate" size={2} />
        </div>);
		} else {
			return (
				<div className="jazz-demo-login">
					<div className="jazz-demo-login-content">
						<div>产品试用链接已失效!</div>
						<div>
							<LinkButton label={"重新申请产品试用"} onClick={ this._showDialog }></LinkButton>
							<LinkButton label={"返回登录页"} onClick={ this._goLogin }></LinkButton>
						</div>
					</div>
					{this._renderDemoApplyDialog() }
					{this._renderDemoApplySnackbar() }
				</div>
			);
		}
	}
});

var DemoApplyDialog = React.createClass({
	getInitialState() {
		return {
			email: "",
      reqTrialUseStatus:null,
		};
	},
  _onChange:function(){
    if(LoginStore.getreqTrialUseReset()){
      this.setState({ reqTrialUseStatus:true });
    }
  },
	_sendApply() {
		LoginActionCreator.reqDemoApply( this.state.email );
	},
	_cancelApply() {
		if( this.props.onCancel ) {
			this.props.onCancel();
		}
	},
  componentDidMount: function() {
    LoginStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    LoginStore.removeChangeListener(this._onChange);
  },
	render() {
		let email = this.state.email,
		sendProps = {
			disabled: !email || !Regex.Email.test( email ) || email.length > 254,
			onClick: this._sendApply,
			label: I18N.Common.Button.GoOn
		},
		cancelProps = {
			onClick: this._cancelApply,
			label: I18N.Common.Button.Cancel
		},
    goonProps = {
			onClick: this._cancelApply,
			label: I18N.Common.Button.GoOn
		},
		emailProps = {
      autoFocus: true,
			isViewStatus: false,
			title: I18N.Login.Email,
			defaultValue: this.state.email,
			isRequired: true,
			regex: Regex.Email,
			errorMessage: I18N.Login.WrongEmail,
			maxLen:254,
			didChanged: value => { this.setState({ email: value }) }
		};

    if(this.state.reqTrialUseStatus == true){
      let actions = [
  			<CusFlatButton {...goonProps} />
  		];
      return(
        <Dialog title={I18N.Login.TrialUseTitle} actions={actions} modal={true} openImmediately={true}  contentStyle={{ width: '530px' }}>
          <div>{I18N.Login.TrialUseSussTip1}<b>{this.state.email}</b><br></br>{I18N.Login.TrialUseSussTip2}</div>
  			</Dialog>
      );
    }else{
      let actions = [
  			<CusFlatButton {...sendProps} />,
  			<CusFlatButton {...cancelProps} />
  		];
      return (
  			<Dialog title={I18N.Login.TrialUse} openImmediately={true} modal={true} actions={actions}>
  				<div>{I18N.Login.TrialUseTips}</div>
  				<ViewableTextField {...emailProps} />
  			</Dialog>
  		);
    }
	}
});

module.exports = DemoLogin;
