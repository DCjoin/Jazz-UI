'use strict';

import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Immutable from 'immutable';
//import {Mixins,Styles,ClearFix,FlatButton} from 'material-ui';

var CalendarTime = React.createClass({
  propTypes: {
    selectedTime: React.PropTypes.number.isRequired,
    onTimeChange: React.PropTypes.func,
    timeType: React.PropTypes.number,
    height: React.PropTypes.number,
  },


  render:function() {
    let style = {
      autoWidth:false,
      style:{
      width: '90px',
      height: '32px'
      },
      labelStyle:{
      lineHeight:'32px',
      textOverflow:'clip'
      },
      onChange:this._onTimeTouchTap
    };

    return (
      <DropDownMenu underlineStyle={{display:'none'}} iconStyle={{display:'none'}} value={this._getSelectedTimeIndex()} {...style}>
          {this._getTimeItems()}
      </DropDownMenu>

    );
  },

  _getTimeItems() {
    let timeArray = this._getTimeArray();

    return timeArray.map((timeItem, i) => {
      return (
          this._getTimeElements(timeItem, i)
      );
    }, this);
  },
  _getSelectedTimeIndex:function(){
    let timeArray = Immutable.fromJS(this._getTimeArray());
    return timeArray.findIndex(time=>(time.get('value')===this.props.selectedTime))+this.props.timeType;
  },
  _getTimeArray(){
    var timeType = this.props.timeType || 0;
    var timeArray = [];
    for(var i = 0; i < 6; i++){
      for(var j = timeType; j < (timeType+4); j++){
        timeArray.push({ value: i*4+j, text: (((i*4+j) < 10) ? '0' : '') + (i*4+j) + ':00' });
      }
    }
    return timeArray;
  },

  _getTimeElements(timeItem, i) {
      return (
        <MenuItem key={'time' + i} value={timeItem.value} primaryText={timeItem.text} />
      );
  },

  _onTimeTouchTap(e, selectedIndex, value) {
    if (this.props.onTimeChange) this.props.onTimeChange(e, selectedIndex, value);
  }
});


module.exports = CalendarTime;
