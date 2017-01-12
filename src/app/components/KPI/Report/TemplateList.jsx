'use strict';

import React from 'react';
import NewDialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import TemplateItem from './TemplateItem.jsx';
import ReportAction from 'actions/ReportAction.jsx';
import ReportStore from 'stores/ReportStore.jsx';


let TemplateList = React.createClass({
  getInitialState: function() {
    return {
      showDeleteDialog: false
    };
  },
  _handleDialogDismiss() {
    this.setState({
      showDeleteDialog: false
    });
  },
  _showDeleteDialog(id, name) {
    this.setState({
      showDeleteDialog: true,
      id: id,
      name: name
    });
  },
  _renderDeleteDialog() {
    if (!this.state.showDeleteDialog) {
      return null;
    }
    var dialogActions = [
      <FlatButton
      label={I18N.Common.Button.Delete}
      onClick={this._deleteTemplate} />,

      <FlatButton
      label={I18N.Common.Button.Cancel}
      onClick={this._handleDialogDismiss} />
    ];

    return (<NewDialog
      key={this.state.id}
      title={I18N.EM.Report.DeleteTemplate}
      ref="deleteDialog"
      open={true}
      actions={dialogActions}
      modal={true}>
        {I18N.format(I18N.Setting.KPI.Report.DeleteTemplateMessage, this.state.name)}
      </NewDialog>);
  },
  _deleteTemplate: function() {
    var id = this.state.id;
    ReportAction.deleteTemplateById(id);
    this._handleDialogDismiss();
  },
  componentDidMount: function() {},
  componentWillUnmount: function() {},
  render() {
    let me = this;
    var deleteDialog = me._renderDeleteDialog();
    let templateList = this.props.templateList;
    let templateItems = null;
    if (templateList && templateList.size !== 0) {
      templateItems = templateList.map(function(item) {
        let props = {
          key: item.get('Id'),
          id: item.get('Id'),
          name: item.get('Name'),
          createUser: item.get('CreateUser'),
          createTime: item.get('CreateTime'),
          email: item.get('Email'),
          roleName: item.get('RoleName'),
          telephone: item.get('Telephone'),
          isReference: item.get('IsReference'),
          showDeleteDialog: me._showDeleteDialog,
          onlyRead: me.props.onlyRead
        };
        return (
          <TemplateItem {...props}></TemplateItem>
          );
      });
    }

    return (
      <div>
        {templateItems}
        {deleteDialog}
      </div>
      );
  }
});

module.exports = TemplateList;
