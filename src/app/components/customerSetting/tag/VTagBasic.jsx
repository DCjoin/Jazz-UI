'use strict';

import React from "react";
import Regex from '../../../constants/Regex.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import ComAndUom from '../ComAndUom.jsx';
import ViewableEnergyLabel from './ViewableEnergyLabel.jsx';

var VTagBasic = React.createClass({
  propTypes: {
    selectedTag: React.PropTypes.object,
    mergeTag: React.PropTypes.func,
    isViewStatus: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
    };
  },
  _mergeTag: function(data) {
    if (this.props.mergeTag) {
      this.props.mergeTag(data);
    }
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
  componentDidMount: function() {},
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {},
  render: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    var selectedTag = this.props.selectedTag,
      {Code, CalculationStep, CalculationType, Comment,EnergyTagId} = selectedTag.toJS();
    var codeProps = {
        ref: 'code',
        isViewStatus: isView,
        title: I18N.Setting.Tag.Code,
        defaultValue: Code || '',
        isRequired: true,
        regex: Regex.Code,
        errorMessage: I18N.Setting.Tag.CodeError,
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
        defaultValue: Comment || '',
        isRequired: false,
        multiLine: true,
        maxLen: null,
        didChanged: value => {
          me.props.mergeTag({
            value,
            path: "Comment"
          });
        }
      },
      energyTagIdProps={
        ref: 'energyTagId',
        isViewStatus: isView,
        value:EnergyTagId || -1,
        onItemTouchTap:id=>{
          if(id===-1) id=null;
          me.props.mergeTag({
            value:id,
            path: "EnergyTagId"
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
          <ComAndUom ref='comAndUom' selectedItem={selectedTag} mergeItem={this._mergeTag} isViewStatus={isView}/>
          <div className="pop-customer-detail-content-left-item">
            <ViewableDropDownMenu {...calculationStepProps}/>
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableDropDownMenu {...calculationTypeProps}/>
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableEnergyLabel {...energyTagIdProps}/>
          </div>
          {comment}
        </div>
      </div>
      );
  },
});

module.exports = VTagBasic;
