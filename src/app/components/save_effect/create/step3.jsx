import React, { Component } from 'react';

import ActionVisibility from 'material-ui/svg-icons/action/visibility';
import CircularProgress from 'material-ui/CircularProgress';
import find from 'lodash-es/find';
import moment from 'moment';

import TimeGranularity from 'constants/TimeGranularity.jsx';
import {Model} from 'constants/actionType/Effect.jsx';

import Util from 'util/Util.jsx';

import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import ViewableDatePicker from 'controls/ViewableDatePicker.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';

import {ChartDateFilter} from 'components/Diagnose/CreateDiagnose.jsx';
import ChartBasicComponent from 'components/DataAnalysis/Basic/ChartBasicComponent.jsx';
import {getDateObjByRange} from './';

let getModelDataItems = () => [
	{ id: Model.Easy, label: I18N.SaveEffect.Model.Easy },
	{ id: Model.Contrast, label: I18N.SaveEffect.Model.Contrast },
	{ id: Model.Manual, label: I18N.SaveEffect.Model.Manual },
	{ id: Model.Increment, label: I18N.SaveEffect.Model.Increment },
	{ id: Model.Relation, label: I18N.SaveEffect.Model.Relation },
	{ id: Model.Efficiency, label: I18N.SaveEffect.Model.Efficiency },
	{ id: Model.Simulation, label: I18N.SaveEffect.Model.Simulation },
];

let getStepDataItems = () => [
	{ id: TimeGranularity.Minite, label: I18N.EM.Raw },
	{ id: TimeGranularity.Hourly, label: I18N.EM.Hour },
	{ id: TimeGranularity.Daily, label: I18N.EM.Day },
	{ id: TimeGranularity.Monthly, label: I18N.EM.Month },
];

function ManualValue({BenchmarkDatas, onChangeValue, unit}) {
	return (
		<div className='step3-manual-value-wrapper'>
			<header>{'计算期逐月基准值' + '(' + unit + ')'}</header>
			{BenchmarkDatas ? 
			<div>
				{BenchmarkDatas.map((data, idx) => 
				<ViewableTextField
					defaultValue={data.Value}
					hintText={data.Label}
					style={{width: 90}}
					didChanged={(val) => {
						onChangeValue(idx, val);
					}}
				/>)}
			</div>:
			<div>
				{'计算期确定后，此处才显示'}
			</div>}
		</div>
	);
}


export default class Step3 extends Component {
	constructor(props) {
		super(props);

	}
	render() {
		let { data, 
			disabledPreview, 
			BenchmarkModel, 
			CalculationStep, 
			EnergyUnitPrice, 
			EnergyStartDate, 
			EnergyEndDate, 
			BenchmarkDatas,
			onChangeEnergyUnitPrice, 
			onChangeEnergyStartDate, 
			onChangeEnergyEndDate, 
			onChangeBenchmarkDatas, 
			onGetChartData, } = this.props,
		chartProps;

		if( data ) {
		  data = data.setIn(
		    ['TargetEnergyData'],
		    data.getIn(['TargetEnergyData']).map(energyData => {
		      // Min30 -> Min15
		      if( energyData.getIn(['Target', 'Step']) === TimeGranularity.Min30 ) {
		        return energyData.setIn(['Target', 'Step'], TimeGranularity.Min15);
		      }
		      return energyData;
		    })
		  );

			chartProps = {
				chartType: 'line',
				tagData: data,
				// postNewConfig: curry(postNewConfig)(data, isEdit, isTypeC, hiddenAssociateLabel),
			};
		  // 由于API返回的数据为请求时间的后一个步长，所以为了数据点可以正常显示，加入如下逻辑
		  // Law 2017/04/20
		  let target = data.getIn(['TargetEnergyData', 0, 'Target'])
		  if( target && target.get('TimeSpan') && target.get('TimeSpan').size > 0 ) {
		    let step = target.get('Step');
		    chartProps.contentSyntax = JSON.stringify({
		      viewOption: {
		        TimeRanges: [{
		          StartTime: subtractStep(EnergyStartDate, step),
		          EndTime: subtractStep(EnergyEndDate, step),
		        }]
		      }
		    });
		  }
		}
		return (
			<div className='step2-wrapper'>
				<div className='create-block step2-side step3-side'>
					<header className='step2-side-header'>{'配置基准值模型'}</header>
					<div className='step2-side-content step3-side-content'>
						<div className='pop-viewableTextField'>
							<header className='pop-viewable-title'>{'节能量计算期'}</header>
							<div>
								<ViewableDatePicker isPopover hintText='开始时间' onChange={onChangeEnergyStartDate} datePickerClassName='date-picker-inline' width={83} value={EnergyStartDate}/>
								<div style={{display: 'inline-block', padding: '0 16px'}}>至</div>
								<ViewableDatePicker isPopover hintText='结束时间' onChange={onChangeEnergyEndDate} datePickerClassName='date-picker-inline' width={83} value={EnergyEndDate}/>
							</div>
							<ViewableTextField floatingLabelFixed={true} style={{width: 170}} title={'能源单价'} hintText={'输入价格'} defaultValue={EnergyUnitPrice} didChanged={onChangeEnergyUnitPrice}/>
							{ Model.Manual === BenchmarkModel && <ManualValue key={EnergyStartDate + EnergyEndDate} BenchmarkDatas={BenchmarkDatas} onChangeValue={onChangeBenchmarkDatas}/>}
						</div>
					</div>
				</div>
				<div className='create-block step2-content'>
					<header className='step2-content-header'>
						{'图表预览'}
						<NewFlatButton 
							secondary
							onClick={onGetChartData}
							style={{height: 30, lineHeight: '30px'}}
							label={I18N.Setting.Diagnose.PreviewButton} 
							disabled={disabledPreview} 
							icon={<ActionVisibility/>}/>
					</header>
					<div className='step2-content-content'>
						<header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 70}}>
							<div className='diagnose-create-content'>
								<ViewableDatePicker onChange={onChangeEnergyStartDate} datePickerClassName='diagnose-date-picker' width={100} value={EnergyStartDate}/>
								<div style={{display: 'inline-block', padding: '0 16px'}}>至</div>
								<ViewableDatePicker onChange={onChangeEnergyEndDate} datePickerClassName='diagnose-date-picker' width={100} value={EnergyEndDate}/>
							</div>
							<span>{I18N.EM.Report.Step + ': ' + find(getStepDataItems(), item => item.id === CalculationStep).label}</span>
						</header>
						{data ? 
						<ChartBasicComponent {...chartProps}/> : 
						<div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>}
					</div>
				</div>
			</div>
		);
	}
}

const TIME_GRANULARITY_MAP_VAL = {
  [TimeGranularity.Minite]: 60,
  [TimeGranularity.Min15]: 15 * 60,
  [TimeGranularity.Min30]: 30 * 60,
  [TimeGranularity.Hourly]: 60 * 60,
  [TimeGranularity.Hour2]: 2 * 60 * 60,
  [TimeGranularity.Hour4]: 4 * 60 * 60,
  [TimeGranularity.Hour6]: 6 * 60 * 60,
  [TimeGranularity.Hour8]: 8 * 60 * 60,
  [TimeGranularity.Hour12]: 12 * 60 * 60,
  [TimeGranularity.Daily]: 24 * 60 * 60,
  [TimeGranularity.Weekly]: 7 * 24 * 60 * 60,
  [TimeGranularity.Monthly]: 30 * 24 * 60 * 60,
  [TimeGranularity.Yearly]: 365 * 24 * 60 * 60,
}
function subtractStep(time, step) {
  return moment(
    moment(time).valueOf() - TIME_GRANULARITY_MAP_VAL[step] * 1000
  ).format('YYYY-MM-DDTHH:mm:ss');
}
