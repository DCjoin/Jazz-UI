'use strict';
import Momment from 'moment';
import Immutable from 'immutable';
import _ from 'lodash';
import GlobalErrorMessageAction from '../actions/GlobalErrorMessageAction.jsx';

import HierarchyStore from '../stores/HierarchyStore.jsx';
import LabelMenuStore from '../stores/LabelMenuStore.jsx';
const FIXEDTIMES = {
  millisecond: 1,
  second: 1000,
  minute: 60 * 1000,
  hour: 3600 * 1000,
  day: 24 * 3600 * 1000,
  week: 7 * 24 * 3600 * 1000,
  month: 31 * 24 * 3600 * 1000,
  year: 366 * 24 * 3600 * 1000
};

let CommonFuns = {
  isSuccess: function(data) {
    return data && data.error.Code == '0'; // && module.exports.getResResult(data);
  },
  isObject: function(it) {
    return it !== null && (typeof it == 'object' && typeof it != 'function');
  },
  isFunction: function(it) {
    return it !== null && typeof it == 'function';
  },
  isArray(it) {
    return _.isArray(it);
  },
  isNumber: function(value) {
    return typeof value === 'number' && isFinite(value);
  },
  isNumeric: function(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },
  log: function(content) {
    if (true) { // Todo change, is open log
      if (console && typeof this.isFunction(console.log)) {
        console.log(content);
      }
    }
  },
  isEmpty: function(data) {
    if (typeof data == "object") {
      if (Array.isArray(data)) {
        return data.length <= 0;
      } else {
        for (var key in data) {
          return false;
        }
        return true;
      }
    }
    return true;
  },
  thousandCommafy: function(number) {
    if (!CommonFuns.isNumber(number)) return number;

    var commafy = function(num) {
      var re = /(-?\d+)(\d{3})/;
      while (re.test(num)) {
        num = num.replace(re, "$1,$2");
      }
      return num;
    };

    var str = number.toString();
    var array = str.split('.');
    str = commafy(array[0]);
    if (array.length == 2) {
      str = str + '.' + array[1];
    }
    return str;
  },
  //经过观察发现arial字体下，汉字的宽度是一致的，而1、i、l等字符的宽度大约是汉字的0.4倍，而阿拉伯数字（除了1）的宽度则是汉字的约0.7倍，
  //小写字母（除了i、l等）的宽度是汉字的约0.7倍，大写字母则是汉字的0.8倍，其他字符也可以得出相应的倍率。
  GetArialStr: function(str, requisiteLen) {
    var lencounter = 0,
      oldLencounter = 0,
      ch;

    for (var i = 0, len = str.length; i < len; i++) {
      ch = str[i];

      if (ch.charCodeAt() > 128) {
        lencounter++;
      } else if (ch == 'f' || ch == 'i' || ch == 'j' || ch == 'l' || ch == 'r' || ch == 'I' || ch == 't' || ch == '1' || ch == '.' || ch == ':' || ch == ';' || ch == '(' || ch == ')' || ch == '-' || ch == '_' || ch == '*' || ch == '!' || ch == '\'') {
        lencounter += 0.3;
      } else if (ch >= '0' && ch <= '9') {
        lencounter += 0.6;
      } else if (ch >= 'a' && ch <= 'z') {
        lencounter += 0.6;
      } else if (ch >= 'A' && ch <= 'Z') {
        lencounter += 0.7;
      } else {
        lencounter++;
      }

      if (lencounter <= requisiteLen) {
        oldLencounter = lencounter;
      } else {
        str = str.substring(0, i) + '...';
        break;
      }
    }
    return str;
  },
  GetArialStrLen: function(str) {
    var lencounter = 0,
      ch;

    for (var i = 0, len = str.length; i < len; i++) {
      ch = str[i];

      if (ch.charCodeAt() > 128) {
        lencounter++;
        continue;
      } else if (ch == 'f' || ch == 'i' || ch == 'j' || ch == 'l' || ch == 'r' || ch == 'I' || ch == '.' || ch == ':' || ch == ';' || ch == '(' || ch == ')' || ch == '-' || ch == '_' || ch == '*' || ch == '!' || ch == '\'') {
        lencounter += 0.3;
      } else if (ch >= '0' && ch <= '9') {
        lencounter += 0.6;
      } else if (ch >= 'a' && ch <= 'z') {
        lencounter += 0.6;
      } else if (ch == 'W' || ch == 'M') {
        lencounter += 1;
      } else if (ch >= 'A' && ch <= 'Z') {
        lencounter += 0.7;
      } else {
        lencounter++;
      }
    }
    return (Math.round(lencounter * 10) / 10);
  },
  applyIf(target, source) {
    var from;
    var keys;
    var to = target;

    for (var s = 1; s < arguments.length; s++) {
      from = arguments[s];
      keys = Object.keys(Object(from));

      for (var i = 0; i < keys.length; i++) {
        if (to[keys[i]] === undefined) {
          to[keys[i]] = from[keys[i]];
        }
      }
    }

    return to;
  },
  getResResult(data) {
    if (module.exports.isObject(data)) {
      let keys = Object.getOwnPropertyNames(data);
      if (keys.length > 2) {
        return data;
      }
      for (var key in data) {
        if (data.hasOwnProperty(key) && key != 'error')
          return data[key];
      }
    }
    return null;
  },
  getErrorMessage: function(code) {
    if (!window.I18N.Message['M' + code]) return window.I18N.Common.Label.UnknownError;
    else return window.I18N.Message['M' + code];
  },
  processErrorCode: function(errorCode) {
    if (typeof errorCode == 'number')
      errorCode = errorCode.toString();
    var errorModelNCode,
      errorType;
    if (errorCode === undefined || errorCode === null) {
      errorType = undefined;
      errorModelNCode = undefined;
    } else if (errorCode.length == 1) {
      errorType = undefined;
      errorModelNCode = errorCode;
    } else {
      errorModelNCode = errorCode.substr(7);
      errorType = errorCode.substr(0, 2);
    }

    return {
      errorType: errorType,
      errorCode: errorModelNCode
    };
  },
  popupErrorMessage: function(message, context, fns, errorCode) {
    //window.alert(message);
    GlobalErrorMessageAction.fireGlobalErrorMessage(message, errorCode);
  },
  ErrorHandler: function(context, errorCode, errorMessages) {
    if (context.commonErrorHandling === false) return;

    if (typeof errorCode == 'number')
      errorCode = errorCode + '';

    var error = CommonFuns.processErrorCode(errorCode),
      errorModelNCode = error.errorCode,
      errorType = error.errorType; // 02、05输入错误，06并发错误;

    if (errorType === undefined) {
      CommonFuns.popupErrorMessage(CommonFuns.getErrorMessage(errorCode), context, undefined, errorCode);
      return;
    }
    CommonFuns.popupErrorMessage(CommonFuns.getErrorMessage(errorModelNCode), context, undefined, errorCode);

  },
  base64ToBackgroundImageUrl: function(base64Data) {
    return "url(data:image/*;base64," + base64Data + ")";
  },

  formatChinaDate: function(dateString, withTime) {
    var date = new Date(dateString);

    var result = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";

    if (withTime) {
      var minutes = date.getMinutes();
      result = result + ' ' + date.getHours() + ':' + ((minutes < 10 ? '0' : '') + minutes);
    }

    return result;
  },

  replacePathParams(path, value) {
    return path.replace(/{\w*}/, value);
  },

  getImageClipSource(source, clipRatioWidth, clipRatioHeight, wrapperWidth = clipRatioWidth, wrapperHeight = clipRatioHeight) {
    let canvas = document.createElement('canvas'),
      img = new Image(),
      ctx = canvas.getContext('2d'),
      newLeft, newTop, newWidth, newHeight;

    img.src = source;

    if (img.naturalHeight * clipRatioWidth < img.naturalWidth * clipRatioHeight) {
      newHeight = img.naturalHeight;
      newWidth = newHeight / clipRatioHeight * clipRatioWidth;
    } else {
      newWidth = img.naturalWidth;
      newHeight = newWidth / clipRatioWidth * clipRatioHeight;
    }
    newLeft = (img.naturalWidth - newWidth) / 2;
    newTop = (img.naturalHeight - newHeight) / 2;


    canvas.width = wrapperWidth;
    canvas.height = wrapperHeight;

    if (!newWidth) {
      newWidth = wrapperWidth;
    }
    if (!newHeight) {
      newHeight = wrapperHeight;
    }
    try {
      ctx.drawImage(img, newLeft, newTop, newWidth, newHeight, 0, 0, wrapperWidth, wrapperHeight);
    } catch (e) {
      return "";
    } finally {}


    return canvas.toDataURL();
  },

  setImageUploadSource(source) {
    return source.replace(/^url\("?/, "") // Remove header
      .replace(/"?\)$/, "") // Remove footer
      .replace(/^data:image\/(\w+|\*);base64,/, ""); // Remove first/second header
  },

  getImageSourceUrl(source) {
    return "data:image/*;base64," + this.setImageUploadSource(source);
  },

  getImageBackgroundStr(source) {
    return `url(${this.getImageSourceUrl(source)})`;
  },
  // Convert Second Timestamp 2 Millisecond Timestamp
  getMillisecondTimestamp(timestamp) {
    return this.convertTimestamp(timestamp, true);
  },

  // Convert Millisecond Timestamp 2 Second Timestamp
  getSecondTimestamp(timestamp) {
    return this.convertTimestamp(timestamp, false);
  },

  // Convert Millisecond & Second Timestamp
  convertTimestamp(timestamp, toMilliSecondTimestamp = true) {

    const MAGNIFICATION = 1000;
    const SECOND_LENGTH = 10;
    const MILLI_SECOND_LENGTH = 13;

    if (isNaN(timestamp)) {
      return timestamp;
    }

    if (timestamp.toFixed().length != (toMilliSecondTimestamp ? SECOND_LENGTH : MILLI_SECOND_LENGTH)) {
      return timestamp.toFixed() * 1;
    }

    if (toMilliSecondTimestamp) {
      return timestamp * MAGNIFICATION;
    } else {
      return (timestamp / MAGNIFICATION).toFixed() * 1;
    }
  },
  getCookie(c_name) {
    if (document.cookie.length > 0) {
      var c_start = document.cookie.indexOf(c_name + "=");
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        var c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1)
          c_end = document.cookie.length;
        return window.unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return "";
  },
  dateFormat(date, formatDate) {
    return (new Momment(date)).format(formatDate);
  },
  dateAdd(date, value, unit) {
    var mdate = new Momment(date);
    var newDate = mdate.add(value, unit);
    return newDate._d;
  },
  hourPickerData: function(start, end) {
    var arr = [];
    for (var i = start; i <= end; ++i) {
      arr.push({
        value: i,
        text: ((i < 10) ? '0' : '') + i + ':00'
      });
    }
    return arr;
  },
  DataConverter: {
    DatetimeToJson: function(datetime) {
      var timezoneoffset = new Date().getTimezoneOffset() * 60000;
      var l = datetime.getTime() - timezoneoffset;
      return '\/Date(' + l + ')\/';
    },
    JsonToDateTime: function(jsonstring, outintval) {
      outintval = typeof (outintval) === 'boolean' ? outintval : true;
      jsonstring = jsonstring.substr(6, jsonstring.length - 8);

      var timezoneoffset = new Date().getTimezoneOffset() * 60000;
      var mydate;
      if (outintval) {
        mydate = parseInt(jsonstring) + timezoneoffset;
      } else {
        mydate = parseInt(jsonstring) + timezoneoffset;
        mydate = new Date(mydate);
      }

      return mydate;
    }
  },
  numberToTime: function(num) {
    var h = Math.floor(num / 60),
      m = num % 60,
      hmstr = ((h > 9) ? h : ('0' + h)) + ':' + ((m > 9) ? m : ('0' + m));

    return hmstr;
  },
  getSelecetedItemFromDropdownMenu(dropdownMenu) {
    if (dropdownMenu) {
      let items = dropdownMenu.props.menuItems,
        selectedIndex = dropdownMenu.state.selectedIndex;
      if (items.length >= selectedIndex) {
        return items[selectedIndex];
      }
      return null;
    }
  },
  getTimeRangesByDate(startTime, endTime) {
    let d2j = CommonFuns.DataConverter.DatetimeToJson;
    return [{
      StartTime: d2j(startTime),
      EndTime: d2j(endTime)
    }];
  },
  GetDateRegion: function(datestr) {
    var region = {};
    var now = new Date();
    var dateAdd = CommonFuns.dateAdd;
    switch (datestr) {
      case 'last7day':
        now.setHours(0, 0, 0, 0);
        region.start = dateAdd(now, -6, 'days');
        region.end = dateAdd(now, 1, 'days');
        break;
      case 'last30day':
        now.setHours(0, 0, 0, 0);
        region.start = dateAdd(now, -29, 'days');
        region.end = dateAdd(now, 1, 'days');
        break;
      case 'last12month':
        now.setHours(0, 0, 0, 0);
        now.setDate(1);
        region.start = dateAdd(now, -11, 'months');

        var v = dateAdd(now, 1, 'months');
        region.end = v;
        break;
      case 'today':
        now.setHours(0, 0, 0, 0);
        region.start = now;
        region.end = dateAdd(now, 1, 'days');
        break;
      case 'yesterday':
        now.setHours(0, 0, 0, 0);
        region.start = dateAdd(now, -1, 'days');
        region.end = now;
        break;
      //monday - today
      case 'thisweek':
        now.setHours(0, 0, 0, 0);
        while (now.getDay() != 1)
        now = dateAdd(now, -1, 'days');

        region.start = now;
        region.end = dateAdd(now, 7, 'days');
        break;
      //monday - sunday
      case 'lastweek':
        now.setHours(0, 0, 0, 0);

        if (now.getDay() === 0) {
          now = dateAdd(now, -1, 'days');
        }
        while (now.getDay() != 1) {
          now = dateAdd(now, -1, 'days');
        }

        region.start = dateAdd(now, -7, 'days');
        region.end = now;
        break;
      case 'thismonth':
        now.setHours(0, 0, 0, 0);
        now.setDate(1);
        region.start = now;
        region.end = dateAdd(region.start, 1, 'months');
        break;
      case 'lastmonth':
        now.setHours(0, 0, 0, 0);
        now.setDate(1);
        region.start = dateAdd(now, -1, 'months');
        region.end = now;
        break;
      case 'thisyear':
        region.start = new Date(now.getFullYear(), 0, 1);
        region.end = dateAdd(region.start, 1, 'years');
        break;
      case 'lastyear':
        var firstdateofyear = new Date(now.getFullYear(), 0, 1);
        region.start = new Date(now.getFullYear() - 1, 0, 1);
        region.end = firstdateofyear;
        break;
      default:
        break;
    }
    return region;
  },
  getInterval: function(start, end) {
    if (end < start) return;
    var ft = FIXEDTIMES;
    var lvs = [];
    lvs.push(ft.day); // 1day
    lvs.push(ft.week); //1week
    lvs.push(31 * ft.day); //1month 31day
    lvs.push(31 * 3 * ft.day); //3month 93day
    lvs.push(ft.year); // 1year
    lvs.push(2 * ft.year); // 2year
    lvs.push(10 * ft.year); // 5year

    var diff = end - start;
    var interval = {};
    var i;
    for (i = 0; i < lvs.length; i++) {
      if (diff <= lvs[i]) {
        break;
      }
    }
    var list = [], display,
      gridList = [];
    //1-Hourly,2-Daily,3-Monthly,4-Yearly,5-Weekly
    switch (i) {
      case 0: //<=1day
        list = [0, 1]; //can raw & hour
        gridList = [0, 1]; //can raw & hour
        display = 1; //default hour
        break;
      case 1: //<=1week
        list = [0, 1, 2]; //can raw & hour & day
        gridList = [0, 1, 2]; //can raw & hour & day
        display = 2; //default day
        break;
      case 2: //<=1month
        list = [0, 1, 2, 5]; //can raw & hour & day & week
        gridList = [0, 1, 2, 5]; //can raw & hour & day & week
        display = 2; //default day
        break;
      case 3: //<=3month
        list = [0, 1, 2, 3, 5]; //can raw & hour & day & month & week
        gridList = [0, 1, 2, 3, 5]; //can raw & hour & day & month & week
        display = 3; //default month
        break;
      case 4: //<=1year
        list = [1, 2, 3, 5]; //can hour & day & month & week
        gridList = [1, 2, 3, 5]; //can hour & day & month & week
        display = 3; //default month
        break;
      case 5: //<=2year
      case 6: //<=10year
        list = [2, 3, 4, 5]; //can day & month & year & week
        gridList = [2, 3, 4, 5]; //can day & month & year & week
        display = 3; //default month
        break;
    }
    interval.stepList = list;
    interval.display = display;
    interval.gridList = gridList;
    return interval;
  },
  getLimitInterval(timeRanges) {
    let timeRange = timeRanges[0];
    let j2d = CommonFuns.DataConverter.JsonToDateTime;

    let startTime = j2d(timeRange.StartTime, true),
      endTime = j2d(timeRange.EndTime, true);

    let interval = CommonFuns.getInterval(startTime, endTime);
    return interval;
  },
  getUomById(id) {
    let uomArray = window.uoms;
    let uom;
    if (uomArray && uomArray.length > 0) {
      for (let i = 0, len = uomArray.length; i < len; i++) {
        uom = uomArray[i];
        if (uom.Id == id) {
          return uom;
        }
      }
    }

    return null;
  },
  getCommodityById(id) {
    let commodities = window.allCommodities;
    let commodity;
    if (commodities && commodities.length > 0) {
      for (let i = 0, len = commodities.length; i < len; i++) {
        commodity = commodities[i];
        if (commodity.Id == id) {
          return commodity;
        }
      }
    }
    return null;
  },
  formatDateByStep: function(time, start, end, step) {
    var date = new Date(time),
      ft = I18N.DateTimeFormat.IntervalFormat,
      str = '',
      dateFormat = CommonFuns.dateFormat,
      dateAdd = CommonFuns.dateAdd,
      newDate;
    switch (step) {
      case 0: //raw 2010年10月3日23点45分-3日24点  2010年10月3日0点-0点15分
        {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), Math.floor(date.getMinutes() / 15) * 15);

        str = dateFormat(date, ft.FullMinute);
        newDate = dateAdd(date, 15, 'minutes');
        if (newDate.getHours() < date.getHours()) { //2010年10月3日23点45分-3日24点
          str += '-' + I18N.EM.Clock24Minute0 /*'24点:00分'*/ + dateFormat(date, ft.Minute).substr(5);
        } else { // 2010年10月3日0点-0点15分
          str += '-' + dateFormat(newDate, ft.Minute);
        }

        break;
        }
      case 1: //hour 2010年10月3日0点-1点; 2010年10月3日23点-3日24点
        //hour 20-21,08/08, 2014
        {
        //currentLanguage： 0 中文, 1 英文
        if (false && window.currentLanguage == 1) {
          str = dateFormat(date, ft.Hour);
          newDate = dateAdd(date, 1, 'hours');
          if (newDate.getHours() < date.getHours()) { //2010年10月3日23点-3日24点
            str += '-' + I18N.EM.Clock24 /*'24点'*/ + dateFormat(date, ft.FullHour).substr(2);
          } else { // 2010年10月3日0点-1点
            str += '-' + dateFormat(newDate, ft.FullHour);
          }
        } else {
          str = dateFormat(date, ft.FullHour);
          newDate = dateAdd(date, 1, 'hours');
          if (newDate.getHours() < date.getHours()) { //2010年10月3日23点-3日24点
            str += '-' + I18N.EM.Clock24 /*'24点'*/ ;
          } else { // 2010年10月3日0点-1点
            str += '-' + dateFormat(newDate, ft.Hour);
          }
        }


        break;
        }
      case 2: //day 2010年10月3日
        {
        str = dateFormat(date, ft.FullDay);
        break;
        }
      case 3: //month 2010年10月
        {
        str = dateFormat(date, ft.Month);
        break;
        }
      case 4: //2010年
        {
        str = dateFormat(date, ft.Year);
        break;
        }
      case 5: //week 2010年10月3日-10日,2010年10月29日-11月5日,2010年12月29日-2011年1月5日
        //week 10/3-10,2010; 10/29-11/5,2010; 12/29,2010-1/5,2011
        {
        date = dateAdd(date, 0 - date.getDay() + 1, 'days');
        newDate = dateAdd(date, 6, 'days');
        //因为week显示时，中英文格式差距较大，所以分开处理
        //currentLanguage： 0 中文, 1 英文
        if (false && window.currentLanguage == 1) {
          if (newDate.getFullYear() > date.getFullYear()) {
            //12/29,2010-1/5,2011
            str = dateFormat(date, ft.FullDay);
            str += '-' + dateFormat(newDate, ft.FullDay);
          } else if (newDate.getMonth() > date.getMonth()) {
            // 10/29-11/5,2010
            str = dateFormat(date, ft.MonthDate);
            str += '-' + dateFormat(newDate, ft.FullDay);
          } else {
            //10/3-10,2010
            str = dateFormat(date, ft.MonthDate);
            str += '-' + dateFormat(newDate, ft.Day) + ', ' + dateFormat(newDate, ft.Year);
          }
        } else {
          str = dateFormat(date, ft.FullDay);
          if (newDate.getFullYear() > date.getFullYear()) {
            //2010年12月29日-2011年1月5日
            str += '-' + dateFormat(newDate, ft.FullDay);
          } else if (newDate.getMonth() > date.getMonth()) {
            //2010年10月29日-11月5日
            str += '-' + dateFormat(newDate, ft.MonthDate);
          } else {
            //2010年10月3日-10日
            str += '-' + dateFormat(newDate, ft.Day);
          }
        }

        break;
        }
      case 6: //15mins 2010年10月3日23点45分-3日24点  2010年10月3日0点-0点15分
        {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), Math.floor(date.getMinutes() / 15) * 15);

        str = dateFormat(date, ft.FullMinute);
        newDate = dateAdd(date, 15, 'minutes');
        if (newDate.getHours() < date.getHours()) { //2010年10月3日23点45分-3日24点
          str += '-' + I18N.EM.Clock24Minute0 /*'24点:00分'*/ + dateFormat(date, ft.Minute).substr(5);
        } else { // 2010年10月3日0点-0点15分
          str += '-' + dateFormat(newDate, ft.Minute);
        }

        break;
        }
      case 7: //30mins 2010年10月3日23点45分-3日24点  2010年10月3日0点-0点15分
        {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), Math.floor(date.getMinutes() / 30) * 30);

        str = dateFormat(date, ft.FullMinute);
        newDate = dateAdd(date, 30, 'minutes');
        if (newDate.getHours() < date.getHours()) { //2010年10月3日23点45分-3日24点
          str += '-' + I18N.EM.Clock24Minute0 /*'24点:00分'*/ + dateFormat(date, ft.Minute).substr(5);
        } else { // 2010年10月3日0点-0点15分
          str += '-' + dateFormat(newDate, ft.Minute);
        }

        break;
        }
      case 8: //hour 2010年10月3日0点-1点; 2010年10月3日23点-3日24点
      case 9:
      case 10:
      case 11:
      case 12:
        //hour 20-21,08/08, 2014
        {
        var stepIntervalMap = {
          '8': 2,
          '9': 4,
          '10': 6,
          '11': 8,
          '12': 12
        };
        var addInterval = stepIntervalMap[step + ''];

        //currentLanguage： 0 中文, 1 英文
        if (false && window.currentLanguage == 1) {
          str = dateFormat(date, ft.Hour);
          newDate = dateAdd(date, addInterval, 'hours');
          if (newDate.getHours() === 0) { //2010年10月3日23点-3日24点
            str += '-' + I18N.EM.Clock24 /*'24点'*/ + dateFormat(date, ft.FullHour).substr(2);
          } else { // 2010年10月3日0点-1点
            str += '-' + dateFormat(newDate, ft.FullHour);
          }

          if (newDate.getHours() < date.getHours()) { //2010年10月3日23点-3日24点
            if (newDate.getHours() === 0) {
              str += '-' + I18N.EM.Clock24 /*'24点'*/ + dateFormat(date, ft.FullHour).substr(2);
            } else if (newDate.getFullYear() != date.getFullYear()) {
              str = dateFormat(date, ft.FullHour) + '-' + dateFormat(newDate, ft.FullHour);
            } else if (newDate.getMonth() != date.getMonth()) {
              str = dateFormat(newDate, ft.MonthDayHour) + '-' + dateFormat(newDate, ft.FullHour);
            } else {
              str = dateFormat(newDate, ft.DayHour) + '-' + dateFormat(newDate, ft.FullHour);
            }
          } else {
            str += '-' + dateFormat(newDate, ft.FullHour);
          }
        } else {
          str = dateFormat(date, ft.FullHour);
          newDate = dateAdd(date, addInterval, 'hours');

          if (newDate.getHours() < date.getHours()) { //2010年10月3日23点-3日24点
            if (newDate.getHours() === 0) {
              str += '-' + I18N.EM.Clock24 /*'24点'*/ ;
            } else if (newDate.getFullYear() != date.getFullYear()) {
              str += '-' + dateFormat(newDate, ft.FullHour);
            } else if (newDate.getMonth() != date.getMonth()) {
              str += '-' + dateFormat(newDate, ft.MonthDayHour);
            } else {
              str += '-' + dateFormat(newDate, ft.DayHour);
            }
          } else { // 2010年10月3日0点-1点
            str += '-' + dateFormat(newDate, ft.Hour);
          }
        }

        break;
        }
    }
    return str;
  },
  getDecimalDigits(num) {
    var str = num + '',
      arr = str.split('.'),
      decimalDigits = 0;

    if (arr.length == 1) {
      decimalDigits = 0;
    } else {
      decimalDigits = arr[1].length;
    }
    return decimalDigits;
  },
  toFixed(s, len) {
    var tempNum = 0, temp, result,
      s1 = s + '',
      start = s1.indexOf('.');
    if (start == -1 || s1.length - 1 - start <= len) {
      result = s;
    } else {
      if (s1.substr(start + len + 1, 1) >= 5) {
        tempNum = 1;
      }
      temp = Math.pow(10, len);
      if ((s * temp + '').indexOf('.') > -1) {
        s = Math.floor(s * temp) + tempNum;
      } else {
        s = s * temp;
      }

      result = s / temp;
    }
    return result.toFixed(len);
  },
  JazzCommon: {
    TrimText(text, maxlength, from) {
      var max = maxlength;
      var sum = 0;

      var ret = [], begin, end;
      if (from == 'left') {
        for (let i = 0; i < text.length; i++) {
          if (/^[\u4e00-\u9fa5]$/.test(text[i])) {
            sum++;
          } else {
            sum += 0.6;
          }
          if (sum > max) {
            ret.push('...');
            break;
          }
          ret.push(text[i]);
        }
      } else {
        for (let i = text.length - 1; i >= 0; i--) {
          if (/^[\u4e00-\u9fa5]$/.test(text[i])) {
            sum++;
          } else {
            sum += 0.6;
          }
          if (sum > max) {
            ret.unshift('...');
            break;
          }
          ret.unshift(text[i]);
        }
      }
      return ret.join('');
    },
    IsValidDate(date) {
      if (typeof (date) === 'number') {
        var earliest = new Date(2000, 0, 1).getTime();
        var now = new Date().getTime();
        return date >= earliest && date <= now;
      }
      else return date && date.getTime && (date >= new Date(2000, 0, 1)) && (date <= new Date());
    },
    thousandCommafy: function(number) {
      if (!CommonFuns.isNumber(number)) return number;

      var commafy = function(num) {
        var re = /(-?\d+)(\d{3})/;
        while (re.test(num)) {
          num = num.replace(re, "$1,$2");
        }
        return num;
      };

      var str = number.toString();
      var array = str.split('.');
      str = commafy(array[0]);
      if (array.length == 2) {
        str = str + '.' + array[1];
      }
      return str;
    },
    GetArialStrLen: function(str) {
      var lencounter = 0,
        ch;

      for (var i = 0, len = str.length; i < len; i++) {
        ch = str[i];

        if (ch.charCodeAt() > 128) {
          lencounter++;
          continue;
        } else if (ch == 'f' || ch == 'i' || ch == 'j' || ch == 'l' || ch == 'r' || ch == 'I' || ch == '.' || ch == ':' || ch == ';' || ch == '(' || ch == ')' || ch == '-' || ch == '_' || ch == '*' || ch == '!' || ch == '\'') {
          lencounter += 0.3;
        } else if (ch >= '0' && ch <= '9') {
          lencounter += 0.6;
        } else if (ch >= 'a' && ch <= 'z') {
          lencounter += 0.6;
        } else if (ch == 'W' || ch == 'M') {
          lencounter += 1;
        } else if (ch >= 'A' && ch <= 'Z') {
          lencounter += 0.7;
        } else {
          lencounter++;
        }
      }
      return (Math.round(lencounter * 10) / 10);
    },
    GetArialStr(str, requisiteLen) {
      var lencounter = 0,
        oldLencounter = 0,
        ch;

      for (var i = 0, len = str.length; i < len; i++) {
        ch = str[i];

        if (ch.charCodeAt() > 128) {
          lencounter++;
        } else if (ch == 'f' || ch == 'i' || ch == 'j' || ch == 'l' || ch == 'r' || ch == 'I' || ch == 't' || ch == '1' ||
          ch == '.' || ch == ':' || ch == ';' || ch == '(' || ch == ')' || ch == '-' || ch == '_' || ch == '*' || ch == '!' || ch == '\'') {
          lencounter += 0.3;
        } else if (ch >= '0' && ch <= '9') {
          lencounter += 0.6;
        } else if (ch >= 'a' && ch <= 'z') {
          lencounter += 0.6;
        } else if (ch >= 'A' && ch <= 'Z') {
          lencounter += 0.7;
        } else {
          lencounter++;
        }

        if (lencounter <= requisiteLen) {
          oldLencounter = lencounter;
        } else {
          str = str.substring(0, i) + '...';
          break;
        }
      }
      return str;
    }
  },

  formatDateValue: function(time, step) {
    var date = new Date(time),
      ft = I18N.DateTimeFormat.IntervalFormat,
      eft = CommonFuns.dateFormat,
      str = '',
      dateAdd = CommonFuns.dateAdd,
      newDate;
    switch (step) {
      case 0: //raw 2010年10月3日23点45分-3日24点  2010年10月3日0点-0点15分
        {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), Math.floor(date.getMinutes() / 15) * 15);
        str = eft(date, ft.RangeFullMinute);
        break;
        }
      case 1: //hour 2010年10月3日0点-1点; 2010年10月3日23点-3日24点
        //hour 20-21,08/08, 2014
        {
        str = eft(date, ft.FullHour);
        break;
        }
      case 2: //day 2010年10月3日
        {
        str = eft(date, ft.FullDay);
        break;
        }
      case 3: //month 2010年10月
        {
        str = eft(date, ft.Month);
        break;
        }
      case 4: //2010年
        {
        str = eft(date, ft.Year);
        break;
        }
      case 5: //week 2010年10月3日-10日,2010年10月29日-11月5日,2010年12月29日-2011年1月5日
        //week 10/3-10,2010; 10/29-11/5,2010; 12/29,2010-1/5,2011
        {
        date = dateAdd(date, 0 - date.getDay() + 1, 'days');
        newDate = dateAdd(date, 6, 'days');
        //因为week显示时，中英文格式差距较大，所以分开处理
        //currentLanguage： 0 中文, 1 英文
        let currentLanguage = 0;
        if (currentLanguage == 1) {
          if (newDate.getFullYear() > date.getFullYear()) {
            //12/29,2010-1/5,2011
            str = eft(date, ft.FullDay);
            str += '-' + eft(newDate, ft.FullDay);
          } else if (newDate.getMonth() > date.getMonth()) {
            // 10/29-11/5,2010
            str = eft(date, ft.MonthDate);
            str += '-' + eft(newDate, ft.FullDay);
          } else {
            //10/3-10,2010
            str = eft(date, ft.MonthDate);
            str += '-' + eft(newDate, ft.Day) + ', ' + eft(newDate, ft.Year);
          }
        } else {
          str = eft(date, ft.FullDay);
          if (newDate.getFullYear() > date.getFullYear()) {
            //2010年12月29日-2011年1月5日
            str += '-' + eft(newDate, ft.FullDay);
          } else if (newDate.getMonth() > date.getMonth()) {
            //2010年10月29日-11月5日
            str += '-' + eft(newDate, ft.MonthDate);
          } else {
            //2010年10月3日-10日
            str += '-' + eft(newDate, ft.Day);
          }
        }

        break;
        }
      case 6: //15mins 2010年10月3日23点45分-3日24点  2010年10月3日0点-0点15分
        {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), Math.floor(date.getMinutes() / 15) * 15);
        str = eft(date, ft.RangeFullMinute);
        break;
        }
      case 7: //30mins 2010年10月3日23点45分-3日24点  2010年10月3日0点-0点15分
        {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), Math.floor(date.getMinutes() / 30) * 30);
        str = eft(date, ft.RangeFullMinute);
        break;
        }
    }
    return str;
  },
  getTagIdsFromTagOptions(tagOptions) {
    let tagIds = [];
    for (let i = 0, len = tagOptions.length; i < len; i++) {
      tagIds.push(tagOptions[i].tagId);
    }
    return tagIds;
  },
  getViewAssociation(hierarchyId, dimNode) {
    var viewAssociation = {};
    if (dimNode !== null && dimNode !== undefined) {
      viewAssociation = {
        HierarchyId: hierarchyId,
        AreaDimensionId: dimNode.dimId
      };
    } else {
      viewAssociation = {
        HierarchyId: hierarchyId
      };
    }
    return viewAssociation;
  },
  getHierarchyIdsFromList(hierarchyList) {
    let hierarchyIds = [];
    for (let i = 0, len = hierarchyList.length; i < len; i++) {
      hierarchyIds.push(parseInt(hierarchyList[i].hierId));
    }
    return hierarchyIds;
  },
  getCommodityIdsFromList(commodityList) {
    let commodityIds = [];
    for (let i = 0, len = commodityList.length; i < len; i++) {
      commodityIds.push(parseInt(commodityList[i].Id));
    }
    return commodityIds;
  },
  getNodeNameAssociationByTagOptions(tagOptions) {
    let nodeNameAssociation = [], tag, hieNameArr,
      hieName = '';
    for (let i = 0, len = tagOptions.length; i < len; i++) {
      tag = tagOptions[i];
      if (tag.hierName) {
        hieNameArr = tag.hierName.split('\\');
        hieName = hieNameArr[hieNameArr.length - 1];
      }
      nodeNameAssociation.push({
        Id: tag.tagId,
        Name: tag.tagName,
        HierId: tag.hierId,
        NodeName: hieName,
        AssociationOption: 1,
        DimensionName: null
      });
    }
    return nodeNameAssociation;
  },
  getNodeNameAssociationBySelectedList(selectedList) {
    var nodeNameAssociation = [],
      dimName = "";
    var commodityList = selectedList.commodityList;
    var commodityIds = this.getCommodityIdsFromList(commodityList);
    var hierarchyNode = selectedList.hierarchyNode;
    var dimNode = selectedList.dimNode;
    if (dimNode !== null && dimNode !== undefined) {
      dimName = dimNode.dimName;
    }
    var hierName = hierarchyNode.hierName;
    for (var i = 0; i < commodityIds.length; i++) {
      nodeNameAssociation.push({
        Id: commodityIds[i],
        NodeName: hierName,
        AssociationOption: 1,
        DimensionName: dimName
      });
    }
    return nodeNameAssociation;
  },
  filterBenchmarksByTagOptions(tagOptions) {
    let hierId = null,
      commodityId = null, tagOption;
    for (let i = 0, len = tagOptions.length; i < len; i++) {
      tagOption = tagOptions[i];
      if (hierId === null) {
        hierId = tagOption.hierId;
        commodityId = tagOption.commodityId;
      } else if (hierId === tagOption.hierId && commodityId === tagOption.commodityId) {
        continue;
      } else {
        return null;
      }
    }
    let selectedHier = HierarchyStore.findHierItem(HierarchyStore.getData(), hierId);
    var industryData = LabelMenuStore.getIndustryData();
    var zoneData = LabelMenuStore.getZoneData();
    var benchmarkData = LabelMenuStore.getBenchmarkData();
    return this.filterBenchmarks(selectedHier, industryData, zoneData, benchmarkData);
  },
  filterBenchmarksByCostSelectedList(selectedList) {
    let hierId = selectedList.hierarchyNode.hierId;
    if (!hierId) {
      return null;
    }
    let selectedHier = HierarchyStore.findHierItem(HierarchyStore.getData(), hierId);
    var industryData = LabelMenuStore.getIndustryData();
    var zoneData = LabelMenuStore.getZoneData();
    var benchmarkData = LabelMenuStore.getBenchmarkData();
    return this.filterBenchmarks(selectedHier, industryData, zoneData, benchmarkData);
  },
  filterBenchmarks(hierNode, allIndustries, allZones, allBenchmarks) {
    let retArr = [];
    if (!hierNode || hierNode.Type != 2) {
      return null;
    }
    retArr.push(this.constructMenuItem(-1, -1, I18N.Setting.Benchmark.Label.None));

    let industryId = hierNode.IndustryId;
    let zoneId = hierNode.ZoneId;

    let targetBenchmark = allBenchmarks.find((benchmark) => {
      if (benchmark.get('IndustryId') === industryId) return benchmark;
    });
    let targetIndustry = allIndustries.find((industry) => {
      if (industry.get('Id') === industryId) return industry;
    });
    if (targetBenchmark) this.pushBenchmarkItem(industryId, zoneId, targetBenchmark, retArr, allZones);

    // parent industry benchmark
    let parentId = targetIndustry.get('ParentId');
    if (parentId !== 0) {
      targetBenchmark = allBenchmarks.find((benchmark) => {
        if (benchmark.get('IndustryId') === parentId) return benchmark;
      });
      if (targetBenchmark) this.pushBenchmarkItem(parentId, zoneId, targetBenchmark, retArr, allZones);
    }
    // all industry benchmark
    targetBenchmark = allBenchmarks.find((benchmark) => {
      if (benchmark.get('IndustryId') === 0) return benchmark;
    });
    if (targetBenchmark) this.pushBenchmarkItem(0, zoneId, targetBenchmark, retArr, allZones);

    return retArr;
  },
  pushBenchmarkItem(industryId, zoneId, benchmark, retArr, allZones) {
    var zoneIds = benchmark.get('ZoneIds'),
      hasAllZone = false;

    for (var i = 0, len = zoneIds.size; i < len; i++) {
      if (zoneIds.get(i) === 0)
        hasAllZone = true;
      if (zoneId === zoneIds.get(i) && zoneId !== 0) {
        retArr.push(
          this.constructMenuItem(industryId, zoneId,
            benchmark.get('ZoneComments').get(i) + benchmark.get('IndustryComment'))
        );
        break;
      }
    }

    if (hasAllZone) {
      // add the current industry all zone
      retArr.push(
        this.constructMenuItem(industryId, 0,
          allZones.find((zone) => {
            if (zone.get('Id') === 0) return zone;
          }).get('Comment') + benchmark.get('IndustryComment'))
      );
    }
  },
  constructMenuItem(industryId, zoneId, text) {
    return {
      industryId: industryId,
      zoneId: zoneId,
      primaryText: text
    };
  },
  extractEnergyType(type) {
    let energyType = null;
    switch (type) {
      case 'Energy':
      case 'Carbon':
      case 'Cost':
      case 'Ratio':
      case 'Labelling':
        energyType = type;
        break;
      case 'UnitEnergy':
      case 'RankingEnergy':
        energyType = 'Energy';
        break;
      case 'UnitCarbon':
      case 'RankCarbon':
        energyType = 'Carbon';
        break;
      case 'UnitCost':
      case 'RankingCost':
        energyType = 'Cost';
        break;
      case 'CostElectric':
        energyType = 'Cost';
        break;
    }
    return energyType;
  },
  /**
    * Prepare data for multiple time span chart and grid.
    * @param {Object} data, the EnergyViewDataDto object.
    * @param {Number} step, indicates AggregationStep.
    */
  prepareMultiTimeSpanData: function(data, step) {
    if (!data || !data.TargetEnergyData || data.TargetEnergyData.length <= 0)
      return;
    var j2d = CommonFuns.DataConverter.JsonToDateTime;
    var hashtable = [];
    var maxIntervalLength = 0;
    for (let i = 0; i < data.TargetEnergyData.length; i++) {
      var hash = {};

      if (data.TargetEnergyData[i].EnergyData !== null && data.TargetEnergyData[i].EnergyData.length > 0)
        for (var j = 0; j < data.TargetEnergyData[i].EnergyData.length; j++)
          hash[data.TargetEnergyData[i].EnergyData[j].LocalTime] = j + 1;

      hashtable[i] = hash;

      var length = j2d(data.TargetEnergyData[i].Target.TimeSpan.EndTime) - j2d(data.TargetEnergyData[i].Target.TimeSpan.StartTime);
      if (length > maxIntervalLength)
        maxIntervalLength = length;
    }

    for (let i = 0; i < data.TargetEnergyData.length; i++) {
      if (data.TargetEnergyData[i].EnergyData === null)
        data.TargetEnergyData[i].EnergyData = [];

      var target = data.TargetEnergyData[i].Target,
        energy = data.TargetEnergyData[i].EnergyData,
        timeRange = target.TimeSpan;

      //get the first time that there should exist a value
      var keyTime = this.firstValueTime(timeRange.StartTime, step),
        index = 0,
        endTime = (keyTime - 0) + maxIntervalLength;

      //if the data sequence does not contain such a time, insert one
      while ((keyTime - 0) < endTime) {
        var timeJson = '/Date(' + (keyTime - 0) + ')/',
          exists = hashtable[i][timeJson];

        if (!exists)
          energy.splice(index, 0, {
            DataQuality: null,
            DataValue: null,
            LocalTime: timeJson
          });

        keyTime = CommonFuns.DateComputer.AddStep(keyTime, step); //JazzCommon.DateComputer.AddStep(keyTime, step);
        index++;
      }
    }
  },
  firstValueTime: function(startTime, step) {
    let ticks = parseInt(startTime.substr(6, startTime.length - 8)),
      time = new Date(ticks),
      dp = CommonFuns.DateComputer,
      fixed = dp.FixedTimes;

    let year = time.getFullYear(),
      month = time.getMonth(),
      day = time.getDate(),
      hour = time.getHours();
    switch (step) {
      case 0:
        return new Date(startTime);
      case 1: //hourly
        //if it is a int times of hourly ticks, return it
        //if not, add hourly ticks until it becomes one
        while (ticks % fixed.hour !== 0) {
          ticks += fixed.minute;
        }
        return new Date(ticks);
      case 2: //daily
        //if it is a int times of daily ticks, return it
        //if not, add hourly ticks until it becomes one
        while (ticks % fixed.day !== 0) {
          ticks += fixed.hour;
        }
        return new Date(ticks);
      case 5: //weekly
        //if it is a int times of daily ticks, return it
        //if not, add hourly ticks until it becomes one
        //ticks -= fixed.day * 3;
        while (ticks % fixed.week != fixed.day * 4) {
          ticks += fixed.hour;
        }
        return new Date(ticks);
      case 3: //monthly
        //if it is the first day, 0 hour of this month, return it
        //if not, return the first day, 0 hour of the next month
        if (day == 1 && hour + (time.getTimezoneOffset() / 60) === 0)
          return new Date(ticks); else {
          let newTime = new Date(year, month, 1, 0, 0, 0, 0);
          return dp.AddStep(newTime, 3);
        }
        break;
      case 4: //yearly
        //if it is the first month, first day, 0 hour of this year, return it
        //if not, return the first month, first day, 0 hour of the next year
        if (month === 0 && day === 1 && hour + (time.getTimezoneOffset() / 60) === 0)
          return new Date(ticks); else {
          let newTime = new Date(year, month, 1, 0, 0, 0, 0);
          return dp.AddStep(newTime, 4);
        }
    }
  },
  setSelectedIndexByValue(combo, value) {
    let menuItems = combo.props.menuItems;
    let valueIndex = 0;
    menuItems.forEach((item, index) => {
      if (item.value === value) {
        valueIndex = index;
        return valueIndex;
      }
    });
    combo.setState({
      selectedIndex: valueIndex
    });
  },
  DateComputer: {
    FixedTimes: {
      millisecond: 1,
      second: 1000,
      minute: 60 * 1000,
      hour: 3600 * 1000,
      day: 24 * 3600 * 1000,
      week: 7 * 24 * 3600 * 1000,
      month: 31 * 24 * 3600 * 1000,
      year: 366 * 24 * 3600 * 1000
    },
    AddStep: function(time, step) {
      var ticks = time - 0;
      switch (step) {
        case 1: //hourly, add one hour, this is a fixed value
          return new Date(ticks + this.FixedTimes.hour);
        case 2: //daily, add one day, this is a fixed value
          return new Date(ticks + this.FixedTimes.day);
        case 5: //weekly, add one week, this is a fixed value
          return new Date(ticks + this.FixedTimes.week);
        case 3: //monthly, add one month, this is not a fixed value, need construct
          var year = time.getFullYear(),
            month = time.getMonth(),
            totalMonths = year * 12 + month + 1;
          let newtime1 = new Date(Math.floor(totalMonths / 12), totalMonths % 12, 1, 0, 0, 0, 0);
          return new Date(newtime1 - (newtime1.getTimezoneOffset() * 60000));
        case 4: //yearly, add one year, this is not a fixed value, need construct
          let newtime = new Date(time.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
          return new Date(newtime - (newtime.getTimezoneOffset() * 60000));
      }
    },
    firstValueTime: function(startTime, step) {
      var ticks = parseInt(startTime.substr(6, startTime.length - 8)),
        time = new Date(ticks),
        dp = CommonFuns.DateComputer, //JazzCommon.DateComputer,
        fixed = dp.FixedTimes;

      let year = time.getFullYear(),
        month = time.getMonth(),
        day = time.getDate(),
        hour = time.getHours(),
        date;

      switch (step) {
        case 0:
          return new Date(startTime);
        case 1: //hourly
          //if it is a int times of hourly ticks, return it
          //if not, add hourly ticks until it becomes one
          while (ticks % fixed.hour !== 0) {
            ticks += fixed.minute;
          }
          return new Date(ticks);
        case 2: //daily
          //if it is a int times of daily ticks, return it
          //if not, add hourly ticks until it becomes one
          while (ticks % fixed.day !== 0) {
            ticks += fixed.hour;
          }
          return new Date(ticks);
        case 5: //weekly
          //if it is a int times of daily ticks, return it
          //if not, add hourly ticks until it becomes one
          //ticks -= fixed.day * 3;
          while (ticks % fixed.week != fixed.day * 4) {
            ticks += fixed.hour;
          }
          return new Date(ticks);
        case 3: //monthly
          //if it is the first day, 0 hour of this month, return it
          //if not, return the first day, 0 hour of the next month
          if (day == 1 && hour + (time.getTimezoneOffset() / 60) === 0)
            date = new Date(ticks); else {
            let newTime = new Date(year, month, 1, 0, 0, 0, 0);
            date = dp.AddStep(newTime, 3);
          }
          return date;
        case 4: //yearly
          //if it is the first month, first day, 0 hour of this year, return it
          //if not, return the first month, first day, 0 hour of the next year
          if (month === 0 && day === 1 && hour + (time.getTimezoneOffset() / 60) === 0)
            return new Date(ticks); else {
            let newTime = new Date(year, month, 1, 0, 0, 0, 0);
            return dp.AddStep(newTime, 4);
          }
      }
    },
    GetStepSpan: function(ticks, step) {

      switch (step) {
        case 1: //hourly, add one hour, this is a fixed value
          return Math.round(ticks / this.FixedTimes.hour);
        case 2: //daily, add one day, this is a fixed value
          return Math.round(ticks / this.FixedTimes.day);
        case 5: //weekly, add one week, this is a fixed value
          return Math.round(ticks / this.FixedTimes.week);
        case 3: //monthly, add one month,
          return Math.round(ticks / this.FixedTimes.month);
        case 4: //yearly, add one year,
          return Math.round(ticks / this.FixedTimes.year);
      }
    },
    // number can be minus
    AddSevralStep: function(time, step, number) {
      var ticks = time - 0;
      switch (step) {
        case 1: //hourly, add one hour, this is a fixed value
          return new Date(ticks + this.FixedTimes.hour * number);
        case 2: //daily, add one day, this is a fixed value
          return new Date(ticks + this.FixedTimes.day * number);
        case 5: //weekly, add one week, this is a fixed value
          return new Date(ticks + this.FixedTimes.week * number);
        case 3: //monthly, add one month, this is not a fixed value, need construct
          var year = time.getFullYear(),
            month = time.getMonth(),
            totalMonths = year * 12 + month + number;
          return new Date(Math.floor(totalMonths / 12), totalMonths % 12, 1, 0, 0, 0, 0);
        case 4: //yearly, add one year, this is not a fixed value, need construct
          return new Date(time.getFullYear() + number, 0, 1, 0, 0, 0, 0);
      }
    }
  },

  Regex: {
    ExcelCell: /[a-z]+\d+/i, //A4,AA66
    PositiveInterger: /^\d+$/,
    Date: /((^((1[8-9]\d{2})|([2-9]\d{3}))-(10|12|0?[13578])-(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))-(11|0?[469])-(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))-(0?2)-(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)-(0?2)-(29)$)|(^([3579][26]00)-(0?2)-(29)$)|(^([1][89][0][48])-(0?2)-(29)$)|(^([2-9][0-9][0][48])-(0?2)-(29)$)|(^([1][89][2468][048])-(0?2)-(29)$)|(^([2-9][0-9][2468][048])-(0?2)-(29)$)|(^([1][89][13579][26])-(0?2)-(29)$)|(^([2-9][0-9][13579][26])-(0?2)-(29)$))/,
    PositiveRule: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/, // 正数

    // ‘(’, ‘)’, ‘-‘, ‘[‘, ‘]’, ‘{‘, ‘}’, ‘#’, ‘&’, ‘,’, ‘;’, ‘.’, ‘~’, ‘+’, ‘%’
    NameRule: /^[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\;\.\~\+\%]+( +[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\;\.\~\+\%]+)*$/, // 不以空格开头和结尾的字符串，允许汉字，空格，a-z、A-Z、0-9、_、(、)、-、[、]、{、}、#、&、;、,、.、~、+、%。非空。用于name
    CustomerNameRule: /^[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\;\.\~\+\%]+( +[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\;\.\~\+\%]+)*$/, // 不以空格开头和结尾的字符串，允许汉字，空格，a-z、A-Z、0-9、_、(、)、-、[、]、{、}、#、&、;、,、.、~、+、%。非空。用于customername
    PersonNameRule: /^[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\;\.\~\+\%]+( +[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\;\.\~\+\%]+)*$/, // 不以空格开头和结尾的字符串，允许汉字，空格，a-z、A-Z、0-9、_、(、)、-、[、]、{、}、#、&、;、,、.、~、+、%。非空。用于realname
    CodeRule: /^[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\#\&\,\:\;\.\~\+\%\\\/\|]+( +[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\#\&\,\:\;\.\~\+\%\\\/\|]+)*$/, // 不以空格开头和结尾的字符串，允许汉字，空格，a-z、A-Z、0-9、_、(、)、-、[、]、{、}、#、&、;、,、.、~、+、/、|、\、%。非空。用于code
    CustomerCodeRule: /^[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\;\.\~\+\%]+( +[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\;\.\~\+\%]+)*$/, // 不以空格开头和结尾的字符串，允许汉字，空格，a-z、A-Z、0-9、_、(、)、-、[、]、{、}、#、&、;、,、.、~、+、%。非空。用于customer code

    UserIdRule: /^[\u4e00-\u9fa5a-zA-Z0-9_\-\.]+( +[\u4e00-\u9fa5a-zA-Z0-9_\-\.])*$/, //不以空格开头和结尾的字符串，允许空格、a-z、A-Z、0-9、_、-、.。非空 用于user id
    PasswordRule1: /[0-9]+/,
    PasswordRule2: /[a-zA-Z]+/,
    PasswordRule3: /^[0-9a-zA-Z_!@#$%^&*()][0-9a-zA-Z_!@#$%^&*()]*$/,
    PasswordRule4: /[ ]+/,
    CommentRule: /[\w\W\u4e00-\u9fa5]*$/, //任何可见字符，可空。
    FeedbackRule: /[\w\W\u4e00-\u9fa5]+$/, //任何可见字符，用于feedback
    EmailRule: /^(\w)+((-\w+)*(\.\w+)*)*((\.\w+)*(-\w+)*)*@(\w(-\w)*(\.\w)*)+((\.\w+)+)$/,
    TelephoneRule: /^(\d)+(-(\d)+)*$/, // 由数字和中划线组成。不以中划线开头。非空。
    AddressRule: /[\w\W\u4e00-\u9fa5]+$/, // 任何可见字符。非空。用于address
    UrlRule: /(((^https?)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i
  }
};

module.exports = CommonFuns;
