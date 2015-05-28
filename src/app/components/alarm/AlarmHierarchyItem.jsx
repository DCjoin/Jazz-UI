'use strict';

import React from 'react';
import classNames from 'classnames';

let AlarmHierarchyItem = React.createClass({
	_onHierarchyItemSelected(){
		this.setState({
			extended: !this.state.extended
	    });

	},
	_onTagItemSelected(){

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
				return (
	  				<div className={classNames(
										{
											'jazz-alarm-grid-tr-item':true,
											'jazz-alarm-grid-tr-item-extended': !!me.state.extended
										}
								)} onClick={me._onTagItemSelected}>{tag.TagName}</div>
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
