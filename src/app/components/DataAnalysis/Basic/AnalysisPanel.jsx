'use strict';
import React, { Component }  from "react";
import Immutable from 'immutable';
import { withRouter } from 'react-router';
import assign from "object-assign";
import classNames from 'classnames';
import FlatButton from 'controls/FlatButton.jsx';
import TagDrawer from './TagDrawerNew.jsx';
import FolderStore from 'stores/FolderStore.jsx';
import Dialog from 'controls/OperationTemplate/BlankDialog.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import MultipleTimespanStore from 'stores/Energy/MultipleTimespanStore.jsx';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import _ from 'lodash';
import EnergyStore from 'stores/Energy/EnergyStore.jsx';
import CommonFuns from 'util/Util.jsx';
import ChartStatusStore from 'stores/Energy/ChartStatusStore.jsx';
import FolderAction from 'actions/FolderAction.jsx';
import ExportChartAction from 'actions/ExportChartAction.jsx';
// import ConstStore from 'stores/ConstStore.jsx';
import TagStore from 'stores/TagStore.jsx';
// import DateTimeSelector from 'controls/DateTimeSelector.jsx';
import GlobalErrorMessageAction from 'actions/GlobalErrorMessageAction.jsx';
import AlarmTagStore from 'stores/AlarmTagStore.jsx';
import MultiTimespanAction from 'actions/MultiTimespanAction.jsx';
import EnergyAction from 'actions/EnergyAction.jsx';
import ErrorStepDialog from '../../alarm/ErrorStepDialog.jsx';
import ChartStatusAction from 'actions/ChartStatusAction.jsx';
import ChartSubToolbar from './ChartSubToolbar.jsx';
import CalendarManager from '../../energy/CalendarManager.jsx';
import DataAnalysisStore from 'stores/DataAnalysis/DataAnalysisStore.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import ChartComponent from './ChartComponent.jsx';
import {GenerateSolutionButton} from './GenerateSolution.jsx';
import {MenuAction} from 'constants/AnalysisConstants.jsx';
import BasicAnalysisAction from 'actions/DataAnalysis/BasicAnalysisAction.jsx';
import CommodityStore from 'stores/CommodityStore.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';
import WidgetStore from 'stores/Energy/WidgetStore.jsx';
import TagAction from 'actions/TagAction.jsx';
import CommodityAction from 'actions/CommodityAction.jsx';
import AuxiliaryFunction from './AuxiliaryFunction.jsx';
import ChartAction from 'actions/ChartAction.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';

const DIALOG_TYPE = {
  SWITCH_WIDGET: "switchwidget",
  SWITCH_EC: 'switchec',
  ERROR_NOTICE: 'errornotice'
};

var ntLocation=null;


class AnalysisPanel extends Component {

  static contextTypes = {
    router: React.PropTypes.object,
  };

  isInitial=false;

  constructor(props) {
    super(props);
    this._onRelativeDateChange = this._onRelativeDateChange.bind(this);
    this._onDateSelectorChanged = this._onDateSelectorChanged.bind(this);
    this._onTagChanged = this._onTagChanged.bind(this);
    this.setFitStepAndGetData = this.setFitStepAndGetData.bind(this);
    this._onSearchDataButtonClick = this._onSearchDataButtonClick.bind(this);
    this._onEnergyDataChange = this._onEnergyDataChange.bind(this);
    this._onLoadingStatusChange = this._onLoadingStatusChange.bind(this);
    this._onGetEnergyDataError = this._onGetEnergyDataError.bind(this);
    this._onGetEnergyDataErrors = this._onGetEnergyDataErrors.bind(this);
    this._onErrorDialogAction = this._onErrorDialogAction.bind(this);
    this._onSearchBtnItemTouchTap = this._onSearchBtnItemTouchTap.bind(this);
    this._handleEnergyStepChange = this._handleEnergyStepChange.bind(this);
    this._onCheckWidgetUpdate = this._onCheckWidgetUpdate.bind(this);
    this._initYaxisDialog = this._initYaxisDialog.bind(this);
    this._onYaxisSelectorDialogSubmit = this._onYaxisSelectorDialogSubmit.bind(this);
    this._handleCalendarChange = this._handleCalendarChange.bind(this);
    this.routerWillLeave  = this.routerWillLeave.bind(this);
    this.getCurrentWidgetDto  = this.getCurrentWidgetDto.bind(this);
    this.getRemarck  = this.getRemarck.bind(this);
    this._onDialogChanged  = this._onDialogChanged.bind(this);
    this._handleSave  = this._handleSave.bind(this);
    this._onChartTypeChanged  = this._onChartTypeChanged.bind(this);
  }

  state={
      tagShow:false,
      dialogType:'',
      isLoading: false,
      energyData: null,
      energyRawData: null,
      submitParams: null,
      step: null,
      yaxisConfig: null,
      selectedChartType: 'line',
      remarkText: '',
      remarkDisplay: false,
      relativeDate:'Last7Day',
      operationMenuOpen:false,
      timeRanges:this.getInitTimeRanges(),
      willLeave:false,
      showLeaveDialog:false,
      showSaveDialog:false,
      sureLevalCallback: null,
      hierarchyId:this.props.hierarchyId,
      isBuilding:this.props.isBuilding,
      dimId:null,
      tagId:null,
      isViewName: true,
  }

  isMultiTime=false;

  componentWillReceiveProps() {
    this.setState({
      isViewName: true
    });
  }

  getInitTimeRanges(){
    let date = new Date();
    date.setHours(0, 0, 0);
    let last7Days = CommonFuns.dateAdd(date, -6, 'days');
    let endDate = CommonFuns.dateAdd(date, 1, 'days');
    return CommonFuns.getTimeRangesByDate(last7Days,endDate);
  }

  getRemarck(e) {
    this.setState({
      remarkText: e.target.value
    });
  }

  energyDataLoad(timeRanges, step, tagOptions, relativeDate, weatherOption) {
    EnergyAction.getEnergyTrendChartData(timeRanges, step, tagOptions, relativeDate, weatherOption, this.props.widgetDto.Id);
  }

  pieEnergyDataLoad(timeRanges, step, tagOptions, relativeDate) {
    EnergyAction.getPieEnergyData(timeRanges, step, tagOptions, relativeDate);
  }

  getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize) {
    EnergyAction.getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize);
  }

  initEnergyStoreByBizChartType() {
  let chartType = this.state.selectedChartType;
  switch (chartType) {
    case 'line':
    case 'column':
    case 'stack':
      EnergyStore.initReaderStrategy('EnergyTrendReader');
      break;
    case 'pie':
      EnergyStore.initReaderStrategy('EnergyPieReader');
      break;
    case 'rawdata': EnergyStore.initReaderStrategy('EnergyRawGridReader');
      break;
  }
  }

  setFitStepAndGetData(startDate, endDate, tagOptions, relativeDate) {
  let timeRanges,
    weather;
  if (tagOptions.length > 1) {
    MultiTimespanAction.clearMultiTimespan('both');
    timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
  } else {
    timeRanges = MultipleTimespanStore.getSubmitTimespans();
    if (timeRanges === null) {
      timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
    }
  }

  let step = this.state.step,
    limitInterval = CommonFuns.getLimitInterval(timeRanges),
    stepList = limitInterval.stepList;
  if (stepList.indexOf(step) === -1) {
    step = limitInterval.display;
  }
  this.setState({
    isCalendarInited: false,
  });
  this.energyDataLoad(timeRanges, step, tagOptions, relativeDate, weather);
  }

  _onSearchDataButtonClick(invokeFromMultiTime=false){
    //invokeFromMultiTime 来判断是不是点击多时间段的绘制按钮进行查看。
    if(invokeFromMultiTime!==null){
      this.isMultiTime=invokeFromMultiTime;
    }
    // console.log(invokeFromMultiTime);
    let dateSelector = this.refs.subToolBar.refs.dateTimeSelector;
    let dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end;
    if (this.state.selectedChartType === 'rawdata' && (endDate - startDate > 604800000)) {
        FolderAction.setDisplayDialog('errornotice', null, I18N.EM.RawData.ErrorForEnergy);
      } else {
        this.initEnergyStoreByBizChartType();

        // deal with multi time submit
        if (!!invokeFromMultiTime) {

          let multiRelativeType = MultipleTimespanStore.getOriginalType();
          let relativeDateValue = this.state.relativeDate;

          if (multiRelativeType === 'Customerize') {
            let multiDateRange = MultipleTimespanStore.getMainDateRange();
            if (multiDateRange[0].getTime() !== startDate.getTime() || multiDateRange[1].getTime() !== endDate.getTime()) {
              dateSelector.setDateField(multiDateRange[0], multiDateRange[1]);
            }
            if (relativeDateValue !== 'Customerize') {
              this._onRelativeDateChange(null,null,multiRelativeType,false);
            }
          } else {

            if (relativeDateValue !== multiRelativeType) {
              this._onRelativeDateChange(null,null,multiRelativeType,false);
            }
          }
        } else {
          let timeRanges = MultipleTimespanStore.getSubmitTimespans();
          // console.log(timeRanges);
          if (timeRanges !== null && timeRanges.length !== 1) {
            let multiRelativeType = MultipleTimespanStore.getOriginalType();
            let relativeDateValue = this.state.relativeDate;
            // console.log(multiRelativeType);
            // console.log(relativeDateValue);
            if (multiRelativeType !== 'Customerize' && multiRelativeType === relativeDateValue) {

            } else {
              MultipleTimespanStore.initData(relativeDateValue, startDate, endDate);
            }
          }
        }

        var nodeOptions;

      if (startDate.getTime() >= endDate.getTime()) {
          GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.EM.ErrorNeedValidTimeRange);
          return;
        }

      nodeOptions = AlarmTagStore.getSearchTagList();
      if (!nodeOptions || nodeOptions.length === 0) {
        this.setState({
          energyData: null
        });
        return;
      }

      let relativeDateValue = this.state.relativeDate;

      let chartType = this.state.selectedChartType;
        if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
            this.setFitStepAndGetData(startDate, endDate, nodeOptions, relativeDateValue);
          } else {
            if (chartType === 'pie') {
              let timeRanges;
              if (nodeOptions.length > 1) {
                MultiTimespanAction.clearMultiTimespan('both');
                timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
              } else {
                timeRanges = MultipleTimespanStore.getSubmitTimespans();
                if (timeRanges === null) {
                  timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
                }
              }
              this.pieEnergyDataLoad(timeRanges, 2, nodeOptions, relativeDateValue);
            } else if (chartType === 'rawdata') {
              MultiTimespanAction.clearMultiTimespan('both');
              let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
              this.getEnergyRawData(timeRanges, 0, nodeOptions, relativeDateValue);
            }
          }
      }
  }

  _onErrorDialogAction(step, stepBtnList) {
  this.setState({
    errorObj: null
  });
  if (step !== 'cancel') {
    this._handleEnergyStepChange(step);
  } else {
    if (stepBtnList.length === 0) {
      this.setState({
        energyData: null
      });
    } else {
      //this.state.chartStrategy.onSearchDataButtonClickFn(this);
    }
  }
  }
  _onTagChanged(){
    this.setState({
      errorObj:null
    },()=>{
      this._onSearchDataButtonClick();
    })

  }

  _onDialogChanged() {
    this.setState({
      dialogType: FolderStore.getDisplayDialog().type
    });
  }

  _onLoadingStatusChange(widgetId) {
    if( widgetId !== this.props.widgetDto.Id ) {
      return;
    }
    let isLoading = EnergyStore.getLoadingStatus(),
      paramsObj = EnergyStore.getParamsObj(),
      // tagOption = EnergyStore.getTagOpions()[0],
      obj = assign({}, paramsObj);

      obj.isLoading = isLoading;
      // obj.tagName = tagOption.tagName;
      // obj.dashboardOpenImmediately = false;
      // obj.tagOption = tagOption;
      obj.energyData = null;

      this.setState(obj);
  }

  _onEnergyDataChange(isError, errorObj, args) {
    if( typeof isError === 'number' && isError !== this.props.widgetDto.Id ) {
      return;
    }
    let isLoading = EnergyStore.getLoadingStatus(),
        energyData = EnergyStore.getEnergyData(),
        energyRawData = EnergyStore.getEnergyRawData(),
        paramsObj = assign({}, EnergyStore.getParamsObj()),
    state = {
      isLoading: isLoading,
      energyData: energyData,
      energyRawData: energyRawData,
      paramsObj: paramsObj,
      isCalendarInited: false
    };
  if (isError === true) {
    state.step = null;
    state.errorObj = errorObj;
    if (!!args && args.length && args[0] === '') {

    }
  }else {
    state.errorObj = null;
  }
    this.setState(state,()=>{
      if(this.isInitial){
        var dto=this.getCurrentWidgetDto();
        //console.log(dto);
        BasicAnalysisAction.setInitialWidgetDto(dto);
        this.isInitial=false;
      }
    });


  }

  _onGetEnergyDataError(widgetId) {
    let errorObj = this.errorProcess(EnergyStore);
    this._onEnergyDataChange(true, errorObj);
  }

  _onGetEnergyDataErrors() {
    let errorObj = this.errorsProcess(EnergyStore);
    this._onEnergyDataChange(false, errorObj);
  }

  _onCheckWidgetUpdate(sureLevalCallback, cancelLevalCallback, doned) {
    // console.log('_onCheckWidgetUpdate');
    if( doned ) {
      doned();
    }
    if(this.state.willLeave || WidgetStore.isUncheck()) {
      sureLevalCallback();
      return;
    }
    if(this.props.isNew){
      if(!!this.state.energyData){
        var currentWidgetDto=Immutable.fromJS(this.getCurrentWidgetDto());
        var originalWidgetDto=DataAnalysisStore.getInitialWidgetDto();
        if(Immutable.is(currentWidgetDto,originalWidgetDto)){
          return sureLevalCallback()
        } else {
          this.setState({
            showLeaveDialog:false,
            showSaveDialog:true,
            sureLevalCallback,
            cancelLevalCallback,
          })
        }
      }else {
        //无tag 提示是否离开
        //有tag，提示是否保存 loading的时候
        var tagList=AlarmTagStore.getSearchTagList();
        if(tagList.length===0){
          this.setState({
            showLeaveDialog:true,
            showSaveDialog:false,
            sureLevalCallback,
            cancelLevalCallback,
          })
        }else {
          this.setState({
            showLeaveDialog:false,
            showSaveDialog:true,
            sureLevalCallback,
            cancelLevalCallback,
          })
        }
      }
    }
    else {
      var currentWidgetDto=Immutable.fromJS(this.getCurrentWidgetDto());
      var originalWidgetDto=DataAnalysisStore.getInitialWidgetDto();
      // console.log(originalWidgetDto.toJS());
      // console.log(currentWidgetDto.toJS());
      // console.log(Immutable.is(currentWidgetDto,originalWidgetDto));
      if(originalWidgetDto===null || Immutable.is(currentWidgetDto,originalWidgetDto)){
        return sureLevalCallback()
      }
      else {
        this.setState({
          showLeaveDialog:false,
          showSaveDialog:true,
          sureLevalCallback,
          cancelLevalCallback,
        })
      }
    }
    }

  showStepError(step, EnergyStore) {
  let btns = [],
  msgs=['UseRaw','UseHour','UseDay','UseMonth','','UseWeek'],
    msg = [],
    map = {
      Hour: 1,
      Day: 2,
      Week: 5,
      Month: 3,
      Year: 4
    },
    paramsObj = EnergyStore.getParamsObj(),
    timeRanges = paramsObj.timeRanges,
    limitInterval = CommonFuns.getLimitInterval(timeRanges),
    availableList = limitInterval.stepList;
    msg = [msgs[paramsObj.step]];
  switch (step) {
    case 'Hourly':
      btns = ['Hour', 'Day', 'Week'];
      break;
    case 'Daily':
      btns = ['Day', 'Week', 'Month'];
      break;
    case 'Weekly':
      btns = ['Week', 'Month', 'Year'];
      break;
    case 'Monthly':
      btns = ['Month', 'Year'];
      break;
    case 'Yearly':
      btns = ['Year'];
      break;
  }
  var newBtns = [];
  btns.forEach(btn => {
    let code = map[btn];
    if (availableList.indexOf(code) !== -1) {
      newBtns.push({
        text: btn,
        code: code
      });
    }
  });
  btns = newBtns;
  var msg1 = [];
  msg.forEach(item => {
    msg1.push('"' + I18N.EM[item] + '"');
  });
  return {
    stepBtnList: btns,
    errorMessage: I18N.format(I18N.EM.StepError, msg1.join(','))
  };
  }

  errorProcess(EnergyStore) {
    let code = EnergyStore.getErrorCode(),
        messages = EnergyStore.getErrorMessage();

        if (!code) {
          return;
        } else if (code === '02004'.toString()) {
          let errorObj = this.showStepError(messages[0], EnergyStore);
          return errorObj;
        } else {
          let errorMsg = CommonFuns.getErrorMessage(code);
          setTimeout(() => {
            GlobalErrorMessageAction.fireGlobalErrorMessage(errorMsg, code);
          }, 0);
          return null;
        }
      }

  errorsProcess(EnergyStore) {
    let codes = EnergyStore.getErrorCodes();
    var errorMsg,
        textArray = [];
        if (!!codes && codes.length) {
          for (var i = 0; i < codes.length; i++) {
            errorMsg = CommonFuns.getErrorMessage(codes[i]);
            textArray.push(errorMsg);
          }
          setTimeout(() => {
            GlobalErrorMessageAction.fireGlobalErrorMessage(textArray.join('\n'));
          }, 0);
        }
        return null;
      }

  _handleSave(isSave=true){
    var widgetDto=this.getCurrentWidgetDto();
    if (!isSave) {
        return widgetDto;
      } else {
        BasicAnalysisAction.setInitialWidgetDto(widgetDto);
        FolderAction.updateWidgetDtos(widgetDto);
      }
  }

  getCurrentWidgetDto(){
    let chartType = this.state.selectedChartType;
    let tagOptions = EnergyStore.getTagOpions();
    let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
    let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions, TagStore.getCurrentDimInfo());
    let widgetDto = _.cloneDeep(this.props.widgetDto);
    let submitParams1 = EnergyStore.getSubmitParams();
    let paramsObj = EnergyStore.getParamsObj(),
      timeRanges = paramsObj.timeRanges,
      step = paramsObj.step,
      widgetTimeRanges;

    //submitParams part
    let submitParams = {
        options: nodeNameAssociation,
        tagIds: tagIds
      };

    //time range part
    if (timeRanges.length === 1) {
      let relativeDate = EnergyStore.getRelativeDate();
      if (relativeDate !== 'Customerize') {
        widgetTimeRanges = [{
        relativeDate: relativeDate
      }];
    } else {
      widgetTimeRanges = timeRanges;
    }
    } else {
      widgetTimeRanges = MultipleTimespanStore.getSave2DashboardTimespans();
    }

    // viewOption part
      let viewOption = {
        TimeRanges: widgetTimeRanges,
        Step: step
      };

      let includeNavigatorData = !(chartType === 'pie' || chartType === 'rawdata');
      viewOption.IncludeNavigatorData = includeNavigatorData;

      if (submitParams1 && submitParams1.viewOption) {
        let vo = submitParams1.viewOption;
        if (vo.IncludeTempValue)
          viewOption.IncludeTempValue = vo.IncludeTempValue;
        if (vo.IncludeHumidityValue)
          viewOption.IncludeHumidityValue = vo.IncludeHumidityValue;
      }

      viewOption.DataUsageType=1; // Energy

      if (chartType === 'rawdata') {
        let dataOption = {
          OriginalValue: true,
          WithoutAdditionalValue: true
        };
        viewOption.DataOption = dataOption;

        let pagingObj = this.refs.ChartComponent.refs.chart.getPageObj();
        let pagingOrder = {
          PageSize: 20,
          PageIdx: pagingObj.pageIdx,
          Order: {
            Column: 1,
            Type: 0
          },
          PreviousEndTime: null,
          Operation: 1
        };
        viewOption.PagingOrder = pagingOrder;
        chartType = 'original';
      } else {
        widgetDto.WidgetSeriesArray = ChartStatusStore.getWidgetSaveStatus();
      }

      submitParams.viewOption = viewOption;

      //storeType part
      let storeType;
      if (chartType === 'pie') {
        storeType = 'energy.Distribution';
      } else {
        storeType = 'energy.Energy';
      }

      let config = {
        type: chartType,
        storeType: storeType
      };

      let params = {
        submitParams: submitParams,
        config: config,
        calendar: this.state.calendarType
      };
      if (this.state.yaxisConfig !== null && this.state.yaxisConfig.length>0) {
        params.yaxisConfig = this.state.yaxisConfig;
      }
      let contentSyntax = {
        params: params
      };
      widgetDto.ContentSyntax = JSON.stringify(contentSyntax);
      widgetDto.Comment = this.state.remarkText;

      return widgetDto

  }

  _handleEnergyStepChange(step) {
    let tagOptions = EnergyStore.getTagOpions(),
      paramsObj = EnergyStore.getParamsObj(),
      timeRanges = paramsObj.timeRanges;

  this.setState({
    step: step,
    isCalendarInited: false,
  });

  this.energyDataLoad(timeRanges, step, tagOptions, false);
  }

  exportChart() {
    if (!this.state.energyData) {
      return;
    }
    let path;
  let chartType = this.state.selectedChartType;
  let tagOptions = EnergyStore.getTagOpions();
  let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
  let viewOption = EnergyStore.getSubmitParams().viewOption;
  let title = this.props.chartTitle || I18N.Folder.NewWidget.Menu1;

  let params = {
    title: title,
    tagIds: tagIds,
    viewOption: viewOption
  };

  path = '/Energy/GetTagsData4Export';
  let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions, {
    dimName: null,
    dimId: null
  });
  params.nodeNameAssociation = nodeNameAssociation;

  let charTypes = [];
  if (chartType !== 'rawdata') {
    let seriesNumber = EnergyStore.getEnergyData().toJS().Data.length;
    let seriesStatusArray = ChartStatusStore.getSeriesStatus();
    let sslength = seriesStatusArray.length;
    for (let i = 0; i < seriesNumber; i++) {
      let curChartType;
      if (i < sslength) {
        let serie = seriesStatusArray[i];
        if (serie) {
          if (serie.IsDisplay) {
            curChartType = ChartStatusStore.getChartTypeByNum(serie.ChartType);
          } else {
            curChartType = 'null';
          }
        } else {
          curChartType = chartType;
        }
      } else {
        curChartType = chartType;
      }
      charTypes.push(curChartType);
    }
  }

  params.charTypes = charTypes;
  ExportChartAction.getTagsData4Export(params, path);
  }

  _getErrorNoticeDialog() {
    var that = this;
    var _onCancel = function() {
      that.setState({
        dialogType: ''
      })
    };
    var props = {
      title: I18N.Platform.ServiceProvider.ErrorNotice,
      firstActionLabel: I18N.Mail.Send.Ok,
      content: FolderStore.getDisplayDialog().contentInfo,
      onFirstActionTouchTap: _onCancel,
      onDismiss: _onCancel,
    }
    return (
      <Dialog {...props}/>
    )
  }

  _renderDialog(){
    var dialog;
    switch (this.state.dialogType) {
      case DIALOG_TYPE.SWITCH_WIDGET:
        dialog = this._getSwitchWidgetDialog();
        break;
      case DIALOG_TYPE.ERROR_NOTICE:
        dialog = this._getErrorNoticeDialog();
        break;
    }
    return dialog
  }

  _renderMoreOperation(){
    var styles={
      iconBtn:{
        width:'30px',
        height:'30px',
        backgroundColor:'#ffffff',
        border:'solid 1px #e3e3e3',
        padding:'0'
      }
    };

    //let selectedWidget = FolderStore.getSelectedNode();
    let buttonDisabled = !this.state.energyData;

    var   handleTouchTap = (event) => {
    // This prevents ghost click.
      event.preventDefault();

      this.setState({
        operationMenuOpen: true,
        anchorEl: event.currentTarget,
      });
    };

    var handleRequestClose = () => {
      this.setState({
        operationMenuOpen: false,
      });
    };

    var handleMenuItemClick= (event, menuItem,index)=>{
      handleRequestClose();
      switch (index){
        case 0:
              //另存为
              let widgetDto=this._handleSave(false);
              this.props.onOperationSelect(menuItem.key, widgetDto);
              break;
        case 1:
              //导出
              this.exportChart();
              break;
        case 2:
              //分享
              if(!Immutable.is(
                              Immutable.fromJS(this.getCurrentWidgetDto()),
                              DataAnalysisStore.getInitialWidgetDto())){
                                this._handleSave(true);}

              this.props.onOperationSelect(menuItem.key);
              break;
        case 3:
              this.setState({
                willLeave:true
              });
              this.props.onOperationSelect(menuItem.key);
              break;
            }

    };

    return(
      <div>
        <IconButton iconClassName="icon-more"  style={styles.iconBtn} iconStyle={{fontSize:'14px'}} onTouchTap={handleTouchTap}/>
        <Popover
          open={this.state.operationMenuOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={handleRequestClose}
        >
      <Menu onItemTouchTap={handleMenuItemClick}>
        <MenuItem key={MenuAction.SaveAs} primaryText={I18N.Folder.Detail.WidgetMenu.Menu1} style={styles.label} disabled={buttonDisabled}/>
        <MenuItem key={MenuAction.Export} primaryText={I18N.Folder.Detail.WidgetMenu.Menu4} style={styles.label} disabled={buttonDisabled}/>
        <MenuItem key={MenuAction.Share} primaryText={I18N.Folder.Detail.WidgetMenu.Menu6} style={styles.label} disabled={buttonDisabled}/>
        <MenuItem key={MenuAction.Delete} primaryText={I18N.Folder.Detail.WidgetMenu.Menu5} style={styles.label} disabled={this.props.isNew}/>
      </Menu>
    </Popover>
  </div>
    )
  }

  _renderHeader(){
    var styles={
      button:{
        marginRight:'12px',
        height:'30px',
        lineHeight:'30px'
      },
      label:{
        fontSize:'14px'
      }
    }
    return(
      <div className="head">
        <div style={{display:'flex',alignItems:'center'}}>
          <div className="title">
            <ViewableTextField
              isViewStatus={this.state.isViewName}
              style={{width: 'auto'}}
              defaultValue={this.props.chartTitle}
              didBlur={(val) => {
                if(val !== this.props.chartTitle) {
                  this.props.modifyFolderName(val)
                }
                this.setState({
                  isViewName: true
                });
              }}
            />
            {this.state.isViewName &&
            <IconButton iconClassName='icon-edit' iconStyle={{fontSize:'20px'}} onClick={() => {
              this.setState({
                isViewName: false
              });
            }}/>}
          </div>
          <div className="description">{this.props.sourceUserName && `(${I18N.format(I18N.Folder.Detail.SubTitile,this.props.sourceUserName)})`}</div>
        </div>
        <div className="operation">
          <NewFlatButton label={I18N.Common.Button.Save} disabled={!this.state.energyData} labelstyle={styles.label} secondary={true}
            icon={<FontIcon className="icon-save" style={styles.label}/>} style={styles.button}
            onClick={()=>{this._handleSave()}}/>
          {this.props.isBuilding && <GenerateSolutionButton preAction={{
              action: () => {
                if(!Immutable.is(
                      Immutable.fromJS(this.getCurrentWidgetDto()),
                      DataAnalysisStore.getInitialWidgetDto())){
                    this._handleSave(true);
                } else {
                  return true;
                }
              },
              addListener: FolderStore.addSelectedNodeListener.bind(FolderStore),
              removeListener: FolderStore.removeSelectedNodeListener.bind(FolderStore),
            }}
            onOpen={this.props.onOpenGenerateSolution}
            nodes={[this.props.selectedNode]}
            disabled={!this.state.energyData || this.state.selectedChartType === 'rawdata'}/>}
          {this._renderMoreOperation()}
      </div>
      </div>
    )
  }

  _onRelativeDateChange(e, selectedIndex, value,refresh=true) {
    let dateSelector = this.refs.subToolBar.refs.dateTimeSelector;

    if (this.state.selectedChartType === 'rawdata' && value !== 'Customerize' && value !== 'Last7Day' && value !== 'Today' && value !== 'Yesterday' && value !== 'ThisWeek' && value !== 'LastWeek') {
    FolderAction.setDisplayDialog('errornotice', null, I18N.EM.RawData.ErrorForEnergy);
  } else {
    if (value && value !== 'Customerize' && dateSelector) {
      var timeregion = CommonFuns.GetDateRegion(value.toLowerCase());
      dateSelector.setDateField(timeregion.start, timeregion.end);
    }
  }
    this.setState({
      relativeDate:value
    },()=>{
      if(refresh){this._onSearchDataButtonClick()}
    })
  }

  _onDateSelectorChanged() {
    this.setState({
      relativeDate: 'Customerize'
    },()=>{
      this._onSearchDataButtonClick()
    });

  }

  canShareDataWith(curChartType, nextChartType) {
    if ((curChartType === 'line' || curChartType === 'column' || curChartType === 'stack') && (nextChartType === 'line' || nextChartType === 'column' || nextChartType === 'stack')) {
      return true;
    } else {
      return false;
    }
  }

  _onSearchBtnItemTouchTap(value) {
  let dateSelector = this.refs.subToolBar.refs.dateTimeSelector;
  let dateRange = dateSelector.getDateTime(),
    startDate = dateRange.start,
    endDate = dateRange.end;

  if (value=== 'rawdata' && endDate - startDate > 604800000) {
    FolderAction.setDisplayDialog('errornotice', null, I18N.EM.RawData.ErrorForEnergy);
  } else {
    var curChartType=this.state.selectedChartType,nextChartType=value;
    if (this.canShareDataWith(curChartType, nextChartType) && !!this.state.energyData) {
        ChartStatusAction.modifyChartType(nextChartType);
        this.setState({
          selectedChartType: nextChartType
        });
      } else { //if(nextChartType === 'pie'){
      ChartStatusAction.clearStatus();
      this.setState({
        selectedChartType: nextChartType,
        energyData: null
      }, ()=> {
        this._onSearchDataButtonClick();
      });
    }
  }

 }

 _onYaxisSelectorDialogSubmit(config) {
   this.setState({
     yaxisConfig: config
   });
 }

 _handleCalendarChange(calendarType) {
   var chartCmp = this.refs.ChartComponent.refs.chart,
    chartObj = chartCmp.refs.highstock;

    if (!CalendarManager.getShowType()) {
      CalendarManager.showCalendar(chartObj, calendarType);
    } else if (CalendarManager.getShowType() === calendarType) {
      CalendarManager.hideCalendar(chartObj);
    } else {
      CalendarManager.hideCalendar(chartObj);
      CalendarManager.showCalendar(chartObj, calendarType);
    }
    this.setState({
      calendarType: CalendarManager.getShowType()
    });
  }

  _onChartTypeChanged(e, selectedIndex, value){
    this._onSearchBtnItemTouchTap(value)
  }

  getChartTypeIconMenu(disabled) {
  let iconStyle = {
      fontSize: '16px'
    },
    style = {
      padding: '0px',
      height: '18px',
      width: '18px',
      fontSize: '18px',
      marginTop:'-5px'
    };
    var lineIcon=<FontIcon className="icon-line" iconStyle ={iconStyle} style = {style} />,
        columnIcon=<FontIcon className="icon-column" iconStyle ={iconStyle} style = {style}  />,
        stackIcon=<FontIcon className="icon-stack" iconStyle ={iconStyle} style = {style} />,
        pieIcon=<FontIcon className="icon-pie" iconStyle ={iconStyle} style = {style} />,
        rawdataIcon=<FontIcon className="icon-raw-data" iconStyle ={iconStyle} style = {style} />;

  let chartType = this.state.selectedChartType || 'line';
  return(
    <DropDownMenu disabled={AlarmTagStore.getSearchTagList().length===0}
      style={{width: '95px',backgroundColor:'#ffffff'}} iconStyle={{padding:'0',width:'24px',height:'24px',right:'6px'}} labelStyle={{lineHeight:'30px',paddingRight:'0'}} value={chartType} onChange={this._onChartTypeChanged}>
    <MenuItem primaryText={I18N.EM.CharType.Line} value="line" leftIcon={lineIcon}/>
    <MenuItem primaryText={I18N.EM.CharType.Bar} value="column" leftIcon={columnIcon}/>
    <MenuItem primaryText={I18N.EM.CharType.Stack} value="stack" leftIcon={stackIcon}/>
    <MenuItem primaryText={I18N.EM.CharType.Pie} value="pie" leftIcon={pieIcon}/>
    <MenuItem primaryText={I18N.EM.CharType.GridTable} value="rawdata" leftIcon={rawdataIcon}/>
  </DropDownMenu>
  )
  }

  _renderSearchBar(){
    var styles={
      button:{
        border:'1px solid #efefef',
        marginRight:'15px',
        height:'30px',
        lineHeight:'30px'
      },
      label:{
        fontSize:'14px'
      }
    };
    var props={
      auxiliary:{
        selectedChartType:this.state.selectedChartType,
        hasTagData:!(AlarmTagStore.getSearchTagList().length===0),
        timeRanges:this.state.timeRanges,
        yaxisConfig:this.state.yaxisConfig,
        initYaxisDialog:this._initYaxisDialog,
        onYaxisSelectorDialogSubmit:this._onYaxisSelectorDialogSubmit,
        handleCalendarChange:this._handleCalendarChange,
        analysisPanel:this,
      }
    }
    return(
      <div className={'jazz-alarm-chart-toolbar'} style={{
          justifyContent:'space-between'
        }}>
       <div className={'jazz-full-border-dropdownmenu-container'} style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          height: '38px',
          marginTop: '-4px'
        }}>
         <NewFlatButton label={I18N.Setting.Tag.Tag} labelstyle={styles.label} secondary={true}
                     icon={<FontIcon className="icon-add" style={styles.label}/>} style={styles.button}
                     onClick={()=>{
                       this.setState({
                         tagShow:true
                       })
                     }}/>
          {this.getChartTypeIconMenu()}
       </div>
        <AuxiliaryFunction {...props.auxiliary}/>
     </div>
    )
  }

  _renderChartCmp(){
      if(this.state.isLoading){
        return(
          <div className="flex-center">
           <CircularProgress  mode="indeterminate" size={80} />
         </div>
        )
      }
      else if(!!this.state.energyData){
        return(
          <div style={{display:'flex',flex:1,flexDirection:'column'}}>
            <ChartComponent ref="ChartComponent" AnalysisPanel={this}/>
            {this._renderRemark()}
          </div>
        )

        }else {
          let tagList=AlarmTagStore.getSearchTagList();
          if(tagList.length===0){
            return (
              <div className="flex-center">
                {I18N.Setting.DataAnalysis.NotagRecommend}
              </div>
            )
          }
          else {
            return null
          }
        }

  }

  _renderRemark(){
    var remarkTextArea = null;
      if (this.state.remarkDisplay) {
        remarkTextArea = <div className='jazz-energy-remark-text'><TextField hintText={I18N.Remark.DefaultText} value={this.state.remarkText} onChange={this.getRemarck} hintStyle={{
            color: '#abafae'
          }} multiLine={true} underlineShow={false}></TextField></div>;
        }
    var remarkDiv = null;
        remarkDiv = <div className='jazz-energy-remark-expand' style={{display:'flex',flexDirection:'column',marginTop:'40px',marginLeft:'-20px'}}>
              <div className='jazz-energy-remark-button'>
                <RaisedButton label={I18N.Remark.Label} style={{height:'26px',lineHeight:'26px'}} onClick={()=>{
                    this.setState({
                      remarkDisplay: !this.state.remarkDisplay
                    },ChartAction.redrawChart)}
                  }/>
              </div>
            {remarkTextArea}
          </div>;
      return remarkDiv;
        }

  _renderLeaveDialog(){
    var _buttonActions=[],content=null;
    if( this.state.willLeave ) {
      return null;
    }
      content=I18N.Setting.DataAnalysis.LeaveTip;
      _buttonActions = [<FlatButton
                              label={I18N.Folder.Widget.LeaveButton}
                              onClick={()=>{
                                if(this.state.energyData) {
                                  this._handleSave(true);
                                }
                                let sureLevalCallback = this.state.sureLevalCallback;
                                this.setState({
                                  willLeave:true,
                                  showLeaveDialog:false,
                                  showSaveDialog:false,
                                  sureLevalCallback: null,
                                  cancelLevalCallback: null,
                                },()=>{
                                  if(sureLevalCallback) {
                                    sureLevalCallback(true);
                                  }
                                  this.setState({
                                    willLeave: false,
                                  });
                                  // this.props.router.replace(ntLocation.pathname)
                                })
                              }} />,
                            <FlatButton
                              label={I18N.Common.Button.Cancel2}
                              style={{
                                marginLeft: '10px'
                                }}
                                onClick={()=>{
                                  let cancelLevalCallback = this.state.cancelLevalCallback;
                                  this.setState({
                                    showLeaveDialog:false,
                                    showSaveDialog:false,
                                    sureLevalCallback: null,
                                    cancelLevalCallback: null,
                                  }, () => {
                                    if(cancelLevalCallback) {
                                      cancelLevalCallback();
                                    }
                                  })
                                }} />];

    return(
      <NewDialog actions={_buttonActions} modal={true} open={true}>
        {content}
      </NewDialog>
    )
  }

  _renderSaveDialog(){
    var _buttonActions=[],content=null;
    if( this.state.willLeave ) {
      return null;
    }
    content=I18N.Setting.DataAnalysis.SaveTip;
     _buttonActions = [<FlatButton
                            label={I18N.Common.Button.Save}
                            onClick={()=>{
                              if(this.state.energyData) {
                                this._handleSave(true);
                              }
                              let sureLevalCallback = this.state.sureLevalCallback;

                              this.setState({
                                willLeave:true,
                                showLeaveDialog:false,
                                showSaveDialog:false,
                                sureLevalCallback: null,
                                cancelLevalCallback: null,
                              },()=>{
                                if(sureLevalCallback) {
                                  sureLevalCallback();
                                }
                                this.setState({
                                  willLeave: false,
                                });
                                // this.props.router.replace(ntLocation.pathname)
                              })
                            }} />,
                          <FlatButton
                            label={I18N.Common.Button.NotSave}
                            style={{
                              marginLeft: '10px'
                              }}
                              onClick={()=>{
                                let sureLevalCallback = this.state.sureLevalCallback;
                                this.setState({
                                  willLeave:true,
                                  showLeaveDialog:false,
                                  showSaveDialog:false,
                                  sureLevalCallback: null,
                                  cancelLevalCallback: null,
                                },()=>{
                                  if(sureLevalCallback) {
                                    sureLevalCallback(this.props.isNew);
                                  }
                                  this.setState({
                                    willLeave: false,
                                  });
                                  // this.props.router.replace(ntLocation.pathname)
                                })
                              }} />];
    return(
      <NewDialog actions={_buttonActions} modal={true} open={true}>
        {content}
      </NewDialog>
    )
  }
  getInitParam(analysisPanel) {
    let date = new Date();
    date.setHours(0, 0, 0);
    let last7Days = CommonFuns.dateAdd(date, -6, 'days');
    let endDate = CommonFuns.dateAdd(date, 1, 'days');
    // this.refs.relativeDate.setState({
    //   selectedIndex: 1
    // });
    this.refs.subToolBar.refs.dateTimeSelector.setDateField(last7Days, endDate);
  }

  resetCalendarType() {
    CalendarManager.resetShowType();
  }

  setCalendarTypeFromWidget(widgetDto) {
  if (widgetDto && widgetDto.WidgetStatus && widgetDto.WidgetStatus !== "") {
    let wss = JSON.parse(widgetDto.WidgetStatus);
    let calcType = "";
    for (var i = 0, len = wss.length; i < len; i++) {
      if (wss[i].WidgetStatusKey === "calendar") {
        if (wss[i].WidgetStatusValue === "hc") {
          calcType = "hc";
          break;
        } else if (wss[i].WidgetStatusValue === "work") {
          calcType = "work";
          break;
        }
      }
    }

    CalendarManager.calendarShowType = calcType;
    this.setState({
      calendarType: calcType
    });
  }
  }

  _initYaxisDialog() {
  var chartCmp = this.refs.ChartComponent.refs.chart,
    chartObj = chartCmp.refs.highstock.getPaper();

  return chartObj;
  }

  _initChartPanelByWidgetDto(){
    let j2d = CommonFuns.DataConverter.JsonToDateTime;
    let widgetDto = this.props.widgetDto,
      WidgetStatusArray = widgetDto.WidgetStatusArray,
      contentSyntax = widgetDto.ContentSyntax,
      contentObj = JSON.parse(contentSyntax),
      viewOption = contentObj.viewOption,
      step = viewOption.Step,
      timeRanges = viewOption.TimeRanges,
      chartType = widgetDto.ChartType,
      remarkText = widgetDto.Comment;

    var remarkDisplay = false;
    if (remarkText !== '' && remarkText !== null) {
      remarkDisplay = true;
    }


    let typeMap = {
      Line: 'line',
      Column: 'column',
      Stack: 'stack',
      Pie: 'pie',
      DataTable: 'rawdata',
      original: 'rawdata'
    };

    let initPanelDate = (timeRange) => {
      if (timeRange.relativeDate) {
        this._onRelativeDateChange(null,null,timeRange.relativeDate,false);
      } else {
        this._onRelativeDateChange(null,null,'Customerize',false);
        let start = j2d(timeRange.StartTime, false);
        let end = j2d(timeRange.EndTime, false);
        if (this.refs.subToolBar.refs.dateTimeSelector) {
          this.refs.subToolBar.refs.dateTimeSelector.setDateField(start, end);
        }
      }
    };

    //init timeRange
    let timeRange = timeRanges[0];
    initPanelDate(timeRange);
    if (timeRanges.length !== 1) {
      this.isMultiTime=true;
      MultipleTimespanStore.initDataByWidgetTimeRanges(timeRanges);
    }

    let yaxisConfig = null;
    if (WidgetStatusArray) {
      yaxisConfig = CommonFuns.getYaxisConfig(WidgetStatusArray);
    }
    //init selected tags is done in the other part
    this.setState({
      remarkText: remarkText,
      remarkDisplay: remarkDisplay,
      selectedChartType: typeMap[chartType],
      yaxisConfig: yaxisConfig,
      step: step,
    }, () => {
      this._onSearchDataButtonClick(null);
    });
    ChartStatusAction.setWidgetDto(widgetDto, 'Energy', 'Energy', this.state.selectedChartType);
    this.setCalendarTypeFromWidget(widgetDto);
  }

  routerWillLeave(nextLocation){
    // console.log('routerWillLeave');
    // console.log(this.getCurrentWidgetDto());
    // console.log(DataAnalysisStore.getInitialWidgetDto().toJS());
    // console.log(Immutable.is(
    //   Immutable.fromJS(this.getCurrentWidgetDto()),
    //   DataAnalysisStore.getInitialWidgetDto()
    // ));
    if(this.props.isNew && AlarmTagStore.getSearchTagList().length===0){
      return true
    }
    if(Immutable.is(
        Immutable.fromJS(this.getCurrentWidgetDto()),
        DataAnalysisStore.getInitialWidgetDto()
      )
    ) {
        return true;
    }
    if( !this.state.willLeave && !WidgetStore.isUncheck() ) {
      FolderAction.checkWidgetUpdate(() => {
        this.props.router.replace(nextLocation.pathname);
      });
    }
    return this.state.willLeave || WidgetStore.isUncheck();
      // console.log(nextLocation);
      // ntLocation=nextLocation;
      // if(!!this.state.energyData){
      //   var currentWidgetDto=Immutable.fromJS(this.getCurrentWidgetDto());
      //   var originalWidgetDto=Immutable.fromJS(this.props.widgetDto);
      //   if(Immutable.is(currentWidgetDto,originalWidgetDto)){
      //     return true
      //   }
      //   else {
      //     this.setState({
      //       showLeaveDialog:true
      //     })
      //     return this.state.willLeave
      //   }
      // }
      // else {
      //   this.setState({
      //     showLeaveDialog:true
      //   })
      //   return this.state.willLeave
      // }


    }

  componentWillMount(){
    BasicAnalysisAction.setInitialWidgetDto(null);
    if(!this.props.isNew){
      let hierNode = CommodityStore.getHierNode();
      let dimNode = CommodityStore.getCurrentDimNode();
      if (!!dimNode) {
        this.setState({
          dimId: dimNode.dimId
        });
      }
      if (!!hierNode) {
        let tagId = TagStore.getCurrentHierIdTagStatus().last();
        this.setState({
          hierarchyId:hierNode.hierId,
          isBuilding:HierarchyStore.IsBuilding(hierNode.hierId),
          tagId
        })
      }
      this.isInitial=true;
    }
  }

  componentDidMount(){
    this.getInitParam();
    FolderStore.addDialogListener(this._onDialogChanged);
    EnergyStore.addEnergyDataLoadingListener(this._onLoadingStatusChange);
    EnergyStore.addEnergyDataLoadedListener(this._onEnergyDataChange);
    EnergyStore.addEnergyDataLoadErrorListener(this._onGetEnergyDataError);
    EnergyStore.addEnergyDataLoadErrorsListener(this._onGetEnergyDataErrors);
    AlarmTagStore.addChangeListener(this._onTagChanged);
    FolderStore.addCheckWidgetUpdateChangeListener(this._onCheckWidgetUpdate);
    if(!this.props.isNew){
      this._initChartPanelByWidgetDto();
    }
    this.props.router.setRouteLeaveHook(
         this.props.route,
         this.routerWillLeave
       )
  }

  componentDidUpdate() {
      if(DataAnalysisStore.getCalendarDisabled()){
      }
      else if (this.state.energyRawData && !this.state.isCalendarInited) {
        let paramsObj = EnergyStore.getParamsObj(),
          step = paramsObj.step,
          timeRanges = paramsObj.timeRanges,
          as = this.state;

        if (this.refs.ChartComponent) {
          var chartCmp = this.refs.ChartComponent.refs.chart,
            chartObj = chartCmp.refs.highstock;

          CalendarManager.init(as.selectedChartType, step, as.energyRawData.Calendars, chartObj, timeRanges);
          this.setState({
            isCalendarInited: true
          });
        }
      }
    }

  componentWillUnmount(){
    FolderStore.removeDialogListener(this._onDialogChanged);
    EnergyStore.removeEnergyDataLoadingListener(this._onLoadingStatusChange);
    EnergyStore.removeEnergyDataLoadedListener(this._onEnergyDataChange);
    EnergyStore.removeEnergyDataLoadErrorListener(this._onGetEnergyDataError);
    EnergyStore.removeEnergyDataLoadErrorsListener(this._onGetEnergyDataErrors);
    AlarmTagStore.removeChangeListener(this._onTagChanged);
    FolderStore.removeCheckWidgetUpdateChangeListener(this._onCheckWidgetUpdate);
    this.resetCalendarType();
    TagAction.clearAlarmSearchTagList();
    TagAction.setCurrentHierarchyId(null);
    CommodityAction.setCurrentHierarchyInfo({Id:null,name:null});//清空hierarchy 信息，否则会影响能源
    MultipleTimespanStore.clearMultiTimespan('both');
  }

  render(){
    var errorDialog;
    var props={
      subToolBar:{
        ref:'subToolBar',
        selectedChartType:this.state.selectedChartType,
        onSearchBtnItemTouchTap:this._onSearchBtnItemTouchTap,
        hasTagData:!(AlarmTagStore.getSearchTagList().length===0),
        timeRanges:this.state.timeRanges,
        step:this.state.step,
        onStepChange:this._handleEnergyStepChange,
        yaxisConfig:this.state.yaxisConfig,
        initYaxisDialog:this._initYaxisDialog,
        onYaxisSelectorDialogSubmit:this._onYaxisSelectorDialogSubmit,
        handleCalendarChange:this._handleCalendarChange,
        analysisPanel:this,
        relativeDate:this.state.relativeDate,
        onRelativeDateChange:this._onRelativeDateChange,
        onDateSelectorChanged:this._onDateSelectorChanged
      }
    }
    if (this.state.errorObj) {
      errorDialog = <ErrorStepDialog {...this.state.errorObj} onErrorDialogAction={this._onErrorDialogAction}></ErrorStepDialog>;
      }
    return(
      <div className="jazz-analysis-panel">
        {this._renderHeader()}
        <div className="content">
          {this._renderSearchBar()}
          <ChartSubToolbar {...props.subToolBar}/>
          {this._renderChartCmp()}
        </div>
        {<TagDrawer hierarchyId={this.state.hierarchyId}
                    isBuilding={this.state.isBuilding}
                    customerId={parseInt(this.context.router.params.customerId)}
                    tagId={this.state.tagId}
                    open={this.state.tagShow}
                    onClose={(open)=>{
                      this.setState({
                        tagShow:open
                      })
                    }}/>}
        {errorDialog}
        {this._renderDialog()}
        {this.state.showLeaveDialog && this._renderLeaveDialog()}
        {this.state.showSaveDialog && this._renderSaveDialog()}
      </div>
    )
  }
}

AnalysisPanel.propTypes = {
  selectedNode:React.PropTypes.object,
	hierarchyId:React.PropTypes.number,
  isBuilding:React.PropTypes.bool,
  chartTitle:React.PropTypes.string,
  sourceUserName:React.PropTypes.string,
  widgetDto:React.PropTypes.object,
  onOperationSelect:React.PropTypes.func,
  isNew:React.PropTypes.bool,
};

// AnalysisPanel.defaultProps={
//   hierarchyId:100016,
//   isBuilding:true,
//   chartTitle:'冷机COP',
//   sourceUserName:'Uxteam',
//   isNew:true
// }

export default withRouter(AnalysisPanel)
