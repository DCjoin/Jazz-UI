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

  getValue: function(){
    return this.state.items;
  },

  _onDaytimeRangeValueChange: function(e, index, newObj, preObj){
    var items = this.state.items, newItems=[];

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if(index > i){
        newItems.push(item);
        continue;
      }else if(index == i){
        item.EndTime = newObj.EndTime;
        newItems.push(item);
      }

      if(newObj.EndTime == 1440){
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

  _onValueChange: function (e, index, newVal) {
    var items = this.state.items;
    items[index].Value = newVal;
  },

  render: function() {
    var me = this, idx = 0;
    var createItem = function(item){
      var props = {
        tag: me.props.tag,
        ref: 'item'+ idx,
        index: idx++,
        start: item.StartTime,
        end: item.EndTime,
        value: item.Value == undefined ? '': item.Value,
        isViewStatus: me.props.isViewStatus,
        onDaytimeChange: me._onDaytimeRangeValueChange,
        onValueChange: me._onValueChange
      };
      return (<DaytimeRangeValue {...props} />);
    }
    return <div>{this.state.items.map(createItem)}</div>;
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
        StartTime: 0,
        DayType: 0,
        EndTime: 1440,
      });
    }
    return this._composeEndTime(nonWorkdays);
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
          "icon-revised": true
        })}></div>
      </div>

    );
    if(this.props.isViewStatus){
      return (<tr >
        <td width='110px'><span>{this._getTimeStr(this.props.time)}</span></td>
        <td style={tdStyle}>
          <div style={{display:'flex','flex-flow':'row','align-items':'center'}}>
          <div>{this.props.val1}</div>
          <div>{this.props.tag.uom}</div>
          {this.props.val1Mod ? {icon}: ""}
          </div>

        </td>
        <td style={tdStyle}>
          <div style={{display:'flex','flex-flow':'row','align-items':'center'}}>
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

var CalcSetting = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    start: React.PropTypes.object,
    end: React.PropTypes.object,
    items: React.PropTypes.array,
    onCalc: React.PropTypes.func,
    isViewStatus: React.PropTypes.bool,
    isDisplay: React.PropTypes.bool,
    dateRange:  React.PropTypes.object,
  },

  getDefaultProps:function(){
    return {items: []};
  },

  getValue: function(){
    var arr = [];
    if(!this.refs['item1']){
      return arr;
    }
    for (var i = 1; i < 25; i++) {
      var val = this.refs['item' + i].getValue();
      val.TBTime = i;
      arr.push(val);
    }
    return arr;
  },

  validate: function(){
    var startDate = new Date(this.props.dateRange.start),
      endDate = new Date(this.props.dateRange.end),
      tmpDate = new Date(startDate);
    tmpDate.setMonth(tmpDate.getMonth() + 1);
    return tmpDate >= endDate;
  },

  _onCalcClick: function(){
    if(this.props.onCalc){
      this.props.onCalc();
    }
  },

  render: function () {
    if(!this.props.isDisplay){
      return <div></div>;
    }
    if(!this.validate()){
      return <div style={{color:'red', fontSize: 12}}>所选数据的时间跨度大于一个月，无法计算，请重新选择数据</div>;
    }
    var items = this.props.items || [], rows = [];
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
            val1Mod: items[i].WorkDayValueStatus,
            val2Mod: items[i].HolidayValueStatus,
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
    onDateTimeChange: React.PropTypes.func,
  },

  getInitialState: function(){
    return {
      valueError: '',
      tbSettingError: '',
      specialError: '',
      start: this.props.start,
      end: this.props.end,
      value: this.props.value,
    };
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps){
      if(nextProps.start && nextProps.start != this.state.start ){
        this.refs.startDateField.setValue(jsonToFormDate(nextProps.start));
      };
      if(nextProps.end && nextProps.end != this.props.end ){
        this.refs.endDateField.setValue(toFormEndDate(jsonToFormDate(nextProps.end)));
      };
      if(nextProps.value != this.props.value ){
        this.refs.valueField.setValue(nextProps.value);
      }
      this.setState({
        start: nextProps.start,
        end: nextProps.end,
        value: nextProps.value,
      });
    }
  },

  validate: function(tbsItem, specials){
    this.setState({
      valueError: '',
      tbSettingError: '',
    });
    if(!specials) specials = tbsItem.SpecialDates;
    var val = specials[this.props.index];
    return (
      this.validateTBSettingItem(tbsItem, specials) &&
      this.validateSpecialItem(specials) &&
      this.validateValue(val));
  },

  validateValue: function(special){
    var val, valid=true;
    if(special) val = special.Value; else val = this.refs.valueField.getValue();
    if(special.StartTime >= special.EndTime){
      valid = false;
      this.setState({specialError: valid ? '' : '补充日期非法， 请重新选择时段'});
    }
    return  valid && this._validateValue(val) != '';
  },

  validateTBSettingItem: function(tbsItem, specials){
    if(!specials) specials = tbsItem.SpecialDates;
    var tbSetting = tbsItem.TbSetting,
        val = specials[this.props.index],
        valid = jsonToFormDate(tbSetting.EndTime) >= jsonToFormDate(val.EndTime) && jsonToFormDate(tbSetting.StartTime) <= jsonToFormDate(val.EndTime);
    this.setState({tbSettingError: valid ? '' : '与已添加时段冲突，请重新选择时段'});
    return valid;
  },

  validateSpecialItem: function(specials){
    var val = specials[this.props.index], len = specials.length, valid = true;
    for (var i = 0; i < len; i++) {
      if(i != this.props.index){
        valid = valid && (jsonToFormDate(specials[i].EndTime) <= jsonToFormDate(val.StartTime) || jsonToFormDate(specials[i].StartTime) >= jsonToFormDate(val.EndTime));
        if(!valid) break;
      }
    }
    this.setState({specialError: valid ? '' : '补充日期冲突， 请重新选择时段'});
    return valid;
  },

  getValue: function(){
    return {
      TBSettingId: this.props.settingId,
      StartTime: this._getStartTime(),
      EndTime: this._getEndTime(),
      Value: this.refs.valueField.getValue()
    };
  },

  _getStartTime: function(){
    var startDate = this.refs.startDateField.getValue(),
      startTime = this.refs.startTimeField.getValue();
    return datetimeTojson(startDate, startTime);
  },

  _getEndTime: function(){
    var endDate = this.refs.endDateField.getValue(),
      endTime = this.refs.endTimeField.getValue();
    return datetimeTojson(endDate, endTime);
  },

  _validateValue: function(val){
    var value = extractNumber(val);
    if(val != value) this.refs.valueField.setValue(value);
    this.setState({valueError: (value == '' ? '必填项' : '')});
    return value;
  },

  _onValueChange: function(e){
    this._validateValue(e.target.value);
  },

  _onRemove: function () {
    var me = this;
    if(this.props.onRemove){
      this.props.onRemove(me, this.props.index);
    }
  },

  _slideDateTime: function(sd, st, ed, et){
    var startDate = sd, startTime = st, endDate = ed, endTime = et;
    if(!startDate) startDate = this.refs.startDateField.getValue();
    if(!startTime) startTime = this.refs.startTimeField.getValue();
    if(!endDate) endDate = this.refs.endDateField.getValue();
    if(!endTime) endTime = this.refs.endTimeField.getValue();
    var computedStartTime = mergeDateTime(startDate, startTime),
      computedEndTime = mergeDateTime(endDate, endTime);

    if(computedStartTime >= computedEndTime){
      if(sd || st){
        if(startTime == 1440){
          endDate.setDate(endDate.getValue() + 1);
          this.refs.endDateField.setValue(endDate);
          this.refs.endTimeField.setValue(30);
        }
        else{
          this.refs.endTimeField.setValue(startTime + 30);
        }
        computedEndTime.setMinutes(computedEndTime.getMinutes() + 30);
      } else if(ed || dt){
        if(endTime == 0){
          startDate.setDate(startDate.getValue() - 1);
          this.refs.startDateField.setValue(startDate);
          this.refs.startTimeField.setValue(1410);
        }else{
          this.refs.startTimeField.setValue(endTime - 30);
        }
        computedStartTime.setMinutes(computedStartTime.getMinutes() - 30);
      }
    }
    var jstart =  CommonFuns.DataConverter.DatetimeToJson(computedStartTime),
      jend = CommonFuns.DataConverter.DatetimeToJson(computedEndTime),
      val = this.refs.valueField.getValue();
    var tmpVal = {start: jstart, end: jend, value: val};
    this.setState(tmpVal);

    if(this.props.onDateTimeChange){
      this.props.onDateTimeChange({
        StartTime: jstart,
        EndTime: jend,
        Value: val
      }, this.props.index);
    }
  },

  render: function () {
    if(this.props.isViewStatus){
      var me = this,
        st = jsonToFormTime(this.state.start),
        et = jsonToFormTime(this.state.end),
        startDate = jsonToFormDate(me.state.start),
        endDate = jsonToFormDate(me.state.end);

      if(et == 0){
        et = 1440;
        endDate = toFormEndDate(endDate);
      }
      var startDateStr = formatDate(startDate),
        endDateStr = formatDate(endDate),
        startTimeStr = CommonFuns.numberToTime(st),
        endTimeStr = CommonFuns.numberToTime(et),
        val = this.state.value;

      var style = { padding: '2px 10px', border: '1px solid #efefef','margin-right':'10px'};

      return (<div style={{'margin-top':'10px'}}>
          <span style={style}>{startDateStr}</span>
          <span style={style}>{startTimeStr}</span>
          <span style={{'margin-right':'10px'}} >到</span>
          <span style={style}>{endDateStr}</span>
          <span style={style}>{endTimeStr}</span>
          <div style={{display:'flex','flex-flow':'row','margin-top':'10px'}}>
            <div style={style}>
              {this.state.value}
            </div>
            <span> {this.props.tag.uom}</span>
          </div>
        </div>
      );
    }
    else{
      var me = this, menuItems = [], minutes = 0,
        st = jsonToFormTime(this.state.start),
        et = jsonToFormTime(this.state.end),
        startDate = new Date(me.props.year, 0, 1),
        endDate = new Date(me.props.year, 11, 31),
        dstartDate = me.state.start ? jsonToFormDate(me.state.start) : startDate,
        dendDate = me.state.end ? jsonToFormDate(me.state.end) : endDate;

      if(et == 0) {
        et = 1440;
        dendDate = toFormEndDate(dendDate);
      }

      for (var i = 1; ; i++) {
        var hmstr = CommonFuns.numberToTime(minutes);
        menuItems.push({ payload: i.toString(), text: hmstr });

        minutes = minutes + 30;
        if(minutes > 1440) break;
      }

      var datapickerStyle = {
          width:'90px',
          height:'32px',
          fontSize:'14px',
          fontFamily:'Microsoft YaHei',
          color:'#767a7a'
        }, flatButtonStyle={
          padding: '0',
          minWidth: '20px',
          width:'30px',
          height: '20px',
          verticalAlign:'middle',
          lineHeight:'20px',
          marginLeft:'5px',
          marginTop:'7px'
        }, daytimeStyle = {
          display: "block",
          border:'1px solid #efefef',
          width:'100px',
          fontSize:'14px',
          marginLeft:'10px'
        };

      var startDateProps = {
          dateFormatStr: 'MM-DD',
          defaultValue: dstartDate,
          minDate: startDate,
          maxDate: endDate,
          style: datapickerStyle,
          onChange: function(e, v){
            me._slideDateTime(v);
          }
        }, endDateProps = {
          dateFormatStr: 'MM-DD',
          defaultValue: dendDate,
          minDate: startDate,
          maxDate: endDate,
          style: datapickerStyle,
          onChange: function(e, v){
            me._slideDateTime(null, null, v);
          }
        }, startTimeProps = {
          from: 0,
          to: 1410,
          step: 30,
          isViewStatus: this.props.isViewStatus,
          style: daytimeStyle,
          minute: st,
          onChange: function(e, v){
            me._slideDateTime(null, v);
          }
        }, endTimeProps = {
          from: 30,
          to: 1440,
          step: 30,
          isViewStatus: this.props.isViewStatus,
          style: daytimeStyle,
          minute: et,
          onChange: function(e, v){
            me._slideDateTime(null, null, null, v);
          }
        };

      return (
        <div>
          <div style={{display:'flex','flex-flow':'row','margin-top':'18px'}}>
              <div className="jazz-setting-basic-datepicker-container">
            <ViewableDatePicker ref='startDateField' {...startDateProps} />
            </div>
            <DaytimeSelector ref='startTimeField' {...startTimeProps} />
            <div className='jazz-setting-basic-datespan'>到</div>
              <div className="jazz-setting-basic-datepicker-container">
            <ViewableDatePicker ref='endDateField' {...endDateProps} />
            </div>
            <DaytimeSelector ref='endTimeField' {...endTimeProps} />
            <FlatButton style={flatButtonStyle} labelStyle={{padding:'0'}} className='icon-delete' label="－"  ref="remove"  onClick={this._onRemove} /><br/>
          </div>
          <div style={{color:'red', fontSize: 12}}>{this.state.tbSettingError}</div>
          <div style={{color:'red', fontSize: 12}}>{this.state.specialError}</div>
          <div>
            <div style={{display:'block', float:'left', verticalAlign:'top', width:270}}>
              <TextField ref='valueField' defaultValue={this.state.value}
                errorText={this.state.valueError} onChange={this._onValueChange} />
            </div>
            <div style={{display:'block', float:'left', verticalAlign:'top', width:100, paddingTop: '15px'}}>{this.props.tag.uom}</div>
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
      isViewStatus: true,
      tbsItem: null,
    };
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps){
      this.setState({items: nextProps.items});
    }
  },

  getInitialState: function() {
    return {
      items: this.props.items || [],
      isViewStatus: this.props.isViewStatus,
      tbsItem: null,
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
    var arr = this.getValue(), newArr = [];
    var item = {
      Id: 0,
      TBSettingId: 0,
      StartTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year, 0, 1)),
      EndTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year + 1, 0, 1)),
      //StartTime: null,
      //EndTime: null,
    };
    newArr.push(item);
    for (var i = 0; i < arr.length; i++) {
      newArr.push(arr[i]);
    }
    this.setState({items: newArr});
  },

  _onItemDateTimeChange: function(obj, index){
    var tbsItem = this.state.tbsItem;
    if(tbsItem){
      var val = this.getValue();
      if(val && obj) val[index] = obj;
      this._validate(tbsItem, val);
    }
  },

  validate: function(tbsItem){
    this.setState({tbsItem: tbsItem});
    return this._validate(tbsItem);
  },

  _validate: function(tbsItem, val){
    var valid = true, len = this.state.items.length;
    for (var i = 0; i < len; i++) {
      valid = valid && this.refs['item' + i].validate(tbsItem, val);
    }
    return valid;
  },

  // validateTBSettingItem: function(tbsItem){
  //   var valid = true, len = this.state.items.length;
  //   for (var i = 0; i < len; i++) {
  //     valid = valid & this.refs['item' + i].validate(tbsItem);
  //   }
  //   return valid;
  // },
  //
  // validateSpecialItem: function(specials){
  //   if(!specials) specials = this.getValue();
  //   var valid = true, len = this.state.items.length;
  //   for (var i = 0; i < len; i++) {
  //     valid = valid & this.refs['item' + i].validate(tbsItem);
  //   }
  //   return valid;
  // },

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
          onRemove: me._removeItem,
          onDateTimeChange: me._onItemDateTimeChange
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
    onRemove: React.PropTypes.func,
    onSettingItemDateChange: React.PropTypes.func,

    dateRange:  React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      isViewStatus: false,
      normals: [],
      avgs:[],
      specials: [],
      error: '',
    };
  },

  getInitialState: function(){
    var s = {
      start: this.props.start,
      end: this.props.end,
      avgs: this.props.avgs,
      radio: "NormalRadio",
      normals: this.props.normals,
      specials: this.props.specials,
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
      s.normals = nextProps.normals;
      s.specials = nextProps.specials;
      if(nextProps.avgs && nextProps.avgs.length > 0 && this.state.radio == "NormalRadio"){
        s.radio = "CalcRadio";
      }
      else if(nextProps.normals && nextProps.normals.length > 0 && this.state.radio == "CalcRadio"){
        s.radio = "NormalRadio";
      }
      else{
        s.radio = "NormalRadio";
      }
      s.start = nextProps.start;
      s.end = nextProps.end;
      this.setState(s);
    }
  },

  _onRemove: function () {
    var me = this;
    if(this.props.onRemove){
      this.props.onRemove(me, this.props.index);
    }
  },

  _onNormalCheck:function(e, newSel){
    var specialVal = this.refs.SpecialSettingCtrl.getValue();
    this.setState({radio: "NormalRadio", specials: specialVal});
    //this.refs.NormalSettingCtrl.
  },

  _onCalcCheck:function(e, newSel){
    var specialVal = this.refs.SpecialSettingCtrl.getValue();
    this.setState({radio: "CalcRadio", specials: specialVal});
    this._calcValues();
  },

  _calcValues: function(){
    var dateRange = this.props.dateRange;
    var me = this;
    var tr = {
      StartTime: CommonFuns.DataConverter.DatetimeToJson(dateRange.start),
      EndTime: CommonFuns.DataConverter.DatetimeToJson(dateRange.end)
    };
    TBSettingAction.calcData(tr, me.props.tag.tagId, function(data){
      me.setState({avgs: data});
    });
  },

  validate: function(tbsItems){
    this.setState({ error: '' });
    var curTbsItem = tbsItems[this.props.index];
    return (
      this.validateTbSettingItem(tbsItems) &&
      this.validateSpecialItems(curTbsItem) &&
      this.validateValue()
    );
  },

  validateTbSettingItem: function(tbsItems){
    var curItem = tbsItems[this.props.index],
      curSetting = curItem.TbSetting,
      error = "";

    for (var i = 0; i < tbsItems.length; i++) {
      var tmpSetting = tbsItems[i].TbSetting;
      if(i != this.props.index){
        var valid = (tmpSetting.EndTime <= curSetting.StartTime ||
          tmpSetting.StartTime >= curSetting.EndTime);
        if(!valid){
          error = '时间段冲突， 请重新选择时段';
          break;
        }
      }
    }
    this.setState({ error: error});
    return error == '';
  },

  validateSpecialItems: function(tbsItem){
    if(!tbsItem) tbsItem = this.getValue();
    return this.refs.SpecialSettingCtrl.validate(tbsItem);
  },

  validateValue: function(){
    var calcCtrl = this.refs.CalcSettingCtrl, valid = true;
    if(calcCtrl){
      valid = valid & calcCtrl.validate();
    }
    return valid;
  },

  getValue: function(){
    var startDate = this.refs.startFeild.getValue(), endDate = fromFormEndDate(this.refs.endFeild.getValue());
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0);
    endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0);
    var rtn = {
      TbSetting:{
        Year: this.props.year,
        TBId: this.props.tbId,
        StartTime: CommonFuns.DataConverter.DatetimeToJson(startDate),
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
    if(me.state.start) dstartDate = jsonToFormDate(me.state.start);
    if(me.state.end) {
      var tmpDate = jsonToFormDate(me.state.end);
      dendDate = toFormEndDate(tmpDate);
    }

    var normalProps = {
      tag: me.props.tag,
      isViewStatus: me.props.isViewStatus,
      items: me.state.normals
    },
    avgProps = {
      tag: me.props.tag,
      isViewStatus: me.props.isViewStatus,
      items: me.state.avgs,
      start: me.state.start,
      end: me.state.end,
      onCalc: me._calcValues,
      dateRange:  me.props.dateRange,
    },
    specialProps = {
      tag: me.props.tag,
      year: me.props.year,
      isViewStatus: me.props.isViewStatus,
      items: me.state.specials
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
      if(this.state.avgs && this.state.avgs.length){
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
      var startDateStr = formatDate(dstartDate); //dstartDate.getFullYear() + '-' +(dstartDate.getMonth() + 1) + '-' + dstartDate.getDate();
      var endDateStr = formatDate(dendDate);  //dendDate.getFullYear() + '-' +(dendDate.getMonth() + 1) + '-' + dendDate.getDate();

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
      fontSize:'14px',
      fontFamily:'Microsoft YaHei',
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
      defaultValue: dstartDate,
      dateFormatStr: 'MM-DD',
      minDate: startDate,
      maxDate: endDate,
      style: datapickerStyle,
      //className: 'jazz-setting-basic-date',
      onChange: function(e, v){
        var endDate = me.refs.endFeild.getValue();
        if(endDate && endDate < v){
          me.refs.endFeild.setValue(v);
          endDate = v;
        }
        var jstart =  CommonFuns.DataConverter.DatetimeToJson(v),
          jend = CommonFuns.DataConverter.DatetimeToJson(fromFormEndDate(endDate)),
          myVal = me.getValue();

        myVal.TbSetting.StartTime = jend;
        myVal.TbSetting.EndTime = jend;

        me.setState({
          start: jstart,
          end: jend,
          normals: myVal.NormalDates,
          avgs: myVal.TbAvgDtos,
          specials: myVal.SpecialDates,
        });

        if(me.props.onSettingItemDateChange){
          me.props.onSettingItemDateChange(myVal, me.props.index);
        }
        me.refs.SpecialSettingCtrl.validate(myVal);
      }
    };
    var endProps = {
      dateFormatStr: 'MM-DD',
      defaultValue: dendDate,
      minDate: startDate,
      maxDate: endDate,
      style: datapickerStyle,
      //className: 'jazz-setting-basic-date',
      onChange: function(e, v){
        var startDate = me.refs.startFeild.getValue();
        if(startDate && startDate > v){
          me.refs.startFeild.setValue(v);
          startDate = v;
        }
        var jstart =  CommonFuns.DataConverter.DatetimeToJson(startDate),
          jend = CommonFuns.DataConverter.DatetimeToJson(fromFormEndDate(v)),
          myVal = me.getValue();

        myVal.TbSetting.StartTime = jstart;
        myVal.TbSetting.EndTime = jend;

        me.setState({
          start: jstart,
          end: jend,
          normals: myVal.NormalDates,
          avgs: myVal.TbAvgDtos,
          specials: myVal.SpecialDates,
        });

        if(me.props.onSettingItemDateChange){
          me.props.onSettingItemDateChange(myVal, me.props.index);
        }
        me.refs.SpecialSettingCtrl.validate(myVal);
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
              <ViewableDatePicker  ref='startFeild' {...startProps} />
            </div>
            <div style={{'margin-left':'10px'}}>到</div>
            <div className="jazz-setting-basic-datepicker-container">
              <ViewableDatePicker  ref='endFeild' {...endProps} />
            </div>
            <FlatButton style={flatButtonStyle} labelStyle={{padding:'0'}} className='icon-delete' label="－"  ref="remove"  onClick={this._onRemove} />
          </div>
          <div style={{color:'red', fontSize: 12}}>{this.state.error}</div>
          <div className="jazz-setting-basic-clear">
            <RadioButton name='NormalRadio' ref='NormalRadio' value="NormalRadio" style={{zIndex:0}}
              label="手动设置基准值" onCheck={this._onNormalCheck} checked={this.state.radio == 'NormalRadio'} />
            <NormalSetting ref="NormalSettingCtrl" {...normalProps} isDisplay={this.state.radio == "NormalRadio"} />

            <RadioButton name='CalcRadio' ref='CalcRadio' value="CalcRadio" style={{zIndex:0}}
              label="计算所选数据平均值为基准数据" onCheck={this._onCalcCheck} checked={this.state.radio == 'CalcRadio'}  />
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
    isViewStatus: React.PropTypes.bool,
    dateRange: React.PropTypes.object,
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

  componentWillReceiveProps: function(nextProps){
    if(nextProps){
      this.setState({
        items: nextProps.items,
      });
    }
  },

  tryGetValue: function(){
    var val = this.getValue(),
      len = this.state.items.length,
      valid = true;
    for (var i = 0; i < len; i++) {
      valid = valid && this.refs['item' + i].validate(val);
    }
    return [valid, val];
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

  _onSettingItemDateChange: function(childVal, idx){
    var valid = true, vals = this.getValue();
    if(vals && vals[idx]){
      vals[idx] = childVal;
    }
    for (var i = 0; i < vals.length; i++) {
      valid = valid && this.refs['item' + i].validate(vals);
    }
  },

  _addSetting: function(){
    var arr = this.getValue(), newArr = [];
    var item = {
      TbSetting: {
        StartTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year, 0, 1)),
        EndTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year + 1, 0, 1)),
        //StartTime: null,
        //EndTime: null
      },
      NormalDates: [],
      SpecialDates: [],
      TbAvgDtos: []
    };
    newArr.push(item);
    for (var i = 0; i < arr.length; i++) {
      newArr.push(arr[i]);
    }
    this.setState({items: newArr});
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
        onRemove: me._removeSetting,
        onSettingItemDateChange: me._onSettingItemDateChange,
        dateRange:  me.props.dateRange,
      };

      if(item.TbSetting && item.TbSetting.StartTime){
        drvProps.start = item.TbSetting.StartTime;
      }
      if(item.TbSetting && item.TbSetting.EndTime){
        drvProps.end = item.TbSetting.EndTime;
      }
      return (<TBSettingItem {...drvProps} />);
    };

    var addBtnCtrl, title = <span>时段设置</span>;
    if(this.props.isViewStatus){
      if(this.props.items.length == 0) title = null;
    }else{
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
        <div>{title}{addBtnCtrl}</div>
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
    var workCal=[],
        workDay=[],
        offDay=[],
        workTime=[];
        if(this.state.calendar){
          workCal.push(
            <div className="workdaytitle">公休日日历 ：{this.state.calendarName}</div>
          );
          workCal.push(
            <div className="workdaycontent">默认工作日 : 周一至周五</div>
          );
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
         if(workDay.length!=0){
             workCal.push(
               <div className="workday">
                 <div>工作日 :</div>
                 <div className="font">{workDay}</div>
               </div>
             )
         };
         if(offDay.length!=0){
           workCal.push(
             <div className="workday">
                 <div>休息日 :</div>
                 <div className="font">{offDay}</div>
               </div>
           )
         }
        }
        if(this.state.workTimeCalendar){
          workCal.push(
            <div className="worktimetitle">工作时间日历：{this.state.workTimeCalendarName}</div>
          );
          workCal.push(
            <div className="worktimecontent">工作时间以外均为非工作时间</div>
          );
          this.state.workTimeCalendar.Items.forEach(function(item){
            let StartFirstPart=(item.StartFirstPart<10)?('0'+item.StartFirstPart):(item.StartFirstPart);
            let StartSecondPart=(item.StartSecondPart<10)?('0'+item.StartSecondPart):(item.StartSecondPart);
            let EndFirstPart=(item.EndFirstPart<10)?('0'+item.EndFirstPart):(item.EndFirstPart);
            let EndSecondPart=(item.EndSecondPart<10)?('0'+item.EndSecondPart):(item.EndSecondPart);
            workTime.push(
              <div className="timecontent">{StartFirstPart}:{StartSecondPart}-{EndFirstPart}:{EndSecondPart}</div>
            )
          });
          if(workTime.length!=0){
              workCal.push(
                <div className="worktime">
                  <div>工作时间 :</div>
                  <div className="time">
                    {workTime}
                  </div>
                </div>
              );
          }
        }

    return(
      <div className="jazz-setting-basic-caldetail">
    {workCal}

    </div>
    )
  }
});

var BaselineBasic = React.createClass({
  mixins:[Navigation,State],

  propTypes: {
    tag: React.PropTypes.object,
    dateRange: React.PropTypes.object,
    tbId: React.PropTypes.number,

    name: React.PropTypes.string,
    year: React.PropTypes.number,
    items: React.PropTypes.array,

    isViewStatus: React.PropTypes.bool,
    onNameChanged: React.PropTypes.func,
    onDataLoaded: React.PropTypes.func,
    onRequestShowMask: React.PropTypes.func,
    onRequestHideMask: React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      items: [],
      isViewStatus: true,
    };
  },

  getInitialState: function() {
    return {
      items: this.props.items || [],
      name: this.props.name,
      isViewStatus: this.props.isViewStatus,
      calButton:'显示日历详情',
      showCalDetail:false,
      year: TBSettingStore.getYear(),
      validationError: '',
      hasCal:null,
      tbnameError: '',
      isCalDetailLoading:false
    };
  },

  componentDidMount: function(){
    var hierId=TagStore.getCurrentHierarchyId();
    TBSettingStore.addCalDetailListener(this._onChange);
    TBSettingStore.addCalDetailLoadingListener(this._onCalDetailLoadingChange);
    TBSettingAction.calDetailData(hierId);
    this._fetchServerData(TBSettingStore.getYear());
  },

  componentWillReceiveProps: function(nextProps){
    this.setState({
      year: TBSettingStore.getYear()
    });
    if(nextProps && nextProps.tag && nextProps.tag.tagId){
      this._fetchServerData(TBSettingStore.getYear());
    }
    if(nextProps && nextProps.isViewStatus != this.props.isViewStatus){
      this.setState({isViewStatus: nextProps.isViewStatus});
    }
    var hierId=TagStore.getCurrentHierarchyId();
      TBSettingAction.calDetailData(hierId);
  },

  fetchServerData(){
    this._fetchServerData(TBSettingStore.getYear());
  },

  tryGetValue: function(){
    var items = this.refs.TBSettingItems.tryGetValue();
    items[1] = this.getValue(items[1]);
    return items;
  },

  getValue: function(items){
    if(!items) items = this.refs.TBSettingItems.getValue();
    return {
      TBId: this.props.tbId,
      Year: TBSettingStore.getYear(),
      TBSettings: items
    };
  },

  _onTBNameChanged: function(){
    var tbname = this.refs.TBName.getValue();
    if(tbname != this.state.name){
      var pattern = new RegExp("/^[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\;\.\~\+\%]+( +[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\;\.\~\+\%]+)*$/");
      if(tbname === ''){
        this.setState({tbnameError:'必填项'});
      }
      else if(!pattern.test(tbname)){
        this.setState({tbnameError:'允许汉字，英文字母，数字，下划线和空格'});
      }
      else{
        if(this.props.onNameChanged){
          this.props.onNameChanged(tbname);
        }
        this.setState({tbnameError:''});
      }
    }
  },

  _onYearChanged: function(yearstr){
    var year = parseInt(yearstr);
    this.setState({year: year});
    this._fetchServerData(year);
    if(year != TBSettingStore.getYear()){
      TBSettingAction.setYear(year);

      var data=TBSettingStore.getCalDetailData();
      if(data){
        this.setState({
          hasCal:true,
          calButton:'显示日历详情',
          showCalDetail:false,
        })
      }
      else{
        this.setState({
          hasCal:false,
          showCalDetail:false,
        })
      }
    }
  },

  _bindData: function(tbSetting){
    this.setState({items: tbSetting.TBSettings});
  },

  _fetchServerData: function(year) {
    if(this.props.shouldLoad){
      var me = this;
      TBSettingAction.loadData(me.props.tbId, year, function(data){
        me._bindData(data);
        if(me.props.onDataLoaded){
          me.props.onDataLoaded(me);
        }
      });
    }
  },

  _saveDataToServer: function(val, callback, fail){
    var me = this;
    TBSettingAction.saveData(val, callback, fail);
  },

  _handleEdit: function(){
    this.setState({
      isViewStatus : false,
    });
	},

  _handleSave: function(){
    var me = this;
    var valArr = this.tryGetValue();
    if(valArr){
      var val = valArr[1];
      if(valArr[0]){
        if(this.props.onRequestShowMask){
          this.props.onRequestShowMask(this);
        }
        this._bindData(val);
        this._saveDataToServer(val,
          function(setting){
            me._bindData(setting);
            if(me.props.onRequestHideMask){
              me.props.onRequestHideMask(me);
            }
            me.setState({ isViewStatus : true });
          },
          function(err, res){
            if(me.props.onRequestHideMask){
              me.props.onRequestHideMask(me);
            }
            me.setState({ isViewStatus : true });
          }
        );
      }else {
        this._bindData(val);
      }
    }
  },

  _handleCancel: function(){
    this.setState({
      isViewStatus : true,
    });
    this._fetchServerData(TBSettingStore.getYear());
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
        hasCal:true,
        isCalDetailLoading:TBSettingStore.getCalDetailLoading()
      })
    }
    else{
      this.setState({
        hasCal:false,
        isCalDetailLoading:TBSettingStore.getCalDetailLoading()
      })
    }
  },
  _onCalDetailLoadingChange:function(){
    this.setState({
      isCalDetailLoading:TBSettingStore.getCalDetailLoading()
    })
  },
  componentWillUnmount:function(){
    TBSettingStore.removeCalDetailListener(this._onChange);
    TBSettingStore.removeCalDetailLoadingListener(this._onCalDetailLoadingChange);
  },
  render: function (){
    if(!this.props.shouldLoad){
      return null;
    }

    var itemProps = {
      tag: this.props.tag,
      items: this.state.items,
      year: TBSettingStore.getYear(),
      isViewStatus: this.state.isViewStatus,
      dateRange: this.props.dateRange,
    };
    var tbNameProps = {
      defaultValue: this.props.name,
      onBlur: this._onTBNameChanged,
      disabled: !this.state.isViewStatus,
      errorText: this.state.tbnameError,
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
        margin:'0px 10px',
        //zIndex: 2,
      },
      //className: "yearpicker",

    };
    var calDetailButton,showCalDetail,editButton;
    if(!(this.state.hasCal===null)){
      calDetailButton=((!!this.state.hasCal)?<div className="jazz-setting-basic-calbutton" onClick={this.showCalDetail}>{this.state.calButton}</div>
    :<div>该数据点所关联层级节点在所选年份未引用任何日历模板。请引用后再设置，保证设置内容可被计算</div>);

    if(this.state.hasCal==false){
      editButton=(
        <button type="submit" ref="editButton" disabled="disabled" hidden={!this.state.isViewStatus} className={classNames({
                                                                                    "jazz-setting-basic-editbutton": true,
                                                                                    "disabled": !this.state.hasCal
                                                                                  })} onClick={this._handleEdit}> 编辑 </button>
      )
    }
    else{
      editButton=(
        <button type="submit" ref="editButton" hidden={!this.state.isViewStatus} className={classNames({
                                                                                    "jazz-setting-basic-editbutton": true,
                                                                                    "disabled": !this.state.hasCal
                                                                                  })} onClick={this._handleEdit}> 编辑 </button>
      )
    }

    };

    if(this.state.showCalDetail){
        var data=TBSettingStore.getCalDetailData(),
            calDetailprops={};
        if(data.Calendar){
          calDetailprops.calendar=data.Calendar;
          calDetailprops.calendarName=data.Calendar.Name;
        };
        if(data.WorkTimeCalendar){
          calDetailprops.workTimeCalendar=data.WorkTimeCalendar;
          calDetailprops.workTimeCalendarName=data.WorkTimeCalendar.Name;
        };
      var showCalDetail=<CalDetail  {...calDetailprops}/>
    };

    var spanStyle = {
      padding:'2px 10px',
      border: '1px solid #efefef' };

    var yearPicker = null;
    if(this.state.isViewStatus){
      yearPicker = <YearPicker {...yearProps} />;
    }else{
      yearPicker = <span style={spanStyle}>{this.state.year}</span>;
    }
    if(this.state.isCalDetailLoading){
      return (
        <div style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center',marginTop:'160px'}}>
          <CircularProgress  mode="indeterminate" size={1} />
        </div>
      );
    }
    else{
      return (
        <div className='jazz-setting-basic-container'>
        <div className='jazz-setting-basic-content'>
          <div>
            <div><TextField ref="TBName" {...tbNameProps} /></div>
            <div className="jazz-setting-basic-firstline"><span>请选择配置年份进行编辑</span>{yearPicker}
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
        {editButton}
          <span>
            <button type="submit" hidden={this.state.isViewStatus} className="jazz-setting-basic-editbutton" onClick={this._handleSave}> 保存 </button>
            <button type="submit" hidden={this.state.isViewStatus} className="jazz-setting-basic-editbutton" onClick={this._handleCancel}> 放弃 </button>
          </span>
        </div>
       </div>);
    }

  }
});

module.exports = BaselineBasic;
