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
import SvgIcon from 'material-ui/SvgIcon';
import {Tabs, Tab} from 'material-ui/Tabs';
import moment from 'moment';
import Immutable from 'immutable';
import classnames from 'classnames';
import { partial, flowRight } from 'lodash-es';
import _ from 'lodash-es';

import TimeGranularity from 'constants/TimeGranularity.jsx';
import {DIAGNOSE_MODEL} from 'constants/actionType/Diagnose.jsx';

import ReduxDecorator from 'decorator/ReduxDecorator.jsx';

import {isEmptyStr, isNumeric, getDateTimeItemsByStepForVal, getDateTimeItemsByStep, pow10, getUomById} from 'util/Util.jsx';

import FlatButton from 'controls/FlatButton.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import ViewableDatePicker from 'controls/ViewableDatePicker.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import MonthDayItem from 'controls/MonthDayItem.jsx';
import Dialog from 'controls/NewDialog.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';

import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';

import DiagnoseChart from './DiagnoseChart.jsx';

let _firstUom = '';
let _previewed = false;

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
};
function filterSpecialStep(step){
  if(step===TimeGranularity.Min15 || step===TimeGranularity.Min30) return TimeGranularity.Minite
  if(step===TimeGranularity.Hour2 || step===TimeGranularity.Hour4 ||
     step===TimeGranularity.Hour6 || step===TimeGranularity.Hour8 || step===TimeGranularity.Hour12) return TimeGranularity.Hourly
     return step
}
function checkStep(tags, step) {
	return tags.filter(tag => TIME_GRANULARITY_MAP_VAL[step] < TIME_GRANULARITY_MAP_VAL[filterSpecialStep(tag.Step)] ).length === 0;
}
function getCanSelectTimeGranularity(tags) {
	let maxTime = Math.max(tags.map(tag => TIME_GRANULARITY_MAP_VAL[filterSpecialStep(tag.Step)]));
	return Object.keys(TIME_GRANULARITY_MAP_VAL)
          .filter( step => TIME_GRANULARITY_MAP_VAL[step] >= maxTime )
          .filter( step =>
          	step*1===TimeGranularity.Minite ||
          	step*1===TimeGranularity.Hourly ||
          	step*1===TimeGranularity.Daily ||
          	step*1===TimeGranularity.Monthly);
}
function getSupportStepItems(){
	return [{
		step: TimeGranularity.Minite,
		text: I18N.EM.Raw
	}, {
		step: TimeGranularity.Hourly,
		text: I18N.EM.Hour
	}, {
		step: TimeGranularity.Daily,
		text: I18N.EM.Day
	}, {
		step: TimeGranularity.Monthly,
		text: I18N.EM.Month
	}];
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
	},{
		step: TimeGranularity.Min15,
		text: I18N.Common.AggregationStep.Min15
	},{
		step: TimeGranularity.Min30,
		text: I18N.Common.AggregationStep.Min30
	},{
		step: TimeGranularity.Hour2,
		text: I18N.Common.AggregationStep.Hour2
	},{
		step: TimeGranularity.Hour4,
		text: I18N.Common.AggregationStep.Hour4
	},{
		step: TimeGranularity.Hour6,
		text: I18N.Common.AggregationStep.Hour6
	},{
		step: TimeGranularity.Hour8,
		text: I18N.Common.AggregationStep.Hour8
	},{
		step: TimeGranularity.Hour12,
		text: I18N.Common.AggregationStep.Hour12
	},{
		step: TimeGranularity.Weekly,
		text: I18N.Common.AggregationStep.Weekly
	},{
		step: TimeGranularity.Monthly,
		text: I18N.EM.Month
	},{
		step: TimeGranularity.Yearly,
		text: I18N.Common.AggregationStep.Yearly
	}];
}
function _getTimeRangeStep(step) {
	if( step ===  TimeGranularity.Monthly ) {
		return 100;
	}
	return 30;
}

function isTypeC(DiagnoseModel) {
	return DiagnoseModel === DIAGNOSE_MODEL.C;
}

function AddIcon(props) {
	let otherProps = {
		onClick: (e) => {
			if( !props.disabled && props.onClick && typeof props.onClick === 'function' ) {
				props.onClick(e);
			}
		}
	};
	if( !props.disabled ) {
		otherProps.className = 'icon-add';
		otherProps.href = 'javascript:void(0)';
	} else {
		otherProps.className = 'icon-add disabled';
	}
	return (<a {...props} {...otherProps}/>)
}

function step2NeedRequire(DiagnoseModel, TriggerType, TriggerValue, AssociateValue) {
	if( DiagnoseModel === DIAGNOSE_MODEL.A ) {
		return !(new RegExp(/^(\-?)\d{1,9}([.]\d{1,6})?$/).test(TriggerValue));
	} else if(DiagnoseModel === DIAGNOSE_MODEL.B) {
		if( TriggerType === TRIGGER_TYPE.FixedValue ) {
			return !(new RegExp(/^(\-?)\d{1,9}([.]\d{1,6})?$/).test(TriggerValue));
		}
		if( TriggerType === TRIGGER_TYPE.HistoryValue ) {
			return false;
		}
	} else if(DiagnoseModel === DIAGNOSE_MODEL.C) {
		return !(
			new RegExp(/^(\-?)\d{1,9}([.]\d{1,6})?$/).test(TriggerValue) &&
			new RegExp(/^(\-?)\d{1,9}([.]\d{1,6})?$/).test(AssociateValue)
		);
	}
}

export function stepLabelProps(stepValue, currentStep) {
	let props = {
		style: {
			height: 50,
			fontSize: 14,
			color: '#0f0f0f',
		},
	},
	iconColor = '#32ad3d';
	if( currentStep < stepValue ) {
		props.style.color = '#9fa0a4';
		iconColor = '#a3e7b0';
	}
	props.icon = (
		<SvgIcon color={iconColor} style={{
		      display: 'block',
		      fontSize: 24,
		      width: 24,
		      height: 24,
		      color: iconColor,
		  }}>
		<circle cx={12} cy={12} r={10}/>
		<text x={12} y={17} fill='#ffffff' fontSize='12px' textAnchor='middle'>{stepValue + 1}</text>
	</SvgIcon>);
	return props;
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
		StartTime: moment().subtract(6, 'days').format('YYYY-MM-DDT00:00:00'),
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
		ConditionType: CONDITION_TYPE.Larger,
		TriggerType: TRIGGER_TYPE.FixedValue,
		ToleranceRatio: null,
		HistoryStartTime: moment().subtract(31, 'days').format('YYYY-MM-DDT00:00:00'),
		HistoryEndTime: moment().subtract(1, 'days').format('YYYY-MM-DDT24:00:00'),
		AssociateTag: {
			ConditionType: CONDITION_TYPE.Larger,
		}
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
	return (<div style={{float: 'right', display: 'flex'}}>{props.children}</div>);
}
function PrevButton(props) {
	return (<NewFlatButton {...props} secondary={true} label={I18N.Paging.Button.PreStep}/>);
}
function NextButton(props) {
	return (<NewFlatButton {...props} label={I18N.Paging.Button.NextStep}  primary={true}/>);
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
			<hgroup className='' style={{color: '#202622', fontSize: '14px',}}>
			{title} <AddIcon
						disabled={disabled}
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

function ChartDateFilter({StartTime, EndTime, onChangeStartTime, onChangeEndTime, disabled, style, isPopover}) {
	let endTimeLabel = EndTime.split('T')[1].split(':').slice(0, 2).join(':'),
	endDateLabel = EndTime.split('T')[0];
	if(endTimeLabel === '00:00') {
		endTimeLabel = '24:00';
		endDateLabel = moment(EndTime).subtract(1, 'days').format('YYYY-MM-DD');
	}
	return (<section className='diagnose-create-chart-filter' style={style}>
		<ViewableDatePicker
			isPopover={isPopover}
			datePickerClassName={'diagnose-date-picker'}
			disabled={disabled}
    		width={100}
			value={StartTime.split('T')[0]}
			onChange={(val) => {
				onChangeStartTime(val + 'T' + StartTime.split('T')[1]);
			}}/>
		<ViewableDropDownMenu
			disabled={disabled}
			autoWidth={false}
			itemLabelStyle={{overflow: 'visible'}}
			style={{
				width: 50,
				height: 26,
				marginLeft: 10,
				marginTop: -6,
				paddingTop: 4,
				paddingLeft: 10,
				borderRadius: 2,
				border: 'solid 1px #e3e3e3'
			}}
			labelStyle={{lineHeight: '30px', textOverflow:'clip'}}
			iconStyle={{display: 'none'}}
			underlineStyle={{display: 'none'}}
			defaultValue={StartTime.split('T')[1].split(':').slice(0, 2).join(':')}
			dataItems={getDateTimeItemsByStep(60).slice(0, 24)}
			didChanged={(val) => {
				onChangeStartTime(moment(StartTime).format(DATE_FORMAT) + 'T' + val + ':00');
			}}/>
		<div style={{margin: '0 10px', alignSelf: 'center'}}>{I18N.Setting.DataAnalysis.To}</div>
		<ViewableDatePicker
			isPopover={isPopover}
			datePickerClassName={'diagnose-date-picker'}
			disabled={disabled}
    		width={100}
			value={endDateLabel}
			onChange={(val) => {
				let endTime = EndTime.split('T')[1];
				if(endTime === '00:00:00') {
					endTime = '24:00:00';
				}
				onChangeEndTime(val + 'T' + endTime);
			}}/>
		<ViewableDropDownMenu
			disabled={disabled}
			autoWidth={false}
			itemLabelStyle={{overflow: 'visible'}}
			style={{
				width: 50,
				height: 26,
				marginLeft: 10,
				marginTop: -6,
				paddingTop: 4,
				paddingLeft: 10,
				borderRadius: 2,
				border: 'solid 1px #e3e3e3'
			}}
			labelStyle={{lineHeight: '30px', textOverflow:'clip'}}
			iconStyle={{display: 'none'}}
			underlineStyle={{display: 'none'}}
			defaultValue={endTimeLabel}
			dataItems={getDateTimeItemsByStep(60).slice(1)}
			didChanged={(val) => {
				onChangeEndTime(moment(EndTime).format(DATE_FORMAT) + 'T' + val + ':00');
			}}/>
	</section>)
}

function TagContent({tags, onCheck, checkedTags, statusLabel}) {
	if( tags ) {
		return (
			<ul className='diagnose-create-tag-list-content'>
				{tags.map( (tag, i) =>
				<li key={Math.random()} className='diagnose-create-tag-list-item'  title={tag.get('Name')}>
					<Checkbox checked={checkedTags.map(checkedTag => checkedTag.Id).indexOf(tag.get('Id')) > -1}
						disabled={!checkedTags.map(checkedTag => checkedTag.Id).indexOf(tag.get('Id')) > -1 && checkedTags.length === 10}
						onCheck={(e, isInputChecked) => {
							onCheck(tag.get('Id'), isInputChecked);
					}}/>
					<div className='diagnose-create-checkbox-label'>
						<div className='diagnose-create-checkbox-label-name hiddenEllipsis'>
							{tag.get('Name')}
						</div>
						{tag.get('Status') !== 0 &&
						<div className='diagnose-create-checkbox-label-tip'>
							{statusLabel}
						</div>}
					</div>
				</li>
				).toJS()}
			</ul>
		);
	}
	return null;
}

function TagList(props) {
	let content = (<section className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></section>);
	if( props.tags ) {
		content = <TagContent {...props} statusLabel={I18N.Setting.Diagnose.Diagnoseing}/>
	}
	return (<section className='diagnose-create-tag-list'>
		<hgroup className='diagnose-create-tag-list-title diagnose-create-title'>{I18N.Setting.Diagnose.DiagnoseTags}</hgroup>
		{content}
	</section>)
}

function TagListTypeC({tags, onCheck, checkedTags, associateTag, onAssociateCheck, checkedAssociateTag}) {
	let content = (<section className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></section>),
	associateContent = (<section className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></section>);
	if( tags ) {
		content = (<TagContent tags={tags} onCheck={onCheck} checkedTags={checkedTags} statusLabel={I18N.Setting.Diagnose.Diagnoseing}/>);
	}
	if( associateTag ) {
		associateContent = (<TagContent tags={associateTag.get('Tags')} onCheck={onAssociateCheck} checkedTags={checkedAssociateTag} statusLabel={I18N.Setting.Diagnose.Associateing}/>);
	}
	return (
		<Tabs className='diagnose-create-tag-list'
			tabItemContainerStyle={{backgroundColor: '#ffffff', borderBottom: '1px solid #e6e6e6', flex: 'none'}}
			contentContainerStyle={{ flex: 1, display: 'flex', flexDirection: 'column',}}
			tabTemplateStyle={{flex: 'none', display: 'flex', height: '100%'}}
		>
			<Tab style={{color: '#1b1f2c', fontSize: '15px'}} label={I18N.Setting.Diagnose.DiagnoseTags}>
				{content}
			</Tab>
			<Tab style={{color: '#1b1f2c', fontSize: '15px'}} label={I18N.Setting.Diagnose.AssociateTags}>
				<div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
				{associateTag && <header
					style={{borderBottom: '1px solid #e6e6e6', margin: '0 10px', padding: '10px 0'}}
					><span className='icon-label' style={{marginRight: 5}}/>{associateTag.get('EnergyLabelName')}</header>}
				{associateContent}
				</div>
			</Tab>
		</Tabs>
	);
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
function ChartPreview({chartData, chartDataLoading, onUpdateStep, Step, onDeleteLegendItem, isTypeC, ...other}) {
	return (<section className='diagnose-create-chart-preview'>
		<hgroup className='diagnose-range-title diagnose-create-title'>{I18N.Setting.Diagnose.ChartPreview}</hgroup>
		<div className='diagnose-create-chart-action'>
			<ChartDateFilter
				disabled={!chartData}
				{...other}/>
			<div className='jazz-energy-step'>
				{getSupportStepItems().map((item => <StepItem {...item} disabled={!chartData} selected={item.step === Step} onStepChange={onUpdateStep}/>))}
			</div>
		</div>
		{chartDataLoading ? <div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div> :
		(chartData ?  <div className='diagnose-create-chart'><DiagnoseChart isTypeC={isTypeC} isEdit={true} data={chartData} onDeleteButtonClick={onDeleteLegendItem}/></div> :
		<div className='flex-center'>{I18N.Setting.Diagnose.SelectTagsFromLeft}</div>)}
	</section>)
}

function ChartPreviewStep2({chartData, chartDataLoading, getChartData, disabledPreview, onDeleteLegendItem, isTypeC, ...other}) {
	return (<section className='diagnose-create-chart-preview-step2'>
		<hgroup className='diagnose-create-title'>{I18N.Setting.Diagnose.ChartPreview}</hgroup>
		<div className='diagnose-create-chart-action'>
			<ChartDateFilter
				disabled={!chartData}
				{...other}/>
			<NewFlatButton secondary={true} label={I18N.Setting.Diagnose.PreviewButton} disabled={disabledPreview} onClick={getChartData} icon={<ActionVisibility/>}/>
		</div>
		{chartDataLoading ? <div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div> :
		(chartData ?  <div className='diagnose-create-chart'><DiagnoseChart isTypeC={isTypeC} isEdit={true} data={chartData} onDeleteButtonClick={onDeleteLegendItem}/></div> :
		<div className='flex-center'>{I18N.Setting.Diagnose.SelectTagsFromLeft}</div>)}
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
		<hgroup className='diagnose-range-title diagnose-create-title'>{I18N.Setting.Diagnose.DiagnoseRange}</hgroup>
		<div className='diagnose-range-content'>
			<ViewableDropDownMenu
				disabled={disabled}
				style={{width: 116}}
				title={I18N.EM.Report.Step}
				defaultValue={Step}
				didChanged={onUpdateStep}
				dataItems={getSupportStepItems().map(item => {
					return {
						payload: item.step,
						text: item.text,
					}
				})}
			/>
			<AdditiveComp
				className={'diagnose-range-time'}
				contentClassName={'diagnose-range-time-content'}
				title={I18N.Setting.Diagnose.TimeRange}
				limit={disabled ? 0 : 2}
				data={Timeranges}
				onAdd={onAddDateRange}
				onDelete={onDeleteDateRange}
				renderFunc={(data, idx) =>
					<div key={idx} style={{display: 'flex', alignItems: 'center'}}>
					<MonthDayItem
						type={0}
						disabled={disabled}
						isViewStatus={false}
						month={new Date(data.StartTime).getMonth() + 1}
						day={new Date(data.StartTime).getDate()}
						onMonthDayItemChange={(type, val) => {
							onUpdateDateRange(idx, 'StartTime', type, val);
						}}/>
					{I18N.Setting.DataAnalysis.To}
					<MonthDayItem
						type={1}
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
					autoWidth={false}
					iconStyle={{display: 'none'}}
					labelStyle={{textOverflow: 'clip'}}
					itemLabelStyle={{textOverflow: 'clip'}}
					style={{width: 50, marginLeft: 10, marginTop: -6}}
					defaultValue={data.StartTime}
					dataItems={getDateTimeItemsByStepForVal(60).slice(0, 24)}
					didChanged={(val) => {
						if(val > data.EndTime) {
							onChangeWorkTime(idx, 'EndTime', val);
						}
						onChangeWorkTime(idx, 'StartTime', val);
					}}/>
				{I18N.Setting.DataAnalysis.To}
				<ViewableDropDownMenu
					autoWidth={false}
					iconStyle={{display: 'none'}}
					labelStyle={{textOverflow: 'clip'}}
					itemLabelStyle={{textOverflow: 'clip'}}
					style={{width: 50, marginLeft: 10, marginTop: -6}}
					defaultValue={data.EndTime || 60 * 24}
					dataItems={getDateTimeItemsByStepForVal(60).slice(1)}
					didChanged={(val) => {
						if(val === 0) {
							val = 60 * 24;
						}
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
		<div className='diagnose-condition-subtitle'>{uom ? I18N.format(I18N.Setting.Diagnose.HolidayRuningTimesTrigger,uom) : I18N.Setting.Diagnose.HolidayRuningTimesTriggerWithoutData}</div>
		<ViewableTextField
			style={{fontSize: 14}}
			regex={/^(\-?)\d{1,9}([.]\d{1,6})?$/}
			errorMessage={I18N.Setting.Diagnose.FormatVaildTip}
			hintText={I18N.Setting.Diagnose.InputTriggerValue}
			defaultValue={TriggerValue}
			didChanged={onUpdateTriggerValue}/>
		<div style={{fontSize: 12, color: '#9c9c9c'}}>{I18N.Setting.Diagnose.TriggerValueTip}</div>
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
			<div className='diagnose-condition-subtitle'>{I18N.Setting.Diagnose.TriggerCondition}</div>
			<RadioButtonGroup
				className={'diagnose-condition-radio-group'}
				name="ConditionType"
				valueSelected={ConditionType}
				onChange={(evt, val) => {
					onUpdateConditionType(val);
			}}>
				<RadioButton
					value={CONDITION_TYPE.Larger}
					label={I18N.Setting.Diagnose.MoreThenTrigger}
				/>
				<RadioButton
					value={CONDITION_TYPE.Smaller}
					label={I18N.Setting.Diagnose.LessThenTrigger}
				/>
			</RadioButtonGroup>
		</div>
		<div className='diagnose-condition-model-b-item'>
			<div>
				<div className='diagnose-condition-subtitle'>{I18N.Setting.Diagnose.BaseValueProperty}</div>
				<div style={{fontSize: 10, color: '#9c9c9c', marginTop: 5}}>
					{TriggerType === TRIGGER_TYPE.HistoryValue
					 ? I18N.Setting.Diagnose.BaseValueByHistoryTip
					 : I18N.Setting.Diagnose.BaseValueByFixedTip}
				</div>
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
					label={I18N.Setting.Diagnose.FixedValue}
				/>
				<RadioButton
					disabled={disabledHistory}
					value={TRIGGER_TYPE.HistoryValue}
					label={I18N.Setting.Diagnose.HistoryValue}
				/>
			</RadioButtonGroup>
		</div>
		{ TriggerType === TRIGGER_TYPE.FixedValue &&
		<div style={{marginTop: 15}}>
			<div className='diagnose-condition-subtitle'>{uom ? I18N.format(I18N.Setting.Diagnose.BaseValueTitle,uom) : I18N.EM.Ratio.BaseValue}</div>
			<ViewableTextField
				style={{fontSize: 14}}
				regex={/^(\-?)\d{1,9}([.]\d{1,6})?$/}
				errorMessage={I18N.Setting.Diagnose.FormatVaildTip}
				hintText={I18N.Setting.Diagnose.InputBaseValue}
				defaultValue={TriggerValue}
				didChanged={onUpdateTriggerValue}/>
		</div>}
		{ TriggerType === TRIGGER_TYPE.HistoryValue &&
		<div style={{marginTop: 15}}>
			<div className='diagnose-condition-subtitle'>{I18N.Setting.Diagnose.BaseValueTimeRange}</div>
			<ChartDateFilter
				style={{
					flexWrap: 'wrap'
				}}
				isPopover={true}
				StartTime={HistoryStartTime}
				EndTime={HistoryEndTime}
				onChangeStartTime={onUpdateHistoryStartTime}
				onChangeEndTime={onUpdateHistoryEndTime}/>
		</div>}
		<div style={{marginTop: 15, marginBottom: 15}}>
			<div className='diagnose-condition-subtitle'>{I18N.Setting.Diagnose.ToleranceRatioTitle}</div>
			<ViewableTextField
				style={{fontSize: 14}}
				regex={/^(\-?)\d{1,9}([.]\d{1,6})?$/}
				errorMessage={I18N.Setting.Diagnose.FormatVaildTip}
				hintText={I18N.Setting.Diagnose.InputToleranceRatio}
				defaultValue={isNumeric(ToleranceRatio) ? pow10(ToleranceRatio, 2) : ToleranceRatio}
				didChanged={onUpdateToleranceRatio}/>
			<div style={{fontSize: 12, color: '#ff4b00'}}>{I18N.Setting.Diagnose.ToleranceRatioTip}</div>
		</div>
	</div>)
}

function ModelCCondition({
	AssociateType, AssociateValue, onUpdateAssoicateType, onUpdateAssoicateValue, lastuom,
	ConditionType, TriggerValue, onUpdateConditionType, onUpdateTriggerValue, uom,
}) {
	return (<div className='diagnose-condition-model-c-item'>
		<div>
			<div className='diagnose-condition-subtitle'>{I18N.Setting.Diagnose.AssociateCondition}</div>
			<RadioButtonGroup
				className={'diagnose-condition-radio-group'}
				name="TriggerType"
				valueSelected={AssociateType}
				onChange={(evt, val) => {
					onUpdateAssoicateType(val);
			}}>
				<RadioButton
					style={{width: 'auto'}}
					labelStyle={{width: 'auto'}}
					value={CONDITION_TYPE.Larger}
					label={I18N.Setting.Diagnose.MoreThenAssociate}
				/>
				<RadioButton
					style={{width: 'auto'}}
					labelStyle={{width: 'auto'}}
					value={CONDITION_TYPE.Smaller}
					label={I18N.Setting.Diagnose.LessThenAssociate}
				/>
			</RadioButtonGroup>
		</div>
		<div style={{marginTop: 15}}>
			<div className='diagnose-condition-subtitle'>{
				lastuom ? I18N.format(I18N.Setting.Diagnose.AssociateValueTitle, lastuom) : I18N.Setting.Diagnose.AssociateValue}</div>
			<ViewableTextField
				style={{fontSize: 14}}
				regex={/^(\-?)\d{1,9}([.]\d{1,6})?$/}
				errorMessage={I18N.Setting.Diagnose.FormatVaildTip}
				hintText={I18N.Setting.Diagnose.InputAssociateValue}
				defaultValue={AssociateValue}
				didChanged={onUpdateAssoicateValue}/>
		</div>
		<div style={{marginTop: 15}}>
			<div className='diagnose-condition-subtitle'>{I18N.Setting.Diagnose.TriggerCondition}</div>
			<RadioButtonGroup
				className={'diagnose-condition-radio-group'}
				name="TriggerType"
				valueSelected={ConditionType}
				onChange={(evt, val) => {
					onUpdateConditionType(val);
			}}>
				<RadioButton
					style={{width: 'auto'}}
					labelStyle={{width: 'auto'}}
					value={CONDITION_TYPE.Larger}
					label={I18N.Setting.Diagnose.MoreThenTrigger}
				/>
				<RadioButton
					style={{width: 'auto'}}
					labelStyle={{width: 'auto'}}
					value={CONDITION_TYPE.Smaller}
					label={I18N.Setting.Diagnose.LessThenTrigger}
				/>
			</RadioButtonGroup>
		</div>
		<div style={{marginTop: 15}}>
			<div className='diagnose-condition-subtitle'>{
				uom ? I18N.format(I18N.Setting.Diagnose.TriggerValueTitle, uom) : I18N.Setting.Diagnose.TriggerValue}</div>
			<ViewableTextField
				style={{fontSize: 14}}
				regex={/^(\-?)\d{1,9}([.]\d{1,6})?$/}
				errorMessage={I18N.Setting.Diagnose.FormatVaildTip}
				hintText={I18N.Setting.Diagnose.InputTriggerValue}
				defaultValue={TriggerValue}
				didChanged={onUpdateTriggerValue}/>
		</div>
	</div>);
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
		<hgroup className='diagnose-create-title'>{I18N.Setting.Diagnose.DiagnoseCondition}</hgroup>
		{!isTypeC(DiagnoseModel) && <div className='diagnose-condition-content'>
			<RuntimeComp
				workRuningTimes={workRuningTimes}
				title={I18N.Setting.Diagnose.WorkRuningTimes}
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
				title={I18N.Setting.Diagnose.HolidayRuningTimes}
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
		</div>}
		{isTypeC(DiagnoseModel) && <div className='diagnose-condition-content'>
			<ModelCCondition {...other}/>
		</div>}
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
			checkedTags,
			onCheckDiagnose,
			associateTag,
			checkedAssociateTag,
			onAssociateCheck,
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
			DiagnoseModel,
		} = this.props;
		return (
			<section className='diagnose-create-content'>
				<div className='diagnose-create-step'>
					{ isTypeC(DiagnoseModel) ?
					<TagListTypeC
						tags={diagnoseTags}
						checkedTags={checkedTags}
						onCheck={onCheckDiagnose}
						associateTag={associateTag}
						checkedAssociateTag={checkedAssociateTag}
						onAssociateCheck={onAssociateCheck}
					/>:
					<TagList tags={diagnoseTags} checkedTags={checkedTags} onCheck={onCheckDiagnose}/>
					}

					<ChartPreview
						isTypeC={isTypeC(DiagnoseModel)}
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
			disabledHistory,
			chartData,
			Step,
			AssociateTag,
			...other,
		} = this.props,
		disabledPreview = step2NeedRequire(DiagnoseModel, TriggerType, TriggerValue, AssociateTag && AssociateTag.TriggerValue);
		let _firstUom, _lasttUom;
		if(chartData) {
			_firstUom = getUomById(chartData.getIn(['EnergyViewData', 'TargetEnergyData', 0, 'Target', 'UomId'])).Code;

			if( isTypeC(DiagnoseModel) ) {
				_lasttUom = getUomById(
					chartData.getIn([
						'EnergyViewData',
						'TargetEnergyData',
						chartData.getIn([
							'EnergyViewData',
							'TargetEnergyData',
						]).size - 1,
						'Target',
						'UomId']
					)
				).Code;
			}
		}
		return (
			<section className='diagnose-create-content diagnose-create-step'>
				<ChartPreviewStep2 {...other}
					DiagnoseModel={DiagnoseModel}
					isTypeC={isTypeC(DiagnoseModel)}
					chartData={chartData}
					disabledPreview={disabledPreview}
					StartTime={StartTime}
					onChangeStartTime={(val) => {
						let startTime = moment(val),
						endTime = moment(EndTime),
						setStartTime = () => {
							onUpdateFilterObj('StartTime')(val);
						};
						if(endTime < moment(startTime).add(1, 'hours')) {
							endTime = moment(startTime).add(1, 'hours');
						} else if( moment(startTime).add(_getTimeRangeStep(Step), 'days') < endTime ) {
							endTime = moment(startTime).add(_getTimeRangeStep(Step), 'days');
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
						if(moment(endTime).subtract(1, 'hours') < startTime) {
							startTime = moment(endTime).subtract(1, 'hours');
						} else if( moment(endTime).subtract(_getTimeRangeStep(Step), 'days') > startTime ) {
							startTime = moment(endTime).subtract(_getTimeRangeStep(Step), 'days');
						}
						if(startTime.format('YYYY-MM-DDTHH:mm:ss') !== StartTime) {
							onUpdateFilterObj( 'StartTime')(startTime.format('YYYY-MM-DDTHH:mm:ss'), setEndTime );
						} else {
							setEndTime();
						}
					}}
				/>
				<DiagnoseCondition
					Step={Step}
					uom={_firstUom}
					lastuom={_lasttUom}
					disabledHistory={disabledHistory || Step === TimeGranularity.Monthly}
					DiagnoseModel={DiagnoseModel}
					WorkTimes={WorkTimes}
					onChangeWorkTime={onUpdateFilterObj('WorkTimes')}
					TriggerValue={TriggerValue}
					onUpdateTriggerValue={onUpdateFilterObj('TriggerValue')}

					ConditionType={ConditionType}
					onUpdateConditionType={onUpdateFilterObj('ConditionType')}

					AssociateType={AssociateTag && AssociateTag.ConditionType}
					AssociateValue={AssociateTag && AssociateTag.TriggerValue}
					onUpdateAssoicateType={(val) => {
						onUpdateFilterObj('AssociateTag')({...AssociateTag, ...{
							ConditionType: val
						}});
					}}
					onUpdateAssoicateValue={(val) => {
						onUpdateFilterObj('AssociateTag')({...AssociateTag, ...{
							TriggerValue: val
						}});
					}}

					TriggerType={TriggerType}
					onUpdateTriggerType={(type) => {
						if( type === TRIGGER_TYPE.HistoryValue ) {
							onUpdateFilterObj('TriggerValue')(null, () => {
								onUpdateFilterObj('TriggerType')(type);
							});
						} else {
							onUpdateFilterObj('TriggerType')(type);
						}
					}}

					ToleranceRatio={ToleranceRatio}
					onUpdateToleranceRatio={(val) => {
						if(isNumeric(val)) {
						    val = pow10(val, -2);
						}
						onUpdateFilterObj('ToleranceRatio')(val);
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
	checkedTags,
	onUpdateDiagnoseTags,
}) {
	return (
		<section className='diagnose-create-content diagnose-create-names'>
			<hgroup className='diagnose-create-title'>{I18N.Setting.Diagnose.DiagnoseName}</hgroup>
			<div style={{paddingLeft: 15, paddingBottom: 25}}>
				{checkedTags && checkedTags.map((tag, idx) =>
				<div style={{paddingTop: 25}}>
					<div className={'diagnose-condition-subtitle'}>{I18N.Setting.Diagnose.DiagnoseName}</div>
					<ViewableTextField
					hintText={I18N.Setting.Diagnose.InputDiagnoseName}
					defaultValue={tag.DiagnoseName}
					didChanged={(val) => {
						checkedTags[idx].DiagnoseName = val;
						onUpdateDiagnoseTags(checkedTags);
					}}/>
				</div>
				)}
			</div>
		</section>
	);
}

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
		_previewed = false;
		this._setFilterObj = this._setFilterObj.bind(this);
		this._onChange = this._onChange.bind(this);
		this._onSaveBack = this._onSaveBack.bind(this);
		this._onSaveRenew = this._onSaveRenew.bind(this);
		this._onCheckDiagnose = this._onCheckDiagnose.bind(this);
		this._onAssociateCheck = this._onAssociateCheck.bind(this);
		this._getChartData = this._getChartData.bind(this);
		this._onCreated = this._onCreated.bind(this);
		this._onGetAssociateTag = this._onGetAssociateTag.bind(this);
		this._onDeleteLegendItem = this._onDeleteLegendItem.bind(this);
		this._onClose = this._onClose.bind(this);

		this.state = {
			step: 0,
			diagnoseTags: null,
			associateTag: null,
			chartData: null,
			filterObj: getDefaultFilter(),
			checkedTags: [],
			checkedAssociateTag: [],
		};

		this._getTagList(props, ctx);
		if( isTypeC(props.EnergyLabel.get('DiagnoseModel')) ) {
			this._getAssociateTagList(props, ctx);
		}

		DiagnoseStore.addCreatedDiagnoseListener(this._onCreated);
		DiagnoseStore.addAssociateTagListener(this._onGetAssociateTag);

	}
	componentWillUnmount(){
		DiagnoseStore.removeCreatedDiagnoseListener(this._onCreated);
		DiagnoseStore.removeAssociateTagListener(this._onGetAssociateTag);
	}
	_getTagList(props, ctx) {
		DiagnoseAction.getDiagnoseTag(
			ctx.hierarchyId,
			props.EnergyLabel.get('Id'),
			props.DiagnoseItem.get('Id'),
			1
		);
	}
	_getAssociateTagList(props, ctx) {
		DiagnoseAction.getDiagnoseAssociateTag(
			ctx.hierarchyId,
			props.EnergyLabel.get('Id'),
			props.DiagnoseItem.get('Id'),
		);
	}
	_getChartData() {
		let {step, filterObj, checkedTags, checkedAssociateTag} = this.state;
		if( isTypeC(this.props.EnergyLabel.get('DiagnoseModel')) && (!checkedAssociateTag || checkedAssociateTag.length === 0) ) {
			this.setState({
				chartData: null
			});
			return null;
		}
		if(!_previewed && checkedTags && checkedTags.length > 0 ) {
			DiagnoseAction.getChartDataStep1({
				tagIds: checkedTags.map(tag => tag.Id).concat(checkedAssociateTag.map(tag => tag.Id)),
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
		} else if( _previewed ) {
			DiagnoseAction.getChartData({
			...updateUtcFormatFilter(filterObj,
				['EndTime', 'StartTime', 'HistoryEndTime', 'HistoryStartTime']
			).toJS(),
			...{
				HierarchyId: this.context.hierarchyId,
				DiagnoseItemId: this.props.DiagnoseItem.get('Id'),
				EnergyLabelId: this.props.EnergyLabel.get('Id'),
				DiagnoseModel: this.props.EnergyLabel.get('DiagnoseModel'),
				TagIds: checkedTags.map(tag => tag.Id),
			}}, this.state.chartData);
		}
		this.setState({
			chartData: null
		});
	}
	_setStep(step) {
		return () => {
			this.setState({step}, () => {
				if(this.state.step === 0){
					_previewed = false;
					this._getChartData();
				}
			});
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
		let {filterObj, checkedTags} = this.state;
		DiagnoseAction.createDiagnose({
			...updateUtcFormatFilter(filterObj,
				['EndTime', 'StartTime', 'HistoryEndTime', 'HistoryStartTime']
			).toJS(),
			...{
				HierarchyId: this.context.hierarchyId,
				DiagnoseItemId: this.props.DiagnoseItem.get('Id'),
				EnergyLabelId: this.props.EnergyLabel.get('Id'),
				DiagnoseModel: this.props.EnergyLabel.get('DiagnoseModel'),
				TagIds: checkedTags.map( tag => tag.Id ),
				Names: checkedTags.map( tag => tag.DiagnoseName ),
			}
		}, isClose);
	}
	_onCheckDiagnose(id, val) {
		let newCheckedTags = [...this.state.checkedTags],
		currentTags = this.state.diagnoseTags.find(tag => tag.get('Id') === id);
		if(val) {
			newCheckedTags.push({
				Id: currentTags.get('Id'),
				DiagnoseName: currentTags.get('DiagnoseName'),
				Step: currentTags.get('Step'),
			});
		} else {
			newCheckedTags.splice(newCheckedTags.map(tag => tag.Id).indexOf(id), 1);
		}
		// let newDiagnoseTags = this.state.diagnoseTags.setIn([idx, 'checked'], val);
		if( checkStep( newCheckedTags, this.state.filterObj.get('Step') ) ) {
			if( newCheckedTags.length > 1 && this.state.filterObj.get('TriggerType') === TRIGGER_TYPE.HistoryValue) {
				this.setState({
					filterObj: this.state.filterObj
								.set( 'TriggerType', TRIGGER_TYPE.FixedValue )
								.set( 'HistoryStartTime', moment().subtract(31, 'days').format('YYYY-MM-DDT00:00:00') )
								.set( 'HistoryEndTime', moment().subtract(1, 'days').format('YYYY-MM-DDT24:00:00') )
				});
			}
			this.setState({
				checkedTags: newCheckedTags
			}, this._getChartData);

		} else {
			this.setState({
				tmpFilterDiagnoseTags: newCheckedTags,
				tmpFilterStep: this.state.filterObj.get('Step')
			});
		}
	}
	_onAssociateCheck(id, val) {
		let newCheckedTags = [...this.state.checkedAssociateTag],
		currentTags = this.state.associateTag.get('Tags').find(tag => tag.get('Id') === id);
		if( val ) {
			newCheckedTags = [{
				Id: currentTags.get('Id'),
				DiagnoseName: currentTags.get('DiagnoseName'),
				Step: currentTags.get('Step'),
			}]
		} else {
			newCheckedTags.splice(newCheckedTags.map(tag => tag.Id).indexOf(id), 1);
		}

		if( checkStep( newCheckedTags, this.state.filterObj.get('Step') ) ) {
			this.setState({
				filterObj: this.state.filterObj.setIn(['AssociateTag', 'TagId'], id),
				checkedAssociateTag: newCheckedTags
			}, this._getChartData);

		} else {
			this.setState({
				tmpFilterDiagnoseTags: newCheckedTags,
				tmpFilterStep: this.state.filterObj.get('Step')
			});
		}

	}
	_onDeleteLegendItem(obj) {
		this._onCheckDiagnose(obj.uid, false);
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
			checkedTags: [],
			checkedAssociateTag: [],
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
	_onGetAssociateTag() {
		this.setState({
			associateTag: DiagnoseStore.getTagsAssociateList()
		});
	}
	_renderContent() {
		let DiagnoseModel = this.props.EnergyLabel.get('DiagnoseModel'),
		{step, diagnoseTags, checkedTags, associateTag, checkedAssociateTag, chartData, chartDataLoading, filterObj} = this.state,
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
			AssociateTag
		} = filterObj.toJS();
		if( step === 0 ) {
			return (<CreateStep1
						onDeleteLegendItem={this._onDeleteLegendItem}
						diagnoseTags={diagnoseTags}
						checkedTags={checkedTags}
						onCheckDiagnose={this._onCheckDiagnose}
						associateTag={associateTag}
						checkedAssociateTag={checkedAssociateTag}
						onAssociateCheck={this._onAssociateCheck}
						DiagnoseModel={DiagnoseModel}
						StartTime={StartTime}
						onChangeStartTime={(val) => {
							let startTime = moment(val),
							endTime = moment(EndTime),
							setStartTime = () => {
								this._setFilterObjThenUpdataChart('StartTime', val);
							};
							if(endTime < moment(startTime).add(1, 'hours')) {
								endTime = moment(startTime).add(1, 'hours');
							} else if( moment(startTime).add(_getTimeRangeStep(Step), 'days') < endTime ) {
								endTime = moment(startTime).add(_getTimeRangeStep(Step), 'days');
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
							if(moment(endTime).subtract(1, 'hours') < startTime) {
								startTime = moment(endTime).subtract(1, 'hours');
							} else if( moment(endTime).subtract(_getTimeRangeStep(Step), 'days') > startTime ) {
								startTime = moment(endTime).subtract(_getTimeRangeStep(Step), 'days');
							}
							if(startTime.format('YYYY-MM-DDTHH:mm:ss') !== StartTime) {
								this._setFilterObj( 'StartTime', startTime.format('YYYY-MM-DDTHH:mm:ss'), setEndTime );
							} else {
								setEndTime();
							}
						}}
						Step={Step}
						onUpdateStep={(val) => {
							if( checkStep(checkedTags, val) ) {
								let startTime = moment(StartTime),
								endTime = moment(EndTime),
								afterDays = moment(startTime).add(_getTimeRangeStep(val), 'days');
								if( afterDays < endTime ) {
									this._setFilterObj( 'EndTime', afterDays.format('YYYY-MM-DDTHH:mm:ss'), () => {
										this._setFilterObjThenUpdataChart('Step', val);
									} );
								} else {
									this._setFilterObjThenUpdataChart('Step', val);
								}

							} else {
								this.setState({
									tmpFilterDiagnoseTags: checkedTags,
									tmpFilterStep: val
								});
							}
						}}
						chartData={chartData}
						chartDataLoading={chartDataLoading}
						Timeranges={Timeranges}
						onUpdateDateRange={(idx, type, startOrEnd, val) => {
							val = moment().month(val[0] - 1).date(val[1]).format('YYYY-MM-DD');
							let setVal = () => {
								this._setFilterObj(['Timeranges', idx, type], val);
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
							this._setFilterObj('Timeranges', Timeranges);
						}}
						onDeleteDateRange={(idx) => {
							Timeranges.splice(idx, 1);
							this._setFilterObj('Timeranges', Timeranges);
						}}/>);
		} else if( step === 1 ) {
			return (<CreateStep2
						onDeleteLegendItem={this._onDeleteLegendItem}
						disabledHistory={checkedTags.length !== 1}
						DiagnoseModel={DiagnoseModel}
						chartData={chartData}
						chartDataLoading={chartDataLoading}
						Step={Step}
						onUpdateFilterObj={paths =>
							(val, callback) => {
								let setVal = () => {
									this._setFilterObj(paths, val, callback);
								}
								if(paths === 'HistoryStartTime') {
									let startTime = moment(val),
									endTime = moment(HistoryEndTime);
									if(endTime < moment(startTime).add(1, 'days')) {
										endTime = moment(startTime).add(1, 'days');
									} else if( moment(startTime).add(90, 'days') < endTime ) {
										endTime = moment(startTime).add(90, 'days');
									}
									if(endTime.valueOf() !== moment(HistoryEndTime).valueOf()) {
										this._setFilterObj( 'HistoryEndTime', endTime.format('YYYY-MM-DDTHH:mm:ss'), setVal );
									} else {
										setVal();
									}
								} else if(paths === 'HistoryEndTime') {
									let startTime = moment(HistoryStartTime),
									endTime = moment(val);
									if(moment(endTime).subtract(1, 'days') < startTime) {
										startTime = moment(endTime).subtract(1, 'days');
									} else if( moment(endTime).subtract(90, 'days') > startTime ) {
										startTime = moment(endTime).subtract(90, 'days');
									}
									if(startTime.valueOf() !== moment(HistoryStartTime).valueOf()) {
										this._setFilterObj( 'HistoryStartTime', startTime.format('YYYY-MM-DDTHH:mm:ss'), setVal );
									} else {
										setVal();
									}
								} else {
									setVal();
								}
							}
						}

						StartTime={StartTime}
						EndTime={EndTime}
						getChartData={() => {
							_previewed = true;
							this._getChartData();
						}}
						WorkTimes={WorkTimes}
						TriggerValue={TriggerValue}
						ConditionType={ConditionType}
						TriggerType={TriggerType}
						ToleranceRatio={ToleranceRatio}
						HistoryStartTime={HistoryStartTime}
						HistoryEndTime={HistoryEndTime}
						AssociateTag={AssociateTag}
						/>);
		} else if( step === 2 ) {
			return (<CreateStep3 checkedTags={checkedTags} onUpdateDiagnoseTags={(checkedTags) => {
				this.setState({checkedTags});
			}}/>);
		}
		return null;
	}
	_renderTipDialog() {
		let {tmpFilterDiagnoseTags, tmpFilterStep, filterObj} = this.state;
		if(tmpFilterDiagnoseTags) {
			return (<Dialog onRequestClose={() => {this.setState({tmpFilterDiagnoseTags: null, tmpFilterStep: null});}} open={true} modal={false} actions={
				getCanSelectTimeGranularity(tmpFilterDiagnoseTags).map(time =>
					<FlatButton key={time} label={I18N.Setting.Diagnose.By + _.find(getStepItems(),item => item.step === time * 1).text}
						onClick={() => {
							this.setState({
								checkedTags: tmpFilterDiagnoseTags,
								filterObj: filterObj.set('Step', time * 1),
								tmpFilterDiagnoseTags: null,
								tmpFilterStep: null,
							}, this._getChartData);
						}}/>)
			}>
				{I18N.format(I18N.Setting.Diagnose.SelectTagsUnsupportSteps,_.find(getStepItems(),item => item.step === tmpFilterStep).text)}
			</Dialog>);
		}
		return null;
	}
	_getFooterButton() {
		let {step, filterObj, checkedTags, checkedAssociateTag} = this.state,
		needAddNames = !checkedTags ||
						checkedTags.map(tag => tag.DiagnoseName)
						.reduce((result, val) => result || isEmptyStr(val), false),
		buttons = [],
		disabledNext = step2NeedRequire(
			this.props.EnergyLabel.get('DiagnoseModel'),
			filterObj.get('TriggerType'),
			filterObj.get('TriggerValue'),
			filterObj.getIn(['AssociateTag', 'TriggerValue'])
		);
		switch (step) {
			case 0:
				let isC = isTypeC(this.props.EnergyLabel.get('DiagnoseModel')),
				valid = checkedTags && checkedTags.length > 0 && (isC ? checkedAssociateTag && checkedAssociateTag.length > 0 : true);

				buttons.push(<Right>
					{!valid &&
					<div style={{
						paddingRight: 20,
						color: '#adafae',
						margin: 'auto'}}>
						<FontIcon className='icon-information'
							style={{fontSize: 12, color: '#adafae', }}/>
						{isC ? I18N.Setting.Diagnose.SelectDiagnoseAndAssociateTags : I18N.Setting.Diagnose.SelectDiagnoseTags}
					</div>}
					<NextButton disabled={!valid} onClick={this._setStep(1)}/></Right>);
				break;
			case 1:
				buttons.push(<Left><PrevButton onClick={this._setStep(0)}/></Left>);
				buttons.push(<Right>
					{disabledNext &&
					<div style={{
						paddingRight: 20,
						color: '#adafae',
						margin: 'auto'}}>
						<FontIcon className='icon-information'
							style={{fontSize: 12, color: '#adafae', }}/>
						{I18N.Setting.Diagnose.InputDiagnoseCondition}
					</div>}
					<NextButton disabled={disabledNext} onClick={this._setStep(2)}/></Right>);
				break;
			case 2:
				buttons.push(<Left><PrevButton onClick={this._setStep(1)}/></Left>);
				buttons.push(
					<Right>
						<NewFlatButton secondary={true} disabled={needAddNames} onClick={this._onSaveBack} label={I18N.Setting.Diagnose.SaveThenReturn}/>
						<NewFlatButton primary={true} disabled={needAddNames} onClick={this._onSaveRenew} label={I18N.Setting.Diagnose.SaveThenRenew} style={{marginLeft: 10}} primary={true}/>
					</Right>
				);
				break;
		}
		return buttons;
	}
	render() {
		let {step} = this.state,
		{EnergyLabel, DiagnoseItem, isBasic} = this.props;
		if(!DiagnoseItem) {
			return (<div className='diagnose-overlay'/>)
		}
		return (
			<div className='diagnose-overlay'>
				<header className='diagnose-overlay-header'>
					<div>
						<span>{I18N.Setting.Diagnose.CreateDiagnose}</span>
						<span style={{marginLeft: 14}}>
							{[isBasic?I18N.Setting.Diagnose.Basic:I18N.Setting.Diagnose.Senior, DiagnoseItem.get('Name'), EnergyLabel.get('Name')].join(SEPARTOR)}
						</span>
					</div>
					<IconButton iconClassName='icon-close' onClick={this._onClose}/>
				</header>
				<nav className='diagnose-create-stepper'>
			        <Stepper activeStep={step} style={{width: '80%'}}>
			          <Step>
			            <StepLabel {...stepLabelProps(0, step)}>{I18N.Setting.Diagnose.SaveDiagnoseStep0}</StepLabel>
			          </Step>
			          <Step>
			            <StepLabel {...stepLabelProps(1, step)}>{I18N.Setting.Diagnose.SaveDiagnoseStep1}</StepLabel>
			          </Step>
			          <Step>
			            <StepLabel {...stepLabelProps(2, step)}>{I18N.Setting.Diagnose.SaveDiagnoseStep2}</StepLabel>
			          </Step>
			        </Stepper>
		        </nav>
		        {this._renderContent()}
		        <nav className='diagnose-create-footer'>{this._getFooterButton()}<br/></nav>
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
