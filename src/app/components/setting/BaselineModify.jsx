import React from "react";
import {Route, DefaultRoute, RouteHandler, Link, Navigation, State} from 'react-router';
import {TextField, RaisedButton, CircularProgress} from 'material-ui';
import assign from "object-assign";
import YearPicker from '../../controls/YearPicker.jsx';
import TBSettingAction from '../../actions/TBSettingAction.jsx';
import TBSettingStore from '../../stores/TBSettingStore.jsx';
import BaselineModifyStore from '../../stores/BaselineModifyStore.jsx';
import BaselineModifyAction from "../../actions/BaselineModifyAction.jsx";

var extractNumber = function(str){
  var value = str.replace(/[^\d\.]/g,'');
  var dotIndex = value.indexOf('.');
  if(dotIndex != -1){
    if(dotIndex === 0) value = '0' + value;
    dotIndex = value.indexOf('.');
    value = value.split('.').join('');
    value = [value.slice(0, dotIndex), '.', value.slice(dotIndex)].join('');
  }
  return value;
};
const monthItemNum = 6;
const monthValueNum = 12;
var yearIsModify = false;
var monthIsModify = [
  {leftIsModify: false, rightIsModify: false},
  {leftIsModify: false, rightIsModify: false},
  {leftIsModify: false, rightIsModify: false},
  {leftIsModify: false, rightIsModify: false},
  {leftIsModify: false, rightIsModify: false},
  {leftIsModify: false, rightIsModify: false}
];
let BaselineModify = React.createClass({
  mixins:[Navigation,State],

  getValue: function(){
    var BaselineModifyData = BaselineModifyStore.getData();
    var MonthlyValues = [];
    var monthValue, itemValue;
    for(var i = 0; i < monthItemNum; i++){
      itemValue = this.refs['monthItem' + (i + 1)].getValue();
      monthValue = {
        TargetBaselineId: this.props.tbId,
        LocalTime: BaselineModifyData.MonthlyValues[i*2].LocalTime,
        DataValue: itemValue.leftValue,
        IsModify: monthIsModify[i].leftIsModify
      };
      MonthlyValues.push(monthValue);
      monthValue = {
        TargetBaselineId: this.props.tbId,
        LocalTime: BaselineModifyData.MonthlyValues[i*2+1].LocalTime,
        DataValue: itemValue.rightValue,
        IsModify: monthIsModify[i].rightIsModify
      };
      MonthlyValues.push(monthValue);
    }
    var YearlyValues = [];
    var yearValue = {
      TargetBaselineId: this.props.tbId,
      LocalTime: BaselineModifyData.YearlyValues[0].LocalTime,
      DataValue: this.refs.yearValue.getValue(),
      IsModify: yearIsModify
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
  setValue: function(data){
    this.refs.yearValue.setValue(data.YearlyValues[0].DataValue);
    var getMonthData = data.MonthlyValues;
    var monthValue = {
      leftValue: null,
      rightValue: null
    };
    for(var i = 0; i < monthItemNum; i++){
      monthValue.leftValue = getMonthData[i*2].DataValue;
      monthValue.rightValue = getMonthData[i*2+1].DataValue;
      this.refs['monthItem' + (i + 1)].setValue(monthValue);
    }
  },
  _onLoadingStatusChange: function(){
    var isLoading = BaselineModifyStore.getLoadingStatus();
    this.setState({
      isLoading: isLoading
    });
  },
  _onDataChange: function(){
    var isLoading = BaselineModifyStore.getLoadingStatus();
    this.setState({
      isLoading: isLoading
    });
    this.loadDataByYear();
  },
  loadDataByYear: function(){
    var BaselineModifyData = BaselineModifyStore.getData();
    this.setValue(BaselineModifyData);
  },
  handleEdit: function(){
    this.setState({
      disable : false
    });
	},
  _validate: function(){
    var valid = true;
    for(var i = 0; i < monthItemNum; i++){
      valid = valid && this.refs['monthItem' + (i + 1)]._validateLeft();
      valid = valid && this.refs['monthItem' + (i + 1)]._validateRight();
    }
    valid = valid && this._validateYear();
    return valid;
  },
  handleSave: function(){
    if(this._validate()){
      this.setState({
        disable: true
      });
      var val = this.getValue();
      BaselineModifyAction.saveData(val);
      this.clearModify();
    }
  },
  handleCancel: function(){
    this.setState({
      disable: true,
      errorText: ""
    });
    for(var i = 0; i < monthItemNum; i++){
      this.refs['monthItem' + (i + 1)].setState({
        errorLeftText:"",
        errorRightText:""
      });
    }
    this.loadDataByYear();
    this.clearModify();
  },
  clearModify: function(){
    yearIsModify = false;
    monthIsModify = [
      {leftIsModify: false, rightIsModify: false},
      {leftIsModify: false, rightIsModify: false},
      {leftIsModify: false, rightIsModify: false},
      {leftIsModify: false, rightIsModify: false},
      {leftIsModify: false, rightIsModify: false},
      {leftIsModify: false, rightIsModify: false}
    ];
  },
  _validateYear: function(){
    var val = this.refs.yearValue.getValue();
    return this._validateValue(val) !== '';
  },
  _validateValue: function(val){
    var value = extractNumber(val);
    if(val !== value){
      this.refs.yearValue.setValue(value);
    }
    this.setState({errorText: (value === '' ? '必填项' : '')});
    return value;
  },
  yearValueChange: function(e){
    var value = this._validateValue(e.target.value);
    yearIsModify = true;
  },
  _onYearPickerSelected(yearData){
    var year = parseInt(yearData);
    this.setState({year: year});
    if(year != TBSettingStore.getYear()){
      TBSettingAction.setYear(year);
    }
    BaselineModifyAction.loadData(this.props.tbId, year);
  },
  getInitialState: function(){
		return {
      disable: true,
      year: TBSettingStore.getYear(),
      isLoading: true,
      errorText: ""
		};
	},

  componentDidMount: function(){
    BaselineModifyStore.addDataLoadingListener(this._onLoadingStatusChange);
    BaselineModifyStore.addDataChangeListener(this._onDataChange);
    BaselineModifyAction.loadData(this.props.tbId, this.state.year);
  },

  componentWillUnmount: function(){
    BaselineModifyStore.removeDataLoadingListener(this._onLoadingStatusChange);
    BaselineModifyStore.removeDataChangeListener(this._onDataChange);
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
    var disable = this.state.disable;
    var idx = 0;
    let me = this;
    var monthItems = months.map(function(month) {
      let props = {
        ref: "monthItem" + (idx + 1),
        index: idx++,
        line: month,
        uom: uom,
        disable: disable,
        validate: me._validate
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
      style: {
        border: '1px solid #efefef',
        margin: '14px 0px 0px 10px'
      }
      //className: "jazz-setting-basic-yearpicker"
    };
    var yearStyle = {
      display: 'inline-block',
      width: '90px',
      height: '24px',
      marginLeft: '24px',
      marginRight: '10px',
      fontSize: '14px',
      color: '#767a7a',
      backgroundColor: 'transparent',
      border: '1px solid #e4e7e6'
    };
    var buttonStyle = {
      width: '80px',
      minWidth: "80px",
      height: '30px',
      marginRight: '10px'
    };
    var labelStyle = {
      fontSize: '14px',
      color: '#767a7a',
      lineHeight: '30px',
    };
    if(this.state.isLoading){
      return (
        <div style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center',marginTop:'160px'}}>
          <CircularProgress  mode="indeterminate" size={1} />
        </div>
      );
    }
    else{
      return (
        <div className="jazz-setting-baseline-container">
          <div className='jazz-setting-baseline-content'>
            <div style={{display:'flex',flexFlow:'row'}}>
              <div style={{marginTop:'21px', height:'20px'}}>
              请选择配置年份进行编辑
            </div>
              <YearPicker {...yearProps}/>
            </div>
            <div className='jazz-setting-baseline-margin'>
              年基准值
            </div>
            <div>
              年度<TextField ref="yearValue" className='jazz-setting-input' style={yearStyle} defalutValue={null} errorText={this.state.errorText} disabled={this.state.disable} onChange={this.yearValueChange}/> 千瓦时
            </div>
            <div className='jazz-setting-baseline-margin'>
              月基准值
            </div>
            <div>
              {monthItems}
            </div>
          </div>
          <div>
            <div hidden={!this.state.disable}>
              <RaisedButton label="编辑" style={buttonStyle} labelStyle={labelStyle} onClick={this.handleEdit}/>
            </div>
            <div hidden={this.state.disable}>
              <RaisedButton label="保存" style={buttonStyle} labelStyle={labelStyle} onClick={this.handleSave}/>
              <RaisedButton label="放弃" style={buttonStyle} labelStyle={labelStyle} onClick={this.handleCancel}/>
            </div>
          </div>
      </div>
      );
    }
  }
});

let MonthItem = React.createClass({
  getValue: function(){
    var leftValue = this.refs.leftValue.getValue();
    var rightValue = this.refs.rightValue.getValue();
    return {
      leftValue: leftValue,
      rightValue: rightValue
    };
  },
  setValue: function(monthValue){
    this.refs.leftValue.setValue(monthValue.leftValue);
    this.refs.rightValue.setValue(monthValue.rightValue);
  },
  _validateLeft: function(){
    var val = this.refs.leftValue.getValue();
    return this._validateLeftValue(val) !== '';
  },
  _validateLeftValue: function(val){
    var value = extractNumber(val);
    if(val !== value){
      this.refs.leftValue.setValue(value);
    }
    this.setState({errorLeftText: (value === '' ? '必填项' : '')});
    return value;
  },
  _onLeftChange: function(e){
    var value = this._validateLeftValue(e.target.value);
    var index = this.props.index;
    monthIsModify[index].leftIsModify = true;
  },
  _validateRight: function(){
    var val = this.refs.rightValue.getValue();
    return this._validateRightValue(val) !== '';
  },
  _validateRightValue: function(val){
    var value = extractNumber(val);
    if(val !== value){
      this.refs.rightValue.setValue(value);
    }
    this.setState({errorRightText: (value === '' ? '必填项' : '')});
    return value;
  },
  _onRightChange: function(e){
    var value = this._validateRightValue(e.target.value);
    var index = this.props.index;
    monthIsModify[index].rightIsModify = true;
  },
  getInitialState:function(){
		return {
      errorLeftText: "",
      errorRightText: ""
		};
	},

	render: function(){
	  let line = this.props.line;
    let Uom = this.props.uom;
    let disable = this.props.disable;
    var leftDivStyle = {display:'inline-block',width:'52px'};
    var centerDivStyle = {display:'inline-block',width:'103px'};
    var rightDivStyle = {display:'inline-block',width:'92px'};
    var monthStyle = {
      display: 'inline-block',
      width: '90px',
      height: '24px',
      fontSize: '14px',
      color: '#767a7a',
      backgroundColor: 'transparent',
      border: '1px solid #e4e7e6'
    };
		return (
      <table border='0' cellSpacing='1' cellPadding='0'>
        <tr>
          <td align="left">
            <div style={leftDivStyle}>{line.LeftMonth}月</div>
            <div style={centerDivStyle}>
              <TextField ref="leftValue" className="jazz-setting-input" style={monthStyle}   defaultValue={null} errorText={this.state.errorLeftText} onChange={this._onLeftChange} disabled={disable}/>
            </div>
            <div style={rightDivStyle}>{Uom}</div>
          </td>
          <td align="right">
            <div style={leftDivStyle}>{line.RightMonth}月</div>
            <div style={centerDivStyle}>
              <TextField ref="rightValue" className="jazz-setting-input" style={monthStyle} defaultValue={null} errorText={this.state.errorRightText} onChange={this._onRightChange} disabled={disable}/>
            </div>
            <div style={rightDivStyle}>{Uom}</div>
          </td>
        </tr>
      </table>
		);
	}
});

module.exports = BaselineModify;
