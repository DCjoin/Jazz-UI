'use strict';

import React from 'react';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import ClickAway from './ClickAwayListener.jsx';
import CalendarToolbar from './calendar/CalendarToolbar.jsx';
import CalendarMonthView from './calendar/CalendarMonthView.jsx';
import CalendarYearView from './calendar/CalendarYearView.jsx';
const pattern1 = /^\d{4}-\d{2}$/;
const format1 = "YYYY-MM";
const pattern2 = /^\d{4}\/\d{2}$/;
const format2 = "YYYY/MM";
const pattern3 = /^\d{4}\d{2}$/;
const format3 = "YYYYMM";

class DatePicker extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    locale:React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this._onRangeChange = this._onRangeChange.bind(this);
  }

  state = {
    currentDate:this.props.value || new Date(),
    viewMode: "month"
  };

  static defaultProps = {
    locale: navigator.language || "zh-cn"
  };

  _onChange(currentDate){
    this.props.onChange(currentDate)
  }

  _onRangeChange(currentDate, viewMode){
    viewMode = currentDate===null?viewMode || this.state.viewMode:'month';
    currentDate = currentDate || this.state.currentDate;

  	this.setState({currentDate, viewMode});
  }

  _renderCalendarView(){
  if (this.state.viewMode === "month"){
  		return (
  			<CalendarMonthView
        locale={this.props.locale}
        onChange={this._onChange}
        currentDate={this.state.currentDate}  />
  		);
  	}else if (this.state.viewMode === "year"){
  		return (
  			<CalendarYearView
  			onChange={this._onRangeChange}
  			currentDate={this.state.currentDate} />
  		);
  	}
  	return null;
  }

  render() {
    return (
      <div className="calendar">
        <CalendarToolbar
          displayActionButton={false}
        currentDate={this.state.currentDate}
        onChange={this._onRangeChange}
        locale={this.props.locale}  ></CalendarToolbar>
      {this._renderCalendarView()}
      </div>
    );
  }
}
@ClickAway
export default class MonthPicker extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    title: React.PropTypes.string,
    name: React.PropTypes.string,
    minDate: React.PropTypes.object,
    minDateError: React.PropTypes.string,
    maxDate: React.PropTypes.object,
    maxDateError: React.PropTypes.string,
    errorText:React.PropTypes.string,
    width: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
  };

  constructor(props) {
    super(props);
    this._onDateChange = this._onDateChange.bind(this);
  }

  state = {
    "popup":false,
    value:this.props.value
  };

  static defaultProps = {
    value: moment(new Date()).format("YYYY/MM"),
    minDate: moment(new Date()).add(-5,'y'),
    maxDate: moment(new Date()).add(5,'y')
  };


  _onDateChange(selectedDate){
    this._onDateTextChange(moment(selectedDate).format("YYYY/MM"));
  }

  _onDateTextChange(dateStr){
    var isNullDate = ( dateStr === "" || dateStr === null || dateStr === undefined);
    var validDateObject = isNullDate?null:parseDateStr(dateStr);
    var inRange = 0;
    if (isNullDate){
        this.setState({
          popup:true,
          value:dateStr
        });
        this.props.onChange(dateStr);
    }else if(!validDateObject){
        this.setState({
          popup:false,
          value:dateStr
        });
        this.props.onChange(dateStr,true);
    }else{
        this.setState({
          popup:false,
          value:validDateObject.format("YYYY/MM")});
        inRange = isInRange(validDateObject.toDate(), this.props.minDate, this.props.maxDate);
        this.props.onChange(validDateObject.format("YYYYMM"), !validDateObject || inRange!==0);
    }

  }

  _renderPopup(dateObject){
    if (this.state.popup){
        return (
            <div className="datepicker-popup"  >
                <DatePicker onChange={this._onDateChange} value={dateObject}/>
            </div>
        );
    }
    return null;
  }

  _renderTextField(error){
    var style = {width: this.props.width || 430}
    var value = this.state.value===null?'':this.state.value;
    return (
      <div >
        <TextField
        className="jazz-month-picker-noempty"
        style={style}
        // errorStyle={{position:'absolute',bottom:"-10px"}}
        floatingLabelText={this.props.title}
        name={this.props.name}
        errorText={error}
        onChange={(evt)=>{
            this._onDateTextChange(evt.target.value);
        }}
        value={value}
        floatingLabelFocusStyle={{fontSize:'19px'}}
        onFocus={()=>{this.setState({popup:true})}} />
      </div>
    );
  }

  onClickAway(evt){
    this.setState({popup:false});
  }

  render() {
    var isNullDate = ( this.props.value === "" || this.props.value === null || this.props.value === undefined);
    var validDateObject = isNullDate?null:parseDateStr(this.props.value);
    var error,dateObject;
    if (isNullDate){
      //no actions so far
    }else if(!validDateObject){
        error = "请输入日期格式YYYY/MM";
    }else{
        if (isInRange(validDateObject.toDate(), this.props.minDate, this.props.maxDate) >0){
            error = this.props.maxDateError || "日期不能晚于" + moment(this.props.maxDate).format("YYYY-MM-DD") ;
        }else if (isInRange(validDateObject.toDate(), this.props.minDate, this.props.maxDate) <0){
            error = this.props.minDateError || "日期不能早于" + moment(this.props.minDate).format("YYYY-MM-DD") ;
        }
        dateObject = validDateObject.toDate();
    }

    if (this.props.errorText){
      error = this.props.errorText;
    }
    return (
      <div className="jazz-month-picker">
        {this._renderTextField(error)}
        {this._renderPopup(dateObject)}
      </div>
    );
  }
}

function parseDateStr(dateStr){
    var value = null;
    if (pattern1.test(dateStr)){
        value = moment(dateStr, format1);
    }else if (pattern2.test(dateStr)){
        value = moment(dateStr, format2);
    }else if (pattern3.test(dateStr)){
        value = moment(dateStr, format3);
    }
    if (value && value.isValid()){
        return value;
    }
    return null;
}
function isInRange (date, minDate, maxDate){
    if (maxDate) {
        var maxDate = maxDate.toDate();
        if (maxDate < date){
            return 1;
        }
    }
    if (minDate) {
        var minDate = minDate.toDate();
        if (minDate > date){
            return -1;
        }
    }
    return 0;
}
