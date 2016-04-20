'use strict';

import React from "react";
import classnames from "classnames";
import { formStatus } from '../../constants/FormStatus.jsx';
import { Checkbox } from 'material-ui';
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
    calendarItem: React.PropTypes.object,
    isViewStatus: React.PropTypes.bool,
    allCalendar: React.PropTypes.object
  },
  render: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    let date = new Date();
    var effectiveTimeProps = {
      ref: "effectiveTime",
      isViewStatus: isView,
      yearRange: date.getFullYear() - 2006,
      title: I18N.Setting.Tag.Code,
      selectedYear: this.props.calendarItem.get('EffectiveTime'),
      onYearPickerSelected: value => {
        this.props.mergeTag({
          value,
          path: "EffectiveTime"
        });
      }
    };
    var nameProps = {
      ref: 'name',
      isViewStatus: isView,
      title: I18N.Setting.Tag.Code,
      defaultValue: this.props.calendarItem.get('Calendar').get('Id'),
      dataItems: me._getCalendarNameItems(),
      didChanged: value => {
        me.props.mergeTag({
          value,
          path: "Calendar"
        });
      }
    };
    var deleteButton = (this.props.isViewStatus ? null : <FlatButton label={I18N.Common.Button.Delete} onClick={this._deleteCalendarItem} primary={true}/>);
    var showDetailButton = (<FlatButton label={I18N.Common.Button.Delete} onClick={this._showDetail} primary={false}/>);
    var worktimeDiv = null;
    if (this.props.type === 0) {
      var addWorktimeProps = {
        label: I18N.Commodity.Overview,
        checked: this.props.calendarItem.get('WorkTimeCalendar') === null ? false : true,
        onCheck: this.checkWorktime,
        disabled: isView
      };
      var addWorktime = (<Checkbox {...addWorktimeProps}/>);
      var worktime = null;
      if (this.props.calendarItem.get('WorkTimeCalendar') !== null) {
        var worktimeProps = {
          ref: 'worktime',
          isViewStatus: isView,
          title: I18N.Setting.Tag.Code,
          defaultValue: this.props.calendarItem.get('WorkTimeCalendar').get('Id'),
          dataItems: me._getWorktimeItems(),
          didChanged: value => {
            me.props.mergeTag({
              value,
              path: "WorkTimeCalendar"
            });
          }
        };
        worktime = <ViewableDropDownMenu {...worktimeProps}/>;
      }
      worktimeDiv = <div classname='jazz-hierarchy-calendar-item-worktime'>{addWorktime}{worktime}</div>;
    }
    return (
      <div className='jazz-hierarchy-calendar-item'>
        <div classname='jazz-hierarchy-calendar-item-time'>
          <YearPicker {...effectiveTimeProps}/>
          {deleteButton}
        </div>
        <div classname='jazz-hierarchy-calendar-item-name'>
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
    calendarItems: React.PropTypes.array,
    isViewStatus: React.PropTypes.bool,
    allCalendar: React.PropTypes.object
  },
  render: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    var calendarItems = me.props.calendarItems;
    var addButton = (<FlatButton label={I18N.Common.Button.Add} onClick={this._addCalendarItem} primary={false}/>);
    var calendar = null;
    if (calendarItems && calendarItems.length > 0)
      calendar = calendarItems.map((item, i) => {
        let props = {
          key: i,
          index: i,
          type: me.props.type,
          calendarItem: item,
          isViewStatus: isView,
          allCalendar: me.props.allCalendar
        };
        return (
          <CalendarItem {...props}/>
          );
      });
    return (
      <div className='jazz-hierarchy-calendar-item'>
        <div classname='jazz-hierarchy-calendar-item-add'>
          {this.getTextByType()}
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
    var calendar = calendarItemGroups.map((item, i) => {
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
    return (
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
