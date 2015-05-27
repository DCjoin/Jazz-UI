'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {DropDownMenu, DatePicker} from 'material-ui';
import assign from "object-assign";

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
    _onChange() {
    		let dateType = AlarmStore.getDateType();
        let dateValue = AlarmStore.getDateValue();
        let list = AlarmStore.getHierarchyList();
    		this.setState({
              dateType: dateType,
    	        dateValue: dateValue,
              hierList: list
    		});
    },
    getInitialState() {
        return {
          dateType: dateType.DAY_ALARM,
          dateValue: null,
          hierList: null
        };
    },
    componentDidMount: function() {
      AlarmStore.addChangeListener(this._onChange);
    },
    onMonthPickerSelected(monthDate){
      ALarmAction.changeDate(monthDate, 3);
    },
    render: function () {

      let dateSelector;
      if(this.state.dateType == dateType.DAY_ALARM){
        dateSelector = (  <DatePicker hintText='day_dateSelector'></DatePicker>);
      }else if(this.state.dateType == dateType.MONTH_ALARM){
        dateSelector = (  <MonthPicker onMonthPickerSelected={this.onMonthPickerSelected}/>);
      }else{
        dateSelector = (  <YearPicker></YearPicker>);
      }

        return (
          <div style={{width:'310px',display:'flex','flexFlow':'column'}}>
            <div style={{margin:'10px auto'}}>
                <DropDownMenu onChange={this._dateTypeChangeHandler} menuItems={menuItems}></DropDownMenu>
            </div>
            <div style={{margin:'10px auto'}}>
              {dateSelector}

            </div>
            <AlarmList style={{margin:'auto'}}></AlarmList>

          </div>
        );
    }
});

module.exports = AlarmLeftPanel;
