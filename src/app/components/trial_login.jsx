import React, { Component } from 'react';
import moment from 'moment';

import RoutePath from 'util/RoutePath.jsx';

import CurrentUserAction from 'actions/CurrentUserAction.jsx';
import LoginAction from 'actions/LoginActionCreator.jsx';
import LoginStore from 'stores/LoginStore.jsx';

export default class TrialLogin extends Component {
	constructor(props) {

		super(props);

		this._onChange = this._onChange.bind(this);

		this.state = {
			error: false
		}
		LoginAction.trialLogin(props.router.location.query, moment().add(2, 'minutes').toDate());
		LoginStore.addChangeListener(this._onChange);
	}
	componentWillUnmount() {
		LoginStore.removeChangeListener(this._onChange);
	}
	_onChange() {
		if( LoginStore.hasLoggedin() ) {
			CurrentUserAction.getInitData(LoginStore.getCurrentUserId());
			this.props.router.replace(
				RoutePath.main(this.props.params)
			);
		} else {
			this.setState({
				error: true
			});
		}
	}
	render() {
		if( !this.state.error ) {
			return null;
		}
		return (
			<div>链接失效</div>
		);
	}
}
