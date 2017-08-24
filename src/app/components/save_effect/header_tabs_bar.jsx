import React, { Component, PropTypes } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import classNames from 'classnames';

import RoutePath from 'util/RoutePath.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';

function isRouteActive(){

}

function HeaderTabs({isCustomer, isOverview, onActive,context,param}) {
	let secondTabProps = {
		label: I18N.SaveEffect.ListLabel,
		path:RoutePath.saveEffect.list,
		basePath:RoutePath.saveEffect.listBase,
	};
	if( isCustomer ) {
		secondTabProps.label = I18N.SaveEffect.BestLabel;
			secondTabProps.path=RoutePath.saveEffect.best;
			secondTabProps.basePath=RoutePath.saveEffect.best;
		return null;
	}
	return (
		<div>
			<div className={classNames({
					"tab":true,
					'active':context.isActive(RoutePath.saveEffect.overview(param))
				})} onClick={() => {
				onActive(RoutePath.saveEffect.overview);
			}}>{I18N.SaveEffect.OverviewLabel}</div>
		<div className={classNames({
				"tab":true,
				'active':context.isActive(secondTabProps.basePath(param))
			})} onClick={() => {
			onActive(secondTabProps.path);
		}}>{secondTabProps.label}</div>
		</div>
	);
}

export default class HeaderTabsBar extends Component {

	static contextTypes = {
    router: React.PropTypes.object,
    currentRoute: React.PropTypes.object,
  };

	render() {
		return (
			<header className="header">
					<HeaderTabs {...this.props} context={this.context.router} param={this.context.currentRoute.params}/>
			</header>
		);
	}
}

HeaderTabsBar.PropTypes = {
	isCustomer: PropTypes.bool.isRequired,
	isOverview: PropTypes.bool.isRequired,
	onActive: PropTypes.func.isRequired,
	// disabledButton: PropTypes.bool.isRequired,
	// onCreateSaveRatio: PropTypes.func.isRequired,
}
