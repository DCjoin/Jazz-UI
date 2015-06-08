'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, RaisedButton, DatePicker} from 'material-ui';
import assign from "object-assign";
import {hourPickerData} from '../../util/Util.jsx';
import EnergyStore from '../../stores/EnergyStore.jsx';

import YaxisSelector from '../energy/YaxisSelector.jsx';
import StepSelector from '../energy/StepSelector.jsx';
import ChartComponent from '../energy/ChartComponent.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';

const searchDate = [{value:'Customerize',text:'自定义'},{value: 'Last7Day', text: '最近7天'}, {value: 'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
 {value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'}, {value: 'LastWeek', text: '上周'},
 {value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];

const dateTime = hourPickerData();

let ChartPanel = React.createClass({
    mixins:[Navigation,State],

    _onLoadingStatusChange(){
      let isLoading = EnergyStore.getLoadingStatus();
      let paramsObj = EnergyStore.getParamsObj();
      paramsObj.isLoading = isLoading;
      paramsObj.hierName = EnergyStore.getHierName();

      this.setState(paramsObj);
    },
    _onEnergyDataChange(){
      let isLoading = EnergyStore.getLoadingStatus();
      let energyData = EnergyStore.getEnergyData();
      let paramsObj = EnergyStore.getParamsObj();
      this.setState({ isLoading: isLoading,
                      energyData: energyData,
                      paramsObj: paramsObj});
    },
    _onStepChange(step){
      let paramsObj = EnergyStore.getParamsObj();
      let tagIds = paramsObj.tagIds,
          timeRanges = paramsObj.timeRanges;

      this.setState({step:step});
      AlarmAction.getAlarmTagData(tagIds, timeRanges, step);
    },
    _initYaxisDialog(){
      var chartCmp = this.refs.ChartComponent;
      var chartObj = chartCmp.refs.highstock.getPaper();

      return chartObj;
    },
    getInitialState() {
        return {
          isLoading: false,
          energyData: null,
          hierName: null,
          submitParams: null,
          step: 2
        };
    },
    render: function () {
      let date = new Date();
      let me = this;
      let energyPart=null;
      if(this.state.isLoading){
        energyPart = <div style={{margin:'auto'}}>{'loading...'}</div>;
      }else if(!!this.state.energyData){
        energyPart = <div style={{flex:1, display:'flex', 'flex-direction':'column', marginBottom:'20px'}}>
                        <div style={{display:'flex'}}>
                          <YaxisSelector initYaxisDialog={me._initYaxisDialog}/>
                          <StepSelector stepValue={me.state.step} onStepChange={me._onStepChange}/>

                        </div>
                        <ChartComponent ref='ChartComponent' energyData={this.state.energyData} {...this.state.paramsObj}/>
                      </div>;
      }
      let title = null;
      if(me.state.hierName){
        var uom='';
        if(me.state.step ==1) {
          uom = '小时';
        }else if(me.state.step ==2){
          uom = '日';
        }else if(me.state.step == 3){
          uom = '月';
        }
        title = <span >{me.state.hierName + uom + '能耗报警'}</span>;
        title =  <div style={{height:'30px'}}>
            {title}
            <i className='fa fa-floppy-o' style={{'marginLeft':'10px'}}></i>
          </div>;
      }

      return (
        <div style={{flex:1, display:'flex','flex-direction':'column', marginLeft:'10px'}}>
          {title}
          <div style={{display:'flex', 'flexFlow':'row', 'alignItems':'center', height:'60px'}}>
            <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'140px'}}></DropDownMenu>
            <DatePicker className='jazz-alarm-datepicker' defaultDate={date} ref='startDate' style={{width:'90px', padding:'13px 0'}}/>
            <DropDownMenu menuItems={dateTime} ref='startTime'></DropDownMenu>
            <span style={{'marginLeft':'10px'}}> {'到'} </span>
            <DatePicker className='jazz-alarm-datepicker' defaultDate={date} ref='endDate' style={{width:'90px', padding:'13px 0', marginLeft:'10px'}}/>
            <DropDownMenu menuItems={dateTime} ref='endTime'></DropDownMenu>
            <RaisedButton label='查看' secondary={true} ref='searchBtn'/>
          </div>
          {energyPart}
        </div>
      );
  },
  componentDidMount: function() {
    EnergyStore.addTagDataLoadingListener(this._onLoadingStatusChange);
    EnergyStore.addTagDataChangeListener(this._onEnergyDataChange);
  },
  componentWillUnmount: function() {
    EnergyStore.removeTagDataLoadingListener(this._onLoadingStatusChange);
    EnergyStore.removeTagDataChangeListener(this._onEnergyDataChange);
  }
});

module.exports = ChartPanel;
