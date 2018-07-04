'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import {Mixins,Styles,ClearFix,FlatButton} from 'material-ui';
import ItemButton from '../controls/ItemButton.jsx';
var createReactClass = require('create-react-class');
var CalendarTime = createReactClass({
  propTypes: {
    selectedTime: PropTypes.number.isRequired,
    onTimeChange: PropTypes.func,
    timeType: PropTypes.number,
    height: PropTypes.number,
    dateFormatStr: PropTypes.string
  },

  getDefaultProps: function(){
    return {
      dateFormatStr: "YYYY/MM/DD"
    };
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
      </div>

    );
  },

  _getTimeItems() {
    let timeArray = this._getTimeArray();
    // return '123';
    return timeArray.map((timeItem, i) => {
      return (
        <div key={i}>
          {this._getTimeElements(timeItem, i)}
        </div>
      );
    });
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
      // return <div>'123'</div>
      return (
        <ItemButton
          height={this.props.height}
          key={'time' + i + j}
          ref={'time'+ time.value}
          item={time}
          selected={this.props.selectedTime === time.value}
          onTouchTap={this._onTimeTouchTap}/>
      );
    });
  },

  _onTimeTouchTap(e, time) {
    if (this.props.onTimeChange) this.props.onTimeChange(e, time);
  }
});


module.exports = CalendarTime;
