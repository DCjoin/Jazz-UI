'use strict';

import React from "react";
import classnames from "classnames";
import CircularProgress from 'material-ui/CircularProgress';
import isFunction from 'lodash-es/isFunction';
import isObject from 'lodash-es/isObject';
import UserStore from '../../../stores/UserStore.jsx';
import UserAction from '../../../actions/UserAction.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import UserList from './UserList.jsx';
import UserFilter from './UserFilter.jsx';
import UserDetail from './UserDetail.jsx';
import NewDialog from '../../../controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
var createReactClass = require('create-react-class');
var User = createReactClass({
  getInitialState: function() {
    return {
      formStatus: formStatus.VIEW,
      showFilter: false,
      infoTab: true,
      //allCustomers: [],
      allRoles: null,
      selectedUserId: null,
      isLoading: false,
      resetPasswordDone: false,
      errorTitle: null,
      errorContent: null
    };
  },
  // _onAllCostomersListChange: function() {
  //   this.setState({
  //     allCustomers: UserStore.getAllCostomers(),
  //   });
  // },
  _onAllRolesListChange: function() {
    this.setState({
      allRoles: UserStore.getAllRoles(),
    });
  },
  // _onAllUsersListChange: function() {
  //   this.setState({
  //     allUsers: UserStore.getAllUsers(),
  //     selectedUserId: (UserStore.getAllUsers().length > 0 ? UserStore.getAllUsers()[0].Id : null),
  //   });
  // },
  _onChange: function(selectedId) {
    if (!!selectedId) {
      this._setViewStatus(selectedId);
    }
    this.setState({
      users: UserStore.getFilterUsers(),
      isLoading: false,
      errorTitle: null,
      errorContent: null
    });
  },
  _setViewStatus: function(selectedId = this.state.selectedUserId) {
    var infoTab = this.state.infoTab;
    if (!selectedId) {
      selectedId = this.state.users.getIn([0, "Id"]);
    }

    if (this.state.selectedUserId != selectedId) {
      infoTab = true;
    }

    this.setState({
      infoTab: infoTab,
      formStatus: formStatus.VIEW,
      selectedUserId: selectedId
    });
  },
  _setAddStatus: function() {
    this.setState({
      infoTab: true,
      formStatus: formStatus.ADD,
      selectedUserId: null
    });
  },
  _setEditStatus: function() {
    this.setState({
      formStatus: formStatus.EDIT
    });
  },
  _handlerTouchTap: function(selectedId) {
    this._setViewStatus(selectedId);
    if (this.state.selectedUserId != selectedId) {
      UserAction.setCurrentSelectedId(selectedId);
    }

  },
  _handleShowFilterSideNav: function() {
    this.setState({
      showFilter: true
    });
  //this._setViewStatus();
  },
  _handleFilter() {
    UserAction.setFilterObj();
    if (this.refs.pop_user_filter_side_nav) {
      this.refs.pop_user_filter_side_nav.close();
    }
    this.setState({
      formStatus: formStatus.VIEW,
      infoTab: true
    });
  },
  _handleCloseFilterSideNav: function() {
    UserAction.resetFilterObj();
    this.setState({
      showFilter: false
    });
  },
  _handleSaveUser: function(infoTab, infoData, roleData) {
    if (infoTab) {
      if (infoData.Id) {
        UserAction.updateUserInfo(infoData);
      } else {
        UserAction.createUserInfo(infoData);
      }
    } else {
      UserAction.saveCustomerByUser(roleData);
    }
    this.setState({
      isLoading: true,
    });
  },
  _handleDeleteUser(userId) {
    UserAction.deleteUser(UserStore.getUser(this.state.selectedUserId).toJS());
    this.setState({
      formStatus: formStatus.VIEW
    });
  },
  _handlerCancel: function() {
    UserAction.reset();
    this._setViewStatus(this.state.selectedUserId);
  },
  _resetFilter() {
    UserAction.resetFilter();
  },
  _resetPasswordDone() {
    this.setState({
      resetPasswordDone: true
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
        formStatus: formStatus.VIEW,
        isLoading: true
      });
      UserAction.getCustomerByUser(this.state.selectedUserId);
    }
  },
  _getUserCustomerPermission(customerId, isView) {
    // if( isView ) {
    // 	UserActionCreator.getUserCustomerPermission(this.props.params.userId, customerId);
    // } else {
    UserAction.getUserCustomerPermission(this.state.selectedUserId, customerId, false);
  // }
  },

  _toggleList() {
    var {closedList} = this.state;
    this.setState({
      closedList: !closedList
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
      return (<NewDialog
        ref = "_dialog"
        title={this.state.errorTitle}
        modal={false}
        open={!!this.state.errorTitle}
        onRequestClose={onClose}
        >
    {this.state.errorContent}
      </NewDialog>)
    } else {
      return null;
    }
  },
  componentDidMount: function() {

    UserStore.addAllRolesListListener(this._onAllRolesListChange);
    UserStore.addResetPasswordListener(this._resetPasswordDone);
    UserStore.addChangeListener(this._onChange);
    UserStore.addErrorChangeListener(this._onError);
    UserAction.getAllCustomers();
    UserAction.getAllRoles();
    this.setState({
      isLoading: true
    });

  },
  componentWillUnmount: function() {

    UserStore.removeAllRolesListListener(this._onAllRolesListChange);
    UserStore.removeResetPasswordListener(this._resetPasswordDone);
    UserStore.removeChangeListener(this._onChange);
    UserStore.removeErrorChangeListener(this._onError);
    UserAction.clearAll();
  },
  render: function() {
    var that = this,
      selectedId = this.state.selectedUserId,
      isView = this.state.formStatus === formStatus.VIEW,

      listProps = {
        users: this.state.users,
        selectedId: selectedId,
        formStatus: that.state.formStatus,
        handlerTouchTap: that._handlerTouchTap,
        setAddStatus: that._setAddStatus,
        resetFilter: that._resetFilter,
        handleShowFilterSideNav: that._handleShowFilterSideNav
      },
      detailProps = {
        closedList: that.state.closedList,
        formStatus: that.state.formStatus,
        selectedId: selectedId,
        customers: isView ? UserStore.getUserCustomers() : UserStore.getUpdatingUserCustomers(),
        // loadingStatus				: this.state.loadingStatus,

        ref: "pop_user_detail",

        user: UserStore.getUser(selectedId, isView),
        userRoleList: that.state.allRoles,
        infoTab: that.state.infoTab,
        setEditStatus: that._setEditStatus,
        _handleResetPassword: function() {
          let callbackURL = location.href;// encodeURIComponent?
          UserAction.resetPassword(selectedId, callbackURL);
        },
        handleSaveUser: that._handleSaveUser,
        _handleDeleteUser: that._handleDeleteUser,
        handleCancel: that._handlerCancel,
        _handlerSwitchTab: that._switchTab,
        _getUserCustomerPermission: that._getUserCustomerPermission,
        _toggleList: this._toggleList
      },
      filterProps = {
        customers: UserStore.getAllCostomers(),
        userRoleList: UserStore.getAllRoles(),
        handleFilter: that._handleFilter,
        onClose: that._handleCloseFilterSideNav,
        filterObj: UserStore.getFilterObj()
      };
    var filterPanel = null;
    if (this.state.showFilter) {
      filterPanel = <UserFilter ref="pop_user_filter_side_nav" {...filterProps}/>;
    }
    if (this.state.isLoading || this.state.allRoles===null) {
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
      let userList = (!this.state.closedList) ? <div style={{
        display: 'flex',
        width: '320px'
      }}><UserList {...listProps}/></div> : <div style={{
        display: 'none'
      }}><UserList {...listProps}/></div>;
      return (

        <div style={{
          display: 'flex',
          flex: 1
        }}>
        {userList}
          { filterPanel }
          <NewDialog open={that.state.resetPasswordDone} modal={true} actions={[
                      <FlatButton label={I18N.Mail.Send.Ok} onTouchTap={() => {
                        that.setState({
                          resetPasswordDone: false
                        });
                      }} />
                    ]}>{I18N.Setting.User.SendEmailSuccess}</NewDialog>
        <UserDetail {...detailProps} />
        {that._renderErrorDialog()}
        </div>
        );
    }

  },
});

module.exports = User;
