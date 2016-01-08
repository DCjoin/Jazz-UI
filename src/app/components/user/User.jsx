'use strict';

import React from "react";
import classnames from "classnames";
import { Table, TableHeader, TableBody, TableRow, TableHeaderColumn, TableRowColumn, TableFooter, CircularProgress } from 'material-ui';
import { isObject, isFunction } from "lodash/lang";
import UserStore from '../../stores/UserStore.jsx';
import UserAction from '../../actions/UserAction.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import UserList from './UserList.jsx';
import UserFilter from './UserFilter.jsx';
import UserDetail from './UserDetail.jsx';

var User = React.createClass({
  getInitialState: function() {
    return {
      formStatus: formStatus.VIEW,
      showFilter: false,
      infoTab: true,
      //allCustomers: [],
      allRoles: [],
      selectedUserId: null,
      isLoading: false,
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
      isLoading: false
    });
  },
  _setViewStatus: function(selectedId) {
    var infoTab = this.state.infoTab;
    // if (!selectedId || isObject(selectedId)) {
    //   if (UserStore.getPersistedUser().has("Id")) {
    //     selectedId = UserStore.getPersistedUser().get("Id");
    //   }
    // }
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
    var userDetail = this.refs.pop_user_detail;
    if (userDetail && isFunction(userDetail.clearErrorTextBatchViewbaleTextFiled)) {
      userDetail.clearErrorTextBatchViewbaleTextFiled();
    }

    this.setState({
      infoTab: true,
      formStatus: formStatus.ADD
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
    // if (infoTab) {
    //   if (infoData.Id) {
    //     UserAction.updateUserInfo(infoData, CurrentUserCustomerStore.getCurrentUser().SpId);
    //   } else {
    //     UserAction.createUserInfo(infoData, CurrentUserCustomerStore.getCurrentUser().SpId);
    //   }
    // } else {
    //   UserAction.saveCustomerByUser(roleData, CurrentUserCustomerStore.getCurrentUser().SpId);
    // }
    //ajaxing = true;
  },
  _handleDeleteUser(userId) {
    UserAction.deleteUser(UserStore.getUser(get(this.props, "params.userId")).toJS());
    this.setState({
      formStatus: formStatus.VIEW
    });
  },
  _handlerCancel: function() {
    UserAction.reset();
    this._setViewStatus();
  },
  _resetFilter() {
    UserAction.resetFilter();
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
      UserAction.getCustomerByUser(this.state.selectedUserId);
    }
  },
  _getUserCustomerPermission(customerId, isView) {
    // if( isView ) {
    // 	UserActionCreator.getUserCustomerPermission(this.props.params.userId, customerId);
    // } else {
    UserAction.getUserCustomerPermission(this.state.selectedUserId, customerId);
  // }
  },

  _toggleList() {
    var {closedList} = this.state;
    this.setState({
      closedList: !closedList
    });
  },
  componentDidMount: function() {
    //UserStore.addAllCostomersListListener(this._onAllCostomersListChange);
    UserStore.addAllRolesListListener(this._onAllRolesListChange);
    //UserStore.addAllUsersListListener(this._onAllUsersListChange);
    UserStore.addChangeListener(this._onChange);
    UserAction.getAllCustomers();
    UserAction.getAllRoles();
    this.setState({
      isLoading: true
    });
  //UserAction.getAllUsers();
  },
  componentWillUnmount: function() {
    //UserStore.removeAllCostomersListListener(this._onAllCostomersListChange);
    UserStore.removeAllRolesListListener(this._onAllRolesListChange);
    //  UserStore.removeAllUsersListListener(this._onAllUsersListChange);
    UserStore.removeChangeListener(this._onChange);
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
          //UserAction.resetPassword(selectedId);
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
        <div className="pop-manage-wrapper pop-framework">
            <div className={classnames({
          "pop-manage-list-wrapper": true,
          "closed": this.state.closedList
        })}>
          <UserList {...listProps}/>
          { filterPanel }
        </div>
        <UserDetail {...detailProps} />
        </div>
        );
    }

  },
});

module.exports = User;
