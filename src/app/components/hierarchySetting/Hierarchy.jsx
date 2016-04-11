'use strict';

import React from "react";
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';
import HierarchyAction from '../../actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyList from './HierarchyList.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import { CircularProgress } from 'material-ui';
import { Map } from 'immutable';

function emptyMap() {
  return new Map();
}

var Hierarchy = React.createClass({
  getInitialState: function() {
    return {
      formStatus: formStatus.VIEW,
      selectedId: null,
      selectedContent: emptyMap(),
      hierarchys: HierarchyStore.getHierarchys(),
      closedList: false,
      isLoading: true,
      errorTitle: null,
      errorContent: null,
      infoTabNo: 1,
    };
  },
  _onChange: function(selectedId) {
    if (!!selectedId) {
      this._setViewStatus(selectedId);
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
  _setViewStatus: function(selectedId = this.state.selectedId) {
    // if (!selectedId) {
    //   id = this.state.tariffs.getIn([0, "Id"]);
    //   TariffAction.setCurrentSelectedId(id);
    // }
    // if (this.state.selectedId !== selectedId) {
    //   infoTab = true;
    // }
    this.setState({
      formStatus: formStatus.VIEW,
      selectedId: selectedId,
    //  selectedContent: VEEStore.getRuleById(id)
    });
  },
  componentWillMount: function() {
    document.title = I18N.MainMenu.CustomerSetting;
    HierarchyAction.GetHierarchys();
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
    var listProps = {
      formStatus: this.state.formStatus,
      onAddBtnClick: this._setAddStatus,
      onHierarchyClick: this._handlerTouchTap,
      hierarchys: this.state.hierarchys,
      selectedId: this.state.selectedId,
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
        </div>);
    }
  },
});
module.exports = Hierarchy;
