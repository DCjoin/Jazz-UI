'use strict';

import React from 'react';
import classNames from 'classnames';
import AlarmTagItem from './AlarmTagItem.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import {nodeType} from '../../constants/TreeConstants.jsx';


let AlarmHierarchyItem = React.createClass({
	_onHierarchyItemSelected(){
		this.setState({
			extended: !this.state.extended
	    });

	},
	_onTagItemSelected(tagOption){
		if(this.props.onTagItemClick){
			this.props.onTagItemClick(tagOption);
		}
	},
	getInitialState: function() {
    return {
			extended: true
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
					hierarchyName: tag.HierName,
					uomId: tag.UomId,
					extended: me.state.extended,
					onTagItemClick: me._onTagItemSelected,
					selectedTag: me.props.selectedTag
				};
				return (
	  				<AlarmTagItem {...props}></AlarmTagItem>
				);
			});
		}
		let tagCount = hierarchy.TagAlarmInfoDtos.length;
		if(tagCount > 99){
			tagCount= '99+';
		}

		var icon = (
				<div className="node-content-icon">
					<div className={classNames({
						"icon-customer"   : hierarchy == nodeType.Customer,
						"icon-orgnization": hierarchy == nodeType.Organization,
						"icon-site"       : hierarchy == nodeType.Site,
						"icon-building"   : hierarchy == nodeType.Building,
						"icon-room"       : hierarchy == nodeType.Room,
						"icon-panel"      : hierarchy == nodeType.Panel && isAsset,
						"icon-panel-box"  : hierarchy == nodeType.Panel && !isAsset,
						"icon-device"     : hierarchy == nodeType.Device && isAsset,
						"icon-device-box" : hierarchy == nodeType.Device && !isAsset,
					})}/>
				</div>
		);
		return (
      <div>
    			<div className={classNames({
						'jazz-alarm-grid-tr-title':true,
						})}>
						<span>{icon}</span>
    				<span>{hierarchy.HierName}</span>
						<span>
            	<span>{tagCount}</span>
						</span>
					</div>
          {tagItems}
      </div>
		);
	}
});

module.exports = AlarmHierarchyItem;
