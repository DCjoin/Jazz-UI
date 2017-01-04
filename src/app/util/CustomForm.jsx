'use strict';

import _assign from "lodash/object/assign";
var _ = {assign:_assign};
/*
	_options: 以键值对形式接收form参数，参数名与html一致
*/
var CustomForm = function(_options) {

	const OPTIONS = {
		action: "",
		method: "post",
		// target: "_blank",
		name:'form1',
		id:'form1',
		enctype: "application/x-www-form-urlencoded"
	};

	var params 	= {},
		index 	= 1,
		form 	= document.createElement( 'form' );
		
	document.body.appendChild(form); //for fix IE11 bug

	_.assign( form , OPTIONS , _options );

	return {

		/*
			param： 以{name:"***", value:"***"}形式接收提交时的参数值，如传入值包含key，则进行更新
			返回值： 传入参数值，增加/更新 key与 node属性
		*/
		setParam: function(param) {

			var _param	= _.assign({}, param),
				node	= document.createElement( 'textarea' );

			node.name	= param.name;
			node.value	= param.value;
			// node.type='hidden';
			_param.node = node;

			if(_param.key) {
				form.replaceChild(node, params[_param.key].node);
			} else {
				_param.key = ++index;
				form.appendChild(node);
			}
			params[_param.key] = _param;
			return _param;
		},

		submit: function() {

			form.submit();
			document.body.removeChild(form);//for fix IE11 bug
		}

	};
};

module.exports = CustomForm;
