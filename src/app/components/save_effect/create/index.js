import React, { Component, PropTypes } from 'react';

import Immutable from 'immutable';
import moment from 'moment';

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import SvgIcon from 'material-ui/SvgIcon';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';

import ReduxDecorator from 'decorator/ReduxDecorator.jsx';

import TimeGranularity from 'constants/TimeGranularity.jsx';
import {Model} from 'constants/actionType/Effect.jsx';

import NewFlatButton from 'controls/NewFlatButton.jsx';

import Step1 from './step1.jsx';
import Step2 from './step2.jsx';
import Step3 from './step3.jsx';
import Step4 from './step4.jsx';

import {getTagsByPlan, updateTags, getPreviewChart2, getPreviewChart3, saveItem} from 'actions/save_effect_action';

import CreateStore from 'stores/save_effect/create_store';

function _getTimeRangeStep() {
	return 365;
}

function stepLabelProps(stepValue, currentStep) {
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

function Header({name, timeStr, onShowDetail, onClose}) {
	return (	
		<header style={{marginLeft: 30,marginTop: 20, marginBottom: 10}}>
			<div>
				<div>{I18N.SaveEffect.CreateTitle + ' ' + name}</div>
				<div style={{marginTop: 10}}>
					{I18N.SaveEffect.Runtime + ': ' + timeStr}
					<a style={{marginLeft: 30, color: '#32ad3d'}} href='javascript:void(0)'>{I18N.SaveEffect.ShowSavePlanDetail}</a>
				</div>
			</div>
			<IconButton style={{position: 'fixed', right: 14, top: 14}} iconClassName='icon-close' onClick={onClose}/>
		</header>
	);
}

function Nav({step}) {
	return (
		<nav className='create-block'>
	        <Stepper activeStep={step}>
	          <Step>
	            <StepLabel {...stepLabelProps(0, step)}>{I18N.SaveEffect.Step1}</StepLabel>
	          </Step>
	          <Step>
	            <StepLabel {...stepLabelProps(1, step)}>{I18N.SaveEffect.Step2}</StepLabel>
	          </Step>
	          <Step>
	            <StepLabel {...stepLabelProps(2, step)}>{I18N.SaveEffect.Step3}</StepLabel>
	          </Step>
	          <Step>
	            <StepLabel {...stepLabelProps(3, step)}>{I18N.SaveEffect.Step4}</StepLabel>
	          </Step>
	        </Stepper>
	    </nav>
	);
}

function getInitFilterObj() {
	return Immutable.fromJS({
		TagId: null,
		CalculationStep: TimeGranularity.Minite,
		BenchmarkModel: Model.Easy,
		BenchmarkStartDate: '2017-08-09',
		BenchmarkEndDate: '2017-08-09',
		EnergyStartDate: null,
		EnergyEndDate: null,
		EnergyUnitPrice: '',
		ContrastStep: TimeGranularity.Monthly,
		ConfigStep: 1
	});
}

@ReduxDecorator
export default class Create extends Component {
	static calculateState = (state, props, ctx) => {
		return {
			tags: CreateStore.getTagsByPlan(),
			chartData2: CreateStore.getChartData2(),
			chartData3: CreateStore.getChartData3(),
		}
	};
	static getStores = () => [CreateStore];
	constructor(props) {
		super(props);

		this.state = {
			filterObj: getInitFilterObj()
						.set('EnergyEffectId', props.id),
		}
		this._getInitData(1);
	}
	_setFilterObj(filterObj) {		
		this.setState((state, props) => {
			return {
				filterObj
			}
		});
	}
	_goStep(step) {
		this._setFilterObj(this.state.filterObj.set('ConfigStep', step));
	}
	_goStepAndSave(step) {
		saveItem(this.state.filterObj.toJS());
		this._goStepAndInit(step);
	}
	_goSaveAndClose() {
		saveItem(this.state.filterObj.set('ConfigStep', 5).toJS());
		this.props.onClose();
	}
	_goStepAndInit(step) {
		this._goStep(step);
		this._getInitData(step);
	}
	_getInitData(step) {
		switch( step ) {
			case 1:
				getTagsByPlan(this.props.id);
				break;
			case 2:
				getPreviewChart2(filterObj.toJS());
				break;
		}
	}
	_checkCanNext() {		
		switch( this.state.filterObj.get('ConfigStep') ) {
			case 1:
				return this.state.filterObj.get('TagId');
				break;
			case 2:
				return true;
				break;
			case 3:
				let {EnergyStartDate, EnergyEndDate, EnergyUnitPrice, BenchmarkDatas, BenchmarkModel} = this.state.filterObj.toJS();
				if( !EnergyStartDate || !EnergyEndDate || !EnergyUnitPrice ) {
					return false;
				}
				if( BenchmarkModel === Model.Manual ) {
					return BenchmarkDatas.reduce((result, current) => {
						return result && !!current.Value;
					}, true);
				}
				return true;
				break;
			case 4:
				let {PredictionDatas} = this.state.filterObj.toJS();
				return PredictionDatas.reduce((result, current) => {
					return result && !!current.Value;
				}, true);
				break;
		}
	}
	renderContent() {
		let { tags, chartData2, chartData3, filterObj } = this.state;
		switch(filterObj.get('ConfigStep')) {
			case 1:
			{
				return (<Step1
					tags={tags}
					selectedId={filterObj.get('TagId')}
					onClickItem={(TagId) => {
						this._setFilterObj(filterObj.set('TagId', TagId));
					}}
					onDeleteItem={idx => updateTags(this.state.tags.delete(idx))}
					onAddItem={ tag => updateTags(this.state.tags.push(tag))}
				/>);
				break;
			}
			case 2:
			{
				let {BenchmarkStartDate, BenchmarkEndDate, CalculationStep, BenchmarkModel} = filterObj.toJS();
				return (<Step2
					data={chartData2}
					BenchmarkModel={BenchmarkModel}
					CalculationStep={CalculationStep}
					BenchmarkStartDate={BenchmarkStartDate}
					BenchmarkEndDate={BenchmarkEndDate}
					disabledPreview={false}
					onChangeModelType={(type) => {
						filterObj = filterObj.set('BenchmarkModel', type);
						if(type === Model.Manual) {
							filterObj = filterObj.set('CalculationStep', TimeGranularity.Daily);
						}
						this._setFilterObj(filterObj);
					}}
					onChangeStep={(step) => {
						this._setFilterObj(filterObj.set('CalculationStep', step));
					}}
					onChangeBenchmarkStartDate={(val) => {
						filterObj = filterObj.set('BenchmarkStartDate', val);
						let startTime = moment(val),
						endTime = moment(BenchmarkEndDate);

						if( endTime < moment(startTime) ) {
							endTime = moment(startTime).add(1, 'days');
						} else if( moment(startTime).add(_getTimeRangeStep(CalculationStep), 'days') < endTime ) {
							endTime = moment(startTime).add(_getTimeRangeStep(CalculationStep), 'days');
						}
						if(endTime.format('YYYY-MM-DD') !== BenchmarkEndDate) {
							filterObj = filterObj.set('BenchmarkEndDate', endTime.format('YYYY-MM-DD'))
						}
						this._setFilterObj(filterObj);
					}}
					onChangeBenchmarkEndDate={(val) => {
						filterObj = filterObj.set('BenchmarkEndDate', val);
						let endTime = moment(val),
						startTime = moment(BenchmarkStartDate);

						if( startTime > moment(endTime) ) {
							startTime = moment(endTime).subtract(1, 'days');
						} else if( moment(endTime).subtract(_getTimeRangeStep(CalculationStep), 'days') > startTime ) {
							startTime = moment(endTime).subtract(_getTimeRangeStep(CalculationStep), 'days');
						}
						if(startTime.format('YYYY-MM-DD') !== BenchmarkStartDate) {
							filterObj = filterObj.set('BenchmarkStartDate', startTime.format('YYYY-MM-DD'))
						}
						this._setFilterObj(filterObj);
					}}
					onGetChartData={() => {
						getPreviewChart2(filterObj.toJS());
					}}
				/>);
				break;
			}
			case 3:
			{
				let {BenchmarkModel, CalculationStep, EnergyStartDate, EnergyEndDate, EnergyUnitPrice, BenchmarkDatas} = filterObj.toJS();
				return (<Step3
					data={chartData3}
					BenchmarkModel={BenchmarkModel}
					CalculationStep={CalculationStep}
					EnergyUnitPrice={EnergyUnitPrice}
					EnergyStartDate={EnergyStartDate}
					EnergyEndDate={EnergyEndDate}
					BenchmarkDatas={BenchmarkDatas}
					disabledPreview={false}
					onChangeEnergyUnitPrice={(val) => {
						this._setFilterObj(filterObj.set('EnergyUnitPrice', val));
					}}
					onChangeEnergyStartDate={(val) => {
						filterObj = filterObj.set('EnergyStartDate', val);
						let startTime = moment(val),
						endTime = moment(EnergyEndDate);

						if( EnergyEndDate ) {
							if( endTime < moment(startTime) ) {
								endTime = moment(startTime).add(1, 'days');
							} else if( moment(startTime).add(_getTimeRangeStep(CalculationStep), 'days') < endTime ) {
								endTime = moment(startTime).add(_getTimeRangeStep(CalculationStep), 'days');
							}
							if(endTime.format('YYYY-MM-DD') !== EnergyEndDate) {
								filterObj = filterObj.set('EnergyEndDate', endTime.format('YYYY-MM-DD'))
							}

							filterObj = filterObj.set('BenchmarkDatas', getDateObjByRange(val, EnergyEndDate));
							filterObj = filterObj.set('PredictionDatas', getDateObjByRange(val, EnergyEndDate));
						}
						this._setFilterObj(filterObj);
					}}
					onChangeEnergyEndDate={(val) => {
						filterObj = filterObj.set('EnergyEndDate', val);
						let endTime = moment(val),
						startTime = moment(EnergyStartDate);

						if( EnergyStartDate ) {
							if( startTime > moment(endTime) ) {
								startTime = moment(endTime).subtract(1, 'days');
							} else if( moment(endTime).subtract(_getTimeRangeStep(CalculationStep), 'days') > startTime ) {
								startTime = moment(endTime).subtract(_getTimeRangeStep(CalculationStep), 'days');
							}
							if(startTime.format('YYYY-MM-DD') !== EnergyStartDate) {
								filterObj = filterObj.set('EnergyStartDate', startTime.format('YYYY-MM-DD'))
							}
							filterObj = filterObj.set('BenchmarkDatas', getDateObjByRange(EnergyStartDate, val));
							filterObj = filterObj.set('PredictionDatas', getDateObjByRange(EnergyStartDate, val));
						}
						this._setFilterObj(filterObj);
					}}
					onChangeBenchmarkDatas={(idx, val) => {
						this._setFilterObj(filterObj.setIn(['BenchmarkDatas', idx, 'Value'], val));
					}}
					onGetChartData={() => {
						getPreviewChart3(filterObj.toJS());
					}}
				/>);
				break;
			}
			case 4:
			{
				let {EnergyStartDate, EnergyEndDate, CalculationStep, PredictionDatas, BenchmarkStartDate, BenchmarkEndDate, ContrastStep} = filterObj.toJS();
				return (<Step4
					EnergyStartDate={EnergyStartDate}
					EnergyEndDate={EnergyEndDate}
					CalculationStep={CalculationStep}
					PredictionDatas={PredictionDatas}
					BenchmarkStartDate={BenchmarkStartDate}
					BenchmarkEndDate={BenchmarkEndDate}
					ContrastStep={ContrastStep}
					onChangePredictionDatas={(idx, val) => {
						this._setFilterObj(filterObj.setIn(['PredictionDatas', idx, 'Value'], val));
					}}
					onChangeContrastStep={(val) => {
						this._setFilterObj(filterObj.setIn(['ContrastStep'], val));
					}}
				/>)
				break;
			}

		}
		return (<div className='jazz-save-effect-create flex-center'>
			<CircularProgress  mode="indeterminate" size={80} />
		</div>);
	}
	renderFooter() {
		let buttons = [];		
		switch( this.state.filterObj.get('ConfigStep') ) {
			case 1:
				buttons.push(<NewFlatButton onClick={() => {this._goStepAndSave(2)}} primary disabled={!this._checkCanNext()} label={'下一步'} style={{float: 'right'}}/>);
				break;
			case 2:
				buttons.push(<NewFlatButton onClick={() => {this._goStep(1)}} secondary label={'上一步'} style={{float: 'left'}}/>);
				buttons.push(<NewFlatButton onClick={() => {this._goStepAndSave(3)}} primary disabled={!this._checkCanNext()} label={'下一步'} style={{float: 'right'}}/>);
				break;
			case 3:
				buttons.push(<NewFlatButton onClick={() => {this._goStep(2)}} secondary label={'上一步'} style={{float: 'left'}}/>);
				buttons.push(<NewFlatButton onClick={() => {this._goStepAndSave(4)}} primary disabled={!this._checkCanNext()} label={'下一步'} style={{float: 'right'}}/>);
				break;
			case 4:
				buttons.push(<NewFlatButton onClick={() => {this._goStep(3)}} secondary label={'上一步'} style={{float: 'left'}}/>);
				buttons.push(<NewFlatButton onClick={() => {this._goSaveAndClose(4)}} primary disabled={!this._checkCanNext()} label={'配置完成'} style={{float: 'right'}}/>);
				break;
		}
		return (<footer className='footer'>{buttons}</footer>)
	}
	render() {
		let {name, id, date, onClose} = this.props;
		return (
			<div className='jazz-save-effect-create'>
				<Header name={name} timeStr={date.format('YYYY-MM-DD HH:mm')} onClose={onClose}/>
				<Nav step={this.state.filterObj.get('ConfigStep') - 1}/>
				{this.renderContent()}
				{this.renderFooter()}
			</div>
		);
	}
}
Create.PropTypes = {
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	date: PropTypes.object.isRequired, //moment
	onClose: PropTypes.func.isRequired,
};

export function getDateObjByRange(startDate, endDate) {
	let result = [],
	existYears = [],
	increment = 0,
	incrementDate;
	while( ( incrementDate = moment(moment(startDate).add(increment++, 'months').format('YYYY-MM-01')) ) <= moment(endDate)) {
		let Label = incrementDate.format('MM' + I18N.Map.Date.Month);
		if( existYears.indexOf( incrementDate.get('year') ) === -1 ) {
			Label = incrementDate.format('YYYY' + I18N.Map.Date.Year + 'MM' + I18N.Map.Date.Month);
			existYears.push( incrementDate.get('year') );
		}
		result.push({
			Key: incrementDate.format('YYYY-MM-DD HH:mm:ss'),
			Label,
		})
	}
	return Immutable.fromJS(result);
}