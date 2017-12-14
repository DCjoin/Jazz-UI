import React, { Component } from 'react';
import FlatButton from 'controls/FlatButton.jsx';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import ButtonMenu from 'controls/CustomButtonMenu.jsx';
import DataAnalysisStore from 'stores/DataAnalysis/DataAnalysisStore.jsx';
import CalendarManager from '../../energy/CalendarManager.jsx';
import ExtendableMenuItem from 'controls/ExtendableMenuItem.jsx';
import TagStore from 'stores/TagStore.jsx';
import AddIntervalWindow from './HistoryWindow.jsx';
import YaxisSelector from './YaxisSelector.jsx';
import StatisticsDialog from './StatisticsDialog.jsx';
import WeatherButton from'./weather_button.jsx';
import IntervalDialog from './IntervalDialog.jsx';
import AxisSelector from './AxisSelector.jsx';

import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';

function privilegeWithSeniorDataAnalyse( privilegeCheck ) {
  // return true
return privilegeCheck(PermissionCode.SENIOR_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege());
}
//能源经理
function SeniorDataAnalyseIsFull() {
	return privilegeWithSeniorDataAnalyse(privilegeUtil.isFull.bind(privilegeUtil));
}

function isFullBasicAnalysis() {
  return privilegeUtil.isFull(PermissionCode.BASIC_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege());
}

export default class AuxiliaryFunction extends Component {

  constructor(props) {
     super(props);
    this._onConfigBtnItemTouchTap = this._onConfigBtnItemTouchTap.bind(this);
  }

  state={
    showAddIntervalDialog:false,
    showYaxisDialog:false,
    showSumDialog:false,
    showIntervalDialog:false,
    showAxisDialog:false,
  }

  _onConfigBtnItemTouchTap(e,menuParam, value){
    let itemValue = value;
      var subMenuValue;
      switch (itemValue) {
    case 'sum':
      this.setState({
        showSumDialog: true
      });
      break;
    case 'interval':
      this.setState({
        showIntervalDialog: true
      });
      break;
    case 'work':
        this.props.handleCalendarChange('work');
        this.refs.button_menu.handleRequestClose();
      break;
    case 'hc':
        this.props.handleCalendarChange('hc');
        this.refs.button_menu.handleRequestClose();
      break;
    case 'tou':
        this.props.handleTouChange();
        this.refs.button_menu.handleRequestClose();
      break;
    case 'yaxis':
        this.setState({
          showYaxisDialog: true
        });
        break;
    case 'axis':
        this.setState({
          showAxisDialog: true
        });
        break;


  }
  }

  getConfigBtnStatus(){
    var chartType=this.props.selectedChartType;
    if(!this.props.hasTagData){
      return false
    }
    if (chartType === "line" || chartType === "column" || chartType === "stack"){
      return true
    }
    else {
      return false
    }
  }

  getMoreBtnDisableStatus(){
    var chartType=this.props.selectedChartType;
    if(!this.props.hasTagData){
      return true
    }
    if (chartType === "rawdata" || chartType==='heatmap'){
      return true
    }
    else {
      return false
    }
  }

  getAnalysisEl() {
  let calendarSubItems = [{
    primaryText: I18N.EM.Tool.Calendar.NoneWorkTime,
    value: 'work'
  },
    {
      primaryText: I18N.EM.Tool.Calendar.HotColdSeason,
      value: 'hc'
    }];
  let calendarEl;
  let isCalendarDisabled = !this.getConfigBtnStatus() || DataAnalysisStore.getCalendarDisabled();
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
    calendarEl = <ExtendableMenuItem onTouchTap={(e) => {
      this._onConfigBtnItemTouchTap(e, null, 'background')
    }} primaryText={I18N.EM.Tool.Calendar.BackgroundColor} value='background' subItems={calendarSubItems}/>;
  }
  return calendarEl;
 }

  getWeatherBtn(){

    if(!SeniorDataAnalyseIsFull()) return null;
    var chartType=this.props.selectedChartType;

    var disabled=chartType === "pie" || chartType === "rawdata" || chartType === "heatmap" || this.props.analysisPanel.state.step===0;

    return <WeatherButton taglist={this.props.weatherTag} disabled={disabled} step={this.props.analysisPanel.state.step}/>
  } 

  getAuxiliaryCompareBtn(){
    var disabled=!this.getConfigBtnStatus();
    var chartType=this.props.selectedChartType;
    let isCalendarDisabled = !this.getConfigBtnStatus() || DataAnalysisStore.getCalendarDisabled();
    let showType = CalendarManager.getShowType();
    let checkIcon=<FontIcon className="icon-check-mark" style={{top:'0'}}/>
    return(
      <div className="jazz-AuxiliaryCompareBtn-container" style={{marginTop:0}}>
        <ButtonMenu ref={'button_menu'} label={I18N.EM.Tool.MoreAnalysis}  style={{
          marginLeft: '10px'
        }} backgroundColor="#f3f5f7" onItemTouchTap={this._onConfigBtnItemTouchTap} disabled={this.getMoreBtnDisableStatus()}>
       <MenuItem primaryText={I18N.EM.Tool.DataStatistics} value='sum' disabled={disabled && chartType!=='pie'}/>
       {SeniorDataAnalyseIsFull() && <MenuItem primaryText={I18N.EM.Tool.IntervalStatistics} value='interval' disabled={disabled && chartType!=='pie'}/>}
      {chartType!=='scatterplot' && chartType!=='bubble' && chartType!=='pie' && <MenuItem primaryText={I18N.EM.Tool.YaxisConfig} value='yaxis' disabled={disabled || !isFullBasicAnalysis()}/>}
      {(chartType==='scatterplot' || chartType==='bubble') && <MenuItem primaryText={I18N.EM.Tool.AxisConfig} value='axis' disabled={!this.props.hasTagData || !isFullBasicAnalysis()}/>}
      <Divider />
      <MenuItem primaryText={I18N.EM.Tool.Calendar.NoneWorkTime} value='work' disabled={isCalendarDisabled} rightIcon={showType==='work' && checkIcon}/>
      <MenuItem primaryText={I18N.EM.Tool.Calendar.HotColdSeason} value='hc' disabled={isCalendarDisabled} rightIcon={showType==='hc' && checkIcon}/>
      <MenuItem primaryText={I18N.EM.Tool.TouTariff} value='tou' rightIcon={this.props.touType && checkIcon}/>
     </ButtonMenu>
      </div>
    )
  }

  getHistoryBtnStatus(){
    var chartType=this.props.selectedChartType;
    if(!this.props.hasTagData){
      return true
    }
    if (chartType === "rawdata" || chartType === "heatmap"){
      return true
    }
    if(chartType === "scatterplot" || chartType === "bubble"){
      return false
    }
    return TagStore.getBaselineBtnDisabled()
  }

  _renderYaxisConfigDialog(){
    return (<YaxisSelector
      showDialog={this.state.showYaxisDialog}
      initYaxisDialog={this.props.initYaxisDialog}
      onYaxisSelectorDialogSubmit={this.props.onYaxisSelectorDialogSubmit}
      yaxisConfig={this.props.yaxisConfig}
      onYaxisDialogDismiss={()=>{
        this.setState({
          showYaxisDialog:false
        })
      }}/>)
  }

    _renderAxisDialog(){
    return (<AxisSelector
      showDialog={this.state.showAxisDialog}
      initYaxisDialog={this.props.initYaxisDialog}
      onYaxisSelectorDialogSubmit={this.props.onYaxisSelectorDialogSubmit}
      yaxisConfig={this.props.yaxisConfig}
      onYaxisDialogDismiss={()=>{
        this.setState({
          showAxisDialog:false
        })
      }}/>)
  }

  _renderHistoryCompareDialog(){
    var props={
      openImmediately:true,
      analysisPanel:this.props.analysisPanel,
      onCancel:()=>{
        this.setState({
          showAddIntervalDialog:false
        })
      }
    }
      return <AddIntervalWindow {...props}/>
  }

  _renderStatisticsDialog(){
    var props={
      timeRanges:this.props.timeRanges,
      analysisPanel:this.props.analysisPanel,
      step:this.props.analysisPanel.state.step,
      onCloseDialog:()=>{
        this.setState({
          showSumDialog:false
        })
      }
    }
      return <StatisticsDialog {...props}/>
  }

  _renderIntervalDialog(){
    var props={
      timeRanges:this.props.timeRanges,
      widgetId:this.props.analysisPanel.props.widgetDto.Id,
      step:this.props.analysisPanel.state.step,
      onCloseDialog:()=>{
        this.setState({
          showIntervalDialog:false
        })
      }
    }
    return(<IntervalDialog {...props}/>)
  }
  
  render(){
    var styles={
      label:this.getHistoryBtnStatus()?{
        color:'rgba(118, 122, 122, 0.298039)',
        fontSize:'14px'
      }:{
        fontSize:'14px',
        color:'#767A7A'
      }
    };
    return(
      <div>
        <div style={{display:'flex'}}>
          {this.getWeatherBtn()}
          <FlatButton disabled={this.getHistoryBtnStatus()} label={I18N.EM.Tool.HistoryCompare} labelStyle={styles.label}
            style={{lineHeight:'0'}}
            icon={<FontIcon className="icon-historical-comparison" style={styles.label}/>}
            onClick={()=>{this.setState({showAddIntervalDialog:true})}}/>
          {this.getAuxiliaryCompareBtn()}
        </div>
        {this.state.showAddIntervalDialog && this._renderHistoryCompareDialog()}
        {this.state.showYaxisDialog && this._renderYaxisConfigDialog()}
        {this.state.showSumDialog && this._renderStatisticsDialog()}
        {this.state.showIntervalDialog && this._renderIntervalDialog()}
        {this.state.showAxisDialog && this._renderAxisDialog()}
        </div>
    )
  }
}

AuxiliaryFunction.propTypes = {
  selectedChartType:React.PropTypes.string,
  hasTagData:React.PropTypes.bool,
  handleCalendarChange:React.PropTypes.func,
  initYaxisDialog:React.PropTypes.func,
  onYaxisSelectorDialogSubmit:React.PropTypes.func,
  timeRanges:React.PropTypes.object,
  weatherTag:React.PropTypes.array || null,
};
