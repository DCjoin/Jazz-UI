'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import NewDialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import TemplateItem from './TemplateItem.jsx';
import ReportAction from 'actions/KPI/ReportAction.jsx';
import ReportStore from 'stores/KPI/ReportStore.jsx';


let TemplateList = React.createClass({
  getInitialState: function() {
    return {
      showDeleteDialog: false,
      showReplaceDialog: false,
      showUploadDialog: false,
    };
  },
  _handleDialogDismiss() {
    this.setState({
      showDeleteDialog: false,
      showReplaceDialog: false,
      showUploadDialog: false,
    });
  },
  _showDeleteDialog(id, name) {
    this.setState({
      showDeleteDialog: true,
      id: id,
      name: name
    });
  },
  _showReplaceDialog(id, name) {
    this.setState({
      showReplaceDialog: true,
      id: id,
      name: name
    });
  },
  _renderUploadDialog() {
    if (!this.state.showUploadDialog) {
      return null;
    }
    return (<Dialog
      ref="uploadDialog"
      openImmediately={true}
      modal={true}>
        {I18N.format(I18N.EM.Report.UploadingTemplate, this.state.fileName)}
      </Dialog>);
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
  _renderReplaceDialog() {
    if (!this.state.showReplaceDialog) {
      return null;
    }
    var dialogActions = [
      <FlatButton
      labelPosition="before"
      label={I18N.EM.Report.Replace}>
        <input type='file' onChange={this._replaceTemplate} ref='fileInput' style={{
          cursor: 'pointer',
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          width: '100%',
          opacity: 0,
        }} />
      </FlatButton>,

      <FlatButton
      label={I18N.Common.Button.Cancel}
      onClick={this._handleDialogDismiss} />
    ];

    return (<NewDialog
      key={this.state.id}
      title={I18N.EM.Report.ReplaceTemplate}
      ref="replaceDialog"
      open={true}
      actions={dialogActions}
      modal={true}>
        {I18N.format(I18N.EM.Report.ReplaceTemplateMessage, this.state.name)}
      </NewDialog>);
  },
  _deleteTemplate: function() {
    var id = this.state.id;
    ReportAction.deleteTemplateById(id);
    this._handleDialogDismiss();
  },
  _replaceTemplate: function(event) {
    let me = this;
    var file = event.target.files[0];
    if(!file) return;
    var fileName = file.name;

    if (!util.endsWith(fileName.toLowerCase(), '.xlsx') && !util.endsWith(fileName.toLowerCase(), '.xls')) {
      util.popupErrorMessage(I18N.EM.Report.WrongExcelFile, '', false);
      return;
    }
    let createElement = window.Highcharts.createElement,
      discardElement = window.Highcharts.discardElement;
    let iframe = createElement('iframe', null, {
      display: 'none'
    }, document.body);
    iframe.onload = function() {
      var json = iframe.contentDocument.body.innerHTML;
      var obj = JSON.parse(json);
      if (obj.success === true) {
        ReportAction.getTemplateListByCustomerId(parseInt(me.props.customerId), me.props.sortBy, 'asc');
        me._handleDialogDismiss();
      } else {
        me.setState({
          showUploadDialog: false,
          fileName: ''
        });
      }
    };

    let form = createElement('form', {
      method: 'post',
      action: 'TagImportExcel.aspx?Type=ReportTemplate',
      target: '_self',
      enctype: 'multipart/form-data',
      name: 'inputForm'
    }, {
      display: 'none'
    }, iframe.contentDocument.body);

    let input = document.getElementById('fileInput');
    form.appendChild(input);
    let replaceInput = createElement('input', {
      type: 'hidden',
      name: 'IsReplace',
      value: true
    }, null, form);
    let replaceIdInput = createElement('input', {
      type: 'hidden',
      name: 'Id',
      value: me.state.id
    }, null, form);
    let customerInput = createElement('input', {
      type: 'hidden',
      name: 'CustomerId',
      value: parseInt(me.props.customerId)
    }, null, form);
    let activeInput = createElement('input', {
      type: 'hidden',
      name: 'IsActive',
      value: 1
    }, null, form);


    form.submit();
    discardElement(form);
    this._handleDialogDismiss();
    me.setState({
      fileName: fileName,
      showUploadDialog: true
    });
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
          showReplaceDialog: me._showReplaceDialog,
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
        {this._renderUploadDialog()}
        {this._renderReplaceDialog()}
      </div>
      );
  }
});

module.exports = TemplateList;
