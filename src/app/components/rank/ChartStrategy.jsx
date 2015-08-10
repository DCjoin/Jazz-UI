'use strict';
import React from "react";
import assign from "object-assign";
import _ from 'lodash';
import {FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress} from 'material-ui';

import CommonFuns from '../../util/Util.jsx';
import ViewableDatePicker from '../../controls/ViewableDatePicker.jsx';
import ButtonMenu from '../../controls/ButtonMenu.jsx';
import ExtendableMenuItem from '../../controls/ExtendableMenuItem.jsx';
import AlarmTagStore from '../../stores/AlarmTagStore.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import YaxisSelector from './YaxisSelector.jsx';
import StepSelector from './StepSelector.jsx';
import ChartComponent from './ChartComponent.jsx';
import EnergyStore from '../../stores/EnergyStore.jsx';
import TagStore from '../../stores/TagStore.jsx';

let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');

const searchDate = [{value:'Customerize',text:'自定义'},{value: 'Last7Day', text: '最近7天'}, {value:'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
{value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'},
{value: 'LastWeek', text: '上周'},{value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];
const rankType = [{value:'TotalRank',text:'总排名'},{value:'RankByPeople',text:'人均排名'},
{value:'RankByArea', text:'单位面积排名'},{value:'RankByHeatArea',text:'单位供冷面积排名'},
{value:'RankByCoolArea',text:'单位采暖面积排名'},{value:'RankByRoom',text:'单位客房排名'},
{value:'RankByUsedRoom',text:'单位已用客房排名'},{value:'RankByBed',text:'单位床位排名'}];
let ChartStrategy = React.createClass({
  render(){
    var me = this;
    var dateStyle = {
      width:'112px',
      height:'32px',
      fontSize: '14px',
      fontFamily: 'Microsoft YaHei'
    };
    var startDateProps = {
      dateFormatStr: 'YYYY/MM/DD',
      defaultValue: this.state.startDate,
      style: dateStyle
    };
    var endDateProps = {
      dateFormatStr: 'YYYY/MM/DD',
      defaultValue: this.state.endDate,
      style: dateStyle
    };
    return (
      <div className={'jazz-alarm-chart-toolbar-container'}>
        <div className={'jazz-full-border-dropdownmenu-relativedate-container'} >
          <DropDownMenu menuItems={searchDate} ref='relativeDate' style={{width:'92px'}}></DropDownMenu>
        </div>
        <div style={{display:'flex',flexDirection:'row', alignItems:'center', backgroundColor:'#fbfbfb'}}>
          <div className={'jazz-full-border-datepicker-container'}>
            <ViewableDatePicker ref="startDate" {...startDateProps}/>
          </div>
          <span> {'到'} </span>
          <div className={'jazz-full-border-datepicker-container'}>
            <ViewableDatePicker ref="endDate" {...endDateProps}/>
          </div>
        </div>
        <div className={'jazz-full-border-dropdownmenu-relativedate-container'} >
          <DropDownMenu menuItems={rankType} ref='rankType' style={{width:'92px'}}></DropDownMenu>
        </div>
        <div className={'jazz-flat-button'}>
          <RaisedButton label="查看"/>
        </div>
      </div>
    );
  }
});

module.exports = ChartStrategy;
