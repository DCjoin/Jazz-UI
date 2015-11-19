'use strict';

import React from 'react';
import classNames from 'classnames';
import ConstStore from '../../stores/ConstStore.jsx';
import DateTimeSelector from '../../controls/DateTimeSelector.jsx';
import { FlatButton, FontIcon, SelectField, TextField, RadioButton, RadioButtonGroup, DropDownMenu } from 'material-ui';


let ReportDataItem = React.createClass({
  getInitialState: function() {
    var reportData = this.props.reportData;
    var timeOrder = this.dataToDisplay(reportData.ExportTimeOrder);
    return {
      index: this.props.index,
      disabled: this.props.disabled,
      reportItem: this.props.reportItem,
      sheetNames: this.props.sheetNames,
      reportType: reportData.ReportType,
      dateType: reportData.DateType,
      step: reportData.ExportStep,
      numberRule: reportData.NumberRule,
      targetSheet: reportData.TargetSheet,
      timeOrder: timeOrder,
      showStep: true
    };
  },
  dataToDisplay: function(data) {
    var display;
    if (data === 0) {
      display = 'orderAsc';
    } else if (data === 1) {
      display = 'orderDesc';
    }
    return display;
  },
  displayToData: function(display) {
    var data;
    if (display === 'orderAsc') {
      data = 0;
    } else if (display === 'orderDesc') {
      data = 1;
    }
    return data;
  },
  getSheetItems: function() {
    var sheetNames = this.props.sheetNames;
    var sheetItems = [];
    for (var i = 0; i < sheetNames.length; i++) {
      var obj = {
        payload: sheetNames[i],
        text: sheetNames[i]
      };
      sheetItems.push(obj);
    }
    return sheetItems;
  },
  _handleSelectValueChange(name, e) {
    let change = {};
    change[name] = e.target.value;
    this.setState(change);
  },
  componentWillReceiveProps(nextProps) {
    let newState = {};


    if (nextProps.hasOwnProperty('reportData')) {
      var reportData = nextProps.reportData;
      var timeOrder = this.dataToDisplay(reportData.ExportTimeOrder);
      newState.reportType = reportData.ReportType;
      newState.dateType = reportData.DateType;
      newState.step = reportData.ExportStep;
      newState.numberRule = reportData.NumberRule;
      newState.timeOrder = timeOrder;
      newState.targetSheet = reportData.TargetSheet;
    }
    if (nextProps.hasOwnProperty('disabled')) {
      newState.disabled = nextProps.disabled;
    }
    if (nextProps.hasOwnProperty('reportItem')) {
      newState.reportItem = nextProps.reportItem;
    }
    if (nextProps.hasOwnProperty('index')) {
      newState.index = nextProps.index;
    }
    if (nextProps.hasOwnProperty('sheetNames')) {
      newState.sheetNames = nextProps.sheetNames;
    }

    this.setState(newState);
  },
  render() {
    var me = this;
    var index = me.state.index;
    var typeItems = [{
      payload: 0,
      text: I18N.EM.Report.ReportTypeEnergy
    }, {
      payload: 1,
      text: I18N.EM.Report.Original
    }];
    var dateTypeItems = [
      {
        payload: 11,
        text: I18N.Common.DateRange.Customerize
      },
      {
        payload: 0,
        text: I18N.Common.DateRange.Last7Day
      },
      {
        payload: 9,
        text: I18N.Common.DateRange.Last30Day
      },
      {
        payload: 10,
        text: I18N.Common.DateRange.Last12Month
      },
      {
        payload: 1,
        text: I18N.Common.DateRange.Today
      },
      {
        payload: 2,
        text: I18N.Common.DateRange.Yesterday
      },
      {
        payload: 3,
        text: I18N.Common.DateRange.ThisWeek
      },
      {
        payload: 4,
        text: I18N.Common.DateRange.LastWeek
      },
      {
        payload: 5,
        text: I18N.Common.DateRange.ThisMonth
      },
      {
        payload: 6,
        text: I18N.Common.DateRange.LastMonth
      },
      {
        payload: 7,
        text: I18N.Common.DateRange.ThisYear
      },
      {
        payload: 8,
        text: I18N.Common.DateRange.LastYear
      }];
    var stepItems = [
      {
        payload: 0,
        text: I18N.Common.AggregationStep.Minute
      },
      {
        payload: 1,
        text: I18N.Common.AggregationStep.Hourly
      },
      {
        payload: 2,
        text: I18N.Common.AggregationStep.Daily
      },
      {
        payload: 5,
        text: I18N.Common.AggregationStep.Weekly
      },
      {
        payload: 3,
        text: I18N.Common.AggregationStep.Monthly
      },
      {
        payload: 4,
        text: I18N.Common.AggregationStep.Yearly
      }
    ];
    var numberRuleItems = [
      {
        payload: 0,
        text: I18N.EM.Report.AllTime
      },
      {
        payload: 1,
        text: I18N.EM.Report.Hourly
      },
      {
        payload: 2,
        text: I18N.EM.Report.Daily
      }
    ];
    var deleteButton = null,
      dataSourceButton = null;
    if (!me.state.disabled) {
      deleteButton = <FlatButton label={I18N.EM.Report.Delete} />;
      dataSourceButton = <FlatButton label={I18N.EM.Report.EditTag} style={{
        width: '120px'
      }} />;
    } else {
      dataSourceButton = <FlatButton label={I18N.EM.Report.ViewTag} />;
    }
    var diplayCom = null;
    if (me.state.showStep) {
      diplayCom = <SelectField ref='step' menuItems={stepItems} disabled={me.state.disabled} value={me.state.step} hintText={I18N.EM.Report.Select} floatingLabelText={I18N.EM.Report.Step} onChange={me._handleSelectValueChange.bind(null, 'step')}>
      </SelectField>;
    } else {
      diplayCom = <SelectField ref='numberRule' menuItems={numberRuleItems} disabled={me.state.disabled} value={me.state.numberRule} hintText={I18N.EM.Report.Select} floatingLabelText={I18N.EM.Report.NumberRule} onChange={me._handleSelectValueChange.bind(null, 'numberRule')}>
      </SelectField>;
    }

    return (
      <div style={{
        display: 'flex',
        'flex-direction': 'column'
      }}>
        <div style={{
        display: 'flex',
        'flex-direction': 'row'
      }}>
          <span>{I18N.EM.Report.Data + index}</span>
          {deleteButton}
        </div>
        <div className='jazz-report-data-container'>
          <SelectField ref='reportType' menuItems={typeItems} disabled={me.state.disabled} value={me.state.reportType} hintText={I18N.EM.Report.Select} floatingLabelText={I18N.EM.Report.DataType} onChange={me._handleSelectValueChange.bind(null, 'reportType')}>
          </SelectField>
        </div>
        <div className='jazz-report-data-container'>
          <span>{I18N.EM.Report.DataSource}</span>
          {dataSourceButton}
        </div>
        <div className='jazz-report-data-container'>
          <span>{I18N.EM.Report.TimeRange}</span>
          <div style={{
        display: 'flex',
        'flex-direction': 'row'
      }}>
            <SelectField menuItems={dateTypeItems} ref='dateType' disabled={me.state.disabled} value={me.state.dateType} onChange={me._handleSelectValueChange.bind(null, 'dateType')}></SelectField>
            <DateTimeSelector ref='dateTimeSelector' showTime={false}/>
          </div>
        </div>
        <div className='jazz-report-data-container'>
          {diplayCom}
        </div>
        <div className='jazz-report-data-container'>
          <span>{I18N.EM.Report.Order}</span>
          <RadioButtonGroup valueSelected={me.state.timeOrder}>
            <RadioButton
      value='orderAsc'
      disabled={me.state.disabled}
      label={I18N.EM.Report.OrderAsc} />
            <RadioButton
      value='orderDesc'
      disabled={me.state.disabled}
      label={I18N.EM.Report.OrderDesc}/>
          </RadioButtonGroup>
        </div>
        <div className='jazz-report-data-container'>
          <SelectField ref='targetSheet' menuItems={me.getSheetItems()} disabled={me.state.disabled} value={me.state.targetSheet} hintText={I18N.EM.Report.Select} floatingLabelText={I18N.EM.Report.TargetSheet} onChange={me._handleSelectValueChange.bind(null, 'targetSheet')}>
          </SelectField>
        </div>
        <div className='jazz-report-data-container'>
        </div>
      </div>
      );
  }
});

module.exports = ReportDataItem;
