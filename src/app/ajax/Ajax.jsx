'use strict';

import request from 'superagent';
import Path from 'constants/Path.jsx';
import Util from 'util/Util.jsx';
import Config from 'config';
import AjaxAction from '../actions/Ajax.jsx';
import remove from 'lodash-es/remove';


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
var reqList=[];
var _generatorRequest = function( url, type, params ) {
  var type = type.toLowerCase(),
    req = request[type](url/* url.split('?')[0] */);
  if( type === "get" ) {
    return req.query(params);
  } else {
    return req.send(params);
  }

};

function _addQueryUserId(pathname, UserId) {
  if( pathname.indexOf('?') !== -1 ) {
    return pathname + '&UserId=' + UserId;
  } else {
    return pathname + '?UserId=' + UserId;
  }
}

function _trackPageview(apiPath) {
  if( window._czc ) {
    let prevPath = window.location.href.substr(window.location.href.indexOf('/#/') + 2),
    nextPath = Config.APIBasePath + apiPath,
    UserId = Util.getCookie('UserId');
    if( UserId ) {
      prevPath = _addQueryUserId(prevPath, UserId);
      nextPath = _addQueryUserId(nextPath, UserId);
    }
    _czc.push(﻿['_trackPageview',nextPath,prevPath]);
  }
}

const API_WHITE_LIST = [
  '/common/setlanguage',
  '/AccessControl/ValidateUser',
  '/Common/ReqPwdReset',
  '/Common/resetpwd',
  '/user/trial',
  '/user/triallogin',
  '/sso/acs',
];

function checkUserId(url, userId) {
  if( userId ) {
    return true;
  }
  for( let i = 0; i < API_WHITE_LIST.length; i++ ) {
    if( new RegExp(API_WHITE_LIST[i]).test(url) ) {
      return true;
    }
  }
  return false;
}
function compare(array1, array2)
{
  if(typeof array1 !=='array' || typeof array2 !=='array') return false;
 return (array1.length === array2.length) && array1.every(function(element, index) {
    return element === array2[index];
})
}

var _ajax = function(url, options) {

  _trackPageview(url);

  if( !checkUserId(url, Util.getCookie('UserId')) ) {
    setTimeout( () => {
      AjaxAction.handleGlobalError(401)
    }, 0 );
    return false;
  }

	options = options || {};
  options.avoidDuplicate && options.tag && _abort(options.tag);
	var realUrl = Config.ServeAddress + Config.APIBasePath + url,
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

	var req =_generatorRequest(Config.ServeAddress + Config.APIBasePath + url, type, params)
    .send(params)
    .withCredentials()
    .set('Accept', dataType)
    .set('httpWebRequest.MediaType', dataType)
    .set('Content-Type', dataType)
    .end(function(err, res){
      if( options.noParseRes ) {
        return success.call(options, res);
      }
      if (res.ok && Util.isSuccess(res.body)) {
        success.call(options, Util.getResResult(res.body));
      } else {
        if(res.body){
          if (res.status == 401) {
            AjaxAction.handleGlobalError(401);
          }else {
            Util.ErrorHandler(options, res.body.error.Code);
          }
        } else if(res.text){
          let errorObj = JSON.parse(res.text);
          Util.ErrorHandler(options, errorObj.error.Code);
        }

          error.call(options, err, res);
      }
    });
  if( options.noParseRes ) {
    req.xhr.responseType = 'blob';
  }
    if (options.tag && !options.isBackService) {
      reqList.push({
        key: options.tag,
        value: req,
      });
    }
    return true;
};

var _abort = function (tag, startMatch) {

  if (startMatch) {
    var p = new RegExp("^" + tag + ".*", "i");
    reqList.forEach((item) => {
      if (p.test(item.key)) {
        if (item.value && item.value.abort) {
          item.value.abort();
          remove(reqList, (reqObj) => {
            return reqObj == item;
          });
          // hide loading dialog
          // if(item.loadingLocation){
          //   AjaxAction.ajaxStatusChange(AjaxStatus.AJAX_END, item.loadingLocation);
          // }
        }
      }
    });
  } else {
    reqList.forEach((item) => {
      if (item.key === tag || compare(item.key,tag)) {
        if (item.value && item.value.abort) {
          item.value.abort();
          remove(reqList, (reqObj) => {
            return reqObj == item;
          });
          // hide loading dialog
          // if(item.loadingLocation){
          //   AjaxAction.ajaxStatusChange(AjaxStatus.AJAX_END, item.loadingLocation);
          // }
        }
      }
    });
  }
};


var _ssoAjax = function(url, options) {
  _trackPageview(url);
  options = options || {};
  options.avoidDuplicate && options.tag && _abort(options.tag);
  var type = "get",
    params = options.params,
    success = options.success,
    error = options.error,
    dataType = "application/json";

  var req = _generatorRequest(url, type, params)
    .send(params)
    .withCredentials()
    .set('Accept', dataType)
    .set('httpWebRequest.MediaType', dataType)
    .set('Content-Type', dataType)
    .end(function(err, res) {
      // if( options.noParseRes ) {
      //   return success.call(options, res);
      // }
      if (res.ok) {
        success.call(options, Util.getResResult(res.body));
      } else {
        if (res.body) {
          if (res.status === 401) {
            AjaxAction.handleGlobalError(401);
          } else {
            Util.ErrorHandler(options, res.body.error.Code);
          }
        } else if (res.text) {
          let errorObj = JSON.parse(res.text);
          Util.ErrorHandler(options, errorObj.error.Code);
        }
        error.call(options, err, res);
      }
    });

  return true;
};

module.exports = {

	get: function(url, options) {
		options.type = 'get';
		_ajax(url, options);
	},

	post: function(url, options) {
		options.type = 'post';
		_ajax(url, options);
  },

  abort: function (tag, startMatch) {
    _abort(tag, startMatch);
  },

  sso: function(url, options) {
		_ssoAjax(url, options);
	},

};
