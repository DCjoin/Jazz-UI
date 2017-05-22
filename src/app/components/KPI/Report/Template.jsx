'use strict';
import React from "react";
import ReactDom from 'react-dom';
import CommonFuns from 'util/Util.jsx';
import { CircularProgress, RaisedButton} from 'material-ui';
import NewDialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import UploadForm from 'controls/UploadForm.jsx';
import ReportAction from 'actions/KPI/ReportAction.jsx';
import TemplateList from './TemplateList.jsx';
import ReportStore from 'stores/KPI/ReportStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import UploadConfirmDialog from './UploadConfirmDialog.jsx';


var Template = React.createClass({

  contextTypes:{
      currentRoute: React.PropTypes.object
  },
  getInitialState: function() {
    var rivilege = CurrentUserStore.getCurrentPrivilege();
    var onlyRead = this._getOnlyRead(rivilege);
    return {
      isLoading: true,
      onlyRead: onlyRead,
      showUploadDialog: false,
      sortBy: 'Name',
      fileName: '',
      errorMsg:false,
      showUploadConfirm:false
    };
  },
  _onChange() {
    this.setState({
      templateList: ReportStore.getTemplateList(),
      isLoading: false
    });
  },
  _onCurrentrivilegeChanged: function() {
    var rivilege = CurrentUserStore.getCurrentPrivilege();
    var onlyRead = this._getOnlyRead(rivilege);
    this.setState({
      onlyRead: onlyRead
    });
  },
  _getOnlyRead(rivilege) {
    var onlyRead = false;
    if (rivilege !== null) {
      if ((rivilege.indexOf(PermissionCode.DATA_REPORT_MANAGEMENT.READONLY+'') > -1) && (rivilege.indexOf(PermissionCode.DATA_REPORT_MANAGEMENT.FULL+'') === -1)) {
        onlyRead = true;
      }
    }
    return onlyRead;
  },

  _onUploadDone(iframe) {
    var json = iframe.contentDocument.body.innerHTML;
    var obj = JSON.parse(json);
    if (obj.success === true) {
      ReportAction.getTemplateListByCustomerId(parseInt(this.context.currentRoute.params.customerId), this.state.sortBy, 'asc');
      this.setState({
        showUploadDialog: false
      });
    } else {
      var errorCode = obj.UploadResponse.ErrorCode,
      errorMessage=null;
      if (errorCode === -1) {
        errorMessage = I18N.format(I18N.EM.Report.DuplicatedName, this.state.fileName);
      }
      this.setState({
        showUploadDialog: false,
        fileName: '',
        errorMsg:errorMessage
      });
    }
  },
  _onChangeFile(event) {
      var file = event.target.files[0];
      if(!file) return;
      var fileName = file.name;

      if (!CommonFuns.endsWith(fileName.toLowerCase(), '.xlsx') &&
        !CommonFuns.endsWith(fileName.toLowerCase(), '.xls')) {
      this.setState({
        errorMsg:I18N.EM.Report.WrongExcelFile
      })
        return;
      }

      this.setState({
        fileName,
        showUploadConfirm:true
      })


      // this.refs.upload_tempalte.upload();
      // this.setState({
      //   fileName,
      //   showUploadDialog: true
      // });
  },
  /*
  _handleFileSelect(event) {
    var me = this;
    var file = event.target.files[0];
    var fileName = file.name;

    if (!CommonFuns.endsWith(fileName.toLowerCase(), '.xlsx') && !CommonFuns.endsWith(fileName.toLowerCase(), '.xls')) {
      me.setState({
        errorMsg:I18N.EM.Report.WrongExcelFile
      })
      return;
    }
    var createElement = window.Highcharts.createElement,
      discardElement = window.Highcharts.discardElement;


    var iframe = createElement('iframe', null, {
      display: 'none'
    }, document.body);
    iframe.onload = function() {
      var json = iframe.contentDocument.body.innerHTML;
      var obj = JSON.parse(json);
      var uploadTemplate;
      if (obj.success === true) {
        ReportAction.getTemplateListByCustomerId(parseInt(me.context.currentRoute.params.customerId), me.state.sortBy, 'asc');
        me.setState({
          showUploadDialog: false
        });
      } else {
        var errorCode = obj.UploadResponse.ErrorCode,
          errorMessage=null;
        if (errorCode === -1) {
          errorMessage = I18N.format(I18N.EM.Report.DuplicatedName,fileName);
        }
        me.setState({
          showUploadDialog: false,
          fileName: '',
          errorMsg:errorMessage
        });
      }
    };

    var form = createElement('form', {
      method: 'post',
      action: 'TagImportExcel.aspx?Type=ReportTemplate',
      target: '_self',
      enctype: 'multipart/form-data',
      name: 'inputForm'
    }, {
      display: 'none'
    }, iframe.contentDocument.body);

    var input = ReactDom.findDOMNode(this.refs.fileInput);
    form.appendChild(input);
    var customerInput = createElement('input', {
      type: 'hidden',
      name: 'CustomerId',
      value: parseInt(me.context.currentRoute.params.customerId)
    }, null, form);
    var activeInput = createElement('input', {
      type: 'hidden',
      name: 'IsActive',
      value: 1
    }, null, form);

    form.submit();
    discardElement(form);
    var label = ReactDom.findDOMNode(me.refs.fileInputLabel);
    var tempForm = document.createElement('form');
    document.body.appendChild(tempForm);
    tempForm.appendChild(input);
    tempForm.reset();
    document.body.removeChild(tempForm);
    label.appendChild(input);
    me.setState({
      fileName: fileName,
      showUploadDialog: true
    });
  },
  */
  _renderUploadDialog() {
    if (!this.state.showUploadDialog) {
      return null;
    }
    return (<NewDialog
      ref="uploadDialog"
      open={true}
      modal={true}>
        {I18N.format(I18N.EM.Report.UploadingTemplate, this.state.fileName)}
      </NewDialog>);
  },
  _renderErrorMsg(){
    var that = this;
    if( new RegExp(
        I18N.EM.Report.DuplicatedName.replace(/{\w}/, '(.)*')
      ).test(this.state.errorMsg)
    ) {
      // return (
      //   <NewDialog open={true} title={I18N.EM.Report.UploadNewTemplate} actions={[
      //     (<FlatButton label={I18N.EM.Report.Upload} onClick={() => {
      //       this.refs.upload_tempalte.upload({IsReplace: true});
      //       this.setState({
      //         errorMsg: null,
      //       }, () => {
      //         this.refs.upload_tempalte.reset();
      //       });
      //     }}/>),
      //     (<FlatButton label={I18N.Common.Button.Cancel2} onClick={() => {
      //       this.refs.upload_tempalte.reset();
      //       this.setState({
      //         errorMsg: null,
      //       });
      //     }}/>),
      //   ]}>
      //   {this.state.errorMsg}
      //   </NewDialog>
      // );
      return null
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
  componentWillMount: function() {
    document.title = I18N.MainMenu.Report;
  },
  componentDidMount: function() {
    ReportAction.getTemplateListByCustomerId(parseInt(this.context.currentRoute.params.customerId), 'Name', 'asc');
    ReportStore.addChangeListener(this._onChange);
    CurrentUserStore.addCurrentrivilegeListener(this._onCurrentrivilegeChanged);
  },
  componentWillUnmount: function() {
    ReportStore.removeChangeListener(this._onChange);
    CurrentUserStore.removeCurrentrivilegeListener(this._onCurrentrivilegeChanged);
  },

  render: function() {
    //style
    var buttonStyle = {
      backgroundColor: 'transparent',
      height: '32px'
    };
    var newTemplateClasses = {
      'se-dropdownbutton': true,
      'btn-container': true,
      'btn-container-active': true
    };

    var uploadDialog = this._renderUploadDialog();

    var fileInputStyle = {
      opacity: 0,
      position: "absolute",
      top: 0,
      left: 0,
      display: 'none'
    };
    var templateContent = (this.state.isLoading ? <div style={{
      textAlign: 'center',
      marginTop: '400px'
    }}><CircularProgress  mode="indeterminate" size={80} /></div> : <TemplateList ref='templateList' templateList={this.state.templateList} onlyRead={this.state.onlyRead} sortBy={this.state.sortBy} customerId={this.context.currentRoute.params.customerId}></TemplateList>);
    var uploadDom = (this.state.onlyRead ? null : <div className="jazz-template-action">
      <div className='jazz-template-upload-button'>
        <label ref="fileInputLabel" className="jazz-template-upload-label" htmlFor="fileInput">
          {I18N.EM.Report.UploadTemplate}
          <input type="file" ref="fileInput" id='fileInput' name='templateFile' onChange={this._handleFileSelect} style={fileInputStyle}/>
        </label>
      </div>
    </div>);
    return (
      <div className="jazz-template-container">
        <div className='jazz-template-topbar'>
          <div className="jazz-template-header">
            <div className="jazz-template-topbar-left">
              {I18N.MainMenu.Template}
            </div>
            <div className="jazz-template-topbar-right">
              {/*uploadDom*/}
              <div style={{marginRight: 10}}>
                <RaisedButton labelPosition="before" containerElement="label" label={I18N.EM.Report.UploadTemplate}>
                  <UploadForm
                    ref={'upload_tempalte'}
                    action={'TagImportExcel.aspx?Type=ReportTemplate'}
                    fileName={'templateFile'}
                    enctype={'multipart/form-data'}
                    method={'post'}
                    onload={this._onUploadDone}
                    onChangeFile={this._onChangeFile}>
                    <input type="hidden" name='CustomerId' value={parseInt(this.context.currentRoute.params.customerId)}/>
                    <input type="hidden" name='IsActive' value={true}/>
                  </UploadForm>
                </RaisedButton>
                {this.state.fileName!=='' && this.state.showUploadConfirm && <UploadConfirmDialog name={this.state.fileName}
                                     onConfirm={()=>{
                                       this.refs.upload_tempalte.upload();
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
              </div>
            </div>
          </div>
        </div>
        <div className="jazz-template-content">
          <div className="jazz-template-comment">
            {I18N.Setting.KPI.Report.TemplateComment}
          </div>
          <div className="jazz-template-center">
          <div className="jazz-template-list">
            {templateContent}
          </div>
        </div>

      </div>
        {uploadDialog}
        {this._renderErrorMsg()}
      </div>
      );
  }
});

module.exports = Template;
