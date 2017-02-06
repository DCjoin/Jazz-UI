'use strict';

import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import CommonFuns from 'util/Util.jsx';
import Regex from 'constants/Regex.jsx';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import TagSelectWindow from './TagSelectWindow.jsx';
import { RadioButton,  Checkbox} from 'material-ui';
import FlatButton from 'controls/FlatButton.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import Immutable from 'immutable';
import LinkButton from 'controls/LinkButton.jsx';

var dateTypeChanged = false;
var d2j = CommonFuns.DataConverter.DatetimeToJson;

function formatDate(time,settingYear){
  var currentYear=(new Date()).getFullYear();
  var date=time.add(currentYear-settingYear, 'y');
  if(date.month()!==time.month()){
    date=date.add(-1,'d');
  }
  return date._d
}

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
    var start = this.getRealTime(this.props.startTime);
    var end = this.getRealTime(this.props.endTime);
    stepItems = this._getDisabledStepItems(this.props.dateType, Immutable.fromJS(stepItems), start, end);
    return {
      showTagSelectDialog: false,
      stepItems: stepItems,
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
  getDisplayDate(time, isEndTime) {
    if (time !== null) {
      var hour = time.getHours();
      if (hour === 0 && isEndTime) {
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
  _updateReportData(name, value, stepValue, startTime, endTime) {
    if (this.props.updateReportData) {
      this.props.updateReportData(name, value, this.props.index, stepValue, startTime, endTime);
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

    if (value === 7 || value === 8) {
      //ThisYear or LastYear
      var dateType = CommonFuns.GetStrDateType(value);
      var timeregion = CommonFuns.GetDateRegion(dateType);
      dateSelector.setDateField(timeregion.start, timeregion.end);
    }
    if(value>20 && value<33){
      //January ,February ...December
      var month=value-21,
          start=moment().month(month).date(1)._d,
          end=moment().month(month).date(CommonFuns.getDaysOfMonth(month))._d;
          dateSelector.setDateField(start, end);
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
      case 21://January
      case 22:
      case 23:
      case 24:
      case 25:
      case 26:
      case 27:
      case 28:
      case 29:
      case 30:
      case 31:
      case 32://December
        step = [0, 1, 2, 5, 3]; //can raw & hour & day & week & month
        break;
      case 7: //ThisYear
      case 8: //LastYear
        step = [1, 2, 5, 3, 4]; //can hour & day & week & month & year
        break;
    }
    return step;
  },
  _getDisabledStepItems(dateType, stepItems, startTime, endTime) {
    var list;
    var timeregion;
    if ((dateType === 0) || (dateType === 9) || (dateType === 10)) {
      var newDateType = CommonFuns.GetStrDateType(dateType);
      timeregion = CommonFuns.GetDateRegion(newDateType);
      list = CommonFuns.getInterval(timeregion.start, timeregion.end).stepList;
    } else if (dateType === 33) {
      list = CommonFuns.getInterval(startTime, endTime).stepList;
      // if (!init) {
      //   var dateSelector = this.refs.dateTimeSelector;
      //   timeregion = dateSelector.getDateTime();
      //   list = CommonFuns.getInterval(timeregion.start, timeregion.end).stepList;
      // } else {
      //   var start = this.getRealTime(this.props.startTime);
      //   var end = this.getRealTime(this.props.startTime);
      //   list = CommonFuns.getInterval(start, end).stepList;
      // }


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
    var stepValue = null;
    var timeRange, startTime, endTime,
      customizedStart = null,
      customizedEnd = null;

    if (dateType === 33) {
      timeRange = this.refs.dateTimeSelector.getDateTime();
      customizedStart = timeRange.start;
      customizedEnd = timeRange.end;
      startTime = d2j(timeRange.start);
      endTime = d2j(timeRange.end);
    } else if(dateType===7 || dateType===8){
      var newDateType = CommonFuns.GetStrDateType(dateType);
      timeRange = CommonFuns.GetDateRegion(newDateType);
      startTime = d2j(timeRange.start);
      endTime = d2j(timeRange.end);
    }else {
      //January ,February ...December
      var month=dateType-21,
          year=moment().year();
          startTime=d2j(moment([year,month,1,0,0,0,0])._d);
          endTime=d2j(moment([year,month,CommonFuns.getDaysOfMonth(month),24,0,0,0])._d);
    }

    var stepItems = this._getDisabledStepItems(dateType, this.state.stepItems, customizedStart, customizedEnd);
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

    this._updateReportData('DateType', dateType, stepValue, startTime, endTime);
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
    this._handleStepDisabled(33);
  },
  _onTagDataChange() {
    var tagList = this.refs.tagListWindow._getSelectedTagList();
    this._handleDialogDismiss();
    this._updateReportData('TagsList', tagList);
  },
  _displayTimeRange() {
    var str = '';
    if (this.props.dateType !== 33) {
      var dateType = CommonFuns.GetStrDateType(this.props.dateType);
      var timeregion = CommonFuns.GetDateRegion(dateType);
      str = this.getDisplayDate(timeregion.start, false) + '-' + this.getDisplayDate(timeregion.end, true);
    } else {
      var startTime = this.getRealTime(this.props.startTime);
      var endTime = this.getRealTime(this.props.endTime);
      str = this.getDisplayDate(startTime, false) + '-' + this.getDisplayDate(endTime, true);
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
      label={I18N.Common.Button.Confirm}
      onClick={this._onTagDataChange} />,

      <FlatButton
      label={I18N.Common.Button.Cancel}
      onClick={this._handleDialogDismiss} />
    ];
    var tagWindow = <TagSelectWindow ref='tagListWindow' hierarchyId={this.props.hierarchyId} type={this.props.reportType} disabled={this.props.disabled} selectedTagList={this.props.tagList}></TagSelectWindow>;

    return (<div className='jazz-data-tag-select-window'><NewDialog
      ref="tagSelectDialog"
      title={I18N.EM.Report.SelectTag}
      open={true}
      actions={dialogActions}
      modal={true}
      wrapperStyle={{
        width:"auto",
        maxWidth:'1000px'
      }}
      contentStyle={{
        minHeight:'350px',
        minWidth:'852px'
      }}
      >
      <div style={{
        flex: 1,
        display: 'flex',
        height: '350px'
      }}>
      {tagWindow}
      </div>
    </NewDialog></div>);
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.id !== this.props.id) {
      var start = this.getRealTime(nextProps.startTime);
      var end = this.getRealTime(nextProps.endTime);
      var stepItems = this._getDisabledStepItems(nextProps.dateType, this.state.stepItems, start, end);
      this.setState({
        stepItems: stepItems
      });
    }
  },
  componentDidUpdate: function() {
    if (!this.props.disabled) {
      var dateSelector = this.refs.dateTimeSelector;
      if (this.props.dateType !== 33) {
        var startTime,endTime;
        if(this.props.dateType===7 || this.props.dateType===8){
          var newDateType = CommonFuns.GetStrDateType(this.props.dateType),
          timeRange = CommonFuns.GetDateRegion(newDateType);
          startTime = timeRange.start;
          endTime = timeRange.end;
        }else {
          //January ,February ...December
          var month=this.props.dateType-21,
              year=moment().year();
              startTime=moment([year,month,1,0,0,0,0])._d,
              endTime=moment([year,month,CommonFuns.getDaysOfMonth(month),1,0,0,0])._d;
        }
        dateSelector.setDateField(startTime, endTime);
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
      if (this.props.dateType !== 33) {
        var startTime,endTime;
        if(this.props.dateType===7 || this.props.dateType===8){
          var newDateType = CommonFuns.GetStrDateType(this.props.dateType),
          timeRange = CommonFuns.GetDateRegion(newDateType);
          startTime = timeRange.start;
          endTime = timeRange.end;
        }else {
          //January ,February ...December
          var month=this.props.dateType-21,
              year=moment().year();
          startTime=moment([year,month,1,0,0,0,0])._d,
          endTime=moment([year,month,CommonFuns.getDaysOfMonth(month),0,0,0,0])._d;
        }
        dateSelector.setDateField(startTime, endTime);
      } else {
        var startTime = moment(this.getRealTime(this.props.startTime));
        var endTime = moment(this.getRealTime(this.props.endTime));
        // var currentYear=(new Date()).getFullYear();
        // var settingYear=this.props.settingYear;
        // startTime=startTime.add(currentYear-settingYear, 'y');
        // endTime=endTime.add(currentYear-settingYear, 'y');

        startTime=formatDate(startTime,this.props.settingYear);
        endTime=formatDate(endTime,this.props.settingYear)
        dateSelector.setDateField(startTime, endTime);
      }
    }
  },
  componentWillUnmount: function() {},
  render() {
    var typeItems = [{
      payload: 0,
      text: I18N.Setting.KPI.Report.CalcData
    }, {
      payload: 1,
      text: I18N.EM.Report.Original
    }];
    var dateTypeItems = [
      {
      payload: 7,
      text: I18N.Common.DateRange.ThisYear
    }, {
      payload: 8,
      text: I18N.Common.DateRange.LastYear
    },{
      payload: 21,
      text: I18N.Common.Glossary.MonthName.January
    }, {
      payload: 22,
      text: I18N.Common.Glossary.MonthName.February
    }, {
      payload: 23,
      text: I18N.Common.Glossary.MonthName.March
    }, {
      payload: 24,
      text: I18N.Common.Glossary.MonthName.April
    }, {
      payload: 25,
      text: I18N.Common.Glossary.MonthName.May
    }, {
      payload: 26,
      text: I18N.Common.Glossary.MonthName.June
    }, {
      payload: 27,
      text: I18N.Common.Glossary.MonthName.July
    }, {
      payload: 28,
      text:I18N.Common.Glossary.MonthName.August
    }, {
      payload: 29,
      text: I18N.Common.Glossary.MonthName.September
    }, {
      payload: 30,
      text: I18N.Common.Glossary.MonthName.October
    }, {
      payload: 31,
      text: I18N.Common.Glossary.MonthName.November
    }, {
      payload: 32,
      text: I18N.Common.Glossary.MonthName.December
    },
    {
      payload: 33,
      text: I18N.Common.DateRange.Customerize
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
      deleteButton = <div className='jazz-report-data-delete-button'>
        <LinkButton iconName={ "icon-delete" } onClick={me._deleteReportData} style={{marginRight:'15px'}}/>
        </div>;
      dataSourceButton =<FlatButton secondary={true} style={{border:'1px solid #abafae',width:'150px'}} label={this.props.tagList.size===0 ? I18N.EM.Report.SelectTag : I18N.EM.Report.EditTag} onClick={me._showTagsDialog}/>;
      dateTimeSelector = <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={me._onDateSelectorChanged} showTime={false}/>;
    } else {
      dataSourceButton = <div className='jazz-report-data-datasource-button'><FlatButton secondary={true} onClick={me._showTagsDialog} label={I18N.EM.Report.ViewTag}/></div>;
      dateTimeSelector = <div style={{
        marginLeft: '15px',
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
      didChanged: me._onDateTypeChange,
      style: {
        width: '120px'
      }
    };
    var targetSheetProps = {
      ref: 'targetSheetId',
      dataItems: me._getSheetItems(),
      isViewStatus: me.props.disabled,
      defaultValue: me.props.targetSheet,
      title: I18N.Setting.KPI.Report.Sheet,
      textField: 'text',
      didChanged: me._handleSelectValueChange.bind(null, 'TargetSheet')
    };
    var startCellProps = {
      ref: 'startCellId',
      isViewStatus: me.props.disabled,
      didChanged: me._onStartCellChange,
      defaultValue: me.props.startCell,
      title: I18N.EM.Report.StartCell,
      hintText:I18N.Setting.KPI.Report.StartCellHintText,
      isRequired: true,
      regex: Regex.ExcelCell,
      errorMessage: I18N.Common.Label.ExcelColumnError
    };
    var directTime = null,
      directTag = null;
    if ((me.props.disabled && me.props.exportLayoutDirection === 0) || !me.props.disabled) {
      directTime = <div onClick={me._onDirectionChange.bind(null, 0)} className={classNames(
        {
          'jazz-report-data-direction-time': me.props.exportLayoutDirection !== 0 && !me.props.disabled,
          'jazz-report-data-direction-time-selected': me.props.exportLayoutDirection === 0,
          'jazz-report-data-direction-time-disabled': me.props.disabled
        }
      )}></div>;
    }
    if ((me.props.disabled && me.props.exportLayoutDirection === 1) || !me.props.disabled) {
      directTag = <div onClick={me._onDirectionChange.bind(null, 1)} className={classNames(
        {
          'jazz-report-data-direction-tag': me.props.exportLayoutDirection !== 1 && !me.props.disabled,
          'jazz-report-data-direction-tag-selected': me.props.exportLayoutDirection === 1,
          'jazz-report-data-direction-tag-disabled': me.props.disabled
        }
      )}></div>;
    }

    return (
      <div className='jazz-report-data-content'>
        <div className='jazz-report-data-container'>
          <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize:'14px'
      }}>

          <div>{I18N.Setting.KPI.Report.Data}</div>
          <div className='jazz-report-data-delete'>{deleteButton}</div>
          </div>
        </div>
        <div className='jazz-report-data-container'>
            <ViewableDropDownMenu {...reportTypeProps}></ViewableDropDownMenu>
        </div>
        <div className='jazz-report-data-container'>
          <span>{I18N.Setting.Tag.Tag}</span>
          {dataSourceButton}
        </div>
        <div className='jazz-report-data-container'>
          <div>
            <span style={{fontSize:'14px',color:'#464949'}}>{I18N.EM.Report.TimeRange}</span>
            <span className="kpi-report-commnet" style={{marginLeft:'10px'}}>{I18N.format(I18N.Setting.KPI.Report.TimeRangeComment,(new Date()).getFullYear())}</span>
          </div>

          <div className='jazz-report-data-timerange'>
            <ViewableDropDownMenu  {...dateTypeProps}></ViewableDropDownMenu>
            {dateTimeSelector}
          </div>
        </div>
        <div className='jazz-report-data-container'>
          {diplayCom}
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
            {directTime}
            {directTag}
          </div>
        </div>
        {tagDialog}
      </div>
      );
  }
});

module.exports = ReportDataItem;
