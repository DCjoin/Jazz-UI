import React, { Component } from 'react';

import ActionVisibility from 'material-ui/svg-icons/action/visibility';
import CircularProgress from 'material-ui/CircularProgress';
import find from 'lodash-es/find';
import _ from 'lodash-es';
import moment from 'moment';
import Immutable from 'immutable';

import TimeGranularity from 'constants/TimeGranularity.jsx';
import {Model,CalendarItemType} from 'constants/actionType/Effect.jsx';

import Util from 'util/Util.jsx';

import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import ViewableDatePicker from 'controls/ViewableDatePicker.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';

import {ChartDateFilter} from 'components/Diagnose/CreateDiagnose.jsx';
import ChartBasicComponent from 'components/DataAnalysis/Basic/ChartBasicComponent.jsx';
import {getDateObjByRange} from './';
import TimePeriodComp from './time_period_comp.jsx';

const PLOT_BACKGROUND_COLOR = '#ecfaf8';

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
			<header>{I18N.SaveEffect.Create.CalcBenchmarkByMonth + '(' + unit + ')'}</header>
			{BenchmarkDatas &&
			<div>
				{BenchmarkDatas.map((data, idx) =>
				<ViewableTextField
					errorStyle={{
						position: 'absolute',
						bottom: -5,
						fontSize: '11px',
					}}
					errorMessage={I18N.Setting.Diagnose.FormatVaildTip}
					regex={/^(\-?)\d{1,9}([.]\d{1,3})?$/}
					defaultValue={data.Value}
					hintText={data.Label}
					style={{width: 95}}
					didChanged={(val) => {
						onChangeValue(idx, val);
					}}
				/>)}
			</div>}
		</div>
	);
}


export default class Step3 extends Component {
	constructor(props) {
		super(props);

	}

_renderAllDayTimes(){
		var {TimePeriods,onTimePeriodsChanged}=this.props;
		var items=[];
		TimePeriods.forEach(time=>{
			if(time.TimePeriodType===CalendarItemType.AllDayCalcTime && time.ConfigStep===3){
				items.push(time)
			}
		})

		return(
				<div className='calendar-content'>
					<TimePeriodComp
						workRuningTimes={items}
						title={I18N.SaveEffect.Create.CaculateTime}
						type={CalendarItemType.AllDayCalcTime}
						operationDisabled={true}
						onChangeWorkTime={(data, type, val) => {
							let idx=_.findIndex(TimePeriods,item=>item===data);
							TimePeriods[idx][type] = val/60;
							onTimePeriodsChanged(Immutable.fromJS(TimePeriods));
						}}/>
				</div>
		)
	}

	_renderWorkAndHolidayTimes(){
		var {TimePeriods,onTimePeriodsChanged}=this.props;
		var workItems=[],holidayItems=[];
		TimePeriods.forEach(time=>{
			if(time.TimePeriodType===CalendarItemType.WorkDayCalcTime && time.ConfigStep===3){
				workItems.push(time)
			}else if(time.TimePeriodType===CalendarItemType.RestDayCalcTime && time.ConfigStep===3){
				holidayItems.push(time)
			}
			
		})

		return(
			<div className='calendar-content'>
					<TimePeriodComp
						workRuningTimes={workItems}
						title={I18N.SaveEffect.Create.WorkCaculateTime}
						type={CalendarItemType.WorkDayCalcTime}
						operationDisabled={true}
						onChangeWorkTime={(data, type, val) => {
							let idx=_.findIndex(TimePeriods,item=>item===data);
							TimePeriods[idx][type] = val/60;
							onTimePeriodsChanged(Immutable.fromJS(TimePeriods));
						}}/>
								<TimePeriodComp
						workRuningTimes={holidayItems}
						title={I18N.SaveEffect.Create.HolidayCaculateTime}
						type={CalendarItemType.RestDayCalcTime}
						operationDisabled={true}
						onChangeWorkTime={(data, type, val) => {
							let idx=_.findIndex(TimePeriods,item=>item===data);
							TimePeriods[idx][type] = val/60;
							onTimePeriodsChanged(Immutable.fromJS(TimePeriods));
						}}/>
				</div>
		)

	}
	_renderConfigCalendar(){
		let {needCalendar}=this.props;
		return needCalendar?this._renderWorkAndHolidayTimes():this._renderAllDayTimes()
	}

	render() {
		let { data,
			disabledPreview,
			BenchmarkModel,
			CalculationStep,
			EnergyUnitPrice,
			CorrectionFactor,
			EnergyStartDate,
			EnergyEndDate,
			BenchmarkDatas,
			IncludeEnergyEffectData,
			onChangeEnergyUnitPrice,
			onChangeCorrectionFactor,
			onChangeEnergyStartDate,
			onChangeEnergyEndDate,
			onChangeBenchmarkDatas,
			onGetChartData,
			unit,
		} = this.props,
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
				postNewConfig: (chartCmpObj) => {
					let newConfig = Util.merge(true, chartCmpObj);
					newConfig.series = newConfig.series.map((serie, i) => {
						if( i !== 0 ) {
							serie.type = 'column';
						} else {
							serie.name = I18N.EM.Ratio.BaseValue;
						}
						return serie;
					});
					newConfig.stacking = null;
					newConfig.legendSwitchList = ['line', 'column'];

					//add calendar background-color
					var {Calendars}=data.toJS();
					  if( CalculationStep === TimeGranularity.Hourly && Calendars && Calendars.length > 0 ) {
								let { CalendarTimeRanges} = Calendars[0];
								if( CalendarTimeRanges && CalendarTimeRanges.length > 0 ) {
									
									newConfig.xAxis.plotBands = CalendarTimeRanges.map(({StartTime, EndTime}) => {
										return {
											color: PLOT_BACKGROUND_COLOR,
											from: moment.utc(StartTime).valueOf(),
											to: moment.utc(EndTime).valueOf()        
										}
									});

								}
							}
					return newConfig;
				}
				// postNewConfig: curry(postNewConfig)(data, isEdit, isTypeC, hiddenAssociateLabel),
			};
		  let target = data.getIn(['TargetEnergyData', 0, 'Target'])
		  if( target && target.get('TimeSpan') && target.get('TimeSpan').size > 0 ) {
		    let step = target.get('Step');
		    chartProps.contentSyntax = JSON.stringify({
		      viewOption: {
		        TimeRanges: [{
		          StartTime: target.getIn(['TimeSpan', 'StartTime']),
		          EndTime: target.getIn(['TimeSpan', 'EndTime']),
		          // StartTime: subtractStep(EnergyStartDate, step),
		          // EndTime: subtractStep(EnergyEndDate, step),
		        }]
		      }
		    });
		  }
		}
		return (
			<div className='step2-wrapper'>
				<div className='create-block step2-side step3-side'>
					<header className='step2-side-header hiddenEclipse'>{I18N.SaveEffect.Create.CalcSave}</header>
					<div className='step2-side-content step3-side-content'>
						<div className='pop-viewableTextField'>
							<header className='pop-viewable-title'>{I18N.SaveEffect.EnergyCalculatePeriod}</header>
							<div>
								<ViewableDatePicker  hintText={I18N.Setting.Calendar.StartTime} onChange={onChangeEnergyStartDate} datePickerClassName='date-picker-inline' width={83} value={EnergyStartDate}/>
								<div style={{display: 'inline-block', padding: '0 16px'}}>{I18N.EM.To2}</div>
								<ViewableDatePicker  hintText={I18N.Setting.Calendar.EndTime} onChange={onChangeEnergyEndDate} datePickerClassName='date-picker-inline' width={83} value={EnergyEndDate}/>
							</div>
							<ViewableTextField errorMessage={I18N.SaveEffect.FormatVaildTip} regex={/^(\+?)\d{1,9}([.]\d{1,3})?$/} style={{width: 170,marginTop:'10px'}} title={I18N.SaveEffect.Create.EnergyUnitPrice + `(RMB/${unit})`} hintText={I18N.SaveEffect.Create.EnterEnergyUnitPrice} defaultValue={EnergyUnitPrice} didChanged={onChangeEnergyUnitPrice}/>
							{ Model.Manual === BenchmarkModel && <ManualValue unit={unit} key={EnergyStartDate + EnergyEndDate} BenchmarkDatas={BenchmarkDatas} onChangeValue={onChangeBenchmarkDatas}/>}
							{Model.Manual !== BenchmarkModel && CalculationStep===TimeGranularity.Daily &&
							<ViewableTextField errorMessage={I18N.SaveEffect.FormatVaildTip} regex={/^(\+?)\d{1,9}([.]\d{1,3})?$/} style={{width: 170,marginTop:'10px'}} title={I18N.SaveEffect.Create.CorrectionFactor} hintText={I18N.SaveEffect.Create.EnterCorrectionFactor} defaultValue={CorrectionFactor} didChanged={onChangeCorrectionFactor}/>
							}
							{Model.Manual !== BenchmarkModel && Model.Contrast !== BenchmarkModel && CalculationStep===TimeGranularity.Hourly &&
								this._renderConfigCalendar()
							}
						</div>
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
							disabled={!EnergyStartDate || !EnergyEndDate}
							icon={<ActionVisibility style={{height:16}}/>}/>
					</header>
					<div className='step2-content-content'>
						{data && <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 70}}>
							<div className='diagnose-create-content'>
								<ViewableDatePicker onChange={onChangeEnergyStartDate} datePickerClassName='diagnose-date-picker' width={100} value={EnergyStartDate}/>
								<div style={{display: 'inline-block', padding: '0 16px'}}>{I18N.EM.To2}</div>
								<ViewableDatePicker onChange={onChangeEnergyEndDate} datePickerClassName='diagnose-date-picker' width={100} value={EnergyEndDate}/>
							</div>
							<span>{I18N.EM.Report.Step + ': ' + find(getStepDataItems(), item => item.id === CalculationStep).label}</span>
						</header>}
						{data ?
						<ChartBasicComponent {...chartProps}/> :
						<div className='flex-center' style={{flexDirection: 'column'}}>
							<em className='icon-chart1' style={{fontSize: '50px', color: '#32ad3d'}}/>
							<div>{I18N.SaveEffect.Create.NeedEnterSaveTimeTip1}</div>
							<div>{I18N.SaveEffect.Create.NeedEnterSaveTimeTip2}</div>
						</div>}
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
