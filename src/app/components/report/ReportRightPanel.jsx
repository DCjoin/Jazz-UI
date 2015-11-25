'use strict';
import React from "react";
import { CircularProgress, FlatButton, FontIcon, SelectField, TextField, RadioButton, Dialog } from 'material-ui';
import classSet from 'classnames';
import CommonFuns from '../../util/Util.jsx';
import ReportAction from '../../actions/ReportAction.jsx';
import ReportDataItem from './ReportDataItem.jsx';
import ReportStore from '../../stores/ReportStore.jsx';
import GlobalErrorMessageAction from '../../actions/GlobalErrorMessageAction.jsx';
import Immutable from 'immutable';


var ReportRightPanel = React.createClass({


  getInitialState: function() {
    return {
      isLoading: true,
      disabled: true,
      reportItem: ReportStore.getSelectedReportItem(),
      showDownloadButton: true,
      checkedValue: 'uploadedTemplate',
      showDeleteDialog: false,
      showUploadDialog: false,
      templateList: ReportStore.getTemplateList(),
      fileName: ''
    };
  },
  _onChange() {
    var reportItem = ReportStore.getSelectedReportItem();
    var obj = {
      reportItem: reportItem,
      isLoading: false,
      showDeleteDialog: false,
      sheetNames: this._getSheetNamesByTemplateId(reportItem.get('templateId')),
      fileName: ''
    };
    if (reportItem.get('id') === 0) {
      obj.disabled = false;
    } else {
      obj.disabled = true;
    }
    this.setState(obj);
  },
  _onChangeTemplate: function() {
    this.setState({
      templateList: ReportStore.getTemplateList()
    });
  },
  _getSheetNamesByTemplateId: function(templateId) {
    var templateList = this.state.templateList;
    var sheetNames = null;
    if (templateList !== null && templateList.size !== 0 && templateId !== null) {
      sheetNames = templateList.find((item) => {
        if (templateId === item.get('Id')) {
          return true;
        }
      }).get('SheetNames');
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
  _onExistTemplateChange(e) {
    var value = e.target.value;
    var reportItem = this.state.reportItem;
    reportItem = reportItem.set('templateId', value);
    var sheetNames = this._getSheetNamesByTemplateId(value);
    this.setState({
      reportItem: reportItem,
      sheetNames: sheetNames
    });
  },
  _onNameChange() {
    var value = this.refs.reportTitle.getValue();
    var reportItem = this.state.reportItem;
    reportItem = reportItem.set('name', value);
    this.setState({
      reportItem: reportItem
    });
  },
  _getTemplateItems: function() {
    var templateList = this.state.templateList;
    if (templateList && templateList.size !== 0) {
      return templateList.map(function(item) {
        return {
          payload: item.get('Id'),
          text: item.get('Name')
        };
      }).toJS();
    }
  },
  _endsWith(str, pattern) {
    var d = str.length - pattern.length;
    return d >= 0 && str.lastIndexOf(pattern) === d;
  },
  _handleFileSelect(event) {
    var me = this;
    var file = event.target.files[0];
    var fileName = file.name;

    if (!me._endsWith(fileName.toLowerCase(), '.xlsx') && !me._endsWith(fileName.toLowerCase(), '.xls')) {
      window.alert("文件类型非法，请重新选择模版文件。");
      return;
    }
    var createElement = window.Highcharts.createElement,
      discardElement = window.Highcharts.discardElement;


    var iframe = createElement('iframe', null, {
      display: 'none'
    }, document.body);
    iframe.onload = function() {
      var label = me.refs.fileInputLabel.getDOMNode();
      label.appendChild(input);
      var json = iframe.contentDocument.body.innerHTML;
      var obj = JSON.parse(json);
      var reportItem = me.state.reportItem;
      if (obj.success === true) {
        reportItem = reportItem.set('templateId', obj.TemplateId);
        me.setState({
          reportItem: reportItem,
          sheetNames: Immutable.fromJS(obj.SheetList),
          showUploadDialog: false
        });
      } else {
        me.setState({
          showUploadDialog: false,
          fileName: ''
        });
        var errorCode = obj.UploadResponse.ErrorCode, errorMessage;
        if (errorCode === -1) {
          errorMessage = I18N.EM.Report.DuplicatedName;
        }
        if (errorMessage) {
          CommonFuns.popupErrorMessage(errorMessage);
        }
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

    var input = this.refs.fileInput.getDOMNode();
    input.name = 'templateFile';
    form.appendChild(input);

    var customerInput = createElement('input', {
      type: 'hidden',
      name: 'CustomerId',
      value: parseInt(window.currentCustomerId)
    }, null, form);

    form.submit();
    discardElement(form);
    me.setState({
      fileName: fileName,
      showUploadDialog: true
    });
  },
  _renderUploadDialog() {
    if (!this.state.showUploadDialog) {
      return null;
    }
    return (<Dialog
      ref="uploadDialog"
      title="上传报表"
      openImmediately={true}
      modal={true}>
        {'文件' + this.state.fileName + '正在导入'}
      </Dialog>);
  },
  _downloadTemplate: function() {
    var templateId = this.state.reportItem.get('templateId');
    var fr = document.createElement('iframe');
    fr.style.display = 'none';
    fr.src = 'TagImportExcel.aspx?Type=ReportTemplate&Id=' + templateId;
    var handler = function() {
      document.body.removeChild(fr);
    };
    if (fr.attachEvent) {
      fr.attachEvent("onload", function() {
        handler();
      });
    } else {
      fr.onload = function() {
        handler();
      };
    }
    document.body.appendChild(fr);
  },
  _editReport: function() {
    this.setState({
      disabled: false
    });
  },
  _cancelEditReport: function() {
    if (this.state.reportItem.get('id') !== 0) {
      var reportItem = ReportStore.getSelectedReportItem();
      this.setState({
        reportItem: reportItem,
        disabled: true
      });
    } else {
      ReportAction.setDefaultReportItem();
      this.setState({
        disabled: true
      });
    }
  },
  _saveReport: function() {
    var reportItem = this.state.reportItem;
    var sendData = {
      CreateUser: reportItem.get('createUser'),
      CriteriaList: reportItem.get('data').toJS(),
      CustomerId: parseInt(window.currentCustomerId),
      Id: reportItem.get('id'),
      Name: reportItem.get('name'),
      TemplateId: reportItem.get('templateId'),
      Version: reportItem.get('version')
    };
    ReportAction.saveCustomerReport(sendData);
    this.setState({
      disabled: true
    });
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
      label="删除"
      onClick={this._deleteReport} />,

      <FlatButton
      label="放弃"
      onClick={this._handleDialogDismiss} />
    ];

    return (<Dialog
      ref="deleteDialog"
      title="删除报表"
      openImmediately={true}
      actions={dialogActions}
      modal={true}>
        {'确定删除 "' + this.state.reportItem.get('name') + ' "吗？'}
      </Dialog>);
  },
  _deleteReport: function() {
    var id = this.state.reportItem.get('id');
    ReportAction.deleteReportById(id);
  },
  _updateReportData: function(name, value, displayIndex) {
    var reportItem = this.state.reportItem;
    var reportData = reportItem.get('data');
    var length = reportData.size;
    var index = length - displayIndex;
    reportData = reportData.setIn([index, name], value);
    reportItem = reportItem.set('data', reportData);
    this.setState({
      reportItem: reportItem
    });
  },
  _addReportData: function() {
    var reportItem = this.state.reportItem;
    var reportData = reportItem.get('data');
    var newReportData = {
      DataStartTime: null,
      DataEndTime: null,
      DateType: 0,
      ExportLayoutDirection: 0,
      ExportStep: null,
      ExportTimeOrder: 0,
      IsExportTagName: false,
      IsExportTimestamp: false,
      NumberRule: null,
      ReportType: null,
      StartCell: null,
      TagsList: [],
      TargetSheet: null
    };
    reportData = reportData.unshift(Immutable.fromJS(newReportData));
    reportData = reportData.map((item, i) => {
      return item.set('Index', i);
    });
    reportItem = reportItem.set('data', reportData);
    this.setState({
      reportItem: reportItem
    });
  },
  _deleteReportData: function(index) {
    var reportItem = this.state.reportItem;
    var reportData = reportItem.get('data');
    var length = reportData.size;
    reportData = reportData.delete(length - index);
    reportData = reportData.map((item, i) => {
      return item.set('Index', i);
    });
    reportItem = reportItem.set('data', reportData);
    this.setState({
      reportItem: reportItem
    });
  },

  componentDidMount: function() {
    ReportAction.getTemplateListByCustomerId(window.currentCustomerId);
    ReportStore.addReportItemChangeListener(this._onChange);
    ReportStore.addTemplateListChangeListener(this._onChangeTemplate);
  },
  componentWillUnmount: function() {
    ReportStore.removeReportItemChangeListener(this._onChange);
    ReportStore.removeTemplateListChangeListener(this._onChangeTemplate);
  },

  render: function() {
    var me = this;
    let displayedDom = null;
    if (me.state.isLoading) {
      displayedDom = (<div className='jazz-report-loading'><div style={{
        margin: 'auto',
        width: '100px'
      }}><CircularProgress  mode="indeterminate" size={1} /></div></div>);
    } else {
      var buttonStyle = {
          minWidth: '36px',
          width: '36px',
          height: '36px',
          verticalAlign: 'middle',
          margin: '10px 0 0 -36px',
        },
        iconStyle = {
          fontSize: '36px',
          color: '#abafae'
        };
      var reportItem = me.state.reportItem;
      var addReportDataButton = null;
      var expandButton = (<FlatButton style={buttonStyle} onClick={me._onToggle}>
        <FontIcon className="icon-taglist-fold" style={iconStyle}/>
      </FlatButton>);
      var reportTitle = (<TextField ref='reportTitle' floatingLabelText={I18N.EM.Report.ReportName} onChange={me._onNameChange} value={reportItem.get('name')} disabled={me.state.disabled}></TextField>);
      var reportTemplate;

      var editButton = <FlatButton label={I18N.EM.Report.Edit} onClick={me._editReport} />;
      var exportButton = <FlatButton label={I18N.EM.Report.Export} />;
      var deleteButton = <FlatButton label={I18N.EM.Report.Delete} onClick={me._showDeleteDialog} />;
      var saveButton = <FlatButton label={I18N.EM.Report.Save} onClick={me._saveReport} />;
      var cancelButton = <FlatButton label={I18N.EM.Report.Cancel} onClick={me._cancelEditReport} />;
      var buttonArea = null;
      if (me.state.disabled) {
        buttonArea = <div>{editButton}{exportButton}{deleteButton}</div>;
        reportTemplate = (<SelectField ref='reportTemplate' menuItems={me._getTemplateItems()} disabled={me.state.disabled} value={reportItem.get('templateId')} floatingLabelText={I18N.EM.Report.Template}></SelectField>);
      } else {
        buttonArea = <div>{saveButton}{cancelButton}</div>;
        var downloadButton = null,
          uploadButton = null;
        if (me.state.showDownloadButton) {
          downloadButton = (<FlatButton label={I18N.EM.Report.DownloadTemplate} onClick={me._downloadTemplate} />);
        }
        if (!me.state.showDownloadButton) {
          var fileInputStyle = {
            opacity: 0,
            position: "absolute",
            top: 0,
            left: 0,
            display: 'none'
          };
          uploadButton = (<label ref="fileInputLabel" className="pop-booktemplates-upload-label" htmlFor="fileInput">
            <span>{me.state.fileName}</span>
            {me.state.fileName === '' ? I18N.EM.Report.Upload : I18N.EM.Report.Reupload}
            <input type="file" ref="fileInput" id='fileInput' name='templateFile' onChange={this._handleFileSelect} style={fileInputStyle}/></label>);
        }
        reportTemplate = (
          <div>
            <span>{I18N.EM.Report.Template}</span>
            <RadioButton onCheck={me._onTemplateTypeChange} checked={me.state.checkedValue === "uploadedTemplate"} value="uploadedTemplate" label={I18N.EM.Report.ExistTemplate} />
            <div style={{
            display: 'flex',
            'flex-direction': 'row'
          }}>
              <SelectField ref='reportTemplate' menuItems={me._getTemplateItems()} disabled={me.state.disabled} value={reportItem.get('templateId')} onChange={me._onExistTemplateChange}>
              </SelectField>
              {downloadButton}
            </div>
            <div style={{
            display: 'flex',
            'flex-direction': 'row'
          }}>
              <RadioButton onCheck={me._onTemplateTypeChange} style={{
            width: '150px'
          }} checked={me.state.checkedValue === "newTemplate"} value="newTemplate" label={I18N.EM.Report.UploadTemplate}/>
              {uploadButton}
            </div>
          </div>
        );
        addReportDataButton = (<div className="jazz-report-rightpanel-add" style={{
          display: 'flex',
          'flex-direction': 'row'
        }}>
        <span>{I18N.EM.Report.Data}</span>
        <FlatButton label={I18N.EM.Report.Add} onClick={me._addReportData} />
      </div>);
      }
      var dataLength = reportItem.get('data').size;
      var reportData = reportItem.get('data').map(function(item) {
        let props = {
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
          showStep: item.get('ReportType') === 0 ? true : false,
          index: dataLength - item.get('Index')
        };
        return (
          <ReportDataItem {...props}></ReportDataItem>
          );
      });
      var deleteDialog = me._renderDeleteDialog();
      var uploadDialog = me._renderUploadDialog();
      displayedDom = (
        <div className="jazz-report-rightpanel-container">
          <div className="jazz-report-rightpanel-header">
            {expandButton}
            {reportTitle}
          </div>
          <div className="jazz-report-rightpanel-body">
            <div className="jazz-report-rightpanel-template">
              {reportTemplate}
            </div>
            {addReportDataButton}
            <div className="jazz-report-rightpanel-data">
              {reportData}
            </div>
          </div>
          <div className="jazz-report-rightpanel-footer">
            {buttonArea}
          </div>
          {deleteDialog}
          {uploadDialog}
        </div>
      );
    }
    return displayedDom;
  }
});

module.exports = ReportRightPanel;
