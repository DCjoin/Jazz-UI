import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { CircularProgress} from 'material-ui';
import Dialog from 'controls/NewDialog.jsx';
import TitleComponent from 'controls/TitleComponent.jsx';
import Immutable from 'immutable';
import ReportAction from 'actions/KPI/ReportAction.jsx';
import ReportStore from 'stores/KPI/ReportStore.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import CommonFuns from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';
import LinkButton from 'controls/LinkButton.jsx';
import ReportDataItem from './ReportDataItem.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import { formStatus } from 'constants/FormStatus.jsx';

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
		this._addReportData = this._addReportData.bind(this);
		this._deleteReportData = this._deleteReportData.bind(this);
		this._updateReportData = this._updateReportData.bind(this);
		this._saveReport = this._saveReport.bind(this);
		this._onSave = this._onSave.bind(this);
		this._onErrorHandle = this._onErrorHandle.bind(this);
	}

	state={
    saveDisabled: false,
    templateList:null,
    reportItem:this.props.report===null?this.newReportItem():ReportStore.getDefalutReport(this.props.report.toJS()),
    showUploadDialog: false,
    fileName: '',
		errorMsg:null,
		isLoading:false
	};

	_onChange(){
		this.setState({
      templateList:ReportStore.getTemplateList(),
      sheetNames:ReportStore.getSheetNamesByTemplateId(this.state.reportItem.get('templateId'))
		})
	}

  _onTemplateOpen(){
    var params = this.context.currentRoute.params;
    var path = RoutePath.KPITemplate(params);
		CommonFuns.openTab(path);
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

	_updateReportItem(reportItem,sheetNames){
		reportItem.get('data').forEach((report,id)=>{
			reportItem=reportItem.setIn(['data',id,'TargetSheet'],sheetNames.getIn([0]))
		})
		this.setState({
			reportItem: reportItem,
			sheetNames: sheetNames
		})
	}

  _onExistTemplateChange(value) {
    var reportItem = this.state.reportItem;
    reportItem = reportItem.set('templateId', value);
    var sheetNames = ReportStore.getSheetNamesByTemplateId(value);
    var me = this;

      this.setState({
      saveDisabled: !me._isValid()
    },()=>{
			this._updateReportItem(reportItem,sheetNames)
		});

  }

	_clearAllErrorText() {
	this.refs.reportTitleId.clearErrorText();
	var dataLength = this.state.reportItem.get('data').size;
	for (var i = 0; i < dataLength; i++) {
		this.refs['reportData' + (i + 1)]._clearErrorText();
	}
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
			if(!file) return;
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
              saveDisabled: !me._isValid(),
							showUploadDialog: false
            },()=>{
							me._updateReportItem(reportItem,Immutable.fromJS(obj.SheetList))
						});

        } else {
          me.setState({
            showUploadDialog: false,
            fileName: ''
          });
          var errorCode = obj.UploadResponse.ErrorCode,
            errorMessage;
          if (errorCode === -1) {
            errorMessage = I18N.format(I18N.Setting.KPI.Report.DuplicatedName,fileName);
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

	_addReportData(){
	var reportItem = this.state.reportItem;
	var reportData = reportItem.get('data');
	var imSheetNames = this.state.sheetNames;
	var sheetNames = imSheetNames !== null ? imSheetNames.toJS() : null;
	var dateType = CommonFuns.GetStrDateType(7);//this year
	var timeRange = CommonFuns.GetDateRegion(dateType);
	var d2j = CommonFuns.DataConverter.DatetimeToJson;
	var startTime = d2j(timeRange.start);
	var endTime = d2j(timeRange.end);
	var newReportData = {
		DataStartTime: startTime,
		DataEndTime: endTime,
		DateType: 7,
		ExportLayoutDirection: 0,
		ExportStep: 1,
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
	}

	_updateReportData(name, value, index, stepValue, startTime, endTime) {
	var me = this;
	var reportItem = this.state.reportItem;
	var reportData = reportItem.get('data');
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
	}

	_deleteReportData(index) {
	var reportItem = this.state.reportItem;
	var reportData = reportItem.get('data');
	reportData = reportData.delete(index);
	reportData = reportData.map((item, i) => {
		return item.set('Index', i);
	});
	reportItem = reportItem.set('data', reportData);
	this.setState({
		reportItem: reportItem
	});
	}

	_onSave(){
		this.setState({
			errorMsg:null,
			isLoading:false
		},()=>{
			this.props.onSave();
		})

	}

	_saveReport() {
	this._clearAllErrorText();
	var reportItem = this.state.reportItem;
	var sendData = {
		CreateUser: reportItem.get('createUser'),
		CriteriaList: reportItem.get('data').toJS(),
		HierarchyId: this.props.hierarchyId,
		Id: reportItem.get('id'),
		Name: reportItem.get('name'),
		TemplateId: reportItem.get('templateId'),
		Version: reportItem.get('version')
	};
	this.setState({
		isLoading:true
	},()=>{
		ReportAction.saveCustomerReport(sendData);
	})
	}

	_onErrorHandle() {
    let code = ReportStore.getErrorCode(),
      message = ReportStore.getErrorMessage(),
      errorReport = ReportStore.getErrorReport();

    if (!code) {
      return;
    } else if (code === '21708'.toString()) {
			this.setState({
				errorMsg:this.stepErrorHandle(message, errorReport),
				isLoading:false
			})

    } else {
			this.setState({
				errorMsg : CommonFuns.getErrorMessage(code),
				isLoading:false
			})
    }
  }

  stepErrorHandle(message, data) {
    var index = parseInt(message[0]);
    var errorMessage;
    var reportData = data.CriteriaList[index];
    var j2d = CommonFuns.DataConverter.JsonToDateTime;
    var list;
    if (reportData.DateType !== 33) {
      var dateType = CommonFuns.GetStrDateType(reportData.DateType);
      var timeregion = CommonFuns.GetDateRegion(dateType);
      list = CommonFuns.getInterval(timeregion.start, timeregion.end).stepList;
    } else {
      var startTime = j2d(reportData.DataStartTime, false);
      var endTime = j2d(reportData.DataEndTime, false);
      list = CommonFuns.getInterval(startTime, endTime).stepList;
    }
    var map = {
      'Hourly': 1,
      'Daily': 2,
      'Weekly': 3,
      'Monthly': 4,
      'Yearly': 5
    };
		var stepNumList=[0,1,2,5,3,4];
    var stepList = [I18N.Common.AggregationStep.Minute, I18N.Common.AggregationStep.Hourly, I18N.Common.AggregationStep.Daily, I18N.Common.AggregationStep.Monthly, I18N.Common.AggregationStep.Yearly, I18N.Common.AggregationStep.Weekly];
    var curStep = stepList[reportData.ExportStep];
    var start = map[message[1]];
    var ret = [];
    for (var i = start; i <= 5; i++) {
      if (list.indexOf(stepNumList[i])>-1) {
        ret.push('"' + stepList[stepNumList[i]] + '"');
      }
    }
    if (ret.length > 0) {
      errorMessage = I18N.format(I18N.EM.Report.StepError, curStep, ret.join(','));
    } else {
      errorMessage = I18N.format(I18N.EM.Report.StepError2, curStep);
    }
    CommonFuns.popupErrorMessage(errorMessage, '', true);
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
                background: 'transparent',
								border:'1px solid #abafae'
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
          <div style={{fontSize:'14px'}}>
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

	_renderReportData(){
		var addReportDataButton = (<div className="kpi-report-add-button">
				<LinkButton iconName={ "icon-hierarchy-fold" } onClick={this._addReportData}/>
															</div>);
		var dataLength = this.state.reportItem.get('data').size;
		var reportData = this.state.reportItem.get('data').map((item, index)=>{
		let props = {
		key: dataLength - index,
		ref: 'reportData' + (index + 1),
		hierarchyId:this.props.hierarchyId,
		disabled: false,
		startTime: item.get('DataStartTime'),
		endTime: item.get('DataEndTime'),
		reportType: item.get('ReportType'),
		dateType: item.get('DateType'),
		step: item.get('ExportStep'),
		numberRule: item.get('NumberRule'),
		targetSheet: item.get('TargetSheet'),
		isExportTagName: item.get('IsExportTagName'),
		isExportTimestamp: item.get('IsExportTimestamp'),
		startCell: item.get('StartCell'),
		exportLayoutDirection: item.get('ExportLayoutDirection'),
		sheetNames: this.state.sheetNames,
		updateReportData: this._updateReportData,
		deleteReportData: this._deleteReportData,
		showStep: item.get('ReportType') === 1 ? false : true,
		index: index,
		dataLength: dataLength,
		id: item.get('Id'),
		tagList: item.get('TagsList'),
		addReport: this.state.reportItem.get('id') === 0 ? true : false,
		settingYear:this.state.reportItem.get('year')
	};
	return (
		<ReportDataItem {...props}></ReportDataItem>
		);
});
		return(
			<div>
				<div className="kpi-report-add">
					<div className="kpi-report-add-text">{I18N.Setting.KPI.Report.Data}</div>
					{addReportDataButton}
				</div>
				<div className="kpi-report-commnet">
					{I18N.Setting.KPI.Report.DataComment}
				</div>
				<div className="kpi-report-data">
					{reportData}
				</div>
			</div>

		)
	}

	_renderFooter(){
		return(
			<div className="kpi-report-footer">
				<FormBottomBar isShow={true} allowDelete={false} allowEdit={false} enableSave={!this.state.saveDisabled}
					ref="actionBar" status={formStatus.EDIT} onSave={this._saveReport} onCancel={this.props.onCancel}
					cancelBtnProps={{label:I18N.Common.Button.Cancel2}}/>
			</div>

		)
	}

  _renderUploadDialog() {
    if (!this.state.showUploadDialog) {
    return null;
    }
    return (<Dialog
    ref="uploadDialog"
    open={true}
    modal={true}>
      {I18N.format(I18N.EM.Report.UploadingTemplate, this.state.fileName)}
    </Dialog>);
  }

	_renderErrorMsg(){
		var that = this;
		var onClose = function() {
			that.setState({
				errorMsg: null,
			});
		};
		if (this.state.errorMsg!==null) {
			return (<Dialog
				ref = "_dialog"
				title={I18N.Platform.ServiceProvider.ErrorNotice}
				modal={false}
				open={!!this.state.errorMsg}
				onRequestClose={onClose}
				>
				{this.state.errorMsg}
			</Dialog>);
		} else {
			return null;
		}
	}

	componentWillMount(){
	 customerId=parseInt(this.context.router.params.customerId);
    ReportAction.getTemplateListByCustomerId(customerId, 'Name', 'asc')
	}

	componentDidMount(){
		ReportStore.addChangeListener(this._onChange);
		ReportStore.addSaveSuccessChangeListener(this._onSave);
		ReportStore.addSaveErrorChangeListener(this._onErrorHandle);
	}

	componentWillUnmount(){
		ReportStore.removeChangeListener(this._onChange);
		ReportStore.removeSaveSuccessChangeListener(this._onSave);
		ReportStore.removeSaveErrorChangeListener(this._onErrorHandle);
	}

	render() {
		var {hierarchyName}=this.props;
		if(this.state.templateList===null || this.state.isLoading){
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
						paddingLeft:'50px',
						marginTop:'0px'
					}
				};
				return (
					<TitleComponent {...titleProps}>
            {this._renderReportInfo()}
						{this._renderReportData()}
						{this._renderFooter()}
            {this._renderUploadDialog()}
						{this._renderErrorMsg()}
					</TitleComponent>
				);
		}
	}
}
ReportConfig.propTypes = {
  hierarchyId:React.PropTypes.number,
  hierarchyName:React.PropTypes.string,
  report:React.PropTypes.object,
	onSave:React.PropTypes.object,
	onCancel:React.PropTypes.object,
};

ReportConfig.defaultProps = {
  // hierarchyId:React.PropTypes.number,
  hierarchyName:'SOHO China',
  report:null,
	// Immutable.fromJS({
	// 	"CreateUser":"",
	// 	"CriteriaList":[
	// 		{"ExportStep":1,
	// 			"ExportLayoutDirection":0,
	// 			"StartCell":"a1",
	// 			"DataStartTime":"/Date(1454284800000)/",
	// 			"NumberRule":0,
	// 			"IsExportTagName":true,
	// 			"DateType":33,
	// 			"TargetSheet":"DataExport",
	// 			"ReportType":0,
	// 			"Index":0,
	// 			"TagsList":[{"TagId":100021,"TagIndex":0}],
	// 			"IsExportTimestamp":false,
	// 			"DataEndTime":"/Date(1456790400000)/"}
	// 		],
	// 			"HierarchyId":100002,
	// 			"Id":0,
	// 			"Name":"1",
	// 			"TemplateId":112,
	// 			"Year":2016
	// 		}),
};
