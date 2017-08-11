import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';

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

import NewDialog from 'controls/NewDialog.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';

import Step1 from './step1.jsx';
import Step2 from './step2.jsx';
import Step3 from './step3.jsx';
import Step4 from './step4.jsx';

import {Solution,SolutionLabel} from 'components/ECM/MeasurePart/Solution.jsx';
import Problem from 'components/ECM/MeasurePart/Problem.jsx';
import SolutionGallery from 'components/ECM/MeasurePart/SolutionGallery.jsx';
import Supervisor from 'components/ECM/MeasurePart/Supervisor.jsx';
import StatusCmp from 'components/ECM/MeasurePart/Status.jsx'
import {EnergySys} from 'components/ECM/MeasurePart/MeasureTitle.jsx';
import Remark from 'components/ECM/MeasurePart/Remark.jsx';

import {getTagsByPlan, updateTags, getPreviewChart2, getPreviewChart3, saveItem, getEnergySolution } from 'actions/save_effect_action';

import MeasuresAction from 'actions/ECM/MeasuresAction.jsx';

import CreateStore from 'stores/save_effect/create_store';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';

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
					<a style={{marginLeft: 30, color: '#32ad3d'}} href='javascript:void(0)' onClick={onShowDetail}>{I18N.SaveEffect.ShowSavePlanDetail}</a>
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

function getInitFilterObj(props) {
	return Immutable.fromJS({
		TagId: null,
		CalculationStep: TimeGranularity.Minite,
		BenchmarkModel: Model.Easy,
		BenchmarkStartDate: moment(props.ExecutedTime).subtract(31, 'days').format('YYYY-MM-DD'),
		BenchmarkEndDate: moment(props.ExecutedTime).format('YYYY-MM-DD'),
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
			tags: CreateStore.getTagsByPlan() && CreateStore.getTagsByPlan().map(tag => Immutable.fromJS({
				TagId: tag.get('TagId'),
				Name: tag.get('Name'),
				Configed: !!tag.get('EnergyEffectItemId'),
			})),
			chartData2: CreateStore.getChartData2(),
			chartData3: CreateStore.getChartData3(),
			energySolution: CreateStore.getEnergySolution(),
			supervisorList:MeasuresStore.getSupervisor(),
			EnergyEffectItemId: CreateStore.getEnergyEffectItemId(),
		}
	};
	static getStores = () => [CreateStore, MeasuresStore];
	constructor(props) {
		super(props);

		this.state = {
			filterObj: getInitFilterObj(props)
						.set('EnergyEffectId', props.EnergyEffectId),
			measureShow: false,
			closeDlgShow: false,
		}
		this._getInitData(1, props);
	}
	static contextTypes = {
		hierarchyId: PropTypes.string
	};
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
		saveItem(this.state.filterObj.set('ConfigStep', 5).toJS(), this.props.onSubmitDone);

		this.props.onClose(true);
	}
	_goStepAndInit(step) {
		this._goStep(step);

		setTimeout(() => {this._getInitData(step)}, 0);
	}
	_getInitData(step, props = this.props, state = this.state) {
		switch( step ) {
			case 1:
				getTagsByPlan(props.EnergyProblemId);
				break;
			case 2:
				getPreviewChart2(state.filterObj.toJS());
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
	_onClose() {
		saveItem(this.state.filterObj.toJS(), this.props.onSubmitDone);
		this.props.onClose(false);
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
					onAddItem={ tag => updateTags(this.state.tags.push(tag.set('TagId', tag.get('Id'))))}
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
					disabledPreview={!this._checkCanNext()}
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
					disabledPreview={!this._checkCanNext()}
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
	_renderPersonInCharge(problem,indetail){
	  return(
	    <Supervisor person={problem.get('Supervisor')} supervisorList={this.state.supervisorList}
	        usedInDetail={indetail}
	        canEdit={false}
	        energySys={problem.get('EnergySys')}/>
	  )
	}
	_renderMeasureDialog(){
	  var currentSolution=this.state.energySolution;
	  var onClose=()=>{
	    this.setState({
	      measureShow:false,
	    })
	  };
	  if( !currentSolution ) {
		return (
	    <NewDialog
	      open={this.state.measureShow}
	      modal={false}
	      isOutsideClose={false}
	      onRequestClose={onClose}
	      overlayStyle={{overflowY:"auto"}}
	      style={{overflow:"visible"}}
	      wrapperStyle={{overflow:"visible"}}
	      titleStyle={{margin:'0 7px',paddingTop:"7px"}}
	      contentStyle={{overflowY:"auto",display:'block',padding:"6px 28px 14px 32px",margin:0}}>
	      <div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>
	     </NewDialog>)
	  }
		let problem = currentSolution.get('EnergyProblem');
	 var props={
	   title:{
	     measure:currentSolution,
	     canNameEdit:false,
	     canEnergySysEdit:false,
	   },
	   problem:{
	     measure:currentSolution,
	     canEdit:false,
	   },
	   solution:{
	     measure:currentSolution,
	     canEdit:false,
	   },
	   gallery: {
	    measure:currentSolution,
	    isView: true,
	   },
	   remark:{
	   	remarkList: currentSolution.get('Remarks'),
	     problemId:problem.get('Id'),
	     canEdit:false,
	     onScroll:(height)=>{ReactDom.findDOMNode(this).querySelector(".dialog-content").scrollTop+=height+15}
	   },	   
	   energySys:{
	     measure:currentSolution,
	     canNameEdit:false,
	     canEnergySysEdit:false,
	   }
	 }
	  return(
	    <NewDialog
	      open={this.state.measureShow}
	      modal={false}
	      isOutsideClose={false}
	      onRequestClose={onClose}
	      overlayStyle={{overflowY:"auto"}}
	      style={{overflow:"visible"}}
	      wrapperStyle={{overflow:"visible"}}
	      titleStyle={{margin:'0 7px',paddingTop:"7px"}}
	      contentStyle={{overflowY:"auto",display:'block',padding:"6px 28px 14px 32px",margin:0}}>
	      <div style={{paddingLeft:'9px',borderBottom:"1px solid #e6e6e6",paddingRight:'19px'}}>
		      <div className="jazz-ecm-push-operation">
		        <StatusCmp status={problem.get('Status')} canEdit={false}/>
		        {this._renderPersonInCharge(problem,true)}
		        <EnergySys {...props.energySys}/>
		      </div>
	      </div>
	      <SolutionLabel {...props.solution}/>
	      <Solution {...props.solution}/>
	      <Problem {...props.problem}/>
	      <div style={{margin:"46px 20px 0 16px"}}><SolutionGallery {...props.gallery}/></div>
	      <div style={{display:"flex",alignItems:"flex-end",marginTop:'36px'}}>
	        <div className="jazz-ecm-push-operation-label">{`${I18N.Setting.ECM.PushPanel.CreateUser}：`}</div>
	        <div style={{fontSize:'12px',color:'#9fa0a4',marginLeft:'5px'}}>{problem.get('CreateUserName') || '-'}</div>
	      </div>
	      <Remark {...props.remark}/>
	    </NewDialog>
	  )
	}
	render() {
		let {EnergyProblemId, EnergySolutionName, ExecutedTime, onClose} = this.props;
		return (
			<div className='jazz-save-effect-create'>
				<Header name={EnergySolutionName} timeStr={moment(ExecutedTime).format('YYYY-MM-DD HH:mm')} onShowDetail={() => {
					this.setState((state, props) => {
						return { measureShow: true };
					});
					getEnergySolution(EnergyProblemId);
					MeasuresAction.getSupervisor(this.context.hierarchyId);
				}} onClose={() => {
					this.setState({
						closeDlgShow: true
					});
				}}/>
				<Nav step={this.state.filterObj.get('ConfigStep') - 1}/>
				{this.renderContent()}
				{this.renderFooter()}
				{this._renderMeasureDialog()}
				<NewDialog open={this.state.closeDlgShow} actionsContainerStyle={{textAlign: 'right'}} actions={[
					<NewFlatButton primary label={'保存'} onClick={this._onClose}/>,
					<NewFlatButton style={{marginLeft: 24}} secondary label={'取消'} onClick={() =>{
						this.setState({
							closeDlgShow: false
						});
					}}/>
				]}>{'离开页面会导致编辑内容丢失，是否保存到草稿？'}</NewDialog>
			</div>
		);
	}
}
Create.PropTypes = {
	EnergySolutionName: PropTypes.string.isRequired,
	EnergyProblemId: PropTypes.string.isRequired,
	EnergyEffectId: PropTypes.string.isRequired,
	ExecutedTime: PropTypes.object.isRequired, //moment
	onClose: PropTypes.func.isRequired,
	onSubmitDone: PropTypes.func,
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