import React from "react";
import {Route, DefaultRoute, RouteHandler, Link, Navigation, State} from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, Overlay} from 'material-ui';
import assign from "object-assign";
import YearPicker from '../../controls/YearPicker.jsx';
import BaclineModifyStore from '../../stores/BaselineModifyStore.jsx';
import BaclineModifyAction from "../../actions/BaselineModifyAction.jsx";
import Util from "../../util/Util.jsx";

var monthValues = [
  {LeftValue: 100, LeftMonth: 1, RightValue: 200, RightMonth: 2},
  {LeftValue: 300, LeftMonth: 3, RightValue: 400, RightMonth: 4},
  {LeftValue: 500, LeftMonth: 5, RightValue: 600, RightMonth: 6},
  {LeftValue: 700, LeftMonth: 7, RightValue: 800, RightMonth: 8},
  {LeftValue: 900, LeftMonth: 9, RightValue: 1000, RightMonth: 10},
  {LeftValue: 1100, LeftMonth: 11, RightValue: 1200, RightMonth: 12}
];
let BaselineModify = React.createClass({
  mixins:[Navigation,State],
  getInitialState:function(){
		return {
      disable: true,
      monthValues: monthValues
		};
	},

  handleEdit: function(){
    this.setState({
      disable : false
    });
    console.log("handle Edit");
	},

  handleSave: function(){
    //save
    console.log("handleSave");
    this.setState({
      disable : true
    });
  },

  handleCancel: function(){
      console.log("handleCancel");
      this.setState({
      disable : true
    });
  },

  onYearPickerSelected(year){
    BaselineModifyAction.loadData(this.props.tbId, year);
  },

  loadDataByYear: function(){
    var BaselineModifyData = BaselineModifyStore.getData();
    this.refs.yearValue.getDOMNode().value = BaselineModifyData.YearlyValues.DataValue;
    var getMonthData = BaselineModifyData.MonthlyValues;
    var monthValues = this.state.monthValues;
    var date, month, monthValue;
    for(var i = 0; i < getMonthData.length; i++){
      date = Util.JsonToDateTime(getMonthData[i].LocalTime);
      month = date.getMonth() + 1;
      for(var j = 0; j < monthValues.length; j++){
        monthValue = monthValues[j];
        if(monthValue.LeftMonth === month){
          monthValue.LeftValue = getMonthData[i].DataValue;
          monthValues.splice(j, 1, monthValue);
        }
        else if(monthValue.RightMonth === month){
          monthValue.RightValue = getMonthData[i].DataValue;
          monthValues.splice(j, 1, monthValue);
        }
      }
    }
    this.setState({
      monthValues : monthValues
    });
  },

  componentDidMount: function(){
    BaselineModifyStore.addSettingDataListener(this.loadDataByYear);
    BaselineModifyAction.loadData(this.props.tbId, this.refs.yearSelector.getDateValue());
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
    var disable = this.state.disable;
    var monthValues = this.state.monthValues;
    var idx = 0;
    var monthItems = months.map(function(month) {
      let props = {
        line: month,
        uom: uom,
        disable: disable,
        monthValue: monthValues[idx++]
      };
      return (
        <MonthItem  {...props}/>
      );
    });

    return (
      <div ref="baselineModifyDialog">
        <div className='jazz-setting-alarm-content'>
          <span>
            请选择配置年份进行编辑
             <YearPicker ref='yearSelector' onYearPickerSelected={this.onYearPickerSelected}/>
          </span>
          <span className='jazz-setting-baseline-margin'>
            年基准值
          </span>
          <span>
            年度 <input type="text" ref="yearValue" style={{width:'50px', marginRight:'10px'}} value="100" disabled={this.state.disable}/> 千瓦时
          </span>
          <span className='jazz-setting-baseline-margin'>
            月基准值
          </span>
          <span>
            {monthItems}
          </span>
          <button className='jazz-setting-alarm-button' hidden={!this.state.disable} onClick={this.handleEdit}> 编辑 </button>
          <span>
            <button className='jazz-setting-alarm-button' hidden={this.state.disable} onClick={this.handleSave}> 保存 </button>
            <button className='jazz-setting-alarm-button' hidden={this.state.disable} onClick={this.handleCancel}> 放弃 </button>
          </span>
        </div>
    </div>
    );
  }
});

let MonthItem = React.createClass({
	render() {
	  let line = this.props.line;
    let Uom = this.props.uom;
    let disable = this.props.disable;
    let monthValue = this.props.monthValue;
		return (
      <table border="1">
        <tr>
          <td align="left">
            <span style={{display:'inline-block', width:'58px'}}>{line.LeftMonth}月</span>
            <span style={{display:'inline-block',width:'90px'}}>
             <input style={{display:'inline-block',width:'80px'}}  ref={line.LeftRef} type="text" value={monthValue.LeftValue}  disabled={disable}/>
            </span>
            <span style={{display:'inline-block',width:'100px'}}>{Uom}</span>
          </td>
          <td align="right">
            <span style={{display:'inline-block', width:'58px'}}>{line.RightMonth}月</span>
            <span style={{display:'inline-block',width:'90px'}}>
             <input type="text" style={{display:'inline-block',width:'80px'}}  ref={line.RightRef} value={monthValue.RightValue}  disabled={disable}/>
            </span>
            <span style={{display:'inline-block',width:'50px'}}>{Uom}</span>
          </td>
        </tr>
      </table>
		);
	}
});

module.exports = BaselineModify;
