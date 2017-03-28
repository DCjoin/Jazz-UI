import React, { Component } from 'react';
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
import moment from 'moment';
import Immutable from 'immutable';
import classnames from 'classnames';

import TimeGranularity from 'constants/TimeGranularity.jsx';

import ReduxDecorator from '../../decorator/ReduxDecorator.jsx';

import {getDateTimeItemsByStep} from 'util/Util.jsx';

import LinkButton from 'controls/LinkButton.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import ViewableDatePicker from 'controls/ViewableDatePicker.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import MonthDayItem from 'controls/MonthDayItem.jsx';

import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import DiagnoseAction from 'actions/diagnose/DiagnoseAction.jsx';

import DiagnoseChart from './DiagnoseChart.jsx';

const SEPARTOR = '-';
const DATA_FORMAT = 'YYYY-MM-DD';
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
		StartTime: '2017-02-01T00:00:00',
		EndTime: '2017-02-07T24:00:00',
		Step: TimeGranularity.Minite,
		Timeranges: [
			{
				StartTime: getFirstDateByThisYear(DATA_FORMAT),
				EndTime: getEndDateByThisYear(DATA_FORMAT)
			}
		]
	});
}

function formatDataRangeLabel(date) {
	return moment(date).format('MM-DD');
}

function getFirstDateByThisYear(formatStr) {
	return new Date(moment().startOf('year').format(formatStr))
}
function getEndDateByThisYear(formatStr) {
	return new Date(moment().endOf('year').format(formatStr))
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
		<div className={className} style={{marginLeft: 10, marginTop: -14}}>
			<hgroup className='' style={{color: '#ABAFAE', marginBottom: -15}}>
			{title} <IconButton disabled={disabled}  iconClassName='icon-add' iconStyle={{fontSize: 14}} onClick={onAdd}/>
			</hgroup>
			<div className={contentClassName}>{data.map( (item, idx) => 
				<div style={{display: 'flex'}}>
					{renderFunc(item, idx)}
					{data && data.length > 1 && 
					(<IconButton iconClassName='icon-close' iconStyle={{fontSize: 14}} onClick={() => {
						onDelete(idx);
					}}/>)}
				</div>)}
			</div>
		</div>
	)
}

function ChartDateFilter({StartTime, EndTime, onChangeStartTime, onChangeEndTime, disabled}) {
	return (<section className='diagnose-create-chart-filter'>
		<ViewableDatePicker
			disabled={disabled}
    		width={100}
			value={moment(StartTime).format(DATA_FORMAT)}
			onChange={(val) => {
				onChangeStartTime(val + 'T' + StartTime.split('T')[1]);
			}}/>
		<ViewableDropDownMenu 
			disabled={disabled}
			style={{width: 100, marginLeft: 10, marginTop: -6}}
			defaultValue={StartTime.split('T')[1].split(':').slice(0, 2).join(':')} 
			dataItems={getDateTimeItemsByStep(60)}
			didChanged={(val) => {
				onChangeStartTime(moment(StartTime).format(DATA_FORMAT) + 'T' + val + ':00');
			}}/>
		<div style={{margin: '0 10px', alignSelf: 'center'}}>{'至'}</div>
		<ViewableDatePicker
			disabled={disabled}
    		width={100}
			value={moment(EndTime).format(DATA_FORMAT)}
			onChange={(val) => {
				onChangeEndTime(val + 'T' + EndTime.split('T')[1]);
			}}/>
		<ViewableDropDownMenu 
			disabled={disabled}
			style={{width: 100, marginLeft: 10, marginTop: -6}}
			defaultValue={EndTime.split('T')[1].split(':').slice(0, 2).join(':')} 
			dataItems={getDateTimeItemsByStep(60)}
			didChanged={(val) => {
				onChangeEndTime(moment(EndTime).format(DATA_FORMAT) + 'T' + val + ':00');
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
					<Checkbox checked={tag.get('checked')} onCheck={(e, isInputChecked) => {
						onCheck(i, isInputChecked);
					}}/>
					<div className='diagnose-create-checkbox-label'>
						<div className='diagnose-create-checkbox-label-name hiddenEllipsis'>
							{tag.get('Name')}
						</div>
						{tag.get('diagonseing') && 
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
		<hgroup className='diagnose-create-tag-list-title'>{'诊断数据点'}</hgroup>
		{content}
	</section>)
}

/**
chartData: API返回图表数据
chartDataLoading: 图表数据请求中
Step: 步长(TimeGranularity)
onUpdateStep: 更新步长
StartTime: 开始时间(YYYY-MM-DDThh:mm:ss)
EndTime: 结束时间(YYYY-MM-DDThh:mm:ss)
onChangeStartTime: 修改开始时间 :: String(YYYY-MM-DDThh:mm:ss) -> ?
onChangeEndTime: 修改结束时间 :: String(YYYY-MM-DDThh:mm:ss) -> ?
**/
function ChartPreview({chartData, chartDataLoading, onUpdateStep, Step, ...other}) {
	return (<section className='diagnose-create-chart-preview'>
		<hgroup className='diagnose-range-title'>{'图表预览'}</hgroup>
		<div className='diagnose-create-chart-action'>
			<ChartDateFilter 
				disabled={!chartData}
				{...other}/>
			<div className='jazz-energy-step'>
				{getStepItems().map((item => <StepItem {...item} disabled={!chartData} selected={item.step === Step} onStepChange={onUpdateStep}/>))}
			</div>
		</div>
		{chartDataLoading ? <div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div> :
		(chartData ?  <div style={{margin: 20, marginTop: 0}}><DiagnoseChart data={chartData}/></div> :
		<div className='flex-center'>{'在左侧选择数据点'}</div>)}
	</section>)
}

/**
Step: 步长(TimeGranularity)
onUpdateStep: 更新步长
Timeranges: 诊断时间范围[{StartTime: YYYY-MM-DD, EndTime: YYYY-MM-DD}]
onAddDateRange: 添加诊断时间范围
onDeleteDateRange: 删除诊断时间范围 :: Number(idx) ->
onUpdateDateRange: 修改诊断时间范围 :: idx, type, first/end, String(YYYY-MM-DDThh:mm:ss) -> ?
**/
export function DiagnoseRange({
	Step,
	onUpdateStep,
	Timeranges,
	onAddDateRange, 
	onDeleteDateRange, 
	onUpdateDateRange
}) {
	return (<section className='diagnose-range'>
		<hgroup className='diagnose-range-title'>{'诊断范围'}</hgroup>
		<div className='diagnose-range-content'>
			<ViewableDropDownMenu
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
				title={'时间范围'} 
				limit={2}
				data={Timeranges}
				onAdd={onAddDateRange}
				onDelete={onDeleteDateRange}
				renderFunc={(data, idx) => 
					<div key={idx} style={{display: 'flex', alignItems: 'center'}}>
					<MonthDayItem 
						isViewStatus={false}
						month={data.StartTime.getMonth() + 1}
						day={data.StartTime.getDate()}
						onMonthDayItemChange={(type, val) => {
							onUpdateDateRange(idx, 'StartTime', type, val);
						}}/>
					至
					<MonthDayItem
						isViewStatus={false}
						month={data.EndTime.getMonth() + 1}
						day={data.EndTime.getDate()}
						onMonthDayItemChange={(type, val) => {
							onUpdateDateRange(idx, 'EndTime', type, val);
						}}/>
					</div>
				}/>
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
StartTime: 开始时间(YYYY-MM-DDThh:mm:ss)
EndTime: 结束时间(YYYY-MM-DDThh:mm:ss)
onChangeStartTime: 修改开始时间 :: String(YYYY-MM-DDThh:mm:ss) -> ?
onChangeEndTime: 修改结束时间 :: String(YYYY-MM-DDThh:mm:ss) -> ?

Timeranges: 诊断时间范围[{StartTime: YYYY-MM-DD, EndTime: YYYY-MM-DD}]
onAddDateRange: 添加诊断时间范围
onDeleteDateRange: 删除诊断时间范围 :: Number(idx) ->
onUpdateDateRange: 修改诊断时间范围 :: idx, type, first/end, String(YYYY-MM-DDThh:mm:ss) -> ?
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
		} = this.props;
		return (
			<section className='diagnose-create-content'>
				<div style={{display: 'flex'}}>
					<TagList tags={diagnoseTags} onCheck={onCheckDiagnose}/>
					<ChartPreview 
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

class CreateStep2 extends Component {
	render() {
		return (
			<section>
				step2
			</section>
		);
	}
}

class CreateStep3 extends Component {
	render() {
		return (
			<section>
				step3
			</section>
		);
	}
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

	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
		this._onSaveBack = this._onSaveBack.bind(this);
		this._onSaveRenew = this._onSaveRenew.bind(this);
		this._onCheckDiagnose = this._onCheckDiagnose.bind(this);

		this.state = {
			step: 0,
			diagnoseTags: null,
			cahrtData: null,
			filterObj: getDefaultFilter()
		};

		DiagnoseAction.getTagsList();
	}
	_getChartData() {
		let {step, filterObj} = this.state;
		if( step === 0 ) {
			DiagnoseAction.getChartData(filterObj);
		} else if( step === 1 ) {
			// DiagnoseAction.getChartData();
		}
		this.setState({
			chartData: null
		});
	}
	_setStep(step) {
		return () => {
			this.setState({step});
		}
	}
	_setFilterObj(paths, val) {
		let filterObj = this.state.filterObj,
		immuVal = Immutable.fromJS(val);
		if(paths instanceof Array) {
			filterObj = filterObj.setIn(paths, immuVal);
		} else {
			filterObj = filterObj.set(paths, immuVal);
		}
		this.setState({filterObj});
	}
	_setFilterObjThenUpdataChart(paths, val) {
		this._setFilterObj(paths, val);
		this._getChartData();
	}
	_onCheckDiagnose(idx, val) {
		this.setState({
			diagnoseTags: this.state.diagnoseTags.setIn([idx, 'checked'], val)
		}, this._getChartData);
	}
	_onSaveBack() {
		
	}
	_onSaveRenew() {
		this._setStep(0)();
	}
	_renderContent() {
		let {step, diagnoseTags, chartData, chartDataLoading, filterObj} = this.state,
		{TagIds, Timeranges, Step, StartTime, EndTime} = filterObj.toJS();
		if( step === 0 ) {
			return (<CreateStep1 
						diagnoseTags={diagnoseTags}
						onCheckDiagnose={this._onCheckDiagnose}
						StartTime={StartTime}
						onChangeStartTime={(val) => {
							this._setFilterObjThenUpdataChart('StartTime', val);
						}}
						EndTime={EndTime}
						onChangeEndTime={(val) => {
							this._setFilterObjThenUpdataChart('EndTime', val);
						}}
						Step={Step}
						onUpdateStep={(val) => {
							this._setFilterObjThenUpdataChart('Step', val);
						}}
						chartData={chartData}
						chartDataLoading={chartDataLoading}
						Timeranges={Timeranges}
						onUpdateDateRange={(idx, type, startOrEnd, val) => {
							this._setFilterObjThenUpdataChart(['Timeranges', idx, type], 
								new Date().getFullYear() + SEPARTOR + val.join(SEPARTOR)
							);
						}}
						onAddDateRange={() => {
							Timeranges.push({
								StartTime: getFirstDateByThisYear(DATA_FORMAT), 
								EndTime: getEndDateByThisYear(DATA_FORMAT)});
							this._setFilterObjThenUpdataChart('Timeranges', Timeranges);
						}}
						onDeleteDateRange={(idx) => {
							Timeranges.splice(idx, 1);
							this._setFilterObjThenUpdataChart('Timeranges', Timeranges);
						}}/>);
		} else if( step === 1 ) {
			return (<CreateStep2 />);
		} else if( step === 2 ) {
			return (<CreateStep3 />);
		}
		return null;
	}
	_getFooterButton() {
		let {step} = this.state,
		buttons = [];
		switch (step) {
			case 0:
				buttons.push(<Right><NextButton onClick={this._setStep(1)}/></Right>);
				break;
			case 1:
				buttons.push(<Left><PrevButton onClick={this._setStep(0)}/></Left>);
				buttons.push(<Right><NextButton onClick={this._setStep(2)}/></Right>);
				break;
			case 2:
				buttons.push(<Left><PrevButton onClick={this._setStep(1)}/></Left>);
				buttons.push(
					<Right>
						<RaisedButton onClick={this._onSaveBack} label={'保存并返回诊断列表'}/>
						<RaisedButton onClick={this._onSaveRenew} label={'保存并继续添加'} style={{marginLeft: 10}} primary={true}/>
					</Right>
				);
				break;
		}
		return buttons;
	}
	render() {
		let {step} = this.state;
		return (
			<div className='diagnose-overlay'>
				<header className='diagnose-overlay-header'>
					<div>
						<span>{'新建诊断'}</span>
						<span>
							{['基本', '室内环境异常', '公区温度'].join(SEPARTOR)}
						</span>
					</div>
					<IconButton iconClassName='icon-close' />
				</header>
				<nav className='diagnose-create-stepper'>
			        <Stepper activeStep={step}>
			          <Step>
			            <StepLabel style={{height: 60}}>{'选择诊断数据点并配置诊断范围'}</StepLabel>
			          </Step>
			          <Step>
			            <StepLabel style={{height: 60}}>{'编辑诊断条件'}</StepLabel>
			          </Step>
			          <Step>
			            <StepLabel style={{height: 60}}>{'保存诊断'}</StepLabel>
			          </Step>
			        </Stepper>
		        </nav>
		        {this._renderContent()}
		        <nav className='diagnose-create-footer'>{this._getFooterButton()}</nav>
			</div>
		);
	}
}
export default CreateDiagnose;