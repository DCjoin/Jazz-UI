'use strict';

import React from "react";
import Immutable from 'immutable';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';
import HierarchyAction from '../../actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyList from './HierarchyList.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import { dataStatus } from '../../constants/DataStatus.jsx';
import { CircularProgress } from 'material-ui';
import { Map, List } from 'immutable';
import Dialog from '../../controls/PopupDialog.jsx';
import Customer from './CustomerForHierarchy.jsx';
import Organization from './Organization/Organization.jsx';
import Building from './Building/Building.jsx';
import Dim from './Dim/Dim.jsx';

function emptyMap() {
  return new Map();
}
function emptyList() {
  return new List();
}
var Hierarchy = React.createClass({
  getInitialState: function() {
    return {
      formStatus: formStatus.VIEW,
      selectedNode: emptyMap(),
      selectedContent: emptyMap(),
      newType: null,
      hierarchys: HierarchyStore.getHierarchys(),
      closedList: false,
      isLoading: true,
      errorTitle: null,
      errorContent: null,
      infoTabNo: 1,
    };
  },
  _onChange: function(selectedNode) {
    if (!!selectedNode) {
      this._setViewStatus(selectedNode);
    }
    this.setState({
      hierarchys: HierarchyStore.getHierarchys(),
      isLoading: false,
      errorTitle: null,
      errorContent: null
    });
  },
  _onError: function(error) {
    this.setState({
      errorTitle: error.title,
      errorContent: error.content,
      isLoading: false
    });
  },
  _onExportBtnClick: function() {
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = './ImpExpHierarchy.aspx?Action=ExportHierarchy&customerId=' + parseInt(window.currentCustomerId);
    iframe.onload = function() {
      document.body.removeChild(iframe);
    };
    document.body.appendChild(iframe);
  },
  _setViewStatus: function(selectedNode = this.state.selectedNode) {
    // if (!selectedId) {
    //   id = this.state.tariffs.getIn([0, "Id"]);
    //   TariffAction.setCurrentSelectedId(id);
    // }
    // if (this.state.selectedId !== selectedId) {
    //   infoTab = true;
    // }
    this.setState({
      formStatus: formStatus.VIEW,
      selectedNode: selectedNode,
    //  selectedContent: VEEStore.getRuleById(id)
    });
  },
  _setAddStatus: function(newType) {
    var HierarchyDetail = this.refs.jazz_hierarchy_detail;
    if (HierarchyDetail) {
      HierarchyDetail._clearErrorText();
    }
    this.setState({
      infoTabNo: 1,
      formStatus: formStatus.ADD,
      selectedNode: Immutable.fromJS({
        Type: newType
      }),
    });
  },
  _setEditStatus: function() {
    this.setState({
      formStatus: formStatus.EDIT
    });
  },
  _toggleList: function() {
    var {closedList} = this.state;
    this.setState({
      closedList: !closedList
    });
  },
  _handlerTouchTap: function(node) {
    this._setViewStatus(node);
    if (this.state.selectedNode !== node) {
      HierarchyAction.setCurrentSelectedNode(node);
    }
  },
  _handlerMerge: function(data) {
    var {status, path, value, index} = data,
      paths = path.split("."),
      value = Immutable.fromJS(value);
    var mData = (this.state.infoTabNo === 1) ? this.state.selectedNode : null;
    if (status === dataStatus.DELETED) {
      mData = mData.deleteIn(paths);
    } else if (status === dataStatus.NEW) {
      var children = mData.getIn(paths);
      if (!children) {
        children = emptyList();
      }
      if (Immutable.List.isList(children)) {
        if (index) {
          paths.push(index);
        } else {
          value = children.push(value);
        }
      }
      mData = mData.setIn(paths, value);
    } else {
      mData = mData.setIn(paths, value);
    }
    if (this.state.infoTabNo === 1) {
      this.setState({
        selectedNode: mData,
      })
    } else {
    }

  },
  _handlerCancel: function() {
    this._setViewStatus(HierarchyStore.getSelectedNode());
  },
  _handleDelete: function(node) {
    HierarchyAction.deleteHierarchy(node.toJS());
    this.setState({
      isLoading: true
    });
  },
  _handleSave: function(node) {
    if (this.state.infoTabNo === 1) {
      if (!node.get('Id')) {
        var parent = HierarchyStore.getSelectedNode();
        node = node.set('ParentId', parent.get('Id'));
        node = node.set('CustomerId', parseInt(window.currentCustomerId));
        if (node.get('Type') === 101) {
          node = node.set('HierarchyId', parent.get('HierarchyId'));
        }
        HierarchyAction.createHierarchy(node.toJS());
      } else {
        HierarchyAction.modifyHierarchy(node.toJS());
      }
    } else if (this.state.infoTabNo === 2) {
      HierarchyAction.modifyTags(node.hierarchyId, node.tags);
    }
    this.setState({
      isLoading: true
    });
  },
  _switchTab(event) {
    let no = parseInt(event.target.getAttribute("data-tab-index"));
    this.setState({
      infoTabNo: no,
      formStatus: formStatus.VIEW
    });

  },
  _renderContent: function() {
    var detailProps = {
      selectedNode: this.state.selectedNode,
      key: this.state.selectedNode.get('Id') === null ? Math.random() : this.state.selectedNode.get('Id'),
      formStatus: this.state.formStatus,
      infoTabNo: this.state.infoTabNo,
      setEditStatus: this._setEditStatus,
      handlerCancel: this._handlerCancel,
      handleSave: this._handleSave,
      handleDelete: this._handleDelete,
      handlerSwitchTab: this._switchTab,
      toggleList: this._toggleList,
      closedList: this.state.closedList,
      merge: this._handlerMerge
    };
    var type = this.state.selectedNode.get('Type'),
      detail = null;
    switch (type) {
      case -1:
        detailProps.ref = 'jazz_hierarchy_customer_detail';
        detail = <Customer {...detailProps}/>;
        break;
      case 0:
      case 1:
        detailProps.ref = 'jazz_hierarchy_organization_detail';
        detail = <Organization {...detailProps}/>;
        break;
      case 2:
        detailProps.ref = 'jazz_hierarchy_building_detail';
        detail = <Building {...detailProps}/>;
        break;
      case 101:
        detailProps.ref = 'jazz_hierarchy_dim_detail';
        detail = <Dim {...detailProps}/>;
        break;
    }
    return detail;
  },
  _renderErrorDialog: function() {
    var that = this;
    var onClose = function() {
      that.setState({
        errorTitle: null,
        errorContent: null,
      });
    };
    if (!!this.state.errorTitle) {
      return (<Dialog
        ref = "_dialog"
        title={this.state.errorTitle}
        modal={false}
        openImmediately={!!this.state.errorTitle}
        onClose={onClose}
        >
        {this.state.errorContent}
      </Dialog>)
    } else {
      return null;
    }
  },
  _onReloadHierachyTree: function() {
    HierarchyAction.GetHierarchys();
    this.setState({
      isLoading: true
    });
  },
  componentWillMount: function() {
    document.title = I18N.MainMenu.CustomerSetting;
    HierarchyAction.getCustomersByFilter(window.currentCustomerId, true);
    this.setState({
      isLoading: true
    });
  },
  componentDidMount: function() {
    HierarchyStore.addChangeListener(this._onChange);
    HierarchyStore.addErrorChangeListener(this._onError);
  },
  componentWillUnmount: function() {
    HierarchyStore.removeChangeListener(this._onChange);
    HierarchyStore.removeErrorChangeListener(this._onError);
  },
  render: function() {
    var isView = this.state.formStatus === formStatus.VIEW;
    var listProps = {
      formStatus: this.state.formStatus,
      onAddBtnClick: this._setAddStatus,
      onHierarchyClick: this._handlerTouchTap,
      hierarchys: this.state.hierarchys,
      selectedNode: this.state.selectedNode,
      onExportBtnClick: this._onExportBtnClick,
      onReloadHierachyTree: this._onReloadHierachyTree
    //onGragulaNode: this._onGragulaNode
    };
    let list = (!this.state.closedList) ? <div style={{
      display: 'flex'
    }}><HierarchyList {...listProps}/></div> : <div style={{
      display: 'none'
    }}><HierarchyList {...listProps}/></div>;
    if (this.state.isLoading) {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center'
        }}>
    <CircularProgress  mode="indeterminate" size={2} />
  </div>
        );
    } else {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'auto'
        }}>
          {list}
          {(this.state.hierarchys.size === 0 && isView) ? null : this._renderContent()}
          {this._renderErrorDialog()}
        </div>);
    }
  },
});
module.exports = Hierarchy;