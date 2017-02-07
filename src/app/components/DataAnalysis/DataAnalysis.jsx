import React, { Component, PropTypes } from 'react';

import PermissionCode from 'constants/PermissionCode.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import util from 'util/Util.jsx';

import Dialog from 'controls/Dialog.jsx';
// import FaltButton from 'controls/FaltButton.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';

import CurrentUserStore from 'stores/CurrentUserStore.jsx';

function isBasic() {
	return privilegeUtil.isFull(PermissionCode.BASIC_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege());
}
function isSenior() {
	return privilegeUtil.isFull(PermissionCode.SENIOR_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege());
}

let ntLocation;

export default class DataAnalysis extends Component {

	static contextTypes = {
		hierarchyId: PropTypes.string
	};

	componentWillMount() {
		this._loadInitData(this.props, this.context);
		this.props.router.setRouteLeaveHook(
			this.props.route, 
			this.routerWillLeave
		);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if( !util.shallowEqual(nextContext.hierarchyId, this.context.hierarchyId) ) {
			// this._getInitialState(nextProps);
			this._loadInitData(nextProps, nextContext);
		}/* else if(!this._getHierarchyId(nextContext)) {
			this._onPreActopn();
		}*/
	}

	_loadInitData(props, context) {

	}

	routerWillLeave(nextLocation) {
		ntLocation = nextLocation;
		return false;
	}

	render() {
		return (
			<div>
				123
			</div>
		);
	}
}
