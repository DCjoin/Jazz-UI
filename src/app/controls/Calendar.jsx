'use strict';

import React from 'react';
import moment from 'moment';
import { Mixins, Styles, ClearFix } from 'material-ui';
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
      return I18N.Common.Glossary.MonthName.January;
    case 1:
      return I18N.Common.Glossary.MonthName.February;
    case 2:
      return I18N.Common.Glossary.MonthName.March;
    case 3:
      return I18N.Common.Glossary.MonthName.April;
    case 4:
      return I18N.Common.Glossary.MonthName.May;
    case 5:
      return I18N.Common.Glossary.MonthName.June;
    case 6:
      return I18N.Common.Glossary.MonthName.July;
    case 7:
      return I18N.Common.Glossary.MonthName.August;
    case 8:
      return I18N.Common.Glossary.MonthName.September;
    case 9:
      return I18N.Common.Glossary.MonthName.October;
    case 10:
      return I18N.Common.Glossary.MonthName.November;
    case 11:
      return I18N.Common.Glossary.MonthName.December;
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
    timeType: React.PropTypes.number, //0:start,1:end
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

  getStyles: function() {},

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.initialDate !== this.props.initialDate) {
      var d = nextProps.initialDate || new Date();
      this.setState({
        displayDate: DateTime.getFirstDayOfMonth(d),
        selectedDate: d
      });
    }

    if (nextProps.shouldShowMonthDayPickerFirst) {
      this.setState({
        displayMonthDay: nextProps.shouldShowMonthDayPickerFirst
      });
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
        height: weekCount === 5 ? '300px' :
          weekCount === 6 ? '340px' : '228px',
        float: isLandscape ? 'right' : 'none',
        transition: Transitions.easeOut('150ms', 'height')
      },
      yearContainer: {
        width: '280px',
        overflow: 'hidden',
        height: yearCount < 6 ? yearCount * 56 + 10 :
          weekCount === 5 ? '300px' :
            weekCount === 6 ? '340px' : '228px',
        float: isLandscape ? 'right' : 'none'
      },
      timeContainer: {
        width: isLandscape ? '280px' : '100%',
        overflow: 'hidden'
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
        width: '37px',
        textAlign: 'center',
        margin: '0 2px'
      }
    };
    var Calendar = null;
    if (this.state.displayMonthDay || !this.props.showYearSelector) {
      styles.yearContainer.display = 'none';
    } else {
      styles.calendarContainer.display = 'none';
    }
    if (!this.state.showTimeSelect) {
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
              <li style={styles.weekTitleDay}>{I18N.Common.Glossary.WeekDay.Sunday}</li>
              <li style={styles.weekTitleDay}>{I18N.Common.Glossary.WeekDay.Monday}</li>
              <li style={styles.weekTitleDay}>{I18N.Common.Glossary.WeekDay.Tuesday}</li>
              <li style={styles.weekTitleDay}>{I18N.Common.Glossary.WeekDay.Wednesday}</li>
              <li style={styles.weekTitleDay}>{I18N.Common.Glossary.WeekDay.Thursday}</li>
              <li style={styles.weekTitleDay}>{I18N.Common.Glossary.WeekDay.Friday}</li>
              <li style={styles.weekTitleDay}>{I18N.Common.Glossary.WeekDay.Saturday}</li>
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
    } else {
      var height = parseInt((weekCount === 5 ? 268 :
          weekCount === 6 ? 308 : 228) / 6);
      Calendar = (
        <ClearFix style={this.mergeAndPrefix(styles.root)}>
          <div style={styles.calendarContainer}>
            <CalendarTime height={height} selectedTime={this.state.selectedTime} dateFormatStr={this.props.dateFormatStr} timeType={this.props.timeType}
        onTimeChange={this._onTimeChange}/>
          </div>
          <div style={styles.timeContainer}>
            {this._calendarDisplay()}
          </div>
        </ClearFix>
      );
    }
    return Calendar;

  },
  _onTimeChange: function(e, time) {
    this.setState({
      selectedTime: time.value
    });
    this._showCalendar();
    if (this.props.onSelectedTime) {
      this.props.onSelectedTime(time.value);
    }
  },
  _formatDate(date) {
    if (date) {
      return moment(new Date(date)).format(this.props.dateFormatStr);
    }
    return '';
  },
  _calendarDisplay: function() {
    var selectedDate = this.state.selectedDate;
    var dateStyle = {
      textAlign: 'center',
      borderTop: '1px solid #efefef',
      height: '48px',
      lineHeight: '48px',
      marginTop: '6px',
      textDecoration: 'underline'
    };
    return (
      <div style={dateStyle} onClick={this._showCalendar}>{this._formatDate(this.state.selectedDate)}</div>
      );
  },
  _timeDisplay: function() {
    if (this.props.showTime) {
      var selectedTime = this.state.selectedTime;
      var timeStyle = {
        textAlign: 'center',
        borderTop: '1px solid #efefef',
        height: '48px',
        lineHeight: '48px',
        marginTop: '6px',
        textDecoration: 'underline'
      };
      return (
        <div style={timeStyle} onClick={this._showTimeSelect}>{((selectedTime < 10) ? '0' : '') + selectedTime + ':00'}</div>
        );
    }
  },
  _showTimeSelect: function() {
    this.setState({
      showTimeSelect: true
    });
  },
  _showCalendar: function() {
    this.setState({
      showTimeSelect: false
    });
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
  getSelectedTime: function() {
    return this.state.selectedTime;
  },

  isSelectedDateDisabled: function() {
    return this.refs.calendar.isSelectedDateDisabled();
  },



  _addSelectedMonths: function(months) {
    this._setSelectedDate(DateTime.addMonths(this.state.selectedDate, months), false);
  },

  _addSelectedYears: function(years) {
    this._setSelectedDate(DateTime.addYears(this.state.selectedDate, years), false);
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
    } else if (DateTime.isAfterDate(date, this.props.maxDate)) {
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
  },

  _handleDayTouchTap: function(e, date) {
    this._setSelectedDate(date, true);
    if (this.props.onSelectedDate) this.props.onSelectedDate(date);
  },

  _handleMonthChange: function(months) {
    this.setState({
      displayDate: DateTime.addMonths(this.state.displayDate, months)
    });

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
      prevMonth: DateTime.monthDiff(this.state.displayDate, this.props.minDate) > 0,
      nextMonth: DateTime.monthDiff(this.state.displayDate, this.props.maxDate) < 0,
      prevYear: DateTime.yearDiff(this.state.selectedDate, this.props.minDate) > 0,
      nextYear: DateTime.yearDiff(this.state.selectedDate, this.props.maxDate) < 0
    };
  }


});

module.exports = Calendar;
