'use strict';

import React from "react";
import classnames from "classnames";
import Item from '../../../controls/SelectableItem.jsx';
import SelectablePanel from '../../../controls/SelectablePanel.jsx';
import CarbonStore from '../../../stores/energyConversion/CarbonStore.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';
var CarbonList = createReactClass({
  propTypes: {
    formStatus: PropTypes.bool,
    onCarbonClick: PropTypes.func,
    onAddBtnClick: PropTypes.func,
    carbons: PropTypes.object,
    selectedId: PropTypes.number
  },
  _renderCarbonItems: function() {
    var items = [],
      that = this;
    var onItemClick = function(index) {
      that.props.onCarbonClick(index);
    };
    that.props.carbons.forEach(carbon => {
      let sourceCommodity = carbon.getIn(['ConversionPair', 'SourceCommodity', 'Comment']),
        sourceUom = carbon.getIn(['ConversionPair', 'SourceUom', 'Comment']),
        destinationCommodity = carbon.getIn(['ConversionPair', 'DestinationCommodity', 'Comment']),
        destinationUom = carbon.getIn(['ConversionPair', 'DestinationUom', 'Comment']);

      let props = {
        index: carbon.get('Id'),
        label: sourceCommodity + ' ( ' + sourceUom + ' ) ' + '- ' + destinationCommodity + ' ( ' + destinationUom + ' )',
        selectedIndex: that.props.selectedId,
        onItemClick: onItemClick
      };
      items.push(<Item {...props}/>);
    });
    return items;
  },
  _onChange: function() {
    this.setState({
      selectableCarbons: CarbonStore.getSelectableCarbons(),
    });
  },
  getInitialState: function() {
    return {
      selectableCarbons: CarbonStore.getSelectableCarbons()
    }
  },
  componentDidMount: function() {
    CarbonStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    CarbonStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var that = this;
    var props = {
      addBtnLabel: I18N.Setting.CarbonFactor.Title,
      onAddBtnClick: that.props.onAddBtnClick,
      isViewStatus: that.props.formStatus === formStatus.VIEW && this.state.selectableCarbons.size > 0,
      isLoading: false,
      contentItems: that._renderCarbonItems(),
    };
    return (
      <SelectablePanel {...props}/>
      )
  },
});
module.exports = CarbonList;
