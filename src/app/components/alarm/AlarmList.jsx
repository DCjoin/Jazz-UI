'use strict';

import React from 'react';

import AlarmHierarchyItem from './AlarmHierarchyItem.jsx';
import AlarmStore from '../../stores/AlarmStore.jsx';

let AlarmList = React.createClass({
	getInitialState(){
		return {hierarchies:null};
	},
	_onChange(){
		this.setState({hierarchies:AlarmStore.getHierarchyList()});
	},
	componentDidMount: function() {
		AlarmStore.addAlarmlistChangeListener(this._onChange);
	},
	render: function() {
		//var that = this;
		//var hierarchies = that.props.allHierarchies;
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

		return (
			<div className='jazz-alarm-grid-body'>

					{hierarchyItems}

			</div>
		);
	}
});

module.exports = AlarmList;
