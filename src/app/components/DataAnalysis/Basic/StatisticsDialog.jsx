'use strict';
import React, { Component }  from "react";
import moment from 'moment';
import assign from "object-assign";
import Dialog from 'controls/NewDialog.jsx';
import DataAnalysisStore from 'stores/DataAnalysis/DataAnalysisStore.jsx';
import CommonFuns from 'util/Util.jsx';
// import {calculationType} from 'constants/actionType/DataAnalysis.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import BasicAnalysisAction from 'actions/DataAnalysis/BasicAnalysisAction.jsx';
import AlarmTagStore from 'stores/AlarmTagStore.jsx';
import EnergyStore from 'stores/Energy/EnergyStore.jsx';
import ChartStatusStore from 'stores/Energy/ChartStatusStore.jsx';
import MultipleTimespanStore from 'stores/Energy/MultipleTimespanStore.jsx';
import IconButton from 'material-ui/IconButton';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import FontIcon from 'material-ui/FontIcon';
import classNames from 'classnames';
// import {GatherInfo} from '../../../../../mockData/DataAnalysis.js';
var isMultiTime;
var display_timeRanges=[],display_tagOptions=[];
var step_config=[I18N.EM.Raw,I18N.EM.Hour,I18N.EM.Day,I18N.EM.Month,I18N.EM.Year,I18N.EM.Week]
function privilegeWithSeniorDataAnalyse( privilegeCheck ) {
  // return true
return privilegeCheck(PermissionCode.SENIOR_DATA_ANALYSE, CurrentUserStore.getCurrentPrivilege());
}
//能源经理
function SeniorDataAnalyseIsFull() {
	return privilegeWithSeniorDataAnalyse(privilegeUtil.isFull.bind(privilegeUtil));
}

function getTime(time){
  if (time !== null) {
    return moment(time).format('YYYY-MM-DD HH:mm')
  } else {
    return '';
  }
}

var displayValue=(value,uom)=>(value===null?'——':value+' '+uom)

class ItemComponent extends Component{
  render(){
    return(
      <div style={assign({width:'100%'},this.props.style)}>
        <div style={{fontSize:'14px',fontWeight:'600',color:'#626469',marginBottom:'7px',marginTop:'26px',paddingLeft:'10px'}}>
          {this.props.title}
        </div>
        {this.props.children}
      </div>
    )
  }
}

ItemComponent.propTypes={
  title:React.PropTypes.string,
  style:React.PropTypes.object,
}

class TableHeader extends Component{

  render(){
    var defaultStyle={
      height:'29px',minHeight:'29px',lineHeight:'29px',border:'1px solid #e6e6e6',display:'flex',fontSize:'10px',color:'#626469',
      borderTopLeftRadius: '2px',borderTopRightRadius: '2px',width:'100%'
    };
    var style=assign({},defaultStyle,this.props.style);
    return(
      <div style={style}>
        <div style={{paddingLeft:'10px',width:'181px'}}>{this.props.columnName}</div>
        <div style={{width:'220px'}}>{this.props.hasTime?(this.props.additionColumnName?this.props.additionColumnName:I18N.Setting.Calendar.Time):''}</div>
        <div>
          {this.props.typeName}
        </div>
      </div>
    )
  }
}

TableHeader.propTypes={
  columnName:React.PropTypes.string,
  typeName:React.PropTypes.string,
  hasTime:React.PropTypes.bool,
  style:React.PropTypes.object,
  additionColumnName:React.PropTypes.string,
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
        <div style={{paddingLeft:'10px',width:'181px'}}>{this.props.columnValue}</div>
          <div style={{width:'220px'}}>{this.props.time}</div>
          <div>
            {this.props.typeValue}
          </div>
      </div>
    )
  }
}

TableRow.propTypes={
  columnValue:React.PropTypes.string,
  typeValue:React.PropTypes.string,
  time:React.PropTypes.string,
  style:React.PropTypes.string,
}


class SumTableRow extends Component{
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

    var {tagName,
         otherName,
         avg,
         max,
         min,
         total}=this.props;
    return(
      <div style={style}>
         <div style={{paddingLeft:'12px',paddingRight:'20px',flex:'1',whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden'}} 
              title={tagName}><div style={{whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden'}}>{tagName}</div><div>{otherName}</div></div>
        <div style={{paddingRight:'20px',width:'110px',minWidth:'110px'}}>{avg}</div>
        <div style={{paddingRight:'20px',width:'110px',minWidth:'110px'}}>{max}</div>
        <div style={{paddingRight:'20px',width:'110px',minWidth:'110px'}}>{min}</div>
        <div style={{paddingRight:'12px',width:'110px',minWidth:'110px'}}>{total}</div>
      </div>
    )
  }
}

SumTableRow.propTypes={
  tagName:React.PropTypes.string,
  otherName:React.PropTypes.string,
  avg:React.PropTypes.string,
  max:React.PropTypes.string,
  min:React.PropTypes.string,
  total:React.PropTypes.string,
}

class SumTableHeader extends Component{

  render(){
    var defaultStyle={
      height:'29px',minHeight:'29px',lineHeight:'29px',border:'1px solid #e6e6e6',display:'flex',fontSize:'10px',color:'#626469',
      borderTopLeftRadius: '2px',borderTopRightRadius: '2px'
    };
    var style=assign({},defaultStyle,this.props.style);
    return(
      <div style={style}>
        <div style={{paddingLeft:'12px',paddingRight:'20px',flex:'1'}}>{this.props.name}</div>
        <div style={{paddingRight:'20px',width:'110px',minWidth:'110px'}}>{I18N.Common.CaculationType.Avg}</div>
        <div style={{paddingRight:'20px',width:'110px',minWidth:'110px'}}>{I18N.Common.CaculationType.Max}</div>
        <div style={{paddingRight:'20px',width:'110px',minWidth:'110px'}}>{I18N.Common.CaculationType.Min}</div>
        <div style={{paddingRight:'12px',width:'110px',minWidth:'110px'}}>{this.props.needTotal && I18N.SumWindow.Sum}</div>
      </div>
    )
  }
}

SumTableHeader.propTypes={
  name:React.PropTypes.string,
  needTotal:React.PropTypes.bool,
}

const Model={
  "Basic":0,
  "Senior":1
}

export default class StatisticsDialog extends Component {

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);

  }

  state={
    gatherInfo:null,
    showModel:Model.Basic
  }

  _onChange(){
    this.setState({
      gatherInfo:DataAnalysisStore.getGatherInfo()
    })
  }

  _renderBasicSum(){
    var header={},content;
    var SumGroup=this.state.gatherInfo.SumGroup;
    if(isMultiTime){
      header={
        name:I18N.SumWindow.TimeSpan,
        needTotal:true
      };
      content=SumGroup[0].Items.map((item,index)=>{
        var {UomName,TimeRange,ItemGatherValue,AvgValue,MaxValue,MinValue,SumValue}=item;
        var {StartTime,EndTime}=TimeRange;
        var j2d = CommonFuns.DataConverter.JsonToDateTime;
        var start=new Date(j2d(StartTime)),end=new Date(j2d(EndTime));
        let props={
          tagName:DataAnalysisStore.getDisplayDate(start,false),
          otherName:DataAnalysisStore.getDisplayDate(end,true),
          avg:displayValue(AvgValue,UomName+'/'+step_config[this.props.analysisPanel.state.step]),
          max:displayValue(MaxValue,UomName+'/'+step_config[this.props.analysisPanel.state.step]),
          min:displayValue(MinValue,UomName+'/'+step_config[this.props.analysisPanel.state.step]),
          total:displayValue(SumValue,UomName),
        };
        if(index===SumGroup[0].Items.length-1){
          props.style={
            borderBottomRightRadius: '2px',
            borderBottomLeftRadius: '2px'
          }
        }
        return <SumTableRow {...props}/>
      })
    }else {
      header={
        name:I18N.SumWindow.Data,
        needTotal:true
      };
      content=SumGroup.map((sum,sunIndex)=>{
        var {CommodityId,UomName,Items,GatherValue}=sum;
        var commodity=CommonFuns.getCommodityById(CommodityId).Comment;
        var title=(
          <div style={{paddingLeft:'10px',height:'30px',minHeight:'30px',backgroundColor:'#f7f7f7',lineHeight:'30px',fontSize:'12px',color:'#626469',borderLeft:'1px solid #e6e6e6',borderRight:'1px solid #e6e6e6'}}>
            {I18N.Common.Glossary.Commodity+":"+commodity+" "+I18N.Common.Glossary.UOM+':'+UomName}
          </div>
        );
        var group=Items.map((item,index)=>{
          var {TagName,UomName,ItemGatherValue,AvgValue,MaxValue,MinValue,SumValue}=item;
          var props={
            tagName:TagName,
            avg:displayValue(AvgValue,UomName+'/'+step_config[this.props.analysisPanel.state.step]),
            max:displayValue(MaxValue,UomName+'/'+step_config[this.props.analysisPanel.state.step]),
            min:displayValue(MinValue,UomName+'/'+step_config[this.props.analysisPanel.state.step]),
            total:displayValue(SumValue,UomName),
          }
          if(index===Items.length-1 && sunIndex===SumGroup.length-1 && !GatherValue){
            props.style={
              borderBottomRightRadius: '2px',
              borderBottomLeftRadius: '2px'
            }
          }
          return <SumTableRow {...props}/>
        })
        if(GatherValue){
          group.push(
            <SumTableRow tagName={I18N.SumWindow.Sum}
              avg={''}
              max={''}
              min={''}
              total={GatherValue+' '+UomName}
              style={
                        sunIndex===SumGroup.length-1?{borderBottomRightRadius: '2px',
                        borderBottomLeftRadius: '2px'}:{}
                      }/>
          )
        }
        return(
          <div style={{width:'100%'}}>
            {title}
            {group}
          </div>
        )

      })
    }
    return(
      <ItemComponent title={I18N.Setting.DataAnalysis.Sum} style={{marginTop:"-10px"}}>
        <SumTableHeader {...header}/>
        {content}
      </ItemComponent>
    )
  }

    _renderSeniorSum(){
    var header={},content;
    var SumGroup=this.state.gatherInfo.SumGroup;
    var style={height:'36px',
      minHeight:'36px',
      fontSize:'12px',
      border:'1px solid #e6e6e6',
      borderTop:'none',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      color:'#626469'};
    if(isMultiTime){
      header={
        columnName:I18N.SumWindow.TimeSpan,
        typeName:I18N.Common.CaculationType.Avg,
        additionColumnName:I18N.Common.CaculationType.Sum,
        hasTime:true,
        style:{'marginBottom':'none'}
      };
      content=SumGroup.map((sum,sunIndex)=>{
        var {CommodityId,UomName,GatherSumValue,GatherAvgValue,TimeRange,WorkdaySumValue,WorkdayAvgValue,HolidaySumValue,HolidayAvgValue,IsConfigCalendar}=sum;
        var {StartTime,EndTime}=TimeRange;
        var j2d = CommonFuns.DataConverter.JsonToDateTime;
        var start=new Date(j2d(StartTime)),end=new Date(j2d(EndTime));
        var title=(
          <div style={{paddingLeft:'10px',height:'30px',minHeight:'30px',backgroundColor:'#f7f7f7',lineHeight:'30px',fontSize:'12px',color:'#626469',borderLeft:'1px solid #e6e6e6',borderRight:'1px solid #e6e6e6'}}>
            {DataAnalysisStore.getDisplayDate(start,false)+I18N.Setting.DataAnalysis.To+DataAnalysisStore.getDisplayDate(end,true)}
          </div>
        );
      var group=IsConfigCalendar?
                <div>
                <TableRow columnValue={I18N.Setting.Calendar.WorkDay} time={WorkdaySumValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:WorkdaySumValue} typeValue={WorkdayAvgValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:WorkdayAvgValue+'/'+I18N.EM.Day}/>
                <TableRow columnValue={I18N.Setting.Calendar.Holiday} time={HolidaySumValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:HolidaySumValue} typeValue={HolidayAvgValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:HolidayAvgValue+'/'+I18N.EM.Day}/>
                <TableRow columnValue={I18N.Setting.DataAnalysis.Total} time={GatherSumValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:GatherSumValue} typeValue={GatherAvgValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:GatherAvgValue+'/'+I18N.EM.Day}/>
                </div>
                :<div style={style}>
                  <FontIcon className="icon-glyph" style={{fontSize:'14px',height:'14px',width:'14px',marginRight:'10px'}} color="#505559"/>
                  {I18N.Setting.DataAnalysis.NoCanlendarConfig}</div>
        return(
          <div style={{width:'100%'}}>
            {title}
            {group}
          </div>
        )

      })
    }else {
      header={
        columnName:I18N.SumWindow.TimeSpan,
        typeName:I18N.Common.CaculationType.Avg,
        additionColumnName:I18N.Common.CaculationType.Sum,
        hasTime:true,
        style:{'marginBottom':'none'}
      };
      content=SumGroup.map((sum,sunIndex)=>{
        var {CommodityId,UomName,GatherSumValue,GatherAvgValue,TagName,WorkdaySumValue,WorkdayAvgValue,HolidaySumValue,HolidayAvgValue,IsConfigCalendar}=sum;
        var commodity=CommonFuns.getCommodityById(CommodityId).Comment;
        // {TagName+' '+I18N.Common.Glossary.Commodity+":"+commodity+" "+I18N.Common.Glossary.UOM+':'+UomName}
        var title=(
          <div style={{display:'flex',paddingLeft:'10px',height:'30px',minHeight:'30px',backgroundColor:'#f7f7f7',lineHeight:'30px',fontSize:'12px',color:'#626469',borderLeft:'1px solid #e6e6e6',borderRight:'1px solid #e6e6e6'}}>
            <div>{TagName}</div>
            <div style={{marginLeft:'8px'}}>{I18N.Common.Glossary.Commodity+":"+commodity}</div>
            <div style={{marginLeft:'8px'}}>{I18N.Common.Glossary.UOM+':'+(UomName==='null'?'':UomName)}</div>
          </div>
        );
      var group=IsConfigCalendar?
                <div>
                <TableRow columnValue={I18N.Setting.Calendar.WorkDay} time={WorkdaySumValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:WorkdaySumValue} typeValue={WorkdayAvgValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:WorkdayAvgValue+'/'+I18N.EM.Day}/>
                <TableRow columnValue={I18N.Setting.Calendar.Holiday} time={HolidaySumValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:HolidaySumValue} typeValue={HolidayAvgValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:HolidayAvgValue+'/'+I18N.EM.Day}/>
                <TableRow columnValue={I18N.Setting.DataAnalysis.Total} time={GatherSumValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:GatherSumValue} typeValue={GatherAvgValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:GatherAvgValue+'/'+I18N.EM.Day}/>
                </div>
                :<div style={style}>
                  <FontIcon className="icon-glyph" style={{fontSize:'14px',height:'14px',width:'14px',marginRight:'10px'}} color="#505559"/>
                  {I18N.Setting.DataAnalysis.NoCanlendarConfig}</div>
        return(
          <div style={{width:'100%'}}>
            {title}
            {group}
          </div>
        )

      })
    }
    return(
      <ItemComponent title={I18N.Setting.DataAnalysis.Sum}>
        <TableHeader {...header}/>
        {content}
      </ItemComponent>
    )
  }

  _renderSum(){
    if(this.state.gatherInfo.SumGroup===null || this.state.gatherInfo.SumGroup.length===0) return null;
    if(this.state.showModel===Model.Basic) return this._renderBasicSum()
    else return this._renderSeniorSum()
  
  }

  _renderBasicAve(){
      var header={},content;
    var AvgGroup=this.state.gatherInfo.AvgGroup;
    if(isMultiTime){
       header={
        name:I18N.SumWindow.TimeSpan,
      };
      content=AvgGroup.map((item,index)=>{
        var {UomName,TimeRange,ItemGatherValue,AvgValue,MaxValue,MinValue}=item;
        var {StartTime,EndTime}=TimeRange;
        var j2d = CommonFuns.DataConverter.JsonToDateTime;
        var start=new Date(j2d(StartTime)),end=new Date(j2d(EndTime));
        let props={
          tagName:DataAnalysisStore.getDisplayDate(start,false),
          otherName:DataAnalysisStore.getDisplayDate(end,true),
          avg:displayValue(AvgValue,UomName+'/'+step_config[this.props.analysisPanel.state.step]),
          max:displayValue(MaxValue,UomName+'/'+step_config[this.props.analysisPanel.state.step]),
          min:displayValue(MinValue,UomName+'/'+step_config[this.props.analysisPanel.state.step]),
          total:'',
        };
        if(index===AvgGroup.length-1){
          props.style={
            borderBottomRightRadius: '2px',
            borderBottomLeftRadius: '2px'
          }
        }
        return <SumTableRow {...props}/>
      })
    }
    else {
      header={
        name:I18N.SumWindow.Data,
      };
      content=AvgGroup.map((item,index)=>{
        var {UomName,TagName,ItemGatherValue,AvgValue,MaxValue,MinValue}=item;
        var props={
            tagName:TagName,
            avg:displayValue(AvgValue,UomName+'/'+step_config[this.props.analysisPanel.state.step]),
            max:displayValue(MaxValue,UomName+'/'+step_config[this.props.analysisPanel.state.step]),
            min:displayValue(MinValue,UomName+'/'+step_config[this.props.analysisPanel.state.step]),
            total:'',
          }
        if(index===AvgGroup.length-1){
          props.style={
            borderBottomRightRadius: '2px',
            borderBottomLeftRadius: '2px'
          }
        }
        return <SumTableRow {...props}/>
      })
    }
    return(
      <ItemComponent title={I18N.Setting.DataAnalysis.Avg} style={{marginTop:'30px'}}>
        <SumTableHeader {...header}/>
        {content}
      </ItemComponent>
    )
  }

  _renderSeniorAve(){
    var header={},content;
    var AvgGroup=this.state.gatherInfo.AvgGroup;
    var style={height:'36px',
      minHeight:'36px',
      fontSize:'12px',
      border:'1px solid #e6e6e6',
      borderTop:'none',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      color:'#626469'};
    if(isMultiTime){
      header={
        columnName:I18N.SumWindow.TimeSpan,
        typeName:I18N.Common.CaculationType.Avg,
        hasTime:false,
        style:{'marginBottom':'none'}
      };
      content=AvgGroup.map((avg,sunIndex)=>{
        var {CommodityId,UomName,GatherAvgValue,HolidayAvgValue,IsConfigCalendar,TimeRange,WorkdayAvgValue}=avg;
        var commodity=CommonFuns.getCommodityById(CommodityId).Comment;
        var {StartTime,EndTime}=TimeRange;
        var j2d = CommonFuns.DataConverter.JsonToDateTime;
        var start=new Date(j2d(StartTime)),end=new Date(j2d(EndTime));
        var title=(
          <div style={{paddingLeft:'10px',height:'30px',minHeight:'30px',backgroundColor:'#f7f7f7',lineHeight:'30px',fontSize:'12px',color:'#626469',borderLeft:'1px solid #e6e6e6',borderRight:'1px solid #e6e6e6'}}>
            {DataAnalysisStore.getDisplayDate(start,false)+I18N.Setting.DataAnalysis.To+DataAnalysisStore.getDisplayDate(end,true)}
          </div>
        );
      var group=IsConfigCalendar?<div>
                <TableRow columnValue={I18N.Setting.Calendar.WorkDay} typeValue={WorkdayAvgValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:WorkdayAvgValue+'/'+I18N.EM.Day}/>
                <TableRow columnValue={I18N.Setting.Calendar.Holiday} typeValue={HolidayAvgValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:HolidayAvgValue+'/'+I18N.EM.Day}/>
                <TableRow columnValue={I18N.Common.Glossary.Order.All} typeValue={GatherAvgValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:GatherAvgValue+'/'+I18N.EM.Day}/>
                </div>
                :<div style={style}>
                  <FontIcon className="icon-glyph" style={{fontSize:'14px',height:'14px',width:'14px',marginRight:'10px'}} color="#505559"/>
                  {I18N.Setting.DataAnalysis.NoCanlendarConfig}</div>
        return(
          <div style={{width:'100%'}}>
            {title}
            {group}
          </div>
        )

      })
    }else {
      header={
        columnName:I18N.SumWindow.TimeSpan,
        typeName:I18N.Common.CaculationType.Avg,
        hasTime:false,
        style:{'marginBottom':'none'}
      };
      content=AvgGroup.map((avg,sunIndex)=>{
        var {CommodityId,UomName,TagName,GatherAvgValue,HolidayAvgValue,IsConfigCalendar,WorkdayAvgValue}=avg;
        var commodity=CommonFuns.getCommodityById(CommodityId).Comment;
        var title=(
          <div style={{display:'flex',paddingLeft:'10px',height:'30px',minHeight:'30px',backgroundColor:'#f7f7f7',lineHeight:'30px',fontSize:'12px',color:'#626469',borderLeft:'1px solid #e6e6e6',borderRight:'1px solid #e6e6e6'}}>
            <div>{TagName}</div>
            <div style={{marginLeft:'8px'}}>{I18N.Common.Glossary.Commodity+":"+commodity}</div>
            <div style={{marginLeft:'8px'}}>{I18N.Common.Glossary.UOM+':'+(UomName==='null'?'':UomName)}</div>
          </div>
        );
        
      var group=IsConfigCalendar?<div>
                <TableRow columnValue={I18N.Setting.Calendar.WorkDay} typeValue={WorkdayAvgValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:WorkdayAvgValue+'/'+I18N.EM.Day}/>
                <TableRow columnValue={I18N.Setting.Calendar.Holiday} typeValue={HolidayAvgValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:HolidayAvgValue+'/'+I18N.EM.Day}/>
                <TableRow columnValue={I18N.Common.Glossary.Order.All} typeValue={GatherAvgValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:GatherAvgValue+'/'+I18N.EM.Day}/>
                </div>
                :<div style={style}>
                  <FontIcon className="icon-glyph" style={{fontSize:'14px',height:'14px',width:'14px',marginRight:'10px'}} color="#505559"/>
                  {I18N.Setting.DataAnalysis.NoCanlendarConfig}</div>
        return(
          <div style={{width:'100%'}}>
            {title}
            {group}
          </div>
        )

      })
    }
    return(
      <ItemComponent title={I18N.Setting.DataAnalysis.Avg}>
        <TableHeader {...header}/>
        {content}
      </ItemComponent>
    )
  }

  _renderAverage(){

    if(this.state.gatherInfo.AvgGroup===null || this.state.gatherInfo.AvgGroup.length===0) return null;
    if(this.state.showModel===Model.Basic) return this._renderBasicAve()
        else return this._renderSeniorAve()
  }

  _renderBasicMax(){
    var header={},content;
    var MaxGroup=this.state.gatherInfo.MaxGroup;
    if(isMultiTime){
      header={
        columnName:I18N.SumWindow.TimeSpan,
        typeName:I18N.Common.CaculationType.Max,
        hasTime:true
      };
      content=MaxGroup.map((item,index)=>{
        var {UomName,TimeRange,ItemGatherValue,ItemTime,MaxValue}=item;
        var {StartTime,EndTime}=TimeRange;
        var j2d = CommonFuns.DataConverter.JsonToDateTime;
        var start=new Date(j2d(StartTime)),end=new Date(j2d(EndTime));
        let props={
          columnValue:DataAnalysisStore.getDisplayDate(start,false)+I18N.Setting.DataAnalysis.To+DataAnalysisStore.getDisplayDate(end,true),
          typeValue:MaxValue+' '+UomName,
          time:DataAnalysisStore.getDisplayDate(new Date(j2d(ItemTime)),false),
        };
        if(index===MaxGroup.length-1){
          props.style={
            borderBottomRightRadius: '2px',
            borderBottomLeftRadius: '2px'
          }
        }
        return <TableRow {...props}/>
      })
    }
    else {
      header={
        columnName:I18N.SumWindow.Data,
        typeName:I18N.Common.CaculationType.Max,
        hasTime:true
      };
      content=MaxGroup.map((item,index)=>{
        var {UomName,TagName,ItemGatherValue,ItemTime,MaxValue}=item;
        var j2d = CommonFuns.DataConverter.JsonToDateTime;
        let props={
          columnValue:TagName,
          typeValue:MaxValue+' '+UomName,
          time:getTime(new Date(j2d(ItemTime))),
        };
        if(index===MaxGroup.length-1){
          props.style={
            borderBottomRightRadius: '2px',
            borderBottomLeftRadius: '2px'
          }
        }
        return <TableRow {...props}/>
      })
    }
    return(
      <ItemComponent title={I18N.Setting.DataAnalysis.Max} style={{marginTop:'30px'}}>
        <TableHeader {...header}/>
        {content}
      </ItemComponent>
    )
  }

  _renderSeniorMax(){
    var header={},content;
    var MaxGroup=this.state.gatherInfo.MaxGroup;
    var style={height:'36px',
      minHeight:'36px',
      fontSize:'12px',
      border:'1px solid #e6e6e6',
      borderTop:'none',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      color:'#626469'};
    if(isMultiTime){

      header={
        columnName:I18N.SumWindow.TimeSpan,
        typeName:I18N.Common.CaculationType.Max,
        hasTime:false
      };

      content=MaxGroup.map((item,index)=>{
        var {CommodityId,UomName,TimeRange,HolidayMaxValue,HolidayTimes,WorkdayMaxValue,WorkdayTimes,IsConfigCalendar}=item;
        var commodity=CommonFuns.getCommodityById(CommodityId).Comment;
        var {StartTime,EndTime}=TimeRange;
        var j2d = CommonFuns.DataConverter.JsonToDateTime;
        var start=new Date(j2d(StartTime)),end=new Date(j2d(EndTime));
        var title=(
          <div style={{paddingLeft:'10px',height:'30px',minHeight:'30px',backgroundColor:'#f7f7f7',lineHeight:'30px',fontSize:'12px',color:'#626469',borderLeft:'1px solid #e6e6e6',borderRight:'1px solid #e6e6e6'}}>
            {DataAnalysisStore.getDisplayDate(start,false)+I18N.Setting.DataAnalysis.To+DataAnalysisStore.getDisplayDate(end,true)}
          </div>
        );
        var group;
        if(!IsConfigCalendar) group=<div style={style}>
          <FontIcon className="icon-glyph" style={{fontSize:'14px',height:'14px',width:'14px',marginRight:'10px'}} color="#505559"/>
          {I18N.Setting.DataAnalysis.NoCanlendarConfig}</div>
        else{
          group=WorkdayTimes.map(workday=>(
            <TableRow columnValue={getTime(new Date(j2d(workday)))+" ("+I18N.Setting.Calendar.WorkDay+')'} typeValue={WorkdayMaxValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:WorkdayMaxValue}/>
          )).concat(HolidayTimes.map(holiday=>(
            <TableRow columnValue={getTime(new Date(j2d(holiday)))+" ("+I18N.Setting.Calendar.Holiday+')'} typeValue={HolidayMaxValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:HolidayMaxValue}/>
          )))
        
        }
        return(
          <div style={{width:'100%'}}>
            {title}
            {group}
          </div>
        )
       })
    }
    else {
      header={
        columnName:I18N.SumWindow.TimeSpan,
        typeName:I18N.Common.CaculationType.Max,
        hasTime:false
      };

      content=MaxGroup.map((item,index)=>{
        var {CommodityId,TagName,UomName,HolidayMaxValue,HolidayTimes,WorkdayMaxValue,WorkdayTimes,IsConfigCalendar}=item;
        var commodity=CommonFuns.getCommodityById(CommodityId).Comment;
         var j2d = CommonFuns.DataConverter.JsonToDateTime;
        var title=(
          <div style={{display:'flex',paddingLeft:'10px',height:'30px',minHeight:'30px',backgroundColor:'#f7f7f7',lineHeight:'30px',fontSize:'12px',color:'#626469',borderLeft:'1px solid #e6e6e6',borderRight:'1px solid #e6e6e6'}}>
            <div>{TagName}</div>
            <div style={{marginLeft:'8px'}}>{I18N.Common.Glossary.Commodity+":"+commodity}</div>
            <div style={{marginLeft:'8px'}}>{I18N.Common.Glossary.UOM+':'+(UomName==='null'?'':UomName)}</div>
          </div>
        );
        var group;
        if(!IsConfigCalendar) group=<div style={style}>
          <FontIcon className="icon-glyph" style={{fontSize:'14px',height:'14px',width:'14px',marginRight:'10px'}} color="#505559"/>
          {I18N.Setting.DataAnalysis.NoCanlendarConfig}</div>
        else{
          group=WorkdayTimes.map(workday=>(
            <TableRow columnValue={getTime(new Date(j2d(workday)))+" ("+I18N.Setting.Calendar.WorkDay+')'} typeValue={WorkdayMaxValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:WorkdayMaxValue}/>
          )).concat(HolidayTimes.map(holiday=>(
            <TableRow columnValue={getTime(new Date(j2d(holiday)))+" ("+I18N.Setting.Calendar.Holiday+')'} typeValue={HolidayMaxValue===null?I18N.Setting.KPI.Group.Ranking.History.NoValue:HolidayMaxValue}/>
          )))
        
        }
        return(
          <div style={{width:'100%'}}>
            {title}
            {group}
          </div>
        )
       })
    }
    return(
      <ItemComponent title={I18N.Setting.DataAnalysis.Max}>
        <TableHeader {...header}/>
        {content}
      </ItemComponent>
    )
  }

  _renderMax(){
    if(this.state.gatherInfo.MaxGroup===null || this.state.gatherInfo.MaxGroup.length===0) return null;
    if(this.state.showModel===Model.Basic) return this._renderBasicMax()
        else return this._renderSeniorMax()
  }

  _renderContent(){
    // var isMultiTime=false;

    // <div style={{flex:'1',width:'100%',display:'flex',flexDirection:'column'}}>
    return(
      <div style={{width:'100%'}}>
        {this._renderSum()}
        {this._renderAverage()}
        {this._renderMax()}
      </div>
    )
  }

  getTitle(){
    // var isMultiTime=false;
    if(isMultiTime){
      var tagName=AlarmTagStore.getSearchTagList()[0].tagName;
      return I18N.EM.Tool.DataStatistics+' '+tagName
    }else {
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      var startDate=new Date(j2d(this.props.timeRanges[0].StartTime)),endDate=new Date(j2d(this.props.timeRanges[0].EndTime));
      return I18N.EM.Tool.DataStatistics+'   '+DataAnalysisStore.getDisplayDate(startDate,false)+' '+I18N.Setting.DataAnalysis.To+' '+DataAnalysisStore.getDisplayDate(endDate,true)
    }
  }

  getGatherInfo(model){
    if(display_timeRanges.length!==0 && display_tagOptions.length!==0){
      if(model===Model.Basic){
        BasicAnalysisAction.getWidgetGatherInfo(display_timeRanges,this.props.analysisPanel.state.step,display_tagOptions);
      }else{
        BasicAnalysisAction.getProWidgetGatherInfo(display_timeRanges,this.props.analysisPanel.state.step,display_tagOptions);
      }      
    }
    else {
      this.setState({
        gatherInfo:{
          MaxGroup:null,
          AvgGroup:null,
          SumGroup:null
        }
      })
    }
  }

  _renderTab(){
    return(
      <div className="statistics-tabs">
        <div className={classNames({
              "statistics-tabs-tab": true,
              "selected":this.state.showModel===Model.Basic,
            })} onClick={()=>{
                               this.setState({
                                   showModel:Model.Basic,
                                   gatherInfo:null
                                 },()=>{
                                   this.getGatherInfo(Model.Basic)
                                 })
            }}>{I18N.Setting.DataAnalysis.ByTag}</div>
        <div className={classNames({
              "statistics-tabs-tab": true,
              "right":true,
              "selected":this.state.showModel===Model.Senior,
            })} onClick={()=>{
                                 this.setState({
                                   showModel:Model.Senior,
                                   gatherInfo:null
                                  }
                                 ,()=>{
                                   this.getGatherInfo(Model.Senior)
                                 })
            }}>{I18N.Setting.DataAnalysis.ByCalendar}</div>
      </div>
    )
  }

  componentWillMount(){
    isMultiTime=MultipleTimespanStore.getSubmitTimespans()!==null;
  }

  componentDidMount(){
    DataAnalysisStore.addChangeListener(this._onChange);
    display_timeRanges=[];
    display_tagOptions=[];

    let tagOptions = EnergyStore.getTagOpions(),
      paramsObj = EnergyStore.getParamsObj(),
      timeRanges = paramsObj.timeRanges;
    var seriesStatusArray = ChartStatusStore.getSeriesStatus();

    if(isMultiTime){
      seriesStatusArray.forEach((series,index)=>{
        if(series.IsDisplay){
          display_timeRanges.push(timeRanges[index]);
        }
      })
      display_tagOptions=tagOptions
    }
    else {
      seriesStatusArray.forEach((series,index)=>{
        if(series.IsDisplay && index<tagOptions.length){
          display_tagOptions.push(tagOptions[index]);
        }
      })
      display_timeRanges=timeRanges
    }
    this.getGatherInfo(Model.Basic);

  }

  componentWillUnmount(){
    DataAnalysisStore.removeChangeListener(this._onChange);
  }

  render(){
    var title=this.getTitle();
    var content;
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
        marginLeft:'24px',
        marginRight:'24px',
        alignItems:'center'
      },
      content:{
        marginLeft:'24px',
        marginRight:'0',
        display: 'block',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        overflowY:'auto',
        paddingRight:'24px',
        paddingBottom:'24px'
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
        if(this.state.gatherInfo===null){
          content=(
            <div className="flex-center">
             <CircularProgress  mode="indeterminate" size={80} />
           </div>
          )
        }
        else {
          content=this._renderContent()
        }
    return(
      <Dialog title={title} titleStyle={style.title} style={{position:'relative'}} closeIconStyle={{fontSize:'15px',lingHeight:'15px',height:'15px',margin:'0',color:'#505559'}} open={true}  modal={false} onRequestClose={this.props.onCloseDialog} 
      contentStyle={style.content} actionsContainerStyle={{display:'none'}}>
        
        {SeniorDataAnalyseIsFull() && this.state.gatherInfo!==null && <div>{this._renderTab()}</div>}
        {false && this.state.gatherInfo!==null && this.state.showModel===Model.Senior && <IconButton iconClassName="icon-left-switch" 
                    iconStyle={{fontSize:'43px',height:'43px',width:'43px',color:'#9fa0a4'}} 
                    style={{position:'absolute',left:'14px',padding:'0',top:'50%'}}
                    onClick={()=>{
                                 this.setState({
                                   showModel:Model.Basic,
                                   gatherInfo:null
                                 },()=>{
                                   this.getGatherInfo(Model.Basic)
                                 })}}/>}
        {content}
        {false && this.state.gatherInfo!==null && this.state.showModel===Model.Basic && SeniorDataAnalyseIsFull() && <IconButton iconClassName="icon-right-switch" 
                    iconStyle={{fontSize:'43px',height:'43px',width:'43px',color:'#9fa0a4'}}
                    style={{position:'absolute',right:'14px',padding:'0',top:'50%'}}
                    onClick={()=>{
                                 this.setState({
                                   showModel:Model.Senior,
                                   gatherInfo:null
                                  }
                                 ,()=>{
                                   this.getGatherInfo(Model.Senior)
                                 })}}/>}
      </Dialog>
    )
  }
}

StatisticsDialog.propTypes = {
  onCloseDialog:React.PropTypes.func,
  timeRanges:React.PropTypes.object,
  analysisPanel:React.PropTypes.object,
  step:React.PropTypes.number
};
