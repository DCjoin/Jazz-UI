'use static';

module.exports = {
	/*
   *  get value from sessionStorage test for continuous pull request
	 *  @param key:string
 	 *  @return value:string from sessionStorage fix bug #9
	 */
	get: function(key) {
		//debugger;
		var cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;
			for (; i < l; i++) {
				var parts = cookies[i].split('='),
					name = parts.shift(),
					cookie = parts.join('=');

				if (key === name) {
					return cookie;
				}
			}
		return "";
	},
	/*
   *  set sessionStorage key value
	 *  @param key:string
	 *  @param value:string
 	 *  @return void
	 */
	set: function(key, value, options) {
		options = options || {};
		if (typeof options.expires === 'number') {
			var days = options.expires, t = options.expires = new Date();
			t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
		}
		return (document.cookie = [
			key, '=', value,
			options.expires ? '; expires=' + options.expires.toUTCString() : '',
			"; path=",
			options.path    ? options.path : '/',
			options.domain  ? '; domain=' + options.domain : '',
			options.secure  ? '; secure' : ''
		].join(''));
	},
	remove: function (key) {

		return (document.cookie = "");
	}
};
