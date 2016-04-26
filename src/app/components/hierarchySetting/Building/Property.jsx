'use strict';

import React from "react";
import classnames from "classnames";
import { formStatus } from '../../../constants/FormStatus.jsx';
import { CircularProgress } from 'material-ui';
import Immutable from 'immutable';
import { Map, List } from 'immutable';
import HierarchyAction from '../../../actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyStore from '../../../stores/hierarchySetting/HierarchyStore.jsx';
import ViewableNumberField from '../../../controls/ViewableNumberField.jsx';
import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';


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
    setEditBtnStatus: React.PropTypes.func
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
    }, () => {
      var isValid = this._isValid();
      this.props.setEditBtnStatus(!isValid);
    });
  },
  _handlerSave: function() {
    return this.state.calendar.toJS();
  },
  _isValid: function() {
    var calendar = this.state.calendar;
    var allCalendar = this.state.allCalendar;
    if (calendar === null || allCalendar === null) {
      return false;
    } else {
      var calendarItemGroups = calendar.get('CalendarItemGroups');
      if (calendarItemGroups.getIn([0, 'CalendarItems']) === null && calendarItemGroups.getIn([1, 'CalendarItems']) === null && calendarItemGroups.getIn([2, 'CalendarItems']) === null) {
        return false;
      }
      if (calendarItemGroups.getIn([0, 'CalendarItems']) !== null) {
        var workdayItem = this._getDefaultCalendarItem(0);
        if (workdayItem.get('Calendar') === undefined) {
          return false;
        }
        var calendarItems = calendarItemGroups.getIn([0, 'CalendarItems']);
        for (var i = 0; i < calendarItems.size; i++) {
          if (calendarItems.getIn([i, 'WorkTimeCalendar']) === undefined) {
            return false;
          }
        }
      }
      if (calendarItemGroups.getIn([2, 'CalendarItems']) !== null) {
        var coldwormItem = this._getDefaultCalendarItem(2);
        if (coldwormItem.get('Calendar') === undefined) {
          return false;
        }
      }
      if (calendarItemGroups.getIn([3, 'CalendarItems']) !== null) {
        var daynightItem = this._getDefaultCalendarItem(3);
        if (daynightItem.get('Calendar') === undefined) {
          return false;
        }
      }
      return true;
    }

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
    var emptyList = new List();

    if (calendarItems === null) {
      calendarItems = emptyList.push(defaultCalendarItem);
    } else {
      calendarItems = calendarItems.unshift(defaultCalendarItem);
    }
    calendarItemType = calendarItemType.set('CalendarItems', calendarItems);
    calendarItemGroups = calendarItemGroups.set(calendarItemIndex, calendarItemType);
    calendar = calendar.set('CalendarItemGroups', calendarItemGroups);
    this.setState({
      calendar: calendar
    }, () => {
      var isValid = this._isValid();
      this.props.setEditBtnStatus(!isValid);
    });
  },
  _deleteCalendarItem: function(type, index) {
    var calendar = this.state.calendar,
      calendarItemGroups = calendar.get('CalendarItemGroups'),
      calendarItemIndex = calendarItemGroups.findIndex(item => (item.get('Type') === type)),
      calendarItemType = calendarItemGroups.get(calendarItemIndex),
      calendarItems = calendarItemType.get('CalendarItems');
    calendarItems = calendarItems.delete(index);
    if (calendarItems.size === 0) {
      calendarItems = null;
    }
    calendarItemType = calendarItemType.set('CalendarItems', calendarItems);
    calendarItemGroups = calendarItemGroups.set(calendarItemIndex, calendarItemType);
    calendar = calendar.set('CalendarItemGroups', calendarItemGroups);
    this.setState({
      calendar: calendar
    }, () => {
      var isValid = this._isValid();
      this.props.setEditBtnStatus(!isValid);
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
    }, () => {
      var isValid = this._isValid();
      this.props.setEditBtnStatus(!isValid);
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
    }, () => {
      var isValid = this._isValid();
      this.props.setEditBtnStatus(!isValid);
    });
  },
  _renderDetail: function() {
    var me = this;
    var isView = this.props.formStatus === formStatus.VIEW;
    if (me.state.isLoading) {
      return (<div className='jazz-calendar-loading'><div style={{
          margin: 'auto',
          width: '100px'
        }}><CircularProgress  mode="indeterminate" size={2} /></div></div>);
    } else {
      var calendarItemGroups = this.state.calendar.get('CalendarItemGroups');
      var calendar = null;
      if (isView && calendarItemGroups.getIn([0, 'CalendarItems']) === null && calendarItemGroups.getIn([1, 'CalendarItems']) === null && calendarItemGroups.getIn([2, 'CalendarItems']) === null) {
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
      return (
        <div>
          <div className={"pop-customer-detail-content"}>
          <div className="pop-customer-detail-content-left">
            {calendar}
          </div>
        </div>
        </div>
        );
    }
  },
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
