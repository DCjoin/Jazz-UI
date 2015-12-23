'use strict';
import React from "react";
import CommonFuns from '../../util/Util.jsx';
import { CircularProgress, FlatButton, FontIcon, DropDownMenu, Dialog } from 'material-ui';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import classSet from 'classnames';
import ReportAction from '../../actions/ReportAction.jsx';
import TemplateList from './TemplateList.jsx';
import ReportStore from '../../stores/ReportStore.jsx';
import CurrentUserStore from '../../stores/CurrentUserStore.jsx';


var Template = React.createClass({


  getInitialState: function() {
    var rivilege = CurrentUserStore.getCurrentPrivilege();
    var onlyRead = this._getOnlyRead(rivilege);
    return {
      isLoading: true,
      onlyRead: onlyRead,
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
      if ((rivilege.indexOf('1218') > -1) && (rivilege.indexOf('1219') === -1)) {
        onlyRead = true;
      }
    }
    return onlyRead;
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
      CommonFuns.popupErrorMessage(I18N.EM.Report.WrongExcelFile, '', true);
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
          CommonFuns.popupErrorMessage(errorMessage, '', true);
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
    var order = 'asc';
    if (sortBy === 'CreateTime') {
      order = 'desc';
    }
    ReportAction.getTemplateListByCustomerId(parseInt(window.currentCustomerId), sortBy, order);
    this.setState({
      sortBy: sortBy
    });
  },
  componentDidMount: function() {
    ReportAction.getTemplateListByCustomerId(parseInt(window.currentCustomerId), 'Name', 'asc');
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
    }}><CircularProgress  mode="indeterminate" size={1} /></div> : <TemplateList ref='templateList' templateList={this.state.templateList} onlyRead={this.state.onlyRead}></TemplateList>);
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
              {uploadDom}
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
