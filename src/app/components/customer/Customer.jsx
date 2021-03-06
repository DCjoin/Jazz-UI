'use strict';

import React from "react";
import classnames from "classnames";
import isFunction from "lodash-es/isFunction";
import isObject from 'lodash-es/isObject';
import { CircularProgress } from 'material-ui';

import { formStatus } from 'constants/FormStatus.jsx';
import Dialog from 'controls/PopupDialog.jsx';
var createReactClass = require('create-react-class');
import CustomerList from './CustomerList.jsx';
import CustomerDetail from './CustomerDetail.jsx';

import CustomerAction from 'actions/CustomerAction.jsx';
import CustomerStore from 'stores/CustomerStore.jsx';

import HierarchyAction from 'actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyStore from 'stores/hierarchySetting/HierarchyStore.jsx';

var Customer = createReactClass({
  getInitialState: function() {
    return {
      formStatus: formStatus.VIEW,
      selectedId: null,
      customers: CustomerStore.getCustomers(),
      closedList: false,
      isLoading: true,
      errorTitle: null,
      errorContent: null,
      infoTab: true,
      sortBy: 'customername@asc'
    };
  },
  _handlerTouchTap: function(selectedId) {
    this._setViewStatus(selectedId);
    if (this.state.selectedId != selectedId) {
      HierarchyAction.getConsultants(selectedId);
      CustomerAction.setCurrentSelectedId(selectedId);
    }
  },
  _handleSaveCustomer: function(customerData) {
    if (this.state.infoTab) {
      if (!!customerData.Id) {
        CustomerAction.ModifyCustomer(customerData);
      } else {
        CustomerAction.CreateCustomer(customerData);
      }

      this.setState({
        isLoading: true
      });
    } else {
      CustomerAction.SaveCustomerEnergyInfo(customerData);
    }


  },
  _handleDeleteCustomer: function(customer) {
    CustomerAction.deleteCustomer({
      Id: customer.get('Id'),
      Version: customer.get('Version')
    });
  },
  _switchTab(event) {
    if (event.target.getAttribute("data-tab-index") == 1) {
      if (this.state.infoTab) {
        return;
      }
      this.setState({
        infoTab: true,
        formStatus: formStatus.VIEW
      });
    } else {
      if (!this.state.infoTab) {
        return;
      }

      this.setState({
        infoTab: false,
        formStatus: formStatus.VIEW
      });
    }
    CustomerAction.reset();
  },
  _setViewStatus: function(selectedId = this.state.selectedId) {
    var id = selectedId,
      infoTab = this.state.infoTab;
    if (!selectedId) {
      id = this.state.customers.getIn([0, "Id"]);
      HierarchyAction.getConsultants(id);
      CustomerAction.setCurrentSelectedId(id);
    }
    if (this.state.selectedId != selectedId) {
      infoTab = true;
    }
    this.setState({
      infoTab: infoTab,
      formStatus: formStatus.VIEW,
      selectedId: id
    });
  },
  _setAddStatus: function() {
    var customerDetail = this.refs.pop_customer_detail;
    if (customerDetail && isFunction(customerDetail.clearErrorTextBatchViewbaleTextFiled)) {
      customerDetail.clearErrorTextBatchViewbaleTextFiled();
    }
    CustomerAction.setCurrentSelectedId(null);
    this.setState({
      infoTab: true,
      formStatus: formStatus.ADD,
      selectedId: null
    });
  },
  _setEditStatus: function() {
    this.setState({
      formStatus: formStatus.EDIT
    });
  },
  _handlerCancel: function() {
    CustomerAction.reset();
    this._setViewStatus();
  },
  _handlerChangeSortBy: function(type) {
    this.setState({
      isLoading: true,
      sortBy: type
    });
  },
  _toggleList: function() {
    var {closedList} = this.state;
    this.setState({
      closedList: !closedList
    });
  },
  _onChange: function(selectedId) {
    if (!!selectedId) {
      HierarchyAction.getConsultants(selectedId);
      this._setViewStatus(selectedId);
    }
    this.setState({
      customers: CustomerStore.getCustomers(),
      consultants: HierarchyStore.getConsultants(),
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
        onRequestClose={onClose}
        >
  {this.state.errorContent}
    </Dialog>)
    } else {
      return null;
    }
  },
  componentDidMount: function() {
    CustomerStore.addChangeListener(this._onChange);
    HierarchyStore.addChangeListener(this._onChange);
    CustomerStore.addErrorChangeListener(this._onError);
    CustomerAction.GetCustomers('Name');
    this.setState({
      isLoading: true
    });
  },
  componentWillUnmount: function() {
    CustomerStore.removeChangeListener(this._onChange);
    HierarchyStore.removeChangeListener(this._onChange);
    CustomerStore.removeErrorChangeListener(this._onError);
  //CustomerAction.ClearAll();
  },
  render: function() {
    var that = this,
      isView = this.state.formStatus === formStatus.VIEW;

    var listProps = {
        formStatus: this.state.formStatus,
        onAddBtnClick: that._setAddStatus,
        onCustomerClick: that._handlerTouchTap,
        customers: that.state.customers,
        selectedId: that.state.selectedId,
        changeSortBy: that._handlerChangeSortBy,
        sortBy: this.state.sortBy
      },
      detailProps = {
        ref: 'pop_customer_detail',
        customer: isView ? CustomerStore.getPersistedCustomer() : CustomerStore.getUpdatingCustomer(),
        consultants: this.state.consultants,
        formStatus: this.state.formStatus,
        infoTab: this.state.infoTab,
        setEditStatus: this._setEditStatus,
        handlerCancel: this._handlerCancel,
        handleSaveCustomer: this._handleSaveCustomer,
        handleDeleteCustomer: this._handleDeleteCustomer,
        toggleList: this._toggleList,
        closedList: this.state.closedList,
        handlerSwitchTab: this._switchTab
      };

    let customerlist = (!this.state.closedList) ? <div style={{
      display: 'flex'
    }}><CustomerList {...listProps}/></div> : <div style={{
      display: 'none'
    }}><CustomerList {...listProps}/></div>;
    let detail = (this.state.customers.size === 0 && isView) ? null : <CustomerDetail {...detailProps}/>;
    if (this.state.isLoading) {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center'
        }}>
      <CircularProgress  mode="indeterminate" size={80} />
      </div>
        );
    } else {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'auto'
        }}>
    {customerlist}
    {detail}
    {this._renderErrorDialog()}
    </div>);
    }
  },
});
module.exports = Customer;
