'use strict';
import React from "react";
import ReactDom from 'react-dom';
import CommonFuns from 'util/Util.jsx';
import { CircularProgress, FlatButton, FontIcon, DropDownMenu, RaisedButton} from 'material-ui';
import NewDialog from 'controls/NewDialog.jsx';
import MenuItem from 'material-ui/MenuItem';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import UploadForm from 'controls/UploadForm.jsx';
import classSet from 'classnames';
import ReportAction from 'actions/ReportAction.jsx';
import TemplateList from './TemplateList.jsx';
import ReportStore from 'stores/ReportStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';
var Template = createReactClass({

  contextTypes:{
      currentRoute: PropTypes.object
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
    };
  },
  _addNewTemplate: function() {
    var newTemplateItem = {
      id: 0,
      templateId: null,
      name: null,
      createUser: null,
      data: []
    };
    ReportAction.setSelectedTemplateItem(newTemplateItem);
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
  _onUploadDone(obj) {
    if (obj) {
      ReportAction.getTemplateListByCustomerId(parseInt(this.context.currentRoute.params.customerId), this.state.sortBy, 'asc');
      this.setState({
        showUploadDialog: false
      });
    } else {
      var errorCode = obj && obj.UploadResponse && obj.UploadResponse.ErrorCode,
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
      this.refs.upload_tempalte.upload({
        CustomerId: parseInt(this.context.currentRoute.params.customerId),
        IsActive: true,
      });
      this.setState({
        fileName,
        showUploadDialog: true
      });
  },
  _renderErrorMsg(){
    var that = this;
    if( new RegExp(
        I18N.EM.Report.DuplicatedName.replace(/{\w}/, '(.)*')
      ).test(this.state.errorMsg)
    ) {
      return (
        <NewDialog open={true} title={I18N.EM.Report.UploadNewTemplate} actions={[
          (<FlatButton label={I18N.EM.Report.Upload} onClick={() => {
            this.refs.upload_tempalte.upload({
              IsReplace: true,
              CustomerId: parseInt(this.context.currentRoute.params.customerId),
              IsActive: true,
            });
            this.setState({
              errorMsg: null,
            }, () => {
              this.refs.upload_tempalte.reset();
            });
          }}/>),
          (<FlatButton label={I18N.Common.Button.Cancel2} onClick={() => {
            this.refs.upload_tempalte.reset();
            this.setState({
              errorMsg: null,
            });
          }}/>),
        ]}>
        {this.state.errorMsg}
        </NewDialog>
      );
    }
    return null;
  },
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
  _onSortChange(e, selectedIndex, value) {
    var sortBy = value;
    var order = 'asc';
    if (sortBy === 'CreateTime') {
      order = 'desc';
    }
    ReportAction.getTemplateListByCustomerId(parseInt(this.context.currentRoute.params.customerId), sortBy, order);
    this.setState({
      sortBy: sortBy
    });
  },
  componentWillMount: function() {
    document.title = I18N.MainMenu.Report;
  },
  componentDidMount: function() {
    ReportAction.getTemplateListByCustomerId(parseInt(this.context.currentRoute.params.customerId), 'Name', 'asc');
    ReportStore.addTemplateListChangeListener(this._onChange);
    CurrentUserStore.addCurrentrivilegeListener(this._onCurrentrivilegeChanged);
  },
  componentWillUnmount: function() {
    ReportStore.removeTemplateListChangeListener(this._onChange);
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
    var sortItems = [
    <MenuItem key={1} value='Name' primaryText={I18N.EM.Report.NameSort}/>,
    <MenuItem key={2} value='CreateUser' primaryText={I18N.EM.Report.TimeSort}/>
    ];

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
          {I18N.EM.Report.UploadTem}
          <input type="file" ref="fileInput" id='fileInput' name='templateFile' onChange={this._handleFileSelect} style={fileInputStyle}/>
        </label>
      </div>
    </div>);
    return (
      <div className="jazz-template-container">
        <div className='jazz-template-topbar'>
          <div className="jazz-template-header">
            <div className="jazz-template-topbar-left">
              {/*uploadDom*/}
              <div style={{marginRight: 10}}>
                <RaisedButton containerElement="label" labelPosition="before" label={I18N.EM.Report.UploadTemplate}>
                  <UploadForm 
                    ref={'upload_tempalte'}
                    action={'/datareport/uploadtemplate'} 
                    fileName={'templateFile'}
                    enctype={'multipart/form-data'}
                    method={'post'}
                    onload={this._onUploadDone}
                    onChangeFile={this._onChangeFile}>
                  </UploadForm>
                </RaisedButton>
              </div>
              <div className="jazz-template-action">
                <div className="jazz-template-sort">
                  <DropDownMenu labelStyle={{lineHeight: '40px',fontSize:'14px'}} onChange={this._onSortChange} value={this.state.sortBy}>{sortItems}</DropDownMenu>
                </div>
              </div>
            </div>
            <div className="jazz-template-topbar-right"></div>
          </div>
        </div>
        <div className="jazz-template-content">
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
