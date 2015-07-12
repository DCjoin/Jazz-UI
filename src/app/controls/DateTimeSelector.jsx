'use strict';
import React from "react";
import {DropDownMenu, DatePicker} from 'material-ui';
import CommonFuns from '../util/Util.jsx';
import ViewableDatePicker from '../controls/ViewableDatePicker.jsx';

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

    startField.setValue(startDate);
    endField.setValue(endDate);

    startTimeField.setState({selectedIndex:startTime});
    endTimeField.setState({selectedIndex:endTime});
  },
  getDateTime(){
    let startField = this.refs.startDate,
        startTimeField = this.refs.startTime,
        endField = this.refs.endDate,
        endTimeField = this.refs.endTime;

    let startDate = this.refs.startDate.getValue(),
        endDate = this.refs.endDate.getValue();

    startDate.setHours(startTimeField.state.selectedIndex, 0, 0);
    endDate.setHours(endTimeField.state.selectedIndex, 0, 0);
    return {start: startDate, end: endDate};
  },
  render(){
    let date = new Date();
    var startTimeProps = {
      errorMessage: "日期不能早于2010-1-1",
      defaultValue: this.props.startDate || date,
      style: {
        width:'95px',
        height:'32px',
        fontSize: '14px',
        fontFamily: 'Microsoft YaHei'
      },
      onChange: this.props._onDateSelectorChanged
    };
    var startDate = <ViewableDatePicker ref="startDate" {...startTimeProps}/>;
    var endTimeProps = {
      errorMessage: "日期不能早于2010-1-1",
      defaultValue: this.props.endDate || date,
      style: {
        width:'95px',
        height:'32px',
        fontSize: '14px',
        fontFamily: 'Microsoft YaHei'
      },
      onChange: this.props._onDateSelectorChanged
    };
    var endDate = <ViewableDatePicker ref="endDate" {...endTimeProps}/>;

    return <div style={{display:'flex',flexDirection:'row', alignItems:'center', backgroundColor:'#fbfbfb'}}>
      <div className={'jazz-full-border-datepicker-container'}>
        {startDate}
      </div>
      <div className={'jazz-full-border-dropdownmenu-time-container'}>
        <DropDownMenu menuItems={dateTime} ref='startTime' style={{width:'76px'}} onChange={this.props._onDateSelectorChanged}></DropDownMenu>
      </div>
      <span> {'到'} </span>
      <div className={'jazz-full-border-datepicker-container'}>
        {endDate}
      </div>
      <div className={'jazz-full-border-dropdownmenu-time-container'}>
        <DropDownMenu menuItems={dateTime} ref='endTime' style={{width:'76px'}} onChange={this.props._onDateSelectorChanged}></DropDownMenu>
      </div>
    </div>;

  }
});
module.exports = DateTimeSelector;
