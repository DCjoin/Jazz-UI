import React, { Component } from 'react';
import { IconMenu, IconButton, MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { nodeType } from 'constants/TreeConstants.jsx';
import { MenuAction } from 'constants/AnalysisConstants.jsx';

function isFolder(node) {
	return node.get('Type') === nodeType.Folder;
}
function isBase(node) {
	return node.get('Id') === -1;
}

export default class FolderPanel extends Component {
	constructor(props) {
		super(props);
		this._renderChildrenItem = this._renderChildrenItem.bind(this);
		this._onMenuSelect = this._onMenuSelect.bind(this);
	}
	_onMenuSelect(node) {
		return (e, item) => {
			this.props.onOperationSelect(item.key, node);
		}
	}
	_renderMenu(node, iconMenuProps) {
		let menuStyle = {
			fontSize: '14px',
			lineHeight: '32px'
		};
      	return (
      		<IconMenu {...iconMenuProps}>
	            <MenuItem key={MenuAction.Copy} primaryText={I18N.Folder.Detail.Title.Menu1} style={menuStyle}/>
	            {!isFolder(node) && <MenuItem key={MenuAction.Export} primaryText={I18N.Folder.Detail.WidgetMenu.Menu4} style={menuStyle}/>}
	            <MenuItem key={MenuAction.Send} primaryText={I18N.Folder.Detail.Title.Menu2} style={menuStyle}/>
	            <MenuItem key={MenuAction.Delete} primaryText={I18N.Folder.Detail.Title.Menu3} style={menuStyle}/>
	        </IconMenu>);
	}
	_renderHeader() {
		let {node} = this.props,
		action = null;
		if(true) {
			let iconStyle = {
				fontSize: '12px',
				color: '#464949',
			},
		    iconMenuProps = {
				iconButtonElement: (<IconButton iconStyle={iconStyle}><MoreVertIcon /></IconButton>),
				anchorOrigin:{horizontal: 'left', vertical: 'top'},
				targetOrigin:{horizontal: 'left', vertical: 'top'},
				onItemTouchTap: this._onMenuSelect(node)
		    };
			action = (<div>
				{!isBase(node) && this._renderMenu(node, iconMenuProps)}
			</div>)
		}
		return (
			<div className='jazz-analysis-folder-panel-header'>
				{node.get('Name')}
				{action}
			</div>);
	}
	_renderContent() {
		let {node} = this.props;
		if( !node.get('Children') || node.get('Children').size === 0 ) {
			return (<div className="content flex-center"><b>{I18N.Folder.EmptyFolder}</b></div>);
		}
		return (<ul className='jazz-analysis-folder-panel-content'>{node.get('Children').map(this._renderChildrenItem).toJS()}</ul>);
	}
	_renderImage(nodeData) {
		let image;
		if ( isFolder(nodeData) ) {
			image = <img src={require('../../../less/images/folder.png')}/>
		} else {
			switch (nodeData.get('ChartType')) {
				case 1:
					image = <img src={require('../../../less/images/line.png')}/>;
					break;
				case 2:
				case 3:
					image = <img src={require('../../../less/images/column.png')}/>;
					break;
				case 4:
					image = <img src={require('../../../less/images/pie.png')}/>;
					break;
				case 5:
					image = <img src={require('../../../less/images/raw-data.png')}/>;
					break;
				case 'Column':
					image = <img src={require('../../../less/images/labeling.png')}/>;
					break;
			}
		}
		return image
	}
	_renderChildrenItem(child) {
		let iconStyle = {
			fontSize: '12px',
			color: '#464949'
		},
	    iconMenuProps = {
			iconButtonElement: (<IconButton iconStyle={iconStyle}><MoreVertIcon /></IconButton>),
			anchorOrigin:{horizontal: 'left', vertical: 'top'},
			targetOrigin:{horizontal: 'left', vertical: 'top'},
			onItemTouchTap: this._onMenuSelect(child)
	    };
		return (<li className='jazz-folder-detail-item'>		
	        <div className='title' title={child.get('Name')}>
	          <div className='name'>
	            {child.get('Name')}
	          </div>
	          <div className='select'>
	              {this._renderMenu(child, iconMenuProps)}
	          </div>
	        </div>
	        <div className='icon' onClick={() => {
	        	this.props.onSelectNode(child);
	        }}>
	        {this._renderImage(child)}
	        </div>
		</li>)
	}
	render() {
		return (
			<div className='jazz-analysis-folder-panel'>
				{this._renderHeader()}
				{this._renderContent()}
			</div>
		);
	}
}
