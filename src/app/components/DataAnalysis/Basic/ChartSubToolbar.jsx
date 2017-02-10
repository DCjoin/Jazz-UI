'use strict';
import React, { Component }  from "react";
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import StepSelector from '../../energy/StepSelector.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import ButtonMenu from 'controls/CustomButtonMenu.jsx';
import TagStore from 'stores/TagStore.jsx';
// import EnergyStore from 'stores/energy/EnergyStore.jsx';
import CalendarManager from '../../energy/CalendarManager.jsx';
import DataAnalysisStore from 'stores/DataAnalysis/DataAnalysisStore.jsx';
import ExtendableMenuItem from 'controls/ExtendableMenuItem.jsx';
import AddIntervalWindow from './HistoryWindow.jsx';
import YaxisSelector from './YaxisSelector.jsx';
import StatisticsDialog from './StatisticsDialog.jsx';

export default class ChartSubToolbar extends Component {

  constructor(props) {
     super(props);
    this._onChartTypeChanged = this._onChartTypeChanged.bind(this);
    this._onConfigBtnItemTouchTap = this._onConfigBtnItemTouchTap.bind(this);
  }

  state={
    showAddIntervalDialog:false,
    showYaxisDialog:false,
    showSumDialog:false
  }

  _onChartTypeChanged(e, selectedIndex, value){
    this.props.onSearchBtnItemTouchTap(value)
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
    case 'background':{
      subMenuValue = e.props.value;
      if (subMenuValue === 'work' || subMenuValue === 'hc') {
        this.props.handleCalendarChange(subMenuValue);
      }
      break;
      }
    case 'yaxis':
        this.setState({
          showYaxisDialog: true
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

  getHistoryBtnStatus(){
    var chartType=this.props.selectedChartType;
    if(!this.props.hasTagData){
      return true
    }
    if (chartType === "rawdata"){
      return true
    }
    return TagStore.getBaselineBtnDisabled()
  }


  getCalenderBgBtnEl() {
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
    calendarEl = <ExtendableMenuItem primaryText={I18N.EM.Tool.Calendar.BackgroundColor} value='background' subItems={calendarSubItems}/>;
  }
  return calendarEl;
 }

  getAuxiliaryCompareBtn(){
    var disabled=!this.getConfigBtnStatus();
    let calendarEl = this.getCalenderBgBtnEl();
    return(
      <div className="jazz-AuxiliaryCompareBtn-container">
        <ButtonMenu label={I18N.EM.Tool.MoreAnalysis}  style={{
          marginLeft: '10px'
        }} backgroundColor="#fbfbfb"
        onItemTouchTap={this._onConfigBtnItemTouchTap}>
       <MenuItem primaryText={I18N.EM.Tool.DataStatistics} value='sum' disabled={disabled}/>
         {calendarEl}
      <MenuItem primaryText={I18N.EM.Tool.YaxisConfig} value='yaxis' disabled={disabled}/>
     </ButtonMenu>
      </div>
    )
  }

  getChartTypeIconMenu(disabled) {
  let iconStyle = {
      fontSize: '16px'
    },
    style = {
      padding: '0px',
      height: '18px',
      width: '18px',
      fontSize: '18px'
    };
    var lineIcon=<FontIcon className="icon-line" iconStyle ={iconStyle} style = {style} />,
        columnIcon=<FontIcon className="icon-column" iconStyle ={iconStyle} style = {style}  />,
        stackIcon=<FontIcon className="icon-stack" iconStyle ={iconStyle} style = {style} />,
        pieIcon=<FontIcon className="icon-pie" iconStyle ={iconStyle} style = {style} />,
        rawdataIcon=<FontIcon className="icon-raw-data" iconStyle ={iconStyle} style = {style} />;

  let chartType = this.props.selectedChartType || 'line';
  return(
    <DropDownMenu disabled={!this.props.hasTagData}
      style={{width: '120px'}} labelStyle={{top:'10px',lineHeight:'32px',paddingRight:'0'}} value={chartType} onChange={this._onChartTypeChanged}>
    <MenuItem primaryText={I18N.EM.CharType.Line} value="line" leftIcon={lineIcon} />
    <MenuItem primaryText={I18N.EM.CharType.Bar} value="column" leftIcon={columnIcon} />
    <MenuItem primaryText={I18N.EM.CharType.Stack} value="stack" leftIcon={stackIcon} />
    <MenuItem primaryText={I18N.EM.CharType.Pie} value="pie" leftIcon={pieIcon} />
    <MenuItem primaryText={I18N.EM.CharType.RawData} value="rawdata" leftIcon={rawdataIcon} />
  </DropDownMenu>
  )
  }

  _renderYaxisConfigDialog(){
    return <YaxisSelector
      showDialog={this.state.showYaxisDialog}
      initYaxisDialog={this.props.initYaxisDialog}
      onYaxisSelectorDialogSubmit={this.props.onYaxisSelectorDialogSubmit}
      yaxisConfig={this.props.yaxisConfig}
      onYaxisDialogDismiss={()=>{
        this.setState({
          showYaxisDialog:false
        })
      }}/>
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
      onCloseDialog:()=>{
        this.setState({
          showSumDialog:false
        })
      }
    }
      return <StatisticsDialog {...props}/>
  }

  render(){
    var styles={
      label:{
        fontSize:'14px'
      }
    };
    return(
      <div style={{
          display: 'flex',
          minHeight: '48px',
          height: '48px',
          padding:'0 15px',
          'justifyContent': 'space-between'
        }}>
        <div style={{display:'flex'}}>
          {this.getChartTypeIconMenu()}
          <StepSelector disabled={!this.getConfigBtnStatus()} stepValue={this.props.step} onStepChange={this.props.onStepChange} timeRanges={this.props.timeRanges}/>
       </div>
        <div style={{display:'flex'}}>
          <FlatButton disabled={this.getHistoryBtnStatus()} label={I18N.EM.Tool.HistoryCompare} labelStyle={styles.label}
            icon={<FontIcon className="icon-marker" style={styles.label}/>}
            onClick={()=>{this.setState({showAddIntervalDialog:true})}}/>
          {this.getAuxiliaryCompareBtn()}
        </div>
        {this.state.showAddIntervalDialog && this._renderHistoryCompareDialog()}
        {this.state.showYaxisDialog && this._renderYaxisConfigDialog()}
        {this.state.showSumDialog && this._renderStatisticsDialog()}
        </div>
    )
  }
}

ChartSubToolbar.propTypes = {
  selectedChartType:React.PropTypes.string,
  onSearchBtnItemTouchTap:React.PropTypes.object,
  hasTagData:React.PropTypes.bool,
  timeRanges:React.PropTypes.object,
  step:React.PropTypes.number,
  onStepChange:React.PropTypes.object,
  initYaxisDialog:React.PropTypes.func,
  onYaxisSelectorDialogSubmit:React.PropTypes.func,
  handleCalendarChange:React.PropTypes.func,
};
