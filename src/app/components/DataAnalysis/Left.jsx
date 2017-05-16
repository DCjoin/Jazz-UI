import React, { Component } from 'react';
import { CircularProgress, FlatButton, FontIcon, IconButton, IconMenu, MenuItem } from 'material-ui';
import classnames from 'classnames';

import { treeSource } from 'constants/TreeSource.jsx';
import { nodeType } from 'constants/TreeConstants.jsx';

import DropdownButton from 'controls/DropdownButton.jsx';
import Tree from 'controls/tree/Tree.jsx';

import NodeContent from './TreeNodeContent.jsx';
import SearchBox from './TreeSearchBox.jsx';

import FolderAction from 'actions/FolderAction.jsx';
import FolderStore from 'stores/FolderStore.jsx';

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
		this.props.createWidgetOrFolder(I18N.Folder.NewWidgetDataAnalysis, nodeType.Widget);
	}
	_onNewFolder() {
		this.props.createWidgetOrFolder(I18N.Folder.NewFolder, nodeType.Folder);
	}
	_onGragulaNode(targetId, sourceId, pre, collapsedNodeId) {
	    let targetNode = FolderStore.getNodeById(parseInt(targetId));
	    let sourceNode = FolderStore.getNodeById(parseInt(sourceId));
	    let parentNode = FolderStore.getParent(targetNode);
	    let isPre = pre;
	    let collapsedId = collapsedNodeId;

	    let {selectedNode} = this.props;
	    if( parentNode.get('Path').indexOf(sourceNode.get('Path')) === 0 ) {
	    	FolderAction.dropError(sourceNode);
	    	this.refs.foldertree && this.refs.foldertree._forceUpdate();
	    	return;
	    }
	    if( isWidget(selectedNode) ) {
	    	FolderAction.checkWidgetUpdate((needDelete) => {
	    		if( needDelete ) {
	    			FolderAction.alwaysUncheckSameWidget();
	    			FolderAction.deleteItem(selectedNode, true);
	    			this.refs.foldertree && this.refs.foldertree._forceUpdate();
	    		} else {
	    			this.props.didDrag(targetNode, sourceNode, parentNode, isPre, collapsedId)
	    		}
	    	}, () => {
	    		this.refs.foldertree && this.refs.foldertree._forceUpdate();
	    	});
	    } else {
	    	this.props.didDrag(targetNode, sourceNode, parentNode, isPre, collapsedId)
	    }
	}
	_generateNodeConent(nodeData, panel) {
		return (<NodeContent nodeData={nodeData}
			selectedNode={this.props.selectedNode}
			panel={panel}
		/>);
	}
	_renderTree() {
	    var treeProps = {
	        ref: 'foldertree',
	        key: 'foldertree',
	        collapsedLevel: 0,
	        allNode: this.props.tree,
	        allHasCheckBox: false,
	        allDisabled: false,
	        generateNodeConent: this._generateNodeConent,
	        onSelectNode: this.props.onSelectNode,
	        selectedNode: this.props.selectedNode,
	        onGragulaNode: this._onGragulaNode,
	        arrowClass: 'jazz-new-foldertree-arrow',
	        arrowIconCollapsedClass: 'icon-arrow-fold',
	        arrowIconExpandClass: 'icon-arrow-unfold',
	        treeNodeClass: 'jazz-new-foldertree-node',
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
		disabledButton = isWidget(this.props.selectedNode),
		buttonStyle = {
			height: 32,
			lineHeight: '32px',
		};

		if( !disabledButton ) {
			buttonStyle.color = '#626469';
		}

    return (
      <div className='jazz-new-folder-leftpanel-container'>
        <div className='jazz-new-folder-leftpanel-header'>
          <FlatButton 
          	disabled={disabledButton} 
          	onClick={this._onNewFolder} 
          	style={buttonStyle}
          	icon={<FontIcon className='icon-add' style={{fontSize: 16}}/>}
          	label={I18N.Folder.FolderName}
          />
				  <svg style={{width: 1, height: 32}}>
				    <line x1='0' y1='0' x2='0' y2='32' style={{
				    	stroke: '#e6e6e6',
				    	strokeWidth: 1
				    }}/>
				  </svg>
          <FlatButton 
          	disabled={disabledButton} 
          	onClick={this._onNewWidget} 
          	style={buttonStyle}
          	icon={<FontIcon className='icon-add' style={{fontSize: 16}}/>}
          	label={I18N.Folder.DataAnalysisWidget}
          />
        </div>
				<SearchBox onSearchClick={this.props.onSelectNode}/>

        <div className="jazz-new-folder-leftpanel-foldertree">
          {this._renderTree()}
        </div>

      </div>
    );
	}
}
