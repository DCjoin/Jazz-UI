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

var formatDate = function(date){
  var m = (date.getMonth() + 1), d = date.getDate();
  return (m>9?''+m:'0'+m) + '-' + (d>9?''+d:'0'+d);
};

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

var fromFormEndDate = function(date){
  var tmpDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  tmpDate.setDate(tmpDate.getDate() + 1);
  return tmpDate;
};

var toFormEndDate = function(date){
  var tmpDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  tmpDate.setDate(tmpDate.getDate() - 1);
  return tmpDate;
};

var jsonToFormDate = function(dtJson){
  return new Date(CommonFuns.DataConverter.JsonToDateTime(dtJson, false));
};

var jsonToFormTime = function(dtJson){
  var dt = new Date(CommonFuns.DataConverter.JsonToDateTime(dtJson, false));
  return dt.getHours() * 60 + dt.getMinutes();
};

var mergeDateTime = function(date, time){
  var d = new Date(date);
  if(time) d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(time/60), time % 60);
  else d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return d;
}

var datetimeTojson = function(date, time){
  var d = mergeDateTime(date, time);
  return CommonFuns.DataConverter.DatetimeToJson(d);
};

var CalcItem = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    time: React.PropTypes.number,
    val1: React.PropTypes.string,
    val2: React.PropTypes.string,
    val1Mod: React.PropTypes.bool,
    val2Mod: React.PropTypes.bool,
    isViewStatus: React.PropTypes.bool
  },

  getInitialState: function(){
    return {
      val1: this.props.val1,
      val2: this.props.val2,
      val1Mod: this.props.val1Mod,
      val2Mod: this.props.val2Mod
    };
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps){
      this.setState({
        val1: nextProps.val1,
        val2: nextProps.val2,
        val1Mod: nextProps.val1Mod,
        val2Mod: nextProps.val2Mod
      });
      if(this.refs.val1Feild) this.refs.val1Feild.setValue(nextProps.val1);
      if(this.refs.val2Feild) this.refs.val2Feild.setValue(nextProps.val2);
    }
  },

  getValue: function(){
    return {
      WorkDayValue: this.state.val1 == "" ? null : this.state.val1,
      HolidayDayValue: this.state.val2 == "" ? null : this.state.val2,
      WorkDayValueStatus: this.state.val1Mod || this.state.val1 != this.props.val1,
      HolidayValueStatus: this.state.val2Mod || this.state.val2 != this.props.val2
    }
  },

  _onVal1Change: function(e, d){
    var val = extractNumber(e.target.value);
    if(val != e.target.value) this.refs.val1Feild.setValue(val);
    this.setState({val1: val, val1Mod: this.state.val1Mod || val != this.props.val1});
  },

  _onVal2Change: function(e, d){
    var val = extractNumber(e.target.value);
    if(val != e.target.value) this.refs.val2Feild.setValue(val);
    this.setState({val2: val, val2Mod: this.state.val2Mod || val != this.props.val2});
  },

  _getTimeStr: function(timeNum){
    var f = timeNum -1, t = timeNum;
    return (f > 9 ? f : '0' + f ) + ':00-' + (t > 9 ? t : '0' + t )  + ':00';
  },

  render: function(){
    var tdStyle={
      minWidth:'120px'
    };
    var icon = (
      <div style={{'margin-left':'10px'}}>
        <div className={classNames({
          "icon-revised-cn": true
        })}></div>
      </div>

    );
    if(this.props.isViewStatus){
      return (<tr >
        <td width='110px' style={{color:'#b3b3b3'}}><span>{this._getTimeStr(this.props.time)}</span></td>
        <td style={tdStyle}>
          <div style={{display:'flex','flex-flow':'row','align-items':'center',color:'#b3b3b3'}}>
          <div>{this.props.val1}</div>
          <div>{this.props.tag.uom}</div>
          {this.props.val1Mod ? {icon}: ""}
          </div>

        </td>
        <td style={tdStyle}>
          <div style={{display:'flex','flex-flow':'row','align-items':'center',color:'#b3b3b3'}}>
            <div>{this.props.val2}</div>
            <div>{this.props.tag.uom}</div>
            {this.props.val2Mod? {icon}: ""}
          </div>

        </td>
      </tr>);
    }
    else{
      var style={
        width: "50px",
        height:'29px'
      };
      return (<tr>
        <td width='110px'><span>{this._getTimeStr(this.props.time)}</span></td>
        <td style={tdStyle}>
          <div style={{display:'flex','flex-flow':'row','align-items':'center'}}>
            <TextField ref='val1Feild' defaultValue={this.state.val1} onChange={this._onVal1Change} style={style} />
            <div>{this.props.tag.uom}</div>
            {this.state.val1Mod ? {icon}: ""}
          </div>

        </td>
        <td style={tdStyle}>
          <div style={{display:'flex','flex-flow':'row','align-items':'center'}}>
            <TextField ref='val2Feild' defaultValue={this.state.val2} onChange={this._onVal2Change} style={style} />
            <div>{this.props.tag.uom}</div>
            {this.state.val2Mod? {icon}: ""}
          </div>

        </td>
      </tr>);
    }
  }
});

module.exports = CalcItem;
