import React, { Component } from 'react';

import ActionVisibility from 'material-ui/svg-icons/action/visibility';
import CircularProgress from 'material-ui/CircularProgress';
import find from 'lodash-es/find';
import moment from 'moment';

import TimeGranularity from 'constants/TimeGranularity.jsx';
import {Model} from 'constants/actionType/Effect.jsx';

import Util, {dateAdd} from 'util/Util.jsx';

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

let timeoutID = null;

export default class Step2 extends Component {
	constructor(props) {
		super(props);
		this._afterChartCreated = this._afterChartCreated.bind(this);
		this.OnNavigatorChanged = this.OnNavigatorChanged.bind(this);
	}
  _afterChartCreated(chartObj) {
    if (chartObj.options.scrollbar && chartObj.options.scrollbar.enabled) {
      chartObj.xAxis[0].bind('setExtremes', this.OnNavigatorChanged);
    }
  }
	OnNavigatorChanged (obj) {
		let leftChange = obj.min !== obj.target.min,
				rightChange = obj.max !== obj.target.max;

		var chart = obj.target.chart,
		  scroller = chart.scroller,
		  min = obj.min,
		  max = obj.max,
		  start = Math.round(min),
		  end = Math.round(max),
		  type = 'resize',
		  startTime,
		  endTime;

		if (scroller.grabbedLeft) {
		  startTime = new Date(start);
		  startTime.setMinutes(0, 0, 0);
		  endTime = new Date(end);
		  endTime.setMinutes(0, 0, 0);
		  this.needRollback = true;
		} else if (scroller.grabbedRight) {
		  endTime = new Date(end);
		  endTime.setMinutes(0, 0, 0);

		  startTime = new Date(start);
		  startTime.setMinutes(0, 0, 0);
		  this.needRollback = true;
		} else {
		  startTime = new Date(start);
		  startTime.setMinutes(0, 0, 0);
		  endTime = new Date(end);
		  endTime.setMinutes(0, 0, 0);
		  type = 'move';
		}

		if (startTime > endTime) {
		  startTime = new Date(start);
		  startTime.setMinutes(0, 0, 0);
		  endTime = new Date(end);
		  endTime.setMinutes(0, 0, 0);
		}

		if (startTime.getTime() == endTime.getTime()) {
		  if (scroller.grabbedLeft) {
		    startTime = dateAdd(endTime, -1, 'hours');
		  } else {
		    endTime = dateAdd(startTime, 1, 'hours');
		  }
		}
		if( leftChange ) {
			if( rightChange ) {
				if( timeoutID ) {
					clearTimeout(timeoutID);
				}
				timeoutID = setTimeout(() => {
					this.props.onChangeBenchmarkStartDate(startTime);
					this.props.onChangeBenchmarkEndDate(endTime);
					// this.props.updateChartByNavgatorData();
					timeoutID = null;
				}, 300);
			} else {
				this.props.onChangeBenchmarkStartDate(startTime);
				// this.props.updateChartByNavgatorData();
			}
		} else if( rightChange ) {
				this.props.onChangeBenchmarkEndDate(endTime);
				// this.props.updateChartByNavgatorData();
		}
	}
	render() {
		let { data, disabledPreview, BenchmarkModel, BenchmarkStartDate, BenchmarkEndDate, CalculationStep, onChangeModelType, onChangeStep, onChangeBenchmarkStartDate, onChangeBenchmarkEndDate, onGetChartData, IncludeEnergyEffectData  } = this.props,
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
				preConfig: (chartCmpObj) => {
					let newConfig = Util.merge(true, chartCmpObj);
					delete newConfig.config.navigator;
					return newConfig;
				},
				postNewConfig: (chartCmpObj) => {
					let newConfig = Util.merge(true, chartCmpObj);
					newConfig.series = newConfig.series.map((serie, i) => {
						if( IncludeEnergyEffectData ) {
							if( i !== 0 ) {
								serie.type = 'column';
							} else {
								serie.name = I18N.EM.Ratio.BaseValue;
							}
						} else {
							serie.type = 'column';
						}
						return serie;
					});
					newConfig.stacking = null;
					newConfig.legendSwitchList = ['line', 'column'];
					return newConfig;
				},
				afterChartCreated: this._afterChartCreated
			};
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
					<header className='step2-side-header'>{I18N.SaveEffect.Create.ConfigModel}</header>
					<div className='step2-side-content'>
						<ViewableDropDownMenu
							defaultValue={BenchmarkModel}
							title={I18N.SaveEffect.Model.Title}
							valueField='id'
							textField='label'
							dataItems={getModelDataItems()}
							didChanged={onChangeModelType}
							style={{width: 170}}/>
						<ViewableDropDownMenu
							defaultValue={CalculationStep}
							isViewStatus={BenchmarkModel === Model.Manual}
							title={I18N.SaveEffect.Create.ConfigCalcStep}
							isViewStatus={true}
							valueField='id'
							textField='label'
							dataItems={getStepDataItems()}
							didChanged={onChangeStep}
							style={{width: 90}}/>
						{BenchmarkModel !== Model.Manual && <div className='pop-viewableTextField' style={{marginTop:'20px'}}>
							<header className='pop-viewable-title'>{I18N.SaveEffect.Create.BenchmarkDate}</header>
							<div>
								<ViewableDatePicker onChange={onChangeBenchmarkStartDate} datePickerClassName='date-picker-inline' width={83} value={BenchmarkStartDate}/>
								<div style={{display: 'inline-block', padding: '0 16px'}}>{I18N.EM.To2}</div>
								<ViewableDatePicker onChange={onChangeBenchmarkEndDate} datePickerClassName='date-picker-inline' width={83} value={BenchmarkEndDate}/>
							</div>
							<div className='tip-message'>{I18N.SaveEffect.Create.BenchmarkDateTip}</div>
						</div>}
					</div>
				</div>
				<div className='create-block step2-content'>
					<header className='step2-content-header'>
						{I18N.Setting.Diagnose.ChartPreview}
						<NewFlatButton
							secondary
							onClick={onGetChartData}
							style={{height: 30, lineHeight: '28px'}}
							label={I18N.Setting.Diagnose.PreviewButton}
							disabled={disabledPreview}
							icon={<ActionVisibility style={{height:16}}/>}/>
					</header>
					<div className='step2-content-content'>
						<header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 70}}>
							<div className='diagnose-create-content'>
								<ViewableDatePicker onChange={onChangeBenchmarkStartDate} datePickerClassName='diagnose-date-picker' width={100} value={BenchmarkStartDate}/>
								<div style={{display: 'inline-block', padding: '0 16px'}}>{I18N.EM.To2}</div>
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
