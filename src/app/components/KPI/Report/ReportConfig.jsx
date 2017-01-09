import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { CircularProgress,Dialog } from 'material-ui';
import TitleComponent from 'controls/TitleComponent.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import Immutable from 'immutable';
import ReportAction from 'actions/KPI/ReportAction.jsx';
import ReportStore from 'stores/KPI/ReportStore.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import CommonFuns from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';
import CustomForm from 'util/CustomForm.jsx';

var customerId=null;
export default class ReportConfig extends Component {

	static contextTypes = {
		router: React.PropTypes.object,
    currentRoute:React.PropTypes.object,
	};

	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
		this._onNameChange = this._onNameChange.bind(this);
		this._onTemplateOpen = this._onTemplateOpen.bind(this);
		this._onExistTemplateChange = this._onExistTemplateChange.bind(this);
		this._downloadTemplate = this._downloadTemplate.bind(this);
		this._handleFileSelect = this._handleFileSelect.bind(this);

	}

	state={
    saveDisabled: false,
    templateList:null,
    reportItem:this.props.report===null?this.newReportItem():this.props.report,
    showUploadDialog: false,
    fileName: ''
	};

	_onChange(){
		this.setState({
      templateList:ReportStore.getTemplateList(),
      sheetNames:this._getSheetNamesByTemplateId(this.state.reportItem.get('templateId'))
		})
	}

  _onTemplateOpen(){
    var params = this.context.currentRoute.params;
    var path = RoutePath.report.template(params);
		var action = window.location.href.split('#')[0] + '#' + path;
		if(action) {
			let form = new CustomForm({
				method: 'get',
				target: '_blank',
				action: action
			});
			form.submit();
  }
}

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
  }

  _onExistTemplateChange(value) {
    var reportItem = this.state.reportItem;
    reportItem = reportItem.set('templateId', value);
    var sheetNames = this._getSheetNamesByTemplateId(value);
    var me = this;
    this.setState({
      reportItem: reportItem,
      sheetNames: sheetNames
    }, () => {
      this.setState({
      saveDisabled: !me._isValid()
    });
  });
  }

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
  }

  _getSheetNamesByTemplateId(templateId) {
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
  }

  _downloadTemplate() {
    var templateId = this.state.reportItem.get('templateId');
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'TagImportExcel.aspx?Type=ReportTemplate&Id=' + templateId;
    iframe.onload = function() {
      document.body.removeChild(iframe);
    };
    document.body.appendChild(iframe);
    }

    _handleFileSelect(event) {
      var me = this;
      var file = event.target.files[0];
      var fileName = file.name;

      if (!CommonFuns.endsWith(fileName.toLowerCase(), '.xlsx') && !CommonFuns.endsWith(fileName.toLowerCase(), '.xls')) {
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
        var reportItem = me.state.reportItem;
        if (obj.success === true) {
          reportItem = reportItem.set('templateId', obj.TemplateId);
          ReportAction.getTemplateListByCustomerId(customerId, 'Name', 'asc');
          me.setState({
            reportItem: reportItem,
            sheetNames: Immutable.fromJS(obj.SheetList),
            showUploadDialog: false
          }, () => {
            me.setState({
              saveDisabled: !me._isValid()
            });
          });
        } else {
          me.setState({
            showUploadDialog: false,
            fileName: ''
          });
          var errorCode = obj.UploadResponse.ErrorCode,
            errorMessage;
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

      var input = ReactDom.findDOMNode(this.refs.fileInput);
      form.appendChild(input);
      var customerInput = createElement('input', {
        type: 'hidden',
        name: 'CustomerId',
        value: parseInt(customerId)
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
    }

  newReportItem(){
    return Immutable.fromJS({
      id: 0,
      templateId: null,
      name: '',
      createUser: '',
      data: []
    })
  }

  _renderReportInfo(){
    var {reportItem,templateList}=this.state;
    var titleProps = {
        ref: 'reportTitleId',
        isViewStatus: false,
        didChanged: this._onNameChange,
        defaultValue: reportItem.get('name'),
        hintText:I18N.Setting.KPI.Report.TitleHint,
        title: I18N.EM.Report.ReportName,
        isRequired: true
      },
      templateEditProps = {
        isViewStatus: false,
        defaultValue: reportItem.get('templateId') || -1,
        dataItems: ReportStore.getTemplateItems(templateList),
        textField: 'text',
        title: I18N.EM.Report.ExistTemplate,
        didChanged: this._onExistTemplateChange
      };

      var fileInputStyle = {
        opacity: 0,
        position: "absolute",
        top: 0,
        left: 0,
        display: 'none'
      };

      var downloadButton = (<div className='jazz-report-rightpanel-template-download-button' style={{marginBottom:'10px'}}>
          <FlatButton label={I18N.EM.Report.DownloadTemplate} onClick={this._downloadTemplate} secondary={true} style={{
            background: 'transparent'
          }} disabled={reportItem.get('templateId')===null}/>
        </div>);

      var uploadButton = (<div><label ref="fileInputLabel" className="jazz-template-upload-label" htmlFor="fileInput">
              <FlatButton label={I18N.EM.Report.UploadTemplate} secondary={true} style={{
                background: 'transparent'
              }} onClick={()=>{
                this.refs.fileInput.click()
              }}/>
            <input type="file" ref="fileInput" id='fileInput' name='templateFile' onChange={this._handleFileSelect} style={fileInputStyle}/>
          </label>
          </div>);

      return(
        <div className="kpi-report-info">
            <div>
              <ViewableTextField {...titleProps}/>
            </div>
          <div>
            <span>{I18N.EM.Report.Template}</span>
            <span className="templateMsg" onClick={this._onTemplateOpen}>{I18N.Setting.KPI.Report.TemplateManagement}</span>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
						alignItems:'flex-end'
          }}>
          <ViewableDropDownMenu  {...templateEditProps}/>
          {downloadButton}
          </div>
          {uploadButton}
        </div>

      )
  }

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
  }

	componentWillMount(){
	 customerId=parseInt(this.context.router.params.customerId);
    ReportAction.getTemplateListByCustomerId(customerId, 'Name', 'asc')
	}

	componentDidMount(){
		ReportStore.addChangeListener(this._onChange);
	}

	componentWillUnmount(){
		ReportStore.removeChangeListener(this._onChange);
	}

	render() {
		var {hierarchyName}=this.props;
		if(this.state.templateList===null){
			return (<div className="noContent flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>)
		}
		else {
				let titleProps={
					title:I18N.format(I18N.Setting.KPI.Report.ConfigTitle,hierarchyName),
					contentStyle:{
						marginLeft:'0'
					},
					titleStyle:{
						fontSize:'16px'
					},
					className:'jazz-kpi-config-wrap',
					style:{
						paddingLeft:'30px'
					}
				};
				return (
					<TitleComponent {...titleProps}>
            {this._renderReportInfo()}
            {this._renderUploadDialog()}
					</TitleComponent>
				);
		}
	}
}
ReportConfig.propTypes = {
  // hierarchyId:React.PropTypes.number,
  hierarchyName:React.PropTypes.string,
  report:React.PropTypes.object,
};

ReportConfig.defaultProps = {
  // hierarchyId:React.PropTypes.number,
  hierarchyName:'SOHO China',
  report:null,
};
