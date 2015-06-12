import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, FlatButton, FloatingActionButton, RadioButtonGroup, RadioButton, DatePicker} from 'material-ui';
import assign from "object-assign";
import YearPicker from '../../controls/YearPicker.jsx';
import DaytimeSelector from '../../controls/DaytimeSelector.jsx';
import NodeButtonBar from './NodeButtonBar.jsx';
import CommonFuns from '../../util/Util.jsx';

var DaytimeRangeValue = React.createClass({
  propTypes: {
    from: React.PropTypes.number,
    to: React.PropTypes.number,
    step: React.PropTypes.number,

    defaultValue:React.PropTypes.number,
    isViewStatus: React.PropTypes.bool,

    onChange: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      from: 0,
      to: 1440,
      isViewStatus: true
    };
  },

  getInitialState: function() {
    return {
      from: this.props.from,
      to: this.props.to,
      value: this.props.defaultValue,
    };
  },

  _onFromChange: function(e, curFrom, preFrom){
    var preTo = this.state.to;

    if(curFrom >= preTo){
      this.state.to = curFrom + this.props.step;
    }

    if(this.props.onChange){
      this.props.onChange(e, this.state.from, this.state.to, preFrom, preTo);
    }
  },

  _onToChange: function(e, curTo, preTo){
    var preFrom = this.state.from;

    if(curTo <= preFrom){
      this.state.from = curTo - this.props.step;
    }

    if(this.props.onChange){
      this.props.onChange(e, this.state.from, this.state.to, preFrom, preTo);
    }
  },

  getValue: function(){
    return {
      from: this.refs.fromFeild.getValue(),
      to: this.refs.toField.getValue(),
      value: this.refs.valueField.getValue(),
    };
  },

  setValue: function (val) {
    if(val){
      if(val.from) this.refs.fromFeild.setValue(val.from);
      if(val.to) this.refs.toFeild.setValue(val.to);
      if(val.value) this.refs.valueField.setValue(val.value);
    }
  },

  render: function(){
    var fromProps = {
      start: this.props.from,
      end: this.props.to || (1440 - (this.props.step || 30)),
      step: this.props.step,
      defaultMinute: this.props.from,
      onChange: this._onFromChange
    },
    toProps = {
      start: this.props.from || (this.props.step || 30),
      end: this.props.to || 1440,
      step: this.props.step,
      defaultMinute: this.props.to,
      onChange: this._onToChange
    },
    valProps = {
      defaultValue: this.state.value
    };

    return (
      <div>
        <DaytimeSelector {...fromProps} ref='fromFeild' />
        <span>到</span>
        <DaytimeSelector {...toProps} ref='toFeild' />
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
        items: this.props.items || [],
        isViewStatus: true
      };
    },

    render: function() {
      var createItem = function(item, index) {
        var drvProps = {
          from: item.StartTime,
          value: item.Value,
          isViewStatus: this.props.isViewStatus
        };
        return (<DaytimeRangeValue {...drvProps} />);
      };
      return <ul>{this.state.items.map(createItem)}</ul>;
    }
});

var ManualSetting = React.createClass({

  render: function () {
    return (
      <div>
        <div>小时基准值</div>
        <div>工作日</div>
        <div>
          <DaytimeRangeValues />
        </div>
        <div>非工作日</div>
        <div>
          <DaytimeRangeValues />
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
        <DatePicker />
        <DropDownMenu menuItems={menuItems}/>
        <span>到</span>
        <DatePicker />
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
      isViewStatus: React.PropTypes.bool
    },

    getInitialState: function() {
      return {
        items: this.props.items || [],
        isViewStatus: true
      };
    },

    render: function() {
      var createItem = function(item, index) {
        var drvProps = {
          from: item.StartTime,
          value: item.Value,
          isViewStatus: this.props.isViewStatus
        };
        return (<SpecialItem {...drvProps} />);
      };
      return <ul>{this.state.items.map(createItem)}</ul>;
    }
});

var TBSettingItem = React.createClass({
    propTypes: {
      from: React.PropTypes.number,
      to: React.PropTypes.number,
      step: React.PropTypes.number,

      defaultValue: React.PropTypes.number,

      isViewStatus: React.PropTypes.bool,
      onChange:React.PropTypes.func
    },

    getDefaultProps: function() {
      return {
        from: 0,
        to: 1440,
        isViewStatus: false
      };
    },
    _addSpecial: function(){
      var con = this.refs.SpecialSettingContainer;
      var normal = (<SpecialSettingContainer />);

      con.children.add(normal);
    },
    render: function(){
      var menuItems = [],
      minutes = 0,
      fromProps = {
        start: this.props.from,
        end: this.props.to || (1440 - (this.props.step || 30)),
        step: this.props.step,
        defaultMinute: this.props.from
      },
      toProps = {
        start: this.props.from || (this.props.step || 30),
        end: this.props.to || 1440,
        step: this.props.step,
        defaultMinute: this.props.from
      };
      for (var i = 1; ; i++) {
        var hmstr = CommonFuns.numberToTime(minutes);
        menuItems.push({ payload: i.toString(), text: hmstr });

        minutes = minutes + 30;
        if(minutes > 1440) break;
      }
      return (
        <div>
          <div>
            <div>
              <DatePicker  ref='fromFeild' />
              <span>到</span>
              <DatePicker  ref='toFeild' />
              <FloatingActionButton />
            </div>

            <div>
              <input type='radio' name='timetype' /><span> 手动设置基准值 </span>
              <ManualSetting />

              <input type='radio' name='timetype' /><span> 计算所选数据平均值为基准数据 </span>
              <CalcSetting />

            </div>
          </div>
          <div><span>补充日期</span> <FloatingActionButton onClick={this._addSpecial}  /></div>
          <div ref="SpecialSettingContainer">
            <SpecialSetting />
          </div>
        </div>
      );
    }
});

var DateRangeValues = React.createClass({
    propTypes: {
      items: React.PropTypes.array,
      isViewStatus: React.PropTypes.bool
    },

    getInitialState: function() {
      return {
        items: this.props.items || [],
        isViewStatus: true
      };
    },

    render: function() {
      var createItem = function(item, index) {
        var drvProps = {
          from: item.StartTime,
          value: item.Value,
          isViewStatus: this.props.isViewStatus
        };
        return (<DateRangeValue {...drvProps} />);
      };
      return <ul>{this.state.items.map(createItem)}</ul>;
    }
});

var BaselineBasic = React.createClass({
  mixins:[Navigation,State],

  getTimeRange: function(time1, time2, step){
    var menuItems0 = [ { payload: '1', text: 'Never' }],
      menuItems1 = [],
      menuItems2 = [ { payload: '1', text: 'Never' }];

    var timeCtrl1, timeCtrl2;
    if(!!time1){
      timeCtrl1 = <DropDownMenu menuItems={menuItems} />;
    }
  },

  getSetting: function(){

  },

  _addNormal: function(){
    var con = this.refs.NormalSettingContainer;
    var normal = (<NormalSetting />);

    con.children.add(normal);
  },

  render: function () {
    return (
      <div>
        <div>
          <div><TextField /></div>
          <div><span>请选择配置年份进行编辑</span><YearPicker /><a>显示日历详情</a></div>

          <div><span>时段设置</span> <FloatingActionButton onClick={this._addNormal}  /></div>
          <div ref="NormalSettingContainer">
            <TBSettingItem />
          </div>

        </div>
        <div>
          <NodeButtonBar />
        </div>
      </div>
    );
  }
});

module.exports = BaselineBasic;
