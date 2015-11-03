'use strict';
import React from "react";
import Immutable from 'immutable';
import CommonFuns from '../../util/Util.jsx';
import GlobalErrorMessageAction from '../../actions/GlobalErrorMessageAction.jsx';

let CalendarManager = {
  items: ['work', 'hc'],
  init(type, step, data, cmp, timeRange) {
    this.data = data;
    this.calendarIds = [];
    var j2d = CommonFuns.DataConverter.JsonToDateTime;
    this.startTime = j2d(timeRange[0].StartTime, true);
    this.endTime = j2d(timeRange[0].EndTime, true);
    if (type != 'line' && type != 'column' && type != 'stack') {
      if (this.items) {
        this.setItemsStatus([], this.items);
      }
      this.calendarShowType = '';
      this.step = step;
      return;
    } else {
      this.setItemsStatus(this.items, []);
      this.checkStep(step, data);
      this.step = step;
      this.setStateByStep(step);
      if (this.calendarShowType) {
        this.showCalendar(cmp, this.calendarShowType);
      } else {

      }
    }
  },
  getShowType: function() {
    return this.calendarShowType;
  },
  resetShowType: function() {
    this.calendarShowType = '';
  },
  setItemsStatus(enableItems, disableItems) {
    this.enableItems = enableItems;
    this.disableItems = disableItems;
  },
  checkStep: function(step, data) {
    if (this.step && this.step != step) {
      if (this.calendarShowType !== '') {
        var clearCalendar;
        if (this.calendarShowType == 'hc') {
          if (step == 4) { //hc is not supported by year
            clearCalendar = true;
          } else {
            clearCalendar = false;
          }
        } else {
          if (step === 0 || step === 1 || step === 2) { //work is supported by day & hour
            clearCalendar = false;
          } else {
            clearCalendar = true;
          }
        }
        if (clearCalendar) {
          var calendarType = ['work', 'hc'];
          var type = '';
          if (this.calendarShowType == 'work') {
            type = I18N.Common.Button.Calendar.ShowHoliday;
          } else if (this.calendarShowType == 'hc') {
            type = I18N.Common.Button.Calendar.ShowHC;
          }
          if (type) {
            //当前步长不支持显示XXXXXX（日历背景色选项）背景色
            var msg = I18N.EM.CannotShowCalendarByStep.replace('{0}', type);
            GlobalErrorMessageAction.fireGlobalErrorMessage(msg);
          }
          this.calendarShowType = '';
        }
      }
    }
    return true;
  },
  setStateByStep: function(step) {
    if (this.items) {
      switch (step) {
        case 1: //hour
        case 2: //day
          this.setItemsStatus(this.items, []);
          break;
        case 5: //week
        case 3: //month
          this.setItemsStatus([this.items[1]], [this.items[0]]);
          break;
        case 4: //year
          this.setItemsStatus([], this.items);
          break;
      }
    }
  },
  showCalendar: function(cmp, type) {
    this.calendarShowType = type;
    if (cmp && cmp.showCalendar) {
      if (!this.data) {
        GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.EM.CannotShowCalendarByTimeRange);
        return;
      }
      var range = this.getTimeRange(this.step, type, this.data);
      range = this.convertData(range);
      var isShowMsg = true;
      if (range.length === 0 && type !== '') {
        isShowMsg = false;
        GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.EM.CannotShowCalendarByTimeRange);
      }
      cmp.showCalendar(range);
      if (isShowMsg) {
        //#2607
        for (var i = 0; i < range.length; ++i) {
          var r = range[i];
          if (r.from >= this.startTime && r.from < this.endTime) {
            isShowMsg = false;
            break;
          }
          if (r.to <= this.endTime && r.to > this.startTime) {
            isShowMsg = false;
            break;
          }
          if (r.from <= this.startTime && r.to >= this.endTime) {
            isShowMsg = false;
            break;
          }
        }
        if (isShowMsg) {
          GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.EM.CannotShowCalendarByTimeRange);
        }
      }
    }
  },
  hideCalendar: function(cmp) {
    if (cmp && cmp.hideCalendar) {
      cmp.hideCalendar(this.calendarIds);
    }
    this.calendarShowType = '';
  },
  getTimeRange: function(step, type, range) {
    var ret;
    if (!range) return [];
    if (type == 'hc') {
      if (step != 4) {
        ret = range.filter((item) => {
          return item.CalendarType == 4 || item.CalendarType == 5;
        });
      } else {
        ret = [];
      }
    } else {
      switch (step) {
        case 0: //raw time
        case 1: //hour
          ret = range.filter(item => {
            return item.CalendarType == 3;
          });
          break;
        case 2: //day
          ret = range.filter(item => {
            return item.CalendarType == 1;
          });
          break;
        case 5: //week
        case 3: //month
        case 4: //year
          ret = [];
          break;
      }
    }

    return ret || [];
  },
  convertData: function(range) {
    var color = {
      1: '#eaeaea',
      3: '#eaeaea',
      4: '#fcf0e4',
      5: '#e3f0ff'
    };
    var text = {
      1: I18N.Setting.Calendar.Holiday,
      3: I18N.Common.Button.Calendar.ShowHoliday,
      4: I18N.Setting.Calendar.WarmSeason,
      5: I18N.Setting.Calendar.ColdSeason
    };
    var cal = range;
    var j2d = CommonFuns.DataConverter.JsonToDateTime;
    var ret = [];
    for (var i = 0; i < cal.length; ++i) {
      var c = cal[i];
      var times = c.CalendarTimeRanges;
      if (!times) continue;
      var t = c.CalendarType;
      for (var j = 0; j < times.length; j++) {
        var one = times[j];
        var start = j2d(one.StartTime);
        var end = j2d(one.EndTime);
        if (start == end) continue;
        //#2608 when step is hour ,filter calendar by time
        if (this.step == 1) {
          if (end <= this.startTime) continue;
          if (start >= this.endTime) continue;
        }
        var id = 'plot' + t + j;
        var obj = {
          from: start,
          to: end,
          color: color[t],
          id: id,
          label: {
            text: text[t],
            align: 'left',
            verticalAlign: 'top',
            y: 12
          }
        };

        ret.push(obj);

        this.calendarIds.push(id);
      }
    }

    return ret;
  }
};

module.exports = CalendarManager;
