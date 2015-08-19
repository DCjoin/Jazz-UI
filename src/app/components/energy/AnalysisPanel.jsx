'use strict';
import React from "react";
import Immutable from 'immutable';
import assign from "object-assign";
import {FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress, IconMenu} from 'material-ui';
import CommonFuns from '../../util/Util.jsx';
import classNames from 'classnames';
import ChartStrategyFactor from './ChartStrategyFactor.jsx';
import ChartMixins from './ChartMixins.jsx';
import TagStore from '../../stores/TagStore.jsx';
import LabelStore from '../../stores/LabelStore.jsx';
import RankStore from '../../stores/RankStore.jsx';
import LabelMenuStore from '../../stores/LabelMenuStore.jsx';
import EnergyStore from '../../stores/energy/EnergyStore.jsx';
import ErrorStepDialog from '../alarm/ErrorStepDialog.jsx';
import GlobalErrorMessageAction from '../../actions/GlobalErrorMessageAction.jsx';
import {dateAdd, dateFormat, DataConverter, isArray, isNumber, formatDateByStep, getDecimalDigits, toFixed, JazzCommon} from '../../util/Util.jsx';

let MenuItem = require('material-ui/lib/menus/menu-item');
const defaultMap = {Energy:'Energy',Unit:'UnitEnergyUsage', Rank:'Rank', Label:'Label'};

const searchDate = [{value:'Customerize',text:'自定义'},{value: 'Last7Day', text: '最近7天'}, {value: 'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
 {value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'}, {value: 'LastWeek', text: '上周'},
 {value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];
const kpiTypeItem = [{value:'UnitPopulation',text:'单位人口'},{value:'UnitArea',text:'单位面积'},
 {value:'UnitColdArea',text:'单位供冷面积'},{value:'UnitWarmArea',text:'单位采暖面积'},
 {value:'UnitRoom',text:'单位客房'},{value:'UnitUsedRoom',text:'单位已用客房'},
 {value:'UnitBed',text:'单位床位'},{value:'DayNightRatio',text:'昼夜比'},
 {value:'WorkHolidayRatio',text:'公休比'}];

let AnalysisPanel = React.createClass({
    mixins:[ChartMixins],
    propTypes:{
      chartTitle:  React.PropTypes.string,
      bizType: React.PropTypes.oneOf(['Energy', 'Unit','Ratio','Label','Rank']),
      onOperationSelect:React.PropTypes.func,
    },
    getDefaultProps(){
      return {
        bizType:'Label',
        chartTitle:'最近7天能效标识'
        //bizType:'Energy'
      };
    },
    componentWillReceiveProps(nextProps){
      if(nextProps.energyType)
        this.setState({energyType: nextProps.energyType});
    },
    getInitialState(){
      let chartStrategy = ChartStrategyFactor.getStrategyByStoreType(defaultMap[this.props.bizType]);
      let state = {
        isLoading: false,
        energyData: null,
        energyRawData: null,
        hierName: null,
        submitParams: null,
        step: null,
        dashboardOpenImmediately: false,
        baselineBtnStatus:TagStore.getBaselineBtnDisabled(),
        selectedChartType:'line',
        chartStrategy: chartStrategy
      };

      var obj = chartStrategy.getInitialStateFn(this);

      assign(state, obj);
      return state;
    },
    _onTitleMenuSelect:function(e,item){
      let menuIndex=parseInt(item.key);
      this.props.onOperationSelect(menuIndex);
    },
    render(){
      let me = this, errorDialog = null, energyPart = null;

      if(me.state.errorObj){
        errorDialog = <ErrorStepDialog {...me.state.errorObj} onErrorDialogAction={me._onErrorDialogAction}></ErrorStepDialog>;
      }

      var collapseButton = <div className="fold-tree-btn" style={{"color":"#939796"}}>
                              <FontIcon hoverColor="#6b6b6b" color="#939796" className={classNames("icon", "icon-column-fold")} />
                           </div>;

      if(this.state.isLoading){
        energyPart = <div style={{margin:'auto',width:'100px'}}>
          <CircularProgress  mode="indeterminate" size={2} />
        </div>;
      }else if(!!this.state.energyData){
        energyPart = this.state.chartStrategy.getChartComponentFn(me);
      }

      var IconButtonElement=<IconButton iconClassName="icon-arrow-down"/>;
      var iconMenuProps={
                          iconButtonElement:IconButtonElement,
                          openDirection:"bottom-right",
                          desktop: true
                        };
      let widgetOptMenu = <IconMenu {...iconMenuProps} onItemTouchTap={this._onTitleMenuSelect}>
                            <MenuItem key={1} primaryText={'另存为'} />
                            <MenuItem key={2} primaryText={'发送'} />
                            <MenuItem key={3} primaryText={'共享'} />
                            <MenuItem key={4} primaryText={'导出'} />
                            <MenuItem key={5} primaryText={'删除'} />
                         </IconMenu>;

      return <div className={'jazz-energy-panel'}>
        <div className='header'>
          {collapseButton}
          <div className={'description'}>来自UXteam</div>
          <div className={'jazz-alarm-chart-toolbar-container'}>
              <div className={'title'}>
                <div className={'content'}>
                  {me.props.chartTitle}
                </div>
                <IconButton iconClassName="icon-send" style={{'marginLeft':'2px'}} onClick={this._onChart2WidgetClick}
                  disabled={!this.state.energyData}/>
                {widgetOptMenu}
              </div>
              {me.state.chartStrategy.searchBarGenFn(me)}
          </div>
        </div>
        {energyPart}
        {errorDialog}
      </div>;
    },
    componentDidMount: function() {
      let me = this;
      this.state.chartStrategy.getInitParamFn(me);
      this.state.chartStrategy.getAllDataFn();
      this.state.chartStrategy.bindStoreListenersFn(me);
    },
    componentWillUnmount: function() {
      let me = this;
      this.state.chartStrategy.unbindStoreListenersFn(me);
    },
    _onChart2WidgetClick(){

    },
    _onErrorDialogAction(step){
      this.setState({errorObj:null});
      if(step !== 'cancel'){
        this._onStepChange(step);
      }
    },
    getEnergyTypeCombo(){
      let types = [{text:'能耗',value:'energy'},{text:'成本',value:'cost'},{text:'碳排放',value:'carbon'}];
      return <DropDownMenu menuItems={types} onChange={this.state.chartStrategy.onEnegyTypeChangeFn}></DropDownMenu>;
    },
    _onStepChange(step){
      let tagOptions = EnergyStore.getTagOpions(),
          paramsObj = EnergyStore.getParamsObj(),
          timeRanges = paramsObj.timeRanges;

      this.setState({step:step});
      this.state.chartStrategy.getEnergyDataFn(timeRanges, step, tagOptions, false);
    },
    _onDateSelectorChanged(){
      this.refs.relativeDate.setState({selectedIndex:0});
    },
    _onLoadingStatusChange(){
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
    _onRankLoadingStatusChange(){
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
    _onLabelLoadingStatusChange(){
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
    _onEnergyDataChange(isError, errorObj){
      let isLoading = EnergyStore.getLoadingStatus(),
          energyData = EnergyStore.getEnergyData(),
          energyRawData = EnergyStore.getEnergyRawData(),
          paramsObj = assign({},EnergyStore.getParamsObj()),
          state = { isLoading: isLoading,
                    energyData: energyData,
                    energyRawData: energyRawData,
                    paramsObj: paramsObj,
                    dashboardOpenImmediately: false};
      if(isError === true){
        state.step = null;
        state.errorObj = errorObj;
      }
      this.setState(state);
    },
    _onRankDataChange(isError, errorObj){
      let isLoading = RankStore.getLoadingStatus(),
          energyData = RankStore.getEnergyData(),
          energyRawData = RankStore.getEnergyRawData(),
          paramsObj = assign({},RankStore.getParamsObj()),
          state = { isLoading: isLoading,
                    energyData: energyData,
                    energyRawData: energyRawData,
                    paramsObj: paramsObj,
                    dashboardOpenImmediately: false};
      if(isError === true){
        state.errorObj = errorObj;
      }
      this.setState(state);
    },
    _onLabelDataChange(isError, errorObj){
      let isLoading = LabelStore.getLoadingStatus(),
          energyData = LabelStore.getEnergyData(),
          energyRawData = LabelStore.getEnergyRawData(),
          paramsObj = assign({},LabelStore.getParamsObj()),
          state = { isLoading: isLoading,
                    energyData: energyData,
                    energyRawData: energyRawData,
                    paramsObj: paramsObj,
                    dashboardOpenImmediately: false};
      if(isError === true){
        state.errorObj = errorObj;
      }
      this.setState(state);
    },
    onSearchDataButtonClick(){
      this.state.chartStrategy.onSearchDataButtonClickFn(this);
    },
    exportChart(){
        this.state.chartStrategy.exportChartFn(this);
    },
    _getRelativeDateValue(){
      let relativeDateIndex = this.refs.relativeDate.state.selectedIndex,
          obj = searchDate[relativeDateIndex];
      return obj.value;
    },
    _setFitStepAndGetData(startDate, endDate, tagOptions, relativeDate){
      this.state.chartStrategy.setFitStepAndGetDataFn(startDate, endDate, tagOptions, relativeDate. this);
    },
    _onRelativeDateChange(e, selectedIndex, menuItem){
      let value = menuItem.value,
          dateSelector = this.refs.dateTimeSelector;

      if(value && value !=='Customerize'){
        var timeregion = CommonFuns.GetDateRegion(value.toLowerCase());
        dateSelector.setDateField(timeregion.start, timeregion.end);
      }
    },
    _onRangeChange(e, selectedIndex, menuItem){
      var range = parseInt(menuItem.value);
      this.setState({range: range});
    },
    _onOrderChange(e, selectedIndex, menuItem){
      var order = selectedIndex + 1;
      this.setState({order: order});
    },
    _onGetEnergyDataError(){
      let errorObj = this.errorProcess();
      this._onEnergyDataChange(true, errorObj);
    },
    _onGetRankDataError(){
      let errorObj = this.errorProcess();
      this._onRankDataChange(true, errorObj);
    },
    _onGetLabelDataError(){
      let errorObj = this.errorProcess();
      this._onLabelDataChange(true, errorObj);
    },
    errorProcess(){
      let code = EnergyStore.getErrorCode(),
          messages = EnergyStore.getErrorMessage();

      if (code.toString() == '02004') {
          let errorObj = this.showStepError(messages[0]);
          return errorObj;
      }else{
        let errorMsg = CommonFuns.getErrorMessage(code);
        setTimeout(()=>{
          GlobalErrorMessageAction.fireGlobalErrorMessage(errorMsg);
        },0);
        return null;
      }
    },
    showStepError(step){
      let btns = [], msg = [], map = { Hour: 1, Day: 2, Week: 5, Month: 3, Year: 4 },
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
        if( availableList.indexOf(code) != -1){
         newBtns.push({text: btn, code:code});
        }
      });
      btns = newBtns;
      var msg1 = [];
      msg.forEach(item =>{
        msg1.push('"' + I18N.EM[item] + '"');
      });
      return {stepBtnList: btns, errorMessage: I18N.format(I18N.EM.StepError, msg1.join(','))};
    },
    _onBaselineBtnDisabled:function(){
      this.setState({
          baselineBtnStatus:TagStore.getBaselineBtnDisabled()
      });
    },
    _onSearchBtnItemTouchTap(e, child){
      //this.setState({selectedChartType:child.props.value});
      this.state.chartStrategy.onSearchBtnItemTouchTapFn(this.state.selectedChartType, child.props.value, this);
    },
    _onChangeLabelType(subMenuItem, mainMenuItem){
      var curType = this.state.labelType,
          type = mainMenuItem.props.value,
          selectedLabelItem = this.state.selectedLabelItem;

      if(type === 'industryZone'){
        if(type === curType){
          if(selectedLabelItem.industryId == subMenuItem.props.industryId && selectedLabelItem.zoneId == subMenuItem.props.zoneId){
            return;
          }
        }
        else
        {
          this.setState({labelType: 'industryZone'});
        }
        selectedLabelItem.text = (subMenuItem.props.industryId === -1 ? "请选择能效标识" : this.getDisplayText(subMenuItem.props.primaryText));
        selectedLabelItem.industryId = subMenuItem.props.industryId;
        selectedLabelItem.zoneId = subMenuItem.props.zoneId;
        selectedLabelItem.value = subMenuItem.props.value;
        this.changeToIndustyrLabel();
      }
      else{
        if(type === curType) {
          if(selectedLabelItem.customerizedId === subMenuItem.props.customerizedId){
            return;
          }
        }
        else{
          this.setState({labelType: 'customized'});
        }

        selectedLabelItem.text = (subMenuItem.props.customerizedId === -1 ? "请选择能效标识" : this.getDisplayText(subMenuItem.props.primaryText));
        selectedLabelItem.customerizedId = subMenuItem.props.customerizedId;

        this.changeToCustomizedLabel(subMenuItem.props.kpiType);
      }
    },
    changeToIndustyrLabel(){
      this.enableKpiTypeButton();
    },
    changeToCustomizedLabel(kpiType){
      this.setState({kpiTypeValue: kpiType - 1});
      this.disableKpiTypeButton();
    },
    getKpiText(){
      var kpiTypeText = "";
      var kpiType = this.state.kpiTypeValue;
      if(kpiType === 6){
        kpiTypeText = "指标原值";
      }
      else{
        kpiTypeText = kpiTypeItem[kpiType].text;
      }
      return kpiTypeText;
    },
    _onHierNodeChange(){
      this.state.chartStrategy.onHierNodeChangeFn(this);
    },
    enableLabelButton(preSelect){
      if(!this.state.labelDisable && !preSelect){
        return;
      }
      var selectedLabelItem = {};
      var labelItems = this.state.industyMenuItems;
      if (labelItems.length > 0 && labelItems[0].industryId != -1) {
        var item = labelItems[0];
        selectedLabelItem.industryId = item.industryId;
        selectedLabelItem.zoneId = item.zoneId;
        selectedLabelItem.text = this.getDisplayText(item.primaryText);
        selectedLabelItem.value = item.value;
      }
      else{
        selectedLabelItem = this.initSlectedLabelItem();
      }
      this.setState({
        selectedLabelItem: selectedLabelItem,
        labelType: 'industryZone',
        labelDisable: false
      });
      this.enableKpiTypeButton();
    },
    getDisplayText(primaryText){
      var text;
      var textLen = JazzCommon.GetArialStrLen(primaryText);
      if (textLen > 7) {//114px width and the forn size is 16
          text = JazzCommon.GetArialStr(primaryText, 6);
      }
      else{
        text = primaryText;
      }
      return text;
    },
    disableLabelButton(){
      this.setState({
        labelDisable: true
      });
      this.setEmptyLabelMenu();
    },
    enableKpiTypeButton(){
      this.setState({kpiTypeDisable: false});
    },
    disableKpiTypeButton(){
      this.setState({kpiTypeDisable: true});
    },
    hasIndustyMenuItems: function () {
      return this.state.industyMenuItems.length > 0;
    },
    hasCustomizedMenuItems: function () {
      return this.state.customerMenuItems.length > 0;
    },
    initSlectedLabelItem(){
      var selectedLabelItem = {};
      selectedLabelItem.industryId = -1;
      selectedLabelItem.ZoneId = -1;
      selectedLabelItem.text = "请选择能效标识";
      selectedLabelItem.value = null;
      return selectedLabelItem;
    },
    getCustomizedMenuItems(){
      var menuItems = [];
      var customizedStore = LabelMenuStore.getCustomerLabelData();
      if(!this.hasCustomizedMenuItems()){
        customizedStore.forEach((item, index) => {
          menuItems.push({
            value: item.get('Id'),
            customerizedId: item.get('Id'),
            primaryText: item.get('Name'),
            kpiType: item.get('LabellingType')
          });
        });
      }
      if(menuItems.length === 0){
        menuItems = this.getNoneMenuItem(false);
      }
      return menuItems;
    },
    getIndustyMenuItems(){
      var industryStore = LabelMenuStore.getIndustryData();
      var labelingsStore = LabelMenuStore.getLabelData();
      var zoneStore = LabelMenuStore.getZoneData();
      var hierNode = LabelMenuStore.getHierNode();
      var industryId, zoneId, parentId, industyMenuItems = [];
      this.removeIndustyMenuItems();
      if(!hierNode){
        return;
      }
      else{
        industryId = hierNode.IndustryId;
        zoneId = hierNode.ZoneId;
        if(hierNode.Type !== 2 || !CommonFuns.isNumber(industryId)){
          return;
        }
        this.addIndustyMenuItem(labelingsStore, industryId, zoneId, industyMenuItems);
        var industryNode = industryStore.find((item, index)=>{
          return (item.get("Id") === industryId);
        });
        parentId = industryNode.get('ParentId');
        if(parentId !== 0) {
          this.addIndustyMenuItem(labelingsStore, parentId, zoneId, industyMenuItems);
        }
        this.addIndustyMenuItem(labelingsStore, 0, zoneId, industyMenuItems);
      }
      if(industyMenuItems.length === 0){
        industyMenuItems = this.getNoneMenuItem(true);
      }
      return industyMenuItems;
    },
    removeIndustyMenuItems(){
      this.setState({
        industyMenuItems: []
      });
      this.setEmptyLabelMenu();
    },
    setEmptyLabelMenu(){
      var selectedLabelItem = this.initSlectedLabelItem;
      this.setState({
        selectedLabelItem: selectedLabelItem,
        labelType: 'industryZone'
      });
    },
    getNoneMenuItem: function (isIndustryLabel) {
      var menuItems = [];
      if (isIndustryLabel) {
        menuItems.push({
          value: 'none',
          industryId: -1,
          zoneId: -1,
          primaryText: "无"
        });
      }
      else {
        menuItems.push({
          value: 'none',
          customerizedId: -1,
          primaryText: "无"
        });
      }
      return menuItems;
    },
    addIndustyMenuItem(labelingsStore, industryId, zoneId, industyMenuItems){
      let labelItem = null;
      labelItem = labelingsStore.find((item, index)=>{
        return (item.get('IndustryId') === industryId && item.get('ZoneId') === zoneId);
      });
      if(labelItem){
        this.pushIndustryMenuItem(industryId, zoneId, labelItem, industyMenuItems);
      }
      labelItem = labelingsStore.find((item, index)=>{
        return (item.get('IndustryId') === industryId && item.get('ZoneId') === 0);
      });
      if(labelItem){
        this.pushIndustryMenuItem(industryId, 0, labelItem, industyMenuItems);
      }
    },
    pushIndustryMenuItem(industryId, zoneId, labelItem, industyMenuItems){
      var labelMenuItem = {};
      labelMenuItem.industryId = industryId;
      labelMenuItem.zoneId = zoneId;
      labelMenuItem.primaryText = labelItem.get('ZoneComment') + labelItem.get('IndustryComment');
      labelMenuItem.value = "" + zoneId + "/" + industryId;
      industyMenuItems.push(labelMenuItem);
    },
    getBenchmarkOption: function () {
      var labelType = this.state.labelType;
      var selectedLabelItem = this.state.selectedLabelItem;
      if (labelType === 'industryZone'){
        if(selectedLabelItem.industryId === -1){
          return null;
        }
        else{
          return{
            IndustryId: selectedLabelItem.industryId,
            ZoneId: selectedLabelItem.zoneId,
            benchmarkText: selectedLabelItem.text
          };
        }
      }
      else if(labelType === 'customized'){
        if (selectedLabelItem.customerizedId == -1){
          return null;
        }
        else{
          return{
            CustomerizedId: selectedLabelItem.customerizedId
          };
        }
      }
      else {
        return null;
      }
    },
    getViewOption: function () {
      var step = 3;//default month

      var year = parseInt(this.refs.yearSelector.state.selectedYear),
          month = this.refs.monthSelector.state.selectedIndex;

      if(month === 0){
        month = 1;
        step = 4;//year
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
    getKpiType: function () {
      return this.state.kpiTypeValue + 1;
    },
    onChangeKpiType: function(){
      this.setState({kpiTypeValue: this.refs.kpiType.state.selectedIndex});
    },
    _onConfigBtnItemTouchTap(e,item){
      console.log('AnalysisPanel--- _onConfigBtnItemTouchTap');
    }
});

module.exports = AnalysisPanel;
