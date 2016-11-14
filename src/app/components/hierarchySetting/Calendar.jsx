'use strict';

import React from "react";
import classnames from "classnames";
import { formStatus } from '../../constants/FormStatus.jsx';
import { Checkbox, CircularProgress } from 'material-ui';
import Immutable from 'immutable';
import { Map, List } from 'immutable';
import HierarchyAction from '../../actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import YearPicker from '../../controls/YearPicker.jsx';
import SideNav from '../../controls/SideNav.jsx';
import Dialog from '../../controls/NewDialog.jsx';

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
          var workdayRight = workdayItems.map((item, i) => {
            return <div className='jazz-hierarchy-calendar-detail-item'>{me._getDisplay(item, true)}</div>;
          });
          workday = (<div className='jazz-hierarchy-calendar-detail'>
          <div className='jazz-hierarchy-calendar-detail-item'>{I18N.Setting.Calendar.WorkDayTitle}</div>
          <div>{workdayRight}</div>
        </div>);
        }
        if (holidayItems && holidayItems.size > 0) {
          var holidayRight = holidayItems.map((item, i) => {
            return <div className='jazz-hierarchy-calendar-detail-item'>{me._getDisplay(item, true)}</div>;
          });
          holiday = (<div className='jazz-hierarchy-calendar-detail'>
          <div className='jazz-hierarchy-calendar-detail-item'>{I18N.Setting.Calendar.HolidayTitle}</div>
          <div>{holidayRight}</div>
        </div>);
        }

        display = (<div>
          <div className='jazz-hierarchy-calendar-detail-item'>{I18N.Setting.Calendar.HolidayCalendar + name}</div>
          <div className='jazz-hierarchy-calendar-detail-item'>{I18N.Setting.Calendar.DefaultWorkDay}</div>
          {workday}
          {holiday}
        </div>);
        break;
      case 1:
        var worktimeItems = Items.filter(item => (item.get('Type') === 2));
        var worktime = null;
        if (worktimeItems && worktimeItems.size > 0) {
          var worktimeRight = worktimeItems.map((item, i) => {
            return <div className='jazz-hierarchy-calendar-detail-item'>{me._getDisplay(item, false)}</div>;
          });
          worktime = (<div className='jazz-hierarchy-calendar-detail'>
          <div className='jazz-hierarchy-calendar-detail-item'>{I18N.Setting.Calendar.WorkTimeTitle}</div>
          <div>{worktimeRight}</div>
        </div>);
        }
        display = (<div>
        <div className='jazz-hierarchy-calendar-detail-item'>{I18N.Setting.Calendar.WorkTimeCalendar + name}</div>
        <div className='jazz-hierarchy-calendar-detail-item'>{I18N.Setting.Calendar.DefaultWorkTime}</div>
        {worktime}
      </div>);
        break;
      case 2:
        var warmItems = Items.filter(item => (item.get('Type') === 4)),
          coldItems = Items.filter(item => (item.get('Type') === 5));
        var warm = null,
          cold = null;
        if (warmItems && warmItems.size > 0) {
          var warmRight = warmItems.map((item, i) => {
            return <div className='jazz-hierarchy-calendar-detail-item'>{me._getDisplay(item, true)}</div>;
          });
          warm = (<div className='jazz-hierarchy-calendar-detail'>
          <div className='jazz-hierarchy-calendar-detail-item'>{I18N.Setting.Calendar.WarmTitle}</div>
          <div>{warmRight}</div>
        </div>);
        }
        if (coldItems && coldItems.size > 0) {
          var coldRight = coldItems.map((item, i) => {
            return <div className='jazz-hierarchy-calendar-detail-item'>{me._getDisplay(item, true)}</div>;
          });
          cold = (<div className='jazz-hierarchy-calendar-detail'>
          <div className='jazz-hierarchy-calendar-detail-item'>{I18N.Setting.Calendar.ColdTitle}</div>
          <div>{coldRight}</div>
        </div>);
        }

        display = (<div>
          <div className='jazz-hierarchy-calendar-detail-item'>{I18N.Setting.Calendar.WramCalendar + name}</div>
          {warm}
          {cold}
        </div>);
        break;
      case 3:
        var dayItems = Items.filter(item => (item.get('Type') === 6));
        var day = null;
        if (dayItems && dayItems.size > 0) {
          var dayRight = dayItems.map((item, i) => {
            return <div className='jazz-hierarchy-calendar-detail-item'>{me._getDisplay(item, false)}</div>;
          });
          day = (<div className='jazz-hierarchy-calendar-detail'>
          <div className='jazz-hierarchy-calendar-detail-item'>{I18N.Setting.Calendar.DayTitle}</div>
          <div>{dayRight}</div>
        </div>);
        }
        display = (<div>
        <div className='jazz-hierarchy-calendar-detail-item'>{I18N.Setting.Calendar.NightCalendar + name}</div>
        <div className='jazz-hierarchy-calendar-detail-item'>{I18N.Setting.Calendar.DefaultDayNight}</div>
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
    checkWorktime: React.PropTypes.func,
    errorText: React.PropTypes.string
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
        <div className='jazz-hierarchy-calendar-type-item-error'>{this.props.errorText}</div>
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
    calendarItems: React.PropTypes.object,
    isViewStatus: React.PropTypes.bool,
    allCalendar: React.PropTypes.object,
    addCalendarItem: React.PropTypes.func,
    deleteCalendarItem: React.PropTypes.func,
    checkWorktime: React.PropTypes.func
  },
  getInitialState: function() {
    var errorTextArr = this._getInitError();
    return ({
      errorTextArr: errorTextArr
    });
  },
  _getInitError: function() {
    var errorTextArr = [];
    var calendarItems = this.props.calendarItems;
    if (calendarItems && calendarItems.size > 0) {
      for (var i = 0; i < calendarItems.size; i++) {
        errorTextArr.push('');
      }
    }
    return errorTextArr;
  },
  _isValid: function() {
    var i;
    var calendarItems = this.props.calendarItems;
    if (calendarItems === null) {
      return true;
    }
    var errorTextArr = this._getInitError();
    var length = calendarItems.size;
    var itemsIsValid = true;

    for (i = 0; i < length; i++) {
      for (var j = (i + 1); j < length; j++) {
        if (parseInt(calendarItems.getIn([i, 'EffectiveTime'])) === parseInt(calendarItems.getIn([j, 'EffectiveTime']))) {
          errorTextArr[i] = I18N.Common.Label.TimeZoneConflict;
          errorTextArr[j] = I18N.Common.Label.TimeZoneConflict;
          itemsIsValid = false;
        }
      }
    }
    this.setState({
      errorTextArr: errorTextArr
    });
    return itemsIsValid;
  },
  _getTextByType: function() {
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
    var hasCalendar = (calendarItems && calendarItems.size > 0) ? true : false;
    var addDom = null,
      calendar = null;
    if (!isView || hasCalendar) {
      addDom = (<div className='jazz-hierarchy-calendar-type-add'>
        <div className='jazz-hierarchy-calendar-type-add-text'>{this._getTextByType()}</div>
        {addButton}
      </div>);
    }
    if (hasCalendar) {
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
          checkWorktime: me._checkWorktime,
          errorText: me.state.errorTextArr[i]
        };
        return (
          <CalendarItem {...props}/>
          );
      });
    }
    var error = this.state.errorText === '' ? null : (<div className='jazz-hierarchy-calendar-type-error'>{this.state.errorText}</div>);
    return (
      <div className='jazz-hierarchy-calendar-type'>
        {addDom}
        {calendar}
        {error}
      </div>

      );
  }
});

var Calendar = React.createClass({
  propTypes: {
    hierarchyId: React.PropTypes.number,
    formStatus: React.PropTypes.string,
    setEditBtnStatus: React.PropTypes.func
  },
  getInitialState: function() {
    return ({
      allCalendar: null,
      calendar: null,
      isLoading: true,
      errorShow:false,
      errorType:null
    });
  },
  _onChange: function() {
    this.setState({
      calendar: HierarchyStore.getCalendar(),
      allCalendar: HierarchyStore.getAllCalendar(),
      isLoading: false
    }, () => {
      var isValid = this._isValid();
      this.props.setEditBtnStatus(!isValid);
    });
  },
  _handlerSave: function() {
    this.setState({
      isLoading: true
    });
    return this.state.calendar.toJS();
  },
  _isValid: function(checked) {
    var calendar = this.state.calendar;
    var allCalendar = this.state.allCalendar;
    var calendarIndex;
    var i;

    var calendarItemGroups = calendar.get('CalendarItemGroups');
    for (i = 0; i < calendarItemGroups.size; i++) {
      if (this.refs['calendarItems' + (i + 1)] && !this.refs['calendarItems' + (i + 1)]._isValid()) {
        return false;
      }
    }
    if (calendarItemGroups.getIn([0, 'CalendarItems']) !== null) {
      calendarIndex = allCalendar.findIndex(item => (item.get('Type') === 0));
      if (calendarIndex === -1) {
        return false;
      }
      if (checked) {
        calendarIndex = allCalendar.findIndex(item => (item.get('Type') === 1));
        if (calendarIndex === -1) {
          return false;
        }
      }
    }
    if (calendarItemGroups.getIn([1, 'CalendarItems']) !== null) {
      calendarIndex = allCalendar.findIndex(item => (item.get('Type') === 2));
      if (calendarIndex === -1) {
        return false;
      }
    }
    if (calendarItemGroups.getIn([2, 'CalendarItems']) !== null) {
      calendarIndex = allCalendar.findIndex(item => (item.get('Type') === 3));
      if (calendarIndex === -1) {
        return false;
      }
    }
    return true;


  },
  _getDefaultCalendarItem: function(type) {
    var allCalendar = this.state.allCalendar;
    let thisYear = new Date().getFullYear();
    var calendar = allCalendar.find(item => (item.get('Type') === type));
    var defaultCalendarItem = Immutable.fromJS({
      Calendar: calendar,
      EffectiveTime: thisYear,
      WorkTimeCalendar: null
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
    if(!defaultCalendarItem.get("Calendar")){
      this.setState({
        errorShow:true,
        errorType:type
      })
      return;
    }
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
      var isValid = this._isValid(checked);
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
  _renderErrorDialog: function() {
    var onClose = ()=>{
      this.setState({
        errorShow: false,
        errorType: null,
      });
    };
    var content=null;
    if(this.state.errorType===0){
      content=I18N.format(I18N.Setting.Calendar.ErrorMsg,I18N.Setting.Calendar.WorkdaySetting)
    }
    else {
      content=this.state.errorType===2?I18N.format(I18N.Setting.Calendar.ErrorMsg,I18N.Setting.Calendar.ColdwarmSetting):
      I18N.format(I18N.Setting.Calendar.ErrorMsg,I18N.Setting.Calendar.DaynightSetting);
    }
    if (!!this.state.errorShow) {
      return (<Dialog
        ref = "_dialog"
        title={I18N.Platform.ServiceProvider.ErrorNotice}
        modal={false}
        open={!!this.state.errorShow}
        onRequestClose={onClose}
        >
        {content}
      </Dialog>)
    } else {
      return null;
    }
  },
  _renderDetail: function() {
    var me = this;
    var isView = this.props.formStatus === formStatus.VIEW;
    if (me.state.isLoading) {
      return (<div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center'
        }}><CircularProgress  mode="indeterminate" size={80} /></div>);
    } else {
      var calendarItemGroups = this.state.calendar.get('CalendarItemGroups');
      var calendar = null;
      if (isView && calendarItemGroups.getIn([0, 'CalendarItems']) === null && calendarItemGroups.getIn([1, 'CalendarItems']) === null && calendarItemGroups.getIn([2, 'CalendarItems']) === null) {
        calendar = <div style={{
          color: '#464949',
          fontSize: '14px'
        }}>{I18N.Setting.Calendar.AddCalendarInfo}</div>;
      } else {
        calendar = calendarItemGroups.map((item, i) => {
          let props = {
            key: i,
            ref: 'calendarItems' + (i + 1),
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
  componentWillMount: function() {
    HierarchyAction.getAllCalendar();
    HierarchyAction.getCalendar(this.props.hierarchyId);
  },
  componentDidMount: function() {
    HierarchyStore.addCalendarChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    HierarchyStore.removeCalendarChangeListener(this._onChange);
  },
  render: function() {
    return (
      <div className="pop-manage-detail-content" style={{
        display: 'flex'
      }}>
        {this._renderDetail()}
        {this._renderErrorDialog()}
      </div>
      );

  },
});
module.exports = Calendar;
