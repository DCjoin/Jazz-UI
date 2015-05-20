'use strict';

import React from 'react';

import AlarmHierarchyItem from './AlarmHierarchyItem.jsx';

let AlarmList = React.createClass({

	render: function() {
		//var that = this;
		//var hierarchies = that.props.allHierarchies;
    let hierarchies = [{Name:'hierarchy1',Tags:[{Name:'tag1'},{Name:'tag2'},{Name:'tag3'}]},
                       {Name:'hierarchy2',Tags:[{Name:'tag1'},{Name:'tag2'},{Name:'tag3'}]},
                       {Name:'hierarchy3',Tags:[{Name:'tag1'},{Name:'tag2'},{Name:'tag3'}]},
                       {Name:'hierarchy4',Tags:[{Name:'tag1'},{Name:'tag2'},{Name:'tag3'}]}];


		var hierarchyItems = hierarchies.map(function(hierarchy) {
			let props = {
        hierarchy:hierarchy
			};
			return (
				<AlarmHierarchyItem  {...props}/>
			);
		});

		return (
			<div>
				<ul>
					{hierarchyItems}
				</ul>
			</div>
		);
	}
});

module.exports = AlarmList;
