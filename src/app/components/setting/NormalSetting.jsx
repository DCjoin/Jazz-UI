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

import DaytimeRangeValues from './DaytimeRangeValues.jsx';

var NormalSetting = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    items: React.PropTypes.array,
    isViewStatus: React.PropTypes.bool,
    isDisplay: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      start: this.props.start,
      workdays: this._extractWorkItems(),
      nonWorkdays: this._extractNonWorkItems(),
      isViewStatus: this.props.isViewStatus,
    };
  },

  componentDidMount: function() {
    var workdays = this._extractWorkItems(),
      nonWorkdays = this._extractNonWorkItems();
    this.setState({
      workdays: workdays,
      nonWorkdays: nonWorkdays
    });
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps) {
      var workdays = this._extractWorkItems(nextProps),
        nonWorkdays = this._extractNonWorkItems(nextProps);
      this.setState({
        workdays: workdays,
        nonWorkdays: nonWorkdays
      });
    }
  },

  _composeEndTime: function(items) {
    for (var i = 0; i < items.length; i++) {
      if (i == items.length - 1) {
        items[i].EndTime = 1440;
      } else {
        items[i].EndTime = items[i + 1].StartTime;
      }
    }
    return items;
  },

  _extractWorkItems: function(props) {
    var items;
    if (props)
      items = props.items;
    else
      items = this.props.items;

    var workdays = [],
      newWorkdays = [];
    if (!items)
      items = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.DayType == 0) {
        workdays.push(item);
      }
    }
    if (workdays.length == 0) {
      workdays.push({
        StartTime: 0,
        DayType: 0,
        EndTime: 1440,
      });
    }
    return this._composeEndTime(workdays);
  },

  _extractNonWorkItems: function(props) {
    var items;
    if (props)
      items = props.items;
    else
      items = this.props.items;

    var nonWorkdays = [];
    if (!items)
      items = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.DayType == 1) {
        nonWorkdays.push(item);
      }
    }
    if (nonWorkdays.length == 0) {
      nonWorkdays.push({
        StartTime: 0,
        DayType: 0,
        EndTime: 1440,
      });
    }
    return this._composeEndTime(nonWorkdays);
  },

  getValue: function() {
    var workdays = this.refs.workdayValues.getValue(),
      nonWorkdays = this.refs.nonWorkdayValues.getValue(),
      set = [];
    for (var i = 0; i < workdays.length; i++) {
      workdays[i].DayType = 0;
      set.push(workdays[i]);
    }
    for (var i = 0; i < nonWorkdays.length; i++) {
      nonWorkdays[i].DayType = 1;
      set.push(nonWorkdays[i]);
    }
    return set;
  },

  render: function() {
    if (!this.props.isDisplay) {
      return <div></div>;
    }

    var workProps = {
        tag: this.props.tag,
        items: this.state.workdays,
        isViewStatus: this.props.isViewStatus
      },
      nonWorkdayProps = {
        tag: this.props.tag,
        items: this.state.nonWorkdays,
        isViewStatus: this.props.isViewStatus
      };

    var style = {
      marginLeft: "35px"
    };
    return (
      <div style={style}>
        <div style={{
        marginTop: '10px'
      }}>小时基准值</div>
        <div style={{
        color: '#abafae',
        'margin-top': '18px'
      }}>工作日</div>
        <div>
          <DaytimeRangeValues ref="workdayValues" {...workProps} />
        </div>
        <div style={{
        color: '#abafae',
        marginTop: '18px'
      }}>非工作日</div>
        <div>
          <DaytimeRangeValues ref="nonWorkdayValues" {...nonWorkdayProps} />
        </div>
      </div>
      );
  }
});


module.exports = NormalSetting;
