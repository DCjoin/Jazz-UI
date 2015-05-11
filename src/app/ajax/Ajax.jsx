'use strict';

import request from 'superagent';
import Path from '../constants/Path.jsx';
import Util from '../util/util.jsx';


/**
 *
 *  options：
 *		Stirng type: get or post
 *		Object params: request parameters
 *		Function success: success callback
 *		Function error: error callback
 *		String dataType: send params & get result type
 *
 */
var _ajax = function(url, options) {

	options = options || {};
	var realUrl = Path.APIBasePath + url,
		type = options.type || "get",
		params = options.params || {},

		success = options.success || function(resBody) {
			Util.log('Call Ajax Success: ' + realUrl);
			Util.log('body: ');
			Util.log(resBody);
		},

		error = options.error || function(err) {
			Util.log('Call Ajax Error: ' + realUrl);
			Util.log('err.response: ');
			Util.log(err && err.response);
		},

		dataType = options.dataType || "application/json";

	request[type.toLowerCase()](Path.APIBasePath + url)
		.send(params)
        .set('Accept', dataType)
        .set('httpWebRequest.MediaType', dataType)
        .set('Content-Type', dataType)
        .end(function(err, res){
        	if (res.ok && Util.isSuccess(res.body)) {
    			success.call(options, res.body.Result);
        	} else {
        		error.call(options, err, res);
        	}
        });
};

module.exports = {

	get: function(url, options) {
		options.type = 'get';
		_ajax(url, options);
	},

	post: function(url, options) {
		options.type = 'post';
		_ajax(url, options);
	}

};
