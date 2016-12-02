import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import { TextField, RaisedButton, CircularProgress } from 'material-ui';
import assign from "object-assign";
import YearPicker from '../../controls/YearPicker.jsx';
import TBSettingAction from '../../actions/TBSettingAction.jsx';
import TBSettingStore from '../../stores/TBSettingStore.jsx';
import BaselineModifyStore from '../../stores/BaselineModifyStore.jsx';
import BaselineModifyAction from "../../actions/BaselineModifyAction.jsx";

var extractNumber = function(str) {
  str=str+'';
  var value = str.replace(/[^\d\.]/g, '');
  var dotIndex = value.indexOf('.');
  if (dotIndex != -1) {
    if (dotIndex === 0)
      value = '0' + value;
    dotIndex = value.indexOf('.');
    value = value.split('.').join('');
    value = [value.slice(0, dotIndex), '.', value.slice(dotIndex)].join('');
  }
  return value;
};
const monthItemNum = 6;
let BaselineModify = React.createClass({
  //mixins: [Navigation, State],

  setValue: function(data) {
    this.setState({
      yearValue:data.getIn(["YearlyValues", 0, "DataValue"])
    },()=>{
      for (var i = 0; i < monthItemNum; i++) {
        this.refs['monthItem' + (i + 1)].setValue(data);
      }
    })
    // this.refs.yearValue.setValue(data.getIn(["YearlyValues", 0, "DataValue"]));

  },
  _onLoadingStatusChange: function() {
    var isLoading = BaselineModifyStore.getLoadingStatus();
    this.setState({
      isLoading: isLoading
    });
  },
  _onDataChange: function() {
    var isLoading = BaselineModifyStore.getLoadingStatus();
    var data = BaselineModifyStore.getOrginData();
    var yearIsModify = data.getIn(["YearlyValues", 0, "IsModify"]);
    this.setState({
      isLoading: isLoading,
      yearIsModify: yearIsModify
    });
    this.setValue(data);
  },
  handleEdit: function() {
    this.setState({
      disable: false
    });
  },
  handleSave: function() {
    if (this._validate()) {
      this.setState({
        disable: true
      });
      var val = BaselineModifyStore.getData();
      BaselineModifyAction.saveData(val);
    }
  },
  handleCancel: function() {
    this.setState({
      disable: true,
      errorText: ""
    });
    for (var i = 0; i < monthItemNum; i++) {
      this.refs['monthItem' + (i + 1)].setState({
        errorLeftText: "",
        errorRightText: ""
      });
    }
    var data = BaselineModifyStore.getOrginData();
    this.setValue(data);
  },
  _validate: function() {
    var valid = true;
    for (var i = 0; i < monthItemNum; i++) {
      valid = valid && this.refs['monthItem' + (i + 1)]._validateLeft();
      valid = valid && this.refs['monthItem' + (i + 1)]._validateRight();
    }
    valid = valid && this._validateYear();
    return valid;
  },
  _validateYear: function() {
    var val = this.state.yearValue;
    this._validateValue(val);
    return true;
  },
  _validateValue: function(val) {
    var value = extractNumber(val);
    // if (val !== value) {
    //   this.refs.yearValue.setValue(value);
    // }
    return value;
  },
  yearValueChange: function(e) {
    var value = this._validateValue(e.target.value);
    this.setState({
      yearValue:value
    },()=>{
      if (value === "") {
        value = null;
      }
      BaselineModifyAction.setYearData(value);
      BaselineModifyAction.setYearIsModify();
    })

  },
  _onYearPickerSelected(yearData) {
    var year = parseInt(yearData);
    this.setState({
      year: year
    });
    if (year != TBSettingStore.getYear()) {
      TBSettingAction.setYear(year);
    }
    BaselineModifyAction.loadData(this.props.tbId, year);
  },
  getInitialState: function() {
    return {
      disable: true,
      year: TBSettingStore.getYear(),
      isLoading: true,
      yearIsModify: false,
      errorText: "",
      yearValue:''
    };
  },
  componentWillReceiveProps: function(nextProps) {
    var curYear = TBSettingStore.getYear();
    this.setState({
      year: curYear
    });
    if (nextProps.shouldLoad) {
      BaselineModifyAction.loadData(this.props.tbId, curYear);
    }
  },
  componentDidMount: function() {
    BaselineModifyStore.addDataLoadingListener(this._onLoadingStatusChange);
    BaselineModifyStore.addDataChangeListener(this._onDataChange);
  },
  componentWillUnmount: function() {
    BaselineModifyStore.removeDataLoadingListener(this._onLoadingStatusChange);
    BaselineModifyStore.removeDataChangeListener(this._onDataChange);
  },
  render: function() {
    let months = [
      {
        LeftMonth: I18N.Baseline.BaselineModify.Month.Jan,
        RightMonth: I18N.Baseline.BaselineModify.Month.Feb
      },
      {
        LeftMonth: I18N.Baseline.BaselineModify.Month.Mar,
        RightMonth: I18N.Baseline.BaselineModify.Month.Apr
      },
      {
        LeftMonth: I18N.Baseline.BaselineModify.Month.May,
        RightMonth: I18N.Baseline.BaselineModify.Month.June
      },
      {
        LeftMonth: I18N.Baseline.BaselineModify.Month.July,
        RightMonth: I18N.Baseline.BaselineModify.Month.Aug
      },
      {
        LeftMonth: I18N.Baseline.BaselineModify.Month.Sep,
        RightMonth: I18N.Baseline.BaselineModify.Month.Oct
      },
      {
        LeftMonth: I18N.Baseline.BaselineModify.Month.Nov,
        RightMonth: I18N.Baseline.BaselineModify.Month.Dec
      }
    ];
    let uom = I18N.Baseline.BaselineModify.Uom;
    var disable = this.state.disable;
    var idx = 0;
    var monthItems = months.map(function(month) {
      let props = {
        ref: "monthItem" + (idx + 1),
        index: idx++,
        line: month,
        uom: uom,
        disable: disable
      };
      return (
        <MonthItem {...props}/>
        );
    });
    var yearPickerStyle = {
      width: '128px',
      height: '32px',
      lineHeight: '32px',
      border: '1px solid #efefef',
      margin: '14px 0px 0px 10px',
      fontSize: '15px',
      color: '#b3b3b3',
      textAlign: 'center'
    };
    var curYear = (new Date()).getFullYear();
    var selectYear = (this.state.year || curYear) + I18N.Baseline.Year;
    var yearProps = {
      ref: "yearSelector",
      isViewStatus: !this.state.disable,
      selectedIndex: ((this.state.year || curYear) - curYear + 10),
      onYearPickerSelected: this._onYearPickerSelected,
      style: {
        margin: '14px 0px 0px 10px',
        width: '100px'
      }
    };
    var YearSelect = null;
    if (this.state.disable) {
      YearSelect = <div className='jazz-setting-basic-year'><YearPicker {...yearProps}/></div>;
    } else {
      YearSelect = <span style={yearPickerStyle}>{selectYear}</span>;
    }
    var yearStyle = {
      display: 'inline-block',
      width: '90px',
      height: '24px',
      marginLeft: '24px',
      marginRight: '10px',
      fontSize: '14px',
      fontFamily: 'Microsoft YaHei',
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
    if (this.state.isLoading) {
      return (
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '160px'
        }}>
          <CircularProgress  mode="indeterminate" size={1} />
        </div>
        );
    } else {
      return (
        <div className="jazz-setting-baseline-container">
          <div className='jazz-setting-baseline-content'>
            <div style={{
          display: 'flex',
          flexFlow: 'row'
        }}>
              <div style={{
          marginTop: '21px',
          height: '20px'
        }}>
              {I18N.Baseline.BaselineModify.YearSelect }
              </div>
              {YearSelect}
            </div>
            <div className='jazz-setting-baseline-margin'>
              {I18N.Baseline.BaselineModify.YearBaseline}
            </div>
            <div style={{
          display: 'flex',
          flexFlow: 'row',
          alignItems: 'center'
        }}>
              {I18N.Baseline.BaselineModify.YearValue}<TextField ref="yearValue" className='jazz-setting-input' style={yearStyle} value={this.state.yearValue} errorText={this.state.errorText} disabled={this.state.disable} onChange={this.yearValueChange}/>{I18N.Baseline.BaselineModify.Uom}
              <span className="icon-revised-cn" style={{
          marginLeft: '5px',
          color: 'red',
          fontSize: '24px'
        }} hidden={!this.state.yearIsModify}></span>
            </div>
            <div className='jazz-setting-baseline-margin'>
              {I18N.Baseline.BaselineModify.MonthBaseline}
            </div>
            <div>
              {monthItems}
            </div>
          </div>
          <div>
            <div hidden={!this.state.disable}>
              <RaisedButton label={I18N.Baseline.Button.Edit} style={buttonStyle} labelStyle={labelStyle} onClick={this.handleEdit}/>
            </div>
            <div hidden={this.state.disable}>
              <RaisedButton label={I18N.Baseline.Button.Save} style={buttonStyle} labelStyle={labelStyle} onClick={this.handleSave}/>
              <RaisedButton label={I18N.Baseline.Button.Cancel} style={buttonStyle} labelStyle={labelStyle} onClick={this.handleCancel}/>
            </div>
          </div>
      </div>
        );
    }
  }
});

let MonthItem = React.createClass({
  setValue: function(data) {
    var index = this.props.index;
    // this.refs.leftValue.setValue(data.getIn(["MonthlyValues", index * 2, "DataValue"]));
    // this.refs.rightValue.setValue(data.getIn(["MonthlyValues", index * 2 + 1, "DataValue"]));
    this.setState({
      leftValue:data.getIn(["MonthlyValues", index * 2, "DataValue"]),
      rightValue:data.getIn(["MonthlyValues", index * 2 + 1, "DataValue"]),
      leftIsModify: data.getIn(["MonthlyValues", index * 2, "IsModify"]),
      rightIsModify: data.getIn(["MonthlyValues", index * 2 + 1, "IsModify"])
    });
  },
  _validateLeft: function() {
    var val = this.state.leftValue;
    this._validateLeftValue(val);
    return true;
  },
  _validateLeftValue: function(val) {
    var value = extractNumber(val);
    // if (val !== value) {
    //   this.refs.leftValue.setValue(value);
    // }
    return value;
  },
  _onLeftChange: function(e) {
        var value = this._validateLeftValue(e.target.value);
    this.setState({
      leftValue:value
    },()=>{
      var itemIndex = this.props.index;
      var monthIndex = itemIndex * 2;
      if (value === "") {
        value = null;
      }
      BaselineModifyAction.setMonthData(monthIndex, value);
      BaselineModifyAction.setMonthIsModify(monthIndex);
    })


  },
  _validateRight: function() {
    var val = this.state.rightValue;
    this._validateRightValue(val);
    return true;
  },
  _validateRightValue: function(val) {
    var value = extractNumber(val);
    // if (val !== value) {
    //   this.refs.rightValue.setValue(value);
    // }
    return value;
  },
  _onRightChange: function(e) {
    var value = this._validateRightValue(e.target.value);
    this.setState({
      rightValue:value
    },()=>{
      var itemIndex = this.props.index;
      var monthIndex = itemIndex * 2 + 1;
      if (value === "") {
        value = null;
      }
      BaselineModifyAction.setMonthData(monthIndex, value);
      BaselineModifyAction.setMonthIsModify(monthIndex);
    })

  },
  getInitialState: function() {
    var itemIndex = this.props.index;
    return {
      errorLeftText: "",
      errorRightText: "",
      leftIsModify: false,
      rightIsModify: false,
      leftValue:'',
      rightValue:''
    };
  },
  render: function() {
    let line = this.props.line;
    let Uom = this.props.uom;
    let disable = this.props.disable;
    var leftDivStyle = {
      width: '52px',
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'center'
    };
    var centerDivStyle = {
      width: '103px',
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'center'
    };
    var rightDivStyle = {
      width: '92px',
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'center'
    };
    var monthStyle = {
      display: 'inline-block',
      width: '90px',
      height: '24px',
      fontSize: '14px',
      fontFamily: 'Microsoft YaHei',
      color: '#767a7a',
      backgroundColor: 'transparent',
      border: '1px solid #e4e7e6'
    };
    return (
      <table border='0' cellSpacing='1' cellPadding='0'>
        <tr>
          <td>
            <div style={{
        display: 'flex',
        flexFlow: 'row',
        alignItems: 'center',
        height: '28px'
      }}>
              <div style={leftDivStyle}>{line.LeftMonth}</div>
              <div style={centerDivStyle}>
                <TextField ref="leftValue" className="jazz-setting-input" style={monthStyle}   value={this.state.leftValue} errorText={this.state.errorLeftText} onChange={this._onLeftChange} disabled={disable}/>
              </div>
              <div style={rightDivStyle}>
                {Uom}
                <span className="icon-revised-cn" style={{
        marginLeft: '5px',
        color: 'red',
        fontSize: '24px'
      }} hidden={!this.state.leftIsModify}></span>
              </div>
            </div>
          </td>
          <td>
            <div style={{
        display: 'flex',
        flexFlow: 'row',
        alignItems: 'center',
        height: '28px'
      }}>
              <div style={leftDivStyle}>{line.RightMonth}</div>
              <div style={centerDivStyle}>
                <TextField ref="rightValue" className="jazz-setting-input" style={monthStyle} value={this.state.rightValue} errorText={this.state.errorRightText} onChange={this._onRightChange} disabled={disable}/>
              </div>
              <div style={rightDivStyle}>
                {Uom}
                <span className="icon-revised-cn" style={{
        marginLeft: '5px',
        color: 'red',
        fontSize: '24px'
      }} hidden={!this.state.rightIsModify}></span>
              </div>
            </div>
          </td>
        </tr>
      </table>
      );
  }
});

module.exports = BaselineModify;
