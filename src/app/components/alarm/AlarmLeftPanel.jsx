'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {DropDownMenu, DatePicker} from 'material-ui';
import assign from "object-assign";
import AlarmList from './AlarmList.jsx';


let AlarmLeftPanel = React.createClass({
    mixins:[Navigation,State],

render: function () {

  let menuItems = [
     { payload: '1', text: '查看日报警列表' },
     { payload: '2', text: '查看月报警列表' },
     { payload: '3', text: '查看年报警列表' }
  ];

      return (
        <div style={{width:'310px',display:'flex','flex-flow':'column'}}>
          <div style={{margin:'10px auto'}}>
              <DropDownMenu menuItems={menuItems}></DropDownMenu>
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
