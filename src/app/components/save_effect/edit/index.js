import React, { Component} from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import ReactDom from 'react-dom';
import ReduxDecorator from 'decorator/ReduxDecorator.jsx';
import TimeGranularity from 'constants/TimeGranularity.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import Step1 from './step1.jsx';
import Step2 from './step2.jsx';
import Step3 from './step3.jsx';
import Step4 from './step4.jsx';
import {Model,CalendarItemType,TriggerType,TriggerConditionType} from 'constants/actionType/Effect.jsx';
import {find} from 'lodash-es';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import {Solution,SolutionLabel} from 'components/ECM/MeasurePart/Solution.jsx';
import Problem from 'components/ECM/MeasurePart/Problem.jsx';
import SolutionGallery from 'components/ECM/MeasurePart/SolutionGallery.jsx';
import Supervisor from 'components/ECM/MeasurePart/Supervisor.jsx';
import StatusCmp from 'components/ECM/MeasurePart/Status.jsx'
import {EnergySys} from 'components/ECM/MeasurePart/MeasureTitle.jsx';
import Remark from 'components/ECM/MeasurePart/Remark.jsx';
import {binarySearch} from 'util/algorithm';
import {
	getTagsByPlan,
	updateTags,
	getPreviewChart2,
	getPreviewChart3,
	saveItem,
	getEnergySolution,
	addEnergyEffectTag,
	deleteEnergyEffectTag,
	cleanEdit,
  getItem,
  updateItem
} from 'actions/save_effect_action';

import MeasuresAction from 'actions/ECM/MeasuresAction.jsx';
import CreateStore from 'stores/save_effect/create_store';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import UOMStore from 'stores/UOMStore.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';
import SecondStepAction from 'actions/save_effect/second_step_action.jsx';
import SecondStepStore from 'stores/save_effect/second_step_store.jsx';
import EditSolution from 'components/ECM/edit_solution.jsx';
const ASC_STEP = [
	TimeGranularity.None,
	TimeGranularity.Min15,
	TimeGranularity.Min30,
	TimeGranularity.Minite,
	TimeGranularity.Hour2,
	TimeGranularity.Hour4,
	TimeGranularity.Hour6,
	TimeGranularity.Hour8,
	TimeGranularity.Hour12,
	TimeGranularity.Hourly,
	TimeGranularity.Daily,
	TimeGranularity.Weekly,
	TimeGranularity.Monthly,
	TimeGranularity.Yearly,
];

const Industry={
	"DataCenter":2,
	"CommunicationRoom":15,
	"BaseStation":16,
	"RailTransport":18,
	"Airport":19,
	"Manufacture":20
}

function checkSupportStep(currentStep, targetStep) {
	return ASC_STEP.indexOf(targetStep) >= ASC_STEP.indexOf(currentStep);
}

function checkStepByTag(tagId, calcStep) {
	return checkSupportStep( CreateStore.getTagsByPlan().find(tag => tag.get('TagId') === tagId).get('Step'), calcStep)
}

function date2UTC(date) {
	return date ? moment(date).startOf('day').utcOffset(0).format('YYYY-MM-DD HH:mm:ss') : '';
}
function UTC2Local(date) {
	return date ? moment(date).add(8, 'hours').format('YYYY-MM-DD') : '';
}

function _getTimeRangeStep() {
	return 365;
}

function getUomByChartData(data) {
	return UOMStore.getUomById(
		data.getIn([
			'TargetEnergyData',
			data.get('TargetEnergyData').size - 1,
			'Target',
			'UomId',
		])
	);
}

function getDataByNavgatorData(startTime, endTime, chartData) {
	startTime = startTime.split(' ').join('T');
	endTime = endTime.split(' ').join('T');
	let start = binarySearch((item) => {
		if( item.get('UtcTime') > startTime ) {
			return -1;
		} else if( item.get('UtcTime') < startTime ) {
			return 1;
		} else {
			return 0;
		}
	}, chartData.getIn(['NavigatorData', 'EnergyData']));
	if( start ) {
		let startIndex = start.get('index'),
		EnergyData = chartData.getIn(['NavigatorData', 'EnergyData']),
		EnergyDataSize = EnergyData.size,
		result = [];
		while( endTime >= EnergyData.getIn([startIndex, 'UtcTime']) ) {
			result.push(EnergyData.get(startIndex++));
		}
		return Immutable.fromJS(result);
	}
}

function Header({name, timeStr, onShowDetail, onClose}) {
	return (
		<header style={{marginLeft: 30,marginTop: 20, marginBottom: 10}}>
			<div>
				<div className='hiddenEllipsis' style={{fontWeight:'600',fontSize:'16px',color:'#0f0f0f'}}>{I18N.SaveEffect.EditTitle + ' ' + name}</div>
				<div style={{marginTop: 10}}>
					{I18N.SaveEffect.Runtime + ': ' + timeStr}
					<a style={{marginLeft: 30, color: '#32ad3d'}} href='javascript:void(0)' onClick={onShowDetail}>{I18N.SaveEffect.ShowSavePlanDetail}</a>
				</div>
			</div>
			<IconButton style={{position: 'absolute', right: 14, top: 0}} iconClassName='icon-close' onClick={onClose}/>
		</header>
	);
}

export function getDateObjByRange(startDate, endDate) {
	let result = [],
	existYears = [],
	increment = 0,
	incrementDate;
	startDate = UTC2Local(startDate);
	endDate = UTC2Local(moment(endDate).add(-1,'days'));
	while( ( incrementDate = moment(moment(startDate).add(increment++, 'months').format('YYYY-MM-01')) ) <= moment(endDate)) {
		let Label = incrementDate.format('MM' + I18N.Map.Date.Month);
		if( existYears.indexOf( incrementDate.get('year') ) === -1 ) {
			Label = incrementDate.format('YYYY' + I18N.Map.Date.Year + 'MM' + I18N.Map.Date.Month);
			existYears.push( incrementDate.get('year') );
		}
		result.push({
			Key: date2UTC(incrementDate),
			Label,
		})
	}
	return Immutable.fromJS(result);
}

function getInitFilterObj(state) {
	return Immutable.fromJS({...{
		TagId: null,
		CalculationStep: TimeGranularity.Daily,
		BenchmarkModel: Model.Easy,
		BenchmarkStartDate: date2UTC(moment(UTC2Local(state.filterObj.get("ExecutedTime"))).subtract(31, 'days')),
		BenchmarkEndDate: date2UTC(UTC2Local(state.filterObj.get("ExecutedTime"))),
		EnergyStartDate: null,
		EnergyEndDate: null,
		EnergyUnitPrice: '',
		CorrectionFactor:1,
		ContrastStep: TimeGranularity.Monthly,
		ConfigStep: state.ConfigStep,
		IncludeEnergyEffectData: false,
		AuxiliaryTagId:null,
		AuxiliaryTagName:null,
		TimePeriods:[],
		Step:null,
		UomId:null,
		AuxiliaryTagStep:null,
		AuxiliaryTagUomId:null,
		Triggers:[]
	},...state.filterObj.toJS(),...{		
		BenchmarkDatas: (!state.filterObj.get("BenchmarkDatas") || state.filterObj.get("BenchmarkDatas").size === 0 && state.filterObj.get("EnergyStartDate") && state.filterObj.get("EnergyStartDate")) ? 
							getDateObjByRange(state.filterObj.get("EnergyStartDate"), state.filterObj.get("EnergyStartDate")) :
							state.filterObj.get("BenchmarkDatas"),
		PredictionDatas: (!state.filterObj.get("PredictionDatas") || state.filterObj.get("PredictionDatas").size === 0 && state.filterObj.get("EnergyStartDate") && state.filterObj.get("EnergyStartDate")) ? 
							getDateObjByRange(state.filterObj.get("EnergyStartDate"), state.filterObj.get("EnergyStartDate")) :
							state.filterObj.get("PredictionDatas"),
	}});
}

function findBuilding(hierarchyId){
  return find(HierarchyStore.getBuildingList(), building => building.Id === hierarchyId * 1 );
}

function needCalendar(hierarchyId){
	let notNeedIndustry=[Industry.DataCenter,Industry.CommunicationRoom,Industry.BaseStation,Industry.RailTransport,Industry.Airport,Industry.Manufacture];
	return notNeedIndustry.indexOf(findBuilding(hierarchyId).IndustryId)===-1
}

function hasTimePeridsModel(model){
	return model===Model.Easy || model===Model.Increment || model===Model.Efficiency
 }

@ReduxDecorator
export default class Edit extends Component {

  	static calculateState = (state, props, ctx,isRefresh) => {

				var filterObj=state.filterObj;
		if(state.hasCalendar==='loading'  && filterObj.get("TimePeriods").size===0 && hasTimePeridsModel(filterObj.get("BenchmarkModel"))){
			if(state.filterObj.get("CalculationStep")===TimeGranularity.Hourly){
				// if(needCalendar(ctx.hierarchyId)){
				if(needCalendar(ctx.hierarchyId)){
					filterObj=filterObj.set("TimePeriods",Immutable.fromJS([{
						FromTime:8,
						ToTime:20,
						TimePeriodType:CalendarItemType.WorkDayCalcTime,
						ConfigStep:2
					},{
						FromTime:10,
						ToTime:14,
						TimePeriodType:CalendarItemType.RestDayCalcTime,
						ConfigStep:2
					}]))
				}else{
					filterObj=filterObj.set("TimePeriods",Immutable.fromJS([{
						FromTime:8,
						ToTime:20,
						TimePeriodType:CalendarItemType.AllDayCalcTime,
						ConfigStep:2
					}]))
				}
			}
		}

		if(filterObj && filterObj.get("BenchmarkModel")===Model.Relation && filterObj.get("AuxiliaryTagId")===null && !Immutable.is(state.tags,CreateStore.getTagsByPlan())){
			let auxiliaryTag=CreateStore.getTagsByPlan().filter(tag=>tag.get('Status')===3);
			if(auxiliaryTag && auxiliaryTag.size>0){
								filterObj = filterObj.set('AuxiliaryTagId', auxiliaryTag.getIn([0,'TagId']))
																		 .set('AuxiliaryTagName', auxiliaryTag.getIn([0,'Name']))
																		 .set('AuxiliaryTagStep',auxiliaryTag.getIn([0,'Step']))
																		 .set('AuxiliaryTagUomId',auxiliaryTag.getIn([0,'UomId']))
							}	
		}

		return {
			tags: CreateStore.getTagsByPlan() && CreateStore.getTagsByPlan().map(tag => Immutable.fromJS({
				TagId: tag.get('TagId'),
				Name: tag.get('Name'),
				Configed: !!tag.get('Configed') || !!tag.get('EnergyEffectItemId'),
				isNew: tag.get('isNew'),
				Status: tag.get('Status'),
				Step: tag.get('Step'),
				UomId: tag.get('UomId'),
			})),
			chartData2: CreateStore.getChartData2(),
			chartData3: CreateStore.getChartData3(),
			energySolution: CreateStore.getEnergySolution(),
			supervisorList:MeasuresStore.getSupervisor(),
			hasCalendar:SecondStepStore.getConfigCalendar(),
      // filterObj:CreateStore.getEffectItem()
      filterObj:(!state || isRefresh)?CreateStore.getEffectItem():filterObj
		}
	};
	static getStores = () => [CreateStore, MeasuresStore,SecondStepStore];
  static contextTypes = {
		hierarchyId: PropTypes.string,
		router: PropTypes.object,
	};

  	constructor(props) {
		super(props);
		this.state = {
      filterObj:null,
			measureShow: false,
			closeDlgShow: false,
			showStepTip: false,
      configStep:null,
			hasCalendar:true
		}
    

		this._onSaveAndClose = this._onSaveAndClose.bind(this);
		this._getInitData = this._getInitData.bind(this);
		this._checkCalendar = this._checkCalendar.bind(this);
		this._renderPersonInCharge=this._renderPersonInCharge.bind(this);
	}

	_checkCalendar(date=this.state.filterObj.get("BenchmarkStartDate")){
		if(needCalendar(this.context.hierarchyId)){
					this.setState({
						hasCalendar:'loading'
					},()=>{
						SecondStepAction.getConfigcalendar(this.context.hierarchyId*1,date);
					})
				}
	}

	_getInitData(step, props = this.props, state = this.state) {
		switch( step ) {
			case 1:
				getTagsByPlan(state.filterObj.get('EnergyProblemId'));
				break;
			case 2:
				getPreviewChart2(this._getFilterObj().set('ConfigStep', 2).set("CorrectionFactor",1).toJS());
				// this._checkCalendar(state.filterObj.get("BenchmarkStartDate"));
				break;
    	case 3:
				getPreviewChart3(this._getFilterObj().set('ConfigStep', 3).toJS());
				break;
		}
	}

  _setFilterObj(filterObj) {
		this.setState((state, props) => {
			return {filterObj}
		});
	}

	_getFilterObj() {
		return this.state.filterObj;
	}

	_onSaveAndClose() {
		saveItem(this.context.router.params.customerId, this.context.hierarchyId, this._getFilterObj().toJS(), this.props.onSubmitDone);
		this._onClose(false);
	}

  _onClose(done) {
		this.props.onClose(!!done);
		cleanEdit();
	}

	_checkStepByTag(calcStep) {
		// let propsStep = this.props.filterObj.Step;
		let {Step,AuxiliaryTagStep}=this.state.filterObj.toJS()
		return AuxiliaryTagStep ?
			checkSupportStep(Step, calcStep) && checkSupportStep(AuxiliaryTagStep, calcStep) :
			checkSupportStep(Step, calcStep);
	}

  	_setTagStepTip(calcStep) {
		if( !this._checkStepByTag(calcStep) ) {
			this.setState((state, props) => {
				return {
					showStepTip: true
				}
			});
		}
	}

  	_checkCanNext(step) {
		switch( step) {
			case 1:
				return this.state.filterObj.get('TagId');
				break;
			case 2:
				var {BenchmarkModel,AuxiliaryTagId,CalculationStep,Triggers}=this.state.filterObj.toJS();
			if(BenchmarkModel===Model.Increment || BenchmarkModel===Model.Efficiency || BenchmarkModel===Model.Simulation) return AuxiliaryTagId!==null && this._checkStepByTag(CalculationStep)
				
			if(BenchmarkModel===Model.Relation){
				return AuxiliaryTagId!==null && this._checkStepByTag(CalculationStep) && 
								Triggers[0].Value!==null && Triggers[0].Value!==''  &&
								Triggers[1].Value!==null && Triggers[1].Value!==''
			}

				return this.state.chartData2 && this._checkStepByTag(CalculationStep) && 
							(!needCalendar(this.context.hierarchyId) ||
							(needCalendar(this.context.hierarchyId) && this.state.hasCalendar===true));
				break;
			case 3:
				let {EnergyStartDate, EnergyEndDate, EnergyUnitPrice, BenchmarkDatas, BenchmarkModel,CorrectionFactor} = this.state.filterObj.toJS();
				if( !EnergyStartDate || !EnergyEndDate || !EnergyUnitPrice ||  !/^(\+?)\d{1,9}([.]\d{1,3})?$/.test(EnergyUnitPrice) ) {
					return false;
				}
				if( BenchmarkModel === Model.Manual ) {
					return BenchmarkDatas.reduce((result, current) => {
						return result && !!current.Value && /^(\-?)\d{1,9}([.]\d{1,3})?$/.test(current.Value);
					}, true);
				}else{
					if(!CorrectionFactor || !/^(\+?)\d{1,9}([.]\d{1,3})?$/.test(CorrectionFactor)) return false
				}
				return true;
				break;
			case 4:
				let {PredictionDatas} = this.state.filterObj.toJS();
				if(!PredictionDatas) return false;
				return PredictionDatas.reduce((result, current) => {
					return result && !!current.Value && /^(\-?)\d{1,9}([.]\d{1,3})?$/.test(current.Value);
				}, true);
				break;
		}
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
				return(
			      <EditSolution solution={currentSolution} 
                    isUnread={false}
                    hasRemarkPriviledge={false}
                    hasPriviledge={false}
                    hasStatusPriviledge={false}
                    onClose={onClose}
                    onStatusChange={this._onStatusChange}
                    person={this._renderPersonInCharge}/>
		)
	}

  _renderStep1(){
    let { tags,filterObj } = this.state;
    return(
      <Step1
          tagName={filterObj.get('TagName')}
					tags={tags}
					selectedId={filterObj.get('TagId')}
					step={filterObj.get('Step')}
					uomId={filterObj.get('UomId')}
					onDeleteItem={(idx, tagId) => {
						deleteEnergyEffectTag(filterObj.get('EnergyProblemId'), tagId);
						updateTags(this.state.tags.delete(idx));
						if( tagId === filterObj.get('TagId') ) {
							this._setFilterObj(filterObj.set('TagId', null));
						}
					}}
					onAddItem={(tag) => {
							addEnergyEffectTag(filterObj.get('EnergyProblemId'), tag.get('Id'));
							updateTags(this.state.tags.push(
								tag.set('TagId', tag.get('Id'))
									.set('Step', tag.get('CalculationStep'))
							));
						}
					}
          configStep={this.state.configStep}
          isView={this.state.configStep!==1}
          onEdit={()=>{
            this.setState({
              configStep:1
            },()=>{
              this._getInitData(1);
            })
          }}
         onSave={
           (TagId,TagName,Step,UomId) => {
						this.setState((state, props) => {
							return {
								chartData2: null,
								chartData3: null,
                configStep:2
							}
						},()=>{   
							var filterObj= getInitFilterObj(this.state)
								          .set('TagId', TagId)
                          .set('TagName',TagName)
													.set('Step', Step)
                          .set('UomId',UomId)
                          .set('ConfigStep',2)
													.set('EnergyStartDate', null)
													.set('EnergyEndDate', null)
													.set('BenchmarkStartDate',date2UTC(moment(UTC2Local(this.state.filterObj.get("ExecutedTime"))).subtract(31, 'days')))
													.set('BenchmarkEndDate',date2UTC(UTC2Local(this.state.filterObj.get("ExecutedTime"))));          
              updateItem(filterObj.toJS(),null,null);
							getPreviewChart2(filterObj.set("CorrectionFactor",1).toJS());
            });
					}
         } 
         onCancel={()=>{
          this.setState({
            configStep:null
          })
         }}
				/>
    )
  }

  _renderStep2(){
    let { filterObj,chartData2,configStep,tags } = this.state;
        let {BenchmarkStartDate, BenchmarkEndDate, CalculationStep, BenchmarkModel, IncludeEnergyEffectData,EnergyStartDate,EnergyEndDate,TimePeriods
					,AuxiliaryTagId,AuxiliaryTagName,Triggers,UomId,AuxiliaryTagUomId} 
				   = (configStep===2 || configStep===null)?filterObj.toJS():CreateStore.getEffectItem().toJS();
				return (<Step2
					TagId={filterObj.get('TagId')}
					data={chartData2}
					BenchmarkModel={BenchmarkModel}
					CalculationStep={CalculationStep}
					BenchmarkStartDate={UTC2Local(BenchmarkStartDate)}
					BenchmarkEndDate={UTC2Local(moment(BenchmarkEndDate).add(-1,'days'))}
					IncludeEnergyEffectData={IncludeEnergyEffectData}
					disabledPreview={!this._checkCanNext(2)}
					hasCalendar={this.state.hasCalendar}
					needCalendar={needCalendar(this.context.hierarchyId)}
					checkCalendar={this._checkCalendar}
					AuxiliaryTagId={AuxiliaryTagId}
					AuxiliaryTagName={AuxiliaryTagName}
					TimePeriods={TimePeriods}
					Triggers={Triggers}
					UomId={UomId}
					AuxiliaryTagUomId={AuxiliaryTagUomId}
					onTriggersChanged={(value)=>{
						filterObj=filterObj.set("Triggers",Immutable.fromJS(value));
						this._setFilterObj(filterObj);
					}}
					onAuxiliaryTagChanged={(id,name,step,uomId)=>{
						filterObj=filterObj.set("AuxiliaryTagId",id)
															 .set("AuxiliaryTagName",name)
															 .set("AuxiliaryTagStep",step)
															 .set("AuxiliaryTagUomId",uomId);
						this.setState({
							filterObj:filterObj
						},()=>{
							this._setTagStepTip( CalculationStep);
						})
					}}
					onTimePeriodsChanged={(periods)=>{
						filterObj=filterObj.set("TimePeriods",periods);
						this._setFilterObj(filterObj);
					}}
					onChangeModelType={(type) => {
						filterObj = filterObj.set('BenchmarkModel', type);
						if(type === Model.Manual) {
							this._setTagStepTip( TimeGranularity.Monthly );
							filterObj = filterObj.set('CalculationStep', TimeGranularity.Monthly);
							filterObj = filterObj.set('ContrastStep', TimeGranularity.Monthly);
							filterObj = filterObj.set('BenchmarkStartDate', moment(BenchmarkEndDate).subtract(1, 'years').format('YYYY-MM-DD HH:mm:ss'));
						} else {
							this._setTagStepTip( TimeGranularity.Daily );
							filterObj = filterObj.set('CalculationStep', TimeGranularity.Daily);
							filterObj = filterObj.set('ContrastStep', TimeGranularity.Daily);

						}
						filterObj = filterObj
							.set('IncludeEnergyEffectData', false)
							.set('PredictionDatas', null)
							.set('EnergyUnitPrice', '')
							.set('CorrectionFactor',1)
							.set('EnergyStartDate', null)
							.set('EnergyEndDate', null)
							.set('AuxiliaryTagId', null)
							.set('AuxiliaryTagName', null)
							.set('TimePeriods',Immutable.fromJS([]))
							.set('AuxiliaryTagStep',null)
							.set('AuxiliaryTagUomId',null)
							.set('Triggers',Immutable.fromJS([]))

						if(type === Model.Relation){
							filterObj=filterObj.set('Triggers',Immutable.fromJS([{
								Type:TriggerType.Relation,
								ConditionType:TriggerConditionType.Greater,
								Value:null
							},{
								Type:TriggerType.Actual,
								ConditionType:TriggerConditionType.Greater,
								Value:null
							}]))		
							if(tags){
								let tag=tags.filter(tag=>tag.get("Status")===3);
								if(tag && tag.size>0){
								 filterObj = filterObj.set('AuxiliaryTagId', tag.getIn([0,'TagId']))
																		 .set('AuxiliaryTagName', tag.getIn([0,'Name']))
																		 .set('AuxiliaryTagStep',tag.getIn([0,'Step']))
																		 .set('AuxiliaryTagUomId',tag.getIn([0,'UomId']))
								}	
									this._setFilterObj(filterObj);
									this.setState({
										chartData3: null
									});
							}else{
								this.setState({
									chartData3: null,
									filterObj:filterObj
								},()=>{
									this._getInitData(1);
								})
								
							}					
						}else{
									this._setFilterObj(filterObj);
									this.setState({
										chartData3: null
									});
						}

					
						getPreviewChart2(filterObj.set('ConfigStep', 2).set("CorrectionFactor",1).toJS());
					}}
					onChangeStep={(step) => {						
							if(step===TimeGranularity.Hourly && hasTimePeridsModel(BenchmarkModel)){
								if(needCalendar(this.context.hierarchyId)){
									filterObj=filterObj.set("TimePeriods",Immutable.fromJS([{
										FromTime:8,
										ToTime:20,
										TimePeriodType:CalendarItemType.WorkDayCalcTime,
										ConfigStep:2
									},{
										FromTime:10,
										ToTime:14,
										TimePeriodType:CalendarItemType.RestDayCalcTime,
										ConfigStep:2
									}]))
								}else{
									filterObj=filterObj.set("TimePeriods",Immutable.fromJS([{
										FromTime:8,
										ToTime:20,
										TimePeriodType:CalendarItemType.AllDayCalcTime,
										ConfigStep:2
									}]))
								}
							}else {
								filterObj=filterObj.set("TimePeriods",Immutable.fromJS([]))
							}

								if(step===TimeGranularity.Monthly){
									
										filterObj=filterObj.set("BenchmarkStartDate",date2UTC(moment(UTC2Local(this.props.filterObj.ExecutedTime)).add(1,'days').subtract(12, 'months')));
										filterObj=filterObj.set("BenchmarkEndDate",date2UTC(moment(UTC2Local(this.props.filterObj.ExecutedTime)).add(1,'days')));
										filterObj = filterObj.set('ContrastStep',TimeGranularity.Monthly);
							}

							if(filterObj.get("CalculationStep")===TimeGranularity.Monthly){
										filterObj=filterObj.set("BenchmarkStartDate",date2UTC(moment(UTC2Local(this.props.filterObj.ExecutedTime)).subtract(30, 'days')));
										filterObj=filterObj.set("BenchmarkEndDate",date2UTC(moment(UTC2Local(this.props.filterObj.ExecutedTime)).add(1,'days')));
							}
							

						this._setFilterObj(filterObj.set('CalculationStep', step));
						this._setTagStepTip( step );
						{/*getPreviewChart2(filterObj.set('ConfigStep', 2).set("CorrectionFactor",1).toJS());*/}
						 if(hasTimePeridsModel(BenchmarkModel)){this._checkCalendar()}
					}}
					onChangeBenchmarkStartDate={(val, callback) => {
						val = date2UTC(val);
						filterObj = filterObj.set('BenchmarkStartDate', val);
						let startTime = moment(val),
						endTime = moment(BenchmarkEndDate);

						if( endTime <= moment(startTime) ) {
							endTime = moment(startTime).add(1, 'days');
						} else if( moment(startTime).add(_getTimeRangeStep(CalculationStep), 'days') < endTime ) {
							endTime = moment(startTime).add(_getTimeRangeStep(CalculationStep), 'days');
						}

						{/*if(CalculationStep===TimeGranularity.Hourly){*/}
							endTime=moment(endTime).add(1, 'days');
						{/*}*/}

						if(endTime.format('YYYY-MM-DD HH:mm:ss') !== BenchmarkEndDate) {
							filterObj = filterObj.set('BenchmarkEndDate', endTime.format('YYYY-MM-DD HH:mm:ss'))
						}
						// if( callback && typeof callback === 'function' ) {
						// 	let chartData2State = callback(filterObj);
						// 	this.setState(chartData2State);
						// }
						this._setFilterObj(filterObj);
						this.setState({
							chartData3: null
						});
						getPreviewChart2(filterObj.set("CorrectionFactor",1).set('ConfigStep',2).toJS());
						if(hasTimePeridsModel(BenchmarkModel)){this._checkCalendar(val)}
					}}
					onChangeBenchmarkEndDate={(val) => {

						{/*if(CalculationStep===TimeGranularity.Hourly){*/}
							val=moment(val).add(1, 'days');
						{/*}*/}

						val = date2UTC(val);
						filterObj = filterObj.set('BenchmarkEndDate', val);
						let endTime = moment(val),
						startTime = moment(BenchmarkStartDate);

						if( startTime >= moment(endTime) ) {
							startTime = moment(endTime).subtract(1, 'days');
						} else if( moment(endTime).subtract(_getTimeRangeStep(CalculationStep), 'days') > startTime ) {
							startTime = moment(endTime).subtract(_getTimeRangeStep(CalculationStep), 'days');
						}
						if(startTime.format('YYYY-MM-DD HH:mm:ss') !== BenchmarkStartDate) {
							if(hasTimePeridsModel(BenchmarkModel)){this._checkCalendar(startTime)}
							filterObj = filterObj.set('BenchmarkStartDate', startTime.format('YYYY-MM-DD HH:mm:ss'))
						}
						this._setFilterObj(filterObj);
						this.setState({
							chartData3: null
						});
						getPreviewChart2(filterObj.set("CorrectionFactor",1).set('ConfigStep',2).toJS());
					}}
					onGetChartData={() => {
						let newFilterObj = filterObj.set('IncludeEnergyEffectData', true);
						this._setFilterObj(newFilterObj);
						getPreviewChart2(newFilterObj.set("CorrectionFactor",1).set('ConfigStep',2).toJS());
					}}
					updateChartByNavgatorData={(filterObj) => {
						let {chartData2} = this.state;
						// this.setState((state, props) => {
							return {
								chartData2: chartData2.setIn(['TargetEnergyData', 0, 'EnergyData'],
									getDataByNavgatorData(
										filterObj.get('BenchmarkStartDate'),
										filterObj.get('BenchmarkStartDate'),
										chartData2
									)
								)
							}
						// });
					}}
          configStep={this.state.configStep}
          isView={this.state.configStep!==2}
          onEdit={()=>{
            this.setState({
              configStep:2
            },()=>{
              this._getInitData(2);
            })
          }}
         onSave={()=>{
           var autoEditNextStep=
					 BenchmarkModel!==CreateStore.getEffectItem().get('BenchmarkModel') || !EnergyStartDate || !EnergyEndDate;
           this.setState({
            configStep:autoEditNextStep?3:null,
            chartData3:null,
           },()=>{
						 var times=filterObj.get('TimePeriods');
						 var preTimes=CreateStore.getEffectItem();

					if(times.size!==0 && !Immutable.is(times,preTimes)){						
						var newPeriods=times.filter(item=>item.get("ConfigStep")===2).map(period=>period.set("ConfigStep",3));
						filterObj=filterObj.set("TimePeriods",times.filter(item=>item.get("ConfigStep")===2).concat(newPeriods));
					}

             if(autoEditNextStep){
               updateItem(filterObj.set('ConfigStep',3).toJS(),this.state.chartData2,null);
             }else{
                updateItem(filterObj.toJS())
             }
             
           })
         }
         } 
         onCancel={()=>{
          this.setState({
            configStep:null,
            filterObj:CreateStore.getEffectItem()
          })
         }} 
				/>);
  }

  _renderStep3(){
    let { filterObj,chartData3,chartData2,configStep} = this.state;
    let {UomId, BenchmarkModel, CalculationStep, EnergyStartDate, EnergyEndDate, EnergyUnitPrice, BenchmarkDatas,CorrectionFactor,TimePeriods}
				 = (configStep===3 || configStep===null)?filterObj.toJS():CreateStore.getEffectItem().toJS();
				return (<Step3
					unit={UomId ? UOMStore.getUomById(UomId) : (chartData2 ? getUomByChartData(chartData2) : '')}
					data={chartData3}
					BenchmarkModel={BenchmarkModel}
					CalculationStep={CalculationStep}
					EnergyUnitPrice={EnergyUnitPrice}
					EnergyStartDate={UTC2Local(EnergyStartDate)}
					EnergyEndDate={EnergyEndDate?UTC2Local(moment(EnergyEndDate).add(-1,'days')):EnergyEndDate}
					BenchmarkDatas={BenchmarkDatas}
					CorrectionFactor={CorrectionFactor}
					disabledPreview={!this._checkCanNext(3)}
					needCalendar={needCalendar(this.context.hierarchyId)}
					TimePeriods={TimePeriods}
					onTimePeriodsChanged={(periods)=>{
						filterObj=filterObj.set("TimePeriods",periods);
						this._setFilterObj(filterObj);
					}}
					onChangeEnergyUnitPrice={(val) => {
						this._setFilterObj(filterObj.set('EnergyUnitPrice', val));
					}}
					onChangeCorrectionFactor={(val) => {
						this._setFilterObj(filterObj.set('CorrectionFactor', val));
					}}
					onChangeEnergyStartDate={(val) => {
						val = date2UTC(val);
						filterObj = filterObj.set('EnergyStartDate', val);
						let startTime = moment(val),
						endTime = moment(EnergyEndDate);

						if( EnergyEndDate ) {
							if( endTime <= moment(startTime) ) {
								endTime = moment(startTime).add(1, 'days');
							} /*else if( moment(startTime).add(_getTimeRangeStep(CalculationStep), 'days') < endTime ) {
								endTime = moment(startTime).add(_getTimeRangeStep(CalculationStep), 'days');
							}*/
							if(endTime.format('YYYY-MM-DD HH:mm:ss') !== EnergyEndDate) {
								filterObj = filterObj.set('EnergyEndDate', endTime.format('YYYY-MM-DD HH:mm:ss'))
							}

							filterObj = filterObj.set('BenchmarkDatas', getDateObjByRange(val, EnergyEndDate));
							filterObj = filterObj.set('PredictionDatas', getDateObjByRange(val, EnergyEndDate));
						}
						this._setFilterObj(filterObj);
					}}
					onChangeEnergyEndDate={(val) => {
						val=moment(val).add(1, 'days');
						val = date2UTC(val);
						filterObj = filterObj.set('EnergyEndDate', val);
						let endTime = moment(val),
						startTime = moment(EnergyStartDate);

						if( EnergyStartDate ) {
							if( startTime >= moment(endTime) ) {
								startTime = moment(endTime).subtract(1, 'days');
							} /*else if( moment(endTime).subtract(_getTimeRangeStep(CalculationStep), 'days') > startTime ) {
								startTime = moment(endTime).subtract(_getTimeRangeStep(CalculationStep), 'days');
							}*/
							if(startTime.format('YYYY-MM-DD HH:mm:ss') !== EnergyStartDate) {
								filterObj = filterObj.set('EnergyStartDate', startTime.format('YYYY-MM-DD HH:mm:ss'))
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
						getPreviewChart3(filterObj.set("ConfigStep",3).toJS());
					}}
          configStep={this.state.configStep}
          isView={this.state.configStep!==3}
          onEdit={()=>{
            this.setState({
              configStep:3
            },()=>{
              this._getInitData(3);
            })
          }}
         onSave={()=>{
           var autoEditNextStep=EnergyStartDate!==CreateStore.getEffectItem().get('EnergyStartDate') || EnergyEndDate!==CreateStore.getEffectItem().get('EnergyEndDate');
           this.setState({
            configStep:autoEditNextStep?4:null
           },()=>{
             if(autoEditNextStep){
               updateItem(filterObj.set('ConfigStep',4).toJS())
             }else{
                updateItem(filterObj.toJS())
             }
             {/*this._getInitData(3);*/}
           })
         }
         } 
         onCancel={()=>{
          this.setState({
            configStep:null,
            filterObj:CreateStore.getEffectItem()
          })
         }} 
				/>);
  }

	_renderStep4(){
		let { filterObj,chartData2,configStep} = this.state;
			let {UomId, EnergyStartDate, EnergyEndDate, CalculationStep, PredictionDatas, BenchmarkStartDate, BenchmarkEndDate, ContrastStep} 
			= (configStep===4 || configStep===null)?filterObj.toJS():CreateStore.getEffectItem().toJS();
				return (<Step4
					unit={UomId ? UOMStore.getUomById(UomId) : (chartData2 ? getUomByChartData(chartData2) : '')}
					EnergyStartDate={UTC2Local(EnergyStartDate)}
					EnergyEndDate={UTC2Local(EnergyEndDate)}
					CalculationStep={CalculationStep}
					PredictionDatas={PredictionDatas}
					BenchmarkStartDate={BenchmarkStartDate}
					BenchmarkEndDate={BenchmarkEndDate}
					ContrastStep={ContrastStep}
					disabledPreview={!this._checkCanNext(4)}
					onChangePredictionDatas={(idx, val) => {
						this._setFilterObj(filterObj.setIn(['PredictionDatas', idx, 'Value'], val));
					}}
					onChangeContrastStep={(val) => {
						this._setFilterObj(filterObj.setIn(['ContrastStep'], val));
					}}
					configStep={this.state.configStep}
          isView={this.state.configStep!==4}
          onEdit={()=>{
            this.setState({
              configStep:4
            })
          }}
         onSave={()=>{      
           this.setState({
            configStep:null
           },()=>{
             updateItem(filterObj.set('ConfigStep',5).toJS())
           })
         }
         } 
         onCancel={()=>{
          this.setState({
            configStep:null,
            filterObj:CreateStore.getEffectItem()
          })
         }} 
				/>)
	}
   componentDidMount(){
      getItem(this.props.effect.get('EnergyEffectItemId'));
    }

  render(){
  let { onClose,editTagName} = this.props;


    if(this.state.filterObj===null){
      let {EnergyProblemId, SolutionTitle,ExecutedTime} = this.props.effect.toJS();
      return(
      <div className='jazz-save-effect-create'>
      	<Header name={
					SolutionTitle + (
						' - '
						 + editTagName

					)

				} timeStr={moment(ExecutedTime).add(8, 'hours').format('YYYY-MM-DD HH:mm')} onShowDetail={() => {
					this.setState((state, props) => {
						return { measureShow: true };
					});
					getEnergySolution(EnergyProblemId);
					MeasuresAction.getSupervisor(this.context.hierarchyId);
				}} onClose={() => {
					if( this.state.configStep!==null ) {
						this.setState({
							closeDlgShow: true
						});
					} else {
						this._onClose(false);
					}
				}}/>
         <div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>
         {this.state.measureShow && this._renderMeasureDialog()}
    </div>
      )
    }
    else{
       let {EnergyProblemId, SolutionTitle,ExecutedTime, EnergySystem, ConfigStep, UomId, TagId, TagName} = this.state.filterObj.toJS();
			 var uom=UomId ? UOMStore.getUomById(UomId) :
							(this.state.chartData2 ? getUomByChartData(this.state.chartData2) : '');
    return(
    <div className='jazz-save-effect-create' style={{overflowY:'auto',display:'block'}}>     
      	<Header name={SolutionTitle + (
						' - '
						 + (
						 	editTagName
						 )
						 + (uom?'（' + uom+ '）':'')
					)
				} timeStr={moment(ExecutedTime).add(8, 'hours').format('YYYY-MM-DD HH:mm')} onShowDetail={() => {
					this.setState((state, props) => {
						return { measureShow: true };
					});
					getEnergySolution(EnergyProblemId);
					MeasuresAction.getSupervisor(this.context.hierarchyId);
				}} onClose={() => {
          {/*this._onClose(false);*/}
					if(this.state.configStep!==null ) {
						this.setState({
							closeDlgShow: true
						});
					} else {
						if(Immutable.is(CreateStore.getOriginEffectItem(),this.state.filterObj)){
							this._onClose(false);
						}else{
						this._onSaveAndClose(false);
						}

					}
				}}/>
          {this.state.measureShow && this._renderMeasureDialog()}
          {this._renderStep1()}
          {this._renderStep2()}
          {this._renderStep3()}
					{this._renderStep4()}
				<NewDialog open={this.state.closeDlgShow} actionsContainerStyle={{textAlign: 'right'}} actions={[
					<NewFlatButton primary label={I18N.Common.Button.Save} onClick={this._onSaveAndClose}/>,
					<NewFlatButton style={{marginLeft: 24}} secondary label={I18N.Common.Button.Cancel2} onClick={() =>{
						this._onClose(false);
					}}/>
				]}>{I18N.SaveEffect.Create.LeaveTip}</NewDialog>
          <NewDialog open={this.state.showStepTip} actions={[
					<NewFlatButton style={{marginLeft: 24}} secondary label={I18N.Common.Button.Confirm} onClick={() =>{
						this.setState((state, props) => {
							return {
								showStepTip: false
							}
						});
					}}/>
				]}>
					{I18N.SaveEffect.Create.StepTip}
				</NewDialog>

    </div>
    )
    }


  }

}

Edit.propTypes= {
  effect:PropTypes.object,
  editTagName:PropTypes.string,
  onClose:PropTypes.func,
};
