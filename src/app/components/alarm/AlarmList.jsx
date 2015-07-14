'use strict';

import React from 'react';

import AlarmHierarchyItem from './AlarmHierarchyItem.jsx';
import AlarmStore from '../../stores/AlarmStore.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import AlarmTagAction from '../../actions/AlarmTagAction.jsx';

let AlarmList = React.createClass({
	getInitialState(){
		return { hierarchies: null,
						 dateValue: null,
						 step: null,
						 loadingStatus: false};
	},
	_onChange(){
		this.setState({
			hierarchies:AlarmStore.getHierarchyList(),
			loadingStatus:false
			});
	},
	onTagItemClick(tagOption){
		let date = this.state.dateValue,
				step = this.state.step;

		AlarmTagAction.clearSearchTagList();
		AlarmTagAction.addSearchTagList(tagOption[0]);

		AlarmAction.getAlarmTagData(date, step, tagOption);

		this.setState({selectedTag: tagOption[0] });
	},
	render: function() {
		let displayedDom = null;
		if(this.state.loadingStatus){
			displayedDom = (<div style={{margin:'auto',width:'95px'}}>loading</div>);
		}else{
			let hierarchies = this.state.hierarchies;
			let hierarchyItems = null;

			if(hierarchies && hierarchies.length > 0){
				hierarchyItems = hierarchies.map( hierarchy => {
					let props = {
						hierarchy:hierarchy,
						onTagItemClick: this.onTagItemClick,
						selectedTag: this.state.selectedTag
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
	},
	componentDidMount: function() {
		AlarmStore.addAlarmlistChangeListener(this._onChange);
	},
	componentWillUnmount(){
		AlarmStore.removeAlarmlistChangeListener(this._onChange);
	}
});

module.exports = AlarmList;
