'use strict';
import React from "react";
import Immutable from 'immutable';
import assign from "object-assign";
import { FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress, IconMenu, TextField } from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import classNames from 'classnames';

import CommonFuns from 'util/Util.jsx';
import { dateAdd, dateFormat, DataConverter, isArray, isNumber, formatDateByStep, getDecimalDigits, toFixed, JazzCommon } from 'util/Util.jsx';

import OrigamiPanel from 'controls/OrigamiPanel.jsx';
import EnergyDialog from 'controls/OperationTemplate/BlankDialog.jsx';
import ExtendableMenuItem from 'controls/ExtendableMenuItem.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';

import FolderAction from 'actions/FolderAction.jsx';
import TBSettingAction from 'actions/TBSettingAction.jsx';
import GlobalErrorMessageAction from 'actions/GlobalErrorMessageAction.jsx';
import AlarmTagAction from 'actions/AlarmTagAction.jsx';

import ConstStore from 'stores/ConstStore.jsx';
import FolderStore from 'stores/FolderStore.jsx';
import AlarmStore from 'stores/AlarmStore.jsx';
import TagStore from 'stores/TagStore.jsx';
import LabelStore from 'stores/LabelStore.jsx';
import CostStore from 'stores/CostStore.jsx';
import RankStore from 'stores/RankStore.jsx';
import RatioStore from 'stores/RatioStore.jsx';
import CarbonStore from 'stores/CarbonStore.jsx';
import LabelMenuStore from 'stores/LabelMenuStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import EnergyStore from 'stores/Energy/EnergyStore.jsx';
import CommodityStore from 'stores/CommodityStore.jsx';
import MultipleTimespanStore from 'stores/Energy/MultipleTimespanStore.jsx';

import CalendarManager from './CalendarManager.jsx';
import ChartStrategyFactor from './ChartStrategyFactor.jsx';
import ChartMixins from './ChartMixins.jsx';
import ErrorStepDialog from '../alarm/ErrorStepDialog.jsx';
var createReactClass = require('create-react-class');
function currentUser() {
  return CurrentUserStore.getCurrentUser();
}
const DIALOG_TYPE = {
  SWITCH_WIDGET: "switchwidget",
  SWITCH_EC: 'switchec',
  ERROR_NOTICE: 'errornotice'
};

let lastRelativeDate = 'Customerize';
import PropTypes from 'prop-types';
let AnalysisPanel = createReactClass({
  //mixins: [ChartMixins],
  propTypes: {
    chartTitle: PropTypes.string,
    bizType: PropTypes.oneOf(['Energy', 'Unit', 'Ratio', 'Label', 'Rank']),
    onOperationSelect: PropTypes.func,
  },
  contextTypes: {
    router: PropTypes.func
  },
  getDefaultProps() {
    return {
      //bizType:'Energy',
      bizType: 'Unit',
      energyType: 'Energy',
      chartTitle: '最近7天能耗分析',
      widgetInitState: false,
      sourceUserName: null,
      isFromAlarm: false
    };
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.energyType)
      this.setState({
        energyType: nextProps.energyType
      });
  },
  getInitialState() {
    this.searchDate = MultipleTimespanStore.getRelativeItems();
    let strategyName = this.getStrategyName(this.props.bizType, this.props.energyType);
    let chartStrategy = ChartStrategyFactor.getStrategyByStoreType(strategyName);
    var rivilege = CurrentUserStore.getCurrentPrivilege();
    var baselineRivilege = this._getBaselineRivilege(rivilege);
    let state = {
      baselineRivilege: baselineRivilege,
      isLoading: false,
      energyData: null,
      energyRawData: null,
      hierName: null,
      submitParams: null,
      step: null,
      yaxisConfig: null,
      dashboardOpenImmediately: false,
      baselineBtnStatus: TagStore.getBaselineBtnDisabled(),
      weatherBtnStatus: TagStore.getWeatherBtnDisabled(),
      selectedChartType: 'line',
      chartStrategy: chartStrategy,
      energyType: this.props.energyType || 'Energy', //'one of energy, cost carbon'
      remarkText: '',
      remarkDisplay: false,
      dialogType: '',
      relativeDate:'Last7Day'
    };

    var obj = chartStrategy.getInitialStateFn(this);

    assign(state, obj);
    return state;
  },
  _getBaselineRivilege(rivilege) {
    var baselineRivilege = false;
    if (rivilege !== null) {
      if (rivilege.indexOf('1223') > -1) {
        baselineRivilege = true;
      }
    }
    return baselineRivilege;
  },
  _onCurrentrivilegeChanged: function() {
    var rivilege = CurrentUserStore.getCurrentPrivilege();
    var baselineRivilege = this._getBaselineRivilege(rivilege);
    this.setState({
      baselineRivilege: baselineRivilege
    });
  },
  _onTitleMenuSelect: function(e, item) {
    let menuIndex = parseInt(item.key);

    if (menuIndex === 4) {
      this.exportChart();
    } else {
      if (menuIndex === 1) {
        let widgetDto = this.state.chartStrategy.save2DashboardFn(this, menuIndex);
        this.props.onOperationSelect(menuIndex, widgetDto);
      } else {
        if (menuIndex === 2) {
          this.state.chartStrategy.save2DashboardFn(this);
        }
        this.props.onOperationSelect(menuIndex);

      }

    }
  },
  onWidgetSaveWindow: function(destNode, newName) {
    this.state.chartStrategy.save2DashboardFn(this, destNode, newName);
  },
  _onBackBtnClick: function() {
    var parentNode = FolderStore.getParent(FolderStore.getNodeById(this.props.widgetDto.Id));
    var lastSelectedNode = FolderStore.getSelectedNode();
    if (lastSelectedNode.get('Type') == 7 && lastSelectedNode.get('ChartType') === null) {
      FolderAction.setDisplayDialog('switchwidget');
    } else {
      FolderAction.setSelectedNode(parentNode);
    }


  },
  _onDialogChanged: function() {
    this.setState({
      dialogType: FolderStore.getDisplayDialog().type
    });
  },
  render() {
    let me = this,
      errorDialog = null,
      energyPart = null;

    // add for PM2.5
    var user=window.currentUser || currentUser();

    var dialog;
    switch (this.state.dialogType) {
      case DIALOG_TYPE.SWITCH_EC:
        dialog = this._getSwitchECDialog();
        break;
    }

    if (me.state.errorObj) {
      errorDialog = <ErrorStepDialog {...me.state.errorObj} onErrorDialogAction={me._onErrorDialogAction}></ErrorStepDialog>;
    }

    var collapseButton = <div className="fold-tree-btn" style={{
      "color": "#939796"
    }} >
                              <FontIcon hoverColor="#6b6b6b" color="#939796" className={classNames("icon", "icon-column-fold")} onClick={this.props.onCollapseButtonClick} />
                           </div>;
    let trigger = false;
    if (this.state.isLoading) {
      energyPart = <div style={{
        margin: 'auto',
        width: '100px'
      }}>
          <CircularProgress  mode="indeterminate" size={80} />
        </div>;
    } else if (!!this.state.energyData || trigger) {
      energyPart = this.state.chartStrategy.getChartComponentFn(me);
    }

    let widgetOptMenu = this.state.chartStrategy.getWidgetOptMenuFn(me);

    let sourceUserNameEl = null;
    if (me.props.sourceUserName) {
      sourceUserNameEl = <div className={'description'}>{me.props.sourceUserName}</div>;
    } else {
      sourceUserNameEl = <div className={'description'}></div>;
    }
    let widgetWd;
    if (me.state.dashboardOpenImmediately) {
      widgetWd = this.state.chartStrategy.getWidgetSaveWindowFn(me);
    } else {
      widgetWd = null;
    }
    let BackBtn = (this.props.isFromAlarm) ? null : <div style={{
      height: '30px',
      width: '30px',
      border: '1px solid #ececec',
      marginRight: '10px'
    }}>
          <FontIcon style={{
      fontSize: '16px',
      margin: '5px 0 0 6px',
    }} className={classNames("icon", "icon-return")} onClick={this._onBackBtnClick}/>
        </div>;
    var remarkTextArea = null;
    if (this.state.remarkDisplay) {
      remarkTextArea = <div className='jazz-energy-remark-text'><TextField hintText={I18N.Remark.DefaultText} value={this.state.remarkText} onChange={this.getRemarck} hintStyle={{
        color: '#abafae'
      }} multiLine={true} underlineShow={false}></TextField></div>;
    }
    var remarkDiv = null;
    if (!this.props.isFromAlarm) {
      remarkDiv = <div className={classNames(
        {
          'jazz-energy-remark-container': true,
          'jazz-energy-remark-expand': !this.props.showLeft && !this.props.showRight
        }
      )}>
      <div style={{
        textAlign: 'center'
      }}>
      <div className='jazz-energy-remark-button'><RaisedButton label={I18N.Remark.Label} onClick={this.showRemark}></RaisedButton></div>
      </div>
      {remarkTextArea}
    </div>;
    }
    let panel = <div className={'jazz-energy-panel'} style={{marginTop:0}}>
        <div className='header'>
        <OrigamiPanel/>
          {collapseButton}
          {sourceUserNameEl}
          <div className={'jazz-alarm-chart-toolbar-container'}>
              <div className={'title'} style={{
      display: 'flex',
      alignItems: 'center',
      minWidth: '70px',
      marginTop: '30px'
    }}>
    {BackBtn}
                <div className={'content'} title={me.props.chartTitle} style={{
      minWidth: '70px'
    }}>
                  {me.props.chartTitle}
                </div>
                {user.Name!=='se'?<IconButton iconClassName="icon-save" iconStyle={{
      fontSize: '16px'
    }} style={{
      padding: '0px',
      height: '18px',
      width: '18px',
      marginLeft: '10px'
    }} onClick={this._onChart2WidgetClick}
    disabled={!this.state.energyData}/>:null}
                {widgetOptMenu}
                {widgetWd}
              </div>
              {me.state.chartStrategy.searchBarGenFn(me)}
          </div>
        </div>
        {energyPart}
        {errorDialog}
        {dialog}
        {remarkDiv}

      </div>;

    let chartCmp = me.refs.ChartComponent;
    if (chartCmp) {
      let chartObj = chartCmp.refs.highstock;
      if (!!this.state.calendarType && !this.state.chartStrategy.isCalendarDisabledFn(this)) {
        CalendarManager.showCalendar(chartObj, this.state.calendarType);
      } else {
        CalendarManager.hideCalendar(chartObj);
      }
    }
    return panel;
  },
  componentDidUpdate() {
    if (this.state.chartStrategy.onAnalysisPanelDidUpdateFn) {
      this.state.chartStrategy.onAnalysisPanelDidUpdateFn(this);
    }
  },
  componentDidMount: function() {
    let me = this;
    this.state.chartStrategy.getInitParamFn(me);
    this.state.chartStrategy.getAllDataFn();
    this.state.chartStrategy.bindStoreListenersFn(me);
    if (this.props.isFromAlarm) {
      var leftSelectedTagId = AlarmStore.getSelectedAlarmTag();
      var tagId = this.props.widgetDto.tagId;
      if (leftSelectedTagId === tagId) {
        window.setTimeout(me._initAlarmChartPanelByWidgetDto, 0);
      }

    } else {
      var leftSelectedId = FolderStore.getSelectedNode().get('Id');
      var widgetId = this.props.widgetDto.Id;
      if (this.props.widgetInitState && leftSelectedId === widgetId) {
        window.setTimeout(me._initChartPanelByWidgetDto, 0);
      }
    }
    if (this.props.bizType === 'Label') {
      if (LabelMenuStore.getHierNode()) {
        this.state.chartStrategy.onHierNodeChangeFn(this);
      }
    }
    FolderStore.addDialogListener(this._onDialogChanged);
    CurrentUserStore.addCurrentrivilegeListener(this._onCurrentrivilegeChanged);
  },
  componentWillUnmount: function() {
    let me = this;
    this.state.chartStrategy.unbindStoreListenersFn(me);
    this.state.chartStrategy.resetYaxisSelectorFn();
    this.state.chartStrategy.resetCalendarTypeFn();
    if (this.props.bizType === 'Label') {
      LabelMenuStore.clearHierNodes();
      LabelMenuStore.clearHierNode();
    }
    FolderStore.removeDialogListener(this._onDialogChanged);
    CurrentUserStore.removeCurrentrivilegeListener(this._onCurrentrivilegeChanged);
  },
  getRemarck: function(e) {
    this.setState({
      remarkText: e.target.value
    });
  },
  onWidgetSaveWindowDismiss: function() {
    this.setState({
      dashboardOpenImmediately: false
    });
  },
  _initAlarmChartPanelByWidgetDto() {
    this.state.chartStrategy.initAlarmChartPanelByWidgetDtoFn(this);
  },
  _initChartPanelByWidgetDto() {
    if (this.state.chartStrategy.initChartPanelByWidgetDtoFn) {
      this.state.chartStrategy.initChartPanelByWidgetDtoFn(this);
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
    if (chartObj.options.scrollbar && chartObj.options.scrollbar.enabled) {
      chartObj.xAxis[0].bind('setExtremes', this.OnNavigatorChanged);
    }
  },
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
    if (this.state.chartStrategy.handleNavigatorChangeTimeFn) {
      this.state.chartStrategy.handleNavigatorChangeTimeFn(startTime, endTime);
    }
    this.dateChanged(chart, startTime, endTime, type);
  },
  dateChanged(chart, start, end, type) {
    this.refs.dateTimeSelector.setDateField(start, end);
    this.refs.relativeDate.setState({
      selectedIndex: 0
    });

    if (type === 'resize' || this.refs.ChartComponent.navCache === false) {
      this._onNavigatorChangeLoad();
    }

  },
  _onNavigatorChangeLoad() {
    if (this.state.chartStrategy.handleNavigatorChangeLoadFn) {
      this.state.chartStrategy.handleNavigatorChangeLoadFn(this);
    }
  },
  getStrategyName(bizType, energyType) {
    let strategyName = null;
    switch (bizType) {
      case 'Energy':
        if (!energyType || energyType === 'Energy') {
          strategyName = 'Energy';
        } else if (energyType === 'Cost') {
          strategyName = 'Cost';
        } else if (energyType === 'Carbon') {
          strategyName = 'Carbon';
        }
        break;
      case 'Unit':
        if (!energyType || energyType === 'Energy') {
          strategyName = 'UnitEnergyUsage';
        } else if (energyType === 'Cost') {
          strategyName = 'UnitCost';
        } else if (energyType === 'Carbon') {
          strategyName = 'UnitCarbon';
        }
        break;
      case 'Ratio':
        strategyName = 'RatioUsage';
        break;
      case 'Label':
        strategyName = 'Label';
        break;
      case 'Rank': strategyName = 'Rank';
        break;
    }
    return strategyName;
  },
  _onChart2WidgetClick() {
    if (!!this.props.isFromAlarm) {
      this.state.chartStrategy.save2DashboardForAlarmFn(this);
    } else {
      if (this.state.chartStrategy.save2DashboardFn) {
        this.state.chartStrategy.save2DashboardFn(this);
      }
    }

  },
  _onErrorDialogAction(step, stepBtnList) {
    this.setState({
      errorObj: null
    });
    if (step !== 'cancel') {
      this._onStepChange(step);
    } else {
      if (stepBtnList.length === 0) {
        this.setState({
          energyData: null
        });
      } else {
        //this.state.chartStrategy.onSearchDataButtonClickFn(this);
      }
    }
  },
  getEnergyTypeCombo() {
    let types = [{
      text: I18N.EM.KpiModeEM,
      value: 'energy'
    }, {
      text: I18N.EM.KpiModeCost,
      value: 'cost'
    }, {
      text: I18N.EM.KpiModeCarbon,
      value: 'carbon'
    }];
    return <DropDownMenu menuItems={types} onChange={this._onEnergyTypeChange}></DropDownMenu>;
  },
  _onEnergyTypeChange(e, selectedIndex, menuItem) {
    let menuItemVal = menuItem.value;
    let capMenuItemVal = menuItemVal[0].toUpperCase() + menuItemVal.substring(1);
    let chartSttg = ChartStrategyFactor.getStrategyByStoreType(capMenuItemVal);
    this.setState({
      chartStrategy: chartSttg
    });
    chartSttg.onEnergyTypeChangeFn(e, selectedIndex, menuItem);
  },
  _getSwitchECDialog: function() {
    var that = this;
    var _onConfirm = function() {
      // that.setState({
      //   selectedEnergyType: FolderStore.getDisplayDialog().nodeData
      // });
      //
      // that.setState({
      //   refreshChart: true
      // }, () => {
      //   that.setState({
      //     refreshChart: false,
      //     selectedEnergyType: FolderStore.getDisplayDialog().nodeData
      //   });
      // });
      let capMenuItemVal = FolderStore.getDisplayDialog().node;
      let chartSttg = ChartStrategyFactor.getStrategyByStoreType(capMenuItemVal);
      that.setState({
        chartStrategy: chartSttg
      });
      that.props.onEnergyTypeChange(capMenuItemVal);
    //EnergyAction.setEnergyType(nextEnergyType);
    };
    var _onCancel = function() {
      that.setState({
        dialogType: ''
      });
    };
    var props = {
      title: I18N.Folder.Widget.SwitchLeave,
      firstActionLabel: I18N.Folder.Widget.SwitchButton,
      secondActionLabel: I18N.Folder.Widget.LeaveCancel,
      content: I18N.Folder.Widget.SwitchContent,
      onFirstActionTouchTap: _onConfirm,
      onSecondActionTouchTap: _onCancel,
      onDismiss: _onCancel,
    };
    return (
      <EnergyDialog {...props}/>
      );
  },
  _onStepChange(step) {
    this.state.chartStrategy.handleStepChangeFn(this, step);
  },
  _onDateSelectorChanged() {
    this.setState({
      relativeDate: 'Customerize'
    });
  },
  _onLoadingStatusChange() {
    let isLoading = EnergyStore.getLoadingStatus(),
      paramsObj = EnergyStore.getParamsObj(),
      tagOption = EnergyStore.getTagOpions()[0],
      obj = assign({}, paramsObj);

    obj.isLoading = isLoading;
    obj.tagName = tagOption.tagName;
    obj.dashboardOpenImmediately = false;
    obj.tagOption = tagOption;
    obj.energyData = null;

    this.setState(obj);
  },
  _onCostLoadingStatusChange() {
    let isLoading = CostStore.getLoadingStatus(),
      paramsObj = CostStore.getParamsObj(),
      selectedList = CostStore.getSelectedList(),
      obj = assign({}, paramsObj);

    obj.isLoading = isLoading;
    obj.dashboardOpenImmediately = false;
    obj.selectedList = selectedList;
    obj.energyData = null;

    this.setState(obj);
  },
  _onCarbonLoadingStatusChange() {
    let isLoading = CarbonStore.getLoadingStatus(),
      paramsObj = CarbonStore.getParamsObj(),
      commOption = CarbonStore.getCommOpions(),
      obj = assign({}, paramsObj);

    obj.isLoading = isLoading;
    obj.dashboardOpenImmediately = false;
    obj.commOption = commOption;
    obj.energyData = null;

    this.setState(obj);
  },
  _onRatioLoadingStatusChange() {
    let isLoading = RatioStore.getLoadingStatus(),
      paramsObj = RatioStore.getParamsObj(),
      ratioOption = RatioStore.getRatioOpions(),
      obj = assign({}, paramsObj);

    obj.isLoading = isLoading;
    obj.dashboardOpenImmediately = false;
    obj.ratioOption = ratioOption;
    obj.energyData = null;

    this.setState(obj);
  },
  _onRankLoadingStatusChange() {
    let isLoading = RankStore.getLoadingStatus(),
      paramsObj = RankStore.getParamsObj(),
      selectedList = RankStore.getSelectedList(),
      obj = assign({}, paramsObj);

    obj.isLoading = isLoading;
    obj.dashboardOpenImmediately = false;
    obj.selectedList = selectedList;
    obj.energyData = null;

    this.setState(obj);
  },
  _onLabelLoadingStatusChange() {
    let isLoading = LabelStore.getLoadingStatus(),
      paramsObj = LabelStore.getParamsObj(),
      tagOption = LabelStore.getTagOpions()[0],
      obj = assign({}, paramsObj);

    obj.isLoading = isLoading;
    obj.tagName = tagOption.tagName;
    obj.dashboardOpenImmediately = false;
    obj.tagOption = tagOption;
    obj.energyData = null;

    this.setState(obj);
  },
  _onEnergyDataChange(isError, errorObj, args) {
    let isLoading = EnergyStore.getLoadingStatus(),
      energyData = EnergyStore.getEnergyData(),
      energyRawData = EnergyStore.getEnergyRawData(),
      paramsObj = assign({}, EnergyStore.getParamsObj()),
      state = {
        isLoading: isLoading,
        energyData: energyData,
        energyRawData: energyRawData,
        paramsObj: paramsObj,
        dashboardOpenImmediately: false,
        isCalendarInited: false
      };
    if (isError === true) {
      state.step = null;
      state.errorObj = errorObj;
      if (!!args && args.length && args[0] === '') {

      }
    }
    this.setState(state);
  },
  _onCostDataChange(isError, errorObj) {
    let isLoading = CostStore.getLoadingStatus(),
      energyData = CostStore.getEnergyData(),
      energyRawData = CostStore.getEnergyRawData(),
      paramsObj = assign({}, CostStore.getParamsObj()),
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
    this._onTouBtnDisabled(paramsObj.step);
  },
  _onCarbonDataChange(isError, errorObj) {
    let isLoading = CarbonStore.getLoadingStatus(),
      carbonData = CarbonStore.getCarbonData(),
      carbonRawData = CarbonStore.getCarbonRawData(),
      paramsObj = assign({}, EnergyStore.getParamsObj()),
      state = {
        isLoading: isLoading,
        energyData: carbonData,
        energyRawData: carbonRawData,
        paramsObj: paramsObj,
        dashboardOpenImmediately: false
      };
    if (isError === true) {
      state.step = null;
      state.errorObj = errorObj;
    }
    this.setState(state);
  },
  _onRatioDataChange(isError, errorObj) {
    let isLoading = RatioStore.getLoadingStatus(),
      energyData = RatioStore.getEnergyData(),
      energyRawData = RatioStore.getEnergyRawData(),
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
  _onRankDataChange(isError, errorObj) {
    let isLoading = RankStore.getLoadingStatus(),
      energyData = RankStore.getEnergyData(),
      energyRawData = RankStore.getEnergyRawData(),
      paramsObj = assign({}, RankStore.getParamsObj()),
      state = {
        isLoading: isLoading,
        energyData: energyData,
        energyRawData: energyRawData,
        paramsObj: paramsObj,
        dashboardOpenImmediately: false
      };
    if (isError === true) {
      state.errorObj = errorObj;
    }
    this.setState(state);
  },
  _onLabelDataChange(isError, errorObj) {
    let isLoading = LabelStore.getLoadingStatus(),
      energyData = LabelStore.getEnergyData(),
      energyRawData = LabelStore.getEnergyRawData(),
      paramsObj = assign({}, LabelStore.getParamsObj()),
      state = {
        isLoading: isLoading,
        energyData: energyData,
        energyRawData: energyRawData,
        paramsObj: paramsObj,
        dashboardOpenImmediately: false
      };
    if (isError === true) {
      state.errorObj = errorObj;
    }
    this.setState(state);
  },
  onSearchDataButtonClick() {
    this.state.chartStrategy.onSearchDataButtonClickFn(this);
  },
  exportChart() {
    this.state.chartStrategy.exportChartFn(this);
  },
  save2Dashboard(menuIndex) {
    if (this.state.chartStrategy.save2DashboardFn) {
      this.state.chartStrategy.save2DashboardFn(this, menuIndex);
    }
  },
  _getRelativeDateValue() {
    return this.state.relativeDate;
  },
  _setFitStepAndGetData(startDate, endDate, tagOptions, relativeDate) {
    this.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, tagOptions, relativeDate.this);
  },
  _setRelativeDateByValue(value) {
    // let relativeDateMenuItems = ConstStore.getSearchDate();
    // let menuIndex = -1;
    // relativeDateMenuItems.forEach((item, index) => {
    //   if (item.value === value) {
    //     menuIndex = index;
    //   }
    // });
    // if (menuIndex !== -1) {
    //   if (this.refs.relativeDate) {
    //     this.refs.relativeDate.setState({
    //       selectedIndex: menuIndex
    //     });
    //   }
      this._onRelativeDateChange(null, null, value);
    //}
  },
  _onRelativeDateChange(e, selectedIndex, value) {
    let dateSelector = this.refs.dateTimeSelector;

    if (this.state.selectedChartType == 'rawdata' && value !== 'Customerize' && value !== 'Last7Day' && value !== 'Today' && value !== 'Yesterday' && value !== 'ThisWeek' && value !== 'LastWeek') {
      FolderAction.setDisplayDialog('errornotice', null, I18N.EM.RawData.ErrorForEnergy);
    } else {
      if (value && value !== 'Customerize' && dateSelector) {
        var timeregion = CommonFuns.GetDateRegion(value.toLowerCase());
        dateSelector.setDateField(timeregion.start, timeregion.end);
      }
    }
    this.setState({
      relativeDate:value
    })
  },
  _onRankTypeChange(e, selectedIndex, value) {
    var rankType =value;
    this.setState({
      rankType: rankType
    });
  },
  _onRangeChange(e, selectedIndex, value) {
    var range = value;
    this.setState({
      range: range
    });
  },
  _onOrderChange(e, selectedIndex, value) {
    var order = value;
    this.setState({
      order: order
    });
  },
  _onCarbonTypeChange(e, selectedIndex, value) {
    var me = this;
    me.setState({
      destination: value
    }, () => {
      me.state.chartStrategy.onSearchDataButtonClickFn(me);
    });
  },
  _onChangeMonth(e, selectedIndex, value) {
    this.setState({
      month: value
    });
  },
  _onGetEnergyDataError() {
    let errorObj = this.errorProcess(EnergyStore);
    this._onEnergyDataChange(true, errorObj);
  },
  _onGetEnergyDataErrors() {
    let errorObj = this.errorsProcess(EnergyStore);
    this._onEnergyDataChange(false, errorObj);
  },
  _onGetCostDataError() {
    let errorObj = this.errorProcess(CostStore);
    this._onCostDataChange(true, errorObj);
  },
  _onGetCostDataErrors() {
    let errorObj = this.errorsProcess(CostStore);
    this._onCostDataChange(false, errorObj);
  },
  _onGetCarbonDataError() {
    let errorObj = this.errorProcess(CarbonStore);
    this._onCarbonDataChange(true, errorObj);
  },
  _onGetCarbonDataErrors() {
    let errorObj = this.errorsProcess(CarbonStore);
    this._onCarbonDataChange(true, errorObj);
  },
  _onGetRatioDataError() {
    let errorObj = this.errorProcess(RatioStore);
    this._onRatioDataChange(true, errorObj);
  },
  _onGetRankDataError() {
    let errorObj = this.errorProcess(RankStore);
    this._onRankDataChange(true, errorObj);
  },
  _onGetLabelDataError() {
    let errorObj = this.errorProcess(LabelStore);
    this._onLabelDataChange(true, errorObj);
  },
  errorProcess(EnergyStore) {
    let code = EnergyStore.getErrorCode(),
      messages = EnergyStore.getErrorMessage();

    if (!code) {
      return;
    } else if (code == '02004'.toString()) {
      let errorObj = this.showStepError(messages[0], EnergyStore);
      return errorObj;
    } else {
      let errorMsg = CommonFuns.getErrorMessage(code);
      setTimeout(() => {
        GlobalErrorMessageAction.fireGlobalErrorMessage(errorMsg, code);
      }, 0);
      return null;
    }
  },
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
  },
  showStepError(step, EnergyStore) {
    if( !EnergyStore.getParamsObj() ) {
      return ;
    }
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
  _onWeatherBtnDisabled: function() {
    let me = this;
    var weatherOption = this.state.weatherOption;
    if (TagStore.getWeatherBtnDisabled()) {
      weatherOption = null;
    }
    setTimeout(() => {
      me.setState({
        weatherBtnStatus: TagStore.getWeatherBtnDisabled(),
        weatherOption: weatherOption,
      });
    }, 0);
  },
  _onUnitCostBaselineBtnDisabled: function() {
    this.setState({
      unitBaselineBtnStatus: CommodityStore.getUCButtonStatus()
    });

  },
  _onTouBtnDisabled: function(step) {
    var touBtnStatus = this.state.touBtnStatus;
    var newStatus = CommodityStore.getECButtonStatus();
    var touBtnSelected = this.state.touBtnSelected;
    if (newStatus) {
      if (touBtnSelected) {
        touBtnSelected = false;
      }
      this.setState({
        touBtnStatus: true,
        touBtnTooltip: I18N.EM.TouSupportsOnlyElec,
        touBtnSelected: touBtnSelected
      });
    }
    if (step !== null && step <= 1 || step === null) {
      if (touBtnSelected) {
        touBtnSelected = false;
      }
      this.setState({
        touBtnStatus: true,
        touBtnTooltip: I18N.EM.TouSupportsMoreThanHourStep,
        touBtnSelected: touBtnSelected
      });
    }
    if (!newStatus && step !== null && step > 1) {
      this.setState({
        touBtnStatus: false,
        touBtnTooltip: ''
      });
    }
  },
  _onSearchBtnItemTouchTap(e, value) {
    //this.setState({selectedChartType:child.props.value});
    var _relativeDate = this._getRelativeDateValue();
    // var paramsObj = EnergyStore.getParamsObj(),
    //   startDate = DataConverter.JsonToDateTime(paramsObj.startTime, false),
    //   endDate = DataConverter.JsonToDateTime(paramsObj.endTime, false);
    let dateSelector = this.refs.dateTimeSelector;
    let dateRange = dateSelector.getDateTime(),
      startDate = dateRange.start,
      endDate = dateRange.end;

    if (value== 'rawdata' && endDate - startDate > 604800000) {
      FolderAction.setDisplayDialog('errornotice', null, I18N.EM.RawData.ErrorForEnergy);
    } else {
      this.state.chartStrategy.onSearchBtnItemTouchTapFn(this.state.selectedChartType, value, this);
    }

  },
  _onChangeLabelType(subMenuItem, mainMenuItem) {
    var curType = this.state.labelType,
      type = mainMenuItem.props.value,
      selectedLabelItem = this.state.selectedLabelItem,
      kpiTypeValue = this.state.kpiTypeValue;

    if (type === 'industryZone') {
      if (type === curType) {
        if (selectedLabelItem.industryId === subMenuItem.props.industryId && selectedLabelItem.zoneId === subMenuItem.props.zoneId) {
          return;
        }
      }
      selectedLabelItem.text = (subMenuItem.props.industryId === -1 ? I18N.Setting.Benchmark.Label.SelectLabelling : subMenuItem.props.primaryText);
      selectedLabelItem.industryId = subMenuItem.props.industryId;
      selectedLabelItem.zoneId = subMenuItem.props.zoneId;
      selectedLabelItem.value = subMenuItem.props.value;
      this.setState({
        selectedLabelItem: selectedLabelItem,
        labelType: 'industryZone'
      }, () => {
        this.setBenchmarkOption();
      });
      this.changeToIndustyLabel(kpiTypeValue);
    } else {
      if (type === curType) {
        if (selectedLabelItem.customerizedId === subMenuItem.props.customerizedId) {
          return;
        }
      }

      selectedLabelItem.text = (subMenuItem.props.customerizedId === -1 ? I18N.Setting.Benchmark.Label.SelectLabelling : subMenuItem.props.primaryText);
      selectedLabelItem.customerizedId = subMenuItem.props.customerizedId;
      this.setState({
        selectedLabelItem: selectedLabelItem,
        labelType: 'customized'
      }, () => {
        this.setBenchmarkOption();
      });

      this.changeToCustomizedLabel(subMenuItem.props.kpiType);
    }
  },
  setIndustyLable(benchmarkOption, labelingType) {
    var curType = this.state.labelType;
    var type = '',
      i;
    var selectedLabelItem = this.state.selectedLabelItem;
    var industyMenuItems = this.state.industyMenuItems;
    var customerMenuItems = this.state.customerMenuItems;

    if (benchmarkOption === null) {
      this.enableLabelButton(true);
    } else {
      if (benchmarkOption.IndustryId !== null) {
        type = 'industryZone';
      } else if (benchmarkOption.CustomerizedId !== null) {
        type = 'customized';
      }

      if (type === 'industryZone') {
        if (type === curType) {
          if (selectedLabelItem.industryId === benchmarkOption.IndustryId && selectedLabelItem.zoneId == benchmarkOption.ZoneId) {
            return;
          }
        }
        for (i = 0; i < industyMenuItems.length; i++) {
          if (industyMenuItems[i].industryId === benchmarkOption.IndustryId && industyMenuItems[i].zoneId === benchmarkOption.ZoneId) {
            selectedLabelItem.text = industyMenuItems[i].primaryText;
            selectedLabelItem.industryId = industyMenuItems[i].IndustryId;
            selectedLabelItem.zoneId = industyMenuItems[i].ZoneId;
            selectedLabelItem.value = industyMenuItems[i].value;
            this.setState({
              selectedLabelItem: selectedLabelItem,
              labelType: 'industryZone',
              labelDisable: false
            });
            this.changeToIndustyLabel(labelingType);
            break;
          }
        }
      } else {
        if (type === curType) {
          if (selectedLabelItem.customerizedId === benchmarkOption.CustomerizedId) {
            return;
          }
        }
        for (i = 0; i < customerMenuItems.length; i++) {
          if (customerMenuItems[i].customerizedId === benchmarkOption.CustomerizedId) {
            selectedLabelItem.text = customerMenuItems[i].primaryText;
            selectedLabelItem.customerizedId = customerMenuItems[i].customerizedId;
            selectedLabelItem.value = customerMenuItems[i].value;
            this.setState({
              selectedLabelItem: selectedLabelItem,
              labelType: 'customized',
              labelDisable: false
            });
            this.changeToCustomizedLabel(labelingType);
            break;
          }
        }
      }
    }
  },
  changeToIndustyLabel(kpiTypeValue) {
    var kpiTypeItem = ConstStore.getKpiTypeItem();
    if (kpiTypeValue === 7) {
      this.setState({
        kpiTypeValue: 1,
        //kpiTypeIndex: 0
      });
    } else {
      for (var i = 0; i < kpiTypeItem.length; i++) {
        if (kpiTypeItem[i].value === kpiTypeValue) {
          this.setState({
            kpiTypeValue: kpiTypeValue,
            //kpiTypeIndex: kpiTypeItem[i].index
          });
          break;
        }
      }
    }

    this.enableKpiTypeButton();
  },
  changeToCustomizedLabel(kpiType) {
    this.setState({
      kpiTypeValue: kpiType
    });
    this.disableKpiTypeButton();
  },
  getKpiText() {
    var kpiTypeItem = ConstStore.getKpiTypeItem();
    var kpiTypeText = "";
    var kpiType = this.state.kpiTypeValue;
    if (kpiType === 7) {
      kpiTypeText = I18N.EM.Unit.UnitOriginal;
    } else {
      kpiTypeItem.forEach(item => {
        if (item.value === kpiType) {
          kpiTypeText = item.text;
          return;
        }
      });
    }
    return kpiTypeText;
  },
  getRangeIndex() {
    var range = this.state.range;
    // var rangeItem = ConstStore.getRangeItem();
    // var rangeIndex;
    // rangeItem.forEach(item => {
    //   if (item.value === range) {
    //     rangeIndex = item.index;
    //     return;
    //   }
    // });
    return range;
  },
  _onHierNodeChange() {
    this.state.chartStrategy.onHierNodeChangeFn(this);
  },
  _onHierNodesChange() {
    var industryStore = LabelMenuStore.getIndustryData();
    var labelingsStore = LabelMenuStore.getLabelData();
    var zoneStore = LabelMenuStore.getZoneData();
    var customizedStore = LabelMenuStore.getCustomerLabelData();
    var hierNodes = LabelMenuStore.getHierNodes();
    if (industryStore === null || labelingsStore === null || zoneStore === null || customizedStore === null || hierNodes.length === 0) {
      return;
    }
    var industyMenuItems = this.getIndustyMenuItems4MultiMode();
    var customerMenuItems = this.getCustomizedMenuItems();
    if (!industyMenuItems) {
      return;
    }
    this.setState({
      industyMenuItems: industyMenuItems,
      customerMenuItems: customerMenuItems
    }, () => {
      this.setIndustyLable(this.state.benchmarkOption, this.state.kpiTypeValue);
    });
  },
  enableLabelButton(preSelect) {
    if (!this.state.labelDisable && !preSelect) {
      return;
    }
    var selectedLabelItem = {};
    var labelItems = this.state.industyMenuItems;
    if (labelItems.length > 0 && labelItems[0].industryId != -1) {
      var item = labelItems[0];
      selectedLabelItem.industryId = item.industryId;
      selectedLabelItem.zoneId = item.zoneId;
      selectedLabelItem.text = item.primaryText;
      selectedLabelItem.value = item.value;
    } else {
      selectedLabelItem = this.initSlectedLabelItem();
    }
    this.setState({
      selectedLabelItem: selectedLabelItem,
      labelType: 'industryZone',
      labelDisable: false
    }, () => {
      this.setBenchmarkOption();
    });
    this.enableKpiTypeButton();
  },
  getDisplayText(primaryText) {
    var text;
    var textLen = JazzCommon.GetArialStrLen(primaryText);
    if (textLen > 7) { //114px width and the forn size is 16
      text = JazzCommon.GetArialStr(primaryText, 6);
    } else {
      text = primaryText;
    }
    return text;
  },
  disableLabelButton() {
    this.setState({
      labelDisable: true
    });
    this.setEmptyLabelMenu();
  },
  enableKpiTypeButton() {
    this.setState({
      kpiTypeDisable: false
    });
  },
  disableKpiTypeButton() {
    this.setState({
      kpiTypeDisable: true
    });
  },
  hasIndustyMenuItems: function() {
    return this.state.industyMenuItems.length > 0;
  },
  hasCustomizedMenuItems: function() {
    return this.state.customerMenuItems.length > 0;
  },
  initSlectedLabelItem() {
    var selectedLabelItem = {};
    selectedLabelItem.industryId = -1;
    selectedLabelItem.ZoneId = -1;
    selectedLabelItem.text = I18N.Setting.Benchmark.Label.SelectLabelling;
    selectedLabelItem.value = null;
    return selectedLabelItem;
  },
  getCustomizedMenuItems() {
    var menuItems = this.state.customerMenuItems;
    var customizedStore = LabelMenuStore.getCustomerLabelData();
    if (customizedStore === null) {
      return;
    }
    if (!this.hasCustomizedMenuItems()) {
      customizedStore.forEach((item, index) => {
        menuItems.push({
          value: item.get('Id'),
          customerizedId: item.get('Id'),
          primaryText: item.get('Name'),
          kpiType: item.get('LabellingType')
        });
      });
    }
    if (menuItems.length === 0) {
      menuItems = this.getNoneMenuItem(false);
    }
    return menuItems;
  },
  removeRedundance: function(items) {
    var map = {},
      id,
      item;
    for (var i = 0; i < items.length; i++) {
      item = items[i];
      id = item.industryId + '_' + item.zoneId;
      if (map[id]) {
        items.splice(i, 1);
        i = i - 1;
      } else {
        map[id] = id;
      }
    }
  },
  getIndustyMenuItems4MultiMode() {
    var hierNodes = LabelMenuStore.getHierNodes();
    var industryStore = LabelMenuStore.getIndustryData();
    var labelingsStore = LabelMenuStore.getLabelData();
    var zoneStore = LabelMenuStore.getZoneData();
    var hierNode,
      industryId,
      zoneId,
      parentId,
      industyMenuItems = [];

    if (industryStore === null || labelingsStore === null || zoneStore === null || hierNodes.length === 0) {
      return;
    }
    for (var i = 0; i < hierNodes.length; i++) {
      hierNode = hierNodes[i];
      industryId = hierNode.IndustryId;
      zoneId = hierNode.ZoneId;
      if (!industryId) continue;
      this.addIndustyMenuItem(labelingsStore, industryId, zoneId, industyMenuItems);
      var industryNode = industryStore.find((item, index) => {
        return (item.get("Id") === industryId);
      });
      parentId = industryNode.get('ParentId');
      if (parentId !== 0) {
        this.addIndustyMenuItem(labelingsStore, parentId, zoneId, industyMenuItems);
      }
      this.addIndustyMenuItem(labelingsStore, 0, zoneId, industyMenuItems);
    }
    this.removeRedundance(industyMenuItems);
    if (industyMenuItems.length === 0) {
      industyMenuItems = this.getNoneMenuItem(true);
    }
    return industyMenuItems;
  },
  getIndustyMenuItems() {
    var industryStore = LabelMenuStore.getIndustryData();
    var labelingsStore = LabelMenuStore.getLabelData();
    var zoneStore = LabelMenuStore.getZoneData();
    var hierNode = LabelMenuStore.getHierNode();
    var industryId,
      zoneId,
      parentId,
      industyMenuItems = this.state.industyMenuItems;
    if (industryStore === null || labelingsStore === null || zoneStore === null || !hierNode) {
      return;
    }

    industryId = hierNode.IndustryId;
    zoneId = hierNode.ZoneId;
    if (hierNode.Type !== 2 || !CommonFuns.isNumber(industryId)) {
      return;
    }
    if (industyMenuItems.length === 1 && industyMenuItems[0].primaryText == I18N.Setting.Benchmark.Label.None) {
      industyMenuItems = [];
    }
    this.addIndustyMenuItem(labelingsStore, industryId, zoneId, industyMenuItems);
    var industryNode = industryStore.find((item, index) => {
      return (item.get("Id") === industryId);
    });
    parentId = industryNode.get('ParentId');
    if (parentId !== 0) {
      this.addIndustyMenuItem(labelingsStore, parentId, zoneId, industyMenuItems);
    }
    this.addIndustyMenuItem(labelingsStore, 0, zoneId, industyMenuItems);
    this.removeRedundance(industyMenuItems);

    if (industyMenuItems.length === 0) {
      industyMenuItems = this.getNoneMenuItem(true);
    }
    return industyMenuItems;
  },
  setEmptyLabelMenu() {
    var selectedLabelItem = this.initSlectedLabelItem();
    this.setState({
      selectedLabelItem: selectedLabelItem,
      labelType: 'industryZone'
    });
  },
  getCalenderBgBtnEl: function() {
    let calendarSubItems = [{
      primaryText: I18N.EM.Tool.Calendar.NoneWorkTime,
      value: 'work'
    },
      {
        primaryText: I18N.EM.Tool.Calendar.HotColdSeason,
        value: 'hc'
      }];
    let calendarEl;
    let isCalendarDisabled = this.state.chartStrategy.isCalendarDisabledFn(this);
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
    return calendarEl;
  },
  getNoneMenuItem: function(isIndustryLabel) {
    var menuItems = [];
    if (isIndustryLabel) {
      menuItems.push({
        value: 'none',
        industryId: -1,
        zoneId: -1,
        primaryText: I18N.Setting.Benchmark.Label.None
      });
    } else {
      menuItems.push({
        value: 'none',
        customerizedId: -1,
        primaryText: I18N.Setting.Benchmark.Label.None
      });
    }
    return menuItems;
  },
  addIndustyMenuItem(labelingsStore, industryId, zoneId, industyMenuItems) {
    let labelItem = null;
    labelItem = labelingsStore.find((item, index) => {
      return (item.get('IndustryId') === industryId && item.get('ZoneId') === zoneId);
    });
    if (labelItem) {
      this.pushIndustryMenuItem(industryId, zoneId, labelItem, industyMenuItems);
    }
    labelItem = labelingsStore.find((item, index) => {
      return (item.get('IndustryId') === industryId && item.get('ZoneId') === 0);
    });
    if (labelItem) {
      this.pushIndustryMenuItem(industryId, 0, labelItem, industyMenuItems);
    }
  },
  pushIndustryMenuItem(industryId, zoneId, labelItem, industyMenuItems) {
    var labelMenuItem = {};
    var industryText = '';
    if (this.context.router.params.lang === 'zh-cn') {
      industryText = labelItem.get('ZoneComment') + labelItem.get('IndustryComment');
    } else {
      industryText = labelItem.get('ZoneComment') + ' ' + labelItem.get('IndustryComment');
    }
    labelMenuItem.industryId = industryId;
    labelMenuItem.zoneId = zoneId;
    labelMenuItem.primaryText = industryText;
    labelMenuItem.value = "" + zoneId + "/" + industryId;
    industyMenuItems.push(labelMenuItem);
  },
  setBenchmarkOption: function() {
    var labelType = this.state.labelType;
    var selectedLabelItem = this.state.selectedLabelItem;
    var benchmarkOption;
    if (labelType === 'industryZone') {
      if (selectedLabelItem.industryId === -1) {
        benchmarkOption = null;
      } else {
        benchmarkOption = {
          IndustryId: selectedLabelItem.industryId,
          ZoneId: selectedLabelItem.zoneId,
          benchmarkText: selectedLabelItem.text
        };
      }
    } else if (labelType === 'customized') {
      if (selectedLabelItem.customerizedId == -1) {
        benchmarkOption = null;
      } else {
        benchmarkOption = {
          CustomerizedId: selectedLabelItem.customerizedId
        };
      }
    } else {
      benchmarkOption = null;
    }
    this.setState({
      benchmarkOption: benchmarkOption
    });
  },
  getViewOption: function() {
    var step = 3; //default month

    var year = parseInt(this.refs.yearSelector.state.selectedYear),
      month = this.state.month;

    if (month === 0) {
      month = 1;
      step = 4; //year
    }
    var start = new Date(year, month - 1, 1, 0, 0, 0, 0);
    var end = new Date(year, month - 1, 2, 0, 0, 0, 0);
    var timeRanges = CommonFuns.getTimeRangesByDate(start, end);
    //return
    var viewOption = {
      IncludeNavigatorData: false,
      Step: step,
      TimeRanges: timeRanges
    };
    return viewOption;
  },
  getBenchmarkOption: function() {
    return this.state.benchmarkOption;
  },
  getKpiType: function() {
    return this.state.kpiTypeValue;
  },
  onChangeKpiType: function(e, selectedIndex, value) {
    this.setState({
      kpiTypeValue: value,
      //kpiTypeIndex: menuItem.index
    });
  },
  _onConfigBtnItemTouchTap(e,menuParam, value) {
    this.state.chartStrategy.handleConfigBtnItemTouchTapFn(this, e, value);
  },
  handleBaselineCfg: function(e) {
    let tagOption,
      tagObj,
      tagOptions = this.state.chartStrategy.getSelectedNodesFn(); //this.getSelectedTagOptions();

    if (tagOptions && tagOptions.length === 1) {
      tagOption = tagOptions[0];
      let uomId = tagOption.uomId;
      if (uomId === undefined) {
        let energyRawData = EnergyStore.getEnergyRawData();
        if (energyRawData && energyRawData.TargetEnergyData.length > 0) {
          uomId = energyRawData.TargetEnergyData[0].Target.UomId;
        } else {
          return;
        }
      }
      let uom = CommonFuns.getUomById(uomId);
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
  _initYaxisDialog() {
    var chartCmp = this.refs.ChartComponent,
      chartObj = chartCmp.refs.highstock.getPaper();

    return chartObj;
  },
  getChartTooltiphasTotal(data) {
    let hasTotal = true;
    if (data.TargetEnergyData && data.TargetEnergyData.length > 1) {
      var targetEnergyData = data.TargetEnergyData,
        targetP,
        targetN;

      for (var i = 0, len = targetEnergyData.length; i < len - 1; i++) {
        targetP = targetEnergyData[i].Target;
        targetN = targetEnergyData[i + 1].Target;

        if (targetP.CommodityId != targetN.CommodityId || targetP.Uom != targetN.Uom || targetN.Type == 13 || targetN.Type == 12 || targetN.Type == 14) {
          hasTotal = false;
          break;
        }
      }
    }
    return hasTotal;
  },
  _onDeleteButtonClick(obj) {
    this.state.chartStrategy.onDeleteButtonClickFn(this, obj);
  },
  showRemark() {
    this.setState({
      remarkDisplay: !this.state.remarkDisplay
    });
  }
});

module.exports = AnalysisPanel;
