'use strict';
import PropTypes from 'prop-types';
import React from "react";
import classnames from "classnames";
import Item from '../../../controls/SelectableItem.jsx';
import SelectablePanel from '../../../controls/SelectablePanel.jsx';
import RoleStore from '../../../stores/RoleStore.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
var createReactClass = require('create-react-class');
var RoleList = createReactClass({
  propTypes: {
    formStatus: PropTypes.bool,
    onRoleClick: PropTypes.func,
    onAddBtnClick: PropTypes.func,
    roles: PropTypes.object,
    selectedId: PropTypes.number
  },
  _renderRoleItems: function() {
    var items = [],
      that = this;
    var onItemClick = function(index) {
      that.props.onRoleClick(index);
    };
    that.props.roles.forEach(role => {
      let props = {
        index: role.Id,
        label: role.Name,
        selectedIndex: that.props.selectedId,
        onItemClick: onItemClick
      };
      items.push(<Item {...props}/>);
    });
    return items;
  },

  render: function() {
    var that = this;
    var props = {
      addBtnLabel: I18N.Setting.Role.AddRole,
      onAddBtnClick: that.props.onAddBtnClick,
      isViewStatus: that.props.formStatus === formStatus.VIEW,
      isLoading: false,
      contentItems: that._renderRoleItems(),
    };
    return (
      <SelectablePanel {...props}/>
      )
  },
});
module.exports = RoleList;
