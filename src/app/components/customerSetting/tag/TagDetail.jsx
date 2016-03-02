'use strict';

import React from "react";
import classnames from "classnames";
import Panel from '../../../controls/MainContentPanel.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import FormBottomBar from '../../../controls/FormBottomBar.jsx';
import Dialog from '../../../controls/PopupDialog.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';
import PTagBasic from './PTagBasic.jsx';
import VTagBasic from './VTagBasic.jsx';

var TagDetail = React.createClass({
  propTypes: {
    tagType: React.PropTypes.number,
    formStatus: React.PropTypes.string,
    showLeft: React.PropTypes.bool,
    showBasic: React.PropTypes.bool,
    showDeleteDialog: React.PropTypes.bool,
    selectedTag: React.PropTypes.object,
    onCancel: React.PropTypes.func,
    onSave: React.PropTypes.func,
    onEdit: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    onDeleteTag: React.PropTypes.func,
    onCloseDialog: React.PropTypes.func,
    onToggle: React.PropTypes.func,
    onSwitchTab: React.PropTypes.func,
    mergeTag: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      showDeleteDialog: false
    };
  },
  _isValid: function() {
    var codeIsValid,
      meterCodeIsValid,
      channelIsValid,
      commodityIsValid,
      uomIsValid,
      calculationStepIsValid,
      calculationTypeIsValid,
      slopeIsValid = true,
      offsetIsValid = true,
      commentIsValid = true;
    if (this.refs.pTagBasic) {
      var pTagBasic = this.refs.pTagBasic;
      codeIsValid = pTagBasic.refs.code.isValid();
      meterCodeIsValid = pTagBasic.refs.meterCode.isValid();
      channelIsValid = pTagBasic.refs.channel.isValid();
      commodityIsValid = pTagBasic.refs.commodity.isValid();
      uomIsValid = pTagBasic.refs.uom.isValid();
      calculationStepIsValid = pTagBasic.refs.calculationStep.isValid();
      calculationTypeIsValid = pTagBasic.refs.calculationType.isValid();
      if (pTagBasic.refs.slope) {
        slopeIsValid = pTagBasic.refs.slope.isValid();
      }
      if (pTagBasic.refs.offset) {
        offsetIsValid = pTagBasic.refs.offset.isValid();
      }
      if (pTagBasic.refs.comment) {
        commentIsValid = pTagBasic.refs.comment.isValid();
      }

      return codeIsValid && meterCodeIsValid && channelIsValid && commodityIsValid && uomIsValid && calculationStepIsValid && calculationTypeIsValid && slopeIsValid && offsetIsValid && commentIsValid;
    } else if (this.refs.vTagBasic) {
      var vTagBasic = this.refs.vTagBasic;
      codeIsValid = vTagBasic.refs.code.isValid();
      commodityIsValid = vTagBasic.refs.commodity.isValid();
      uomIsValid = vTagBasic.refs.uom.isValid();
      calculationStepIsValid = vTagBasic.refs.calculationStep.isValid();
      calculationTypeIsValid = vTagBasic.refs.calculationType.isValid();
      if (vTagBasic.refs.comment) {
        commentIsValid = vTagBasic.refs.comment.isValid();
      }

      return codeIsValid && commodityIsValid && uomIsValid && calculationStepIsValid && calculationTypeIsValid && commentIsValid;
    }
  },
  _onSwitchTab: function(event) {
    this.props.onSwitchTab(event);
  },
  _renderDeleteDialog() {
    if (!this.props.showDeleteDialog) {
      return null;
    }
    var dialogActions = [
      <FlatButton
      label={I18N.Common.Button.Delete}
      primary={true}
      onClick={this.props.onDeleteTag} />,

      <FlatButton
      label={I18N.Common.Button.Cancel}
      onClick={this.props.onCloseDialog} />
    ];

    return (<Dialog
      ref="deleteDialog"
      openImmediately={this.props.showDeleteDialog}
      title={I18N.Setting.Tag.DeleteTag}
      actions={dialogActions}
      modal={true}>
        <div className='jazz-tag-delete'>{I18N.format(I18N.Setting.Tag.deleteContent, this.props.tagType === 1 ? 'P' : 'V', this.props.selectedTag.get('Name'))}</div>
      </Dialog>);
  },
  _renderHeader: function() {
    var me = this;
    var selectedTag = me.props.selectedTag,
      isView = me.props.formStatus === formStatus.VIEW,
      isAdd = me.props.formStatus === formStatus.ADD;
    var tagNameProps = {
      isViewStatus: isView,
      title: I18N.Setting.Tag.TagName,
      defaultValue: selectedTag.get('Name'),
      isRequired: true,
      didChanged: value => {
        me.props.mergeTag({
          value,
          path: "Name"
        });
      }
    };
    var displayStr = me.props.tagType === 1 ? I18N.Setting.Tag.RawData : I18N.Setting.Tag.Formula;
    return (
      <div className="pop-manage-detail-header">
        <div className={classnames("pop-manage-detail-header-name", "jazz-header")}>
          <ViewableTextField  {...tagNameProps} />
            {
      isAdd ? null :
        <div className="pop-user-detail-tabs">
                  <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": me.props.showBasic
        })} data-tab-index="1" onClick={me._onSwitchTab}>{I18N.Setting.Tag.BasicProperties}</span>
                  <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": !me.props.showBasic
        })} data-tab-index="2" onClick={me._onSwitchTab}>{displayStr}</span>
                </div>
      }
        </div>
      </div>
      );

  },

  _renderContent: function() {
    var content = null;
    var isView = this.props.formStatus === formStatus.VIEW;
    if (this.props.tagType === 1) {
      if (this.props.showBasic) {
        content = <PTagBasic ref='pTagBasic' selectedTag={this.props.selectedTag} mergeTag={this.props.mergeTag} isViewStatus={isView}/>;
      }
    } else {
      if (this.props.showBasic) {
        content = <VTagBasic ref='vTagBasic' selectedTag={this.props.selectedTag} mergeTag={this.props.mergeTag} isViewStatus={isView}/>;
      }
    }
    return (
      <div className="pop-manage-detail-content">
        {content}
      </div>
      );
  },
  _renderFooter: function() {
    var enableSave = true;
    if (this.props.formStatus === formStatus.EDIT) {
      enableSave = this._isValid();
    }
    var bottom = null;
    if (this.props.tagType !== 1 || this.props.showLeft) {
      bottom = (
        <FormBottomBar allowDelete={this.props.showBasic} allowEdit={true} enableSave={enableSave} ref="actionBar" status={this.props.formStatus} onSave={this.props.onSave} onEdit={this.props.onEdit} onDelete={this.props.onDelete} onCancel={this.props.onCancel} />
      );
    }
    return bottom;
  },
  componentWillMount: function() {},
  componentDidMount: function() {},
  componentWillUnmount: function() {},
  componentWillReceiveProps: function(nextProps) {},
  render: function() {
    var header = this._renderHeader(),
      content = this._renderContent(),
      footer = this._renderFooter(),
      deleteDialog = this._renderDeleteDialog();
    return (
      <div className={classnames({
        "jazz-framework-right-expand": !this.props.showLeft,
        "jazz-framework-right-fold": this.props.showLeft
      })}>
      <Panel onToggle={this.props.onToggle}>
        {header}
        {content}
        {footer}
        {deleteDialog}
      </Panel>
    </div>
      );
  },
});

module.exports = TagDetail;
