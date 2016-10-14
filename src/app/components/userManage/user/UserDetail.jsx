'use strict';

import React from "react";
import mui from 'material-ui';

import classnames from "classnames";


import Regex from '../../../constants/Regex.jsx';

import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../../controls/ViewableTextFieldUtil.jsx';

import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';

//import PermissionPanel from './PermissionPanel.jsx';
import PermissionCode from '../../../constants/PermissionCode.jsx';

import Loading from './Loading.jsx';
import OrigamiPanel from '../../../controls/OrigamiPanel.jsx';
import FormBottomBar from '../../../controls/FormBottomBar.jsx';
import Dialog from '../../../controls/PopupDialog.jsx';
import UserCustomerPermission from './UserCustomerPermission.jsx';

import { formStatus } from '../../../constants/FormStatus.jsx';

import UserAction from '../../../actions/UserAction.jsx';
import UserStore from '../../../stores/UserStore.jsx';
import CurrentUserStore from '../../../stores/CurrentUserStore.jsx';
import SideNav from '../../../controls/SideNav.jsx';
import Panel from '../../../controls/MainContentPanel.jsx';

var {FlatButton, FontIcon, SelectField, Checkbox, CircularProgress} = mui;


import _isFunction from "lodash/lang/isFunction";
import _isNumber from "lodash/lang/isNumber";
import _trim from 'lodash/string/trim';

var _ = {
  isFunction: _isFunction,
  isNumber: _isNumber,
  trim: _trim
};


var UserDetail = React.createClass({


  propTypes: {
    user: React.PropTypes.object,
    userRoleList: React.PropTypes.array,
    _handleWillEditUser: React.PropTypes.func,
    _handleEditUser: React.PropTypes.func,
    handleCancel: React.PropTypes.func,
    _handleDeleteUser: React.PropTypes.func
  },
  mixins: [ViewableTextFieldUtil],

  _handleSaveUser: function() {
    let that = this,
      isAdd = !that.props.selectedId,
      infoData = {},
      roleData = {
        WholeSystem: false,
        UserId: that.props.selectedId,
        PrivilegeType: 0,
        Privileges: []
      };

    if (that.props.infoTab) {

      infoData = this.props.user.toJS();
      if (isAdd) {
        infoData.RealName = infoData.Name;
      }
      if (_.isNumber(infoData.Title)) {
        infoData.Title = infoData.Title;
      }
      if (!infoData.Title) {
        infoData.Title = 0;
      }
      if (!infoData.UserType) {
        var userType = that.props.userRoleList.first();
        infoData.UserType = userType.get("Id");
        infoData.UserTypeName = userType.get("Name");
      }
    } else {
      roleData.Version = UserStore.getDataPrivilege().Version;
      roleData.Privileges = [];
      that.props.customers.forEach(customer => {
        // if (customer.get("Version") * 1 > roleData.Version * 1) {
        //   roleData.Version = customer.get("Version");
        // }
        if (customer.get("Privileged")) {
          roleData.Privileges.push(customer.delete("dataPrivilege").toJS());
        }
      });
      if (roleData.Privileges.length === that.props.customers.size) {
        roleData.WholeSystem = true;
      }
    }

    that.props.handleSaveUser(that.props.infoTab, infoData, roleData);
  },

  _bindChangeCheckbox: function(isCheckallBox, customerId) {
    return this._handlerChangeCheckbox.bind(this, isCheckallBox, customerId);
  },

  _handlerChangeCheckbox: function(isCheckallBox, customerId, event) {

    var customers = this.props.customers.map(customer => {
      if (isCheckallBox) {
        customer = customer.set("Privileged", event.target.checked);
        customer = customer.set("HierarchyIds", []);
        customer = customer.set("WholeCustomer", false);
      } else {
        if (customer.get("CustomerId") == customerId) {
          customer = customer.set("Privileged", !customer.get("Privileged"));
          customer = customer.set("HierarchyIds", []);
          customer = customer.set("WholeCustomer", customer.get("Privileged"));
        }
      }
      return customer;
    });
    UserAction.mergeCustomer({
      path: [],
      value: customers
    });
  },

  getDefaultProps: function() {
    return {
      user: {},
      userRoleList: null,
      selectedId: 0,
      _handleWillEditUser(selectedId) {
        alert("Please define will edit function");
      },
      _handleEditUser() {
        alert("Please define edit function");
      },
      handleCancel(selectedId) {
        alert("Please define cancel function");
      },
      _handleDeleteUser() {
        alert("Please define delete function");
      }
    };
  },

  getInitialState: function() {
    var isNew = !this.props.selectedId;
    return {
      user: this.props.user,

      infoTab: true,

      showRoleSideNav: false
    };
  },

  _renderInfoTab: function() {
    var that = this,
      isView = that.props.formStatus === formStatus.VIEW,
      roleSelectedIndex = 0,
      roleItems = (that.props.userRoleList.size === 0 || !that.props.userRoleList) ? Immutable.fromJS([]) : that.props.userRoleList.map((item, index) => {
        if (item.get("Id") === that.props.user.get("UserType")) {
          roleSelectedIndex = index;
        }
        return {
          text: item.get("Name"),
          id: item.get("Id")
        };
      }),
      isSuperAdmin = that.props.user.get("UserType") === -1,
      titleSelectedIndex = 0,
      titleItems = [];
    CurrentUserStore.getUserTitle().forEach((title, index) => {
      if (index != 3) {
        if (index == that.props.user.get("Title")) {
          if (index < 3) {
            titleSelectedIndex = index ;
          } else {
            titleSelectedIndex = index - 1;
          }

        }
        titleItems.push({
          payload: index,
          text: title
        });
      }
    });

    // titleItems = UserStore.getUserTitleList().map((title, index) => {
    //   if (title == that.props.user.get("Title")) {
    //     titleSelectedIndex = index;
    //   }
    //   return {
    //     text: title
    //   };
    // }),
    var {Title, Telephone, Email, Comment} = this.props.user.toJS(),

      userTitleProps = {
        isViewStatus: isView,
        title: I18N.Platform.User.Position,
        selectedIndex: titleSelectedIndex,
        textField: "text",
        dataItems: titleItems,
        didChanged: (idx) => {
          UserAction.mergeUser({
            value: idx,
            path: "Title"
          });
        }
      },
      userTelephoneProps = {
        isViewStatus: isView,
        title: I18N.Platform.User.Telephone,
        defaultValue: Telephone || "",
        isRequired: true,
        // regex: Regex.TelephoneRule,
        // errorMessage: "允许数字和中划线，但中划线不能连续出现或做为开头和结尾",
        didChanged: value => {
          UserAction.mergeUser({
            value,
            path: "Telephone"
          });
        }
      },
      userEmailProps = {
        isViewStatus: isView,
        title: I18N.Platform.User.Email,
        defaultValue: Email || "",
        isRequired: true,
        regex: Regex.Email,
        errorMessage: I18N.Platform.ServiceProvider.EmailError,
        maxLen: 254,
        didChanged: value => {
          UserAction.mergeUser({
            value,
            path: "Email"
          });
        }
      },
      userCommentProps = {
        isViewStatus: isView,
        title: I18N.Setting.UserManagement.Comment,
        defaultValue: Comment || "",
        multiLine: true,
        maxLen: -1,
        didChanged: value => {
          UserAction.mergeUser({
            value,
            path: "Comment"
          });
        }
      };
    return (
      <div className={classnames({
        "pop-user-detail-content": true
      })}>
				<div className="pop-user-detail-content-item pop-user-detail-title">
					<ViewableDropDownMenu {...userTitleProps}/>
				</div>

				<div className="pop-user-detail-content-item pop-user-detail-user-type">
					<div className="info-title">{I18N.Platform.User.Role}</div>
					<div className="info-value">
						{isView || isSuperAdmin ?
        <div>{isSuperAdmin ? I18N.Platform.User.ServerManager : that.props.user.get("UserTypeName")}</div>
        :
        <SelectField className="jazz-user-pop-viewableSelectField-ddm" onChange={(event, key, obj) => {
          UserAction.mergeUser({
            value: obj.id,
            path: "UserType"
          });
          UserAction.mergeUser({
            value: obj.text,
            path: "UserTypeName"
          });
        }} ref="pop_user_detail_role" selectedIndex={roleSelectedIndex} menuItems={roleItems.toJS()} />
      }
						<div onClick={that._showRoleSideNav}>{I18N.Platform.User.ShowFuncAuth}</div>
					</div>
				</div>

			{isSuperAdmin ? null : <div className="pop-user-detail-content-item">
					<ViewableTextField {...userTelephoneProps}/>
				</div>}
				<div className="pop-user-detail-content-item">
					<ViewableTextField {...userEmailProps}/>
				</div>
				<div className="pop-user-detail-content-item">
					<ViewableTextField {...userCommentProps}/>
				</div>
				{that._renderRoleSideNav()}

			</div>
      );
  },

  _renderPermissionTab: function() {
    var that = this,
      checkAll = true,
      {customers} = that.props,
      isView = that.props.formStatus === formStatus.VIEW;
    // if (customers.size < 1) {
    //   return (
    //     <div style={{
    //       display: 'flex',
    //       flex: 1,
    //       'alignItems': 'center',
    //       'justifyContent': 'center'
    //     }}><CircularProgress  mode="indeterminate" size={2} /></div>
    //     );
    // }
    if (customers.size === 0) {
      checkAll = false;
    } else {
      customers.forEach((customer) => {
        if (!customer.get("Privileged")) {
          checkAll = false;
        }
      });
    }


    var _renderDataPermissionLink = function(showPermissionProps) {
      //var showPermissionUpCode = isView ? PermissionCode.TREE_STRUCTURE_MANAGE.READONLY : PermissionCode.TREE_STRUCTURE_MANAGE.FULL;
      var text = isView ? I18N.Setting.Labeling.ViewDataPermission : I18N.Setting.Labeling.EditDataPermission;
      return (
        //<PermissionPanel showPermissionUpCode={ showPermissionUpCode }>
        <span {...showPermissionProps}>{ text }</span>
        //	</PermissionPanel>
        )
    };

    return (
      <div className={classnames({
        "pop-role-detail-content-permission": true
      })}>
				<div className="pop-user-detail-customer-checkall-block">

					<Checkbox
      onCheck={that._bindChangeCheckbox(true, 0)}
      defaultChecked={checkAll}
      disabled={isView || customers.size === 0}
      label={I18N.Setting.User.AllCusomerDataPermission}
      />
					<div className="pop-user-detail-customer-perm-checkall-desc">{I18N.Setting.Labeling.PlatformDataPermissionTip}</div>
				</div>
				<ul className="pop-user-detail-customer-subcheck-block">
				{
      customers.map((customer) => {
        let htmlId = "pop_user_detail_customer_subcheck_" + customer.get("CustomerId");
        var enabled = isView || (!checkAll && customer.get("Privileged"));
        var showPermissionProps = {
            className: classnames({
              "pop-user-detail-customer-perm-action": true,
              "enabled": enabled
            })
          },
          liStyle = {};
        if (enabled) {
          showPermissionProps.onClick = function() {
            that._showUserCustomerSideBar(customer.get("CustomerId"), isView);
          }
        }

        if (isView && !customer.get("Privileged")) {
          liStyle.display = "none";
        }

        return (
          <li className={classnames("pop-user-detail-customer-subcheck-block-item")} style={liStyle}>
							<div className={classnames("pop-user-detail-customer-subcheck-block-item-left")}>
								<Checkbox
          ref=""
          onCheck={that._bindChangeCheckbox(false, customer.get("CustomerId"))}
          defaultChecked={customer.get("Privileged")}
          disabled={isView || checkAll}
          style={{
            width: "auto",
            display: "block"
          }}
          />
								<label

          onClick={ () => {
            if (!isView) {
              that._handlerChangeCheckbox(false, customer.get("CustomerId"));
            }
          }}
          title={ customer.get("CustomerName") }
          className={classnames("pop-user-detail-customer-subcheck-block-item-label", {
            "disabled": isView
          })}>
									{ customer.get("CustomerName") }
								</label>
							</div>
							{ _renderDataPermissionLink(showPermissionProps) }
						</li>
          );
      })
      }
				</ul>
        <UserCustomerPermission isView={isView} saveCustomerPermission={this._saveCustomerPermission} ref="pop_user_customer_permission_side_nav"/>
			</div>
      );
  },

  _renderRoleSideNav: function() {
    if (this.state.showRoleSideNav) {
      var userType = this.props.userRoleList.first(),
        Id = this.props.user.get("UserType"),
        Name = this.props.user.get("UserTypeName");

      if (!Id) {
        Id = userType.get("Id");
        Name = userType.get("Name");
      }
      var codeList = CurrentUserStore.getCurrentPrivilegeByUser(this.props.user.toJS(), this.props.userRoleList.toJS());
      var commonPrivilege = CurrentUserStore.getCommonPrivilegeList();
      var role = CurrentUserStore.getRolePrivilegeList(),
        rolePrivilege = [];
      var commonPrivilegeList = commonPrivilege.map((item) => {
        return (<div  className="pop-userprofile-authitem">{item}</div>);
      });

      codeList.map((item) => {
        var index = parseInt(item);
        rolePrivilege.push(role[index]);
      });

      var rolePrivilegeList = rolePrivilege.map((item) => {
        return (<div  className="pop-userprofile-authitem">{item}</div>);
      });

      return (<SideNav open={true} side="right" onClose={this._onCloseRoleSideNav} >
		          <div className="sidebar-title" title={Name} style={{
          overflow: ' hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}>
		              {Name}
		          </div>
		          <div className="sidebar-content">
		              <div className="pop-userprofile-authcommon">
		                  <h3>{I18N.Privilege.Common.Common}</h3>
		                  {commonPrivilegeList}
		              </div>
		              <div className="pop-userprofile-authrole">
		                  <h3>{I18N.Privilege.Role.Role}</h3>
		                  {rolePrivilegeList}
		              </div>
		          </div>
		      </SideNav>);
    }
    return null;
  },

  _renderDialog: function() {
    var that = this;
    var closeDialog = function() {
      that.setState({
        dialogStatus: false
      });
    }
    if (!this.state.dialogStatus) {
      return null;
    } else {
      var {Name, RealName} = that.props.user.toJS();
      return (

        <Dialog modal={true} openImmediately={this.state.dialogStatus} title={I18N.Setting.User.DeleteTitle} actions={[
          <FlatButton
          label={I18N.Template.Delete.Delete}
          primary={true}
          onClick={() => {
            that.props._handleDeleteUser();
            closeDialog();
          }} />,
          <FlatButton
          label={I18N.Template.Delete.Cancel}
          onClick={closeDialog} />
        ]}>
					{I18N.format(I18N.Setting.User.DeleteContent, Name + " " + RealName)}
				</Dialog>
        );
    }
  },

  componentWillMount: function() {
    this.initBatchViewbaleTextFiled();
  },

  render: function() {

    var that = this,
      isSuperAdmin = that.props.user.get("UserType") === -1,
      isUserSelf = that.props.user.get("Id") === parseInt(window.currentUserId),
      leftButtonInlineStyle = {
        padding: "0 54px"
      },
      rightButtonInlineStyle = {
        padding: "0 20px"

      },
      isView = this.props.formStatus === formStatus.VIEW,
      isEdit = this.props.formStatus === formStatus.EDIT,
      isAdd = this.props.formStatus === formStatus.ADD,

      userNameProps = {
        isViewStatus: isView,
        title: I18N.Setting.UserManagement.UserName,
        defaultValue: this.props.user.get("Name"),
        isRequired: true,
        maxLen: 200,
        // regex: Regex.CustomerNameRule,
        // errorMessage: "允许中文，英文字母，数字，下划线，逗号，（，），-，[，]，{，}，#，&，;，.，~，%，+ 和空格",
        didChanged: value => {
          UserAction.mergeUser({
            value,
            path: "Name"
          })
        }
      },

      disabledSaveButton = false;

    if (!that.props.user || !that.props.userRoleList) {
      return (
        <div className="pop-manage-detail">
					<OrigamiPanel />
					<Loading ref="pop_user_detail_loading"/>
				</div>
        );
    }

    if (!that.props.selectedId && isView) {
      return (
        <div className="pop-manage-detail pop-framework-right">
					<OrigamiPanel />
				</div>
        );
    }

    if (that.props.infoTab) {
      if (
        !this.props.user.get("Name") || /*!Regex.CustomerNameRule.test( this.props.user.get("Name") ) ||*/
        this.props.user.get("Name").length > 200 ||
        !this.props.user.get("Email") || !Regex.Email.test(this.props.user.get("Email")) ||
        this.props.user.get("Email").length > 254 ||
        !this.props.user.get("Telephone") ||
        this.props.user.get("Telephone").length > 200 /*!Regex.TelephoneRule.test( this.props.user.get("Telephone") )*/
      ) {
        disabledSaveButton = true;
      }
    // if (this.props.user.get("Comment") && this.props.user.get("Comment").length > 200) {
    //   disabledSaveButton = true;
    // }
    }

    var collapseButton = (
    <div className="fold-tree-btn pop-framework-right-actionbar-top-fold-btn" style={{
      "color": "#939796"
    }}>
				<FontIcon className={classnames("icon", "icon-column-fold")} onClick={this.props._toggleList}/>
			</div>
    );

    var sendPasswordButton = null;
    if (that.props.infoTab) {
      sendPasswordButton = (
        <FlatButton secondary={true} className="pop-user-detail-content-footer-send-email-button" label={I18N.Platform.ServiceProvider.SendEmail} style={{
          borderRight: '1px solid #ececec',
          color: '#abafae'
        }} onClick={that.props._handleResetPassword}/>
      );
    }

    var footer = (
    <FormBottomBar
    transition={true}
    customButton={sendPasswordButton}
    enableSave={!disabledSaveButton}
    status={this.props.formStatus}
    onSave={this._handleSaveUser}
    allowDelete={that.props.infoTab && !isSuperAdmin && !isUserSelf}
    onDelete={function() {
      that.setState({
        dialogStatus: true
      });
    }}
    onCancel={this.props.handleCancel}
    onEdit={ () => {
      that.clearErrorTextBatchViewbaleTextFiled();
      that.props.setEditStatus()
    }}/>
    );
    var addStyle = isAdd ? null : {
      display: 'none'
    };
    return (
      <div className={classnames({
        "jazz-framework-right-expand": that.props.closedList,
        "jazz-framework-right-fold": !that.props.closedList
      })}>
        <Panel onToggle={this.props._toggleList}>
				<div className={classnames({
        "pop-manage-detail-header": true,

      })}>
					<div className="pop-manage-detail-header-name">
						<div className="pop-user-detail-name">
              {isAdd ? <div className="add" style={addStyle}>
              								<ViewableTextField {...userNameProps}/>
              							</div> :
        <div><span className="pop-user-detail-display-name exists" title={that.props.user.get("Name")}>{that.props.user.get("Name")}</span>
      <span className="pop-user-detail-real-name exists" title={that.props.user.get("RealName")}>{that.props.user.get("RealName")}</span></div>}


						</div>
					{
      !that.props.selectedId ? null :
        <div className="pop-user-detail-tabs">
							<span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": that.props.infoTab
        })} data-tab-index="1" onClick={that.props._handlerSwitchTab}>{I18N.Setting.UserManagement.UserInfo}</span>
							<span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": !that.props.infoTab
        })} data-tab-index="2" onClick={that.props._handlerSwitchTab}>{I18N.Setting.UserManagement.DataPermissionSetting}</span>
						</div>
      }
					</div>
				</div>

				<div className="pop-manage-detail-content ">
					{that.props.infoTab ? that._renderInfoTab() : that._renderPermissionTab()}

        				{footer}

				</div>

				{this._renderDialog()}
				<Loading ref="pop_user_detail_loading"/>
        </Panel>
			</div>
      );
  },

  _handleChangeTitle(event, index, item) {
    this.setState({
      selectedTitle: item.text
    });
  },

  _handleChangeUserType(event, index, item) {
    this.setState({
      selectedUserType: {
        Id: item.id,
        Name: item.text
      }
    });
  },

  _initTextField() {
    if (this.refs.pop_user_detail_real_name) {
      this.refs.pop_user_detail_real_name.setValue("");
    }
    if (this.refs.pop_user_detail_name) {
      this.refs.pop_user_detail_name.setValue("");
    }
    if (this.refs.pop_user_detail_telephone) {
      this.refs.pop_user_detail_telephone.setValue("");
    }
    if (this.refs.pop_user_detail_email) {
      this.refs.pop_user_detail_email.setValue("");
    }
    if (this.refs.pop_user_detail_comment) {
      this.refs.pop_user_detail_comment.setValue("");
    }
  },

  _handlerTextFieldOnChange(ref, bitVal) {
    let currentElement = this.refs[ref],
      submitButton = this.refs.pop_customer_dialog_submit,
      _currentVerifiedValue = this.state.currentVerifiedValue,
      _verifiedValue = this.state.verifiedValue;

    if (currentElement) {
      let errorText = currentElement.props["data-error-text"],
        regex = currentElement.props["data-regex"],
        value = _.trim(currentElement.getValue());

      if (regex) {
        if (!regex.test(value)) {
          currentElement.setErrorText(errorText);
          _currentVerifiedValue = (_verifiedValue ^ bitVal) & _currentVerifiedValue;
        } else {
          if ((_currentVerifiedValue & bitVal) !== bitVal) {
            currentElement.setErrorText("");
            _currentVerifiedValue = bitVal ^ _currentVerifiedValue;
          }
        }
      }
      this.setState({
        currentVerifiedValue: _currentVerifiedValue
      });
    }
  },

  _showUserCustomerSideBar: function(customerId, isView) {
    var customer = UserStore.getUserCustomer(customerId, this.props.formStatus === formStatus.VIEW);
    if (!customer.get("dataPrivilege")) {
      if (_.isFunction(this.props._getUserCustomerPermission)) {
        this.props._getUserCustomerPermission(customerId, isView);
      }
    }
    this.refs.pop_user_customer_permission_side_nav.open(customerId, customer);
  },

  _saveCustomerPermission: function(customerId, hierarchyIds, selectedAll = false) {

    var customers = UserStore.getUpdatingUserCustomers().map(customer => {
      if (customer.get("CustomerId") === customerId) {
        customer = customer.set("HierarchyIds", hierarchyIds);
        customer = customer.set("WholeCustomer", selectedAll);
      }
      return customer; //.delete("dataPrivilege");
    });

    UserAction.mergeCustomer({
      path: [],
      value: customers
    });

  // this.setState({
  // 	customers: _.map(this.state.customers, customer => {
  // 		if(customer.CustomerId === customerId) {
  // 			customer.HierarchyIds = hierarchyIds;
  // 			customer.WholeCustomer = selectedAll;
  // 		}
  // 		delete customer.dataPrivilege;
  // 		return customer;
  // 	})
  // });
  },

  _showRoleSideNav: function() {
    this.setState({
      showRoleSideNav: true
    });
  },

  _onCloseRoleSideNav: function() {
    this.setState({
      showRoleSideNav: false
    });
  }
});

module.exports = UserDetail;
