import React, { Component } from 'react';

import SavingChart from '../chart/contrast_chart.jsx';

const data = {
	ContrastStep: 3,
  "ActualValues": [
    {
      "Time": "2017-08-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2017-09-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2017-10-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2017-11-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2017-12-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2018-01-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2018-02-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2018-03-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2018-04-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2018-05-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2018-06-24T02:33:51",
      "Value": 1.1
    }
  ],
  "BenchmarkValues": [
    {
      "Time": "2017-08-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2017-09-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2017-10-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2017-11-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2017-12-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2018-01-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2018-02-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2018-03-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2018-04-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2018-05-24T02:33:51",
      "Value": 1.1
    },
    {
      "Time": "2018-06-24T02:33:51",
      "Value": 1.1
    }
  ]
};

export default class SaveEffectOverview extends Component {
	render() {
		return (
			<SavingChart unit={'test'} data={data}/>
		);
	}
}
