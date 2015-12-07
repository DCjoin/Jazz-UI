'use strict';

import React from 'react';

import MainAppBar from '../MainAppBar.jsx';
import NetworkChecker from '../../controls/NetworkChecker.jsx';
import LeftPanel from './ServiceProviderList.jsx';
import PlatformAction from '../../actions/PlatformAction.jsx';
import PlatformStore from '../../stores/PlatformStore.jsx';
import Content from './PlatformContent.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';

let Platform = React.createClass({
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
    });
  },
  _onSelectProviderChanged: function() {
    this.setState({
      selectProvider: PlatformStore.getSelectProvider()
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
    PlatformAction.setSelectedProvider({
      CalcStatus: true,
      Status: 1
    });
    this.setState({
      status: formStatus.ADD,
    });
  },
  _handleCancel: function() {
    this.setState({
      status: formStatus.VIEW,
    });
  },
  componentDidMount: function() {
    PlatformStore.addProviderListChangeListener(this._onProviderListChanged);
    PlatformStore.addSelectProviderChangeListener(this._onSelectProviderChanged);
  },
  componentWillUnmount: function() {
    PlatformStore.removeProviderListChangeListener(this._onProviderListChanged);
    PlatformStore.removeSelectProviderChangeListener(this._onSelectProviderChanged);
  },
  getInitialState: function() {
    return {
      providerList: PlatformStore.getProviderList(),
      sortBy: 'customername@asc',
      selectProvider: PlatformStore.getSelectProvider(),
      status: formStatus.VIEW,
      leftPanelShow: true
    };
  },
  render: function() {
    var leftPanelProps = {
        sortBy: this.state.sortBy,
        changeSortBy: this._onChangeSortBy,
        providerList: this.state.providerList,
        selectProvider: this.state.selectProvider,
        onAddServiceProvider: this._onAddServiceProvider
      },
      contentProps = {
        provider: this.state.selectProvider,
        formStatus: this.state.status,
        _toggleList: this._onToggleList,
        setEditStatus: this._setEditStatus,
        handleCancel: this._handleCancel
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
        flex: 1
      }}>
    {leftPanel}
    {content}
    </div>
      )
  },
});
module.exports = Platform;
