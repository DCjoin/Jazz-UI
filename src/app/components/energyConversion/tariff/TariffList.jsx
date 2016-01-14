'use strict';

import React from "react";
import classnames from "classnames";
import Item from '../../../controls/SelectableItem.jsx';
import SelectablePanel from '../../../controls/SelectablePanel.jsx';
import TariffStore from '../../../stores/energyConversion/TariffStore.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';

var TariffList = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.bool,
    onTariffClick: React.PropTypes.func,
    onAddBtnClick: React.PropTypes.func,
    tariffs: React.PropTypes.object,
    selectedId: React.PropTypes.number
  },
  _renderTariffItems: function() {
    var items = [],
      that = this;
    var onItemClick = function(index) {
      that.props.onTariffClick(index);
    };
    that.props.tariffs.forEach(tariff => {

      let props = {
        index: tariff.get('Id'),
        label: tariff.get('Name'),
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
      addBtnLabel: I18N.Setting.TOUTariff.TOUSetting,
      onAddBtnClick: that.props.onAddBtnClick,
      isViewStatus: that.props.formStatus === formStatus.VIEW,
      isLoading: false,
      contentItems: that._renderTariffItems(),
    };
    return (
      <SelectablePanel {...props}/>
      )
  },
});
module.exports = TariffList;
