'use strict';
import React, { Component }  from "react";
import Highcharts from '../../highcharts/Highcharts.jsx';
import Popover from 'material-ui/Popover';
import FontIcon from 'material-ui/FontIcon';
import AlarmTagStore from 'stores/AlarmTagStore.jsx';
import BubbleAction from 'actions/DataAnalysis/bubble_action.jsx';
import BubbleStore from 'stores/DataAnalysis/bubble_store.jsx';
import Immutable from 'immutable';
import CommonFuns from 'util/Util.jsx';
import moment from 'moment';
import classNames from 'classnames';

var getUom=(data,id)=>{
  let uom=Immutable.fromJS(data.Tags).find(item=>item.get("Id")===id);
  return uom?CommonFuns.getUomById(uom.get("UomId")).Code:null;
  // return CommonFuns.getUomById(uom.get("UomId")).Code;
}

var getYaxisUom=(data,id)=>CommonFuns.getUomById(data.Tags[1].Id===id?data.Tags[1].UomId:data.Tags[0].UomId).Code

var getSeries=(datas)=>datas.map(data=>{
  var j2d=CommonFuns.DataConverter.JsonToDateTime;
  var {TimeRange,Coordinates}=data;
  var {StartTime,EndTime}=TimeRange;
  var name=moment(j2d(EndTime)).hours()===0?
  `${moment(j2d(StartTime)).format("YYYY-MM-DD HH:mm")}<br/>${moment(j2d(EndTime)).add(-1,'days').format("YYYY-MM-DD 24:mm")}`
  :`${moment(j2d(StartTime)).format("YYYY-MM-DD HH:mm")}<br/>${moment(j2d(EndTime)).format("YYYY-MM-DD HH:mm")}`
  return{
    name:name,
    // marker:{
    //     	symbol:'circle'
    //     },
    turboThreshold:10*10000,
    minSize:"12%",
    maxSize:"30%",
    data:Coordinates.map(Coordinate=>({
      x:Coordinate.XCoordinate,
      y:Coordinate.YCoordinate,
      z:Coordinate.AreaValue
      // name:moment(j2d(Coordinate.Time)).format("YYYY-MM-DD HH-mm")
    }))
  }
})

var hasEmptyAxis=(datas)=>datas.map(data=>data.Coordinates.length===0).indexOf(false)===-1;

var colorArr=['#42b4e6', '#e47f00', '#1a79a9', '#71cbf4', '#b10043',
    '#9fa0a4', '#87d200', '#626469', '#ffd100', '#df3870'];

let dataLabelFormatter = function(format) {
  var f = window.Highcharts.numberFormat;
  var v = Number(this.value);
  var sign = this.value < 0 ? -1 : 1;

  v = Math.abs(v);
  if (v === 0) {
    if (format === false) {
      return this.value;
    } else {
      return v;
    }
  }
  if (v < Math.pow(10, 3)) {
    if (format === false) {
      return v * sign;
    } else {
      return f(v * sign, 2);
    }
  } else if (v < Math.pow(10, 6)) {
    if (format === false) {
      var len = parseInt(v / 1000).toString().length;
      var v1 = v.toString();
      var retV = v1.substring(0, len) + ',' + v1.substring(len);
      if (sign < 0)
        retV = '-' + retV;
      return retV;
    } else {
      return f(v * sign, 0);
    }
  } else if (v < Math.pow(10, 8)) {
    v = f(parseInt(v / Math.pow(10, 3)) * sign, 0) + 'k';
  } else if (v < Math.pow(10, 11)) {
    v = f(parseInt(v / Math.pow(10, 6)) * sign, 0) + 'M';
  } else if (v < Math.pow(10, 14)) {
    v = f(parseInt(v / Math.pow(10, 9)) * sign, 0) + 'G';
  } else if (v < Math.pow(10, 17)) {
    v = f(parseInt(v / Math.pow(10, 12)) * sign, 0) + 'T';
  }
  return v;
};

class DropDownMenu extends Component{

  state={
    operationMenuOpen:false,
    anchorEl:null,
  }

  render(){
    var {menuitems,value}=this.props;
    var me=this;

    var styles={
      btnStyle:{
        width: '155px',
        height: '28px',
        borderRadius: '4px',
        border: 'solid 1px #e6e6e6',
        lineHeight:'28px',
        textAlign:"start",
        paddingLeft:'11px'
      },
      label:{
        fontSize: '14px',
        color: '#626469',
        top:"-2px",
        paddingLeft:"0"
      },
      icon:{
        fontSize: '10px',
        color: '#626469',
        paddingLeft:'5px',
      }
    };

    var   handleTouchTap = (event) => {
    // This prevents ghost click.
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        operationMenuOpen: true,
        anchorEl: event.currentTarget,
      });
    };

    var handleRequestClose = () => {
      this.setState({
        operationMenuOpen: false,
      });
    };

    var handleMenuItemClick= (item)=>{
      handleRequestClose();
      this.props.onItemClick(item.tagId);


    };

    var label=value===0 ? I18N.Setting.DataAnalysis.Scatter.PlzSelectTag
                        : Immutable.fromJS(menuitems).find(item=>item.get("tagId")===value).get("tagName");
    return(
      <div>
          <div className="scatterplot-dropdownmenu" onClick={handleTouchTap}>
            <div className="scatterplot-dropdownmenu-label" title={label}>{label}</div>
            <FontIcon className="icon-arrow-down" color="767A7A" style={styles.icon}/>
          </div>
          <Popover
            open={this.state.operationMenuOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={handleRequestClose}
            style={{overflowY: 'auto',maxWidth:'220px',maxHeight:'500px',overflowX:'hidden'}}
            className="person-list"
          >
            <div style={{
              width: '200px',
              height: '39px',
              lineHeight:'39px',
              color:'#cbcbcb',
              paddingLeft:'20px'
            }}>{I18N.Setting.DataAnalysis.Scatter.PlzSelectTag}
                                            </div>
          {menuitems.map(item=>(
             <div className={classNames({
                                            'person-item': true,
                                            'selected':item.tagId===value
                                          })} onClick={()=>{handleMenuItemClick(item)}}>
                                                <div className="name" 
                                                  style={{
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden'
                                                  }}
                                                  title={item.tagName}>{item.tagName}</div>
                                    

                                              </div>
          ))}

          </Popover>
      </div>
    )
  }

}

DropDownMenu.propTypes={
  value:React.PropTypes.number,
  onItemClick:React.PropTypes.func,
  menuitems:React.PropTypes.array
}


export default class Bubble extends Component {

   constructor(props) {
    super(props);
    this._onChanged = this._onChanged.bind(this);
  }

  state={
    xAxis:BubbleStore.getXaxis(),
    yAxis:BubbleStore.getYaxis(),
    area:BubbleStore.getArea(),
  }

  xmin;
  xmax;
  ymin;
  ymax;

  _onChanged(){
    this.setState({
      xAxis:BubbleStore.getXaxis(),
      yAxis:BubbleStore.getYaxis(), 
      area:BubbleStore.getArea(),
    })
  }

  getConfigObj(){
    var xAxisUom=getUom(this.props.energyData[0],this.state.xAxis),
        yAxisUom=getUom(this.props.energyData[0],this.state.yAxis),
        areaUom=getUom(this.props.energyData[0],this.state.area),
        xAxisName=Immutable.fromJS(this.props.energyData[0].Tags).find(tag=>tag.get('Id')===this.state.xAxis).get("Name"),
        yAxisName=Immutable.fromJS(this.props.energyData[0].Tags).find(tag=>tag.get('Id')===this.state.yAxis).get("Name"),
        areaName=Immutable.fromJS(this.props.energyData[0].Tags).find(tag=>tag.get('Id')===this.state.area).get("Name");

    var that=this;
    return{
      colors:colorArr,
      chart: {
        type: 'bubble',
        events:{
          redraw: function (e) {
            that.forceUpdate();
          }
        }
      },
      title: null,
      credits: {
            enabled: false
        }, 
      xAxis: {
          xname:xAxisUom,
          title: {
              align: 'high',
              rotation: 0,
              y: -40,
              x:40,
              text: xAxisUom
            },
            labels: {
              format:'{value}'
          },
          min:that.xmin,
          max:that.xmax,
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true
      },
      yAxis: {
          yname:yAxisUom,
          title: {
              align: 'high',
              rotation: 0,
              y: -15,
              x:60,
              text: yAxisUom
          },
          labels: {
              format:'{value}'
          },
          min:that.ymin,
          max:that.ymax
      },
      legend: {
        enabled: true,
        layout: 'vertical',
        verticalAlign: 'top',
        title:{
          text:that.props.isFromSolution?`${I18N.Setting.DataAnalysis.Scatter.XAxis+'：'+xAxisName}<br/>${I18N.Setting.DataAnalysis.Scatter.YAxis+'：'+yAxisName}<br/>${I18N.Setting.DataAnalysis.Bubble.Area+'：'+areaName}`:null
        },
        y: that.props.isFromSolution?10:150,
        x: -30,
        itemStyle: {
          cursor: 'default',
          color: '#626469',
          "fontWeight": "normal"
        },
        itemHoverStyle: {
          cursor: 'pointer',
          color: '#000'
        },
        borderWidth: 0,
        margin: 30,
        align: 'right',
        width:that.props.isFromSolution?90:187,
        itemMarginTop: 6,
        itemMarginBottom: 6
        },
      tooltip:{
        useHTML: true,
        formatter:function(){
          var x=this.point.x,y=this.point.y,z=this.point.z;
          var content='';
          var j2d=CommonFuns.DataConverter.JsonToDateTime;
          that.props.energyData.forEach((data,index)=>{
            var {Coordinates}=data;
            Coordinates.forEach(Coordinate=>{
              if(Coordinate.XCoordinate===x && Coordinate.YCoordinate===y && Coordinate.AreaValue===z){
                content+= `<div>
                            <div style="font-size:14px;color:#626469">${CommonFuns.formatDateByStep(j2d(Coordinate.Time,true),null,null,that.props.step)}</div>
                            <div style="font-size:12px;color:${colorArr[index]}">(${dataLabelFormatter.call({
                  value: x
                }, false)+xAxisUom}, ${dataLabelFormatter.call({
                  value: y
                }, false)+yAxisUom},${dataLabelFormatter.call({
                  value: z
                }, false)+areaUom})</div>
                          </div>`
              }
            })
          })
          return `
          <div>
            ${content}
          </div>
          `
        }
      },
      series: getSeries(that.props.energyData)
      }
  }

  setAxisData(xAxis,yAxis,area){
    BubbleAction.setAxisData(xAxis,yAxis,area);
  }

  _renderContent(){
    if(this.props.energyData==='initial' || this.state.xAxis===0 || this.state.yAxis===0 || this.state.area===0){
      return(
              <div className="flex-center" style={{flexDirection:"column",backgroundColor: "#ffffff",borderBottomRightRadius: "5px",borderBottomLeftRadius: "5px",border: "solid 1px #e6e6e6",borderTop:"none"}}>
                <FontIcon className="icon-chart1" color="#32ad3d" style={{fontSize:'50px'}}/>
                {I18N.Setting.DataAnalysis.Scatter.NoTagTip}
              </div>
      )
    }
    if(this.state.xAxis=== this.state.yAxis || this.state.xAxis=== this.state.area || this.state.area=== this.state.yAxis){
      return(
              <div className="flex-center" style={{flexDirection:"column",backgroundColor: "#ffffff",borderBottomRightRadius: "5px",borderBottomLeftRadius: "5px",border: "solid 1px #e6e6e6",borderTop:"none"}}>
                <FontIcon className="icon-chart1" color="#32ad3d" style={{fontSize:'50px'}}/>
                {I18N.Setting.DataAnalysis.Scatter.AxisCanNotSame}
              </div>
      )      
    }
    if(hasEmptyAxis(this.props.energyData)){
      return(
              <div className="flex-center" style={{flexDirection:"column",backgroundColor: "#ffffff",borderBottomRightRadius: "5px",borderBottomLeftRadius: "5px",border: "solid 1px #e6e6e6",borderTop:"none"}}>
                <FontIcon className="icon-chart1" color="#32ad3d" style={{fontSize:'50px'}}/>
                {I18N.Setting.DataAnalysis.Scatter.HasEmptyAxis}
              </div>
      )  
    }
    // console.log(JSON.stringify(this.getConfigObj()));
    return(
        <Highcharts ref="highstock" className="heatmap" options={this.getConfigObj()} afterChartCreated={this.props.afterChartCreated?()=>{this.props.afterChartCreated()}:()=>{}}></Highcharts>
    
    )
  }

  _renderAxisSelect(){
    var menus=AlarmTagStore.getSearchTagList();
    return(
      <div style={{position:'absolute',right:'30px',top:'50px',backgroundColor:'#ffffff'}}>
        <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
          <div style={{fontSize:'12px',color:'#626469',width:'40px'}}>
          {I18N.Setting.DataAnalysis.Scatter.XAxis+'：'}
          </div>  
          <DropDownMenu value={this.state.xAxis}
                        onItemClick={(value)=>{this.setAxisData(value,this.state.yAxis,this.state.area)}}
                        menuitems={menus}/>
        </div>
        <div style={{display:'flex',marginTop:'10px',flexDirection:'row',alignItems:'center'}}>
          <div style={{fontSize:'12px',color:'#626469',width:'40px'}}>
          {I18N.Setting.DataAnalysis.Scatter.YAxis+'：'}
          </div>      
          <DropDownMenu value={this.state.yAxis}
                        onItemClick={(value)=>{this.setAxisData(this.state.xAxis,value,this.state.area)}}
                        menuitems={menus}/>     
        </div>
        <div style={{display:'flex',marginTop:'10px',flexDirection:'row',alignItems:'center'}}>
          <div style={{fontSize:'12px',color:'#626469',width:'40px'}}>
          {I18N.Setting.DataAnalysis.Bubble.Area+'：'}
          </div>      
          <DropDownMenu value={this.state.area}
                        onItemClick={(value)=>{this.setAxisData(this.state.xAxis,this.state.yAxis,value)}}
                        menuitems={menus}/>     
        </div>
      </div>
    )
  }

  componentWillMount(){
    if(this.props.getYaxisConfig && this.props.getYaxisConfig() && this.props.getYaxisConfig().length!==0){
      var xAxis=this.props.getYaxisConfig()[0],yAxis=this.props.getYaxisConfig()[1];
      this.xmax=xAxis.val[0]===''?null:xAxis.val[0];
      this.xmin=xAxis.val[1]===''?null:xAxis.val[1];
      this.ymax=yAxis.val[0]===''?null:yAxis.val[0];
      this.ymin=yAxis.val[1]===''?null:yAxis.val[1];
    }
  }

  componentDidMount(){
    BubbleStore.addChangeListener(this._onChanged);
  }
  
  componentWillReceiveProps(nextProps){
    var {xAxis,yAxis,area}=this.state;
    if(!this.props.isFromSolution){

        if(Immutable.fromJS(AlarmTagStore.getSearchTagList()).findIndex(tag=>tag.get('tagId')===xAxis)===-1){xAxis=0}
        if(Immutable.fromJS(AlarmTagStore.getSearchTagList()).findIndex(tag=>tag.get('tagId')===yAxis)===-1){yAxis=0}
        if(Immutable.fromJS(AlarmTagStore.getSearchTagList()).findIndex(tag=>tag.get('tagId')===area)===-1){area=0}

        if(xAxis!==this.state.xAxis || yAxis!==this.state.yAxis || area!==this.state.area){
          BubbleAction.setAxisData(xAxis,yAxis,area)
        }

        if(nextProps.getYaxisConfig && nextProps.getYaxisConfig() && nextProps.getYaxisConfig().length!==0){
          var xAxis=nextProps.getYaxisConfig()[0],yAxis=nextProps.getYaxisConfig()[1];
          this.xmax=xAxis.val[0]===''?null:xAxis.val[0];
          this.xmin=xAxis.val[1]===''?null:xAxis.val[1];
          this.ymax=yAxis.val[0]===''?null:yAxis.val[0];
          this.ymin=yAxis.val[1]===''?null:yAxis.val[1];
        }
    }else{
      if(this.props.energyData!==nextProps.energyData){
        this.setState({
          xAxis:0,
          yAxis:0,
          area:0
        })
      }
    }

  }

  shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.energyData===this.props.energyData && nextState.xAxis===this.state.xAxis && nextState.yAxis===this.state.yAxis && nextState.area===this.state.area) return false
    return true
	}

  componentWillUnmount() {
    BubbleStore.removeChangeListener(this._onChanged);
  }


  render(){
    return(
      <div style={{flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      paddingBottom: '20px',
                      overflow: 'hidden',
                      borderRadius: '5px',
                      position:'relative',
                      backgroundColor:'#ffffff'
                    }}>
      {this._renderContent()}       
      {!this.props.isFromSolution && this._renderAxisSelect()}
      
    </div>
      )
  }
}

Bubble.propTypes = {
  energyData:React.PropTypes.object,
  getYaxisConfig:React.PropTypes.func,
  step:React.PropTypes.number,
  isFromSolution:React.PropTypes.bool
};