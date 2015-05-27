import React from 'react';
import mui from 'material-ui';
import classSet from 'classnames';

let { Dialog, DropDownMenu, FlatButton, TextField } = mui;

let MonthPicker = React.createClass({
  getDefaultProps(){
    let date = new Date();
    let yearMenuItems =[];
    for(var thisYear=date.getFullYear(), i = thisYear-10; i<=thisYear; i++){
      yearMenuItems.push({text:i+'年',value:i});
    }
    let monthMenuItems =[
      {text:'一月', value:1}, {text:'二月', value:2},
      {text:'三月', value:3}, {text:'四月', value:4},
      {text:'五月', value:5}, {text:'六月', value:6},
      {text:'七月', value:7}, {text:'八月', value:8},
      {text:'九月', value:9}, {text:'十月', value:10},
      {text:'十一月', value:11}, {text:'十二月', value:12}
    ];

    return {
      _yearItems: yearMenuItems,
      _monthItems: monthMenuItems
    };
  },
  getInitialState() {
    let date = new Date();
      return {
          selectedYear: date.getFullYear(),//默认今年
          selectedMonth: date.getMonth(),//默认上个月
          tempSelectedYear: date.getFullYear(),//默认今年
          tempSelectedMonth: date.getMonth()//默认上个月
      };
  },
  getDateValue(year, month){
    var yearValue = year || this.state.selectedYear;
    var monthValue = month || this.state.selectedMonth;
    if(monthValue < 10){
      return '' + yearValue + '0' + monthValue;
    }
    return '' + yearValue + monthValue;
  },
  getFormatDate: function() {
    return this.state.selectedYear+'年'+this.state.selectedMonth+'月';
  },
  _onDialogSubmit(){
    this.refs.dialogWindow.dismiss();
    if (this.props.onMonthPickerSelected) {
      this.props.onMonthPickerSelected(this.getDateValue(this.state.tempSelectedYear,this.state.tempSelectedMonth));
    }
    this.setState({
          selectedYear:this.state.tempSelectedYear,
          selectedMonth:this.state.tempSelectedMonth
      });
  },
  _onDialogCancel(){
    this.refs.dialogWindow.dismiss();
  },
  _handleInputFocus: function(e) {
    e.target.blur();
    if (this.props.onFocus) this.props.onFocus(e);
  },
  _handleInputTouchTap: function(e) {
    var yitems = this.props._yearItems;
    let yearIndex;
    for(var i = 0, len = yitems.length; i<len; i++){
      let item = yitems[i];
      if(item.value == this.state.selectedYear){
        yearIndex = i;
        break;
      }
    }

    this.setState({yearIndex: yearIndex, monthIndex: this.state.selectedMonth - 1});

    this.refs.dialogWindow.show();
    if (this.props.onTouchTap) this.props.onTouchTap(e);
  },
  _onYearChanged(e, selectedIndex, menuItem){
    if(menuItem){
      this.setState({tempSelectedYear:menuItem.value, yearIndex:selectedIndex});
    }
  },
  _onMonthChanged(e, selectedIndex, menuItem){
    if(menuItem){
      this.setState({tempSelectedMonth:menuItem.value, monthIndex:selectedIndex});
    }
  },
  render(){
    var _buttonActions = [
            <FlatButton
            label="确定"
            secondary={true}
            onClick={this._onDialogSubmit} />,
            <FlatButton
            label="取消"
            primary={true}
            onClick={this._onDialogCancel} />
        ];

    var dialog = <Dialog title="Month Picker" actions={_buttonActions} modal={true} ref="dialogWindow">
      <DropDownMenu menuItems={this.props._yearItems} onChange={this._onYearChanged} selectedIndex={this.state.yearIndex}/>
      <DropDownMenu menuItems={this.props._monthItems} onChange={this._onMonthChanged} selectedIndex ={this.state.monthIndex}/>
    </Dialog>;

    var textField = <TextField ref='input' hintText='select month' value={this.getFormatDate()} onFocus={this._handleInputFocus} onTouchTap={this._handleInputTouchTap}/>;

    return <div>
      {textField}
      {dialog}
    </div>;
  }
});

module.exports = MonthPicker;
