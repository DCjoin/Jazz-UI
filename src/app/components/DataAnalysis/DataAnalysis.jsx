import React, { Component, PropTypes } from 'react';

import PermissionCode from 'constants/PermissionCode.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';

import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';

import CurrentUserStore from 'stores/CurrentUserStore.jsx';

function isBasic() {
	return privilegeUtil.isFull(PermissionCode.BASIC_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege());
}
function isSenior() {
	return privilegeUtil.isFull(PermissionCode.SENIOR_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege());
}

export default class DataAnalysis extends Component {

	static contextTypes = {
		hierarchyId: PropTypes.string
	};

	componentWillMount() {
		this._loadInitData(this.props, this.context);
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

	render() {
		return (
			<div>
				123
			</div>
		);
	}
}
