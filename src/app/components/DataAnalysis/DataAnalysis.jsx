import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Immutable from 'immutable';

import { nodeType } from 'constants/TreeConstants.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import RoutePath from 'util/RoutePath.jsx';
import util from 'util/Util.jsx';

import Dialog from 'controls/Dialog.jsx';
// import FaltButton from 'controls/FaltButton.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';

import Left from './Left.jsx';
import FolderPanel from './Basic/FolderPanel.jsx';
import AnalysisPanel from './Basic/AnalysisPanel.jsx';

import CopyView from '../folder/operationView/CopyView.jsx';
import DeleteView from '../folder/operationView/DeleteView.jsx';
import ShareView from '../folder/operationView/ShareView.jsx';
import SendView from '../folder/operationView/SendView.jsx';
import SaveAsView from '../folder/operationView/SaveAsView.jsx';
import ExportView from '../folder/operationView/ExportView.jsx';

import FolderAction from 'actions/FolderAction.jsx';

import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import FolderStore from 'stores/FolderStore.jsx';
import WidgetStore from 'stores/Energy/WidgetStore.jsx';

function isBasic() {
	return privilegeUtil.isFull(PermissionCode.BASIC_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege());
}
function isSenior() {
	return privilegeUtil.isFull(PermissionCode.SENIOR_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege());
}
function isWidget(node) {
	return node.get('Type') === nodeType.Widget;
}

// 保证最后一个请求结果为当前选中（有风险）
function widgetLoaded(selectedNode) {
	return !WidgetStore.getLoadingStatus() && WidgetStore.getWidgetDto() &&
			selectedNode.get('Id') === WidgetStore.getWidgetDto().Id
}

function getNodeId(props) {
	return +props.params.nodeId;
}

export default class DataAnalysis extends Component {

	static contextTypes = {
		hierarchyId: PropTypes.string
	};

	componentWillMount() {

		this._onFolderTreeLoad = this._onFolderTreeLoad.bind(this);
		this._handleWidgetSelectChange = this._handleWidgetSelectChange.bind(this);
		this._onCreateFolderOrWidgetChange = this._onCreateFolderOrWidgetChange.bind(this);

		this._onSelectNode = this._onSelectNode.bind(this);
		this._createFolderOrWidget = this._createFolderOrWidget.bind(this);
		this._onOperationSelect = this._onOperationSelect.bind(this);

		FolderStore.addFolderTreeListener(this._onFolderTreeLoad);
		WidgetStore.addChangeListener(this._handleWidgetSelectChange);
		FolderStore.addCreateFolderOrWidgetListener(this._onCreateFolderOrWidgetChange);

		this.setState({
			treeLoading: true
		});

		this._loadInitData(this.props, this.context);
		
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if( !util.shallowEqual(nextContext.hierarchyId, this.context.hierarchyId) ) {
			// this._getInitialState(nextProps);
			this._loadInitData(nextProps, nextContext);
		}/* else if(!this._getHierarchyId(nextContext)) {
			this._onPreActopn();
		}*/
	}
	componentWillUnmount() {		
		FolderStore.removeFolderTreeListener(this._onFolderTreeLoad);
		WidgetStore.removeChangeListener(this._handleWidgetSelectChange);
		FolderStore.removeCreateFolderOrWidgetListener(this._onCreateFolderOrWidgetChange);
	}

	_changeNodeId(nodeId) {
		this.props.router.push(RoutePath.dataAnalysis(this.props.params) + '/' + nodeId);
	}

	_getHierarchyId(context) {
		return context.hierarchyId;
	}
	_isCustomer() {
		return this._getHierarchyId(this.context) === +this.props.params.customerId;
	}

	_loadInitData(props, context) {
		this.setState({
			treeLoading: true
		});
		FolderAction.getFolderTreeByHierarchyId( this._getHierarchyId(context) );
	}

	_onFolderTreeLoad() {
		let selectedNode = FolderStore.getNodeById(getNodeId(this.props));
		this.setState({
			treeLoading: false,
			selectedNode: selectedNode || FolderStore.getSelectedNode()
		}, () => {
			if( !selectedNode ) {
				this._changeNodeId(FolderStore.getSelectedNode().get('Id'));
			}
		});
		if( selectedNode && isWidget(selectedNode) ) {
			FolderAction.GetWidgetDtos([selectedNode.get('Id')], selectedNode);
		}
		// this._changeNodeId(FolderStore.getSelectedNode().get('Id'));
	}

	_handleWidgetSelectChange() {
		if( widgetLoaded(this.state.selectedNode) ) {
			this.setState({
				widgetDto: Immutable.fromJS(WidgetStore.getWidgetDto())
			});
		}
	}


	_onCreateFolderOrWidgetChange() {
		// this._changeNodeId(FolderStore.getSelectedNode().get('Id'));
		// this.setState({
		// 	selectedNode: FolderStore.getSelectedNode()
		// });
		this._onSelectNode(FolderStore.getSelectedNode());
	}

	_onSelectNode(node) {
		// this._changeNodeId(node.get('Id'));
		this.setState({
			selectedNode: node
		}, () => {
			this._changeNodeId(node.get('Id'));
		});
		if( isWidget(node) ) {
			FolderAction.GetWidgetDtos([node.get('Id')], node);
		}
	}

	_createFolderOrWidget(formatStr, nodeType, widgetType) {
		let {selectedNode} = this.state;
		FolderAction.createWidgetOrFolder(
			selectedNode, 
			FolderStore.getDefaultName(formatStr, selectedNode, nodeType), 
			nodeType, 
			this.props.params.customerId, 
			widgetType,
			this._getHierarchyId(this.context), true);
	}

	_onOperationSelect(index, widgetDto) {
		console.log('另存为', idx, widgetDto);
	}

	_renderContent() {
		let {selectedNode} = this.state,
		content = (<div className="content flex-center">
					<CircularProgress  mode="indeterminate" size={80} />
				</div>);
		if( selectedNode ) {
			if( isWidget(selectedNode) ) {
				if( widgetLoaded(selectedNode) ) {
					content = (<AnalysisPanel 
								hierarchyId={this._getHierarchyId(this.context)}
								isBuilding={!this._isCustomer()}
								chartTitle={selectedNode.get('Name')}
								sourceUserName={selectedNode.get('SourceUserName')}
								onOperationSelect={this._onOperationSelect}
								widgetDto={this.state.widgetDto.toJS()} 
								IsNew={false}/>);
				}
			} else {
				content = (<FolderPanel 
					node={selectedNode}
					onSelectNode={this._onSelectNode}/>);
			}
		}
		return (<div className='jazz-framework-right-fold' style={{
					backgroundColor: '#fff',
					marginTop: -16
				}}>{content}</div>);
	}

	_renderTemplate() {
		let {selectedNode} = this.state,
		template;
		//for operation template
		// if (selectedNode) {
		if ( isWidget(selectedNode) ) {
			switch (this.state.templateId) {
				case 1:
					template = <CopyView onDismiss={this._onTemplateDismiss} copyNode={selectedNode}/>;
					break;
				case 2:
					template = <SendView onDismiss={this._onTemplateDismiss} sendNode={selectedNode}/>;
					break;
				case 3:
					template = <DeleteView onDismiss={this._onTemplateDismiss} deleteNode={selectedNode} isLoadByWidget={isDelete}/>;
			break;
		}
		// } else {
		// 	switch (this.state.templateId) {
		// 		case 1:
		// 			template = <CopyView onDismiss={this._onTemplateDismiss} copyNode={selectedNode}/>;
		// 			break;
		// 		case 2:
		// 			template = <SendView onDismiss={this._onTemplateDismiss} sendNode={selectedNode}/>;
		// 			break;
		// 		case 3:
		// 			template = <ShareView onDismiss={this._onTemplateDismiss} shareNode={selectedNode}/>;
		// 			break;
		// 		case 4:
		// 			let path = '/Dashboard/ExportWidget';
		// 			let params = {
		// 				widgetId: selectedNode.get('Id')
		// 			};
		// 			template = <ExportView onDismiss={this._onTemplateDismiss} params={params} path={path}/>;
		// 		//ExportChartAction.getTagsData4Export(params, path);

		// 			break;
		// 		case 5:
		// 			template = <DeleteView onDismiss={this._onTemplateDismiss} deleteNode={selectedNode} isLoadByWidget={false}/>;
		// 			break;
		// 		case 6:
		// 			template = <SaveAsView onDismiss={this._onTemplateDismiss} saveAsNode={selectedNode} widgetDto={this.state.templateWidgetDto}/>;
		// 			break;
		// 		case 7:
		// 			template = <DeleteView onDismiss={this._onTemplateDismiss} deleteNode={selectedNode} isLoadByWidget={true}/>;
		// 			break;
		// 		}
		// 	}
		// }
		return template;
	}

	render() {
		let {treeLoading} = this.state;
		if( treeLoading ) {
			return (<div className="content flex-center">
					<CircularProgress  mode="indeterminate" size={80} />
				</div>);
		}
		return (
			<div style={{display: 'flex', flex: 1}}>
				<Left 
					tree={FolderStore.getFolderTree()}
					selectedNode={this.state.selectedNode}
					onSelectNode={this._onSelectNode}
					createWidgetOrFolder={this._createFolderOrWidget}
					/>
				{this._renderContent()}
			</div>
		);
	}
}
