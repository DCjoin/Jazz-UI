import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, FlatButton, FloatingActionButton, RadioButtonGroup, RadioButton, DatePicker,RaisedButton } from 'material-ui';
import assign from "object-assign";
import YearPicker from '../../controls/YearPicker.jsx';
import DaytimeSelector from '../../controls/DaytimeSelector.jsx';
import NodeButtonBar from './NodeButtonBar.jsx';
import CommonFuns from '../../util/Util.jsx';
import TBSettingAction from '../../actions/TBSettingAction.jsx';
import TBSettingStore from '../../stores/TBSettingStore.jsx';

var DaytimeRangeValue = React.createClass({
  mixins:[Navigation,State],
  propTypes: {
    curIdx: React.PropTypes.number,
    start: React.PropTypes.number,
    end: React.PropTypes.number,
    step: React.PropTypes.number,

    defaultValue: React.PropTypes.number,
    isViewStatus: React.PropTypes.bool,

    onDaytimeChange: React.PropTypes.func,
    onValueChange: React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      start: 0,
      step: 30,
      end: 1440,
      isViewStatus: true
    };
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
        Value: this.props.defaultValue
      });
    }
  },

  _onValueChange: function(e){
    if(this.props.onValueChange){
      this.props.onValueChange(e, this.props.curIdx,
        this.refs.valueField.getValue());
    }
  },

  render: function(){
    if(this.props.isViewStatus){
      var startStr = CommonFuns.numberToTime(this.props.start),
       endStr = CommonFuns.numberToTime(this.props.end),
       val = this.props.defaultValue;

      var style = { padding: '2px 10px', border: '1px solid #ddd' };

      return (
        <div>
          <span style={style}>{startStr}</span>
          <span>到</span>
          <span style={style}>{endStr}</span>
          <span style={style}>{val}</span>
          <span>千瓦</span>
        </div>
      );
    }else{
      var startProps = {
        defaultMinute: this.props.start,
        isViewStatus: true
      },
      endProps = {
        from: this.props.start + this.props.step,
        to: 1440,
        step: this.props.step,
        defaultMinute: this.props.end,
        isViewStatus: this.props.isViewStatus,
        onChange: this._onEndChange,
        style: {

        }
      },
      valProps = {
        defaultValue: this.props.defaultValue,
        onChange: this._onValueChange,
        style: {
          width: "120px",
        }
      };

      return (
        <div>
          <DaytimeSelector {...startProps} ref='startFeild' />
          <span>到</span>
          <DaytimeSelector {...endProps} ref='endFeild' />
          <TextField {...valProps} ref='valueField'/>
          <span>千瓦</span>
        </div>
      );
    }
  }
});

var DaytimeRangeValues = React.createClass({
  propTypes: {
    items: React.PropTypes.array,
    isViewStatus: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      items: this.props.items
    };
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
      }

      if(curIdx < i){
        if(item.EndTime <= newObj.EndTime){
          continue;
        }else if(item.EndTime > newObj.EndTime && item.StartTime <= newObj.StartTime){
          item.StartTime = newObj.EndTime;
          newItems.push(item);
        }else if(item.StartTime > newObj.EndTime){
          if(curIdx == i - 1) item.StartTime = newObj.EndTime;
          newItems.push(item);
        }
      }
    }
    if(curIdx == newItems.length - 1){
      newItems.push({
        StartTime: newObj.EndTime,
        DayType: 0,
        EndTime: 1440
      });
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
        curIdx: idx++,
        start: item.StartTime,
        end: item.EndTime,
        defaultValue: item.Value,
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

  componentWillReceiveProps: function(){
    var workdays = this._extractWorkItems(),
    nonWorkdays = this._extractNonWorkItems();
    this.setState({
      workdays: workdays,
      nonWorkdays: nonWorkdays
    });
  },

  composeEndTime: function(items){
    for (var i = 0; i < items.length; i++) {
      if(i == items.length - 1){
        items[i].EndTime = 1440;
      }else{
        items[i].EndTime = items[i+1].StartTime;
      }
    }
    return items;
  },

  _extractWorkItems: function(){
    var workdays=[], items = this.props.items, newWorkdays=[];
    if(! items) items = [];
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
    return this.composeEndTime(workdays);
  },

  _extractNonWorkItems: function(){
    var nonWorkdays = [], items = this.props.items;
    if(! items) items = [];
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
    return this.composeEndTime(nonWorkdays);
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
      items: this.state.workdays,
      isViewStatus: this.props.isViewStatus
    },
    nonWorkdayProps = {
      items: this.state.nonWorkdays,
      isViewStatus: this.props.isViewStatus
    };

    var style = {
      marginLeft: "30px"
    };
    return (
      <div style={style}>
        <div>小时基准值</div>
        <div>工作日</div>
        <div>
          <DaytimeRangeValues ref="workdayValues" {...workProps} />
        </div>
        <div>非工作日</div>
        <div>
          <DaytimeRangeValues ref="nonWorkdayValues" {...nonWorkdayProps} />
        </div>
      </div>
    );
  }
});

var CalcItem = React.createClass({
  propTypes: {
    time: React.PropTypes.number,
    val1: React.PropTypes.string,
    val2: React.PropTypes.string,
    val1Med: React.PropTypes.bool,
    val2Med: React.PropTypes.bool,
    isViewStatus: React.PropTypes.bool,
  },

  getInitialState: function(){
    return {
      val1: this.props.val1,
      val2: this.props.val2,
      val1Med: this.props.val1Med,
      val2Med: this.props.val2Med
    };
  },

  getValue: function(){
    return {
      WorkDayValue: this.state.val1,
      HolidayDayValue: this.state.val2,
      WorkDayModifyStatus: this.state.val1 != this.props.val1,
      HolidayModifyStatus: this.state.val2 != this.props.val2
    }
  },

  _onVal1Change: function(e, d){
    this.setState({val1: e.target.value, val1Med: e.target.value != this.props.val1});
  },

  _onVal2Change: function(e, d){
    this.setState({val2: e.target.value, val2Med: e.target.value != this.props.val2});
  },

  _getTimeStr: function(timeNum){
    var f = timeNum -1, t = timeNum;
    return (f > 9 ? f : '0' + f ) + ':00-' + (t > 9 ? t : '0' + t )  + ':00';
  },

  render: function(){
    if(this.props.isViewStatus){
      return (<tr>
        <td width='120'><span>{this._getTimeStr(this.props.time)}</span></td>
        <td minwidth='250'>
          <span>{this.props.val1}</span>
          <span>千瓦时</span><span>{this.props.val1Med ? "修正": ""}</span>
        </td>
        <td minwidth='250'>
          <span>{this.props.val2}</span>
          <span>千瓦时</span><span>{this.props.val2Med? "修正": ""}</span>
        </td>
      </tr>);
    }else{
      var style={
        width: "120px"
      };
      return (<tr>
        <td width='120'><span>{this._getTimeStr(this.props.time)}</span></td>
        <td minwidth='250'>
          <TextField ref='val1' defaultValue={this.props.val1} onChange={this._onVal1Change} style={style} />
          <span>千瓦时</span><span>{this.state.val1Med ? "修正": ""}</span>
        </td>
        <td minwidth='250'>
          <TextField ref='val2' defaultValue={this.props.val2} onChange={this._onVal2Change} style={style} />
          <span>千瓦时</span><span>{this.state.val2Med? "修正": ""}</span>
        </td>
      </tr>);
    }
  }
});

var CalcSetting = React.createClass({
  propTypes: {
    tagId: React.PropTypes.number,
    start: React.PropTypes.object,
    end: React.PropTypes.object,
    items: React.PropTypes.array,
    isViewStatus: React.PropTypes.bool,
    isDisplay: React.PropTypes.bool
  },
  getDefaultProps:function(){
    return {items: []};
  },
  _onCalcClick: function(){
    var tr = {
      StartTime: CommonFuns.DataConverter.DatetimeToJson(this.props.start),
      EndTime: CommonFuns.DataConverter.DatetimeToJson(this.props.end)
    };
    TBSettingAction.calcData(tr, this.props.tagId, function(data){
      this.setState({items: data});
    });
  },

  getValue: function(){
    var arr = [];
    for (var i = 1; i < 25; i++) {
      arr.push(this.refs['item' + i].getValue());
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
            ref: 'item'+ item,
            time: item,
            val1: items[i].WorkDayValue,
            val2: items[i].HolidayDayValue,
            val1Med: items[i].WorkDayModifyStatus,
            val2Med: items[i].HolidayModifyStatus,
            isViewStatus: me.props.isViewStatus,
          };
          return <CalcItem {...props} />
        }
      }
      var props = {
        ref: 'item'+ item,
        time: item,
        isViewStatus: me.props.isViewStatus,
      };
      return <CalcItem {...props} />;
    }, rows = arr.map(createItem);

    var style = {
      marginLeft: "30px"
    };

    var reCalcCtrl;
    if(!this.props.isViewStatus){
      reCalcCtrl = <a href="javascript:void(0)" onClick={this._onCalcClick}>重新计算</a>;
    }

    return (
      <div style={style}>
        <table>
          <tr>
            <td>时间</td>
            <td>工作日</td>
            <td>非工作日</td>
          </tr>
          {rows}
        </table>
        {reCalcCtrl}
      </div>
    );
  }
});

var SpecialItem = React.createClass({
  propTypes: {
    year: React.PropTypes.number,
    index: React.PropTypes.number,
    settingId: React.PropTypes.number,
    start: React.PropTypes.object,
    end: React.PropTypes.object,
    value: React.PropTypes.number,
    isViewStatus: React.PropTypes.bool,
    onRemove:React.PropTypes.func
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps){
      if(nextProps.start && nextProps.start != this.props.start ){
        this.refs.startDateField.setDate(this._toFormDate(me.props.start));
      };
      if(nextProps.end && nextProps.end != this.props.end ){
        this.refs.endDateField.setDate(this._toFormDate(me.props.end));
      };
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
       val = this.props.defaultValue;

      var style = { padding: '2px 10px', border: '1px solid #ddd' };

      return (<div>
          <span style={style}>{startDateStr}</span>
          <span style={style}>{startTimeStr}</span>
          <span >到</span>
          <span style={style}>{endDateStr}</span>
          <span style={style}>{endTimeStr}</span>
          <br/>
          <span style={style}>{this.props.value}</span><span>千瓦时</span>
        </div>
      );
    }else{

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
        width: "100px",
        display: "block",
        float: "left",
        height: "32px",
      };

      var startProps = {
        //formatDate: formatDate,
        defaultDate: dstartDate,
        minDate: startDate,
        maxDate: endDate,
        style: datapickerStyle,
        //className: 'jazz-setting-basic-date',
        onChange: function(e, v){
          me.refs.endDateField.minDate = me.refs.startDateField.getDate();
          var endDate = me.refs.endDateField.getDate();

          if(endDate && endDate < v){
            me.refs.endDateField.setDate(v);
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
          float: "left"
        }
      };

      return (<div>
          <DatePicker ref='startDateField' {...startProps} />
          <DaytimeSelector ref='startTimeField' defaultMinute={st} {...daytimeProps} />
          <span className='jazz-setting-basic-datespan'>到</span>
          <DatePicker ref='endDateField' {...endProps} />
          <DaytimeSelector ref='endTimeField' defaultMinute={et} {...daytimeProps} />
          <FlatButton label="－"  ref="remove"  onClick={this._onRemove} /><br/>
          <TextField ref='valueField' defaultValue={this.props.value} /><span>千瓦时</span>
        </div>
      );
    }
  }
});

var SpecialSetting = React.createClass({
  propTypes: {
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

  _removeItem: function (src, index) {
    var oldItems = this.state.items, newItems= [];
    for (var i = 0; i < oldItems.length; i++) {
      if(i != index){
        newItems.push(oldItems[i]);
      }
    }
    this.setState({items: newItems});
  },

  _addItem: function(){
    var item = {
      Id: 0,
      TBSettingId: 0,
      StartTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year, 0, 1)),
      EndTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year + 1, 0, 1))
    },
    newItems = this.state.items.concat([item]);
    this.setState({items: newItems});
  },

  getValue: function(){
    var arr = [];
    for (var i = 0; i < this.state.items.length; i++) {
      arr.push(this.refs['item' + i].getValue());
    }
    return arr;
  },

  render: function() {
    var me = this,
      createItem = function(item, index) {
        var drvProps = {
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
    var addBtnCtrl;
    if(!this.props.isViewStatus){
      addBtnCtrl = <FlatButton label="＋" onClick={this._addItem} />;
    }
    return (<div style={style}>
        <div><span>补充日期</span>{addBtnCtrl}</div>
        <div>{this.state.items.map(createItem)}</div>
      </div>);
  }
});

var TBSettingItem = React.createClass({
  propTypes: {
    index: React.PropTypes.number,
    tagId: React.PropTypes.number,
    year: React.PropTypes.number,
    start: React.PropTypes.number,
    end: React.PropTypes.number,

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
      radio: "NormalRadio"
    };
    if(this.props.avgs && this.props.avgs.length > 0){
      s.radio = "CalcRadio";
    }
    return s;
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

  getValue: function(){
    var rtn = {
      TbSetting:{
        Year: this.props.year,
        TBId: this.props.tbId,
        StartTime: CommonFuns.DataConverter.DatetimeToJson(this.refs.startFeild.getDate()),
        EndTime: CommonFuns.DataConverter.DatetimeToJson(this.refs.endFeild.getDate())
      },
      //NormalDates: this.refs.NormalSettingCtrl.getValue(),
      SpecialDates: this.refs.SpecialSettingCtrl.getValue(),
      //TbAvgDtos: this.refs.CalcSettingCtrl.getValue(),
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
    if(me.props.end) dendDate = this._toFormDate(me.props.end);

    var normalProps = {
      isViewStatus: me.props.isViewStatus,
      items: me.props.normals
    },
    avgProps = {
      tagId: me.props.tagId,
      isViewStatus: me.props.isViewStatus,
      items: me.props.avgs,
      start: me.state.start,
      end: me.state.end,
    },
    specialProps = {
      year: me.props.year,
      isViewStatus: me.props.isViewStatus,
      items: me.props.specials
    },
    clearStyle = {
      clear: 'both',
    };
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
        middleCtrl = <div style={clearStyle}>
          <RadioButton name='NormalRadio' key='NormalRadio' ref='NormalRadio' value="NormalRadio"
            label="手动设置基准值" disabled="true" checked="true" />
          <NormalSetting ref="NormalSettingCtrl" {...normalProps} />
        </div>
      }
      var startDateStr = dstartDate.getFullYear() + '-' +(dstartDate.getMonth() + 1) + '-' + dstartDate.getDate();
      var endDateStr = dendDate.getFullYear() + '-' +(dendDate.getMonth() + 1) + '-' + dendDate.getDate();

      return (<div>
          <div style={clearStyle}>
            <div style={clearStyle}>
              <span style={{ padding: '2px 10px', border: '1px solid #ddd' }}>{startDateStr}</span>
              <span>到</span>
              <span style={{ padding: '2px 10px', border: '1px solid #ddd' }}>{endDateStr}</span>
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
      width: "100px",
      display: "block",
      float: "left",
      height: "32px",
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
    };

    for (var i = 1; ; i++) {
      var hmstr = CommonFuns.numberToTime(minutes);
      menuItems.push({ payload: i.toString(), text: hmstr });

      minutes = minutes + step;
      if(minutes > 1440) break;
    }

    return (<div>
        <div style={clearStyle}>
          <div style={clearStyle}>
            <DatePicker  ref='startFeild' {...startProps} />
            <span className='jazz-setting-basic-datespan'>到</span>
            <DatePicker  ref='endFeild' {...endProps} />
            <FlatButton label="－"  ref="remove"  onClick={this._onRemove} />
          </div>
          <div style={clearStyle}>
            <RadioButton name='NormalRadio' key='NormalRadio' ref='NormalRadio' value="NormalRadio"
              label="手动设置基准值" onCheck={this._onNormalCheck} checked={this.state.radio == 'NormalRadio'} />
            <NormalSetting ref="NormalSettingCtrl" {...normalProps} isDisplay={this.state.radio == "NormalRadio"} />

            <RadioButton name='CalcRadio' key='CalcRadio'  ref='CalcRadio' value="CalcRadio"
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
    tagId: React.PropTypes.number,
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
    var vals = [];
    for (var i = 0; i < this.state.items.length; i++) {
      var ref = this.refs['item' + i];
      if(ref) vals.push(ref.getValue());
    }
    return vals;
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

  _removeSetting: function (src, index) {
    var oldItems = this.state.items, newItems= [];
    for (var i = 0; i < oldItems.length; i++) {
      if(i != index){
        newItems.push(oldItems[i]);
      }
    }
    this.setState({items: newItems});
  },

  _addSetting: function(){
    var item = {
      TbSetting: {
        StartTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year, 0, 1)),
        EndTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year + 1, 0, 1))
      },
      NormalDates: [],
      SpecialDates: [],
      TbAvgDtos: []
    },
    newItems = this.state.items.concat(item);
    this.setState({items: newItems});
  },

  render: function() {
    var me = this,
      cyear = this.props.year;

    var createItem = function(item, index) {
      var drvProps = {
        tagId: me.props.tagId,
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
        drvProps.start = item.TbSetting.StartTime, false;
      }
      if(item.TbSetting && item.TbSetting.EndTime){
        drvProps.end = item.TbSetting.EndTime, false;
      }
      return (<TBSettingItem {...drvProps} />);
    };

    var addBtnCtrl;
    if(!this.props.isViewStatus){
      var addBtnProps = {
        padding: '0',
        width: '20px',
        height: '20px',
        label: "+",
        onClick: this._addSetting,
        disabled: this.props.isViewStatus,
      };
      addBtnCtrl =  <FlatButton {...addBtnProps} />
    }
    return (<div>
        <div><span>时段设置</span>{addBtnCtrl}</div>
        <div>{this.state.items.map(createItem)}</div>
      </div>);
  }
});

var BaselineBasic = React.createClass({
  mixins:[Navigation,State],

  propTypes: {
    tagId: React.PropTypes.number,
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
      year: (new Date()).getFullYear()
    };
  },

  getInitialState: function() {
    return {
      items: this.props.items || [],
      name: this.props.name,
      isViewStatus: this.props.isViewStatus,
    };
  },

  componentWillMount: function(){
    this._onYearChanged(this.props.year + '');
  },

  componentWillUpdate: function(nextProps, nextState){
    if(this.state.year != nextProps.year && nextProps.tbId){
      this._onYearChanged(nextProps.year + '');
    }
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
    if(this.props.onYearChanged){
      this.props.onYearChanged(year);
    }
    this._fetchServerData(year);
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

  _saveDataToServer: function(){
    var val = this.getValue(), me = this;
    TBSettingAction.saveData(val, function(tbSetting){
      debugger;
      var itemsCtrl = me.refs.TBSettingItems;
      itemsCtrl.items = tbSetting.TBSettings;
    });
  },

  _handleEdit: function(){
    this.setState({
      isViewStatus : false,
    });
	},

  _handleSave: function(){
    this._saveDataToServer();
    this.setState({
      isViewStatus : true,
    });
  },

  _handleCancel: function(){
    this.setState({
      isViewStatus : true,
    });
    this._fetchServerData(this.state.year);
  },

  render: function (){
    var itemProps = {
      tagId: this.props.tagId,
      items: this.state.items,
      year: this.state.year,
      isViewStatus: this.state.isViewStatus,
    };
    var tbNameProps = {
      value: this.props.name,
      onBlur: this._onTBNameChanged,
      disabled: !this.state.isViewStatus,
    };

    var curYear = (new Date()).getFullYear();
    var btnProps = {
      onSave: this._saveDataToServer
    };

    var yearProps = {
      disabled: this.state.isViewStatus,
      ref: "YearField",
      selectedIndex: ((this.state.year || curYear) - curYear + 10) + '',
      onYearPickerSelected: this._onYearChanged,
      //className: "yearpicker",
      style:{
        height: "24px",
      },
      labelStyle: {
        height: "24px",
      },
      underlineStyle: {
        height: "24px",
      },
      menuItemStyle: {
        height: "30px",
      }
    };

    return (<div className='jazz-setting-basic-container'>
      <div className='jazz-setting-basic-content'>
        <div><TextField ref="TBName" {...tbNameProps} /></div>
        <div><span>请选择配置年份进行编辑</span><YearPicker {...yearProps} /><a>显示日历详情</a></div>

        <div ref="TBSettingContainer">
          <TBSettingItems ref="TBSettingItems" {...itemProps} />
        </div>
      </div>
      <div>
        <button type="submit" hidden={!this.state.isViewStatus} style={{width:'50px'}} onClick={this._handleEdit}> 修正 </button>
        <span>
          <button type="submit" hidden={this.state.isViewStatus} style={{width:'50px'}} onClick={this._handleSave}> 保存 </button>
          <button type="submit" hidden={this.state.isViewStatus} style={{width:'50px'}} onClick={this._handleCancel}> 放弃 </button>
        </span>
      </div>
     </div>);
  }
});

module.exports = BaselineBasic;
