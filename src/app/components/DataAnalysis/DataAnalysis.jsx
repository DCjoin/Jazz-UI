import React, { Component, PropTypes } from 'react';
import {Snackbar, CircularProgress} from 'material-ui';
import Immutable from 'immutable';

import { nodeType } from 'constants/TreeConstants.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import { MenuAction } from 'constants/AnalysisConstants.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import RoutePath from 'util/RoutePath.jsx';
import util from 'util/Util.jsx';

import Dialog from 'controls/Dialog.jsx';
// import FaltButton from 'controls/FaltButton.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';

import Left from './Left.jsx';
import FolderPanel from './Basic/FolderPanel.jsx';
import AnalysisPanel from './Basic/AnalysisPanel.jsx';

// import CopyView from '../folder/operationView/CopyView.jsx';
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
		this._onSelectedNodeChange = this._onSelectedNodeChange.bind(this);
		this._onModifyNameError = this._onModifyNameError.bind(this);
		this._onMoveItemError = this._onMoveItemError.bind(this);
		this._onSendStatusChange = this._onSendStatusChange.bind(this);
    this._onShareStatusChange = this._onShareStatusChange.bind(this);
    this._onDeleteNode = this._onDeleteNode.bind(this);

		this._onSelectNode = this._onSelectNode.bind(this);
		this._createFolderOrWidget = this._createFolderOrWidget.bind(this);
		this._onOperationSelect = this._onOperationSelect.bind(this);
		this._onDialogDismiss = this._onDialogDismiss.bind(this);

		FolderStore.addFolderTreeListener(this._onFolderTreeLoad);
		WidgetStore.addChangeListener(this._handleWidgetSelectChange);
		FolderStore.addCreateFolderOrWidgetListener(this._onSelectedNodeChange);
    FolderStore.addModifyNameErrorListener(this._onModifyNameError);
    FolderStore.addMoveItemErrorListener(this._onMoveItemError);
    FolderStore.addSendStatusListener(this._onSendStatusChange);
    FolderStore.addShareStatusListener(this._onShareStatusChange);
    FolderStore.addModifyNameSuccessListener(this._onSelectedNodeChange);
    FolderStore.addDeleteItemSuccessListener(this._onDeleteNode);

		this.state = this._getInitialState();

		this._loadInitData(this.props, this.context);
		
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if( !util.shallowEqual(nextContext.hierarchyId, this.context.hierarchyId) ) {
			this._getInitialState(nextProps);
			this._loadInitData(nextProps, nextContext);
		}
	}
	componentWillUnmount() {		
		FolderStore.removeFolderTreeListener(this._onFolderTreeLoad);
		WidgetStore.removeChangeListener(this._handleWidgetSelectChange);
		FolderStore.removeCreateFolderOrWidgetListener(this._onSelectedNodeChange);
		FolderStore.removeModifyNameErrorListener(this._onModifyNameError);
		FolderStore.removeMoveItemErrorListener(this._onMoveItemError);
		FolderStore.removeSendStatusListener(this._onSendStatusChange);
		FolderStore.removeShareStatusListener(this._onShareStatusChange);
    FolderStore.removeModifyNameSuccessListener(this._onSelectedNodeChange);
    FolderStore.removeDeleteItemSuccessListener(this._onDeleteNode);
	}

	_getInitialState() {
		return {
			treeLoading: false,
			selectedNode: null,
			widgetDto: null,
			errorText: null,
			dialogType: null,
			dialogData: null,
		};
	}

	_changeNodeId(nodeId) {
    if( nodeId !== this.props.params.nodeId ) {
		  this.props.router.push(RoutePath.dataAnalysis(this.props.params) + '/' + nodeId);
    }
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
		FolderAction.getFolderTreeByHierarchyId( this._getHierarchyId(context), true );
	}

	_onFolderTreeLoad() {
		let selectedNode = FolderStore.getNodeById(getNodeId(this.props));
		this.setState({
			treeLoading: false,
			selectedNode: selectedNode || FolderStore.getSelectedNode(),
      treeList: FolderStore.getFolderTree(),
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

	_onSelectedNodeChange() {
		// this._changeNodeId(FolderStore.getSelectedNode().get('Id'));
		// this.setState({
		// 	selectedNode: FolderStore.getSelectedNode()
		// });
		this._onSelectNode(FolderStore.getSelectedNode());
	}

  _onModifyNameError() {
    this.setState({
      errorText: FolderStore.GetModifyNameError(),
    });
  }
  _onMoveItemError() {
    this.setState({
      errorText: FolderStore.getMoveItemError(),
    });
  }
  _onSendStatusChange() {
    this.setState({
      errorText: FolderStore.getSendStatus()
    });
  }
  _onShareStatusChange() {
    this.setState({
      errorText: FolderStore.getShareStatus()
    });
  }

	_onSelectNode(node) {
		// this._changeNodeId(node.get('Id'));
    FolderAction.setSelectedNode(node);
    this.setState({
      selectedNode: node,
      treeList: FolderStore.getFolderTree(),
    }, () => {
			this._changeNodeId(node.get('Id'));
		});
		if( isWidget(node) ) {
			FolderAction.GetWidgetDtos([node.get('Id')], node);
		}
	}

  _onDeleteNode() {
    if( !FolderStore.getSelectedNode() || this.state.selectedNode.get('Id') === FolderStore.getSelectedNode().get('Id') ) {
      // this.forceUpdate();
      this.setState({
        treeList: FolderStore.getFolderTree(),
        selectedNode: FolderStore.getNodeById(getNodeId(this.props))
      });
    } else {
      this._onSelectedNodeChange()
    }
  }

	_createFolderOrWidget(formatStr, nodeType, widgetType) {
		let {selectedNode} = this.state;
		FolderAction.createWidgetOrFolder(
			selectedNode, 
			FolderStore.getDefaultName(formatStr, selectedNode, nodeType, true), 
			nodeType, 
			this.props.params.customerId, 
			widgetType,
			this._getHierarchyId(this.context), true);
	}

	_onOperationSelect(dialogType, dialogData = this.state.selectedNode) {
		this.setState({
			dialogType,
			dialogData,
		});
	}

	_onDialogDismiss() {
		this.setState({
			dialogType: null,
			dialogData: null,
		});
	}

	_setErrorText(errorText) {
		this.setState({
			errorText
		});
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
					onSelectNode={this._onSelectNode}
					onOperationSelect={this._onOperationSelect}/>);
			}
		}
		return (<div className='jazz-framework-right-fold' style={{
					backgroundColor: '#fff',
					marginTop: -16
				}}>{content}</div>);
	}

	_renderDialog() {
		let {dialogType, dialogData, selectedNode} = this.state,
		dialog;
		switch (dialogType) {
			// case MenuAction.Copy:
			// 	dialog = <CopyView isNew={true} onDismiss={this._onDialogDismiss} copyNode={dialogData}/>;
			// 	break;
			case MenuAction.Send:
				dialog = <SendView isNew={true} onDismiss={this._onDialogDismiss} sendNode={dialogData}/>;
				break;
			case MenuAction.Share:
				dialog = <ShareView isNew={true} onDismiss={this._onDialogDismiss} shareNode={dialogData}/>;
				break;
			case MenuAction.Delete:
				dialog = <DeleteView isLoadByWidget={selectedNode.get('Id') === dialogData.get('Id')} onDismiss={this._onDialogDismiss} deleteNode={dialogData}/>;
				break;
			case MenuAction.Export:
				dialog = <ExportView onDismiss={this._onDialogDismiss} params={{
					widgetId: dialogData.get('Id')
				}} path={'/Dashboard/ExportWidget'}/>;
				break;
			case MenuAction.SaveAs:
				dialog = <SaveAsView isNew={true} onDismiss={this._onDialogDismiss} saveAsNode={selectedNode} widgetDto={dialogData}/>;
				break;
		}
		return dialog;
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
					tree={this.state.treeList}
					selectedNode={this.state.selectedNode}
					onSelectNode={this._onSelectNode}
					createWidgetOrFolder={this._createFolderOrWidget}
					/>
				{this._renderContent()}
				{this._renderDialog()}
				<Snackbar ref='snackbar' open={!!this.state.errorText} onRequestClose={this._setErrorText.bind(this, null)} message={this.state.errorText}/>
			</div>
		);
	}
}
