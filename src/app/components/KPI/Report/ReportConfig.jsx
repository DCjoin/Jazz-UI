import React, { Component } from 'react';
import ReactDom from 'react-dom';

import classnames from 'classnames';

import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import FontIcon from 'material-ui/FontIcon';
import SvgIcon from 'material-ui/SvgIcon';
import Popover from 'material-ui/Popover';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

import Dialog from 'controls/NewDialog.jsx';
import TitleComponent from 'controls/TitleComponent.jsx';
import Immutable from 'immutable';
import ReportAction from 'actions/KPI/ReportAction.jsx';
import ReportStore from 'stores/KPI/ReportStore.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import UploadForm from 'controls/UploadForm.jsx';
import CommonFuns from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';
import LinkButton from 'controls/LinkButton.jsx';
import ReportDataItem from './ReportDataItem.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import UploadConfirmDialog from './UploadConfirmDialog.jsx';
import {ReportStatus} from '../../../constants/actionType/KPI.jsx';

let verifyItem = true;

function stepLabelProps(stepValue, currentStep) {
  let props = {
    style: {
      height: 50,
      fontSize: 14,
      color: '#0f0f0f',
      fontWeight: 'bold',
    },
  },
  iconColor = '#32ad3d';
  if( currentStep < stepValue ) {
    props.style.color = '#9fa0a4';
    iconColor = '#a3e7b0';
  }
  props.icon = (
    <SvgIcon color={iconColor} style={{
          display: 'block',
          fontSize: 24,
          width: 24,
          height: 24,
          color: iconColor,
      }}>
    <circle cx={12} cy={12} r={10}/>
    <text x={12} y={16} fill='#ffffff' fontSize='12px' textAnchor='middle'>{stepValue + 1}</text>
  </SvgIcon>);
  return props;
}

var customerId=null;


class CustomDropDownMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false
    }
  }
  render() {
    return (
      <div style={{position: 'relative', width: 430,}}>
        <TextField fullWidth={true} hintText='请选择' value={this.props.label} inputStyle={{
          width: 400,
          textOverflow: 'ellipsis',
        }}/>
        <div onClick={() => {
            this.setState({
              opened: true,
              anchorEl: ReactDom.findDOMNode(this),
            });
            if(this.props.onOpen) {
              this.props.onOpen();
            }
          }}
          style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}>
            <ArrowDropDown style={{
            position: 'absolute',
            top: 10,
            right: 0,
            color: '#e0e0e0',
            border: 10,
            backgroundColor: 'transparent',
            outline: 'none',
          }}/>
          <Popover
            open={this.state.opened}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={() => {
              this.setState({
                opened: false,
                anchorEl: null,
              });
            }}
          >
            <Menu listStyle={{
                display: 'inline',
                width: 'auto',
              }}
              style={{width: 430}}
              onClick={() => {
                this.setState({
                  opened: false,
                  anchorEl: null,
                });
            }}>{this.props.children}</Menu>
          </Popover>
        </div>

      </div>
    );
  }
}

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
		this._addReportData = this._addReportData.bind(this);
		this._deleteReportData = this._deleteReportData.bind(this);
		// this._updateReportData = this._updateReportData.bind(this);
		this._saveReport = this._saveReport.bind(this);
		this._onSave = this._onSave.bind(this);
		this._onErrorHandle = this._onErrorHandle.bind(this);
		this._onChangeFile = this._onChangeFile.bind(this);
		this._onUploadDone = this._onUploadDone.bind(this);
	}

	state={
    saveDisabled: this.props.report===null?true:false,
    templateList:null,
    reportItem:this.props.report===null?this.newReportItem():ReportStore.getDefalutReport(this.props.report.toJS()),
    showUploadDialog: false,
    fileName: '',
		errorMsg:null,
		isLoading:false,
		showUploadConfirm:false,
    step: 0,
    willDeleteIndex: null,
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
		var saveDisabled=reportItem.get('data')
                      .map((report,id)=>(sheetNames.findIndex(item=>item===report.get('TargetSheet'))>-1))
											.has(false);
		this.setState({
			reportItem: reportItem,
			sheetNames: sheetNames,
			saveDisabled:saveDisabled?saveDisabled:this.state.saveDisabled
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
    if(this.refs.reportTitleId) {
       this.refs.reportTitleId.clearErrorText();
    }
	}

  _isValid() {
    if(this.state.step === 0) {
      return this.refs.reportTitleId.isValid();
    } else {
      return this.state.reportItem.get('data').size > 0;
    }
  }

  _isNew() {
    return !this.props.report;
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

  _onUploadDone(iframe) {
	var json = iframe.contentDocument.body.innerHTML;
	var obj = JSON.parse(json);
	var reportItem = this.state.reportItem;
	if (obj.success === true) {
		reportItem = reportItem.set('templateId', obj.TemplateId);
		ReportAction.getTemplateListByCustomerId(this.context.currentRoute.params.customerId, 'Name', 'asc');
		this.setState({
      reportItem: reportItem,
			saveDisabled: !this._isValid(),
			showUploadDialog: false
		},()=>{
			this._updateReportItem(reportItem,Immutable.fromJS(obj.SheetList))
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
  }
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

  _setStep(step) {
    return () => {
      this.setState({step});
    }
  }

  _getAddData() {

    var imSheetNames = this.state.sheetNames;
    var sheetNames = imSheetNames !== null ? imSheetNames.toJS() : null;
    var dateType = CommonFuns.GetStrDateType(7);//this year
    var timeRange = CommonFuns.GetDateRegion(dateType);
    var d2j = CommonFuns.DataConverter.DatetimeToJson;
    var startTime = d2j(timeRange.start);
    var endTime = d2j(timeRange.end);
    return {
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
  }

	_addReportData(){
  	var reportItem = this.state.reportItem;
  	var reportData = reportItem.get('data');
  	reportData = reportData.unshift(Immutable.fromJS(this._getAddData()));
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
/*	var me = this;
	var reportItem = this.state.reportItem;
	var reportData = reportItem.get('data');
	reportData = reportData.setIn([index, name], value);
	if (name === 'DateType') {
		reportData = reportData.setIn([index, 'ExportStep'], stepValue);
		reportData = reportData.setIn([index, 'DataStartTime'], startTime);
		reportData = reportData.setIn([index, 'DataEndTime'], endTime);
	}
	if(name==='ReportType'){
		if(value===1){
			reportData = reportData.setIn([index, 'ExportStep'], 0);
		}
		else {
			if(reportData.getIn([index, 'DateType'])===7){
				reportData = reportData.setIn([index, 'ExportStep'], 1);
			}
		}

	}
	reportItem = reportItem.set('data', reportData);
	this.setState({
		reportItem: reportItem
	}, () => {
		this.setState({
			saveDisabled: !me._isValid()
		});
	});*/
	}

	_deleteReportData(index) {
		var me=this;
  	var reportItem = this.state.reportItem;
  	var reportData = reportItem.get('data');
  	reportData = reportData.delete(index);
  	reportData = reportData.map((item, i) => {
  		return item.set('Index', i);
  	});
  	reportItem = reportItem.set('data', reportData);
  	this.setState({
  		reportItem: reportItem
  	},()=>{
  		this.setState({
  			saveDisabled: !me._isValid()
  		})
  	});
	}

  _willdeleteReportData(index) {
    this.setState({
      willDeleteIndex: index
    });
  }

	_onSave(Id){
		this.setState({
			errorMsg:null,
			isLoading:false
		},()=>{
			this.props.onSave(Id);
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

  _renderNav() {
    let {step} = this.state;
    return (
      <nav className='jazz-kpi-config-stepper jazz-card'>
        <Stepper activeStep={step} style={{width: '40%'}}>
          <Step>
            <StepLabel {...stepLabelProps(0, step)}>{' 基础设置 '}</StepLabel>
          </Step>
          <Step>
            <StepLabel {...stepLabelProps(1, step)}>{' 表格数据设置 '}</StepLabel>
          </Step>
        </Stepper>
      </nav>
    );
  }

  _renderStepButtons() {
    let {step, reportItem} = this.state;
    if( step === 0 ) {
      let disabled = !reportItem.get('name') || !reportItem.get('templateId');
      return (<div style={{marginTop: 20}}>
        <NewFlatButton style={{float: 'right'}} disabled={disabled} primary label={'下一步'} onClick={this._setStep(1)}/>
      </div>);
    } else {
      let disabled = !this.state.reportItem.get('data') || !this.state.reportItem.get('data').size;
      return (<div style={{marginTop: 20}}>
        <NewFlatButton style={{float: 'left'}} secondary label={'上一步'} onClick={this._setStep(0)}/>
        <NewFlatButton style={{float: 'right'}} disabled={disabled || !verifyItem} primary label={'完成'} onClick={this._saveReport}/>
      </div>);
    }
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
          <NewFlatButton secondary
            label={I18N.EM.Report.DownloadTemplate}
            onClick={this._downloadTemplate}
            style={{
              height: 23,
              width: 68,
              lineHeight: '14px',
            }}
            labelStyle={{
              lineHeight: '14px',
              padding: 0,
            }}
            disabled={reportItem.get('templateId')===null}/>
        </div>);

      var uploadButton = (<div style={{width:'100px'}}><label ref="fileInputLabel" className="jazz-template-upload-label" htmlFor="fileInput">
					<div style={{width:'100px',height:'30px'}} className="jazz-kpi-report-btn">{I18N.EM.Report.UploadTemplate}</div>
            <input type="file" ref="fileInput" id='fileInput' name='templateFile' onChange={this._handleFileSelect} style={fileInputStyle}/>
          </label>
          </div>);

      return(
        <div className={classnames("kpi-report-info", {['jazz-card']: this._isNew()})}>
        {!this._isNew() && <div style={{fontSize: '14px', fontWeight: 'bold', color: '#0f0f0f'}}>基本设置</div>}
          <div>
            <ViewableTextField {...titleProps}/>
          </div>
          <div>
            <div>
              <span>{I18N.EM.Report.Template}</span>
              <a style={{marginLeft: 10}} href="javascript:void(0)" onClick={this._onTemplateOpen}>
                <FontIcon className='icon-setting' style={{fontSize: '15px', color: '#32ad3d'}}/>
              </a>
            </div>
            <CustomDropDownMenu onOpen={() =>{
              this.refs.upload_tempalte.reset();
            }} label={
              reportItem.get('templateId') && ReportStore.getTemplateItems(templateList)
                .find(item => item.payload === reportItem.get('templateId')).text
              }>
              <div style={{color: '#9fa0a4', fontSize: '14px', height: 48, lineHeight: '48px', padding: '0 16px'}}>请选择</div>
              {ReportStore.getTemplateItems(templateList).map(item =>
              <MenuItem onTouchTap={() => {
                this._onExistTemplateChange(item.payload)
              }} >
                <div title={item.text} style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}>{item.text}</div>
              </MenuItem>
                )}
              <label htmlFor={'upload_tempalte'} style={{
                color: '#9fa0a4',
                fontSize: '14px',
                textDecoration: 'underline',
                height: 48,
                lineHeight: '48px',
                margin: '0 16px',
                position: 'relative',
                cursor: 'pointer',
              }}>
                添加报表模板
              </label>
            </CustomDropDownMenu>
            <div style={{zIndex: -1, position: 'relative'}}>
              <UploadForm
                id={'upload_tempalte'}
                ref={'upload_tempalte'}
                action={'TagImportExcel.aspx?Type=ReportTemplate'}
                fileName={'templateFile'}
                enctype={'multipart/form-data'}
                method={'post'}
                onload={this._onUploadDone}
                onChangeFile={this._onChangeFile}>
                <input type="hidden" name='CustomerId' value={parseInt(customerId)}/>
                <input type="hidden" name='IsActive' value={true}/>
              </UploadForm>
            </div>
            {downloadButton}
          </div>
					{this.state.fileName!=='' && this.state.showUploadConfirm && <UploadConfirmDialog name={this.state.fileName}
															 onConfirm={(status)=>{
                                 if(status===ReportStatus.NotExist){
                                   this.refs.upload_tempalte.upload({IsReplace: false});
                                 }else {
                                   this.refs.upload_tempalte.upload({IsReplace: true});
                                 }
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

      )
  }

  _renderReportList() {
    let { reportItem } = this.state,
    list = [];

    if( reportItem && reportItem.get('data').size > 0 ) {
      verifyItem = true;
      list = reportItem.get('data').map( (item, idx) => {
        let noSheet = ReportStore.getSheetNamesByTemplateId(this.state.reportItem.get('templateId'))
                        .indexOf(item.get('TargetSheet')) === -1,
        noSheetStyle = noSheet ? {
          marginBottom: 20
        } : {},
        noSheetValStyle = noSheet ? {
          color: 'red'
        } : {};
        if(noSheet) {
          verifyItem = false;
        }
        return (
          <div className='kpi-report-data-item' style={noSheetStyle}>
            <header className='kpi-report-data-item-header'>
              <span className='kpi-report-data-item-name hiddenEllipsis' title={item.get('Name')}>{item.get('Name')}</span>
              <span className='kpi-report-data-item-action'>
                <LinkButton label={'编辑'} onClick={() => {
                  this.setState({
                    dialogEditDataIdx: idx,
                  });
                }}/>
                <LinkButton label={'删除'} onClick={() => {
                  this._willdeleteReportData(idx);
                  // this._deleteReportData(idx);
                }}/>
              </span>
            </header>
            <dl className='kpi-report-data-item-detail'>
              <dt className='kpi-report-data-item-detail-name'>{'起始单元格'}</dt>
              <dd className='kpi-report-data-item-detail-value'>{item.get('StartCell')}</dd>
              <dt className='kpi-report-data-item-detail-name'>{'数据点'}</dt>
              <dd className='kpi-report-data-item-detail-value'>{item.get('TagsList').size + '个'}</dd>
              <dt className='kpi-report-data-item-detail-name' style={noSheetValStyle}>{'模板Sheet'}</dt>
              <dd className='kpi-report-data-item-detail-value hiddenEllipsis' style={noSheetValStyle} title={!noSheet && item.get('TargetSheet')}>{
                  noSheet ? '-' : item.get('TargetSheet')
              }</dd>
            </dl>
            {noSheet && <footer style={{color: 'red', fontSize: '12px', marginTop: 20}}>模板已被替换，请重新选择</footer>}
          </div>
        );
      }
       ).toJS();
    }
    return list.concat(<button className='kpi-report-add-panel icon-add' onClick={() => {
      this.setState({
        dialogEditDataIdx: -1,
      });
    }}/>)
  }

  _renderEditDataDialog() {
    let index = this.state.dialogEditDataIdx;
    if( typeof index === 'number' ) {
      let item = Immutable.fromJS(this._getAddData());
      if(index >= 0) {
        item = this.state.reportItem.get('data').get(index);
      }

      let props = {
        ref: 'report_data_item',
        data: item,
        itemsName: this.state.reportItem.get('data')
                    .filter(data => data.get('Name') !== item.get('Name'))
                    .map(data => data.get('Name')).toJS(),
        hierarchyId:this.props.hierarchyId,
        sheetNames: this.state.sheetNames,
        settingYear:this.state.reportItem.get('year'),
        onSave: (item) => {
          if(index >= 0) {
            this.setState({
              dialogEditDataIdx: null,
              reportItem: this.state.reportItem.setIn(['data', index], item)
            });
          } else {
            let reportData = this.state.reportItem.get('data').unshift(item)
            this.setState({
              dialogEditDataIdx: null,
              reportItem: this.state.reportItem.set('data', reportData)
            });
          }
        },
        onClose: () => {
          this.setState({
            dialogEditDataIdx: null
          });
        }
      };
      return (<ReportDataItem {...props}/>);
    }
    return null;
  }

	_renderReportData(){
    let isNew = this._isNew();
    return (
      <div className={classnames('kpi-report-data', {['jazz-card']: isNew})}>
        {isNew ? <div>至少添加一组表格数据</div> :
        <div style={{fontSize: '14px', fontWeight: 'bold', color: '#0f0f0f'}}>表格数据设置
          <span style={{fontSize: '12px', color: 'red', marginLeft: 20}}>{'注：至少配置一组表格数据'}</span>
        </div>}
        {this._renderReportList()}
        {this._renderEditDataDialog()}
      </div>
    );
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

  _renderDeleteDialog() {
    let msg = '';
    if( this.state.willDeleteIndex !== null ) {
      msg = `删除表格数据“${this.state.reportItem.getIn(['data', this.state.willDeleteIndex, 'Name'])}”吗？`
    }
    return (<Dialog
      actions={[
        <NewFlatButton label={I18N.Common.Button.Delete} secondary onClick={() => {
          this._deleteReportData(this.state.willDeleteIndex);
          this.setState({
            willDeleteIndex: null
          });
        }}/>,
        <NewFlatButton label={I18N.Common.Button.Cancel2} onClick={() => {
          this.setState({
            willDeleteIndex: null
          });
        }}/>
      ]}
      open={this.state.willDeleteIndex !== null}>
      <div style={{
        minHeight: '60px',
        fontSize: '18px',
        lineHeight: '60px',
      }}>
      {msg}
      </div>
    </Dialog>);
  }

	_renderErrorMsg(){
		var that = this;
		if( new RegExp(
				I18N.EM.Report.DuplicatedName.replace(/{\w}/, '(.)*')
			).test(this.state.errorMsg)
		) {
			return null;
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
	}

  _renderClose() {
    return (
      <FontIcon
        className='icon-close'
        style={{fontSize: '16px', position: 'absolute', right: 20, top: 20, cursor: 'pointer'}}
        onClick={this.props.onCancel}/>
    );
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
      if( this._isNew() ) {
        let titleProps={
          title:I18N.Setting.KPI.Report.ConfigTitle.New,
          style: {margin: 0},
          contentStyle:{
            marginLeft:'0'
          },
          titleStyle:{
            fontSize:'16px',
            color: '#0f0f0f',
            fontWeight: 'bold',
          },
          className:'jazz-kpi-config-wrap',
        };
        return (
          <TitleComponent {...titleProps}>
            {this._renderNav()}
            {this.state.step === 0 && this._renderReportInfo()}
            {this.state.step === 1 && this._renderReportData()}
            {/*this._renderFooter()*/}
            {this._renderStepButtons()}

            {this._renderUploadDialog()}
            {this._renderDeleteDialog()}
            {this._renderErrorMsg()}
            {this._renderClose()}
          </TitleComponent>
        );
      } else {
        let titleProps={
          title:I18N.Setting.KPI.Report.ConfigTitle.Edit,
          style: {margin: 0},
          contentStyle:{
            marginLeft:'0'
          },
          titleStyle:{
            fontSize:'16px',
            color: '#0f0f0f',
            fontWeight: 'bold',
          },
          className:'jazz-kpi-config-wrap',
        },
        reportItem = this.state.reportItem;
        return (
          <TitleComponent {...titleProps}>
            <div className='jazz-card'>
              {this._renderReportInfo()}
              {this._renderReportData()}
              <div style={{marginTop: 40, marginLeft: 15, width: 450, marginBottom: 25, textAlign: 'right'}}>
                <NewFlatButton disabled={reportItem.get('data').size === 0 || !reportItem.get('name') || !verifyItem} onClick={this._saveReport} label={'保存并退出'} primary/>
              </div>
            </div>
            {this._renderUploadDialog()}
            {this._renderDeleteDialog()}
            {this._renderErrorMsg()}
            {this._renderClose()}

          </TitleComponent>
        );
      }
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
  hierarchyName:'SOHO China',
  report:null,
};
