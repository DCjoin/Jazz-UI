'use strict';

import React from "react";
import Immutable from 'immutable';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';
import HierarchyAction from '../../actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyList from './HierarchyList.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import { CircularProgress } from 'material-ui';
import { Map } from 'immutable';
import Customer from './CustomerForHierarchy.jsx';
import Organization from './Organization/Organization.jsx';

function emptyMap() {
  return new Map();
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
    var {status, path, value} = data,
      paths = path.split("."),
      value = Immutable.fromJS(value);
    var mData = (this.state.infoTabNo === 1) ? this.state.selectedNode : null;
    if (status === dataStatus.DELETED) {
      mData = mData.deleteIn(paths);
    } else if (status === dataStatus.NEW) {

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
    }
    return detail
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
        </div>);
    }
  },
});
module.exports = Hierarchy;
