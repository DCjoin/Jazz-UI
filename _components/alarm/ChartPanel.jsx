'use strict';
import React from "react";
import Immutable from 'immutable';
import ChartMixins from '../energy/ChartMixins.jsx';
import { FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress } from 'material-ui';
import assign from "object-assign";
import classNames from 'classnames';
import CommonFuns from '../../util/Util.jsx';
import EnergyStore from '../../stores/EnergyStore.jsx';
import AlarmTagStore from '../../stores/AlarmTagStore.jsx';
import TagStore from '../../stores/TagStore.jsx';
import YaxisSelector from '../energy/YaxisSelector.jsx';
import StepSelector from '../energy/StepSelector.jsx';
import ChartComponent from '../energy/ChartComponent.jsx';
import WidgetSaveWindow from '../energy/WidgetSaveWindow.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import AlarmTagAction from '../../actions/AlarmTagAction.jsx';
import TBSettingAction from '../../actions/TBSettingAction.jsx';
import DateTimeSelector from '../../controls/DateTimeSelector.jsx';
import GlobalErrorMessageAction from '../../actions/GlobalErrorMessageAction.jsx';
import ErrorStepDialog from './ErrorStepDialog.jsx';
import BaselineCfg from '../setting/BaselineCfg.jsx';
import ButtonMenu from '../../controls/ButtonMenu.jsx';
import ExtendableMenuItem from '../../controls/ExtendableMenuItem.jsx';

let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');

let {hourPickerData, isArray, getUomById, JazzCommon, DataConverter, dateAdd} = CommonFuns;

const searchDate = [{
  value: 'Customerize',
  text: '自定义'
}, {
  value: 'Last7Day',
  text: '最近7天'
}, {
  value: 'Last30Day',
  text: '最近30天'
}, {
  value: 'Last12Month',
  text: '最近12月'
},
  {
    value: 'Today',
    text: '今天'
  }, {
    value: 'Yesterday',
    text: '昨天'
  }, {
    value: 'ThisWeek',
    text: '本周'
  }, {
    value: 'LastWeek',
    text: '上周'
  },
  {
    value: 'ThisMonth',
    text: '本月'
  }, {
    value: 'LastMonth',
    text: '上月'
  }, {
    value: 'ThisYear',
    text: '今年'
  }, {
    value: 'LastYear',
    text: '去年'
  }];

let ChartPanel = React.createClass({
  mixins: [ChartMixins],
  propTypes: {
    isSettingChart: React.PropTypes.bool
  },
  _onLoadingStatusChange() {
    let isSettingChart = this.props.isSettingChart,
      isLoading = EnergyStore.getLoadingStatus(),
      paramsObj = EnergyStore.getParamsObj(),
      tagOption = EnergyStore.getTagOpions()[0],
      obj = assign({}, paramsObj);

    obj.isLoading = isLoading;
    obj.tagName = tagOption.tagName;
    obj.dashboardOpenImmediately = false;
    obj.tagOption = tagOption;
    obj.energyData = null;

    if (!isSettingChart) {
      let chartTitle = EnergyStore.getChartTitle();
      obj.chartTitle = chartTitle;
    }

    this.setState(obj);
  },
  componentDidUpdate() {
    if ((!this.props.isSettingChart) && EnergyStore.getAlarmLoadingStatus()) {
      let paramsObj = EnergyStore.getParamsObj(),
        startDate = CommonFuns.DataConverter.JsonToDateTime(paramsObj.startTime, false),
        endDate = CommonFuns.DataConverter.JsonToDateTime(paramsObj.endTime, false);

      this.refs.dateTimeSelector.setDateField(startDate, endDate);
    }
  },
  _onEnergyDataChange(isError, errorObj) {
    let isLoading = EnergyStore.getLoadingStatus(),
      energyData = EnergyStore.getEnergyData(),
      energyRawData = EnergyStore.getEnergyRawData(),
      paramsObj = assign({}, EnergyStore.getParamsObj()),
      state = {
        isLoading: isLoading,
        energyData: energyData,
        energyRawData: energyRawData,
        paramsObj: paramsObj,
        dashboardOpenImmediately: false
      };
    if (isError === true) {
      state.step = null;
      state.errorObj = errorObj;
    }
    this.setState(state);
  },
  _onStepChange(step) {
    let tagOptions = EnergyStore.getTagOpions(),
      paramsObj = EnergyStore.getParamsObj(),
      timeRanges = paramsObj.timeRanges;

    this.setState({
      step: step,
      dashboardOpenImmediately: false
    });
    AlarmAction.getEnergyData(timeRanges, step, tagOptions, false);
  },
  _onNavigatorChangeLoad() {
    let tagOptions = EnergyStore.getTagOpions(),
      paramsObj = EnergyStore.getParamsObj(),
      dateSelector = this.refs.dateTimeSelector,
      dateRange = dateSelector.getDateTime(),
      startDate = dateRange.start,
      endDate = dateRange.end;

    this._setFitStepAndGetData(startDate, endDate, tagOptions, false);
  },
  // onSearchDataButtonClick() {
  //   let dateSelector = this.refs.dateTimeSelector,
  //     dateRange = dateSelector.getDateTime(),
  //     startDate = dateRange.start,
  //     endDate = dateRange.end,
  //     userTagListSelect = AlarmTagStore.getUseTaglistSelect(),
  //     tagOptions;
  //
  //   if (startDate.getTime() >= endDate.getTime()) {
  //     window.alert('请选择正确的时间范围');
  //     return;
  //   }
  //   if (!userTagListSelect) {
  //     tagOptions = EnergyStore.getTagOpions();
  //   } else {
  //     tagOptions = AlarmTagStore.getSearchTagList();
  //   }
  //   if (!tagOptions || tagOptions.length === 0) {
  //     this.setState({
  //       energyData: null
  //     });
  //     return;
  //   }
  //   let relativeDateValue = this._getRelativeDateValue();
  //   this._setFitStepAndGetData(startDate, endDate, tagOptions, relativeDateValue);
  // },
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
},
_setRelativeDateByValue(value) {
  let relativeDateMenuItems = ConstStore.getSearchDate();
  let menuIndex = -1;
  relativeDateMenuItems.forEach((item, index) => {
    if (item.value === value) {
      menuIndex = index;
    }
  });
  if (menuIndex !== -1) {
    this.refs.relativeDate.setState({
      selectedIndex: menuIndex
    });
    this._onRelativeDateChange(null, menuIndex, relativeDateMenuItems[menuIndex]);
  }
},
setFitStepAndGetData(startDate, endDate, tagOptions, relativeDate, clearWeatherflag) {
  let timeRanges, weather;
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
  if (stepList.indexOf(step) == -1) {
    step = limitInterval.display;
  }
  this.setState({
    isCalendarInited: false
  });
  if (!clearWeatherflag) {
    weather = this.state.weatherOption;
  }
  EnergyAction.getEnergyTrendChartData(timeRanges, step, tagOptions, relativeDate, weather);
  //analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, relativeDate, weather);
},
  onSearchDataButtonClick(invokeFromMultiTime) { //invokeFromMultiTime 来判断是不是点击多时间段的绘制按钮进行查看。
  this.initEnergyStoreByBizChartType();
  let dateSelector = this.refs.dateTimeSelector;
  let dateRange = dateSelector.getDateTime(),
    startDate = dateRange.start,
    endDate = dateRange.end;
  // deal with multi time submit
  if (!!invokeFromMultiTime) {
    let multiRelativeType = MultipleTimespanStore.getOriginalType();
    let relativeDateValue = this._getRelativeDateValue();

    if (multiRelativeType === 'Customerize') {
      let multiDateRange = MultipleTimespanStore.getMainDateRange();
      if (multiDateRange[0].getTime() !== startDate.getTime() || multiDateRange[1].getTime() !== endDate.getTime()) {
        dateSelector.setDateField(multiDateRange[0], multiDateRange[1]);
      }
      if (relativeDateValue !== 'Customerize') {
        this._setRelativeDateByValue(multiRelativeType);
      }
    } else {

      if (relativeDateValue !== multiRelativeType) {
        this._setRelativeDateByValue(multiRelativeType);
      }
    }
  } else {
    let timeRanges = MultipleTimespanStore.getSubmitTimespans();
    if (timeRanges !== null) {
      let multiRelativeType = MultipleTimespanStore.getOriginalType();
      let relativeDateValue = this._getRelativeDateValue();
      if (multiRelativeType !== 'Customerize' && multiRelativeType === relativeDateValue) {

      } else {
        MultipleTimespanStore.initData(relativeDateValue, startDate, endDate);
      }
    }
  }


  let clearWeatherflag = false,
    nodeOptions;

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
  } else {
    if (this.state.weatherOption !== null) {
      let hierId = null;

      nodeOptions.forEach(item => {
        if (hierId === null) {
          hierId = item.hierId;
        } else if (hierId !== item.hierId) {
          clearWeatherflag = true;
          return;
        }
      });
    }
  }

  let relativeDateValue = this._getRelativeDateValue();

  let chartType = this.state.selectedChartType;
  if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
    this.setFitStepAndGetData(startDate, endDate, nodeOptions, relativeDateValue);
  } else {
    let timeRanges;
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
      EnergyAction.getPieEnergyData(timeRanges, 2, nodeOptions, relativeDateValue);
      //analysisPanel.state.chartStrategy.getPieEnergyDataFn(timeRanges, 2, nodeOptions, relativeDateValue);
    } else if (chartType === 'rawdata') {
      MultiTimespanAction.clearMultiTimespan('both');
      let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate);
      EnergyAction.getEnergyRawData(timeRanges, 0, nodeOptions, relativeDateValue);
      //analysisPanel.state.chartStrategy.getEnergyRawDataFn(timeRanges, 0, nodeOptions, relativeDateValue);
    }
  }

  if (clearWeatherflag) {
    analysisPanel.setState({
      weatherOption: null
    });
  }
},
  _getRelativeDateValue() {
    let relativeDateIndex = this.refs.relativeDate.state.selectedIndex,
      obj = searchDate[relativeDateIndex];
    return obj.value;
  },
  _setFitStepAndGetData(startDate, endDate, tagOptions, relativeDate) {
    let timeRanges = CommonFuns.getTimeRangesByDate(startDate, endDate),
      step = this.state.step,
      limitInterval = CommonFuns.getLimitInterval(timeRanges),
      stepList = limitInterval.stepList;
    if (stepList.indexOf(step) == -1) {
      step = limitInterval.display;
    }

    AlarmAction.getEnergyData(timeRanges, step, tagOptions, relativeDate);
  },
  _onChart2WidgetClick() {
    if (!!this.state.energyData) {
      let contentSyntax = JSON.stringify(this.getContentSyntax());
      this.setState({
        dashboardOpenImmediately: true,
        contentSyntax: contentSyntax
      });
    }
  },
  _onRelativeDateChange(e, selectedIndex, menuItem) {
    let value = menuItem.value,
      dateSelector = this.refs.dateTimeSelector;

    if (value && value !== 'Customerize') {
      var timeregion = CommonFuns.GetDateRegion(value.toLowerCase());
      dateSelector.setDateField(timeregion.start, timeregion.end);
    }
  },
  _onDateSelectorChanged() {
    this.refs.relativeDate.setState({
      selectedIndex: 0
    });
  },
  getContentSyntax() {
    let tagOptions = EnergyStore.getTagOpions(), options,
      relativeDate = EnergyStore.getRelativeDate();

    if (tagOptions) {
      if (isArray(tagOptions)) {
        options = [];
        for (let i = 0, len = tagOptions.length; i < len; i++) {
          let tag = tagOptions[i];
          options.push({
            Id: tag.tagId,
            Name: tag.tagName,
            HierId: tag.hierId,
            NodeName: tag.hierName
          });
        }
      } else {
        options = [{
          Id: tagOptions.tagId,
          Name: tagOptions.tagName,
          HierId: tagOptions.hierId,
          NodeName: tagOptions.hierName
        }];
      }
    }
    let submitParams = EnergyStore.getSubmitParams();
    if (relativeDate !== 'Customerize' && relativeDate !== null) {
      let immutableSubmitParams = Immutable.fromJS(submitParams);
      let immutableSubmitParamsClone = immutableSubmitParams.setIn(['viewOption', 'TimeRanges'], [{
        relativeDate: relativeDate
      }]);
      submitParams = immutableSubmitParamsClone.toJS();
    }
    var contentSyntax = {
      xtype: 'widgetcontainer',
      params: {
        submitParams: {
          options: options,
          tagIds: submitParams.tagIds,
          interval: [],
          viewOption: submitParams.viewOption
        },
        config: {
          type: "line",
          xtype: "mixedtrendchartcomponent",
          reader: "mixedchartreader",
          storeType: "energy.Energy",
          searcherType: "analysissearcher",
          widgetStyler: "widgetchartstyler",
          maxWidgetStyler: "maxchartstyler"
        }
      }
    };
    return contentSyntax;
  },
  _initYaxisDialog() {
    var chartCmp = this.refs.ChartComponent,
      chartObj = chartCmp.refs.highstock.getPaper();

    return chartObj;
  },
  onWidgetSaveWindowDismiss() {
    this.setState({
      dashboardOpenImmediately: false
    });
  },
  _onErrorDialogAction(step) {
    this.setState({
      errorObj: null
    });
    if (step !== 'cancel') {
      this._onStepChange(step);
    }
  },
  getInitialState() {
    let state = {
      isLoading: false,
      energyData: null,
      energyRawData: null,
      hierName: null,
      submitParams: null,
      step: null,
      yaxisConfig: null,
      dashboardOpenImmediately: false,
      baselineBtnStatus: TagStore.getBaselineBtnDisabled(),
      selectedChartType: 'line',
      showAddIntervalDialog: false,
      showSumDialog: false,
      weatherOption: null,
      sumBtnStatus: false,
    };
    if (this.props.chartTitle) {
      state.chartTitle = this.props.chartTitle;
    }
    return state;
  },
  getChartTypeIconMenu(types) {
    let menuMap = {
      line: {
        primaryText: I18N.EM.CharType.Line,
        icon: <FontIcon className="icon-line" />
      },
      column: {
        primaryText: I18N.EM.CharType.Bar,
        icon: <FontIcon className="icon-column" />
      },
      stack: {
        primaryText: I18N.EM.CharType.Stack,
        icon: <FontIcon className="icon-stack" />
      },
      pie: {
        primaryText: I18N.EM.CharType.Pie,
        icon: <FontIcon className="icon-pie" />
      },
      rawdata: {
        primaryText: I18N.EM.CharType.RawData,
        icon: <FontIcon className="icon-raw-data" />
      }
    };
    let chartType = this.state.selectedChartType || 'line';
    let mainIcon = menuMap[chartType].icon;
    let IconButtonElement = mainIcon;
    let iconMenuProps = {
      iconButtonElement: IconButtonElement,
      openDirection: "bottom-right",
      desktop: true,
      onItemTouchTap: this._onSearchBtnItemTouchTap
    };

    let typeItems = types.map((item) => {
      return <MenuItem primaryText={menuMap[item].icon} value={item} />;
    });

    let widgetOptMenu = <IconMenu {...iconMenuProps}>
                       {typeItems}
                    </IconMenu>;
    return widgetOptMenu;
  },
  isCalendarDisabled() {
  let tagOptions = EnergyStore.getTagOpions();
  if (!tagOptions) {
    return false;
  }
  let paramsObj = EnergyStore.getParamsObj(),
    timeRanges = paramsObj.timeRanges;

  let disabled = false;

  if (timeRanges.length > 1) {
    disabled = true;
  } else if (tagOptions.length > 1) {
    let hierId = null;
    tagOptions.forEach(option => {
      if (!hierId) {
        hierId = option.hierId;
      } else if (hierId !== option.hierId) {
        disabled = true;
        return;
      }
    });
  }
  return disabled;
},
isWeatherDisabled() {
  let tagOptions = EnergyStore.getTagOpions();
  if (!tagOptions) return I18N.EM.WeatherSupportsOnlySingleHierarchy;
  let paramsObj = EnergyStore.getParamsObj(),
    step = paramsObj.step;
  if (step != 1) return I18N.EM.WeatherSupportsOnlyHourlyStep;
  return false;
},
  getAuxiliaryCompareBtn:function(){
    let calendarSubItems = [{
      primaryText: I18N.EM.Tool.Calendar.NoneWorkTime,
      value: 'noneWorkTime'
    },
    {
      primaryText: I18N.EM.Tool.Calendar.HotColdSeason,
      value: 'hotColdSeason'
    }];
    let calendarEl;
    let isCalendarDisabled = this.isCalendarDisabled();
    if (isCalendarDisabled) {
      calendarEl = <MenuItem primaryText={I18N.EM.Tool.Calendar.BackgroundColor} value='background' disabled={true}/>;
      } else {
        let showType = CalendarManager.getShowType();
        if (!!showType) {
          calendarSubItems.forEach(item => {
            if (item.value === showType) {
              item.checked = true;
            }
          });
        }
        calendarEl = <ExtendableMenuItem primaryText={I18N.EM.Tool.Calendar.BackgroundColor} value='background' subItems={calendarSubItems}/>;
      }

      let weatherSubItems = [{
        primaryText: I18N.EM.Tool.Weather.Temperature,
        value: 'temperature'
      },
      {
        primaryText: I18N.EM.Tool.Weather.Humidity,
        value: 'humidity'
      }];
      let submitParams = EnergyStore.getSubmitParams();
      let viewOp = submitParams.viewOption;
      if (viewOp && viewOp.IncludeTempValue)
      weatherSubItems[0].checked = true;
      if (viewOp && viewOp.IncludeHumidityValue)
      weatherSubItems[1].checked = true;
      let weatherEl;
      let isWeatherDisabled = this.isWeatherDisabled();
      if (isWeatherDisabled === false) {
        weatherEl = <ExtendableMenuItem primaryText={I18N.EM.Tool.Weather.WeatherInfo} value='weather' subItems={weatherSubItems}/>;
      } else {
        weatherEl = <ExtendableMenuItem primaryText={I18N.EM.Tool.Weather.WeatherInfo} value='weather' disabled={true} tooltip={isWeatherDisabled} />;
      }
      let configButton = <ButtonMenu label={I18N.EM.Tool.AssistCompare} style={{
          marginLeft: '10px'
        }} desktop={true}
        onItemTouchTap={this._onConfigBtnItemTouchTap}>
 <MenuItem primaryText={I18N.EM.Tool.HistoryCompare} value='history' disabled={this.state.baselineBtnStatus}/>
 <MenuItem primaryText={I18N.EM.Tool.BenchmarkSetting} value='config' disabled={this.state.baselineBtnStatus}/>
 <MenuDivider />
 <MenuItem primaryText={I18N.EM.Tool.DataSum} value='sum' disabled={this.state.sumBtnStatus}/>
 {calendarEl}
 {weatherEl}
</ButtonMenu>;

return configButton;
  },
  getChartSubToolbarFn() {
    var toolElement;
    let chartType = this.state.selectedChartType;
    let chartTypeIconMenu = this.getChartTypeIconMenu(['line', 'column', 'stack', 'pie', 'rawdata']);
    let configBtn = this.getAuxiliaryCompareBtn();
    if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
      toolElement = <div style={{
        display: 'flex'
      }}>
         <div style={{
        margin: '10px 0 0 23px'
      }}>{chartTypeIconMenu}</div>
    <YaxisSelector initYaxisDialog={this._initYaxisDialog}/>
         <StepSelector stepValue={this.state.step} onStepChange={this._onStepChange} timeRanges={this.state.timeRanges}/>
         <div style={{
        margin: '5px 30px 5px auto'
      }}>
           {configBtn}
           <div style={{
        display: 'inline-block',
        marginLeft: '30px'
      }}>{I18N.EM.Tool.ClearChart}</div>
         </div>
         <BaselineCfg  ref="baselineCfg"/>
       </div>;
    } else if (chartType === 'rawdata') {
      toolElement = <div style={{
        display: 'flex'
      }}>
         <div style={{
        margin: '10px 0 0 23px'
      }}>{chartTypeIconMenu}</div>
         <div style={{
        margin: '5px 30px 5px auto'
      }}>
           {configBtn}
           <div style={{
        display: 'inline-block',
        marginLeft: '30px'
      }}>{I18N.EM.Tool.ClearChart}</div>
         </div>
         <BaselineCfg  ref="baselineCfg"/>
       </div>;
    } else if (chartType === 'pie') {
      toolElement = <div style={{
        display: 'flex'
      }}>
         <div style={{
        margin: '10px 0 0 23px'
      }}>{chartTypeIconMenu}</div>
         <div style={{
        margin: '5px 30px 5px auto'
      }}>
           {configBtn}
           <div style={{
        display: 'inline-block',
        marginLeft: '30px'
      }}>{I18N.EM.Tool.ClearChart}</div>
         </div>
         <BaselineCfg  ref="baselineCfg"/>
       </div>;
    }
    return toolElement;
  },
  // _onsetShowAddIntervalDialog:function(status){
  //   this.setState({
  //     showAddIntervalDialog: false
  //   })
  // },
  getEnergyPart() {
    let energyPart;
    let chartType = this.state.selectedChartType;
    let subToolbar = this.getChartSubToolbarFn();
    let historyCompareEl = null;
    let dataSum = null;
    if (chartType !== 'rawdata' & analysisPanel.state.showAddIntervalDialog === true) {
      let relativeType = this._getRelativeDateValue();
      let timeRange = this.refs.dateTimeSelector.getDateTime();
      MultiTimespanAction.initMultiTimespanData(relativeType, timeRange.start, timeRange.end);
      historyCompareEl = <AddIntervalWindow openImmediately={true} analysisPanel={this} onSearchDataButtonClickFn={this.onSearchDataButtonClick}/>;
    }
    if ((chartType === 'line' || chartType === 'column' || chartType === 'stack') && this.state.showSumDialog === true) {
      dataSum = <SumWindow  openImmediately={true} analysisPanel={this}></SumWindow>;
    }
    if (chartType === 'rawdata') {
      let properties = {
        ref: 'ChartComponent',
        energyData: this.state.energyData,
        energyRawData: this.state.energyRawData,
        chartStrategy: this.state.chartStrategy
      };
      energyPart = <div style={{
        flex: 1,
        display: 'flex',
        'flex-direction': 'column',
        marginBottom: '20px',
        overflow: 'hidden'
      }}>
                  {subToolbar}
                  <GridComponent {...properties}></GridComponent>
                </div>;
    } else {
      let chartCmpObj = {
        ref: 'ChartComponent',
        bizType: analysisPanel.props.bizType,
        energyType: analysisPanel.state.energyType,
        chartType: analysisPanel.state.selectedChartType,
        energyData: analysisPanel.state.energyData,
        energyRawData: analysisPanel.state.energyRawData,
        onDeleteButtonClick: analysisPanel._onDeleteButtonClick,
        onDeleteAllButtonClick: analysisPanel._onDeleteAllButtonClick
      };
      energyPart = <div style={{
        flex: 1,
        display: 'flex',
        'flex-direction': 'column',
        marginBottom: '20px'
      }}>
                   {subToolbar}
                   {historyCompareEl}
                   {dataSum}
                   <ChartComponentBox {...analysisPanel.state.paramsObj} {...chartCmpObj} afterChartCreated={analysisPanel._afterChartCreated}/>
                 </div>;
    }
    return energyPart;
  },
  render: function() {
    let me = this, errorDialog,
      energyPart = null;
    if (!me.state.chartTitle) {
      return null;
    }
    if (me.state.errorObj) {
      errorDialog = <ErrorStepDialog {...me.state.errorObj} onErrorDialogAction={me._onErrorDialogAction}></ErrorStepDialog>;
    } else {
      errorDialog = <div></div>;
    }
    if (this.state.isLoading) {
      energyPart = <div style={{
        margin: 'auto',
        width: '100px'
      }}>
          <CircularProgress  mode="indeterminate" size={2} />
        </div>;
    } else if (!!this.state.energyData) {
      let chartCmpObj = {
        ref: 'ChartComponent',
        energyData: this.state.energyData,
        energyRawData: this.state.energyRawData,
        onDeleteButtonClick: me._onDeleteButtonClick,
        onDeleteAllButtonClick: me._onDeleteAllButtonClick,
        getYaxisConfig: me.getYaxisConfig
      };
      energyPart = <div style={{
        flex: 1,
        display: 'flex',
        'flex-direction': 'column',
        marginBottom: '20px'
      }}>
                        <div style={{
        display: 'flex'
      }}>
                          <YaxisSelector initYaxisDialog={me._initYaxisDialog} onYaxisSelectorDialogSubmit={me._onYaxisSelectorDialogSubmit}/>
                          <StepSelector stepValue={me.state.step} onStepChange={me._onStepChange} timeRanges={me.state.timeRanges}/>
                        </div>
                        <ChartComponent {...this.state.paramsObj} {...chartCmpObj} afterChartCreated={this._afterChartCreated}/>
                      </div>;
    }
    let title = <div className='jazz-alarm-chart-title'>
                    <span>{me.state.chartTitle}</span>
                    <IconButton iconClassName="icon-send" style={{
      'marginLeft': '2px'
    }} onClick={this._onChart2WidgetClick} disabled={!this.state.energyData}/>
                  </div>;
    let widgetWd;
    if (me.state.dashboardOpenImmediately) {
      widgetWd = <WidgetSaveWindow ref={'saveChartDialog'}  onWidgetSaveWindowDismiss={me.onWidgetSaveWindowDismiss} chartTitle={me.state.chartTitle}
      tagOption={this.state.tagOption} contentSyntax={this.state.contentSyntax}></WidgetSaveWindow>;
    } else {
      widgetWd = null;
    }
    let searchButton = <RaisedButton label={I18N.Common.Button.Show} onClick={me.onSearchDataButtonClick}/>
    // <ButtonMenu label='查看' onButtonClick={me.onSearchDataButtonClick} desktop={true}
    // value={this.state.selectedChartType} onItemTouchTap={this._onSearchBtnItemTouchTap}>
    //      <MenuItem primaryText="折线图" value='line'/>
    //      <MenuItem primaryText="柱状图"  value='column'/>
    //      <MenuItem primaryText="堆积图"  value='stack'/>
    //      <MenuItem primaryText="饼状图"  value='pie'/>
    //      <MenuItem primaryText="原始数据"  value='rawdata'/>
    //   </ButtonMenu>;
    let configButton = <ButtonMenu label='辅助对比' style={{
      marginLeft: '10px'
    }} desktop={true}
    onItemTouchTap={this._onConfigBtnItemTouchTap}>
        <MenuItem primaryText="历史对比" value='history'/>
        <MenuItem primaryText="基准值设置" value='config' disabled={this.state.baselineBtnStatus}/>
        <MenuDivider />
        <MenuItem primaryText="数据求和" value='sum'/>
        <ExtendableMenuItem primaryText="日历背景色" value='background'>
          <Menu>
            <MenuItem primaryText="非工作时间" value='noneWorkTime'/>
            <MenuItem primaryText="冷暖季" value='hotColdSeason'/>
          </Menu>
        </ExtendableMenuItem>
        <ExtendableMenuItem primaryText="天气信息" value='weather'>
                  <Menu>
                    <MenuItem primaryText="温度" value='temperature'/>
                    <MenuItem primaryText="湿度" value='humidity'/>
                  </Menu>
                </ExtendableMenuItem>
      </ButtonMenu>;
    var collapseButton = <div className="fold-tree-btn" style={{
      "color": "#939796"
    }}>
                          <FontIcon hoverColor="#6b6b6b" color="#939796" className={classNames("icon", "icon-column-fold")} />
                       </div>;

    return (
      <div className={'jazz-energy-panel'}>
        <div className='header'>
          {collapseButton}
          <div className={'description'}></div>
          <div className={'jazz-alarm-chart-toolbar-container'}>
            <div className={'title'}>
              <div className={'content'}>
                {me.state.chartTitle}
              </div>
              <IconButton iconClassName="icon-send" style={{
        'marginLeft': '2px'
      }} onClick={this._onChart2WidgetClick} disabled={!this.state.energyData}/>
        </div>
        <div className={'jazz-alarm-chart-toolbar'}>
          <div className={'jazz-full-border-dropdownmenu-container'} >
            <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{
        width: '92px'
      }} onChange={me._onRelativeDateChange}></DropDownMenu>
          </div>
          <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={this._onDateSelectorChanged}/>
          <div className={'jazz-flat-button'}>
            {searchButton}
          </div>
        </div>
      </div>
        {widgetWd}
            <BaselineCfg  ref="baselineCfg"/>
            <div className={'jazz-flat-button'}>
              {configButton}
            </div>

        </div>
          {energyPart}
          {errorDialog}
        </div>
      );
  },
  canShareDataWith(curChartType, nextChartType) {
  if ((curChartType === 'line' || curChartType === 'column' || curChartType === 'stack') && (nextChartType === 'line' || nextChartType === 'column' || nextChartType === 'stack')) {
    return true;
  } else {
    return false;
  }
},
  _onSearchBtnItemTouchTap(e, child) {
    let curChartType=this.state.selectedChartType;
    let nextChartType=child.props.value;

    if (this.canShareDataWithFn(curChartType, nextChartType) && !!this.state.energyData) {
      this.setState({
        selectedChartType: nextChartType
      });
    } else { //if(nextChartType === 'pie'){
      this.setState({
        selectedChartType: nextChartType,
        energyData: null
      }, function() {
        this.onSearchDataButtonClick();
      });
    },
    handleCalendarChange(calendarType) {
  var chartCmp = this.refs.ChartComponent,
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
},
handleWeatherMenuItemClick(toggleTemp, toggleHumi) {
  let paramsObj = EnergyStore.getParamsObj(),
    timeRanges = paramsObj.timeRanges,
    tagOptions = EnergyStore.getTagOpions(),
    submitParams = EnergyStore.getSubmitParams(),
    step = paramsObj.step;
  let wasTemp = !!submitParams.viewOption.IncludeTempValue,
    wasHumi = !!submitParams.viewOption.IncludeHumidityValue,
    weather;

  if (toggleTemp === true) {
    weather = {
      IncludeTempValue: !wasTemp,
      IncludeHumidityValue: wasHumi
    };
  }
  if (toggleHumi === true) {
    weather = {
      IncludeTempValue: wasTemp,
      IncludeHumidityValue: !wasHumi
    };
  }
  this.setState({
    weatherOption: weather
  });
  //analysisPanel.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false, weather);
  EnergyAction.getEnergyTrendChartData(timeRanges, step, tagOptions, false, weather);
},
  _onConfigBtnItemTouchTap(menuParam, menuItem) {
    let itemValue = menuItem.props.value;
    switch (itemValue) {
      case 'history':
        this.setState({
          showAddIntervalDialog: true
        });
        break;
      case 'config':
        this.handleBaselineCfg();
        break;
      case 'sum':
        console.log('sum');

        this.setState({
          showSumDialog: true
        });
        break;
      case 'background':{
        var subMenuValue = menuParam.props.value;
        if (subMenuValue === 'noneWorkTime' || subMenuValue === 'hotColdSeason') {
          this.handleCalendarChange(subMenuValue);
        }
        break;
        }
      case 'weather': {
        var subMenuValue = menuParam.props.value;
        if (subMenuValue === 'temperature') {
          this.handleWeatherMenuItemClick(true, false);
        } else if (subMenuValue === 'humidity') {
          this.handleWeatherMenuItemClick(false, true);
        }
        break;
        }

    }
  },
  _onYaxisSelectorDialogSubmit(config) {
    this.setState({
      yaxisConfig: config
    });
  },
  getYaxisConfig() {
    return this.state.yaxisConfig;
  },
  _afterChartCreated(chartObj) {
    if (chartObj.options.scrollbar.enabled) {
      chartObj.xAxis[0].bind('setExtremes', this.OnNavigatorChanged);
    }
  },
  _onDeleteButtonClick(obj) {
    let uid = obj.uid,
      needReload = EnergyStore.removeSeriesDataByUid(uid);

    AlarmTagAction.removeSearchTagList({
      tagId: uid
    });

    if (needReload) {
      let tagOptions = AlarmTagStore.getSearchTagList(),
        paramsObj = EnergyStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges,
        step = paramsObj.step;

      AlarmAction.getEnergyData(timeRanges, step, tagOptions, false);
    } else {
      let energyData = EnergyStore.getEnergyData();
      this.setState({
        energyData: energyData
      });
    }
  },
  _onDeleteAllButtonClick() {
    AlarmTagAction.clearSearchTagList();
    EnergyStore.clearEnergyDate();
    this.setState({
      energyData: null
    });
  },
  _onGetEnergyDataError() {
    let errorObj = this.errorProcess();
    this._onEnergyDataChange(true, errorObj);
  },
  errorProcess() {
    let code = EnergyStore.getErrorCode(),
      messages = EnergyStore.getErrorMessage();

    if (code.toString() == '02004') {
      let errorObj = this.showStepError(messages[0]);
      return errorObj;
    } else {
      let errorMsg = CommonFuns.getErrorMessage(code);
      GlobalErrorMessageAction.fireGlobalErrorMessage(errorMsg, code);
      return null;
    }
  },
  showStepError(step) {
    let btns = [],
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

    switch (step) {
      case 'Hourly':
        btns = ['Hour', 'Day', 'Week'];
        msg = ['UseRaw'];
        break;
      case 'Daily':
        btns = ['Day', 'Week', 'Month'];
        msg = ['UseHour'];
        break;
      case 'Weekly':
        btns = ['Week', 'Month', 'Year'];
        msg = ['UseHour', 'UseDay'];
        break;
      case 'Monthly':
        btns = ['Month', 'Year'];
        msg = ['UseHour', 'UseDay', 'UseWeek'];
        break;
      case 'Yearly':
        btns = ['Year'];
        msg = ['UseHour', 'UseDay', 'UseMonth'];
        break;
    }
    var newBtns = [];
    btns.forEach(btn => {
      let code = map[btn];
      if (availableList.indexOf(code) != -1) {
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
  },
  _onBaselineBtnDisabled: function() {
    this.setState({
      baselineBtnStatus: TagStore.getBaselineBtnDisabled()
    });
  },
  componentDidMount: function() {
    EnergyStore.addTagDataLoadingListener(this._onLoadingStatusChange);
    EnergyStore.addTagDataChangeListener(this._onEnergyDataChange);
    EnergyStore.addGetTagDataErrorListener(this._onGetEnergyDataError);
    TagStore.addBaselineBtnDisabledListener(this._onBaselineBtnDisabled);
    if (this.props.isSettingChart) {
      this.refs.relativeDate.setState({
        selectedIndex: 1
      });

      let date = new Date();
      date.setHours(0, 0, 0);
      let last7Days = CommonFuns.dateAdd(date, -6, 'days');
      let endDate = CommonFuns.dateAdd(date, 1, 'days');

      this.refs.dateTimeSelector.setDateField(last7Days, endDate);
    }
  },
  componentWillUnmount: function() {
    EnergyStore.removeTagDataLoadingListener(this._onLoadingStatusChange);
    EnergyStore.removeTagDataChangeListener(this._onEnergyDataChange);
    EnergyStore.removeGetTagDataErrorListener(this._onGetEnergyDataError);
    TagStore.removeBaselineBtnDisabledListener(this._onBaselineBtnDisabled);

    YaxisSelector.reset();
  },
  getSelectedTagOptions() {
    let tagOptions,
      userTagListSelect = AlarmTagStore.getUseTaglistSelect();

    if (!userTagListSelect) {
      tagOptions = EnergyStore.getTagOpions();
    } else {
      tagOptions = AlarmTagStore.getSearchTagList();
    }
    return tagOptions;
  },
  handleBaselineCfg: function(e) {
    let tagOption, tagObj,
      tagOptions = this.getSelectedTagOptions();

    if (tagOptions && tagOptions.length === 1) {
      tagOption = tagOptions[0];
      let uom = getUomById(tagOption.uomId);
      tagObj = {
        tagId: tagOption.tagId,
        hierarchyId: tagOption.hierId,
        uom: uom
      };
    } else {
      return;
    }

    let dateSelector = this.refs.dateTimeSelector;
    let dateRange = dateSelector.getDateTime();

    this.refs.baselineCfg.showDialog(tagObj, dateRange);
    var year = (new Date()).getFullYear();
    TBSettingAction.setYear(year);
  },
  OnNavigatorChanged: function(obj) {
    var chart = obj.target.chart,
      scroller = chart.scroller,
      min = obj.min,
      max = obj.max,
      start = Math.round(min),
      end = Math.round(max),
      validator = JazzCommon.IsValidDate,
      converter = DataConverter.JsonToDateTime,
      type = 'resize',
      startTime,
      endTime;

    if (scroller.grabbedLeft) {
      startTime = new Date(start);
      startTime.setMinutes(0, 0, 0);
      endTime = new Date(end);
      endTime.setMinutes(0, 0, 0);
      this.needRollback = true;
    } else if (scroller.grabbedRight) {
      endTime = new Date(end);
      endTime.setMinutes(0, 0, 0);

      startTime = new Date(start);
      startTime.setMinutes(0, 0, 0);
      this.needRollback = true;
    } else {
      startTime = new Date(start);
      startTime.setMinutes(0, 0, 0);
      endTime = new Date(end);
      endTime.setMinutes(0, 0, 0);
      type = 'move';
    }

    if (startTime > endTime) {
      startTime = new Date(start);
      startTime.setMinutes(0, 0, 0);
      endTime = new Date(end);
      endTime.setMinutes(0, 0, 0);
    }

    if (startTime.getTime() == endTime.getTime()) {
      if (scroller.grabbedLeft) {
        startTime = dateAdd(endTime, -1, 'hours');
      } else {
        endTime = dateAdd(startTime, 1, 'hours');
      }
    }

    this.dateChanged(chart, startTime, endTime, type);
  },
  dateChanged(chart, start, end, type) {
    this.refs.dateTimeSelector.setDateField(start, end);
    this.refs.relativeDate.setState({
      selectedIndex: 0
    });

    if (type === 'resize' || chart.navCache === false) {
      this._onNavigatorChangeLoad();
    }
  }
});

module.exports = ChartPanel;
