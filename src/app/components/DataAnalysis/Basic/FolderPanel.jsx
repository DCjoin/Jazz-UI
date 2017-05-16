import React, { Component } from 'react';
import Immutable from 'immutable';
import { IconMenu, IconButton, MenuItem, FontIcon } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { nodeType } from 'constants/TreeConstants.jsx';
import { MenuAction } from 'constants/AnalysisConstants.jsx';

import {GenerateSolutionButton} from './GenerateSolution.jsx';

import ViewableTextField from 'controls/ViewableTextField.jsx';

function isFolder(node) {
	return node.get('Type') === nodeType.Folder;
}
function isBase(node) {
	return node.get('Id') === -1;
}

function getChildrenWithoutRawData(node) {
	if( node && node.get('Children') ) {
		return node.get('Children').map(getChildrenWithoutRawData).filter(child => child && child.get('ChartType') !== 5)
	}
	if( node.get('ChartType') ) {
		return node;
	}
	return null;
}
function flat(node, coll = []) {
	if( node && node.get('Children') ) {
		node.get('Children').map(function(child) {
			flat(child, coll)
		})
	}
	if( node.get('ChartType') && node.get('ChartType') !== 5 ) {
		coll.push(node);
	}
	return coll;
}

export default class FolderPanel extends Component {
	constructor(props) {
		super(props);
		this._renderChildrenItem = this._renderChildrenItem.bind(this);
		this._onMenuSelect = this._onMenuSelect.bind(this);
		this.state = {
			isViewName: true
		};
	}
	componentWillReceiveProps() {
		this.setState({
			isViewName: true
		});
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
	            {!isFolder(node) && <MenuItem key={MenuAction.Export} primaryText={I18N.Folder.Detail.WidgetMenu.Menu4} style={menuStyle}/>}
	            <MenuItem key={MenuAction.Share} primaryText={I18N.Folder.Detail.WidgetMenu.Menu6} style={menuStyle}/>
	            <MenuItem key={MenuAction.Delete} primaryText={I18N.Folder.Detail.Title.Menu3} style={menuStyle}/>
	        </IconMenu>);
	}
	_renderHeader() {
		let {node} = this.props,
		action = null;

		if(!isBase(node)) {
			let iconStyle = {
				fontSize: '12px',
				color: '#464949',
			},
		    iconMenuProps = {
				iconButtonElement: (<IconButton iconClassName='icon-more' style={{fontSize: '18px'}}/>),
				anchorOrigin:{horizontal: 'left', vertical: 'top'},
				targetOrigin:{horizontal: 'left', vertical: 'top'},
				onItemTouchTap: this._onMenuSelect(node)
		    };
			action = (<div>
				{this.props.isBuilding && <GenerateSolutionButton onOpen={this.props.onOpenGenerateSolution} nodes={flat(node)} disabled={flat(node).length===0}/>}
				{this._renderMenu(node, iconMenuProps)}
			</div>)
		}
		return (
			<div className='jazz-analysis-folder-panel-header'>
				<div>
				<ViewableTextField 
					isViewStatus={this.state.isViewName}
					style={{width: 'auto'}}
					defaultValue={node.get('Name')}
					didBlur={(val) => {
						if(val !== node.get('Name')) {
							this.props.modifyFolderName(val)
						}
						this.setState({
							isViewName: true
						});
					}}
				/>
				{!isBase(node) && this.state.isViewName && 
				<IconButton iconClassName='icon-edit' onClick={() => {
					this.setState({
						isViewName: false
					});
				}}/>}
				</div>
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
		if ( isFolder(nodeData) ) {
			return (<em className='icon-folder1' style={{
					fontSize: '50px',
					color: '#fdbb00'
				}}/>);
		} else {
			return (<em className='icon-chart1' style={{
					fontSize: '50px',
					color: '#32ad3d'
				}}/>);
		}
	}
	_renderChildrenItem(child) {
		let iconStyle = {
			fontSize: '12px',
			color: '#464949'
		},
	    iconMenuProps = {
			iconButtonElement: (
				<button style={{
					backgroundColor: 'transparent',
					border: 10,
				}}>
					<FontIcon className='icon-more' style={{fontSize: '26px'}}/>
				</button>),
			anchorOrigin:{horizontal: 'left', vertical: 'top'},
			targetOrigin:{horizontal: 'left', vertical: 'top'},
			onItemTouchTap: this._onMenuSelect(child)
	    };
		return (<li className='jazz-folder-detail-item'>
	        <div className='title' title={child.get('Name')} style={{
	        	backgroundColor: '#f7f7f7'
	        }}>
	          <div className='name'>
	            {child.get('Name')}
	          </div>
	          {this._renderMenu(child, iconMenuProps)}
	        </div>
	        <div className='icon flex-center' onClick={() => {
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
