'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/Effect.jsx';
import Ajax from '../ajax/Ajax.jsx';
import Immutable from 'immutable';
import Util from 'util/Util.jsx';

import {SaveEffect} from 'constants/Path.jsx';

const test_data = {
	"CacheStatus": 0,
	"Calendars": [
	{
	  "CalendarTimeRanges": [
	      {
	          "EndTime": "2012-03-14T16:00:00",
	          "StartTime": "2011-12-31T16:00:00"
	      },
	      {
	          "EndTime": "2012-12-31T16:00:00",
	          "StartTime": "2012-11-14T16:00:00"
	      },
	      {
	          "EndTime": "2013-03-14T16:00:00",
	          "StartTime": "2012-12-31T16:00:00"
	      },
	      {
	          "EndTime": "2013-12-31T16:00:00",
	          "StartTime": "2013-11-14T16:00:00"
	      },
	      {
	          "EndTime": "2014-03-14T16:00:00",
	          "StartTime": "2013-12-31T16:00:00"
	      },
	      {
	          "EndTime": "2014-12-31T16:00:00",
	          "StartTime": "2014-11-14T16:00:00"
	      },
	      {
	          "EndTime": "2015-03-14T16:00:00",
	          "StartTime": "2014-12-31T16:00:00"
	      },
	      {
	          "EndTime": "2015-12-31T16:00:00",
	          "StartTime": "2015-11-14T16:00:00"
	      },
	      {
	          "EndTime": "2016-03-14T16:00:00",
	          "StartTime": "2015-12-31T16:00:00"
	      },
	      {
	          "EndTime": "2016-12-31T16:00:00",
	          "StartTime": "2016-11-14T16:00:00"
	      },
	      {
	          "EndTime": "2017-03-14T16:00:00",
	          "StartTime": "2016-12-31T16:00:00"
	      }
	  ],
	  "CalendarType": 4
	},
	{
	  "CalendarTimeRanges": [
	      {
	          "EndTime": "2012-07-30T16:00:00",
	          "StartTime": "2012-06-30T16:00:00"
	      },
	      {
	          "EndTime": "2013-07-30T16:00:00",
	          "StartTime": "2013-06-30T16:00:00"
	      },
	      {
	          "EndTime": "2014-07-30T16:00:00",
	          "StartTime": "2014-06-30T16:00:00"
	      },
	      {
	          "EndTime": "2015-07-30T16:00:00",
	          "StartTime": "2015-06-30T16:00:00"
	      },
	      {
	          "EndTime": "2016-07-30T16:00:00",
	          "StartTime": "2016-06-30T16:00:00"
	      },
	      {
	          "EndTime": "2017-07-30T16:00:00",
	          "StartTime": "2017-06-30T16:00:00"
	      }
	  ],
	  "CalendarType": 5
	}
	],
	"Errors": null,
	"ExportedFileName": null,
	"LabelingLevels": null,
	"NavigatorData": {
	"EnergyAssociatedData": null,
	"EnergyData": [
	  {
	      "DataQuality": 0,
	      "DataValue": 1,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2012-05-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2880,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2012-06-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2993.2,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2012-07-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2975,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2012-08-31T16:00:00"
	  },
	  {
	      "DataQuality": 1,
	      "DataValue": null,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2012-09-30T16:00:00"
	  },
	  {
	      "DataQuality": 1,
	      "DataValue": null,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2012-10-31T16:00:00"
	  },
	  {
	      "DataQuality": 1,
	      "DataValue": null,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2012-11-30T16:00:00"
	  },
	  {
	      "DataQuality": 1,
	      "DataValue": null,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2012-12-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 235600,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2013-01-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2480,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2013-02-28T16:00:00"
	  },
	  {
	      "DataQuality": 1,
	      "DataValue": null,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2013-03-31T16:00:00"
	  },
	  {
	      "DataQuality": 1,
	      "DataValue": null,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2013-04-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 1,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2013-05-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2880,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2013-06-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2976,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2013-07-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2975,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2013-08-31T16:00:00"
	  },
	  {
	      "DataQuality": 1,
	      "DataValue": null,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2013-09-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2945,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2013-10-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2880,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2013-11-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2976,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2013-12-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2975,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2014-01-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2657,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2014-02-28T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2623,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2014-03-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2014-04-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2014-05-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 3120.5,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2014-06-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2014-07-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2014-08-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2014-09-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2014-10-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2014-11-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2014-12-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2015-01-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2015-02-28T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2015-03-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2015-04-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2015-05-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2015-06-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2015-07-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2015-08-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2015-09-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2015-10-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2015-11-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2015-12-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2016-01-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2016-02-29T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2016-03-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2016-04-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2016-05-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2016-06-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2016-07-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2016-08-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2016-09-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2016-10-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2016-11-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2016-12-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2017-01-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2017-02-28T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2017-03-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2017-04-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2017-05-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2017-06-30T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2017-07-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2017-08-31T16:00:00"
	  },
	  {
	      "DataQuality": 0,
	      "DataValue": 2592,
	      "LocalTime": "2017-08-09T06:47:02",
	      "UtcTime": "2017-09-30T16:00:00"
	  }
	],
	"Target": {
	  "Association": null,
	  "CalculationType": 0,
	  "Code": "BAV1A11",
	  "CommodityId": 1,
	  "Name": "BAV1A11",
	  "Step": 3,
	  "TargetId": 100021,
	  "TimeSpan": {
	      "EndTime": "2017-10-09T06:47:02",
	      "StartTime": "1970-01-01T00:00:00"
	  },
	  "Type": 1,
	  "Uom": "kWh",
	  "UomId": 1
	}
	},
	"TargetEnergyData": [
	{
	  "EnergyAssociatedData": {
	      "Comments": [],
	      "SubType": 1,
	      "Type": 0,
	      "WeatherErrorCode": 0,
	      "WeatherInfos": null
	  },
	  "EnergyData": [
	      {
	          "DataQuality": 0,
	          "DataValue": 1,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2880,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2993.2,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2975,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 235600,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2480,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-02-28T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 1,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2880,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2976,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2975,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2945,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2880,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2976,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2975,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2657,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-02-28T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2623,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 3120.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-02-28T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-02-29T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-02-28T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2592,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-08-31T16:00:00"
	      }
	  ],
	  "Target": {
	      "Association": null,
	      "CalculationType": 0,
	      "Code": "BAV1A11",
	      "CommodityId": 1,
	      "Name": "BAV1A11",
	      "Step": 3,
	      "TargetId": 100021,
	      "TimeSpan": {
	          "EndTime": "2017-10-09T06:47:02",
	          "StartTime": "1970-01-01T00:00:00"
	      },
	      "Type": 1,
	      "Uom": "kWh",
	      "UomId": 1
	  }
	},
	{
	  "EnergyAssociatedData": {
	      "Comments": [
	          {
	              "AreaDimensionId": null,
	              "CommdityId": null,
	              "Comment": "abcdefg",
	              "HierarchyId": null,
	              "Id": 365,
	              "Step": 3,
	              "SubType": 1,
	              "SystemDimensionId": null,
	              "TagId": 116672,
	              "Type": 0,
	              "UpdateTime": "2015-04-19T13:32:35",
	              "UpdateUserId": 100001,
	              "UtcTimeStamp": "2012-09-01T00:00:00"
	          }
	      ],
	      "SubType": 1,
	      "Type": 0,
	      "WeatherErrorCode": 0,
	      "WeatherInfos": null
	  },
	  "EnergyData": [
	      {
	          "DataQuality": 0,
	          "DataValue": 2.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-02-28T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 2.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 0,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-02-28T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 0,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 0,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 0,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 0,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 0,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 0,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 0,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 899997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 919997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-02-28T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 939997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 959997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 979997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 999997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 989997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 969997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 949997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 929997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 909997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 889997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 869997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 879997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-02-29T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 799997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 839997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 819997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 849997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 809997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 789997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 779997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 829997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 859997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 659997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 759997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 709997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-02-28T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 739997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 789997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 719997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 749997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 679997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 669997.5,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-08-31T16:00:00"
	      }
	  ],
	  "Target": {
	      "Association": null,
	      "CalculationType": 0,
	      "Code": "BuildingA_P1_Electricity",
	      "CommodityId": 1,
	      "Name": "BuildingA_P1_Electricity",
	      "Step": 3,
	      "TargetId": 116672,
	      "TimeSpan": {
	          "EndTime": "2017-10-09T06:47:02",
	          "StartTime": "1970-01-01T00:00:00"
	      },
	      "Type": 1,
	      "Uom": "kWh",
	      "UomId": 1
	  }
	},
	{
	  "EnergyAssociatedData": {
	      "Comments": [],
	      "SubType": 1,
	      "Type": 0,
	      "WeatherErrorCode": 0,
	      "WeatherInfos": null
	  },
	  "EnergyData": [
	      {
	          "DataQuality": 0,
	          "DataValue": 1.8,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 5040,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 5238.1,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 5206.3,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2012-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 412300,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4340,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-02-28T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 1.8,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 5040,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 5208,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 5206.3,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 1,
	          "DataValue": null,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 5153.8,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 5040,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 5208,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2013-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 5206.3,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4649.8,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-02-28T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4590.3,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 5460.9,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2014-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-02-28T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2015-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-02-29T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-08-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-09-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-10-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-11-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2016-12-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-01-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-02-28T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-03-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-04-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-05-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-06-30T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-07-31T16:00:00"
	      },
	      {
	          "DataQuality": 0,
	          "DataValue": 4536,
	          "LocalTime": "2017-08-09T06:47:02",
	          "UtcTime": "2017-08-31T16:00:00"
	      }
	  ],
	  "Target": {
	      "Association": null,
	      "CalculationType": 0,
	      "Code": "BAV1A12",
	      "CommodityId": 1,
	      "Name": "BAV1A12",
	      "Step": 3,
	      "TargetId": 100027,
	      "TimeSpan": {
	          "EndTime": "2017-10-09T06:47:02",
	          "StartTime": "1970-01-01T00:00:00"
	      },
	      "Type": 1,
	      "Uom": "kWh",
	      "UomId": 1
	  }
	}
	],
	"TotalCount": 64
	};

export function getTagsByPlan(id) {
	// setTimeout(() => {
 //    AppDispatcher.dispatch({
 //      type: Action.UPDATE_TAGS,
 //      tags: [
	// 			{Id: 1, Name: 'tag1', Configed: false, isNew: false},
	// 			{Id: 2, Name: 'tag2', Configed: true, isNew: false},
	// 			{Id: 3, Name: 'tag3', Configed: true, isNew: false},
	// 			{Id: 4, Name: 'tag4', Configed: false, isNew: true},
	// 			{Id: 5, Name: 'tag5', Configed: false, isNew: true},
	// 		]
 //    });
	// }, 100);
	Ajax.get( Util.replacePathParams(SaveEffect.getEnergyEffectTags, id, 0), {
		success: (tags) => {
      AppDispatcher.dispatch({
        type: Action.UPDATE_TAGS,
        tags
      });
		}
	});
};

export function getEnergySolution(problemId) {
	Ajax.get( Util.replacePathParams(SaveEffect.getEnergySolution, problemId, 'w_146,h_97', 'w_600,h_400'), {
		success: (data) => {
			AppDispatcher.dispatch({
				type: Action.GET_ENERGY_SOLUTION,
				data
			});
		}
	});
}

export function updateTags(tags) {
    AppDispatcher.dispatch({
      type: Action.UPDATE_TAGS,
      tags
    });
}

export function getPreviewChart2(params) {

	Ajax.post(SaveEffect.energyEffectPriview, {
		params,
		success: (data) => {
	    	AppDispatcher.dispatch({
		        type: Action.GET_PREVIEW_CHART2,
		        data
		    });
		}
	});
	// setTimeout(() => {
 //    AppDispatcher.dispatch({
 //      type: Action.GET_PREVIEW_CHART2,
 //          data: test_data      
      
 //    });
	// }, 100);
}
export function getPreviewChart3(params) {	
	Ajax.post(SaveEffect.energyEffectPriview, {
		params,
		success: (data) => {
	    	AppDispatcher.dispatch({
		        type: Action.GET_PREVIEW_CHART3,
		        data
		    });
		}
	});
}
export function saveItem(params) {
	Ajax.post(SaveEffect.addItem, {
		params,
		success: () => {

		},
		error: () => {

		}
	});
}

export function getenergyeffect(id) {
	Ajax.get( Util.replacePathParams(SaveEffect.getenergyeffect, id), {
		success: (effect) => {
      AppDispatcher.dispatch({
        type: Action.GET_ENERGY_EFFECT,
        effect
      });
		}
	});
}

export function getEffectRateTag(hierarchyId) {
	Ajax.get( Util.replacePathParams(SaveEffect.getenergyeffectratetags,hierarchyId), {
		success: (tags) => {
			AppDispatcher.dispatch({
				type: Action.GET_EFFECT_RATE_TAG,
				tags
			});
		}
	});
}

export function saveeffectratetag(customerId,hierarchyId,list) {
	Ajax.post( Util.replacePathParams(SaveEffect.saveenergyeffectratetags,customerId,hierarchyId), {
		params: list.toJS(),
		success: () => {
			AppDispatcher.dispatch({
				type: Action.SAVE_EFFECT_RATE_TAG,
			});
		}
	});
}

export function getDetail(energyEffectId) {
	Ajax.get( Util.replacePathParams(SaveEffect.getDetail,energyEffectId), {
		success: (detail) => {
			AppDispatcher.dispatch({
				type: Action.GET_EFFECT_DETAIL,
				detail
			});
		}
	});
}

export function deleteItem(energyEffectItemId,callback) {
	Ajax.get( Util.replacePathParams(SaveEffect.deleteitem,energyEffectItemId), {
		success: () => {
			if(callback){
				callback();
			}else {
				AppDispatcher.dispatch({
					type: Action.DELETE_EFFECT_ITEM,
					energyEffectItemId,
				});
			}

		}
	});
}
