
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
I18N.MainMenu.Asset = 'My assets';
I18N.MainMenu.Alarm = 'Failure alarm';
I18N.MainMenu.Maintain = 'Equipment maintenance ';
I18N.MainMenu.Setting = 'Setup';
I18N.MainMenu.Customer = 'Customer management';
I18N.MainMenu.User = 'User management';
I18N.MainMenu.DeviceTemplate = 'Ledger template ';
I18N.MainMenu.ParameterTemplate = 'Parameter Template';

I18N.MainMenu.Map = 'Map';
I18N.MainMenu.Alarm = 'Alarm';
I18N.MainMenu.Energy = 'Energy';
I18N.MainMenu.report = 'Report';

I18N.Login = {};
I18N.Login.UserName = 'Username';
I18N.Login.Password = 'Password';
I18N.Login.Logout = 'Logout';
I18N.Login.Login = 'Login';

I18N.M212001 = 'User does not exist';
I18N.M212002 = 'Invalid service provider ';
I18N.M212003 = 'Service provider does not exist';
I18N.M212004 = 'Service provider does not take effect';
I18N.M212005 = 'User does not take effect';
I18N.M212006 = 'Incorrect password';
I18N.M212007 = 'Incorrect service provider domain name';

I18N.Common = {};
I18N.Common.Glossary = {};
I18N.Common.Glossary.HierarchyNode = 'Hierarchical node';

I18N.Common.Glossary.MonthName = {};
I18N.Common.Glossary.ShortMonth = {};
I18N.Common.Glossary.WeekDay = {};

I18N.Common.Glossary.MonthName.January = 'January';
I18N.Common.Glossary.MonthName.February = 'February';
I18N.Common.Glossary.MonthName.March = 'March';
I18N.Common.Glossary.MonthName.April = 'April';
I18N.Common.Glossary.MonthName.May = 'May';
I18N.Common.Glossary.MonthName.June = 'June';
I18N.Common.Glossary.MonthName.July = 'July';
I18N.Common.Glossary.MonthName.August = 'August';
I18N.Common.Glossary.MonthName.September = 'September';
I18N.Common.Glossary.MonthName.October = 'October';
I18N.Common.Glossary.MonthName.November = 'November';
I18N.Common.Glossary.MonthName.December = 'December';

I18N.Common.Glossary.ShortMonth.January = 'January';
I18N.Common.Glossary.ShortMonth.February = 'February';
I18N.Common.Glossary.ShortMonth.March = 'March';
I18N.Common.Glossary.ShortMonth.April = 'April';
I18N.Common.Glossary.ShortMonth.May = 'May';
I18N.Common.Glossary.ShortMonth.June = 'June';
I18N.Common.Glossary.ShortMonth.July = 'July';
I18N.Common.Glossary.ShortMonth.August = 'August';
I18N.Common.Glossary.ShortMonth.September = 'September';
I18N.Common.Glossary.ShortMonth.October = 'October';
I18N.Common.Glossary.ShortMonth.November = 'November';
I18N.Common.Glossary.ShortMonth.December = 'December';

I18N.Common.Glossary.WeekDay.Monday = 'Monday';
I18N.Common.Glossary.WeekDay.Tuesday = 'Tuesday';
I18N.Common.Glossary.WeekDay.Wednesday = 'Wednesday';
I18N.Common.Glossary.WeekDay.Thursday = 'Thursday';
I18N.Common.Glossary.WeekDay.Friday = 'Friday';
I18N.Common.Glossary.WeekDay.Saturday = 'Saturdays';
I18N.Common.Glossary.WeekDay.Sunday = 'Sunday';

I18N.Common.DateRange = {};
I18N.Common.DateRange.Last7Day = 'Last 7 Days';
I18N.Common.DateRange.Last30Day = 'Last 30 Days';
I18N.Common.DateRange.Last12Month = 'Last 12 months';
I18N.Common.DateRange.Today = 'Today';
I18N.Common.DateRange.Yesterday = 'Yesterday';
I18N.Common.DateRange.ThisWeek = 'This week';
I18N.Common.DateRange.LastWeek = 'Last week';
I18N.Common.DateRange.ThisMonth = 'This month';
I18N.Common.DateRange.LastMonth = 'Last month';
I18N.Common.DateRange.ThisYear = 'This year';
I18N.Common.DateRange.LastYear = 'Last year';
I18N.Common.DateRange.Customerize = 'user-defined';
I18N.Common.DateRange.CustomerizeTime = 'user-defined';
I18N.Common.DateRange.RelativedTime = 'Relative time';

I18N.Common.Glossary.Order = {};
I18N.Common.Glossary.Order.Ascending = 'Ascending';
I18N.Common.Glossary.Order.Descending = 'Descending';
I18N.Common.Glossary.Order.All = 'All';
I18N.Common.Glossary.Order.Rank3 = 'Top 3';
I18N.Common.Glossary.Order.Rank5 = 'Top 5';
I18N.Common.Glossary.Order.Rank10 = 'Top 10';
I18N.Common.Glossary.Order.Rank20 = 'Top 20';
I18N.Common.Glossary.Order.Rank50 = 'Top 50';

I18N.Common.Button = {};
I18N.Common.Button.Calendar = {};
I18N.Common.Button.Calendar.ShowHC = 'Cold and warm season';
I18N.Common.Button.Calendar.ShowHoliday = 'Non-working time';
I18N.Common.Button.Show = 'View';

I18N.Common.CarbonUomType = {};
I18N.Common.CarbonUomType.StandardCoal = 'Standard coal';
I18N.Common.CarbonUomType.CO2 = 'Carbon dioxide';
I18N.Common.CarbonUomType.Tree = 'Tree';

I18N.DateTimeFormat = {};
I18N.DateTimeFormat.HighFormat = {};
I18N.DateTimeFormat.HighFormat.Millisecond = '%Hour%Minute%Secnod%L Ms';
I18N.DateTimeFormat.HighFormat.Second = '%H%M%S';
I18N.DateTimeFormat.HighFormat.Minute = '%H%M';
I18N.DateTimeFormat.HighFormat.Hour = '%H';
I18N.DateTimeFormat.HighFormat.Day = '%month%day';
I18N.DateTimeFormat.HighFormat.Dayhour = '%m%d%H';
I18N.DateTimeFormat.HighFormat.Week = '%month%day';
I18N.DateTimeFormat.HighFormat.Month = '%m';
I18N.DateTimeFormat.HighFormat.Fullmonth = '%Y%m';
I18N.DateTimeFormat.HighFormat.Year = '%Y';
I18N.DateTimeFormat.HighFormat.FullDateTime = '%Y%m%d %H%M%S';
I18N.DateTimeFormat.HighFormat.FullDate = '%Y%m%d';
I18N.DateTimeFormat.HighFormat.FullYear = 'Full year';

I18N.DateTimeFormat.IntervalFormat = {};
I18N.DateTimeFormat.IntervalFormat.Second = 'MMDD,YYYY, HHmmss';
I18N.DateTimeFormat.IntervalFormat.FullMinute = 'MMDD, YYYY, HHmmss';
I18N.DateTimeFormat.IntervalFormat.RangeFullMinute = 'MMDD, YYYY, HHmmss';
I18N.DateTimeFormat.IntervalFormat.Minute = 'HHmm';
I18N.DateTimeFormat.IntervalFormat.FullHour = 'MMDD,YYYY,HH';
I18N.DateTimeFormat.IntervalFormat.Hour = 'HH';
I18N.DateTimeFormat.IntervalFormat.FullDay = 'MMDD,YYYY';
I18N.DateTimeFormat.IntervalFormat.Day = 'DD';
I18N.DateTimeFormat.IntervalFormat.Week = 'MMDD,YYYY';
I18N.DateTimeFormat.IntervalFormat.Month = 'MMYYYY';
I18N.DateTimeFormat.IntervalFormat.MonthDate = 'DDMM';
I18N.DateTimeFormat.IntervalFormat.Year = 'YYYY';
I18N.DateTimeFormat.IntervalFormat.FullDateTime = 'MMDD,YYYY, HHmmss';
I18N.DateTimeFormat.IntervalFormat.FullDate = 'MMDD,YYYY';
I18N.DateTimeFormat.IntervalFormat.MonthDayHour = 'mdH';
I18N.DateTimeFormat.IntervalFormat.DayHour = 'dH';

I18N.EM = {};
I18N.EM.To = 'to';
I18N.EM.Week = 'week';
I18N.EM.Raw = 'minute';
I18N.EM.Hour = 'hour';
I18N.EM.Day = 'day';
I18N.EM.Month = 'month';
I18N.EM.Year = 'year';
I18N.EM.Clock24 = '24 o\'clock';
I18N.EM.Clock24InWidget = '24 o\'clock';
I18N.EM.Clock24Minute0 = '24:00:00';

I18N.EM.UseRaw = 'By minute';
I18N.EM.UseWeek = 'By week';
I18N.EM.UseHour = 'By hour';
I18N.EM.UseDay = 'By day';
I18N.EM.UseMonth = 'By month';
I18N.EM.UseYear = 'By year';
I18N.EM.StepError = 'The data point selected does not support {0} step size; try another step size.';

I18N.EM.Tool = {};
I18N.EM.Tool.ClearChart = 'Clear chart';
I18N.EM.Tool.AssistCompare = 'Supporting comparison';
I18N.EM.Tool.Weather = {};
I18N.EM.Tool.Weather.WeatherInfo = 'Weather';
I18N.EM.Tool.Weather.Temperature = 'Temperature';
I18N.EM.Tool.Weather.Humidity = 'Humidity';
I18N.EM.Tool.Calendar = {};
I18N.EM.Tool.Calendar.BackgroundColor = 'Show Calendar';
I18N.EM.Tool.Calendar.NoneWorkTime = 'Non-Work Time';
I18N.EM.Tool.Calendar.HotColdSeason = 'HC seasons';
I18N.EM.Tool.Benchmark = 'Industry benchmark values';
I18N.EM.Tool.HistoryCompare = 'History comparison';
I18N.EM.Tool.BenchmarkSetting = 'Benchmark value setup';
I18N.EM.Tool.DataSum = 'Data Summing';

I18N.EM.KpiModeEM = 'Energy Consumption';
I18N.EM.KpiModeCarbon = 'Carbon emission';
I18N.EM.KpiModeCost = 'Cost';

I18N.EM.ErrorNeedValidTimeRange = 'Please choose the right time range';


I18N.EM.Rank = {};
I18N.EM.Rank.TotalRank = 'Overall ranking';
I18N.EM.Rank.RankByPeople = 'Per capita ranking';
I18N.EM.Rank.RankByArea = 'Ranking by unit area';
I18N.EM.Rank.RankByHeatArea = 'Ranking by unit heating area';
I18N.EM.Rank.RankByCoolArea = 'Ranking by unit cooling area';
I18N.EM.Rank.RankByRoom = 'Ranking by unit guestroom';
I18N.EM.Rank.RankByUsedRoom = 'Ranking by guestroom occupied';
I18N.EM.Rank.RankByBed = 'Ranking by number of bed';
I18N.EM.Rank.RankByUsedBed = 'Ranking by number of bed occupied';
I18N.EM.Rank.HierTitle = 'Please select the hierarchy nodes for ranking';
I18N.EM.Rank.RankName = 'Ranking';
I18N.EM.Rank.RankTooltip = 'Ranking:{0}/{1}';

I18N.EM.Unit = {};
I18N.EM.Unit.UnitOriginal = 'Original indicator value';
I18N.EM.Unit.UnitPopulationAlias = 'Per capita';
I18N.EM.Unit.UnitPopulation = 'Unit population';
I18N.EM.Unit.UnitArea = 'Unit area';
I18N.EM.Unit.UnitColdArea = 'Unit cooling area';
I18N.EM.Unit.UnitWarmArea = 'Unit heating area';
I18N.EM.Unit.UnitRoom = 'Unit guestroom';
I18N.EM.Unit.UnitUsedRoom = 'Unit guestroom occupied';
I18N.EM.Unit.UnitBed = 'Number of bed';
I18N.EM.Unit.UnitUsedBed = 'Number of bed occupied';

I18N.EM.DayNightRatio = 'Day-night ratio';
I18N.EM.WorkHolidayRatio = 'Work-break ratio';

I18N.EM.Ratio = {};
I18N.EM.Ratio.CaculateValue = 'Calculated value';
I18N.EM.Ratio.RawValue = 'Original value';
I18N.EM.Ratio.TargetValue = 'Target value';
I18N.EM.Ratio.BaseValue = 'Benchmark value';



I18N.EM.Total = 'Overview';
I18N.EM.Plain = 'Normal';
I18N.EM.Valley = 'Valley';
I18N.EM.Peak = 'Peak';
I18N.EM.ByPeakValley = 'Show peak and valley';

I18N.EM.EnergyAnalyse = {};
I18N.EM.EnergyAnalyse.AddIntervalWindow = {};
I18N.EM.EnergyAnalyse.AddIntervalWindow.Title = 'Historical data comparison';
I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePreviousComboLabel = 'Last';
I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious7Day = '7 days';
I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious30Day = '30 days';
I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious12Month = '30 months';

I18N.EM.CannotShowCalendarByStep = 'The current step size does not support display of {0} background color';
I18N.EM.CannotShowCalendarByTimeRange = 'Can\'t see calendar background? Try another time period';
I18N.EM.WeatherSupportsOnlySingleHierarchy = 'This function only supports single-level data points.';
I18N.EM.WeatherSupportsOnlyHourlyStep = 'This function only supports hourly step size.';

I18N.EM.CharType = {};
I18N.EM.CharType.Line = 'Line';
I18N.EM.CharType.Bar = 'Column';
I18N.EM.CharType.Stack = 'Stacked chart';
I18N.EM.CharType.Pie = 'Pie chart';
I18N.EM.CharType.RawData = 'Raw data';

I18N.EM.Legend = {};
I18N.EM.Legend.ToLine = 'Change to line chart display';
I18N.EM.Legend.ToColumn = 'Change to histogram display';
I18N.EM.Legend.ToStacking = 'Change to stacked chart display';

//workday
I18N.Setting = {};
I18N.Setting.Calendar = {};
I18N.Setting.Calendar.WorkDay = 'Working days';
I18N.Setting.Calendar.Holiday = 'Non-working days';
I18N.Setting.Calendar.DefaultWorkDay = 'Default working days: Monday to Friday';
I18N.Setting.Calendar.AdditionalDay = 'Supplementary date';
I18N.Setting.Calendar.ItemType = 'Date Type';
I18N.Setting.Calendar.StartDate = 'Start date';
I18N.Setting.Calendar.EndDate = 'End Date';
I18N.Setting.Calendar.Month = 'month';
I18N.Setting.Calendar.StartMonth = 'Start Month';
I18N.Setting.Calendar.EndMonth = 'End Month';
I18N.Setting.Calendar.Date = 'Day';
I18N.Setting.Calendar.SeansonType = 'Season Type';
I18N.Setting.Calendar.MonthDayFromTo = '{0}Month{1}day to {2}month{3}day';

I18N.Setting.Calendar.WarmSeason = 'Heating season';
I18N.Setting.Calendar.ColdSeason = 'Cooling season';

I18N.Setting.Benchmark = {};
I18N.Setting.Benchmark.Label = {};
I18N.Setting.Benchmark.Label.None = 'None';
I18N.Setting.Benchmark.Label.SelectLabelling = 'Please choose energy efficiency label';

I18N.Setting.Labeling = {};
I18N.Setting.Labeling.Label = {};

I18N.Setting.Labeling.Label.Industry = 'Industry';
I18N.Setting.Labeling.Label.ClimateZone = 'Climate zone';
I18N.Setting.Labeling.Label.CustomizedLabeling = 'User-defined energy efficiency label';
I18N.Setting.Labeling.Label.Labeling = 'Energy efficiency label';
I18N.Setting.Labeling.Label.LabelingSetting = 'Energy efficiency label Configuration';
I18N.Setting.Labeling.Label.IndustryLabeling = 'Industry energy efficiency label';
I18N.Setting.Labeling.Label.IndustryLabelingSetting = 'Configuration of industry energy efficiency label ';
I18N.Setting.Labeling.Label.LabelingGrade = 'Level of energy efficiency label';
I18N.Setting.Labeling.Label.DataYear = 'Data Source';

I18N.Setting.TargetBaseline = {};
I18N.Setting.TargetBaseline.AlarmThreshold = 'Alarm Sensitivity';
I18N.Setting.TargetBaseline.AlarmThresholdTip = 'Send alarm when sensitivity of the data is higher than that of the benchmark value.  ';


I18N.Message = {};

I18N.Message.DeletionConcurrency = '{0} does not exist. We will refresh it immediately.';
I18N.Message.UpdateConcurrency = '{0} has been modified. We will refresh it immediately.';
I18N.Message.CustomerUnavailable = 'Sorry, but the client does not exist or has no access, please exit the system and log in again.';

I18N.Message.M1 = 'Server error.';
I18N.Message.M8 = 'You do not have access to this function.';
I18N.Message.M9 = 'You do not have access to the data.';

I18N.Message.M01002 = 'Hierarchy ID is illegal. You cannot access the advanced attributes.';
I18N.Message.M01006 = 'The code already exists.';
I18N.Message.M01010 = 'The name already exists.';
I18N.Message.M01011 = 'The parent node of the hierarchical tree has been deleted and the node can not be saved.';
I18N.Message.M01012 = 'The hierarchical nodes include child node and can not be deleted.';
I18N.Message.M01013 = 'The nodes of the hierarchy exceed limit.';
I18N.Message.M01014 = 'The node has been modified or deleted by other users, and the hierarchical tree will be refreshed.';
I18N.Message.M01015 = 'The hierarchical nodes do not include child node.'; //for energy view single tag to pie chart
I18N.Message.M01016 = 'Relevant hierarchy does not have a valid calendar, and the target value and the benchmark value for this year can not be obtained.';
I18N.Message.M01018 = 'Cannot move to target, please drag according rule:<br/>Org->Org,Customer;<br/>Site->Site,Customer;<br/>Building->Site,Org,Customer.';
I18N.Message.M01019 = 'The hierarchy was modified';
I18N.Message.M01251 = 'Advanced attributes of the hierarchy node have been modified by other users. Interface will be refreshed.';
I18N.Message.M01254 = 'Entries of advanced attributes are illegal, and can not be saved.';
I18N.Message.M01301 = 'Calendar has been modified by other users.';
I18N.Message.M01302 = 'Calendar has been created for this node and recreation is not allowed.';
I18N.Message.M01304 = 'This data point is not associated with any hierarchy.';
I18N.Message.M01305 = 'The hierarchy associated with the data point has no calendar feature, and can not be calculated.';
I18N.Message.M01306 = 'Time periods are overlapped. Please check it.';
I18N.Message.M01401 = 'The hierarchical nodes already have system dimension settings that can not be deleted.';
I18N.Message.M01402 = 'The hierarchical nodes already have regional dimension settings that can not be deleted.';
I18N.Message.M01405 = 'The hierarchical nodes already have calendar settings that can not be deleted.';
I18N.Message.M01406 = 'The hierarchical nodes already have cost settings that can not be deleted.';
I18N.Message.M01407 = 'The hierarchical nodes already have advanced attribute settings that can not be deleted.';
I18N.Message.M01408 = 'The hierarchical nodes already have data point associations that can not be deleted.';

//building picture
I18N.Message.M01503 = 'Only jpg / png images can be uploaded. Please upload again.';
I18N.Message.M01504 = 'Image file is too large. Please upload again.';
I18N.Message.M01505 = 'Image size is too small. Please upload again.';
I18N.Message.M01506 = 'Image size is too large. Please upload again.';
I18N.Message.PictureUploadFailed = 'Image upload failed.Please try again later.';

/******
Energy Error Code
*******/
I18N.Message.M02004 = 'Polymer granularity illegal';
I18N.Message.M02007 = 'Start time can not be earlier than the end time';
I18N.Message.M02008 = 'You can not draw a pie chart since the media is different.';
I18N.Message.M02013 = 'This data point has been deleted and can not be loaded.';
I18N.Message.M02020 = 'Chart export  failed. Please click "View Data" and try again.';
I18N.Message.M02021 = 'EXCEL export  failed. Please click "View Data" and try again.';
I18N.Message.M02104 = 'Unable to convert the media units of non-energy use group   ';
I18N.Message.M02105 = 'Sorry. An error occurred and the pie chart cannot be drawn.  ';
I18N.Message.M02106 = 'Sorry. An error occurred and the pie chart cannot be drawn.  ';
I18N.Message.M02107 = 'Sorry. An error occurred and the pie chart cannot be drawn.  ';
I18N.Message.M02108 = 'The media units are of different nature and can not be converted.';
I18N.Message.M02109 = 'Media is different and can not be converted to a common unit';
I18N.Message.M02114 = 'Data points can not be converted into a unified unit';
I18N.Message.M02017 = 'Data point association has changed, and you can not draw a chart  ';
I18N.Message.M02203 = 'This data point does not exist, and you can not obtain the target base value.';
I18N.Message.M02205 = 'Day - night ratio (key energy efficiency indicator) can not be shown by hour  ';
I18N.Message.M02301 = 'This hierarchical node does not exist.';
I18N.Message.M02023 = 'The selected data points are of different media, and it\'s impossible to draw a pie chart!';
I18N.Message.M02009 = 'You can not view data since you have no data access or the access right has been modified.';
I18N.Message.M02407 = 'Peak/valley/normal price can not be shown by minute / hour.';
I18N.Message.M02408 = 'This node have no peak/valley periods, so it can not be displayed.';
I18N.Message.M02027 = 'The step size of the data point in the anomaly record is less than the smallest step size supported, so it can not be accessed.';

I18N.Message.M02601 = 'The day and night calendar is missing, and chart can not be drawn. Please set it up and try again.'; //'{0}所对应的层级节点没有设置昼夜日历，无法查看昼夜比数据';
I18N.Message.M02602 = 'The working calendar is missing, and chart can not be drawn. Please set it up and try again.'; //'{0}所对应的层级节点没有设置工作日历，无法查看公休比数据';
I18N.Message.M02603 = 'The total area is missing, and chart can not be drawn. Please set it up and try again.';
I18N.Message.M02604 = 'The cooling area is missing, and chart can not be drawn. Please set it up and try again.';
I18N.Message.M02605 = 'The heating area is missing, and chart can not be drawn. Please set it up and try again.';
I18N.Message.M02606 = 'The population is missing, and chart can not be drawn. Please set it up and try again.';

I18N.Message.M02500 = 'This data point is not associated with any hierarchy.';
I18N.Message.M02501 = 'The population attribute is missing, and chart can not be drawn. Please set it up and try again.';
I18N.Message.M02502 = 'The area attribute is missing, and chart can not be drawn. Please set it up and try again.';
I18N.Message.M02503 = 'The heating area attribute is missing, and chart can not be drawn. Please set it up and try again.';
I18N.Message.M02504 = 'The cooling area attribute is missing, and chart can not be drawn. Please set it up and try again.';

I18N.Message.M02505 = 'The population attribute is missing, and chart can not be drawn. Please set it up and try again.';
I18N.Message.M02506 = 'The area attribute is missing, and chart can not be drawn. Please set it up and try again.';
I18N.Message.M02507 = 'The heating area attribute is missing, and chart can not be drawn. Please set it up and try again.';
I18N.Message.M02508 = 'The cooling area attribute is missing, and chart can not be drawn. Please set it up and try again.';
I18N.Message.M02509 = 'The energy-efficiency label has been deleted. Please select again for access.';
I18N.Message.M02510 = 'This energy-efficiency label has no related data. Please select again for access.';
I18N.Message.M02701 = 'Part of the hierarchy selected has been deletion,and can not be ranked.';

/******
 * Carbon
 ******/
I18N.Message.M03005 = 'The conversion factor is the same as before, and the interface will be refreshed.';
I18N.Message.M03008 = 'This conversion is not in line with the target,and the conversion factor can not be saved.';

/******
 * TOU Tariff Error Code
 ******/
I18N.Message.M03025 = 'The price policy configuration has been modified by other users, and the interface will be refreshed.';
I18N.Message.M03029 = 'Peak season does not exist, and the interface will be refreshed.';
I18N.Message.M03030 = 'You can not save an empty pricing policy.';
I18N.Message.M03032 = 'The flat load power price has not been set up. Make sure the peak and valley periods fill 24 hours.';
I18N.Message.M03033 = 'Pricing policy must include the price for peak and valley period.';
I18N.Message.M03034 = 'Peak time period is empty, and it can not be saved.';
I18N.Message.M03035 = 'Time periods are overlapped. Please check it.';
I18N.Message.M03038 = 'Time periods are overlapped. Please check it.';
I18N.Message.M03039 = 'Peak time period is empty, and it can not be saved.';
I18N.Message.M03040 = 'The name already exists.';
I18N.Message.M03041 = 'Peak season already exists.';
I18N.Message.M03042 = 'This entry can only be a positive number';

/******
 * Calendar
 ******/
I18N.Message.M03052 = 'Calendar end date must be greater than or equal to the start date.';
I18N.Message.M03053 = 'Time periods are overlapped. Please check it.';
I18N.Message.M03054 = 'The name already exists.';
I18N.Message.M03057 = 'Time periods are overlapped. Please check it.';
I18N.Message.M03058 = 'Calendar has been cited, and can not be deleted.'; //--------------
I18N.Message.M03059 = 'Dates in February can not be 29/30/31.';
I18N.Message.M03060 = 'Date in Satsuki can not be 31.';
I18N.Message.M03061 = 'Add at least one heating season or cooling season.';
I18N.Message.M03062 = 'Heating season and cooling season can not fall in the same month.';
I18N.Message.M03063 = 'Time difference between the heating season and cooling season can not be less than seven days.';
I18N.Message.M03902 = 'Price policy name exceeds 100 characters';
I18N.Message.M03903 = 'Price policy name contains illegal characters';

/*****
labeling
******/
I18N.Message.M03080 = 'The energy efficiency label already exists, and the interface will be refreshed.';
I18N.Message.M03081 = 'The energy efficiency label has been deleted, and the interface will be refreshed.';
I18N.Message.M03082 = 'The energy efficiency label has been modified by other users, and the interface will be refreshed.';
I18N.Message.M03083 = 'The energy efficiency label has no setup option.';
I18N.Message.M03084 = 'Energy efficiency label error.';
I18N.Message.M03085 = 'The year of data source of energye efficiency label  is incorrect.';

/******
SystemDimension Error Code, NOTE that for error of
04050,04052,04053,04054,
refresh is needed.
04051 should refresh hierarchy tree
*******/
I18N.Message.M04052 = 'Before checking the current dimension node, make ensure its parent node has been checked.';
I18N.Message.M04054 = 'Before unchecking the current dimension node, make ensure that all of its child nodes are not checked.';
I18N.Message.M04055 = 'The current system dimension node has no child node.'; //for energy view single tag to pie chart
I18N.Message.M04056 = 'Unable to delete the system dimension node. Please delete all the data point associations under this node.';
/******
Dashboard Error Code, NOTE that for error of
05002
refresh is needed.
05011 should refresh hierarchy tree
*******/
I18N.Message.M05001 = 'The name already exists.';
I18N.Message.M05011 = 'The hierarchical nodes corresponding to this dashboard have been deleted, and the interface will be refreshed immediately.';
I18N.Message.M05013 = 'Number of dashboard of this hierarchy node has reached the upper limit.Please delete some content to continue.';
I18N.Message.M05014 = 'Contents in "My Favorites" has reached the upper limit. Please delete some content to continue.';
I18N.Message.M05015 = 'The name already exists.';
I18N.Message.M05016 = 'Nnumber of widgets in the dashboard has reached the upper limit, and you can not create a new widget.';
I18N.Message.M05017 = 'The Id of dashboards for all widgets are not exactly the same.';

I18N.Message.M05023 = '{0}{1}';
I18N.Message.M05023_Sub0 = 'The following user Id have been deleted: {0}.';
I18N.Message.M05023_Sub1 = 'Unable to share with these people: {0}.';

/******
Tag Error Code, NOTE that for error of 06001, 06117,06152,06139,06154,06156, refresh is needed.
*******/

I18N.Message.M06100 = 'Data point has been deleted and can not be loaded.';
I18N.Message.M06104 = 'The name already exists.';
I18N.Message.M06107 = 'The code already exists.';
I18N.Message.M06109 = 'The channel already exists.';
I18N.Message.M06122 = 'The name already exists.';
I18N.Message.M06127 = 'The code already exists.';
I18N.Message.M06133 = 'Format of the formula is incorrect, please check it.';
I18N.Message.M06134 = 'The formula of virtual data points includes illegal data points, and can not be saved.';
I18N.Message.M06136 = 'The formula of virtual data points includes loop calling, and can not be saved.';

I18N.Message.M06156 = 'The formula of virtual data points includes illegal data points, and can not be saved.';
I18N.Message.M06160 = 'The media and unit of the physical data points does not match,and it can not be saved.';
I18N.Message.M06161 = 'The media and unit of the virtual data points does not match,and it can not be saved.';
I18N.Message.M06164 = 'The calculation step size of virtual data points is illegal and can not be saved.';
I18N.Message.M06174 = 'Type of the  physical data points is illegal and can not be saved.';
I18N.Message.M06182 = '{0} "{1}" are being referenced, so it can not be deleted. Please cancel all references and try again. <br/> referenced objects: {2}';
I18N.Message.M06183 = 'The data point has expired. The data point may have been modified or deleted by others. Interface will be refreshed.';
I18N.Message.M06186 = 'The corresponding data point already has energy consumption data points of the same media.  ';
I18N.Message.M06192 = 'The calculation step size of day-night ratio data point must be greater than or equal to one day.';
I18N.Message.M06193 = 'The child nodes of the current hierarchy node does not include data points that shares the same media with this data point. ';
I18N.Message.M06194 = 'The child nodes of the current system dimension does not include data points that shares the same media with this data point. ';
I18N.Message.M06195 = 'The child nodes of the current regional dimension does not include data points that shares the same media with this data point. ';
I18N.Message.M06196 = 'The current hierarchy node does not include data points that shares the same media unit with this data point. ';
I18N.Message.M06197 = 'The current system dimension does not include data points that shares the same media with this data point. ';
I18N.Message.M06198 = 'The current regional dimension does not include data points that shares the same media with this data point. ';
I18N.Message.M06201 = 'Cannot change Calculation step to "{0}". This tag is refereced by other tags, reference Tag calculation step must be larger or equal to referenced tag';
I18N.Message.M06202 = 'The corresponding data point already has energy consumption data points of the same media.  ';
I18N.Message.M06203 = 'This data point is not energy consumption data.';


I18N.Message.M07001 = 'Data rights have been modified by other users, and the interface will be refreshed.';
I18N.Message.M07000 = 'No function right.';
I18N.Message.M07009 = 'No data right.';

I18N.Message.M07010 = 'The name already exists.';
I18N.Message.M07011 = 'The role has bound a user and can not be deleted.';
I18N.Message.M07021 = 'Hierarchical node does not exist or has been deleted, and the interface will be refreshed.';

/*
AreaDimensionNodeNameDuplicate = 208,
AreaDimensionNodeLevelOverLimitation = 209,
AreaDimensionNodeHasNoParent = 210,
AreaDimensionNodeHasBeenDeleted = 211,
AreaDimensionNodeHasChildren = 212,
AreaDimensionNodeHasBeenModified = 213,
*/
I18N.Message.M08200 = 'Hierarchical node associated with the dimension node has been deleted, and the interface will be refreshed.';
I18N.Message.M08208 = 'Duplicate name';
I18N.Message.M08209 = 'Level of the current dimension node exceeds the maximum length, and can not be saved.';
I18N.Message.M08210 = 'The parent node of the current dimension node has been deleted, and the interface will be refreshed.';
I18N.Message.M08211 = 'The current dimensions node has been deleted by others, and the interface will be refreshed.';
I18N.Message.M08212 = 'Unable to delete this regional dimension node. Please delete all child nodes under this node.';
I18N.Message.M08214 = 'The current regional dimension node has no child nodes.'; //for energy view single tag to pie chart
I18N.Message.M08215 = 'Unable to delete this regional dimension node. Please delete all data point associations under this node.';

I18N.Message.M09001 = 'Data has been deleted, and the interface will be refreshed.';
I18N.Message.M09002 = 'Data has been modified by others, and the interface will be refreshed.';
I18N.Message.M09107 = 'Data has been modified by others, click "OK" to reload data.';
I18N.Message.M09112 = 'The corresponding data points have been deleted. The interface will be refreshed immediately.';
I18N.Message.M09113 = 'Please set calculation rules before doing the calculation.';
I18N.Message.M09114 = 'Value exceeds the legal range, and it can not be saved. The range of valid values ​​is -999999999.999999 ~ 999,999,999.999999.';
I18N.Message.M09155 = I18N.format(I18N.Message.UpdateConcurrency, 'Calc Value');
I18N.Message.M09157 = 'The corresponding data points have been deleted. The interface will be refreshed immediately.';
I18N.Message.M09158 = 'Data points are not associated to the hierarchical tree and dimension tree. Please associate data points first.';
I18N.Message.M09159 = 'The calendar attribute of the hierarchical tree associated is empty. Please set the calendar for the hierarchical tree first.';
I18N.Message.M09160 = 'The calendar attribute of the hierarchical tree associated for this year is empty. Please set the calendar attribute for this year for the hierarchical tree first.';

//Cost concurrency error
I18N.Message.M10007 = 'Peak/valley/normal price can not be shown by hour  ';
I18N.Message.M10015 = 'Data of the same hierarchical node already exists,and the interface will be refreshed';
I18N.Message.M10019 = 'Demand cost Tag is invalid data';
I18N.Message.M10020 = 'Reactive power Tag is invalid data';
I18N.Message.M10021 = 'Active power Tag is invalid data';

I18N.Message.M11012 = 'The customer is cited by hierarchy and can not be deleted!';
I18N.Message.M11351 = 'Duplicate code';
I18N.Message.M11352 = 'The name already exists.';
I18N.Message.M11354 = 'Image file is too large. Please upload again.';
I18N.Message.M11355 = 'Image size is too large. Please upload again.';
I18N.Message.M11356 = 'Only GIF/PNG images can be uploaded. Please upload again.';
I18N.Message.M11357 = 'Customer information has been deleted by other users, and the interface will be refreshed.';
I18N.Message.M11358 = 'Customers have been cited by other data and can not be deleted.';
I18N.Message.M11404 = 'The customer is cited by user and can not be deleted.';
I18N.Message.M11408 = 'The customer is cited by data points and can not be deleted.';


I18N.Message.M12001 = 'The name already exists.';
I18N.Message.M12003 = 'Incorrect password ';
I18N.Message.M12006 = 'Default platform administrator account can not be deleted.';
I18N.Message.M12008 = 'The user has been deleted. The interface will be refreshed.';
I18N.Message.M12009 = 'You can not delete your own account.';
I18N.Message.M12010 = 'You can not modify someone else\'s password.';
I18N.Message.M12011 = 'You can not modify someone else\'s data.';
I18N.Message.M12050 = 'Image file is too large, upload failed. Please upload again.';
I18N.Message.M12051 = 'Please upload jpg / png / gif / bmp images';
I18N.Message.M12052 = 'Feedback message was not sent successfully.';
I18N.Message.M12100 = 'Username does not exist.';
I18N.Message.M12101 = 'Email address error';
I18N.Message.M12102 = 'The link for resetting password is incorrect.';
I18N.Message.M12103 = 'Link has failed!';
I18N.Message.M12105 = 'Service provider has been suspended! Please contact the administrator.';
I18N.Message.M12106 = 'Service provider has been deleted! Please contact the administrator.';
I18N.Message.M12107 = 'Your user has been deleted! Please contact the administrator.';
I18N.Message.M12108 = 'Can not send it to non-trial users!';


I18N.Message.M13001 = 'Data points have been deleted by other users!';
I18N.Message.M13002 = 'Alarm has been deleted by other users!';
I18N.Message.M13003 = 'Alarm has been modified by other users!';
I18N.Message.M13011 = 'Calendar has been deleted by other users!';

I18N.Message.M13015 = 'Alarm has been configured by other users!';
I18N.Message.M13016 = 'Users have been deleted by other users!';

I18N.Message.M14001 = 'Service provider has been modified by other users!';
I18N.Message.M14002 = 'Duplicate service provider ID!';
I18N.Message.M14003 = 'Service provider has been deleted by other users!';
I18N.Message.M14004 = 'Service provider has been suspended!';
I18N.Message.M14005 = 'Service provider does not have an administrator!';
I18N.Message.M14006 = 'Service provider is being established. Please try again later!';

I18N.Message.M11364 = 'Map page data already exists, and the interface will be refreshed';
I18N.Message.M11365 = 'Contain at least one map page';
I18N.Message.M11366 = 'Customer has been deleted, and the interface will be refreshed.';
I18N.Message.M11367 = 'Map page has been modified by someone else, and the interface is about to refresh.';
I18N.Message.M03070 = 'Industry standard already exists, and the interface will be refreshed.';
I18N.Message.M03071 = 'Industry standard has been deleted, and the interface will be refreshed.';
I18N.Message.M03072 = 'Industry standard has been modified by other users, and the interface will be refreshed.';
I18N.Message.M03073 = 'There is no industry standard setup area.';
I18N.Message.M01500 = 'Map information already exists, and the interface will be refreshed.';
I18N.Message.M01501 = 'Map information has been deleted by other users, and the interface will be refreshed.';
I18N.Message.M01502 = 'Map information has been modified by other users, and the interface will be refreshed.';
I18N.Message.M01507 = 'Building node has been deleted by other users, and the interface will be refreshed.';
I18N.Message.M05025 = 'The share has been deleted.';
I18N.Message.M05024 = 'The user has been deleted.';
I18N.Message.M05027 = 'The subscriber has been deleted.';
I18N.Message.M05028 = 'The subscriber has been deleted.';
I18N.Message.M00953 = 'Illegal entry.';

I18N.Message.M11600 = 'This customer already has self-defined energy efficiency label. Please use another name.';
I18N.Message.M11601 = 'Incorrect self-defined  energy efficiency label.';
I18N.Message.M11602 = 'User-defined energy efficiency label level is not continuous.';
I18N.Message.M11603 = 'Concurrency error. Please refresh.';

I18N.Message.M05003 = 'Illegal entry.';

I18N.Message.M20001 = 'Duplicate rule names.';
I18N.Message.M20002 = 'Rule has been deleted.';
I18N.Message.M20003 = 'Rule has been modified.';
I18N.Message.M20006 = 'Customer has been deleted.';
I18N.Message.M20007 = 'Total number of rules excceds limit.';
I18N.Message.M20012 = 'Some of the data points have been associated to other rules.';
I18N.Message.M20013 = 'You can not modify the data under the following data points: {0}.';
I18N.Message.M20014 = 'Some of the data points have been deleted or have no data access.';

I18N.Message.M21707 = 'Some of the data points have been deleted or have no data access.';
I18N.Message.M21705 = 'Duplicate report title  ';
I18N.Message.M21702 = 'The report has been modified and the page will be refreshed immediately.';
I18N.Message.M21706 = 'The report has duplicate Tag, please check it.';

I18N.Folder = {};
I18N.Folder.NewWidget = {};
I18N.Folder.NewWidget.Menu1 = 'Energy consumption analysis  ';
I18N.Folder.NewWidget.Menu2 = 'Unit index';
I18N.Folder.NewWidget.Menu3 = 'Energy consumption ratio of certain period';
I18N.Folder.NewWidget.Menu4 = 'Energy efficiency label';
I18N.Folder.NewWidget.Menu5 = 'Group Rank';
I18N.Folder.NewWidget.DefaultName = 'Last 7 Days {0}';

I18N.Folder.NewFolder = 'New folder';
I18N.Folder.FolderName = 'Folder';
I18N.Folder.WidgetName = 'Graph';

I18N.Folder.SaveNameError = {};
I18N.Folder.SaveNameError.E032 = '{1} named "{0}" already exists. Please choose another name.';
I18N.Folder.SaveNameError.E029 = 'Name {0} can not be left empty. Please enter again.';
I18N.Folder.SaveNameError.E031 = 'Name {0} exceeds the maximum length of 100. Please enter again.';

I18N.Folder.Copy = {};
I18N.Folder.Copy.Title = 'Copy {0}';
I18N.Folder.Copy.Label = '{0} Name';
I18N.Folder.Copy.firstActionLabel = 'Copy';
I18N.Folder.Copy.Error = 'The name already exists.';
I18N.Folder.Copy.NameLongError = 'You can not enter more than 100 characters';

I18N.Folder.SaveAs = {};
I18N.Folder.SaveAs.Title = 'Chart saved as  ';
I18N.Folder.SaveAs.Label = 'Chart saved as  ';
I18N.Folder.SaveAs.firstActionLabel = 'Save';

I18N.Folder.Send = {};
I18N.Folder.Send.Success = '{0} has been sent successfully';
I18N.Folder.Send.Error = '{0} transmission failed. It can not be sent to the user: {1}.';

I18N.Folder.Drag = {};
I18N.Folder.Drag.Error = '{1} named "{0}" already exists. Unable to drag it.';

I18N.Folder.Export = {};
I18N.Folder.Export.Error = 'The chart is empty, and can not be exported.';

I18N.Folder.Detail = {};
I18N.Folder.Detail.SubTitile = 'From {0}';
I18N.Folder.Detail.Title = {};
I18N.Folder.Detail.Title.Menu1 = 'Copy';
I18N.Folder.Detail.Title.Menu2 = 'Send';
I18N.Folder.Detail.Title.Menu3 = 'Delete';
I18N.Folder.Detail.WidgetMenu = {};
I18N.Folder.Detail.WidgetMenu.Menu1 = 'Copy';
I18N.Folder.Detail.WidgetMenu.Menu2 = 'Send';
I18N.Folder.Detail.WidgetMenu.Menu3 = 'Share';
I18N.Folder.Detail.WidgetMenu.Menu4 = 'Export';
I18N.Folder.Detail.WidgetMenu.Menu5 = 'Delete';

I18N.Commodity = {};
I18N.Commodity.Overview = 'Media Overview';

I18N.Hierarchy = {};
I18N.Hierarchy.RankingButtonName = 'Please select the hierarchy nodes for ranking';
I18N.Hierarchy.ButtonName = 'Please select the hierarchy node';
I18N.Hierarchy.Confirm = 'Ok';
I18N.Hierarchy.Clear = 'Clear';
I18N.Hierarchy.Menu1 = 'Customer';
I18N.Hierarchy.Menu2 = 'Organization';
I18N.Hierarchy.Menu3 = 'Site';
I18N.Hierarchy.Menu4 = 'Building';

I18N.Dim = {};
I18N.Dim.AllButtonName = 'All dimensions';
I18N.Dim.ButtonName = 'Dimension node';

I18N.ALarm = {};
I18N.ALarm.Menu1 = 'Whole';
I18N.ALarm.Menu2 = 'Alarm Configed';
I18N.ALarm.Menu3 = 'Baseline Configed';
I18N.ALarm.Menu4 = 'UnConfiged';


I18N.Tag = {};
I18N.Tag.Tooltip = 'Data point {0} / {1} has been selected ';
I18N.Tag.ExceedTooltip = 'Number of added data points is beyond the range. You can not select all. Please select the target data points one by one.';
I18N.Tag.AlarmStatus1 = 'Baseline UnConfiged';
I18N.Tag.AlarmStatus2 = 'Baseline Configed';
I18N.Tag.AlarmStatus3 = 'Alarm UnConfiged';
I18N.Tag.AlarmStatus4 = 'Alarm Configed';

I18N.Template = {};
I18N.Template.Copy = {};
I18N.Template.Copy.DestinationFolder = 'Target folder';
I18N.Template.Copy.Cancel = 'Drop';
I18N.Template.Copy.DefaultName = '{0} - copy';
I18N.Template.Delete = {};
I18N.Template.Delete.Delete = 'Delete';
I18N.Template.Delete.Cancel = 'Drop';
I18N.Template.Delete.Title = 'Delete {0}';
I18N.Template.Delete.FolderContent = 'Delete folder "{0}". All contents of the folder will also be deleted';
I18N.Template.Delete.WidgetContent = 'Chart "{0}" will be deleted';
I18N.Template.Share = {};
I18N.Template.Share.Title = 'Share Charts';
I18N.Template.Share.Share = 'Share';
I18N.Template.Share.Cancel = 'Drop';
I18N.Template.User = {};
I18N.Template.User.Selected = 'Selected {0} person';
I18N.Template.Send = {};
I18N.Template.Send.Title = 'Send {0}';
I18N.Template.Send.Send = 'Send';
I18N.Template.Send.Cancel = 'Drop';



module.exports = I18N;
