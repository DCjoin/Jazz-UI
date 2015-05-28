'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, RaisedButton, DatePicker} from 'material-ui';
import assign from "object-assign";
import {hourPickerData} from '../../util/Util.jsx';

const searchDate = [{value: 'Last7Day', text: '最近7天'}, {value: 'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
 {value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'}, {value: 'LastWeek', text: '上周'},
 {value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];

const dateTime = hourPickerData();

let ChartPanel = React.createClass({
    mixins:[Navigation,State],

render: function () {
      var date = new Date();


      return (
        <div style={{flex:1}}>
          <div>
            <span >{'1塔办公电梯日能耗报警'}</span>
            <i className='fa fa-floppy-o' style={{'margin-left':'10px'}}></i>
          </div>
          <div style={{display:'flex', 'flexFlow':'row', 'align-items':'center'}}>
            <DropDownMenu menuItems={searchDate}></DropDownMenu>
            <DatePicker className='jazz-alarm-datepicker' defaultDate={date} />
            <DropDownMenu menuItems={dateTime}></DropDownMenu>
            <span style={{'margin-left':'10px'}}> {'到'} </span>
            <DatePicker className='jazz-alarm-datepicker' defaultDate={date} />
            <DropDownMenu menuItems={dateTime}></DropDownMenu>
            <RaisedButton label='查看' secondary={true} />
          </div>
          <div>
            {'ChartPanel'}
          </div>
        </div>
      );
  }
});

module.exports = ChartPanel;
