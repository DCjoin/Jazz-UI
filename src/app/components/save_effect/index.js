import React, { Component, PropTypes } from 'react';

import RoutePath from 'util/RoutePath.jsx';

import Header from './header_tabs_bar.jsx';
import CreateSaveEffect from './create';

function checkPathMatch(targetPath, currentPath) {
	return currentPath.indexOf(targetPath) === 0;
}

function checkPathWithRouter(targetPathFunc) {
	return (router) => checkPathMatch(
		targetPathFunc(router.params),
		router.location.pathname
	);
}

let isOverview = checkPathWithRouter(RoutePath.saveEffect.overview);
let isList = checkPathWithRouter(RoutePath.saveEffect.list);
let isBest = checkPathWithRouter(RoutePath.saveEffect.best);

export default class SaveEffect extends Component {
	static contextTypes = {
		hierarchyId: PropTypes.string
	}

	render() {
		let { router, children } = this.props,
		needHeader = isOverview(router) || isList(router) || isBest(router),
		hierarchyId = this.context.hierarchyId * 1;
		return (
			<div className='jazz-save-effect'>
				{needHeader && <Header
					isCustomer={hierarchyId === router.params.customerId * 1}
					isOverview={isOverview(router)}
					onActive={(routeFunc) => {
						router.push(routeFunc(router.params))
					}}
					onCreateSaveRatio={() => {

					}}
					disabledButton={false}
				/>}
				{children}
			</div>
		);
	}
}
