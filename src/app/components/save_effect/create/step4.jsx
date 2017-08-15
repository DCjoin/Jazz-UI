import React, { Component } from 'react';
import find from 'lodash-es/find';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import TimeGranularity from 'constants/TimeGranularity.jsx';

import ViewableTextField from 'controls/ViewableTextField.jsx';

let getStepDataItems = () => [
	{ id: TimeGranularity.Minite, label: I18N.EM.Raw },
	{ id: TimeGranularity.Hourly, label: I18N.EM.Hour },
	{ id: TimeGranularity.Daily, label: I18N.EM.Day },
	{ id: TimeGranularity.Monthly, label: I18N.EM.Month },
];

export default class Step4 extends Component {
	render() {
		let {unit, EnergyStartDate, EnergyEndDate, CalculationStep, PredictionDatas, BenchmarkStartDate, BenchmarkEndDate, ContrastStep, onChangePredictionDatas, onChangeContrastStep} = this.props;
		let radios = [];
		if( CalculationStep === TimeGranularity.Daily ) {
			radios.push(<RadioButton label={I18N.EM.Day} value={TimeGranularity.Daily}/>);
		}
		radios.push(<RadioButton label={I18N.EM.Month} value={TimeGranularity.Monthly}/>);
		return (
			<div className='step4-wrapper'>
				<div className='step4-block'>
					<header className='step4-block-header'>{I18N.SaveEffect.Create.SavePreviewChart}</header>
					<div className='step4-block-content'>
						<div className='step4-item'>
							<header className='step4-item-title'>{I18N.EM.Report.TimeRange}</header>
							<div className='step4-item-value'>{EnergyStartDate + ' ' + I18N.EM.To2 + ' '+ EnergyEndDate}</div>
						</div>
						<div className='step4-item'>
							<header className='step4-item-title'>{I18N.EM.Report.Step}</header>
							<div className='step4-item-value'>{find(getStepDataItems(), item => item.id === CalculationStep).label}</div>
						</div>
						<div className='step4-item'>
							<header className='step4-item-title'>{I18N.SaveEffect.Create.CalcSaveByMonth + `（${unit}）`}</header>
							<div className='step4-item-value'>
								{PredictionDatas && PredictionDatas.map((data, idx) => 
								<ViewableTextField
									defaultValue={data.Value}
									hintText={data.Label}
									style={{width: 90}}
									didChanged={(val) => {
										onChangePredictionDatas(idx, val);
									}}
								/>)}
							</div>
						</div>
					</div>
				</div>
				<div className='step4-block'>
					<header className='step4-block-header'>{I18N.SaveEffect.Create.BenchmarkBattleCalc}</header>
					<div className='step4-block-content'>
						<div className='step4-item'>
							<header className='step4-item-title'>{I18N.EM.Report.Step}</header>
							<RadioButtonGroup valueSelected={ContrastStep} onChange={(e, v) => {
								onChangeContrastStep(v);
							}}>
								{radios}								
							</RadioButtonGroup>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
