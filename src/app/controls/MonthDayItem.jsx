'use strict';

import React from 'react';
import { Mixins, Styles, ClearFix, FontIcon } from 'material-ui';
import ViewableDropDownMenu from './ViewableDropDownMenu.jsx';
import FlatButton from './FlatButton.jsx';

var MonthDayItem = React.createClass({
  propTypes: {
    isViewStatus: React.PropTypes.bool,
    month: React.PropTypes.number,
    day: React.PropTypes.number,
    type: React.PropTypes.number //0-start, 1-end
  },
  getDefaultProps() {
    return {
      month: -1,
      day: -1
    };
  },
  getInitialState: function() {
    var dayNum = this._getDayNum(this.props.month);
    return {
      dayNum: dayNum
    };
  },
  getValue: function() {
    var month = this.props.month;
    var day = this.props.day;
    return [month, day];
  },
  getCompareValue: function() {
    var value = this.getValue();
    if ((value[0] === -1) || (value[1] === -1)) {
      return -1;
    } else {
      return value[0] + value[1] / 100;
    }
  },
  isValid: function() {
    var value = this.getValue();
    if ((value[0] !== -1) && (value[1] !== -1)) {
      return true;
    }
    return false;
  },
  _getDayNum: function(month) {
    var type;
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12: type = 31;
        break;
      case 2: type = 28;
        break;
      case 4:
      case 6:
      case 9:
      case 11: type = 30;
        break;
    }
    return type;
  },
  _getMonthItems: function() {
    var monthItems = [{
      payload: 1,
      text: I18N.Common.Date.January
    }, {
      payload: 2,
      text: I18N.Common.Date.February
    }, {
      payload: 3,
      text: I18N.Common.Date.March
    }, {
      payload: 4,
      text: I18N.Common.Date.April
    }, {
      payload: 5,
      text: I18N.Common.Date.May
    }, {
      payload: 6,
      text: I18N.Common.Date.June
    }, {
      payload: 7,
      text: I18N.Common.Date.July
    }, {
      payload: 8,
      text: I18N.Common.Date.August
    }, {
      payload: 9,
      text: I18N.Common.Date.September
    }, {
      payload: 10,
      text: I18N.Common.Date.October
    }, {
      payload: 11,
      text: I18N.Common.Date.November
    }, {
      payload: 12,
      text: I18N.Common.Date.December
    }];
    var startItem = {
      payload: -1,
      text: I18N.Setting.Calendar.StartMonth,
      disabled: true
    };
    var endItem = {
      payload: -1,
      text: I18N.Setting.Calendar.EndMonth,
      disabled: true
    };
    if (this.props.type === 0) {
      monthItems.unshift(startItem);
    } else {
      monthItems.unshift(endItem);
    }
    return monthItems;
  },
  _getDayItems: function() {
    var dayItems = [], d;
    var dayNum = this.state.dayNum;
    var startItem = {
      payload: -1,
      text: I18N.Setting.Calendar.StartDate,
      disabled: true
    };
    var endItem = {
      payload: -1,
      text: I18N.Setting.Calendar.EndDate,
      disabled: true
    };
    for (var i = 0; i < dayNum; i++) {
      d = i + 1;
      dayItems[i] = {
        payload: d,
        text: ((d < 10) ? '0' : '') + d + I18N.Setting.Calendar.Date
      };
    }
    if (this.props.type === 0) {
      dayItems.unshift(startItem);
    } else {
      dayItems.unshift(endItem);
    }

    return dayItems;
  },
  _onMonthDayItemChange(name, value) {
    var month = this.props.month;
    var day = this.props.day;
    if (name === 'month') {
      var dayNum = this._getDayNum(value);
      if (day > dayNum) {
        day = dayNum;
      }
      this.props.onMonthDayItemChange(this.props.type, [value, day]);
    } else if (name === 'day') {
      this.props.onMonthDayItemChange(this.props.type, [month, value]);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    var dayNum = this._getDayNum(nextProps.month);
    this.setState({
      dayNum: dayNum
    });
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.isViewStatus === nextProps.isViewStatus &&
      this.props.type === nextProps.type &&
      this.props.month === nextProps.month &&
      this.props.day === nextProps.day &&
      this.props.lang === nextProps.lang &&
      this.state.dayNum === nextState.dayNum) {
      return false;
    }
    return true;
  },
  render: function() {
    var me = this;
    var monthItems = me._getMonthItems();
    var dayItems = me._getDayItems();
    var monthProps = {
      ref: 'month',
      dataItems: monthItems,
      isViewStatus: me.props.isViewStatus,
      defaultValue: me.props.month,
      disabled: this.props.disabled,
      title: '',
      textField: 'text',
      style: {
        width: '100px'
      },
      didChanged: me._onMonthDayItemChange.bind(null, 'month')
    };
    var dayProps = {
      ref: 'day',
      dataItems: dayItems,
      isViewStatus: me.props.isViewStatus,
      defaultValue: me.props.day,
      disabled: this.props.disabled,
      title: '',
      textField: 'text',
      style: {
        width: '100px'
      },
      didChanged: me._onMonthDayItemChange.bind(null, 'day')
    };
    return (
      <div className="jazz-monthday-item">
        <div className='jazz-monthday-item-content'>
          <ViewableDropDownMenu {...monthProps}></ViewableDropDownMenu>
        </div>
        <div className='jazz-monthday-item-content'>
          <ViewableDropDownMenu {...dayProps}></ViewableDropDownMenu>
        </div>
      </div>
      );
  }
});

module.exports = MonthDayItem;
