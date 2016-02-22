'use strict';

import React from "react";
import Item from '../../controls/SelectableItem.jsx';
import SelectablePanel from '../../controls/SelectablePanel.jsx';
import VEEStore from '../../stores/VEEStore.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';

var VEEList = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.bool,
    onRuleClick: React.PropTypes.func,
    onAddBtnClick: React.PropTypes.func,
    rules: React.PropTypes.object,
    selectedId: React.PropTypes.number
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
        onItemClick: onItemClick
      };
      items.push(<Item {...props}/>);
    });
    return items;
  },
  render: function() {
    var props = {
      addBtnLabel: I18N.Setting.VEEMonitorRule.Rule,
      onAddBtnClick: this.props.onAddBtnClick,
      isViewStatus: this.props.formStatus === formStatus.VIEW,
      isLoading: false,
      contentItems: this._renderRuleItems(),
    };
    return (
      <SelectablePanel {...props}/>
      )
  }
});
module.exports = VEEList;
