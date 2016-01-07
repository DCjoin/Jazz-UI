'use strict';

import React from 'react';



import { RadioButtonGroup, RadioButton, SelectField } from 'material-ui';

import SideNav from '../../controls/SideNav.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import ViewableSelectField from '../../controls/ViewableSelectField.jsx';
import LinkButton from '../../controls/LinkButton.jsx';
import FlatButton from '../../controls/FlatButton.jsx';

import UserAction from '../../actions/UserAction.jsx';

import _isObject from "lodash/lang/isObject";
import _get from 'lodash/object/get';

var _ = {
  isObject: _isObject,
  get: _get
};

var UserFilter = React.createClass({

  _bindChangeFilter: function(paths, isClear) {
    if (isClear) {
      return this._mergeFilterObj.bind(this, paths, "");
    }
    return this._mergeFilterObj.bind(this, paths);
  },

  _mergeFilterObj: function(paths, event, value = "") {
    if (!_.isObject(event)) {
      value = event;
    } else {
      value = _.get(event, "target.value");
      if (_.isObject(value)) {
        value = _.get(value, "value.CustomerId");
      }
    }
    UserAction.mergeFilterObj({
      path: paths,
      value: value
    });
  },

  _getCustomerList: function() {
    let customerList = [ /*{
			CustomerId: 0,
			Text: ""
		},*/ {
      CustomerId: -1,
      Text: "无客户"
    }, {
      CustomerId: -2,
      Text: "全部客户"
    }];

    this.props.customers.forEach(customer => {
      customerList.push({
        CustomerId: customer.get("Id"),
        Text: customer.get("Name")
      });
    });

    return customerList;
  },

  close: function() {
    if (this.refs.pop_user_filter_side_nav) {
      this.refs.pop_user_filter_side_nav.closeNav();
    }
  },

  getInitialState: function() {
    return {
      inited: false,
      showNav: false,
      valueCode: 0
    };
  },

  componentDidMount: function() {
    this.setState({
      inited: true
    });
  },

  _renderRoleRadio: function() {
    var radioList = [(<RadioButton key={"role-radio-key-all"} style={{
      paddingTop: "20px"
    }} value="" label="全部" />)];

    this.props.userRoleList.forEach(role => {
      radioList.push(
        <RadioButton key={"role-radio-key-" + role.get("Id")} style={{
          paddingTop: "20px"
        }} value={role.get("Id") + ""} label={role.get("Name")}/>
      );
    });

    return (
      <RadioButtonGroup onChange={this._bindChangeFilter("role")} name="pop_user_filter_role_radio_group" defaultSelected={this.props.filterObj.get("role")}>
		    	{radioList}
			</RadioButtonGroup>
      );
  },

  render: function() {
    var that = this,
      selectedIndex = -1,
      selectedCusomer = that.props.filterObj.get("selectedCusomer", "");

    if (selectedCusomer < 0) {
      selectedIndex = -1 * selectedCusomer;
    } else if (selectedCusomer > 0) {
      selectedIndex = this.props.customers.findIndex(cus => {
          return cus.get("Id") == selectedCusomer
          }) + 2;
      }
      /*

      						<ViewableSelectField
      									needChange={true}
      									style={{
      										width:256,
      										zIndex:3}}
      									menuItemStyle={{
      										"overflow": "hidden",
      										"textOverflow": "ellipsis",
      										"width":184}}
      									autoWidth={true}
      									textField={"text"}
      									dataItems={this._getCustomerList()}
      									didChanged={this._bindChangeFilter("selectedCusomer")} />
      */

      return (
        <SideNav open={true} ref="pop_user_filter_side_nav" onClose={this.props.onClose}>
				<div className="pop-user-filter-side-nav-wrapper">
					<div className="pop-user-filter-side-nav-header sidebar-title">用户筛选</div>
					<div className="sidebar-content pop-user-filter-side-nav-content">

						<div className="pop-user-filter-side-nav-content-item sidebar-content-item">
							<div className="pop-user-filter-side-nav-content-item-header">
								<div className="pop-user-filter-side-nav-content-item-header-title">用户名</div>
								<LinkButton disabled={!this.props.filterObj.get("displayName")} onClick={this._bindChangeFilter("displayName", true)} label="清除"/>
							</div>
							<div className="pop-user-filter-side-nav-content-item-input">
								<ViewableTextField didChanged={this._bindChangeFilter("displayName")} hintText="用户名" defaultValue={this.props.filterObj.get("displayName")} />
							</div>
						</div>

						<div className="pop-user-filter-side-nav-content-item sidebar-content-item">
							<div className="pop-user-filter-side-nav-content-item-header">
								<div className="pop-user-filter-side-nav-content-item-header-title">显示名称</div>
								<LinkButton disabled={!this.props.filterObj.get("realName")} onClick={this._bindChangeFilter("realName", true)} label="清除"/>
							</div>
							<div className="pop-user-filter-side-nav-content-item-input">
								<ViewableTextField didChanged={this._bindChangeFilter("realName")} hintText="显示名称" defaultValue={this.props.filterObj.get("realName")} />
							</div>
						</div>

						<div className="pop-user-filter-side-nav-content-item sidebar-content-item">
							<div className="pop-user-filter-side-nav-content-item-header">
								<div className="pop-user-filter-side-nav-content-item-header-title">关联客户</div>
								<LinkButton disabled={!this.props.filterObj.get("selectedCusomer")} onClick={this._bindChangeFilter("selectedCusomer", true)} label="清除"/>
							</div>
							<div className="pop-user-filter-side-nav-content-item-input pop-viewableSelectField">
								<SelectField
        style={{
          width: 256,
          zIndex: 3
        }}
        menuItemStyle={{
          "overflow": "hidden",
          "textOverflow": "ellipsis",
          "width": 184
        }}
        autoWidth={true}
        className={'pop-viewableSelectField-ddm'}
        value={selectedCusomer}
        hintText={"客户名称"}
        valueMember={"CustomerId"}
        displayMember={"Text"}
        menuItems={this._getCustomerList()}
        onChange={this._bindChangeFilter("selectedCusomer")} />
							</div>
						</div>

						<div className="pop-user-filter-side-nav-content-item sidebar-content-item">
							<div className="pop-user-filter-side-nav-content-item-role-header">功能权限角色</div>
							<div className="pop-user-filter-side-nav-content-item-role-list">
								{this._renderRoleRadio()}
							</div>
						</div>

					</div>
					<div className="sidebar-bottom-action">
						<FlatButton label="筛&nbsp;&nbsp;&nbsp;&nbsp;选" onClick={this.props.handleFilter} labelStyle={{
          color: "#00BCD4"
        }} style={{
          color: '#abafae',
          height: '48px',
          width: '100%'
        }} />
					</div>
				</div>
			</SideNav>
        );
    }

  });

  module.exports = UserFilter;
