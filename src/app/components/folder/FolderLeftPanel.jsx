'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import classSet from 'classnames';
import { CircularProgress, FlatButton, FontIcon, IconButton, IconMenu } from 'material-ui';
import SearchBox from './FolderSearchBox.jsx';
import Tree from '../../controls/tree/Tree.jsx';
import FolderStore from '../../stores/FolderStore.jsx';
import FolderAction from '../../actions/FolderAction.jsx';
import NodeContent from './TreeNodeContent.jsx';
let MenuItem = require('material-ui/lib/menus/menu-item');
import CopyView from './operationView/CopyView.jsx';
import DeleteView from './operationView/DeleteView.jsx';
import ShareView from './operationView/ShareView.jsx';
import SendView from './operationView/SendView.jsx';
import DropdownButton from '../../controls/DropdownButton.jsx';

import HierarchyStore from '../../stores/HierarchyStore.jsx';
import HierarchyAction from '../../actions/HierarchyAction.jsx';
import Dialog from '../../controls/OperationTemplate/BlankDialog.jsx';
import { treeSource } from '../../constants/TreeSource.jsx';



import Immutable from 'immutable';
const DIALOG_TYPE = {
  SWITCH_WIDGET: "switchwidget",
  SWITCH_EC: 'switchec',
  SWITCH_WIDGET_BY_DRAG: 'switchwidgetbydrag'
};
var targetNode, isPre,
  sourceNode ,
  parentNode,
  collapsedId;

var FolderLeftPanel = React.createClass({

  _onFolderTreeChange: function() {
    this.setState({
      allNode: FolderStore.getFolderTree(),
      selectedNode: FolderStore.getSelectedNode(),
      isLoading: false
    });
  },

  generateNodeConent: function(nodeData, panel) {
    return (<NodeContent nodeData={nodeData}
      selectedNode={this.state.selectedNode}
      panel={panel}
      />);
  },
  _onChange: function() {
    this.setState({
      //  allNode:FolderStore.getFolderTree(),
      allNode: HierarchyStore.getData(),
      isLoading: false
    });
  },
  _onSelectNode: function(nodeData) {
    var lastSelectedNode = FolderStore.getSelectedNode();
    if (lastSelectedNode.get('Type') == 7 && lastSelectedNode.get('ChartType') === null && lastSelectedNode.get('Id') != nodeData.get('Id')) {
      FolderAction.setDisplayDialog(DIALOG_TYPE.SWITCH_WIDGET, nodeData);
    } else {
      FolderAction.setSelectedNode(nodeData);
      if (nodeData.get('Type') == 7) {
        this.setState({
          selectedNode: nodeData,
          buttonDisabled: true,
        })
      } else {
        this.setState({
          selectedNode: nodeData,
          buttonDisabled: false,
        })
      }
    }

  },
  _onNewFolder: function() {
    this.setState({
      isLoading: true
    });
    var name = FolderStore.getDefaultName(I18N.Folder.NewFolder, this.state.selectedNode, 6);
    FolderAction.createWidgetOrFolder(this.state.selectedNode, name, 6, window.currentCustomerId);
  },
  _onCreateFolderOrWidgetChange: function() {
    this.setState({
      isLoading: false,
      allNode: FolderStore.getFolderTree(),
      selectedNode: FolderStore.getSelectedNode()
    });

  },
  _onNewWidget: function(e, item) {
    let widgetType = parseInt(item.key);
    let _newWidget = [];

    _newWidget[1] = I18N.Folder.NewWidget.Menu1;
    _newWidget[2] = I18N.Folder.NewWidget.Menu2;
    _newWidget[3] = I18N.Folder.NewWidget.Menu3;
    _newWidget[4] = I18N.Folder.NewWidget.Menu4;
    _newWidget[5] = I18N.Folder.NewWidget.Menu5;

    let name = _newWidget[widgetType];
    name = FolderStore.getDefaultName(name, this.state.selectedNode, 7);
    this.setState({
      isLoading: true
    });
    FolderAction.createWidgetOrFolder(this.state.selectedNode, name, 7, window.currentCustomerId, widgetType);
    this.setState({
      buttonDisabled: true
    })
  },
  _onSearchClick: function(node) {
    var lastSelectedNode = FolderStore.getSelectedNode();
    if (lastSelectedNode.get('Type') == 7 && lastSelectedNode.get('ChartType') === null && lastSelectedNode.get('Id') != node.get('Id')) {
      FolderAction.setDisplayDialog(DIALOG_TYPE.SWITCH_WIDGET, node);
    } else {
      FolderAction.setSelectedNode(node);
      if (node.get('IsSenderCopy') && !node.get('IsRead')) {
        FolderAction.modifyFolderReadStatus(node);
      }
      if (node.get('Type') == 7) {
        this.setState({
          selectedNode: node,
          buttonDisabled: true
        })
      } else {
        this.setState({
          selectedNode: node
        })
      }
    }


  },
  _onModifyName: function() {
    let me = this;
    this.setState({
      isLoading: true
    }, () => {
      me.setState({
        isLoading: false,
        allNode: FolderStore.getFolderTree()
      });
    });
  },
  getInitialState: function() {
    return {
      allNode: null,
      isLoading: true,
      selectedNode: null,
      buttonDisabled: false,
      dialogType: ''
    };
  },
  _onDeleteItem: function() {
    this.setState({
      allNode: FolderStore.getFolderTree()
    })
  },
  _onCopyItem: function() {
    this.setState({
      allNode: FolderStore.getFolderTree(),
      selectedNode: FolderStore.getSelectedNode()
    })
  },
  _onSelectedNodeChange: function() {
    var selectedNode = FolderStore.getSelectedNode();
    if (selectedNode.get('Type') == 7) {
      this.setState({
        selectedNode: FolderStore.getSelectedNode(),
        buttonDisabled: true
      })
    } else {
      this.setState({
        selectedNode: FolderStore.getSelectedNode(),
        buttonDisabled: false
      })
    }

  },
  didDrag: function() {
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

    this.setState({
      isLoading: true,
    })
  },
  _onGragulaNode: function(targetId, sourceId, pre, collapsedNodeId) {
    targetNode = FolderStore.getNodeById(parseInt(targetId));
    sourceNode = FolderStore.getNodeById(parseInt(sourceId));
    parentNode = FolderStore.getParent(targetNode);
    isPre = pre;
    collapsedId = collapsedNodeId;

    console.log('test for gragula_targetNode:' + targetNode.get('Name'));
    console.log('test for gragula_targetNode:' + sourceNode.get('Name'));
    console.log('test for gragula_targetNode:' + parentNode.get('Name'));
    // if(!pass){
    //   FolderAction.moveItem(sourceNode.toJSON(),targetNode.toJSON(),null)
    // }
    // else {
    //   FolderAction.moveItem(sourceNode.toJSON(),parentNode.toJSON(),targetNode.toJSON())
    // // }
    var lastSelectedNode = FolderStore.getSelectedNode();
    if (lastSelectedNode.get('Type') == 7 && lastSelectedNode.get('ChartType') === null) {
      FolderAction.setDisplayDialog(DIALOG_TYPE.SWITCH_WIDGET_BY_DRAG);
    } else {
      this.didDrag()
    }

  },
  _onMoveItemChange: function() {
    this.setState({
      isLoading: false,
      allNode: FolderStore.getFolderTree(),
      selectedNode: FolderStore.getSelectedNode()
    });
  },
  _onModfiyReadingStatusChange: function() {
    this.setState({
      allNode: FolderStore.getFolderTree()
    });
  },
  _onDialogChanged: function() {
    this.setState({
      dialogType: FolderStore.getDisplayDialog().type,
    });
  },
  _getSwitchWidgetDialog: function() {
    var that = this;
    var _onConfirm = function() {
      FolderAction.getFolderTreeByCustomerId(window.currentCustomerId);
      that.didDrag();
    };
    var _onCancel = function() {
      that.setState({
        isLoading: true
      }, () => {
        that.setState({
          isLoading: false,
          allNode: FolderStore.getFolderTree(),
          dialogType: '',
        });
      });
    // that.setState({
    //
    //   isloading: true
    // });
    // that._onFolderTreeChange();
    };
    var props = {
      title: I18N.Folder.Widget.Leave,
      firstActionLabel: I18N.Folder.Widget.LeaveButton,
      secondActionLabel: I18N.Folder.Widget.LeaveCancel,
      content: I18N.Folder.Widget.LeaveContent,
      onFirstActionTouchTap: _onConfirm,
      onSecondActionTouchTap: _onCancel,
      onDismiss: _onCancel,
    }
    return (
      <Dialog {...props}/>
      )
  },
  componentDidMount: function() {

    FolderStore.addFolderTreeListener(this._onFolderTreeChange);
    FolderStore.addCreateFolderOrWidgetListener(this._onCreateFolderOrWidgetChange);
    FolderAction.getFolderTreeByCustomerId(window.currentCustomerId);

    FolderStore.addDeleteItemSuccessListener(this._onDeleteItem);
    FolderStore.addCopyItemSuccessListener(this._onCopyItem);
    FolderStore.addModifyNameSuccessListener(this._onModifyName);
    FolderStore.addModifyNameErrorListener(this._onModifyName);
    FolderStore.addSelectedNodeListener(this._onSelectedNodeChange);
    FolderStore.addMoveItemSuccessListener(this._onMoveItemChange);
    FolderStore.addMoveItemErrorListener(this._onMoveItemChange);
    FolderStore.addModfiyReadingStatusListener(this._onModfiyReadingStatusChange);
    FolderStore.addDialogListener(this._onDialogChanged);

  },
  componentWillUnmount: function() {

    FolderStore.removeFolderTreeListener(this._onFolderTreeChange);
    FolderStore.removeCreateFolderOrWidgetListener(this._onCreateFolderOrWidgetChange);

    FolderStore.removeDeleteItemSuccessListener(this._onDeleteItem);
    FolderStore.removeCopyItemSuccessListener(this._onCopyItem);
    FolderStore.removeModifyNameSuccessListener(this._onModifyName);
    FolderStore.removeModifyNameErrorListener(this._onModifyName);
    FolderStore.removeSelectedNodeListener(this._onSelectedNodeChange);
    FolderStore.removeMoveItemSuccessListener(this._onMoveItemChange);
    FolderStore.removeMoveItemErrorListener(this._onMoveItemChange);
    FolderStore.removeModfiyReadingStatusListener(this._onModfiyReadingStatusChange);
    FolderStore.removeDialogListener(this._onDialogChanged);

  },
  render: function() {
    //style
    var iconStyle = {
        paddingTop: '0px'
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
    var newFolderClasses = {
      'se-dropdownbutton': true,
      'btn-container': true,
      'btn-container-active': !this.state.buttonDisabled
    };

    //icon
    var energyAnalysisIcon = <FontIcon className="icon-energy-analysis" style={iconStyle}/>,
      unitIndexIcon = <FontIcon className="icon-unit-index" style={iconStyle}/>,
      timeRationIcon = <FontIcon className="icon-dust-concentration" style={iconStyle}/>,
      labelingIcon = <FontIcon className="icon-labeling" style={iconStyle}/>,
      rankingIcon = <FontIcon className="icon-ranking" style={iconStyle}/>;

    var filterOptions = [
      <MenuItem key={1} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu1} leftIcon={energyAnalysisIcon}/>,
      <MenuItem key={2} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu2} leftIcon={unitIndexIcon}/>,
      <MenuItem key={3} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu3} leftIcon={timeRationIcon}/>,
      <MenuItem key={4} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu4} leftIcon={labelingIcon}/>,
      <MenuItem key={5} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu5} leftIcon={rankingIcon}/>
    ];

    //props
    var treeProps = {
        key: 'foldertree',
        collapsedLevel: 0,
        allNode: this.state.allNode,
        allHasCheckBox: false,
        allDisabled: false,
        generateNodeConent: this.generateNodeConent,
        onSelectNode: this._onSelectNode,
        selectedNode: this.state.selectedNode,
        onGragulaNode: this._onGragulaNode,
        arrowClass: 'jazz-foldertree-arrow',
        treeNodeClass: 'jazz-foldertree-node',
        treeSource: treeSource.Energy
      },
      newWidgetProps = {
        type: "Add",
        text: I18N.Folder.WidgetName,
        menuItems: filterOptions,
        onItemClick: this._onNewWidget,
        disabled: this.state.buttonDisabled
      };


    var treeContent = (this.state.isLoading ? <div style={{
      textAlign: 'center',
      marginTop: '400px'
    }}><CircularProgress  mode="indeterminate" size={1} /></div> : <Tree {...treeProps}/>);

    var dialog;
    switch (this.state.dialogType) {
      case DIALOG_TYPE.SWITCH_WIDGET_BY_DRAG:
        dialog = this._getSwitchWidgetDialog();
        break;
    }
    return (
      <div className="jazz-folder-leftpanel-container">
        {dialog}

        <div className="jazz-folder-leftpanel-header">
          <div className={classSet(newFolderClasses)} style={{
        margin: '0 30px'
      }}>
            <FlatButton disabled={this.state.buttonDisabled} onClick={this._onNewFolder} style={buttonStyle}>
              <FontIcon  className="fa icon-add btn-icon"/>
              <span className="mui-flat-button-label btn-text">{I18N.Folder.FolderName}</span>
            </FlatButton>
          </div>
          <DropdownButton {...newWidgetProps}/>
          <div>

          </div>
        </div>

        <div className="jazz-folder-leftpanel-search">
          <SearchBox onSearchClick={this._onSearchClick}></SearchBox>
        </div>

        <div className="jazz-folder-leftpanel-foldertree">
          {treeContent}
        </div>

      </div>
      )
  }
});

module.exports = FolderLeftPanel;
