'use strict';

import React from 'react';
import classNames from 'classnames';
import ConstStore from '../../stores/ConstStore.jsx';
import CommonFuns from '../../util/Util.jsx';
import DateTimeSelector from '../../controls/DateTimeSelector.jsx';
import TagSelectWindow from './TagSelectWindow.jsx';
import { FlatButton, FontIcon, SelectField, TextField, RadioButton, RadioButtonGroup, Checkbox, Dialog } from 'material-ui';
import Immutable from 'immutable';

let ReportDataItem = React.createClass({
  getInitialState: function() {
    return {
      showTagSelectDialog: false
    };
  },
  getRealTime(time) {
    var j2d = CommonFuns.DataConverter.JsonToDateTime;
    return time !== null ? j2d(time, false) : null;
  },
  getDisplayDate(time) {
    if (time !== null) {
      var hour = time.getHours();
      if (hour === 0) {
        time = CommonFuns.dateAdd(time, -1, 'days');
        hour = 24;
      }
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var day = time.getDate();

      return year + '/' + month + '/' + day + ' ' + hour + ':00';
    } else {
      return '';
    }
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
  _getSheetItems: function() {
    var sheetNames = this.props.sheetNames;
    if (sheetNames !== null && sheetNames.size !== 0) {
      return sheetNames.map((item, i) => {
        return {
          payload: item,
          text: item
        };
      }).toJS();
    } else {
      return [];
    }
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
  _updateReportData(name, value) {
    if (this.props.updateReportData) {
      this.props.updateReportData(name, value, this.props.index);
    }
  },
  _deleteReportData() {
    if (this.props.deleteReportData) {
      this.props.deleteReportData(this.props.index);
    }
  },
  _onDirectionChange(value) {
    this._updateReportData('ExportLayoutDirection', value);
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
  _onReprtTypeChange(name, e) {
    var value = e.target.value;
    if (value === 0) {
      this.setState({
        showStep: true
      });
    } else if (value === 1) {
      this.setState({
        showStep: false
      });
    }
    this._handleSelectValueChange(name, e);
  },

  _handleSelectValueChange(name, e) {
    this._updateReportData(name, e.target.value);
  },
  _handleCheckboxCheck(name, e, check) {
    this._updateReportData(name, check);
  },
  _onStartCellChange() {
    var value = this.refs.startCell.getValue();
    this._updateReportData('StartCell', value);
  },
  _onDateSelectorChanged() {
    this._updateReportData('DateType', 11);
    var timeRange = this.refs.dateTimeSelector.getDateTime();
    var d2j = CommonFuns.DataConverter.DatetimeToJson;
    var startTime = d2j(timeRange.start);
    var endTime = d2j(timeRange.end);
    this._updateReportData('DataStartTime', startTime);
    this._updateReportData('DataEndTime', endTime);
  },
  _onTimeOrderChange(name, e, selected) {
    var value = this.displayToData(selected);
    this._updateReportData(name, value);
  },
  _displayTimeRange() {
    var str = '';
    if (this.props.dateType !== 11) {
      var dateType = this.changeTimeValue(this.props.dateType);
      var timeregion = CommonFuns.GetDateRegion(dateType);
      str = this.getDisplayDate(timeregion.start) + '-' + this.getDisplayDate(timeregion.end);
    } else {
      var startTime = this.getRealTime(this.props.startTime);
      var endTime = this.getRealTime(this.props.endTime);
      str = this.getDisplayDate(startTime) + '-' + this.getDisplayDate(endTime);
    }
    return str;
  },
  _handleDialogDismiss() {
    this.setState({
      showTagSelectDialog: false
    });
  },
  _showTagsDialog() {
    this.setState({
      showTagSelectDialog: true
    });
  },
  _renderTagSelectDialog() {
    if (!this.state.showTagSelectDialog) {
      return null;
    }
    var dialogActions = [
      <FlatButton disabled={this.props.disabled}
      label={I18N.EM.Report.Confirm}
      onClick={this._selectTags} />,

      <FlatButton
      label={I18N.EM.Report.Cancel}
      onClick={this._handleDialogDismiss} />
    ];
    var tagWindow = <TagSelectWindow selectedTagList={this.props.tagList}></TagSelectWindow>;

    return (<Dialog
      ref="tagSelectDialog"
      title={I18N.EM.Report.SelectTag}
      openImmediately={true}
      actions={dialogActions}
      modal={true}
      >
      <div style={{
        height: '500px',
        width: '700px'
      }}>
        {tagWindow}
      </div>
      </Dialog>);
  },
  componentDidUpdate: function() {
    if (!this.props.disabled) {
      var dateSelector = this.refs.dateTimeSelector;
      if (this.props.dateType !== 11) {
        var dateType = this.changeTimeValue(this.props.dateType);
        var timeregion = CommonFuns.GetDateRegion(dateType);
        dateSelector.setDateField(timeregion.start, timeregion.end);
      } else {
        var startTime = this.getRealTime(this.props.startTime);
        var endTime = this.getRealTime(this.props.endTime);
        dateSelector.setDateField(startTime, endTime);
      }
    }
  },
  componentDidMount: function() {
    if (!this.props.disabled) {
      var dateSelector = this.refs.dateTimeSelector;
      if (this.props.dateType !== 11) {
        var dateType = this.changeTimeValue(this.props.dateType);
        var timeregion = CommonFuns.GetDateRegion(dateType);
        dateSelector.setDateField(timeregion.start, timeregion.end);
      } else {
        var startTime = this.getRealTime(this.props.startTime);
        var endTime = this.getRealTime(this.props.endTime);
        dateSelector.setDateField(startTime, endTime);
      }
    }
  },
  render() {
    var typeItems = [{
      payload: 0,
      text: I18N.EM.Report.ReportTypeEnergy
    }, {
      payload: 1,
      text: I18N.EM.Report.Original
    }];
    var dateTypeItems = [{
      payload: 11,
      text: I18N.Common.DateRange.Customerize
    }, {
      payload: 0,
      text: I18N.Common.DateRange.Last7Day
    }, {
      payload: 9,
      text: I18N.Common.DateRange.Last30Day
    }, {
      payload: 10,
      text: I18N.Common.DateRange.Last12Month
    }, {
      payload: 1,
      text: I18N.Common.DateRange.Today
    }, {
      payload: 2,
      text: I18N.Common.DateRange.Yesterday
    }, {
      payload: 3,
      text: I18N.Common.DateRange.ThisWeek
    }, {
      payload: 4,
      text: I18N.Common.DateRange.LastWeek
    }, {
      payload: 5,
      text: I18N.Common.DateRange.ThisMonth
    }, {
      payload: 6,
      text: I18N.Common.DateRange.LastMonth
    }, {
      payload: 7,
      text: I18N.Common.DateRange.ThisYear
    }, {
      payload: 8,
      text: I18N.Common.DateRange.LastYear
    }];
    var stepItems = [{
      payload: 0,
      text: I18N.Common.AggregationStep.Minute
    }, {
      payload: 1,
      text: I18N.Common.AggregationStep.Hourly
    }, {
      payload: 2,
      text: I18N.Common.AggregationStep.Daily
    }, {
      payload: 5,
      text: I18N.Common.AggregationStep.Weekly
    }, {
      payload: 3,
      text: I18N.Common.AggregationStep.Monthly
    }, {
      payload: 4,
      text: I18N.Common.AggregationStep.Yearly
    }];
    var numberRuleItems = [{
      payload: 0,
      text: I18N.EM.Report.AllTime
    }, {
      payload: 1,
      text: I18N.EM.Report.Hourly
    }, {
      payload: 2,
      text: I18N.EM.Report.Daily
    }];
    var me = this;
    var deleteButton = null,
      dateTimeSelector = null,
      dataSourceButton = null;
    if (!me.props.disabled) {
      deleteButton = <FlatButton label={I18N.EM.Report.Delete} onClick={me._deleteReportData} />;
      dataSourceButton = <FlatButton label={me.props.addReport ? I18N.EM.Report.SelectTag : I18N.EM.Report.EditTag} onClick={me._showTagsDialog} style={{
        width: '120px'
      }} />;
      dateTimeSelector = <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={me._onDateSelectorChanged} showTime={true}/>;
    } else {
      dataSourceButton = <FlatButton onClick={me._showTagsDialog} label={I18N.EM.Report.ViewTag} style={{
        width: '120px'
      }} />;
      dateTimeSelector = <span>{me._displayTimeRange()}</span>;
    }
    var diplayCom = null;
    if (me.props.showStep) {
      diplayCom = <SelectField ref='step' menuItems={stepItems} disabled={me.props.disabled} value={me.props.step} hintText={I18N.EM.Report.Select} floatingLabelText={I18N.EM.Report.Step} onChange={me._handleSelectValueChange.bind(null, 'ExportStep')}>
      </SelectField>;
    } else {
      diplayCom = <SelectField ref='numberRule' menuItems={numberRuleItems} disabled={me.props.disabled} value={me.props.numberRule} hintText={I18N.EM.Report.Select} floatingLabelText={I18N.EM.Report.NumberRule} onChange={me._handleSelectValueChange.bind(null, 'NumberRule')}>
      </SelectField>;
    }
    var tagDialog = me._renderTagSelectDialog();
    var displayIndex = me.props.dataLength - me.props.index;
    return (
      <div style={{
        display: 'flex',
        'flex-direction': 'column'
      }}>
        <div style={{
        display: 'flex',
        'flex-direction': 'row'
      }}>
          <span>{I18N.EM.Report.Data + displayIndex}</span>
          {deleteButton}
        </div>
        <div className='jazz-report-data-container'>
          <SelectField ref='reportType' menuItems={typeItems} disabled={me.props.disabled} value={me.props.reportType} hintText={I18N.EM.Report.Select} floatingLabelText={I18N.EM.Report.DataType} onChange={me._onReprtTypeChange.bind(null, 'ReportType')}>
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
            <SelectField menuItems={dateTypeItems} ref='dateType' disabled={me.props.disabled} value={me.props.dateType} onChange={me._onDateTypeChange.bind(null, 'DateType')}></SelectField>
            {dateTimeSelector}
          </div>
        </div>
        <div className='jazz-report-data-container'>
          {diplayCom}
        </div>
        <div className='jazz-report-data-container'>
          <span>{I18N.EM.Report.Order}</span>
          <div className='jazz-report-data-radiobutton'>
            <RadioButtonGroup name='timeOrder' valueSelected={me.dataToDisplay(me.props.timeOrder)} onChange={me._onTimeOrderChange.bind(null, 'ExportTimeOrder')}>
              <RadioButton value='orderAsc' disabled={me.props.disabled} label={I18N.EM.Report.OrderAsc} />
              <RadioButton value='orderDesc' disabled={me.props.disabled} label={I18N.EM.Report.OrderDesc} />
            </RadioButtonGroup>
          </div>
        </div>
        <div className='jazz-report-data-container'>
          <SelectField ref='targetSheet' menuItems={me._getSheetItems()} disabled={me.props.disabled} value={me.props.targetSheet} hintText={I18N.EM.Report.Select} floatingLabelText={I18N.EM.Report.TargetSheet} onChange={me._handleSelectValueChange.bind(null, 'TargetSheet')}>
          </SelectField>
        </div>
        <div className='jazz-report-data-container'>
          <span>{I18N.EM.Report.ExportFormat}</span>
          <div className='jazz-report-data-checkbox'>
            <Checkbox disabled={me.props.disabled} checked={me.props.isExportTagName} label={I18N.EM.Report.ExportTagName} onCheck={me._handleCheckboxCheck.bind(null, 'IsExportTagName')}/>
            <Checkbox disabled={me.props.disabled} checked={me.props.isExportTimestamp} label={I18N.EM.Report.ExportTimeLabel} onCheck={me._handleCheckboxCheck.bind(null, 'IsExportTimestamp')}/>
          </div>
        </div>
        <div className='jazz-report-data-container'>
          <TextField ref='startCell' floatingLabelText={I18N.EM.Report.StartCell} value={me.props.startCell} disabled={me.props.disabled} onChange={me._onStartCellChange}></TextField>
        </div>
        <div className='jazz-report-data-container'>
          <span>{I18N.EM.Report.Layout}</span>
          <div className='jazz-report-data-direction'>
            <div onClick={me._onDirectionChange.bind(null, 0)} className={classNames(
        {
          'jazz-report-data-direction-time': me.props.exportLayoutDirection !== 0 && !me.props.disabled,
          'jazz-report-data-direction-time-selected': me.props.exportLayoutDirection === 0,
          'jazz-report-data-direction-time-disabled': me.props.disabled
        }
      )}></div>
          <div onClick={me._onDirectionChange.bind(null, 1)} className={classNames(
        {
          'jazz-report-data-direction-tag': me.props.exportLayoutDirection !== 1 && !me.props.disabled,
          'jazz-report-data-direction-tag-selected': me.props.exportLayoutDirection === 1,
          'jazz-report-data-direction-tag-disabled': me.props.disabled
        }
      )}></div>
          </div>
        </div>
        {tagDialog}
      </div>
      );
  }
});

module.exports = ReportDataItem;
