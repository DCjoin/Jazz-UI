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
import SideNav from '../../controls/SideNav.jsx';

let CalendarDetail = React.createClass({
  propTypes: {
    calendar: React.PropTypes.object,
    type: React.PropTypes.number,
    onClose: React.PropTypes.func,
    side: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      side: 'right'
    };
  },
  _formatDate: function(value) {
    return value > 9 ? value : '0' + value;
  },
  _getDisplay: function(item, day) {
    var startFirst = this._formatDate(item.get('StartFirstPart'));
    var startSecond = this._formatDate(item.get('StartSecondPart'));
    var endFirst = this._formatDate(item.get('EndFirstPart'));
    var endSecond = this._formatDate(item.get('EndSecondPart'));
    if (day) {
      return startFirst + '/' + startSecond + '-' + endFirst + '/' + endSecond;
    } else {
      return startFirst + ':' + startSecond + '-' + endFirst + ':' + endSecond;
    }
  },
  _renderDetail: function() {
    var me = this;
    var calendar = this.props.calendar,
      name = calendar.get('Name'),
      Items = calendar.get('Items');
    var display;
    switch (this.props.type) {
      case 0:
        var workdayItems = Items.filter(item => (item.get('Type') === 0)),
          holidayItems = Items.filter(item => (item.get('Type') === 1));
        var workday = null,
          holiday = null;
        if (workdayItems && workdayItems.size > 0) {
          workday = workdayItems.map((item, i) => {
            if (i === 0) {
              return <div>{I18N.Setting.Calendar.WorkDayTitle + me._getDisplay(item, true)}</div>;
            } else {
              return <div>{me._getDisplay(item, true)}</div>;
            }
          });
        }
        if (holidayItems && holidayItems.size > 0) {
          holiday = holidayItems.map((item, i) => {
            if (i === 0) {
              return <div>{I18N.Setting.Calendar.HolidayTitle + me._getDisplay(item, true)}</div>;
            } else {
              return <div>{me._getDisplay(item, true)}</div>;
            }
          });
        }

        display = (<div>
          <div>{I18N.Setting.Calendar.HolidayCalendar + name}</div>
          <div>{I18N.Setting.Calendar.DefaultWorkDay}</div>
          {workday}
          {holiday}
        </div>);
        break;
      case 1:
        var worktimeItems = Items.filter(item => (item.get('Type') === 2));
        var worktime = null;
        if (worktimeItems && worktimeItems.size > 0) {
          worktime = worktimeItems.map((item, i) => {
            if (i === 0) {
              return <div>{I18N.Setting.Calendar.WorkTimeTitle + me._getDisplay(item, false)}</div>;
            } else {
              return <div>{me._getDisplay(item, false)}</div>;
            }
          });
        }
        display = (<div>
        <div>{I18N.Setting.Calendar.WorkTimeCalendar + name}</div>
        <div>{I18N.Setting.Calendar.DefaultWorkTime}</div>
        {worktime}
      </div>);
        break;
      case 2:
        var warmItems = Items.filter(item => (item.get('Type') === 4)),
          coldItems = Items.filter(item => (item.get('Type') === 5));
        var warm = null,
          cold = null;
        if (warmItems && warmItems.size > 0) {
          warm = warmItems.map((item, i) => {
            if (i === 0) {
              return <div>{I18N.Setting.Calendar.WarmTitle + me._getDisplay(item, true)}</div>;
            } else {
              return <div>{me._getDisplay(item, true)}</div>;
            }
          });
        }
        if (coldItems && coldItems.size > 0) {
          cold = coldItems.map((item, i) => {
            if (i === 0) {
              return <div>{I18N.Setting.Calendar.ColdTitle + me._getDisplay(item, true)}</div>;
            } else {
              return <div>{me._getDisplay(item, true)}</div>;
            }
          });
        }

        display = (<div>
          <div>{I18N.Setting.Calendar.Name + name}</div>
          {warm}
          {cold}
        </div>);
        break;
      case 3:
        var dayItems = Items.filter(item => (item.get('Type') === 6));
        var day = null;
        if (dayItems && dayItems.size > 0) {
          day = dayItems.map((item, i) => {
            if (i === 0) {
              return <div>{I18N.Setting.Calendar.DayTitle + me._getDisplay(item, false)}</div>;
            } else {
              return <div>{me._getDisplay(item, false)}</div>;
            }
          });
        }
        display = (<div>
        <div>{I18N.Setting.Calendar.Name + name}</div>
        <div>{I18N.Setting.Calendar.DefaultDayNight}</div>
        {day}
      </div>);
        break;
    }
    return display;
  },
  render: function() {
    var me = this;
    var calendarDetail = this._renderDetail();
    return (
      <SideNav open={true} ref="calendarDetail" onClose={this.props.onClose} side={this.props.side}>
        <div className="pop-user-filter-side-nav-wrapper">
          <div className="pop-user-filter-side-nav-header sidebar-title">{I18N.Setting.Calendar.CalendarDetail}</div>
        <div className="sidebar-content pop-user-filter-side-nav-content">
          {calendarDetail}
        </div>
      </div>
      </SideNav>
      );
  }
});

let CalendarItem = React.createClass({
  propTypes: {
    index: React.PropTypes.number,
    type: React.PropTypes.number,
    merge: React.PropTypes.func,
    calendarItem: React.PropTypes.object,
    isViewStatus: React.PropTypes.bool,
    allCalendar: React.PropTypes.object,
    deleteCalendarItem: React.PropTypes.func,
    checkWorktime: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      showDetail: false,
      showWorktime: false
    };
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
  _deleteCalendarItem: function() {
    this.props.deleteCalendarItem(this.props.type, this.props.index);
  },
  _checkWorktime: function(e, checked) {
    this.props.checkWorktime(this.props.type, this.props.index, checked);
  },
  _handleCloseDetailSideNav: function() {
    this.setState({
      showDetail: false
    });
  },
  _showDetail: function(showWorktime) {
    this.setState({
      showDetail: true,
      showWorktime: showWorktime
    });
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
          path: "EffectiveTime",
          type: me.props.type,
          index: me.props.index
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
          path: "Calendar",
          type: me.props.type,
          index: me.props.index
        });
      }
    };
    var deleteButton = (this.props.isViewStatus ? null : <FlatButton label={I18N.Common.Button.Delete} onClick={this._deleteCalendarItem} primary={true}/>);
    var showDetailButton = (<FlatButton label={I18N.Setting.Calendar.ViewCalendarDetail} onClick={this._showDetail.bind(this, false)} primary={false}/>);
    var showWorkTimeDetailButton = (<FlatButton label={I18N.Setting.Calendar.ViewCalendarDetail} onClick={this._showDetail.bind(this, true)} primary={false}/>);
    var worktimeDiv = null;
    if (this.props.type === 0) {
      var addWorktimeProps = {
        label: I18N.Setting.Calendar.AddWorkTime,
        checked: this.props.calendarItem.get('WorkTimeCalendar') === null ? false : true,
        onCheck: this._checkWorktime,
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
              path: "WorkTimeCalendar",
              type: me.props.type,
              index: me.props.index
            });
          }
        };
        worktime = <div className='jazz-hierarchy-calendar-type-item-worktime-item'><ViewableDropDownMenu {...worktimeProps}/>{showWorkTimeDetailButton}</div>;
      }
      worktimeDiv = <div className='jazz-hierarchy-calendar-type-item-worktime'>{addWorktime}{worktime}</div>;
    }
    var detailPanel = null;
    var detailProps = {
      type: me.state.showWorktime ? 1 : me.props.type,
      calendar: me.state.showWorktime ? me.props.calendarItem.get('WorkTimeCalendar') : me.props.calendarItem.get('Calendar'),
      onClose: me._handleCloseDetailSideNav,
    };
    if (me.state.showDetail) {
      detailPanel = <CalendarDetail {...detailProps}/>;
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
        {detailPanel}
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
    allCalendar: React.PropTypes.object,
    addCalendarItem: React.PropTypes.func,
    deleteCalendarItem: React.PropTypes.func,
    checkWorktime: React.PropTypes.func
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
  _addCalendarItem: function() {
    this.props.addCalendarItem(this.props.type);
  },
  _deleteCalendarItem: function(type, index) {
    this.props.deleteCalendarItem(type, index);
  },
  _checkWorktime: function(type, index, checked) {
    this.props.checkWorktime(type, index, checked);
  },
  render: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    var calendarItems = me.props.calendarItems;
    var addButton = isView ? null : (<FlatButton label={I18N.Common.Button.Add} onClick={this._addCalendarItem} primary={false}/>);
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
          allCalendar: me.props.allCalendar,
          deleteCalendarItem: me._deleteCalendarItem,
          checkWorktime: me._checkWorktime
        };
        return (
          <CalendarItem {...props}/>
          );
      });
    return (
      <div className='jazz-hierarchy-calendar-type'>
        <div className='jazz-hierarchy-calendar-type-add'>
          <div className='jazz-hierarchy-calendar-type-add-text'>{this.getTextByType()}</div>
          {addButton}
        </div>
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
  _getDefaultCalendarItem: function(type) {
    var allCalendar = this.state.allCalendar;
    let thisYear = new Date().getFullYear();
    var calendar = allCalendar.find(item => (item.get('Type') === type));
    var worktimeCalendar = null;
    if (type === 0) {
      worktimeCalendar = allCalendar.find(item => (item.get('Type') === 1));
    }
    var defaultCalendarItem = Immutable.fromJS({
      Calendar: calendar,
      EffectiveTime: thisYear,
      WorkTimeCalendar: worktimeCalendar
    });
    return defaultCalendarItem;
  },
  _addCalendarItem: function(type) {
    var calendar = this.state.calendar,
      calendarItemGroups = calendar.get('CalendarItemGroups'),
      calendarItemIndex = calendarItemGroups.findIndex(item => (item.get('Type') === type)),
      calendarItemType = calendarItemGroups.get(calendarItemIndex),
      calendarItems = calendarItemType.get('CalendarItems'),
      defaultCalendarItem = this._getDefaultCalendarItem(type);

    if (calendarItems === null) {
      calendarItems = defaultCalendarItem;
    } else {
      calendarItems = calendarItems.unshift(defaultCalendarItem);
    }
    calendarItemType = calendarItemType.set('CalendarItems', calendarItems);
    calendarItemGroups = calendarItemGroups.set(calendarItemIndex, calendarItemType);
    calendar = calendar.set('CalendarItemGroups', calendarItemGroups);
    this.setState({
      calendar: calendar
    });
  },
  _deleteCalendarItem: function(type, index) {
    var calendar = this.state.calendar,
      calendarItemGroups = calendar.get('CalendarItemGroups'),
      calendarItemIndex = calendarItemGroups.findIndex(item => (item.get('Type') === type)),
      calendarItemType = calendarItemGroups.get(calendarItemIndex),
      calendarItems = calendarItemType.get('CalendarItems');
    calendarItems = calendarItems.delete(index);
    calendarItemType = calendarItemType.set('CalendarItems', calendarItems);
    calendarItemGroups = calendarItemGroups.set(calendarItemIndex, calendarItemType);
    calendar = calendar.set('CalendarItemGroups', calendarItemGroups);
    this.setState({
      calendar: calendar
    });
  },
  _checkWorktime: function(type, index, checked) {
    var calendar = this.state.calendar,
      calendarItemGroups = calendar.get('CalendarItemGroups'),
      calendarItemIndex = calendarItemGroups.findIndex(item => (item.get('Type') === type)),
      calendarItemType = calendarItemGroups.get(calendarItemIndex),
      calendarItems = calendarItemType.get('CalendarItems'),
      calendarItem = calendarItems.get(index),
      worktimeCalendar = this.state.allCalendar.find(item => (item.get('Type') === 1));
    if (checked) {
      calendarItem = calendarItem.set('WorkTimeCalendar', worktimeCalendar);
    } else {
      calendarItem = calendarItem.set('WorkTimeCalendar', null);
    }
    calendarItems = calendarItems.set(index, calendarItem);
    calendarItemType = calendarItemType.set('CalendarItems', calendarItems);
    calendarItemGroups = calendarItemGroups.set(calendarItemIndex, calendarItemType);
    calendar = calendar.set('CalendarItemGroups', calendarItemGroups);
    this.setState({
      calendar: calendar
    });
  },
  _merge: function(data) {
    var type = data.type,
      index = data.index,
      path = data.path,
      value = data.value;
    var calendar = this.state.calendar,
      calendarItemGroups = calendar.get('CalendarItemGroups'),
      calendarItemIndex = calendarItemGroups.findIndex(item => (item.get('Type') === type)),
      calendarItemType = calendarItemGroups.get(calendarItemIndex),
      calendarItems = calendarItemType.get('CalendarItems'),
      calendarItem = calendarItems.get(index);
    var selectCalendar = null;
    if (path === 'EffectiveTime') {
      calendarItem = calendarItem.set(path, value);
    } else {
      selectCalendar = this.state.allCalendar.find(item => (item.get('Id') === value));
      calendarItem = calendarItem.set(path, selectCalendar);
    }
    calendarItems = calendarItems.set(index, calendarItem);
    calendarItemType = calendarItemType.set('CalendarItems', calendarItems);
    calendarItemGroups = calendarItemGroups.set(calendarItemIndex, calendarItemType);
    calendar = calendar.set('CalendarItemGroups', calendarItemGroups);
    this.setState({
      calendar: calendar
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
          allCalendar: me.state.allCalendar,
          addCalendarItem: me._addCalendarItem,
          deleteCalendarItem: me._deleteCalendarItem,
          checkWorktime: me._checkWorktime,
          merge: me._merge,
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
