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

var monthValues = [
  {LeftValue: 100, LeftIsModify: false, RightValue: 200, RightIsModify: false},
  {LeftValue: 300, LeftIsModify: false, RightValue: 400, RightIsModify: false},
  {LeftValue: 500, LeftIsModify: false, RightValue: 600, RightIsModify: false},
  {LeftValue: 700, LeftIsModify: false, RightValue: 800, RightIsModify: false},
  {LeftValue: 900, LeftIsModify: false, RightValue: 1000, RightIsModify: false},
  {LeftValue: 1100, LeftIsModify: false, RightValue: 1200, RightIsModify: false}
];
let BaselineModify = React.createClass({
  mixins:[Navigation,State],
  getInitialState: function(){
		return {
      disable: true,
      yearValue: 100,
      yearIsModify: false,
      monthValues: monthValues,
      year: TBSettingStore.getYear()
		};
	},
  getValue: function(){
    var BaselineModifyData = BaselineModifyStore.getData();
    var MonthlyValues = [];
    var monthValue;
    for(var i = 0; i < 6; i++){
      monthValue = {
        TargetBaselinedId: this.props.tbId,
        LocalTime: BaselineModifyData.MonthlyValues[i*2].LocalTime,
        DataValue: this.refs['monthItem' + (i + 1)].state.monthValue.LeftValue,
        IsModify: this.refs['monthItem' + (i + 1)].state.monthValue.LeftIsModify
      };
      MonthlyValues.push(monthValue);
      monthValue = {
        TargetBaselinedId: this.props.tbId,
        LocalTime: BaselineModifyData.MonthlyValues[i*2+1].LocalTime,
        DataValue: this.refs['monthItem' + (i + 1)].state.monthValue.RightValue,
        IsModify: this.refs['monthItem' + (i + 1)].state.monthValue.RightIsModify
      };
      MonthlyValues.push(monthValue);
    }
    var YearlyValues=[];
    var yearValue = {
      TargetBaselinedId: this.props.tbId,
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
    for(var i = 0; i < 6; i++){
      monthValues[i].LeftIsModify = false;
      monthValues[i].RightIsModify = false;
    }
  },

  handleCancel: function(){
    this.setState({
      disable : true
    });
    this.loadDataByYear();
    this.clearModify();
  },
  yearValueChange: function(e){
    this.setState({
      yearIsModify : true,
      yearValue: e.target.value
    });
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
      yearValue: BaselineModifyData.YearlyValues.DataValue
    });
    var getMonthData = BaselineModifyData.MonthlyValues;
    var monthValues = this.state.monthValues;
    var date, month, monthItemIndex, partIndex, monthValue;
    for(var i = 0; i < getMonthData.length; i++){
      date = Util.DataConverter.JsonToDateTime(getMonthData[i].LocalTime);
      month = (new Date(date)).getMonth();
      monthItemIndex = parseInt(month / 2);
      partIndex = month % 2;
      for(var j = 0; j < monthValues.length; j++){
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
    var monthItems = months.map(function(month) {
      let props = {
        ref: "monthItem" + (idx + 1),
        line: month,
        uom: uom,
        disable: disable,
        monthValue: monthValues[idx++]
      };
      return (
        <MonthItem {...props}/>
      );
    });
    var curYear = (new Date()).getFullYear();
    var yearProps = {
      ref: "yearSelector",
      selectedIndex: ((this.state.year || curYear) - curYear + 10) ,
      onYearPickerSelected: this._onYearPickerSelected,
      //className: "yearpicker",
    };
    return (
      <div className="jazz-setting-container">
        <div className='jazz-setting-content'>
          <span>
            请选择配置年份进行编辑
               <YearPicker {...yearProps}/>;
          </span>
          <span className='jazz-setting-baseline-margin'>
            年基准值
          </span>
          <span>
            年度 <input type="text" ref="yearValue" style={{width:'50px', marginRight:'10px'}} value={this.state.yearValue} disabled={this.state.disable} onChange={this.yearValueChange}/> 千瓦时
          </span>
          <span className='jazz-setting-baseline-margin'>
            月基准值
          </span>
          <span>
            {monthItems}
          </span>
        </div>
        <div>
          <button className='jazz-setting-button' hidden={!this.state.disable} onClick={this.handleEdit}> 编辑 </button>
          <span>
            <button className='jazz-setting-button' hidden={this.state.disable} onClick={this.handleSave}> 保存 </button>
            <button className='jazz-setting-button' hidden={this.state.disable} onClick={this.handleCancel}> 放弃 </button>
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
  _onLeftChange: function(e){
    var monthValue = this.state.monthValue;
    monthValue.LeftValue = parseInt(e.target.value);
    monthValue.LeftIsModify = true;
    this.setState({
      monthValue: monthValue
    });
  },
  _onRightChange: function(e){
    var monthValue = this.state.monthValue;
    monthValue.RightValue = parseInt(e.target.value);
    monthValue.RightIsModify = true;
    this.setState({
      monthValue: monthValue
    });
  },
	render: function(){
	  let line = this.props.line;
    let Uom = this.props.uom;
    let disable = this.props.disable;
		return (
      <table border="1">
        <tr>
          <td align="left">
            <span style={{display:'inline-block', width:'58px'}}>{line.LeftMonth}月</span>
            <span style={{display:'inline-block',width:'90px'}}>
             <input type="text" style={{display:'inline-block',width:'80px'}} value={this.state.monthValue.LeftValue} onChange={this._onLeftChange} disabled={disable}/>
            </span>
            <span style={{display:'inline-block',width:'100px'}}>{Uom}</span>
          </td>
          <td align="right">
            <span style={{display:'inline-block', width:'58px'}}>{line.RightMonth}月</span>
            <span style={{display:'inline-block',width:'90px'}}>
             <input type="text" style={{display:'inline-block',width:'80px'}} value={this.state.monthValue.RightValue} onChange={this._onRightChange} disabled={disable}/>
            </span>
            <span style={{display:'inline-block',width:'50px'}}>{Uom}</span>
          </td>
        </tr>
      </table>
		);
	}
});

module.exports = BaselineModify;
