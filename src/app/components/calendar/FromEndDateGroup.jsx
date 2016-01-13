'use strict';

import React from "react";
import FromEndDateItem from '../../controls/FromEndDateItem.jsx';
import CalendarAction from '../../actions/CalendarAction.jsx';
import CalendarStore from '../../stores/CalendarStore.jsx';

var FromEndDateGroup = React.createClass({
  getInitialState: function() {
    return {
      errorTextArr: CalendarStore.getDateErrorText()
    };
  },
  clearErrorText: function() {
    CalendarAction.clearAllDateErrorText();
  },
  _onErrorTextChange: function() {
    this.setState({
      errorTextArr: CalendarStore.getDateErrorText()
    });
  },
  _onDateChange: function(index, data) {
    this.props.onDateChange(index, data);
  },
  _onTypeChange: function(index, value) {
    this.props.onTypeChange(index, value);
  },
  _onDeleteDateData: function(index) {
    this.props.onDeleteDateData(index);
  },
  _setErrorText: function(index, errorText) {
    CalendarAction.setDateErrorText(index, errorText);
  },
  validate: function() {
    var isValid = true;
    var length = this.props.items.size;
    for (var i = 0; i < length; i++) {
      isValid = isValid && this.refs['fromEndDateItem' + (i + 1)].isValid();
    }
    return isValid;
  },
  validateGroup: function() {
    var length = this.props.items.size;
    var currentItem, compItem, i, j;
    var isValid = true;
    this.clearErrorText();
    for (i = 0; i < length; i++) {
      currentItem = this.refs['fromEndDateItem' + (i + 1)];
      for (j = i + 1; j < length; j++) {
        compItem = this.refs['fromEndDateItem' + (j + 1)];
        if (this.checkOverLap(currentItem, compItem)) {
          currentItem.setErrorText(I18N.Common.Label.TimeConflict);
          compItem.setErrorText(I18N.Common.Label.TimeConflict);
          isValid = false;
        }
      }
    }
    return isValid;
  },
  checkOverLap(item, comItem) {
    var value = item.getCompareValue(),
      comValue = comItem.getCompareValue(),
      start = value[0],
      end = value[1],
      comStart = comValue[0],
      comEnd = comValue[1];
    if ((start === -1 && end === -1) || (comStart === -1 && comEnd === -1)) {
      return false;
    } else {
      if ((start === -1 && comStart === -1) || (start === -1 && comEnd === -1) ||
        (end === -1 && comStart === -1) || (end === null && comEnd === -1)) {
        return (start || end) == (comStart || comEnd);
      } else if (start === -1) {
        return (end >= comStart && end <= comEnd);
      } else if (end === -1) {
        return (start >= comStart && start <= comEnd);
      } else if (comStart === -1) {
        return (comEnd >= start && comEnd <= end);
      } else if (comEnd === -1) {
        return (comStart >= start && comStart <= end);
      } else {
        if (start == comStart) {
          return true;
        } else if (start < comStart) {
          return (end >= comStart);
        } else {
          return (comEnd >= start);
        }
      }
    }
  },
  validateColdwarmGroup: function() {
    var me = this,
      length = me.props.items.size,
      item, warmItem, coldItem,
      isValid = true, i, j, wlen, clen,
      warmItemList = [],
      coldItemList = [];
    for (i = 0; i < length; i++) {
      item = this.refs['fromEndDateItem' + (i + 1)];
      if (item.getTypeValue === 4) {
        warmItemList.push(item);
      } else if (item.getTypeValue === 5) {
        coldItemList.push(item);
      }
    }
    for (i = 0, wlen = warmItemList.length; i < wlen; i++) {
      warmItem = warmItemList[i];
      for (j = 0, clen = coldItemList.length; j < clen; j++) {
        coldItem = coldItemList[j];
        if (this.checkConflicts(warmItem, coldItem)) {
          warmItem.setErrorText(I18N.Common.Label.TimeConflict);
          coldItem.setErrorText(I18N.Common.Label.TimeConflict);
          isValid = false;
        }
      }
    }
    return isValid;
  },
  //check warm cold date overlap| in the same month | gap less than 7 days
  checkConflicts: function(warmItem, coldItem) {
    var warmValue = warmItem.getCompareValue(),
      coldValue = coldItem.getCompareValue(),
      ws = warmValue[0],
      we = warmValue[1],
      cs = coldValue[0],
      ce = coldValue[1];

    if ((ws === -1 && we == -1) || (cs === -1 && ce === -1))
      return false; else {
      if ((ws === -1 && cs === -1) || (ws === -1 && ce === -1) ||
        (we === -1 && cs === -1) || (we === -1 && ce === -1)) {
        return this.checkSevenDaysAndSameMonth([[ws || we, cs || ce]]);
      } else if (ws === -1) {
        return ((we >= cs && we <= ce) || this.checkSevenDaysAndSameMonth([[we, cs], [we, ce]]));
      } else if (we === -1) {
        return ((ws >= cs && ws <= ce) || this.checkSevenDaysAndSameMonth([[ws, cs], [ws, ce]]));
      } else if (cs === -1) {
        return ((ce >= ws && ce <= we) || this.checkSevenDaysAndSameMonth([[ce, ws], [ce, we]]));
      } else if (ce === -1) {
        return ((cs >= ws && cs <= we) || this.checkSevenDaysAndSameMonth([[cs, ws], [cs, we]]));
      } else {
        if (this.checkSevenDaysAndSameMonth([[ws, cs], [ws, ce], [we, cs], [we, ce]])) {
          return true;
        } else if (ws < cs) {
          return (we > cs);
        } else {
          return (ce > ws);
        }
      }
    }
  },
  /*
    * warmValue and coldValue are the date like 6.11 -- June 11th
    * format: [[warmValue,coldValue],[warmValue,coldValue],[warmValue,coldValue]]
    */
  checkSevenDaysAndSameMonth: function(pairlist) {
    var warmValue, coldValue, min, max, margin;

    for (var i = 0, len = pairlist.length; i < len; i++) {
      warmValue = pairlist[i][0];
      coldValue = pairlist[i][1];

      // once any pair conflicts, return true
      if (Math.floor(warmValue) == Math.floor(coldValue)) {
        return true;
      } else if (Math.abs(Math.floor(warmValue) - Math.floor(coldValue)) == 1) {
        min = Math.min(warmValue, coldValue);
        max = Math.max(warmValue, coldValue);

        margin = this.getDaysByMonth(Math.floor(min)) - ((min - Math.floor(min)) * 100);
        margin = margin + (max * 100 - Math.floor(max) * 100);
        margin = Math.round(margin);

        if (margin < 7) return true;
      }
    }

    return false;
  },
  getDaysByMonth: function(month) {
    var days;
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12: days = 31;
        break;
      case 2: days = 28;
        break;
      case 4:
      case 6:
      case 9:
      case 11: days = 30;
        break;
    }
    return days;
  },
  isValid: function() {
    var isValid = this.validate();
    isValid = isValid && this.validateGroup();
    if (this.props.type === 2) {
      isValid = isValid && this.validateColdwarmGroup();
    }
    return isValid;
  },
  componentDidMount: function() {
    CalendarStore.addDateErrorTextChangeListener(this._onErrorTextChange);
  },
  componentWillUnmount: function() {
    CalendarStore.removeDateErrorTextChangeListener(this._onErrorTextChange);
  },
  render() {
    let me = this;
    let items = this.props.items;
    var typeItems, typeText;
    if (me.props.type === 0) {
      typeItems = [
        {
          payload: 0,
          text: I18N.Setting.Calendar.WorkDay
        },
        {
          payload: 1,
          text: I18N.Setting.Calendar.Holiday
        }
      ];
      typeText = I18N.Setting.Calendar.DateType;
    } else {
      typeItems = [
        {
          payload: 4,
          text: I18N.Setting.Calendar.WarmSeason
        },
        {
          payload: 5,
          text: I18N.Setting.Calendar.ColdSeason
        }
      ];
      typeText = I18N.Setting.Calendar.SeansonType;
    }
    let dateItems = null;
    if (items && items.size !== 0) {
      dateItems = items.map(function(item, i) {
        let props = {
          index: i,
          key: item.get('Id'),
          id: item.get('Id'),
          ref: 'fromEndDateItem' + (i + 1),
          isViewStatus: me.props.isViewStatus,
          hasDeleteButton: items.size === 1 ? false : true,
          errorText: me.state.errorTextArr.get(i),
          typeValue: item.get('Type'),
          typeItems: typeItems,
          typeText: typeText,
          startMonth: item.get('StartFirstPart'),
          startDay: item.get('StartSecondPart'),
          endMonth: item.get('EndFirstPart'),
          endDay: item.get('EndSecondPart'),
          onDateChange: me._onDateChange,
          onDeleteDateData: me._onDeleteDateData,
          setErrorText: me._setErrorText,
          onTypeChange: me._onTypeChange
        };
        return (
          <FromEndDateItem {...props}></FromEndDateItem>
          );
      });
    }
    return (
      <div>
        {dateItems}
      </div>
      );
  }
});
module.exports = FromEndDateGroup;
