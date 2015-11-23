'use strict';

import React from 'react';
import classNames from 'classnames';
import ConstStore from '../../stores/ConstStore.jsx';
import CommonFuns from '../../util/Util.jsx';
import DateTimeSelector from '../../controls/DateTimeSelector.jsx';
import { FlatButton, FontIcon, SelectField, TextField, RadioButton, RadioButtonGroup, Checkbox } from 'material-ui';


let ReportDataItem = React.createClass({
  getInitialState: function() {
    var reportData = this.props.reportData;
    var timeOrder = this.dataToDisplay(reportData.get('ExportTimeOrder'));
    var j2d = CommonFuns.DataConverter.JsonToDateTime;
    return {
      index: this.props.index,
      disabled: this.props.disabled,
      sheetNames: this.props.sheetNames,
      startTime: reportData.get('DataStartTime') !== null ? j2d(reportData.get('DataStartTime'), false) : null,
      endTime: reportData.get('DataEndTime') !== null ? j2d(reportData.get('DataEndTime'), false) : null,
      reportType: reportData.get('ReportType'),
      dateType: reportData.get('DateType'),
      step: reportData.get('ExportStep'),
      numberRule: reportData.get('NumberRule'),
      timeOrder: timeOrder,
      targetSheet: reportData.get('TargetSheet'),
      isExportTagName: reportData.get('IsExportTagName'),
      isExportTimestamp: reportData.get('IsExportTimestamp'),
      startCell: reportData.get('StartCell'),
      exportLayoutDirection: reportData.get('ExportLayoutDirection'),
      showStep: true
    };
  },
  getDisplayDate(time) {
    var hour = time.getHours();
    if (hour === 0) {
      time = CommonFuns.dateAdd(time, -1, 'days');
      hour = 24;
    }
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();

    return year + '/' + month + '/' + day + ' ' + hour + ':00';
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
    var sheetNames = this.state.sheetNames;
    var sheetItems = [];
    for (var i = 0; i < sheetNames.size; i++) {
      var obj = {
        payload: sheetNames.get(i),
        text: sheetNames.get(i)
      };
      sheetItems.push(obj);
    }
    return sheetItems;
  },
  changeDirection(value) {
    this.setState({
      exportLayoutDirection: value
    });
  },
  changeTimeValue(value) {
    var result = '';
    switch (value) {
      case 0: result = 'last7day';
        break;
      case 9: result = 'last30day';
        break;
      case 10: result = 'last12month';
        break;
      case 1: result = 'today';
        break;
      case 2: result = 'yesterday';
        break;
      case 3: result = 'thisweek';
        break;
      case 4: result = 'lastweek';
        break;
      case 5: result = 'thismonth';
        break;
      case 6: result = 'lastmonth';
        break;
      case 7: result = 'thisyear';
        break;
      case 8: result = 'lastyear';
        break;
    }
    return result;
  },
  _onDateTypeChange(name, e) {
    var value = e.target.value;
    var dateSelector = this.refs.dateTimeSelector;

    if (value !== 11) {
      var dateType = this.changeTimeValue(value);
      var timeregion = CommonFuns.GetDateRegion(dateType);
      dateSelector.setDateField(timeregion.start, timeregion.end);
    }
    this._handleSelectValueChange(name, e);
  },
  _handleSelectValueChange(name, e) {
    let change = {};
    change[name] = e.target.value;
    this.setState(change);
  },
  _handleCheckboxCheck(name, e, check) {
    let change = {};
    change[name] = check;
    this.setState(change);
  },
  _onDateSelectorChanged() {
    this.setState({
      dateType: 11
    });
  },
  componentWillReceiveProps(nextProps) {
    let newState = {};

    var reportData = nextProps.reportData;
    var j2d = CommonFuns.DataConverter.JsonToDateTime;
    var timeOrder = this.dataToDisplay(reportData.get('ExportTimeOrder'));
    newState.startTime = reportData.get('DataStartTime') !== null ? j2d(reportData.get('DataStartTime'), false) : null;
    newState.endTime = reportData.get('DataEndTime') !== null ? j2d(reportData.get('DataEndTime'), false) : null;
    newState.reportType = reportData.get('ReportType');
    newState.dateType = reportData.get('DateType');
    newState.step = reportData.get('ExportStep');
    newState.numberRule = reportData.get('NumberRule');
    newState.timeOrder = timeOrder;
    newState.targetSheet = reportData.get('TargetSheet');
    newState.isExportTagName = reportData.get('IsExportTagName');
    newState.isExportTimestamp = reportData.get('IsExportTimestamp');
    newState.startCell = reportData.get('StartCell');
    newState.exportLayoutDirection = reportData.get('ExportLayoutDirection');

    newState.disabled = nextProps.disabled;
    newState.index = nextProps.index;
    newState.sheetNames = nextProps.sheetNames;

    this.setState(newState);
  },
  componentDidUpdate: function() {
    if (!this.state.disabled) {
      var dateSelector = this.refs.dateTimeSelector;
      if (this.state.dateType !== 11) {
        var dateType = this.changeTimeValue(this.state.dateType);
        var timeregion = CommonFuns.GetDateRegion(dateType);
        dateSelector.setDateField(timeregion.start, timeregion.end);
      } else {
        dateSelector.setDateField(this.state.startTime, this.state.endTime);
      }
    }
  },
  componentDidMount: function() {
    if (!this.state.disabled) {
      var dateSelector = this.refs.dateTimeSelector;
      if (this.state.dateType !== 11) {
        var dateType = this.changeTimeValue(this.state.dateType);
        var timeregion = CommonFuns.GetDateRegion(dateType);
        dateSelector.setDateField(timeregion.start, timeregion.end);
      } else {
        dateSelector.setDateField(this.state.startTime, this.state.endTime);
      }
    }
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
      dateTimeSelector = null,
      dataSourceButton = null;
    if (!me.state.disabled) {
      deleteButton = <FlatButton label={I18N.EM.Report.Delete} />;
      dataSourceButton = <FlatButton label={I18N.EM.Report.EditTag} style={{
        width: '120px'
      }} />;
      dateTimeSelector = <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={me._onDateSelectorChanged} showTime={true}/>;
    } else {
      dataSourceButton = <FlatButton label={I18N.EM.Report.ViewTag} style={{
        width: '120px'
      }} />;
      dateTimeSelector = <span>{me.getDisplayDate(me.state.startTime) + '-' + me.getDisplayDate(me.state.endTime)}</span>;
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
            <SelectField menuItems={dateTypeItems} ref='dateType' disabled={me.state.disabled} value={me.state.dateType} onChange={me._onDateTypeChange.bind(null, 'dateType')}></SelectField>
            {dateTimeSelector}
          </div>
        </div>
        <div className='jazz-report-data-container'>
          {diplayCom}
        </div>
        <div className='jazz-report-data-container'>
          <span>{I18N.EM.Report.Order}</span>
          <div className='jazz-report-data-radiobutton'>
            <RadioButtonGroup valueSelected={me.state.timeOrder}>
              <RadioButton value='orderAsc' disabled={me.state.disabled} label={I18N.EM.Report.OrderAsc} />
              <RadioButton value='orderDesc' disabled={me.state.disabled} label={I18N.EM.Report.OrderDesc} />
            </RadioButtonGroup>
          </div>
        </div>
        <div className='jazz-report-data-container'>
          <SelectField ref='targetSheet' menuItems={me.getSheetItems()} disabled={me.state.disabled} value={me.state.targetSheet} hintText={I18N.EM.Report.Select} floatingLabelText={I18N.EM.Report.TargetSheet} onChange={me._handleSelectValueChange.bind(null, 'targetSheet')}>
          </SelectField>
        </div>
        <div className='jazz-report-data-container'>
          <span>{I18N.EM.Report.ExportFormat}</span>
          <div className='jazz-report-data-checkbox'>
            <Checkbox disabled={me.state.disabled} checked={me.state.isExportTagName} label={I18N.EM.Report.ExportTagName} onCheck={me._handleCheckboxCheck.bind(null, 'isExportTagName')}/>
            <Checkbox disabled={me.state.disabled} checked={me.state.isExportTimestamp} label={I18N.EM.Report.ExportTimeLabel} onCheck={me._handleCheckboxCheck.bind(null, 'isExportTimestamp')}/>
          </div>
        </div>
        <div className='jazz-report-data-container'>
          <TextField ref='startCell' floatingLabelText={I18N.EM.Report.StartCell} value={me.state.startCell} disabled={me.state.disabled}></TextField>
        </div>
        <div className='jazz-report-data-container'>
          <span>{I18N.EM.Report.Layout}</span>
          <div className='jazz-report-data-direction'>
            <div onClick={me.changeDirection.bind(null, 0)} className={classNames(
        {
          'jazz-report-data-direction-time': me.state.exportLayoutDirection !== 0 && !me.state.disabled,
          'jazz-report-data-direction-time-selected': me.state.exportLayoutDirection === 0,
          'jazz-report-data-direction-time-disabled': me.state.disabled
        }
      )}></div>
          <div onClick={me.changeDirection.bind(null, 1)} className={classNames(
        {
          'jazz-report-data-direction-tag': me.state.exportLayoutDirection !== 1 && !me.state.disabled,
          'jazz-report-data-direction-tag-selected': me.state.exportLayoutDirection === 1,
          'jazz-report-data-direction-tag-disabled': me.state.disabled
        }
      )}></div>
          </div>
        </div>
      </div>
      );
  }
});

module.exports = ReportDataItem;
