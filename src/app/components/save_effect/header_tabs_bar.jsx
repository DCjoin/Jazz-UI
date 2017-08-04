import React, { Component, PropTypes } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import RoutePath from 'util/RoutePath.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';

function HeaderTabs({isCustomer, isOverview, onActive}) {
	let secondTabProps = {
		value: 1,
		label: I18N.SaveEffect.ListLabel,
		onActive: () => {
			onActive(RoutePath.saveEffect.list);
		},
	};
	if( isCustomer ) {
		secondTabProps.label = I18N.SaveEffect.BestLabel;
		secondTabProps.onActive = () => {
			onActive(RoutePath.saveEffect.best);
		};
	}
	return (
		<Tabs>
			<Tab label={I18N.SaveEffect.OverviewLabel} onActive={() => {
				onActive(RoutePath.saveEffect.overview);
			}}/>
			<Tab {...secondTabProps}/>
		</Tabs>
	);
} 

export default class HeaderTabsBar extends Component {

	render() {
		let {onCreateSaveRatio, disabledButton, ...other} = this.props;
		return (
			<header className='header'>
				<div style={{width: 400}}>
					<HeaderTabs {...other}/>
				</div>
				<NewFlatButton 
					secondary 
					label={'配置节能率'} 
					onClick={onCreateSaveRatio} 
					disabled={disabledButton}
				/>
			</header>
		);
	}
}

HeaderTabsBar.PropTypes = {
	isCustomer: PropTypes.bool.isRequired, 
	isOverview: PropTypes.bool.isRequired, 
	onActive: PropTypes.func.isRequired,
	disabledButton: PropTypes.bool.isRequired,
	onCreateSaveRatio: PropTypes.func.isRequired,
}