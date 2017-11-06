'use strict';
import React, { Component }  from "react";
import Highcharts from '../../highcharts/Highcharts.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import Popover from 'material-ui/Popover';
import FontIcon from 'material-ui/FontIcon';
import AlarmTagStore from 'stores/AlarmTagStore.jsx';
import IconButton from 'material-ui/IconButton';
import ScatterPlotAction from 'actions/DataAnalysis/scatter_plot_action.jsx';
import ScatterPlotStore from 'stores/DataAnalysis/scatter_plot_store.jsx';
import Immutable from 'immutable';
import EnergyAction from 'actions/EnergyAction.jsx';
import CommonFuns from 'util/Util.jsx';
import moment from 'moment';
import classNames from 'classnames';

var getXaxisUom=(data,id)=>CommonFuns.getUomById(data.Tags[0].Id===id?data.Tags[0].UomId:data.Tags[1].UomId).Code

var getYaxisUom=(data,id)=>CommonFuns.getUomById(data.Tags[1].Id===id?data.Tags[1].UomId:data.Tags[0].UomId).Code

var getSeries=(datas)=>datas.map(data=>{
  var j2d=CommonFuns.DataConverter.JsonToDateTime;
  var {TimeRange,Coordinates}=data;
  var {StartTime,EndTime}=TimeRange;
  var name=moment(j2d(EndTime)).hours()===0?
  `${moment(j2d(StartTime)).format("YYYY-MM-DD HH-mm")}<br/>${moment(j2d(EndTime)).add(-1,'days').format("YYYY-MM-DD 24-mm")}`
  :`${moment(j2d(StartTime)).format("YYYY-MM-DD HH-mm")}<br/>${moment(j2d(EndTime)).format("YYYY-MM-DD HH-mm")}`
  return{
    name:name,
    marker:{
        	symbol:'circle'
        },
    turboThreshold:10*10000,
    data:Coordinates.map(Coordinate=>({
      x:Coordinate.XCoordinate,
      y:Coordinate.YCoordinate,
      // name:moment(j2d(Coordinate.Time)).format("YYYY-MM-DD HH-mm")
    }))
  }
})

var hasEmptyAxis=(datas)=>datas.map(data=>data.Coordinates.length===0).indexOf(true)>-1;

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
        marginRight:'5px',
        position:"absolute",
        right:0
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
        <FlatButton label={label} labelPosition="before" labelStyle={styles.label} style={styles.btnStyle} icon={<FontIcon className="icon-arrow-down" color="767A7A" style={styles.icon}/>} onClick={handleTouchTap}/>
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


export default class ScatterPlot extends Component {

   constructor(props) {
    super(props);
    this._onChanged = this._onChanged.bind(this);
  }

  state={
    xAxis:ScatterPlotStore.getXaxis(),
    yAxis:ScatterPlotStore.getYaxis(),
  }

  xmin;
  xmax;
  ymin;
  ymax;

  _onChanged(){
    this.setState({
      xAxis:ScatterPlotStore.getXaxis(),
      yAxis:ScatterPlotStore.getYaxis(), 
    })
  }

  _renderTitle(){
    var content='';
    this.props.energyData.forEach((data,index)=>{
      content+=`<div style="font-size:14px;display:flex;color:${colorArr[index]}">
                    R<sup>2</sup>=${data.R2}
                    <div style="margin-left:20px">y=${data.B}x${data.A<0?'':'+'}${data.A}</div>
                   </div>`
    })
  
    return(
      `<div style="display:flex;flex-direction:row">
                 <div style="font-size:14px;color:#626469">${I18N.Setting.DataAnalysis.Scatter.Formula+': '}</div>
                 <div style="margin-left:10px">${content}</div>
                </div>`
    )
  }

  getConfigObj(){
    var xAxisUom=getXaxisUom(this.props.energyData[0],this.state.xAxis),
        yAxisUom=getYaxisUom(this.props.energyData[0],this.state.yAxis),
        xAxisName=Immutable.fromJS(this.props.energyData[0].Tags).find(tag=>tag.get('Id')===this.state.xAxis).get("Name"),
        yAxisName=Immutable.fromJS(this.props.energyData[0].Tags).find(tag=>tag.get('Id')===this.state.yAxis).get("Name");
    var that=this;
    return{
      colors:colorArr,
      chart: {
        type: 'scatter',
        // zoomType: 'xy',
        spacingBottom:that.props.isFromSolution?0:20*this.props.energyData.length,
        events:{
          redraw: function (e) {
            var xAxis=e.target.xAxis[0],
                yAxis=e.target.yAxis[0];
                
                that.xmin=xAxis.min===''?null:xAxis.min;
                that.xmax=xAxis.max===''?null:xAxis.max;

                that.ymin=yAxis.min===''?null:yAxis.min;
                that.ymax=yAxis.max===''?null:yAxis.max;

            that.forceUpdate();
          }
        }
      },
      title: {
          useHTML:true,
          align:'left',
          verticalAlign:'bottom',    
          x:40,
          y:5,      
          text:that._renderTitle()
      },
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
          text:that.props.isFromSolution?`${I18N.Setting.DataAnalysis.Scatter.XAxis+'：'+xAxisName}<br/>${I18N.Setting.DataAnalysis.Scatter.YAxis+'：'+yAxisName}`:null
        },
        y: that.props.isFromSolution?10:140,
        x: -100,
        itemStyle: {
          cursor: 'default',
          color: '#3b3b3b',
          "fontWeight": "normal"
        },
        itemHoverStyle: {
          cursor: 'pointer',
          color: '#000'
        },
        borderWidth: 0,
        margin: 10,
        align: 'right',
        width:that.props.isFromSolution?90:130,
        itemMarginTop: 6,
        itemMarginBottom: 6
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
            }
      },
      tooltip:{
        useHTML: true,
        formatter:function(){
          var x=this.point.x,y=this.point.y;
          var content='';
          var j2d=CommonFuns.DataConverter.JsonToDateTime;
          that.props.energyData.forEach((data,index)=>{
            var {Coordinates}=data;
            Coordinates.forEach(Coordinate=>{
              if(Coordinate.XCoordinate===x && Coordinate.YCoordinate===y){
                content+= `<div>
                            <div style="font-size:14px;color:#626469">${CommonFuns.formatDateByStep(j2d(Coordinate.Time,true),null,null,that.props.step)}</div>
                            <div style="font-size:12px;color:${colorArr[index]}">(${dataLabelFormatter.call({
                  value: x
                }, false)+xAxisUom}, ${dataLabelFormatter.call({
                  value: y
                }, false)+yAxisUom})</div>
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

  setAxisData(xAxis,yAxis){
    ScatterPlotAction.setAxisData(xAxis,yAxis);
  }

  _renderContent(){
    if(this.props.energyData==='initial' || this.state.xAxis===0 || this.state.yAxis===0){
      return(
              <div className="flex-center" style={{flexDirection:"column",backgroundColor: "#ffffff",borderBottomRightRadius: "5px",borderBottomLeftRadius: "5px",border: "solid 1px #e6e6e6",borderTop:"none"}}>
                <FontIcon className="icon-chart1" color="#32ad3d" style={{fontSize:'50px'}}/>
                {I18N.Setting.DataAnalysis.Scatter.NoTagTip}
              </div>
      )
    }
    if(this.state.xAxis=== this.state.yAxis){
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
    // console.log(this.getConfigObj().stringify());
    return(
        <Highcharts ref="highstock" className="heatmap" options={this.getConfigObj()} afterChartCreated={this.props.afterChartCreated?()=>{this.props.afterChartCreated()}:()=>{}}></Highcharts>
    
    )
  }

  _renderAxisSelect(){
    var menus=AlarmTagStore.getSearchTagList();
    return(
      <div style={{position:'absolute',right:'20px',top:'50px',backgroundColor:'#ffffff'}}>
        <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
          <div style={{fontSize:'12px',color:'#626469'}}>
          {I18N.Setting.DataAnalysis.Scatter.XAxis+'：'}
          </div>  
          <DropDownMenu value={this.state.xAxis}
                        onItemClick={(value)=>{this.setAxisData(value,this.state.yAxis)}}
                        menuitems={menus}/>
        </div>
        <div style={{display:'flex',marginTop:'10px',flexDirection:'row',alignItems:'center'}}>
          <div style={{fontSize:'12px',color:'#626469'}}>
          {I18N.Setting.DataAnalysis.Scatter.YAxis+'：'}
          </div>      
          <DropDownMenu value={this.state.yAxis}
                        onItemClick={(value)=>{this.setAxisData(this.state.xAxis,value)}}
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
    ScatterPlotStore.addChangeListener(this._onChanged);
  }
  
  componentWillReceiveProps(){
    var {xAxis,yAxis}=this.state;
    if(!this.props.isFromSolution){
          if(Immutable.fromJS(AlarmTagStore.getSearchTagList()).findIndex(tag=>tag.get('tagId')===xAxis)===-1){xAxis=0}
    if(Immutable.fromJS(AlarmTagStore.getSearchTagList()).findIndex(tag=>tag.get('tagId')===yAxis)===-1){yAxis=0}
      if(xAxis!==this.state.xAxis || yAxis!==this.state.yAxis){
        ScatterPlotAction.setAxisData(xAxis,yAxis)
      }
    }

  }

  shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.energyData===this.props.energyData && nextState.xAxis===this.state.xAxis && nextState.yAxis===this.state.yAxis) return false
		return true
	}

  componentWillUnmount() {
    ScatterPlotStore.removeChangeListener(this._onChanged);
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

ScatterPlot.propTypes = {
  energyData:React.PropTypes.object,
  getYaxisConfig:React.PropTypes.func,
  step:React.PropTypes.number,
  isFromSolution:React.PropTypes.bool
};