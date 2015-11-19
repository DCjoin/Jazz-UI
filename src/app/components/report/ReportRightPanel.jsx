'use strict';
import React from "react";
import { CircularProgress, FlatButton, FontIcon, SelectField, TextField, RadioButton } from 'material-ui';
import classSet from 'classnames';
import ReportAction from '../../actions/ReportAction.jsx';
import ReportDataItem from './ReportDataItem.jsx';
import ReportStore from '../../stores/ReportStore.jsx';


var ReportRightPanel = React.createClass({


  getInitialState: function() {
    return {
      isLoading: true,
      disabled: false,
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
      templateValue: reportItem.templateId
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
  _handleSelectValueChange(name, e) {
    let change = {};
    change[name] = e.target.value;
    this.setState(change);
  },
  getTemplateItems: function() {
    var templateItems = [];
    var templateList = this.props.templateList;
    templateList.map(function(item) {
      var obj = {
        payload: item.Id,
        text: item.Name
      };
      templateItems.push(obj);
    });
    return templateItems;
  },
  getSheetNames: function() {
    var templateList = this.props.templateList;
    var sheetNames = [];
    for (var i = 0; i < templateList.length; i++) {
      if (this.state.templateValue === templateList[i].Id) {
        sheetNames = templateList[i].SheetNames;
      }
    }
    return sheetNames;
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
      var addReportButton = null;
      var expandButton = (<FlatButton style={buttonStyle} onClick={this._onToggle}>
        <FontIcon className="icon-taglist-fold" style={iconStyle}/>
      </FlatButton>);
      var reportTitle = (<TextField ref='templateTitle' floatingLabelText={I18N.EM.Report.ReportName} value={reportItem.name} disabled={me.state.disabled}></TextField>);
      var reportTemplate;


      if (me.state.disabled) {
        reportTemplate = (<SelectField ref='reportTemplate' menuItems={me.getTemplateItems()} disabled={me.state.disable} value={me.state.templateValue} floatingLabelText={I18N.EM.Report.Template} onChange={me._handleSelectValueChange.bind(null, 'templateValue')}></SelectField>);
      } else {
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
              <SelectField ref='reportTemplate' menuItems={me.getTemplateItems()} disabled={me.state.disabled} value={me.state.templateValue} onChange={me._handleSelectValueChange.bind(null, 'templateValue')}>
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
        addReportButton = (<div className="jazz-report-rightpanel-add" style={{
          display: 'flex',
          'flex-direction': 'row'
        }}>
        <span>{I18N.EM.Report.Data}</span>
        <FlatButton label={I18N.EM.Report.Add} />
      </div>);
      }
      var reportData = reportItem.data.map(function(item, i) {
        var sheetNames = me.getSheetNames();
        let props = {
          disabled: me.state.disabled,
          reportData: item,
          reportItem: reportItem,
          sheetNames: sheetNames,
          index: i + 1
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
          <div className="jazz-report-rightpanel-template">
            {reportTemplate}
          </div>
          {addReportButton}
          <div className="jazz-report-rightpanel-data">
            {reportData}
          </div>
      </div>
      );
    }
    return displayedDom;
  }
});

module.exports = ReportRightPanel;
