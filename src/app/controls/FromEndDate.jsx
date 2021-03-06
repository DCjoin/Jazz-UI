'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import { Mixins, Styles, ClearFix, FontIcon } from 'material-ui';
import MonthDayItem from './MonthDayItem.jsx';
import FlatButton from './FlatButton.jsx';
var createReactClass = require('create-react-class');
var FromEndDate = createReactClass({
  propTypes: {
    index: PropTypes.number.isRequired,
    isViewStatus: PropTypes.bool,
    startMonth: PropTypes.number,
    startDay: PropTypes.number,
    endMonth: PropTypes.number,
    endDay: PropTypes.number
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
    var startMonth = this.props.startMonth;
    var startDay = this.props.startDay;
    var endMonth = this.props.endMonth;
    var endDay = this.props.endDay;
    if (type === 0) {
      startValue = value;
      endValue = this.refs.endItem.getValue();
      if (!this._compareStartEndDate(startValue, endValue)) {
        endMonth = value[0];
        endDay = value[1];
      }
      this.props.onDateChange(value[0], value[1], endMonth, endDay);
    } else if (type === 1) {
      startValue = this.refs.startItem.getValue();
      endValue = value;
      if (!this._compareStartEndDate(startValue, endValue)) {
        startMonth = value[0];
        startDay = value[1];
      }
      this.props.onDateChange(startMonth, startDay, value[0], value[1]);
    }
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.isViewStatus === nextProps.isViewStatus &&
      this.props.startMonth === nextProps.startMonth &&
      this.props.startDay === nextProps.startDay &&
      this.props.endMonth === nextProps.endMonth &&
      this.props.endDay === nextProps.endDay &&
      this.props.lang === nextProps.lang) {
      return false;
    }
    return true;
  },
  render: function() {
    var me = this;
    var startProps = {
      ref: 'startItem',
      isViewStatus: me.props.isViewStatus,
      month: me.props.startMonth,
      day: me.props.startDay,
      type: 0,
      lang: me.props.lang,
      onMonthDayItemChange: me._onMonthDayItemChanged
    };
    var endProps = {
      ref: 'endItem',
      isViewStatus: me.props.isViewStatus,
      month: me.props.endMonth,
      day: me.props.endDay,
      type: 1,
      lang: me.props.lang,
      onMonthDayItemChange: me._onMonthDayItemChanged
    };
    return (
      <div className="jazz-fromenddate">
        <MonthDayItem {...startProps}></MonthDayItem>
        <div className='jazz-fromenddate-to'>{'-'}</div>
        <MonthDayItem {...endProps}></MonthDayItem>
      </div>
      );
  }
});

module.exports = FromEndDate;
