import React from "react";
import {Route, DefaultRoute, RouteHandler, Link, Navigation, State} from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, Overlay} from 'material-ui';
import assign from "object-assign";
import YearPicker from '../../controls/YearPicker.jsx';
import TBSettingAction from '../../actions/TBSettingAction.jsx';
import TBSettingStore from '../../stores/TBSettingStore.jsx';
import BaselineModifyStore from '../../stores/BaselineModifyStore.jsx';
import BaselineModifyAction from "../../actions/BaselineModifyAction.jsx";
import Util from "../../util/Util.jsx";

const monthItemNum = 6;
const monthValueNum = 12;
let BaselineModify = React.createClass({
  mixins:[Navigation,State],

  getValue: function(){
    var BaselineModifyData = BaselineModifyStore.getData();
    var MonthlyValues = [];
    var monthValue;
    for(var i = 0; i < monthItemNum; i++){
      monthValue = {
        TargetBaselineId: this.props.tbId,
        LocalTime: BaselineModifyData.MonthlyValues[i*2].LocalTime,
        DataValue: this.refs['monthItem' + (i + 1)].state.monthValue.LeftValue,
        IsModify: this.refs['monthItem' + (i + 1)].state.monthValue.LeftIsModify
      };
      MonthlyValues.push(monthValue);
      monthValue = {
        TargetBaselineId: this.props.tbId,
        LocalTime: BaselineModifyData.MonthlyValues[i*2+1].LocalTime,
        DataValue: this.refs['monthItem' + (i + 1)].state.monthValue.RightValue,
        IsModify: this.refs['monthItem' + (i + 1)].state.monthValue.RightIsModify
      };
      MonthlyValues.push(monthValue);
    }
    var YearlyValues=[];
    var yearValue = {
      TargetBaselineId: this.props.tbId,
      LocalTime: BaselineModifyData.YearlyValues[0].LocalTime,
      DataValue: this.state.yearValue,
      IsModify: this.state.yearIsModify
    };
    YearlyValues.push(yearValue);
    return {
      Id: this.props.tbId,
      Year: this.state.year,
      TBVersion: BaselineModifyData.TBVersion,
      Version: BaselineModifyData.Version,
      MonthlyValues: MonthlyValues,
      YearlyValues: YearlyValues
    };
  },

  handleEdit: function(){
    this.setState({
      disable : false
    });
	},

  handleSave: function(){
    this.setState({
      disable : true
    });
    var val = this.getValue();
    BaselineModifyAction.saveData(val);
    this.clearModify();
  },

  clearModify: function(){
    this.state.yearIsModify = false;
    var monthValues = this.state.monthValues;
    for(var i = 0; i < monthItemNum; i++){
      monthValues[i].LeftIsModify = false;
      monthValues[i].RightIsModify = false;
    }
  },

  handleCancel: function(){
    this.setState({
      disable: true
    });
    this.loadDataByYear();
    this.clearModify();
  },

  _validate: function(val, obj){
    var value = val.replace(/[^\d\.]/g,'');
    var dotIndex = value.indexOf('.');
    if(dotIndex != -1){
      if(dotIndex === 0){
        value = '0' + value;
      }
      value = value.split('.').join('');
      value = [value.slice(0, dotIndex), '.', value.slice(dotIndex)].join('');
    }

    obj.value = value;
    if(value === ''){
      this.setState({error: "必填项"});
      return false;
    }
    else{
      this.setState({error: ""});
      return true;
    }
  },

  yearValueChange: function(e){
    if(this._validate(e.target.value, e.target)){
      this.setState({
        yearIsModify: true,
        yearValue: e.target.value
      });
    }
  },

  _onYearPickerSelected(yearData){
    var year = parseInt(yearData);
    this.setState({year: year});
    if(year != TBSettingStore.getYear()){
      TBSettingAction.setYear(year);
    }
    BaselineModifyAction.loadData(this.props.tbId, year);
  },

  loadDataByYear: function(){
    var BaselineModifyData = BaselineModifyStore.getData();
    this.setState({
      yearValue: BaselineModifyData.YearlyValues[0].DataValue
    });
    var getMonthData = BaselineModifyData.MonthlyValues;
    var monthValues = this.state.monthValues;
    var date, month, monthItemIndex, partIndex, monthValue;
    for(var i = 0; i < monthValueNum; i++){
      date = Util.DataConverter.JsonToDateTime(getMonthData[i].LocalTime);
      month = (new Date(date)).getMonth();
      monthItemIndex = parseInt(month / 2);
      partIndex = month % 2;
      for(var j = 0; j < monthItemNum; j++){
        monthValue = monthValues[j];
        if(j == monthItemIndex){
          if(partIndex === 0){
            monthValue.LeftValue = getMonthData[i].DataValue;
          }
          else if(partIndex === 1){
            monthValue.RightValue = getMonthData[i].DataValue;
          }
          monthValues.splice(j, 1, monthValue);
          break;
        }
      }
    }
    this.setState({
      monthValues: monthValues
    });
  },

  getInitialState: function(){
    let monthValues = [
      {LeftValue: null, LeftIsModify: false, RightValue: null, RightIsModify: false},
      {LeftValue: null, LeftIsModify: false, RightValue: null, RightIsModify: false},
      {LeftValue: null, LeftIsModify: false, RightValue: null, RightIsModify: false},
      {LeftValue: null, LeftIsModify: false, RightValue: null, RightIsModify: false},
      {LeftValue: null, LeftIsModify: false, RightValue: null, RightIsModify: false},
      {LeftValue: null, LeftIsModify: false, RightValue: null, RightIsModify: false}
    ];
		return {
      disable: true,
      yearValue: null,
      yearIsModify: false,
      monthValues: monthValues,
      year: TBSettingStore.getYear()
		};
	},

  componentDidMount: function(){
    BaselineModifyStore.addSettingDataListener(this.loadDataByYear);
    BaselineModifyAction.loadData(this.props.tbId, this.state.year);
  },

  componentWillUnmount: function(){
    BaselineModifyStore.removeSettingDataListener(this.loadDataByYear);
  },

  render: function(){
    let months = [
     {LeftMonth:"一", RightMonth:"二"},
     {LeftMonth:"三", RightMonth:"四"},
     {LeftMonth:"五", RightMonth:"六"},
     {LeftMonth:"七", RightMonth:"八"},
     {LeftMonth:"九", RightMonth:"十"},
     {LeftMonth:"十一", RightMonth:"十二"}
    ];
    let uom = '千瓦时';
    var monthValues = this.state.monthValues;
    var disable = this.state.disable;
    var idx = 0;
    let me = this;
    var monthItems = months.map(function(month) {
      let props = {
        ref: "monthItem" + (idx + 1),
        line: month,
        uom: uom,
        disable: disable,
        validate: me._validate,
        monthValue: monthValues[idx++]
      };
      return (
        <MonthItem {...props}/>
      );
    });
    var curYear = (new Date()).getFullYear();
    var yearProps = {
      ref: "yearSelector",
      selectedIndex: ((this.state.year || curYear) - curYear + 10),
      onYearPickerSelected: this._onYearPickerSelected,
      style:{
        border:'1px solid #efefef',
        margin:'14px 0px 0px 10px'
      }
      //className: "jazz-setting-basic-yearpicker"
    };
    return (
      <div className="jazz-setting-baseline-container">
        <div className='jazz-setting-baseline-content'>
          <div style={{display:'flex','flex-flow':'row'}}>
            <div style={{marginTop:'21px', height:'20px'}}>
            请选择配置年份进行编辑
          </div>
               <YearPicker {...yearProps}/>
          </div>
          <div className='jazz-setting-baseline-margin'>
            年基准值
          </div>
          <div>
            年度 <input type="text" ref="yearValue"className='jazz-setting-baseline-year' value={this.state.yearValue} disabled={this.state.disable} onChange={this.yearValueChange}/> 千瓦时
          </div>
          <div className='jazz-setting-baseline-margin'>
            月基准值
          </div>
          <div>
            {monthItems}
          </div>
        </div>
        <div>
          <button className='jazz-setting-basic-editbutton' hidden={!this.state.disable} onClick={this.handleEdit}> 编辑 </button>
          <span>
            <button className='jazz-setting-basic-editbutton' hidden={this.state.disable} onClick={this.handleSave}> 保存 </button>
            <button className='jazz-setting-basic-editbutton' hidden={this.state.disable} onClick={this.handleCancel}> 放弃 </button>
          </span>
        </div>
    </div>
    );
  }
});

let MonthItem = React.createClass({
  getInitialState:function(){
		return {
      monthValue: this.props.monthValue
		};
	},
  componentWillReceiveProps: function(nextProps){
    this.setState({
      monthValue: nextProps.monthValue
    });
  },
  _validate: function(val, obj){
    if(this.props.validate){
      if(this.props.validate(val, obj)){
        return true;
      }
      else{
        return false;
      }
    }
  },
  _onLeftChange: function(e){
    if(this._validate(e.target.value, e.target)){
      var monthValue = this.state.monthValue;
      monthValue.LeftValue = e.target.value;
      monthValue.LeftIsModify = true;
      this.setState({
        monthValue: monthValue
      });
    }
  },
  _onRightChange: function(e){
    if(this._validate(e.target.value, e.target)){
      var monthValue = this.state.monthValue;
      monthValue.RightValue = e.target.value;
      monthValue.RightIsModify = true;
      this.setState({
        monthValue: monthValue
      });
    }
  },
	render: function(){
	  let line = this.props.line;
    let Uom = this.props.uom;
    let disable = this.props.disable;
    var leftDivStyle = {display:'inline-block',width:'52px'};
    var centerDivStyle = {display:'inline-block',width:'103px'};
    var rightDivStyle = {display:'inline-block',width:'92px'};
		return (
      <table border='0' cellSpacing='1' cellPadding='0'>
        <tr>
          <td align="left">
            <div style={leftDivStyle}>{line.LeftMonth}月</div>
            <div style={centerDivStyle}>
             <input ref="leftValue" type="text" className="jazz-setting-baseline-month" value={this.state.monthValue.LeftValue} onChange={this._onLeftChange} disabled={disable}/>
            </div>
            <div style={rightDivStyle}>{Uom}</div>
          </td>
          <td align="right">
            <div style={leftDivStyle}>{line.RightMonth}月</div>
            <div style={centerDivStyle}>
             <input ref="rightValue" type="text" className="jazz-setting-baseline-month" value={this.state.monthValue.RightValue} onChange={this._onRightChange} disabled={disable}/>
            </div>
            <div style={rightDivStyle}>{Uom}</div>
          </td>
        </tr>
      </table>
		);
	}
});

module.exports = BaselineModify;
