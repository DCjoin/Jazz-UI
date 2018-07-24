'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Immutable from 'immutable';
//import {Mixins,Styles,ClearFix,FlatButton} from 'material-ui';
var createReactClass = require('create-react-class');
var CalendarTime = createReactClass({
  propTypes: {
    selectedTime: PropTypes.number.isRequired,
    onTimeChange: PropTypes.func,
    timeType: PropTypes.number,
    height: PropTypes.number,
    isView:PropTypes.bool,
  },

  _renderTime(){
    let timeArray = Immutable.fromJS(this._getTimeArray()),
     index=timeArray.findIndex(time=>(time.get('value')===this.props.selectedTime));
     return timeArray.getIn([index,'text'])
  },

  render:function() {
    if(this.props.isView){
      return <div style={{marginLeft:'10px'}}>{this._renderTime()}</div>
    }
    else {
      let style = {
        autoWidth:false,
        style:{
        width: '60px',
        height: '30px',
        fontSize:'14px',
        color:'#626469'
      },
      menuStyle:{
        width:'100px'
      },
        labelStyle:{
        lineHeight:'30px',
        textOverflow:'clip',
        paddingLeft:'12px',
        paddingRight:'0'
        },
        onChange:this._onTimeTouchTap
      };

      return (
        <DropDownMenu underlineStyle={{display:'none'}} iconStyle={{display:'none'}} value={this._getSelectedTimeIndex()} {...style}>
            {this._getTimeItems()}
        </DropDownMenu>

      );
    }

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
