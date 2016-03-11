'use strict';

import React from "react";
import { Checkbox } from 'material-ui';
import Regex from '../../../constants/Regex.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import AllCommodityStore from '../../../stores/AllCommodityStore.jsx';

var VTagBasic = React.createClass({
  propTypes: {
    selectedTag: React.PropTypes.object,
    mergeTag: React.PropTypes.func,
    isViewStatus: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
      allCommodities: AllCommodityStore.getAllCommodities()
    };
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
    var commodityId = this.props.selectedTag.get('CommodityId');
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
  _getCalculationStepList: function() {
    let calculationStepList = [{
      payload: 1,
      text: I18N.Common.AggregationStep.Hourly
    }, {
      payload: 8,
      text: I18N.Common.AggregationStep.Hour2
    }, {
      payload: 9,
      text: I18N.Common.AggregationStep.Hour4
    }, {
      payload: 10,
      text: I18N.Common.AggregationStep.Hour6
    }, {
      payload: 11,
      text: I18N.Common.AggregationStep.Hour8
    }, {
      payload: 12,
      text: I18N.Common.AggregationStep.Hour12
    }, {
      payload: 2,
      text: I18N.Common.AggregationStep.Daily
    }, {
      payload: 3,
      text: I18N.Common.AggregationStep.Monthly
    }, {
      payload: 4,
      text: I18N.Common.AggregationStep.Yearly
    }];
    return calculationStepList;
  },
  _getCalculationTypeList: function() {
    let calculationTypeList = [{
      payload: 1,
      text: I18N.Common.CaculationType.Sum
    }, {
      payload: 2,
      text: I18N.Common.CaculationType.Avg
    }, {
      payload: 3,
      text: I18N.Common.CaculationType.Max
    }, {
      payload: 4,
      text: I18N.Common.CaculationType.Min
    }];
    return calculationTypeList;
  },
  componentWillMount: function() {},
  componentDidMount: function() {
    AllCommodityStore.addChangeListener(this._onAllCommoditiesChange);
  },
  componentWillUnmount: function() {
    AllCommodityStore.removeChangeListener(this._onAllCommoditiesChange);
  },
  componentWillReceiveProps: function(nextProps) {},
  render: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    var selectedTag = this.props.selectedTag,
      {Code, CommodityId, UomId, CalculationStep, CalculationType, Comment} = selectedTag.toJS();
    var codeProps = {
        ref: 'code',
        isViewStatus: isView,
        title: I18N.Setting.Tag.Code,
        defaultValue: Code,
        isRequired: true,
        didChanged: value => {
          me.props.mergeTag({
            value,
            path: "Code"
          });
        }
      },
      commodityProps = {
        ref: 'commodity',
        isViewStatus: isView,
        title: I18N.Setting.Tag.Commodity,
        defaultValue: CommodityId,
        dataItems: me._getCommodityList(),
        didChanged: value => {
          me.props.mergeTag({
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
          me.props.mergeTag({
            value,
            path: "UomId"
          });
        }
      },
      calculationStepProps = {
        ref: 'calculationStep',
        isViewStatus: isView,
        title: I18N.Setting.Tag.CalculationStep,
        defaultValue: CalculationStep,
        dataItems: me._getCalculationStepList(),
        didChanged: value => {
          me.props.mergeTag({
            value,
            path: "CalculationStep"
          });
        }
      },
      calculationTypeProps = {
        ref: 'calculationType',
        isViewStatus: isView,
        title: I18N.Setting.Tag.CalculationType,
        defaultValue: CalculationType,
        dataItems: me._getCalculationTypeList(),
        didChanged: value => {
          me.props.mergeTag({
            value,
            path: "CalculationType"
          });
        }
      },
      commentProps = {
        ref: 'comment',
        isViewStatus: isView,
        title: I18N.Setting.Tag.Comment,
        defaultValue: Comment,
        isRequired: false,
        multiLine: true,
        maxLen: null,
        didChanged: value => {
          me.props.mergeTag({
            value,
            path: "Comment"
          });
        }
      };
    var comment = !Comment && isView ? null : (<div className="pop-customer-detail-content-left-item">
        <ViewableTextField {...commentProps}/>
      </div>);
    return (
      <div className={"pop-customer-detail-content"}>
        <div className="pop-customer-detail-content-left">
          <div className="pop-customer-detail-content-left-item">
            <ViewableTextField {...codeProps}/>
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableDropDownMenu {...commodityProps}/>
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableDropDownMenu {...uomProps}/>
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableDropDownMenu {...calculationStepProps}/>
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableDropDownMenu {...calculationTypeProps}/>
          </div>
          {comment}
        </div>
      </div>
      );
  },
});

module.exports = VTagBasic;
