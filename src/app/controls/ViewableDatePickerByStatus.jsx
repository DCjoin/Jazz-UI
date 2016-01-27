'use strict';

import React from 'react';
import mui from 'material-ui';
import assign from 'object-assign';
import moment from 'moment';
//import Calendar from '../../../node_modules/material-ui/lib/date-picker/calendar.js';
import Calendar from '../controls/Calendar.jsx';
let {TextField, Mixins} = mui;
let {ClickAwayable} = Mixins;
var ViewableDatePicker = React.createClass({
  mixins: [ClickAwayable],
  propTypes: {
    isViewStatus: React.PropTypes.bool,
    defaultValue: React.PropTypes.string,
    minDate: React.PropTypes.object,
    maxDate: React.PropTypes.object,
    style: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      curDate: this.props.defaultValue,
      showCalendar: false
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      curDate: nextProps.defaultValue
    });
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.isViewStatus == nextProps.isViewStatus && this.props.lang == nextProps.lang &&
      this.state.curDate == nextProps.defaultValue && this.state.curDate == nextState.curDate && this.state.showCalendar == nextState.showCalendar) {
      return false;
    }
    return true;

  },
  componentClickAway() {
    this.setState({
      showCalendar: false
    });
  },
  _onSelectedDate(date) {
    this.setState({
      curDate: moment(date).format('YYYY/MM/DD'),
      showCalendar: false
    });
    var str = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS');
    if (this.props.didChanged) {
      this.props.didChanged(str);
    }
  },
  _handleChange: function(date1, date2) {
    if (!!date2) {
      this.setState({
        curDate: date2
      });
    }
  },

  getValue: function() {
    if (this.refs.TextField) {
      var d = new Date(this.state.curDate);
      var m = moment(d).add(d.getTimezoneOffset() * -1 / 60, 'h');
      return m.toDate();
    }
  },

  _onFocus(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!this.state.showCalendar) {
      this.setState({
        showCalendar: true
      });
    }
  },
  _onBlur() {
    //this.setState({showCalendar:false});
  },
  _clearTime: function() {
    this.setState({
      curDate: ''
    });
  },
  _formatDate(date) {
    if (date) {
      return moment(date, "YYYY/MM/DD").format("YYYY年MM月DD日");
    }
    return '';
  },
  _onChange(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      curDate: this.state.curDate
    });
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (this.state.showCalendar) {
      //this.refs.calendar.getDOMNode().children[1].style.display = 'none';
      // this.refs.calendar.getDOMNode().parentElement.style.top = '-32px';
    }
  },
  render: function() {

    var datePicker = (<div>{this.state.curDate}</div>);
    var calendar = null;
    var v = this._formatDate(this.state.curDate);
    if (!this.props.isViewStatus) {

      var inputProps = {
        errorText: this.state.errorText,
        onFocus: this._onFocus,
        onBlur: this._onBlur,
        defaultValue: this.state.curDate,
        value: v,
        onChange: this._onChange,
        floatingLabelText: this.props.title,
        style: assign({
          width: 430
        }, this.props.style)
      };
      if (this.state.curDate) {
        inputProps.className = "pop-viewableTextField-noempty";

      }

      datePicker = (<TextField {...inputProps} ref="TextField" />);
      if (this.state.showCalendar) {
        var initDate = moment();
        if (this.state.curDate) {
          initDate = moment(this.state.curDate, 'YYYY/MM/DD');
        }
        calendar = (<div style={{
          position: 'absolute',
          "zIndex": 99,
          width: "315px",
          "backgroundColor": "white"
        }}><Calendar
        ref="calendar"
        onSelectedDate={this._onSelectedDate}
        initialDate={initDate.toDate()}
        maxDate = {this.props.maxDate || moment("2050-01-01").toDate()}
        /></div>);
      }
    } else {
      var afterValue = null;
      datePicker = (
        <div>
                    <div className="pop-viewable-title" style={this.props.style}>{this.props.title}</div>
                    <div className="pop-viewable-value">{v}</div>
                </div>
      );
    }

    var style = {
      position: 'relative'
    };
    if (this.props.isViewStatus && !this.props.defaultValue) {
      style.display = 'none';
    }

    return (
      <div className="pop-viewableDatePicker pop-viewableTextField custom-viewableDatePicker" style={style}>
                {datePicker}
                {calendar}
            </div>
      );
  }
});

module.exports = ViewableDatePicker;
