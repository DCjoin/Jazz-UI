'use strict';

import React from 'react';
import classNames from 'classnames';
import AlarmTagItem from './AlarmTagItem.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';

let AlarmHierarchyItem = React.createClass({
	_onHierarchyItemSelected(){
		this.setState({
			extended: !this.state.extended
	    });

	},
	_onTagItemSelected(hierId, tagId, hierName){
		if(this.props.onTagItemClick){
			this.props.onTagItemClick(hierId, tagId, hierName);
		}
	},
	getInitialState: function() {
    return {
			extended: false
    };
  },
	render() {
		let me = this;
		let hierarchy = this.props.hierarchy;
		let tagItems = null;
		if(me.state.extended){
			tagItems = hierarchy.TagAlarmInfoDtos.map(function(tag) {
				let props = {
					tagName: tag.TagName,
					tagId: tag.TagId,
					hierarchyId: tag.HierarchyId,
					hierarchyName: tag.HierarchyName,
					extended: me.state.extended,
					onTagItemClick: me._onTagItemSelected
				};
				return (
	  				<AlarmTagItem {...props}></AlarmTagItem>
				);
			});
		}

		return (
      <div>
    			<div className={classNames({
						'jazz-alarm-grid-tr-item':true,
						'jazz-alarm-grid-tr-item-extended': !!me.state.extended
						})} onClick={me._onHierarchyItemSelected}>
    				<span>{hierarchy.HierName}</span>
						<span>
            	<span>{hierarchy.TagAlarmInfoDtos.length}</span>
						</span>
					</div>
          {tagItems}
      </div>
		);
	}
});

module.exports = AlarmHierarchyItem;
