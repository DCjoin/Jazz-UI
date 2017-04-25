'use strict';

import React from "react";
import classnames from "classnames";
import { isFunction, isObject } from "lodash";
import RoleList from './RoleList.jsx';
import RoleDetail from './RoleDetail.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import { CircularProgress } from 'material-ui';
import UserAction from '../../../actions/UserAction.jsx';
import RoleStore from '../../../stores/RoleStore.jsx';
import RoleAction from '../../../actions/RoleAction.jsx';
import Dialog from '../../../controls/NewDialog.jsx';
var Role = React.createClass({
  getInitialState: function() {
    return {
      formStatus: formStatus.VIEW,
      selectedId: RoleStore.getRoleList().length === 0 ? null : RoleStore.getRoleList()[0].Id,
      roles: RoleStore.getRoleList(),
      closedList: false,
      isLoading: false,
      errorTitle: null,
      errorContent: null
    };
  },
  _handlerTouchTap: function(selectedId) {
    this._setViewStatus(selectedId);
  // if (this.state.selectedUserId != selectedId) {
  //   RoleAction.setCurrentSelectedId(selectedId);
  // }
  },
  _handlerCancel: function() {
    //RoleActionCreator.resetRole();
    this._setViewStatus();
  },
  _handleSaveRole: function(roleData) {
    if (roleData.Id) {
      RoleAction.updateRole(roleData);
    } else {
      RoleAction.createRole(roleData);
    }
    this.setState({
      isLoading: true
    });
  },
  _handleDeleteRole: function() {
    RoleAction.deleteRole(RoleStore.getPersistedRole().toJS());

  },
  _toggleList: function() {
    var {closedList} = this.state;
    this.setState({
      closedList: !closedList
    });
  },
  _setAddStatus: function() {
    RoleAction.merge();
    var userDetail = this.refs.pop_user_detail;
    if (userDetail && isFunction(userDetail.clearErrorTextBatchViewbaleTextFiled)) {
      userDetail.clearErrorTextBatchViewbaleTextFiled();
    }
    //  UserAction.setCurrentSelectedId(selectedId);
    this.setState({
      formStatus: formStatus.ADD,
      selectedId: null
    });
  },
  _setEditStatus: function() {
    this.setState({
      formStatus: formStatus.EDIT
    });
  },
  _setViewStatus: function(selectedId = this.state.selectedId) {
    var id = selectedId;
    if (!selectedId) {
      id = this.state.roles[0].Id;
    }
    this.setState({
      formStatus: formStatus.VIEW,
      selectedId: id
    });
  },
  _onChange: function(selectedId) {
    if (!!selectedId) {
      this._setViewStatus(selectedId);
    }
    this.setState({
      roles: RoleStore.getRoleList(),
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
        open={!!this.state.errorTitle}
        onRequestClose={onClose}
        >
    {this.state.errorContent}
      </Dialog>)
    } else {
      return null;
    }
  },
  componentDidMount: function() {
    RoleStore.addChangeListener(this._onChange);
    RoleStore.addErrorChangeListener(this._onError);
    if (RoleStore.getRoleList().length === 0) {
      UserAction.getAllRoles();
      this.setState({
        isLoading: true
      });
    }
  },
  componentWillUnmount: function() {
    RoleStore.removeChangeListener(this._onChange);
    RoleStore.removeErrorChangeListener(this._onError);
  },
  render: function() {
    var that = this,
      isView = this.state.formStatus === formStatus.VIEW;
    var listProps = {
        formStatus: this.state.formStatus,
        onAddBtnClick: that._setAddStatus,
        onRoleClick: that._handlerTouchTap,
        roles: that.state.roles,
        selectedId: that.state.selectedId
      },
      detailProps = {
        ref: 'pop_user_detail',
        role: isView ? RoleStore.getRole(this.state.selectedId) : RoleStore.getUpdatingRole(),
        formStatus: this.state.formStatus,
        setEditStatus: this._setEditStatus,
        handlerCancel: this._handlerCancel,
        handleSaveRole: this._handleSaveRole,
        handleDeleteRole: this._handleDeleteRole,
        toggleList: this._toggleList,
        closedList: this.state.closedList
      };
    let rolelist = (!this.state.closedList) ? <div style={{
      display: 'flex'
    }}><RoleList {...listProps}/></div> : <div style={{
      display: 'none'
    }}><RoleList {...listProps}/></div>;
    if (this.state.isLoading) {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center',
          overflow: 'auto'
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
      {rolelist}
        <RoleDetail {...detailProps}/>
        {that._renderErrorDialog()}
      </div>);
    }

  },
});
module.exports = Role;
