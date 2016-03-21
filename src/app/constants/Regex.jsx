var Regex = {};

Regex.PositiveInt = /^\+?[1-9][0-9]*$/;
Regex.PositiveInterger = /^\d+$/;
//Regex.Positive = /^(([0-9]+[\.]?[0-9]+)|[1-9])$/;
Regex.Positive = /^0(\.(\d+)?)?$|^[1-9][0-9]*(\.(\d+)?)?$/;
Regex.ExcelCell = /[a-z]+\d+/i; //A4,AA66
Regex.Date = /((^((1[8-9]\d{2})|([2-9]\d{3}))-(10|12|0?[13578])-(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))-(11|0?[469])-(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))-(0?2)-(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)-(0?2)-(29)$)|(^([3579][26]00)-(0?2)-(29)$)|(^([1][89][0][48])-(0?2)-(29)$)|(^([2-9][0-9][0][48])-(0?2)-(29)$)|(^([1][89][2468][048])-(0?2)-(29)$)|(^([2-9][0-9][2468][048])-(0?2)-(29)$)|(^([1][89][13579][26])-(0?2)-(29)$)|(^([2-9][0-9][13579][26])-(0?2)-(29)$))/;

Regex.CodeRule = /^[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\:\;\.\~\+\%\\\/\|]+( +[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\:\;\.\~\+\%\\\/\|]+)*$/; // 不以空格开头和结尾的字符串，允许汉字，空格，a-z、A-Z、0-9、_、(、)、-、[、]、{、}、#、&、;、,、.、~、+、/、|、\、%。非空。用于code
Regex.NameRule = /^[\u4e00-\u9fa50-9a-zA-Z_][\u4e00-\u9fa50-9a-zA-Z_ ]*$/;
Regex.RealNameRule = /^[\u4e00-\u9fa5][\u4e00-\u9fa5]*$/;
Regex.CustomerNameRule = /^[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\:\;\.\~\+\%]+( +[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\:\;\.\~\+\%]+)*$/; // 不以空格开头和结尾的字符串，允许汉字，空格，a-z、A-Z、0-9、_、(、)、-、[、]、{、}、#、&、;、,、.、~、+、%。非空。用于Customer Nme
Regex.AddressNotNullRule = /^[\u4e00-\u9fa50-9a-zA-Z_-][\u4e00-\u9fa50-9a-zA-Z_\- ]*$/;
Regex.TelephoneRule = /^(\d)+(-(\d)+)*$/;
Regex.Email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
Regex.CommentRule = /^[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\:\;\.\~\+\%\\\/\|]+[\u4e00-\u9fa50-9a-zA-Z_\s\(\)\-\[\]\{\}\#\&\,\:\;\.\~\+\%\\\/\|]*$/;
Regex.CommonTextRule = /^[\u4e00-\u9fa50-9a-zA-Z_]*[\u4e00-\u9fa50-9a-zA-Z_ ]*$/;
Regex.CommonTextNotNullRule = /^[\u4e00-\u9fa50-9a-zA-Z_][\u4e00-\u9fa50-9a-zA-Z_ ]*$/;

Regex.PasswordRule1 = /[0-9]+/;
Regex.PasswordRule2 = /[a-zA-Z]+/;
Regex.PasswordRule3 = /^[0-9a-zA-Z_!@#$%^&*()][0-9a-zA-Z_!@#$%^&*()]*$/;
Regex.PasswordRule4 = /[ ]+/;

Regex.CodeMaxLength = 100;
Regex.NameMaxLength = 100;
Regex.CommentMaxLength = 200;
Regex.CommonTextMaxLength = 100;

Regex.CustomerNameMaxLength = 30;
Regex.UserNameMaxLength = 30;
Regex.RealNameMinLength = 2;
Regex.RealNameMaxLength = 8;
Regex.PasswordMinLength = 8;
Regex.PasswordMaxLength = 100;
Regex.EarliesTime = 949334400000;

Regex.UrlRule = /(((^https?)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;
//Regex.FactorRule = /^0(\.\d{1,6})?$|^[1-9][0-9]{0,8}(\.\d{1,6})?$/;
Regex.FactorRule = /^0(\.(\d{1,6})?)?$|^[1-9][0-9]{0,8}(\.(\d{1,6})?)?$/;
Regex.TagRule = /^\-?0(\.(\d{1,6})?)?$|^\-?[1-9][0-9]{0,8}(\.(\d{1,6})?)?$/;
Regex.ConsecutiveHoursRule = /^[1-9]\d{0,8}$|^0$/;
Regex.MeterCode = /^[^('"#$,<>|)]+$/;
Regex.CustomerCode = /^[^(?*:/'"#$,<>|)]+\\+$/;

module.exports = Regex;
