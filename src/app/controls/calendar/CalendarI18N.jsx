var dateTime = {};

dateTime["zh-cn"]={
	"shortMonthList":["01月","02月","03月","04月","05月","06月","07月","08月","09月","10月","11月","12月"],
	"shortDayList" : ['日', '一', '二', '三', '四', '五', '六'],
	"year":"年",
	"today":"今天"
};

dateTime["en-us"]={
	"shortMonthList": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct', 'Nov', 'Dec'],
	"shortDayList" : ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	"year":"",
	"today":"Today"
};

export default function(locale){
	return dateTime[locale.toLowerCase()];
};