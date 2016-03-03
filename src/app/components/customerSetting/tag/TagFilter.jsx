'use strict';
import React from 'react';
import { SelectField } from 'material-ui';

import SideNav from '../../../controls/SideNav.jsx';
import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import LinkButton from '../../../controls/LinkButton.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';


import _isObject from "lodash/lang/isObject";
import _get from 'lodash/object/get';

var _ = {
  isObject: _isObject,
  get: _get
};

var TagFilter = React.createClass({
  propTypes: {
    handleFilter: React.PropTypes.func,
    onClose: React.PropTypes.func,
    mergeFilterObj: React.PropTypes.func,
    filterObj: React.PropTypes.object
  },
  _bindChangeFilter: function(paths, isClear) {
    if (isClear) {
      return this._mergeFilterObj.bind(this, paths, null);
    }
    return this._mergeFilterObj.bind(this, paths);
  },

  _mergeFilterObj: function(paths, event, value = "") {
    if (!_.isObject(event)) {
      value = event;
    } else {
      value = _.get(event, "target.value");
    }
    this.props.mergeFilterObj({
      path: paths,
      value: value
    });
  },

  _getCommodityList: function() {
    let commodityList = [];
    window.allCommodities.forEach(commodity => {
      commodityList.push({
        payload: commodity.Id,
        text: commodity.Comment
      });
    });
    return commodityList;
  },
  _getUomList: function() {
    let uomList = [];
    window.uoms.forEach(uom => {
      uomList.push({
        payload: uom.Id,
        text: uom.Comment
      });
    });
    return uomList;
  },
  _getAccumulatedList: function() {
    let accumulatedList = [
      {
        payload: 1,
        text: I18N.Setting.Tag.isAccumulated
      },
      {
        payload: 2,
        text: I18N.Setting.Tag.isNotAccumulated
      }
    ];
    return accumulatedList;
  },

  close: function() {
    if (this.refs.pop_user_filter_side_nav) {
      this.refs.pop_user_filter_side_nav.closeNav();
    }
  },

  getInitialState: function() {
    return {
      showNav: false,
    };
  },

  componentDidMount: function() {
    this.setState({
    });
  },


  render: function() {
    var inputStyle = {
        width: 256
      },
      menuItemStyle = {
        "overflow": "hidden",
        "textOverflow": "ellipsis",
        "width": 184
      };
    var filterObj = this.props.filterObj;
    return (
      <SideNav open={true} ref="pop-user_filter_side_nav" onClose={this.props.onClose}>
				<div className="pop-user-filter-side-nav-wrapper">
					<div className="pop-user-filter-side-nav-header sidebar-title">{I18N.Setting.Tag.TagFilter}</div>
					<div className="sidebar-content pop-user-filter-side-nav-content">
						<div className="pop-user-filter-side-nav-content-item sidebar-content-item">
							<div className="pop-user-filter-side-nav-content-item-header">
								<div className="pop-user-filter-side-nav-content-item-header-title">{I18N.Setting.Tag.Commodity}</div>
								<LinkButton disabled={!filterObj.CommodityId} onClick={this._bindChangeFilter("CommodityId", true)} label={I18N.Setting.User.Cancel}/>
							</div>
							<div className="pop-user-filter-side-nav-content-item-input pop-viewableSelectField">
                <ViewableDropDownMenu style={inputStyle} menuItemStyle={menuItemStyle} dataItems={this._getCommodityList()} defaultValue={filterObj.CommodityId} hintText={I18N.Setting.Tag.Commodity} didChanged={this._bindChangeFilter("CommodityId")}>
								</ViewableDropDownMenu>
							</div>
						</div>

						<div className="pop-user-filter-side-nav-content-item sidebar-content-item">
							<div className="pop-user-filter-side-nav-content-item-header">
								<div className="pop-user-filter-side-nav-content-item-header-title">{I18N.Setting.Tag.Uom}</div>
								<LinkButton disabled={!filterObj.UomId} onClick={this._bindChangeFilter("UomId", true)} label={I18N.Setting.User.Cancel}/>
							</div>
							<div className="pop-user-filter-side-nav-content-item-input pop-viewableSelectField">
                <ViewableDropDownMenu style={inputStyle} menuItemStyle={menuItemStyle} dataItems={this._getUomList()} defaultValue={filterObj.UomId} hintText={I18N.Setting.Tag.Uom} didChanged={this._bindChangeFilter("UomId")}>
								</ViewableDropDownMenu>
							</div>
						</div>

						<div className="pop-user-filter-side-nav-content-item sidebar-content-item">
							<div className="pop-user-filter-side-nav-content-item-header">
								<div className="pop-user-filter-side-nav-content-item-header-title">{I18N.Setting.Tag.Type}</div>
								<LinkButton disabled={!filterObj.IsAccumulated} onClick={this._bindChangeFilter("IsAccumulated", true)} label={I18N.Setting.User.Cancel}/>
							</div>
							<div className="pop-user-filter-side-nav-content-item-input pop-viewableSelectField">
                <ViewableDropDownMenu style={inputStyle} menuItemStyle={menuItemStyle} dataItems={this._getAccumulatedList()} defaultValue={filterObj.IsAccumulated} hintText={I18N.Setting.Tag.Type} didChanged={this._bindChangeFilter("IsAccumulated")}>
								</ViewableDropDownMenu>
							</div>
						</div>
					</div>
					<div className="sidebar-bottom-action">
						<FlatButton label={I18N.Common.Button.Filter} onClick={this.props.handleFilter} labelStyle={{
        color: "#00BCD4"
      }} style={{
        color: '#abafae',
        height: '48px',
        width: '100%'
      }} />
					</div>
				</div>
			</SideNav>
      );
  }
});

module.exports = TagFilter;