import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Immutable from 'immutable';

import { nodeType } from 'constants/TreeConstants.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import util from 'util/Util.jsx';

import Dialog from 'controls/Dialog.jsx';
// import FaltButton from 'controls/FaltButton.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';

import Left from './Left.jsx';
import FolderPanel from './Basic/FolderPanel.jsx';
import AnalysisPanel from './Basic/AnalysisPanel.jsx';

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

let ntLocation;

export default class DataAnalysis extends Component {

	static contextTypes = {
		hierarchyId: PropTypes.string
	};

	componentWillMount() {

		this._onFolderTreeLoad = this._onFolderTreeLoad.bind(this);
		this._handleWidgetSelectChange = this._handleWidgetSelectChange.bind(this);
		this._onSelectNode = this._onSelectNode.bind(this);
		this._onOperationSelect = this._onOperationSelect.bind(this);

		FolderStore.addFolderTreeListener(this._onFolderTreeLoad);
		WidgetStore.addChangeListener(this._handleWidgetSelectChange);

		this.setState({
			treeLoading: true
		});

		this._loadInitData(this.props, this.context);
		
		// this.props.router.setRouteLeaveHook(
		// 	this.props.route, 
		// 	this.routerWillLeave
		// );
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

	_handleWidgetSelectChange() {
		if( widgetLoaded(this.state.selectedNode) ) {
			this.setState({
				widgetDto: Immutable.fromJS(WidgetStore.getWidgetDto())
			});
		}
	}

	_onFolderTreeLoad() {
		this.setState({
			treeLoading: false,
			selectedNode: FolderStore.getSelectedNode()
		});
	}

	_onSelectNode(node) {
		this.setState({
			selectedNode: node
		});
		if( isWidget(node) ) {
			FolderAction.GetWidgetDtos([node.get('Id')], node);
		}
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

	routerWillLeave(nextLocation) {
		ntLocation = nextLocation;
		return false;
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
					/>
				{this._renderContent()}
			</div>
		);
	}
}
