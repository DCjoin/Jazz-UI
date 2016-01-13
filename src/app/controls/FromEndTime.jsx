'use strict';

import React from 'react';
import { Mixins, Styles, ClearFix, FontIcon } from 'material-ui';
import ViewableDropDownMenu from './ViewableDropDownMenu.jsx';
import FlatButton from './FlatButton.jsx';

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
  getValue: function() {
    return [this.props.startTime, this.props.endTime];
  },
  isValid: function() {
    var startTime = this.props.startTime;
    var endTime = this.props.endTime;
    if ((startTime !== -1) && (endTime !== -1)) {
      return true;
    }
    return false;
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
    var startTime = this.props.startTime;
    var endTime = this.props.endTime;
    if (name === 'startTime') {
      if ((endTime !== -1) && (value >= endTime)) {
        endTime = value + 30;
      }
      this.props.onTimeChange(this.props.index, [value, endTime]);
    } else if (name === 'endTime') {
      if ((startTime !== -1) && (value <= startTime)) {
        startTime = value - 30;
      }
      this.props.onTimeChange(this.props.index, [startTime, value]);
    }
  },
  setErrorText: function(errorText) {
    this.props.setErrorText(this.props.index, errorText);
  },
  clearInvalide: function() {
    this.setErrorText('');
  },
  _onDeleteTimeData: function() {
    this.props.onDeleteTimeData(this.props.index);
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.isViewStatus === nextProps.isViewStatus &&
      this.props.errorText === nextProps.errorText &&
      this.props.startTime === nextProps.startTime &&
      this.props.endTime === nextProps.endTime &&
      this.props.hasDeleteButton === nextProps.hasDeleteButton) {
      return false;
    }
    return true;
  },
  render: function() {
    var me = this;
    var startTimeItems = me._getStartTimeItems();
    var endTimeItems = me._getEndTimeItems();
    var startTimeProps = {
      ref: 'startTime',
      dataItems: startTimeItems,
      isViewStatus: me.props.isViewStatus,
      defaultValue: me.props.startTime,
      title: '',
      textField: 'text',
      style: {
        width: '90px'
      },
      didChanged: me._onTimeChange.bind(null, 'startTime')
    };
    var endTimeProps = {
      ref: 'endTime',
      dataItems: endTimeItems,
      isViewStatus: me.props.isViewStatus,
      defaultValue: me.props.endTime,
      title: '',
      textField: 'text',
      style: {
        width: '90px'
      },
      didChanged: me._onTimeChange.bind(null, 'endTime')
    };
    var cleanIconStyle = {
      fontSize: '16px'
    };
    var deleteButton = null;
    if (!me.props.isViewStatus && me.props.hasDeleteButton) {
      deleteButton = deleteButton = <div className='jazz-fromendtime-content-delete'><FlatButton secondary={true} label={I18N.Common.Button.Delete} onClick={me._onDeleteTimeData} style={{
        background: 'transparent'
      }} /></div>;
    }
    return (
      <div className="jazz-fromendtime">
        <div className='jazz-fromendtime-content'>
          <ViewableDropDownMenu {...startTimeProps}></ViewableDropDownMenu>
          <div className='jazz-fromendtime-content-to'>{'-'}</div>
          <ViewableDropDownMenu {...endTimeProps}></ViewableDropDownMenu>
          {deleteButton}
        </div>
        <div className="jazz-fromendtime-error">{me.props.errorText}</div>
      </div>
      );
  }
});

module.exports = FromEndTime;
