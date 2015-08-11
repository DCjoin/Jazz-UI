'use strict';
import React from "react";
import {DropDownMenu, DatePicker} from 'material-ui';
import CommonFuns from '../util/Util.jsx';
import ViewableDatePicker from '../controls/ViewableDatePicker.jsx';

let {hourPickerData, dateAdd} = CommonFuns;

let DateTimeSelector = React.createClass({

  setDateField(startDate, endDate){
    let startField = this.refs.startDate,
        endField = this.refs.endDate;

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    startField.setValue(startDate);
    endField.setValue(endDate);
    this.setState({
      startDate: startDate,
      endDate: endDate
    });
  },
  getDateTime(){
    let startField = this.refs.startDate,
        endField = this.refs.endDate;

    let startDate = startField.getValue(),
        endDate = endField.getValue();

    return {start: startDate, end: endDate};
  },
  _onChangeDateTime: function(sd, ed){
    this.props._onDateSelectorChanged();
    var startDate = sd, endDate = ed;
    if(sd === null) startDate = this.refs.startDate.getValue();
    if(ed === null) endDate = this.refs.endDate.getValue();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if(startDate.getTime() >= endDate.getTime()){
       if(sd !== null){
         endDate = dateAdd(startDate, 1, 'days');
       }
       else if(ed !== null){
         startDate = dateAdd(endDate, -1, 'days');
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
        me._onChangeDateTime(v, null);
      }
    };
    var endDateProps = {
      dateFormatStr: 'YYYY/MM/DD',
      defaultValue: this.state.endDate,
      style: dateStyle,
      onChange: function(e, v){
        me._onChangeDateTime(null, v);
      }
    };
    return <div style={{display:'flex',flexDirection:'row', alignItems:'center', backgroundColor:'#fbfbfb'}}>
      <div className={'jazz-full-border-datepicker-container'}>
        <ViewableDatePicker ref="startDate" {...startDateProps}/>
      </div>
      <span> {'到'} </span>
      <div className={'jazz-full-border-datepicker-container'}>
        <ViewableDatePicker ref="endDate" {...endDateProps}/>
      </div>
    </div>;

  }
});
module.exports = DateTimeSelector;
