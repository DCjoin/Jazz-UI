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
I18N.MainMenu.DeviceTemplate = '台账模板';
I18N.MainMenu.ParameterTemplate = '参数模板';

I18N.MainMenu.Map = '地图';
I18N.MainMenu.Alarm = '报警';
I18N.MainMenu.Energy = '能源';
I18N.MainMenu.Report = '报告';
I18N.MainMenu.DailyReport = '日常报表';
I18N.MainMenu.Template = '模板管理';
I18N.MainMenu.CustomerSetting = '客户配置';
I18N.MainMenu.TagSetting = '数据点配置';
I18N.MainMenu.PTagManagement = '计量数据P';
I18N.MainMenu.VTagManagement = '计量数据V';
I18N.MainMenu.VEEMonitorRule = '异常监测规则';
I18N.MainMenu.TagBatchImportLog = '配置导入日志';
I18N.MainMenu.HierarchyNodeSetting = '层级节点配置';
I18N.MainMenu.HierarchyLog = '配置导入日志';
I18N.MainMenu.CustomSetting = '自定义配置';
I18N.MainMenu.HierarchySetting = '层级配置';
I18N.MainMenu.CustomizedLabeling = '能效标识';

I18N.MainMenu.Calendar = '日历配置';
I18N.MainMenu.WorkdaySetting = '工休日';
I18N.MainMenu.WorktimeSetting = '工作时间';
I18N.MainMenu.ColdwarmSetting = '冷暖季';
I18N.MainMenu.DaynightSetting = '昼夜时间';
I18N.MainMenu.EnergyConvert = '能耗换算';
I18N.MainMenu.Price = '价格';
I18N.MainMenu.Carbon = '碳排放';
I18N.MainMenu.Statistics = '大数据分析';
I18N.MainMenu.Benchmark = '行业对标';
I18N.MainMenu.Labeling = '能效标识';
I18N.MainMenu.Customer = '客户管理';
I18N.MainMenu.User = '用户管理';
I18N.MainMenu.Privilege = '功能权限角色';

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
I18N.Common.Commodity = {};
I18N.Common.Commodity.Electric = '电力';
I18N.Common.Commodity.Water = '自来水';
I18N.Common.Commodity.Gas = '天然气';
I18N.Common.Commodity.Air = '空气';
I18N.Common.Commodity.Steam = '蒸汽';
I18N.Common.Commodity.HeatQ = '热量';
I18N.Common.Commodity.CoolQ = '冷量';
I18N.Common.Commodity.Coal = '原煤';
I18N.Common.Commodity.Oil = '原油';
I18N.Common.Commodity.Other = '其他';
I18N.Common.Commodity.CleanedCoal = '洗精煤';
I18N.Common.Commodity.Coke = '焦炭';
I18N.Common.Commodity.Petrol = '汽油';
I18N.Common.Commodity.Kerosene = '煤油';
I18N.Common.Commodity.LPG = '液化石油气';
I18N.Common.Commodity.CokeOvenGas = '焦炉煤气';
I18N.Common.Commodity.LowPressureSteam = '低压蒸汽';
I18N.Common.Commodity.MediumPressureSteam = '中压蒸汽';
I18N.Common.Commodity.HighPressureSteam = '高压蒸汽';
I18N.Common.Commodity.HeavyWater = '重水';
I18N.Common.Commodity.ReclaimedWater = '中水';
I18N.Common.Commodity.LightWater = '轻水';
I18N.Common.Commodity.DieselOil = '柴油';
I18N.Common.Commodity.Unspecified = '未指定';
I18N.Common.Glossary = {};
I18N.Common.Glossary.HierarchyNode = '层级节点';
I18N.Common.Glossary.Max = '最大值';
I18N.Common.Glossary.Min = '最小值';
I18N.Common.Glossary.Auto = '自动';

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

I18N.Common.Glossary.WeekDay.Monday = '一';
I18N.Common.Glossary.WeekDay.Tuesday = '二';
I18N.Common.Glossary.WeekDay.Wednesday = '三';
I18N.Common.Glossary.WeekDay.Thursday = '四';
I18N.Common.Glossary.WeekDay.Friday = '五';
I18N.Common.Glossary.WeekDay.Saturday = '六';
I18N.Common.Glossary.WeekDay.Sunday = '日';

I18N.Common.Glossary.Organization = '组织';
I18N.Common.Glossary.Site = '园区';
I18N.Common.Glossary.Building = '建筑';
I18N.Common.Glossary.Node = '节点';
I18N.Common.Glossary.Dim = '维度';


I18N.Common.Per = {};
I18N.Common.Per.Person = '/人';
I18N.Common.Per.m2 = '/M²';
I18N.Common.Per.Bed = '/床';
I18N.Common.Per.Room = '/房间';

I18N.Common.Date = {};
I18N.Common.Date.January = '01月';
I18N.Common.Date.February = '02月';
I18N.Common.Date.March = '03月';
I18N.Common.Date.April = '04月';
I18N.Common.Date.May = '05月';
I18N.Common.Date.June = '06月';
I18N.Common.Date.July = '07月';
I18N.Common.Date.August = '08月';
I18N.Common.Date.September = '09月';
I18N.Common.Date.October = '10月';
I18N.Common.Date.November = '11月';
I18N.Common.Date.December = '12月';

I18N.Common.Label = {};
I18N.Common.Label.TimeConflict = '时间段冲突，请重新选择';
I18N.Common.Label.DuplicatedName = '该名称已存在';
I18N.Common.Label.TimeZoneConflict = '时间区间重叠';
I18N.Common.Label.TimeOverlap = '时间区间重叠，请检查。';
I18N.Common.Label.CommoEmptyText = '请选择';
I18N.Common.Label.MandatoryEmptyError = '必填项。';
I18N.Common.Label.OverValueError = '该输入项的最大值是 999999999。';
I18N.Common.Label.UnspecifyCommodity = '不指定##Common.Glossary.Commodity##';
I18N.Common.Label.UnknownError = '抱歉，发生未知错误。';
I18N.Common.Label.MandatoryNumberError = '必填为数字。';
I18N.Common.Label.ExcelColumnError = '请按照Excel单元格名称填写，如C1，AB23';

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

I18N.Common.Glossary.Name = '名称';
I18N.Common.Glossary.Code = '编码';
I18N.Common.Glossary.Index = '序号';
I18N.Common.Glossary.Commodity = '介质';
I18N.Common.Glossary.UOM = '单位';
I18N.Common.Glossary.Type = '类型';
I18N.Common.Glossary.Operation = '操作';



I18N.Common.Button = {};
I18N.Common.Button.Calendar = {};
I18N.Common.Button.Calendar.ShowHC = '冷暖季';
I18N.Common.Button.Calendar.ShowHoliday = '非工作时间';
I18N.Common.Button.Show = '查看';
I18N.Common.Button.Add = '添加';
I18N.Common.Button.Comparation = '比较';
I18N.Common.Button.Confirm = '确定';
I18N.Common.Button.Save = '保存';
I18N.Common.Button.SaveExport = '保存并导出';
I18N.Common.Button.Import = '导入';
I18N.Common.Button.Export = '导出';
I18N.Common.Button.Filter = '筛选';
I18N.Common.Button.Close = '关闭';
I18N.Common.Button.Cancel = '放弃';
I18N.Common.Button.Cancel2 = '取消';
I18N.Common.Button.Delete = '删除';
I18N.Common.Button.Edit = '编辑';
I18N.Common.Button.Exit = '退出';
I18N.Common.Button.Clear = '清空';
I18N.Common.Button.ClearAll = '全部清空';
I18N.Common.Button.Send = '发送';
I18N.Common.Button.GoOn = '继续';
I18N.Common.Button.Confirmed = '已确认';

I18N.Common.CarbonUomType = {};
I18N.Common.CarbonUomType.StandardCoal = '标煤';
I18N.Common.CarbonUomType.CO2 = '二氧化碳';
I18N.Common.CarbonUomType.Tree = '树';

I18N.Common.CaculationType = {};
I18N.Common.CaculationType.Non = '无';
I18N.Common.CaculationType.Sum = '求和';
I18N.Common.CaculationType.Avg = '平均值';
I18N.Common.CaculationType.Max = '最大值';
I18N.Common.CaculationType.Min = '最小值';

I18N.Common.AggregationStep = {};
I18N.Common.AggregationStep.Minute = '分钟';
I18N.Common.AggregationStep.Min15 = '15分钟';
I18N.Common.AggregationStep.Min30 = '30分钟';
I18N.Common.AggregationStep.Hourly = '每小时';
I18N.Common.AggregationStep.Hour2 = "2小时";
I18N.Common.AggregationStep.Hour4 = "4小时";
I18N.Common.AggregationStep.Hour6 = "6小时";
I18N.Common.AggregationStep.Hour8 = "8小时";
I18N.Common.AggregationStep.Hour12 = "12小时";
I18N.Common.AggregationStep.Daily = '每天';
I18N.Common.AggregationStep.Weekly = '每周';
I18N.Common.AggregationStep.Monthly = '每月';
I18N.Common.AggregationStep.Yearly = '每年';

I18N.Common.Control = {};
I18N.Common.Control.ViewableNumberField = {};
I18N.Common.Control.ViewableNumberField.Error = '请输入格式正确的数字';

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
I18N.DateTimeFormat.HighFormat.RawData = {};
I18N.DateTimeFormat.HighFormat.RawData.Dayhour = '%m/%d %H:%M';
I18N.DateTimeFormat.HighFormat.RawData.Hour = '%H:%M';
I18N.DateTimeFormat.HighFormat.RawData.Day = '%m/%d';
I18N.DateTimeFormat.HighFormat.RawData.Month = '%m';
I18N.DateTimeFormat.HighFormat.RawData.Fullmonth = '%Y/%m';
I18N.DateTimeFormat.HighFormat.RawData.Year = '%Y';

I18N.DateTimeFormat.IntervalFormat = {};
I18N.DateTimeFormat.IntervalFormat.RawDate = {};
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
I18N.DateTimeFormat.IntervalFormat.MonthDayHour = 'MM月DD日HH点';
I18N.DateTimeFormat.IntervalFormat.DayHour = 'DD日HH点';
I18N.DateTimeFormat.IntervalFormat.RawDate.FullHour = 'YYYY/MM/DD HH:mm';
I18N.DateTimeFormat.IntervalFormat.RawDate.Full24Hour = 'YYYY/MM/DD 24:mm';
I18N.DateTimeFormat.IntervalFormat.RawDate.FullDay = 'YYYY/MM/DD';
I18N.DateTimeFormat.IntervalFormat.RawDate.Month = 'YYYY/MM';
I18N.DateTimeFormat.IntervalFormat.RawDate.Year = 'YYYY';
I18N.DateTimeFormat.IntervalFormat.RawDate.RangeFullMinute = 'YYYY/MM/DD HH:mm';
I18N.DateTimeFormat.IntervalFormat.RawDate.RangeFull24Minute = 'YYYY/MM/DD 24:00';



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
I18N.EM.Clock24Minute0 = '24点00';

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
I18N.EM.Ratio.Error = '查看工休比请选择不小于一周的时间范围';



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
I18N.EM.EnergyAnalyse.SumData = '数据求和';
I18N.EM.YAxisSetting = 'Y坐标轴设置';
I18N.EM.YAxisSettingTags = '相关数据点';
I18N.EM.YAxisTitle = 'Y坐标轴';
I18N.EM.YAxisMinMaxValidation = '最大值应大于最小值';

I18N.EM.CannotShowCalendarByStep = '当前步长不支持显示{0}背景色';
I18N.EM.CannotShowCalendarByTimeRange = '看不到日历背景？换个时间段试试';
I18N.EM.WeatherSupportsOnlySingleHierarchy = '该功能仅支持单层级数据点。';
I18N.EM.WeatherSupportsNotMinuteStep = '该功能不支持分钟步长。';
I18N.EM.WeatherSupportsNotPie = '该功能不支持饼图';
I18N.EM.WeatherSupportsNotMultiTime = '该功能不支持多时间段。';
I18N.EM.TouSupportsMoreThanHourStep = '该功能仅支持大于小时的步长。';
I18N.EM.TouSupportsOnlyElec = '该功能仅支持"电"介质。';

I18N.EM.CharType = {};
I18N.EM.CharType.Line = '折线图';
I18N.EM.CharType.Bar = '柱状图';
I18N.EM.CharType.Stack = '堆积图';
I18N.EM.CharType.Pie = '饼状图';
I18N.EM.CharType.RawData = '原始数据';

I18N.EM.RawData = {};
I18N.EM.RawData.ErrorForEnergy = '原始数据仅支持查看7天以内的数据';
I18N.EM.RawData.Error = '原始数据仅支持查看30天以内的数据';

I18N.EM.Legend = {};
I18N.EM.Legend.ToLine = '切换至折线图显示';
I18N.EM.Legend.ToColumn = '切换至柱状图显示';
I18N.EM.Legend.ToStacking = '切换至堆积图显示';

I18N.EM.Labeling = {};
I18N.EM.Labeling.LowEnergy = '低能耗';
I18N.EM.Labeling.HighEnergy = '高能耗';
I18N.EM.Labeling.ViewLabeling = '能效标识查看';
I18N.EM.Labeling.NonBuilding = '该节点为非楼宇节点，请重新选择节点';
I18N.EM.Labeling.NonData = '该时间段没有能效标记数据。';
I18N.EM.Labeling.DifferentCommodity = '所选数据点不是同一介质，请重新选择';
I18N.EM.Labeling.SelectHieForSys = '选择楼宇节点以配置区域维度';

I18N.EM.Report = {};
I18N.EM.Report.Select = '请选择';
I18N.EM.Report.Creator = '创建者';
I18N.EM.Report.CreateTime = '创建时间';
I18N.EM.Report.Name = '名称';
I18N.EM.Report.Report = '报表';
I18N.EM.Report.ReportSort = '按报表名称排序';
I18N.EM.Report.UserSort = '按用户名称排序';
I18N.EM.Report.NameSort = '按模板名称排序';
I18N.EM.Report.TimeSort = '按上传时间排序';
I18N.EM.Report.UploadAt = '上传于';
I18N.EM.Report.Reference = '已引用';
I18N.EM.Report.DeleteTemplate = '删除模板';
I18N.EM.Report.Template = '报表模板';
I18N.EM.Report.TemplateTitle = '报表模板文件导入';
I18N.EM.Report.TemplateFileName = '模板文件';
I18N.EM.Report.SelectTemplate = '选择模板';
I18N.EM.Report.ReportName = '报表名称';
I18N.EM.Report.Data = '报表数据';
I18N.EM.Report.DataType = '数据类型';
I18N.EM.Report.DataSource = '数据源';
I18N.EM.Report.TimeRange = '时间范围';
I18N.EM.Report.Step = '步长';
I18N.EM.Report.NumberRule = '取数规则';
I18N.EM.Report.AllTime = '全部';
I18N.EM.Report.Hourly = '整点值';
I18N.EM.Report.Daily = '零点值';
I18N.EM.Report.ExistTemplate = '已上传模板';
I18N.EM.Report.UploadTemplate = '上传新模板';
I18N.EM.Report.DownloadTemplate = '下载查看';
I18N.EM.Report.EditTag = '编辑数据点';
I18N.EM.Report.SelectTag = '选择数据点';
I18N.EM.Report.ViewTag = '查看数据点';
I18N.EM.Report.AllTag = '全部数据点';
I18N.EM.Report.SelectedTag = '已选数据点';
I18N.EM.Report.Upload = '上传';
I18N.EM.Report.UploadTem = '上传模板';
I18N.EM.Report.Reupload = '重新上传';
I18N.EM.Report.Order = '时间点排列顺序';
I18N.EM.Report.OrderAsc = '顺序排列';
I18N.EM.Report.OrderDesc = '倒序排列';
I18N.EM.Report.TargetSheet = '目标Sheet';
I18N.EM.Report.StartCell = '起始单元格';
I18N.EM.Report.Layout = '布局方向';
I18N.EM.Report.ReportTypeEnergy = '能效数据';
I18N.EM.Report.Original = '原始数据';
I18N.EM.Report.TagShouldNotBeEmpty = '请选择至少1个数据点';

I18N.EM.Report.NonReportCriteria = '请至少包含一组报表数据';
I18N.EM.Report.WrongExcelFile = '模板格式不对，只能是xls或者xlsx后缀的文件';
I18N.EM.Report.TemplateHasBeenRefed = '报表模板"{0}"正在被引用，无法删除。请取消所有引用后再试。';
I18N.EM.Report.RefObject = '引用对象：';
I18N.EM.Report.UploadingTemplate = '文件{0}正在导入。';
I18N.EM.Report.DeleteReportMessage = '确定删除报表“{0}”吗？';
I18N.EM.Report.DeleteTemplateMessage = '确定删除报表模板“{0}”吗？';
I18N.EM.Report.DuplicatedName = '该文件已存在，请更改名称后重新上传';
I18N.EM.Report.NeedUploadTemplate = '请上传新模板';
I18N.EM.Report.StepError = '所选数据点不支持"{0}"步长，请选择{1}步长。';
I18N.EM.Report.StepError2 = '所选数据点不支持"{0}"步长且在该时间范围内没有支持的步长，请修改所选数据点或时间范围。 ';
I18N.EM.Report.ExportFormat = '导出格式';
I18N.EM.Report.ExportTagName = '导出数据点名称';
I18N.EM.Report.ExportTimeLabel = '导出时间标签';
I18N.EM.Report.ExportStepError = '存在数据点不支持的步长，请检查';
I18N.EM.Report.ExportTagUnassociated = '数据点已被解关联';

I18N.EM.Export = {};
I18N.EM.Export.Preview = '导出图片预览';

I18N.Setting = {};
I18N.Setting.Calendar = {};
I18N.Setting.Calendar.Time = '时间';

//workday
I18N.Setting.Calendar.WorkdaySetting = '工休日';
I18N.Setting.Calendar.DeleteWorkday = '删除工休日';
I18N.Setting.Calendar.DeleteWorkdayContent = '工休日"{0}"将被删除';
I18N.Setting.Calendar.WorkdayName = '公休日名称';
I18N.Setting.Calendar.WorkDay = '工作日';
I18N.Setting.Calendar.Holiday = '非工作日';
I18N.Setting.Calendar.DefaultWorkDay = '默认工作日：周一至周五';
I18N.Setting.Calendar.AdditionalDay = '补充日期';
I18N.Setting.Calendar.DateType = '日期类型';
I18N.Setting.Calendar.StartDate = '开始日期';
I18N.Setting.Calendar.EndDate = '结束日期';
I18N.Setting.Calendar.Month = '月';
I18N.Setting.Calendar.StartMonth = '开始月份';
I18N.Setting.Calendar.EndMonth = '结束月份';
I18N.Setting.Calendar.TimeRange = '时间范围';
I18N.Setting.Calendar.Date = '日';
I18N.Setting.Calendar.MonthDayFromTo = '{0}月{1}日到{2}月{3}日';

//worktime
I18N.Setting.Calendar.WorktimeSetting = '工作时间';
I18N.Setting.Calendar.DeleteWorktime = '删除工作时间';
I18N.Setting.Calendar.DeleteWorktimeContent = '工作时间"{0}"将被删除';
I18N.Setting.Calendar.WorktimeName = '工作时间名称';
I18N.Setting.Calendar.WorkTime = '工作时间';
I18N.Setting.Calendar.RestTime = '休息时间';
I18N.Setting.Calendar.DefaultWorkTime = '工作时间以外均为非工作时间';
I18N.Setting.Calendar.AddWorkTime = '添加工作时间';
I18N.Setting.Calendar.StartTime = '开始时间';
I18N.Setting.Calendar.EndTime = '结束时间';
I18N.Setting.Calendar.To = '到';

//cold/warm
I18N.Setting.Calendar.ColdwarmSetting = '冷暖季';
I18N.Setting.Calendar.DeleteColdwarm = '删除冷暖季';
I18N.Setting.Calendar.DeleteColdwarmContent = '冷暖季"{0}"将被删除';
I18N.Setting.Calendar.ColdwarmName = '冷暖季名称';
I18N.Setting.Calendar.SeansonType = '季节类型';
I18N.Setting.Calendar.WarmSeason = '采暖季';
I18N.Setting.Calendar.ColdSeason = '供冷季';
I18N.Setting.Calendar.AddWarmSeason = '添加采暖季';
I18N.Setting.Calendar.AddColdSeason = '添加供冷季';
I18N.Setting.Calendar.WarmColdDeclaration = '采暖季与供冷季之间不能少于7天，且不能存在于同一月份。';

//day/night
I18N.Setting.Calendar.DaynightSetting = '昼夜时间';
I18N.Setting.Calendar.DeleteDaynight = '删除昼夜时间';
I18N.Setting.Calendar.DeleteDaynightContent = '昼夜时间"{0}"将被删除';
I18N.Setting.Calendar.DaynightName = '昼夜时间名称';
I18N.Setting.Calendar.Day = '白昼时间';
I18N.Setting.Calendar.Night = '黑夜时间';
I18N.Setting.Calendar.DefaultDayNight = '白昼时间以外均为黑夜时间';
I18N.Setting.Calendar.AddDay = '添加白昼时间';
I18N.Setting.Calendar.AddColdWarm = '添加冷暖季时间';

I18N.Setting.Benchmark = {};
I18N.Setting.Benchmark.Label = {};
I18N.Setting.Benchmark.Label.None = '无';
I18N.Setting.Benchmark.Label.SelectLabelling = '请选择能效标识';
I18N.Setting.Benchmark.Label.EnergyBenchmark = '能效对标配置';
I18N.Setting.Benchmark.Label.IndustryEnegyBenchmark = '行业能效对标配置';
I18N.Setting.Benchmark.Label.ClimateZone = '气候分区';
I18N.Setting.Benchmark.Label.IndustryBenchmark = '行业对标';
I18N.Setting.Benchmark.Label.DeleteBenchmark = '删除行业对标';
I18N.Setting.Benchmark.Label.DeleteBenchmarkContent = '行业对标"{0}"将被删除';
I18N.Setting.Benchmark.Label.SelectTip = '请选择需要平台计算的能效对标针对的行业及区域。请至少选择一项。';
I18N.Setting.Benchmark.Label.AtleastOneZone = '请至少选择一项。';
I18N.Setting.Benchmark.Label.Industry = '行业';
I18N.Setting.Benchmark.Label.IndustryBaseLineValue = '行业基准值';

I18N.Setting.Benchmark.Zone = {};
I18N.Setting.Benchmark.Zone.AllZone = '全部地区';
I18N.Setting.Benchmark.Zone.ColdA = '严寒地区A区';
I18N.Setting.Benchmark.Zone.ColdB = '严寒地区B区';
I18N.Setting.Benchmark.Zone.ColdRegion = '寒冷地区';
I18N.Setting.Benchmark.Zone.HotSummerColdWinterRegion = '夏热冬冷地区';
I18N.Setting.Benchmark.Zone.SubtropicalRegion = '夏热冬暖地区';
I18N.Setting.Benchmark.Zone.TemperateRegion = '温和地区';

I18N.Setting.Benchmark.Industry = {};
I18N.Setting.Benchmark.Industry.AllIndustry = '全行业';
I18N.Setting.Benchmark.Industry.OfficeBuilding = '办公建筑';
I18N.Setting.Benchmark.Industry.DataCenter = '数据中心';
I18N.Setting.Benchmark.Industry.Hotel = '酒店';
I18N.Setting.Benchmark.Industry.TwoStarAndBelowHotel = '酒店（二星级及以下）';
I18N.Setting.Benchmark.Industry.ThreeStarHotel = '酒店（三星级）';
I18N.Setting.Benchmark.Industry.FourStarHotel = '酒店（四星级）';
I18N.Setting.Benchmark.Industry.FiveStarHotel = '酒店（五星级）';
I18N.Setting.Benchmark.Industry.Hospital = '医院';
I18N.Setting.Benchmark.Industry.School = '学校';
I18N.Setting.Benchmark.Industry.Retail = '零售业';
I18N.Setting.Benchmark.Industry.Supermarket = '超市';
I18N.Setting.Benchmark.Industry.ClothingRetails = '服装零售';
I18N.Setting.Benchmark.Industry.Mall = '商场';
I18N.Setting.Benchmark.Industry.Communication = '通讯';
I18N.Setting.Benchmark.Industry.CommunicationRoom = '机房';
I18N.Setting.Benchmark.Industry.BaseStation = '通讯基站';
I18N.Setting.Benchmark.Industry.TelecommunicationsBusinessHall = '通讯营业厅';
I18N.Setting.Benchmark.Industry.RailTransport = '轨道交通';
I18N.Setting.Benchmark.Industry.Airport = '机场';
I18N.Setting.Benchmark.Industry.Manufacture = '制造业';

I18N.Setting.Labeling = {};
I18N.Setting.Labeling.Label = {};

I18N.Setting.Labeling.Label.Industry = '行业';
I18N.Setting.Labeling.Label.ClimateZone = '气候分区';
I18N.Setting.Labeling.Label.CustomizedLabeling = '自定义能效标识';
I18N.Setting.Labeling.Label.Labeling = '能效标识';
I18N.Setting.Labeling.Label.DeleteLabeling = '删除能效标识';
I18N.Setting.Labeling.Label.DeleteLabelingContent = '能效标识"{0}"将被删除';
I18N.Setting.Labeling.Label.LabelingSetting = '能效标识配置';
I18N.Setting.Labeling.Label.IndustryLabeling = '行业能效标识';
I18N.Setting.Labeling.Label.IndustryLabelingSetting = '行业能效标识配置';
I18N.Setting.Labeling.Label.LabelingGrade = '能效标识级别';
I18N.Setting.Labeling.Label.DataYear = '数据来源';
I18N.Setting.Labeling.ViewDataPermission = '查看数据权限';
I18N.Setting.Labeling.EditDataPermission = '编辑数据权限';
I18N.Setting.Labeling.PlatformDataPermissionTip = '建议对具备““云能效”系统管理”功能权限的用户勾选此项。';
I18N.Setting.Labeling.AllCusomer = '全部客户';
I18N.Setting.Labeling.NoCusomer = '无客户';
I18N.Setting.Labeling.ElectrovalenceUom = '元/千瓦时';

I18N.Setting.CustomizedLabeling = {};
I18N.Setting.CustomizedLabeling.DeleteLabel = '删除能效标识';
I18N.Setting.CustomizedLabeling.Grade = '{0}级';
I18N.Setting.CustomizedLabeling.EnergyGrade = '能耗级别设置';
I18N.Setting.CustomizedLabeling.OrderMode = '排列方式';
I18N.Setting.CustomizedLabeling.Ascending = '正序';
I18N.Setting.CustomizedLabeling.Declining = '倒序';
I18N.Setting.CustomizedLabeling.Configurationer = '配置人';
I18N.Setting.CustomizedLabeling.ConfigurationDate = '配置时间';
I18N.Setting.CustomizedLabeling.KPIType = '指标类型';
I18N.Setting.CustomizedLabeling.InputError = '无效值';
I18N.Setting.CustomizedLabeling.ErrorMessage1 = '请确保输入的右区间大于左区间';
I18N.Setting.CustomizedLabeling.ErrorMessage2 = '请确保输入的左区间大于右区间';
I18N.Setting.CustomizedLabeling.DeleteTip = '能效标示"{0}"将被删除。删除后，关联该标识的仪表盘将无法正常显示。';

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
I18N.Setting.User.SendEmailSuccess = '重置密码邮件已发送!';
I18N.Setting.User.WholeCustomer = '全部层级节点数据权限';
I18N.Setting.User.WholeCustomerTip = '建议对具备“层级结构管理”功能权限的用户勾选此项。';
I18N.Setting.User.AllCusomerDataPermission = '全部客户数据权限';
I18N.Setting.User.DeleteTitle = '删除用户';
I18N.Setting.User.DeleteContent = '用户“{0}”将被删除';
I18N.Setting.User.UserFilter = '用户筛选';
I18N.Setting.User.Cancel = '清除';
I18N.Setting.User.SelectedCusomer = '关联客户';
I18N.Setting.User.FilterResult = '没有符合筛选条件的用户';
I18N.Setting.User.FilterRecommendation = '您可以修改筛选条件再试一下';
I18N.Setting.User.FilterResult = '清空筛选条件';
I18N.Setting.User.Filter = '筛选';

I18N.Setting.NodeBtn = {};
I18N.Setting.NodeBtn.Saving = '正在保存...';
I18N.Setting.NodeBtn.Save = '保存';
I18N.Setting.NodeBtn.Deleting = '正在删除...';
I18N.Setting.NodeBtn.Delete = '删除';


//customer
I18N.Setting.CustomerManagement = {};
I18N.Setting.CustomerManagement.CustomerManagement = '客户管理';
I18N.Setting.CustomerManagement.Logo = 'Logo';
I18N.Setting.CustomerManagement.LogoUpload = '上传本地图片';
I18N.Setting.CustomerManagement.LogoUploadInfo = '请上传客户logo';
I18N.Setting.CustomerManagement.Address = '地址';
I18N.Setting.CustomerManagement.Principal = '负责人';
I18N.Setting.CustomerManagement.Telephone = '负责人电话';
I18N.Setting.CustomerManagement.Email = '负责人电子邮箱';
I18N.Setting.CustomerManagement.OperationStartTime = '运营时间';
I18N.Setting.CustomerManagement.Administrator = '维护负责人';
I18N.Setting.CustomerManagement.NoAdministrator = '未选择';
I18N.Setting.CustomerManagement.LogoUploadErrorTitle = '照片添加失败';
I18N.Setting.CustomerManagement.LogoUploadErrorTypeContent = '图片文件格式为PNG，JPG，BMP和GIF，请重新选择。';
I18N.Setting.CustomerManagement.LogoUploadErrorSizeContent = '图片文件大小为0，请重新选择。';
I18N.Setting.CustomerManagement.AddAdministrator = '添加维护负责人';
I18N.Setting.CustomerManagement.EditAdministrator = '编辑维护负责人';
I18N.Setting.CustomerManagement.Title = '职位';
I18N.Setting.CustomerManagement.DeleteTitle = '删除客户';
I18N.Setting.CustomerManagement.DeleteContent = '客户"{0}"将被删除';
I18N.Setting.CustomerManagement.CodeError = '不支持输入#|$<>\',"?\\*:/';

I18N.Setting.UserManagement = {};
I18N.Setting.UserManagement.UserManagement = '用户管理';
I18N.Setting.UserManagement.UserInfoManagement = '用户信息管理';
I18N.Setting.UserManagement.ViewFunction = '查看权限详细';
I18N.Setting.UserManagement.UserName = '用户名';
I18N.Setting.UserManagement.RealName = '显示名称';
I18N.Setting.UserManagement.Title = '职务';
I18N.Setting.UserManagement.TitlePlatformAdmin = '平台管理员';
I18N.Setting.UserManagement.Telephone = '电话';
I18N.Setting.UserManagement.Email = '电子邮箱';
I18N.Setting.UserManagement.Comment = '描述';
I18N.Setting.UserManagement.CreatePasswrod = '发送邮件';
I18N.Setting.UserManagement.MailSent = '邮件已发送。';
I18N.Setting.UserManagement.MembershipCustomer = '所属客户';
I18N.Setting.UserManagement.AllCustomers = '全部客户';
I18N.Setting.UserManagement.Privilege = '功能权限';
I18N.Setting.UserManagement.UserInfo = '用户信息';
I18N.Setting.UserManagement.DataPermissionSetting = '数据权限设置';

I18N.Setting.TagBatchImport = {};
I18N.Setting.TagBatchImport.DownloadLog = '下载导入日志';
I18N.Setting.TagBatchImport.ImportSuccess = '导入完成';
I18N.Setting.TagBatchImport.ImportSuccessView = '配置导入已完成。成功导入{0}条，失败{1}条，总计{2}条。';
I18N.Setting.TagBatchImport.ImportError = '导入失败';
I18N.Setting.TagBatchImport.ImportErrorView = '导入失败，数据格式有误，请重试。';
I18N.Setting.TagBatchImport.ErrorMessage2 = '文件格式错误';
I18N.Setting.TagBatchImport.ErrorMessage3 = '不合法的Sheet名称';
I18N.Setting.TagBatchImport.ErrorMessage4 = '用户已被删除';
I18N.Setting.TagBatchImport.ErrorMessage5 = '客户已被删除';
I18N.Setting.TagBatchImport.ErrorMessage6 = 'Excel列错误(列数或者列名错误)';
I18N.Setting.TagBatchImport.ErrorMessage7 = 'Excel行数非法(无数据或超过1000)';
I18N.Setting.TagBatchImport.ErrorMessage8 = '您没有该功能权限';
I18N.Setting.TagBatchImport.ErrorMessage9 = '您没有该数据权限';
I18N.Setting.TagBatchImport.ImportSizeErrorView = 'Excel行数非法(无数据或超过1000)';
I18N.Setting.TagBatchImport.ImportDate = '导入时间';
I18N.Setting.TagBatchImport.TagType = '类型';
I18N.Setting.TagBatchImport.Importer = '导入者';
I18N.Setting.TagBatchImport.File = '导入文件：';
I18N.Setting.TagBatchImport.ConfigLog = '配置批量导入日志';
I18N.Setting.TagBatchImport.ImportResult = ' 成功导入{0}条，失败{1}条，总计{2}条';
I18N.Setting.TagBatchImport.DownloadLog = '下载日志文件';
I18N.Setting.TagBatchImport.DownloadLogFile = '下载导入日志';
I18N.Setting.TagBatchImport.UploadAt = '上传于';
I18N.Setting.TagBatchImport.ToViewLog = '以查看详细记录';
I18N.Setting.TagBatchImport.ImportResultView = '批量导入已完成。成功导入{0}条，失败{1}条，总计{2}条。';

I18N.Setting.Tag = {};
I18N.Setting.Tag.SearchText = '请输入名称或编码';
I18N.Setting.Tag.Tag = '数据点';
I18N.Setting.Tag.TagList = '数据点列表';
I18N.Setting.Tag.TagFilter = '数据点筛选';
I18N.Setting.Tag.isAccumulated = '累计值';
I18N.Setting.Tag.isNotAccumulated = '非累计值';
I18N.Setting.Tag.Commodity = '介质';
I18N.Setting.Tag.Uom = '单位';
I18N.Setting.Tag.Type = '数据类型';
I18N.Setting.Tag.TagName = '数据点名称';
I18N.Setting.Tag.BasicProperties = '基础属性';
I18N.Setting.Tag.RawData = '原始数据';
I18N.Setting.Tag.Formula = '计算公式';
I18N.Setting.Tag.DeleteTag = '删除数据点';
I18N.Setting.Tag.Code = '编码';
I18N.Setting.Tag.MeterCode = '表编码';
I18N.Setting.Tag.Channel = '通道';
I18N.Setting.Tag.Period = '采集周期';
I18N.Setting.Tag.CalculationStep = '计算步长';
I18N.Setting.Tag.CalculationType = '计算方式';
I18N.Setting.Tag.Slope = '斜率（选填）';
I18N.Setting.Tag.Offset = '偏移（选填）';
I18N.Setting.Tag.Comment = '备注（选填）';
I18N.Setting.Tag.AccumulatedValueCal = '使用累积值计算';
I18N.Setting.Tag.deleteContent = '计量数据{0}"{1}"将被删除';
I18N.Setting.Tag.PTagManagement = '计量数据P';
I18N.Setting.Tag.VTagManagement = '计量数据V';
I18N.Setting.Tag.KPI = '关键能效指标';
I18N.Setting.Tag.PanelTitle = '层级结构';
I18N.Setting.Tag.FormulaText = '点击编辑按钮，设计计算公式';
I18N.Setting.Tag.ErrorContent = '请输入大于-1000000000小于1000000000的数，小数点后最多保留6位';
I18N.Setting.Tag.CodeError = '不支持输入*{}';
I18N.Setting.Tag.MeterCodeError = '不支持输入#$<>\',"';
I18N.Setting.Tag.InvalidFormula = '计算公式的格式有误，请检查。';
I18N.Setting.Tag.FormulaEditText = '在列表中点击数据点加入计算公式';
I18N.Setting.Tag.PTagRawData = {};
I18N.Setting.Tag.PTagRawData.PauseMonitor = '暂停监测';
I18N.Setting.Tag.PTagRawData.PauseMonitorContent = '再次监测异常数据时将忽略所选的规则';
I18N.Setting.Tag.PTagRawData.PauseMonitorNoRule = '该规则集未关联任何规则';
I18N.Setting.Tag.PTagRawData.DifferenceValue = '差值';
I18N.Setting.Tag.PTagRawData.normal = '正常值';
I18N.Setting.Tag.PTagRawData.abnormal = '异常值';
I18N.Setting.Tag.PTagRawData.repair = '修复值';


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
I18N.Message.M01018 = '无法移动到目标节点下，请按照规则拖动层级节点：组织->组织、客户；园区->组织、客户；楼宇->园区、组织、客户。';
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
I18N.Message.M06109 = '相同的表编码和通道已存在';
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
I18N.Message.M12111 = '该手机号已存在。';

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
I18N.Message.M21802 = '所选数据点包含计量数据V类型的数据点，不支持原始数据功能，请重新选择。';

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
I18N.Folder.SaveAs.Title = '图表另存为';
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
I18N.Folder.Detail.WidgetMenu.Menu1 = '另存为';
I18N.Folder.Detail.WidgetMenu.Menu2 = '发送';
I18N.Folder.Detail.WidgetMenu.Menu3 = '共享';
I18N.Folder.Detail.WidgetMenu.Menu4 = '导出';
I18N.Folder.Detail.WidgetMenu.Menu5 = '删除';

I18N.Folder.Widget = {};
I18N.Folder.Widget.Leave = '离开提示';
I18N.Folder.Widget.LeaveContent = '图表操作未保存，继续离开将清空图表并删除。是否离开？';
I18N.Folder.Widget.LeaveButton = '离开';
I18N.Folder.Widget.LeaveCancel = '放弃';
I18N.Folder.Widget.SwitchLeave = '切换提示';
I18N.Folder.Widget.SwitchContent = '切换能源查看类型，当前图表将会被清空，是否继续？';
I18N.Folder.Widget.SwitchButton = '继续';

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
I18N.ALarm.Alarm = '能耗报警';
I18N.ALarm.Menu1 = '全部';
I18N.ALarm.Menu2 = '报警已配置';
I18N.ALarm.Menu3 = '基准值已配置';
I18N.ALarm.Menu4 = '未配置';

I18N.ALarm.Save = {};
I18N.ALarm.Save.Title = '添加至仪表盘';
I18N.ALarm.Save.Label = '图表名称';
I18N.ALarm.Save.Save = '保存';
I18N.ALarm.Save.Error = '已存在';

I18N.ALarm.List = {};
I18N.ALarm.List.Daily = '查看日报警列表';
I18N.ALarm.List.Month = '查看月报警列表';
I18N.ALarm.List.Year = '查看年报警列表';

I18N.ALarm.Uom = {};
I18N.ALarm.Uom.Hour = '小时';
I18N.ALarm.Uom.Day = '日';
I18N.ALarm.Uom.Month = '月';
I18N.ALarm.Uom.Year = '年';

I18N.ALarm.IgnoreWindow = {};
I18N.ALarm.IgnoreWindow.Title = '忽略该点报警吗';
I18N.ALarm.IgnoreWindow.content = '忽略该点后的连续报警';
I18N.ALarm.IgnoreWindow.Ignore = '忽略';
I18N.ALarm.IgnoreWindow.Quit = '放弃';

I18N.Tag = {};
I18N.Tag.Tooltip = '已选择数据点{0}/{1}';
I18N.Tag.ExceedTooltip = '新增全选的数据点数量超出了可选范围，无法全选，请逐一选择目标数据点';
I18N.Tag.AlarmStatus1 = '基准值未配置';
I18N.Tag.AlarmStatus2 = '基准值已配置';
I18N.Tag.AlarmStatus3 = '报警未配置';
I18N.Tag.AlarmStatus4 = '报警已配置';
I18N.Tag.SelectError = '请选择层级节点-维度节点。';
I18N.Tag.SelectAll = '全选';

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
I18N.Mail.Mail = '平台邮件';
I18N.Mail.SendButton = '发送平台邮件';
I18N.Mail.Reciever = '收件人';
I18N.Mail.Template = '模板';
I18N.Mail.Contactor = '服务商联系人';
I18N.Mail.User = '平台用户';
I18N.Mail.SelectAll = '选择全组';
I18N.Mail.UserDefined = '自定义';
I18N.Mail.Delete = '模板"{0}"将被删除';
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
I18N.Mail.LeaveTitle = '离开提示';
I18N.Mail.LeaveContent = '邮件正在编辑，离开此页面，当前邮件内容将会被清空，是否离开？';
I18N.Mail.LeaveConfirm = '离开';
I18N.Mail.LeaveCancel = '放弃';


I18N.RawData = {};
I18N.RawData.Time = '时间';

I18N.SumWindow = {};
I18N.SumWindow.TimeSpan = '时间段';
I18N.SumWindow.Data = '数据点';
I18N.SumWindow.Sum = '总计';

I18N.Baseline = {};
I18N.Baseline.Basic = '基准值配置';
I18N.Baseline.Modify = '计算值修正';
I18N.Baseline.AlarmSetting = '报警设置';
I18N.Baseline.Year = '年';
I18N.Baseline.Button = {};
I18N.Baseline.Button.DisplayCal = '显示日历详情';
I18N.Baseline.Button.HiddenCal = '隐藏日历详情';
I18N.Baseline.Button.Edit = '编辑';
I18N.Baseline.Button.Save = '保存';
I18N.Baseline.Button.Cancel = '放弃';
I18N.Baseline.BaselineBasic = {};
I18N.Baseline.BaselineBasic.Firstline = '请选择配置年份进行编辑';
I18N.Baseline.Error = {};
I18N.Baseline.Error.Cal = '该数据点所关联层级节点在所选年份未引用任何日历模板。请引用后再设置，保证设置内容可被计算';
I18N.Baseline.Error.TbnameError = '必填项';
I18N.Baseline.Error.TbnameValidError = '允许汉字，英文字母，数字，下划线和空格';
I18N.Baseline.Error.Calc = '所选数据的时间跨度大于一个月，无法计算，请重新选择数据';
I18N.Baseline.Error.SpecialError = '补充日期冲突， 请重新选择时段';
I18N.Baseline.Error.SpecialOtherError = '补充日期非法， 请重新选择时段';
I18N.Baseline.Error.TbSettingError = '与已添加时段冲突，请重新选择时段';
I18N.Baseline.BaselineModify = {};
I18N.Baseline.BaselineModify.Month = {};
I18N.Baseline.BaselineModify.Month.Jan = '一';
I18N.Baseline.BaselineModify.Month.Feb = '二';
I18N.Baseline.BaselineModify.Month.Mar = '三';
I18N.Baseline.BaselineModify.Month.Apr = '四';
I18N.Baseline.BaselineModify.Month.May = '五';
I18N.Baseline.BaselineModify.Month.June = '六';
I18N.Baseline.BaselineModify.Month.July = '七';
I18N.Baseline.BaselineModify.Month.Aug = '八';
I18N.Baseline.BaselineModify.Month.Sep = '九';
I18N.Baseline.BaselineModify.Month.Oct = '十';
I18N.Baseline.BaselineModify.Month.Nov = '十一';
I18N.Baseline.BaselineModify.Month.Dec = '十二';
I18N.Baseline.BaselineModify.Uom = '千瓦时';
I18N.Baseline.BaselineModify.YearSelect = '请选择配置年份进行编辑';
I18N.Baseline.BaselineModify.YearBaseline = '年基准值';
I18N.Baseline.BaselineModify.YearValue = '年度';
I18N.Baseline.BaselineModify.MonthBaseline = '月基准值';
I18N.Baseline.BaselineBasic.AlarmText = '对以下时段产生报警';
I18N.Baseline.Calc = {};
I18N.Baseline.Calc.MonthBaseline = '月基准值';
I18N.Baseline.TBSettingItem = {};
I18N.Baseline.TBSettingItem.Error = '时间段冲突， 请重新选择时段';
I18N.Baseline.TBSettingItem.CalcRadio = '计算所选数据平均值为基准数据';
I18N.Baseline.TBSettingItem.NormalRadio = '手动设置基准值';
I18N.Baseline.TBSettingItem.TimeSpanSetting = '时段设置';
I18N.Baseline.Calc.workdaytitle = '公休日日历 ：';
I18N.Baseline.Calc.workdaycontent = '默认工作日 : 周一至周五';
I18N.Baseline.Cal = {};
I18N.Baseline.Cal.Date = '{0}月{1}日至{2}月{3}日';
I18N.Baseline.Cal.workday = '工作日 :';
I18N.Baseline.Cal.Holiday = '休息日 :';
I18N.Baseline.Cal.Worktimetitle = '工作时间日历：';
I18N.Baseline.Cal.Worktimecontent = '工作时间以外均为非工作时间';
I18N.Baseline.Cal.Worktime = '工作时间 :';
I18N.Baseline.NormalSetting = {};
I18N.Baseline.NormalSetting.Baseline = '小时基准值';


I18N.MultipleTimespan = {};
I18N.MultipleTimespan.Before = '之前第';
I18N.MultipleTimespan.Button = {};
I18N.MultipleTimespan.Button.Draw = '绘制';
I18N.MultipleTimespan.Button.Cancel = '放弃';
I18N.MultipleTimespan.Title = '历史对比';
I18N.MultipleTimespan.Add = '添加时间段';
I18N.MultipleTimespan.RelativeDate = '相对时间';
I18N.MultipleTimespan.OriginalDate = '原始时间';
I18N.MultipleTimespan.CamparedDate = '对比时间段';
I18N.MultipleTimespan.To = '到';

I18N.Paging = {};
I18N.Paging.Error = {};
I18N.Paging.Error.Pre = '只能输入1到';
I18N.Paging.Error.Next = '之间的正整数';
I18N.Paging.JumpTo = '跳转到第';
I18N.Paging.Page = '页';
I18N.Paging.Jump = '跳转';
I18N.Paging.Button = {};
I18N.Paging.Button.PrePage = '上一页';
I18N.Paging.Button.NextPage = '下一页';



I18N.Map = {};
I18N.Map.Date = {};
I18N.Map.Date.Year = '年';
I18N.Map.Date.Month = '月';
I18N.Map.Date.Day = '日';
I18N.Map.Date.Today = '今日';
I18N.Map.Date.Yesterday = '昨日';
I18N.Map.Date.ThisMonth = '本月';
I18N.Map.Date.LastMonth = '上月';
I18N.Map.Date.ThisYear = '今年';
I18N.Map.Date.LastYear = '去年';

I18N.Map.EnergyInfo = {};
I18N.Map.EnergyInfo.CarbonEmission = 'CO2排放总量';
I18N.Map.EnergyInfo.Cost = '成本总量';
I18N.Map.EnergyInfo.Electricity = '用电总量';
I18N.Map.EnergyInfo.Water = '用水总量';
I18N.Map.EnergyInfo.Gas = '天然气总量';
I18N.Map.EnergyInfo.SoftWater = '软水总量';
I18N.Map.EnergyInfo.Petrol = '汽油总量';
I18N.Map.EnergyInfo.LowPressureSteam = '低压蒸汽总量';
I18N.Map.EnergyInfo.DieselOi = '柴油总量';
I18N.Map.EnergyInfo.Heat = '热量总量';
I18N.Map.EnergyInfo.CoolQ = '冷量总量';
I18N.Map.EnergyInfo.Coal = '煤总量';
I18N.Map.EnergyInfo.CoalOil = '煤油总量';
I18N.Map.EnergyInfo.NonMessage = '暂无能耗信息，请持续关注';

I18N.Map.EnergyInfo.TargetValue = {};
I18N.Map.EnergyInfo.TargetValue.Qualified = '达到目标值';
I18N.Map.EnergyInfo.TargetValue.NotQualified = '未达到目标值';

I18N.Platform = {};
I18N.Platform.Title = '"云能效"管理平台';
I18N.Platform.Config = '平台配置';
I18N.Platform.SP = '服务商管理员';
I18N.Platform.InEnglish = 'In English';
I18N.Platform.MaxLengthError = '请输入不超过200字符的内容';
I18N.Platform.User = {};
I18N.Platform.User.Name = '用户名';
I18N.Platform.User.ShowName = '显示名称';
I18N.Platform.User.ResetPassword = '修改密码';
I18N.Platform.User.RealName = '显示名称';
I18N.Platform.User.Edit = '编辑';
I18N.Platform.User.EditPersonalInfo = '编辑个人信息';
I18N.Platform.User.Position = '职务';
I18N.Platform.User.Role = '功能权限角色';
I18N.Platform.User.ServerManager = '服务商初始管理员';
I18N.Platform.User.ShowFuncAuth = '查看功能权限角色详情';
I18N.Platform.User.Telephone = '手机';
I18N.Platform.User.Email = '电子邮箱';
I18N.Platform.User.EmailError = '电子邮箱格式不正确';
I18N.Platform.User.Logout = '退出';
I18N.Platform.About = {};
I18N.Platform.About.Title = '关于云能效';
I18N.Platform.About.QrCode = '云能效移动端二维码';
I18N.Platform.About.ipadQrCode = 'iPad客户端';
I18N.Platform.About.WeChatQrCode = '微信公众号';
I18N.Platform.About.ContactUs = '联系我们';
I18N.Platform.Password = {};
I18N.Platform.Password.OldPassword = '原始密码';
I18N.Platform.Password.NewPassword = '新密码';
I18N.Platform.Password.confirmNewPassword = '确认新密码';
I18N.Platform.Password.Error01 = '请填写原始密码';
I18N.Platform.Password.Error02 = '请填写新密码';
I18N.Platform.Password.Error03 = '2次输入密码不一致';
I18N.Platform.Password.Error04 = '原始密码错误';
I18N.Platform.Password.Confirm = '完成';
I18N.Platform.Password.Cancel = '放弃';
I18N.Platform.Password.Title = '修改密码';

I18N.Platform.ServiceProvider = {};
I18N.Platform.ServiceProvider.SP = '服务商';
I18N.Platform.ServiceProvider.CustomerName = '按服务商名称排序';
I18N.Platform.ServiceProvider.StartTime = '按最近的运营时间排序';
I18N.Platform.ServiceProvider.NormalStatus = '正常';
I18N.Platform.ServiceProvider.PauseStatus = '暂停';
I18N.Platform.ServiceProvider.OperationTime = '运营时间';
I18N.Platform.ServiceProvider.Status = '状态';
I18N.Platform.ServiceProvider.DeleteContent = '删除服务商“{0}”，该服务商下所有的公共数据、客户数据，以及间接关联的信息也将被删除。';

I18N.Platform.ServiceProvider.SendEmail = '发送邮件';
I18N.Platform.ServiceProvider.SendEmailSuccess = '邮件发送成功';
I18N.Platform.ServiceProvider.Error001 = '服务商已经被其他用户修改！';
I18N.Platform.ServiceProvider.Error002 = '该服务商ID已存在！';
I18N.Platform.ServiceProvider.Error003 = '服务商已经被其他用户删除！';
I18N.Platform.ServiceProvider.ErrorNotice = '错误提示';

I18N.Platform.ServiceProvider.SPName = '服务商名称';
I18N.Platform.ServiceProvider.SPID = '服务商ID';
I18N.Platform.ServiceProvider.SPDomain = '服务商子域名';
I18N.Platform.ServiceProvider.Address = '地址';
I18N.Platform.ServiceProvider.Telephone = '电话';
I18N.Platform.ServiceProvider.Email = '电子邮箱';
I18N.Platform.ServiceProvider.EmailError = '请按照\"user@example.com\"的格式输入';
I18N.Platform.ServiceProvider.LoginUrl = '登录失败返回页面';
I18N.Platform.ServiceProvider.LoginUrlError = '请填写网址，登录失败后页面会自动跳转至所填网址';
I18N.Platform.ServiceProvider.LogOutUrl = '退出页面';
I18N.Platform.ServiceProvider.LogOutUrlError = '请填写网址，退出系统时会自动跳转至所填网址';
I18N.Platform.ServiceProvider.StartDate = '运营时间';
I18N.Platform.ServiceProvider.Comment = '备注';
I18N.Platform.ServiceProvider.Status = '运营状态';
I18N.Platform.ServiceProvider.CalcStatus = '参与能效标识大数据计算';


I18N.Privilege = {};
I18N.Privilege.Common = {};
I18N.Privilege.Common.Common = '公共权限';
I18N.Privilege.Common.DashboardView = '仪表盘与小组件查看';
I18N.Privilege.Common.DashboardManagement = '仪表盘与小组件编辑';
I18N.Privilege.Common.PersonalInfoManagement = '个人信息管理';
I18N.Privilege.Common.MapView = '地图信息查看';
I18N.Privilege.Common.EnergyManager = '能源管理';
I18N.Privilege.Role = {};
I18N.Privilege.Role.Role = '角色权限';
I18N.Privilege.Role.DashboardSharing = '仪表盘和小组件分享与共享';
I18N.Privilege.Role.EnergyUsage = '“能效分析”功能';
I18N.Privilege.Role.CarbonEmission = '“碳排放”功能';
I18N.Privilege.Role.EnergyCost = '“成本”功能';
I18N.Privilege.Role.UnitIndicator = '“单位指标”功能';
I18N.Privilege.Role.RatioIndicator = '“时段能耗比”功能';
I18N.Privilege.Role.LabelingIndicator = '“能效标识”功能';
I18N.Privilege.Role.CorporateRanking = '“集团排名”功能';
I18N.Privilege.Role.EnergyExport = '能源数据导出';
I18N.Privilege.Role.ReportView = '报表导出与查看';
I18N.Privilege.Role.ReportManagement = '报表管理';
I18N.Privilege.Role.EnergyAlarm = '能源报警';
I18N.Privilege.Role.ChartRemarking = '图表标记';
I18N.Privilege.Role.SPManagement = '“云能效”系统管理';
I18N.Privilege.Role.HierarchyManagement = '层级结构管理';
I18N.Privilege.Role.TagManagement = '数据点管理';
I18N.Privilege.Role.KPIConfiguration = '关键能效指标数据点管理';
I18N.Privilege.Role.TagMapping = '数据点关联';
I18N.Privilege.Role.CustomerInfoView = '客户信息查看';
I18N.Privilege.Role.CustomerInfoManagement = '客户信息管理';
I18N.Privilege.Role.CustomLabeling = '自定义能效标识';
I18N.Privilege.Role.BaselineConfiguration = '能耗分析基准值配置';

I18N.Remark = {};
I18N.Remark.Label = '备注';
I18N.Remark.DefaultText = '点击此处添加备注';


//usertype
I18N.Setting.Role = {};

I18N.Setting.Role.AddRole = '角色';
I18N.Setting.Role.Function = '功能权限角色';
I18N.Setting.Role.Type = '功能权限角色类型';
I18N.Setting.Role.Name = '角色名称';
I18N.Setting.Role.Privilege = '功能权限';
I18N.Setting.Role.ErrorTitle = '无法删除功能权限角色“{0}”';
I18N.Setting.Role.ErrorContent = '功能权限角色“{0}”已被用户引用，无法删除。请将所有引用的用户删除后再操作。';
I18N.Setting.Role.DeleteTitle = '删除角色';
I18N.Setting.Role.DeleteContent = '角色"{0}"将被删除';

//carbon factor
I18N.Setting.CarbonFactor = {};
I18N.Setting.CarbonFactor.Title = '转换因子';
I18N.Setting.CarbonFactor.DeleteTitle = '删除转换因子';
I18N.Setting.CarbonFactor.DeleteContent = '转换因子“{0}”将被删除';
I18N.Setting.CarbonFactor.Source = '转换物';
I18N.Setting.CarbonFactor.Target = '转换目标';
I18N.Setting.CarbonFactor.EffectiveYear = '生效日期';
I18N.Setting.CarbonFactor.Conflict = '时间区间重叠，请重新选择';
I18N.Setting.CarbonFactor.ErrorContent = '请输入小于1000000000的正数，小数点后最多保留6位';

I18N.Setting.TOUTariff = {};
I18N.Setting.TOUTariff.TOUSetting = '峰谷电价';
I18N.Setting.TOUTariff.Name = '价格配置名称';
I18N.Setting.TOUTariff.BasicProperties = '基础属性';
I18N.Setting.TOUTariff.PulsePeak = '峰值季节';
I18N.Setting.TOUTariff.BasicPropertyTip = '若设置平时电价，平时电价将充满峰时电价和谷时电价未覆盖的时间段。';
I18N.Setting.TOUTariff.PeakPrice = '峰时电价';
I18N.Setting.TOUTariff.ValleyPrice = '谷时电价';
I18N.Setting.TOUTariff.PlainPrice = '平时电价';
I18N.Setting.TOUTariff.PeakTimeRange = '峰时范围';
I18N.Setting.TOUTariff.ValleyTimeRange = '谷时范围';
I18N.Setting.TOUTariff.PulsePeakPriceSetting = '峰值季节电价配置';
I18N.Setting.TOUTariff.PulsePeakPrice = '峰值季节电价';
I18N.Setting.TOUTariff.PulsePeakDateTime = '峰值季节时间';
I18N.Setting.TOUTariff.DateTimeRange = '日期范围';
I18N.Setting.TOUTariff.PeakValueTimeRange = '峰值时间段';
I18N.Setting.TOUTariff.DeleteTitle = '删除价格配置';
I18N.Setting.TOUTariff.DeleteContent = '价格配置"{0}"将被删除';

I18N.Common.Glossary.Customer = '客户';
I18N.Common.Glossary.User = '用户';

I18N.Setting.Labeling.CustomerName = '客户名称';

I18N.Setting.CustomerManagement.Label = {};
I18N.Setting.CustomerManagement.Label.MapPageInfo = '地图页信息';
I18N.Setting.CustomerManagement.Label.Code = '客户编码';
I18N.Setting.CustomerManagement.Label.Address = '客户地址';
I18N.Setting.CustomerManagement.Label.OperationStartTime = '运营时间';
I18N.Setting.CustomerManagement.Label.Electricity = '用电总量';
I18N.Setting.CustomerManagement.Label.Water = '用水总量';
I18N.Setting.CustomerManagement.Label.CarbonEmission = '二氧化碳排放总量';
I18N.Setting.CustomerManagement.Label.Cost = '成本总量';
I18N.Setting.CustomerManagement.Label.Gas = '天然气总量';
I18N.Setting.CustomerManagement.Label.SoftWater = '软水总量';
I18N.Setting.CustomerManagement.Label.Petrol = '汽油总量';
I18N.Setting.CustomerManagement.Label.LowPressureSteam = '低压蒸汽总量';
I18N.Setting.CustomerManagement.Label.DieselOi = '柴油总量';
I18N.Setting.CustomerManagement.Label.HeatQ = '热量总量';
I18N.Setting.CustomerManagement.Label.CoolQ = '冷量总量';
I18N.Setting.CustomerManagement.Label.Coal = '煤总量';
I18N.Setting.CustomerManagement.Label.CoalOil = '煤油总量';
I18N.Setting.CustomerManagement.Label.SelectTip = '请选择在用户地图页焦点楼宇节点下需要同时显示的能源信息类型。';
I18N.Setting.CustomerManagement.Label.AtleastOneAtMostFive = '请至少选择1项，最多可选择5项。';
I18N.Setting.SPManagement = '“云能效”系统管理';

I18N.Setting.VEEMonitorRule = {};
I18N.Setting.VEEMonitorRule.Rule = '规则集';
I18N.Setting.VEEMonitorRule.RuleName = '规则集名称';
I18N.Setting.VEEMonitorRule.MonitorTag = '监测数据点';
I18N.Setting.VEEMonitorRule.MonitorRule = '监测规则集';
I18N.Setting.VEEMonitorRule.MonitorSetting = '监测扫描设置';
I18N.Setting.VEEMonitorRule.NullValue = '空值';
I18N.Setting.VEEMonitorRule.NegativeValue = '负值';
I18N.Setting.VEEMonitorRule.ZeroValue = '零值';
I18N.Setting.VEEMonitorRule.Notify = '按连续时长设置通知规则';
I18N.Setting.VEEMonitorRule.NotifyMsg = '仅空值需要单独设置通知规则，超出规则的部分发送报警邮件。';
I18N.Setting.VEEMonitorRule.AutoRepair = '自动修复';
I18N.Setting.VEEMonitorRule.AutoRepairMsg = '最多支持30天的数据修复。';
I18N.Setting.VEEMonitorRule.MonitorStartTime = '监测起始时间';
I18N.Setting.VEEMonitorRule.MonitorInterval = '监测扫描间隔';
I18N.Setting.VEEMonitorRule.MonitorDelayTime = '扫描延后时长';
I18N.Setting.VEEMonitorRule.NoMonitorDelay = '无延时';
I18N.Setting.VEEMonitorRule.Receivers = '邮件联系人';
I18N.Setting.VEEMonitorRule.AddReceivers = '添加邮件联系人';
I18N.Setting.VEEMonitorRule.DeleteTitle = '删除规则集';
I18N.Setting.VEEMonitorRule.DeleteContent = '规则集“{0}”将被删除。';
I18N.Setting.VEEMonitorRule.FirstScanTime = '每日首次监测扫描时间为0: 00。';
I18N.Setting.VEEMonitorRule.ScanTimeInfo = '每日监测扫描时间为{0}';
I18N.Setting.VEEMonitorRule.ConsecutiveHours = '连续时长(小时)';
I18N.Setting.VEEMonitorRule.ConsecutiveHoursError = '请输入0-999999999的整数';
I18N.Setting.VEEMonitorRule.AddTagInfo = '点击添加按钮，选择监测数据点';
I18N.Setting.VEEMonitorRule.AddTag = '添加数据点';
I18N.Setting.VEEMonitorRule.AddingTagsInfo = '在列表中点击数据点进行添加';
I18N.Setting.VEEMonitorRule.TagList = '数据点列表';

I18N.Setting.Organization = {};
I18N.Setting.Organization.AssociateTag = '关联数据点';
I18N.Setting.Organization.HierarchyNodeCalendarProperties = '日历属性';
I18N.Setting.Organization.Name = '{0}名称';
I18N.Setting.Organization.Code = '{0}编码';

I18N.Setting.Building = {};
I18N.Setting.Building.HierarchyNodeCostProperties = '成本属性';
I18N.Setting.Building.HierarchyNodePopulationNAreaProperties = '人口面积';
I18N.Setting.Building.Industry = '所属行业';
I18N.Setting.Building.Zone = '所属气候分区';
I18N.Setting.Building.PTagCount = '计量数据P数量';
I18N.Setting.Building.VTagCount = '计量数据V数量';
I18N.Setting.Building.AddImage = '请添加建筑照片';
I18N.Setting.Building.UpdateImage = '重新上传建筑照片';

I18N.Setting.Hierarchy = {};
I18N.Setting.Hierarchy.DeleteTitle = '删除{0}';
I18N.Setting.Hierarchy.DeleteContent = '删除{0}“{1}”，该{2}的所有数据也将被删除。';
I18N.Setting.Hierarchy.AddTagInfo = '点击添加按钮，选择关联数据点';
I18N.Setting.Hierarchy.AddCalendarInfo = '暂无日历属性，点击编辑进行设置';

I18N.Setting.Cost = {};
I18N.Setting.Cost.NoCommodities = '暂无成本属性，点击编辑进行设置。';
I18N.Setting.Cost.Year = '年份';
I18N.Setting.Cost.FormatYear = '{0}年';
I18N.Setting.Cost.Month = '月份';
I18N.Setting.Cost.EffectiveDate = '生效日期';
I18N.Setting.Cost.PriceType = '价格类型';
I18N.Setting.Cost.FixedPrice = '固定电价';
I18N.Setting.Cost.ComplexPrice = '综合电价';
I18N.Setting.Cost.PriceUom = '元';
I18N.Setting.Cost.DemandCostMode = '需量成本模式';
I18N.Setting.Cost.DemandCost = '需量成本';
I18N.Setting.Cost.TransformerMode = '变压器容量模式';
I18N.Setting.Cost.TimeMode = '时间容量模式';
I18N.Setting.Cost.TransformerUOM = '元/千伏安';
I18N.Setting.Cost.TransformerCapacity = '变压器容量';
I18N.Setting.Cost.DemandPrice = '需求价格';
module.exports = I18N;
