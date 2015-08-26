'use strict';

import React from 'react';
import {Mixins,Styles,ClearFix} from 'material-ui';
import CalendarMonth from '../../../node_modules/material-ui/lib/date-picker/calendar-month.js';
import CalendarYear from '../../../node_modules/material-ui/lib/date-picker/calendar-year.js';
import CalendarToolbar from '../../../node_modules/material-ui/lib/date-picker/calendar-toolbar.js';
import DateTime from '../../../node_modules/material-ui/lib/utils/date-time.js';
import SlideInTransitionGroup from '../../../node_modules/material-ui/lib/transition-groups/slide-in.js';
import CalendarTime from '../controls/CalendarTime.jsx';



var {StylePropable} = Mixins;
var {Transitions} = Styles;

DateTime.getFullMonth = function(d) {
    var month = d.getMonth();
    switch (month) {
      case 0:
        return '一月';
      case 1:
        return '二月';
      case 2:
        return '三月';
      case 3:
        return '四月';
      case 4:
        return '五月';
      case 5:
        return '六月';
      case 6:
        return '七月';
      case 7:
        return '八月';
      case 8:
        return '九月';
      case 9:
        return '十月';
      case 10:
        return '十一月';
      case 11:
        return '十二月';
    }
};

var Calendar = React.createClass({

  mixins: [StylePropable],

  propTypes: {
    initialDate: React.PropTypes.object,
    initialTime: React.PropTypes.number,
    minDate: React.PropTypes.object,
    maxDate: React.PropTypes.object,
    shouldDisableDate: React.PropTypes.func,
    hideToolbarYearChange: React.PropTypes.bool,
    shouldShowMonthDayPickerFirst: React.PropTypes.bool,
    shouldShowYearPickerFirst: React.PropTypes.bool,
    showYearSelector: React.PropTypes.bool,
    onSelectedDate: React.PropTypes.func,
    onSelectedTime: React.PropTypes.func,
    showTime: React.PropTypes.bool,
    timeType: React.PropTypes.number,//0:start,1:end
    dateFormatStr: React.PropTypes.string
  },


  getDefaultProps: function() {
    return {
      initialDate: new Date(),
      minDate: DateTime.addYears(new Date(), -100),
      maxDate: DateTime.addYears(new Date(), 100),
      hideToolbarYearChange: false,
      shouldShowMonthDayPickerFirst: true,
      shouldShowYearPickerFirst: false,
      showYearSelector: false
    };
  },

  getInitialState: function() {
    return {
      displayDate: DateTime.getFirstDayOfMonth(this.props.initialDate),
      selectedDate: this.props.initialDate,
      selectedTime: this.props.initialTime,
      transitionDirection: 'left',
      displayMonthDay: this.props.shouldShowMonthDayPickerFirst || this.props.shouldShowYearPickerFirst || true,
      transitionEnter: true,
      showTimeSelect: false
    };
  },

  getStyles: function() {

  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.initialDate !== this.props.initialDate) {
      var d = nextProps.initialDate || new Date();
      this.setState({
        displayDate: DateTime.getFirstDayOfMonth(d),
        selectedDate: d
      });
    }

    if (nextProps.shouldShowMonthDayPickerFirst) {
      this.setState({displayMonthDay: nextProps.shouldShowMonthDayPickerFirst});
    }
  },

  render: function() {
    var yearCount = DateTime.yearDiff(this.props.maxDate, this.props.minDate) + 1;
    var weekCount = DateTime.getWeekArray(this.state.displayDate).length;
    var toolbarInteractions = this._getToolbarInteractions();

    var isMultiYearRange = yearCount > 2; // Want a year range greater than 1. Ex. [2014,2016] has a count of 3
    var isLandscape = this.props.mode === 'landscape';
    var styles = {
      root: {
        fontSize: '12px'
      },
      calendarContainer: {
        width: isLandscape ? '280px' : '100%',
        height: weekCount === 5 ? '268px' :
          weekCount === 6 ? '308px' : '228px',
        float: isLandscape ? 'right' : 'none',
        transition: Transitions.easeOut('150ms', 'height')
      },
      yearContainer: {
        width: '280px',
        overflow: 'hidden',
        height: yearCount < 6 ? yearCount * 56 + 10 :
          weekCount === 5 ? '268px' :
          weekCount === 6 ? '308px' : '228px',
        float: isLandscape ? 'right' : 'none'
      },
      timeContainer: {
        width: '280px',
        overflow: 'hidden',
        height: '20px'
      },
      dateDisplay: {
        width: isLandscape ? '280px' : '100%',
        height: '100%',
        float: isLandscape ? 'left' : 'none'
      },
      weekTitle: {
        padding: '0 14px',
        lineHeight: '12px',
        opacity: '0.5',
        height: '12px',
        fontWeight: '500',
        margin: 0
      },
      weekTitleDay: {
        listStyle: 'none',
        float: 'left',
        width: '32px',
        textAlign: 'center',
        margin: '0 2px'
      }
    };
    var Calendar = null;
    if (this.state.displayMonthDay || !this.props.showYearSelector) {
      styles.yearContainer.display = 'none';
    }
    else {
      styles.calendarContainer.display = 'none';
    }
    if(!this.state.showTimeSelect){
      Calendar = (
        <ClearFix style={this.mergeAndPrefix(styles.root)}>
          <div style={styles.calendarContainer}>
            <CalendarToolbar
              displayDate={this.state.displayDate}
              onMonthChange={this._handleMonthChange}
              onYearChange={this._handleYearChange}
              prevMonth={toolbarInteractions.prevMonth}
              nextMonth={toolbarInteractions.nextMonth}
              prevYear={toolbarInteractions.prevYear}
              nextYear={toolbarInteractions.nextYear}
              hideYearChangeButtons={false} />

            <ClearFix
              elementType="ul"
              style={styles.weekTitle}>
              <li style={styles.weekTitleDay}>日</li>
              <li style={styles.weekTitleDay}>一</li>
              <li style={styles.weekTitleDay}>二</li>
              <li style={styles.weekTitleDay}>三</li>
              <li style={styles.weekTitleDay}>四</li>
              <li style={styles.weekTitleDay}>五</li>
              <li style={styles.weekTitleDay}>六</li>
            </ClearFix>

            <SlideInTransitionGroup
              direction={this.state.transitionDirection}>
              <CalendarMonth
                key={this.state.displayDate.toDateString()}
                ref="calendar"
                displayDate={this.state.displayDate}
                onDayTouchTap={this._handleDayTouchTap}
                selectedDate={this.state.selectedDate}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                shouldDisableDate={this.props.shouldDisableDate} />
            </SlideInTransitionGroup>
          </div>

          <div style={styles.timeContainer}>
            {this._timeDisplay()}
          </div>

          <div style={styles.yearContainer}>
            {this._yearSelector()}
          </div>
        </ClearFix>
      );
    }
    else{
      Calendar = (
        <ClearFix style={this.mergeAndPrefix(styles.root)}>
          <div style={styles.calendarContainer}>
            <CalendarTime selectedTime={this.state.selectedTime} selectedDate={this.state.selectedDate} dateFormatStr={this.props.dateFormatStr} timeType={this.props.timeType}
              onTimeChange={this._onTimeChange} showCalendar={this._showCalendar}/>
          </div>
        </ClearFix>
      );
    }
    return Calendar;

  },
  _onTimeChange: function(e, time){
    this.setState({selectedTime: time.value});
    if(this.props.onSelectedTime){
      this.props.onSelectedTime(time.value);
    }
  },
  _timeDisplay: function() {
    if(this.props.showTime){
      var selectedTime = this.state.selectedTime;
      return (
        <div onClick={this._showTimeSelect}>{((selectedTime < 10) ? '0' : '') + selectedTime + ':00'}</div>
      );
    }
  },
  _showTimeSelect: function(){
    this.setState({showTimeSelect: true});
  },
  _showCalendar: function(){
    this.setState({showTimeSelect: false});
  },
  _yearSelector: function() {
    if (this.props.showYearSelector) {
      return (
        <CalendarYear
          key={'years'}
          displayDate={this.state.displayDate}
          onYearTouchTap={this._handleYearTouchTap}
          selectedDate={this.state.selectedDate}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate} />
      );
    }
  },

  getSelectedDate: function() {
    return this.state.selectedDate;
  },

  isSelectedDateDisabled: function() {
    return this.refs.calendar.isSelectedDateDisabled();
  },



  _addSelectedMonths: function(months) {
    this._setSelectedDate(DateTime.addMonths(this.state.selectedDate, months),false);
  },

  _addSelectedYears: function(years) {
    this._setSelectedDate(DateTime.addYears(this.state.selectedDate, years),false);
  },

  _setDisplayDate: function(d, newSelectedDate) {
    var newDisplayDate = DateTime.getFirstDayOfMonth(d);
    var direction = newDisplayDate > this.state.displayDate ? 'left' : 'right';

    if (newDisplayDate !== this.state.displayDate) {
      this.setState({
        displayDate: newDisplayDate,
        transitionDirection: direction,
        selectedDate: newSelectedDate || this.state.selectedDate
      });
    }
  },

  _setSelectedDate: function(date, emitChange) {
    var adjustedDate = date;
    if (DateTime.isBeforeDate(date, this.props.minDate)) {
      adjustedDate = this.props.minDate;
    }
    else if (DateTime.isAfterDate(date, this.props.maxDate)) {
      adjustedDate = this.props.maxDate;
    }

    var newDisplayDate = DateTime.getFirstDayOfMonth(adjustedDate);
    if (newDisplayDate !== this.state.displayDate) {
      this._setDisplayDate(newDisplayDate, adjustedDate);
    } else {
      this.setState({
        selectedDate: adjustedDate
      });
    }
    if(emitChange){
        if(this.props.onSelectedDate) this.props.onSelectedDate(date);

    }
  },

  _handleDayTouchTap: function(e, date) {
    this._setSelectedDate(date, true);
  },

  _handleMonthChange: function(months) {
    this._addSelectedMonths(months);
  },

  _handleYearChange: function(years) {
    this._addSelectedYears(years);
  },

  _handleYearTouchTap: function(e, year) {
    var date = DateTime.clone(this.state.selectedDate);
    date.setFullYear(year);
    this._setSelectedDate(date, false);
  },

  _getToolbarInteractions: function() {
    return {
      prevMonth: DateTime.monthDiff(this.state.selectedDate, this.props.minDate) > 0,
      nextMonth: DateTime.monthDiff(this.state.selectedDate, this.props.maxDate) < 0,
      prevYear: DateTime.yearDiff(this.state.selectedDate, this.props.minDate) > 0,
      nextYear: DateTime.yearDiff(this.state.selectedDate, this.props.maxDate) < 0
  };
  }


});

module.exports = Calendar;
