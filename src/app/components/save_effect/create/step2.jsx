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
import NewFlatButton from 'controls/NewFlatButton.jsx';

import {ChartDateFilter} from 'components/Diagnose/CreateDiagnose.jsx';
import ChartBasicComponent from 'components/DataAnalysis/Basic/ChartBasicComponent.jsx';

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

export default class Step2 extends Component {
	constructor(props) {
		super(props);

	}
	render() {
		let { data, disabledPreview, BenchmarkModel, BenchmarkStartDate, BenchmarkEndDate, CalculationStep, onChangeModelType, onChangeStep, onChangeBenchmarkStartDate, onChangeBenchmarkEndDate, onGetChartData } = this.props,
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
				preConfig: (chartCmpObj) => {
					let newConfig = Util.merge(true, chartCmpObj);
					delete newConfig.config.navigator;
					return newConfig;
				},
			};
		  // 由于API返回的数据为请求时间的后一个步长，所以为了数据点可以正常显示，加入如下逻辑
		  // Law 2017/04/20
		  let target = data.getIn(['TargetEnergyData', 0, 'Target'])
		  if( target && target.get('TimeSpan') && target.get('TimeSpan').size > 0 ) {
		    let step = target.get('Step');
		    chartProps.contentSyntax = JSON.stringify({
		      viewOption: {
		        TimeRanges: [{
		          StartTime: subtractStep(BenchmarkStartDate, step),
		          EndTime: subtractStep(BenchmarkEndDate, step),
		        }]
		      }
		    });
		  }
		}
		return (
			<div className='step2-wrapper'>
				<div className='create-block step2-side'>
					<header className='step2-side-header'>{'配置基准值模型'}</header>
					<div className='step2-side-content'>
						<ViewableDropDownMenu 
							defaultValue={BenchmarkModel}
							title={'基准值模型'} 
							valueField='id' 
							textField='label' 
							dataItems={getModelDataItems()} 
							didChanged={onChangeModelType}
							style={{width: 170}}/>
						<ViewableDropDownMenu 
							defaultValue={CalculationStep}
							isViewStatus={BenchmarkModel === Model.Manual}
							title={'配置计算步长'} 
							isViewStatus={true}
							valueField='id' 
							textField='label' 
							dataItems={getStepDataItems()} 
							didChanged={onChangeStep}
							style={{width: 90}}/>
						{BenchmarkModel !== Model.Manual && <div className='pop-viewableTextField'>
							<header className='pop-viewable-title'>{'基准能耗确定期'}</header>
							<div>
								<ViewableDatePicker onChange={onChangeBenchmarkStartDate} datePickerClassName='date-picker-inline' width={83} value={BenchmarkStartDate}/>
								<div style={{display: 'inline-block', padding: '0 16px'}}>至</div>
								<ViewableDatePicker onChange={onChangeBenchmarkEndDate} datePickerClassName='date-picker-inline' width={83} value={BenchmarkEndDate}/>
							</div>
							<div className='tip-message'>{'注：确定期时间最大范围为1年'}</div>
						</div>}
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
								<ViewableDatePicker onChange={onChangeBenchmarkStartDate} datePickerClassName='diagnose-date-picker' width={100} value={BenchmarkStartDate}/>
								<div style={{display: 'inline-block', padding: '0 16px'}}>至</div>
								<ViewableDatePicker onChange={onChangeBenchmarkEndDate} datePickerClassName='diagnose-date-picker' width={100} value={BenchmarkEndDate}/>
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