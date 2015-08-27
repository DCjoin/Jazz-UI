'use strict';

import React from 'react';
import moment from 'moment';
import {Mixins,Styles,ClearFix,FlatButton} from 'material-ui';
import ItemButton from '../controls/ItemButton.jsx';

var CalendarTime = React.createClass({
  propTypes: {
    selectedTime: React.PropTypes.number.isRequired,
    selectedDate: React.PropTypes.number.isRequired,
    onTimeChange: React.PropTypes.func,
    showCalendar: React.PropTypes.func,
    timeType: React.PropTypes.number,
    dateFormatStr: React.PropTypes.string
  },

  getDefaultProps: function(){
    return {
      dateFormatStr: "YYYY/MM/DD"
    };
  },
  _formatDate(date){
      if(date){
        return moment(new Date(date)).format(this.props.dateFormatStr);
      }
      return '';
  },

  render() {
    let styles = {
      lineHeight: '32px',
      textAlign: 'center',
      padding: '8px 14px 0 14px',
    };

    return (
      <div>
        <div style={styles}>
          {this._getTimeItems()}
        </div>
        {this._calendarDisplay()}
      </div>

    );
  },
  _calendarDisplay: function() {
    var selectedDate = this.props.selectedDate;
    var dateStyle = {
      textAlign: 'center',
      border: '1px solid #efefef',
      height: '60px',
      lineHeight: '60px',
      textDecoration: 'underline'
    };
    return (
      <div style={dateStyle} onClick={this.props.showCalendar}>{this._formatDate(this.props.selectedDate)}</div>
    );
  },
  _getTimeItems() {
    let timeArray = this._getTimeArray();

    return timeArray.map((timeItem, i) => {
      return (
        <ClearFix key={i}>
          {this._getTimeElements(timeItem, i)}
        </ClearFix>
      );
    }, this);
  },

  _getTimeArray(){
    var timeType = this.props.timeType || 0;
    var timeArray = [];
    var timeSubArray = [];
    for(var i = 0; i < 6; i++){
      for(var j = timeType; j < (timeType+4); j++){
        timeSubArray.push({ value: i*4+j, text: (((i*4+j) < 10) ? '0' : '') + (i*4+j) + ':00' });
      }
      timeArray.push(timeSubArray);
      timeSubArray = [];
    }
    return timeArray;
  },

  _getTimeElements(timeItem, i) {
    return timeItem.map((time, j) => {
      return (
        <ItemButton
          key={'time' + i + j}
          ref={'time'+ time.value}
          item={time}
          selected={this.props.selectedTime === time.value}
          onTouchTap={this._onTimeTouchTap}/>
      );
    }, this);
  },

  _onTimeTouchTap(e, time) {
    if (this.props.onTimeChange) this.props.onTimeChange(e, time);
  }
});


module.exports = CalendarTime;
