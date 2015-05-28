'use strict';

import React from 'react';

import AlarmHierarchyItem from './AlarmHierarchyItem.jsx';
import AlarmStore from '../../stores/AlarmStore.jsx';

let AlarmList = React.createClass({
	getInitialState(){
		return {hierarchies:null, loadingStatus: false};
	},
	_onChange(){
		this.setState({
			hierarchies:AlarmStore.getHierarchyList(),
			loadingStatus:false
			});
	},
	componentDidMount: function() {
		AlarmStore.addAlarmlistChangeListener(this._onChange);
	},
	render: function() {
		let displayedDom = null;
		if(this.state.loadingStatus){
			displayedDom = (<div style={{margin:'auto',width:'95px'}}>loading</div>);
		}else{
			let hierarchies = this.state.hierarchies;
			let hierarchyItems = null;

			if(hierarchies && hierarchies.length > 0){
				hierarchyItems = hierarchies.map(function(hierarchy) {
					let props = {
						hierarchy:hierarchy
					};
					return (
						<AlarmHierarchyItem  {...props}/>
					);
				});
			}
			displayedDom = hierarchyItems;
		}

		return (
			<div className='jazz-alarm-grid-body'>

					{displayedDom}

			</div>
		);
	}
});

module.exports = AlarmList;
