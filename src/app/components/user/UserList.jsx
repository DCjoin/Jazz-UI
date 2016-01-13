'use strict';

import React from "react";
import classnames from "classnames";

import { formStatus } from '../../constants/FormStatus.jsx';
import UserStore from '../../stores/UserStore.jsx';

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
    var relateCustomerName = "无",
      relateCustomers = [];
    if (this.props.HasWholeCustomer) {
      relateCustomerName = "全部客户";
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
      <li className={classnames({
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
						<span className="pop-user-list-item-customer-title">关联客户</span>
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
			</li>
      );
  }
});

module.exports = React.createClass({

  propTypes: {
    users: React.PropTypes.object,
    handlerTouchTap: React.PropTypes.func
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
						<span className="pop-user-list-empty-tip-result">没有符合筛选条件的用户</span>
						<span className="pop-user-list-empty-tip-recommendation">您可以修改筛选条件再试一下</span>
					</div>
      );
    }

    if (filterNotEmpty) {
      filterReset = (
        <div className="pop-user-list-reset">
					<span className="pop-user-list-reset-button" onClick={this.props.resetFilter}>清空筛选条件</span>
				</div>
      );
    }

    return (
      <div className="pop-manage-list pop-framework-left">
				<div className="pop-manage-list-title pop-framework-left-title">
					<div className="pop-manage-list-title-action">

							<span onClick={setAddStatus} className={
      classnames({
        "pop-manage-list-title-action-item": true,
        "jazz-disabled": !(this.props.formStatus === formStatus.VIEW)
      })}><span className="icon-add pop-manage-list-title-action-item-icon"/>用户</span>

						<span onClick={handleShowFilterSideNav} className={
      classnames({
        "pop-manage-list-title-action-item": true,
        "jazz-disabled": !(this.props.formStatus === formStatus.VIEW)
      })}><span className="icon-filter pop-manage-list-title-action-item-icon"/>筛选</span>
					</div>
				</div>
				{filterReset}
				<ul className={
      classnames({
        "pop-manage-list-content": true,
        "pop-user-list-empty-content": filterNotEmpty && users.size < 1
      })}>
					{userItems}
				</ul>
			</div>
      );
  }
});
