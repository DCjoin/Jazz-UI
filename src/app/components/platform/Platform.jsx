'use strict';

import React from 'react';

import MainAppBar from '../MainAppBar.jsx';
import NetworkChecker from '../../controls/NetworkChecker.jsx';
import LeftPanel from './ServiceProviderList.jsx';
import PlatformAction from '../../actions/PlatformAction.jsx';
import PlatformStore from '../../stores/PlatformStore.jsx';
import Content from './PlatformContent.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
var createReactClass = require('create-react-class');
//test
let Platform = createReactClass({
  _onChangeSortBy: function(type) {
    if (type == 'customername@asc') {
      PlatformAction.getServiceProviders('Name', 0);
    } else {
      PlatformAction.getServiceProviders('StartDate', 1);
    }
    this.setState({
      sortBy: type
    });
  },
  _onProviderListChanged: function() {
    this.setState({
      providerList: PlatformStore.getProviderList(),
      selectProvider: PlatformStore.getSelectProvider(),
      status: formStatus.VIEW,
      addBtnDisabled: false
    });
  },
  _onSelectProviderChanged: function() {
    this.setState({
      selectProvider: PlatformStore.getSelectProvider(),
      addBtnDisabled: false,
      status: formStatus.VIEW,
      infoTabNo: 1
    });
  },
  _onMergeProviderChanged: function() {
    this.setState({
      selectProvider: PlatformStore.getSelectProvider(),
    });
  },
  _onToggleList: function() {
    this.setState({
      leftPanelShow: !this.state.leftPanelShow
    });
  },
  _setEditStatus: function() {
    this.setState({
      status: formStatus.EDIT,
    });
  },
  _onAddServiceProvider: function() {
    PlatformAction.setSelectedProvider(null);
    this.setState({
      infoTabNo: 1,
      status: formStatus.ADD,
      addBtnDisabled: true
    });
  },
  _handleCancel: function() {
    this.setState({
      status: formStatus.VIEW,
    });
  },
  _switchTab(event) {
    switch (this.state.infoTabNo) {
      case 1:
        PlatformAction.cancelSave();
        break;
      case 2:
        PlatformAction.cancelSaveCustomer();
        break;
    }
    let no = parseInt(event.target.getAttribute("data-tab-index"));
    this.setState({
      infoTabNo: no,
      status: formStatus.VIEW
    });
  },
  componentDidMount: function() {
    PlatformStore.addProviderListChangeListener(this._onProviderListChanged);
    PlatformStore.addSelectProviderChangeListener(this._onSelectProviderChanged);
    PlatformStore.addMergeProviderChangeListener(this._onMergeProviderChanged);

  },
  componentWillUnmount: function() {
    PlatformStore.removeProviderListChangeListener(this._onProviderListChanged);
    PlatformStore.removeSelectProviderChangeListener(this._onSelectProviderChanged);
    PlatformStore.removeMergeProviderListChangeListener(this._onMergeProviderChanged);
  },
  getInitialState: function() {
    return {
      providerList: PlatformStore.getProviderList(),
      sortBy: 'customername@asc',
      selectProvider: PlatformStore.getSelectProvider(),
      status: formStatus.VIEW,
      leftPanelShow: true,
      addBtnDisabled: false,
      infoTabNo: 1,
    };
  },
  render: function() {
    var leftPanelProps = {
        sortBy: this.state.sortBy,
        changeSortBy: this._onChangeSortBy,
        providerList: this.state.providerList,
        selectProvider: this.state.selectProvider,
        onAddServiceProvider: this._onAddServiceProvider,
        addBtnDisabled: this.state.addBtnDisabled
      },
      contentProps = {
        provider: this.state.selectProvider,
        formStatus: this.state.status,
        _toggleList: this._onToggleList,
        showLeft: this.state.leftPanelShow,
        setEditStatus: this._setEditStatus,
        infoTabNo: this.state.infoTabNo,
        handleCancel: this._handleCancel,
        handlerSwitchTab: this._switchTab,
      };
    let leftPanel = (this.state.leftPanelShow) ? <div style={{
      display: 'flex'
    }}><LeftPanel {...leftPanelProps}/></div> : <div style={{
      display: 'none'
    }}><LeftPanel {...leftPanelProps}/></div>;
    let content = (!!this.state.selectProvider) ? <Content {...contentProps}/> : null;
    return (
      <div style={{
        display: 'flex',
        flex: 1,
      }}>
    {leftPanel}
    {content}
    </div>
      );
  },
});
module.exports = Platform;
