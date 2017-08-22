import React, { Component, PropTypes } from 'react';
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
import {Model} from 'constants/actionType/Effect.jsx';

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

const ASC_STEP = [
	TimeGranularity.None,
	TimeGranularity.Minite,
	TimeGranularity.Min15,
	TimeGranularity.Min30,
	TimeGranularity.Hourly,
	TimeGranularity.Hour2,
	TimeGranularity.Hour4,
	TimeGranularity.Hour6,
	TimeGranularity.Hour8,
	TimeGranularity.Hour12,
	TimeGranularity.Daily,
	TimeGranularity.Weekly,
	TimeGranularity.Monthly,
	TimeGranularity.Yearly,
];

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
				<div className='hiddenEllipsis' style={{fontWeight:'600',fontSize:'16px',color:'#0f0f0f'}}>{I18N.SaveEffect.CreateTitle + ' ' + name}</div>
				<div style={{marginTop: 10}}>
					{I18N.SaveEffect.Runtime + ': ' + timeStr}
					<a style={{marginLeft: 30, color: '#32ad3d'}} href='javascript:void(0)' onClick={onShowDetail}>{I18N.SaveEffect.ShowSavePlanDetail}</a>
				</div>
			</div>
			<IconButton style={{position: 'fixed', right: 14, top: 14}} iconClassName='icon-close' onClick={onClose}/>
		</header>
	);
}

export function getDateObjByRange(startDate, endDate) {
	let result = [],
	existYears = [],
	increment = 0,
	incrementDate;
	startDate = UTC2Local(startDate);
	endDate = UTC2Local(endDate);
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
		ContrastStep: TimeGranularity.Monthly,
		ConfigStep: state.ConfigStep,
		IncludeEnergyEffectData: false,
	},...state.filterObj.toJS(),...{		
		BenchmarkDatas: (!state.filterObj.get("BenchmarkDatas") || state.filterObj.get("BenchmarkDatas").size === 0 && state.filterObj.get("EnergyStartDate") && state.filterObj.get("EnergyStartDate")) ? 
							getDateObjByRange(state.filterObj.get("EnergyStartDate"), state.filterObj.get("EnergyStartDate")) :
							state.filterObj.get("BenchmarkDatas"),
		PredictionDatas: (!state.filterObj.get("PredictionDatas") || state.filterObj.get("PredictionDatas").size === 0 && state.filterObj.get("EnergyStartDate") && state.filterObj.get("EnergyStartDate")) ? 
							getDateObjByRange(state.filterObj.get("EnergyStartDate"), state.filterObj.get("EnergyStartDate")) :
							state.filterObj.get("PredictionDatas"),
	}});
}

@ReduxDecorator
export default class Edit extends Component {

  	static calculateState = (state, props, ctx,isRefresh) => {
		return {
			tags: CreateStore.getTagsByPlan() && CreateStore.getTagsByPlan().map(tag => Immutable.fromJS({
				TagId: tag.get('TagId'),
				Name: tag.get('Name'),
				Configed: !!tag.get('Configed') || !!tag.get('EnergyEffectItemId'),
				isNew: tag.get('isNew'),
				Status: tag.get('Status'),
				Step: tag.get('Step'),
			})),
			chartData2: CreateStore.getChartData2(),
			chartData3: CreateStore.getChartData3(),
			energySolution: CreateStore.getEnergySolution(),
			supervisorList:MeasuresStore.getSupervisor(),
      // filterObj:CreateStore.getEffectItem()
      filterObj:(!state || isRefresh)?CreateStore.getEffectItem():state.filterObj
		}
	};
	static getStores = () => [CreateStore, MeasuresStore];
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
      configStep:null
		}
    

		this._onSaveAndClose = this._onSaveAndClose.bind(this);
		this._getInitData = this._getInitData.bind(this);
	}

	_getInitData(step, props = this.props, state = this.state) {
		switch( step ) {
			case 1:
				getTagsByPlan(state.filterObj.get('EnergyProblemId'));
				break;
			case 2:
				getPreviewChart2(this._getFilterObj().set('ConfigStep', 2).toJS());
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
		let propsStep = this.state.filterObj.get("Step");
		return propsStep ?
			checkSupportStep(propsStep, calcStep) :
			checkStepByTag(this.state.filterObj.get('TagId'), calcStep);
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
				return this.state.chartData2 && this._checkStepByTag(this.state.filterObj.get('CalculationStep'));
				break;
			case 3:
				let {EnergyStartDate, EnergyEndDate, EnergyUnitPrice, BenchmarkDatas, BenchmarkModel} = this.state.filterObj.toJS();
				if( !EnergyStartDate || !EnergyEndDate || !EnergyUnitPrice ||  !/^(\-?)\d{1,9}([.]\d{1,3})?$/.test(EnergyUnitPrice) ) {
					return false;
				}
				if( BenchmarkModel === Model.Manual ) {
					return BenchmarkDatas.reduce((result, current) => {
						return result && !!current.Value && /^(\-?)\d{1,9}([.]\d{1,3})?$/.test(current.Value);
					}, true);
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
	      hasClose
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

  _renderStep1(){
    let { tags,filterObj } = this.state;
    return(
      <Step1
          tagName={filterObj.get('TagName')}
					tags={tags}
					selectedId={filterObj.get('TagId')}
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
           (TagId,TagName) => {
						this.setState((state, props) => {
							return {
								chartData2: null,
								chartData3: null,
                configStep:2
							}
						},()=>{              
              updateItem(getInitFilterObj(this.state)
								          .set('TagId', TagId)
                          .set('TagName',TagName)
                          .set('ConfigStep',2)
													.set('EnergyStartDate', null)
													.set('EnergyEndDate', null)
                          .toJS(),null,null);
              this._getInitData(2);
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
    let { filterObj,chartData2,configStep } = this.state;
        let {BenchmarkStartDate, BenchmarkEndDate, CalculationStep, BenchmarkModel, IncludeEnergyEffectData,EnergyStartDate,EnergyEndDate} 
				   = (configStep===2 || configStep===null)?filterObj.toJS():CreateStore.getEffectItem().toJS();
				return (<Step2
					TagId={filterObj.get('TagId')}
					data={chartData2}
					BenchmarkModel={BenchmarkModel}
					CalculationStep={CalculationStep}
					BenchmarkStartDate={UTC2Local(BenchmarkStartDate)}
					BenchmarkEndDate={UTC2Local(BenchmarkEndDate)}
					IncludeEnergyEffectData={IncludeEnergyEffectData}
					disabledPreview={!this._checkCanNext(2)}
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
							// .set('IncludeEnergyEffectData', null)
							.set('PredictionDatas', null)
							.set('EnergyUnitPrice', '')
							.set('EnergyStartDate', null)
							.set('EnergyEndDate', null)
						this._setFilterObj(filterObj);
						this.setState({
							chartData3: null
						});
						getPreviewChart2(filterObj.set('ConfigStep', 2).toJS());
					}}
					onChangeStep={(step) => {
						this._setFilterObj(filterObj.set('CalculationStep', step));
						this._setTagStepTip( step );
						getPreviewChart2(filterObj.set('ConfigStep', 2).toJS());
					}}
					onChangeBenchmarkStartDate={(val, callback) => {
						val = date2UTC(val);
						filterObj = filterObj.set('BenchmarkStartDate', val);
						let startTime = moment(val),
						endTime = moment(BenchmarkEndDate);

						if( endTime < moment(startTime) ) {
							endTime = moment(startTime).add(1, 'days');
						} else if( moment(startTime).add(_getTimeRangeStep(CalculationStep), 'days') < endTime ) {
							endTime = moment(startTime).add(_getTimeRangeStep(CalculationStep), 'days');
						}
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
						getPreviewChart2(filterObj.toJS());
					}}
					onChangeBenchmarkEndDate={(val) => {
						val = date2UTC(val);
						filterObj = filterObj.set('BenchmarkEndDate', val);
						let endTime = moment(val),
						startTime = moment(BenchmarkStartDate);

						if( startTime > moment(endTime) ) {
							startTime = moment(endTime).subtract(1, 'days');
						} else if( moment(endTime).subtract(_getTimeRangeStep(CalculationStep), 'days') > startTime ) {
							startTime = moment(endTime).subtract(_getTimeRangeStep(CalculationStep), 'days');
						}
						if(startTime.format('YYYY-MM-DD HH:mm:ss') !== BenchmarkStartDate) {
							filterObj = filterObj.set('BenchmarkStartDate', startTime.format('YYYY-MM-DD HH:mm:ss'))
						}
						this._setFilterObj(filterObj);
						this.setState({
							chartData3: null
						});
						getPreviewChart2(filterObj.toJS());
					}}
					onGetChartData={() => {
						let newFilterObj = filterObj.set('IncludeEnergyEffectData', true);
						this._setFilterObj(newFilterObj);
						getPreviewChart2(newFilterObj.toJS());
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
    let {UomId, BenchmarkModel, CalculationStep, EnergyStartDate, EnergyEndDate, EnergyUnitPrice, BenchmarkDatas}
				 = (configStep===3 || configStep===null)?filterObj.toJS():CreateStore.getEffectItem().toJS();
				return (<Step3
					unit={UomId ? UOMStore.getUomById(UomId) : (chartData2 ? getUomByChartData(chartData2) : '')}
					data={chartData3}
					BenchmarkModel={BenchmarkModel}
					CalculationStep={CalculationStep}
					EnergyUnitPrice={EnergyUnitPrice}
					EnergyStartDate={UTC2Local(EnergyStartDate)}
					EnergyEndDate={UTC2Local(EnergyEndDate)}
					BenchmarkDatas={BenchmarkDatas}
					disabledPreview={!this._checkCanNext(3)}
					onChangeEnergyUnitPrice={(val) => {
						this._setFilterObj(filterObj.set('EnergyUnitPrice', val));
					}}
					onChangeEnergyStartDate={(val) => {
						val = date2UTC(val);
						filterObj = filterObj.set('EnergyStartDate', val);
						let startTime = moment(val),
						endTime = moment(EnergyEndDate);

						if( EnergyEndDate ) {
							if( endTime < moment(startTime) ) {
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
						val = date2UTC(val);
						filterObj = filterObj.set('EnergyEndDate', val);
						let endTime = moment(val),
						startTime = moment(EnergyStartDate);

						if( EnergyStartDate ) {
							if( startTime > moment(endTime) ) {
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
						getPreviewChart3(filterObj.toJS());
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
      let {EnergyProblemId, EnergySolutionName, ExecutedTime} = this.props.effect.toJS();
      return(
      <div className='jazz-save-effect-create'>
      	<Header name={
					EnergySolutionName + (
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
         {this._renderMeasureDialog()}
    </div>
      )
    }
    else{
       let {EnergyProblemId, EnergySolutionName, ExecutedTime, EnergySystem, ConfigStep, UomId, TagId, TagName} = this.state.filterObj.toJS();
			 console.log(EnergySolutionName);
    return(
    <div className='jazz-save-effect-create' style={{overflowY:'auto',display:'block'}}>     
      	<Header name={EnergySolutionName + (
						' - '
						 + (
						 	editTagName
						 )
						 + '（' + (
							UomId ? UOMStore.getUomById(UomId) :
							(this.state.chartData2 ? getUomByChartData(this.state.chartData2) : '')
						) + '）'
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
						this._onClose(false);
					}
				}}/>
          {this._renderMeasureDialog()}
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

Edit.propTypes = {
  effect:React.PropTypes.object,
  editTagName:React.PropTypes.string,
  onClose:React.PropTypes.func,
};
