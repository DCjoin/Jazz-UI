'use strict';

import React from "react";
import classnames from "classnames";
import moment from "moment";
import { formStatus } from '../../../constants/FormStatus.jsx';
import { dataStatus } from '../../../constants/DataStatus.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../../controls/ViewableTextFieldUtil.jsx';
import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import ViewableDatePicker from '../../../controls/ViewableDatePicker.jsx';
import ViewableNumberField from '../../../controls/ViewableNumberField.jsx';
import CommonFuns from '../../../util/Util.jsx';
import { Checkbox } from 'material-ui';
import VEEStore from '../../../stores/customerSetting/VEEStore.jsx';
import Regex from '../../../constants/Regex.jsx';
import ReceiversList from './ReceiversList.jsx';
import {isNumeric} from 'util/Util.jsx';

var RuleBasic = React.createClass({

  propTypes: {
    rule: React.PropTypes.object,
    merge: React.PropTypes.func,
    formStatus: React.PropTypes.string,
  },
  //mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
  _handleRuleDetailClick: function(values) {
    if (this.props.formStatus !== formStatus.VIEW) {
      if(values[0]==='JumpingRate'){
        let {JumpingRate}=this.props.rule.toJS();
        this.props.merge({
          path: values[0],
          value: typeof values[1]==='boolean'?(values[1]?'check':null):values[1]
      })
      }else{
      this.props.merge({
        path: values[0],
        value: values[1]
      })
      }

    }

  },
  _getDateInput: function(time) {
    if (!time) {
      return "";
    }
    var m = moment(time);
    if (!m.isValid()) {
      m = moment();
    }
    return m.format('YYYY/MM/DD');
  },
  _renderRuleDetail: function() {
    var {CheckNull, CheckNegative, EnableEstimation, NotifyConsecutiveHours, CheckNotify,JumpingRate} = this.props.rule.toJS();
    var isView = this.props.formStatus === formStatus.VIEW,
      checkNullStyle = (isView && !CheckNull) ? {
        display: 'none'
      } : null,
      checkNegativeStyle = (isView && !CheckNegative) ? {
        display: 'none'
      } : null,
      checkZeroStyle = (isView && !JumpingRate) ? {
        display: 'none'
      } : {flexDirection: 'column',alignItems:'initial',height: 'auto',padding: '8px 0 18px 0'},
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
        defaultChecked = JumpingRate==='check' || JumpingRate!==null;
        title = I18N.Setting.VEEMonitorRule.JumpValue;
        path = 'JumpingRate';
      }
      console.log(JumpingRate);
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
        iconStyle={{marginRight:'12px'}}
        />
          <label
        title={title}
        className={classnames("jazz-checkbox-label", {
          "disabled": isView
        })}>
            {title}
          </label>
        </div>
        {path==='JumpingRate' && defaultChecked && 
                <div style={{margin:'19px 0 0 42px'}}>
                  <div style={{fontSize:'14px',color:'#767a7a'}}>{I18N.Setting.VEEMonitorRule.JumpValueTip}</div>
                  <ViewableTextField title={I18N.Setting.VEEMonitorRule.JumpValueTitle}
                                     defaultValue={(JumpingRate==='check' || JumpingRate===null)?undefined:JumpingRate}
                                     isViewStatus={isView}
                                     floatingLabelStyle={{fontSize:'16px',color:'#9fa0a4'}}
							                       floatingLabelFocusStyle={{fontSize:'12px'}}
                                     floatingLabelShrinkStyle={{fontSize:'12px'}}
                                     errorStyle={{
										                    position: 'absolute',
										                    fontSize: '11px',
									                    	bottom:'-10px'
								                    	}}
                                     inputStyle={{fontSize:'16px',color:'#626469'}}
                                     regexFn={(value)=>{
                                       var value_num=parseFloat(value),
                                           value_str=value+'';
                                       if(value==='check' || value===null) return ''
                                       {/*if(value_num+''!==value_str) return I18N.Setting.VEEMonitorRule.JumpValueErrorMsg*/}
                                       if(!isNumeric(value) || value_str[value_str.length-1]==='.') return I18N.Setting.VEEMonitorRule.JumpValueErrorMsg;
                                       if(value_num<=0 || (value_str.indexOf('.')>-1 && value_str.length-value_str.indexOf('.')>2)) return I18N.Setting.VEEMonitorRule.JumpValueErrorMsg
                                       return ''
                                     }} 
                                     style={{marginTop:'10px',width:366}} 
                                     didChanged={(value)=>{
                                      this._handleRuleDetailClick([path,value])
																 }}/>
                </div>}
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
      iconStyle={{marginRight:'12px'}}
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
  _renderRuleSetting: function() {
    var {rule} = this.props,
      receiversList = null,
      isView = this.props.formStatus === formStatus.VIEW,
      //isAdd = this.props.formStatus === formStatus.ADD,
      {StartTime, Interval, Delay, Receivers} = rule.toJS();
    // var getScanTime = function() {
    //   var minutes = 24 * 60;
    //   var i = 0, r,
    //     list = [],
    //     sub = [];
    //   if (Delay == null || isNaN(Delay)) return;
    //   while (true) {
    //     if ((r = Delay + Interval * i) < minutes) {
    //       sub.push(parseInt(Delay / 60) + Interval * i / 60 + ':' + (Delay % 60 == 0 ? '00' : Delay % 60));
    //
    //       ++i;
    //     // if (i % 6 == 0) {
    //     //   var t = sub.join(', ')
    //     //   list.push(t);
    //     //   sub = [];
    //     // }
    //     } else {
    //       var t = sub.join(', ');
    //       list.push(t);
    //       break;
    //     }
    //
    //   }
    //   return list;
    // };
    var intervalSelectedIndex = 4,
      intervalItems = [];
    VEEStore.getIntervalList().forEach((interval, index) => {
      if (VEEStore.getIntervalListByMin()[index] === Interval) {
        intervalSelectedIndex = index
      }
      intervalItems.push({
        payload: index,
        text: interval
      });
    });
    var delaySelectedIndex = 0,
      delayItems = [];
    VEEStore.getDelayList().forEach((delay, index) => {
      if (VEEStore.getDelayListByMin()[index] === Delay) {
        delaySelectedIndex = index
      }
      delayItems.push({
        payload: index,
        text: delay
      });
    });
    var ruleStartTimeProps = {
      dateFormatStr: 'YYYY/MM/DD',
      isViewStatus: isView,
      title: I18N.Setting.VEEMonitorRule.MonitorStartTime,
      value: this._getDateInput(StartTime),
      isRequired: true,
      regex: Regex.CommonTextNotNullRule,
      lang: window.currentLanguage,
      onChange: value => {
        var d2j = CommonFuns.DataConverter.DatetimeToJson;
        this.props.merge({
          value: d2j(new Date(value)),
          path: "StartTime"
        })
      }
    };
    var ruleIntervalProps = {
        isViewStatus: isView,
        title: I18N.Setting.VEEMonitorRule.MonitorInterval,
        selectedIndex: intervalSelectedIndex,
        textField: "text",
        dataItems: intervalItems,
        didChanged: (idx) => {
          this.props.merge({
            value: VEEStore.getIntervalListByMin()[idx],
            path: "Interval"
          })
        }
      },
      ruleDelayProps = {
        isViewStatus: isView,
        title: I18N.Setting.VEEMonitorRule.MonitorDelayTime,
        selectedIndex: delaySelectedIndex,
        textField: "text",
        dataItems: delayItems,
        didChanged: (idx) => {
          this.props.merge({
            value: VEEStore.getDelayListByMin()[idx],
            path: "Delay"
          })
        }
      };
    if (!isView || (Receivers && Receivers.length > 0)) {
      var receiversProps = {
        status: this.props.formStatus,
        ruleId: this.props.rule.get('Id'),
        receivers: this.props.rule.get('Receivers'),
        dataDidChanged: (status, value, index) => {
          var path = "Receivers";
          if (status === dataStatus.DELETED) {
            path += "." + index;
          }
          this.props.merge({
            status,
            value,
            path,
            index
          })
        }
      };

      receiversList = (
        <ReceiversList {...receiversProps}/>
      );
    }
    return (
      <div style={{
        marginTop: '50px'
      }}>
      <div className="pop-role-detail-content-permission" style={{
        paddingBottom: '12px'
      }}>
      <div className="pop-customer-detail-content-left-item">
        <ViewableDatePicker {...ruleStartTimeProps} />
      </div>
      <div className="pop-customer-detail-content-left-item">
        <ViewableDropDownMenu {...ruleIntervalProps}/>
      </div>
      <div className='jazz-vee-textfeild-comment'>
        {I18N.Setting.VEEMonitorRule.FirstScanTime}
      </div>
      <div className="pop-customer-detail-content-left-item">
        <ViewableDropDownMenu {...ruleDelayProps}/>
      </div>
      <div className='jazz-vee-textfeild-comment'>
        {I18N.format(I18N.Setting.VEEMonitorRule.ScanTimeInfo, VEEStore.getScanTime(Delay, Interval))}
      </div>

    </div>
    {receiversList}
  </div>
      )

  },
  // componentWillMount: function() {
  //   this.initBatchViewbaleTextFiled();
  // },
  render: function() {
    return (
      <div className="pop-manage-detail-content">
        {this._renderRuleDetail()}
        {this._renderRuleSetting()}
      </div>
      )

  },
});
module.exports = RuleBasic;
