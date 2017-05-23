import React, { Component } from 'react';
import FlatButton from 'controls/FlatButton.jsx';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import ButtonMenu from 'controls/CustomButtonMenu.jsx';
import DataAnalysisStore from 'stores/DataAnalysis/DataAnalysisStore.jsx';
import CalendarManager from '../../energy/CalendarManager.jsx';
import ExtendableMenuItem from 'controls/ExtendableMenuItem.jsx';
import TagStore from 'stores/TagStore.jsx';
import AddIntervalWindow from './HistoryWindow.jsx';
import YaxisSelector from './YaxisSelector.jsx';
import StatisticsDialog from './StatisticsDialog.jsx';

export default class AuxiliaryFunction extends Component {

  constructor(props) {
     super(props);
    this._onConfigBtnItemTouchTap = this._onConfigBtnItemTouchTap.bind(this);
  }

  state={
    showAddIntervalDialog:false,
    showYaxisDialog:false,
    showSumDialog:false
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
        this.refs.button_menu.handleRequestClose();
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

  getMoreBtnDisableStatus(){
    var chartType=this.props.selectedChartType;
    if(!this.props.hasTagData){
      return true
    }
    if (chartType === "pie" || chartType === "rawdata"){
      return true
    }
    else {
      return false
    }
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
    calendarEl = <ExtendableMenuItem onTouchTap={(e) => {
      this._onConfigBtnItemTouchTap(e, null, 'background')
    }} primaryText={I18N.EM.Tool.Calendar.BackgroundColor} value='background' subItems={calendarSubItems}/>;
  }
  return calendarEl;
 }

  getAuxiliaryCompareBtn(){
    var disabled=!this.getConfigBtnStatus();
    let calendarEl = this.getCalenderBgBtnEl();
    return(
      <div className="jazz-AuxiliaryCompareBtn-container">
        <ButtonMenu ref={'button_menu'} label={I18N.EM.Tool.MoreAnalysis}  style={{
          marginLeft: '10px'
        }} backgroundColor="#f7f7f7" onItemTouchTap={this._onConfigBtnItemTouchTap} disabled={this.getMoreBtnDisableStatus()}>
       <MenuItem primaryText={I18N.EM.Tool.DataStatistics} value='sum' disabled={disabled}/>
         {calendarEl}
      <MenuItem primaryText={I18N.EM.Tool.YaxisConfig} value='yaxis' disabled={disabled}/>
     </ButtonMenu>
      </div>
    )
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
      label:this.getHistoryBtnStatus()?{
        color:'rgba(118, 122, 122, 0.298039)',
        fontSize:'14px'
      }:{
        fontSize:'14px',
        color:'#626469'
      }
    };
    return(
      <div>
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

AuxiliaryFunction.propTypes = {
  selectedChartType:React.PropTypes.string,
  hasTagData:React.PropTypes.bool,
  handleCalendarChange:React.PropTypes.func,
  initYaxisDialog:React.PropTypes.func,
  onYaxisSelectorDialogSubmit:React.PropTypes.func,
  timeRanges:React.PropTypes.object,
};
