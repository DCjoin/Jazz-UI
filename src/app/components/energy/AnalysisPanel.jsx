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
import CostStore from '../../stores/CostStore.jsx';
import RankStore from '../../stores/RankStore.jsx';
import RatioStore from '../../stores/RatioStore.jsx';
import CarbonStore from '../../stores/CarbonStore.jsx';
import LabelMenuStore from '../../stores/LabelMenuStore.jsx';
import TBSettingAction from '../../actions/TBSettingAction.jsx';
import EnergyStore from '../../stores/energy/EnergyStore.jsx';
import CommodityStore from '../../stores/CommodityStore.jsx';
import ErrorStepDialog from '../alarm/ErrorStepDialog.jsx';
import GlobalErrorMessageAction from '../../actions/GlobalErrorMessageAction.jsx';
import MultipleTimespanStore from '../../stores/energy/MultipleTimespanStore.jsx';
import {dateAdd, dateFormat, DataConverter, isArray, isNumber, formatDateByStep, getDecimalDigits, toFixed, JazzCommon} from '../../util/Util.jsx';

let MenuItem = require('material-ui/lib/menus/menu-item');

let AnalysisPanel = React.createClass({
    mixins:[ChartMixins],
    propTypes:{
      chartTitle:  React.PropTypes.string,
      bizType: React.PropTypes.oneOf(['Energy', 'Unit','Ratio','Label','Rank']),
      onOperationSelect:React.PropTypes.func,
    },
    getDefaultProps(){
      return {
        //bizType:'Energy',
        bizType:'Unit',
        energyType:'Energy',
        chartTitle:'最近7天能耗'
      };
    },
    componentWillReceiveProps(nextProps){
      if(nextProps.energyType)
        this.setState({energyType: nextProps.energyType});
    },
    getInitialState(){
      this.searchDate = MultipleTimespanStore.getRelativeItems();
      let strategyName = this.getStrategyName(this.props.bizType, this.props.energyType);
      let chartStrategy = ChartStrategyFactor.getStrategyByStoreType(strategyName);
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
        chartStrategy: chartStrategy,
        energyType: this.props.energyType || 'Energy',//'one of energy, cost carbon'
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
      let trigger = false;
      if(this.state.isLoading){
        energyPart = <div style={{margin:'auto',width:'100px'}}>
          <CircularProgress  mode="indeterminate" size={2} />
        </div>;
      }else if(!!this.state.energyData || trigger){
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
    getStrategyName(bizType, energyType){
      let strategyName = null;
      switch (bizType) {
        case 'Energy':
          if(!energyType || energyType === 'Energy'){
            strategyName = 'Energy';
          }else if(energyType === 'Cost'){
            strategyName = 'Cost';
          }else if(energyType === 'Carbon'){
            strategyName = 'Carbon';
          }
          break;
        case 'Unit':
          if(!energyType || energyType === 'Energy'){
            strategyName = 'UnitEnergyUsage';
          }else if(energyType === 'Cost'){
            strategyName = 'UnitCost';
          }else if(energyType === 'Carbon'){
            strategyName = 'UnitCarbon';
          }
          break;
        case 'Ratio':
          strategyName = 'RatioUsage';
          break;
        case 'Label':
          strategyName = 'Label';
          break;
        case 'Rank':
          strategyName = 'Rank';
          break;
      }
      return strategyName;
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
      return <DropDownMenu menuItems={types} onChange={this._onEnergyTypeChange}></DropDownMenu>;
    },
    _onEnergyTypeChange(e, selectedIndex, menuItem){
      let menuItemVal = menuItem.value;
      let capMenuItemVal = menuItemVal[0].toUpperCase() + menuItemVal.substring(1);
      let chartSttg = ChartStrategyFactor.getStrategyByStoreType(capMenuItemVal);
      this.setState({chartStrategy: chartSttg});
      chartSttg.onEnergyTypeChangeFn(e, selectedIndex, menuItem);
    },
    _onStepChange(step){
      this.state.chartStrategy.handleStepChangeFn(this, step);
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
    _onCostLoadingStatusChange(){
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
    _onCarbonLoadingStatusChange(){
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
    _onRatioLoadingStatusChange(){
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
    _onCostDataChange(isError, errorObj){
      let isLoading = CostStore.getLoadingStatus(),
          energyData = CostStore.getEnergyData(),
          energyRawData = CostStore.getEnergyRawData(),
          paramsObj = assign({},CostStore.getParamsObj()),
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
    _onCarbonDataChange(isError, errorObj){
      let isLoading = CarbonStore.getLoadingStatus(),
          carbonData = CarbonStore.getCarbonData(),
          carbonRawData = CarbonStore.getCarbonRawData(),
          paramsObj = assign({},EnergyStore.getParamsObj()),
          state = { isLoading: isLoading,
                    energyData: carbonData,
                    energyRawData: carbonRawData,
                    paramsObj: paramsObj,
                    dashboardOpenImmediately: false};
      if(isError === true){
        state.step = null;
        state.errorObj = errorObj;
      }
      this.setState(state);
    },
    _onRatioDataChange(isError, errorObj){
      let isLoading = RatioStore.getLoadingStatus(),
          energyData = RatioStore.getEnergyData(),
          energyRawData = RatioStore.getEnergyRawData(),
          paramsObj = assign({}, EnergyStore.getParamsObj()),
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
          obj = this.searchDate[relativeDateIndex];
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
      var range = menuItem.value;
      this.setState({range: range});
    },
    _onOrderChange(e, selectedIndex, menuItem){
      var order = menuItem.value;
      this.setState({order: order});
    },
    _onCarbonTypeChange(e, selectedIndex, menuItem){
      var me = this;
      me.setState({destination: menuItem.value}, ()=>{
        me.state.chartStrategy.onSearchDataButtonClickFn(me);
      });
    },
    _onChangeMonth(e, selectedIndex, menuItem){
      this.setState({month: selectedIndex});
    },
    _onGetEnergyDataError(){
      let errorObj = this.errorProcess();
      this._onEnergyDataChange(true, errorObj);
    },
    _onGetCostDataError(){
      let errorObj = this.errorProcess();
      this._onCostDataChange(true, errorObj);
    },
    _onGetCarbonDataError(){
      let errorObj = this.errorProcess();
      this._onCarbonDataChange(true, errorObj);
    },
    _onGetRatioDataError(){
      let errorObj = this.errorProcess();
      this._onRatioDataChange(true, errorObj);
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
    _onCostBaselineBtnDisabled:function(){
      this.setState({
          baselineBtnStatus:CommodityStore.getUCButtonStatus()
      });
    },
    _onTouBtnDisabled:function(){
      var touBtnStatus = this.state.touBtnStatus;
      var newStatus = CommodityStore.getECButtonStatus();
      if(newStatus !== touBtnStatus){
        this.setState({
          touBtnStatus: newStatus
        });
        if(newStatus && this.state.touBtnSelected){
          this.setState({
            touBtnSelected: false
          });
        }
      }
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
      if(this.state.kpiTypeValue === 7){
        this.setState({kpiTypeValue: 1});
      }
      this.enableKpiTypeButton();
    },
    changeToCustomizedLabel(kpiType){
      this.setState({kpiTypeValue: kpiType});
      this.disableKpiTypeButton();
    },
    getKpiText(){
      var kpiTypeItem = [
       {value:1,text:'单位人口',name:'UnitPopulation'},
       {value:2,text:'单位面积',name:'UnitArea'},
       {value:3,text:'单位供冷面积',name:'UnitColdArea'},
       {value:4,text:'单位采暖面积',name:'UnitWarmArea'},
       {value:8,text:'单位客房',name:'UnitRoom'},
       {value:9,text:'单位已用客房',name:'UnitUsedRoom'},
       {value:10,text:'单位床位',name:'UnitBed'},
       {value:11,text:'单位已用床位',name:'UnitUsedBed'},
       {value:5,text:'昼夜比',name:'DayNightRatio'},
       {value:6,text:'公休比',name:'WorkHolidayRatio'}];
      var kpiTypeText = "";
      var kpiType = this.state.kpiTypeValue;
      if(kpiType === 7){
        kpiTypeText = "指标原值";
      }
      else{
        kpiTypeItem.forEach(item => {
          if(item.value === kpiType){
            kpiTypeText = item.text;
            return;
          }
        });
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
      var selectedLabelItem = this.initSlectedLabelItem();
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
      return this.state.kpiTypeValue;
    },
    onChangeKpiType: function(e, selectedIndex, menuItem){
      this.setState({kpiTypeValue: menuItem.value});
    },
    _onConfigBtnItemTouchTap(menuParam, menuItem){
     this.state.chartStrategy.handleConfigBtnItemTouchTapFn(this, menuParam, menuItem);
    },
    handleBaselineCfg: function(e){
     let tagOption, tagObj,
         tagOptions = this.state.chartStrategy.getSelectedNodesFn();//this.getSelectedTagOptions();

      if(tagOptions && tagOptions.length === 1){
        tagOption = tagOptions[0];
        let uom = CommonFuns.getUomById(tagOption.uomId);
        tagObj = {tagId: tagOption.tagId, hierarchyId: tagOption.hierId, uom:uom};
      }else{
        return ;
      }

      let dateSelector = this.refs.dateTimeSelector;
      let dateRange = dateSelector.getDateTime();

      this.refs.baselineCfg.showDialog(tagObj, dateRange);
      var year=(new Date()).getFullYear();
      TBSettingAction.setYear(year);
    },
    _initYaxisDialog(){
      var chartCmp = this.refs.ChartComponent,
          chartObj = chartCmp.refs.highstock.getPaper();

     return chartObj;
	 }
});

module.exports = AnalysisPanel;
