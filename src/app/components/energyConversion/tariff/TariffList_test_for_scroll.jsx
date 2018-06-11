'use strict';

import React from "react";
import ReactDom from 'react-dom';
import classnames from "classnames";
import Item from '../../../controls/SelectableItem.jsx';
import SelectablePanel from '../../../controls/SelectablePanel.jsx';
import TariffStore from '../../../stores/EnergyConversion/TariffStore.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';
var tem_items = [];
var TariffList = createReactClass({
  propTypes: {
    formStatus: PropTypes.bool,
    onTariffClick: PropTypes.func,
    onAddBtnClick: PropTypes.func,
    tariffs: PropTypes.object,
    selectedId: PropTypes.number
  },
  _renderTariffItems: function() {
    var items = [],
      that = this;
    var onItemClick = function(index) {
      that.props.onTariffClick(index);
    };
    that.props.tariffs.forEach(tariff => {
      tem_items.push(tariff.get('Name'));
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
  onScroll: function() {
    var el = ReactDom.findDOMNode(this.refs.list),
      head = ReactDom.findDOMNode(this.refs.header);
    var scrollIndex = parseInt((el.scrollTop - 1) / 58);
    //set scrollTop to scroll el.scrollTop=500
    head.innerText = tem_items[scrollIndex];
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
      <div className="jazz-folder-leftpanel-container">
        <div className="jazz-serviceprovider-sortbar" ref='header'>
               </div>
               <div className="jazz-provider-list" ref='list' onScroll={this.onScroll}>
                 {that._renderTariffItems()}
               </div>
      </div>

      )
  },
});
module.exports = TariffList;
