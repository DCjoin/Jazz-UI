'use strict';

import React from "react";
import classnames from "classnames";

import { formStatus } from '../../../constants/FormStatus.jsx';
import UserStore from '../../../stores/UserStore.jsx';

var UserItem = React.createClass({
  propTypes: {
    handlerTouchTap: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      handlerTouchTap(selectedId) {}
    };
  },

  _handlerTouchTap: function() {
    this.props.handlerTouchTap(this.props.Id);
  },

  render() {
    var relateCustomerName = I18N.Setting.Benchmark.Label.None,
      relateCustomers = [];
    if (this.props.HasWholeCustomer) {
      relateCustomerName = I18N.Setting.Labeling.AllCusomer;
    } else {
      if (!!this.props.Customers) {
        this.props.Customers.map(function(customer) {
          relateCustomers.push(customer.CustomerName);
        });
      }


      if (relateCustomers.length > 0) {
        relateCustomerName = relateCustomers.join(", ");
      }
    }

    return (
      <div className={classnames({
        "pop-manage-list-item": true,
        "pop-user-list-item": true,
        selected: this.props.selected
      })} onClick={this._handlerTouchTap}>
				<div style={{
        display: "flex",
        flexDirection: "column",
        width: "100%"
      }}>
					<div className="pop-user-list-item-user">
						<span className="pop-user-list-item-user-display-name">{this.props.Name}</span>
						<span className="pop-user-list-item-user-real-name">{this.props.RealName}</span>
					</div>
					<div className="pop-user-list-item-customer">
						<span className="pop-user-list-item-customer-title">{I18N.Setting.User.SelectedCusomer}</span>
						<span className="pop-user-list-item-customer-value">{relateCustomerName}</span>
					</div>
				</div>
				{
      this.props.selected ?
        <div className="pop-manage-list-item-chevron">
					<div className="fa fa-chevron-right"></div>
				</div>
        : null
      }
    </div>
      );
  }
});

module.exports = React.createClass({

  propTypes: {
    users: React.PropTypes.object,
    handlerTouchTap: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      users: null,
      selectedId: 0,
      handlerTouchTap(selectedId) {},
      setAddStatus() {},
      handleShowFilterSideNav() {}
    };
  },
  onAddBtnClick: function() {
    if (this.props.formStatus === formStatus.VIEW) {
      this.props.setAddStatus();
    }
  },
  render() {

    var that = this,
      userItems,
      {users, setAddStatus, handleShowFilterSideNav, handlerTouchTap, selectedId} = that.props,
      filterNotEmpty = UserStore.getFilterObj().size > 0,
      filterReset = null;

    if (users && users.size > 0) {
      userItems = users.map((item) => {
        var props = item.toJS();
        props.selected = selectedId == item.get("Id");
        props.handlerTouchTap = handlerTouchTap;
        return (<UserItem key={"pop-user-key-" + item.get("Id")} {...props} />);
      });
    } else {
      userItems = (
        <div className="pop-user-list-empty-tip">
						<span className="pop-user-list-empty-tip-result">{I18N.Setting.User.FilterResult}</span>
						<span className="pop-user-list-empty-tip-recommendation">{I18N.Setting.User.FilterRecommendation}</span>
					</div>
      );
    }

    if (filterNotEmpty) {
      filterReset = (
        <div className="pop-user-list-reset">
					<span className="pop-user-list-reset-button" onClick={this.props.resetFilter}>{I18N.Setting.User.FilterResult}</span>
				</div>
      );
    }

    return (
      <div className="jazz-folder-leftpanel-container" style={{
          color:'#fff',
          backgroundColor:'#354052'
        }}>
				<div className="pop-manage-list-title pop-framework-left-title">
					<div className="pop-manage-list-title-action">

							<span onClick={this.onAddBtnClick} className={
      classnames({
        "pop-manage-list-title-action-item": true,
        "jazz-disabled": !(this.props.formStatus === formStatus.VIEW)
      })}><span className="icon-add pop-manage-list-title-action-item-icon"/>{I18N.Common.Glossary.User}</span>

						<span onClick={handleShowFilterSideNav} className={
      classnames({
        "pop-manage-list-title-action-item": true,
        "jazz-disabled": !(this.props.formStatus === formStatus.VIEW)
      })}><span className="icon-filter pop-manage-list-title-action-item-icon"/>{I18N.Setting.User.Filter}</span>
					</div>
				</div>
				{filterReset}
				<div className={
      classnames({
        "jazz-provider-list": true,
        "pop-user-list-empty-content": filterNotEmpty && users.size < 1
      })}>
					{userItems}
				</div>
			</div>
      );
  }
});
