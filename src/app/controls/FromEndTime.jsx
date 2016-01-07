'use strict';

import React from 'react';
import { Mixins, Styles, ClearFix, FlatButton } from 'material-ui';
import ViewableDropDownMenu from './ViewableDropDownMenu.jsx';

var FromEndTime = React.createClass({
  propTypes: {
    index: React.PropTypes.number.isRequired,
    isViewStatus: React.PropTypes.bool,
    hasDeleteButton: React.PropTypes.bool,
    errorText: React.PropTypes.string,
    startTime: React.PropTypes.number,
    endTime: React.PropTypes.number
  },
  getDefaultProps() {
    return {
      startTime: -1,
      endTime: -1,
      errorText: '',
      hasDeleteButton: true
    };
  },
  getInitialState: function() {
    return {
      errorText: this.props.errorText,
      startTime: this.props.startTime,
      endTime: this.props.endTime
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.isViewStatus === nextProps.isViewStatus &&
      this.props.errorText == nextProps.errorText &&
      this.props.startTime == nextProps.startTime &&
      this.props.endTime == nextProps.endTime) {
      return false;
    }

    return true;
  },
  getValue: function() {
    return [this.state.startTime, this.state.endTime];
  },
  setValue: function(itemData) {
    this.setState({
      startTime: itemData.get('StartFirstPart') * 60 + itemData.get('StartSecondPart'),
      endTime: itemData.get('EndFirstPart') * 60 + itemData.get('EndSecondPart')
    });
  },
  setTimeValue: function(start, end) {
    this.setState({
      startTime: start,
      endTime: end
    });
  },
  _getDateTimeItems: function() {
    var step = 30,
      dataList = [],
      v = 0,
      i = 0;

    while (v <= 1440) {
      var h = Math.floor(v / 60),
        m = v % 60;

      dataList[i] = {
        payload: v,
        text: ((h < 10) ? '0' : '') + h + ':' + ((m < 10) ? '0' : '') + m
      };
      v += step;
      i++;
    }
    return dataList;
  },
  _getStartTimeItems: function() {
    var startTimeItems = this._getDateTimeItems();
    var item = {
      payload: -1,
      text: I18N.Setting.Calendar.StartTime,
      disabled: true
    };
    startTimeItems.unshift(item);
    startTimeItems.pop();

    return startTimeItems;
  },
  _getEndTimeItems: function() {
    var endTimeItems = this._getDateTimeItems();
    var item = {
      payload: -1,
      text: I18N.Setting.Calendar.EndTime,
      disabled: true
    };
    endTimeItems.splice(0, 1, item);

    return endTimeItems;
  },
  _onTimeChange: function(name, value) {
    var startTime = this.state.startTime;
    var endTime = this.state.endTime;
    if (name === 'statrTime') {
      if (endTime === -1) {
        return;
      }
      if (value >= endTime) {
        this.setState({
          endTime: value + 30
        });
      }
    } else if (name === 'endTime') {
      if (startTime === -1) {
        return;
      }
      if (value <= startTime) {
        this.setState({
          startTime: value - 30
        });
      }
    }
  },
  clearInvalide: function() {
    this.setState({
      errorText: ''
    });
  },
  render: function() {
    var me = this;
    var startTimeItems = me._getStartTimeItems();
    var endTimeItems = me._getEndTimeItems();
    var startTimeProps = {
      ref: 'startTime',
      dataItems: startTimeItems,
      isViewStatus: me.props.isViewStatus,
      defaultValue: me.state.startTime,
      title: '',
      textField: 'text',
      didChanged: me._onTimeChange.bind(null, 'startTime')
    };
    var endTimeProps = {
      ref: 'endTime',
      dataItems: endTimeItems,
      isViewStatus: me.props.isViewStatus,
      defaultValue: me.state.endTime,
      title: '',
      textField: 'text',
      didChanged: me._onTimeChange.bind(null, 'endTime')
    };
    return (
      <div className="jazz-fromendtime">
        <div className='jazz-fromendtime-content'>
          <ViewableDropDownMenu {...startTimeProps}></ViewableDropDownMenu>
          <span> {'-'} </span>
          <ViewableDropDownMenu {...endTimeProps}></ViewableDropDownMenu>
        </div>
        <div className="jazz-fromendtime-error">{me.state.errorText}</div>
      </div>
      );
  }
});

module.exports = FromEndTime;
