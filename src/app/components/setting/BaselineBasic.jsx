import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, FlatButton, FloatingActionButton, RadioButtonGroup, RadioButton, DatePicker,RaisedButton } from 'material-ui';
import assign from "object-assign";
import classNames from 'classnames';
import YearPicker from '../../controls/YearPicker.jsx';
import DaytimeSelector from '../../controls/DaytimeSelector.jsx';
import NodeButtonBar from './NodeButtonBar.jsx';
import CommonFuns from '../../util/Util.jsx';
import TBSettingAction from '../../actions/TBSettingAction.jsx';
import TBSettingStore from '../../stores/TBSettingStore.jsx';

let formatDate = function(date){
  var m = (date.getMonth() + 1), d = date.getDate();
  return date.getFullYear() + '-' + (m>9?''+m:'0'+m) + '-' + (d>9?''+d:'0'+d);
};

var DaytimeRangeValue = React.createClass({
  mixins:[Navigation,State],
  propTypes: {
    curIdx: React.PropTypes.number,
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

  getInitialState:  function(){
    return {
      error: ''
    }
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
      this.props.onDaytimeChange(e, this.props.curIdx, {
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

  validate: function(){
    var val = this.refs.valueField.getValue();
    return this._validate(val);
  },

  _validate: function(val){
    var value = val.replace(/[^\d\.]/g,'');
    var dotIndex = value.indexOf('.');
    if(dotIndex != -1){
      if(dotIndex == 0) value = '0'+value;
      dotIndex = value.indexOf('.');
      value = value.split('.').join('');
      value = [value.slice(0, dotIndex), '.', value.slice(dotIndex)].join('');
    }

    this.refs.valueField.setValue(value);
    if(value == ''){
      this.setState({error: "必填项"});
      return false;
    }
    else{
      this.setState({error: ""});
      return true;
    }
  },

  _onValueChange: function(e){
    if(this._validate(e.target.value)){
      if(this.props.onValueChange){
        this.props.onValueChange(e, this.props.curIdx, this.refs.valueField.getValue());
      }
    }
  },

  render: function(){
    if(this.props.isViewStatus){
      var startStr = CommonFuns.numberToTime(this.props.start),
       endStr = CommonFuns.numberToTime(this.props.end),
       val = this.props.value;

      var style = {
        padding:'2px 10px',
        border: '1px solid #efefef' };

      return (
        <div style={{'margin-top':'10px'}}>
          <span style={style}>{startStr}</span>
          <span style={{margin:'0 10px'}}>到</span>
          <span style={style}>{endStr}</span>
          <span style={{padding:'2px 10px',border: '1px solid #efefef',margin:'0 10px'}}>{val}</span>
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
          marginRight:'10px'
        }
      },
      valProps = {
        defaultValue: this.props.value,
        onChange: this._onValueChange,
        errorText: this.state.error,
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

var DaytimeRangeValues = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    items: React.PropTypes.array,
    isViewStatus: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      items: this.props.items
    };
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps){
      this.setState({items: nextProps.items});
    }
  },

  validate: function(){
    var valiate = true;
    var items = this.state.items;
    for (var i = 0; i < items.length; i++) {
      if(!items[i].validate()){
        valiate = false;
      }
    }
    return validate;
  },

  getValue: function(){
    return this.state.items;
  },

  _onDaytimeRangeValueChange: function(e, curIdx, newObj, preObj){
    var items = this.state.items, newItems=[];

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if(curIdx > i){
        newItems.push(item);
      }else if(curIdx == i){
        item.EndTime = newObj.EndTime;
        newItems.push(item);
      }

      if(newObj.end == 1440){
        break;
      }else{
        newItems.push({
          StartTime: newObj.EndTime,
          DayType: 0,
          EndTime: 1440
        });
        break;
      }
    }
    this.setState({items: newItems});
  },

  _onValueChange: function (e, curIdx, newVal) {
    var items = this.state.items;
    items[curIdx].Value = newVal;
  },

  render: function() {
    var me = this, idx = 0, items = this.state.items;
    var createItem = function(item){
      var props = {
        tag: me.props.tag,
        ref: 'item'+ item,
        curIdx: idx++,
        start: item.StartTime,
        end: item.EndTime,
        value: item.Value,
        isViewStatus: me.props.isViewStatus,
        onDaytimeChange: me._onDaytimeRangeValueChange,
        onValueChange: me._onValueChange
      };
      return (<DaytimeRangeValue {...props} />);
    }
    return <div>{items.map(createItem)}</div>;
  }
});

var NormalSetting = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    items: React.PropTypes.array,
    isViewStatus: React.PropTypes.bool,
    isDisplay: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      start: this.props.start,
      workdays: this._extractWorkItems(),
      nonWorkdays: this._extractNonWorkItems(),
      isViewStatus: this.props.isViewStatus,
    };
  },

  componentDidMount: function() {
    var workdays = this._extractWorkItems(),
    nonWorkdays = this._extractNonWorkItems();
    this.setState({
      workdays: workdays,
      nonWorkdays: nonWorkdays
    });
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps){
      var workdays = this._extractWorkItems(nextProps),
      nonWorkdays = this._extractNonWorkItems(nextProps);
      this.setState({
        workdays: workdays,
        nonWorkdays: nonWorkdays
      });
    }
  },

  _composeEndTime: function(items){
    for (var i = 0; i < items.length; i++) {
      if(i == items.length - 1){
        items[i].EndTime = 1440;
      }else{
        items[i].EndTime = items[i+1].StartTime;
      }
    }
    return items;
  },

  _extractWorkItems: function(props){
    var items;
    if(props) items = props.items;
    else items = this.props.items;

    var workdays=[], newWorkdays=[];
    if(!items) items = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if(item.DayType==0){
        workdays.push(item);
      }
    }
    if(workdays.length == 0){
      workdays.push({
        StartTime: 0,
        DayType: 0,
        EndTime: 1440,
      });
    }
    return this._composeEndTime(workdays);
  },

  _extractNonWorkItems: function(props){
    var items;
    if(props) items = props.items;
    else items = this.props.items;

    var nonWorkdays = [];
    if(!items) items = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if(item.DayType == 1){
        nonWorkdays.push(item);
      }
    }
    if(nonWorkdays.length == 0){
      nonWorkdays.push({
        StartTime: 0
      });
    }
    return this._composeEndTime(nonWorkdays);
  },

  validate: function(){
    return this.refs.workdayValues.validate()
      && this.refs.nonWorkdayValues.validate();
  },

  getValue: function () {
    var workdays = this.refs.workdayValues.getValue(),
      nonWorkdays = this.refs.nonWorkdayValues.getValue(),
      set = [];
    for (var i = 0; i < workdays.length; i++) {
      workdays[i].DayType = 0;
      set.push(workdays[i]);
    }
    for (var i = 0; i < nonWorkdays.length; i++) {
      nonWorkdays[i].DayType = 1;
      set.push(nonWorkdays[i]);
    }
    return set;
  },

  render: function () {
    if(!this.props.isDisplay){
      return <div></div>;
    }

    var workProps = {
      tag: this.props.tag,
      items: this.state.workdays,
      isViewStatus: this.props.isViewStatus
    },
    nonWorkdayProps = {
      tag: this.props.tag,
      items: this.state.nonWorkdays,
      isViewStatus: this.props.isViewStatus
    };

    var style = {
      marginLeft: "35px"
    };
    return (
      <div style={style}>
        <div style={{'margin-top':'10px'}}>小时基准值</div>
        <div style={{color:'#abafae','margin-top':'18px'}}>工作日</div>
        <div>
          <DaytimeRangeValues ref="workdayValues" {...workProps} />
        </div>
        <div style={{color:'#abafae','margin-top':'18px'}}>非工作日</div>
        <div>
          <DaytimeRangeValues ref="nonWorkdayValues" {...nonWorkdayProps} />
        </div>
      </div>
    );
  }
});

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
      this.refs.val1Feild.setValue(nextProps.val1);
      this.refs.val2Feild.setValue(nextProps.val2);
    }
  },

  getValue: function(){
    return {
      WorkDayValue: this.state.val1,
      HolidayDayValue: this.state.val2,
      WorkDayModifyStatus: this.state.val1Mod || this.state.val1 != this.props.val1,
      HolidayModifyStatus: this.state.val2Mod || this.state.val2 != this.props.val2
    }
  },

  _formatValue: function(idx){
    var ctrl = this.refs["val"+idx+"Feild"];
    var value = ctrl.getValue().replace(/[^\d\.]/g,'');
    var dotIndex = value.indexOf('.');
    if(dotIndex != -1){
      if(dotIndex == 0) value = '0'+value;
      dotIndex = value.indexOf('.');
      value = value.split('.').join('');
      value = [value.slice(0, dotIndex), '.', value.slice(dotIndex)].join('');
    }
    ctrl.setValue(value);
    return value;
  },

  _onVal1Change: function(e, d){
    var val = this._formatValue(1);
    this.setState({val1: val, val1Mod: this.state.val1Mod || val != this.props.val1});
  },

  _onVal2Change: function(e, d){
    var val = this._formatValue(2);
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
    if(this.props.isViewStatus){
      return (<tr>
        <td width='110px'><span>{this._getTimeStr(this.props.time)}</span></td>
        <td style={tdStyle}>
          <span>{this.props.val1}</span>
          <span>{this.props.tag.uom}</span><span>{this.props.val1Mod ? "修正": ""}</span>
        </td>
        <td style={tdStyle}>
          <span>{this.props.val2}</span>
          <span>{this.props.tag.uom}</span><span>{this.props.val2Mod? "修正": ""}</span>
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
          <TextField ref='val1Feild' defaultValue={this.state.val1} onChange={this._onVal1Change} style={style} />
          <span>{this.props.tag.uom}</span><span>{this.state.val1Mod ? "修正": ""}</span>
        </td>
        <td style={tdStyle}>
          <TextField ref='val2Feild' defaultValue={this.state.val2} onChange={this._onVal2Change} style={style} />
          <span>{this.props.tag.uom}</span><span>{this.state.val2Mod? "修正": ""}</span>
        </td>
      </tr>);
    }
  }
});

var CalcSetting = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    start: React.PropTypes.object,
    end: React.PropTypes.object,
    items: React.PropTypes.array,
    onCalc: React.PropTypes.func,
    isViewStatus: React.PropTypes.bool,
    isDisplay: React.PropTypes.bool
  },

  getDefaultProps:function(){
    return {items: []};
  },

  _onCalcClick: function(){
    if(this.props.onCalc){
      this.props.onCalc();
    }
  },

  validate: function(){

  },

  getValue: function(){
    var arr = [];
    for (var i = 1; i < 25; i++) {
      var val = this.refs['item' + i].getValue();
      val.TBTime = i;
      arr.push(val);
    }
    return arr;
  },

  render: function () {
    if(!this.props.isDisplay){
      return <div></div>;
    }
    var items = this.props.items || [];
    var arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    var me = this;
    var createItem = function(item, index){
      for (var i = 0; i < items.length; i++) {
        if(items[i].TBTime == item){
          var props = {
            tag: me.props.tag,
            ref: 'item'+ item,
            time: item,
            val1: items[i].WorkDayValue,
            val2: items[i].HolidayDayValue,
            val1Mod: items[i].WorkDayModifyStatus,
            val2Mod: items[i].HolidayModifyStatus,
            isViewStatus: me.props.isViewStatus,
          };
          return <CalcItem {...props} />;
        }
      }
      var props = {
        tag: me.props.tag,
        ref: 'item'+ item,
        time: item,
        isViewStatus: me.props.isViewStatus,
        val1: '',
        val2: '',
        val1Mod: false,
        val2Mod: false,
      };
      return <CalcItem {...props} />;
    },
    rows = arr.map(createItem);

    var style = {
      margin: "18px 0",
      padding:'9px',
      border:"1px solid #efefef",
    };

    var reCalcCtrl;
    if(!this.props.isViewStatus){
      reCalcCtrl = <a href="javascript:void(0)" onClick={this._onCalcClick}  style={{color:'#1ca8dd','margin-left':'27px'}}>重新计算</a>;
    }

    return (
      <div>
        <div className="jazz-setting-basic-calcsetting">
          <table >
            <tr>
              <td>时间</td>
              <td>工作日</td>
              <td>非工作日</td>
            </tr>
            {rows}
          </table>
        </div>
        {reCalcCtrl}
      </div>
    );
  }
});

var SpecialItem = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    year: React.PropTypes.number,
    index: React.PropTypes.number,
    settingId: React.PropTypes.number,
    start: React.PropTypes.string,
    end: React.PropTypes.string,
    value: React.PropTypes.number,
    isViewStatus: React.PropTypes.bool,
    onRemove: React.PropTypes.func,
    onChange: React.PropTypes.func,
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps){
      if(nextProps.start && nextProps.start != this.props.start ){
        this.refs.startDateField.setDate(this._toFormDate(this.props.start));
      };
      if(nextProps.end && nextProps.end != this.props.end ){
        this.refs.endDateField.setDate(this._toFormDate(this.props.end));
      };
      if(nextProps.value != this.props.value ){
        this.refs.valueField.setValue(nextProps.value);
      }
    }
  },

  validate: function(){
    var val = this.refs.valueField.getValue();
    return this._validate(val);
  },

  _validate: function(val){
    var value = val.replace(/[^\d\.]/g,'');
    var dotIndex = value.indexOf('.');
    if(dotIndex != -1){
      if(dotIndex == 0) value = '0'+value;
      dotIndex = value.indexOf('.');
      value = value.split('.').join('');
      value = [value.slice(0, dotIndex), '.', value.slice(dotIndex)].join('');
    }

    this.refs.valueField.setValue(value);
    if(value == ''){
      this.setState({error: "必填项"});
      return false;
    }
    else{
      this.setState({error: ""});
      return true;
    }
  },

  _onValueChange: function(e){
    if(this._validate(e.target.value)){
      if(this.props.onValueChange){
        this.props.onValueChange(e, this.props.curIdx, this.refs.valueField.getValue());
      }
    }
  },

  getValue: function(){
    return {
      TBSettingId: this.props.settingId,
      StartTime: this._getJsonDateTime(this.refs.startDateField.getDate(), this.refs.startTimeField.getValue()),
      EndTime: this._getJsonDateTime(this.refs.endDateField.getDate(), this.refs.endTimeField.getValue()),
      Value: this.refs.valueField.getValue()
    };
  },

  _getJsonDateTime: function(date, time){
    var d = new Date(date);
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(time/60), time % 60);
    return CommonFuns.DataConverter.DatetimeToJson(d);
  },

  _onRemove: function () {
    var me = this;
    if(this.props.onRemove){
      this.props.onRemove(me, this.props.index);
    }
  },

  _toFormDate: function(dtJson){
    var date = new Date(CommonFuns.DataConverter.JsonToDateTime(dtJson, false));
    return new Date(date.getFullYear(), date.getMonth()+1, date.getDay());
    //return date.getFullYear() + '-' + (date.getMonth() +1) + '-' + date.getDate();
  },
  _toFormTime: function(dtJson){
    var dt = new Date(CommonFuns.DataConverter.JsonToDateTime(dtJson, false));
    return dt.getHours() * 60 + dt.getMinutes();
  },

  render: function () {
    if(this.props.isViewStatus){
      var me = this, menuItems = [], minutes = 0,
      sd = this._toFormDate(this.props.start),
      ed = this._toFormDate(this.props.end), st= this._toFormTime(this.props.start),
      et = this._toFormTime(this.props.end);

      var startDate = new Date(me.props.year, 0, 1), dstartDate = startDate,
      endDate = new Date(me.props.year, 11, 31), dendDate = endDate;
      if(me.props.start) dstartDate = this._toFormDate(me.props.start);
      if(me.props.end) dendDate = this._toFormDate(me.props.end);

      var startDateStr = dstartDate.getFullYear() + '-' + (dstartDate.getMonth() + 1) + '-' + dstartDate.getDate(),
        endDateStr = dendDate.getFullYear() + '-' + (dendDate.getMonth() + 1) + '-' + dendDate.getDate();

      var startTimeStr = CommonFuns.numberToTime(st),
       endTimeStr = CommonFuns.numberToTime(et),
       val = this.props.value;

      var style = { padding: '2px 10px', border: '1px solid #efefef','margin-right':'10px'};

      return (<div style={{'margin-top':'10px'}}>
          <span style={style}>{startDateStr}</span>
          <span style={style}>{startTimeStr}</span>
          <span style={{'margin-right':'10px'}} >到</span>
          <span style={style}>{endDateStr}</span>
          <span style={style}>{endTimeStr}</span>
          <div style={{display:'flex','flex-flow':'row','margin-top':'10px'}}>
            <div style={style}>
              {this.props.value}
            </div>
            <span> {this.props.tag.uom}</span>
          </div>
        </div>
      );
    }
    else{
      var me = this, menuItems = [], minutes = 0,
      sd = this._toFormDate(this.props.start),
      ed = this._toFormDate(this.props.end), st= this._toFormTime(this.props.start),
      et = this._toFormTime(this.props.end);

      for (var i = 1; ; i++) {
        var hmstr = CommonFuns.numberToTime(minutes);
        menuItems.push({ payload: i.toString(), text: hmstr });

        minutes = minutes + 30;
        if(minutes > 1440) break;
      }

      var startDate = new Date(me.props.year, 0, 1), dstartDate = startDate,
      endDate = new Date(me.props.year, 11, 31), dendDate = endDate;
      if(me.props.start) dstartDate = this._toFormDate(me.props.start);
      if(me.props.end) dendDate = this._toFormDate(me.props.end);

      var datapickerStyle = {
          width:'75px',
          height:'32px',
          marginLeft:'10px',
          fontSize:'14px',
          color:'#767a7a'
      },
      flatButtonStyle={
        padding: '0',
        minWidth: '20px',
        width:'30px',
        height: '20px',
        verticalAlign:'middle',
        lineHeight:'20px',
        marginLeft:'5px',
        marginTop:'7px'
      };

      var startProps = {
        //formatDate: formatDate,
        defaultDate: dstartDate,
        minDate: startDate,
        maxDate: endDate,
        style: datapickerStyle,
        //className: 'jazz-setting-basic-date',
        onChange: function(e, v){
          var startDate = v;
          var endDate = me.refs.endDateField.getDate();

          if(endDate && endDate < v){
            me.refs.endDateField.setDate(v);
            endDate = v;
          }
          if(this.props.onDateTimeChange){
            this.props.onDateTimeChange()
          }
        }
      },
      endProps = {
        //formatDate: formatDate,
        defaultDate: dendDate,
        minDate: startDate,
        maxDate: endDate,
        style: datapickerStyle,
        //className: 'jazz-setting-basic-date',
      };

      var daytimeProps = {
        from: 0,
        to: 1440,
        step: 30,
        isViewStatus: this.props.isViewStatus,
        style:{
          display: "block",
          border:'1px solid #efefef',
          width:'100px',
          fontSize:'14px',
          marginLeft:'10px'
        }
      };

      return (
        <div>
          <div style={{display:'flex','flex-flow':'row','margin-top':'18px'}}>
              <div className="jazz-setting-basic-datepicker-container">
            <DatePicker ref='startDateField' {...startProps} />
            </div>
            <DaytimeSelector ref='startTimeField' minute={st} {...daytimeProps} />
            <div className='jazz-setting-basic-datespan'>到</div>
              <div className="jazz-setting-basic-datepicker-container">
            <DatePicker ref='endDateField' {...endProps} />
            </div>
            <DaytimeSelector ref='endTimeField' minute={et} {...daytimeProps} />
            <FlatButton style={flatButtonStyle} labelStyle={{padding:'0'}} label="－"  ref="remove"  onClick={this._onRemove} /><br/>
            </div>
            <div>
            <TextField ref='valueField' defaultValue={this.props.value}
              errorText={this.state.error} /><span>{this.props.tag.uom}</span>
          </div>
        </div>
      );
    }
  }
});

var SpecialSetting = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    year: React.PropTypes.number,
    items: React.PropTypes.array,
    isViewStatus: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      items: [],
      isViewStatus: true
    };
  },

  getInitialState: function() {
    return {
      items: this.props.items || [],
      isViewStatus: this.props.isViewStatus
    };
  },

  _getFreshItems: function(){
    var items = this.getValue();
    return items;
  },

  _removeItem: function (src, index) {
    var oldItems = this._getFreshItems(), newItems= [];
    for (var i = 0; i < oldItems.length; i++) {
      if(i != index){
        newItems.push(oldItems[i]);
      }
    }
    this.setState({items: newItems});
  },

  _addItem: function(){
    var arr = this.getValue();
    var item = {
      Id: 0,
      TBSettingId: 0,
      StartTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year, 0, 1)),
      EndTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year + 1, 0, 1))
    };
    arr.push(item);
    this.setState({items: arr});
  },

  getValue: function(){
    var arr = [], len = this.state.items.length;
    for (var i = 0; i < len; i++) {
      arr.push(this.refs['item' + i].getValue());
    }
    return arr;
  },

  render: function() {
    var me = this,
      createItem = function(item, index) {
        var drvProps = {
          tag: me.props.tag,
          year: me.props.year,
          index: index,
          ref: 'item' + index,
          start: item.StartTime,
          end: item.EndTime,
          value: item.Value,
          isViewStatus: me.props.isViewStatus,
          onRemove: me._removeItem
        };
        return (<SpecialItem {...drvProps} />);
      };
    var style = {
      marginLeft: "20px"
    };
    var addBtnProps = {
    style:{
      padding: '0',
      minWidth: '20px',
      width:'30px',
      height: '20px',
      verticalAlign:'middle',
      lineHeight:'20px'
    },
    labelStyle:{
      padding:'0'
    },
    label: "+",
    onClick: this._addItem
  };
    var addBtnCtrl;
    if(!this.props.isViewStatus){
      addBtnCtrl = <FlatButton {...addBtnProps}/>;
    }
    return (<div style={style}>
        <div style={{'margin-top':'18px'}}><span>补充日期</span>{addBtnCtrl}</div>
        <div>{this.state.items.map(createItem)}</div>
      </div>);
  }
});

var TBSettingItem = React.createClass({
  propTypes: {
    index: React.PropTypes.number,
    tag: React.PropTypes.object,
    year: React.PropTypes.number,
    start: React.PropTypes.string,
    end: React.PropTypes.string,

    normals: React.PropTypes.array,
    specials: React.PropTypes.array,
    avgs: React.PropTypes.array,

    isViewStatus: React.PropTypes.bool,
    onRemove:React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      isViewStatus: false,
      normals: [],
      avgs:[],
      specials: []
    };
  },

  getInitialState: function(){
    var s = {
      start: this.props.start || new Date(this.props.year),
      end: this.props.end || new Date(this.props.year + 1, 0, 1),
      avgs: this.props.avgs,
      radio: "NormalRadio"
    };
    if(this.props.avgs && this.props.avgs.length > 0){
      s.radio = "CalcRadio";
    }
    return s;
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps){
      var s = {};
      s.avgs = nextProps.avgs;
      if(nextProps.avgs && nextProps.avgs.length > 0 && this.state.radio == "NormalRadio"){
        s.radio = "CalcRadio";
      }
      else if(nextProps.normals && nextProps.normals.length > 0 && this.state.radio == "CalcRadio"){
        s.radio = "NormalRadio";
      }
      this.setState(s);
    }
  },

  _getJsonDateTime: function(date){
    var d = new Date(date);
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return CommonFuns.DataConverter.DatetimeToJson(d);
  },

  _toFormDate: function(dtJson){
    var date = new Date(CommonFuns.DataConverter.JsonToDateTime(dtJson, false));
    return date;
  },

  _onRemove: function () {
    var me = this;
    if(this.props.onRemove){
      this.props.onRemove(me, this.props.index);
    }
  },

  _onNormalCheck:function(e, newSel){
    this.setState({radio: "NormalRadio"});
    //this.refs.NormalSettingCtrl.
  },

  _onClalcCheck:function(e, newSel){
    this.setState({radio: "CalcRadio"});
  },

  _onCalc: function(){
    var me = this;
    var tr = {
      StartTime: CommonFuns.DataConverter.DatetimeToJson(this.refs.startFeild.getDate()),
      EndTime: CommonFuns.DataConverter.DatetimeToJson(this.refs.endFeild.getDate())
    };
    TBSettingAction.calcData(tr, me.props.tag.tagId, function(data){
      me.setState({avgs: data});
    });
  },

  getValue: function(){
    var tmpDate = this.refs.endFeild.getDate();
    var endDate = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate());
    endDate.setDate(endDate.getDate() + 1);
    var rtn = {
      TbSetting:{
        Year: this.props.year,
        TBId: this.props.tbId,
        StartTime: CommonFuns.DataConverter.DatetimeToJson(this.refs.startFeild.getDate()),
        EndTime: CommonFuns.DataConverter.DatetimeToJson(endDate)
      },
      SpecialDates: this.refs.SpecialSettingCtrl.getValue()
    };
    if(this.state.radio == "CalcRadio") {
      rtn.TbAvgDtos =  this.refs.CalcSettingCtrl.getValue();
    }
    else {
      rtn.NormalDates =  this.refs.NormalSettingCtrl.getValue();
    }
    return rtn;
  },

  render: function(){
    var me = this,
    menuItems = [],
    minutes = 0,
    step = (me.props.step || 30);

    var startDate = new Date(me.props.year, 0, 1), dstartDate = startDate,
    endDate = new Date(me.props.year, 11, 31), dendDate = endDate;
    if(me.props.start) dstartDate = this._toFormDate(me.props.start);
    if(me.props.end) {
      var tmpDate = this._toFormDate(me.props.end);
      dendDate = new Date(tmpDate);
      dendDate.setDate(tmpDate.getDate() -1);
    }

    var normalProps = {
      tag: me.props.tag,
      isViewStatus: me.props.isViewStatus,
      items: me.props.normals
    },
    avgProps = {
      tag: me.props.tag,
      isViewStatus: me.props.isViewStatus,
      items: me.state.avgs,
      start: me.state.start,
      end: me.state.end,
      onCalc: me._onCalc,
    },
    specialProps = {
      tag: me.props.tag,
      year: me.props.year,
      isViewStatus: me.props.isViewStatus,
      items: me.props.specials
    },
    clearStyle = {
      clear: 'both',
      fontSize:'14px'
    },
    labelStyle={
      color:'#767a7a'
    },
    datapickerStyle = {
      width:'90px',
      height:'32px',
      marginLeft:'10px',
      fontSize:'14px',
      color:'#767a7a'
    },
    datePickerAreaStyle={
      display:'flex',
      flexFlow:'row',
      marginTop:'18px',
      alignItems:'center'
    },
    flatButtonStyle={
      padding: '0',
      minWidth: '20px',
      width:'30px',
      height: '20px',
      verticalAlign:'middle',
      lineHeight:'20px',
      marginLeft:'5px'
    };;
    if(this.props.isViewStatus){
      var middleCtrl ;
      // Middle
      if(this.props.avgs && this.props.avgs.length){
        avgProps.isDisplay = true;
        middleCtrl = <div style={clearStyle}>
          <RadioButton name='CalcRadio' key='CalcRadio' ref='CalcRadio' value="CalcRadio"
            label="计算所选数据平均值为基准数据" disabled="true" checked="true"  />
          <CalcSetting ref="CalcSettingCtrl" {...avgProps} />
        </div>
      }
      else{
        normalProps.isDisplay = true;
        middleCtrl = <div className="jazz-setting-basic-clear">
          <RadioButton name='NormalRadio' key='NormalRadio' ref='NormalRadio' value="NormalRadio"
            label="手动设置基准值" disabled="true" checked="true" />
          <NormalSetting ref="NormalSettingCtrl" {...normalProps} />
        </div>
      }
      var startDateStr = dstartDate.getFullYear() + '-' +(dstartDate.getMonth() + 1) + '-' + dstartDate.getDate();
      var endDateStr = dendDate.getFullYear() + '-' +(dendDate.getMonth() + 1) + '-' + dendDate.getDate();

      return (<div>
          <div style={clearStyle}>
            <div style={datePickerAreaStyle}>
              <span style={{'font-size':'14px',color:'#767a7a',border:'1px solid #efefef',padding:'10px'}}>{startDateStr}</span>
              <span style={{margin:'0 10px'}}>到</span>
              <span style={{'font-size':'14px',color:'#767a7a',border:'1px solid #efefef',padding:'10px'}}>{endDateStr}</span>
            </div>
            {middleCtrl}
          </div>
          <div ref="SpecialSettingContainer" style={clearStyle}>
            <SpecialSetting ref="SpecialSettingCtrl" {...specialProps} />
          </div>
        </div>
      );
    }

    var datapickerStyle = {
      width:'90px',
      height:'32px',
      marginLeft:'10px',
      fontSize:'14px',
      color:'#767a7a'
    },
    datePickerAreaStyle={
      display:'flex',
      flexFlow:'row',
      marginTop:'18px',
      alignItems:'center'
    },
    flatButtonStyle={
      padding: '0',
      minWidth: '20px',
      width:'30px',
      height: '20px',
      verticalAlign:'middle',
      lineHeight:'20px',
      marginLeft:'5px'
    };

    var startProps = {
      defaultDate: dstartDate,
      minDate: startDate,
      maxDate: endDate,
      style: datapickerStyle,
      //className: 'jazz-setting-basic-date',
      onChange: function(e, v){
        me.refs.endFeild.minDate = me.refs.startFeild.getDate();
        var endDate = me.refs.endFeild.getDate();

        if(endDate && endDate < v){
          me.refs.endFeild.setDate(v);
        }
      }
    };
    var endProps = {
      defaultDate: dendDate,
      minDate: startDate,
      maxDate: endDate,
      style: datapickerStyle,
      //className: 'jazz-setting-basic-date',
      onChange: function(e, v){
        me.refs.endFeild.minDate = me.refs.startFeild.getDate();
        var endDate = me.refs.endFeild.getDate();

        if(endDate && endDate < v){
          me.refs.endFeild.setDate(v);
        }
      }
    };

    for (var i = 1; ; i++) {
      var hmstr = CommonFuns.numberToTime(minutes);
      menuItems.push({ payload: i.toString(), text: hmstr });

      minutes = minutes + step;
      if(minutes > 1440) break;
    }

    return (<div>
        <div style={clearStyle}>
          <div style={datePickerAreaStyle}>
            <div className="jazz-setting-basic-datepicker-container">
              <DatePicker  ref='startFeild' {...startProps} />
            </div>
            <div style={{'margin-left':'10px'}}>到</div>
            <div className="jazz-setting-basic-datepicker-container">
              <DatePicker  ref='endFeild' {...endProps} />
            </div>

            <FlatButton style={flatButtonStyle} labelStyle={{padding:'0'}} label="－"  ref="remove"  onClick={this._onRemove} />
          </div>
          <div className="jazz-setting-basic-clear">
            <RadioButton name='NormalRadio' ref='NormalRadio' value="NormalRadio"
              label="手动设置基准值" onCheck={this._onNormalCheck} checked={this.state.radio == 'NormalRadio'} />
            <NormalSetting ref="NormalSettingCtrl" {...normalProps} isDisplay={this.state.radio == "NormalRadio"} />

            <RadioButton name='CalcRadio' ref='CalcRadio' value="CalcRadio"
              label="计算所选数据平均值为基准数据" onCheck={this._onClalcCheck} checked={this.state.radio == 'CalcRadio'}  />
            <CalcSetting ref="CalcSettingCtrl" {...avgProps} isDisplay={this.state.radio == "CalcRadio"}  />
          </div>
        </div>
        <div ref="SpecialSettingContainer" style={clearStyle}>
          <SpecialSetting ref="SpecialSettingCtrl" {...specialProps} />
        </div>
      </div>
    );
  }
});

var TBSettingItems = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    year: React.PropTypes.number,
    items: React.PropTypes.array,
    isViewStatus: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      items: [],
      isViewStatus: false,
    };
  },

  getInitialState: function(){
    return {
      items: this.props.items || []
    }
  },

  getValue: function(){
    var arr = [], len = this.state.items.length;
    for (var i = 0; i < len; i++) {
      arr.push(this.refs['item' + i].getValue());
    }
    return arr;
  },

  setValue: function(items){
    this.setState({items: items});
  },

  _setSetting: function(nextProps) {
    var items = [];
    if(nextProps){
      items = nextProps.items;
    }
    this.setState({ items: items });
  },

  _getFreshItems: function(){
    var items = this.getValue();
    return items;
  },

  _removeSetting: function (src, index) {
    var oldItems = this._getFreshItems(), newItems= [];
    for (var i = 0; i < oldItems.length; i++) {
      if(i != index){
        newItems.push(oldItems[i]);
      }
    }
    this.setState({items: newItems});
  },

  _addSetting: function(){
    var arr = this.getValue();
    var item = {
      TbSetting: {
        StartTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year, 0, 1)),
        EndTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year + 1, 0, 1))
      },
      NormalDates: [],
      SpecialDates: [],
      TbAvgDtos: []
    };
    arr.push(item);
    this.setState({items: arr});
  },

  render: function() {
    var me = this,
      cyear = this.props.year;

    var createItem = function(item, index) {
      var drvProps = {
        tag: me.props.tag,
        index: index,
        ref: 'item' + index,
        year: cyear,

        normals: item.NormalDates,
        specials: item.SpecialDates,
        avgs: item.TbAvgDtos,

        isViewStatus: me.props.isViewStatus,
        onRemove: me._removeSetting
      };

      if(item.TbSetting && item.TbSetting.StartTime){
        drvProps.start = item.TbSetting.StartTime;
      }
      if(item.TbSetting && item.TbSetting.EndTime){
        drvProps.end = item.TbSetting.EndTime;
      }
      return (<TBSettingItem {...drvProps} />);
    };

    var addBtnCtrl;
    if(!this.props.isViewStatus){
      var addBtnProps = {
        style:{
          padding: '0',
          minWidth: '20px',
          width:'30px',
          height: '20px',
          verticalAlign:'middle',
          lineHeight:'20px'
        },
        labelStyle:{
          padding:'0'
        },
        label: "+",
        onClick: this._addSetting,
        disabled: this.props.isViewStatus,
      };
      addBtnCtrl =  <FlatButton {...addBtnProps} />
    }
    return (<div style={{'margin-top':'15px'}}>
        <div><span>时段设置</span>{addBtnCtrl}</div>
        <div>{this.state.items.map(createItem)}</div>
      </div>);
  }
});

var CalDetail = React.createClass({

  getInitialState: function() {
        return {
          calendar:this.props.calendar,
          workTimeCalendar:this.props.workTimeCalendar,
          calendarName:this.props.calendarName,
          workTimeCalendarName:this.props.workTimeCalendarName
        };
      },
  render:function(){
    var workDay=[],
        offDay=[],
        workTime=[];
        if(this.state.calendar){
          this.state.calendar.Items.forEach(function(item){
            if(item.Type==0){
              workDay.push(
                <div>{item.StartFirstPart}月{item.StartSecondPart}日至{item.EndFirstPart}月{item.EndSecondPart}日</div>
              )
            }
            else{
              offDay.push(
                  <div>{item.StartFirstPart}月{item.StartSecondPart}日至{item.EndFirstPart}月{item.EndSecondPart}日</div>
              )
            }

          });
        }
        if(this.state.workTimeCalendar){
          this.state.workTimeCalendar.Items.forEach(function(item){
            let StartFirstPart=(item.StartFirstPart<10)?('0'+item.StartFirstPart):(item.StartFirstPart);
            let StartSecondPart=(item.StartSecondPart<10)?('0'+item.StartSecondPart):(item.StartSecondPart);
            let EndFirstPart=(item.EndFirstPart<10)?('0'+item.EndFirstPart):(item.EndFirstPart);
            let EndSecondPart=(item.EndSecondPart<10)?('0'+item.EndSecondPart):(item.EndSecondPart);
            workTime.push(
              <div className="timecontent">{StartFirstPart}:{StartSecondPart}-{EndFirstPart}:{EndSecondPart}</div>
            )
          })
        }

    return(
      <div className="jazz-setting-basic-caldetail">
        <div className="workdaytitle">公休日日历 ：{this.state.calendarName}</div>
        <div className="workdaycontent">默认工作日 : 周一至周五</div>
        <div className="workday">
          <div>工作日 :</div>
          <div className="font">{workDay}</div>
        </div>

      <div className="workday">
        <div>休息日 :</div>
        <div className="font">{offDay}</div>
      </div>
      <div className="worktimetitle">工作时间日历：{this.state.workTimeCalendarName}</div>
      <div className="worktimecontent">工作时间以外均为非工作时间</div>
      <div className="worktime">
        <div>工作时间 :</div>
        <div className="time">
          {workTime}
        </div>
      </div>
    </div>
    )
  }
});

var BaselineBasic = React.createClass({
  mixins:[Navigation,State],

  propTypes: {
    tag: React.PropTypes.object,
    tbId: React.PropTypes.number,

    name: React.PropTypes.string,
    year: React.PropTypes.number,
    items: React.PropTypes.array,

    isViewStatus: React.PropTypes.bool,
    onNameChanged: React.PropTypes.func,
    onYearChanged: React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      items: [],
      isViewStatus: true,
      year: (new Date()).getFullYear(),
    };
  },

  getInitialState: function() {
    return {
      items: this.props.items || [],
      name: this.props.name,
      isViewStatus: this.props.isViewStatus,
      calButton:'显示日历详情',
      showCalDetail:false,
      year:TBSettingStore.getYear(),
      validationError: '',
      hasCal:null,
    };
  },


  getValue: function(){
    return {
      TBId: this.props.tbId,
      Year: this.props.year,
      TBSettings: this.refs.TBSettingItems.getValue()
    };
  },

  loadDataByYear: function(year){
    this.setState({year: year});
  },

  _onTBNameChanged: function(){
    var tbname = this.refs.TBName.getValue();
    if(tbname != this.state.name){
      this.setState("name", tbname);
      if(this.props.onNameChanged){
        this.props.onNameChanged(tbname);
      }
    }
  },

  _onYearChanged: function(yearstr){
    var year = parseInt(yearstr);
    this.setState({year: year});
    this._fetchServerData(year);
    if(year!=TBSettingStore.getYear()){
      TBSettingAction.setYear(year)
    }
  },

  _fetchServerData: function(year) {
    var me = this;
    TBSettingAction.loadData(me.props.tbId, year, function(tbSetting){
      //me.setState({items: tbSetting.TBSettings});

      var itemsCtrl = me.refs.TBSettingItems;
      if(!tbSetting.TBSettings){
        itemsCtrl.setValue([]);
      }else{
        itemsCtrl.setValue(tbSetting.TBSettings);
      }
    });
  },

  _saveDataToServer: function(val){
    var me = this;
    TBSettingAction.saveData(val, function(tbSetting){
      var itemsCtrl = me.refs.TBSettingItems;
      itemsCtrl.items = tbSetting.TBSettings;
    });
  },

  _handleEdit: function(){
    this.setState({
      isViewStatus : false,
    });
	},

  _validateForm: function(val){
    var settings = val.TBSettings;
    for (var i = 0; i < settings.length - 1; i++) {
      for (var j = 1; j < settings.length; j++) {
        if(settings[i].TbSetting.StartTime <= settings[j].TbSetting.StartTime
          && settings[i].TbSetting.EndTime >= settings[j].TbSetting.StartTime){
            this.setState({validationError:'时间重叠'});
            return false;
        }
      }
    }
    this.setState({validationError:''});
    return true;
  },

  _handleSave: function(){
    var val = this.getValue();
    if(this._validateForm(val)){
      this._saveDataToServer(val);
      this.setState({
        isViewStatus : true,
      });
    }
  },

  _handleCancel: function(){
    this.setState({
      isViewStatus : true,
    });
    this._fetchServerData(this.state.year);
  },
  showCalDetail:function(){
    this.setState({
      showCalDetail:!this.state.showCalDetail,
      calButton:((this.state.calButton=='显示日历详情')?'隐藏日历详情':'显示日历详情')
    })
  },
  _onChange:function(){
    var data=TBSettingStore.getCalDetailData();
    if(data){
      this.setState({
        hasCal:true
      })
    }
    else{
      this.setState({
        hasCal:false
      })
    }

  },
  componentWillMount:function(){
    var hierId=TBSettingStore.getHierId();
    TBSettingStore.addCalDetailListener(this._onChange);
    TBSettingAction.calDetailData(hierId);
  },
  componentWillUnmount:function(){
    TBSettingStore.removeCalDetailListener(this._onChange)
  },
  render: function (){
    var itemProps = {
      tag: this.props.tag,
      items: this.state.items,
      year: this.state.year,
      isViewStatus: this.state.isViewStatus,
    };
    var tbNameProps = {
      defaultValue: this.props.name,
      onBlur: this._onTBNameChanged,
      disabled: !this.state.isViewStatus,
      style:{
        fontSize:'14px',
        marginTop:'8px',
        color:'#767a7a'
      }
    };

    var curYear = (new Date()).getFullYear();
    var yearProps = {
      disabled: this.state.isViewStatus,
      ref: "YearField",
      selectedIndex: ((this.state.year || curYear) - curYear + 10) ,
      onYearPickerSelected: this._onYearChanged,
      style:{
        border:'1px solid #efefef',
        margin:'0px 10px'
      }
      //className: "yearpicker",

    };
    var calDetailButton,showCalDetail;
    if(!(this.state.hasCal===null)){
      calDetailButton=((!!this.state.hasCal)?<div className="jazz-setting-basic-calbutton" onClick={this.showCalDetail}>{this.state.calButton}</div>
    :<div>该数据点所关联层级节点未引用任何日历模板。请引用后再设置，保证设置内容可被计算</div>);
    if(this.state.hasCal==false){
      React.findDOMNode(this.refs.editButton).disabled="disabled"
    }
    else{
      React.findDOMNode(this.refs.editButton).disabled=null
    }
    };

    if(this.state.showCalDetail){
        var data=TBSettingStore.getCalDetailData(),
        calDetailprops={
          calendar:data.Calendar,
          workTimeCalendar:data.WorkTimeCalendar,
          calendarName:data.Calendar.Name,
          workTimeCalendarName:data.WorkTimeCalendar.Name
        }
        showCalDetail=<CalDetail  {...calDetailprops}/>
    };
    return (
      <div className='jazz-setting-basic-container'>
      <div className='jazz-setting-basic-content'>
        <div>
          <div><TextField ref="TBName" {...tbNameProps} /></div>
          <div className="jazz-setting-basic-firstline"><span>请选择配置年份进行编辑</span><YearPicker {...yearProps} />
          <span>{calDetailButton}</span>
          </div>

          <div ref="TBSettingContainer">
            <TBSettingItems ref="TBSettingItems" {...itemProps} />
          </div>
        </div>
        {showCalDetail}

      </div>
      <div>{this.state.validationError}</div>
      <div>
        <button type="submit" ref="editButton" hidden={!this.state.isViewStatus} className={classNames({
                                                                                    "jazz-setting-basic-editbutton": true,
                                                                                    "disabled": !this.state.hasCal
                                                                                  })} onClick={this._handleEdit}> 编辑 </button>
        <span>
          <button type="submit" hidden={this.state.isViewStatus} className="jazz-setting-basic-editbutton" onClick={this._handleSave}> 保存 </button>
          <button type="submit" hidden={this.state.isViewStatus} className="jazz-setting-basic-editbutton" onClick={this._handleCancel}> 放弃 </button>
        </span>
      </div>
     </div>);
  }
});

module.exports = BaselineBasic;
