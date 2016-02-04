'use strict';

import React from 'react';

import { List, Map } from 'immutable';

import { RaisedButton, Checkbox } from 'material-ui';

import SideNav from '../../../controls/SideNav.jsx';
import Dialog from '../../../controls/PopupDialog.jsx';
import Loading from './Loading.jsx';
import HierarchyTree from '../../../controls/tree/Tree.jsx';

import UserStore from '../../../stores/UserStore.jsx';
import _forEach from 'lodash/collection/forEach';
import _find from 'lodash/collection/find';
import _filter from 'lodash/collection/filter';
import _isEmpty from 'lodash/lang/isEmpty';
import _isArray from 'lodash/lang/isArray';
import _isFunction from 'lodash/lang/isFunction';
import _remove from 'lodash/array/remove';

var _ = {
  forEach: _forEach,
  find: _find,
  filter: _filter,
  isEmpty: _isEmpty,
  isArray: _isArray,
  isFunction: _isFunction,
  remove: _remove
};

var _getChildren = function(children = new List(), node = [], selected = false) {

  if (!children) {
    children = new List();
  }
  children.forEach(child => {

    if (!selected || (selected && child.get("HasDataPrivilege") && !_.find(node, item => item.Id == child.get("Id")))) {
      node.push({
        Id: child.get("Id")
      });
    }

    var _children = child.get("Children");
    if (!!_children) {
      if (_children.size > 0) {
        _getChildren(_children, node, selected);
      }
    }

  });
  return node;
};

var _getSelectedChildren = function(children = new List(), selectedNode = []) {
  return _getChildren(children, selectedNode, true);
};

var _setSelectedChildren = function(children, selectedId, isRoot = true) {

  if (isRoot) {
    selectedId = selectedId.map(item => {
      return item.Id;
    });
  }

  _.forEach(children, child => {

    child.HasDataPrivilege = !_.isEmpty(_.remove(selectedId, Id => Id === child.Id));

    var _children = child.Children;
    if (_.isArray(_children) && !_.isEmpty(_children)) {
      _setSelectedChildren(_children, selectedId, false);
    }
  });
  return children;
};

let UserCustomerPermission = React.createClass({

  getDefaultProps: function() {
    return {
      isView: React.PropTypes.bool
    };
  },

  getInitialState: function() {
    return {
      selectedId: null,
      customer: new Map(),
      open: false,
      selectedNode: []
    };
  },

  componentDidMount: function() {
    UserStore.addChangeCustomerPermissionListener(this._onChange);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.open !== this.state.open) {
      if (this.state.open) {
        if (!this.props.isView) {
          this.refs.pop_user_customer_permission_dialog.show();
        }
      }
    }
    var selectAll = this.refs.pop_user_customer_permission_selecte_all,
      {customer, selectedNode, selectedId} = this.state,
      children = customer.getIn(["dataPrivilege", "Children"]),
      checkedAll = false;

    if (!selectAll || !children) {
      return;
    }
    if (selectedNode.length && _getChildren(children).length < selectedNode.length) {
      checkedAll = true;
    }
    selectAll.setChecked(checkedAll);

  },

  componentWillUnmount: function() {
    UserStore.removeChangCustomerPermissionListener(this._onChange);
  },

  render: function() {
    var content,
      {selectedId, customer, open, selectedNode} = this.state;
    if (!open) {
      return null;
    }
    if (!customer.get("dataPrivilege")) {
      content = <Loading showImmediately={true}/>;
    } else {
      var props = {
        allDisabled: this.props.isView,
        allNode: customer.get("dataPrivilege"),
        checkedNodes: selectedNode,
        onSelectNode: this._onSelectNode,
        nodeOriginPaddingLeft: 0,
        allHasCheckBox: true,
        disableFirstNode: true
      }

      if (!this.props.isView) {
        props.enabledChangeDataPrivilege = true;
        props.treeClass = "pop-user-customer-permission-dialog-tree dialog-scroll";
      }
      content = (
        <div style={{
          display: "flex",
          flexDirection: "column",
          width: "100%"
        }}>
					<div className="pop-user-customer-permission-dialog-header">
						<Checkbox disabled={this.props.isView} onCheck={this._selectedAll} ref="pop_user_customer_permission_selecte_all" style={{
          width: "auto"
        }}/>
						<div className="pop-user-customer-permission-dialog-header-label">
							<span className="pop-user-customer-permission-dialog-header-label-title" onClick={this._selectedAll}>{I18N.Setting.User.WholeCustomer}</span>
							<span className="pop-user-customer-permission-dialog-header-label-detail">{I18N.Setting.User.WholeCustomerTip}</span>
						</div>
					</div>
					<HierarchyTree {...props} />
				</div>
      );
    }


    if (this.props.isView) {
      let titleStyle = {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      };
      return (
        <SideNav side="right" onClose={this.onClose} ref="pop_user_customer_permission_side_nav">
					<div className="pop-user-customer-permission-side-nav-wrapper">
						<div className="pop-user-customer-permission-side-nav-header sidebar-title" style={titleStyle} title={customer.get("CustomerName")}>{customer.get("CustomerName")}</div>
						{content}
					</div>
				</SideNav>
        );
    } else {
      var buttonStyle = {
        boxShadow: "none"
      };
      return (
        <div className="pop-user-customer-permission-dialog-wrapper">
					<Dialog
        bodyStyle={{
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}
        contentClassName="pop-user-customer-permission-dialog-wrapper-content"
        contentInnerStyle={{
        }} ref="pop_user_customer_permission_dialog"
        openImmediately={true}
        onDismiss={this.onClose}
        modal={true}>

						<div className="pop-user-customer-permission-dialog-title">{I18N.Setting.Labeling.EditDataPermission}</div>
						<div className="pop-user-customer-permission-dialog-content">
							{content}
						</div>
						{!!customer.get("dataPrivilege") ?
          <div className="pop-user-customer-permission-dialog-footer">
							<RaisedButton style={buttonStyle} labelStyle={{
            color: "inherit"
          }} label={I18N.Baseline.Button.Save} onClick={this._save} />
							<RaisedButton style={buttonStyle} label={I18N.Baseline.Button.Cancel} onClick={this._close} />
						</div>
          : null}
					</Dialog>
				</div>
        );
    }
  },

  _onChange: function() {
    var customer = UserStore.getUserCustomer(this.state.selectedId),
      children = customer.getIn(["dataPrivilege", "Children"]),
      hierarchyIds = customer.get("HierarchyIds").map(Id => {
        return {
          Id
        };
      }),
      hierarchyIds = _.isFunction(hierarchyIds.toJS) ? hierarchyIds.toJS() : hierarchyIds,
      selectedNode = customer.get("WholeCustomer") ? _getChildren(children) : hierarchyIds;
    if (customer.get("WholeCustomer")) {
      selectedNode.push({
        Id: this.state.selectedId
      });
    }
    this.setState({
      customer,
      selectedNode
    });
  },

  _onSelectNode: function(node, event) {
    var _selectedNode = this.state.selectedNode;

    if ((_selectedNode = _.filter(_selectedNode, (item) => {
        return item.Id != node.get("Id")
        })).length === this.state.selectedNode.length) {
        _selectedNode.push(node.toJS());
      }
      ;

      this.setState({
        selectedNode: _selectedNode
      });
    },

    _selectedAll: function(event) {
      var selectAll = this.refs.pop_user_customer_permission_selecte_all,
        targetIsCheckbox = !event.view;

      if (!selectAll) {
        return;
      }

      var isCheckedAll = targetIsCheckbox === selectAll.isChecked();
      if (isCheckedAll) {
        var selectedNode = _getChildren(this.state.customer.getIn(["dataPrivilege", "Children"]));
        selectedNode.push({
          Id: this.state.selectedId
        })
        this.setState({
          selectedNode
        });
      } else {
        this.setState({
          selectedNode: []
        });
      }
    },

    _save: function() {
      var {customer, selectedNode, selectedId} = this.state,
        hierarchyIds = /*_.filter(*/ selectedNode.map(node => node.Id) /*, Id => Id !== selectedId)*/ ,
        selectedAll = false;

      if (this.props.saveCustomerPermission) {
        var allIds = _getChildren(this.state.customer.getIn(["dataPrivilege", "Children"]));
        if (allIds.length === hierarchyIds.length - 1) {
          hierarchyIds = [];
          selectedAll = true;
        }
        this.props.saveCustomerPermission(selectedId, hierarchyIds, selectedAll);
      }
      this._close();
    },

    _close: function() {
      if (this.refs.pop_user_customer_permission_dialog) {
        this.refs.pop_user_customer_permission_dialog.dismiss();
      }
    },

    open: function(selectedId, customer) {
      var children = customer.getIn(["dataPrivilege", "Children"]),
        hierarchyIds = customer.get("HierarchyIds").map(Id => {
          return {
            Id
          };
        }),
        hierarchyIds = _.isFunction(hierarchyIds.toJS) ? hierarchyIds.toJS() : hierarchyIds,
        selectedNode = customer.get("WholeCustomer") ? _getChildren(children) : hierarchyIds;
      if (customer.get("WholeCustomer")) {
        selectedNode.push({
          Id: selectedId
        });
      }
      this.setState({
        selectedId,
        open: true,
        customer,
        selectedNode
      });
    },

    onClose: function() {
      this.setState({
        selectedId: null,
        open: false
      });
    }

  });

  module.exports = UserCustomerPermission;
