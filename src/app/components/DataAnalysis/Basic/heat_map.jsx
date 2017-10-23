'use strict';
import React, { Component }  from "react";
import Highcharts from '../../highcharts/Highcharts.jsx';
import moment from'moment';
import Immutable from 'immutable';
import AlarmTagStore from 'stores/AlarmTagStore.jsx';

require("../../../lib/map.src.js");
require("../../../lib/heatmap.src.js");

var formatYaxisDate=(date)=>(date.hours(0).minutes(0).seconds(0).valueOf())

function convetData(data){
  return data.TargetEnergyData[0].EnergyData.map(({DataValue,UtcTime})=>{
    var date=moment.utc(UtcTime).local();
    var x=date.hours();
    var y;
    if(x===0){
      x=24;
      y=formatYaxisDate(date.add(-1,'day'));
    }else{
      y=formatYaxisDate(date);
    }

    return[x,y,DataValue]    
  })
}

var maxData=(datas)=>(datas.maxBy(data=>data.get('DataValue')).get('DataValue'))

var minData=(datas)=>(datas.minBy(data=>data.get('DataValue')).get('DataValue'))



export default class HeatMap extends Component {

  getConfigObj(startDate,endDate){
    var that=this;
    var tagName=that.props.energyData.TargetEnergyData[0].Target.Name,
        uom=that.props.energyData.TargetEnergyData[0].Target.Uom;
    var validDatas=Immutable.fromJS(that.props.energyData)
                            .getIn(['TargetEnergyData',0,'EnergyData'])
                            .filter(data=>(moment.utc(data.get('UtcTime')).local().valueOf()>=startDate && 
                                           moment.utc(data.get('UtcTime')).local().valueOf()<=endDate &&
                                           data.get('DataValue')!==null));
   var yMin=formatYaxisDate(moment(startDate)),
      yMax=moment(endDate).hours()===0?formatYaxisDate(moment(endDate).add(-1,'m')):formatYaxisDate(moment(endDate));
    return{
      title: null,
      credits: {
	        enabled: false
	    }, 
      chart: {
        type: 'heatmap',
        backgroundColor: "#ffffff",
        spacingBottom: 0,
      },
      legend:{
        verticalAlign:'top',
        symbolWidth: that.props.isFromSolution?650:1000,
        itemMarginTop:-15,
        title:{
          text:tagName
        }
      },
      xAxis: { 
        min: 1,
        max: 24,
        labels: {
            format:'{value}:00'
        },
        minPadding: 0,
        startOnTick: false,
        endOnTick: true,
        tickWidth: 1,
        tickInterval:1,
      },
       yAxis: { 
        title:{
          text:null
        },
        labels: {
            formatter:function(){ 
              console.log(moment(this.value).valueOf());        
              if(endDate - startDate >= 365*24*60*60*1000){
                return moment(this.value).format(I18N.DateTimeFormat.IntervalFormat.OnlyMonth)
              }else if(moment(endDate).year()===moment(startDate).year()){
                return moment(this.value).format('MM/DD')
              }else {
                return moment(this.value).format('YYYY/MM/DD')
              }
            }
        },
        tickInterval:endDate - startDate >= 365*24*60*60*1000?2*31*24*60*60*1000:undefined,
        // minorTickInterval:'auto',
        startOnTick: false,
        minPadding: 0,
        maxPadding: 0,
        endOnTick: false,
        min:yMin,
        max:yMax,
      }, 
      colorAxis: {
        className:'heatmap-color-axis',
        stops: [
            [0, '#ffffff'],
            [0.05, '#eff8fd'],
            [0.1, '#def1fb'],
            [0.15, '#ceeaf9'],
            [0.2, '#bde4f7'],
            [0.25, '#adddf5'],
            [0.3, '#9dd7f3'],
            [0.35, '#8dcff1'],
            [0.4, '#7dc9f0'],
            [0.45, '#73bdeb'],
            [0.5, '#6ab1e7'],
            [0.55, '#61a4e3'],
            [0.6, '#5898df'],
            [0.65, '#508cdb'],
            [0.7, '#467fd6'],
            [0.75, '#3d72d2'],
            [0.8, '#3566ce'],
            [0.85, '#2c5aca'],
            [0.9, '#234dc6'],
            [0.95, '#1b41c2'],
            [1, '#1134bd']
        ],
        min:validDatas.size===0?null:minData(validDatas),
        max:validDatas.size===0?null:maxData(validDatas),
        tickInterval:validDatas.size===0?null:(maxData(validDatas)-minData(validDatas))/19,
        startOnTick: true,
        endOnTick: true,
         labels: {
            format: '{value}'
        }
    },  
    tooltip: {
            formatter:function(){
              return moment(this.point.y).format(I18N.DateTimeFormat.IntervalFormat.Week)+' '+this.point.x+':00'+' '+this.point.value+uom
            }
    },  
      series:[
        {
          borderWidth: 0,
          rowsize:yMin===yMax?0:24 * 36e5,
          data:convetData(that.props.energyData),
          // nullColor: '#ffffff',
        }
      ]
    }
  }

  render(){
  var {startDate,endDate}=this.props;

      return(
          <Highcharts ref="highstock" className="heatmap" options={this.getConfigObj(startDate,endDate)} afterChartCreated={this.props.afterChartCreated?this.props.afterChartCreated:()=>{}}></Highcharts>
      )
  }

}

HeatMap.propTypes = {
  // AnalysisPanel:React.PropTypes.object,
  startDate:React.PropTypes.number,
  endDate:React.PropTypes.number,
	energyData:React.PropTypes.object,
  isFromSolution:React.PropTypes.bool
};