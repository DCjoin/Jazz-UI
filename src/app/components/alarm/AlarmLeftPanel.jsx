'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {DropDownMenu, DatePicker} from 'material-ui';
import assign from "object-assign";

import ALarmAction from '../../actions/ALarmAction.jsx';
import AlarmList from './AlarmList.jsx';
import {dateType} from '../../constants/AlarmConstants.jsx';

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

    render: function () {
        return (
          <div style={{width:'310px',display:'flex','flex-flow':'column'}}>
            <div style={{margin:'10px auto'}}>
                <DropDownMenu onChange={this._dateTypeChangeHandler} menuItems={menuItems}></DropDownMenu>
            </div>
            <div style={{margin:'10px auto'}}>
                <DatePicker hintText='dateSelector'></DatePicker>
            </div>
            <div style={{margin:'10px auto'}}>
                <AlarmList style={{margin:'auto'}}></AlarmList>
            </div>

          </div>
        );
    }
});

module.exports = AlarmLeftPanel;
