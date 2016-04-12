'use strict';

import React from "react";
import classnames from "classnames";
import { isFunction } from "lodash/lang";

var HierarchyDetail = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.string,
    infoTabNo: React.PropTypes.Number,
    content: React.PropTypes.object,
    setEditStatus: React.PropTypes.func,
    handlerCancel: React.PropTypes.func,
    handleSave: React.PropTypes.func,
    handleDelete: React.PropTypes.func,
    handlerSwitchTab: React.PropTypes.func,
    toggleList: React.PropTypes.func,
    closedList: React.PropTypes.bool,
    merge: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      dialogStatus: false
    };
  },
  _update: function() {
    this.forceUpdate();
  },
  _clearErrorText: function() {
    // var basic = this.refs.jazz_vee_basic,
    //   tag = this.refs.jazz_vee_tag;
    // if (basic && isFunction(basic.clearErrorTextBatchViewbaleTextFiled)) {
    //   basic.clearErrorTextBatchViewbaleTextFiled();
    // }
    // if (tag && isFunction(tag.clearErrorTextBatchViewbaleTextFiled)) {
    //   tag.clearErrorTextBatchViewbaleTextFiled();
    // }
  },
  _handleSave: function() {},
  _renderHeader: function() {},
  _renderContent: function() {},
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
  render: function() {},
});
module.exports = HierarchyDetail;
