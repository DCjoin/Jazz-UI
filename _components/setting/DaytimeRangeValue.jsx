import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, FlatButton, FloatingActionButton, RadioButtonGroup, RadioButton, DatePicker,RaisedButton,CircularProgress } from 'material-ui';
import assign from "object-assign";
import classNames from 'classnames';
import YearPicker from '../../controls/YearPicker.jsx';
import DaytimeSelector from '../../controls/DaytimeSelector.jsx';
import NodeButtonBar from './NodeButtonBar.jsx';
import CommonFuns from '../../util/Util.jsx';
import TBSettingAction from '../../actions/TBSettingAction.jsx';
import TBSettingStore from '../../stores/TBSettingStore.jsx';
import TagStore from '../../stores/TagStore.jsx';
import ViewableDatePicker from '../../controls/ViewableDatePicker.jsx';

var extractNumber = function(str){
  var value = str.replace(/[^\d\.]/g,'');
  var dotIndex = value.indexOf('.');
  if(dotIndex != -1){
    if(dotIndex == 0) value = '0' + value;
    dotIndex = value.indexOf('.');
    value = value.split('.').join('');
    value = [value.slice(0, dotIndex), '.', value.slice(dotIndex)].join('');
  }
  return value;
};

var DaytimeRangeValue = React.createClass({
  mixins:[Navigation,State],
  propTypes: {
    index: React.PropTypes.number,
    start: React.PropTypes.number,
    end: React.PropTypes.number,
    step: React.PropTypes.number,
    tag: React.PropTypes.object,

    value: React.PropTypes.number,
    isViewStatus: React.PropTypes.bool,

    onDaytimeChange: React.PropTypes.func,
    onValueChange: React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      start: 0,
      step: 30,
      end: 1440,
      isViewStatus: true,
    };
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps && this.refs.valueField){
      if(nextProps.value != this.props.value ){
        this.refs.valueField.setValue(nextProps.value);
      }
    }
  },

  _onEndChange: function(e, curEnd, preEnd){
    var preStart = this.props.start, curStart = preStart;

    if(curEnd <= preStart){
      curStart = curEnd - this.props.step;
    }

    if(this.props.onDaytimeChange){
      this.props.onDaytimeChange(e, this.props.index, {
        StartTime: curStart,
        EndTime: curEnd,
        Value: this.refs.valueField.getValue()
      }, {
        StartTime: preStart,
        EndTime: preEnd,
        Value: this.props.value
      });
    }
  },

  _validateValue: function(val){
    var value = extractNumber(val);
    this.refs.valueField.setValue(value);
    //this.setState({error: (value == '' ? '必填项' : '')});
    return value;
  },

  _onValueChange: function(e){
    var value = this._validateValue(e.target.value);
    if(value == "") value = null;
    if(this.props.onValueChange){
      this.props.onValueChange(e, this.props.index, value);
    }
  },

  render: function(){
    if(this.props.isViewStatus){
      var val = this.props.value;
      if(!val){
        return null;
      }
      var startStr = CommonFuns.numberToTime(this.props.start),
        endStr = CommonFuns.numberToTime(this.props.end);

      var style = {
        padding:'2px 10px',
        color:'#b3b3b3',
        border: '1px solid #efefef' };

      return (
        <div style={{'margin-top':'10px'}}>
          <span style={style}>{startStr}</span>
          <span style={{margin:'0 10px'}}>到</span>
          <span style={style}>{endStr}</span>
          <span style={{padding:'2px 10px',color:'#b3b3b3',border: '1px solid #efefef',margin:'0 10px'}}>{val}</span>
          <span>{this.props.tag.uom}</span>
        </div>
      );
    }
    else{
      var startStyle = {
          border:'1px solid #efefef',
          padding:'10px'
      },
      endProps = {
        from: this.props.start + this.props.step,
        to: 1440,
        step: this.props.step,
        minute: this.props.end,
        isViewStatus: this.props.isViewStatus,
        onChange: this._onEndChange,
        style: {
          border:'1px solid #efefef',
          color:'#767a7a',
          marginRight:'10px',
          //zIndex: 2,
        },
      },
      valProps = {
        defaultValue: this.props.value,
        onChange: this._onValueChange,
        //errorText: this.state.error,
        style: {
          width: "60px",
        }
      };
      var startStr = CommonFuns.numberToTime(this.props.start);
      return (
        <div style={{display:'flex','flex-flow':'row','align-items':'center','margin-top':'10px'}}>
          <div style={startStyle}>{startStr}</div>
          <div style={{margin:'0 10px'}}>到</div>
          <DaytimeSelector {...endProps} ref='endFeild' />
          <TextField {...valProps} ref='valueField'/>
          <div style={{marginLeft:'10px'}}>{this.props.tag.uom}</div>
        </div>
      );
    }
  }
});


module.exports = DaytimeRangeValue;
