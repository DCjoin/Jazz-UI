'use strict';

import PopAppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../../util/Util.jsx';
import { Action } from '../../constants/actionType/Energy.jsx';

const _relativeTypes = ['Customerize', 'Last7Day', 'Last30Day', 'Last12Month', 'Today', 'Yesterday',
  'ThisWeek', 'LastWeek', 'ThisMonth', 'LastMonth', 'ThisYear', 'LastYear'];

let _relativeList = null,
  _originalType = null, //原始时间的相对时间类型
  _uomString = null,
  _tempRelativeList = null;

let MultipleTimespanStore = assign({}, PrototypeStore, {
  clearMultiTimespan(dateType) {
    if (dateType === 'both') {
      _relativeList = null;
      _tempRelativeList = null;
    } else if (dateType === 'mainDate') {
      _relativeList = null;
    } else {
      _tempRelativeList = null;
    }

  },
  initData(originalType, startDate, endDate) {
    let me = this;
    _originalType = originalType;

    if (_relativeList === null || _relativeList.size === 0 || _relativeList.size === 1) {
      _relativeList = Immutable.List([]);
      _relativeList = _relativeList.push(me.generateTimespanItem(true, originalType, null, startDate, endDate, null));
      _relativeList = _relativeList.push(me.generateTimespanItem(false, originalType, null, null, null, 1));

    } else if (this.isOriginalDateChanged(_relativeList, originalType, startDate, endDate)) {
      let mainItem = _relativeList.get(0),
        dateInterval = startDate.getTime() - mainItem.get('startDate').getTime(),
        dateSpan = endDate.getTime() - startDate.getTime();
      let newRelativeList = Immutable.List([]);
      newRelativeList = newRelativeList.push(me.generateTimespanItem(true, originalType, null, startDate, endDate, null));

      _relativeList.forEach((item, index) => {
        if (index !== 0) {
          let startDate = new Date(item.get('startDate').getTime() + dateInterval),
            endDate = new Date(startDate.getTime() + dateSpan);

          let newItem = me.generateTimespanItem(false, 'Customerize', null, startDate, endDate, index);
          newRelativeList = newRelativeList.push(newItem);
        }
      });
      _relativeList = newRelativeList;
    }
  },
  generateTimespanItem(isOriginalDate, relativeType, relativeValue, startDate, endDate, compareIndex) {
    let item = {
      isOriginalDate: isOriginalDate,
      relativeType: relativeType,
      relativeValue: relativeValue,
      startDate: startDate,
      endDate: endDate,
      dateDescription: null
    };
    if (isOriginalDate) {
      item.title = '原始时间';
    } else {
      item.title = '对比时间段' + compareIndex;
      item.compareIndex = compareIndex;

      if (relativeType !== 'Customerize') {
        let defaultRelativeValue = relativeValue || 1;
        item.relativeValue = defaultRelativeValue;

        let timeregion = this.getDateByRelativeTypeAndValue(relativeType, defaultRelativeValue);
        let start = timeregion.start;
        let end = timeregion.end;

        let dateDescription = this._getDateDescription(start, end);

        item.startDate = start;
        item.endDate = end;
        item.dateDescription = dateDescription;
      }
    }
    return Immutable.fromJS(item);
  },
  getMainDateRange() {
    let dateRange;
    if (_tempRelativeList === null || _tempRelativeList.size === 0) {
      if (_relativeList === null || _relativeList.size === 0) {
        dateRange = null;
      } else {
        let mainItem = _relativeList.get(0);
        dateRange = [mainItem.get('startDate'), mainItem.get('endDate')];
      }
    } else {
      let mainItem = _tempRelativeList.get(0);
      dateRange = [mainItem.get('startDate'), mainItem.get('endDate')];
    }

    return dateRange;
  },
  getDateByRelativeTypeAndValue: function(relativeType, relativeValue) {
    let mainItem = (_tempRelativeList || _relativeList).get(0),
      mainStart = mainItem.get('startDate'),
      marinEnd = mainItem.get('endDate'),
      dateAdd = CommonFuns.dateAdd,
      num = relativeValue,
      start, end;

    switch (relativeType) {
      case 'Customerize':
        break;
      case 'Today':
      case 'Yesterday':
        start = dateAdd(mainStart, -1 * num, 'days');
        end = dateAdd(marinEnd, -1 * num, 'days');
        break;
      case 'ThisWeek':
      case 'LastWeek':
      case 'Last7Day':
        start = dateAdd(mainStart, -7 * num, 'days');
        end = dateAdd(marinEnd, -7 * num, 'days');
        break;
      case 'ThisMonth':
      case 'LastMonth':
        start = dateAdd(mainStart, -1 * num, 'months');
        end = dateAdd(marinEnd, -1 * num, 'months');
        break;
      case 'Last30Day':
        start = dateAdd(mainStart, -30 * num, 'days');
        end = dateAdd(marinEnd, -30 * num, 'days');
        break;
      case 'ThisYear':
      case 'LastYear':
      case 'Last12Month':
        start = dateAdd(mainStart, -12 * num, 'months');
        end = dateAdd(marinEnd, -12 * num, 'months');
        break;
    }
    return {
      start: start,
      end: end
    };
  },
  _getDateDescription(startDate, endDate) {
    let ft = I18N.DateTimeFormat.IntervalFormat, str,
      dateAdd = CommonFuns.dateAdd,
      dateFormat = CommonFuns.dateFormat,
      tempEnd = dateAdd(endDate, -1, 'days');
    str = dateFormat(startDate, ft.FullDay) + ' 到 ' + dateFormat(tempEnd, ft.FullDay);
    return str;
  },
  _initTempRelativeList() {
    if (_tempRelativeList === null) {
      _tempRelativeList = _relativeList;
    }
  },
  addNewCompareDate() {
    let me = this;
    me._initTempRelativeList();
    if (_tempRelativeList.size < 5)
      _tempRelativeList = _tempRelativeList.push(me.generateTimespanItem(false, _originalType, null, null, null, _tempRelativeList.size));
  },
  removeCompareDate(compareIndex, confirm) {
    let me = this;
    me._initTempRelativeList();

    _tempRelativeList = _tempRelativeList.delete(compareIndex);
    _tempRelativeList.forEach((item, index) => {
      if (index !== 0) {
        _tempRelativeList = _tempRelativeList.setIn([index, 'compareIndex'], index);
        _tempRelativeList = _tempRelativeList.setIn([index, 'title'], '对比时间段' + index);
      //item.compareIndex = index;
      //item.title = '对比时间段' + index;
      }
    });
    if (!!confirm) {
      this.convert2Stable();
    }
  },
  isOriginalDateChanged(relativeList, originalType, startDate, endDate) {
    let mainItem = relativeList.get(0);
    let ischanged = false;

    if (mainItem.get('relativeType') !== originalType) {
      ischanged = true;
    } else if (originalType === 'Customerize' &&
      (mainItem.get('startDate').getTime() !== startDate.getTime() || mainItem.get('endDate').getTime() !== endDate.getTime())) {
      ischanged = true;
    }
    return ischanged;
  },
  getRelativeTypes() {
    return _relativeTypes;
  },
  getRelativeItems() {
    let menuItems = _relativeTypes.map((type) => {
      return {
        value: type,
        text: I18N.Common.DateRange[type]
      };
    });
    return menuItems;
  },
  getCompareMenuItems() {
    if (_originalType === 'Customerize')
      return [{
        value: 'Customerize',
        text: I18N.Common.DateRange.Customerize
      }]; else {
      return [{
        value: 'Customerize',
        text: I18N.Common.DateRange.Customerize
      }, {
        value: _originalType,
        text: '相对时间'
      }];
    }
  },
  getCustomerizeType() {
    return 'Customerize';
  },
  getRelativeList() {
    return (_tempRelativeList ? _tempRelativeList.toJS() : _relativeList.toJS());
  },
  getOriginalType() {
    return _originalType;
  },
  getAvailableRelativeValues: function(originalType) {
    var offsetMenuItems = [];
    var offsetTopValue = 0;
    switch (originalType) {
      case 'Customerize':
        break;
      case 'Today':
      case 'Yesterday':
        offsetTopValue = 31;
        break;
      case 'ThisWeek':
      case 'LastWeek':
        offsetTopValue = 10;
        break;
      case 'ThisMonth':
      case 'LastMonth':
        offsetTopValue = 24;
        break;
      case 'Last30Day':
        offsetTopValue = 24;
        break;
      case 'ThisYear':
      case 'LastYear':
        offsetTopValue = 10;
        break;
      case 'Last12Month':
        offsetTopValue = 10;
        break;
      case 'Last7Day':
        offsetTopValue = 10;
        break;
      default: break;
    }
    for (let i = 1; i <= offsetTopValue; i++) {
      offsetMenuItems.push(i);
    }
    return offsetMenuItems;
  },
  getRelativeUOM(originalType) {
    let uomLabel;
    switch (originalType) {
      case 'Customerize':
        uomLabel = '';
        break;
      case 'Today':
      case 'Yesterday':
        uomLabel = I18N.EM.Day;
        break;
      case 'ThisWeek':
      case 'LastWeek':
        uomLabel = I18N.EM.Week;
        break;
      case 'ThisMonth':
      case 'LastMonth':
        uomLabel = I18N.EM.Month;
        break;
      case 'Last30Day':
        uomLabel = I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious30Day;
        break;
      case 'ThisYear':
      case 'LastYear':
        uomLabel = I18N.EM.Year;
        break;
      case 'Last12Month':
        uomLabel = I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious12Month;
        break;
      case 'Last7Day': uomLabel = I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious7Day;
        break;
    }
    return uomLabel;
  },
  handleRelativeTypeChange(isOriginalDate, relativeType, compareIndex) {
    let me = this;
    me._initTempRelativeList();

    if (isOriginalDate) {
      _originalType = relativeType;
      if (relativeType === 'Customerize') {
        let mainItem = _tempRelativeList.get(0);
        mainItem = mainItem.set('relativeType', relativeType);
        _tempRelativeList = Immutable.List([]);
        _tempRelativeList = _tempRelativeList.push(mainItem);
      } else {
        let timeregion = CommonFuns.GetDateRegion(relativeType.toLowerCase());
        _tempRelativeList = Immutable.List([]);
        _tempRelativeList = _tempRelativeList.push(me.generateTimespanItem(true, relativeType, null, timeregion.start, timeregion.end, null));
      }
      _tempRelativeList = _tempRelativeList.push(me.generateTimespanItem(false, relativeType, null, null, null, 1));
    } else {
      _tempRelativeList = _tempRelativeList.set(compareIndex, me.generateTimespanItem(false, relativeType, null, null, null, compareIndex));
    }
  },
  handleRelativeValueChange(relativeValue, compareIndex) {
    let me = this;
    me._initTempRelativeList();
    _tempRelativeList = _tempRelativeList.set(compareIndex, me.generateTimespanItem(false, _originalType, relativeValue, null, null, compareIndex));
  },
  handleDateTimeSelectorChange(isOriginalDate, compareIndex, startDate, endDate, isStart) {
    let me = this, item;
    me._initTempRelativeList();

    if (isOriginalDate) {
      if (_originalType === 'Customerize') {
        _tempRelativeList = _tempRelativeList.set(0, me.generateTimespanItem(true, 'Customerize', null, startDate, endDate, null));
      } else {
        _originalType = 'Customerize';
        _tempRelativeList = Immutable.List([]);
        _tempRelativeList = _tempRelativeList.push(me.generateTimespanItem(true, 'Customerize', null, startDate, endDate, null));
        _tempRelativeList = _tempRelativeList.push(me.generateTimespanItem(false, 'Customerize', null, null, null, 1));
      }
    } else {
      //当第一次修改自定义时间的时候，默认将另一个修改为相应的数值
      let oldItem = _tempRelativeList.get(compareIndex);
      if (oldItem.get('startDate')) {

      } else {
        let mainRange = this.getMainDateRange();
        let mainInteval = mainRange[1].getTime() - mainRange[0].getTime();
        // if (endDate.getTime() - startDate.getTime() === 3600000) {
        //   //选中的是开始时间，则将结束时间推后与主时间段相同的时间间隔
        //   endDate = new Date(startDate.getTime() + mainInteval);
        // } else {
        //   startDate = new Date(endDate.getTime() - mainInteval);
        // }
        if (isStart) {
          endDate = new Date(startDate.getTime() + mainInteval);
        } else {
          startDate = new Date(endDate.getTime() - mainInteval);
        }
      }
      item = me.generateTimespanItem(false, 'Customerize', null, startDate, endDate, compareIndex);
      _tempRelativeList = _tempRelativeList.set(compareIndex, item);
    }
  },
  convert2Stable() {
    this._initTempRelativeList();
    _relativeList = _tempRelativeList;
    _tempRelativeList = null;
  },
  getSubmitTimespans() {
    if (_relativeList === null) {
      return null;
    }
    let timespans = [];
    let d2j = CommonFuns.DataConverter.DatetimeToJson;
    _relativeList.forEach((item, index) => {
      if (item.get('startDate') && item.get('endDate')) {
        timespans.push({
          StartTime: d2j(item.get('startDate')),
          EndTime: d2j(item.get('endDate'))
        });
      }
    });
    return timespans;
  },
  getSave2DashboardTimespans() {
    if (_relativeList === null) {
      return null;
    }
    let timespans = [];
    let d2j = CommonFuns.DataConverter.DatetimeToJson;

    _relativeList.forEach((item, index) => {
      if (_originalType === 'Customerize') {
        if (item.get('startDate') && item.get('endDate')) {
          timespans.push({
            StartTime: d2j(item.get('startDate')),
            EndTime: d2j(item.get('endDate'))
          });
        }
      } else {
        if (index === 0) {
          timespans.push({
            relativeDate: _originalType
          });
        } else {
          if (item.get('relativeType') === 'Customerize') {
            timespans.push({
              StartTime: d2j(item.get('startDate')),
              EndTime: d2j(item.get('endDate'))
            });
          } else {
            let relativeValue = item.get('relativeValue');
            let offset, timeType;
            switch (item.get('relativeType')) {
              case 'Today':
              case 'Yesterday':
                offset = relativeValue * 24 * 60 * 60;
                timeType = 0;
                break;
              case 'ThisWeek':
              case 'LastWeek':
              case 'Last7Day':
                offset = relativeValue * 7 * 24 * 60 * 60;
                timeType = 0;
                break;
              case 'ThisMonth':
              case 'LastMonth':
                offset = relativeValue;
                timeType = 2;
                break;
              case 'Last30Day':
                offset = relativeValue * 30 * 24 * 60 * 60;
                timeType = 0;
                break;
              case 'ThisYear':
              case 'LastYear':
              case 'Last12Month':
                offset = relativeValue * 12;
                timeType = 2;
                break;
            }
            timespans.push({
              timeType: timeType,
              offset: offset
            });
          }
        }
      }
    });
    return timespans;
  },
  initDataByWidgetTimeRanges(timeRanges) {
    let j2d = CommonFuns.DataConverter.JsonToDateTime;
    let me = this;
    this.clearMultiTimespan('both');
    timeRanges.forEach((item, index) => {
      if (index === 0) {
        _relativeList = Immutable.List([]);
        if (item.relativeDate) {
          _originalType = item.relativeDate;
          var timeregion = CommonFuns.GetDateRegion(item.relativeDate.toLowerCase());
          _relativeList = _relativeList.push(me.generateTimespanItem(true, item.relativeDate, null, timeregion.start, timeregion.end, null));
        } else {
          _originalType = 'Customerize';
          _relativeList = _relativeList.push(me.generateTimespanItem(true, 'Customerize', null, j2d(item.StartTime, false), j2d(item.EndTime, false), null));
        }
      } else {
        if (item.offset) {
          let offset = parseInt(item.offset);
          let relativeValue = me.getRelativeValue(offset, _originalType);
          _relativeList = _relativeList.push(me.generateTimespanItem(false, _originalType, relativeValue, null, null, index));
        } else {
          _relativeList = _relativeList.push(me.generateTimespanItem(false, 'Customerize', null, j2d(item.StartTime, false), j2d(item.EndTime, false), index));
        }
      }
    });
  },
  getRelativeValue(offset, relativeType) {
    let relativeValue;
    switch (relativeType) {
      case 'Today':
      case 'Yesterday':
        relativeValue = offset / (24 * 60 * 60);
        break;
      case 'ThisWeek':
      case 'LastWeek':
      case 'Last7Day':
        relativeValue = offset / (7 * 24 * 60 * 60);
        break;
      case 'ThisMonth':
      case 'LastMonth':
        relativeValue = offset;
        break;
      case 'Last30Day':
        relativeValue = offset / (30 * 24 * 60 * 60);
        break;
      case 'ThisYear':
      case 'LastYear':
      case 'Last12Month':
        relativeValue = offset / 12;
        break;
    }
    return relativeValue;
  }
});
MultipleTimespanStore.dispatchToken = PopAppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.INIT_MULTITIMESPAN_DATA:
      MultipleTimespanStore.initData(action.relativeType, action.startDate, action.endDate);
      break;
    case Action.ADD_MULTITIMESPAN_DATA:
      MultipleTimespanStore.addNewCompareDate();
      MultipleTimespanStore.emitChange();
      break;
    case Action.REMOVE_MULTITIMESPAN_DATA:
      MultipleTimespanStore.removeCompareDate(action.compareIndex, action.confirm);
      MultipleTimespanStore.emitChange();
      break;
    case Action.RELATIVE_TYPE_CHANGE:
      MultipleTimespanStore.handleRelativeTypeChange(action.isOriginalDate, action.relativeType, action.compareIndex);
      MultipleTimespanStore.emitChange();
      break;
    case Action.RELATIVE_VALUE_CHANGE:
      MultipleTimespanStore.handleRelativeValueChange(action.relativeValue, action.compareIndex);
      MultipleTimespanStore.emitChange();
      break;
    case Action.DATETIME_SELECTOR_CHANGE:
      MultipleTimespanStore.handleDateTimeSelectorChange(action.isOriginalDate, action.compareIndex, action.startDate, action.endDate, action.isStart);
      MultipleTimespanStore.emitChange();
      break;
    case Action.CLEAR_MULTI_TIMESPAN:
      MultipleTimespanStore.clearMultiTimespan(action.dateType);
      break;
    case Action.CONVERT_TEMP_TO_STABLE:
      MultipleTimespanStore.convert2Stable();
      break;
  }
});

module.exports = MultipleTimespanStore;
