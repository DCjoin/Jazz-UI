'use strict';

import React from "react";
import FromEndTime from '../../controls/FromEndTime.jsx';
import CalendarAction from '../../actions/CalendarAction.jsx';
import CalendarStore from '../../stores/CalendarStore.jsx';


var FromEndTimeGroup = React.createClass({
  getInitialState: function() {
    return {
      errorTextArr: CalendarStore.getCalendarErrorText()
    };
  },
  clearErrorText: function() {
    CalendarAction.clearAllCalendarErrorText();
  },
  _onErrorTextChange: function() {
    this.setState({
      errorTextArr: CalendarStore.getCalendarErrorText()
    });
  },
  getTimeData: function(data) {
    var startTime = data[0];
    var endTime = data[1];
    var StartFirstPart = -1,
      StartSecondPart = -1,
      EndFirstPart = -1,
      EndSecondPart = -1;
    if (startTime !== -1) {
      StartFirstPart = Math.floor(startTime / 60);
      StartSecondPart = startTime % 60;
    }
    if (endTime !== -1) {
      EndFirstPart = Math.floor(endTime / 60);
      EndSecondPart = endTime % 60;
    }
    return {
      StartFirstPart: StartFirstPart,
      StartSecondPart: StartSecondPart,
      EndFirstPart: EndFirstPart,
      EndSecondPart: EndSecondPart
    };
  },
  _onTimeChange: function(index, data) {
    var timeData = this.getTimeData(data);
    this.props.onTimeChange(index, timeData);
  },
  _onDeleteTimeData: function(index) {
    this.props.onDeleteTimeData(index);
  },
  _setErrorText: function(index, errorText) {
    CalendarAction.setCalendarErrorText(index, errorText);
  },
  validate: function() {
    var isValid = true;
    var length = this.props.items.size;
    for (var i = 0; i < length; i++) {
      isValid = isValid && this.refs['fromEndTime' + (i + 1)].isValid();
    }
    return isValid;
  },
  validateGroup: function() {
    var length = this.props.items.size;
    var currentItem, compItem, i, j;
    var isValid = true;
    this.clearErrorText();
    for (i = 0; i < length; i++) {
      currentItem = this.refs['fromEndTime' + (i + 1)];
      for (j = i + 1; j < length; j++) {
        compItem = this.refs['fromEndTime' + (j + 1)];
        if (this.checkOverLap(currentItem, compItem)) {
          currentItem.setErrorText(I18N.Common.Label.TimeConflict);
          compItem.setErrorText(I18N.Common.Label.TimeConflict);
          isValid = false;
        }
      }
    }
    return isValid;
  },
  checkOverLap(item, comItem) {
    var value = item.getValue(),
      comValue = comItem.getValue(),
      start = value[0],
      end = value[1],
      comStart = comValue[0],
      comEnd = comValue[1];
    if ((start === -1 && end === -1) || (comStart === -1 && comEnd === -1)) {
      return false;
    } else {
      if (start === -1 && comStart === -1) {
        return (end === comEnd);
      } else if (start === -1 && comEnd === -1) {
        return (comStart + 30 === end);
      } else if (end == -1 && comStart === -1) {
        return (start + 30 === comEnd);
      } else if (end == -1 && comEnd == -1) {
        return (start === comStart);
      } else if (start === -1) {
        return (end > comStart && end <= comEnd);
      } else if (end === -1) {
        return (start >= comStart && start < comEnd);
      } else if (comStart === -1) {
        return (comEnd > start && comEnd <= end);
      } else if (comEnd === -1) {
        return (comStart >= start && comStart < end);
      } else {
        if (start == comStart) {
          return true;
        } else if (start < comStart) {
          return (end > comStart);
        } else {
          return (comEnd > start);
        }
      }
    }
  },
  isValid: function() {
    var isValid = this.validate();
    isValid = isValid && this.validateGroup();
    return isValid;
  },
  componentDidMount: function() {
    CalendarStore.addCalendarErrorTextChangeListener(this._onErrorTextChange);
  },
  componentWillUnmount: function() {
    CalendarStore.removeCalendarErrorTextChangeListener(this._onErrorTextChange);
  },
  render() {
    let me = this;
    let items = this.props.items;
    let timeItems = null;
    if (items && items.size !== 0) {
      timeItems = items.map(function(item, i) {
        let props = {
          index: i,
          key: item.get('Id'),
          id: item.get('Id'),
          type: item.get('Type'),
          ref: 'fromEndTime' + (i + 1),
          isViewStatus: me.props.isViewStatus,
          hasDeleteButton: items.size === 1 ? false : true,
          errorText: me.state.errorTextArr.get(i),
          startTime: item.get('StartFirstPart') === -1 ? -1 : item.get('StartFirstPart') * 60 + item.get('StartSecondPart'),
          endTime: item.get('EndFirstPart') === -1 ? -1 : item.get('EndFirstPart') * 60 + item.get('EndSecondPart'),
          onTimeChange: me._onTimeChange,
          onDeleteTimeData: me._onDeleteTimeData,
          setErrorText: me._setErrorText
        };
        return (
          <FromEndTime {...props}></FromEndTime>
          );
      });
    }
    return (
      <div>
        {timeItems}
      </div>
      );
  }
});
module.exports = FromEndTimeGroup;
