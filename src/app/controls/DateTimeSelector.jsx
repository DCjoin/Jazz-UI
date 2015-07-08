'use strict';
import React from "react";
import {DropDownMenu, DatePicker} from 'material-ui';
import CommonFuns from '../util/Util.jsx';

let {hourPickerData} = CommonFuns;

const dateTime = hourPickerData();

let DateTimeSelector = React.createClass({

  setDateField(startDate, endDate){
    let startField = this.refs.startDate,
        startTimeField = this.refs.startTime,
        endField = this.refs.endDate,
        endTimeField = this.refs.endTime;

    let startTime = startDate.getHours(),
        endTime = endDate.getHours();

    startDate.setHours(0,0,0);
    endDate.setHours(0,0,0);

    startField.setDate(startDate);
    endField.setDate(endDate);

    startTimeField.setState({selectedIndex:startTime});
    endTimeField.setState({selectedIndex:endTime});
  },
  getDateTime(){
    let startField = this.refs.startDate,
        startTimeField = this.refs.startTime,
        endField = this.refs.endDate,
        endTimeField = this.refs.endTime;

    let startDate = this.refs.startDate.getDate(),
        endDate = this.refs.endDate.getDate();

    startDate.setHours(startTimeField.state.selectedIndex, 0, 0);
    endDate.setHours(endTimeField.state.selectedIndex, 0, 0);
    return {start: startDate, end: endDate};
  },
  render(){
    let date = new Date();

    return <div style={{display:'flex',flexDirection:'row', alignItems:'center', backgroundColor:'#fbfbfb'}}>
      <div className={'jazz-full-border-datepicker-container'}>
        <DatePicker defaultDate={date} ref='startDate' style={{width:'85px', height:'32px',marginLeft:'10px'}} onChange={this.props._onDateSelectorChanged}/>
      </div>
      <div className={'jazz-full-border-dropdownmenu-time-container'}>
        <DropDownMenu menuItems={dateTime} ref='startTime' style={{width:'76px'}} onChange={this.props._onDateSelectorChanged}></DropDownMenu>
      </div>
      <span> {'到'} </span>
      <div className={'jazz-full-border-datepicker-container'}>
        <DatePicker defaultDate={date} ref='endDate' style={{width:'85px', height:'32px', marginLeft:'10px'}} onChange={this.props._onDateSelectorChanged}/>
      </div>
      <div className={'jazz-full-border-dropdownmenu-time-container'}>
        <DropDownMenu menuItems={dateTime} ref='endTime' style={{width:'76px'}} onChange={this.props._onDateSelectorChanged}></DropDownMenu>
      </div>
    </div>;

  }
});
module.exports = DateTimeSelector;
