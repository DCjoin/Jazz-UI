'use strict';
import Momment from 'moment';

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
		return data && data.error.Code == '0' && module.exports.getResResult(data);
	},
	isObject: function(it) {
		return it !== null && (typeof it == 'object' && typeof it != 'function');
	},
	isFunction: function(it) {
		return it !== null && typeof it == 'function';
	},
	isArray(it){
		return window.toString.call(it) === '[object Array]';
	},
	isNumber: function(value) {
      return typeof value === 'number' && isFinite(value);
  },
	isNumeric: function(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
  },
	log: function(content) {
		if(true) { // Todo change, is open log
			if(console && typeof this.isFunction(console.log)) {
				console.log(content);
			}
		}
	},
  isEmpty: function(data){
	  if(typeof data == "object"){
	    if(Array.isArray(data)){
				return data.length <= 0;
	    } else {
	      for(var key in data){
	        return false;
	      }
	      return true;
	    }
	  }
	  return true;
	},
	getResResult(data){
		if(module.exports.isObject(data)){
			let keys = Object.getOwnPropertyNames(data);
			if(keys.length > 2){
				return data;
			}
			for(var key in data){
				if(data.hasOwnProperty(key) && key != 'error')
					return data[key];
				}
		}
		return null;
	},
	getErrorMessage: function (code) {
    if (!window.I18N.Message['M' + code]) return window.I18N.Common.Label.UnknownError;
    else return window.I18N.Message['M' + code];
  },
  processErrorCode: function (errorCode) {
      if (typeof errorCode == 'number') errorCode = errorCode.toString();
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
  popupErrorMessage: function (message, context, fns, errorCode) {
		window.alert(message);

  },
	ErrorHandler: function (context, errorCode, errorMessages) {
    if (context.commonErrorHandling === false) return;

    if (typeof errorCode == 'number') errorCode = errorCode + '';

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

		if(withTime){
			var minutes = date.getMinutes();
			result = result + ' ' + date.getHours() + ':' + ((minutes<10?'0':'') + minutes);
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

		if(img.naturalHeight * clipRatioWidth < img.naturalWidth * clipRatioHeight) {
			newHeight = img.naturalHeight;
			newWidth = newHeight/clipRatioHeight * clipRatioWidth;
		} else {
			newWidth = img.naturalWidth;
			newHeight = newWidth/clipRatioWidth * clipRatioHeight;
		}
		newLeft = (img.naturalWidth - newWidth) / 2;
		newTop = (img.naturalHeight - newHeight) / 2;


		canvas.width = wrapperWidth;
		canvas.height = wrapperHeight;

		if(!newWidth){
			newWidth = wrapperWidth;
		}
		if(!newHeight){
			newHeight = wrapperHeight;
		}
		try {
			ctx.drawImage(img, newLeft, newTop, newWidth, newHeight, 0, 0, wrapperWidth, wrapperHeight);
		} catch (e) {
			return "";
		} finally {

		}


		return canvas.toDataURL();
	},

	setImageUploadSource(source) {
		return source.replace(/^url\("?/,"") 						// Remove header
						.replace(/"?\)$/,"")							// Remove footer
						.replace(/^data:image\/(\w+|\*);base64,/, "");	// Remove first/second header
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

		if(isNaN(timestamp)) {
			return timestamp;
		}

		if( timestamp.toFixed().length != (toMilliSecondTimestamp ? SECOND_LENGTH : MILLI_SECOND_LENGTH) ) {
			return timestamp.toFixed() * 1;
		}

		if(toMilliSecondTimestamp) {
			return timestamp * MAGNIFICATION;
		} else {
			return (timestamp / MAGNIFICATION).toFixed() * 1;
		}
	},
	getCookie(c_name)
	{
			if (document.cookie.length>0)
			  {
			  var c_start=document.cookie.indexOf(c_name + "=");
			  if (c_start!=-1)
			    {
			    c_start=c_start + c_name.length+1;
			    var c_end=document.cookie.indexOf(";",c_start);
			    if (c_end==-1) c_end=document.cookie.length;
			    return window.unescape(document.cookie.substring(c_start,c_end));
			    }
			  }
			return "";
	},
	dateFormat(date, formatDate){
		return (new Momment(date)).format(formatDate);
	},
	dateAdd( date, value, unit ){
		var mdate = new Momment(date);
		var newDate = mdate.add(value, unit);
		return newDate._d;
	},
	hourPickerData: function () {
      var arr = [];
      for (var i = 0; i <= 24; ++i) {
          arr.push({ value: i, text: ((i < 10) ? '0' : '') + i + ':00' });
      }
      return arr;
	},
	DataConverter:{
		DatetimeToJson: function (datetime) {
        var timezoneoffset = new Date().getTimezoneOffset() * 60000;
        var l = datetime.getTime() - timezoneoffset;
        return '\/Date(' + l + ')\/';
    },
    JsonToDateTime: function (jsonstring, outintval) {
        outintval = typeof (outintval) === 'boolean' ? outintval : true;
        jsonstring = jsonstring.substr(6, jsonstring.length - 8);

        var timezoneoffset = new Date().getTimezoneOffset() * 60000;
        var mydate;
        if (outintval) {
            mydate = parseInt(jsonstring) + timezoneoffset;
        }
        else {
            mydate = parseInt(jsonstring) + timezoneoffset;
            mydate = new Date( mydate );
        }

        return mydate;
    }
	},
	numberToTime: function(num){
    var h = Math.floor(num / 60), m = num % 60,
    hmstr = ((h>9)?h:('0'+h)) + ':' + ((m>9)?m:('0'+m));

    return hmstr;
  },
	getSelecetedItemFromDropdownMenu(dropdownMenu){
		if(dropdownMenu){
			let items = dropdownMenu.props.menuItems,
					selectedIndex = dropdownMenu.state.selectedIndex;
			if(items.length>= selectedIndex){
				return items[selectedIndex];
			}
			return null;
		}
	},
	getTimeRangesByDate(startTime, endTime){
		let d2j = CommonFuns.DataConverter.DatetimeToJson;
		return [{StartTime: d2j(startTime), EndTime: d2j(endTime)}];
	},
	GetDateRegion: function (datestr) {
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

                var v = dateAdd(now, 1,'months');
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

                if(now.getDay() === 0){
									now = dateAdd(now, -1, 'days');
								}
                while (now.getDay() != 1){
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
                region.end = dateAdd(region.end, -1, 'months');
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
            default: break;
        }
        return region;
    },
		getInterval: function (start, end) {
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
			var list = [], display, gridList = [];
			//1-Hourly,2-Daily,3-Monthly,4-Yearly,5-Weekly
			switch (i) {
					case 0: //<=1day
							list = [0, 1];//can raw & hour
							gridList = [0, 1];//can raw & hour
							display = 1; //default hour
							break;
					case 1: //<=1week
							list = [0, 1, 2]; //can raw & hour & day
							gridList = [0, 1, 2]; //can raw & hour & day
							display = 2; //default day
							break;
					case 2: //<=1month
							list = [0, 1, 2, 5]; //can raw & hour & day & week
							gridList = [0, 1, 2, 5];//can raw & hour & day & week
							display = 2; //default day
							break;
					case 3: //<=3month
							list = [0, 1, 2, 3, 5]; //can raw & hour & day & month & week
							gridList = [0, 1, 2, 3, 5];//can raw & hour & day & month & week
							display = 3; //default month
							break;
					case 4: //<=1year
							list = [1, 2, 3, 5]; //can hour & day & month & week
							gridList = [1, 2, 3, 5];//can hour & day & month & week
							display = 3; //default month
							break;
					case 5: //<=2year
					case 6://<=10year
							list = [2, 3, 4, 5]; //can day & month & year & week
							gridList = [2, 3, 4, 5];//can day & month & year & week
							display = 3; //default month
							break;
			}
			interval.stepList = list;
			interval.display = display;
			interval.gridList = gridList;
			return interval;
		},
		getLimitInterval(timeRanges){
	    let timeRange = timeRanges[0];
	    let j2d = CommonFuns.DataConverter.JsonToDateTime;

	    let startTime = j2d(timeRange.StartTime, true),
	        endTime = j2d(timeRange.EndTime, true);

	    let interval = CommonFuns.getInterval(startTime, endTime);
	    return interval;
	  },
		getUomById(id){
			let uomArray = window.uoms;
			let uom;
			if(uomArray && uomArray.length>0){
				for(let i=0,len=uomArray.length; i<len; i++){
					uom = uomArray[i];
					if(uom.Id == id){
						return uom;
					}
				}
			}

			return null;
		},
		formatDateByStep: function (time, start, end, step) {
			var date = new Date(time),
					ft = I18N.DateTimeFormat.IntervalFormat,
					str = '', dateFormat= CommonFuns.dateFormat,
					dateAdd = CommonFuns.dateAdd,
					newDate;
			switch (step) {
					case 0: //raw 2010年10月3日23点45分-3日24点  2010年10月3日0点-0点15分
							{
									date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), Math.floor(date.getMinutes() / 15) * 15);

									str = dateFormat(date, ft.FullMinute);
									newDate = dateAdd(date, 15, 'minutes');
									if (newDate.getHours() < date.getHours()) {//2010年10月3日23点45分-3日24点
											str += '-' + I18N.EM.Clock24Minute0/*'24点:00分'*/ + dateFormat(date, ft.Minute).substr(5);
									}
									else {// 2010年10月3日0点-0点15分
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
											newDate = dateAdd(date, 1,'hours');
											if (newDate.getHours() < date.getHours()) {//2010年10月3日23点-3日24点
													str += '-' + I18N.EM.Clock24/*'24点'*/ + dateFormat(date, ft.FullHour).substr(2);
											}
											else {// 2010年10月3日0点-1点
													str += '-' + dateFormat(newDate, ft.FullHour);
											}
									} else {
											str = dateFormat(date, ft.FullHour);
											newDate = dateAdd(date, 1, 'hours');
											if (newDate.getHours() < date.getHours()) {//2010年10月3日23点-3日24点
													str += '-' + I18N.EM.Clock24/*'24点'*/;
											}
											else {// 2010年10月3日0点-1点
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
											}
											else if (newDate.getMonth() > date.getMonth()) {
													// 10/29-11/5,2010
													str = dateFormat(date, ft.MonthDate);
													str += '-' + dateFormat(newDate, ft.FullDay);
											}
											else {
													//10/3-10,2010
													str = dateFormat(date, ft.MonthDate);
													str += '-' + dateFormat(newDate, ft.Day) + ', ' + dateFormat(newDate, ft.Year);
											}
									} else {
											str = dateFormat(date, ft.FullDay);
											if (newDate.getFullYear() > date.getFullYear()) {
													//2010年12月29日-2011年1月5日
													str += '-' + dateFormat(newDate, ft.FullDay);
											}
											else if (newDate.getMonth() > date.getMonth()) {
													//2010年10月29日-11月5日
													str += '-' + dateFormat(newDate, ft.MonthDate);
											}
											else {
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
									if (newDate.getHours() < date.getHours()) {//2010年10月3日23点45分-3日24点
											str += '-' + I18N.EM.Clock24Minute0/*'24点:00分'*/ + dateFormat(date, ft.Minute).substr(5);
									}
									else {// 2010年10月3日0点-0点15分
											str += '-' + dateFormat(newDate, ft.Minute);
									}

									break;
							}
					case 7: //30mins 2010年10月3日23点45分-3日24点  2010年10月3日0点-0点15分
							{
									date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), Math.floor(date.getMinutes() / 30) * 30);

									str = dateFormat(date, ft.FullMinute);
									newDate = dateAdd(date, 30, 'minutes');
									if (newDate.getHours() < date.getHours()) {//2010年10月3日23点45分-3日24点
											str += '-' + I18N.EM.Clock24Minute0/*'24点:00分'*/ + dateFormat(date, ft.Minute).substr(5);
									}
									else {// 2010年10月3日0点-0点15分
											str += '-' + dateFormat(newDate, ft.Minute);
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
        decimalDigits=0;
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
	JazzCommon:{
		IsValidDate(date) {
	    if (typeof (date) === 'number') {
	        var earliest = new Date(2000, 0, 1).getTime();
	        var now = new Date().getTime();
	        return date >= earliest && date <= now;
	    }
	    else return date && date.getTime && (date >= new Date(2000, 0, 1)) && (date <= new Date());
		}
	}
};

module.exports = CommonFuns;
