'use strict';
import React, { Component }  from "react";
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
// import {GatherInfo} from '../../../../../mockData/DataAnalysis.js';
var isMultiTime;
class ItemComponent extends Component{
  render(){
    return(
      <div style={this.props.style}>
        <div style={{fontSize:'14px',color:'#626469',marginBottom:'7px',marginTop:'25px',paddingLeft:'10px'}}>
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
      borderTopLeftRadius: '2px',borderTopRightRadius: '2px'
    };
    var style=assign({},defaultStyle,this.props.style);
    return(
      <div style={style}>
        <div style={{paddingLeft:'10px',width:'181px'}}>{this.props.columnName}</div>
        <div style={{width:'220px'}}>{this.props.hasTime?I18N.Setting.Calendar.Time:''}</div>
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

export default class StatisticsDialog extends Component {

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);

  }

  state={
    gatherInfo:null
    // gatherInfo:GatherInfo
  }

  _onChange(){
    this.setState({
      gatherInfo:DataAnalysisStore.getGatherInfo()
    })
  }

  _renderSum(){
    var header={},content;
    var SumGroup=this.state.gatherInfo.SumGroup;
    if(SumGroup===null) return null;
    if(isMultiTime){
      header={
        columnName:I18N.SumWindow.TimeSpan,
        typeName:I18N.SumWindow.Sum,
        hasTime:false
      };
      content=SumGroup[0].Items.map((item,index)=>{
        var {UomName,TimeRange,ItemGatherValue}=item;
        var {StartTime,EndTime}=TimeRange;
        var j2d = CommonFuns.DataConverter.JsonToDateTime;
        var start=new Date(j2d(StartTime)),end=new Date(j2d(EndTime));
        let props={
          columnValue:DataAnalysisStore.getDisplayDate(start,false)+I18N.Setting.DataAnalysis.To+DataAnalysisStore.getDisplayDate(end,true),
          typeValue:ItemGatherValue+''+UomName,
          time:null,
        };
        if(index===SumGroup[0].Items.length-1){
          props.style={
            borderBottomRightRadius: '2px',
            borderBottomLeftRadius: '2px'
          }
        }
        return <TableRow {...props}/>
      })
    }else {
      header={
        columnName:I18N.SumWindow.Data,
        typeName:I18N.SumWindow.Sum,
        hasTime:false,
        style:{'marginBottom':'none'}
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
          var {TagName,UomName,ItemGatherValue}=item;
          var props={
            columnValue:TagName,
            typeValue:ItemGatherValue+' '+UomName,
            time:null,
          }
          if(index===Items.length-1 && sunIndex===SumGroup.length-1 && !GatherValue){
            props.style={
              borderBottomRightRadius: '2px',
              borderBottomLeftRadius: '2px'
            }
          }
          return <TableRow {...props}/>
        })
        if(GatherValue){
          group.push(
            <TableRow columnValue={I18N.SumWindow.Sum}
                      typeValue={GatherValue+' '+UomName}
                      time={null}
                      style={
                        sunIndex===SumGroup.length-1?{borderBottomRightRadius: '2px',
                        borderBottomLeftRadius: '2px'}:{}
                      }/>
          )
        }
        return(
          <div>
            {title}
            {group}
          </div>
        )

      })
    }
    return(
      <ItemComponent title={I18N.Common.CaculationType.Sum}>
        <TableHeader {...header}/>
        {content}
      </ItemComponent>
    )
  }

  _renderAverage(){
    var header={},content;
    var AvgGroup=this.state.gatherInfo.AvgGroup;
    if(AvgGroup===null) return null;
    if(isMultiTime){
      header={
        columnName:I18N.SumWindow.TimeSpan,
        typeName:I18N.Common.CaculationType.Avg,
        hasTime:false
      };
      content=AvgGroup.map((item,index)=>{
        var {UomName,TimeRange,ItemGatherValue}=item;
        var {StartTime,EndTime}=TimeRange;
        var j2d = CommonFuns.DataConverter.JsonToDateTime;
        var start=new Date(j2d(StartTime)),end=new Date(j2d(EndTime));
        let props={
          columnValue:DataAnalysisStore.getDisplayDate(start,false)+I18N.Setting.DataAnalysis.To+DataAnalysisStore.getDisplayDate(end,true),
          typeValue:ItemGatherValue+' '+UomName,
          time:null,
        };
        if(index===AvgGroup.length-1){
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
        typeName:I18N.Common.CaculationType.Avg,
        hasTime:false
      };
      content=AvgGroup.map((item,index)=>{
        var {UomName,TagName,ItemGatherValue}=item;
        let props={
          columnValue:TagName,
          typeValue:ItemGatherValue+' '+UomName,
          time:null,
        };
        if(index===AvgGroup.length-1){
          props.style={
            borderBottomRightRadius: '2px',
            borderBottomLeftRadius: '2px'
          }
        }
        return <TableRow {...props}/>
      })
    }
    return(
      <ItemComponent title={I18N.Common.CaculationType.Avg} style={{marginTop:'30px'}}>
        <TableHeader {...header}/>
        {content}
      </ItemComponent>
    )
  }

  _renderMax(){
    var header={},content;
    var MaxGroup=this.state.gatherInfo.MaxGroup;
    if(MaxGroup===null) return null;
    if(isMultiTime){
      header={
        columnName:I18N.SumWindow.TimeSpan,
        typeName:I18N.Common.CaculationType.Max,
        hasTime:true
      };
      content=MaxGroup.map((item,index)=>{
        var {UomName,TimeRange,ItemGatherValue,ItemTime}=item;
        var {StartTime,EndTime}=TimeRange;
        var j2d = CommonFuns.DataConverter.JsonToDateTime;
        var start=new Date(j2d(StartTime)),end=new Date(j2d(EndTime));
        let props={
          columnValue:DataAnalysisStore.getDisplayDate(start,false)+I18N.Setting.DataAnalysis.To+DataAnalysisStore.getDisplayDate(end,true),
          typeValue:ItemGatherValue+' '+UomName,
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
        var {UomName,TagName,ItemGatherValue,ItemTime}=item;
        var j2d = CommonFuns.DataConverter.JsonToDateTime;
        let props={
          columnValue:TagName,
          typeValue:ItemGatherValue+' '+UomName,
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
    return(
      <ItemComponent title={I18N.Common.CaculationType.Max} style={{marginTop:'30px'}}>
        <TableHeader {...header}/>
        {content}
      </ItemComponent>
    )
  }

  _renderContent(){
    // var isMultiTime=false;
    return(
      <div style={{overflow:'auto'}}>
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

  componentWillMount(){
    isMultiTime=MultipleTimespanStore.getSubmitTimespans()!==null;
  }

  componentDidMount(){
    DataAnalysisStore.addChangeListener(this._onChange);

    let tagOptions = EnergyStore.getTagOpions(),
      paramsObj = EnergyStore.getParamsObj(),
      timeRanges = paramsObj.timeRanges;
    var seriesStatusArray = ChartStatusStore.getSeriesStatus();
    var display_timeRanges=[],display_tagOptions=[];

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
        if(series.IsDisplay){
          display_tagOptions.push(tagOptions[index]);
        }
      })
      display_timeRanges=timeRanges
    }
    if(display_timeRanges.length!==0 && display_tagOptions.length!==0){
      BasicAnalysisAction.getWidgetGatherInfo(display_timeRanges,this.props.analysisPanel.state.step,display_tagOptions);
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

  componentWillUnmount(){
    DataAnalysisStore.removeChangeListener(this._onChange);
  }

  render(){
    var title=this.getTitle();
    var content;
    var style={
      title:{
        fontSize:'16px',
        fontWeight:'500',
        color:'#0f0f0f',
        height:'52px',
        borderBottom:'1px solid #e6e6e6',
        paddingTop:'0',
        lineHeight:'52px',
        marginBottom:'0',
        paddingLeft:'10px'
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
      <Dialog title={title} titleStyle={style.title} open={true}  modal={false} onRequestClose={this.props.onCloseDialog} contentStyle={{overflowY:'auto'}}>
        {content}
      </Dialog>
    )
  }
}

StatisticsDialog.propTypes = {
  onCloseDialog:React.PropTypes.func,
  timeRanges:React.PropTypes.object,
  analysisPanel:React.PropTypes.object
};
