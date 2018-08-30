import React, { Component} from 'react';
import Regex from 'constants/Regex.jsx';
import ActionVisibility from 'material-ui/svg-icons/action/visibility';
import CircularProgress from 'material-ui/CircularProgress';
import find from 'lodash-es/find';
import _ from 'lodash-es';
import moment from 'moment';
import PropTypes from 'prop-types';
import TimeGranularity from 'constants/TimeGranularity.jsx';
import {Model,CalendarItemType,TriggerType,TriggerConditionType} from 'constants/actionType/Effect.jsx';

import Util, {dateAdd} from 'util/Util.jsx';

import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import ViewableDatePicker from 'controls/ViewableDatePicker.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';

import {ChartDateFilter} from 'components/Diagnose/CreateDiagnose.jsx';
import ChartBasicComponent from 'components/DataAnalysis/Basic/ChartBasicComponent.jsx';
import FontIcon from 'material-ui/FontIcon';
import util from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';
import TimePeriodComp from './time_period_comp.jsx';
import Immutable from 'immutable';
import TagSelect from'../../KPI/Single/TagSelect.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';

import {RadioButton} from 'material-ui/RadioButton';
import Popover from 'material-ui/Popover/Popover';

import Paper from 'material-ui/Paper';

const CALENDAR_TYPE_WORKTIME = 2;
const CALENDAR_TYPE_NO_WORKTIME = 3;
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

let getStepDataItems = (model) =>{
	switch (model) {
		case Model.Contrast:
		case Model.Manual:
				return [{ id: TimeGranularity.Daily, label: I18N.EM.Day },
								{ id: TimeGranularity.Monthly, label: I18N.EM.Month }]
			break;
		case Model.Easy:
		case Model.Efficiency:
				return [{ id: TimeGranularity.Hourly, label: I18N.EM.Hour },
								{ id: TimeGranularity.Daily, label: I18N.EM.Day }]
			break;
		case Model.Increment:
		case Model.Simulation:
				return [{ id: TimeGranularity.Hourly, label: I18N.EM.Hour },
								{ id: TimeGranularity.Daily, label: I18N.EM.Day },
								{ id: TimeGranularity.Monthly, label: I18N.EM.Month }]
			break;
		case Model.Relation:
				return [{ id: TimeGranularity.Minite, label: I18N.EM.Raw },
								{ id: TimeGranularity.Hourly, label: I18N.EM.Hour },
								{ id: TimeGranularity.Daily, label: I18N.EM.Day },
								{ id: TimeGranularity.Monthly, label: I18N.EM.Month }]
			break;
	}
}

let timeoutID = null;

export default class Step2 extends Component {
	static contextTypes = {
		hierarchyId: PropTypes.string,
		currentRoute:PropTypes.object,
	};
	constructor(props) {
		super(props);
		this._afterChartCreated = this._afterChartCreated.bind(this);
		this.OnNavigatorChanged = this.OnNavigatorChanged.bind(this);
	}
	state={
		showRefresh:false,
		showTagSelectDialog:false,
		showModelTip:false
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

	_getHierarchyId(context) {
		return context.hierarchyId;
	}

	_getHierarchyName(context){
  	return find(HierarchyStore.getBuildingList(), building => building.Id === context.hierarchyId * 1 ).Name;
	}

	_renderAllDayTimes(){
		var {TimePeriods,onTimePeriodsChanged}=this.props;
		var items=[];
		TimePeriods.forEach(time=>{
			if(time.TimePeriodType===CalendarItemType.AllDayCalcTime && time.ConfigStep===2){
				items.push(time)
			}
		})

		return(
				<div className='calendar-content'>
					<TimePeriodComp
						workRuningTimes={items}
						title={I18N.SaveEffect.Create.CaculateTime}
						type={CalendarItemType.AllDayCalcTime}
						onAddWorkTime={() => {
							TimePeriods.push({
								TimePeriodType: CalendarItemType.AllDayCalcTime,
								FromTime: 8,
								ToTime: 20,
								ConfigStep:2
							});
							onTimePeriodsChanged(Immutable.fromJS(TimePeriods));
						}}
						onDeleteWorkTime={(data) => {
							let idx=_.findIndex(TimePeriods,item=>item===data);
							TimePeriods.splice(idx, 1);
							onTimePeriodsChanged(Immutable.fromJS(TimePeriods));
						}}
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
			if(time.TimePeriodType===CalendarItemType.WorkDayCalcTime && time.ConfigStep===2){
				workItems.push(time)
			}else if(time.TimePeriodType===CalendarItemType.RestDayCalcTime && time.ConfigStep===2){
				holidayItems.push(time)
			}

		})

		return(
			<div className='calendar-content'>

					<TimePeriodComp
						workRuningTimes={workItems}
						title={I18N.SaveEffect.Create.WorkCaculateTime}
						type={CalendarItemType.WorkDayCalcTime}
						onAddWorkTime={() => {
							TimePeriods.push({
								TimePeriodType: CalendarItemType.WorkDayCalcTime,
								FromTime: 8,
								ToTime: 20,
								ConfigStep:2
							});
							onTimePeriodsChanged(Immutable.fromJS(TimePeriods));
						}}
						onDeleteWorkTime={(data) => {
							let idx=_.findIndex(TimePeriods,item=>item===data);
							TimePeriods.splice(idx, 1);
							onTimePeriodsChanged(Immutable.fromJS(TimePeriods));
						}}
						onChangeWorkTime={(data, type, val) => {
							let idx=_.findIndex(TimePeriods,item=>item===data);
							TimePeriods[idx][type] = val/60;
							onTimePeriodsChanged(Immutable.fromJS(TimePeriods));
						}}/>
								<TimePeriodComp
						workRuningTimes={holidayItems}
						title={I18N.SaveEffect.Create.HolidayCaculateTime}
						type={CalendarItemType.RestDayCalcTime}
						onAddWorkTime={() => {
							TimePeriods.push({
								TimePeriodType: CalendarItemType.RestDayCalcTime,
								FromTime: 10,
								ToTime: 14,
								ConfigStep:2
							});
							onTimePeriodsChanged(Immutable.fromJS(TimePeriods));
						}}
						onDeleteWorkTime={(data) => {
							let idx=_.findIndex(TimePeriods,item=>item===data);
							TimePeriods.splice(idx, 1);
							onTimePeriodsChanged(Immutable.fromJS(TimePeriods));
						}}
						onChangeWorkTime={(data, type, val) => {
							let idx=_.findIndex(TimePeriods,item=>item===data);
							TimePeriods[idx][type] = val/60;
							onTimePeriodsChanged(Immutable.fromJS(TimePeriods));
						}}/>
				</div>
		)

	}

	_renderConfigCalendar(){
		return(
			this.state.showRefresh?
				<div>
					<div style={{fontSize: '12px',color:'#9fa0a4',marginTop:'23px'}}>{I18N.SaveEffect.Create.CaculateTime}</div>
					<div className="no_weather_config">
								<div onClick={()=>{
									this.setState({
										showRefresh:false,
									},()=>{
										this.props.checkCalendar();
									})}}>{I18N.Common.Button.Refresh}</div>
									<FontIcon className="icon-sync" color="#32ad3c" style={{fontSize:'14px',lineHeight:'14px',marginLeft:'8px'}}/>
							</div>
				</div>

				:<div>
					<div style={{fontSize: '12px',color:'#9fa0a4',marginTop:'23px'}}>{I18N.SaveEffect.Create.CaculateTime}</div>
						<div className="calendar_no_config">
							<span>{I18N.Setting.DataAnalysis.Weather.To}</span>
         				 <div onClick={()=>{
                            this.setState({
                              showRefresh:true
                            },()=>{
                              util.openTab(RoutePath.customerSetting.hierNode(this.context.currentRoute.params)+'/'+this._getHierarchyId(this.context)+'?init_hierarchy_id='+this.context.hierarchyId)
                            })
            }}>{I18N.Setting.Calendar.TabName}</div>
          <span>{I18N.Setting.DataAnalysis.Weather.Config}</span>


			</div>
				</div>


		)
		}

	_renderTimePeriods(){
		let {BenchmarkModel,CalculationStep,needCalendar,hasCalendar } = this.props;
		if(CalculationStep===TimeGranularity.Monthly) return null;
		if(BenchmarkModel !== Model.Easy && BenchmarkModel !== Model.Increment && BenchmarkModel !== Model.Efficiency) return null

		if(hasCalendar==='loading'){
			return(
				 <div className="calendar_no_config" style={{marginTop:'50px'}}>
            <CircularProgress  mode="indeterminate" size={40} />
         </div>
			)
		}

		if(CalculationStep===TimeGranularity.Daily){
			if(needCalendar && !hasCalendar){
			return this._renderConfigCalendar()
			}
			return null
		}

		if(CalculationStep===TimeGranularity.Hourly){
			if(needCalendar){
				if(hasCalendar){
					return this._renderWorkAndHolidayTimes()
				}else{
					return this._renderConfigCalendar()
				}
			}else{
				return this._renderAllDayTimes()
			}
		}


	}

	_renderAuxiliaryTag(){
		let {AuxiliaryTagId,AuxiliaryTagName,BenchmarkModel}=this.props;
		var content;

		if(AuxiliaryTagId!==null){
			content=<div className="row">
				<div className="tag_name" title={AuxiliaryTagName}>{AuxiliaryTagName}</div>
				<div className="edit_btn" onClick={()=>{this.setState({showTagSelectDialog:true})}}>{I18N.Common.Button.Edit}</div>
			</div>
		}else{
			    var styles={
							button:{
								height:'30px',
								lineHeight:'28px',
							},
							label:{
								fontSize:'14px',
								lineHeight:'14px',
								verticalAlign:'baseline',
								border:'none'
							}
						};

					content=<NewFlatButton label={I18N.Setting.Tag.Tag} labelStyle={styles.label} secondary={true}
                     icon={<FontIcon className="icon-add" style={styles.label}/>} style={styles.button}
                     onClick={()=>{
                       this.setState({
                         showTagSelectDialog:true
                       })
                     }}/>
		}

		return(
			<div className="auxiliary_tag">
				<header className='title' style={{marginBottom:'14px'}}>{BenchmarkModel===Model.Relation?I18N.Setting.Organization.AssociateTag:I18N.SaveEffect.Create.AuxiliaryTag}</header>
				{content}
			</div>
		)
	}

	_renderTagSelect(){
		let {onAuxiliaryTagChanged}=this.props;
		let tagSelectProps={
    	key:'tagselect',
      title:I18N.EM.Report.SelectTag,
    	hierarchyId:this._getHierarchyId(this.context),
    	hierarchyName:this._getHierarchyName(this.context),
    	onSave:(tag)=>{
				this.setState({
					showTagSelectDialog:false
				},()=>{
					onAuxiliaryTagChanged(tag.get("Id"),tag.get("Name"),tag.get("CalculationStep"),tag.get("UomId"))
				})
			},
    	onCancel:()=>{this.setState({showTagSelectDialog:false})}
    };

		return(
			<TagSelect {...tagSelectProps}/>
		)
	}

	_renderFormula(){
		var labelingLevels=this.props.data.get("LabelingLevels");

		if(labelingLevels===null) return null;

		var R2=labelingLevels.find(item=>item.get("Name")==='R2').get("Value"),
				B=labelingLevels.find(item=>item.get("Name")==='B').get("Value"),
				A=labelingLevels.find(item=>item.get("Name")==='A').get("Value");

		return `<div style="display:flex;flex-direction:row;align-items: center">
		 					<div style="font-size:14px;color:#626469">${I18N.Setting.DataAnalysis.Scatter.Formula+': '}</div>
							<div style="margin-left:10px;color:#6cacdd"> R<sup>2</sup>=${R2}</div>
							<div style="margin-left:20px;color:#6cacdd"> y=${B}x${A<0?'':'+'}${A}</div>
						</div>`

	}

	_renderTriggers(){
		let {Triggers,onTriggersChanged,UomId,AuxiliaryTagUomId}=this.props;
		let uom=Util.getUomById(UomId)&& Util.getUomById(UomId).Code?`(${Util.getUomById(UomId).Code})`:'',
				auxiliaryUom=Util.getUomById(AuxiliaryTagUomId) && Util.getUomById(AuxiliaryTagUomId).Code?`(${Util.getUomById(AuxiliaryTagUomId).Code})`:'';

		var styles={
				group:{
					display:'flex',
					flexDirection:'row',
					alignItems:'center',
					height:'30px'
				},
				label:{
					fontSize: '14px',
					color:'#434343',
					width:'45px'
				},
				icon:{
					width:'16px',
					height:'16px',
					marginRight:'10px',
					marginTop:'2px'
				},
				selectedBtn:{
					borderRadius:'2px',zIndex:'2',border:'1px solid #32ad3c',backgroundColor:"#32ad3c",color:"#ffffff",width:'100px',height:'30px',lineHeight:'28px'
				},
				btn:{
					width:'100px',height:'30px',lineHeight:'28px',borderRadius: '2px',border: 'solid 1px #9fa0a4',color:'#0f0f0f'
				}
			};

		return(
			<div>
				<div style={{fontSize: '12px',color:'#9fa0a4',marginTop:'23px'}}>{I18N.SaveEffect.Create.AuxiliaryTrigger+auxiliaryUom}</div>
				<div style={styles.group}>
					<RadioButton
						checked={Triggers[0].ConditionType === TriggerConditionType.Greater}
						value={TriggerConditionType.Greater}
						label={I18N.SaveEffect.Create.Greater}
						style={{width:'70px'}}
						labelStyle={styles.label}
						iconStyle={styles.icon}
						onCheck={()=>{
							Triggers[0].ConditionType=TriggerConditionType.Greater;
							Triggers[0].Value=null;
							onTriggersChanged(Triggers)
							}}
						/>
						{Triggers[0].ConditionType === TriggerConditionType.Greater &&
							<ViewableTextField errorMessage={I18N.SaveEffect.Create.TriggerVaildTip} regex={Regex.TagRule} style={{marginTop:'10px',width:150}}
																 hintText={I18N.SaveEffect.Create.AuxiliaryHint} defaultValue={Triggers[0].Value} didChanged={(value)=>{
																		Triggers[0].Value=value;
																		onTriggersChanged(Triggers)
																 }}/>}

				</div>
				<div style={styles.group}>
					<RadioButton
						checked={Triggers[0].ConditionType === TriggerConditionType.Less}
						value={TriggerConditionType.Less}
						label={I18N.SaveEffect.Create.Less}
						style={{width:'70px'}}
						labelStyle={styles.label}
						iconStyle={styles.icon}
						onCheck={()=>{
							Triggers[0].ConditionType=TriggerConditionType.Less;
							Triggers[0].Value=null;
							onTriggersChanged(Triggers)
							}}
						/>
						{Triggers[0].ConditionType === TriggerConditionType.Less &&
							<ViewableTextField errorMessage={I18N.SaveEffect.Create.TriggerVaildTip} regex={Regex.TagRule} style={{marginTop:'10px',width:150}}
																 hintText={I18N.SaveEffect.Create.AuxiliaryHint} defaultValue={Triggers[0].Value} didChanged={(value)=>{
																		Triggers[0].Value=value;
																		onTriggersChanged(Triggers)
																 }}/>}

				</div>

				<div style={{fontSize: '12px',color:'#9fa0a4',marginTop:'23px'}}>{I18N.SaveEffect.Create.ActualTrigger+uom}</div>
				<div style={styles.group}>
							<div style={{fontSize:'14px',color:'#434343'}}>{I18N.SaveEffect.Create.Greater}</div>
							<ViewableTextField errorMessage={I18N.SaveEffect.Create.TriggerVaildTip} regex={Regex.TagRule} style={{marginTop:'10px',marginLeft:'15px',width:150}}
																 hintText={I18N.SaveEffect.Create.ActualHint} defaultValue={Triggers[1].Value} didChanged={(value)=>{
																		Triggers[1].Value=value;
																		onTriggersChanged(Triggers)
																 }}/>
						</div>


							</div>
		)
	}

	_renderModelTip(){
		return(
			<div style={{position:'absolute',
						top:'-1px',
						right:'50px'}}
						onMouseLeave={(e)=>{
																if(this.state.showModelTip){
																					this.setState({
																					showModelTip:false,
																				})}

																			}}>
				<div className="model-tip" onMouseEnter={(e)=>{
																											this.setState({
																												showModelTip:true,
																												anchorEl:{
																													x:e.target.getBoundingClientRect().top,
																													y:e.target.getBoundingClientRect().left,
																												}
																											})
																											}}
																	   >
				<FontIcon className="icon-explain-n" style={{fontSize:'14px',color:'#9fa0a4'}} />
				</div>
				{this.state.showModelTip && <Paper

					style={{
						width:'auto',
						position:'fixed',
						zIndex:'10',
						top:this.state.anchorEl.x+18,
						left:this.state.anchorEl.y,
  					borderRadius: '3px',
  					boxShadow: '0 0 3px 0 rgba(0, 0, 0, 0.2)',
						padding:'12px 12px 0 12px'}}
        >
				<TipItem title={I18N.SaveEffect.Model.Easy} content={I18N.SaveEffect.Model.EasyTip}/>
				<TipItem title={I18N.SaveEffect.Model.Contrast} content={I18N.SaveEffect.Model.ContrastTip}/>
				<TipItem title={I18N.SaveEffect.Model.Manual} content={I18N.SaveEffect.Model.ManualTip}/>
				<TipItem title={I18N.SaveEffect.Model.Increment} content={I18N.SaveEffect.Model.IncrementTip}/>
				<TipItem title={I18N.SaveEffect.Model.Relation} content={I18N.SaveEffect.Model.RelationTip}/>
				<TipItem title={I18N.SaveEffect.Model.Efficiency} content={I18N.SaveEffect.Model.EfficiencyTip}/>
				<TipItem title={I18N.SaveEffect.Model.Simulation} content={I18N.SaveEffect.Model.SimulationTip}/>
				</Paper>}
			</div>
		)
	}

	  componentDidMount(){
      if(this.props.isFromEdit) {
				this.props.onGetChartData();
			}
    }
	render() {
		let { data, disabledPreview, BenchmarkModel, BenchmarkStartDate, BenchmarkEndDate, CalculationStep, onChangeModelType, onChangeStep, onChangeBenchmarkStartDate, onChangeBenchmarkEndDate, onGetChartData, IncludeEnergyEffectData  } = this.props,
		chartProps;

		var that=this;

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
							switch (i) {
								case 0:
									serie.name = I18N.EM.Ratio.BaseValue;
									break;
								case 1:
									serie.type = 'column';
									break;
								case 2:
									if(BenchmarkModel===Model.Relation){
										serie.name += `<br/>(${I18N.Setting.Diagnose.Associate})`;
									}
									break;
							}
						} else {
							serie.type = 'column';
						}
						return serie;
					});
					if(!IncludeEnergyEffectData){
						newConfig.series=[newConfig.series.pop()]
					}
					newConfig.stacking = null;
					newConfig.legendSwitchList = ['line', 'column'];

					//add calendar background-color
					var {Calendars}=data.toJS();
					  if(  Calendars && Calendars.length > 0 ) {
								let {CalendarType, CalendarTimeRanges} = Calendars[0];
								if( CalendarTimeRanges && CalendarTimeRanges.length > 0 ) {
									newConfig.series.unshift({
											lockLegend: true,
											enableDelete: false,
											name: BenchmarkModel===Model.Relation?I18N.SaveEffect.Create.TriggerArea:I18N.SaveEffect.Create.CaculateTime,
											color: PLOT_BACKGROUND_COLOR,
											lineWidth: 12,
											marker: {
													symbol: 'null',
											}
									});
									newConfig.xAxis.plotBands = CalendarTimeRanges.map(({StartTime, EndTime}) => {
										return {
											color: PLOT_BACKGROUND_COLOR,
											from: moment.utc(StartTime).valueOf(),
											to: moment.utc(EndTime).valueOf()
										}
									});

								}
							}

					if(BenchmarkModel===Model.Simulation){
						newConfig.navigator.margin=60;
						newConfig.title={
							useHTML:true,
          		align:'left',
          		verticalAlign:'bottom',
          		x:40,
         		  y:-80,
          		text:that._renderFormula(),
						}
					}
					return newConfig;
				},
				afterChartCreated: this._afterChartCreated,
			};
		  let target = data.getIn(['TargetEnergyData', 0, 'Target'])
		  if( target && target.get('TimeSpan') && target.get('TimeSpan').size > 0 ) {
		    let step = target.get('Step');
		    chartProps.contentSyntax = JSON.stringify({
		      viewOption: {
		        TimeRanges: [{
		          StartTime: target.getIn(['TimeSpan', 'StartTime']),
		          EndTime: target.getIn(['TimeSpan', 'EndTime']),
		          // StartTime: subtractStep(BenchmarkStartDate, step),
		          // EndTime: subtractStep(BenchmarkEndDate, step),
		        }]
		      }
		    });
		  }
		}
		return (
			<div className='step2-wrapper'>
				<div className='create-block step2-side' style={{display:'flex',flexDirection:'column'}}>
					<header className='step2-side-header'>{I18N.SaveEffect.Create.ConfigModel}</header>
					<div className='step2-side-content' style={{overflowY:'auto'}}>
						<div style={{position:'relative'}}>
							<ViewableDropDownMenu
								defaultValue={BenchmarkModel}
								title={I18N.SaveEffect.Model.Title}
								valueField='id'
								textField='label'
								dataItems={getModelDataItems()}
								didChanged={onChangeModelType}
								style={{width: 170}}/>
								{this._renderModelTip()}
						</div>
						<div>
							<ViewableDropDownMenu
								defaultValue={CalculationStep}
								isViewStatus={BenchmarkModel === Model.Manual || BenchmarkModel === Model.Contrast}
								// 计算步长
								title={I18N.SaveEffect.Create.ConfigCalcStep}
								valueField='id'
								textField='label'
								dataItems={getStepDataItems(BenchmarkModel)}
								didChanged={onChangeStep}
								style={{width: 170}}/>
						</div>
						{BenchmarkModel !== Model.Manual && <div className='pop-viewableTextField' style={{marginTop:'20px'}}>
							<header className='pop-viewable-title'>{I18N.SaveEffect.Create.BenchmarkDate}</header>
							<div>
								<ViewableDatePicker onChange={onChangeBenchmarkStartDate} datePickerClassName='date-picker-inline' width={83} value={BenchmarkStartDate}/>
								<div style={{display: 'inline-block', padding: '0 16px'}}>{I18N.EM.To2}</div>
								<ViewableDatePicker onChange={onChangeBenchmarkEndDate} datePickerClassName='date-picker-inline' width={83} value={BenchmarkEndDate}/>
							</div>
							<div className='tip-message'>{I18N.SaveEffect.Create.BenchmarkDateTip}</div>
						</div>}
						{(BenchmarkModel === Model.Increment || BenchmarkModel === Model.Efficiency || BenchmarkModel === Model.Simulation || BenchmarkModel === Model.Relation) && this._renderAuxiliaryTag()}
						{this._renderTimePeriods()}
						{BenchmarkModel === Model.Relation && this._renderTriggers()}
						{this.state.showTagSelectDialog && this._renderTagSelect()}
					</div>
				</div>
				<div className='create-block step2-content'>
					<header className='step2-content-header'>
						{I18N.Setting.Diagnose.ChartPreview}
						{BenchmarkModel !== Model.Manual && <NewFlatButton
							secondary
							onClick={onGetChartData}
							style={{height: 30, lineHeight: '28px'}}
							label={I18N.Setting.Diagnose.PreviewButton}
							disabled={disabledPreview}
							icon={<ActionVisibility style={{height:16}}/>}/>}
					</header>
					<div className='step2-content-content'>
						<header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 70}}>
							<div className='diagnose-create-content'>
								<ViewableDatePicker onChange={onChangeBenchmarkStartDate} datePickerClassName='diagnose-date-picker' width={100} value={BenchmarkStartDate}/>
								<div style={{display: 'inline-block', padding: '0 16px'}}>{I18N.EM.To2}</div>
								<ViewableDatePicker onChange={onChangeBenchmarkEndDate} datePickerClassName='diagnose-date-picker' width={100} value={BenchmarkEndDate}/>
							</div>
							<span>{I18N.EM.Report.Step + ': ' + find(getStepDataItems(BenchmarkModel), item => item.id === CalculationStep).label}</span>
						</header>
						{data ?	<ChartBasicComponent {...chartProps}/>
						:<div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>}
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

class TipItem extends Component {
	render(){
		return(<div style={{marginBottom:'12px'}}>
			<div style={{fontSize: '12px',color: '#0f0f0f'}}>{this.props.title}</div>
			<div style={{fontSize: '12px',color: '#9fa0a4',marginTop:'4px'}}>{this.props.content}</div>
		</div>)
	}

}
