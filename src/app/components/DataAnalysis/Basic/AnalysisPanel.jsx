'use strict';
import React, { Component }  from "react";
import PropTypes from 'prop-types';
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
import _ from 'lodash-es';
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
import Remark from './Remark.jsx';
import WeatherStore from 'stores/DataAnalysis/weather_store.jsx';
import WeatherAction from 'actions/DataAnalysis/weather_action.jsx';
import IntervalStatisticAction from 'actions/DataAnalysis/interval_statistic_action.jsx';
import {Step,DataUsageType} from 'constants/ChartConstants.jsx';
import ScatterPlotStore from 'stores/DataAnalysis/scatter_plot_store.jsx';
import ScatterPlotAction from 'actions/DataAnalysis/scatter_plot_action.jsx';
import BubbleStore from 'stores/DataAnalysis/bubble_store.jsx';
import BubbleAction from 'actions/DataAnalysis/bubble_action.jsx';
import TouAnalysis from './tou_analysis.jsx';

const DIALOG_TYPE = {
  SWITCH_WIDGET: "switchwidget",
  SWITCH_EC: 'switchec',
  ERROR_NOTICE: 'errornotice'
};

var ntLocation=null;


import PermissionCode from 'constants/PermissionCode.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
function isFullBasicAnalysis() {
  return privilegeUtil.isFull(PermissionCode.BASIC_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege());
}

function isTouSupportedChartType(type){
  return type==='column' || type==='stack' || type==='pie'
}


class AnalysisPanel extends Component {

  static contextTypes = {
    router: PropTypes.object,
    hierarchyId: PropTypes.string,
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
    this._handleTouChange = this._handleTouChange.bind(this);
    this.routerWillLeave  = this.routerWillLeave.bind(this);
    this.getCurrentWidgetDto  = this.getCurrentWidgetDto.bind(this);
    this.getRemarck  = this.getRemarck.bind(this);
    this._onDialogChanged  = this._onDialogChanged.bind(this);
    this._handleSave  = this._handleSave.bind(this);
    this._onChartTypeChanged  = this._onChartTypeChanged.bind(this);
    this._onWeatherTagChanged=this._onWeatherTagChanged.bind(this);
    this.checkMultiTag=this.checkMultiTag.bind(this);
    this._onScatterAxisChanged=this._onScatterAxisChanged.bind(this);
    this._onBubbleAxisChanged=this._onBubbleAxisChanged.bind(this);

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
      weatherTagList:WeatherStore.getTagList(),
      muliTagTipShow:false,
      touType:false,
      touAnalysisShow:false
  }

  isMultiTime=false;

  componentWillReceiveProps() {
    this.setState({
      isViewName: true
    });
  }

  //for heatmap
  checkMultiTag(){
    return AlarmTagStore.getSearchTagList() && AlarmTagStore.getSearchTagList().length>1
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

  energyDataLoad(timeRanges, step, tagOptions, relativeDate, weatherOption,dataUsageType=1) {
    EnergyAction.getEnergyTrendChartData(timeRanges, step, tagOptions, relativeDate, weatherOption, this.props.widgetDto.Id,dataUsageType);
  }

  pieEnergyDataLoad(timeRanges, step, tagOptions, relativeDate) {
    EnergyAction.getPieEnergyData(timeRanges, step, tagOptions, relativeDate,this.props.widgetDto.Id);
  }

  getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize) {
    EnergyAction.getEnergyRawData(timeRanges, step, tagOptions, relativeDate, pageNum, pageSize);
  }

  scatterDataLoad(timeRanges, step, tagOptions,relativeDate) {
    EnergyAction.getScatterPlotData(ScatterPlotStore.getXaxis(),ScatterPlotStore.getYaxis(),timeRanges, step, tagOptions, relativeDate,this.props.widgetDto.Id);
  }

  bubbleDataLoad(timeRanges, step, tagOptions,relativeDate) {
    EnergyAction.getBubbleData(BubbleStore.getXaxis(),BubbleStore.getYaxis(),BubbleStore.getArea(),timeRanges, step, tagOptions, relativeDate,this.props.widgetDto.Id);
  }

  touDataLoad(timeRanges, step, tagOptions, relativeDate, weatherOption,dataUsageType) {
    EnergyAction.getTouData(timeRanges, step, tagOptions, relativeDate, weatherOption, this.props.widgetDto.Id,dataUsageType);
  }

  initEnergyStoreByBizChartType() {
  let chartType = this.state.selectedChartType;
  switch (chartType) {
    case 'line':
    case 'column':
    case 'stack':
    case 'heatmap':
    case 'scatterplot':
    case 'bubble':
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
    if(this.state.selectedChartType==='scatterplot' || this.state.selectedChartType==='bubble'){
        timeRanges = MultipleTimespanStore.getSubmitTimespans();
        if (timeRanges === null) {
        timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
     }
    }else{
     if (tagOptions.length > 1) {
         MultiTimespanAction.clearMultiTimespan('both');
         timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
         } else {
            timeRanges = MultipleTimespanStore.getSubmitTimespans();
           if (timeRanges === null) {
             timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
          }
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
  if(this.state.selectedChartType==='scatterplot'){
    this.scatterDataLoad(timeRanges, step, tagOptions,relativeDate);
  }else if(this.state.selectedChartType==='bubble'){
    this.bubbleDataLoad(timeRanges, step, tagOptions,relativeDate);
  }else{
    this.energyDataLoad(timeRanges, step, tagOptions, relativeDate, weather);
  }

}

_onScatterAxisChanged(){
  var xAxis=ScatterPlotStore.getXaxis(),
      yAxis=ScatterPlotStore.getYaxis();
  if(xAxis!==yAxis && yAxis!==0 && xAxis!==0){
    this.setState({
      energyData:null
    },()=>{
      this._onSearchDataButtonClick();
    })

  }
}
_onBubbleAxisChanged(){
    var xAxis=BubbleStore.getXaxis(),
      yAxis=BubbleStore.getYaxis(),
      area=BubbleStore.getArea();
  if(xAxis!==yAxis && xAxis!==area && yAxis!==area && area!==0 && yAxis!==0 && xAxis!==0){
    this.setState({
      energyData:null
    },()=>{
      this._onSearchDataButtonClick();
    })

  }
}

  _onSearchDataButtonClick(invokeFromMultiTime=false){
    //invokeFromMultiTime 来判断是不是点击多时间段的绘制按钮进行查看。
    if(invokeFromMultiTime!==null){
      this.isMultiTime=invokeFromMultiTime;
    }

    if(this.state.touType && !invokeFromMultiTime){
      if(AlarmTagStore.getSearchTagList().length>0){
      this.setState({
        touAnalysisShow:true
      })
      return;
      }

    }else{
      this.setState({
        touType:false
      })
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
            }else if(chartType==='heatmap'){
                this.setState({
                    step: Step.Hour,//heatmap 小时步长
                    isCalendarInited: false,
                  },()=>{
                    MultiTimespanAction.clearMultiTimespan('both');
                    let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
                    this.energyDataLoad(timeRanges, Step.Hourly, nodeOptions, relativeDateValue,null,DataUsageType.heatMap);
                  });
            }else if(chartType==='scatterplot'){
                var xAxis=ScatterPlotStore.getXaxis(),
                    yAxis=ScatterPlotStore.getYaxis();
              if(this.state.energyData!=='initial' && xAxis!==yAxis && yAxis!==0 && xAxis!==0){
                this.setFitStepAndGetData(startDate, endDate, nodeOptions, relativeDateValue);
              }
            }else if(chartType==='bubble'){
                var xAxis=BubbleStore.getXaxis(),
                    yAxis=BubbleStore.getYaxis(),
                    area=BubbleStore.getArea();
              if(this.state.energyData!=='initial' && xAxis!==yAxis && xAxis!==area && area!==yAxis && yAxis!==0 && xAxis!==0 && area!==0){
                this.setFitStepAndGetData(startDate, endDate, nodeOptions, relativeDateValue);
              }
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
      errorObj:null,
      touType:AlarmTagStore.getSearchTagList().length>1?false:this.state.touType
    },()=>{
      if(this.state.selectedChartType==='heatmap' && this.checkMultiTag()){
        this.setState({
          multiTagTipShow:true
        })
      }else if(this.state.selectedChartType!=='scatterplot' || this.state.selectedChartType!=='bubble'){
        this._onSearchDataButtonClick();
      }

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
    if(!isFullBasicAnalysis() || this.state.willLeave || WidgetStore.isUncheck()) {
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
    errorMessage: this.state.selectedChartType==='heatmap'?I18N.format(I18N.EM.StepErrorForHeatMap, msg1.join(',')):I18N.format(I18N.EM.StepError, msg1.join(','))
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

    // if( !EnergyStore.getParamsObj() ) {
    //   return ;
    // }
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

    //for scatter
    if(this.state.selectedChartType==='scatterplot'){
      tagIds=[ScatterPlotStore.getXaxis(),ScatterPlotStore.getYaxis()]
      nodeNameAssociation=CommonFuns.getNodeNameAssociationByIds(tagOptions,tagIds)
    }

        //for bubble
    if(this.state.selectedChartType==='bubble'){
      tagIds=[BubbleStore.getXaxis(),BubbleStore.getYaxis(),BubbleStore.getArea()]
      nodeNameAssociation=CommonFuns.getNodeNameAssociationByIds(tagOptions,tagIds)
    }

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
      if(this.state.touType){
        viewOption.DataUsageType=DataUsageType[chartType]
      }

      if (chartType === 'rawdata') {
        let dataOption = {
          OriginalValue: true,
          WithoutAdditionalValue: true
        };
        viewOption.DataOption = dataOption;

        let pagingObj;
        if(this.refs.ChartComponent){
          pagingObj=this.refs.ChartComponent.refs.chart.getPageObj()
        }else {
          pagingObj={
            pageIdx:0
           }
         }
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
        calendar: this.state.calendarType,
        TouTariff:this.state.touType+''
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
    // if( !EnergyStore.getParamsObj() ) {
    //   return ;
    // }
    let tagOptions = EnergyStore.getTagOpions(),
      paramsObj = EnergyStore.getParamsObj(),
      timeRanges = paramsObj.timeRanges;

  this.setState({
    step: step,
    isCalendarInited: false,
  },()=>{
    this._onSearchDataButtonClick();
  });

  //  if(this.state.selectedChartType==='scatterplot'){
  //     this.scatterDataLoad(timeRanges, step, tagOptions,this.state.relativeDate);
  //  }else if(this.state.selectedChartType==='bubble'){
  //     this.bubbleDataLoad(timeRanges, step, tagOptions,this.state.relativeDate);
  //  }else{
  //    this.energyDataLoad(timeRanges, step, tagOptions, false);
  //  }
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

  viewOption.IsTouTariff=this.state.touType;

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
        width:'29px',
        height:'29px',
        backgroundColor:'#ffffff',
        border:'solid 1px #e3e3e3',
        padding:'0'
      }
    };

    //let selectedWidget = FolderStore.getSelectedNode();
    let buttonDisabled = (!this.state.energyData ) || this.state.energyData==='initial';

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
        <IconButton disabled={!isFullBasicAnalysis()} iconClassName="icon-more"  style={styles.iconBtn} iconStyle={{fontSize:'14px'}} onTouchTap={handleTouchTap}/>
        <Popover
          open={this.state.operationMenuOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={handleRequestClose}
        >
      <Menu onItemClick={handleMenuItemClick}>
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
        fontSize:'14px',
        lineHeight:'14px',
        verticalAlign:'baseline'
      }
    }
    var checkScatterDisable=()=>{
      var xAxis=ScatterPlotStore.getXaxis(),
          yAxis=ScatterPlotStore.getYaxis();
          // this.state.energyData==='initial' ||
      return (this.state.selectedChartType==='scatterplot' &&
              (this.state.energyData==='initial' ||
                xAxis===0 ||
                yAxis===0 ||
                yAxis===xAxis
              ))
    }

    var checkBubbleDisable=()=>{
      var xAxis=BubbleStore.getXaxis(),
          yAxis=BubbleStore.getYaxis(),
          area=BubbleStore.getArea();
          // this.state.energyData==='initial' ||
      return (this.state.selectedChartType==='bubble' &&
              (this.state.energyData==='initial' ||
                xAxis===0 ||
                yAxis===0 ||
                area===0 ||
                yAxis===xAxis ||
                yAxis===area ||
                area===xAxis
              ))
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
          </div>
          {this.state.isViewName &&
          <IconButton disabled={!isFullBasicAnalysis()} iconClassName='icon-edit' iconStyle={{fontSize:'20px'}} onClick={() => {
            this.setState({
              isViewName: false
            });
          }}/>}
          <div className="description">{this.props.sourceUserName && `(${I18N.format(I18N.Folder.Detail.SubTitile,this.props.sourceUserName)})`}</div>
        </div>
        <div className="operation">
          <NewFlatButton label={I18N.Common.Button.Save} disabled={!this.state.energyData || !isFullBasicAnalysis() || checkScatterDisable() || checkBubbleDisable()} labelStyle={styles.label} secondary={true}
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
            onOpen={(data)=>{this.props.onOpenGenerateSolution(this,data)}}
            nodes={[this.props.selectedNode]}
            disabled={!this.state.energyData || this.state.selectedChartType === 'rawdata' || checkScatterDisable() || checkBubbleDisable()}
           />}
          {this._renderMoreOperation()}
      </div>
      </div>
    )
  }

  _onWeatherTagChanged(){
    this.setState({
      weatherTagList:WeatherStore.getTagList()
    })
  }

  _onRelativeDateChange(e, selectedIndex, value,refresh=true) {
    let dateSelector = this.refs.subToolBar.refs.dateTimeSelector;

    if(this.state.selectedChartType==='heatmap' && this.checkMultiTag()){
        this.setState({
          multiTagTipShow:true
        })
      }else
      {
              if (this.state.selectedChartType === 'rawdata' && value !== 'Customerize' && value !== 'Last7Day' && value !== 'Today' && value !== 'Yesterday' && value !== 'ThisWeek' && value !== 'LastWeek') {
      var timeregion = CommonFuns.GetDateRegion(value.toLowerCase());
      dateSelector.setDateField(timeregion.start, timeregion.end);
    FolderAction.setDisplayDialog('errornotice', null, I18N.EM.RawData.ErrorForEnergy);
  } else {
    if (value && value !== 'Customerize' && dateSelector) {
      var timeregion = CommonFuns.GetDateRegion(value.toLowerCase());
      dateSelector.setDateField(timeregion.start, timeregion.end);
    }
    // this.setState({
    //   relativeDate:value
    // },()=>{
    //   if(refresh){this._onSearchDataButtonClick()}
    // })
  }
  this.setState({
    relativeDate:value,
    energyData:this.state.energyData==='initial'?'initial':null,
  },()=>{
    if(refresh){this._onSearchDataButtonClick(null)}
  })
      }


  }

  _onDateSelectorChanged() {
    if(this.state.selectedChartType==='heatmap' && this.checkMultiTag()){
        this.setState({
          multiTagTipShow:true
        })
      }else{
    this.setState({
      relativeDate: 'Customerize',
      energyData:(this.state.energyData==='initial'?'initial':null)
    },()=>{
      this._onSearchDataButtonClick(null)
    });
      }

  }

  canShareDataWith(curChartType, nextChartType) {
    if(this.state.touType || this.state.touAnalysisShow) return false;
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
          selectedChartType: nextChartType,
          // energyData: null
        });
        EnergyAction.setChartType(nextChartType)
      } else { //if(nextChartType === 'pie'){
      if(nextChartType==='heatmap' || nextChartType==='scatterplot' || nextChartType==='bubble'){
        ChartStatusAction.modifyChartType(nextChartType);
      }else{
        ChartStatusAction.clearStatus();
      }
      EnergyAction.setChartType(nextChartType);
      this.setState({
        selectedChartType: nextChartType,
        energyData: nextChartType==='scatterplot' || nextChartType==='bubble'?'initial':null,
        touType:(!isTouSupportedChartType(nextChartType))?false:this.state.touType
      }, ()=> {
         if(!this.state.touAnalysisShow){this._onSearchDataButtonClick();}
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

  _handleTouChange(){
    if(this.state.touType){
      this.setState({
      touType:!this.state.touType
    },()=>{
      this._onSearchDataButtonClick(null)
    })
    }else{
      this.setState({
        touAnalysisShow:true
      })
    }

  }

  _onChartTypeChanged(e, selectedIndex, value){
    ScatterPlotAction.clearAxis();
    BubbleAction.clearAxis();
    this._onSearchBtnItemTouchTap(value)
  }

  _heatMapValid(){
    return this.isMultiTime || AlarmTagStore.getSearchTagList().length>1
  }

  // _scatterValid(){
  //   return this.isMultiTime || AlarmTagStore.getSearchTagList().length<2
  // }

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
        rawdataIcon=<FontIcon className="icon-raw-data" iconStyle ={iconStyle} style = {style} />,
        heatmapIcon=<FontIcon className="icon-heat-map" iconStyle ={iconStyle} style = {style} />,
        scatterIcon=<FontIcon className="icon-scatter-plot" iconStyle ={iconStyle} style = {style} />,
        bubbleIcon=<FontIcon className="icon-bubble-chart" iconStyle ={iconStyle} style = {style} />;

  let chartType = this.state.selectedChartType || 'line';
  return(
    <DropDownMenu disabled={AlarmTagStore.getSearchTagList().length===0}
      style={{width: '120px',backgroundColor:'#ffffff'}} iconStyle={{padding:'0',width:'24px',height:'24px',right:'6px'}} labelStyle={{lineHeight:'30px',paddingRight:'0'}} value={chartType} onChange={this._onChartTypeChanged}>
    <MenuItem primaryText={I18N.EM.CharType.Line} value="line" leftIcon={lineIcon}/>
    <MenuItem primaryText={I18N.EM.CharType.Bar} value="column" leftIcon={columnIcon}/>
    <MenuItem primaryText={I18N.EM.CharType.Stack} value="stack" leftIcon={stackIcon}/>
    <MenuItem primaryText={I18N.EM.CharType.Pie} value="pie" leftIcon={pieIcon}/>
    <MenuItem primaryText={I18N.EM.CharType.GridTable} value="rawdata" leftIcon={rawdataIcon}/>
    <MenuItem primaryText={I18N.EM.CharType.Scatter} value="scatterplot" leftIcon={scatterIcon}/>
    <MenuItem primaryText={I18N.EM.CharType.Bubble} value="bubble" leftIcon={bubbleIcon}/>
    <MenuItem primaryText={I18N.EM.CharType.HeatMap} value="heatmap" disabled={this._heatMapValid()} leftIcon={heatmapIcon}/>
  </DropDownMenu>
  )
  }

  _renderSearchBar(){
    var styles={
      button:{
        marginRight:'15px',
        height:'30px',
        lineHeight:'30px'
      },
      label:{
        fontSize:'14px',
        lineHeight:'14px',
        verticalAlign:'baseline'
      }
    };
    var props={
      auxiliary:{
        selectedChartType:this.state.selectedChartType,
        hasTagData:!(AlarmTagStore.getSearchTagList().length===0 || this.state.energyData==='initial'),
        timeRanges:this.state.timeRanges,
        yaxisConfig:this.state.yaxisConfig,
        initYaxisDialog:this._initYaxisDialog,
        onYaxisSelectorDialogSubmit:this._onYaxisSelectorDialogSubmit,
        handleCalendarChange:this._handleCalendarChange,
        handleTouChange:this._handleTouChange,
        analysisPanel:this,
        weatherTag:this.state.weatherTagList,
        touType:this.state.touType
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
         <NewFlatButton label={I18N.Setting.Tag.Tag} labelStyle={styles.label} secondary={true}
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
      else if(!!this.state.energyData || this.state.energyData==='initial'){
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
              <div className="flex-center" style={{flexDirection:"column",marginBottom: "119px",backgroundColor: "#ffffff",borderBottomRightRadius: "5px",borderBottomLeftRadius: "5px",border: "solid 1px #e6e6e6",borderTop:"none"}}>
                <FontIcon className="icon-chart1" color="#32ad3d" style={{fontSize:'50px'}}/>
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
        remarkTextArea = <div className='jazz-energy-remark-text'><Remark remarkText={this.state.remarkText} onChange={this.getRemarck}/></div>;
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

  _renderMultiTagTip(){
    return(
          <NewDialog
          open={true}
          modal={false}
          isOutsideClose={false}
          onRequestClose={()=>{this.setState({multiTagTipShow:false})}}>
          {I18N.Setting.DataAnalysis.NotSupportMultiTagsForHeatMap}
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
    let calcType = "",touType=false;
    for (var i = 0, len = wss.length; i < len; i++) {
      if (wss[i].WidgetStatusKey === "calendar") {
        if (wss[i].WidgetStatusValue === "hc") {
          calcType = "hc";
          break;
        } else if (wss[i].WidgetStatusValue === "work") {
          calcType = "work";
          break;
        }
      }else if(wss[i].WidgetStatusKey === "TouTariff"){
        touType=wss[i].WidgetStatusValue === "true"?true:false;
        break;
      }
    }

    CalendarManager.calendarShowType = calcType;
    this.setState({
      calendarType: calcType,
      touType
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
      HeatMap:'heatmap',
      ScatterPlot:'scatterplot',
      Bubble:'bubble',
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
      yaxisConfig = CommonFuns.getYaxisConfig(WidgetStatusArray,typeMap[chartType]);
    }
    //init selected tags is done in the other part
    EnergyAction.setChartType(typeMap[chartType])
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

  _onTouAnalysis(relativeDateValue=this.state.relativeDate){
    this.initEnergyStoreByBizChartType();
    let  nodeOptions = AlarmTagStore.getSearchTagList();
    // let relativeDateValue = this.state.relativeDate;
    let dateSelector = this.refs.subToolBar.refs.dateTimeSelector;
    let dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end;
    let timeRanges = MultipleTimespanStore.getSubmitTimespans();
        if (timeRanges === null) {
             timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
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

  if(step!==this.state.step){
    this.setState({
      step,
      touAnalysisShow:true
    })
  }else{
     this.touDataLoad(timeRanges, step, nodeOptions, relativeDateValue, null,DataUsageType[this.state.selectedChartType],this.state.selectedChartType!=='pie');
  }

    // this.energyDataLoad(timeRanges, step, nodeOptions, relativeDateValue, null,DataUsageType[this.state.selectedChartType],this.state.selectedChartType!=='pie');

  }

  routerWillLeave(nextLocation){
    // console.log('routerWillLeave');
    // console.log(this.getCurrentWidgetDto());
    // console.log(DataAnalysisStore.getInitialWidgetDto().toJS());
    // console.log(Immutable.is(
    //   Immutable.fromJS(this.getCurrentWidgetDto()),
    //   DataAnalysisStore.getInitialWidgetDto()
    // ));
    if(!isFullBasicAnalysis() || this.props.isNew && AlarmTagStore.getSearchTagList().length===0){
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
        let tagId = TagStore.getCurrentHierIdTagStatus().last().get("Id");
        if(DataAnalysisStore.getHierarchyName(hierNode.hierId)){
          this.setState({
            hierarchyId:hierNode.hierId,
            isBuilding:HierarchyStore.IsBuilding(hierNode.hierId),
            tagId
          })
        }

      }
      this.isInitial=true;

    }else{
      EnergyAction.setChartType('line');
      TagAction.setCurrentHierarchyId(this.props.hierarchyId);
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
    WeatherStore.addChangeListener(this._onWeatherTagChanged);
    ScatterPlotStore.addChangeListener(this._onScatterAxisChanged);
    BubbleStore.addChangeListener(this._onBubbleAxisChanged);


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
    WeatherStore.removeChangeListener(this._onWeatherTagChanged);
    ScatterPlotStore.removeChangeListener(this._onScatterAxisChanged);
    BubbleStore.removeChangeListener(this._onBubbleAxisChanged);

    this.resetCalendarType();
    // TagAction.clearAlarmSearchTagList();
    TagAction.setCurrentHierarchyId(null);
    CommodityAction.setCurrentHierarchyInfo({Id:null,name:null});//清空hierarchy 信息，否则会影响能源
    MultipleTimespanStore.clearMultiTimespan('both');
    WeatherAction.clearSelectedTag();
    IntervalStatisticAction.clearAll();
    ScatterPlotAction.clearAxis();
    BubbleAction.clearAxis();
  }

  render(){
    var errorDialog;
    var that=this;
    var props={
      subToolBar:{
        ref:'subToolBar',
        selectedChartType:this.state.selectedChartType,
        onSearchBtnItemTouchTap:this._onSearchBtnItemTouchTap,
        hasTagData:!(AlarmTagStore.getSearchTagList().length===0) || (this.state.energyData==='initial'),
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
      errorDialog = <ErrorStepDialog {...this.state.errorObj} chartType={this.state.selectedChartType} onErrorDialogAction={this._onErrorDialogAction}></ErrorStepDialog>;
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
        {this.state.multiTagTipShow && this._renderMultiTagTip()}
        {this.state.touAnalysisShow && <TouAnalysis onClose={()=>{this.setState({touAnalysisShow:false})}}
                                                    onTagConfirm={(tags)=>{
                                                      this.setState({
                                                        touAnalysisShow:false,
                                                        touType:true
                                                      },()=>{
                                                        TagAction.removeTagStatusByTou(tags);
                                                      })
                                                    }}
                                                    isMultiTime={this.isMultiTime}
                                                    chartType={this.state.selectedChartType}
                                                    step={this.state.step}
                                                    cancelMulti={function(){
                                                      that.isMultiTime=false;
                                                      MultipleTimespanStore.clearMultiTimespan('both');
                                                    }}
                                                    onSuccess={()=>{
                                                        this.setState({
                                                          touAnalysisShow:false,
                                                          touType:true
                                                        },()=>{
                                                          this._onTouAnalysis();
                                                        })

                                                    }}
                                                    onChangeChartType={this._onChartTypeChanged}/>}
      </div>
    )
  }
}

AnalysisPanel.propTypes= {
  selectedNode:PropTypes.object,
	hierarchyId:PropTypes.number,
  isBuilding:PropTypes.bool,
  chartTitle:PropTypes.string,
  sourceUserName:PropTypes.string,
  widgetDto:PropTypes.object,
  onOperationSelect:PropTypes.func,
  isNew:PropTypes.bool,
};

// AnalysisPanel.defaultProps={
//   hierarchyId:100016,
//   isBuilding:true,
//   chartTitle:'冷机COP',
//   sourceUserName:'Uxteam',
//   isNew:true
// }

export default withRouter(AnalysisPanel)
