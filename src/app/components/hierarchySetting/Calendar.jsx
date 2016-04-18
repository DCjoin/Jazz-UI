'use strict';

import React from "react";
import classnames from "classnames";
import { formStatus } from '../../constants/FormStatus.jsx';
import { Checkbox } from 'material-ui';
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

var Calendar = React.createClass({
  propTypes: {
    hierarchyId: React.PropTypes.number,
    merge: React.PropTypes.func,
    formStatus: React.PropTypes.string,
  },
  _renderDetail: function() {
    return (
      <div>
        <div className={"pop-customer-detail-content"}>
        <div className="pop-customer-detail-content-left">


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
