'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import NewDialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import TemplateItem from './TemplateItem.jsx';
import ReportAction from 'actions/KPI/ReportAction.jsx';
import ReportStore from 'stores/KPI/ReportStore.jsx';
import util from 'util/Util.jsx';
import UploadConfirmDialog from './UploadConfirmDialog.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';

function currentUser() {
  return CurrentUserStore.getCurrentUser();
}

let TemplateList = React.createClass({
  getInitialState: function() {
    return {
      showDeleteDialog: false,
      showReplaceDialog: false,
      showUploadDialog: false,
      showUploadConfirm:false,
      fileName:'',
      errorMsg:null
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
    return (<NewDialog
      ref="uploadDialog"
      openImmediately={true}
      modal={true}>
        {I18N.format(I18N.EM.Report.UploadingTemplate, this.state.fileName)}
      </NewDialog>);
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
      label={I18N.EM.Report.Replace}
      onClick={()=>{ReactDom.findDOMNode(this.refs.fileInput).click()}}
      />,

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
  _replaceTemplateConfirm(event){
    let me = this;
    var file = event.target.files[0];
    let input = this.refs.fileInput;
    if(!file) return;
    var fileName = file.name;

    if (!util.endsWith(fileName.toLowerCase(), '.xlsx') &&
      !util.endsWith(fileName.toLowerCase(), '.xls')) {
    this.setState({
      errorMsg:I18N.EM.Report.WrongExcelFile,
      showReplaceDialog:false
    })
      return;
    }

    this.setState({
      fileName,
      showUploadConfirm:true,
      showReplaceDialog:false
    })
  },

  _replaceTemplate: function(event) {
    var me=this;
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

    let input = this.refs.fileInput;
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
    // this._handleDialogDismiss();
    me.setState({
      showUploadDialog: true
    });
  },

  _renderErrorMsg(){
    var that = this;
    if( new RegExp(
        I18N.EM.Report.DuplicatedName.replace(/{\w}/, '(.)*')
      ).test(this.state.errorMsg)
    ) {
      return null
      // return (
      // 	<Dialog open={true} title={I18N.EM.Report.UploadNewTemplate} actions={[
      // 		(<FlatButton label={I18N.EM.Report.Upload} onClick={() => {
      // 			this.refs.upload_tempalte.upload({IsReplace: true});
      // 			this.setState({
      // 				errorMsg: null,
      // 			}, () => {
      // 				this.refs.upload_tempalte.reset();
      // 			});
      // 		}}/>),
      // 		(<FlatButton label={I18N.Common.Button.Cancel2} onClick={() => {
      // 			this.refs.upload_tempalte.reset();
      // 			this.setState({
      // 				errorMsg: null,
      // 			});
      // 		}}/>),
      // 	]}>
      // 	{this.state.errorMsg}
      // 	</Dialog>
      // );
    } else {
      var onClose = ()=> {
        if(this.state.errorMsg===I18N.EM.Report.WrongExcelFile){
          this.refs.fileInput.value='';
        }
        that.setState({
          errorMsg: null,
        });
      };
      if (this.state.errorMsg!==null) {
        return (<NewDialog
                  ref = "_dialog"
                  title={I18N.Platform.ServiceProvider.ErrorNotice}
                  modal={false}
                  open={!!this.state.errorMsg}
                  onRequestClose={onClose}
                  >
                  {this.state.errorMsg}
                </NewDialog>);
      } else {
        return null;
      }
    }
  },
  componentDidMount: function() {},
  componentWillUnmount: function() {},
  render() {
    var user = window.currentUser || currentUser() || {};
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
          onlyRead: me.props.onlyRead || user.Id!==item.get('CreateUserId')
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
        {this._renderErrorMsg()}
        {this.state.fileName!=='' && this.state.showUploadConfirm && <UploadConfirmDialog name={this.state.fileName}
                             onConfirm={()=>{
                               this._replaceTemplate();
                               this.setState({
                                 showUploadConfirm:false,
                                 showUploadDialog: true
                               });
                             }}
                             onCancel={()=>{
                               this.setState({
                                showUploadConfirm:false,
                                fileName:''
                              });
                             }}/>}
        <input type='file' onChange={this._replaceTemplateConfirm} name='templateFile' ref='fileInput' style={{
                               cursor: 'pointer',
                               position: 'absolute',
                               top: 0,
                               width: '100%',
                               opacity: 0,
                             }} />
      </div>
      );
  }
});

module.exports = TemplateList;
