import React from 'react';
import PropTypes from 'prop-types';
import {Dialog, DropDownMenu, FlatButton, TextField, Mixins} from 'material-ui';
import classSet from 'classnames';
import CalendarYear from '../controls/CalendarYear.jsx';
import CalendarMonth from '../controls/CalendarMonth.jsx';
var createReactClass = require('create-react-class');
// let {ClickAwayable} = Mixins;

let MonthPicker = createReactClass({
  //mixins: [ClickAwayable],
  propTypes: {
    defaultYear: PropTypes.number,
    defaultMonth: PropTypes.number,
    minYear: PropTypes.string,
    maxYear: PropTypes.string
  },
  getDefaultProps() {
    let date = new Date();
    var defaultYear = date.getFullYear();
    var defaultMonth = date.getMonth();
    if (defaultMonth === 0) {
      defaultYear = defaultYear - 1;
      defaultMonth = 12;
    }
    return {
      defaultYear: defaultYear,
      defaultMonth: defaultMonth,
      minYear: '2000',
      maxYear: '2050'
    };
  },
  getInitialState() {
    return {
      displayYear: this.props.defaultYear,
      curYear: this.props.defaultYear,
      curMonth: this.props.defaultMonth,
      showMonth: false
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      curYear: nextProps.defaultYear,
      curMonth: nextProps.defaultMonth
    });
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.state.curYear == nextProps.defaultYear && this.state.curYear == nextState.curYear && this.state.curMonth == nextProps.defaultMonth && this.state.curMonth == nextState.curMonth && this.state.showMonth == nextState.showMonth) {
      return false;
    }
    return true;
  },
  componentClickAway() {
    var yearValue = this.state.displayYear;
    this.setState({
      showMonth: false,
      curYear: yearValue
    });
  },
  _onSelectedYear: function(year) {
    var adjustedYear = year;
    if (year < this.props.minYear) {
      adjustedYear = this.props.minYear;
    } else if (year > this.props.maxYear) {
      adjustedYear = this.props.maxYear;
    }
    this.setState({
      curYear: adjustedYear
    });
  },
  _onSelectMonth: function(month) {
    var date;
    var yearValue = this.state.curYear;
    var monthValue = month;
    this.setState({
      curMonth: month,
      displayYear: yearValue,
      showMonth: false
    });

    if (monthValue < 10) {
      date = '' + yearValue + '0' + monthValue;
    } else {
      date = '' + yearValue + monthValue;
    }
    if (this.props.onMonthPickerSelected) {
      this.props.onMonthPickerSelected(date);
    }
  },
  _getYearInteractions: function() {
    return {
      prevYear: this.state.curYear > this.props.minYear,
      nextYear: this.state.curYear < this.props.maxYear
    };
  },
  _onFocus(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!this.state.showMonth) {
      this.setState({
        showMonth: true
      });
    }
  },
  _clearTime: function() {
    this.setState({
      curYear: '',
      curMonth: ''
    });
  },
  _onYearChange: function(years) {
    this._onSelectedYear(parseInt(this.state.curYear) + years);
  },
  _onMonthChange: function(e, month) {
    this._onSelectMonth(parseInt(month.value));
  },
  render() {
    var datePicker = null;
    var calendar = null;
    var calendarYear = null;
    var calendarMonth = null;
    var yearValue = this.state.curYear;
    var displayYear = this.state.displayYear;
    var monthValue = this.state.curMonth;
    var date;
    if (monthValue < 10) {
      date = '' + displayYear + '/0' + monthValue;
    } else {
      date = '' + displayYear + '/' + monthValue;
    }
    var yearInteractions = this._getYearInteractions();
    var inputProps = {
      onFocus: this._onFocus,
      onBlur: this._onBlur,
      value: date,
      onChange: this._onChange,
      className: "jazz-month-picker-noempty"
    };
    datePicker = (<TextField {...inputProps} ref="TextField"/>);
    if (this.state.showMonth) {
      calendar = (<div style={{
        position: 'absolute',
        "zIndex": 99,
        width: "150px",
        marginTop: '2px',
        marginLeft: '83px',
        border: '1px solid rgb(235, 235, 235)',
        "backgroundColor": "white"
      }}>

            <CalendarMonth
            ref="calendarMonth"
            onMonthChange={this._onMonthChange}
            selectedMonth={monthValue}/>
    </div>);
    }
    return (
      <div className="jazz-month-picker">
        {datePicker}
        {calendar}
      </div>
      );
  }
});

module.exports = MonthPicker;
