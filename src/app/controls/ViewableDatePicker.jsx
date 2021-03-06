'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import moment from 'moment';
import Calendar from './calendar/Calendar.jsx';
import ClickAway from './ClickAwayListener.jsx';
import PropTypes from 'prop-types';
import classnames from 'classnames';
const pattern1 = /^\d{4}-\d{2}-\d{2}$/;
const format1 = "YYYY-MM-DD";
const pattern2 = /^\d{4}\/\d{2}\/\d{2}$/;
const format2 = "YYYY/MM/DD";
const pattern3 = /^\d{4}\d{2}\d{2}$/;
const format3 = "YYYYMMDD";
const pattern4 = /^\d{2}-\d{2}$/;
const format4 = "MM-DD";

function isValid(dateStr, minDate, maxDate){
  var isNullDate = ( dateStr === "" || dateStr === null || dateStr === undefined);
  if (isNullDate){
    return true;
  }
  var validDateObject = parseDateStr(dateStr);
  if (validDateObject){
    return isInRange(validDateObject.toDate(), minDate, maxDate) === 0;
  }
  return false;
}

function isInRange (date, minDate, maxDate){
    if (maxDate) {
        var maxDate = moment(
            [maxDate.getFullYear(),
            maxDate.getMonth(),
            maxDate.getDate()
            ]).toDate();
        if (maxDate < date){
            return 1;
        }
    }
    if (minDate) {
        var minDate = moment(
            [minDate.getFullYear(),
            minDate.getMonth(),
            minDate.getDate()
            ]).toDate();
        if (minDate > date){
            return -1;
        }
    }
    return 0;
}

function parseDateStr(dateStr){
    var value = null;
    if (pattern1.test(dateStr)){
        value = moment(dateStr, format1);
    }else if (pattern2.test(dateStr)){
        value = moment(dateStr, format2);
    }else if (pattern3.test(dateStr)){
        value = moment(dateStr, format3);
    } else if (pattern4.test(dateStr)){
        value = moment(dateStr, format4);
    }
    if (value && value.isValid()){
        return value;
    }
    return null;
}

@ClickAway
class DatePicker extends React.Component {
  static propTypes= {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
    minDate: PropTypes.object,
    minDateError: PropTypes.string,
    maxDate: PropTypes.object,
    maxDateError: PropTypes.string,
    errorText:PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number.string]),
    datePickerClassName:PropTypes.string,
    isPopover: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this._onDateChange = this._onDateChange.bind(this);
  }

  state = {
    "popup":false
  };

  _onDateChange(selectedDate){
    this._onDateTextChange(moment(selectedDate).format("YYYY-MM-DD"));
  }

  _onDateTextChange(dateStr){
    var isNullDate = ( dateStr === "" || dateStr === null || dateStr === undefined);
    var validDateObject = isNullDate?null:parseDateStr(dateStr);
    var inRange = 0;
    if (isNullDate){
        this.setState({popup:true});
        this.props.onChange(dateStr);
    }else if(!validDateObject){
        this.setState({popup:false});
        this.props.onChange(dateStr,true);
    }else{
        this.setState({popup:false});
        inRange = isInRange(validDateObject.toDate(), this.props.minDate, this.props.maxDate);
        this.props.onChange(validDateObject.format("YYYY-MM-DD"), !validDateObject || inRange!==0);
    }

  }

  _renderPopup(dateObject){
    if (this.state.popup){
      if( this.props.isPopover ) {
        return (<Popover
          style={{width:'100px'}}
          open={true}
          anchorEl={ReactDOM.findDOMNode(this)}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={() => {
            this.setState({popup:false});
          }}
        >
          <Calendar onChange={this._onDateChange} value={dateObject} shouldDisableDate={this.props.shouldDisableDate}/>
        </Popover>);
      } else {
        return (
            <div className="datepicker-popup"  >
                <Calendar onChange={this._onDateChange} value={dateObject} shouldDisableDate={this.props.shouldDisableDate}/>
            </div>
        );
      }
    }
    return null;
  }

  _renderTextField(error){
    var style = {width: this.props.width || 430}
    var value = this.props.value===null?'':this.props.value;
    return (
      <div >
        <TextField
        disabled={this.props.disabled}
        className="jazz-month-picker-noempty"
        style={style}
        // errorStyle={{position:'absolute',bottom:"-10px"}}
        floatingLabelText={this.props.title}
        hintText={this.props.hintText}
        name={this.props.name}
        errorText={error}
        onChange={(evt)=>{
            this._onDateTextChange(evt.target.value);
        }}
        value={value}
        floatingLabelFocusStyle={{fontSize:'19px'}}
        onFocus={()=>{!this.props.disabled && this.setState({popup:true})}} />
      </div>
    );
  }

  onClickAway(evt){
    if(!this.props.isPopover) {
      this.setState({popup:false});
    }
  }

  render() {
    var isNullDate = ( this.props.value === "" || this.props.value === null || this.props.value === undefined);
    var validDateObject = isNullDate?null:parseDateStr(this.props.value);
    var error,dateObject;
    if (isNullDate){
      //no actions so far
    }else if(!validDateObject){
        error = "请输入日期格式YYYY-MM-DD";
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

    var style = {width: this.props.width || 430,
      height: '30px',display: 'flex',justifyContent: 'center',alignItems: 'center',
    backgroundColor:this.props.disabled?'#f2f2f2':'#ffffff'}

    return (
      <div className={this.props.datePickerClassName}>
        {this.props.isDateEdited?this._renderTextField(error):<div className={classnames({"jazz-viewableDatePicker":true,"jazz-viewableTextField":true,'disabled':this.props.disabled})}
        style={style} onClick={!this.props.disabled?()=>{this.setState({popup:true})}:()=>{}}>
                <div className="jazz-viewable-title" >{this.props.title}</div>
                <div style={{fontSize:'14px',color:this.props.disabled?'#c0c0c0':'#626469'}}>{this.props.value}</div>
              </div>}
        {this._renderPopup(dateObject)}
      </div>
    );
  }
}

export default class ViewableDatePicker extends React.Component {
  static propTypes= {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    title: PropTypes.string,
    minDate: PropTypes.object,
    minDateError: PropTypes.string,
    maxDate: PropTypes.object,
    maxDateError: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number.string]),
    isViewStatus: PropTypes.bool,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    errorText: PropTypes.string,
    dateFormatStr:PropTypes.string
  };

  static isValid = (dateStr, minDate, maxDate) => {
    return isValid(dateStr, minDate, maxDate);
  };

  static isInRange = (date, minDate, maxDate) => {
    return isInRange(date, minDate, maxDate);
  };
  static defaultProps  = {
    dateFormatStr: 'YYYY年MM月DD日'
  };

  formatDateStr(date){
      if(date){
          return moment(date).format(this.props.dateFormatStr);
      }
      return '';
  }

  render(){
    if (this.props.isViewStatus){
      var style = {width: this.props.width || 430};
      if(!this.props.value){
            style.display='none';
      }
      return (<div className="jazz-viewableDatePicker jazz-viewableTextField" style={style}>
                <div className="jazz-viewable-title" >{this.props.title}</div>
                <div className="jazz-viewable-value">{this.formatDateStr(this.props.value)}</div>
              </div>);
    }else{
      return <DatePicker {...this.props} />
    }
  }
}

ViewableDatePicker.defaultProps={
  isDateEdited:true
}
// const DISPLAY_FORMAT = "YYYY年MM月DD日";
// function formatDateStr(date){
//     if(date){
//         return moment(date).format(DISPLAY_FORMAT);
//     }
//     return '';
// }
