import React, { Component, PropTypes } from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import ActionVisibility from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import moment from 'moment';
import Immutable from 'immutable';
import classnames from 'classnames';
import { curry } from 'lodash/function';

import TimeGranularity from 'constants/TimeGranularity.jsx';
import {DIAGNOSE_MODEL} from 'constants/actionType/Diagnose.jsx';

import ReduxDecorator from '../../decorator/ReduxDecorator.jsx';
import NewAppTheme from '../../decorator/NewAppTheme.jsx';

import {isEmptyStr, getDateTimeItemsByStepForVal, getDateTimeItemsByStep} from 'util/Util.jsx';

import LinkButton from 'controls/LinkButton.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import ViewableDatePicker from 'controls/ViewableDatePicker.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import MonthDayItem from 'controls/MonthDayItem.jsx';
import Dialog from 'controls/NewDialog.jsx';

import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';

import DiagnoseChart from './DiagnoseChart.jsx';

let _firstUom = '';

const SEPARTOR = '-';
const DATE_FORMAT = 'YYYY-MM-DD';
const CALENDAR_ITEM_TYPE = {
	WorkDay: 0,
	Holiday: 1,
	WorkTime: 2,
	RestTime: 3,
	HeatingSeason: 4,
	CoolingSeason: 5,
	Day: 6,
	Night: 7
}
const TRIGGER_TYPE = {
	FixedValue: 1,
	HistoryValue: 2,
}
const CONDITION_TYPE = {
	Larger: -1,
	LargerAndEqual: -2,
	Equal: 0,
	Smaller: 1,
	SmallerAndEqual: 2,
}
const TIME_GRANULARITY_MAP_VAL = {
	// [TimeGranularity.None]: -1,
	[TimeGranularity.Minite]: 60 * 60,
	// [TimeGranularity.Min15]: 15 * 60,
	// [TimeGranularity.Min30]: 30 * 60,
	[TimeGranularity.Hourly]: 60 * 60,
	// [TimeGranularity.Hour2]: 2 * 60 * 60,
	// [TimeGranularity.Hour4]: 4 * 60 * 60,
	// [TimeGranularity.Hour6]: 6 * 60 * 60,
	// [TimeGranularity.Hour8]: 8 * 60 * 60,
	// [TimeGranularity.Hour12]: 12 * 60 * 60,
	[TimeGranularity.Daily]: 24 * 60 * 60,
	// [TimeGranularity.Weekly]: 7 * 24 * 60 * 60,
	// [TimeGranularity.Monthly]: 30 * 24 * 60 * 60,
	// [TimeGranularity.Yearly]: 365 * 24 * 60 * 60,
}
function checkStep(tags, step) {
	return tags.filter(tag => tag.get('checked')).filter(tag => TIME_GRANULARITY_MAP_VAL[step] < TIME_GRANULARITY_MAP_VAL[tag.get('Step')] ).size === 0;
}
function getCanSelectTimeGranularity(tags) {
	let maxTime = Math.max(tags.filter(tag => tag.get('checked')).map(tag => TIME_GRANULARITY_MAP_VAL[tag.get('Step')]).toJS());
	return Object.keys(TIME_GRANULARITY_MAP_VAL).filter( step => TIME_GRANULARITY_MAP_VAL[step] >= maxTime );
}
function getStepItems(){
	return [{
		step: TimeGranularity.Minite,
		text: I18N.EM.Raw
	}, {
		step: TimeGranularity.Hourly,
		text: I18N.EM.Hour
	}, {
		step: TimeGranularity.Daily,
		text: I18N.EM.Day
	}, ];
}

function StepItem({
	disabled,
	selected,
	step,
	text,
	onStepChange
}) {
	return (
		<div
			className={classnames('jazz-energy-step-item', {
				'jazz-energy-step-item-selected': selected && !disabled,
				'jazz-energy-step-item-disable': disabled
			})}
			onClick={() => {
				!disabled && typeof onStepChange === 'function' && onStepChange(step)
			}}>
			{text}
		</div>
	);

};

function getDefaultFilter() {
	return Immutable.fromJS({
		TagIds: [],
		StartTime: moment().subtract(7, 'days').format('YYYY-MM-DDT00:00:00'),
		EndTime: moment().format('YYYY-MM-DDT24:00:00'),
		Step: TimeGranularity.Minite,
		Timeranges: [
			{
				StartTime: getFirstDateByThisYear(DATE_FORMAT),
				EndTime: getEndDateByThisYear(DATE_FORMAT)
			}
		],
		WorkTimes: [{
			TimeType: 0,
			StartTime: 480,
			EndTime: 1200,
		}, {
			TimeType: 1,
			StartTime: 600,
			EndTime: 840,
		}],
		TriggerValue: null,
		ConditionType: CONDITION_TYPE.Smaller,
		TriggerType: TRIGGER_TYPE.FixedValue,
		ToleranceRatio: null,
		HistoryStartTime: moment().subtract(31, 'days').format('YYYY-MM-DDT00:00:00'),
		HistoryEndTime: moment().subtract(1, 'days').format('YYYY-MM-DDT24:00:00'),
	});
}

function formatDataRangeLabel(date) {
	return moment(date).format('MM-DD');
}

function getFirstDateByThisYear(formatStr) {
	return moment().startOf('year').format(formatStr)
}
function getEndDateByThisYear(formatStr) {
	return moment().endOf('year').format(formatStr)
}

function Left(props) {
	return (<div style={{float: 'left', marginTop: 5}}>{props.children}</div>);
}
function Right(props) {
	return (<div style={{float: 'right'}}>{props.children}</div>);
}
function PrevButton(props) {
	return (<LinkButton {...props} label={'<上一步'}/>);
}
function NextButton(props) {
	return (<RaisedButton {...props} label={'下一步'}  primary={true}/>);
}
function utcFormat(dateStr) {
	return moment(dateStr).subtract(8, 'hours').format(DATE_FORMAT + 'THH:mm:ss');
}
function updateUtcFormatFilter(filterObj, paths) {
	return paths.reduce(
		(computedFilterObj, path,) => computedFilterObj.set(
								path,
								utcFormat( computedFilterObj.get(path) )
							),
		filterObj);
}

function AdditiveComp({
	className,
	contentClassName,
	title,
	renderFunc,
	data,
	limit,
	onAdd,
	onDelete}
) {
	let disabled = data && data.length >= limit;
	return (
		<div className={className}>
			<hgroup className='' style={{color: '#202622', marginBottom: -15}}>
			{title} <IconButton 
						disabled={disabled}  
						iconClassName='icon-add' 
						iconStyle={{
							fontSize: 14,
							iconHoverColor: '#0cad04',
						}} 
						onClick={onAdd}/>
			</hgroup>
			<div className={contentClassName}>{data.map( (item, idx) =>
				<div style={{display: 'flex'}}>
					{renderFunc(item, idx)}
					{data && data.length > 1 &&
					(<IconButton iconClassName='icon-close' iconStyle={{
						fontSize: 12,
						iconHoverColor: '#0cad04',
					}} onClick={() => {
						onDelete(idx);
					}}/>)}
				</div>)}
			</div>
		</div>
	)
}

function ChartDateFilter({StartTime, EndTime, onChangeStartTime, onChangeEndTime, disabled, style}) {
	let endTimeLabel = EndTime.split('T')[1].split(':').slice(0, 2).join(':');
	if(endTimeLabel === '00:00') {
		endTimeLabel = '24:00';
	}
	return (<section className='diagnose-create-chart-filter' style={style}>
		<ViewableDatePicker
			disabled={disabled}
    		width={100}
			value={StartTime.split('T')[0]}
			onChange={(val) => {
				onChangeStartTime(val + 'T' + StartTime.split('T')[1]);
			}}/>
		<ViewableDropDownMenu
			disabled={disabled}
			style={{width: 100, marginLeft: 10, marginTop: -6}}
			defaultValue={StartTime.split('T')[1].split(':').slice(0, 2).join(':')}
			dataItems={getDateTimeItemsByStep(60).slice(0, 23)}
			didChanged={(val) => {
				onChangeStartTime(moment(StartTime).format(DATE_FORMAT) + 'T' + val + ':00');
			}}/>
		<div style={{margin: '0 10px', alignSelf: 'center'}}>{'至'}</div>
		<ViewableDatePicker
			disabled={disabled}
    		width={100}
			value={EndTime.split('T')[0]}
			onChange={(val) => {
				onChangeEndTime(val + 'T' + EndTime.split('T')[1]);
			}}/>
		<ViewableDropDownMenu
			disabled={disabled}
			style={{width: 100, marginLeft: 10, marginTop: -6}}
			defaultValue={endTimeLabel}
			dataItems={getDateTimeItemsByStep(60).slice(1)}
			didChanged={(val) => {
				onChangeEndTime(moment(EndTime).format(DATE_FORMAT) + 'T' + val + ':00');
			}}/>
	</section>)
}

function TagList({tags, onCheck}) {
	let content = (<section className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></section>);
	if( tags ) {
		content = (
			<ul className='diagnose-create-tag-list-content'>
				{tags.map( (tag, i) =>
				<li className='diagnose-create-tag-list-item'  title={tag.get('Name')}>
					<Checkbox checked={tag.get('checked')} 
						disabled={!tag.get('checked') && tags.filter(tmpTag => tmpTag.get('checked')).size === 10} 
						onCheck={(e, isInputChecked) => {
							onCheck(i, isInputChecked);
					}}/>
					<div className='diagnose-create-checkbox-label'>
						<div className='diagnose-create-checkbox-label-name hiddenEllipsis'>
							{tag.get('Name')}
						</div>
						{tag.get('Status') !== 0 &&
						<div className='diagnose-create-checkbox-label-tip'>
							{'诊断中'}
						</div>}
					</div>
				</li>
				).toJS()}
			</ul>
		);
	}
	return (<section className='diagnose-create-tag-list'>
		<hgroup className='diagnose-create-tag-list-title diagnose-create-title'>{'诊断数据点'}</hgroup>
		{content}
	</section>)
}

/**
chartData: API返回图表数据
chartDataLoading: 图表数据请求中
Step: 步长(TimeGranularity)
onUpdateStep: 更新步长
StartTime: 开始时间(YYYY-MM-DDTHH:mm:ss)
EndTime: 结束时间(YYYY-MM-DDTHH:mm:ss)
onChangeStartTime: 修改开始时间 :: String(YYYY-MM-DDTHH:mm:ss) -> ?
onChangeEndTime: 修改结束时间 :: String(YYYY-MM-DDTHH:mm:ss) -> ?
**/
function ChartPreview({chartData, chartDataLoading, onUpdateStep, Step, onDeleteLegendItem, ...other}) {
	return (<section className='diagnose-create-chart-preview'>
		<hgroup className='diagnose-range-title diagnose-create-title'>{'图表预览'}</hgroup>
		<div className='diagnose-create-chart-action'>
			<ChartDateFilter
				disabled={!chartData}
				{...other}/>
			<div className='jazz-energy-step'>
				{getStepItems().map((item => <StepItem {...item} disabled={!chartData} selected={item.step === Step} onStepChange={onUpdateStep}/>))}
			</div>
		</div>
		{chartDataLoading ? <div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div> :
		(chartData ?  <div className='diagnose-create-chart'><DiagnoseChart data={chartData} onDeleteButtonClick={onDeleteLegendItem}/></div> :
		<div className='flex-center'>{'在左侧选择数据点'}</div>)}
	</section>)
}

function ChartPreviewStep2({chartData, chartDataLoading, getChartData, disabledPreview, onDeleteLegendItem, ...other}) {
	return (<section className='diagnose-create-chart-preview-step2'>
		<hgroup className='diagnose-create-title'>{'图表预览'}</hgroup>
		<div className='diagnose-create-chart-action'>
			<ChartDateFilter
				disabled={!chartData}
				{...other}/>
			<RaisedButton label={'预览'} disabled={disabledPreview} onClick={getChartData} icon={<ActionVisibility/>}/>
		</div>
		{chartDataLoading ? <div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div> :
		(chartData ?  <div className='diagnose-create-chart'><DiagnoseChart data={chartData} onDeleteButtonClick={onDeleteLegendItem}/></div> :
		<div className='flex-center'>{'在左侧选择数据点'}</div>)}
	</section>)

}

/**
Step: 步长(TimeGranularity)
onUpdateStep: 更新步长
Timeranges: 诊断时间范围[{StartTime: YYYY-MM-DD, EndTime: YYYY-MM-DD}]
onAddDateRange: 添加诊断时间范围
onDeleteDateRange: 删除诊断时间范围 :: Number(idx) ->
onUpdateDateRange: 修改诊断时间范围 :: idx, type, first/end, String(YYYY-MM-DDTHH:mm:ss) -> ?
**/
export function DiagnoseRange({
	disabled,
	Step,
	onUpdateStep,
	Timeranges,
	onAddDateRange,
	onDeleteDateRange,
	onUpdateDateRange
}) {
	return (<section className='diagnose-range'>
		<hgroup className='diagnose-range-title diagnose-create-title'>{'诊断范围'}</hgroup>
		<div className='diagnose-range-content'>
			<ViewableDropDownMenu
				disabled={disabled}
				style={{width: 116}}
				title={'步长'}
				defaultValue={Step}
				didChanged={onUpdateStep}
				dataItems={[
					{payload: TimeGranularity.Minite, text: I18N.EM.Raw},
					{payload: TimeGranularity.Hourly, text: I18N.EM.Hour},
					{payload: TimeGranularity.Daily, text: I18N.EM.Day},
				]}
			/>
			<AdditiveComp
				className={'diagnose-range-time'}
				contentClassName={'diagnose-range-time-content'}
				title={'时间范围'}
				limit={disabled ? 0 : 2}
				data={Timeranges}
				onAdd={onAddDateRange}
				onDelete={onDeleteDateRange}
				renderFunc={(data, idx) =>
					<div key={idx} style={{display: 'flex', alignItems: 'center'}}>
					<MonthDayItem
						disabled={disabled}
						isViewStatus={false}
						month={new Date(data.StartTime).getMonth() + 1}
						day={new Date(data.StartTime).getDate()}
						onMonthDayItemChange={(type, val) => {
							onUpdateDateRange(idx, 'StartTime', type, val);
						}}/>
					至
					<MonthDayItem
						disabled={disabled}
						isViewStatus={false}
						month={new Date(data.EndTime).getMonth() + 1}
						day={new Date(data.EndTime).getDate()}
						onMonthDayItemChange={(type, val) => {
							onUpdateDateRange(idx, 'EndTime', type, val);
						}}/>
					</div>
				}/>
		</div>
	</section>);
}

function RuntimeComp({
	workRuningTimes,
	onChangeWorkTime,
	onAddWorkTime,
	onDeleteWorkTime,
	type,
	title
}) {
	return (
		<AdditiveComp
			className={'diagnose-condition-run-time'}
			title={title}
			limit={4}
			data={workRuningTimes}
			onAdd={onAddWorkTime}
			onDelete={onDeleteWorkTime}
			renderFunc={(data, idx) =>
			<div key={idx} style={{display: 'flex', alignItems: 'center', marginLeft: -10}}>
				<ViewableDropDownMenu
					style={{width: 100, marginLeft: 10, marginTop: -6}}
					defaultValue={data.StartTime}
					dataItems={getDateTimeItemsByStepForVal(60).slice(0, 23)}
					didChanged={(val) => {
						if(val > data.EndTime) {
							onChangeWorkTime(idx, 'EndTime', val);
						}
						onChangeWorkTime(idx, 'StartTime', val);
					}}/>
				{'至'}
				<ViewableDropDownMenu
					style={{width: 100, marginLeft: 10, marginTop: -6}}
					defaultValue={data.EndTime || 60 * 24}
					dataItems={getDateTimeItemsByStepForVal(60).slice(1)}
					didChanged={(val) => {
						if(val < data.StartTime) {
							onChangeWorkTime(idx, 'StartTime', val);
						}
						onChangeWorkTime(idx, 'EndTime', val);
					}}/>
			</div>
		}/>);
}

function ModelACondition({TriggerValue, onUpdateTriggerValue, uom}) {
	return (<div className='diagnose-condition-model-a'>
		<span className='diagnose-condition-subtitle'>{`非运行时间触发值(${uom})`}</span>
		<ViewableTextField
			hintText={'输入触发值'}
			defaultValue={TriggerValue}
			didChanged={onUpdateTriggerValue}/>
		<span style={{fontSize: 12, color: '#9c9c9c'}}>{'注： 高于触发值时触发诊断'}</span>
	</div>)
}

function ModelBCondition({
	uom,
	TriggerValue,
	onUpdateTriggerValue,
	ConditionType,
	onUpdateConditionType,
	TriggerType,
	onUpdateTriggerType,
	ToleranceRatio,
	onUpdateToleranceRatio,
	HistoryStartTime,
	HistoryEndTime,
	onUpdateHistoryStartTime,
	onUpdateHistoryEndTime,

	disabledHistory,
}) {
	return (<div className='diagnose-condition-model-b'>
		<div className='diagnose-condition-model-b-item'>
			<div className='diagnose-condition-subtitle'>{'触发条件'}</div>
			<RadioButtonGroup
				className={'diagnose-condition-radio-group'}
				name="ConditionType"
				valueSelected={ConditionType}
				onChange={(evt, val) => {
					onUpdateConditionType(val);
			}}>
				<RadioButton
					value={CONDITION_TYPE.Larger}
					label={'大于触发值'}
				/>
				<RadioButton
					value={CONDITION_TYPE.Smaller}
					label={'小于触发值'}
				/>
			</RadioButtonGroup>
		</div>
		<div className='diagnose-condition-model-b-item'>
			<div>
				<div className='diagnose-condition-subtitle'>{'基准值属性'}</div>
				{disabledHistory && <div style={{fontSize: 10, color: '#9c9c9c', marginTop: 5}}>{'(历史值仅支持单个数据点)'}</div>}
			</div>
			<RadioButtonGroup
				className={'diagnose-condition-radio-group'}
				name="TriggerType"
				valueSelected={TriggerType}
				onChange={(evt, val) => {
					onUpdateTriggerType(val);
			}}>
				<RadioButton
					value={TRIGGER_TYPE.FixedValue}
					label={'固定值'}
				/>
				<RadioButton
					disabled={disabledHistory}
					value={TRIGGER_TYPE.HistoryValue}
					label={'历史值'}
				/>
			</RadioButtonGroup>
		</div>
		{ TriggerType === TRIGGER_TYPE.FixedValue && 
		<div style={{marginTop: 15}}>
			<span className='diagnose-condition-subtitle'>{`基准值(${uom})`}</span>
			<ViewableTextField
				hintText={'填写基准值'}
				defaultValue={TriggerValue}
				didChanged={onUpdateTriggerValue}/>
		</div>}
		{ TriggerType === TRIGGER_TYPE.HistoryValue && 
		<div style={{marginTop: 15}}>
			<span className='diagnose-condition-subtitle'>{'基准值历史事件范围'}</span>
			<ChartDateFilter
				style={{
					flexWrap: 'wrap'
				}}
				StartTime={HistoryStartTime}
				EndTime={HistoryEndTime}
				onChangeStartTime={onUpdateHistoryStartTime}
				onChangeEndTime={onUpdateHistoryEndTime}/>
		</div>}
		<div style={{marginTop: 15, marginBottom: 15}}>
			<span className='diagnose-condition-subtitle'>{'敏感值(%)'}</span>
			<ViewableTextField
				hintText={'填写敏感值'}
				defaultValue={!isEmptyStr(ToleranceRatio) ? ToleranceRatio * 100 : ToleranceRatio}
				didChanged={onUpdateToleranceRatio}/>
			<span style={{fontSize: 12, color: '#ff4b00'}}>{'注：触发值=基准值*（1+／-敏感值)'}</span>
		</div>
	</div>)
}

function DiagnoseCondition({
	onChangeWorkTime,
	DiagnoseModel,
	WorkTimes,

	...other

	// TriggerValue,
	// onUpdateTriggerValue,
	// ConditionType,
	// onUpdateConditionType,
	// TriggerType,
	// onUpdateTriggerType,
	// ToleranceRatio,
	// onUpdateToleranceRatio,
	// HistoryStartTime,
	// HistoryEndTime,
	// onUpdateHistoryStartTime,
	// onUpdateHistoryEndTime,
}) {
	let workRuningTimes = WorkTimes.filter(time => time.TimeType === CALENDAR_ITEM_TYPE.WorkDay),
	holidayRuningTimes = WorkTimes.filter(time => time.TimeType === CALENDAR_ITEM_TYPE.Holiday);
	return (<section className='diagnose-condition'>
		<hgroup className='diagnose-create-title'>{'诊断条件'}</hgroup>
		<div className='diagnose-condition-content'>
			<RuntimeComp
				workRuningTimes={workRuningTimes}
				title={'工作日运行时间'}
				type={CALENDAR_ITEM_TYPE.WorkDay}
				onAddWorkTime={() => {
					workRuningTimes.push({
						TimeType: 0,
						StartTime: 480,
						EndTime: 1200,
					});
					onChangeWorkTime(workRuningTimes.concat(holidayRuningTimes));
				}}
				onDeleteWorkTime={(idx) => {
					workRuningTimes.splice(idx, 1);
					onChangeWorkTime(workRuningTimes.concat(holidayRuningTimes));
				}}
				onChangeWorkTime={(idx, type, val) => {
					workRuningTimes[idx][type] = val;
					onChangeWorkTime(workRuningTimes.concat(holidayRuningTimes));
				}}/>
			<RuntimeComp
				workRuningTimes={holidayRuningTimes}
				title={'休息日运行时间'}
				type={CALENDAR_ITEM_TYPE.Holiday}
				onAddWorkTime={() => {
					holidayRuningTimes.push({
						TimeType: 1,
						StartTime: 600,
						EndTime: 840,
					});
					onChangeWorkTime(workRuningTimes.concat(holidayRuningTimes));
				}}
				onDeleteWorkTime={(idx) => {
					holidayRuningTimes.splice(idx, 1);
					onChangeWorkTime(workRuningTimes.concat(holidayRuningTimes));
				}}
				onChangeWorkTime={(idx, type, val) => {
					holidayRuningTimes[idx][type] = val;
					onChangeWorkTime(workRuningTimes.concat(holidayRuningTimes));
				}}/>
			{DiagnoseModel === DIAGNOSE_MODEL.A && <ModelACondition {...other}/>}
			{DiagnoseModel === DIAGNOSE_MODEL.B && <ModelBCondition {...other}/>}
		</div>
	</section>);
}


/**
diagnoseTags: tags列表
onCheckDiagnose: 点击tags事件

chartData: API返回图表数据
chartDataLoading: 图表数据请求中
Step: 步长(TimeGranularity)
onUpdateStep: 更新步长
StartTime: 开始时间(YYYY-MM-DDTHH:mm:ss)
EndTime: 结束时间(YYYY-MM-DDTHH:mm:ss)
onChangeStartTime: 修改开始时间 :: String(YYYY-MM-DDTHH:mm:ss) -> ?
onChangeEndTime: 修改结束时间 :: String(YYYY-MM-DDTHH:mm:ss) -> ?

Timeranges: 诊断时间范围[{StartTime: YYYY-MM-DD, EndTime: YYYY-MM-DD}]
onAddDateRange: 添加诊断时间范围
onDeleteDateRange: 删除诊断时间范围 :: Number(idx) ->
onUpdateDateRange: 修改诊断时间范围 :: idx, type, first/end, String(YYYY-MM-DDTHH:mm:ss) -> ?
**/
class CreateStep1 extends Component {
	render() {
		let {
			diagnoseTags,
			onCheckDiagnose,
			StartTime,
			onChangeStartTime,
			EndTime,
			onChangeEndTime,
			Step,
			onUpdateStep,
			chartData,
			chartDataLoading,
			Timeranges,
			onAddDateRange,
			onDeleteDateRange,
			onUpdateDateRange,
			onDeleteLegendItem,
		} = this.props;
		return (
			<section className='diagnose-create-content'>
				<div className='diagnose-create-step'>
					<TagList tags={diagnoseTags} onCheck={onCheckDiagnose}/>
					<ChartPreview
						onDeleteLegendItem={onDeleteLegendItem}
						StartTime={StartTime}
						onChangeStartTime={onChangeStartTime}
						EndTime={EndTime}
						onChangeEndTime={onChangeEndTime}
						Step={Step}
						onUpdateStep={onUpdateStep}
						chartData={chartData}
						chartDataLoading={chartDataLoading}/>
				</div>
				<DiagnoseRange
					disabled={!chartData}
					Step={Step}
					onUpdateStep={onUpdateStep}
					Timeranges={Timeranges}
					onAddDateRange={onAddDateRange}
					onDeleteDateRange={onDeleteDateRange}
					onUpdateDateRange={onUpdateDateRange}/>
			</section>
		);
	}
}

/**
onUpdateFilterObj,
DiagnoseModel,
WorkTimes,
TriggerValue,
ConditionType,
TriggerType,
ToleranceRatio,
HistoryStartTime,
HistoryEndTime,

StartTime,
EndTime,
chartData,
chartDataLoading,
getChartData,

disabledHistory,
onDeleteLegendItem,
**/
export class CreateStep2 extends Component {
	render() {
		let {
			onUpdateFilterObj,
			StartTime,
			EndTime,
			DiagnoseModel,
			WorkTimes,
			TriggerValue,
			ConditionType,
			TriggerType,
			ToleranceRatio,
			HistoryStartTime,
			HistoryEndTime,
			disabledPreview,
			disabledHistory,
			chartData,
			...other,
		} = this.props;
		if(chartData) {
			_firstUom = chartData.getIn(['EnergyViewData', 'TargetEnergyData', 0, 'Target', 'Uom']);
		}
		return (
			<section className='diagnose-create-content diagnose-create-step'>
				<ChartPreviewStep2 {...other}
					chartData={chartData}
					disabledPreview={disabledPreview}
					StartTime={StartTime}
					onChangeStartTime={(val) => {
						let startTime = moment(val),
						endTime = moment(EndTime),
						setStartTime = () => {
							onUpdateFilterObj('StartTime')(val);
						};
						if(endTime < startTime) {
							endTime = moment(startTime).add(1, 'days');
						} else if( moment(startTime).add(30, 'days') < endTime ) {
							endTime = moment(startTime).add(30, 'days');
						}
						if(endTime.format('YYYY-MM-DDTHH:mm:ss') !== EndTime) {
							onUpdateFilterObj('EndTime')(endTime.format('YYYY-MM-DDTHH:mm:ss'), setStartTime );
						} else {
							setStartTime();
						}
					}}
					EndTime={EndTime}
					onChangeEndTime={(val) => {
						let startTime = moment(StartTime),
						endTime = moment(val),
						setEndTime = () => {
							onUpdateFilterObj('EndTime')(val);
						};
						if(endTime < startTime) {
							startTime = moment(endTime).subtract(1, 'days');
						} else if( moment(endTime).subtract(30, 'days') > startTime ) {
							startTime = moment(endTime).subtract(30, 'days');
						}
						if(startTime.format('YYYY-MM-DDTHH:mm:ss') !== StartTime) {
							onUpdateFilterObj( 'StartTime')(startTime.format('YYYY-MM-DDTHH:mm:ss'), setEndTime );
						} else {
							setEndTime();
						}
					}}
				/>
				<DiagnoseCondition
					uom={_firstUom}
					disabledHistory={disabledHistory}
					DiagnoseModel={DiagnoseModel}
					WorkTimes={WorkTimes}
					onChangeWorkTime={onUpdateFilterObj('WorkTimes')}

					TriggerValue={TriggerValue}
					onUpdateTriggerValue={onUpdateFilterObj('TriggerValue')}

					ConditionType={ConditionType}
					onUpdateConditionType={onUpdateFilterObj('ConditionType')}

					TriggerType={TriggerType}
					onUpdateTriggerType={onUpdateFilterObj('TriggerType')}

					ToleranceRatio={ToleranceRatio}
					onUpdateToleranceRatio={(val) => {
						onUpdateFilterObj('ToleranceRatio')(!isEmptyStr(val) ? val / 100 : val)
					}}

					HistoryStartTime={HistoryStartTime}
					onUpdateHistoryStartTime={onUpdateFilterObj('HistoryStartTime')}

					HistoryEndTime={HistoryEndTime}
					onUpdateHistoryEndTime={onUpdateFilterObj('HistoryEndTime')}
					/>
			</section>
		);
	}
}

function CreateStep3({
	diagnoseTags,
	onUpdateDiagnoseTags,
}) {
	return (
		<section className='diagnose-create-content diagnose-create-names'>
			<hgroup className='diagnose-create-title'>{'诊断名称'}</hgroup>
			<div style={{paddingLeft: 15, paddingBottom: 25}}>
				{diagnoseTags && diagnoseTags.map((tag, idx) =>
				tag.get('checked') ?
				<div style={{paddingTop: 25}}>
					<div className={'diagnose-condition-subtitle'}>{'诊断名称'}</div>
					<ViewableTextField
					hintText={'请输入诊断名称'}
					defaultValue={tag.get('DiagnoseName')}
					didChanged={(val) => {
						onUpdateDiagnoseTags(diagnoseTags.setIn([idx, 'DiagnoseName'], val));
					}}/>
				</div>
				: null
				).toJS()}
			</div>
		</section>
	);
}

@NewAppTheme
@ReduxDecorator
class CreateDiagnose extends Component {
	static getStores() {
		return [DiagnoseStore];
	};

	static calculateState(prevState) {
		return {
			diagnoseTags: (prevState && prevState.diagnoseTags) || DiagnoseStore.getTagsList(),
			chartData: DiagnoseStore.getChartData(),
			chartDataLoading: DiagnoseStore.isLoading(),
		};
	};

	static contextTypes = {
		hierarchyId: React.PropTypes.string
	};

	constructor(props, ctx) {
		super(props, ctx);
		this._setFilterObj = this._setFilterObj.bind(this);
		this._onChange = this._onChange.bind(this);
		this._onSaveBack = this._onSaveBack.bind(this);
		this._onSaveRenew = this._onSaveRenew.bind(this);
		this._onCheckDiagnose = this._onCheckDiagnose.bind(this);
		this._getChartData = this._getChartData.bind(this);
		this._onCreated = this._onCreated.bind(this);
		this._onDeleteLegendItem = this._onDeleteLegendItem.bind(this);
		this._onClose = this._onClose.bind(this);

		this.state = {
			step: 0,
			diagnoseTags: null,
			cahrtData: null,
			filterObj: getDefaultFilter()
		};

		this._getTagList(props, ctx);

		DiagnoseStore.addCreatedDiagnoseListener(this._onCreated);

	}
	componentWillUnmount(){
		DiagnoseStore.removeCreatedDiagnoseListener(this._onCreated);
	}
	_getTagList(props, ctx) {
		DiagnoseAction.getDiagnoseTag(
			ctx.hierarchyId,
			props.EnergyLabel.get('Id'),
			props.DiagnoseItem.get('Id'),
			1
		);
	}
	_getChartData() {
		let {step, filterObj, diagnoseTags} = this.state;
		if( step === 0 && diagnoseTags && diagnoseTags.filter( tag => tag.get('checked') ).size > 0 ) {
			DiagnoseAction.getChartDataStep1({
				tagIds: diagnoseTags
						.filter( tag => tag.get('checked') )
						.map( tag => tag.get('Id') )
						.toJS(),
				viewOption: {
					DataUsageType: 1,
					IncludeNavigatorData: false,
					Step: filterObj.get('Step'),
					TimeRanges: [{
						StartTime: utcFormat(filterObj.get('StartTime')),
						EndTime: utcFormat(filterObj.get('EndTime')),
					}]
				}
			});
		} else if( step === 1 ) {
			DiagnoseAction.getChartData({
			...updateUtcFormatFilter(filterObj,
				['EndTime', 'StartTime', 'HistoryEndTime', 'HistoryStartTime']
			).toJS(),
			...{
				HierarchyId: this.context.hierarchyId,
				DiagnoseItemId: this.props.DiagnoseItem.get('Id'),
				EnergyLabelId: this.props.EnergyLabel.get('Id'),
				DiagnoseModel: this.props.EnergyLabel.get('DiagnoseModel'),
				TagIds: diagnoseTags
						.filter( tag => tag.get('checked') )
						.map( tag => tag.get('Id') )
						.toJS(),
			}}, this.state.chartData);
		}
		this.setState({
			chartData: null
		});
	}
	_step2NeedRequire() {
		let {filterObj} = this.state,
		DiagnoseModel = this.props.EnergyLabel.get('DiagnoseModel');
		if( DiagnoseModel === DIAGNOSE_MODEL.A ) {
			return isEmptyStr( filterObj.get('TriggerValue') );
		} else if(DiagnoseModel === DIAGNOSE_MODEL.B) {
			if( filterObj.get('TriggerType') === TRIGGER_TYPE.FixedValue ) {
				return isEmptyStr( filterObj.get('TriggerValue') ) ||
						isEmptyStr( filterObj.get('ToleranceRatio') );
			}
			if( filterObj.get('TriggerType') === TRIGGER_TYPE.HistoryValue ) {
				return isEmptyStr( filterObj.get('ToleranceRatio') );

			}
		} else if(DiagnoseModel === DIAGNOSE_MODEL.C) {
			return true;
		}
	}
	_setStep(step) {
		return () => {
			this.setState({step}, () => this.state.step === 0 && this._getChartData());
		}
	}
	_setFilterObj(paths, val, callback) {
		let filterObj = this.state.filterObj,
		immuVal = Immutable.fromJS(val);
		if(paths instanceof Array) {
			filterObj = filterObj.setIn(paths, immuVal);
		} else {
			filterObj = filterObj.set(paths, immuVal);
		}
		this.setState({filterObj}, callback);
	}
	_setFilterObjThenUpdataChart(paths, val) {
		this._setFilterObj(paths, val, this._getChartData);
		// this._getChartData();
	}
	_createDiagnose(isClose) {
		let {filterObj, diagnoseTags} = this.state,
		checkedTags = diagnoseTags.filter( tag => tag.get('checked') );
		DiagnoseAction.createDiagnose({
			...updateUtcFormatFilter(filterObj,
				['EndTime', 'StartTime', 'HistoryEndTime', 'HistoryStartTime']
			).toJS(),
			...{
				HierarchyId: this.context.hierarchyId,
				DiagnoseItemId: this.props.DiagnoseItem.get('Id'),
				EnergyLabelId: this.props.EnergyLabel.get('Id'),
				DiagnoseModel: this.props.EnergyLabel.get('DiagnoseModel'),
				TagIds: checkedTags.map( tag => tag.get('Id') ).toJS(),
				Names: checkedTags.map( tag => tag.get('DiagnoseName') ).toJS(),
			}
		}, isClose);
	}
	_onCheckDiagnose(idx, val) {
		let newDiagnoseTags = this.state.diagnoseTags.setIn([idx, 'checked'], val);
		if( checkStep( newDiagnoseTags, this.state.filterObj.get('Step') ) ) {
			this.setState({
				diagnoseTags: newDiagnoseTags
			}, this._getChartData);

		} else {
			this.setState({
				tmpFilterDiagnoseTags: newDiagnoseTags,
				tmpFilterStep: this.state.filterObj.get('Step')
			});
		}
	}
	_onDeleteLegendItem(obj) {
		this._onCheckDiagnose(this.state.diagnoseTags.findIndex(tag => tag.get('Id') === obj.uid), false);
	}
	_onSaveBack() {
		this._createDiagnose(true);
	}
	_onSaveRenew() {
		this._createDiagnose(false);
	}
	_onRenew() {
		this.setState({
			diagnoseTags: null,
		}, DiagnoseAction.clearCreate);
		this._getTagList(this.props, this.context);
		this._setStep(0)();
	}
	_onClose(lastCreateId) {
		DiagnoseAction.clearCreate();
		this.props.onClose(lastCreateId);
	}
	_onCreated(isClose, lastCreateId) {
		if( isClose ) {
			this._onClose(lastCreateId);
		} else {
			this._onRenew();
		}
	}
	_renderContent() {
		let DiagnoseModel = this.props.EnergyLabel.get('DiagnoseModel'),
		{step, diagnoseTags, chartData, chartDataLoading, filterObj} = this.state,
		{
			TagIds,
			Timeranges,
			Step,
			StartTime,
			EndTime,
			WorkTimes,
			TriggerValue,
			ConditionType,
			TriggerType,
			ToleranceRatio,
			HistoryStartTime,
			HistoryEndTime,
		} = filterObj.toJS();
		if( step === 0 ) {
			return (<CreateStep1
						onDeleteLegendItem={this._onDeleteLegendItem}
						diagnoseTags={diagnoseTags}
						onCheckDiagnose={this._onCheckDiagnose}
						StartTime={StartTime}
						onChangeStartTime={(val) => {
							let startTime = moment(val),
							endTime = moment(EndTime),
							setStartTime = () => {
								this._setFilterObjThenUpdataChart('StartTime', val);
							};
							if(endTime < startTime) {
								endTime = moment(startTime).add(1, 'days');
							} else if( moment(startTime).add(30, 'days') < endTime ) {
								endTime = moment(startTime).add(30, 'days');
							}
							if(endTime.format('YYYY-MM-DDTHH:mm:ss') !== EndTime) {
								this._setFilterObj( 'EndTime', endTime.format('YYYY-MM-DDTHH:mm:ss'), setStartTime );
							} else {
								setStartTime();
							}
						}}
						EndTime={EndTime}
						onChangeEndTime={(val) => {
							let startTime = moment(StartTime),
							endTime = moment(val),
							setEndTime = () => {
								this._setFilterObjThenUpdataChart('EndTime', val);
							};
							if(endTime < startTime) {
								startTime = moment(endTime).subtract(1, 'days');
							} else if( moment(endTime).subtract(30, 'days') > startTime ) {
								startTime = moment(endTime).subtract(30, 'days');
							}
							if(startTime.format('YYYY-MM-DDTHH:mm:ss') !== StartTime) {
								this._setFilterObj( 'StartTime', startTime.format('YYYY-MM-DDTHH:mm:ss'), setEndTime );
							} else {
								setEndTime();
							}
						}}
						Step={Step}
						onUpdateStep={(val) => {
							if( checkStep(diagnoseTags, val) ) {
								this._setFilterObjThenUpdataChart('Step', val);
							} else {
								this.setState({
									tmpFilterDiagnoseTags: diagnoseTags,
									tmpFilterStep: val
								});
							}
						}}
						chartData={chartData}
						chartDataLoading={chartDataLoading}
						Timeranges={Timeranges}
						onUpdateDateRange={(idx, type, startOrEnd, val) => {
							val = new Date().getFullYear() + SEPARTOR + val.join(SEPARTOR);
							let setVal = () => {
								this._setFilterObjThenUpdataChart(['Timeranges', idx, type], val);								
							}
							if( type === 'StartTime' && moment(val) > moment(Timeranges[idx].EndTime) ) {
								this._setFilterObj(['Timeranges', idx, 'EndTime'], val, setVal)
							} else if( type === 'EndTime' && moment(val) < moment(Timeranges[idx].StartTime) ) {
								this._setFilterObj(['Timeranges', idx, 'StartTime'], val, setVal)
							} else {
								setVal();
							}
						}}
						onAddDateRange={() => {
							Timeranges.push({
								StartTime: getFirstDateByThisYear(DATE_FORMAT),
								EndTime: getEndDateByThisYear(DATE_FORMAT)});
							this._setFilterObjThenUpdataChart('Timeranges', Timeranges);
						}}
						onDeleteDateRange={(idx) => {
							Timeranges.splice(idx, 1);
							this._setFilterObjThenUpdataChart('Timeranges', Timeranges);
						}}/>);
		} else if( step === 1 ) {
			return (<CreateStep2
						onDeleteLegendItem={this._onDeleteLegendItem}
						disabledHistory={diagnoseTags.filter(tag => tag.get('checked')).size !== 1}
						DiagnoseModel={DiagnoseModel}
						chartData={chartData}
						chartDataLoading={chartDataLoading}

						onUpdateFilterObj={paths => 
							(val, callback) => {
								let setVal = () => {
									this._setFilterObj(paths, val, callback);
								}
								if(paths === 'HistoryStartTime') {
									let startTime = moment(val),
									endTime = moment(HistoryEndTime);
									if(endTime < startTime) {
										endTime = moment(startTime).add(1, 'days');
									} else if( moment(startTime).add(90, 'days') < endTime ) {
										endTime = moment(startTime).add(90, 'days');
									}
									if(endTime.format('YYYY-MM-DDTHH:mm:ss') !== HistoryEndTime) {
										this._setFilterObj( 'HistoryEndTime', endTime.format('YYYY-MM-DDTHH:mm:ss'), setVal );
									} else {
										setVal();
									}
								} else if(paths === 'HistoryEndTime') {
									let startTime = moment(HistoryStartTime),
									endTime = moment(val);
									if(endTime < startTime) {
										startTime = moment(endTime).subtract(1, 'days');
									} else if( moment(endTime).subtract(90, 'days') > startTime ) {
										startTime = moment(endTime).subtract(90, 'days');
									}
									if(startTime.format('YYYY-MM-DDTHH:mm:ss') !== HistoryStartTime) {
										this._setFilterObj( 'HistoryStartTime', startTime.format('YYYY-MM-DDTHH:mm:ss'), setVal );
									} else {
										setVal();
									}
								} else {
									setVal();
								}
							}
						}
						disabledPreview={this._step2NeedRequire()}

						StartTime={StartTime}
						EndTime={EndTime}
						getChartData={this._getChartData}
						WorkTimes={WorkTimes}
						TriggerValue={TriggerValue}
						ConditionType={ConditionType}
						TriggerType={TriggerType}
						ToleranceRatio={ToleranceRatio}
						HistoryStartTime={HistoryStartTime}
						HistoryEndTime={HistoryEndTime}

						/>);
		} else if( step === 2 ) {
			return (<CreateStep3 diagnoseTags={diagnoseTags} onUpdateDiagnoseTags={(diagnoseTags) => {
				this.setState({diagnoseTags});
			}}/>);
		}
		return null;
	}
	_renderTipDialog() {
		let {tmpFilterDiagnoseTags, tmpFilterStep, filterObj} = this.state;
		if(tmpFilterDiagnoseTags) {
			return (<Dialog onRequestClose={() => {this.setState({tmpFilterDiagnoseTags: null, tmpFilterStep: null});}} open={true} modal={false} actions={
				getCanSelectTimeGranularity(tmpFilterDiagnoseTags).map(time => 
					<FlatButton key={time} label={'按' + getStepItems().find(item => item.step === time * 1).text}
						onClick={() => {
							this.setState({
								diagnoseTags: tmpFilterDiagnoseTags,
								filterObj: filterObj.set('Step', time * 1),
								tmpFilterDiagnoseTags: null,
								tmpFilterStep: null,
							}, this._getChartData);
						}}/>)
			}>
				{`所选数据点不支持按“${getStepItems().find(item => item.step === tmpFilterStep).text}”`}
			</Dialog>);
		}
		return null;
	}
	_getFooterButton() {
		let {step, diagnoseTags, filterObj} = this.state,
		checkedTags = diagnoseTags && diagnoseTags.filter(tag => tag.get('checked')),
		needAddNames = !checkedTags ||
						checkedTags.map(tag => tag.get('DiagnoseName')).toJS()
						.reduce((result, val) => result || isEmptyStr(val), false),
		buttons = [];
		switch (step) {
			case 0:
				buttons.push(<Right><NextButton disabled={!checkedTags || checkedTags.size === 0} onClick={this._setStep(1)}/></Right>);
				break;
			case 1:
				buttons.push(<Left><PrevButton onClick={this._setStep(0)}/></Left>);
				buttons.push(<Right><NextButton disabled={this._step2NeedRequire()} onClick={this._setStep(2)}/></Right>);
				break;
			case 2:
				buttons.push(<Left><PrevButton onClick={this._setStep(1)}/></Left>);
				buttons.push(
					<Right>
						<RaisedButton disabled={needAddNames} onClick={this._onSaveBack} label={'保存并返回诊断列表'}/>
						<RaisedButton disabled={needAddNames} onClick={this._onSaveRenew} label={'保存并继续添加'} style={{marginLeft: 10}} primary={true}/>
					</Right>
				);
				break;
		}
		return buttons;
	}
	render() {
		let {step} = this.state, 
		{EnergyLabel, DiagnoseItem, isBasic} = this.props;
		return (
			<div className='diagnose-overlay'>
				<header className='diagnose-overlay-header'>
					<div>
						<span>{'新建诊断'}</span>
						<span style={{marginLeft: 14}}>
							{[isBasic?I18N.Setting.Diagnose.Basic:I18N.Setting.Diagnose.Senior, DiagnoseItem.get('Name'), EnergyLabel.get('Name')].join(SEPARTOR)}
						</span>
					</div>
					<IconButton iconClassName='icon-close' onClick={this._onClose}/>
				</header>
				<nav className='diagnose-create-stepper'>
			        <Stepper activeStep={step}>
			          <Step>
			            <StepLabel style={{height: 50, color: '#1b1f2c', fontWeight: 'bold'}}>{'选择诊断数据点并配置诊断范围'}</StepLabel>
			          </Step>
			          <Step>
			            <StepLabel style={{height: 50, color: '#1b1f2c', fontWeight: 'bold'}}>{'编辑诊断条件'}</StepLabel>
			          </Step>
			          <Step>
			            <StepLabel style={{height: 50, color: '#1b1f2c', fontWeight: 'bold'}}>{'保存诊断'}</StepLabel>
			          </Step>
			        </Stepper>
		        </nav>
		        {this._renderContent()}
		        <nav className='diagnose-create-footer'>{this._getFooterButton()}</nav>
		        {this._renderTipDialog()}
			</div>
		);
	}
}
CreateDiagnose.propTypes = {
	isBasic: PropTypes.bool,
	EnergyLabel: PropTypes.object,
	DiagnoseItem: PropTypes.object,
	onClose: PropTypes.func,
	onSave: PropTypes.func,
}
export default CreateDiagnose;
