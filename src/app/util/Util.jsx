'use strict';
import Momment from 'moment';

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
};

module.exports = CommonFuns;
