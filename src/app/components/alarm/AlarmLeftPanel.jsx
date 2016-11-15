'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import MenuItem from 'material-ui/MenuItem';
import assign from "object-assign";
import moment from 'moment';
import { dateFormat, dateAdd } from '../../util/Util.jsx';
import ViewableDatePicker from '../../controls/ViewableDatePicker.jsx';
import CustomDropDownMenu from '../../controls/CustomDropDownMenu.jsx';
import MonthPicker from '../../controls/MonthPicker.jsx';
import YearPicker from '../../controls/YearPicker.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import AlarmList from './AlarmList.jsx';
import { dateType } from '../../constants/AlarmConstants.jsx';
import AlarmStore from '../../stores/AlarmStore.jsx';
import HierarchyStore from '../../stores/HierarchyStore.jsx';


const MONTHSTEP = 3,
  DAYSTEP = 2,
  HOURSTEP = 1;

var AlarmLeftPanel = React.createClass({
  propTypes: {
    onItemClick: React.PropTypes.func,
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
  },
  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object,
  },
  getChildContext() {
    let childContext = assign({}, this.context.muiTheme);
    childContext.spacing = assign({}, childContext.spacing);
    childContext.spacing.desktopToolbarHeight = 32;
    childContext.spacing.desktopSubheaderHeight = 32;

    return {
      muiTheme: childContext
    };
  },
  _dateTypeChangeHandler: function(e, selectedIndex, value) {
    let type = value;

    let date = new Date();
    date.setHours(0, 0, 0);
    if (type == dateType.DAY_ALARM) { //default yesterday
      date = dateAdd(date, -1, 'days');
      let dayStr = dateFormat(date, 'YYYYMMDD');
      date=moment(date).format("YYYY/MM/DD");
      this.loadListByDate(dayStr, HOURSTEP);
    } else if (type == dateType.MONTH_ALARM) { //default last month
      date = dateAdd(date, -1, 'months');
      let monthStr = dateFormat(date, 'YYYYMM');
      date=moment(date).format("YYYY/MM");
      this.loadListByDate(monthStr, DAYSTEP);
    } else {
      date = dateAdd(date, -1, 'years');
      let yearStr = dateFormat(date, 'YYYY');
      date=moment(date).format("YYYY");
      this.loadListByDate(yearStr, MONTHSTEP);
    }

    this.setState({
      dateType: type,
      date:date
    });
  },
  loadListByDate(date, step) {
    this.refs.alarmResList.setState({
      loadingStatus: true,
      dateValue: date,
      step: step
    });

    AlarmAction.getHierarchyListByDate(date, step, this.context.router.params.customerId);
  },
  onYearPickerSelected(yearDate) {
    this.loadListByDate(yearDate, MONTHSTEP);
  },
  onMonthPickerSelected(monthDate) {
    this.loadListByDate(monthDate, DAYSTEP);
  },
  onDayPickerSelected(value) {
    let dayDate = dateFormat(value, 'YYYYMMDD');
    this.setState({
      date: moment(value).format("YYYY/MM/DD")
    },()=>{
        this.loadListByDate(dayDate, HOURSTEP);
    })

  },
  getInitialState() {
    return {
      dateType: dateType.DAY_ALARM,
      date:moment(new Date()).add(-1,'d').format("YYYY/MM/DD")
    };
  },
  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.dateType != this.state.dateType || nextProps.lang != this.props.lang || nextState.date != this.state.date );
  },
  render: function() {
    var menuItems = [
      <MenuItem value={dateType.DAY_ALARM} primaryText={I18N.ALarm.List.Daily} />,
      <MenuItem value={dateType.MONTH_ALARM} primaryText={I18N.ALarm.List.Month} />,
      <MenuItem value={dateType.YEAR_ALARM} primaryText={I18N.ALarm.List.Year}/>
    ];
    let dateSelector,
    date=this.state.date;
    var dateProps = {
      dateFormatStr: 'YYYY/MM/DD',
      datePickerClassName: 'jazz-month-picker',
      value: date,
      isViewStatus:false,
      style: {
        fontSize: '14px',
        fontFamily: 'Microsoft YaHei'
      },
      onChange: this.onDayPickerSelected
    };
    if (this.state.dateType == dateType.DAY_ALARM) {
      // date.setDate(date.getDate() - 1);
      // date.setHours(0, 0, 0, 0);
      dateSelector = ( <div className='jazz-alarm-datepicker'><ViewableDatePicker {...dateProps} ref='daySelector'/></div>);
    } else if (this.state.dateType == dateType.MONTH_ALARM) {
      dateSelector = ( <MonthPicker onChange={this.onMonthPickerSelected} ref='monthSelector' value={this.state.date}/>);
    } else {
      dateSelector = ( <div className={'jazz-alarm-left-panel-year-dropdownmenu-container'}> <YearPicker ref='yearSelector' style={{
        width: '320px',
        height: '32px',
        lineHeight: '32px'
      }} onYearPickerSelected={this.onYearPickerSelected}/></div>);
    }

    return (
      <div style={{
        width: '320px',
        display: 'flex',
        flexFlow: 'column',
        backgroundColor: 'rgb(53, 64, 82)'
      }}>
        <CustomDropDownMenu
          height={32}
          backgroundColor='#86CCFF'
          onChange={this._dateTypeChangeHandler}
          value={this.state.dateType} >{menuItems}</CustomDropDownMenu>
          <div style={{
        padding: '0px auto 12px auto',
        height: '32px',
        flex: 'none'
      }}>
            {dateSelector}

          </div>
          <AlarmList style={{
        margin: 'auto'
      }} ref='alarmResList' onItemClick={this.props.onItemClick}></AlarmList>

        </div>
      );
  },
  componentDidMount: function() {
    let dayDate = dateFormat(this.state.date, 'YYYYMMDD');
    this.loadListByDate(dayDate, HOURSTEP);
  }
});

module.exports = AlarmLeftPanel;
