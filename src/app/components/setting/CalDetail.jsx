import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import { SvgIcon, IconButton, DropDownMenu, TextField, FlatButton, FloatingActionButton, RadioButtonGroup, RadioButton, DatePicker, RaisedButton, CircularProgress } from 'material-ui';
import assign from "object-assign";
import classNames from 'classnames';
import YearPicker from '../../controls/YearPicker.jsx';
import DaytimeSelector from '../../controls/DaytimeSelector.jsx';
import NodeButtonBar from './NodeButtonBar.jsx';
import CommonFuns from '../../util/Util.jsx';
import TBSettingAction from '../../actions/TBSettingAction.jsx';
import TBSettingStore from '../../stores/TBSettingStore.jsx';
import TagStore from '../../stores/TagStore.jsx';
import ViewableDatePicker from '../../controls/ViewableDatePicker.jsx';

var CalDetail = React.createClass({

  getInitialState: function() {
    return {
      calendar: this.props.calendar,
      workTimeCalendar: this.props.workTimeCalendar,
      calendarName: this.props.calendarName,
      workTimeCalendarName: this.props.workTimeCalendarName
    };
  },
  render: function() {
    var workCal = [],
      workDay = [],
      offDay = [],
      workTime = [];
    if (this.state.calendar) {
      workCal.push(
        <div className="workdaytitle">{I18N.Baseline.Calc.workdaytitle + this.state.calendarName}</div>
      );
      workCal.push(
        <div className="workdaycontent">{I18N.Baseline.Calc.workdaycontent}</div>
      );
      this.state.calendar.Items.forEach(function(item) {
        if (item.Type == 0) {
          workDay.push(
            <div>{item.StartFirstPart}月{item.StartSecondPart}日至{item.EndFirstPart}月{item.EndSecondPart}日</div>
          )
        } else {
          offDay.push(
            <div>{item.StartFirstPart}月{item.StartSecondPart}日至{item.EndFirstPart}月{item.EndSecondPart}日</div>
          )
        }

      });
      if (workDay.length != 0) {
        workCal.push(
          <div className="workday">
                 <div>工作日 :</div>
                 <div className="font">{workDay}</div>
               </div>
        )
      }
      ;
      if (offDay.length != 0) {
        workCal.push(
          <div className="workday">
                 <div>休息日 :</div>
                 <div className="font">{offDay}</div>
               </div>
        )
      }
    }
    if (this.state.workTimeCalendar) {
      workCal.push(
        <div className="worktimetitle">工作时间日历：{this.state.workTimeCalendarName}</div>
      );
      workCal.push(
        <div className="worktimecontent">工作时间以外均为非工作时间</div>
      );
      this.state.workTimeCalendar.Items.forEach(function(item) {
        let StartFirstPart = (item.StartFirstPart < 10) ? ('0' + item.StartFirstPart) : (item.StartFirstPart);
        let StartSecondPart = (item.StartSecondPart < 10) ? ('0' + item.StartSecondPart) : (item.StartSecondPart);
        let EndFirstPart = (item.EndFirstPart < 10) ? ('0' + item.EndFirstPart) : (item.EndFirstPart);
        let EndSecondPart = (item.EndSecondPart < 10) ? ('0' + item.EndSecondPart) : (item.EndSecondPart);
        workTime.push(
          <div className="timecontent">{StartFirstPart}:{StartSecondPart}-{EndFirstPart}:{EndSecondPart}</div>
        )
      });
      if (workTime.length != 0) {
        workCal.push(
          <div className="worktime">
                  <div>工作时间 :</div>
                  <div className="time">
                    {workTime}
                  </div>
                </div>
        );
      }
    }

    return (
      <div className="jazz-setting-basic-caldetail">
    {workCal}

    </div>
      )
  }
});


module.exports = CalDetail;
