'use strict';

import React from 'react';
import mui from 'material-ui';
import classSet from 'classnames';
import util from '../util/util.jsx';
import moment from 'moment';
//import Calendar from '../../../node_modules/material-ui/lib/date-picker/calendar.js';
import Calendar from '../controls/Calendar.jsx';
let { DatePicker,TextField,Mixins } = mui;
let {ClickAwayable} = Mixins;
var ViewableDatePicker = React.createClass({
    mixins:[ClickAwayable],
    propTypes: {
        isViewStatus: React.PropTypes.bool,
        defaultValue: React.PropTypes.object,//date
        defaultTime: React.PropTypes.number,
        minDate: React.PropTypes.object,
        maxDate: React.PropTypes.object,
        dateFormatStr: React.PropTypes.string,
        showTime: React.PropTypes.bool,
        timeType: React.PropTypes.number
    },

    getDefaultProps: function(){
      return {
        dateFormatStr: "YYYY/MM/DD/",
        timeType: 0,
        defaultTime: 0,
        showTime: false
      };
    },

    getInitialState: function() {
        return {
            curDate: this.props.defaultValue,
            curTime: this.props.defaultTime,
            showCalendar:false
        };
    },
    componentWillReceiveProps: function(nextProps) {
      if(this.props.defaultValue !== nextProps.defaultValue){
        this.setState({curDate:nextProps.defaultValue});
      }
      if(this.props.defaultTime !== nextProps.defaultTime){
        this.setState({curTime:nextProps.defaultTime});
      }
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if(this.props.isViewStatus == nextProps.isViewStatus &&
            this.state.curDate == nextProps.defaultValue &&
            this.state.curDate == nextState.curDate &&
            this.state.curTime == nextProps.defaultTime &&
            this.state.curTime == nextState.curTime &&
            this.state.showCalendar == nextState.showCalendar  ){
                return false;
            }
            return true;

        },
    componentClickAway(){
        this.setState({showCalendar:false});
    },
    _onSelectedDate(date){
        this.setState({curDate:date,showCalendar:false});
        //To kill 'Z' char from date format  eg. "2015-06-12T08:35:02.467Z" => "2015-06-12T08:35:02.467"
        var str = date.toISOString();
        str = str.substring(0, str.length-1);
        if(this.props.didChanged){
            this.props.didChanged(str);
        }
        if(this.props.onChange){
          this.props.onChange(this, date);
        }
    },
    _onSelectedTime(time){
      this.setState({curTime:time});
      if(this.props.onSelectedTime){
        this.props.onSelectedTime(this, time);
      }
    },
    _handleChange: function(date1, date2){
        if(!!date2){
            this.setState({ curDate: date2 });
        }
    },

    getValue: function(){
        if(this.refs.TextField){
            var d = new Date(this.state.curDate);
            var m = moment(d).add(d.getTimezoneOffset()*-1/60,'h');
            return m.toDate();
        }
    },
    setValue: function(value){
      this.setState({curDate: value});
    },
    getTime: function(){
        if(this.props.showTime){
            return this.state.curTime;
        }
    },
    setTime: function(value){
      this.setState({curTime: value});
    },
    _onFocus(e){
         e.stopPropagation();
         e.preventDefault();
        if(!this.state.showCalendar){
            this.setState({showCalendar:true});
        }
    },
    _onBlur(){
        //this.setState({showCalendar:false});
    },
    _clearTime:function(){
      this.setState({
        curDate:'',
        curTime:this.props.timeType
      });
    },
    _formatDate(date){
        if(date){
          return moment(new Date(date)).format(this.props.dateFormatStr);
        }
        return '';
    },
    _onChange(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({curDate:this.state.curDate});
    },
    componentDidUpdate: function(prevProps, prevState) {
        if(this.state.showCalendar){
            //this.refs.calendar.getDOMNode().children[1].style.display = 'none';
            // this.refs.calendar.getDOMNode().parentElement.style.top = '-32px';
        }
    },
    render: function(){

        var datePicker = (<div>{this.state.curDate}</div>);
        var calendar=null;
        var v = this._formatDate(this.state.curDate);
        if(!this.props.isViewStatus){

          var inputProps = {
              errorText: this.state.errorText,
              onFocus:this._onFocus,
              onBlur:this._onBlur,
              defaultValue: this.state.curDate,
              value:v,
              onChange:this._onChange,
              style: this.props.style
          };
          if(this.state.curDate){
              inputProps.className="jazz-viewableTextField-noempty";

          }
          var minDate,maxDate;
          if(this.props.minDate){
            minDate = this.props.minDate;
          }
          else{
            minDate = moment("2000-01-01").toDate();
          }
          if(this.props.maxDate){
            maxDate = this.props.maxDate;
          }
          else{
            maxDate = moment("2050-01-01").toDate();
          }
          datePicker = (<TextField {...inputProps} ref="TextField"/>);
          if(this.state.showCalendar){
          calendar=(<div style={{position:'absolute',"zIndex":99,width:"280px",marginTop:'2px',border:'1px solid rgb(235, 235, 235)',"backgroundColor":"white"}}><Calendar
                dateFormatStr={this.props.dateFormatStr}
                ref="calendar"
                onSelectedDate={this._onSelectedDate}
                onSelectedTime={this._onSelectedTime}
                initialDate={moment(this.state.curDate||new Date()).toDate()}
                initialTime={this.state.curTime||this.props.timeType}
                showTime={this.props.showTime}
                timeType={this.props.timeType}
                minDate= {minDate}
                maxDate = {maxDate}
                 /></div>);
            }
        }
        else{
            var afterValue=null;
            datePicker = (
                <div>
                    <div className="jazz-viewable-title">{this.props.title}</div>
                    <div className="jazz-viewable-value">{v}</div>
                </div>
            );
        }

        var style={};
        if(this.props.isViewStatus && !this.props.defaultValue){
            style.display='none';
        }
        return (
            <div className="jazz-viewableDatePicker jazz-viewableTextField" style={style}>
                {datePicker}
                {calendar}
            </div>
        );
    }
});

module.exports = ViewableDatePicker;
