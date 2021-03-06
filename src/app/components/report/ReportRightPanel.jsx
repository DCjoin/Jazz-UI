'use strict';
import React from "react";
import ReactDom from 'react-dom';
import { CircularProgress, FontIcon, SelectField, TextField, RadioButton, RaisedButton} from 'material-ui';
import classSet from 'classnames';
import CommonFuns from '../../util/Util.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import UploadForm from 'controls/UploadForm.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import ReportAction from '../../actions/ReportAction.jsx';
import downloadFile from 'actions/download_file.js';
import ReportDataItem from './ReportDataItem.jsx';
import ReportStore from '../../stores/ReportStore.jsx';
import GlobalErrorMessageAction from '../../actions/GlobalErrorMessageAction.jsx';
import Immutable from 'immutable';
import Dialog from '../../controls/NewDialog.jsx';
import PropTypes from 'prop-types';
var createReactClass = require('create-react-class');
var ReportRightPanel = createReactClass({

  contextTypes:{
      currentRoute: PropTypes.object
  },
  getInitialState: function() {
    return {
      isLoading: true,
      disabled: true,
      saveDisabled: false,
      reportItem: ReportStore.getSelectedReportItem(),
      showDownloadButton: true,
      checkedValue: 'uploadedTemplate',
      showDeleteDialog: false,
      showUploadDialog: false,
      templateList: ReportStore.getTemplateList(),
      fileName: ''
    };
  },
  _clearAllErrorText() {
    this.refs.reportTitleId.clearErrorText();
    var dataLength = this.state.reportItem.get('data').size;
    for (var i = 0; i < dataLength; i++) {
      this.refs['reportData' + (i + 1)]._clearErrorText();
    }
  },
  _isValid() {
    var isValid = this.refs.reportTitleId.isValid();
    var dataLength = this.state.reportItem.get('data').size;
    if (dataLength === 0) {
      return false;
    }
    for (var i = 0; i < dataLength; i++) {
      isValid = isValid && this.refs['reportData' + (i + 1)]._isValid();
    }
    return isValid;
  },
  _onErrorHandle() {
    let code = ReportStore.getErrorCode(),
      message = ReportStore.getErrorMessage(),
      errorReport = ReportStore.getErrorReport();

    if (!code) {
      return;
    } else if (code == '21708'.toString()) {
      this.stepErrorHandle(message, errorReport);

    } else {
      let errorMsg = CommonFuns.getErrorMessage(code);
      setTimeout(() => {
        GlobalErrorMessageAction.fireGlobalErrorMessage(errorMsg, code);
      }, 0);
      return null;
    }
  },
  stepErrorHandle(message, data) {
    var index = parseInt(message[0]);
    var errorMessage;
    var reportData = data.CriteriaList[index];
    var j2d = CommonFuns.DataConverter.JsonToDateTime;
    var list;
    if (reportData.DateType !== 11) {
      var dateType = CommonFuns.GetStrDateType(reportData.DateType);
      var timeregion = CommonFuns.GetDateRegion(dateType);
      list = CommonFuns.getOldInterval(timeregion.start, timeregion.end).stepList;
    } else {
      var startTime = j2d(reportData.DataStartTime, false);
      var endTime = j2d(reportData.DataEndTime, false);
      list = CommonFuns.getOldInterval(startTime, endTime).stepList;
    }
    var map = {
      'Hourly': 1,
      'Daily': 2,
      'Weekly': 3,
      'Monthly': 4,
      'Yearly': 5
    };
    var stepList = [I18N.Common.AggregationStep.Minute, I18N.Common.AggregationStep.Hourly, I18N.Common.AggregationStep.Daily, I18N.Common.AggregationStep.Monthly, I18N.Common.AggregationStep.Yearly, I18N.Common.AggregationStep.Weekly];
    var curStep = stepList[reportData.ExportStep];
    var start = map[message[1]];
    var ret = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i] >= start) {
        ret.push('"' + stepList[list[i]] + '"');
      }
    }
    if (ret.length > 0) {
      errorMessage = I18N.format(I18N.EM.Report.StepError, curStep, ret.join(','));
    } else {
      errorMessage = I18N.format(I18N.EM.Report.StepError2, curStep);
    }
    CommonFuns.popupErrorMessage(errorMessage, '', true);
  },
  _onChange() {
    if (this.refs.reportTitleId) {
      this._clearAllErrorText();
    }
    var reportItem = ReportStore.getSelectedReportItem();
    var obj;
    if (reportItem !== null) {
      var templateId = reportItem.get('templateId');
      obj = {
        reportItem: reportItem,
        isLoading: false,
        showDeleteDialog: false,
        sheetNames: this._getSheetNamesByTemplateId(templateId),
        checkedValue: 'uploadedTemplate',
        showDownloadButton: true,
        fileName: ''
      };
      if (reportItem.get('id') === 0) {
        obj.disabled = false;
        obj.saveDisabled = true;
        obj.showDownloadButton = false;
      } else {
        obj.disabled = true;
      }
    } else {
      obj = {
        reportItem: reportItem,
        isLoading: false
      };
    }
    this.setState(obj);
  },
  _onChangeTemplate: function() {
    var templateList = ReportStore.getTemplateList();
    var templateItems = this._getTemplateItems(templateList);
    var reportItem = this.state.reportItem;
    var sheetNames = this.state.sheetNames || null;

    this.setState({
      templateList: templateList,
      templateItems: templateItems
    }, () => {
      if (reportItem !== null && sheetNames === null) {
        this.setState({
          sheetNames: this._getSheetNamesByTemplateId(reportItem.get('templateId'))
        });
      }
    });
  },
  _getSheetNamesByTemplateId: function(templateId) {
    var templateList = this.state.templateList;
    var sheetNames = null;
    var template = null;
    if (templateList !== null && templateList.size !== 0 && templateId !== null) {
      template = templateList.find((item) => {
        if (templateId === item.get('Id')) {
          return true;
        }
      });
      if (template) {
        sheetNames = template.get('SheetNames');
      }
    }
    return sheetNames;
  },
  _onTemplateTypeChange(e, newSelection) {
    this.setState({
      checkedValue: newSelection
    });
    if (newSelection === 'uploadedTemplate') {
      this.setState({
        showDownloadButton: true
      });
    } else if (newSelection === 'newTemplate') {
      this.setState({
        showDownloadButton: false
      });
    }
  },
  _onExistTemplateChange(value) {
    var reportItem = this.state.reportItem;
    reportItem = reportItem.set('templateId', value);
    var sheetNames = this._getSheetNamesByTemplateId(value);
    var me = this;
    this.setState({
      reportItem: reportItem,
      showDownloadButton: true,
      sheetNames: sheetNames
    }, () => {
      this.setState({
        saveDisabled: !me._isValid()
      });
    });
  },
  _onNameChange(value) {
    var me = this;
    var reportItem = this.state.reportItem;
    reportItem = reportItem.set('name', value);
    this.setState({
      reportItem: reportItem
    }, () => {
      this.setState({
        saveDisabled: !me._isValid()
      });
    });
  },
  _getTemplateItems: function(templateList) {
    if (templateList && templateList.size !== 0) {
      return templateList.map(function(item) {
        return {
          payload: item.get('Id'),
          text: item.get('Name')
        };
      }).toJS();
    }
  },
  _onUploadDone(obj) {
    var reportItem = this.state.reportItem;
    if (obj) {
      reportItem = reportItem.set('templateId', obj.TemplateId);
      ReportAction.getTemplateListByCustomerId(this.context.currentRoute.params.customerId, this.state.sortBy, 'asc');
      this.setState({
        reportItem: reportItem,
        sheetNames: Immutable.fromJS(obj.SheetName),
        showUploadDialog: false
      },()=>{
        this._updateReportItem(reportItem,Immutable.fromJS(obj.SheetList))
      });
    } else {
      var errorCode = obj && obj.UploadResponse && obj.UploadResponse.ErrorCode,
        errorMessage;
      if (errorCode === -1) {
        errorMessage = I18N.format(I18N.EM.Report.DuplicatedName,this.state.fileName);
      }
      this.setState({
        showUploadDialog: false,
        fileName: ''
      });
      if (errorMessage) {
        this.setState({
          errorMsg:errorMessage
        });
      }
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
        <Dialog open={true} title={I18N.EM.Report.UploadNewTemplate} actions={[
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
        </Dialog>
      );
    }
    return null;
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
  _downloadTemplate: function() {
    downloadFile.get(`/datareport/downloadreporttemplate/${this.state.reportItem.get('templateId')}`, {}, true);
    // var templateId = this.state.reportItem.get('templateId');
    // var iframe = document.createElement('iframe');
    // iframe.style.display = 'none';
    // iframe.src = 'TagImportExcel.aspx?Type=ReportTemplate&Id=' + templateId;
    // iframe.onload = function() {
    //   document.body.removeChild(iframe);
    // };
    // document.body.appendChild(iframe);
  },
  _exportTemplate: function() {
    downloadFile.get(`/datareport/downloadreport/${this.state.reportItem.get('id')}`);
    // var reportItem = this.state.reportItem;
    // var id = reportItem.get('id');
    // var iframe = document.createElement('iframe');
    // iframe.style.display = 'none';
    // iframe.src = 'TagImportExcel.aspx?Type=Report&Id=' + id;

    // iframe.onload = function() {
    //   var json = JSON.parse(iframe.contentDocument.body.innerHTML);
    //   if (json) {
    //     var code = json.UploadResponse.ErrorCode;
    //     var msg;
    //     if (code == -1) {
    //       msg = I18N.Message.M02013;
    //     } else if (code == -2) {
    //       msg = I18N.format(I18N.Message.M21707, reportItem.get('name'));
    //     } else if (code == -3) {
    //       msg = I18N.format(I18N.EM.Report.ExportStepError);
    //     } else if (code == -4) {
    //       msg = I18N.format(I18N.EM.Report.ExportTagUnassociated);
    //     }
    //     if (msg) {
    //       CommonFuns.popupErrorMessage(msg);
    //     }
    //   }
    // };
    // document.body.appendChild(iframe);
  },
  _editReport: function() {
    this.setState({
      disabled: false,
      saveDisabled: false
    });
  },
  _cancelEditReport: function() {
    this._clearAllErrorText();
    if (this.state.reportItem.get('id') !== 0) {
      var reportItem = ReportStore.getSelectedReportItem();
      this.setState({
        reportItem: reportItem,
        checkedValue: 'uploadedTemplate',
        showDownloadButton: true,
        disabled: true,
        fileName: ''
      });
    } else {
      ReportAction.setDefaultReportItem();
    }
  },
  _saveReport: function() {
    this._clearAllErrorText();
    var reportItem = this.state.reportItem;
    var sendData = {
      CreateUser: reportItem.get('createUser'),
      CriteriaList: reportItem.get('data').toJS(),
      HierarchyId: parseInt(this.context.currentRoute.params.customerId),
      Id: reportItem.get('id'),
      Name: reportItem.get('name'),
      TemplateId: reportItem.get('templateId'),
      Version: reportItem.get('version')
    };
    ReportAction.saveCustomerReport(sendData);
  },
  _handleDialogDismiss() {
    this.setState({
      showDeleteDialog: false
    });
  },
  _showDeleteDialog() {
    this.setState({
      showDeleteDialog: true
    });
  },
  _renderDeleteDialog() {
    if (!this.state.showDeleteDialog) {
      return null;
    }
    var dialogActions = [
      <FlatButton
      label={I18N.Common.Button.Delete}
      onClick={this._deleteReport} />,

      <FlatButton
      label={I18N.Common.Button.Cancel}
      onClick={this._handleDialogDismiss} />
    ];

    return (<Dialog
      ref="deleteDialog"
      open={true}
      actions={dialogActions}
      modal={true}>
        {I18N.format(I18N.EM.Report.DeleteReportMessage, this.state.reportItem.get('name'))}
      </Dialog>);
  },
  _deleteReport: function() {
    var id = this.state.reportItem.get('id');
    ReportAction.deleteReportById(id);
  },
  _updateReportData: function(name, value, index, stepValue, startTime, endTime) {
    var me = this;
    var reportItem = this.state.reportItem;
    var reportData = reportItem.get('data');
    var length = reportData.size;
    reportData = reportData.setIn([index, name], value);
    if (name === 'DateType') {
      reportData = reportData.setIn([index, 'ExportStep'], stepValue);
      reportData = reportData.setIn([index, 'DataStartTime'], startTime);
      reportData = reportData.setIn([index, 'DataEndTime'], endTime);
    }
    reportItem = reportItem.set('data', reportData);
    this.setState({
      reportItem: reportItem
    }, () => {
      this.setState({
        saveDisabled: !me._isValid()
      });
    });
  },
  _addReportData: function() {
    var reportItem = this.state.reportItem;
    var reportData = reportItem.get('data');
    var imSheetNames = this.state.sheetNames;
    var sheetNames = imSheetNames !== null ? imSheetNames.toJS() : null;
    var dateType = CommonFuns.GetStrDateType(0);
    var timeRange = CommonFuns.GetDateRegion(dateType);
    var d2j = CommonFuns.DataConverter.DatetimeToJson;
    var startTime = d2j(timeRange.start);
    var endTime = d2j(timeRange.end);
    var newReportData = {
      DataStartTime: startTime,
      DataEndTime: endTime,
      DateType: 0,
      ExportLayoutDirection: 0,
      ExportStep: 0,
      ExportTimeOrder: 0,
      IsExportTagName: false,
      IsExportTimestamp: false,
      NumberRule: 0,
      ReportType: 0,
      StartCell: '',
      TagsList: [],
      TargetSheet: sheetNames !== null ? sheetNames[0] : null
    };
    reportData = reportData.unshift(Immutable.fromJS(newReportData));
    reportData = reportData.map((item, i) => {
      return item.set('Index', i);
    });
    reportItem = reportItem.set('data', reportData);
    this.setState({
      reportItem: reportItem,
      saveDisabled: true
    });
  },
  _deleteReportData: function(index) {
    var reportItem = this.state.reportItem;
    var reportData = reportItem.get('data');
    var length = reportData.size;
    reportData = reportData.delete(index);
    reportData = reportData.map((item, i) => {
      return item.set('Index', i);
    });
    reportItem = reportItem.set('data', reportData);
    this.setState({
      reportItem: reportItem
    });
  },

  componentDidMount: function() {
    ReportAction.getTemplateListByCustomerId(parseInt(this.context.currentRoute.params.customerId), 'Name', 'asc');
    ReportStore.addReportItemChangeListener(this._onChange);
    ReportStore.addTemplateListChangeListener(this._onChangeTemplate);
    ReportStore.addSaveReportErrorListener(this._onErrorHandle);
  },
  componentWillUnmount: function() {
    ReportStore.removeReportItemChangeListener(this._onChange);
    ReportStore.removeTemplateListChangeListener(this._onChangeTemplate);
    ReportStore.removeSaveReportErrorListener(this._onErrorHandle);
  },

  render: function() {
    var me = this;
    let displayedDom = null;
    var reportItem = me.state.reportItem;
    if (me.state.isLoading) {
      displayedDom = (<div className='jazz-report-loading'><div style={{
        margin: 'auto',
        width: '100px'
      }}><CircularProgress  mode="indeterminate" size={80} /></div></div>);
    } else if (reportItem !== null) {
      var buttonStyle = {
          minWidth: '36px',
          width: '36px',
          height: '36px',
          verticalAlign: 'middle',
          margin: '10px 0 0 30px',
        },
        iconStyle = {
          fontSize: '36px',
          color: '#abafae'
        };
      var titleProps = {
        ref: 'reportTitleId',
        isViewStatus: me.state.disabled,
        didChanged: me._onNameChange,
        defaultValue: reportItem.get('name'),
        title: I18N.EM.Report.ReportName,
        isRequired: true
      };
      var addReportDataButton = null;
      var collapseButton = <div className="report-right-btn" style={{
        "color": "#939796"
      }} onClick={this.props.onCollapseButtonClick}>
                              <FontIcon hoverColor="#6b6b6b" color="#939796" className={classSet("icon", "icon-column-fold")} />
                           </div>;
      var reportTitle = (<div className={classSet("pop-manage-detail-header-name", "jazz-header")} style={{marginLeft:'30px'}}><ViewableTextField {...titleProps}></ViewableTextField></div>);
      var reportTemplate;
      var saveButtonStyle = {
        borderRight: '1px solid #ececec',
        height:'56px'
      };
      var editButton = (me.props.onlyRead ? null : <FlatButton label={I18N.Common.Button.Edit} onClick={me._editReport}  secondary={true} style={saveButtonStyle} />);
      var exportButton = <FlatButton label={I18N.Common.Button.Export} onClick={me._exportTemplate}  secondary={true} style={saveButtonStyle} />;
      var deleteButton = (me.props.onlyRead ? null : <FlatButton label={I18N.Common.Button.Delete} onClick={me._showDeleteDialog} style={saveButtonStyle} primary={true} />);
      var saveButton = <FlatButton style={saveButtonStyle} secondary={true} label={I18N.Common.Button.Save} onClick={me._saveReport} disabled={me.state.saveDisabled} />;
      var cancelButton = <FlatButton label={I18N.Common.Button.Cancel} style={saveButtonStyle} onClick={me._cancelEditReport} />;
      var buttonArea = null;
      if (me.state.disabled) {
        var templateProps = {
          isViewStatus: me.state.disabled,
          defaultValue: reportItem.get('templateId'),
          dataItems: me.state.templateItems,
          textField: 'text',
          title: I18N.EM.Report.Template
        };
        buttonArea = <div className='jazz-report-rightpanel-footer-content'>
          <div className='jazz-report-rightpanel-footer-btn'><div style={{
          float: 'left',
          height: '100%'
        }}>{editButton}</div>
          <div style={{
          float: 'left',
          height: '100%'
        }}>{exportButton}</div>
          <div style={{
          float: 'right',
          height: '100%'
        }}>{deleteButton}</div>
          <div style={{
          clear: 'both'
        }}></div></div></div>;
        reportTemplate = (<ViewableDropDownMenu {...templateProps}></ViewableDropDownMenu>);
      } else {
        buttonArea = <div className='jazz-report-rightpanel-footer-content'>
          <div className='jazz-report-rightpanel-footer-btn'><div style={{
          float: 'left',
          height: '100%'
        }}>{saveButton}</div>
          <div style={{
          float: 'left',
          height: '100%'
        }}>{cancelButton}</div>
          <div style={{
          clear: 'both'
        }}></div></div></div>;
        var downloadButton = null,
          uploadButton = null;
        var templateEditProps = {
          isViewStatus: me.state.disabled,
          defaultValue: reportItem.get('templateId'),
          dataItems: me.state.templateItems,
          textField: 'text',
          title: '',
          didChanged: me._onExistTemplateChange
        };
        if (me.state.showDownloadButton) {
          downloadButton = (<div className='jazz-report-rightpanel-template-download-button'><FlatButton label={I18N.EM.Report.DownloadTemplate} onClick={me._downloadTemplate} secondary={true} style={{
            background: 'transparent'
          }} /></div>);
        }
        if (!me.state.showDownloadButton) {
          var fileInputStyle = {
            opacity: 0,
            position: "absolute",
            top: 0,
            left: 0,
            display: 'none'
          };
          uploadButton = (<div className='jazz-report-rightpanel-template-upload-button'><label ref="fileInputLabel" className="jazz-template-upload-label" htmlFor="fileInput">
            <span>{me.state.showUploadDialog ? '' : me.state.fileName}</span>
            {(me.state.fileName === '' || me.state.showUploadDialog) ? I18N.EM.Report.Upload : I18N.EM.Report.Reupload}
            <input type="file" ref="fileInput" id='fileInput' name='templateFile' onChange={this._handleFileSelect} style={fileInputStyle}/></label></div>);
        }
        reportTemplate = (
          <div>
            <div className='jazz-report-rightpanel-template-title'>{I18N.EM.Report.Template}</div>
            <RadioButton onCheck={me._onTemplateTypeChange} checked={me.state.checkedValue === "uploadedTemplate"} value="uploadedTemplate" label={I18N.EM.Report.ExistTemplate} />
            <div style={{
            display: 'flex',
            flexDirection: 'row'
          }}>
              <ViewableDropDownMenu  {...templateEditProps}></ViewableDropDownMenu>
              {downloadButton}
            </div>
            <div style={{
            display: 'flex',
            flexDirection: 'row'
          }}>
              <RadioButton onCheck={me._onTemplateTypeChange} style={{
            width: '250px'
          }} checked={me.state.checkedValue === "newTemplate"} value="newTemplate" label={I18N.EM.Report.UploadTemplate}/>
              
              {/*uploadButton*/}
              <RaisedButton labelPosition="before" containerElement="label" label={I18N.EM.Report.UploadTemplate}>
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
          </div>
        );
        addReportDataButton = (<div className="jazz-report-rightpanel-add-button"><FlatButton label={I18N.Common.Button.Add} onClick={me._addReportData} /></div>);
      }
      var addReportData = (<div className="jazz-report-rightpanel-add">
      <div className="jazz-report-rightpanel-add-text">{I18N.EM.Report.Data}</div>
      {addReportDataButton}
    </div>);
      var dataLength = reportItem.get('data').size;
      var reportData = reportItem.get('data').map(function(item, index) {
        let props = {
          key: dataLength - index,
          ref: 'reportData' + (index + 1),
          disabled: me.state.disabled,
          startTime: item.get('DataStartTime'),
          endTime: item.get('DataEndTime'),
          reportType: item.get('ReportType'),
          dateType: item.get('DateType'),
          step: item.get('ExportStep'),
          numberRule: item.get('NumberRule'),
          timeOrder: item.get('ExportTimeOrder'),
          targetSheet: item.get('TargetSheet'),
          isExportTagName: item.get('IsExportTagName'),
          isExportTimestamp: item.get('IsExportTimestamp'),
          startCell: item.get('StartCell'),
          exportLayoutDirection: item.get('ExportLayoutDirection'),
          sheetNames: me.state.sheetNames,
          updateReportData: me._updateReportData,
          deleteReportData: me._deleteReportData,
          showStep: item.get('ReportType') === 1 ? false : true,
          index: index,
          dataLength: dataLength,
          id: item.get('Id'),
          tagList: item.get('TagsList'),
          addReport: reportItem.get('id') === 0 ? true : false
        };
        return (
          <ReportDataItem {...props}></ReportDataItem>
          );
      });
      var deleteDialog = me._renderDeleteDialog();
      var uploadDialog = me._renderUploadDialog();
      displayedDom = (
        <div className="jazz-report-rightpanel-container">
          <div className="jazz-report-rightpanel-header" style={{marginTop:'16px'}}>
            {collapseButton}
            {reportTitle}
          </div>
          <div className="jazz-report-rightpanel-body">
            <div className="jazz-report-rightpanel-template">
              {reportTemplate}
            </div>
            {addReportData}
            <div className="jazz-report-rightpanel-data">
              {reportData}
            </div>
          </div>
          <div className="jazz-report-rightpanel-footer">
            {buttonArea}
          </div>
          {deleteDialog}
          {uploadDialog}
          {this._renderErrorMsg()}
        </div>
      );
    }
    return displayedDom;
  }
});

module.exports = ReportRightPanel;
