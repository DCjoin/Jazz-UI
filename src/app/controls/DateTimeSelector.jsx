'use strict';
import React from "react";
import {DropDownMenu, DatePicker} from 'material-ui';
import CommonFuns from '../util/Util.jsx';
import ViewableDatePicker from '../controls/ViewableDatePicker.jsx';

let {hourPickerData, dateAdd} = CommonFuns;

const startDateTime = hourPickerData(0, 23);
const endDateTime = hourPickerData(1, 24);

let DateTimeSelector = React.createClass({

  setDateField(startDate, endDate){
    let startField = this.refs.startDate,
        startTimeField = this.refs.startTime,
        endField = this.refs.endDate,
        endTimeField = this.refs.endTime;

    let startTime = startDate.getHours(),
        endTime = endDate.getHours();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    if(endTime === 0){
       endDate = dateAdd(endDate, -1, 'days');
       endTime = 24;
    }

    startField.setValue(startDate);
    endField.setValue(endDate);
    this.setState({
      startDate: startDate,
      endDate: endDate
    });
    startTimeField.setState({selectedIndex:startTime});
    endTimeField.setState({selectedIndex:endTime-1});
  },
  getDateTime(){
    let startField = this.refs.startDate,
        startTimeField = this.refs.startTime,
        endField = this.refs.endDate,
        endTimeField = this.refs.endTime;

    let startDate = startField.getValue(),
        endDate = endField.getValue();

    startDate.setHours(startTimeField.state.selectedIndex, 0, 0, 0);
    if(endTimeField.state.selectedIndex === 23){
      endDate = dateAdd(endDate, 1, 'days');
      endDate.setHours(0, 0, 0, 0);
    }
    else{
      endDate.setHours(endTimeField.state.selectedIndex+1, 0, 0, 0);
    }
    return {start: startDate, end: endDate};
  },
  _onChangeDateTime: function(sd, st, ed, et){
    this.props._onDateSelectorChanged();
    var startDate = sd, startTime = st, endDate = ed, endTime = et;
    if(sd === null) startDate = this.refs.startDate.getValue();
    if(st === null) startTime = this.refs.startTime.state.selectedIndex;
    if(ed === null) endDate = this.refs.endDate.getValue();
    if(et === null) endTime = this.refs.endTime.state.selectedIndex;

    startDate.setHours(startTime, 0, 0, 0);
    if(endTime === 23){
      endDate = dateAdd(endDate, 1, 'days');
      endDate.setHours(0, 0, 0, 0);
    }
    else{
      endDate.setHours(endTime+1, 0, 0, 0);
    }
    if(startDate.getTime()>= endDate.getTime()){
       if((sd !== null) || (st !== null)){
         endDate = dateAdd(startDate, 1, 'hours');
       }
       else if((ed !== null) || (et !== null)){
         startDate = dateAdd(endDate, -1, 'hours');
       }
    }
    this.setDateField(startDate, endDate);
  },
  getInitialState: function(){
    return {
      startDate: null,
      endDate: null
    };
  },
  render(){
    var me = this;
    var dateStyle = {
      width:'112px',
      height:'32px',
      fontSize: '14px',
      fontFamily: 'Microsoft YaHei'
    };
    var startDateProps = {
      dateFormatStr: 'YYYY/MM/DD',
      defaultValue: this.state.startDate,
      style: dateStyle,
      onChange: function(e, v){
        me._onChangeDateTime(v, null, null, null);
      }
    };
    var endDateProps = {
      dateFormatStr: 'YYYY/MM/DD',
      defaultValue: this.state.endDate,
      style: dateStyle,
      onChange: function(e, v){
        me._onChangeDateTime(null, null, v, null);
      }
    };
    var startTimeProps = {
      menuItems: startDateTime,
      style: {width: '76px'},
      onChange: function(e, selectedIndex, menuItem){
        me._onChangeDateTime(null, selectedIndex, null, null);
      }
    };
    var endTimeProps = {
      menuItems: endDateTime,
      style: {width: '76px'},
      onChange: function(e, selectedIndex, menuItem){
        me._onChangeDateTime(null, null, null, selectedIndex);
      }
    };
    return <div style={{display:'flex',flexDirection:'row', alignItems:'center', backgroundColor:'#fbfbfb'}}>
      <div className={'jazz-full-border-datepicker-container'}>
        <ViewableDatePicker ref="startDate" {...startDateProps}/>
      </div>
      <div className={'jazz-full-border-dropdownmenu-time-container'}>
        <DropDownMenu ref='startTime' {...startTimeProps}></DropDownMenu>
      </div>
      <span> {'到'} </span>
      <div className={'jazz-full-border-datepicker-container'}>
        <ViewableDatePicker ref="endDate" {...endDateProps}/>
      </div>
      <div className={'jazz-full-border-dropdownmenu-time-container'}>
        <DropDownMenu ref='endTime' {...endTimeProps}></DropDownMenu>
      </div>
    </div>;

  }
});
module.exports = DateTimeSelector;
