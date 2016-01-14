'use strict';

import React from "react";
import classnames from "classnames";
import Immutable from 'immutable';
import RoleAction from '../../../actions/RoleAction.jsx';
import RoleStore from '../../../stores/RoleStore.jsx';
import Panel from '../../../controls/MainContentPanel.jsx';
import FormBottomBar from '../../../controls/FormBottomBar.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../../controls/ViewableTextFieldUtil.jsx';
import CurrentUserStore from '../../../stores/CurrentUserStore.jsx';
import { Checkbox } from 'material-ui';
import Dialog from '../../../controls/PopupDialog.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';

var RoleDetail = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
  propTypes: {
    formStatus: React.PropTypes.bool,
    role: React.PropTypes.object,
    setEditStatus: React.PropTypes.func,
    handlerCancel: React.PropTypes.func,
    handleSaveRole: React.PropTypes.func,
    handleDeleteRole: React.PropTypes.func,
    toggleList: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      showPublicPanel: true,
      showPrivatePanel: true,
      dialogStatus: false
    };
  },
  _handleTogglePanel: function(type) {
    if (type) {
      var showPrivatePanel = !this.state.showPrivatePanel;
      this.setState({
        showPrivatePanel
      });
    }
    if (!type) {
      var showPublicPanel = !this.state.showPublicPanel;
      this.setState({
        showPublicPanel
      });
    }
  },
  _handlePrivilegeClick: function(e) {
    var value = e.currentTarget.id;
    RoleAction.merge({
      value,
      path: "PrivilegeCodes"
    });
  },
  _handleSaveRole: function() {
    this.props.handleSaveRole(this.props.role.toJS());
  },
  _renderPublicPermission: function() {
    var permissions = [];
    if (this.state.showPublicPanel) {
      CurrentUserStore.getCommonPrivilegeList().forEach(privilege => {
        permissions.push(
          <div className='pop-role-detail-content-permission-content-item'>
            <div className='pop-role-detail-content-permission-content-item-left'>
              {privilege}
            </div>
          </div>
        )
      })
    }
    return (
      <div className="pop-role-detail-content-permission">
    <div className="pop-role-detail-content-permission-header-panel">
      <span className="pop-role-detail-content-permission-header-panel-title">{I18N.Privilege.Common.Common}</span>
      <span className="pop-role-detail-content-permission-header-panel-action" onClick={this._handleTogglePanel.bind(this, 0)}>{ this.state.showPublicPanel ? "隐藏" : "显示"}</span>
    </div>
    <ul className="pop-role-detail-content-permission-content">
      {permissions}
    </ul>
  </div>
      )

  },

  _renderPrivatePermission: function(isView) {
    var list = RoleStore.getPrivatePermissionList(isView),
      permissions = [],
      that = this;
    if (this.state.showPrivatePanel) {
      list.forEach((privilege) => {
        var liStyle = {};

        if (isView && !privilege.isChecked) {
          liStyle.display = "none";
        }
        permissions.push(
          <li className="pop-user-detail-customer-subcheck-block-item" style={liStyle}>
              <div className="pop-user-detail-customer-subcheck-block-item-left" id={privilege.Id} onClick={this._handlePrivilegeClick}>
                <Checkbox
          ref=""
          defaultChecked={privilege.isChecked}
          disabled={isView}
          style={{
            width: "auto",
            display: "block"
          }}
          />
                <label
          title={privilege.Name}
          className={classnames("pop-user-detail-customer-subcheck-block-item-label", {
            "disabled": isView
          })}>
                  {privilege.Name}
                </label>
              </div>
            </li>
        );
      });
    }
    return (
      <div className="pop-role-detail-content-permission">
    <div className="pop-role-detail-content-permission-header-panel">
      <span className="pop-role-detail-content-permission-header-panel-title">{I18N.Privilege.Role.Role}</span>
      <span className="pop-role-detail-content-permission-header-panel-action" onClick={this._handleTogglePanel.bind(this, 1)}>{ this.state.showPrivatePanel ? "隐藏" : "显示"}</span>
    </div>
    <ul className="pop-role-detail-content-permission-content">
      <ul className="pop-user-detail-customer-subcheck-block">
      {permissions}
    </ul>
    </ul>
  </div>
      )
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
      var {Name} = that.props.role.toJS();
      return (

        <Dialog openImmediately={this.state.dialogStatus} title={"删除角色 “" + Name + "”"} modal={true} actions={[
          <FlatButton
          label="删除"
          primary={true}
          onClick={() => {
            that.props.handleDeleteRole();
            closeDialog();
          }} />,
          <FlatButton
          label="放弃"
          onClick={closeDialog} />
        ]}>
					{"角色 “" + Name + "” 将被删除"}
				</Dialog>
        );
    }
  },
  componentWillMount: function() {
    this.initBatchViewbaleTextFiled();
  },

  render: function() {
    var that = this,
      {role} = this.props,
      isView = this.props.formStatus === formStatus.VIEW,
      roleNameProps = {
        isViewStatus: isView,
        title: "角色名称",
        defaultValue: role.get("Name"),
        maxLen: 200,
        isRequired: true,
        didChanged: value => {
          RoleAction.merge({
            value,
            path: "Name"
          })
        }
      },
      disabledSaveButton = !role.get("Name") || role.get("Name").length > 200;
    var footer = (
    <FormBottomBar
    transition={true}
    enableSave={!disabledSaveButton}
    status={this.props.formStatus}
    onSave={this._handleSaveRole}
    onDelete={function() {
      that.setState({
        dialogStatus: true
      });
    }}
    onCancel={this.props.handlerCancel}
    onEdit={ () => {
      that.clearErrorTextBatchViewbaleTextFiled();
      that.props.setEditStatus()
    }}/>
    );

    return (
      <div className={classnames({
        "jazz-framework-right-expand": that.props.closedList,
        "jazz-framework-right-fold": !that.props.closedList
      })}>
      <Panel onToggle={this.props.toggleList}>
        <div className="pop-manage-detail-header">
          <div className="pop-manage-detail-header-name">
            <ViewableTextField  {...roleNameProps} />
          </div>
        </div>
        <div className="pop-manage-detail-content ">
          {that._renderPublicPermission()}
          {that._renderPrivatePermission(isView)}
          {footer}
        </div>
        	{that._renderDialog()}
        </Panel>
      </div>

      )
  },
});
module.exports = RoleDetail;
