'use strict';
import React from "react";
import CommonFuns from '../../util/Util.jsx';
import { CircularProgress, FlatButton, FontIcon, DropDownMenu, Dialog } from 'material-ui';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import classSet from 'classnames';
import ReportAction from '../../actions/ReportAction.jsx';
import TemplateList from './TemplateList.jsx';
import ReportStore from '../../stores/ReportStore.jsx';


var Template = React.createClass({


  getInitialState: function() {
    return {
      isLoading: true,
      showUploadDialog: false,
      sortBy: 'Name',
      fileName: ''
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
      var json = iframe.contentDocument.body.innerHTML;
      var obj = JSON.parse(json);
      var uploadTemplate;
      if (obj.success === true) {
        ReportAction.getTemplateListByCustomerId(parseInt(window.currentCustomerId), me.state.sortBy, 'asc');
        me.setState({
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
    form.appendChild(input);
    var customerInput = createElement('input', {
      type: 'hidden',
      name: 'CustomerId',
      value: parseInt(window.currentCustomerId)
    }, null, form);
    var activeInput = createElement('input', {
      type: 'hidden',
      name: 'IsActive',
      value: 1
    }, null, form);

    form.submit();
    discardElement(form);
    var label = me.refs.fileInputLabel.getDOMNode();
    label.appendChild(input);
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
      openImmediately={true}
      modal={true}>
        {'文件' + this.state.fileName + '正在导入'}
      </Dialog>);
  },
  _onSortChange(e) {
    var sortBy = e.target.value;
    ReportAction.getTemplateListByCustomerId(parseInt(window.currentCustomerId), sortBy, 'asc');
    this.setState({
      sortBy: sortBy
    });
  },
  componentDidMount: function() {
    ReportAction.getTemplateListByCustomerId(parseInt(window.currentCustomerId), 'Name', 'asc');
    ReportStore.addTemplateListChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    ReportStore.removeTemplateListChangeListener(this._onChange);
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
    var sortItems = [{
      payload: 'Name',
      text: I18N.EM.Report.NameSort
    }, {
      payload: 'CreateTime',
      text: I18N.EM.Report.TimeSort
    }];

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
    }}><CircularProgress  mode="indeterminate" size={1} /></div> : <TemplateList ref='templateList' templateList={this.state.templateList}></TemplateList>);

    return (
      <div className="jazz-template-container">
        <div className='jazz-template-topbar'>
          <div className="jazz-template-header">
            <div className="jazz-template-topbar-left">
              <div className="jazz-template-action">
                <div className='jazz-template-upload-button'>
                  <label ref="fileInputLabel" className="jazz-template-upload-label" htmlFor="fileInput">
                    {I18N.EM.Report.UploadTem}
                    <input type="file" ref="fileInput" id='fileInput' name='templateFile' onChange={this._handleFileSelect} style={fileInputStyle}/>
                  </label>
                </div>
              </div>
              <div className="jazz-template-action">
                <div className="jazz-template-sort">
                  <DropDownMenu onChange={this._onSortChange} menuItems={sortItems}></DropDownMenu>
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
      </div>
      );
  }
});

module.exports = Template;
