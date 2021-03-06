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
import UploadForm from 'controls/UploadForm.jsx';
var createReactClass = require('create-react-class');
function currentUser() {
  return CurrentUserStore.getCurrentUser();
}

let TemplateList = createReactClass({
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
      containerElement="label"
      htmlFor={'templateFile'}
      />,

      <FlatButton
      label={I18N.Common.Button.Cancel}
      onClick={this._handleDialogDismiss}/>
    ];

    return (<NewDialog
      key={this.state.id}
      title={I18N.EM.Report.ReplaceTemplate}
      ref="replaceDialog"
      open={true}
      actions={dialogActions}
      modal={true}
      actionsContainerStyle={{display:"flex"}}>
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
    // let input = this.refs.fileInput;
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
  _onUploadDone(){
    ReportAction.getTemplateListByCustomerId(parseInt(this.context.currentRoute.params.customerId), this.props.sortBy, 'asc');
    this._handleDialogDismiss();
    this.refs.upload_tempalte.reset();
  },

  _renderErrorMsg(){
    var that = this;
    if( new RegExp(
        I18N.EM.Report.DuplicatedName.replace(/{\w}/, '(.)*')
      ).test(this.state.errorMsg)
    ) {
      return null;
    } else {
      var onClose = ()=> {
        if(this.state.errorMsg===I18N.EM.Report.WrongExcelFile){
          this.refs.upload_tempalte.reset();
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
        {this.state.fileName!=='' && this.state.showUploadConfirm && <UploadConfirmDialog name={this.state.name} replaceName={this.state.fileName}
                             onConfirm={()=>{
                               this.refs.upload_tempalte.upload({IsReplace: true,Id:this.state.id, CustomerId: parseInt(this.props.customerId)});
                              //  this.refs.fileInput.value="";
                               this.setState({
                                 showUploadConfirm:false,
                                 showUploadDialog: true,
                                  CustomerId: parseInt(this.props.customerId),
                                  IsActive: true,
                               });
                             }}
                             onCancel={()=>{
                              //  this.refs.fileInput.value="";
                               this.refs.upload_tempalte.reset();
                               this.setState({
                                showUploadConfirm:false,
                                fileName:'',
                                CustomerId: parseInt(this.props.customerId),
                                IsActive: true,
                              });
                             }}/>}
          <div style={{zIndex: -1, position: 'relative'}}>
                             <UploadForm
                               id="templateFile" name='templateFile'
                               ref={'upload_tempalte'}
                               action={'/datareport/uploadtemplate'}
                               fileName={'templateFile'}
                               enctype={'multipart/form-data'}
                               method={'post'}
                               onload={this._onUploadDone}
                               onChangeFile={this._replaceTemplateConfirm}>
                             </UploadForm>
                           </div>
      </div>
      );
  }
});

module.exports = TemplateList;
