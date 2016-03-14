'use strict';

import React from "react";
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import ComAndUom from '../ComAndUom.jsx';

var LabelBasic = React.createClass({
  propTypes: {
    selectedLabel: React.PropTypes.object,
    mergeLabel: React.PropTypes.func,
    isViewStatus: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
    };
  },
  _mergeLabel: function(data) {
    if (this.props.mergeLabel) {
      this.props.mergeLabel(data);
    }
  },
  _getKpiTypelist: function() {},
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
  componentDidMount: function() {},
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {},
  render: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    var selectedLabel = this.props.selectedLabel,
      {Code, CalculationStep, CalculationType, Comment} = selectedLabel.toJS();
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
          <ComAndUom ref='comAndUom' selectedItem={selectedLabel} mergeItem={this._mergeLabel} isViewStatus={isView}/>
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

module.exports = LabelBasic;
