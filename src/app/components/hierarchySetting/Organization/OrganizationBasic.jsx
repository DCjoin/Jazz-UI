'use strict';

import React from "react";
import classnames from "classnames";
import moment from "moment";
import { formStatus } from '../../../constants/FormStatus.jsx';
import { dataStatus } from '../../../constants/DataStatus.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../../controls/ViewableTextFieldUtil.jsx';
import CommonFuns from '../../../util/Util.jsx';
import Regex from '../../../constants/Regex.jsx';
import ReceiversList from '../../customerSetting/VEERules/ReceiversList.jsx';


var RuleBasic = React.createClass({

  propTypes: {
    selectedNode: React.PropTypes.object,
    merge: React.PropTypes.func,
    formStatus: React.PropTypes.string,
  },
  mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
  _renderDetail: function() {
    var {CheckNull, CheckNegative, CheckZero, EnableEstimation, NotifyConsecutiveHours, CheckNotify} = this.props.rule.toJS();
    var isView = this.props.formStatus === formStatus.VIEW,
      checkNullStyle = (isView && !CheckNull) ? {
        display: 'none'
      } : null,
      checkNegativeStyle = (isView && !CheckNegative) ? {
        display: 'none'
      } : null,
      checkZeroStyle = (isView && !CheckZero) ? {
        display: 'none'
      } : null,
      nullRuleStyle = (!isView && !CheckNull) ? {
        display: 'none'
      } : null,
      notifyStyle = (isView && !CheckNotify) ? {
        display: 'none'
      } : {
        marginTop: '30px'
      },
      enableEstimationStyle = (isView && !EnableEstimation) ? {
        display: 'none'
      } : {
        marginTop: '30px',
        marginBottom: '4px'
      };
    var hoursProps = {
      // isViewStatus: isView,
      // title: I18N.Setting.VEEMonitorRule.ConsecutiveHours,
      // defaultValue: NotifyConsecutiveHours,
      // regex: Regex.ConsecutiveHoursRule,
      // errorMessage: I18N.Setting.VEEMonitorRule.ConsecutiveHoursError,
      // maxLen: 200,
      // didChanged: value => {
      //   this.props.merge({
      //     value,
      //     path: "NotifyConsecutiveHours"
      //   })
      // }
      defaultValue: NotifyConsecutiveHours === null ? '' : NotifyConsecutiveHours,
      isViewStatus: isView,
      title: I18N.Setting.VEEMonitorRule.ConsecutiveHours,
      didChanged: value => {
        this.props.merge({
          value,
          path: "NotifyConsecutiveHours"
        })
      },
      validate: (value = '') => {
        if (value !== '' && !Regex.ConsecutiveHoursRule.test(value)) {
          return I18N.Setting.VEEMonitorRule.ConsecutiveHoursError
        }
      },
      unit: ' ' + I18N.EM.Hour
    };
    var detail = [];
    for (var i = 0; i <= 1; i++) {
      var style, defaultChecked, title, path;
      if (i === 0) {
        style = checkNegativeStyle;
        defaultChecked = CheckNegative || false;
        title = I18N.Setting.VEEMonitorRule.NegativeValue;
        path = 'CheckNegative';
      } else {
        style = checkZeroStyle;
        defaultChecked = CheckZero || false;
        title = I18N.Setting.VEEMonitorRule.ZeroValue;
        path = 'CheckZero';
      }
      detail.push(
        <li className="pop-user-detail-customer-subcheck-block-item" style={style} key={i}>
        <div className="pop-user-detail-customer-subcheck-block-item-left" id={i} onClick={this._handleRuleDetailClick.bind(this, [path, !defaultChecked])}>
          <Checkbox
        ref=""
        defaultChecked={defaultChecked}
        disabled={isView}
        style={{
          width: "auto",
          display: "block"
        }}
        />
          <label
        title={title}
        className={classnames("jazz-checkbox-label", {
          "disabled": isView
        })}>
            {title}
          </label>
        </div>
      </li>
      );
    }
    detail.push(
      <div className="jazz-vee-rule-null-item" style={checkNullStyle} key={2}>
      <div className="pop-user-detail-customer-subcheck-block-item-left" style={{
        minHeight: '24px'
      }} id={2} onClick={this._handleRuleDetailClick.bind(this, ['CheckNull', !CheckNull])}>
        <Checkbox
      ref=""
      defaultChecked={CheckNull || false}
      disabled={isView}
      style={{
        width: "auto",
        display: "block"
      }}
      />
        <label
      title={I18N.Setting.VEEMonitorRule.NullValue}
      className={classnames("jazz-checkbox-label", {
        "disabled": isView
      })}>
          {I18N.Setting.VEEMonitorRule.NullValue}
        </label>
      </div>
      <div className='jazz-vee-rule-null-rule' style={nullRuleStyle}>
        <div style={notifyStyle}>
          <div className="pop-user-detail-customer-subcheck-block-item-left" id={3} key={3} onClick={this._handleRuleDetailClick.bind(this, ['CheckNotify', !CheckNotify])}>
            <Checkbox
      ref=""
      defaultChecked={CheckNotify || false}
      disabled={isView}
      style={{
        width: "auto",
        display: "block"
      }}
      />
            <label
      title={I18N.Setting.VEEMonitorRule.Notify}
      className={classnames("jazz-checkbox-label", {
        "disabled": isView
      })}>
              {I18N.Setting.VEEMonitorRule.Notify}
            </label>
          </div>
          <div className='jazz-checkbox-label-comment'>
            {I18N.Setting.VEEMonitorRule.NotifyMsg}
          </div>
          <div style={{
        display: 'flex',
        marginTop: '10px',
        marginLeft: '40px'
      }}>
                        <ViewableNumberField  {...hoursProps} />
                      </div>

        </div>
        <div style={enableEstimationStyle}>
          <div className="pop-user-detail-customer-subcheck-block-item-left" id={4} key={4} onClick={this._handleRuleDetailClick.bind(this, ['EnableEstimation', !EnableEstimation])}>
            <Checkbox
      ref=""
      defaultChecked={EnableEstimation || false}
      disabled={isView}
      style={{
        width: "auto",
        display: "block"
      }}
      />
            <label
      title={I18N.Setting.VEEMonitorRule.AutoRepair}
      className={classnames("jazz-checkbox-label", {
        "disabled": isView
      })}>
              {I18N.Setting.VEEMonitorRule.AutoRepair}
            </label>
          </div>
          <div className='jazz-checkbox-label-comment'>
            {I18N.Setting.VEEMonitorRule.AutoRepairMsg}
          </div>
        </div>
      </div>
    </div>
    )


    return (
      <div className="pop-role-detail-content-permission">
<div className="pop-role-detail-content-permission-header-panel">
  <span className="pop-role-detail-content-permission-header-panel-title">{I18N.Setting.VEEMonitorRule.MonitorRule}</span>
</div>
<ul className="pop-role-detail-content-permission-content">
  <ul className="pop-user-detail-customer-subcheck-block">
{detail}
</ul>
</ul>
</div>
      )

  },
  componentWillMount: function() {
    this.initBatchViewbaleTextFiled();
    this.clearErrorTextBatchViewbaleTextFiled();
  },
  componentWillUnmount: function() {
    this.clearErrorTextBatchViewbaleTextFiled();
  },
  render: function() {
    return (
      <div className="pop-manage-detail-content">
        {this._renderDetail()}
      </div>
      )

  },
});
module.exports = RuleBasic;
