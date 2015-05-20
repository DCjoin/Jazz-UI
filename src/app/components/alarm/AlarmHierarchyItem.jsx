'use strict';

import React from 'react';

let AlarmHierarchyItem = React.createClass({

	render() {
		let hierarchy = this.props.hierarchy;
		return (
			<div>
				<span style={{display:'inline-block'}}>{hierarchy.Name}</span>
        <span style={{display:'inline-block',  'min-width':'25px', 'margin-left':'60px',border:'2px solid #a1a1a1','border-radius':'15px'}}>{hierarchy.Tags.length}</span>
			</div>
		);
	}
});

module.exports = AlarmHierarchyItem;
