import React, { Component, PropTypes } from 'react';
import {Snackbar, CircularProgress} from 'material-ui';
import Immutable from 'immutable';

import { nodeType } from 'constants/TreeConstants.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import { MenuAction } from 'constants/AnalysisConstants.jsx';
import PrivilegeUtil from 'util/privilegeUtil.jsx';
import RoutePath from 'util/RoutePath.jsx';
import util from 'util/Util.jsx';

import Dialog from 'controls/Dialog.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';

import Left from './Left.jsx';
import FolderPanel from './Basic/FolderPanel.jsx';
import AnalysisPanel from './Basic/AnalysisPanel.jsx';
import AnalysisGenerateSolution from './Basic/AnalysisGenerateSolution.jsx';

// import CopyView from '../folder/operationView/CopyView.jsx';
import DeleteView from '../folder/operationView/DeleteView.jsx';
import SendView from './operationView/SendView.jsx';
import SaveAsView from '../folder/operationView/SaveAsView.jsx';
import ExportView from '../folder/operationView/ExportView.jsx';

import FolderAction from 'actions/FolderAction.jsx';
import UserAction from 'actions/UserAction.jsx';

import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import FolderStore from 'stores/FolderStore.jsx';
import WidgetStore from 'stores/Energy/WidgetStore.jsx';
import UserStore from 'stores/UserStore.jsx';

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

function SolutionFull() {
	return PrivilegeUtil.isFull(PermissionCode.SOLUTION_FULL, CurrentUserStore.getCurrentPrivilege());
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
    this._onMoveItemSuccess = this._onMoveItemSuccess.bind(this);
		this._onMoveItemError = this._onMoveItemError.bind(this);
		this._onSendStatusChange = this._onSendStatusChange.bind(this);
    this._onShareStatusChange = this._onShareStatusChange.bind(this);
    this._onDeleteNode = this._onDeleteNode.bind(this);
    this._onCopyItemSuccess = this._onCopyItemSuccess.bind(this);
    this._didDrag = this._didDrag.bind(this);
    this._modifyFolderName = this._modifyFolderName.bind(this);

		this._onSelectNode = this._onSelectNode.bind(this);
		this._createFolderOrWidget = this._createFolderOrWidget.bind(this);
		this._onOperationSelect = this._onOperationSelect.bind(this);
		this._onDialogDismiss = this._onDialogDismiss.bind(this);
		this._onOpenGenerateSolution = this._onOpenGenerateSolution.bind(this);
		this._onShowSolutionSnakBar = this._onShowSolutionSnakBar.bind(this);

		FolderStore.addFolderTreeListener(this._onFolderTreeLoad);
		WidgetStore.addChangeListener(this._handleWidgetSelectChange);
		FolderStore.addCreateFolderOrWidgetListener(this._onSelectedNodeChange);
    FolderStore.addModifyNameErrorListener(this._onModifyNameError);
    FolderStore.addMoveItemErrorListener(this._onMoveItemError);
    FolderStore.addSendStatusListener(this._onSendStatusChange);
    FolderStore.addShareStatusListener(this._onShareStatusChange);
    FolderStore.addModifyNameSuccessListener(this._onSelectedNodeChange);
    FolderStore.addDeleteItemSuccessListener(this._onDeleteNode);
    FolderStore.addMoveItemSuccessListener(this._onMoveItemSuccess);
    FolderStore.addModfiyReadingStatusListener(this._onSelectedNodeChange);
    FolderStore.addCopyItemSuccessListener(this._onCopyItemSuccess);
    FolderStore.addSelectedNodeListener(this._onSelectedNodeChange);
    FolderStore.addSolutionCreatedListener(this._onShowSolutionSnakBar);

		this.state = this._getInitialState();

    if(this._getHierarchyId(this.context)) {
		  this._loadInitData(this.props, this.context);
    }

	}

	componentWillReceiveProps(nextProps, nextContext) {
		if( !util.shallowEqual(nextContext.hierarchyId, this.context.hierarchyId) ) {
			this.setState(this._getInitialState(nextProps));
			this._loadInitData(nextProps, nextContext);
      if( this.context.hierarchyId ) {
        nextProps.router.push(RoutePath.dataAnalysis(nextProps.params));
      }
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
    FolderStore.removeMoveItemSuccessListener(this._onMoveItemSuccess);
    FolderStore.removeModfiyReadingStatusListener(this._onSelectedNodeChange);
    FolderStore.removeCopyItemSuccessListener(this._onCopyItemSuccess);
    FolderStore.removeSelectedNodeListener(this._onSelectedNodeChange);
    FolderStore.removeSolutionCreatedListener(this._onShowSolutionSnakBar);
	}

	_getInitialState() {
		return {
			treeLoading: false,
			selectedNode: null,
			widgetDto: null,
			errorText: null,
			dialogType: null,
			dialogData: null,
			generateSolutionDialogObj: null,
		};
	}

	_changeNodeId(nodeId) {
    if( nodeId !== getNodeId(this.props) ) {
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
    UserAction.getUsersByPrivilegeItem(CurrentUserStore.getCurrentUser().Id, this._getHierarchyId(context));
		FolderAction.getFolderTreeByHierarchyId( this._getHierarchyId(context), true );
	}

	_onFolderTreeLoad() {
		let selectedNode = FolderStore.getNodeById(getNodeId(this.props));
    this._onSelectNode(selectedNode || FolderStore.getSelectedNode());
	}

	_handleWidgetSelectChange() {
		if( widgetLoaded(this.state.selectedNode) ) {
			this.setState({
				widgetDto: Immutable.fromJS(WidgetStore.getWidgetDto())
			});
		}
	}

	_onSelectedNodeChange() {
    if( !Immutable.is(this.state.selectedNode, FolderStore.getSelectedNode()) ) {
  		this._onSelectNode(FolderStore.getSelectedNode());
    }
	}

  _onModifyNameError() {
    this.setState({
      errorText: FolderStore.GetModifyNameError(),
    });
  }
  _onMoveItemSuccess() {
    this._loadInitData(this.props, this.context);
    this._onSelectedNodeChange();
  }
  _onMoveItemError() {
    this._loadInitData(this.props, this.context);
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
  _onShowSolutionSnakBar() {
    this.setState({
      showSolutionTip: true
    });
  }

	_onSelectNode(node) {
    let {widgetDto, selectedNode} = this.state;
    let callback = (widgetIsInit) => {
      if( widgetIsInit ) {
        FolderAction.deleteItem(selectedNode, selectedNode.get('Id') === node.get('Id'));
        if( selectedNode.get('Id') === node.get('Id') ) {
          FolderAction.alwaysUncheckSameWidget();
          return;
          //node = FolderStore.getSelectedNode();
        }
      }
      FolderAction.setSelectedNode(node);
      if( node ) {
        if( isWidget(node) ) {
          FolderAction.GetWidgetDtos([node.get('Id')], node, true);
        }
        if (node.get('IsSenderCopy') && !node.get('IsRead')) {
          FolderAction.modifyFolderReadStatus(node);
        }
      }
      this.setState({
        treeLoading: false,
        selectedNode: node,
        widgetDto: null,
        treeList: FolderStore.getFolderTree(),
      }, () => {
        this._changeNodeId(node.get('Id'));
      });
    };
    if( selectedNode && isWidget(selectedNode) ) {
      FolderAction.checkWidgetUpdate(callback);
    } else {
      callback();
    }
	}

  _onDeleteNode() {
    if( !FolderStore.getSelectedNode() || this.state.selectedNode.get('Id') === FolderStore.getSelectedNode().get('Id') ) {
      this.setState({
        treeList: FolderStore.getFolderTree(),
        selectedNode: FolderStore.getNodeById(getNodeId(this.props))
      });
    } else {
      this._onSelectedNodeChange();
    }
  }

  _onCopyItemSuccess() {
    // FolderAction.alwaysUncheckSameWidget();
    this._onSelectedNodeChange();
  }

	_modifyFolderName(newName) {
		FolderAction.modifyFolderName(this.state.selectedNode, newName);
	}

  _didDrag(targetNode, sourceNode, parentNode, isPre, collapsedId) {
    if (collapsedId) {
      let node = FolderStore.getNodeById(collapsedId);
      if (node.get('HasChildren')) {
        let nextNode = node.get('Children').getIn([0]);
        FolderAction.moveItem(sourceNode.toJSON(), node.toJS(), null, nextNode.toJS())
      } else {
        FolderAction.moveItem(sourceNode.toJSON(), node.toJS(), null, null)
      }
    } else {
      if (isPre) {
        FolderAction.moveItem(sourceNode.toJSON(), parentNode.toJSON(), targetNode.toJSON(), null)
      } else {
        FolderAction.moveItem(sourceNode.toJSON(), parentNode.toJSON(), null, targetNode.toJSON())
      }
    }
  }

	_createFolderOrWidget(formatStr, nodeType, widgetType) {
		let {selectedNode} = this.state;
		FolderAction.createWidgetOrFolder(
			selectedNode,
			FolderStore.getDefaultName(formatStr, selectedNode, nodeType, true),
			nodeType,
			this.props.params.customerId*1,
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

	_onOpenGenerateSolution(data) {
		this.setState({
			generateSolutionDialogObj: {...{
				open: true
			}, ...data}
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
				if( widgetLoaded(selectedNode) && this.state.widgetDto ) {
          content = React.cloneElement(this.props.children, {
          	selectedNode,
            hierarchyId: this._getHierarchyId(this.context),
            isBuilding: !this._isCustomer(),
            chartTitle: selectedNode.get('Name'),
            sourceUserName: selectedNode.get('SourceUserName'),
            onOperationSelect: this._onOperationSelect,
            widgetDto: this.state.widgetDto.toJS(),
            isNew: !this.state.widgetDto.get('ChartType'),
			onOpenGenerateSolution: this._onOpenGenerateSolution,
			modifyFolderName: this._modifyFolderName,
          });
				}
			} else {
				content = (<FolderPanel
					modifyFolderName={this._modifyFolderName}
            		isBuilding={!this._isCustomer()}
					onOpenGenerateSolution={this._onOpenGenerateSolution}
					node={selectedNode}
					onSelectNode={this._onSelectNode}
					onOperationSelect={this._onOperationSelect}/>);
			}
		}
		return <div className='jazz-new-folder-rightpanel'>{content}</div>;
	}

	_renderDialog() {
		let {generateSolutionDialogObj, dialogType, dialogData, selectedNode} = this.state,
		dialog;
		switch (dialogType) {
			// case MenuAction.Copy:
			// 	dialog = <CopyView isNew={true} onDismiss={this._onDialogDismiss} copyNode={dialogData}/>;
			// 	break;
			case MenuAction.Share:
				let _isWidget = isWidget(dialogData),
				_type = _isWidget ? I18N.Folder.WidgetName : I18N.Folder.FolderName,
				_userId = dialogData.get('UserId'),
				_getNode = _isWidget && dialogData.get('Id') === selectedNode.get('Id') ? FolderStore.getSelectedNode : null;

				dialog = <SendView 
									onSendItem={() => {
										this._onDialogDismiss();
										FolderAction.sendFolderCopy(_getNode ? _getNode() : dialogData, UserStore.getUserIds(), true);
									}}
									onDismiss={this._onDialogDismiss} 
          				type={_type}
          				userId={_userId}
          				/>;
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
		if(generateSolutionDialogObj && generateSolutionDialogObj.open) {
			let {open, preAction, nodes} = generateSolutionDialogObj;
			if(open) {
				dialog = (<AnalysisGenerateSolution
					nodes={nodes}
					preAction={preAction}
					onRequestClose={() => {
						this.setState({generateSolutionDialogObj: null});
					}}/>);
			}
		}
		return dialog;
	}

	render() {
		let {treeLoading, selectedNode} = this.state;
		if( treeLoading || !selectedNode ) {
			return (<div className="content flex-center">
					<CircularProgress  mode="indeterminate" size={80} />
				</div>);
		}
		return (
			<div style={{display: 'flex', flex: 1}}>
				<Left
					tree={this.state.treeList}
					selectedNode={this.state.selectedNode}
					onSelectNode={(node) => {
						if(node.get('Id') !== this.state.selectedNode.get('Id')) {
							this._onSelectNode(node);
						}
					}}
					createWidgetOrFolder={this._createFolderOrWidget}
          didDrag={this._didDrag}
					/>
				{this._renderContent()}
				{this._renderDialog()}
				<Snackbar ref='snackbar' open={!!this.state.errorText} onRequestClose={this._setErrorText.bind(this, null)} message={this.state.errorText}/>
				<Snackbar ref='snackbar'
					open={this.state.showSolutionTip}
					onRequestClose={() => {
						this.setState({showSolutionTip: false})
					}}
					message={SolutionFull() ? I18N.Setting.DataAnalysis.SaveScheme.FullTip : I18N.Setting.DataAnalysis.SaveScheme.PushTip}
					action={I18N.Setting.DataAnalysis.SaveScheme.TipAction}
					onActionTouchTap={() => {
						util.openTab(RoutePath.ecm(this.props.params)+'?init_hierarchy_id='+this.context.hierarchyId);
					}}
				/>
			</div>
		);
	}
}
