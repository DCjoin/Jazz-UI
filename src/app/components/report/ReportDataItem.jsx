'use strict';

import React from 'react';
import classNames from 'classnames';
import ConstStore from '../../stores/ConstStore.jsx';
import CommonFuns from '../../util/Util.jsx';
import Regex from '../../constants/Regex.jsx';
import DateTimeSelector from '../../controls/DateTimeSelector.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import TagSelectWindow from './TagSelectWindow.jsx';
import { FontIcon, SelectField, TextField, RadioButton, RadioButtonGroup, Checkbox, Dialog } from 'material-ui';
import FlatButton from '../../controls/FlatButton.jsx';
import Immutable from 'immutable';

var dateTypeChanged = false;
let ReportDataItem = React.createClass({
  getInitialState: function() {
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
    stepItems = this._getDisabledStepItems(this.props.dateType, Immutable.fromJS(stepItems));
    return {
      showTagSelectDialog: false,
      stepItems: Immutable.fromJS(stepItems),
      emptyErrorText: ''
    };
  },
  _clearErrorText() {
    this.refs.startCellId.clearErrorText();
  },
  _isValid() {
    var isValid;
    if (this.props.tagList.size === 0) {
      return false;
    }
    if (this.refs.stepId) {
      isValid = this.refs.stepId.isValid();
    } else if (this.refs.numberRuleId) {
      isValid = this.refs.numberRuleId.isValid();
    }
    isValid = isValid && this.refs.reportTypeId.isValid() && this.refs.dateTypeId.isValid() && this.refs.targetSheetId.isValid() && this.refs.startCellId.isValid();
    return isValid;
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
  _updateReportData(name, value, stepValue) {
    if (this.props.updateReportData) {
      this.props.updateReportData(name, value, this.props.index, stepValue);
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
  _onDateTypeChange(value) {
    dateTypeChanged = true;
    var dateSelector = this.refs.dateTimeSelector;

    if (value !== 11) {
      var dateType = CommonFuns.GetStrDateType(value);
      var timeregion = CommonFuns.GetDateRegion(dateType);
      dateSelector.setDateField(timeregion.start, timeregion.end);
    }
    this._handleStepDisabled(value);
  },
  _getDateTypeStep: function(dateType) {
    var step = [];
    //0-Minute,1-Hourly,2-Daily,3-Monthly,4-Yearly,5-Weekly
    switch (dateType) {
      case 1: //Today
      case 2: //Yesterday
        step = [0, 1, 2]; //can raw & hour & day
        break;
      case 3: //ThisWeek
      case 4: //LastWeek
        step = [0, 1, 2, 5]; //can raw & hour & day & week
        break;
      case 5: //ThisMonth
      case 6: //LastMonth
        step = [0, 1, 2, 5, 3]; //can raw & hour & day & week & month
        break;
      case 7: //ThisYear
      case 8: //LastYear
        step = [1, 2, 5, 3, 4]; //can hour & day & week & month & year
        break;
    }
    return step;
  },
  _getDisabledStepItems(dateType, stepItems) {
    var list;
    var timeregion;
    if ((dateType === 0) || (dateType === 9) || (dateType === 10)) {
      var newDateType = CommonFuns.GetStrDateType(dateType);
      timeregion = CommonFuns.GetDateRegion(newDateType);
      list = CommonFuns.getInterval(timeregion.start, timeregion.end).stepList;
    } else if (dateType === 11) {
      var dateSelector = this.refs.dateTimeSelector;
      timeregion = dateSelector.getDateTime();
      list = CommonFuns.getInterval(timeregion.start, timeregion.end).stepList;
    } else {
      list = this._getDateTypeStep(dateType);
    }
    var order = [0, 1, 2, 5, 3, 4];
    for (var i = 0; i < order.length; i++) {
      if (list.indexOf(order[i]) === -1) {
        stepItems = stepItems.setIn([i, 'disabled'], true);
      } else {
        stepItems = stepItems.setIn([i, 'disabled'], false);
      }
    }
    return stepItems;
  },
  _handleStepDisabled(dateType) {
    var stepItems = this._getDisabledStepItems(dateType, this.state.stepItems);
    var stepValue = null;
    for (var i = 0; i < stepItems.size; i++) {
      if (stepItems.getIn([i, 'payload']) === this.props.step && !stepItems.getIn([i, 'disabled'])) {
        stepValue = this.props.step;
        break;
      }
    }
    if (stepValue === null) {
      for (i = 0; i < stepItems.size; i++) {
        if (!stepItems.getIn([i, 'disabled'])) {
          stepValue = stepItems.getIn([i, 'payload']);
          break;
        }
      }
    }
    this._updateReportData('DateType', dateType, stepValue);

    this.setState({
      stepItems: stepItems
    });
  },
  _onReprtTypeChange(value) {
    if (value === 0) {
      this.setState({
        showStep: true
      });
    } else if (value === 1) {
      this.setState({
        showStep: false
      });
    }
    this._handleSelectValueChange('ReportType', value);
  },
  _handleSelectValueChange(name, value) {
    this._updateReportData(name, value);
  },
  _handleCheckboxCheck(name, e, check) {
    this._updateReportData(name, check);
  },
  _onStartCellChange() {
    var value = this.refs.startCellId.getValue();
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
  _onTagDataChange() {
    var tagList = this.refs.tagListWindow._getSelectedTagList();
    this._handleDialogDismiss();
    this._updateReportData('TagsList', tagList);
  },
  _onTimeOrderChange(name, e, selected) {
    var value = this.displayToData(selected);
    this._updateReportData(name, value);
  },
  _displayTimeRange() {
    var str = '';
    if (this.props.dateType !== 11) {
      var dateType = CommonFuns.GetStrDateType(this.props.dateType);
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
      onClick={this._onTagDataChange} />,

      <FlatButton
      label={I18N.EM.Report.Cancel}
      onClick={this._handleDialogDismiss} />
    ];
    var tagWindow = <TagSelectWindow ref='tagListWindow' disabled={this.props.disabled} selectedTagList={this.props.tagList}></TagSelectWindow>;

    return (<div className='jazz-data-tag-select-window'><Dialog
      ref="tagSelectDialog"
      title={I18N.EM.Report.SelectTag}
      openImmediately={true}
      actions={dialogActions}
      modal={true}
      >
      <div style={{
        flex: 1,
        display: 'flex',
        height: '350px'
      }}>
        {tagWindow}
      </div>
    </Dialog></div>);
  },
  componentDidUpdate: function() {
    if (!this.props.disabled) {
      var dateSelector = this.refs.dateTimeSelector;
      if (this.props.dateType !== 11) {
        var dateType = CommonFuns.GetStrDateType(this.props.dateType);
        var timeregion = CommonFuns.GetDateRegion(dateType);
        dateSelector.setDateField(timeregion.start, timeregion.end);
      } else {
        if (dateTypeChanged) {
          dateTypeChanged = false;
        } else {
          var startTime = this.getRealTime(this.props.startTime);
          var endTime = this.getRealTime(this.props.endTime);
          dateSelector.setDateField(startTime, endTime);
        }
      }
    }
  },
  componentDidMount: function() {
    if (!this.props.disabled) {
      var dateSelector = this.refs.dateTimeSelector;
      if (this.props.dateType !== 11) {
        var dateType = CommonFuns.GetStrDateType(this.props.dateType);
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
      deleteButton = <div className='jazz-report-data-delete-button'><FlatButton secondary={true} label={I18N.EM.Report.Delete} onClick={me._deleteReportData} style={{
        background: 'transparent'
      }} /></div>;
      dataSourceButton = <div className='jazz-report-data-datasource-button'><FlatButton secondary={true} label={me.props.addReport ? I18N.EM.Report.SelectTag : I18N.EM.Report.EditTag} onClick={me._showTagsDialog}/></div>;
      dateTimeSelector = <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={me._onDateSelectorChanged} showTime={true}/>;
    } else {
      dataSourceButton = <div className='jazz-report-data-datasource-button'><FlatButton secondary={true} onClick={me._showTagsDialog} label={I18N.EM.Report.ViewTag}/></div>;
      dateTimeSelector = <div style={{
        marginLeft: '100px',
        paddingTop: '6px'
      }}>{me._displayTimeRange()}</div>;
    }
    var diplayCom = null;
    if (me.props.showStep) {
      var stepProps = {
        ref: 'stepId',
        dataItems: me.state.stepItems.toJS(),
        isViewStatus: me.props.disabled,
        defaultValue: me.props.step,
        title: I18N.EM.Report.Step,
        textField: 'text',
        didChanged: me._handleSelectValueChange.bind(null, 'ExportStep')
      };
      diplayCom = <ViewableDropDownMenu {...stepProps}></ViewableDropDownMenu>;
    } else {
      var numberRuleProps = {
        ref: 'numberRuleId',
        dataItems: numberRuleItems,
        isViewStatus: me.props.disabled,
        defaultValue: me.props.numberRule,
        title: I18N.EM.Report.NumberRule,
        textField: 'text',
        didChanged: me._handleSelectValueChange.bind(null, 'NumberRule')
      };
      diplayCom = <ViewableDropDownMenu {...numberRuleProps}></ViewableDropDownMenu>;
    }
    var tagDialog = me._renderTagSelectDialog();
    var displayIndex = me.props.dataLength - me.props.index;
    var reportTypeProps = {
      ref: 'reportTypeId',
      dataItems: typeItems,
      isViewStatus: me.props.disabled,
      defaultValue: me.props.reportType,
      title: I18N.EM.Report.DataType,
      textField: 'text',
      didChanged: me._onReprtTypeChange
    };
    var dateTypeProps = {
      ref: 'dateTypeId',
      dataItems: dateTypeItems,
      isViewStatus: me.props.disabled,
      defaultValue: me.props.dateType,
      title: '',
      textField: 'text',
      didChanged: me._onDateTypeChange
    };
    var targetSheetProps = {
      ref: 'targetSheetId',
      dataItems: me._getSheetItems(),
      isViewStatus: me.props.disabled,
      defaultValue: me.props.targetSheet,
      title: I18N.EM.Report.TargetSheet,
      textField: 'text',
      didChanged: me._handleSelectValueChange.bind(null, 'TargetSheet')
    };
    var startCellProps = {
      ref: 'startCellId',
      isViewStatus: me.props.disabled,
      didChanged: me._onStartCellChange,
      defaultValue: me.props.startCell,
      title: I18N.EM.Report.StartCell,
      isRequired: true,
      regex: Regex.ExcelCell,
      errorMessage: I18N.Common.Label.ExcelColumnError
    };

    return (
      <div className={classNames(
        {
          'jazz-report-data-content': true,
          'jazz-report-data-content-background': this.props.showBackground
        }
      )}>
        <div className='jazz-report-data-delete'>
          <div>{I18N.EM.Report.Data + displayIndex}</div>
          {deleteButton}
        </div>
        <div className='jazz-report-data-container'>
          <ViewableDropDownMenu {...reportTypeProps}></ViewableDropDownMenu>
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
            <ViewableDropDownMenu  {...dateTypeProps}></ViewableDropDownMenu>
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
          <ViewableDropDownMenu  {...targetSheetProps}></ViewableDropDownMenu>
        </div>
        <div className='jazz-report-data-container'>
          <span>{I18N.EM.Report.ExportFormat}</span>
          <div className='jazz-report-data-checkbox'>
            <Checkbox disabled={me.props.disabled} checked={me.props.isExportTagName} label={I18N.EM.Report.ExportTagName} onCheck={me._handleCheckboxCheck.bind(null, 'IsExportTagName')}/>
            <Checkbox disabled={me.props.disabled} checked={me.props.isExportTimestamp} label={I18N.EM.Report.ExportTimeLabel} onCheck={me._handleCheckboxCheck.bind(null, 'IsExportTimestamp')}/>
          </div>
        </div>
        <div className='jazz-report-data-container'>
          <ViewableTextField {...startCellProps}></ViewableTextField>
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
