'use strict';

import React from "react";
import classnames from "classnames";
import { Toggle } from 'material-ui';
import { isFunction } from "lodash/lang";
import Panel from '../../../controls/MainContentPanel.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../../controls/ViewableTextFieldUtil.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import FormBottomBar from '../../../controls/FormBottomBar.jsx';
import Dialog from '../../../controls/PopupDialog.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';
import RuleBasic from './RuleBasic.jsx';
import MonitorTag from './MonitorTag.jsx';
import Regex from '../../../constants/Regex.jsx';

var VEEDetail = React.createClass({

  propTypes: {
    formStatus: React.PropTypes.string,
    infoTab: React.PropTypes.bool,
    rule: React.PropTypes.object,
    setEditStatus: React.PropTypes.func,
    handlerCancel: React.PropTypes.func,
    handleSaveRule: React.PropTypes.func,
    handleDeleteRule: React.PropTypes.func,
    handlerSwitchTab: React.PropTypes.func,
    toggleList: React.PropTypes.func,
    closedList: React.PropTypes.bool,
    merge: React.PropTypes.func,
  },
  mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
  getInitialState: function() {
    return {
      dialogStatus: false
    };
  },
  _update: function() {
    this.forceUpdate();
  },
  _clearErrorText: function() {
    var basic = this.refs.jazz_vee_basic,
      tag = this.refs.jazz_vee_tag;
    if (basic && isFunction(basic.clearErrorTextBatchViewbaleTextFiled)) {
      basic.clearErrorTextBatchViewbaleTextFiled();
    }
    if (tag && isFunction(tag.clearErrorTextBatchViewbaleTextFiled)) {
      tag.clearErrorTextBatchViewbaleTextFiled();
    }
  },
  _handleSaveRule: function() {
    if (this.props.infoTab) {
      let rule = this.props.rule;
      if (rule.get('NotifyConsecutiveHours') === '') {
        rule = rule.set('NotifyConsecutiveHours', null)
      }
      // if (!rule.get('Interval')) {
      //   rule = rule.set('Interval', 1440)
      // }
      // if (!rule.get('Delay')) {
      //   rule = rule.set('Delay', 0)
      // }
      this.props.handleSaveRule(rule)
    } else {
      if (this.refs.jazz_vee_tag) {
        let tags = this.refs.jazz_vee_tag._handlerSave(),
          tagIds = [];
        tags.forEach(tag => {
          tagIds.push(tag.get('Id'))
        });
        this.props.handleSaveRule({
          ruleId: this.props.rule.get('Id'),
          tagIds: tagIds
        })
      }

    }

  },
  _renderHeader: function() {
    var that = this,
      {rule} = this.props,
      isView = this.props.formStatus === formStatus.VIEW,
      isAdd = this.props.formStatus === formStatus.ADD,
      ruleNameProps = {
        isViewStatus: isView || !this.props.infoTab,
        title: I18N.Setting.VEEMonitorRule.RuleName,
        defaultValue: rule.get("Name"),
        maxLen: 200,
        isRequired: true,
        didChanged: value => {
          this.props.merge({
            value,
            path: "Name"
          })
        }
      };
    return (
      <div className="pop-manage-detail-header">
    <div className={classnames("pop-manage-detail-header-name", "jazz-header")}>
      <ViewableTextField  {...ruleNameProps} />
        {
      isAdd ? null :
        <div className="pop-user-detail-tabs">
    <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": that.props.infoTab
        })} data-tab-index="1" onClick={that.props.handlerSwitchTab}>{I18N.Setting.TOUTariff.BasicProperties}</span>
    <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": !that.props.infoTab
        })} data-tab-index="2" onClick={that.props.handlerSwitchTab}>{I18N.Setting.VEEMonitorRule.MonitorTag}</span>
  </div>
      }
    </div>
  </div>
      )

  },
  _renderContent: function() {
    var basicProps = {
        ref: 'jazz_vee_basic',
        rule: this.props.rule,
        merge: this.props.merge,
        formStatus: this.props.formStatus
      },
      tagProps = {
        ref: 'jazz_vee_tag',
        formStatus: this.props.formStatus,
        ruleId: this.props.rule.get('Id'),
        onUpdate: this._update
      };
    return (
      <div style={{
        display: 'flex',
        flex: '1',
        overflow: 'auto'
      }}>
      {this.props.infoTab ? <RuleBasic {...basicProps}/> : <MonitorTag {...tagProps}/>}
    </div>

      )
  },
  _renderFooter: function() {
    var disabledSaveButton = false,
      {rule} = this.props,
      that = this,
      editBtnProps;
    if (this.props.infoTab) {
      if (!rule.get('Name') || rule.get('Name').length > 200
        || (!rule.get('CheckNegative') && !rule.get('CheckNull') && !rule.get('CheckZero'))
        || !rule.get('StartTime')) {
        disabledSaveButton = true
      }
      if (rule.get('CheckNotify') && !Regex.ConsecutiveHoursRule.test(rule.get('NotifyConsecutiveHours'))) {
        disabledSaveButton = true
      }

    } else {
      editBtnProps = {
        label: I18N.Common.Button.Add
      }
      if (this.refs.jazz_vee_tag) {
        let tags = this.refs.jazz_vee_tag._handlerSave();
        if (tags.size === 0) {
          disabledSaveButton = true
        }
      }
    }
    return (
      <FormBottomBar
      transition={true}
      enableSave={!disabledSaveButton}
      status={this.props.formStatus}
      onSave={this._handleSaveRule}
      onDelete={function() {
        that.setState({
          dialogStatus: true
        });
      }}
      allowDelete={that.props.infoTab}
      onCancel={this.props.handlerCancel}
      onEdit={ () => {
        that.clearErrorTextBatchViewbaleTextFiled();
        that._clearErrorText();
        that.props.setEditStatus()
      }}
      editBtnProps={editBtnProps}/>

      )
  },
  _renderDialog: function() {
    var that = this;
    var closeDialog = function() {
      that.setState({
        dialogStatus: false
      });
    };
    if (!this.state.dialogStatus) {
      return null;
    } else {
      var rule = that.props.rule;

      return (

        <Dialog openImmediately={this.state.dialogStatus} title={I18N.Setting.VEEMonitorRule.DeleteTitle} modal={true} actions={[
          <FlatButton
          label={I18N.Template.Delete.Delete}
          primary={true}
          onClick={() => {
            that.props.handleDeleteRule(rule);
            closeDialog();
          }} />,
          <FlatButton
          label={I18N.Template.Delete.Cancel}
          onClick={closeDialog} />
        ]}>
      {I18N.format(I18N.Setting.VEEMonitorRule.DeleteContent, rule.get('Name'))}
    </Dialog>
        );
    }
  },
  componentWillMount: function() {
    this.initBatchViewbaleTextFiled();
  },
  render: function() {
    var that = this;
    var header = this._renderHeader(),
      content = this._renderContent(),
      footer = this._renderFooter();
    return (
      <div className={classnames({
        "jazz-framework-right-expand": that.props.closedList,
        "jazz-framework-right-fold": !that.props.closedList
      })}>
    <Panel onToggle={this.props.toggleList}>
      {header}
      {content}
      {footer}
    </Panel>
    {that._renderDialog()}
  </div>
      )
  },
});
module.exports = VEEDetail;
