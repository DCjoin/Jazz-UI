'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {DropDownMenu, DatePicker} from 'material-ui';
import assign from "object-assign";

import {dateFormat} from '../../util/Util.jsx';
import MonthPicker from '../../controls/MonthPicker.jsx';
import YearPicker from '../../controls/YearPicker.jsx';
import ALarmAction from '../../actions/ALarmAction.jsx';
import AlarmList from './AlarmList.jsx';
import {dateType} from '../../constants/AlarmConstants.jsx';
import AlarmStore from '../../stores/AlarmStore.jsx';

var  menuItems = [
   { type: dateType.DAY_ALARM, text: '查看日报警列表' },
   { type: dateType.MONTH_ALARM, text: '查看月报警列表' },
   { type: dateType.YEAR_ALARM, text: '查看年报警列表' }
];

let AlarmLeftPanel = React.createClass({
    mixins:[Navigation,State],

    _dateTypeChangeHandler: function(e, selectedIndex, menuItem) {
      ALarmAction.changeDateType(menuItem.type);
    },
    _onChange() {//change dateType
    		let dateType = AlarmStore.getDateType();
        let dateValue = AlarmStore.getDateValue();
        let list = AlarmStore.getHierarchyList();
    		this.setState({
              dateType: dateType,
    	        dateValue: dateValue,
              hierList: list
    		});
    },
    loadListByDate(date, step){
      this.refs.alarmResList.setState({loadingStatus:true});
      ALarmAction.changeDate(date, step);
    },
    onYearPickerSelected(yearDate){
      this.loadListByDate(yearDate, 4);
    },
    onMonthPickerSelected(monthDate){
      this.loadListByDate(monthDate, 3);
    },
    onDayPickerSelected(e, newDate){
      let dayDate = dateFormat(newDate,'YYYYMMDD');
      this.loadListByDate(dayDate, 2);
    },
    getInitialState() {
        return {
          dateType: dateType.DAY_ALARM,
          dateValue: null,
          hierList: null
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
        dateSelector = ( <YearPicker ref='yearSelector' onYearPickerSelected={this.onYearPickerSelected}/>);
      }

      return (
        <div style={{width:'310px',display:'flex','flexFlow':'column'}}>
          <div style={{margin:'10px auto 0px auto'}}>
              <DropDownMenu onChange={this._dateTypeChangeHandler} menuItems={menuItems}></DropDownMenu>
          </div>
          <div style={{margin:'0px auto 10px auto'}}>
            {dateSelector}

          </div>
          <AlarmList style={{margin:'auto'}} ref='alarmResList'></AlarmList>

        </div>
      );
    },
    componentDidMount: function() {
      AlarmStore.addChangeListener(this._onChange);

      let dayDate = dateFormat(this.refs.daySelector.getDate(),'YYYYMMDD');
      this.loadListByDate(dayDate, 2);
    },
    componentDidUpdate(){//change dateType cause render
      let type = this.state.dateType;

      if(type == dateType.DAY_ALARM){
        let dayDate = dateFormat(this.refs.daySelector.getDate(),'YYYYMMDD');
        this.loadListByDate(dayDate, 2);
      }else if(type == dateType.MONTH_ALARM){
        let monthDate = this.refs.monthSelector.getDateValue();
        this.loadListByDate(monthDate, 3);
      }else{
        let yearDate = this.refs.yearSelector.getDateValue();
        this.loadListByDate(yearDate, 4);
      }
    }
});

module.exports = AlarmLeftPanel;
