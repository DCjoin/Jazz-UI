'use strict';

import React from "react";
import PropTypes from 'prop-types';
import Item from '../../../controls/SelectableItem.jsx';
import SelectablePanel from '../../../controls/SelectablePanel.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
var createReactClass = require('create-react-class');
var VEEList = createReactClass({
  propTypes: {
    formStatus: PropTypes.string,
    onRuleClick: PropTypes.func,
    onAddBtnClick: PropTypes.func,
    rules: PropTypes.object,
    selectedId: PropTypes.number
  },
  _renderRuleItems: function() {
    var items = [],
      that = this;
    var onItemClick = function(index) {
      that.props.onRuleClick(index);
    };
    that.props.rules.forEach(rule => {

      let props = {
        index: rule.get('Id'),
        label: rule.get('Name'),
        selectedIndex: that.props.selectedId,
        onItemClick: onItemClick,
        key: rule.get('Id'),
      };
      items.push(<Item {...props}/>);
    });
    return items;
  },
  render: function() {
    var props = {
      addBtnLabel: I18N.Setting.VEEMonitorRule.Rule,
      onAddBtnClick: this.props.onAddBtnClick,
      isAddStatus: this.props.formStatus === formStatus.ADD,
      isLoading: false,
      contentItems: this._renderRuleItems(),
    };
    return (
      <SelectablePanel {...props}/>
      )
  }
});
module.exports = VEEList;
