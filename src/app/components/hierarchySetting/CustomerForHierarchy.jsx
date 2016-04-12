'use strict';

import React from "react";
import Detail from '../customer/CustomerDetail.jsx';
import { CircularProgress } from 'material-ui';
import HierarchyAction from '../../actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';


var CustomerForHierarchy = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.bool,
    closedList: React.PropTypes.bool,
    toggleList: React.PropTypes.func,
    selectedNode: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      isLoading: true,
    };
  },
  _onChange: function() {
    this.setState({
      customer: HierarchyStore.getSelectedCustomer(),
      isLoading: false,
    });
  },
  componentDidMount: function() {
    HierarchyStore.addCustomerChangeListener(this._onChange);
    HierarchyAction.getCustomersByFilter(this.props.selectedNode.get('Id'));
    this.setState({
      isLoading: true
    });
  },
  componentWillUnmount: function() {
    HierarchyStore.removeCustomerChangeListener(this._onChange);
  },
  render: function() {
    var detailProps = {
      customer: this.state.customer,
      formStatus: this.props.formStatus,
      toggleList: this.props.toggleList,
      closedList: this.props.closedList,
      infoTab: true,
      isFromHierarchy: true
    };
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
        <Detail {...detailProps}/>
      </div>);
    }
  },
});
module.exports = CustomerForHierarchy;
