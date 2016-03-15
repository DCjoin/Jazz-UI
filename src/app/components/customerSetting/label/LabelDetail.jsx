'use strict';

import React from "react";
import classnames from "classnames";
import Panel from '../../../controls/MainContentPanel.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import FormBottomBar from '../../../controls/FormBottomBar.jsx';
import Dialog from '../../../controls/PopupDialog.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';
import LabelBasic from './LabelBasic.jsx';
import ChartComponent from './ChartComponent.jsx';

var LabelDetail = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.string,
    showLeft: React.PropTypes.bool,
    showDeleteDialog: React.PropTypes.bool,
    selectedLabel: React.PropTypes.object,
    onCancel: React.PropTypes.func,
    onSave: React.PropTypes.func,
    onEdit: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    onDeleteLabel: React.PropTypes.func,
    onCloseDialog: React.PropTypes.func,
    onToggle: React.PropTypes.func,
    mergeLabel: React.PropTypes.func,
    enableSave: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
    };
  },
  _renderDeleteDialog() {
    if (!this.props.showDeleteDialog) {
      return null;
    }
    var dialogActions = [
      <FlatButton
      label={I18N.Common.Button.Delete}
      primary={true}
      onClick={this.props.onDeleteLabel} />,

      <FlatButton
      label={I18N.Common.Button.Cancel}
      onClick={this.props.onCloseDialog} />
    ];

    return (<Dialog
      ref="deleteDialog"
      openImmediately={this.props.showDeleteDialog}
      title={I18N.Setting.CustomizedLabeling.DeleteLabel}
      actions={dialogActions}
      modal={true}>
        <div className='jazz-customer-label-delete'>{I18N.format(I18N.Setting.CustomizedLabeling.DeleteTip, this.props.selectedLabel.get('Name'))}</div>
      </Dialog>);
  },
  _renderHeader: function() {
    var me = this;
    var selectedLabel = me.props.selectedLabel,
      isView = me.props.formStatus === formStatus.VIEW;
    var labelNameProps = {
      isViewStatus: isView,
      title: I18N.Setting.Tag.TagName,
      defaultValue: selectedLabel.get('Name'),
      isRequired: true,
      didChanged: value => {
        me.props.mergeTag({
          value,
          path: "Name"
        });
      }
    };
    return (
      <div className="pop-manage-detail-header">
        <div className={classnames("pop-manage-detail-header-name", "jazz-header")}>
          <ViewableTextField  {...labelNameProps} />
        </div>
      </div>
      );

  },

  _renderContent: function() {
    var content = null;
    var isView = this.props.formStatus === formStatus.VIEW;
    return (
      <div className="pop-manage-detail-content">
        <div>
          <LabelBasic selectedLabel={this.props.selectedLabel} isViewStatus={isView} mergeLabel={this._mergeLabel}/>
        </div>
        <div>
          <ChartComponent levelCount={this.props.selectedLabel.get('Grade')}/>
        </div>
      </div>
      );
  },
  _renderFooter: function() {
    var bottom = (
    <FormBottomBar allowDelete={true} allowEdit={true} enableSave={this.props.enableSave} ref="actionBar" status={this.props.formStatus} onSave={this.props.onSave} onEdit={this.props.onEdit} onDelete={this.props.onDelete} onCancel={this.props.onCancel} />
    );

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

module.exports = LabelDetail;
