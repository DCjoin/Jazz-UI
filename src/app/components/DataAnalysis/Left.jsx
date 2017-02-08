import React, { Component } from 'react';
import { CircularProgress, FlatButton, FontIcon, IconButton, IconMenu, MenuItem } from 'material-ui';
import classnames from 'classnames';

import { treeSource } from 'constants/TreeSource.jsx';

import DropdownButton from 'controls/DropdownButton.jsx';
import Tree from 'controls/tree/Tree.jsx';

import NodeContent from '../folder/TreeNodeContent.jsx';
import SearchBox from '../folder/FolderSearchBox.jsx';

import { nodeType } from 'constants/TreeConstants.jsx';

function isWidget(node) {
	return node.get('Type') === nodeType.Widget;
}

export default class Left extends Component {
	componentWillMount() {
		this._onNewWidget = this._onNewWidget.bind(this);
		this._onNewFolder = this._onNewFolder.bind(this);
		this._onGragulaNode = this._onGragulaNode.bind(this);
		this._generateNodeConent = this._generateNodeConent.bind(this);
	}
	_onNewWidget() {
		this.props.createWidgetOrFolder(I18N.Folder.NewWidget.Menu1, nodeType.Widget);
	}
	_onNewFolder() {
		this.props.createWidgetOrFolder(I18N.Folder.NewFolder, nodeType.Folder);
	}
	_onGragulaNode() {
		console.log('_onGragulaNode');
	}
	_generateNodeConent(nodeData, panel) {
		return (<NodeContent nodeData={nodeData}
			selectedNode={this.props.selectedNode}
			panel={panel}
		/>);
	}
	_renderTree() {
	    var treeProps = {
	        key: 'foldertree',
	        collapsedLevel: 0,
	        allNode: this.props.tree,
	        allHasCheckBox: false,
	        allDisabled: false,
	        generateNodeConent: this._generateNodeConent,
	        onSelectNode: this.props.onSelectNode,
	        selectedNode: this.props.selectedNode,
	        onGragulaNode: this._onGragulaNode,
	        arrowClass: 'jazz-foldertree-arrow',
	        treeNodeClass: 'jazz-foldertree-node',
	        treeSource: treeSource.Energy
	     };
		return (<Tree {...treeProps}/>);
	}
	render() {

		let iconStyle = {
			top:'-10px',
			fontSize: '14px'
		},
		itemStyle = {
			fontSize: '14px',
			color: '#767a7a',
			paddingLeft: '44px'
		},
		buttonStyle = {
			backgroundColor: 'transparent',
			height: '32px'
		},
		disabledButton = isWidget(this.props.selectedNode);

	    return (
	      <div className="jazz-folder-leftpanel-container">
	        <div className="jazz-folder-leftpanel-header">
	          <div className={classnames('se-dropdownbutton btn-container', {
	          	'btn-container-active': !disabledButton
	          })}>
	            <FlatButton disabled={disabledButton} onClick={this._onNewFolder} style={buttonStyle}>
	              <FontIcon className="fa icon-add btn-icon"/>
	              <span className="mui-flat-button-label btn-text">{I18N.Folder.FolderName}</span>
	            </FlatButton>
	          </div>
	          <div className={classnames('se-dropdownbutton btn-container', {
	          	'btn-container-active': !disabledButton
	          })}>
	            <FlatButton disabled={disabledButton} onClick={this._onNewWidget} style={buttonStyle}>
	              <FontIcon className="fa icon-add btn-icon"/>
	              <span className="mui-flat-button-label btn-text">{I18N.Folder.DataAnalysisWidget}</span>
	            </FlatButton>
	          </div>
	        </div>

	        <div className="jazz-folder-leftpanel-search">
	          <SearchBox onSearchClick={this.props.onSelectNode}/>
	        </div>

	        <div className="jazz-folder-leftpanel-foldertree">
	          {this._renderTree()}
	        </div>

	      </div>
	    );
	}
}
