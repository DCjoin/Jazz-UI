import React, { Component } from 'react';
import { CircularProgress, FlatButton, FontIcon, IconButton, IconMenu, MenuItem } from 'material-ui';
import classnames from 'classnames';

import { treeSource } from 'constants/TreeSource.jsx';

import DropdownButton from 'controls/DropdownButton.jsx';
import Tree from 'controls/tree/Tree.jsx';

import NodeContent from '../folder/TreeNodeContent.jsx';
import SearchBox from '../folder/FolderSearchBox.jsx';

export default class Left extends Component {
	componentWillMount() {
		this._onNewWidget = this._onNewWidget.bind(this);
		this._onNewFolder = this._onNewFolder.bind(this);
		this._onGragulaNode = this._onGragulaNode.bind(this);
		this._generateNodeConent = this._generateNodeConent.bind(this);
	}
	_onNewWidget() {
		console.log('_onNewWidget');
	}
	_onNewFolder() {
		console.log('_onNewFolder');
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
		};

		let energyAnalysisIcon = <FontIcon className="icon-energy-analysis" style={iconStyle}/>,
			unitIndexIcon = <FontIcon className="icon-unit-index" style={iconStyle}/>,
			timeRationIcon = <FontIcon className="icon-dust-concentration" style={iconStyle}/>,
			labelingIcon = <FontIcon className="icon-labeling" style={iconStyle}/>,
			rankingIcon = <FontIcon className="icon-ranking" style={iconStyle}/>;
		let filterOptions = [
			<MenuItem key={1} value={1} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu1} leftIcon={energyAnalysisIcon}/>,
			<MenuItem key={2} value={2} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu2} leftIcon={unitIndexIcon}/>,
			<MenuItem key={3} value={3} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu3} leftIcon={timeRationIcon}/>,
			<MenuItem key={4} value={4} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu4} leftIcon={labelingIcon}/>,
			<MenuItem key={5} value={5} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu5} leftIcon={rankingIcon}/>
		];
      	let newWidgetProps = {
	        type: "Add",
	        text: I18N.Folder.DataAnalysisWidget,
	        menuItems: filterOptions,
	        onItemClick: this._onNewWidget,
	        disabled: true,
	        buttonIcon: 'icon-add'
      	};
	    return (
	      <div className="jazz-folder-leftpanel-container">
	        <div className="jazz-folder-leftpanel-header">
	          <div className={classnames('se-dropdownbutton btn-container', {
	          	'btn-container-active': false
	          })}>
	            <FlatButton disabled={true} onClick={this._onNewFolder} style={buttonStyle}>
	              <FontIcon className="fa icon-add btn-icon"/>
	              <span className="mui-flat-button-label btn-text">{I18N.Folder.FolderName}</span>
	            </FlatButton>
	          </div>
	          <DropdownButton {...newWidgetProps}/>
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
