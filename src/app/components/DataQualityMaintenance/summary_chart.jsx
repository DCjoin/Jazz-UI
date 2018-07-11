'use strict';

import React, { Component}  from "react";
import Highcharts from '../highcharts/Highcharts.jsx';
import Spin from '@emop-ui/piano/spin';
import PropTypes from 'prop-types';
import CommonFuns from 'util/Util.jsx';
import Immutable from 'immutable';
import moment from 'moment';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';
import ChartPanel from 'components/customerSetting/tag/RawDataChartPanel.jsx';
import DataQualityMaintenanceAction from 'actions/data_quality_maintenance.jsx';
import DataQualityMaintenanceStore from 'stores/data_quality_maintenance.jsx';
import ChartXAxisSetter from '../energy/ChartXAxisSetter.jsx';
import Highstock from '../highcharts/Highstock.jsx';
// import { CircularProgress, Checkbox, FontIcon,FlatButton} from 'material-ui';
import { dateFormat } from 'util/Util.jsx';

let {dateAdd} = CommonFuns;

class ChartComponent extends Component {
    constructor(props) {
    super(props);
    // this._onChanged = this._onChanged.bind(this);
  }

  getSeries(){
    return([{
      type:'coloredline',
      option:{
        step:6
      },
      data:this.props.data.map((data,index)=>{
        let {Time,IsNormal}=data.toJS();
        let color;
         if (!IsNormal) {
        color = '#f46a58'
      } else {        
          color = '#11d9db'
      }
      return {
        x: moment.utc(Time).valueOf(),
        y: 0,
        index:index,
        fillColor: color,
        color: color,
        events: {
        },
        marker: {
          color: color,
          fillColor: color,
          states: {
            hover: {
              marker: {
                fillColor: color
              }
            }
          }
        }
      }
      }).toJS()
    }])
  }
  
  getConfigObj(){
    var that=this;
    return{
      colors: [
        '#42b4e6', '#e47f00', '#1a79a9', '#71cbf4', '#b10043',
        '#9fa0a4', '#87d200', '#626469', '#ffd100', '#df3870'
      ],
      title:null,
      legend:{
        enabled:false
      },
      lang: {
        loading: 'loading',
        months: [],
        shortMonths: [],
        weekdays: [],
        decimalPoint: '.',
        resetZoom: '取消放大/缩小',
        resetZoomTitle: '缩放至1:1',
        thousandsSep: ','
      },
      chart: {
        type: 'coloredline',
        panning: false,
        backgroundColor: "#FBFBFB",
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        borderRadius: 0,
        resetZoomButton: false,
        events: {
        }
      },
      exporting: {
        buttons: {
          contextButton: {
            enabled: false
          }
        }
      },
      xAxis: {
        ordinal: false, //must false for missing data
        type: 'datetime',
        tickPositioner: function(min, max) {
          return ChartXAxisSetter.statics.setTicks.apply(this, arguments);
        },
        crosshair: true,
        labels: {
          overflow: 'justify',
        },
        dateTimeLabelFormats: {},             
      },
      yAxis: {
        title:{
          text:null
        },
        min:-1,
        max:1,
        gridLineWidth:0,
        labels: {
              format:'{value}',
              enabled:false
          },
      },
      rangeSelector: {
        enabled: false
      },
      navigator: {
        enabled: false,
        margin: 25,
        adaptToUpdatedData: false,
        xAxis: {
          ordinal: false,
        },
      },
      scrollbar: {
        enabled: false,
        liveRedraw: true
      },
      style: {
        "fontSize": "12px",
        fontFamily: 'Microsoft YaHei'
      },
      credits: {
        enabled: false
      },
      tooltip: {
        enabled: true,
        hideDelay: 100,
        shape: 'square',
        xDateFormat: '%Y-%m-%d %H:%M:%S',
        useHTML: true,
        formatter:function(){
          var x=this.x;
          var content='';
          var j2d=CommonFuns.DataConverter.JsonToDateTime;
          var data=that.props.data.getIn([this.points[0].point.index]);
          var {Time,NormalNodes,AbnormalNodes,IsNormal}=data.toJS();
          return `
          <div>
                  <div style="font-size:14px;color:#626469">${CommonFuns.formatDateByStep(j2d(Time,true),null,null,6)}</div>
                    <div style="display:flex">
                      <div style="font-size:12px;color:#626469">${that.props.name}${I18N.VEE.Summary+'：'}</div>
                      <div style="font-size:12px;color:${IsNormal?'#11d9db':'#f46a58'}">${IsNormal?I18N.VEE.normal:I18N.VEE.abnormal}</div>
                    </div>
                    <div style="display:flex">
                      <div style="font-size:12px;color:#626469">${I18N.format(I18N.VEE.SummaryTooltip1,NormalNodes+AbnormalNodes)}${I18N.VEE.SummaryTooltip2}</div>
                      <div style="font-size:12px;color:#f46a58">${AbnormalNodes}</div>
                      <div style="font-size:12px;color:#626469">${I18N.VEE.SummaryTooltip3}</div>
                      <div style="font-size:12px;color:#f46a58">${I18N.VEE.abnormal}</div>
                    </div>
                        
        
          </div>
          `
        }
      },
      plotOptions: {
        series: {
          marker: {
            enabled: true,
            radius: 4,
            fillColor: false,
            hover: {
              fillColor: false,
            }
          },
          turboThreshold: 3000
        },
        line: {
          dataGrouping: {
            enabled: false
          },
          zIndex: 10,
          point: {
            events: {
              click: function(event) {
                var chart = this.series.chart;
                chart.trigger('editComment', {
                  event: event,
                  point: this
                });
              }
            }
          },
          dataLabels: {
            enabled: false,
            shadow: true,
            borderRadius: 5,
            backgroundColor: 'white',
            padding: 10,
            borderWidth: 1,
            borderColor: '#AAA',
            // y: -40
          }
        }
      },
      series:this.getSeries()
          }
  }

  _setDateTimeLabelFormats(defaultConfig){
    let cap = function(string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
    };
    var t = ['millisecond', 'second', 'minute', 'hour', 'day', 'dayhour', 'week', 'month', 'fullmonth', 'year'],
      c = defaultConfig,
      x = c.xAxis,
      f = I18N.DateTimeFormat.HighFormat.RawData;

    t.forEach(function(n) {
      x.dateTimeLabelFormats[n] = (f[cap(n)]);
    });

    c.chart.cancelChartContainerclickBubble = true;
    return c;
  }
  _renderContent(){
    if(this.props.data===null){
      return(
              <div className="flex-center">
                <Spin/>
              </div>
      )
    }

    // console.log(this.getConfigObj().stringify());
    return(
        <Highstock ref="highstock" options={this._setDateTimeLabelFormats(this.getConfigObj())} afterChartCreated={()=>{}}></Highstock>
    
    )
  }

  render(){
    return(
      <div style={{flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      // paddingBottom: '20px',
                      overflow: 'hidden',
                      borderRadius: '5px',
                      position:'relative',
                    }}>
      {this._renderContent()}      
      
    </div>
      )
  }
}

export default class SummaryChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
      data: null,
      refresh: false,
      isLoading: true,
      start: this._getInitDate().start,
      end: this._getInitDate().end,
      startDate: this._getInitDate().startDate,
      endDate: this._getInitDate().endDate,
      startTime: this._getInitDate().startTime,
      endTime: this._getInitDate().endTime
		};
		this._onChanged = this._onChanged.bind(this);
		// this._onUpdate = this._onUpdate.bind(this);
		// this._onSwitchRawDataView = this._onSwitchRawDataView.bind(this);
		this._onDateSelectorChanged = this._onDateSelectorChanged.bind(this);
	}

  _getInitDate() {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    let last7Days = dateAdd(date, -6, 'days');
    let endDate = dateAdd(date, 1, 'days');
    return ({
      start: last7Days,
      end: endDate,
      startDate: last7Days,
      endDate: endDate,
      startTime: null,
      endTime: null
    })
  }

  _getSummaryData(props, refreshTagStatus = false) {
    let d2j = CommonFuns.DataConverter.DatetimeToJson,
      start = d2j(this.state.start, false),
      end = d2j(this.state.end, false);
    DataQualityMaintenanceAction.getNodeSummary(props.selectedNode.get('Id'), props.selectedNode.get('NodeType'), props.anomalyType,start, end);
    this.setState({
      isLoading: true,
    })
  }

  _onChanged() {
    this.setState({
      data: DataQualityMaintenanceStore.getVEESummary(),
      isLoading: false,
    })
  }

  _onUpdate() {
    this._getSummaryData(this.props, true);
  }

  _onSwitchRawDataView() {
    var rawDataStatus = this.state.isRawData;
    this.setState({
      data: !rawDataStatus ? TagStore.getRawData() : TagStore.getDifferenceData(),
      isLoading: false,
      isRawData: !rawDataStatus,
    })
  }

  _onDateSelectorChanged(startDate, endDate, startTime, endTime) {
    let that = this,
      dateSelector = this.refs.dateTimeSelector,
      timeRange = dateSelector.getDateTime();
    if (timeRange.end - timeRange.start > 30 * 24 * 60 * 60 * 1000) {
      let isStart = dateSelector.getTimeType();
      if (isStart) {
        endDate = dateAdd(startDate, 30, 'days');
        endTime = startTime;
        timeRange.end = new Date(endDate.setHours(endTime, 0, 0, 0));
      } else {
        //jacob 2016-04-05: 开始时间不能出现24点
        startDate = dateAdd(endDate, -30, 'days');
        startTime = endTime;
        if(endTime==24)
        {
          startTime = 0;
          startDate = dateAdd(startDate, 1, 'days');
        }
        timeRange.start = new Date(startDate.setHours(startTime, 0, 0, 0));
      }
    }

    this.setState({
      start: timeRange.start,
      end: timeRange.end,
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime
    }, () => {
      that._getSummaryData(that.props)
    })

  }

  _renderToolBar() {
    return (
      <div className='jazz-ptag-rawdata-toolbar'>
        <div className='leftside' style={{marginLeft:'-20px'}}>
        <DateTimeSelector ref='dateTimeSelector' isDateViewStatus={true} showTime={true} endLeft='-100px'     startDate= {this.state.startDate}
      endDate={this.state.endDate}
      startTime={this.state.startTime}
      endTime={this.state.endTime}  _onDateSelectorChanged={this._onDateSelectorChanged}/>
        </div>
      </div>
      )
  }

    _renderComment() {
    return (
      <div className='jazz-ptag-rawdata-comment'>
        <div className='item'>
          <label className='normal-circle'/>
          <div className='label'>{I18N.VEE.normal}</div>
        </div>
        <div className='item'>
          <label className='abnormal-circle'/>
          <div className='label'>{I18N.VEE.SummaryAbnormal}</div>
        </div>
      </div>
      )
  }

  _renderChartComponent() {
    let d2j = CommonFuns.DataConverter.DatetimeToJson,
      start = d2j(this.state.start, false),
      end = d2j(this.state.end, false);
    let obj = {
      start: start,
      end: end,
      step: this.props.selectedNode.get('CalculationStep'),
      timeRanges: [{
        StartTime: start,
        EndTime: end
      }]
    };
    // var dataForChart = TagStore.getDataForChart(this.state.data.toJS(), obj);
    // var chartProps = {
    //   ref: 'ChartComponent',
    //   energyData: dataForChart,
    //   energyRawData: this.state.data,
    //   step: obj.step,
    //   startTime: obj.start,
    //   endTime: obj.end,
    //   timeRanges: obj.timeRanges,
    //   refresh: this.state.refresh
    // };
    /*if (this.state.data.size === 0) {
      return (
        <div style={{
          display: 'flex',
          'flexDirection': 'column',
          flex: '1'
        }}>
        </div>
        )
    } else {*/
      return (
        <div style={{
          display: 'flex',
          'flexDirection': 'column',
          flex: '1',
          marginTop:'20px'
        }}>
          <ChartComponent data={this.state.data} name={this.props.selectedNode.get("Name")}/>
          {this._renderComment()}
        </div>
        )
    // }

  }


  componentDidMount() {
    DataQualityMaintenanceStore.addChangeListener(this._onChanged);
    if(this.props.anomalyType===0){
      this.setState({
        data:Immutable.fromJS([]),
        isLoading:false
      })
    }else{
      this._getSummaryData(this.props, true);
    }
    
  }

    componentWillReceiveProps(nextProps) {
    var that = this;
    if (!nextProps.selectedNode.equals(this.props.selectedNode) || nextProps.anomalyType!==this.props.anomalyType) {
        if(nextProps.anomalyType===0){
          this.setState({
            data:Immutable.fromJS([]),
            isLoading:false
          })
        }else{
          that._getSummaryData(nextProps, true)
        }
        
    }
    // || this.props.showRawDataList !== nextProps.showRawDataList
    if (this.props.showLeft !== nextProps.showLeft ) {
      this.setState({
        refresh: true
      })
    } else {
      if (this.state.refresh === true) {
        this.setState({
          refresh: false
        })
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    //  || this.props.showLeft !== nextProps.showLeft || this.props.showRawDataList !== nextProps.showRawDataList || 
    return (nextProps.selectedNode !== this.props.selectedNode || nextProps.anomalyType !== this.props.anomalyType || this.props.showLeft !== nextProps.showLeft || !Immutable.fromJS(nextState).equals(Immutable.fromJS(this.state)));
  }
  componentWillUnmount() {
    DataQualityMaintenanceStore.removeChangeListener(this._onChanged);
  }



  render() {

    if (this.state.isLoading) {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center'
        }}>
                    <Spin/>
                  </div>
        )

    } else {
      return (
        <div className='jazz-ptag-rawdata'>
            {this._renderToolBar()}
            {this._renderChartComponent()}
          </div>
        )
    }


  }

}

SummaryChart.propTypes= {
  selectedNode:PropTypes.object,
  showLeft:PropTypes.bool,
  anomalyType:PropTypes.number,
};