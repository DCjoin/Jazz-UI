'use strict';

import React from 'react';

import MainAppBar from '../MainAppBar.jsx';
import NetworkChecker from '../../controls/NetworkChecker.jsx';
import LeftPanel from './ServiceProviderList.jsx';
import PlatformAction from '../../actions/PlatformAction.jsx';
import PlatformStore from '../../stores/PlatformStore.jsx';

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
  componentDidMount: function() {
    PlatformStore.addProviderListChangeListener(this._onProviderListChanged);
  },
  componentWillUnmount: function() {
    PlatformStore.removeProviderListChangeListener(this._onProviderListChanged);
  },
  getInitialState: function() {
    return {
      providerList: PlatformStore.getProviderList(),
      sortBy: 'customername@asc'
    };
  },
  render: function() {

    return (
      <div style={{
        display: 'flex',
        flex: 1
      }}>
      <LeftPanel sortBy={this.state.sortBy} changeSortBy={this._onChangeSortBy} providerList={this.state.providerList}/>
      </div>
      )
  },
});
module.exports = Platform;
