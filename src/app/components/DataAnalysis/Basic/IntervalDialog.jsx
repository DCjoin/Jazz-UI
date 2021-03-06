'use strict';
import React, { Component }  from "react";
import PropTypes from 'prop-types';
import assign from "object-assign";
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Dialog from 'controls/NewDialog.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import AlarmTagStore from 'stores/AlarmTagStore.jsx';
import CommonFuns from 'util/Util.jsx';
import DataAnalysisStore from 'stores/DataAnalysis/DataAnalysisStore.jsx';
import IntervalStatisticStore from 'stores/DataAnalysis/interval_statistic_store.jsx';
import MultipleTimespanStore from 'stores/Energy/MultipleTimespanStore.jsx';
import IntervalStatisticAction from 'actions/DataAnalysis/interval_statistic_action.jsx';
import EnergyStore from 'stores/Energy/EnergyStore.jsx';
import FromEndTime from 'controls/FromEndTime.jsx';
import { status } from 'constants/actionType/DataAnalysis.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import Immutable from 'immutable';
import classNames from 'classnames';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';


var isMultiTime;

var type=['',I18N.EM.KpiModeEM,I18N.Common.CaculationType.Avg,I18N.Common.CaculationType.Max];

var tou=[I18N.EM.Peak,I18N.EM.Plain,I18N.EM.Valley];

function privilegeWithSeniorDataAnalyse( privilegeCheck ) {
  // return false
return privilegeCheck(PermissionCode.SENIOR_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege());
}
//能源经理
function SeniorDataAnalyseIsFull() {
	return privilegeWithSeniorDataAnalyse(privilegeUtil.isFull.bind(privilegeUtil));
}

class ItemComponent extends Component{
  render(){
    return(
      <div style={this.props.style?this.props.style:{marginTop:'40px'}}>
        <div style={{fontSize:'14px',fontWeight:'600',color:'#626469',marginBottom:'7px',paddingLeft:'8px'}}>
          {this.props.title}
        </div>
        {this.props.children}
      </div>
    )
  }
}

ItemComponent.propTypes={
  title:PropTypes.string,
  style:PropTypes.object,
}

class TableHeader extends Component{

  render(){
    var defaultStyle={
      height:'29px',minHeight:'29px',lineHeight:'29px',border:'1px solid #e6e6e6',display:'flex',fontSize:'10px',color:'#626469',
      borderTopLeftRadius: '2px',borderTopRightRadius: '2px',backgroundColor:'#e6e6e6'
    };
    var style=assign({},defaultStyle,this.props.style);
    return(
      <div style={style}>
        <div style={{paddingLeft:'10px',width:'181px'}}>{this.props.column1Name}</div>
        <div style={{width:'220px'}}>{this.props.column2Name}</div>
        <div>
          {this.props.column3Name}
        </div>
      </div>
    )
  }
}

TableHeader.propTypes={
  column1Name:PropTypes.string,
  column2Name:PropTypes.string,
  column3Name:PropTypes.string,
  style:PropTypes.object,
}

class TableRow extends Component{
  render(){
    var defaultStyle={
      height:'36px',
      minHeight:'36px',
      fontSize:'12px',
      border:'1px solid #e6e6e6',
      borderTop:'none',
      display:'flex',
      alignItems:'center',
      color:'#626469'
    };
    var style=assign({},defaultStyle,this.props.style);
    return(
      <div style={style}>
        <div style={{paddingLeft:'10px',width:'181px'}}>{this.props.time}</div>
          <div style={{width:'220px'}}>{this.props.column2Value}</div>
          <div>
            {this.props.column3Value}
          </div>
      </div>
    )
  }
}

TableRow.propTypes={
  column2Value:PropTypes.string,
  column3Value:PropTypes.string,
  time:PropTypes.string,
  style:PropTypes.string,
}

function formatSplit(split){

  var {StartMoment,EndMoment}=split;
  var start_h = Math.floor(StartMoment / 60),
      start_m = StartMoment % 60;
  var end_h = Math.floor(EndMoment / 60),
      end_m = EndMoment % 60;

      return `${start_h}:${start_m===0?'00':start_m}-${end_h}:${end_m===0?'00':end_m}`
}

export default class IntervalDialog extends Component {

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this._onTimeChange = this._onTimeChange.bind(this);


  }

  state={
    gatherInfo:'loading',
    splits:IntervalStatisticStore.getSplits(),
    hasTab:true,
    tabNo:1,
  }

  _onChange(){
    if(this.state.hasTab && this.state.tabNo===1 && IntervalStatisticStore.getGatherInfo() && IntervalStatisticStore.getGatherInfo().size===0){
      this.setState({
      hasTab:false,
      tabNo:2
    },()=>{
     if(this.state.splits && this.state.splits.size>0){
        this._getGatherInfo()
    }else{
      this.setState({
        gatherInfo:null,
      },()=>{
         IntervalStatisticAction.clearAll();
        IntervalStatisticAction.modifySplit(-1, status.ADD,{StartMoment:-1,EndMoment:-1});
      })
    }
    })
    }else{
    this.setState({
      gatherInfo:IntervalStatisticStore.getGatherInfo(),
      splits:IntervalStatisticStore.getSplits()
    })
    }

  }

  getTitle(){
    // var isMultiTime=false;
    if(isMultiTime){
      var tagName=AlarmTagStore. getSearchTagList()[0].tagName;
      return I18N.EM.Tool.IntervalStatistics+' '+tagName
    }else {
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      var startDate=new Date(j2d(this.props.timeRanges[0].StartTime)),endDate=new Date(j2d(this.props.timeRanges[0].EndTime));
      return I18N.EM.Tool.IntervalStatistics+'   '+DataAnalysisStore.getDisplayDate(startDate,false)+' '+I18N.Setting.DataAnalysis.To+' '+DataAnalysisStore.getDisplayDate(endDate,true)
    }
  }

  _getGatherInfo(){
    let tagOptions = EnergyStore.getTagOpions();
    let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
    if(this.state.tabNo===1){
    IntervalStatisticAction.getTouTariffSplitGatherInfo({
      TagIds:tagIds,
      WidgetId:this.props.widgetId,
      TimeRanges:this.props.timeRanges,
      Splits:[]
    })
    }else{
    IntervalStatisticAction.getSplitGatherInfo({
      TagIds:tagIds,
      WidgetId:this.props.widgetId,
      TimeRanges:this.props.timeRanges,
      Splits:this.state.splits.toJS()
    })
    }

  }

  getTimeData(data) {
    var startTime = data[0];
    var endTime = data[1];
    return({
      StartMoment:startTime,
      EndMoment:endTime
    })

  }

   _onTimeChange(index, data) {
    var timeData = this.getTimeData(data);
    IntervalStatisticAction.modifySplit(index, status.MODIFY,timeData);
  }

  _onDeleteTimeData(index) {
    IntervalStatisticAction.modifySplit(index, status.DELETE,{});
  }

  _valid(){
    var valid=true;
      this.state.splits.forEach(split=>{
        if(split.get('StartMoment')===-1 || split.get('EndMoment')===-1){valid=false}
      })
      return valid
  }

  _renderTimes(){
    var me=this;
    return(
      <div style={{display:'flex',flexDirection:'row',alignItems:'center',flexWrap: 'wrap',width:'100%'}}>
        {this.state.splits.map((item,i)=>{
          let props = {
          index: i,
          key: this.state.splits.size - i,
          ref: 'fromEndTime' + (i + 1),
          style:i===this.state.splits.size-1?{}:{marginRight:'50px'},
          isViewStatus: false,
          hasDeleteButton: this.state.splits.size === 1 ? false : true,
          startTime: item.get('StartMoment'),
          endTime: item.get('EndMoment'),
          onTimeChange: me._onTimeChange,
          onDeleteTimeData: me._onDeleteTimeData,
          deleteButton:<FontIcon className="icon-close" style={{fontSize:'11px',marginLeft:'8px'}} color="#505559" hoverColor="#32ad3d"/>
        };
        return (
          <FromEndTime {...props}></FromEndTime>
          );
        })}
        <IconButton iconClassName="icon-add" style={{padding:0,width:'33px',height:'30px',borderRadius:'1px',border:'solid 1px #e6e6e6',marginLeft:'25px'}}
          iconStyle={{fontSize:'13px',height:'13px',width:'13px',color:'#32ad3d'}} disabled={this.state.splits.size===4}
          onClick={()=>{IntervalStatisticAction.modifySplit(-1, status.ADD,{StartMoment:-1,EndMoment:-1});}}/>
        <NewFlatButton label={I18N.Setting.DataAnalysis.Statistics} disabled={!this._valid()} primary={true} style={{/*width:'76px',*/minWidth:'76px',height:'30px',marginLeft:'20px',lineHeight:'28px'}} onClick={()=>{this.setState({gatherInfo:'loading'},()=>{this._getGatherInfo()})}}/>
      </div>
    )
  }

  _renderTable(){
    return(
      <div>{this.state.gatherInfo.map((info,index)=>{

        var {TimeRange,TagName,CalculationType,UomName,Items,ErrorCode}=info.toJS();

        var style={height:'36px',
            minHeight:'36px',
            fontSize:'12px',
            borderBottom:'1px solid #e6e6e6',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            color:'#626469'};


        var {StartTime,EndTime}=TimeRange;
        var j2d = CommonFuns.DataConverter.JsonToDateTime;
        var start=new Date(j2d(StartTime)),end=new Date(j2d(EndTime));
        var title=!isMultiTime?TagName:DataAnalysisStore.getDisplayDate(start,false)+I18N.Setting.DataAnalysis.To+DataAnalysisStore.getDisplayDate(end,true);

        var head={
          column1Name:this.state.tabNo===1?I18N.Setting.DataAnalysis.Tou.TouTimeSpan:I18N.Setting.DataAnalysis.TimeSpan,
          column2Name:type[CalculationType]+(UomName==='null'?'':`(${UomName})`),
          column3Name:CalculationType===1?`${I18N.Common.Commodity.Cost}(RMB)`:null,
        }

        return(
            <ItemComponent title={title} style={index===0?{marginTop:'30px'}:null}>
              <TableHeader {...head}/>
              {ErrorCode===102?
                <div style={style}>
                  <FontIcon className="icon-glyph" style={{fontSize:'18px',height:'18px',width:'18px',marginRight:'10px'}} color="#9FA0A4"/>
                  {I18N.Setting.DataAnalysis.NotSupportIntervalAnalysis}</div>
              :Items.map((item,index)=>(
                <TableRow time={this.state.tabNo===1?tou[index]:formatSplit(item.TimeSplit)}
                          column2Value={item.EnergyValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:item.EnergyValue}
                          column3Value={ErrorCode===103?'－':(CalculationType===1?(item.CostValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:item.CostValue):null)}
                          style={index===Items.length-1?{borderBottomRightRadius: '2px',borderBottomLeftRadius: '2px'}:{}}/>
              ))}
             </ItemComponent>
          )
        }
        )}</div>
    )
  }

  _renderBasicContent(){
    return(
      <div style={{width:'100%'}}>
        {this._renderTimes()}
        {this.state.gatherInfo!==null && this._renderTable()}
        {this.state.gatherInfo===null && <div className="flex-center" style={{flexDirection:'column',marginTop:'20px'}}>
          			<FontIcon className="icon-calendar" style={{fontSize:'36px',marginBottom:'16px'}} color="#9fa0a4"/>
         				<div className="nolist-font">{I18N.Setting.DataAnalysis.AddTimeSpanTip}</div>
       				</div>}
      </div>
    )
  }

  _renderSeniorContent(){
    return(
      <div style={{width:'100%',marginTop:'-14px'}}>
        {this.state.gatherInfo!==null && this._renderTable()}
        </div>
    )
  }

  _renderContent(){
    return this.state.tabNo===1?this._renderSeniorContent():this._renderBasicContent()
  }

    _renderTab(){
    return(
      <div className="statistics-tabs">
        <div className={classNames({
              "statistics-tabs-tab": true,
              "selected":this.state.tabNo===1,
            })} style={{width:'82px'}} onClick={()=>{
                                  IntervalStatisticAction.refreshSplit()
                               this.setState({
                                   tabNo:1,
                                   gatherInfo:'loading'
                                 },()=>{
                                   this._getGatherInfo();

                                 })
            }}>{I18N.Setting.DataAnalysis.Tou.Title}</div>
        <div className={classNames({
              "statistics-tabs-tab": true,
              "right":true,
              "selected":this.state.tabNo===2,
            })} style={{width:'82px'}} onClick={()=>{
                                 this.setState({
                                   tabNo:2,
                                   gatherInfo:this.state.splits && this.state.splits.size>0?'loading':null
                                }
                                 ,()=>{
                                   if(this.state.splits && this.state.splits.size>0 && this._valid()){
                                    this._getGatherInfo()
                                   }else{
                                      IntervalStatisticAction.clearAll();
                                     IntervalStatisticAction.modifySplit(-1, status.ADD,{StartMoment:-1,EndMoment:-1});
                                   }

                                 })
            }}>{I18N.Common.DateRange.Customerize}</div>
      </div>
    )
  }


  componentWillMount(){
    isMultiTime=MultipleTimespanStore.getSubmitTimespans()!==null;
  }

  componentDidMount(){
    IntervalStatisticStore.addChangeListener(this._onChange);

    if(SeniorDataAnalyseIsFull()){
      this._getGatherInfo()
    }else{
     if(this.state.splits && this.state.splits.size>0){
       this.setState({
         tabNo:2,
         hasTab:false
       },()=>{
        this._getGatherInfo()
       })
    }else{
      this.setState({
        gatherInfo:null,
        tabNo:2,
        hasTab:false
      },()=>{
        IntervalStatisticAction.modifySplit(-1, status.ADD,{StartMoment:-1,EndMoment:-1});
      })
    }
    }

  }

  componentWillUnmount(){
    IntervalStatisticStore.removeChangeListener(this._onChange);
    IntervalStatisticAction.refreshSplit();
  }


  render(){
    var title=this.getTitle();
    var content;
    var tab=null;
    var style={
      title:{
        fontSize:'16px',
        fontWeight:'600',
        color:'#0f0f0f',
        height:'52px',
        borderBottom:'1px solid #e6e6e6',
        paddingTop:'0',
        lineHeight:'52px',
        marginBottom:'0',
        paddingLeft:'10px',
        alignItems:'center'
      },
      content:{
        display: 'block',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY:'auto'
      },
      closeIcon:{
        fontSize:'15px',
        lingHeight:'15px',
        height:'15px',
        margin:'0',
        color:'#505559',
        position:'absolute',
        right:'20px'
      }
    };
        if(this.state.gatherInfo==='loading'){
          content=(
            <div className="flex-center">
             <CircularProgress  mode="indeterminate" size={80} />
           </div>
          )
        }
        else {
          content=this._renderContent();
          tab=this.state.hasTab && this._renderTab();
        }
    return(
      <Dialog title={title} titleStyle={style.title} hasClose
        isOutsideClose={false} style={{position:'relative'}} closeIconStyle={{fontSize:'15px',lingHeight:'15px',height:'15px',margin:'0',color:'#505559'}} open={true} onRequestClose={this.props.onCloseDialog} contentStyle={style.content}>
        {tab}
        {content}

      </Dialog>
    )
  }
}

IntervalDialog.propTypes= {
  onCloseDialog:PropTypes.func,
  timeRanges:PropTypes.object,
  widgetId:PropTypes.number
};
