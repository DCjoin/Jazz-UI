'use strict';


let I18N = {};
I18N.getResourceString = function(resName) {
  resName = resName.replace(/#/ig, '');
  var resource = I18N;
  var nsArray = resName.split('.');
  for (var i = 0; i < nsArray.length; i++) {
    resource = resource[nsArray[i]];
    if (resource === undefined) return undefined;
  }
  arguments[0] = resource;
  return I18N.format.apply(this, arguments);
};
I18N.format = function(res) {
  var regexp,
    matches,
    s = res,
    i;

  i = 1;
  for (; i < arguments.length; i++) {
    s = s.replace(new RegExp('\\{' + (i - 1) + '\\}'), arguments[i]);
  }

  regexp = /##(\w|\.)+##/ig;
  matches = s.match(regexp);
  i = 0;
  if (matches !== null) {
    for (; i < matches.length; i++) {
      s = s.replace(matches[i], I18N.getResourceString(matches[i]));
    }
  }

  return s.replace(/\{\d+\}/ig, '');
};

I18N.MainMenu = {};
I18N.MainMenu.Asset = '我的资产';
I18N.MainMenu.Alarm = '故障报警';
I18N.MainMenu.Maintain = '设备维护';
I18N.MainMenu.Setting = '设置';
I18N.MainMenu.Customer = '客户管理';
I18N.MainMenu.User = '用户管理';
I18N.MainMenu.DeviceTemplate = '台账模板';
I18N.MainMenu.ParameterTemplate = '参数模板';

I18N.MainMenu.Map = '地图';
I18N.MainMenu.Alarm = '报警';
I18N.MainMenu.Energy = '能源';
I18N.MainMenu.report = '报告';

I18N.Login = {};
I18N.Login.UserName = '用户名';
I18N.Login.Password = '密码';
I18N.Login.Logout = '注销';
I18N.Login.Login = '登陆';

I18N.M212001 = '用户不存在';
I18N.M212002 = '服务提供商无效';
I18N.M212003 = '服务提供商不存在';
I18N.M212004 = '服务商未生效';
I18N.M212005 = '用户未生效';
I18N.M212006 = '密码错误';
I18N.M212007 = '服务商域名不正确';

I18N.Common = {};
I18N.Common.Glossary = {};
I18N.Common.Glossary.HierarchyNode = '层级节点';

I18N.Common.Glossary.MonthName = {};
I18N.Common.Glossary.ShortMonth = {};
I18N.Common.Glossary.WeekDay = {};

I18N.Common.Glossary.MonthName.January = '一月';
I18N.Common.Glossary.MonthName.February = '二月';
I18N.Common.Glossary.MonthName.March = '三月';
I18N.Common.Glossary.MonthName.April = '四月';
I18N.Common.Glossary.MonthName.May = '五月';
I18N.Common.Glossary.MonthName.June = '六月';
I18N.Common.Glossary.MonthName.July = '七月';
I18N.Common.Glossary.MonthName.August = '八月';
I18N.Common.Glossary.MonthName.September = '九月';
I18N.Common.Glossary.MonthName.October = '十月';
I18N.Common.Glossary.MonthName.November = '十一月';
I18N.Common.Glossary.MonthName.December = '十二月';

I18N.Common.Glossary.ShortMonth.January = '一月';
I18N.Common.Glossary.ShortMonth.February = '二月';
I18N.Common.Glossary.ShortMonth.March = '三月';
I18N.Common.Glossary.ShortMonth.April = '四月';
I18N.Common.Glossary.ShortMonth.May = '五月';
I18N.Common.Glossary.ShortMonth.June = '六月';
I18N.Common.Glossary.ShortMonth.July = '七月';
I18N.Common.Glossary.ShortMonth.August = '八月';
I18N.Common.Glossary.ShortMonth.September = '九月';
I18N.Common.Glossary.ShortMonth.October = '十月';
I18N.Common.Glossary.ShortMonth.November = '十一月';
I18N.Common.Glossary.ShortMonth.December = '十二月';

I18N.Common.Glossary.WeekDay.Monday = '周一';
I18N.Common.Glossary.WeekDay.Tuesday = '周二';
I18N.Common.Glossary.WeekDay.Wednesday = '周三';
I18N.Common.Glossary.WeekDay.Thursday = '周四';
I18N.Common.Glossary.WeekDay.Friday = '周五';
I18N.Common.Glossary.WeekDay.Saturday = '周六';
I18N.Common.Glossary.WeekDay.Sunday = '周日';

I18N.Common.DateRange = {};
I18N.Common.DateRange.Last7Day = '最近7天';
I18N.Common.DateRange.Last30Day = '最近30天';
I18N.Common.DateRange.Last12Month = '最近12月';
I18N.Common.DateRange.Today = '今天';
I18N.Common.DateRange.Yesterday = '昨天';
I18N.Common.DateRange.ThisWeek = '本周';
I18N.Common.DateRange.LastWeek = '上周';
I18N.Common.DateRange.ThisMonth = '本月';
I18N.Common.DateRange.LastMonth = '上月';
I18N.Common.DateRange.ThisYear = '今年';
I18N.Common.DateRange.LastYear = '去年';
I18N.Common.DateRange.Customerize = '自定义';
I18N.Common.DateRange.CustomerizeTime = '自定义';
I18N.Common.DateRange.RelativedTime = '相对时间';

I18N.Common.Glossary.Order = {};
I18N.Common.Glossary.Order.Ascending = '升序';
I18N.Common.Glossary.Order.Descending = '降序';
I18N.Common.Glossary.Order.All = '全部';
I18N.Common.Glossary.Order.Rank3 = '前3名';
I18N.Common.Glossary.Order.Rank5 = '前5名';
I18N.Common.Glossary.Order.Rank10 = '前10名';
I18N.Common.Glossary.Order.Rank20 = '前20名';
I18N.Common.Glossary.Order.Rank50 = '前50名';

I18N.Common.Button = {};
I18N.Common.Button.Calendar = {};
I18N.Common.Button.Calendar.ShowHC = '冷暖季';
I18N.Common.Button.Calendar.ShowHoliday = '非工作时间';
I18N.Common.Button.Show = '查看';

I18N.Common.CarbonUomType = {};
I18N.Common.CarbonUomType.StandardCoal = '标煤';
I18N.Common.CarbonUomType.CO2 = '二氧化碳';
I18N.Common.CarbonUomType.Tree = '树';

I18N.DateTimeFormat = {};
I18N.DateTimeFormat.HighFormat = {};
I18N.DateTimeFormat.HighFormat.Millisecond = '%H点%M分%S秒%L毫秒';
I18N.DateTimeFormat.HighFormat.Second = '%H点%M分%S秒';
I18N.DateTimeFormat.HighFormat.Minute = '%H点%M分';
I18N.DateTimeFormat.HighFormat.Hour = '%H点';
I18N.DateTimeFormat.HighFormat.Day = '%m月%d日';
I18N.DateTimeFormat.HighFormat.Dayhour = '%m月%d日%H点';
I18N.DateTimeFormat.HighFormat.Week = '%m月%d日';
I18N.DateTimeFormat.HighFormat.Month = '%m月';
I18N.DateTimeFormat.HighFormat.Fullmonth = '%Y年%m月';
I18N.DateTimeFormat.HighFormat.Year = '%Y年';
I18N.DateTimeFormat.HighFormat.FullDateTime = '%Y年%m月%d日 %H点%M分%S秒';
I18N.DateTimeFormat.HighFormat.FullDate = '%Y年%m月%d日';
I18N.DateTimeFormat.HighFormat.FullYear = '全年';

I18N.DateTimeFormat.IntervalFormat = {};
I18N.DateTimeFormat.IntervalFormat.Second = 'YYYY年MM月DD日 HH点mm分ss秒';
I18N.DateTimeFormat.IntervalFormat.FullMinute = 'YYYY年MM月DD日 HH点mm分';
I18N.DateTimeFormat.IntervalFormat.RangeFullMinute = 'YYYY年MM月DD日 HH点mm分';
I18N.DateTimeFormat.IntervalFormat.Minute = 'HH点mm分';
I18N.DateTimeFormat.IntervalFormat.FullHour = 'YYYY年MM月DD日HH点';
I18N.DateTimeFormat.IntervalFormat.Hour = 'HH点';
I18N.DateTimeFormat.IntervalFormat.FullDay = 'YYYY年MM月DD日';
I18N.DateTimeFormat.IntervalFormat.Day = 'DD日';
I18N.DateTimeFormat.IntervalFormat.Week = 'YYYY年MM月DD日';
I18N.DateTimeFormat.IntervalFormat.Month = 'YYYY年MM月';
I18N.DateTimeFormat.IntervalFormat.MonthDate = 'MM月DD日';
I18N.DateTimeFormat.IntervalFormat.Year = 'YYYY年';
I18N.DateTimeFormat.IntervalFormat.FullDateTime = 'YYYY年MM月DD日 HH点mm分ss秒';
I18N.DateTimeFormat.IntervalFormat.FullDate = 'YYYY年MM月DD日';
I18N.DateTimeFormat.IntervalFormat.MonthDayHour = 'm月d日H点';
I18N.DateTimeFormat.IntervalFormat.DayHour = 'd日H点';

I18N.EM = {};
I18N.EM.To = '到';
I18N.EM.Week = '周';
I18N.EM.Raw = '分钟';
I18N.EM.Hour = '小时';
I18N.EM.Day = '天';
I18N.EM.Month = '月';
I18N.EM.Year = '年';
I18N.EM.Clock24 = '24点';
I18N.EM.Clock24InWidget = '24点';
I18N.EM.Clock24Minute0 = '24点00分';

I18N.EM.UseRaw = '按分钟';
I18N.EM.UseWeek = '按周';
I18N.EM.UseHour = '按小时';
I18N.EM.UseDay = '按天';
I18N.EM.UseMonth = '按月';
I18N.EM.UseYear = '按年';
I18N.EM.StepError = '所选数据点不支持{0}的步长显示，换个步长试试。';

I18N.EM.Tool = {};
I18N.EM.Tool.ClearChart = '清空图表';
I18N.EM.Tool.AssistCompare = '辅助分析';
I18N.EM.Tool.Weather = {};
I18N.EM.Tool.Weather.WeatherInfo = '天气信息';
I18N.EM.Tool.Weather.Temperature = '温度';
I18N.EM.Tool.Weather.Humidity = '湿度';
I18N.EM.Tool.Calendar = {};
I18N.EM.Tool.Calendar.BackgroundColor = '日历背景色';
I18N.EM.Tool.Calendar.NoneWorkTime = '非工作时间';
I18N.EM.Tool.Calendar.HotColdSeason = '冷暖季';
I18N.EM.Tool.Benchmark = '行业基准值';
I18N.EM.Tool.HistoryCompare = '历史对比';
I18N.EM.Tool.BenchmarkSetting = '基准值设置';
I18N.EM.Tool.DataSum = '数据求和';

I18N.EM.KpiModeEM = '能耗';
I18N.EM.KpiModeCarbon = '碳排放';
I18N.EM.KpiModeCost = '成本';

I18N.EM.ErrorNeedValidTimeRange = '请选择正确的时间范围';


I18N.EM.Rank = {};
I18N.EM.Rank.TotalRank = '总排名';
I18N.EM.Rank.RankByPeople = '人均排名';
I18N.EM.Rank.RankByArea = '单位面积排名';
I18N.EM.Rank.RankByHeatArea = '单位采暖面积排名';
I18N.EM.Rank.RankByCoolArea = '单位供冷面积排名';
I18N.EM.Rank.RankByRoom = '单位客房排名';
I18N.EM.Rank.RankByUsedRoom = '单位已用客房排名';
I18N.EM.Rank.RankByBed = '单位床位排名';
I18N.EM.Rank.RankByUsedBed = '单位已用床位排名';
I18N.EM.Rank.HierTitle = '请选择层级节点进行排名';
I18N.EM.Rank.RankName = '排名';
I18N.EM.Rank.RankTooltip = '排名:{0}/{1}';

I18N.EM.Unit = {};
I18N.EM.Unit.UnitOriginal = '指标原值';
I18N.EM.Unit.UnitPopulationAlias = '人均';
I18N.EM.Unit.UnitPopulation = '单位人口';
I18N.EM.Unit.UnitArea = '单位面积';
I18N.EM.Unit.UnitColdArea = '单位供冷面积';
I18N.EM.Unit.UnitWarmArea = '单位采暖面积';
I18N.EM.Unit.UnitRoom = '单位客房';
I18N.EM.Unit.UnitUsedRoom = '单位已用客房';
I18N.EM.Unit.UnitBed = '单位床位';
I18N.EM.Unit.UnitUsedBed = '单位已用床位';

I18N.EM.DayNightRatio = '昼夜比';
I18N.EM.WorkHolidayRatio = '工休比';

I18N.EM.Ratio = {};
I18N.EM.Ratio.CaculateValue = '计算值';
I18N.EM.Ratio.RawValue = '原始值';
I18N.EM.Ratio.TargetValue = '目标值';
I18N.EM.Ratio.BaseValue = '基准值';



I18N.EM.Total = '总览';
I18N.EM.Plain = '平时';
I18N.EM.Valley = '谷时';
I18N.EM.Peak = '峰时';
I18N.EM.ByPeakValley = '峰谷展示';

I18N.EM.EnergyAnalyse = {};
I18N.EM.EnergyAnalyse.AddIntervalWindow = {};
I18N.EM.EnergyAnalyse.AddIntervalWindow.Title = '历史数据对比';
I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePreviousComboLabel = '之前第';
I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious7Day = '个7天';
I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious30Day = '个30天';
I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious12Month = '个12月';

I18N.EM.CannotShowCalendarByStep = '当前步长不支持显示{0}背景色';
I18N.EM.CannotShowCalendarByTimeRange = '看不到日历背景？换个时间段试试';
I18N.EM.WeatherSupportsOnlySingleHierarchy = '该功能仅支持单层级数据点。';
I18N.EM.WeatherSupportsOnlyHourlyStep = '该功能仅支持小时步长。';

I18N.EM.CharType = {};
I18N.EM.CharType.Line = '折线图';
I18N.EM.CharType.Bar = '柱状图';
I18N.EM.CharType.Stack = '堆积图';
I18N.EM.CharType.Pie = '饼状图';
I18N.EM.CharType.RawData = '原始数据';

I18N.EM.Legend = {};
I18N.EM.Legend.ToLine = '切换至折线图显示';
I18N.EM.Legend.ToColumn = '切换至柱状图显示';
I18N.EM.Legend.ToStacking = '切换至堆积图显示';

//workday
I18N.Setting = {};
I18N.Setting.Calendar = {};
I18N.Setting.Calendar.WorkDay = '工作日';
I18N.Setting.Calendar.Holiday = '非工作日';
I18N.Setting.Calendar.DefaultWorkDay = '默认工作日：周一至周五';
I18N.Setting.Calendar.AdditionalDay = '补充日期';
I18N.Setting.Calendar.ItemType = '日期类型';
I18N.Setting.Calendar.StartDate = '开始日期';
I18N.Setting.Calendar.EndDate = '结束日期';
I18N.Setting.Calendar.Month = '月';
I18N.Setting.Calendar.StartMonth = '开始月份';
I18N.Setting.Calendar.EndMonth = '结束月份';
I18N.Setting.Calendar.Date = '日';
I18N.Setting.Calendar.SeansonType = '季节类型';
I18N.Setting.Calendar.MonthDayFromTo = '{0}月{1}日到{2}月{3}日';

I18N.Setting.Calendar.WarmSeason = '采暖季';
I18N.Setting.Calendar.ColdSeason = '供冷季';

I18N.Setting.Benchmark = {};
I18N.Setting.Benchmark.Label = {};
I18N.Setting.Benchmark.Label.None = '无';
I18N.Setting.Benchmark.Label.SelectLabelling = '请选择能效标识';

I18N.Setting.Labeling = {};
I18N.Setting.Labeling.Label = {};

I18N.Setting.Labeling.Label.Industry = '行业';
I18N.Setting.Labeling.Label.ClimateZone = '气候分区';
I18N.Setting.Labeling.Label.CustomizedLabeling = '自定义能效标识';
I18N.Setting.Labeling.Label.Labeling = '能效标识';
I18N.Setting.Labeling.Label.LabelingSetting = '能效标识配置';
I18N.Setting.Labeling.Label.IndustryLabeling = '行业能效标识';
I18N.Setting.Labeling.Label.IndustryLabelingSetting = '行业能效标识配置';
I18N.Setting.Labeling.Label.LabelingGrade = '能效标识级别';
I18N.Setting.Labeling.Label.DataYear = '数据来源';

I18N.Setting.TargetBaseline = {};
I18N.Setting.TargetBaseline.AlarmThreshold = '报警敏感度';
I18N.Setting.TargetBaseline.AlarmThresholdTip = '当数据高于基准值所设的敏感度时，显示报警。';

I18N.Setting.User = {};
I18N.Setting.User.EnergyConsultant = '能源工程顾问';
I18N.Setting.User.Technicist = '技术人员';
I18N.Setting.User.CustomerManager = '客户管理员';
I18N.Setting.User.PlatformManager = '平台管理员';
I18N.Setting.User.EnergyManager = '能源经理';
I18N.Setting.User.EnergyEngineer = '能源工程师';
I18N.Setting.User.DeptManager = '部门经理';
I18N.Setting.User.Manager = '管理层';
I18N.Setting.User.BusinessPerson = '业务人员';
I18N.Setting.User.Sales = '销售人员';
I18N.Setting.User.ServerManager = '服务商管理员';

I18N.Common.Label = {};
I18N.Common.Label.UnknownError = '抱歉，发生未知错误。';

I18N.Message = {};

I18N.Message.DeletionConcurrency = '该{0}已不存在，马上为您刷新。';
I18N.Message.UpdateConcurrency = '该{0}已被修改，马上为您刷新。';
I18N.Message.CustomerUnavailable = '抱歉，该客户不存在或无访问权限，请退出系统后重新登录。';

I18N.Message.M1 = '服务器错误。';
I18N.Message.M8 = '您没有该功能权限。';
I18N.Message.M9 = '您没有该数据权限。';

I18N.Message.M01002 = '层级的ID非法，无法获取高级属性。';
I18N.Message.M01006 = '该编码已存在';
I18N.Message.M01010 = '该名称已存在';
I18N.Message.M01011 = '该层级树的父节点已被删除，无法保存该节点。';
I18N.Message.M01012 = '该层级节点包含子节点，无法删除。';
I18N.Message.M01013 = '该层级节层级超限';
I18N.Message.M01014 = '该节点已被其他用户修改或删除，层级树将被刷新。';
I18N.Message.M01015 = '当前层级节点无子节点'; //for energy view single tag to pie chart
I18N.Message.M01016 = '相关的层级无有效日历，无法获得本年的目标值和基准值。';
I18N.Message.M01018 = '无法移动到目标节点下，请按照规则拖动层级节点：<br/>组织->组织、客户；<br/>园区->组织、客户；<br/>楼宇->园区、组织、客户。';
I18N.Message.M01019 = '层级被修改';
I18N.Message.M01251 = '该层级节点的高级属性已被其他用户修改。界面即将刷新';
I18N.Message.M01254 = '高级属性的输入项非法，无法保存。';
I18N.Message.M01301 = '日历已被其他用户修改。';
I18N.Message.M01302 = '已为本节点创建了日历，不能重复创建。';
I18N.Message.M01304 = '该数据点未与任何层级关联';
I18N.Message.M01305 = '与该数据点相关的层级未配置日历属性，无法进行计算。';
I18N.Message.M01306 = '时间区间重叠，请检查。';
I18N.Message.M01401 = '该层级节点上已有系统维度设置，无法删除。';
I18N.Message.M01402 = '该层级节点上已有区域维度设置，无法删除。';
I18N.Message.M01405 = '该层级节点上已有日历设置，无法删除。';
I18N.Message.M01406 = '该层级节点上已有成本设置，无法删除。';
I18N.Message.M01407 = '该层级节点上已有高级属性设置，无法删除。';
I18N.Message.M01408 = '该层级节点上已有数据点关联，无法删除。';

//building picture
I18N.Message.M01503 = '只允许上传jpg/png格式图片，请重新上传。';
I18N.Message.M01504 = '图片文件太大，请您重新上传。';
I18N.Message.M01505 = '图片尺寸太小，请您重新上传。';
I18N.Message.M01506 = '图片尺寸太大，请您重新上传。';
I18N.Message.PictureUploadFailed = '图片上传失败，请稍后再试。';

/******
Energy Error Code
*******/
I18N.Message.M02004 = '聚合粒度非法';
I18N.Message.M02007 = '开始时间不能大于结束时间';
I18N.Message.M02008 = '介质不同，不能绘制饼图。';
I18N.Message.M02011 = '计算数据V类型的数据点不支持原始数据查看功能';
I18N.Message.M02013 = '该数据点已被删除，无法加载。';
I18N.Message.M02020 = '导出图表失败，请点击“查看数据”后再重试。';
I18N.Message.M02021 = '导出EXCEL失败，请点击“查看数据”后再重试。';
I18N.Message.M02104 = '无法转换非能耗组介质单位';
I18N.Message.M02105 = '抱歉，发生了错误，无法绘制饼图。';
I18N.Message.M02106 = '抱歉，发生了错误，无法绘制饼图。';
I18N.Message.M02107 = '抱歉，发生了错误，无法绘制饼图。';
I18N.Message.M02108 = '介质单位性质不同，无法转换';
I18N.Message.M02109 = '介质不同，无法转换为常用单位';
I18N.Message.M02114 = '数据点无法转换为统一单位';
I18N.Message.M02017 = '数据点关联发生变化，无法绘图';
I18N.Message.M02203 = '该数据点不存在，无法获取目标值基准值。';
I18N.Message.M02205 = '昼夜比关键能效指标不支持按小时展示';
I18N.Message.M02301 = '该层级节点不存在。';
I18N.Message.M02023 = '所选数据点介质不同，无法共同绘制饼状图！';
I18N.Message.M02009 = '没有数据权限或权限已被修改，无法查询数据';
I18N.Message.M02407 = '峰谷平电价展示不支持按分钟/小时展示';
I18N.Message.M02408 = '该节点未设置峰谷时段，无法展示';
I18N.Message.M02027 = '该异常记录中数据点的步长小于当前支持的最小步长，无法查看。';

I18N.Message.M02601 = '缺少昼夜日历的部分，无法绘图。请设置后再试。'; //'{0}所对应的层级节点没有设置昼夜日历，无法查看昼夜比数据';
I18N.Message.M02602 = '缺少工作日历的部分，无法绘图。请设置后再试。'; //'{0}所对应的层级节点没有设置工作日历，无法查看公休比数据';
I18N.Message.M02603 = '缺少总面积的部分，无法绘图。请设置后再试。';
I18N.Message.M02604 = '缺少供冷面积的部分，无法绘图。请设置后再试。';
I18N.Message.M02605 = '缺少采暖面积的部分，无法绘图。请设置后再试。';
I18N.Message.M02606 = '缺少人口数量的部分，无法绘图。请设置后再试。';

I18N.Message.M02500 = '该数据点未与任何层级关联';
I18N.Message.M02501 = '缺少人口属性的部分无法绘图。请设置后再试。';
I18N.Message.M02502 = '缺少面积属性的部分无法绘图。请设置后再试。';
I18N.Message.M02503 = '缺少采暖面积属性的部分无法绘图。请设置后再试。';
I18N.Message.M02504 = '缺少供冷面积属性的部分无法绘图。请设置后再试。';

I18N.Message.M02505 = '缺少人口属性的部分无法绘图。请设置后再试。';
I18N.Message.M02506 = '缺少面积属性的部分无法绘图。请设置后再试。';
I18N.Message.M02507 = '缺少采暖面积属性的部分无法绘图。请设置后再试。';
I18N.Message.M02508 = '缺少供冷面积属性的部分无法绘图。请设置后再试。';
I18N.Message.M02509 = '该能效标识已被删除，请重新选择以查看。';
I18N.Message.M02510 = '该能效标识无数据，请重新选择以查看。';
I18N.Message.M02511 = '缺少客房属性的部分无法绘图。请设置后再试。';
I18N.Message.M02512 = '缺少已用客房属性的部分无法绘图。请设置后再试。';
I18N.Message.M02513 = '缺少床位属性的部分无法绘图。请设置后再试。';
I18N.Message.M02514 = '缺少已用床位属性的部分无法绘图。请设置后再试。';
I18N.Message.M02515 = '缺少客房属性的部分无法绘图。请设置后再试。';
I18N.Message.M02516 = '缺少已用客房属性的部分无法绘图。请设置后再试。';
I18N.Message.M02517 = '缺少床位属性的部分无法绘图。请设置后再试。';
I18N.Message.M02518 = '缺少已用床位属性的部分无法绘图。请设置后再试。';
I18N.Message.M02701 = '所选层级部分删除，无法排名。';
I18N.Message.M02809 = '所选数据点所在地区暂不支持天气信息，无法显示。';
I18N.Message.M02810 = '所选数据点所在地区暂不支持天气信息，无法显示。';

/******
 * Carbon
 ******/
I18N.Message.M03005 = '转换因子重复，界面即将刷新。';
I18N.Message.M03008 = '该转换物与转换目标不匹配，无法保存转换因子。';

/******
 * TOU Tariff Error Code
 ******/
I18N.Message.M03025 = '价格策略配置已被他人修改，界面即将刷新。';
I18N.Message.M03029 = '峰值季节不存在，界面即将刷新。';
I18N.Message.M03030 = '不能保存空的价格策略。';
I18N.Message.M03032 = '未设置平时电价，请确保峰时区间和谷时区间充满24小时。';
I18N.Message.M03033 = '价格策略必须包含峰时电价和谷时电价。';
I18N.Message.M03034 = '峰值季节时间区间为空，无法保存。';
I18N.Message.M03035 = '时间区间重叠，请检查。';
I18N.Message.M03038 = '价格策略已被引用，不可删除。';
I18N.Message.M03039 = '峰值季节时间区间为空，无法保存。';
I18N.Message.M03040 = '该名称已存在';
I18N.Message.M03041 = '峰值季节已存在';
I18N.Message.M03042 = '该输入项只能是正数';

/******
 * Calendar
 ******/
I18N.Message.M03052 = '日历的结束日期必须大于等于开始日期。';
I18N.Message.M03053 = '时间区间重叠，请检查。';
I18N.Message.M03054 = '该名称已存在';
I18N.Message.M03057 = '结束时间必须大于开始时间。';
I18N.Message.M03058 = '日历已被引用，不可删除。'; //--------------
I18N.Message.M03059 = '二月日期不能为29/30/31。';
I18N.Message.M03060 = '小月日期不能为31。';
I18N.Message.M03061 = '至少添加一个采暖季或者供冷季。';
I18N.Message.M03062 = '采暖季与供冷季时间段不能在同一月份内。';
I18N.Message.M03063 = '采暖季与供冷季时间段相差不能小于7天。';
I18N.Message.M03902 = '价格策略名称超过100个字符';
I18N.Message.M03903 = '价格策略名称中包含非法字符';

/*****
labeling
******/
I18N.Message.M03080 = '能效标识已存在，界面将被刷新。';
I18N.Message.M03081 = '能效标识已被删除，界面将被刷新。';
I18N.Message.M03082 = '能效标识已被其他用户修改，界面将被刷新。';
I18N.Message.M03083 = '能效标识没有设置区域。';
I18N.Message.M03084 = '能效标识级别错误。';
I18N.Message.M03085 = '能效标识数据来源年份错误。';

/******
SystemDimension Error Code, NOTE that for error of
04050,04052,04053,04054,
refresh is needed.
04051 should refresh hierarchy tree
*******/
I18N.Message.M04052 = '勾选当前维度节点前，必须确保它的父节点已被勾选。';
I18N.Message.M04054 = '反勾选当前维度节点前，必须确保它的所有子节点未被勾选。';
I18N.Message.M04055 = '当前系统维度节点无子节点'; //for energy view single tag to pie chart
I18N.Message.M04056 = '无法删除该系统维度节点。请先删除该节点下的所有数据点关联关系。';
/******
Dashboard Error Code, NOTE that for error of
05002
refresh is needed.
05011 should refresh hierarchy tree
*******/
I18N.Message.M05001 = '该名称已存在';
I18N.Message.M05011 = '该仪表盘对应的层级节点已经被删除，马上为您刷新 。';
I18N.Message.M05013 = '该层级节点的仪表盘数量已达上限，请删除部分内容后继续。';
I18N.Message.M05014 = '“我的收藏”内容已达上限，请删除部分内容后继续。';
I18N.Message.M05015 = '该名称已存在';
I18N.Message.M05016 = '当前的仪表盘的小组件数量已达上限，无法创建新的小组件。';
I18N.Message.M05017 = '所有小组件的仪表盘的Id不完全一致。';

I18N.Message.M05023 = '{0}{1}';
I18N.Message.M05023_Sub0 = '以下用户Id已被删除：{0}。';
I18N.Message.M05023_Sub1 = '无法分享给这些人：{0}。';
I18N.Message.M05032 = '该名称已存在';

/******
Tag Error Code, NOTE that for error of 06001, 06117,06152,06139,06154,06156, refresh is needed.
*******/

I18N.Message.M06100 = '数据点已经被删除，无法加载。';
I18N.Message.M06104 = '该名称已存在';
I18N.Message.M06107 = '该编码已存在';
I18N.Message.M06109 = '该通道已存在';
I18N.Message.M06122 = '该名称已存在';
I18N.Message.M06127 = '该编码已存在';
I18N.Message.M06133 = '计算公式的格式有误，请检查。';
I18N.Message.M06134 = '虚拟数据点的计算公式包含非法的数据点，无法保存。';
I18N.Message.M06136 = '虚拟数据点的计算公式包含循环调用，无法保存。';

I18N.Message.M06156 = '虚拟数据点的计算公式包含非法的数据点，无法保存。';
I18N.Message.M06160 = '物理数据点的介质与单位不匹配，无法保存。';
I18N.Message.M06161 = '虚拟数据点的介质与单位不匹配，无法保存。';
I18N.Message.M06164 = '虚拟数据点的计算步长非法，无法保存。';
I18N.Message.M06174 = '物理数据点的类型非法，无法保存。';
I18N.Message.M06182 = '{0}"{1}"正在被引用，无法删除。请取消所有引用后再试。<br/>引用对象：{2}';
I18N.Message.M06183 = '数据点已经过期，可能该数据点已被他人修改或删除。界面即将刷新。';
I18N.Message.M06186 = '对应节点下已存在相同介质的能耗数据点。';
I18N.Message.M06192 = '昼夜比数据点的计算步长必须大于等于天。';
I18N.Message.M06193 = '当前层级节点的子节点下不包含与该数据点介质相同的数据点';
I18N.Message.M06194 = '当前系统维度的子节点下不包含与该数据点介质相同的数据点';
I18N.Message.M06195 = '当前区域维度的子节点下不包含与该数据点介质相同的数据点';
I18N.Message.M06196 = '当前层级节点不包含与该数据点介质单位相同的数据点';
I18N.Message.M06197 = '当前系统维度不包含与该数据点介质单位相同的数据点';
I18N.Message.M06198 = '当前区域维度不包含与该数据点介质单位相同的数据点';
I18N.Message.M06201 = '无法将计算步长修改为“{0}”。本数据点与其他数据点存在引用关系，引用数据点的计算步长必须大于等于被引用数据点的计算步长。';
I18N.Message.M06202 = '对应节点下已存在相同介质的能耗数据点。';
I18N.Message.M06203 = '该数据点不是能耗数据。';


I18N.Message.M07001 = '数据权限已被其他用户修改，界面将被刷新。';
I18N.Message.M07000 = '没有功能权限。';
I18N.Message.M07009 = '没有数据权限。';

I18N.Message.M07010 = '该名称已存在';
I18N.Message.M07011 = '角色已绑定用户，无法删除。';
I18N.Message.M07021 = '层级节点不存在或已被删除，界面将被刷新。';

/*
AreaDimensionNodeNameDuplicate = 208,
AreaDimensionNodeLevelOverLimitation = 209,
AreaDimensionNodeHasNoParent = 210,
AreaDimensionNodeHasBeenDeleted = 211,
AreaDimensionNodeHasChildren = 212,
AreaDimensionNodeHasBeenModified = 213,
*/
I18N.Message.M08200 = '关联维度节点的层级节点已被删除，界面将被刷新。';
I18N.Message.M08208 = '名称重复';
I18N.Message.M08209 = '当前的维度节点的级次超出最大长度，无法保存。';
I18N.Message.M08210 = '当前的维度节点的父节点已被删除，界面将被刷新。';
I18N.Message.M08211 = '当前的维度节点已被他人删除，界面将被刷新。';
I18N.Message.M08212 = '无法删除该区域维度节点。请先删除该节点下的所有子节点。';
I18N.Message.M08214 = '当前区域维度节点无子节点'; //for energy view single tag to pie chart
I18N.Message.M08215 = '无法删除该区域维度节点。请先删除该节点下的所有数据点关联关系。';

I18N.Message.M09001 = '数据已被删除，界面将被刷新。';
I18N.Message.M09002 = '数据已被他人修改，界面将被刷新。';
I18N.Message.M09107 = '数据已被他人修改，请点击“确定”开始重新加载数据。';
I18N.Message.M09112 = '对应的数据点已被删除，马上为您刷新。';
I18N.Message.M09113 = '计算前请先设置计算规则。';
I18N.Message.M09114 = '值超过合法范围，无法保存。合法的值范围为-999999999.999999～999999999.999999。';
I18N.Message.M09155 = I18N.format(I18N.Message.UpdateConcurrency, '计算值');
I18N.Message.M09157 = '对应的数据点已被删除，马上为您刷新。';
I18N.Message.M09158 = '数据点未被关联至层级树和维度树，请先将数据点关联。';
I18N.Message.M09159 = '数据点所关联的层级树日历属性为空，请先为层级树设置日历。';
I18N.Message.M09160 = '数据点所关联的层级树日历属性该年数据为空，请先为层级树设置该年日历属性。';

//Cost concurrency error
I18N.Message.M10007 = '峰谷平电价展示不支持按小时展示';
I18N.Message.M10015 = '已经存在同层级节点的数据,界面将被刷新';
I18N.Message.M10019 = '需量成本Tag为无效数据';
I18N.Message.M10020 = '无功电量Tag为无效数据';
I18N.Message.M10021 = '有功电量Tag为无效数据';

I18N.Message.M11012 = '该客户被层级引用，不能删除！';
I18N.Message.M11351 = '编码重复';
I18N.Message.M11352 = '该名称已存在';
I18N.Message.M11354 = '图片文件太大，请您重新上传。';
I18N.Message.M11355 = '图片尺寸太大，请您重新上传。';
I18N.Message.M11356 = '只允许上传GIF/PNG格式图片，请重新上传';
I18N.Message.M11357 = '客户信息已被其他用户删除，界面将被刷新。';
I18N.Message.M11358 = '客户已被其他数据引用，不能删除。';
I18N.Message.M11404 = '该客户被用户引用，不能删除。';
I18N.Message.M11408 = '该客户被数据点引用，不能删除。';


I18N.Message.M12001 = '该名称已存在';
I18N.Message.M12003 = '登录密码错误';
I18N.Message.M12006 = '默认平台管理员账户不可删除。';
I18N.Message.M12008 = '用户已被删除。界面将刷新。';
I18N.Message.M12009 = '您不能删除自己的账户。';
I18N.Message.M12010 = '您不能修改别人的密码。';
I18N.Message.M12011 = '您不能修改别人的资料。';
I18N.Message.M12050 = '图片文件太大，上传失败。请重新上传。';
I18N.Message.M12051 = '请上传jpg/png/gif/bmp格式图片';
I18N.Message.M12052 = '意见反馈邮件发送失败。';
I18N.Message.M12100 = '用户名不存在';
I18N.Message.M12101 = '邮箱地址错误';
I18N.Message.M12102 = '重置密码的链接地址错误';
I18N.Message.M12103 = '链接已经失效！';
I18N.Message.M12105 = '服务商已经暂停！请联系管理员。';
I18N.Message.M12106 = '服务商已经删除！请联系管理员。';
I18N.Message.M12107 = '您的用户被删除了！请联系管理员。';
I18N.Message.M12108 = '非试用用户，不能发送！';


I18N.Message.M13001 = '数据点已经被其他用户删除！';
I18N.Message.M13002 = '报警已经被其他用户删除！';
I18N.Message.M13003 = '报警已经被其他用户修改！';
I18N.Message.M13011 = '日历已经被其他用户删除！';

I18N.Message.M13015 = '报警已经被其他用户配置！';
I18N.Message.M13016 = '用户已经被其他用户删除！';

I18N.Message.M14001 = '服务商已经被其他用户修改！';
I18N.Message.M14002 = '服务商ID重复！';
I18N.Message.M14003 = '服务商已经被其他用户删除！';
I18N.Message.M14004 = '服务商已经暂停！';
I18N.Message.M14005 = '服务商没有管理员！';
I18N.Message.M14006 = '服务商正在建立中，请稍后再试！';

I18N.Message.M11364 = '地图页信息已存在，界面将被刷新';
I18N.Message.M11365 = '至少包含一个地图页信息';
I18N.Message.M11366 = '客户已被删除，界面将被刷新';
I18N.Message.M11367 = '地图页信息已被他人修改，界面即将刷新。';
I18N.Message.M03070 = '行业对标已存在，界面将被刷新。';
I18N.Message.M03071 = '行业对标已被删除，界面将被刷新。';
I18N.Message.M03072 = '行业对标已被其他用户修改，界面将被刷新。';
I18N.Message.M03073 = '行业对标没有设置区域。';
I18N.Message.M01500 = '地图信息已存在，界面将被刷新。';
I18N.Message.M01501 = '地图信息已被其他用户删除，界面将被刷新。';
I18N.Message.M01502 = '地图信息已被其他用户修改，界面将被刷新。';
I18N.Message.M01507 = '楼宇节点已被其他用户删除，界面将被刷新。';
I18N.Message.M05025 = '该共享已被删除。';
I18N.Message.M05024 = '该用户已被删除。';
I18N.Message.M05027 = '发起者用户已被删除。';
I18N.Message.M05028 = '该订阅者已移除。';
I18N.Message.M00953 = '输入非法。';

I18N.Message.M11600 = '自定义能效标识在该客户下已经存在，请使用其它名字。';
I18N.Message.M11601 = '自定义能效标识错误。';
I18N.Message.M11602 = '自定义能效标识级别不连续。';
I18N.Message.M11603 = '并发错误,请刷新。';

I18N.Message.M05003 = '输入非法。';

I18N.Message.M20001 = '规则名称重复。';
I18N.Message.M20002 = '规则已经被删除。';
I18N.Message.M20003 = '规则已经被修改。';
I18N.Message.M20006 = '客户已经被删除。';
I18N.Message.M20007 = '规则总额超限。';
I18N.Message.M20012 = '部分数据点已关联到其他规则。';
I18N.Message.M20013 = '无法修改以下数据点的数据：{0}。';
I18N.Message.M20014 = '部分数据点已被删除或没有数据权限。';

I18N.Message.M21707 = '报表"{0}"已被删除，马上为您刷新';
I18N.Message.M21705 = '报表名称重复';
I18N.Message.M21702 = '该报表已被修改，马上为您刷新。';
I18N.Message.M21706 = '报表中存在重复的Tag，请检查。';

I18N.Folder = {};
I18N.Folder.NewWidget = {};
I18N.Folder.NewWidget.Menu1 = '能耗分析';
I18N.Folder.NewWidget.Menu2 = '单位指标';
I18N.Folder.NewWidget.Menu3 = '时段能耗比';
I18N.Folder.NewWidget.Menu4 = '能效标识';
I18N.Folder.NewWidget.Menu5 = '集团排名';
I18N.Folder.NewWidget.DefaultName = '最近7天{0}';

I18N.Folder.NewFolder = '新建文件夹';
I18N.Folder.FolderName = '文件夹';
I18N.Folder.WidgetName = '图表';
I18N.Folder.WidgetSaveSuccess = '图表保存成功';

I18N.Folder.SaveNameError = {};
I18N.Folder.SaveNameError.E032 = '名称为“{0}”的{1}已存在，请选取其他名称。';
I18N.Folder.SaveNameError.E029 = '{0}名称不能为空，请重新输入';
I18N.Folder.SaveNameError.E031 = '{0}名称超过最大长度100，请重新输入';

I18N.Folder.Copy = {};
I18N.Folder.Copy.Title = '复制{0}';
I18N.Folder.Copy.Label = '{0}名称';
I18N.Folder.Copy.firstActionLabel = '复制';
I18N.Folder.Copy.Error = '该名称已存在';
I18N.Folder.Copy.NameLongError = '无法输入超过100个字符';

I18N.Folder.SaveAs = {};
I18N.Folder.SaveAs.Title = '复制图表';
I18N.Folder.SaveAs.Label = '图表名称';
I18N.Folder.SaveAs.firstActionLabel = '保存';

I18N.Folder.Send = {};
I18N.Folder.Send.Success = '{0}发送成功';
I18N.Folder.Send.Error = '{0}发送失败，无法发送给用户：{1}。';

I18N.Folder.Share = {};
I18N.Folder.Share.Success = '{0}共享成功';
I18N.Folder.Share.Error = '{0}共享失败，无法共享给用户：{1}。';

I18N.Folder.Drag = {};
I18N.Folder.Drag.Error = '名称为“{0}”的{1}已存在，无法完成拖拽。';

I18N.Folder.Export = {};
I18N.Folder.Export.Error = '图表内容为空，无法导出';

I18N.Folder.Detail = {};
I18N.Folder.Detail.SubTitile = '来自{0}';
I18N.Folder.Detail.Title = {};
I18N.Folder.Detail.Title.Menu1 = '复制';
I18N.Folder.Detail.Title.Menu2 = '发送';
I18N.Folder.Detail.Title.Menu3 = '删除';
I18N.Folder.Detail.WidgetMenu = {};
I18N.Folder.Detail.WidgetMenu.Menu1 = '复制';
I18N.Folder.Detail.WidgetMenu.Menu2 = '发送';
I18N.Folder.Detail.WidgetMenu.Menu3 = '共享';
I18N.Folder.Detail.WidgetMenu.Menu4 = '导出';
I18N.Folder.Detail.WidgetMenu.Menu5 = '删除';

I18N.Commodity = {};
I18N.Commodity.Overview = '介质总览';

I18N.Hierarchy = {};
I18N.Hierarchy.RankingButtonName = '请选择层级节点进行排名';
I18N.Hierarchy.ButtonName = '请选择层级节点';
I18N.Hierarchy.Confirm = '确定';
I18N.Hierarchy.Clear = '清空';
I18N.Hierarchy.Menu1 = '客户';
I18N.Hierarchy.Menu2 = '组织';
I18N.Hierarchy.Menu3 = '园区';
I18N.Hierarchy.Menu4 = '楼宇';

I18N.Dim = {};
I18N.Dim.AllButtonName = '全部维度';
I18N.Dim.ButtonName = '维度节点';

I18N.ALarm = {};
I18N.ALarm.Menu1 = '全部';
I18N.ALarm.Menu2 = '报警已配置';
I18N.ALarm.Menu3 = '基准值已配置';
I18N.ALarm.Menu4 = '未配置';

I18N.ALarm.Save = {};
I18N.ALarm.Save.Title = '添加至仪表盘';
I18N.ALarm.Save.Label = '图表名称';
I18N.ALarm.Save.Save = '保存';
I18N.ALarm.Save.Error = '已存在';

I18N.Tag = {};
I18N.Tag.Tooltip = '已选择数据点{0}/{1}';
I18N.Tag.ExceedTooltip = '新增全选的数据点数量超出了可选范围，无法全选，请逐一选择目标数据点';
I18N.Tag.AlarmStatus1 = '基准值未配置';
I18N.Tag.AlarmStatus2 = '基准值已配置';
I18N.Tag.AlarmStatus3 = '报警未配置';
I18N.Tag.AlarmStatus4 = '报警已配置';

I18N.Template = {};
I18N.Template.Copy = {};
I18N.Template.Copy.DestinationFolder = '目标文件夹';
I18N.Template.Copy.Cancel = '放弃';
I18N.Template.Copy.DefaultName = '{0}-副本';
I18N.Template.Delete = {};
I18N.Template.Delete.Delete = '删除';
I18N.Template.Delete.Cancel = '放弃';
I18N.Template.Delete.Title = '删除{0}';
I18N.Template.Delete.FolderContent = '删除文件夹"{0}",该文件夹下的所有内容也将被删除';
I18N.Template.Delete.WidgetContent = '图表"{0}"将被删除';
I18N.Template.Share = {};
I18N.Template.Share.Title = '共享图表';
I18N.Template.Share.Share = '共享';
I18N.Template.Share.Cancel = '放弃';
I18N.Template.User = {};
I18N.Template.User.Alluser = '全部人员';
I18N.Template.User.Name = '姓名';
I18N.Template.User.Position = '职务';
I18N.Template.User.Selected = '已选{0}人';
I18N.Template.Send = {};
I18N.Template.Send.Title = '发送{0}';
I18N.Template.Send.Send = '发送';
I18N.Template.Send.Cancel = '放弃';

I18N.Title = {};
I18N.Title.Alarm = '报警';
I18N.Title.Energy = '能源';

I18N.Mail = {};
I18N.Mail.SendButton = '发送平台邮件';
I18N.Mail.Reciever = '收件人';
I18N.Mail.Template = '模板';
I18N.Mail.Contactor = '服务商联系人';
I18N.Mail.User = '平台用户';
I18N.Mail.SelectAll = '选择全组';
I18N.Mail.UserDefined = '自定义';
I18N.Mail.Delete = '模板“{0}”将被删除';
I18N.Mail.Subject = '主题';
I18N.Mail.Content = '正文';
I18N.Mail.SaveNewTemplate = '将此邮件保存为新模板';
I18N.Mail.Message = '同时发送短信通知';
I18N.Mail.TemplateHintText = '请输入模板名称';
I18N.Mail.Error = {};
I18N.Mail.Error.E090 = '请填写收件人后再发送';
I18N.Mail.Error.E091 = '请选择模板';
I18N.Mail.Error.E094 = '请填写模板名称';
I18N.Mail.Error.E095 = '该名称已存在';
I18N.Mail.Send = {};
I18N.Mail.Send.Title = '发送平台邮件';
I18N.Mail.Send.Ok = '好';
I18N.Mail.Send.Send = '发送';
I18N.Mail.Send.Cancel = '放弃';
I18N.Mail.Send.Success = '平台邮件已发送成功';
I18N.Mail.Send.E03092 = '您的邮件没有填写主题。您确定继续发送？';
I18N.Mail.Send.E03099 = '邮件发送失败，请重试。';
I18N.Mail.Send.E03099 = '邮件发送失败，请重试。';

I18N.RawData = {};
I18N.RawData.Time = '时间';

I18N.SumWindow = {};
I18N.SumWindow.TimeSpan = '时间段';
I18N.SumWindow.Data = '数据点';
I18N.SumWindow.Sum = '总计';


module.exports = I18N;
