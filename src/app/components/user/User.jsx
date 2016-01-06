'use strict';

import React from "react";
import classnames from "classnames";
import { Table, TableHeader, TableBody, TableRow, TableHeaderColumn, TableRowColumn, TableFooter, CircularProgress } from 'material-ui';
import { isObject, isFunction } from "lodash/lang";
import UserStore from '../../stores/UserStore.jsx';
import UserAction from '../../actions/UserAction.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import UserList from './UserList.jsx';
//import UserFilter from './UserFilter.jsx';

var User = React.createClass({
  getInitialState: function() {
    return {
      formStatus: formStatus.VIEW,
      showFilter: false,
      infoTab: true,
      allCustomers: [],
      allRoles: [],
      selectedUserId: null,
      isLoading: false,
    };
  },
  _onAllCostomersListChange: function() {
    this.setState({
      allCustomers: UserStore.getAllCostomers(),
    });
  },
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
  _handlerTouchTap: function(selectedId) {
    this._setViewStatus(selectedId);
  },
  _handleShowFilterSideNav: function() {
    this.setState({
      showFilter: true
    });
  //this._setViewStatus();
  },
  _resetFilter() {
    UserAction.resetFilter();
  },
  componentDidMount: function() {
    UserStore.addAllCostomersListListener(this._onAllCostomersListChange);
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
    UserStore.removeAllCostomersListListener(this._onAllCostomersListChange);
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
      };
    var filterPanel = null;
    // if (this.state.showFilter) {
    //   filterPanel = <UserFilter ref="pop_user_filter_side_nav" {...filterProps}/>;
    // }
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
          <UserList {...listProps} />
          { filterPanel }
        </div>
        </div>
        );
    }

  },
});

module.exports = User;
