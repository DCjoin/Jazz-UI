'use strict';

import React from "react";
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import AllCommodityStore from '../../stores/AllCommodityStore.jsx';

var ComAndUom = React.createClass({
  propTypes: {
    isFirst: React.PropTypes.bool,
    selectedItem: React.PropTypes.object,
    mergeItem: React.PropTypes.func,
    isViewStatus: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
      allCommodities: AllCommodityStore.getAllCommodities()
    };
  },
  getDefaultProps() {
    return {
      isFirst: false
    };
  },
  isValid: function() {
    var commodityIsValid = this.refs.commodity.isValid();
    var uomIsValid = this.refs.uom.isValid();
    return commodityIsValid && uomIsValid;
  },
  _onAllCommoditiesChange: function() {
    this.setState({
      allCommodities: AllCommodityStore.getAllCommodities()
    });
  },
  _getCommodityList: function() {
    var allCommodities = this.state.allCommodities;
    let commodityList = [];
    if (allCommodities !== null) {
      allCommodities.forEach(commodity => {
        commodityList.push({
          payload: commodity.Id,
          text: commodity.Comment
        });
      });
    }
    return commodityList;

  },
  _getUomList: function() {
    var allCommodities = this.state.allCommodities;
    var commodityId = this.props.selectedItem.get('CommodityId');
    var uomList = [];
    if (allCommodities !== null) {
      var index = allCommodities.findIndex((item) => {
        if (item.Id === commodityId) {
          return true;
        }
      });
      if (index !== -1) {
        allCommodities[index].Uoms.forEach(uom => {
          uomList.push({
            payload: uom.Id,
            text: uom.Comment
          });
        });
      }
    }
    return uomList;
  },
  componentWillMount: function() {},
  componentDidMount: function() {
    AllCommodityStore.addChangeListener(this._onAllCommoditiesChange);
  },
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {
    AllCommodityStore.removeChangeListener(this._onAllCommoditiesChange);
  },
  render: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    var selectedItem = this.props.selectedItem,
      {CommodityId, UomId} = selectedItem.toJS();
    var commodityProps = {
        ref: 'commodity',
        isViewStatus: isView,
        title: I18N.Setting.Tag.Commodity,
        defaultValue: CommodityId,
        dataItems: me._getCommodityList(),
        didChanged: value => {
          me.props.mergeItem({
            value,
            path: "CommodityId"
          });
        }
      },
      uomProps = {
        ref: 'uom',
        isViewStatus: isView,
        title: I18N.Setting.Tag.Uom,
        defaultValue: UomId,
        dataItems: me._getUomList(),
        didChanged: value => {
          me.props.mergeItem({
            value,
            path: "UomId"
          });
        }
      };
    var first = this.props.isFirst ? null : <div className="pop-customer-detail-content-left-item"></div>;
    return (
      <div>
        {first}
        <div className="pop-customer-detail-content-left-item">
          <ViewableDropDownMenu {...commodityProps}/>
        </div>
        <div className="pop-customer-detail-content-left-item">
          <ViewableDropDownMenu {...uomProps}/>
        </div>
        </div>
      );
  },
});

module.exports = ComAndUom;
