'use strict';

import React from "react";
import classnames from "classnames";
import { formStatus } from '../../constants/FormStatus.jsx';
import { Checkbox, CircularProgress } from 'material-ui';
import Immutable from 'immutable';
import HierarchyAction from '../../actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import YearPicker from '../../controls/YearPicker.jsx';

let CalendarItem = React.createClass({
  propTypes: {
    index: React.PropTypes.number,
    type: React.PropTypes.number,
    merge: React.PropTypes.func,
    calendarItem: React.PropTypes.object,
    isViewStatus: React.PropTypes.bool,
    allCalendar: React.PropTypes.object
  },
  _getCalendarNameItems: function(type) {
    var me = this;
    var allCalendar = this.props.allCalendar;
    var calendarNameItems = [];
    if (allCalendar && allCalendar.size > 0) {
      var items = allCalendar.filter(item => (item.get('Type') === type));
      calendarNameItems = items.map(item => {
        return {
          payload: item.get('Id'),
          text: item.get('Name')
        };
      }).toJS();
    }
    return calendarNameItems;
  },
  render: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    let date = new Date();
    var effectiveTimeProps = {
      ref: "effectiveTime",
      isViewStatus: isView,
      style: {
        width: '300px'
      },
      yearRange: date.getFullYear() - 2006,
      title: I18N.Setting.Calendar.EffectiveDate,
      selectedYear: this.props.calendarItem.get('EffectiveTime'),
      onYearPickerSelected: value => {
        this.props.merge({
          value,
          path: "EffectiveTime"
        });
      }
    };
    var nameProps = {
      ref: 'name',
      isViewStatus: isView,
      style: {
        width: '300px'
      },
      title: I18N.Setting.Calendar.Name,
      defaultValue: this.props.calendarItem.get('Calendar').get('Id'),
      dataItems: me._getCalendarNameItems(me.props.type),
      didChanged: value => {
        me.props.merge({
          value,
          path: "Calendar"
        });
      }
    };
    var deleteButton = (this.props.isViewStatus ? null : <FlatButton label={I18N.Common.Button.Delete} onClick={this._deleteCalendarItem} primary={true}/>);
    var showDetailButton = (<FlatButton label={I18N.Setting.Calendar.ViewCalendarDetail} onClick={this._showDetail} primary={false}/>);
    var worktimeDiv = null;
    if (this.props.type === 0) {
      var addWorktimeProps = {
        label: I18N.Setting.Calendar.AddWorkTime,
        checked: this.props.calendarItem.get('WorkTimeCalendar') === null ? false : true,
        onCheck: this.checkWorktime,
        disabled: isView
      };
      var addWorktime = (<div className='jazz-hierarchy-calendar-type-item-worktime-checkbox'><Checkbox {...addWorktimeProps}/></div>);
      var worktime = null;
      if (this.props.calendarItem.get('WorkTimeCalendar') !== null) {
        var worktimeProps = {
          ref: 'worktime',
          isViewStatus: isView,
          style: {
            width: '300px'
          },
          title: I18N.Setting.Calendar.WorktimeSetting,
          defaultValue: this.props.calendarItem.get('WorkTimeCalendar').get('Id'),
          dataItems: me._getCalendarNameItems(1),
          didChanged: value => {
            me.props.merge({
              value,
              path: "WorkTimeCalendar"
            });
          }
        };
        worktime = <ViewableDropDownMenu {...worktimeProps}/>;
      }
      worktimeDiv = <div className='jazz-hierarchy-calendar-type-item-worktime'>{addWorktime}{worktime}</div>;
    }
    return (
      <div className='jazz-hierarchy-calendar-type-item'>
        <div className='jazz-hierarchy-calendar-type-item-time'>
          <YearPicker {...effectiveTimeProps}/>
          {deleteButton}
        </div>
        <div className='jazz-hierarchy-calendar-type-item-name'>
          <ViewableDropDownMenu {...nameProps}/>
          {showDetailButton}
        </div>
        {worktimeDiv}
      </div>

      );
  }
});

let CalendarItems = React.createClass({
  propTypes: {
    type: React.PropTypes.number,
    merge: React.PropTypes.func,
    calendarItems: React.PropTypes.array,
    isViewStatus: React.PropTypes.bool,
    allCalendar: React.PropTypes.object
  },
  getTextByType: function() {
    var text = '';
    switch (this.props.type) {
      case 0:
        text = I18N.Setting.Calendar.WorkdaySetting;
        break;
      case 2:
        text = I18N.Setting.Calendar.ColdwarmSetting;
        break;
      case 3:
        text = I18N.Setting.Calendar.DaynightSetting;
        break;
    }
    return text;
  },
  render: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    var calendarItems = me.props.calendarItems;
    var addButton = (<FlatButton label={I18N.Common.Button.Add} onClick={this._addCalendarItem} primary={false}/>);
    var addDom = isView ? null : (<div className='jazz-hierarchy-calendar-type-add'>
      <div className='jazz-hierarchy-calendar-type-add-text'>{this.getTextByType()}</div>
      {addButton}
    </div>);
    var calendar = null;
    if (calendarItems && calendarItems.size > 0)
      calendar = calendarItems.map((item, i) => {
        let props = {
          key: i,
          index: i,
          type: me.props.type,
          calendarItem: item,
          isViewStatus: isView,
          merge: me.props.merge,
          allCalendar: me.props.allCalendar
        };
        return (
          <CalendarItem {...props}/>
          );
      });
    return (
      <div className='jazz-hierarchy-calendar-type'>
        {addDom}
        {calendar}
      </div>

      );
  }
});

var Calendar = React.createClass({
  propTypes: {
    hierarchyId: React.PropTypes.number,
    merge: React.PropTypes.func,
    formStatus: React.PropTypes.string,
  },
  getInitialState: function() {
    return ({
      allCalendar: null,
      calendar: null,
      isLoading: true
    });
  },
  _onAllChange: function() {
    this.setState({
      allCalendar: HierarchyStore.getAllCalendar()
    });
  },
  _onChange: function() {
    this.setState({
      calendar: HierarchyStore.getCalendar(),
      isLoading: false
    });
  },
  _renderDetail: function() {
    var me = this;
    var isView = this.props.formStatus === formStatus.VIEW;
    var calendarItemGroups = Immutable.fromJS([{
      CalendarItems: null,
      Type: 0
    }, {
      CalendarItems: null,
      Type: 2
    }, {
      CalendarItems: null,
      Type: 3
    }]);
    if (this.state.calendar !== null) {
      calendarItemGroups = this.state.calendar.get('CalendarItemGroups');
    }
    var calendar = null;
    if (isView && this.state.calendar === null) {
      calendar = I18N.Setting.Calendar.AddCalendarInfo;
    } else {
      calendar = calendarItemGroups.map((item, i) => {
        let props = {
          key: i,
          type: item.get('Type'),
          calendarItems: item.get('CalendarItems'),
          isViewStatus: isView,
          allCalendar: me.state.allCalendar
        };
        return (
          <CalendarItems {...props}/>
          );
      });
    }
    return me.state.isLoading ? (<div className='jazz-calendar-loading'><div style={{
      margin: 'auto',
      width: '100px'
    }}><CircularProgress  mode="indeterminate" size={2} /></div></div>) : (
      <div>
        <div className={"pop-customer-detail-content"}>
        <div className="pop-customer-detail-content-left">
          {calendar}
        </div>
      </div>
      </div>
      );

  },
  componentWillMount: function() {},
  componentDidMount: function() {
    HierarchyAction.getAllCalendar();
    HierarchyAction.getCalendar(this.props.hierarchyId);
    HierarchyStore.addAllCalendarChangeListener(this._onAllChange);
    HierarchyStore.addCalendarChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    HierarchyStore.removeAllCalendarChangeListener(this._onAllChange);
    HierarchyStore.removeCalendarChangeListener(this._onChange);
  },
  render: function() {
    return (
      <div className="pop-manage-detail-content">
        {this._renderDetail()}
      </div>
      );

  },
});
module.exports = Calendar;
