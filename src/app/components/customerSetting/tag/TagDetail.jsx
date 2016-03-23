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
import TagFormula from './TagFormula.jsx';
import PTagRawData from './PtagRawData.jsx';

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
    mergeTag: React.PropTypes.func,
    enableSave: React.PropTypes.bool,
    onSwitchRawDataListView: React.PropTypes.func,
    showRawDataList: React.PropTypes.bool,
  },
  getInitialState: function() {
    return {
    };
  },
  _onSwitchTab: function(event) {
    this.props.onSwitchTab(event);
  },
  _onSwitchRawDataListView: function(switchFlag, isRawData) {
    this.props.onSwitchRawDataListView(switchFlag, isRawData);
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
      ref: 'tagName',
      isViewStatus: this.props.showBasic ? isView : true,
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
    var style = {
      display: 'flex'
    };
    if (this.props.tagType === 1) {
      if (this.props.showBasic) {
        content = <PTagBasic ref='pTagBasic' selectedTag={this.props.selectedTag} mergeTag={this.props.mergeTag} isViewStatus={isView}/>;
      } else {
        content = <PTagRawData ref='pTagRawData' showLeft={this.props.showLeft} showRawDataList={this.props.showRawDataList} selectedTag={this.props.selectedTag} onSwitchRawDataListView={this._onSwitchRawDataListView}/>;
      }
    } else {
      if (this.props.showBasic) {
        content = <VTagBasic ref='vTagBasic' selectedTag={this.props.selectedTag} mergeTag={this.props.mergeTag} isViewStatus={isView}/>;
      } else {
        content = <TagFormula ref='vTagFormula'  selectedTag={this.props.selectedTag} mergeTag={this.props.mergeTag} isViewStatus={isView}/>;
      }
    }
    return (
      <div className="pop-manage-detail-content" style={style}>
        {content}
      </div>
      );
  },
  _renderFooter: function() {
    var bottom = null;
    if (this.props.tagType !== 1 || this.props.showBasic) {
      bottom = (
        <FormBottomBar allowDelete={this.props.showBasic} allowEdit={true} enableSave={this.props.enableSave} ref="actionBar" status={this.props.formStatus} onSave={this.props.onSave} onEdit={this.props.onEdit} onDelete={this.props.onDelete} onCancel={this.props.onCancel} />
      );
    }
    return bottom;
  },
  componentWillMount: function() {},
  componentDidMount: function() {},
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {},

  render: function() {
    var header = this._renderHeader(),
      content = this._renderContent(),
      footer = this._renderFooter(),
      deleteDialog = this._renderDeleteDialog();
    return (
      <div className={classnames({
        'jazz-ptag-panel': true,
        "jazz-ptag-left-fold": !this.props.showLeft,
        "jazz-ptag-left-expand": this.props.showLeft,
        "jazz-ptag-right-fold": !this.props.showRawDataList,
        "jazz-ptag-right-expand": this.props.showRawDataList

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
