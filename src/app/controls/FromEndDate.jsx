'use strict';

import React from 'react';
import { Mixins, Styles, ClearFix, FontIcon } from 'material-ui';
import MonthDayItem from './MonthDayItem.jsx';
import FlatButton from './FlatButton.jsx';

var FromEndDate = React.createClass({
  propTypes: {
    index: React.PropTypes.number.isRequired,
    isViewStatus: React.PropTypes.bool,
    startMonth: React.PropTypes.number,
    startDay: React.PropTypes.number,
    endMonth: React.PropTypes.number,
    endDay: React.PropTypes.number
  },
  getDefaultProps() {
    return {
      itemData: {
        startMonth: -1,
        startDay: -1,
        endMonth: -1,
        endDay: -1
      }
    };
  },
  getInitialState: function() {
    return {
      startMonth: this.props.startMonth,
      startDay: this.props.startDay,
      endMonth: this.props.endMonth,
      endDay: this.props.endDay
    };
  },
  getCompareValue: function() {
    var startValue = this.refs.startItem.getCompareValue();
    var endValue = this.refs.endItem.getCompareValue();
    return [startValue, endValue];
  },
  setValue: function(itemData) {
    this.setDateValue(itemData.get('StartFirstPart'), itemData.get('StartSecondPart'),
      itemData.get('EndFirstPart'), itemData.get('EndSecondPart'));
  },
  setDateValue: function(startMonth, startDay, endMonth, endDay) {
    this.refs.startItem.setValue(startMonth, startDay);
    this.refs.endItem.setValue(endMonth, endDay);
  },
  isValid: function() {
    if (this.refs.startItem.isValid() && this.refs.endItem.isValid()) {
      return true;
    }
    return false;
  },
  _compareStartEndDate: function(startValue, endValue) {
    var sm = startValue[0],
      sd = startValue[1],
      em = endValue[0],
      ed = endValue[1];

    if (sm !== -1 && sd !== -1 && em !== -1 && ed !== -1) {
      if (sm < em) {
        return true;
      } else if (sm == em) {
        return (sd <= ed);
      } else {
        return false;
      }
    }

    return true;
  },
  _onMonthDayItemChanged: function(type, value) {
    var startValue, endValue;
    var startMonth = this.state.startMonth;
    var startDay = this.state.startDay;
    var endMonth = this.state.endMonth;
    var endDay = this.state.endDay;
    if (type === 0) {
      startValue = value;
      endValue = this.refs.endItem.getValue();
      if (!this._compareStartEndDate(startValue, endValue)) {
        endMonth = value[0];
        endDay = value[1];
      }
      this.setState({
        startMonth: value[0],
        startDay: value[1],
        endMonth: endMonth,
        endDay: endDay
      }, () => {
        var start = this.refs.startItem.getValue();
        var end = this.refs.endItem.getValue();
        this.props.onDateChange(start, end);
      });
    } else if (type === 1) {
      startValue = this.refs.startItem.getValue();
      endValue = value;
      if (!this._compareStartEndDate(startValue, endValue)) {
        startMonth = value[0];
        startDay = value[1];
      }
      this.setState({
        startMonth: startMonth,
        startDay: startDay,
        endMonth: value[0],
        endDay: value[1]
      }, () => {
        var start = this.refs.startItem.getValue();
        var end = this.refs.endItem.getValue();
        this.props.onDateChange(start, end);
      });
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      startMonth: nextProps.startMonth,
      startDay: nextProps.startDay,
      endMonth: nextProps.endMonth,
      endDay: nextProps.endDay
    });
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.isViewStatus === nextProps.isViewStatus &&
      this.props.startMonth === nextProps.startMonth &&
      this.props.startDay === nextProps.startDay &&
      this.props.endMonth === nextProps.endMonth &&
      this.props.endDay === nextProps.endDay &&
      this.state.startMonth === nextState.startMonth &&
      this.state.startDay === nextState.startDay &&
      this.state.endMonth === nextState.endMonth &&
      this.state.endDay === nextState.endDay) {
      return false;
    }
    return true;
  },
  render: function() {
    var me = this;
    var startProps = {
      ref: 'startItem',
      isViewStatus: me.props.isViewStatus,
      month: me.state.startMonth,
      day: me.state.startDay,
      type: 0,
      onMonthDayItemChange: me._onMonthDayItemChanged
    };
    var endProps = {
      ref: 'startItem',
      isViewStatus: me.props.isViewStatus,
      month: me.state.endMonth,
      day: me.state.endDay,
      type: 1,
      onMonthDayItemChange: me._onMonthDayItemChanged
    };
    return (
      <div className="jazz-fromenddate">
        <div className='jazz-fromenddate-start'>
          <MonthDayItem {...startProps}></MonthDayItem>
        </div>
        <div className='jazz-fromenddate-to'>{'-'}</div>
        <div className='jazz-fromenddate-end'>
          <MonthDayItem {...endProps}></MonthDayItem>
        </div>
      </div>
      );
  }
});

module.exports = FromEndDate;
