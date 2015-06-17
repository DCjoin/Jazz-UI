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
      onChange: this._onEndChange
    },
    valProps = {
      defaultValue: this.props.defaultValue,
      onChange: this._onValueChange
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
    return <ul>{items.map(createItem)}</ul>;
  }
});

var NormalSetting = React.createClass({
  propTypes: {
    items: React.PropTypes.array,
    isViewStatus: React.PropTypes.bool
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
    var workProps = {
      items: this.state.workdays,
      isViewStatus: this.props.isViewStatus
    },
    nonWorkdayProps = {
      items: this.state.nonWorkdays,
      isViewStatus: this.props.isViewStatus
    };

    return (
      <div>
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

var CalcSetting = React.createClass({

  render: function () {
    return (
      <div>
        <table>
          <tr>
            <td>时间</td>
            <td>工作日</td>
            <td>非工作日</td>
          </tr>
          <tr>
            <td><span>00:00-01:00</span></td>
            <td><TextField /><span>千瓦时</span></td>
            <td><TextField /><span>千瓦时</span></td>
          </tr>
        </table>
        <a href="#">重新计算</a>
      </div>
    );
  }
});

var SpecialItem = React.createClass({

  render: function () {

    var menuItems = [];
    var minutes = 0;

    for (var i = 1; ; i++) {
      var hmstr = CommonFuns.numberToTime(minutes);
      menuItems.push({ payload: i.toString(), text: hmstr });

      minutes = minutes + 30;
      if(minutes > 1440) break;
    }

    return (
      <div>
        <DatePicker value={this.props.StartTime} />
        <DropDownMenu menuItems={menuItems}/>
        <span>到</span>
        <DatePicker  value={this.props.EndTime}/>
        <DropDownMenu menuItems={menuItems}/>
        <FloatingActionButton /><br/>
        <TextField /><span>千瓦时</span>
      </div>
    );
  }
});

var SpecialSetting = React.createClass({
  propTypes: {
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

  getValue: function(){
    
  },

  render: function() {
    var me = this;
    var createItem = function(item, index) {
      var drvProps = {
        start: CommonFuns.DataConverter.JsonToDateTime(item.StartTime),
        end: CommonFuns.DataConverter.JsonToDateTime(item.EndTime),
        value: item.Value,
        isViewStatus: me.state.isViewStatus
      };
      return (<SpecialItem {...drvProps} />);
    };
    return <div>{this.state.items.map(createItem)}</div>;
  }
});

var TBSettingItem = React.createClass({
  propTypes: {
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

  _onRemove: function () {
    var me = this;
    if(this.props.onRemove){
      this.props.onRemove(me, this.props.id);
    }
  },

  getValue: function(){
    return {
      TbSetting:{
        Year: this.props.year,
        TBId: this.props.tbId,
        StartTime: CommonFuns.DataConverter.DatetimeToJson(this.refs.startFeild.getDate()),
        EndTime: CommonFuns.DataConverter.DatetimeToJson(this.refs.endFeild.getDate())
      },
      NormalDates: this.refs.NormalSettingCtrl.getValue(),
      SpecialDates: this.refs.SpecialSettingCtrl.getValue(),
      //TbAvgDtos: this.refs.CalcSettingCtrl.getValue(),
    }
  },

  render: function(){
    var me = this,
    menuItems = [],
    minutes = 0,
    step = (me.props.step || 30),
    startProps = {
      defaultDate: this.props.start,
      minDate: new Date(me.props.year, 1, 1),
      maxDate: new Date(me.props.year, 12, 31),
      autoOk: true,
      className: 'jazz-setting-basic-date',
      onChange: function(e, v){
        me.refs.endFeild.minDate = me.refs.startFeild.getDate();
        var endDate = me.refs.endFeild.getDate();

        if(endDate && endDate < v){
          me.refs.endFeild.setDate(v);
        }
      }
    },
    endProps = {
      defaultDate: me.props.end,
      minDate: new Date(me.props.year, 1, 1),
      maxDate: new Date(me.props.year, 12, 31),
      autoOk: true,
      className: 'jazz-setting-basic-date',
    };
    for (var i = 1; ; i++) {
      var hmstr = CommonFuns.numberToTime(minutes);
      menuItems.push({ payload: i.toString(), text: hmstr });

      minutes = minutes + step;
      if(minutes > 1440) break;
    }

    var normalProps = {
      isViewStatus: me.props.isViewStatus,
      items: me.props.normals
    },
    avgProps = {
      isViewStatus: me.props.isViewStatus,
      items: me.props.avgs
    },
    specialProps = {
      isViewStatus: me.props.isViewStatus,
      items: me.props.specials
    },
    clearStyle = {
      clear: 'both',
    };

    return (<div>
        <div style={clearStyle}>
          <div style={clearStyle}>
            <DatePicker  ref='startFeild' {...startProps} />
            <span className='jazz-setting-basic-datespan'>到</span>
            <DatePicker  ref='endFeild' {...endProps} />
            <FlatButton label="－"  ref="remove"  onClick={this._onRemove} />
          </div>
          <div style={clearStyle}>
            <input type='radio' name='timetype' /><span> 手动设置基准值 </span>
            <NormalSetting ref="NormalSettingCtrl" {...normalProps} />

            <input type='radio' name='timetype' /><span> 计算所选数据平均值为基准数据 </span>
            <CalcSetting ref="CalcSettingCtrl" {...avgProps} />
          </div>
        </div>
        <div style={clearStyle}><span>补充日期</span> <FlatButton label="＋" onClick={this._addSpecial}  /></div>
        <div ref="SpecialSettingContainer" style={clearStyle}>
          <SpecialSetting ref="SpecialSettingCtrl" {...specialProps} />
        </div>
      </div>
    );
  }
});

var TBSettingItems = React.createClass({
  propTypes: {
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

  componentDidMount: function(nextProps) {
    this._setSetting(nextProps);
  },

  componentWillReceiveProps: function(nextProps){
    this._setSetting(nextProps);
  },

  getValue: function(){
    debugger;
    var vals = [];
    for (var i = 0; i < this.state.items.length; i++) {
      var ref = this.refs['item_' + i];
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

  _removeSetting: function (src, id) {
    var oldItems = this.state.items, newItems= [];
    for (var i = 0; i < oldItems.length; i++) {
      if(oldItems[i].id != id){
        newItems.push(oldItems[i]);
      }
    }
    this.setState({items: newItems});
  },

  _addSetting: function(){
    var itemProps = {
      isViewStatus: this.props.isViewStatus
    },
    item = (<TBSettingItem {...itemProps} />),
    newItems = this.state.items.concat(item);
    this.setState({items: newItems});
  },

  render: function() {
    var me = this, refIdx = 0,
      cyear = this.props.year,
      isViewStatus = this.props.isViewStatus;

    var createItem = function(item, index) {
      var drvProps = {
        ref: 'item_' + (refIdx++),
        year: cyear,

        normals: item.NormalDates,
        specials: item.SpecialDates,
        avgs: item.TbAvgDtos,

        isViewStatus: isViewStatus,
        onRemove: me._removeSetting
      };

      if(item.TbSetting && item.TbSetting.StartTime){
        drvProps.start = CommonFuns.DataConverter.JsonToDateTime(item.TbSetting.StartTime, false);
      }
      if(item.TbSetting && item.TbSetting.EndTime){
        drvProps.end = CommonFuns.DataConverter.JsonToDateTime(item.TbSetting.EndTime, false);
      }
      return (<TBSettingItem {...drvProps} />);
    };

    return (<div>
        <div><span>时段设置</span><FlatButton label="＋" onClick={this._addSetting} /></div>
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

    isViewStatus: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      items: [],
      isViewStatus: false,
      year: (new Date()).getFullYear()
    };
  },

  getInitialState: function() {
    return {
      items: this.props.items || [],
      name: this.props.name,
      year: this.props.year,
      isViewStatus: this.props.isViewStatus
    };
  },

  getValue: function(){
    return {
      TBId: this.props.tbId,
      Year: this.props.year,
      TBSettings: this.refs.TBSettingItems.getValue()
    };
  },

  _onYearChanged: function(yearstr){
    var year = parseInt(yearstr);
    this._fetchServerData(year);
    this.setState({year: year});
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

  saveDataToServer: function(){
    debugger;
    var val = this.getValue();
    TBSettingAction.saveData(val);
    var tbSetting = TBSettingStore.getData();
    var itemsCtrl = this.refs.TBSettingItems;
    itemsCtrl.items = tbSetting.TBSettings;
  },

  render: function (){
    var itemProps = {
      items: this.state.items,
      year: this.state.year,
      isViewStatus: this.state.isViewStatus,
    };
    var btnProps = {onSave: this.saveDataToServer};

    return (<div className='jazz-setting-basic-container'>
      <div className='jazz-setting-basic-content'>
        <div><TextField ref="TBName" value={this.props.name} /></div>
        <div><span>请选择配置年份进行编辑</span><YearPicker ref="Year" className="yearpicker" onYearPickerSelected={this._onYearChanged} /><a>显示日历详情</a></div>

        <div ref="TBSettingContainer">
          <TBSettingItems ref="TBSettingItems" {...itemProps} />
        </div>
      </div>
      <div>
        <NodeButtonBar {...btnProps} />
      </div>
     </div>);
  }
});

module.exports = BaselineBasic;
