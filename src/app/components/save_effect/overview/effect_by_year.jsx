import React, { Component } from 'react';

import SwitchBar from 'controls/SwitchBar.jsx';

import EffectReport from './effect_report.jsx';

const data2 = {
    "CommodityId": 1,
    "SavingCost": 1.1,
    "EnergySaving": 1.1,
    "PredictionSaving": 1.1,
    "UomId": 1,
    "EnergySavingRate": 1.1,
    "SavingStandardCoal": 1.1,
    "EnergySystemSavings": [
      {
        "EnergySystem": 10,
        "EnergySavingValues": [
          {
            "Time": "2017-08-24T02:21:22",
            "Value": 1.1
          },
          {
            "Time": "2017-08-24T02:21:22",
            "Value": 1.1
          }
        ]
      },
      {
        "EnergySystem": 20,
        "EnergySavingValues": [
          {
            "Time": "2017-08-24T02:21:22",
            "Value": 1.1
          },
          {
            "Time": "2017-08-24T02:21:22",
            "Value": 1.1
          }
        ]
      }
    ],
    "PredictionSavingValues": [
      {
        "Time": "2017-08-24T02:21:22",
        "Value": 1.1
      },
      {
        "Time": "2017-08-24T02:21:22",
        "Value": 1.1
      }
    ]
  };


export default class EffectByYear extends Component {
	render() {
		return (
			<div className='effect-card'>
        <header className='effect-card-header'>
          <span className='effect-card-header-text'>{'年度节能效果'}</span>

          <SwitchBar 
            iconStyle={{
              color: '#505559',
              cursor: 'pointer',
              opacity: 1,
              backgroundColor: '#fff',
              width: 30,
              height: 30,
              lineHeight: '30px',
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid #e6e6e6',
            }}
            className='switch-year'
            label={this.props.year}
            onLeft={this.props.onLeft}
            onRight={this.props.onRight}/>
        </header>
				<div className='effect-card-content'>
          <EffectReport data={data2} year={this.props.year}/>
        </div>
			</div>
		);
	}
}
