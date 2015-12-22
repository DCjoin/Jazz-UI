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
I18N.MainMenu.Setting = 'Setting';
I18N.MainMenu.Customer = 'Customer management';
I18N.MainMenu.User = 'User management';
I18N.MainMenu.DeviceTemplate = 'Ledger template ';
I18N.MainMenu.ParameterTemplate = 'Parameter template';

I18N.MainMenu.Map = 'Map';
I18N.MainMenu.Alarm = 'Alarm';
I18N.MainMenu.Energy = 'Energy';
I18N.MainMenu.Report = 'Report';
I18N.MainMenu.DailyReport = 'Daily report';
I18N.MainMenu.Template = 'Template';

I18N.Login = {};
I18N.Login.UserName = 'User name';
I18N.Login.Password = 'Password';
I18N.Login.Logout = 'Log out';
I18N.Login.Login = 'Login';

I18N.M212001 = 'User does not exist';
I18N.M212002 = 'Service provider is invalid';
I18N.M212003 = 'Service provider does not exist';
I18N.M212004 = 'Service provider is invalid';
I18N.M212005 = 'User is invalid';
I18N.M212006 = 'Incorrect password';
I18N.M212007 = 'Incorrect service provider domain name';

I18N.Common = {};
I18N.Common.Glossary = {};
I18N.Common.Glossary.HierarchyNode = 'Hierarchy node';
I18N.Common.Glossary.Max = 'Max';
I18N.Common.Glossary.Min = 'Min';
I18N.Common.Glossary.Auto = 'Auto';

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

I18N.Common.Glossary.ShortMonth.January = 'Jan.';
I18N.Common.Glossary.ShortMonth.February = 'Feb.';
I18N.Common.Glossary.ShortMonth.March = 'Mar.';
I18N.Common.Glossary.ShortMonth.April = 'Apr.';
I18N.Common.Glossary.ShortMonth.May = 'May';
I18N.Common.Glossary.ShortMonth.June = 'Jun.';
I18N.Common.Glossary.ShortMonth.July = 'Jul.';
I18N.Common.Glossary.ShortMonth.August = 'Aug.';
I18N.Common.Glossary.ShortMonth.September = 'Sept.';
I18N.Common.Glossary.ShortMonth.October = 'Oct.';
I18N.Common.Glossary.ShortMonth.November = 'Nov.';
I18N.Common.Glossary.ShortMonth.December = 'Dec.';

I18N.Common.Glossary.WeekDay.Monday = 'Mon.';
I18N.Common.Glossary.WeekDay.Tuesday = 'Tue.';
I18N.Common.Glossary.WeekDay.Wednesday = 'Wed.';
I18N.Common.Glossary.WeekDay.Thursday = 'Thur.';
I18N.Common.Glossary.WeekDay.Friday = 'Fri.';
I18N.Common.Glossary.WeekDay.Saturday = 'Sat.';
I18N.Common.Glossary.WeekDay.Sunday = 'Sun.';

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
I18N.Common.DateRange.Customerize = 'User-defined';
I18N.Common.DateRange.CustomerizeTime = 'User-defined';
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

I18N.Common.Glossary.Name = 'Name';
I18N.Common.Glossary.Code = 'Code';
I18N.Common.Glossary.Index = 'Index';


I18N.Common.Button = {};
I18N.Common.Button.Calendar = {};
I18N.Common.Button.Calendar.ShowHC = 'HC seasons';
I18N.Common.Button.Calendar.ShowHoliday = 'Non-work time';
I18N.Common.Button.Show = 'View';

I18N.Common.CarbonUomType = {};
I18N.Common.CarbonUomType.StandardCoal = 'Standard coal';
I18N.Common.CarbonUomType.CO2 = 'Carbon dioxide';
I18N.Common.CarbonUomType.Tree = 'Tree';

I18N.Common.AggregationStep = {};
I18N.Common.AggregationStep.Minute = 'Minute';
I18N.Common.AggregationStep.Hourly = 'Hour';
I18N.Common.AggregationStep.Daily = 'Daily';
I18N.Common.AggregationStep.Weekly = 'Weekly';
I18N.Common.AggregationStep.Monthly = 'Monthly';
I18N.Common.AggregationStep.Yearly = 'Yearly';

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
I18N.DateTimeFormat.IntervalFormat.Second = 'MM/DD,YYYY, HH:mm:ss';
I18N.DateTimeFormat.IntervalFormat.FullMinute = 'MM/DD, YYYY, HH:mm:ss';
I18N.DateTimeFormat.IntervalFormat.RangeFullMinute = 'MM/DD, YYYY, HH:mm:ss';
I18N.DateTimeFormat.IntervalFormat.Minute = 'HH:mm';
I18N.DateTimeFormat.IntervalFormat.FullHour = 'MM/DD,YYYY,HH';
I18N.DateTimeFormat.IntervalFormat.Hour = 'HH';
I18N.DateTimeFormat.IntervalFormat.FullDay = 'MM/DD,YYYY';
I18N.DateTimeFormat.IntervalFormat.Day = 'DD';
I18N.DateTimeFormat.IntervalFormat.Week = 'MM/DD,YYYY';
I18N.DateTimeFormat.IntervalFormat.Month = 'MM,YYYY';
I18N.DateTimeFormat.IntervalFormat.MonthDate = 'DD/MM';
I18N.DateTimeFormat.IntervalFormat.Year = 'YYYY';
I18N.DateTimeFormat.IntervalFormat.FullDateTime = 'MM/DD,YYYY, HH:mm:ss';
I18N.DateTimeFormat.IntervalFormat.FullDate = 'MM/DD,YYYY';
I18N.DateTimeFormat.IntervalFormat.MonthDayHour = 'm/d/H';
I18N.DateTimeFormat.IntervalFormat.DayHour = 'd/H';

I18N.EM = {};
I18N.EM.To = 'To';
I18N.EM.Week = 'Week';
I18N.EM.Raw = 'Minute';
I18N.EM.Hour = 'Hour';
I18N.EM.Day = 'Day';
I18N.EM.Month = 'Month';
I18N.EM.Year = 'Year';
I18N.EM.Clock24 = '24';
I18N.EM.Clock24InWidget = '24';
I18N.EM.Clock24Minute0 = '24:00:00';

I18N.EM.UseRaw = 'By minute';
I18N.EM.UseWeek = 'By week';
I18N.EM.UseHour = 'By hour';
I18N.EM.UseDay = 'By day';
I18N.EM.UseMonth = 'By month';
I18N.EM.UseYear = 'By year';
I18N.EM.StepError = 'Selected tag does not support {0} interval. Please change to another interval and try.';

I18N.EM.Tool = {};
I18N.EM.Tool.ClearChart = 'Clear chart';
I18N.EM.Tool.AssistCompare = 'Analysis supporting';
I18N.EM.Tool.Weather = {};
I18N.EM.Tool.Weather.WeatherInfo = 'Weather';
I18N.EM.Tool.Weather.Temperature = 'Temperature';
I18N.EM.Tool.Weather.Humidity = 'Humidity';
I18N.EM.Tool.Calendar = {};
I18N.EM.Tool.Calendar.BackgroundColor = 'Show calendar';
I18N.EM.Tool.Calendar.NoneWorkTime = 'Non-work time';
I18N.EM.Tool.Calendar.HotColdSeason = 'HC seasons';
I18N.EM.Tool.Benchmark = 'Industry benchmark';
I18N.EM.Tool.HistoryCompare = 'History comparison';
I18N.EM.Tool.BenchmarkSetting = 'Baseline setting';
I18N.EM.Tool.DataSum = 'Data Sum';

I18N.EM.KpiModeEM = 'Energy';
I18N.EM.KpiModeCarbon = 'Carbon';
I18N.EM.KpiModeCost = 'Cost';

I18N.EM.ErrorNeedValidTimeRange = 'Please choose the right time range';


I18N.EM.Rank = {};
I18N.EM.Rank.TotalRank = 'Overall ranking';
I18N.EM.Rank.RankByPeople = 'Per capita';
I18N.EM.Rank.RankByArea = 'Unit area';
I18N.EM.Rank.RankByHeatArea = 'Unit heating area';
I18N.EM.Rank.RankByCoolArea = 'Unit cooling area';
I18N.EM.Rank.RankByRoom = 'Unit guest room';
I18N.EM.Rank.RankByUsedRoom = 'Unit guest room occupied';
I18N.EM.Rank.RankByBed = 'Unit bed';
I18N.EM.Rank.RankByUsedBed = 'Unit bed occupied';
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
I18N.EM.Unit.UnitRoom = 'Unit guest room';
I18N.EM.Unit.UnitUsedRoom = 'Unit guest room occupied';
I18N.EM.Unit.UnitBed = 'Unit bed';
I18N.EM.Unit.UnitUsedBed = 'Unit bed occupied';

I18N.EM.DayNightRatio = 'Day-night ratio';
I18N.EM.WorkHolidayRatio = 'Day-off ratio';

I18N.EM.Ratio = {};
I18N.EM.Ratio.CaculateValue = 'Calculated value';
I18N.EM.Ratio.RawValue = 'Original value';
I18N.EM.Ratio.TargetValue = 'Target';
I18N.EM.Ratio.BaseValue = 'Baseline';



I18N.EM.Total = 'Overview';
I18N.EM.Plain = 'Normal period';
I18N.EM.Valley = 'Valley period';
I18N.EM.Peak = 'Peak period';
I18N.EM.ByPeakValley = 'Peak/Valley display';

I18N.EM.EnergyAnalyse = {};
I18N.EM.EnergyAnalyse.AddIntervalWindow = {};
I18N.EM.EnergyAnalyse.AddIntervalWindow.Title = 'Historical data comparison';
I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePreviousComboLabel = 'Last';
I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious7Day = '7 days';
I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious30Day = '30 days';
I18N.EM.EnergyAnalyse.AddIntervalWindow.CompareTimePrevious12Month = '30 months';

I18N.EM.CannotShowCalendarByStep = 'The current interval does not support display of {0} background color.';
I18N.EM.CannotShowCalendarByTimeRange = 'No calendar background is seen? Change to another time and try.';
I18N.EM.WeatherSupportsOnlySingleHierarchy = 'This function only supports single-building tags.';
I18N.EM.WeatherSupportsOnlyHourlyStep = 'This function only supports hourly interval.';

I18N.EM.CharType = {};
I18N.EM.CharType.Line = 'Line';
I18N.EM.CharType.Bar = 'Column';
I18N.EM.CharType.Stack = 'Stack';
I18N.EM.CharType.Pie = 'Pie';
I18N.EM.CharType.RawData = 'Raw data';

I18N.EM.Legend = {};
I18N.EM.Legend.ToLine = 'Switch to line';
I18N.EM.Legend.ToColumn = 'Switch to column';
I18N.EM.Legend.ToStacking = 'Switch to stack';

I18N.EM.Labeling = {};
I18N.EM.Labeling.LowEnergy = 'Low';
I18N.EM.Labeling.HighEnergy = 'High';
I18N.EM.Labeling.ViewLabeling = 'Labelling view';
I18N.EM.Labeling.NonBuilding = 'This node is not building, please choose other nodes';
I18N.EM.Labeling.NonData = 'No energy data in this time range.';
I18N.EM.Labeling.DifferentCommodity = 'Chosen tags are not same commodity, please choose again';
I18N.EM.Labeling.SelectHieForSys = 'Choose Building to config area dimension';

I18N.EM.Report = {};
I18N.EM.Report.Select = 'Mandatory';
I18N.EM.Report.Creator = 'Creator';
I18N.EM.Report.CreateTime = 'Create time';
I18N.EM.Report.Name = 'Name';
I18N.EM.Report.Report = 'Report';
I18N.EM.Report.ReportSort = 'Sort by report name';
I18N.EM.Report.UserSort = 'Sort by user name';
I18N.EM.Report.NameSort = 'Sort by template name';
I18N.EM.Report.TimeSort = 'Sort by create time';
I18N.EM.Report.Add = 'Add';
I18N.EM.Report.Delete = 'Delete';
I18N.EM.Report.Confirm = 'OK';
I18N.EM.Report.Edit = 'Edit';
I18N.EM.Report.Export = 'Export';
I18N.EM.Report.Cancel = 'Cancel';
I18N.EM.Report.Save = 'Save';
I18N.EM.Report.Reference = 'Referenced';
I18N.EM.Report.Template = 'Report template';
I18N.EM.Report.TemplateTitle = 'Template import';
I18N.EM.Report.TemplateFileName = 'Template';
I18N.EM.Report.SelectTemplate = 'Choose template';
I18N.EM.Report.ReportName = 'Report name';
I18N.EM.Report.Data = 'Report data';
I18N.EM.Report.DataType = 'Data type';
I18N.EM.Report.DataSource = 'Data source';
I18N.EM.Report.TimeRange = 'Time range';
I18N.EM.Report.Step = 'Step';
I18N.EM.Report.NumberRule = 'Data rule';
I18N.EM.Report.AllTime = 'Whole';
I18N.EM.Report.Hourly = 'Integral point value';
I18N.EM.Report.Daily = 'Zero clock value';
I18N.EM.Report.ExistTemplate = 'Template uploaded';
I18N.EM.Report.UploadTemplate = 'Upload a new template';
I18N.EM.Report.DownloadTemplate = 'Download and view';
I18N.EM.Report.EditTag = 'Edit a tag';
I18N.EM.Report.SelectTag = 'Select a tag';
I18N.EM.Report.ViewTag = 'View tag';
I18N.EM.Report.AllTag = 'All tag';
I18N.EM.Report.SelectTag = 'Select tag';
I18N.EM.Report.Upload = 'Upload';
I18N.EM.Report.UploadTem = 'Upload template';
I18N.EM.Report.Reupload = 'Upload it again';
I18N.EM.Report.Order = 'Sequence of time points';
I18N.EM.Report.OrderAsc = 'Positive sequence';
I18N.EM.Report.OrderDesc = 'Inverted sequence';
I18N.EM.Report.TargetSheet = 'Target Sheet';
I18N.EM.Report.StartCell = 'Initial cell';
I18N.EM.Report.Layout = 'Layout direction';
I18N.EM.Report.ReportTypeEnergy = 'Data of energy efficiency';
I18N.EM.Report.Original = 'Original value';
I18N.EM.Report.ReportTypeCarbon = 'Data of carbon emission';
I18N.EM.Report.ReportTypeCost = 'Cost data';
I18N.EM.Report.TagSelectionTitle = 'Select a tag';
I18N.EM.Report.TagShouldNotBeEmpty = 'Please select at least one tag';

I18N.EM.Report.NonReportCriteria = 'Include at least one set of report data';
I18N.EM.Report.WrongExcelFile = 'Template format is wrong. Only xls or xlsx files are supprted.';
I18N.EM.Report.TemplateHasBeenRefed = 'Report template {0} can not be deleted because it is used now. Please retry it after remove all associations.';
I18N.EM.Report.RefObject = 'Referred Object:';
I18N.EM.Report.UploadingTemplate = 'Importing file {0}.';
I18N.EM.Report.DeleteMessage = 'Delete report template {0}?';
I18N.EM.Report.DuplicatedName = 'File is existed. Please rename and upload it again.';
I18N.EM.Report.NeedUploadTemplate = 'Please upload new template.';
I18N.EM.Report.StepError = 'Select tag does not support step {0}, please select step {1}.';
I18N.EM.Report.StepError2 = 'Selected tag does not support step {0} and has no supported step in current time range. Please modify tag or time range.';
I18N.EM.Report.ExportFormat = 'Report Export Format';
I18N.EM.Report.ExportTagName = 'Export Data Name';
I18N.EM.Report.ExportTimeLabel = 'Export Time Label';
I18N.EM.Report.ExportStepError = 'There is unsupported step, please check it.';
I18N.EM.Report.ExportTagUnassociated = 'Data is unassociated.';

I18N.EM.Export = {};
I18N.EM.Export.Preview = 'Preview export picture';

//workday
I18N.Setting = {};
I18N.Setting.Calendar = {};
I18N.Setting.Calendar.WorkDay = 'Workday';
I18N.Setting.Calendar.Holiday = 'Non-workday';
I18N.Setting.Calendar.DefaultWorkDay = 'Default workday: Mon. -Fri.';
I18N.Setting.Calendar.AdditionalDay = 'Supplementary date';
I18N.Setting.Calendar.ItemType = 'Date type';
I18N.Setting.Calendar.StartDate = 'Start date';
I18N.Setting.Calendar.EndDate = 'End date';
I18N.Setting.Calendar.Month = 'Month';
I18N.Setting.Calendar.StartMonth = 'Start month';
I18N.Setting.Calendar.EndMonth = 'End month';
I18N.Setting.Calendar.Date = 'Day';
I18N.Setting.Calendar.SeansonType = 'Season type';
I18N.Setting.Calendar.MonthDayFromTo = '{0}Month{1}day to {2}month{3}day';

I18N.Setting.Calendar.WarmSeason = 'Heating season';
I18N.Setting.Calendar.ColdSeason = 'Cooling season';

I18N.Setting.Benchmark = {};
I18N.Setting.Benchmark.Label = {};
I18N.Setting.Benchmark.Label.None = 'None';
I18N.Setting.Benchmark.Label.SelectLabelling = 'Please select a labeling';

I18N.Setting.Labeling = {};
I18N.Setting.Labeling.Label = {};

I18N.Setting.Labeling.Label.Industry = 'Industry';
I18N.Setting.Labeling.Label.ClimateZone = 'Climate zone';
I18N.Setting.Labeling.Label.CustomizedLabeling = 'Customized labeling';
I18N.Setting.Labeling.Label.Labeling = 'Labeling';
I18N.Setting.Labeling.Label.LabelingSetting = 'Labeling';
I18N.Setting.Labeling.Label.IndustryLabeling = 'Industry labeling';
I18N.Setting.Labeling.Label.IndustryLabelingSetting = 'Industry labeling';
I18N.Setting.Labeling.Label.LabelingGrade = 'Labeling level';
I18N.Setting.Labeling.Label.DataYear = 'Data source';

I18N.Setting.TargetBaseline = {};
I18N.Setting.TargetBaseline.AlarmThreshold = 'Alarm sensitivity';
I18N.Setting.TargetBaseline.AlarmThresholdTip = 'When the data goes beyond the sensitivity set by the reference value, the alarm is displayed. ';

I18N.Setting.User = {};
I18N.Setting.User.EnergyConsultant = 'Energy Consultant';
I18N.Setting.User.Technicist = 'Technicist';
I18N.Setting.User.CustomerManager = 'Customer Manager';
I18N.Setting.User.PlatformManager = 'Platform Manager';
I18N.Setting.User.EnergyManager = 'Energy Manager';
I18N.Setting.User.EnergyEngineer = 'Energy Engineer';
I18N.Setting.User.DeptManager = 'Department Manager';
I18N.Setting.User.Manager = 'Managers';
I18N.Setting.User.BusinessPerson = 'Business Person';
I18N.Setting.User.Sales = 'Sales';
I18N.Setting.User.ServerManager = 'SP Manager';


I18N.Common.Label = {};
I18N.Common.Label.UnknownError = 'Sorry, unknown error.';
I18N.Common.Label.MandatoryEmptyError = 'Required';
I18N.Common.Label.ExcelColumnError = 'Please fill in the cell name as C1，AB23';

I18N.Message = {};

I18N.Message.DeletionConcurrency = '{0} does not exist. We will refresh it immediately.';
I18N.Message.UpdateConcurrency = '{0} has been modified. We will refresh it immediately.';
I18N.Message.CustomerUnavailable = 'Sorry. This customer does not exist or has no access authority. Please log out and log in again.';

I18N.Message.M1 = 'Server error.';
I18N.Message.M8 = 'You do not have this function authority.';
I18N.Message.M9 = 'You do not have this data authority.';

I18N.Message.M01002 = 'Hierarchy ID is illegal. You cannot access the advanced attributes.';
I18N.Message.M01006 = 'The code already exists.';
I18N.Message.M01010 = 'The name already exists.';
I18N.Message.M01011 = 'The parent node of this hierarchy tree has been deleted and this node cannot be saved.';
I18N.Message.M01012 = 'This hierarchy node includes child nodes and thus cannot be deleted.';
I18N.Message.M01013 = 'The hierarchy level exceeds the limit.';
I18N.Message.M01014 = '"This node has been modified or deleted by another user, therefore the hierarchy tree will be refreshed."';
I18N.Message.M01015 = 'The current hierarchy node has no child nodes.'; //for energy view single tag to pie chart
I18N.Message.M01016 = 'Relevant hierarchy does not have a valid calendar, thus the target line and the baseline for this year cannot be obtained.';
I18N.Message.M01018 = 'Cannot move to target node, please following rules to move node: <br/>Org -> Org, Customer; <br/>Site -> Org, Customer; <br/>Building -> Site, Org, Customer.';
I18N.Message.M01019 = 'The hierarchy was modified';
I18N.Message.M01251 = 'Advanced attributes of the hierarchy node have been modified by other users. page will be refreshed.';
I18N.Message.M01254 = 'Entries of advanced properties are illegal, and cannot be saved.';
I18N.Message.M01301 = 'Calendar has been modified by other users.';
I18N.Message.M01302 = 'Calendar has been created for this node and recreation is not allowed.';
I18N.Message.M01304 = 'This tag is not associated with any hierarchy.';
I18N.Message.M01305 = 'The hierarchy associated with the tag has no calendar feature, and cannot be calculated.';
I18N.Message.M01306 = 'Time periods are overlapped. Please check it.';
I18N.Message.M01401 = 'The hierarchy nodes already have system dimension settings that cannot be deleted.';
I18N.Message.M01402 = 'The hierarchy nodes already have regional dimension settings that cannot be deleted.';
I18N.Message.M01405 = 'The hierarchy nodes already have calendar settings that cannot be deleted.';
I18N.Message.M01406 = 'The hierarchy nodes already have cost settings that cannot be deleted.';
I18N.Message.M01407 = 'The hierarchy nodes already have advanced attribute settings that cannot be deleted.';
I18N.Message.M01408 = 'The hierarchy nodes already have tag associations that cannot be deleted.';

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
I18N.Message.M02007 = 'Start time cannot be earlier than the end time';
I18N.Message.M02008 = 'Pie chart cannot be drawn due to different commodities.';
I18N.Message.M02011 = 'Viewing raw data is not supported for virtual tag.';
I18N.Message.M02013 = 'This tag has been deleted and cannot be loaded.';
I18N.Message.M02020 = 'Chart export  failed. Please click "View Data" and try again.';
I18N.Message.M02021 = 'EXCEL export  failed. Please click "View Data" and try again.';
I18N.Message.M02104 = 'Unable to convert the media units of non-energy use group   ';
I18N.Message.M02105 = 'Sorry. An error occurred and the pie chart cannot be drawn.  ';
I18N.Message.M02106 = 'Sorry. An error occurred and the pie chart cannot be drawn.  ';
I18N.Message.M02107 = 'Sorry. An error occurred and the pie chart cannot be drawn.  ';
I18N.Message.M02108 = 'Cannot be converted because of different properties of commodities.';
I18N.Message.M02109 = 'Cannot be converted into common unit because of different commodities.';
I18N.Message.M02114 = 'Tags cannot be converted into a uniform unit.';
I18N.Message.M02017 = 'Tag association changes and thus drawing cannot be created.';
I18N.Message.M02203 = 'This tag does not exist. Cannot get target and baseline value.';
I18N.Message.M02205 = 'The key performance indicator of day-night ratio cannot be displayed by hour.';
I18N.Message.M02301 = 'This hierarchy node does not exist.';
I18N.Message.M02023 = 'Selected tags have different commodities, so pie charts cannot be drawn jointly.';
I18N.Message.M02009 = 'No data authority or the authority has been modified. Data cannot be inquired.';
I18N.Message.M02407 = 'Electricity price in peak/valley/normal period cannot be displayed in minute or hour level.';
I18N.Message.M02408 = 'This node is not configured with peak/valley period and thus cannot be displayed.';
I18N.Message.M02027 = 'Can not view data because the step in record is smaller than supported minimum step.';

I18N.Message.M02601 = 'The day and night calendar is missing, and chart cannot be drawn. Please try again after setting.'; //'{0}所对应的层级节点没有设置昼夜日历，无法查看昼夜比数��?;
I18N.Message.M02602 = 'The working calendar is missing, and chart cannot be drawn. Please try again after setting.'; //'{0}所对应的层级节点没有设置工作日历，无法查看公休比数��?;
I18N.Message.M02603 = 'The total area is missing, and chart cannot be drawn. Please try again after setting.';
I18N.Message.M02604 = 'The cooling area is missing, and chart cannot be drawn. Please try again after setting.';
I18N.Message.M02605 = 'The heating area is missing, and chart cannot be drawn. Please try again after setting.';
I18N.Message.M02606 = 'The population is missing, and chart cannot be drawn. Please try again after setting.';

I18N.Message.M02500 = 'This tag is not associated with any hierarchy.';
I18N.Message.M02501 = 'The population attribute is missing, and chart cannot be drawn. Please try again after setting.';
I18N.Message.M02502 = 'The area attribute is missing, and chart cannot be drawn. Please try again after setting.';
I18N.Message.M02503 = 'The heating area attribute is missing, and chart cannot be drawn. Please try again after setting.';
I18N.Message.M02504 = 'The cooling area attribute is missing, and chart cannot be drawn. Please try again after setting.';

I18N.Message.M02505 = 'The population attribute is missing, and chart cannot be drawn. Please try again after setting.';
I18N.Message.M02506 = 'The area attribute is missing, and chart cannot be drawn. Please try again after setting.';
I18N.Message.M02507 = 'The heating area attribute is missing, and chart cannot be drawn. Please try again after setting.';
I18N.Message.M02508 = 'The cooling area attribute is missing, and chart cannot be drawn. Please try again after setting.';
I18N.Message.M02509 = 'The energy labeling has been deleted. Please select again.';
I18N.Message.M02510 = 'This energy labeling has no data. Please select again.';
I18N.Message.M02511 = 'Can not draw chart because missing room property, please set it and try again.';
I18N.Message.M02512 = 'Can not draw chart because missing used room property, please set it and try again.';
I18N.Message.M02513 = 'Can not draw chart because missing bed property, please set it and try again.';
I18N.Message.M02514 = 'Can not draw chart because missing used bed property, please set it and try again.';
I18N.Message.M02515 = 'Can not draw chart because missing room property, please set it and try again.';
I18N.Message.M02516 = 'Can not draw chart because missing used room property, please set it and try again.';
I18N.Message.M02517 = 'Can not draw chart because missing bed property, please set it and try again.';
I18N.Message.M02518 = 'Can not draw chart because missing used bed property, please set it and try again.';
I18N.Message.M02701 = 'Some of the selected hierarchy has been deleted,and cannot be ranked.';
I18N.Message.M02809 = 'The area of the selected tag does not support the weather function.';
I18N.Message.M02810 = 'The area of the selected tag does not support the weather function.';

/******
 * Carbon
 ******/
I18N.Message.M03005 = 'The conversion factor is the same as before, and the page will be refreshed.';
I18N.Message.M03008 = 'This conversion is not in line with the target,and the conversion factor cannot be saved.';

/******
 * TOU Tariff Error Code
 ******/
I18N.Message.M03025 = 'The price policy configuration has been modified by other users, and the page will be refreshed.';
I18N.Message.M03029 = 'Peak season does not exist, and the page will be refreshed.';
I18N.Message.M03030 = 'You cannot save an empty pricing policy.';
I18N.Message.M03032 = 'The flat load power price has not been set up. Make sure the peak and valley periods fill 24 hours.';
I18N.Message.M03033 = 'Pricing policy must include the price for peak and valley period.';
I18N.Message.M03034 = 'Peak time period is empty, and it cannot be saved.';
I18N.Message.M03035 = 'Time periods are overlapped. Please check it.';
I18N.Message.M03038 = 'Time periods are overlapped. Please check it.';
I18N.Message.M03039 = 'Peak time period is empty, and it cannot be saved.';
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
I18N.Message.M03058 = 'Calendar has been cited, and cannot be deleted.'; //--------------
I18N.Message.M03059 = 'Dates in February cannot be 29/30/31.';
I18N.Message.M03060 = 'Date in Satsuki cannot be 31.';
I18N.Message.M03061 = 'Add at least one heating season or cooling season.';
I18N.Message.M03062 = 'Heating season and cooling season cannot fall in the same month.';
I18N.Message.M03063 = 'Time difference between the heating season and cooling season cannot be less than seven days.';
I18N.Message.M03902 = 'Price policy name exceeds 100 characters';
I18N.Message.M03903 = 'Price policy name contains illegal characters';

/*****
labeling
******/
I18N.Message.M03080 = 'Energy labeling already exists. Page will be refreshed.';
I18N.Message.M03081 = 'Energy labeling has been deleted. Page will be refreshed.';
I18N.Message.M03082 = 'Energy labeling has been modified by another user. Page will be refreshed.';
I18N.Message.M03083 = 'No region is set for energy labeling.';
I18N.Message.M03084 = 'Labeling level is wrong.';
I18N.Message.M03085 = 'The year of the data source of the energy labeling is wrong.';

/******
SystemDimension Error Code, NOTE that for error of
04050,04052,04053,04054,
refresh is needed.
04051 should refresh hierarchy tree
*******/
I18N.Message.M04052 = 'Before checking the current dimension node, make sure its parent node has been checked.';
I18N.Message.M04054 = 'Before unchecking the current dimension node, make sure that all of its child nodes are not checked.';
I18N.Message.M04055 = 'The current system dimension node has no child node.'; //for energy view single tag to pie chart
I18N.Message.M04056 = 'Unable to delete the system dimension node. Please delete all the tag associations under this node.';
/******
Dashboard Error Code, NOTE that for error of
05002
refresh is needed.
05011 should refresh hierarchy tree
*******/
I18N.Message.M05001 = 'The name already exists.';
I18N.Message.M05011 = 'The hierarchy nodes corresponding to this dashboard have been deleted, and the page will be refreshed immediately.';
I18N.Message.M05013 = 'Number of dashboard of this hierarchy node has reached the upper limit.Please delete some content to continue.';
I18N.Message.M05014 = 'Contents in "My Favorites" has reached the upper limit. Please delete some content to continue.';
I18N.Message.M05015 = 'The name already exists.';
I18N.Message.M05016 = 'Number of widgets in the dashboard has reached the upper limit, and you cannot create a new widget.';
I18N.Message.M05017 = 'The ID of dashboards for all widgets are not exactly the same.';

I18N.Message.M05023 = '{0}{1}';
I18N.Message.M05023_Sub0 = 'The following user ID have been deleted: {0}.';
I18N.Message.M05023_Sub1 = 'Unable to share with these people: {0}.';
I18N.Message.M05032 = 'Same room existed';

/******
Tag Error Code, NOTE that for error of 06001, 06117,06152,06139,06154,06156, refresh is needed.
*******/

I18N.Message.M06100 = 'Tag has been deleted and cannot be loaded.';
I18N.Message.M06104 = 'The name already exists.';
I18N.Message.M06107 = 'The code already exists.';
I18N.Message.M06109 = 'The channel already exists.';
I18N.Message.M06122 = 'The name already exists.';
I18N.Message.M06127 = 'The code already exists.';
I18N.Message.M06133 = 'Format of the formula is incorrect, please check it.';
I18N.Message.M06134 = 'The formula of virtual tags includes illegal data points, and cannot be saved.';
I18N.Message.M06136 = 'The formula of virtual tags includes loop calling, and cannot be saved.';

I18N.Message.M06156 = 'The formula of virtual tags includes illegal tags, and cannot be saved.';
I18N.Message.M06160 = 'The media and unit of the physical tags does not match,and it cannot be saved.';
I18N.Message.M06161 = 'The media and unit of the virtual tags does not match,and it cannot be saved.';
I18N.Message.M06164 = 'The calculation step size of virtual tags is illegal and cannot be saved.';
I18N.Message.M06174 = 'Type of the  physical tags is illegal and cannot be saved.';
I18N.Message.M06182 = '{0} "{1}" are being referenced, so it cannot be deleted. Please cancel all references and try again. <br/> referenced objects: {2}';
I18N.Message.M06183 = 'The tag has expired. The tag may have been modified or deleted by others. page will be refreshed.';
I18N.Message.M06186 = 'The corresponding tag already has energy consumption tags of the same media.  ';
I18N.Message.M06192 = 'The calculation step size of day-night ratio tag must be greater than or equal to one day.';
I18N.Message.M06193 = 'The child nodes of the current hierarchy node does not include tags that shares the same media with this tag. ';
I18N.Message.M06194 = 'The child nodes of the current system dimension does not include tags that shares the same media with this tag. ';
I18N.Message.M06195 = 'The child nodes of the current regional dimension does not include tags that shares the same media with this tag. ';
I18N.Message.M06196 = 'The current hierarchy node does not include tags that shares the same media unit with this tag. ';
I18N.Message.M06197 = 'The current system dimension does not include tags that shares the same media with this tag. ';
I18N.Message.M06198 = 'The current regional dimension does not include tags that shares the same media with this tag. ';
I18N.Message.M06201 = 'Cannot modity the caculated interval to��{0}��, This  tag has been referred to by other tags. Newly calculated interval must be smaller or equal to the calculated interval of the tag referred to.';
I18N.Message.M06202 = 'The corresponding tag already has energy consumption tags of the same media.  ';
I18N.Message.M06203 = 'This tag is not an energy consumption tag.';


I18N.Message.M07001 = 'Data authority has been modified by another user. Page will be refreshed.';
I18N.Message.M07000 = 'No Function authority.';
I18N.Message.M07009 = 'No data authority.';

I18N.Message.M07010 = 'The name already exists.';
I18N.Message.M07011 = 'The role has bound a user and cannot be deleted.';
I18N.Message.M07021 = 'Hierarchy node does not exist or has been deleted, and the page will be refreshed.';

/*
AreaDimensionNodeNameDuplicate = 208,
AreaDimensionNodeLevelOverLimitation = 209,
AreaDimensionNodeHasNoParent = 210,
AreaDimensionNodeHasBeenDeleted = 211,
AreaDimensionNodeHasChildren = 212,
AreaDimensionNodeHasBeenModified = 213,
*/
I18N.Message.M08200 = 'Hierarchy node associated with the dimension node has been deleted, and the page will be refreshed.';
I18N.Message.M08208 = 'Duplicate name';
I18N.Message.M08209 = 'Level of the current dimension node exceeds the maximum length, and cannot be saved.';
I18N.Message.M08210 = 'The parent node of the current dimension node has been deleted, and the page will be refreshed.';
I18N.Message.M08211 = 'The current dimensions node has been deleted by others, and the page will be refreshed.';
I18N.Message.M08212 = 'Unable to delete this regional dimension node. Please delete all child nodes under this node.';
I18N.Message.M08214 = 'The current regional dimension node has no child nodes.'; //for energy view single tag to pie chart
I18N.Message.M08215 = 'Unable to delete this regional dimension node. Please delete all tag associations under this node.';

I18N.Message.M09001 = 'Data has been deleted, and the page will be refreshed.';
I18N.Message.M09002 = 'Data has been modified by others, and the page will be refreshed.';
I18N.Message.M09107 = 'Data has been modified by others, click "OK" to reload data.';
I18N.Message.M09112 = 'The corresponding tags have been deleted. The page will be refreshed immediately.';
I18N.Message.M09113 = 'Please set calculation rules before doing the calculation.';
I18N.Message.M09114 = 'Value exceeds the legal range, and it cannot be saved. The range of valid values ​​is -999999999.999999 ~ 999,999,999.999999.';
I18N.Message.M09155 = I18N.format(I18N.Message.UpdateConcurrency, '����ֵ');
I18N.Message.M09157 = 'The corresponding tags have been deleted. The page will be refreshed immediately.';
I18N.Message.M09158 = 'Tags are not associated to the hierarchy tree and dimension tree. Please associate tags first.';
I18N.Message.M09159 = 'The calendar attribute of the hierarchy tree associated is empty. Please set the calendar for the hierarchy tree first.';
I18N.Message.M09160 = 'The calendar attribute of the hierarchy tree associated for this year is empty. Please set the calendar attribute for this year for the hierarchy tree first.';

//Cost concurrency error
I18N.Message.M10007 = 'Peak/valley/normal price cannot be shown by hour  ';
I18N.Message.M10015 = 'Data of the same hierarchy node already exists,and the page will be refreshed';
I18N.Message.M10019 = 'Demand cost Tag is invalid data';
I18N.Message.M10020 = 'Reactive power tag is invalid data';
I18N.Message.M10021 = 'Active power tag is invalid data';

I18N.Message.M11012 = 'The customer is cited by hierarchy and cannot be deleted!';
I18N.Message.M11351 = 'Duplicate code';
I18N.Message.M11352 = 'The name already exists.';
I18N.Message.M11354 = 'Image file is too large. Please upload again.';
I18N.Message.M11355 = 'Image size is too large. Please upload again.';
I18N.Message.M11356 = 'Only GIF/PNG images can be uploaded. Please upload again.';
I18N.Message.M11357 = 'Customer information has been deleted by other users, and the page will be refreshed.';
I18N.Message.M11358 = 'Customers have been cited by other data and cannot be deleted.';
I18N.Message.M11404 = 'The customer is cited by user and cannot be deleted.';
I18N.Message.M11408 = 'The customer is cited by tags and cannot be deleted.';


I18N.Message.M12001 = 'The name already exists.';
I18N.Message.M12003 = 'Incorrect password ';
I18N.Message.M12006 = 'Default platform administrator account cannot be deleted.';
I18N.Message.M12008 = 'The user has been deleted. The page will be refreshed.';
I18N.Message.M12009 = 'You cannot delete your own account.';
I18N.Message.M12010 = 'You cannot modify someone else\'s password.';
I18N.Message.M12011 = 'You cannot modify someone else\'s data.';
I18N.Message.M12050 = 'Image file is too large, upload failed. Please upload again.';
I18N.Message.M12051 = 'Please upload jpg / png / gif / bmp images';
I18N.Message.M12052 = 'Feedback message was not sent successfully.';
I18N.Message.M12100 = 'User name does not exist.';
I18N.Message.M12101 = 'Email address error';
I18N.Message.M12102 = 'The link for resetting password is incorrect.';
I18N.Message.M12103 = 'Link has expired!';
I18N.Message.M12105 = 'Service provider has been suspended! Please contact the administrator.';
I18N.Message.M12106 = 'Service provider has been deleted! Please contact the administrator.';
I18N.Message.M12107 = 'Your user has been deleted! Please contact the administrator.';
I18N.Message.M12108 = 'Cannot send it to non-trial users!';


I18N.Message.M13001 = 'Tags have been deleted by other users!';
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

I18N.Message.M11364 = 'Map sheet information already exists. Page will be refreshed.';
I18N.Message.M11365 = 'At least one map sheet information is included.';
I18N.Message.M11366 = 'Customer has been deleted. Page will be refreshed.';
I18N.Message.M11367 = 'Map sheet information has been modified by others. Page will be refreshed.';
I18N.Message.M03070 = 'Industry labeling already exists. Page will be refreshed.';
I18N.Message.M03071 = 'Industry labeling has been deleted. Page will be refreshed.';
I18N.Message.M03072 = 'Industry labeling has been modified by another user. Page will be refreshed.';
I18N.Message.M03073 = 'No region is set for industry labeling.';
I18N.Message.M01500 = 'Map information already exists. Page will be refreshed.';
I18N.Message.M01501 = 'Map information has been deleted by another user. Page will be refreshed.';
I18N.Message.M01502 = 'Map information has been modified by another user. Page will be refreshed.';
I18N.Message.M01507 = 'Building node has been deleted by another user. Page will be refreshed.';
I18N.Message.M05025 = 'The share has been deleted.';
I18N.Message.M05024 = 'The user has been deleted.';
I18N.Message.M05027 = 'The subscriber has been deleted.';
I18N.Message.M05028 = 'The subscriber has been deleted.';
I18N.Message.M00953 = 'Illegal entry.';

I18N.Message.M11600 = 'The customized labeling already exists under this customer. Please use another name.';
I18N.Message.M11601 = 'Wrong user-defined energy labeling.';
I18N.Message.M11602 = 'User-defined energy labeling levels are discontinuous.';
I18N.Message.M11603 = 'Concurrency error. Please refresh.';

I18N.Message.M05003 = 'Illegal entry.';

I18N.Message.M20001 = 'Duplicate rule names.';
I18N.Message.M20002 = 'Rule has been deleted.';
I18N.Message.M20003 = 'Rule has been modified.';
I18N.Message.M20006 = 'Customer has been deleted.';
I18N.Message.M20007 = 'Total number of rules excceds limit.';
I18N.Message.M20012 = 'Some of the tags have been associated to other rules.';
I18N.Message.M20013 = 'You cannot modify the data under the following tags: {0}.';
I18N.Message.M20014 = 'Some of the tags have been deleted or have no data access.';

I18N.Message.M21707 = 'Report {0} is deleted. Will refresh report list soon.';
I18N.Message.M21705 = 'Duplicate report title  ';
I18N.Message.M21702 = 'The report has been modified and the page will be refreshed immediately.';
I18N.Message.M21706 = 'The report has duplicate Tag, please check it.';

I18N.Folder = {};
I18N.Folder.NewWidget = {};
I18N.Folder.NewWidget.Menu1 = 'Energy analysis  ';
I18N.Folder.NewWidget.Menu2 = 'Unit index';
I18N.Folder.NewWidget.Menu3 = 'Time ratio';
I18N.Folder.NewWidget.Menu4 = 'Labeling';
I18N.Folder.NewWidget.Menu5 = 'Ranking';
I18N.Folder.NewWidget.DefaultName = 'Last 7 Days {0}';

I18N.Folder.NewFolder = 'New folder';
I18N.Folder.FolderName = 'Folder';
I18N.Folder.WidgetName = 'Chart';
I18N.Folder.WidgetSaveSuccess = 'The chart has been saved successfully.';

I18N.Folder.SaveNameError = {};
I18N.Folder.SaveNameError.E032 = '{1} named "{0}" already exists. Please choose another name.';
I18N.Folder.SaveNameError.E029 = 'Name {0} cannot be left empty. Please enter again.';
I18N.Folder.SaveNameError.E031 = 'Name {0} exceeds the maximum length of 100. Please enter again.';

I18N.Folder.Copy = {};
I18N.Folder.Copy.Title = 'Copy {0}';
I18N.Folder.Copy.Label = '{0} Name';
I18N.Folder.Copy.firstActionLabel = 'Copy';
I18N.Folder.Copy.Error = 'The name already exists.';
I18N.Folder.Copy.NameLongError = 'You cannot enter more than 100 characters';

I18N.Folder.SaveAs = {};
I18N.Folder.SaveAs.Title = 'Copy chart ';
I18N.Folder.SaveAs.Label = 'Chart name  ';
I18N.Folder.SaveAs.firstActionLabel = 'Save';

I18N.Folder.Send = {};
I18N.Folder.Send.Success = '{0} has been sent successfully';
I18N.Folder.Send.Error = '{0} delivery failed. It cannot be sent to the user: {1}.';

I18N.Folder.Share = {};
I18N.Folder.Share.Success = '{0}has been shared successfully.';
I18N.Folder.Share.Error = '{0}sharing failed. Cannot be shared to the user:{1}.';

I18N.Folder.Drag = {};
I18N.Folder.Drag.Error = '{1} named "{0}" already exists. Unable to drag it.';

I18N.Folder.Export = {};
I18N.Folder.Export.Error = 'The chart is empty, and cannot be exported.';

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

I18N.Folder.Widget = {};
I18N.Folder.Widget.Leave = 'Leave tip';
I18N.Folder.Widget.LeaveContent = 'Chart will be cleared if you leave. Leave?';
I18N.Folder.Widget.LeaveButton = 'Leave';
I18N.Folder.Widget.LeaveCancel = 'Cancel';
I18N.Folder.Widget.SwitchLeave = 'Switch tip';
I18N.Folder.Widget.SwitchContent = 'Switch energy type,Chart will be cleared if you leave. Leave?';
I18N.Folder.Widget.SwitchButton = 'OK';

I18N.Commodity = {};
I18N.Commodity.Overview = 'Media Overview';

I18N.Hierarchy = {};
I18N.Hierarchy.RankingButtonName = 'Please select the hierarchy nodes for ranking';
I18N.Hierarchy.ButtonName = 'Please select the hierarchy node';
I18N.Hierarchy.Confirm = 'Ok';
I18N.Hierarchy.Clear = 'Clear';
I18N.Hierarchy.Menu1 = 'Cust';
I18N.Hierarchy.Menu2 = 'Org';
I18N.Hierarchy.Menu3 = 'Site';
I18N.Hierarchy.Menu4 = 'Bldg';

I18N.Dim = {};
I18N.Dim.AllButtonName = 'All dimensions';
I18N.Dim.ButtonName = 'Dimension node';

I18N.ALarm = {};
I18N.ALarm.Alarm = ' Energy Alarm';
I18N.ALarm.Menu1 = 'All';
I18N.ALarm.Menu2 = 'Alarm set';
I18N.ALarm.Menu3 = 'Baseline set';
I18N.ALarm.Menu4 = 'Not set';

I18N.ALarm.Save = {};
I18N.ALarm.Save.Title = 'Add to dashboard';
I18N.ALarm.Save.Label = 'Chart name';
I18N.ALarm.Save.Save = 'Save';
I18N.ALarm.Save.Error = 'Existed';
I18N.ALarm.List = {};
I18N.ALarm.List.Daily = 'Daily alarm list';
I18N.ALarm.List.Month = 'Monthly alarm list';
I18N.ALarm.List.Year = 'Yearly alarm list';

I18N.ALarm.Uom = {};
I18N.ALarm.Uom.Hour = 'Hour';
I18N.ALarm.Uom.Day = ' Daily';
I18N.ALarm.Uom.Month = ' Monthly';
I18N.ALarm.Uom.Year = ' Yearly';

I18N.ALarm.IgnoreWindow = {};
I18N.ALarm.IgnoreWindow.Title = 'Clear this Alarm?';
I18N.ALarm.IgnoreWindow.content = 'Clear continuous alarms behind this one';
I18N.ALarm.IgnoreWindow.Ignore = 'Clear';
I18N.ALarm.IgnoreWindow.Quit = 'Cancel';

I18N.Tag = {};
I18N.Tag.Tooltip = 'Tag {0} / {1} has been selected ';
I18N.Tag.ExceedTooltip = 'Number of added tags is beyond the range. You cannot select all. Please select the target tags one by one.';
I18N.Tag.AlarmStatus1 = 'Baseline not set';
I18N.Tag.AlarmStatus2 = 'Baseline set';
I18N.Tag.AlarmStatus3 = 'Alarm not set';
I18N.Tag.AlarmStatus4 = 'Alarm set';
I18N.Tag.SelectError = 'Please choose hierarchy node-dimension node';

I18N.Template = {};
I18N.Template.Copy = {};
I18N.Template.Copy.DestinationFolder = 'Target folder';
I18N.Template.Copy.Cancel = 'Quit';
I18N.Template.Copy.DefaultName = '{0} - copy';
I18N.Template.Delete = {};
I18N.Template.Delete.Delete = 'Delete';
I18N.Template.Delete.Cancel = 'Quit';
I18N.Template.Delete.Title = 'Delete {0}';
I18N.Template.Delete.FolderContent = 'Delete folder "{0}". All contents of the folder will also be deleted';
I18N.Template.Delete.WidgetContent = 'Chart "{0}" will be deleted';
I18N.Template.Share = {};
I18N.Template.Share.Title = 'Share chart';
I18N.Template.Share.Share = 'Share';
I18N.Template.Share.Cancel = 'Quit';
I18N.Template.User = {};
I18N.Template.User.Alluser = 'All users';
I18N.Template.User.Name = 'Name';
I18N.Template.User.Position = 'Title';
I18N.Template.User.Selected = 'Selected {0} person';
I18N.Template.Send = {};
I18N.Template.Send.Title = 'Send {0}';
I18N.Template.Send.Send = 'Send';
I18N.Template.Send.Cancel = 'Quit';

I18N.Title = {};
I18N.Title.Alarm = 'Alarm';
I18N.Title.Energy = 'Energy';

I18N.Mail = {};
I18N.Mail.SendButton = 'Send platform notification';
I18N.Mail.Reciever = 'Reciever';
I18N.Mail.Template = 'Template';
I18N.Mail.Contactor = 'SP Contactor';
I18N.Mail.User = 'Platform user';
I18N.Mail.SelectAll = 'Select all';
I18N.Mail.UserDefined = 'User Define';
I18N.Mail.Delete = 'Template "{0}"will be deleted';
I18N.Mail.Subject = 'Subject';
I18N.Mail.Content = 'Content';
I18N.Mail.SaveNewTemplate = 'Save as new template';
I18N.Mail.Message = 'Send SMS';
I18N.Mail.TemplateHintText = 'Please input template name';
I18N.Mail.Error = {};
I18N.Mail.Error.E090 = 'Please fill reviever then send it again';
I18N.Mail.Error.E091 = 'Please select template';
I18N.Mail.Error.E094 = 'Please fill template name';
I18N.Mail.Error.E095 = 'Name already exist';
I18N.Mail.Send = {};
I18N.Mail.Send.Title = 'Send mail';
I18N.Mail.Send.Ok = 'OK';
I18N.Mail.Send.Send = 'Send';
I18N.Mail.Send.Cancel = 'Cancel';
I18N.Mail.Send.Success = 'Notification is sent successfully';
I18N.Mail.Send.E03092 = 'You mail does not have subject, would you like to send anyway?';
I18N.Mail.Send.E03099 = 'Mail send fail, please try again.';
I18N.Mail.LeaveTitle = 'Leave tip';
I18N.Mail.LeaveContent = 'Mail is editing, mail will be cleared if you leave this page. Continue?';
I18N.Mail.LeaveConfirm = 'Leave';
I18N.Mail.LeaveCancel = 'Cancel';


I18N.RawData = {};
I18N.RawData.Time = 'Time';

I18N.SumWindow = {};
I18N.SumWindow.TimeSpan = 'Timespan';
I18N.SumWindow.Data = 'Tag';
I18N.SumWindow.Sum = 'Sum';

I18N.Baseline = {};
I18N.Baseline.Basic = 'Baseline config';
I18N.Baseline.Modify = 'Modify calculation value';
I18N.Baseline.AlarmSetting = 'Alarm setting';
I18N.Baseline.Year = 'Year';
I18N.Baseline.Button = {};
I18N.Baseline.Button.DisplayCal = 'Display Calendar';
I18N.Baseline.Button.HiddenCal = 'Hide Calendar';
I18N.Baseline.Button.Edit = 'Edit';
I18N.Baseline.Button.Save = 'Save';
I18N.Baseline.Button.Cancel = 'Cancel';
I18N.Baseline.BaselineBasic = {};
I18N.Baseline.BaselineBasic.Firstline = 'Please choose configured year to edit';
I18N.Baseline.Error = {};
I18N.Baseline.Error.Cal = 'This tag belonged hierarchy does not reference any calendar template. please reference and ensure configed content can be calculated';
I18N.Baseline.Error.TbnameError = 'Mandatory fields';
I18N.Baseline.Error.TbnameValidError = 'Allowed characters: Chinese, English, Number, Underline and Blank Splace';
I18N.Baseline.Error.Calc = 'Selected duration more than one month, can not calculate, please select data again';
I18N.Baseline.BaselineModify = {};
I18N.Baseline.BaselineModify.Month = {};
I18N.Baseline.BaselineModify.Month.Jan = 'Jan';
I18N.Baseline.BaselineModify.Month.Feb = 'Feb';
I18N.Baseline.BaselineModify.Month.Mar = 'Mar';
I18N.Baseline.BaselineModify.Month.Apr = 'Apr';
I18N.Baseline.BaselineModify.Month.May = 'May';
I18N.Baseline.BaselineModify.Month.June = 'Jun';
I18N.Baseline.BaselineModify.Month.July = 'Jul';
I18N.Baseline.BaselineModify.Month.Aug = 'Aug';
I18N.Baseline.BaselineModify.Month.Sep = 'Sep';
I18N.Baseline.BaselineModify.Month.Oct = 'Oct';
I18N.Baseline.BaselineModify.Month.Nov = 'Nov';
I18N.Baseline.BaselineModify.Month.Dec = 'Dec';
I18N.Baseline.BaselineModify.Uom = 'KWH';
I18N.Baseline.BaselineModify.YearSelect = 'Plase select configed year to edit';
I18N.Baseline.BaselineModify.YearBaseline = 'Year Baseline';
I18N.Baseline.BaselineModify.YearValue = 'Yearly';
I18N.Baseline.BaselineModify.MonthBaseline = 'Month Baseline';
I18N.Baseline.Calc = {};
I18N.Baseline.Calc.MonthBaseline = 'Monthly';


I18N.MultipleTimespan = {};
I18N.MultipleTimespan.Before = 'Previous';
I18N.MultipleTimespan.Button = {};
I18N.MultipleTimespan.Button.Draw = 'Draw';
I18N.MultipleTimespan.Button.Cancel = 'Cancel';
I18N.MultipleTimespan.Title = 'History Compare';
I18N.MultipleTimespan.Add = 'Add History';
I18N.MultipleTimespan.RelativeDate = 'Relative time';
I18N.MultipleTimespan.OriginalDate = 'Original time';
I18N.MultipleTimespan.CamparedDate = 'Compare time';
I18N.MultipleTimespan.To = 'to';

I18N.Paging = {};
I18N.Paging.Error = {};
I18N.Paging.Error.Pre = 'Only support 1 to';
I18N.Paging.Error.Next = 'positive integer';
I18N.Paging.JumpTo = 'Jump to';
I18N.Paging.Page = 'Page';
I18N.Paging.Jump = 'Jump';
I18N.Paging.Button = {};
I18N.Paging.Button.PrePage = 'Pre Page';
I18N.Paging.Button.NextPage = 'Next Page';

I18N.Map = {};
I18N.Map.Date = {};
I18N.Map.Date.Year = '/';
I18N.Map.Date.Month = '/';
I18N.Map.Date.Day = '';
I18N.Map.Date.Today = 'Today';
I18N.Map.Date.Yesterday = 'Yesterday';
I18N.Map.Date.ThisMonth = 'This Month ';
I18N.Map.Date.LastMonth = 'Last Month ';
I18N.Map.Date.ThisYear = 'This Year ';
I18N.Map.Date.LastYear = 'Last Year ';

I18N.Map.EnergyInfo = {};
I18N.Map.EnergyInfo.CarbonEmission = 'total co2 emission';
I18N.Map.EnergyInfo.Cost = 'Total cost';
I18N.Map.EnergyInfo.Electricity = 'Total power usage';
I18N.Map.EnergyInfo.Water = 'Total water';
I18N.Map.EnergyInfo.Gas = 'Total gas';
I18N.Map.EnergyInfo.SoftWater = 'Total soft water';
I18N.Map.EnergyInfo.Petrol = 'Total petrol';
I18N.Map.EnergyInfo.LowPressureSteam = 'Total L-P steam';
I18N.Map.EnergyInfo.DieselOi = 'Total diesel';
I18N.Map.EnergyInfo.Heat = 'Total heat';
I18N.Map.EnergyInfo.CoolQ = 'Total cooling';
I18N.Map.EnergyInfo.Coal = 'Total coal';
I18N.Map.EnergyInfo.CoalOil = 'Total kerosene';
I18N.Map.EnergyInfo.NonMessage = 'No energy consumption information, please continue to focus';

I18N.Map.EnergyInfo.TargetValue = {};
I18N.Map.EnergyInfo.TargetValue.Qualified = 'Reach the target value';
I18N.Map.EnergyInfo.TargetValue.NotQualified = 'Not reach the target value';

I18N.Platform = {};
I18N.Platform.Title = 'EnergyMost';
I18N.Platform.Config = 'Platform configuration';
I18N.Platform.SP = 'Service provider administrator';
I18N.Platform.InEnglish = '中文版';
I18N.Platform.MaxLengthError = 'Please input less than 200 character';
I18N.Platform.User = {};
I18N.Platform.User.Name = 'User Name';
I18N.Platform.User.ShowName = 'Real name';
I18N.Platform.User.ResetPassword = 'Reset password';
I18N.Platform.User.RealName = 'Real name';
I18N.Platform.User.Edit = 'Edit';
I18N.Platform.User.EditPersonalInfo = 'Edit personal information';
I18N.Platform.User.Position = 'Title';
I18N.Platform.User.Role = 'Role';
I18N.Platform.User.ServerManager = 'SP Initial Admin';
I18N.Platform.User.ShowFuncAuth = 'Show role detail';
I18N.Platform.User.Telephone = 'Telephone';
I18N.Platform.User.Email = 'Mail address';
I18N.Platform.User.EmailError = 'Mail format is not correct';
I18N.Platform.User.Logout = 'Logout';
I18N.Platform.About = {};
I18N.Platform.About.Title = 'About';
I18N.Platform.About.QrCode = 'EnergyMost mobile QR code';
I18N.Platform.About.ipadQrCode = 'iPad client';
I18N.Platform.About.WeChatQrCode = 'Wechat public number';
I18N.Platform.About.ContactUs = 'Contact us';
I18N.Platform.Password = {};
I18N.Platform.Password.OldPassword = 'Original Password';
I18N.Platform.Password.NewPassword = 'New Password';
I18N.Platform.Password.confirmNewPassword = 'Confirm new password';
I18N.Platform.Password.Error01 = 'Please input original password';
I18N.Platform.Password.Error02 = 'Please input new password';
I18N.Platform.Password.Error03 = 'Password is not same';
I18N.Platform.Password.Error04 = 'Original password not correct';
I18N.Platform.Password.Confirm = 'OK';
I18N.Platform.Password.Cancel = 'Cancel';
I18N.Platform.Password.Title = 'Modify password';

I18N.Platform.ServiceProvider = {};
I18N.Platform.ServiceProvider.SP = 'Service Provider';
I18N.Platform.ServiceProvider.CustomerName = 'Sort according SP Name';
I18N.Platform.ServiceProvider.StartTime = 'Sort according create time';
I18N.Platform.ServiceProvider.NormalStatus = 'Normal';
I18N.Platform.ServiceProvider.PauseStatus = 'Pause';
I18N.Platform.ServiceProvider.OperationTime = 'Operation time';
I18N.Platform.ServiceProvider.Status = 'Status';
I18N.Platform.ServiceProvider.DeleteContent = 'Delete SP “{0}”，All public data, customer data and associate data will be deleted.';

I18N.Platform.ServiceProvider.SendEmail = 'Send mail';
I18N.Platform.ServiceProvider.SendEmailSuccess = 'Mail send successfully';
I18N.Platform.ServiceProvider.Error001 = 'SP is modified by other user';
I18N.Platform.ServiceProvider.Error003 = 'SP is deleted by other user';


I18N.Privilege = {};
I18N.Privilege.Common = {};
I18N.Privilege.Common.Common = 'Common role';
I18N.Privilege.Common.DashboardView = 'folder and widget view';
I18N.Privilege.Common.DashboardManagement = 'folder and widget  edit';
I18N.Privilege.Common.PersonalInfoManagement = 'personal info management';
I18N.Privilege.Common.MapView = 'Map view';
I18N.Privilege.Role = {};
I18N.Privilege.Role.Role = 'role';
I18N.Privilege.Role.DashboardSharing = 'folder and widget share';
I18N.Privilege.Role.EnergyUsage = 'energy analyse function';
I18N.Privilege.Role.CarbonEmission = 'Carbon function';
I18N.Privilege.Role.EnergyCost = 'Cost function';
I18N.Privilege.Role.UnitIndicator = 'Unit function';
I18N.Privilege.Role.RatioIndicator = 'Ratio function';
I18N.Privilege.Role.LabelingIndicator = 'Labelling function';
I18N.Privilege.Role.CorporateRanking = 'Ranking function';
I18N.Privilege.Role.EnergyExport = 'Data export';
I18N.Privilege.Role.ReportView = 'Report export and view';
I18N.Privilege.Role.ReportManagement = 'Report management';
I18N.Privilege.Role.EnergyAlarm = 'Energy alarm';
I18N.Privilege.Role.ChartRemarking = 'Chart remarking';
I18N.Privilege.Role.SPManagement = 'EnergyMost SP management';
I18N.Privilege.Role.HierarchyManagement = 'Hierarchy management';
I18N.Privilege.Role.TagManagement = 'Tags management';
I18N.Privilege.Role.KPIConfiguration = 'Key performance indicator tags management';
I18N.Privilege.Role.TagMapping = 'Association';
I18N.Privilege.Role.CustomerInfoView = 'View customer information';
I18N.Privilege.Role.CustomerInfoManagement = 'Manage customer information';
I18N.Privilege.Role.CustomLabeling = 'Customized labeling';

I18N.Remark = {};
I18N.Remark.Label = 'Comment';
I18N.Remark.DefaultText = 'Click here to add comment';



module.exports = I18N;
