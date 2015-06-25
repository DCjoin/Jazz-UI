'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {DropDownMenu, DatePicker} from 'material-ui';
import assign from "object-assign";

import {dateFormat, dateAdd} from '../../util/Util.jsx';
import MonthPicker from '../../controls/MonthPicker.jsx';
import YearPicker from '../../controls/YearPicker.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import AlarmList from './AlarmList.jsx';
import {dateType} from '../../constants/AlarmConstants.jsx';
import AlarmStore from '../../stores/AlarmStore.jsx';
import HierarchyStore from '../../stores/HierarchyStore.jsx';

var  menuItems = [
   { type: dateType.DAY_ALARM, text: '查看日报警列表' },
   { type: dateType.MONTH_ALARM, text: '查看月报警列表' },
   { type: dateType.YEAR_ALARM, text: '查看年报警列表' }
];
const MONTHSTEP = 3,
      DAYSTEP = 2,
      HOURSTEP = 1;

var AlarmLeftPanel = React.createClass({
    childContextTypes:{
        muiTheme: React.PropTypes.object.isRequired
    },
    contextTypes: {
      muiTheme: React.PropTypes.object
    },
    getChildContext() {
      let childContext = assign({}, this.context.muiTheme);
      childContext.spacing.desktopToolbarHeight = 32;

      return {
          muiTheme: childContext
      };
    },
    _dateTypeChangeHandler: function(e, selectedIndex, menuItem) {
      let type = menuItem.type;

      let date = new Date();
          date.setHours(0,0,0);
      if(type == dateType.DAY_ALARM){//default yesterday
        date = dateAdd(date, -1, 'days');
        let dayStr = dateFormat(date,'YYYYMMDD');
        this.loadListByDate(dayStr, HOURSTEP);
      }else if(type == dateType.MONTH_ALARM){//default last month
        date = dateAdd(date, -1, 'months');
        let monthStr = dateFormat(date,'YYYYMM');
        this.loadListByDate(monthStr, DAYSTEP);
      }else{
        date = dateAdd(date, -1, 'years');
        let yearStr =dateFormat(date,'YYYY');
        this.loadListByDate(yearStr, MONTHSTEP);
      }

      this.setState({
            dateType: menuItem.type
      });
    },
    loadListByDate(date, step){
      this.refs.alarmResList.setState({loadingStatus: true,
                                       dateValue: date,
                                       step: step} );

      AlarmAction.getHierarchyListByDate(date, step);
    },
    onYearPickerSelected(yearDate){
      this.loadListByDate(yearDate, MONTHSTEP);
    },
    onMonthPickerSelected(monthDate){
      this.loadListByDate(monthDate, DAYSTEP);
    },
    onDayPickerSelected(e, newDate){
      let dayDate = dateFormat(newDate,'YYYYMMDD');
      this.loadListByDate(dayDate, HOURSTEP);
    },
    getInitialState() {
        return {
          dateType: dateType.DAY_ALARM
        };
    },
    render: function () {

      let dateSelector,
          date = new Date();

      if(this.state.dateType == dateType.DAY_ALARM){
        date.setDate(date.getDate() - 1);
        date.setMinutes(0,0,0,0);
        dateSelector = ( <DatePicker className='jazz-alarm-datepicker' defaultDate={date} onChange={this.onDayPickerSelected} ref='daySelector'/>);
      }else if(this.state.dateType == dateType.MONTH_ALARM){
        dateSelector = ( <MonthPicker onMonthPickerSelected={this.onMonthPickerSelected} ref='monthSelector'/>);
      }else{
        dateSelector = ( <div className={'jazz-alarm-left-panel-year-dropdownmenu-container'}> <YearPicker ref='yearSelector' style={{width:'300px'}} onYearPickerSelected={this.onYearPickerSelected}/></div>);
      }

      return (
        <div style={{width:'300px',display:'flex','flexFlow':'column', 'background-color':'rgb(53, 64, 82)'}}>
          <div className={'jazz-alarm-left-panel-dropdownmenu-container'}>
              <DropDownMenu autoWidth={false} style={{width:'300px'}} onChange={this._dateTypeChangeHandler} menuItems={menuItems}></DropDownMenu>
          </div>
          <div style={{margin:'0px auto 10px auto'}}>
            {dateSelector}

          </div>
          <AlarmList style={{margin:'auto'}} ref='alarmResList'></AlarmList>

        </div>
      );
    },
    componentDidMount: function() {
      let dayDate = dateFormat(this.refs.daySelector.getDate(),'YYYYMMDD');
      this.loadListByDate(dayDate, HOURSTEP);
    }
});

module.exports = AlarmLeftPanel;
