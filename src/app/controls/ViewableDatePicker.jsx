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
        defaultValue: React.PropTypes.string,
        minDate: React.PropTypes.object,
        maxDate: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            curDate: this.props.defaultValue,
            showCalendar:false
        };
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({curDate:nextProps.defaultValue});
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if(this.props.isViewStatus == nextProps.isViewStatus &&
            this.state.curDate == nextProps.defaultValue && this.state.curDate == nextState.curDate && this.state.showCalendar == nextState.showCalendar  ){
                return false;
            }
            return true;

        },
    componentClickAway(){
        this.setState({showCalendar:false});
    },
    _onSelectedDate(date){
        this.setState({curDate:date.toLocaleDateString('zh-cn'),showCalendar:false});
        //To kill 'Z' char from date format  eg. "2015-06-12T08:35:02.467Z" => "2015-06-12T08:35:02.467"
        var str = date.toISOString();
        str = str.substring(0, str.length-1);
        if(this.props.didChanged){
            this.props.didChanged(str);
        }
        if(this.props.onChange){
          this.props.onChange();
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
      this.setState({curDate:value});
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
      this.setState({curDate:''});
    },
    _formatDate(date){
        if(date){
            return moment(new Date(date)).format("YYYY年MM月DD日");
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
          datePicker = (<TextField {...inputProps} ref="TextField"/>);
          if(this.state.showCalendar){
          calendar=(<div style={{position:'absolute',"zIndex":99,width:"300px",marginTop:'2px',border:'1px solid rgb(235, 235, 235)',"backgroundColor":"white"}}><Calendar
                ref="calendar"
                onSelectedDate={this._onSelectedDate}
                initialDate={moment(this.state.curDate||new Date()).toDate()}
                minDate= {moment("2000-01-01").toDate()}
                maxDate = {moment("2050-01-01").toDate()}
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
