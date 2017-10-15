'use strict';
import React, { Component }  from "react";
import Highcharts from '../../highcharts/Highcharts.jsx';
import moment from'moment';

require("../../../lib/map.src.js");
require("../../../lib/heatmap.src.js");

function convetData(data){
  data.TargetEnergyData[0].EnergyData.map(({DataValue,UtcTime})=>{
    var date=moment.utc(UtcTime);
    var x=date.hours();
    var y=date.hours(0).minutes(0).seconds(0);
    return[x,y,DataValue]    
  })
}

export default class HeatMap extends Component {

  getConfigObj(){
    var that=this;
    return{
      title: null,
      chart: {
        type: 'heatmap',
        backgroundColor: "#ffffff",
        spacingBottom: 0,
      },
      legend:{
        verticalAlign:'top',
        y:50
      },
      xAxis: { 
        min: 0.5,
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
        labels: {
            formatter:function(){
              var dateSelector=that.props.AnalysisPanel.refs.subToolBar.refs.dateTimeSelector;
              var dateRange = dateSelector.getDateTime(),
                  startDate = dateRange.start,
                  endDate = dateRange.end;
              if(endDate - startDate > 31*24*60*60*100){
                return moment(this.value).format(I18N.DateTimeFormat.IntervalFormat.OnlyMonth)
              }else{
                return moment(this.value).format(I18N.DateTimeFormat.IntervalFormat.MonthDate)
              }
            }
        },

      },     
      series:[
        {
          data:convetData(that.props.energyData)
        }
      ]
    }
  }

  render(){
      return(
          <Highcharts ref="highstock" options={this.getConfigObj()}></Highcharts>
      )
  }

}

HeatMap.propTypes = {
  AnalysisPanel:React.PropTypes.object,
	energyData:React.PropTypes.object,
};