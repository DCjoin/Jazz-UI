'use strict';


module.exports = {
	isSuccess: function(data) {
		return data && data.Error == '0' && data.Result;
	},
	isObject: function(it) {
		return it !== null && (typeof it == 'object' && typeof it != 'function');
	},
	isFunction: function(it) {
		return it !== null && typeof it == 'function';
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
	}
};
