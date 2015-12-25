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
        var date = I18N.format(I18N.Baseline.Cal.Date, item.StartFirstPart, item.StartSecondPart, item.EndFirstPart, item.EndSecondPart);
        if (item.Type == 0) {
          workDay.push(
            <div>{date}</div>
          )
        } else {
          offDay.push(
            <div>{date}</div>
          )
        }

      });
      if (workDay.length != 0) {
        workCal.push(
          <div className="workday">
                 <div>{I18N.Baseline.Cal.workday}</div>
                 <div className="font">{workDay}</div>
               </div>
        )
      }
      ;
      if (offDay.length != 0) {
        workCal.push(
          <div className="workday">
                 <div>{I18N.Baseline.Cal.Holiday}</div>
                 <div className="font">{offDay}</div>
               </div>
        )
      }
    }
    if (this.state.workTimeCalendar) {
      workCal.push(
        <div className="worktimetitle">{I18N.Baseline.Cal.Worktimetitle + this.state.workTimeCalendarName}</div>
      );
      workCal.push(
        <div className="worktimecontent">{I18N.Baseline.Cal.Worktimecontent}</div>
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
                  <div>{I18N.Baseline.Cal.Worktime}</div>
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
