'use strict';

import React from 'react';

let AlarmHierarchyItem = React.createClass({

	render() {
		let hierarchy = this.props.hierarchy;
    var tagItems = hierarchy.Tags.map(function(tag) {
			return (

  				<div>{tag.Name}</div>

			);
		});

		return (
      <div>
    			<div>
    				<span style={{display:'inline-block'}}>{hierarchy.Name}</span>
            <span style={{display:'inline-block',  'min-width':'25px', 'margin-left':'60px',border:'2px solid #a1a1a1','border-radius':'15px'}}>{hierarchy.Tags.length}</span>
    			</div>
          {tagItems}
      </div>
		);
	}
});

module.exports = AlarmHierarchyItem;
