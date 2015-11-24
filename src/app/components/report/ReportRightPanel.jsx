'use strict';
import React from "react";
import { CircularProgress, FlatButton, FontIcon, SelectField, TextField, RadioButton } from 'material-ui';
import classSet from 'classnames';
import ReportAction from '../../actions/ReportAction.jsx';
import ReportDataItem from './ReportDataItem.jsx';
import ReportStore from '../../stores/ReportStore.jsx';
import Immutable from 'immutable';


var ReportRightPanel = React.createClass({


  getInitialState: function() {
    return {
      isLoading: true,
      disabled: true,
      reportItem: ReportStore.getSelectedReportItem(),
      showDownloadButton: true,
      showUploadButton: false,
      checkedValue: 'uploadedTemplate'
    };
  },
  _onChange() {
    var reportItem = ReportStore.getSelectedReportItem();
    this.setState({
      reportItem: reportItem,
      isLoading: false,
      disabled: true
    });
  },
  _onChangeTemplate(e, newSelection) {
    this.setState({
      checkedValue: newSelection
    });
    if (newSelection === 'uploadedTemplate') {
      this.setState({
        showDownloadButton: true,
        showUploadButton: false
      });
    } else if (newSelection === 'newTemplate') {
      this.setState({
        showDownloadButton: false,
        showUploadButton: true
      });
    }
  },
  _onSelectedTemplateChange(e) {
    var value = e.target.value;
    var reportItem = this.state.reportItem;
    reportItem = reportItem.set('templateId', value);
    this.setState({
      reportItem: reportItem
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
  getTemplateItems: function() {
    var templateList = this.props.templateList;
    if (templateList && templateList.size !== 0) {
      return templateList.map(function(item) {
        return {
          payload: item.get('Id'),
          text: item.get('Name')
        };
      }).toJS();
    }
  },
  editReport: function() {
    this.setState({
      disabled: false
    });
  },
  cancelEditReport: function() {
    var reportItem = ReportStore.getSelectedReportItem();
    this.setState({
      reportItem: reportItem,
      disabled: true
    });
  },
  saveReport: function() {
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
  updateReportData: function(name, value, displayIndex) {
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
  addReportData: function() {
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
  deleteReportData: function(index) {
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
  getSheetNames: function() {
    var templateList = this.props.templateList;
    if (templateList !== null && templateList.size !== 0) {
      return templateList.find((item) => {
        if (this.state.reportItem.get('templateId') === item.get('Id')) {
          return true;
        }
      }).get('SheetNames');
    } else {
      return null;
    }
  },
  componentDidMount: function() {
    ReportStore.addReportItemChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    ReportStore.removeReportItemChangeListener(this._onChange);
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

      var editButton = <FlatButton label={I18N.EM.Report.Edit} onClick={me.editReport} />;
      var exportButton = <FlatButton label={I18N.EM.Report.Export} />;
      var deleteButton = <FlatButton label={I18N.EM.Report.Delete} />;
      var saveButton = <FlatButton label={I18N.EM.Report.Save} onClick={me.saveReport} />;
      var cancelButton = <FlatButton label={I18N.EM.Report.Cancel} onClick={me.cancelEditReport} />;
      var buttonArea = null;
      if (me.state.disabled) {
        buttonArea = <div>{editButton}{exportButton}{deleteButton}</div>;
        reportTemplate = (<SelectField ref='reportTemplate' menuItems={me.getTemplateItems()} disabled={me.state.disabled} value={reportItem.get('templateId')} floatingLabelText={I18N.EM.Report.Template}></SelectField>);
      } else {
        buttonArea = <div>{saveButton}{cancelButton}</div>;
        var downloadButton = null,
          uploadButton = null;
        if (me.state.showDownloadButton) {
          downloadButton = (<FlatButton label={I18N.EM.Report.DownloadTemplate} />);
        }
        if (me.state.showUploadButton) {
          uploadButton = (<FlatButton label={I18N.EM.Report.Upload} />);
        }
        reportTemplate = (
          <div>
            <span>{I18N.EM.Report.Template}</span>
            <RadioButton onCheck={me._onChangeTemplate} checked={me.state.checkedValue === "uploadedTemplate"} value="uploadedTemplate" label={I18N.EM.Report.ExistTemplate} />
            <div style={{
            display: 'flex',
            'flex-direction': 'row'
          }}>
              <SelectField ref='reportTemplate' menuItems={me.getTemplateItems()} disabled={me.state.disabled} value={reportItem.get('templateId')} onChange={me._onSelectedTemplateChange}>
              </SelectField>
              {downloadButton}
            </div>
            <div style={{
            display: 'flex',
            'flex-direction': 'row'
          }}>
              <RadioButton onCheck={me._onChangeTemplate} style={{
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
        <FlatButton label={I18N.EM.Report.Add} onClick={me.addReportData} />
      </div>);
      }
      var dataLength = reportItem.get('data').size;
      var reportData = reportItem.get('data').map(function(item) {
        var sheetNames = me.getSheetNames();
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
          sheetNames: sheetNames,
          updateReportData: me.updateReportData,
          deleteReportData: me.deleteReportData,
          showStep: item.get('ReportType') === 0 ? true : false,
          index: dataLength - item.get('Index')
        };
        return (
          <ReportDataItem {...props}></ReportDataItem>
          );
      });

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
        </div>
      );
    }
    return displayedDom;
  }
});

module.exports = ReportRightPanel;
