'use strict';

import React, {Component} from 'react';

import Immutable from 'immutable';
import { RadioButtonGroup, RadioButton, SelectField } from 'material-ui';

import SideNav from '../../../controls/SideNav.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import LinkButton from '../../../controls/LinkButton.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';

import UserAction from '../../../actions/UserAction.jsx';
import UserStore from '../../../stores/UserStore.jsx';

import _isObject from "lodash/isObject";
import _get from 'lodash/get';

var _ = {
  isObject: _isObject,
  get: _get
};

class RoleRadio extends Component{
    shouldComponentUpdate (nextProps) {
      return !Immutable.is(nextProps.userRoleList, this.props.userRoleList);
    }
    render() {
      let radioList = [(<RadioButton key={"role-radio-key-all"} style={{paddingTop: "20px"}} value="" label="全部" />)];

      this.props.userRoleList.forEach( role => {
        radioList.push(
            <RadioButton key={"role-radio-key-" + role.get("Id")} style={{paddingTop: "20px"}} value={role.get("Id") + ""} label={role.get("Name")}/>
        );
      } );

      return (
        <RadioButtonGroup onChange={this.props.handleChange} name="pop_user_filter_role_radio_group" defaultSelected={UserStore.getFilterObj().get("role")}>
            {radioList}
        </RadioButtonGroup>
      );    
    }

}

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
      Text: I18N.Setting.Labeling.NoCusomer
    }, {
      CustomerId: -2,
      Text: I18N.Setting.Labeling.AllCusomer
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
    return (<RoleRadio handleChange={this._bindChangeFilter("role")} userRoleList={this.props.userRoleList} />);
   //  var radioList = [(<RadioButton key={"role-radio-key-all"} style={{
   //    paddingTop: "20px"
   //  }} value="" label={I18N.Common.Glossary.Order.All} />)];

   //  this.props.userRoleList.forEach(role => {
   //    radioList.push(
   //      <RadioButton key={"role-radio-key-" + role.get("Id")} style={{
   //        paddingTop: "20px"
   //      }} value={role.get("Id") + ""} label={role.get("Name")}/>
   //    );
   //  });

   //  return (
   //    <RadioButtonGroup onChange={this._bindChangeFilter("role")} name="pop_user_filter_role_radio_group" defaultSelected={this.props.filterObj.get("role")}>
		 //    	{radioList}
			// </RadioButtonGroup>
   //    );
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
					<div className="pop-user-filter-side-nav-header sidebar-title">{I18N.Setting.User.UserFilter}</div>
					<div className="sidebar-content pop-user-filter-side-nav-content">

						<div className="pop-user-filter-side-nav-content-item sidebar-content-item">
							<div className="pop-user-filter-side-nav-content-item-header">
								<div className="pop-user-filter-side-nav-content-item-header-title">{I18N.Setting.UserManagement.UserName}</div>
								<LinkButton disabled={!this.props.filterObj.get("displayName")} onClick={this._bindChangeFilter("displayName", true)} label={I18N.Setting.User.Cancel}/>
							</div>
							<div className="pop-user-filter-side-nav-content-item-input">
								<ViewableTextField didChanged={this._bindChangeFilter("displayName")} hintText={I18N.Setting.UserManagement.UserName} defaultValue={this.props.filterObj.get("displayName")} />
							</div>
						</div>

						<div className="pop-user-filter-side-nav-content-item sidebar-content-item">
							<div className="pop-user-filter-side-nav-content-item-header">
								<div className="pop-user-filter-side-nav-content-item-header-title">{I18N.Setting.UserManagement.RealName}</div>
								<LinkButton disabled={!this.props.filterObj.get("realName")} onClick={this._bindChangeFilter("realName", true)} label={I18N.Setting.User.Cancel}/>
							</div>
							<div className="pop-user-filter-side-nav-content-item-input">
								<ViewableTextField didChanged={this._bindChangeFilter("realName")} hintText={I18N.Setting.UserManagement.RealName} defaultValue={this.props.filterObj.get("realName")} />
							</div>
						</div>

						<div className="pop-user-filter-side-nav-content-item sidebar-content-item">
							<div className="pop-user-filter-side-nav-content-item-header">
								<div className="pop-user-filter-side-nav-content-item-header-title">{I18N.Setting.User.SelectedCusomer}</div>
								<LinkButton disabled={!this.props.filterObj.get("selectedCusomer")} onClick={this._bindChangeFilter("selectedCusomer", true)} label={I18N.Setting.User.Cancel}/>
							</div>
							<div className="pop-user-filter-side-nav-content-item-input pop-viewableSelectField">
								<ViewableDropDownMenu
                  style={{
                    width: 256
                  }}
                  menuItemsProps={{
                     style: {
                                width: 244,
                            },
                            innerDivStyle: {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }
                  }}
                  textField={'Text'}
                  valueField={'CustomerId'}
                  dataItems={this._getCustomerList()}
                  defaultValue={selectedCusomer}
                  didChanged={this._bindChangeFilter("selectedCusomer")}>
                </ViewableDropDownMenu>
							</div>
						</div>

						<div className="pop-user-filter-side-nav-content-item sidebar-content-item">
							<div className="pop-user-filter-side-nav-content-item-role-header">{I18N.Platform.User.Role}</div>
							<div className="pop-user-filter-side-nav-content-item-role-list">
								{this._renderRoleRadio()}
							</div>
						</div>

					</div>
					<div className="sidebar-bottom-action">
						<FlatButton label={I18N.Setting.User.Filter} onClick={this.props.handleFilter} labelStyle={{
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
