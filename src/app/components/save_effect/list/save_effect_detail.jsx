import React, { Component, PureComponent } from 'react';
import classNames from 'classnames';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import moment from 'moment';
import util from 'util/Util.jsx';
import ListStore from 'stores/save_effect/ListStore.jsx';
import {calcState} from "constants/actionType/Effect.jsx";
import FlatButton from "controls/NewFlatButton.jsx";
import DropdownButton from '../../../controls/NewDropdownButton.jsx';
import {IconText} from '../../ECM/MeasuresItem.jsx';
import {getEnergySolution,getDetail,deleteItem,changeEnergySystemForEffect,getContrastChartData,getSavingChartData,saveBest,deleteBest,ignoreBest,cleanDetail} from 'actions/save_effect_action.js';
import { CircularProgress,Dialog,Snackbar} from 'material-ui';
import NewDialog from 'controls/NewDialog.jsx';
import PreCreate from '../create/pre_create.jsx';
import Create from '../create';
import Edit from '../edit';
import Reason from './reason.jsx';
import ContrastChart from '../chart/contrast_chart.jsx';
import SavingChart from '../chart/saving_chart.jsx';
import {LessInvest,HighCost,Easy,HighReturn} from '../best/icon.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import CreateStore from 'stores/save_effect/create_store';
import {Solution,SolutionLabel} from 'components/ECM/MeasurePart/Solution.jsx';
import Problem from 'components/ECM/MeasurePart/Problem.jsx';
import SolutionGallery from 'components/ECM/MeasurePart/SolutionGallery.jsx';
import Supervisor from 'components/ECM/MeasurePart/Supervisor.jsx';
import StatusCmp from 'components/ECM/MeasurePart/Status.jsx'
import {EnergySys} from 'components/ECM/MeasurePart/MeasureTitle.jsx';
import Remark from 'components/ECM/MeasurePart/Remark.jsx';

const type={
	"Saving":0,
	"Contrast":1
}
const characterType={
			"HighCost":1,
			"LessInvest":2,
			"Easy":3,
			"HighReturn":4
}

function privilegeWithSaveEffect( privilegeCheck ) {
  //  return true
	return privilegeCheck(PermissionCode.Save_Effect, CurrentUserStore.getCurrentPrivilege());
}

function isFull() {
	return privilegeWithSaveEffect(privilegeUtil.isFull.bind(privilegeUtil));
}

function privilegeWithBestSolution( privilegeCheck ) {
  // return true
	return privilegeCheck(PermissionCode.BEST_SOLUTION, CurrentUserStore.getCurrentPrivilege());
}

function BestIsFull() {
	// return false
	return privilegeWithBestSolution(privilegeUtil.isFull.bind(privilegeUtil));
}

function BestIsView() {
	// return false
	return privilegeWithBestSolution(privilegeUtil.isView.bind(privilegeUtil));
}

function validValue(value) {
	return value!==null?util.getLabelData(value*1):'-';
}

function tansferReturnCycle(cycle){
	return cycle===0?I18N.Setting.ECM.InvestmentReturnCycle.ImmediateRecovery:cycle;
}

function getEffectItemId(tagId,tags){
	return tagId===-1?null:tags.find(item=>item.get("TagId")===tagId).get('EnergyEffectItemId')
}

function Immu2PlainPureRender(Comp) {
	return class Basic extends Component {		
		shouldComponentUpdate(nextProps, nextState) {
			return !util.shallowEqual(this.props, nextProps) || !util.shallowEqual(this.state, nextState);
		}
		render() {
			let { immuKeys, ...other } = this.props,
			plainProps = {};
			if( immuKeys ) {
				immuKeys.split(',').map( key => other[key] && (plainProps[key] = other[key].toJS()) );
			}
			return (
				<Comp {...other} {...plainProps}/>
			);
		}
	}
}
const SavingChartPure = Immu2PlainPureRender(SavingChart);
const ContrastChartPure = Immu2PlainPureRender(ContrastChart);


class IconLabel extends Component {
	render(){
		var {label,selected,onClick}=this.props;
			return(
		<div className="icon-chat-label" onClick={onClick}>
		<FontIcon color={selected?"#32ad3d":"#9fa0a4"} style={{fontSize:'24px',marginRight:'8px'}} className="icon-stacked-chart2"/>
		<div className={classNames({"selected":selected})}>{label}</div>

		</div>
	)
	}

}

export default class EffectDetail extends Component {

  constructor(props, ctx) {
        super(props)
        this._onChanged = this._onChanged.bind(this);
				this._handleEditTagChange = this._handleEditTagChange.bind(this);
				this._handleDeleteTagChange = this._handleDeleteTagChange.bind(this);
				this._onSolutionChanged = this._onSolutionChanged.bind(this);
				
  }

  state={
    detailInfo:null,
		deleteConfirmShow:false,
		deleteIndex:null,
		energySystemDialogShow:false,
		createShow:false,
		editShow:false,
		editIndex:null,
		displayTagId:-1,
		displayChartType:type.Saving,
		chartData:null,
		configBestShow:false,
		isBest:false,
		characteristics:'',
		recommendReason:null,
		IgnoreBestShow:false,
		energySolution: null,
		measureShow: false,
  }

  _onChanged(){
		if(ListStore.getDetail()){
			    this.setState({
						detailInfo:ListStore.getDetail(),
						chartData:ListStore.getDetailChart(),
						isBest:ListStore.getDetail().get("BestSolution")!==null,
						characteristics:ListStore.getDetail().get("BestSolution")===null?'':ListStore.getDetail().getIn(["BestSolution","Characteristics"]),
						recommendReason:ListStore.getDetail().get("BestSolution")===null?null:ListStore.getDetail().getIn(["BestSolution","RecommendReason"]),
					})
		}else{
			    this.setState({
						chartData:ListStore.getDetailChart(),
					})
		}

  }

	_onSolutionChanged(){
		this.setState({
			energySolution:CreateStore.getEnergySolution()
		})
	}

	_onEnergySystemDialogShow(){
		this.setState({
			energySystemDialogShow:true
		})
	}

	_onCreateShow(){
		this.setState({
			createShow:true
		})
	}

	_onBestShow(){
		this.setState({
			configBestShow:true
		})
	}

	_onIgnoreBestShow(){
		this.setState({
			IgnoreBestShow:true
		})
	}

	isCharacterSelected(value,characteristics=this.state.characteristics){
		return characteristics.indexOf(value+'')>-1
	}

  _handleEditTagChange(event, value){
		this.setState({
					editShow:true,
					editIndex:value
		})
  }

  _handleDeleteTagChange(event, value){
		this.setState({
			deleteConfirmShow:true,
			deleteIndex:value,
		})
  }

	_handlechartTypeChange(type,tags){
		this.setState({
			displayChartType:type,
			chartData:null
		},()=>{
			this._getChartData(this.props.effect.get("EnergyEffectId"),getEffectItemId(this.state.displayTagId,tags));
		})
	}
	
	_handelCharacterChange(value){
		var character=this.state.characteristics,index=character.indexOf(value+'');
		if(index>-1){
			character=character.substring(0,index-1)+character.substring(index+1);
			this.setState({
				characteristics:character
			})
		}else{
			this.setState({
			characteristics:character===''?value+'':character+','+value
		})
		}



	}

	_getChartData(effectId,effectItemId){
		switch(this.state.displayChartType){
			case type.Saving:
						getSavingChartData(effectId,effectItemId)
						break;
			case type.Contrast:
						getContrastChartData(effectId,effectItemId)
					 break;
			default:
						break
		}
	}

	_updateChart(data){
		var tags=data.get('EffectItems');
		this._getChartData(this.props.effect.get("EnergyEffectId"),getEffectItemId(this.state.displayTagId,tags));
	}
  _renderTitle(){
		var style={
      btn:{
        height:'30px',
        width:'128px',
        lineHeight:'28px',
        marginLeft:'15px'
      },
      lable:{
        fontSize: "14px",
        fontWeight: "500",
        padding:'0'
      }};
    return(
			<div className="jazz-effect-detail-header-container">
				<div className="jazz-effect-detail-header">
					<span>
						<IconButton iconClassName="icon-return" onTouchTap={()=>{
							cleanDetail();
							this.props.onBack();
							}} iconStyle={{fontSize:'17px'}} style={{width:'17px',height:'19px',padding:'0'}}/>
						<div className="jazz-effect-detail-header-title">{this.props.effect.get('EnergySolutionName')}</div>
					</span>
					<span>
						<FlatButton label={I18N.SaveEffect.SolutionDetail} onTouchTap={()=>{
												this.setState({
													measureShow: true 
													});
													getEnergySolution(this.props.effect.get("EnergyProblemId"));
													}}
													style={style.btn} labelStyle={style.lable} secondary={true}/>
						{!this.state.isBest && isFull() &&  (BestIsFull() || BestIsView()) && <FlatButton label={I18N.SaveEffect.SetBest} onTouchTap={this._onBestShow.bind(this)}
													style={style.btn} labelStyle={style.lable} secondary={true}/>}
					</span>
				</div>
			</div>

    )
  }
  _renderSubTitle(){
    var tag=this.state.detailInfo.get('EffectItems');
    var {ExecutedTime,EnergySystem,CalcState}=this.props.effect.toJS();
    if(tag.size===0){
      return (
        <div className="jazz-effect-detail-header-subtitle">
          <div className="jazz-effect-detail-header-subtitle-info">
            <span>
              <FontIcon className="icon-calendar1" style={{fontSize:'14px',marginRight:'10px'}}/>
              <div className="font">
                <span>{moment(util.DataConverter.JsonToDateTime(ExecutedTime)).format(I18N.DateTimeFormat.IntervalFormat.FullDateMinute)}</span>
                <span>{I18N.Setting.Effect.Start}</span>
              </div>
            </span>
          </div>
        </div>
      )
    }
    else if(this.props.isFromBestList){
			return(
				 <div className="jazz-effect-detail-header-subtitle" style={{minHeight:'22px'}}>
          <div className="jazz-effect-detail-header-subtitle-info">
            <span style={{marginBottom:'5px'}}>
							<FontIcon className="icon-building" color="#505559" style={{fontSize:'12px',marginRight:'7px'}}/>
              <div className="font">{`${I18N.SaveEffect.HierarchyFrom}${this.props.effect.get("HierarchyName")}`}</div>
							<div style={{margin:'0 20px'}} className="font">|</div>
							<FontIcon className={ListStore.getEnergySystemIcon(EnergySystem)} style={{fontSize:'14px',marginRight:'10px',lineHeight:'14px'}} color="#434343"/>
              <div className="font" style={{marginRight:'10px'}}>{ListStore.getEnergySystem(EnergySystem)}</div>
							<div style={{margin:'0 20px'}} className="font">|</div>
							 <FontIcon className="icon-calendar1" style={{fontSize:'14px',marginRight:'10px',lineHeight:'14px'}} color="#434343"/>
              <div className="font">
                <span>{moment(util.DataConverter.JsonToDateTime(ExecutedTime)).format(I18N.DateTimeFormat.IntervalFormat.FullDateMinute)}</span>
                <span>{I18N.Setting.Effect.Start}</span>
              </div>
              <div style={{margin:'0 20px'}} className="font">|</div>
              {CalcState===calcState.Being?<FontIcon className="icon-sandglass" style={{fontSize:'14px'}}/>
						:<FontIcon className="icon-sync-ok" style={{fontSize:'14px',lineHeight:'14px'}} color="#434343"/>}
                <div className="font" style={{marginLeft:'5px'}}>
                  {CalcState===calcState.Being?`${I18N.MainMenu.SaveEffect}${I18N.SaveEffect.Calculating}`
                    :`${I18N.MainMenu.SaveEffect}${I18N.SaveEffect.Calculated}`}
                </div>
            </span>
          </div>
        </div>
			)
		}else{
      return (
        <div className="jazz-effect-detail-header-subtitle">
          <div className="jazz-effect-detail-header-subtitle-info">
            <span style={{marginBottom:'5px'}}>
							<FontIcon className={ListStore.getEnergySystemIcon(EnergySystem)} style={{fontSize:'14px',marginRight:'10px',lineHeight:'14px'}} color="#434343"/>
              <div className="font" style={{marginRight:'10px'}}>{ListStore.getEnergySystem(EnergySystem)}</div>
              {this.props.canEdit && <div className="operation" onClick={this._onEnergySystemDialogShow.bind(this)}>{I18N.Baseline.Button.Edit}</div>}
            </span>
            <span>
              <FontIcon className="icon-calendar1" style={{fontSize:'14px',marginRight:'10px',lineHeight:'14px'}} color="#434343"/>
              <div className="font">
                <span>{moment(util.DataConverter.JsonToDateTime(ExecutedTime)).format(I18N.DateTimeFormat.IntervalFormat.FullDateMinute)}</span>
                <span>{I18N.Setting.Effect.Start}</span>
              </div>
              <div style={{margin:'0 20px'}} className="font">|</div>
              {CalcState===calcState.Being?<FontIcon className="icon-sandglass" style={{fontSize:'14px'}}/>
						:<FontIcon className="icon-sync-ok" style={{fontSize:'14px',lineHeight:'14px'}} color="#434343"/>}
                <div className="font" style={{marginLeft:'5px'}}>
                  {CalcState===calcState.Being?`${I18N.MainMenu.SaveEffect}${I18N.SaveEffect.Calculating}`
                    :`${I18N.MainMenu.SaveEffect}${I18N.SaveEffect.Calculated}`}
                </div>

            </span>
          </div>
        </div>
      )
    }
  }

	_renderMulti(value){
		if(value===null) return null;
		var v=value,
				arr = v.split('\n');
        if (arr.length > 1) {
          v = arr.map(item => {
            return <div>{item}</div>;
          });
        }
				return v;
	}

	_renderBest(){
		var bestIcon=<FontIcon className="icon-medal" style={{fontSize:'20px',marginRight:'10px'}} color="#ff9000"/>;
		var characteristics=ListStore.getDetail().get("BestSolution")===null?'':ListStore.getDetail().getIn(["BestSolution","Characteristics"]),
					recommendReason=ListStore.getDetail().get("BestSolution")===null?null:ListStore.getDetail().getIn(["BestSolution","RecommendReason"]);
		var highCost=this.isCharacterSelected(characterType.HighCost,characteristics),
				lessInvest=this.isCharacterSelected(characterType.LessInvest,characteristics),
				easy=this.isCharacterSelected(characterType.Easy,characteristics),
				highReturn=this.isCharacterSelected(characterType.HighReturn,characteristics);
		var style={
			btn:{
				width: '68px',
 			  height: '30px',
				lineHeight:'28px',
				minWidth:'68px',
 				borderRadius: '2px',
  			border:' solid 1px #e6e6e6',
				marginLeft:'12px'
			},
			label:{
				fontSize: '14px',
				color:"#505559"
			},
			ignoreBtn:{
				width:'120px',
				height:'30px',
				lineHeight:'28px',
				borderRadius: '2px',
  			border: 'solid 1px #e6e6e6'
			},
			ignoreLabel:{
				fontSize: '14px',
  			color: '#626469',
				padding:'0'
						},
			ignoredBtn:{
				width:'92px',
				height:'30px',
				lineHeight:'28px',
				borderRadius: '2px',
  			border: 'solid 1px #e6e6e6',
				backgroundColor: '#e6e6e6'
			},
			ignoredLabel:{
				fontSize: '14px',
  			color: '#9fa0a4',
				padding:'0'
			}
		},
		ignoreIcon=<FontIcon className="icon-ignore" style={{fontSize:'18px',marginRight:'5px',marginLeft:'0'}} color="#505559"/>;
		return(
			<div className="jazz-effect-detail-best">
				<div className="jazz-effect-detail-best-info">
					<div className="row" style={{height:"30px"}}>
						<div style={{display:'flex',flexDirection:'row'}}>
						{bestIcon}
						<div className="title-font">{I18N.SaveEffect.BestLabel}</div>
						{lessInvest && <LessInvest/>}
						{highReturn && <HighReturn/>}
						{highCost && <HighCost/>}
						{easy && <Easy/>}
						</div>
						{this.props.isFromBestList?
							this.state.detailInfo.get('Status')===1?
																		<div className="jazz-effect-detail-best-operation">
																				<FlatButton icon={ignoreIcon} label={I18N.SaveEffect.IgnoreSolution} style={style.ignoreBtn} labelStyle={style.ignoreLabel} onClick={this._onIgnoreBestShow.bind(this)}/>
																		</div>					
																		:<FlatButton icon={ignoreIcon} label={I18N.SaveEffect.SolutionIgnored} style={style.ignoredBtn} labelStyle={style.ignoredLabel} disabled={true}/>
							:isFull() && BestIsFull() && <div className="jazz-effect-detail-best-operation">
									<FlatButton label={I18N.Common.Button.Edit} style={style.btn} labelStyle={style.label} onClick={this._onBestShow.bind(this)}/>
									<FlatButton label={I18N.Common.Button.Repeal} style={style.btn} labelStyle={style.label} onClick={()=>{
										this.setState({
											detailInfo:null
										},()=>{
											deleteBest(this.props.effect.get('EnergyEffectId'))
										})
										}}/>
							</div>}

					</div>
					<div className="sub-font" style={{marginTop:'15px'}}>{this._renderMulti(recommendReason)}</div>
				</div>

			</div>
		)
	}

	_renderChart(){
		var tags=this.state.detailInfo.get('EffectItems');
		var menus=[<MenuItem primaryText={I18N.SaveEffect.TagSum} value={-1}/>];
		if(tags.size>1){
			menus.push()
		}
	
		return(
			<div className="jazz-effect-detail-content-chart-field">
				<div className="operation">
					<div className="tag-select">
						{tags.size===1?<div className="single">{tags.getIn([0,"TagName"])}</div>
													:     
													 <DropDownMenu
                   					 style={{height: '26px'}}
                    				 labelStyle={{fontSize:'14px',color:"#32ad3d",lineHeight:'26px',height:'26px',paddingLeft:'11px',paddingRight:'28px'}}
                    				 iconButton={<IconButton iconClassName="icon-arrow-unfold" iconStyle={{fontSize:"10px",color:"#32ad3d"}} style={{width:14,height:14}}/>}
                    				 iconStyle={{marginTop:'-12px',padding:'0',right:'15px',width:'24px',top:"2px"}}
                    				 value={this.state.displayTagId}
                    				 underlineStyle={{display:"none"}}
                    				 onChange={(e, selectedIndex, value)=>{
															 this.setState({
																 displayTagId:value,
																 chartData:null
																 },
															 ()=>{
																 this._getChartData(this.props.effect.get("EnergyEffectId"),getEffectItemId(this.state.displayTagId,tags));
															 })
                   						 }}>
      											<MenuItem primaryText={I18N.SaveEffect.TagSum} value={-1}/>
														{tags.map(tag=><MenuItem primaryText={tag.get("TagName")} value={tag.get("TagId")}/>)}
    												</DropDownMenu>}
					</div>
					<div className="chart-select">
					<IconLabel label={I18N.SaveEffect.Saving} selected={this.state.displayChartType===type.Saving} onClick={this._handlechartTypeChange.bind(this,type.Saving,tags)}/>
					<IconLabel label={I18N.SaveEffect.Contrast} selected={this.state.displayChartType===type.Contrast} onClick={this._handlechartTypeChange.bind(this,type.Contrast,tags)}/>
					</div>

				</div>
				<div className="chart">
				{this.state.displayChartType===type.Saving?<SavingChartPure immuKeys={'data'} unit={util.getUomById(this.state.detailInfo.get("EnergySavingUomId")).Code} data={this.state.chartData}/>
																									:<ContrastChartPure immuKeys={'data'} unit={util.getUomById(this.state.detailInfo.get("EnergySavingUomId")).Code} data={this.state.chartData}/>}
				</div>

			</div>
		)
	}

  _renderContent(){
    var tags=this.state.detailInfo.get('EffectItems'),
           {EnergySaving,EnergySavingCosts,InvestmentAmount,InvestmentReturnCycle,EnergySavingUomId}=this.state.detailInfo.toJS();
    var {CalcState}=this.props.effect.toJS(),
        preTitle=CalcState===calcState.Being?I18N.SaveEffect.UtilNow:'',
				prePeriod=CalcState===calcState.Being?I18N.SaveEffect.Predict:'';

    var style={
      btn:{
        height:'30px',
        width:'100px',
        lineHeight:'28px',
        marginLeft:'15px'
      },
      lable:{
        fontSize: "14px",
        fontWeight: "500",
        padding:'0'
      },
			editBtn:{
				width: "73px",
				minWidth:'73px',
  			height: "30px",
				lineHeight:'28px',
				paddding:0,
				marginLeft:'12px'
			}
    },
    editProps = {
      text: I18N.Common.Button.Edit,
      menuItems: tags.map((tag,index)=>(<MenuItem value={index} primaryText={tag.get('TagName')} />)).toJS(),
      onItemClick: this._handleEditTagChange,
      buttonIcon: 'icon-arrow-unfold',
      buttonStyle:{marginLeft:'12px'}
    },
    deleteProps = {
      text: I18N.Common.Button.Delete,
      menuItems: tags.map((tag,index)=>(<MenuItem value={index} primaryText={tag.get('TagName')} />)).toJS(),
      onItemClick: this._handleDeleteTagChange,
      buttonIcon: 'icon-arrow-unfold',
      buttonStyle:{marginLeft:'12px'}
    },
    iconStyle = {
        fontSize: '16px'
      },
      icontextstyle = {
        padding: '0px',
        height: '18px',
        width: '18px',
        fontSize: '18px',
        marginTop:'-5px'
      };

      var saveIcon=<FontIcon className="icon-energy_saving" color="#626469" iconStyle ={iconStyle} style = {icontextstyle} />,
          costIcon=<FontIcon className="icon-cost_saving" iconStyle ={iconStyle} color="#626469" style = {icontextstyle} />,
          amountIcon=<FontIcon className="icon-investment-amount" iconStyle ={iconStyle} color="#626469" style = {icontextstyle} />,
          cycleIcon=<FontIcon className="icon-pay-back-period" iconStyle ={iconStyle} color="#626469" style = {icontextstyle} />,
					savingIcon=<FontIcon className="icon-energy-saving-rate" iconStyle ={iconStyle} color="#626469" style = {icontextstyle} />;

	// <IconText style={{width:'140px',marginLeft:'0px'}} valueStyle={{fontSize:'22px'}} icon={savingIcon} label={I18N.Setting.KPI.SavingRate} value={'-'}/>
	// delete savingIcon

	  if(tags.size===0){
			return(
				<div className="jazz-effect-detail-content flex-center" style={{flexDirection:'column'}}>
					<FontIcon className="icon-energymost" style={{fontSize:'60px'}} color="#32ad3d"/>
				 <div className="nolist-font" style={{display:'flex',flexDirection:'row'}}>
					 {I18N.SaveEffect.NoEffectDetail}
					 <div className="operation" onClick={this._onCreateShow.bind(this)}>{I18N.Setting.Effect.Config}</div>
				 </div>
			 </div>
			)

		}else {
			return(
				<div className="jazz-effect-detail-content">
					<div className="jazz-effect-detail-content-header">
						<div className="jazz-effect-detail-content-header-title">{I18N.MainMenu.SaveEffect}</div>
						{this.props.canEdit && <div className="jazz-effect-detail-content-header-operation">
							<FlatButton label={I18N.Setting.Effect.Config} onTouchTap={this._onCreateShow.bind(this)}
													style={style.btn} labelStyle={style.lable} secondary={true}/>
												{tags.size===1?<FlatButton label={I18N.Common.Button.Edit} onTouchTap={(e)=>{this._handleEditTagChange(e,0)}}
																		style={style.editBtn} labelStyle={style.lable} secondary={true}/>
														 :<DropdownButton {...editProps}/>}
							{tags.size===1?<FlatButton label={I18N.Common.Button.Delete} onTouchTap={(e)=>{this._handleDeleteTagChange(e,0)}}
							 																		style={style.editBtn} labelStyle={style.lable} secondary={true}/>
							 														 :<DropdownButton {...deleteProps}/>}
						</div>}
					</div>
					<div className="jazz-effect-detail-content-save-energy">
							<IconText style={{width:'140px',marginLeft:'0px'}} valueStyle={{fontSize:'22px'}} icon={saveIcon} label={`${preTitle}${I18N.SaveEffect.EnergySaving}`} value={validValue(EnergySaving)} uom={util.getUomById(EnergySavingUomId).Code}/>
							<IconText style={{width:'140px',marginLeft:'0px'}} valueStyle={{fontSize:'22px'}} icon={costIcon} label={`${preTitle}${I18N.Setting.Effect.Cost}`} value={validValue(EnergySavingCosts)} uom="RMB"/>
						
							<IconText style={{width:'140px',marginLeft:'0px'}} valueStyle={{fontSize:'22px'}} icon={amountIcon} label={I18N.Setting.ECM.InvestmentAmount} value={validValue(InvestmentAmount)} uom="RMB"/>
							<IconText style={{width:'140px',marginLeft:'0px'}} valueStyle={{fontSize:'22px'}} icon={cycleIcon} label={`${prePeriod}${I18N.Setting.ECM.PaybackPeriod}`} value={tansferReturnCycle(InvestmentReturnCycle) || '-'}
												uom={util.isNumber(InvestmentReturnCycle) && InvestmentReturnCycle!==0?I18N.EM.Year:''}/>
					</div>
					{this._renderChart()}
				</div>
			)
		}

  }

	_renderDeleteDialog(){
		let tag=this.state.detailInfo.getIn(['EffectItems',this.state.deleteIndex]);
		let actions = [
			<FlatButton
			inDialog={true}
			primary={true}
			label={I18N.Template.Delete.Delete}
			style={{backgroundColor:'#dc0a0a',marginRight:'20px'}}
			onTouchTap={()=>{
				this.setState({
					deleteConfirmShow:false,
					deleteIndex:null
				},()=>{
					deleteItem(tag.get('EnergyEffectItemId'),()=>{
						getDetail(this.props.effect.get('EnergyEffectId'));
					});
				})
			}}
			/>,
			<FlatButton
			label={I18N.Common.Button.Cancel2}
			style={{borderRadius: "2px",border: 'solid 1px #9fa0a4'}}
			onTouchTap={()=>{
				this.setState({
					deleteConfirmShow:false,
					deleteIndex:null
				})
			}}
			/>
		];
		let dialogProps = {
			ref: 'dialog',
			actions: actions,
			modal: true,
			open: true,
		};
		return(
			<Dialog {...dialogProps}>
				<div style={{
						'word-wrap': 'break-word',
						'word-break': 'break-all',
						fontSize: "14px",
						color: "#626469"
					}}>
					{I18N.format(I18N.SaveEffect.EffectDeleteConfirm,tag.get('TagName'))}
				</div>

			</Dialog>
		)
	}

		_renderConfigBestDialog(){
		let tag=this.state.detailInfo.getIn(['EffectItems',this.state.deleteIndex]);
		let actions = [
				<FlatButton
			secondary={true}
			label={I18N.Common.Button.Cancel2}
			style={{float:'right'}}
			onTouchTap={()=>{
				this.setState({
					configBestShow:false,
					characteristics:ListStore.getDetail().get("BestSolution")===null?'':ListStore.getDetail().getIn(["BestSolution","Characteristics"]),
					recommendReason:ListStore.getDetail().get("BestSolution")===null?null:ListStore.getDetail().getIn(["BestSolution","RecommendReason"]),
				})
			}}
			/>,
			<FlatButton
			inDialog={true}
			primary={true}
			label={I18N.Common.Button.Save}
			style={{marginRight:'20px',float:'right'}}
			disabled={!this.state.characteristics || !this.state.recommendReason}
			onTouchTap={()=>{
			this.setState({
					configBestShow:false,
					detailInfo:null
				},()=>{
					saveBest(this.props.effect.get('EnergyEffectId'),this.state.characteristics,this.state.recommendReason)
				})
			}}
			/>
		];
		let dialogProps = {
			ref: 'dialog',
			actions: actions,
			modal: true,
			open: true,
			title:I18N.SaveEffect.SetBest,
			titleStyle:{fontSize:'16px',fontWeight:'600',color:'#0f0f0f',margin:'0 30px',padding:'15px 0px',height:'22px',lineHeight:'22px',marginBottom:'0',borderBottom:'1px solid #e6e6e6'},
			contentStyle:{margin:'0 30px'},
			actionsContainerStyle:{margin:'25px 30px 30px 0'},
			style:{overflowY:'auto'}
		},style={
			btn:{
				selected:{
					borderRadius: '2px',
  				backgroundColor: '#0cad04',
					border: 'solid 1px #0cad04',
					marginRight:'15px',
					lineHeight:'34px'
				},
				notSelected:{
					borderRadius: '2px',
  				border: 'solid 1px #9fa0a4',
					marginRight:'15px',
				}
			},
			label:{
				selected:{
					fontSize: '14px',
  				color: '#ffffff'
				},
				notSelected:{
					fontSize: '14px',
  				color: '#9fa0a4'
				}
			},
			icon:{
				selected:{
					color:'#ffffff',
					fontSize:'15px'
				},
				notSelected:{
					color:'#9fa0a4',
					fontSize:'15px'
				}			
			}
		};
		var highCost=this.isCharacterSelected(characterType.HighCost),
				lessInvest=this.isCharacterSelected(characterType.LessInvest),
				easy=this.isCharacterSelected(characterType.Easy),
				highReturn=this.isCharacterSelected(characterType.HighReturn);
		return(
			<NewDialog {...dialogProps}>
				<div className="jazz-effect-best-font" style={{marginTop:'15px',marginBottom:'10px'}}>{I18N.SaveEffect.SelectCharacteristics}</div>
				<div className="jazz-effect-best-character">

					<FlatButton label={I18N.SaveEffect.HighCost}
											labelStyle={highCost?style.label.selected:style.label.notSelected}
											icon={<FontIcon className="icon-check-circle" style={highCost?style.icon.selected:style.icon.notSelected}/>}	
											style={highCost?style.btn.selected:style.btn.notSelected}
											onClick={this._handelCharacterChange.bind(this,characterType.HighCost)}/>

					<FlatButton label={I18N.SaveEffect.LessInvest}
											labelStyle={lessInvest?style.label.selected:style.label.notSelected}
											icon={<FontIcon className="icon-check-circle" style={lessInvest?style.icon.selected:style.icon.notSelected}/>}	
											style={lessInvest?style.btn.selected:style.btn.notSelected}
											onClick={this._handelCharacterChange.bind(this,characterType.LessInvest)}/>

					<FlatButton label={I18N.SaveEffect.Easy}
											labelStyle={easy?style.label.selected:style.label.notSelected}
											icon={<FontIcon className="icon-check-circle" style={easy?style.icon.selected:style.icon.notSelected}/>}	
											style={easy?style.btn.selected:style.btn.notSelected}
											onClick={this._handelCharacterChange.bind(this,characterType.Easy)}/>

					<FlatButton label={I18N.SaveEffect.HighReturn}
											labelStyle={highReturn?style.label.selected:style.label.notSelected}
											icon={<FontIcon className="icon-check-circle" style={highReturn?style.icon.selected:style.icon.notSelected}/>}	
											style={highReturn?style.btn.selected:style.btn.notSelected}
											onClick={this._handelCharacterChange.bind(this,characterType.HighReturn)}/>
				</div>
				
				<div className="jazz-effect-best-font" style={{marginTop:'30px',marginBottom:'6px'}}>{I18N.SaveEffect.RecommendReason}</div>

				<div className="jazz-effect-best-recommend">
				<Reason text={this.state.recommendReason} onChange={(e)=>{this.setState({recommendReason:e.target.value})}}/>
				</div>
			</NewDialog>
		)
	}

	_renderIgnoreBestDialog(){
    let actions = [
      <FlatButton
      inDialog={true}
      primary={true}
      label={I18N.SaveEffect.Ignore}
      style={{backgroundColor:'#dc0a0a',marginRight:'20px'}}
      onTouchTap={()=>{
        this.setState({
          IgnoreBestShow:false,
					detailInfo:null
        },()=>{
          ignoreBest(this.props.effect.get('EnergyEffectId'));
        })
      }}
      />,
      <FlatButton
      label={I18N.Common.Button.Cancel2}
      style={{borderRadius: "2px",border: 'solid 1px #9fa0a4'}}
      onTouchTap={()=>{
        this.setState({
          IgnoreBestShow:false,
        })
      }}
      />
    ];
    let dialogProps = {
      ref: 'dialog',
      actions: actions,
      modal: true,
      open: true,
    };
    return(
      <Dialog {...dialogProps}>
        <div style={{
            'word-wrap': 'break-word',
            'word-break': 'break-all',
            fontSize: "14px",
            color: "#626469"
          }}>
          {I18N.SaveEffect.IgnoreTip}
        </div>

      </Dialog>
    )
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

  componentDidMount(){
    getDetail(this.props.effect.get('EnergyEffectId'));
		this._getChartData(this.props.effect.get("EnergyEffectId"),null);
    ListStore.addChangeListener(this._onChanged);
		CreateStore.addChangeListener(this._onSolutionChanged);
		
  }

  componentWillUnmount(){
    ListStore.removeChangeListener(this._onChanged);
		CreateStore.removeChangeListener(this._onSolutionChanged);
  }

  render(){
		if(this.state.detailInfo===null){
			return (
				<div className="jazz-effect-detail flex-center">
				 <CircularProgress  mode="indeterminate" size={80} />
			 </div>
			)
		}else {
			var tags=this.state.detailInfo.get('EffectItems');
		 var {EnergySolutionName,EnergyProblemId,EnergyEffectId,ExecutedTime,EnergySystem}=this.props.effect.toJS();
			return(
				<div className="jazz-effect-detail">
					{this._renderTitle()}
					{this._renderSubTitle()}
					{tags.size!==0 && this.state.isBest &&  (BestIsFull()  || BestIsView()) && this._renderBest()}
					{this._renderContent()}
					{tags.size!==0 && <div className="jazz-effect-detail-create-user">{`${I18N.SaveEffect.CreateUser}${this.state.detailInfo.get("SolutionCreateUser")}`}</div>}
					{this.state.deleteConfirmShow && this._renderDeleteDialog()}
					{this.state.configBestShow && this._renderConfigBestDialog()}
					{this.state.IgnoreBestShow && this._renderIgnoreBestDialog()}
					{this._renderMeasureDialog()}
					{this.state.energySystemDialogShow &&
					<PreCreate isEdit
						EnergySystem={EnergySystem}
						onClose={()=>{this.setState({energySystemDialogShow:false})}}
						onSubmit={(id)=>{
							this.setState({energySystemDialogShow:false},()=>{
								changeEnergySystemForEffect(id,this.props.effect.get("EnergyEffectId"),this.props.effect.get("EnergyProblemId"),this.props.customerId,this.props.hierarchyId)
							})
						}}/>}
					{this.state.createShow && <Create
						filterObj ={{
							EnergySolutionName,
							EnergyProblemId,
							EnergyEffectId,
							ExecutedTime,
						EnergySystem}}
						onSubmitDone={()=>{
							
							this.setState({
								chartData:null,
								detailInfo:null,
							},()=>{
							getDetail(this.props.effect.get('EnergyEffectId'),(data)=>{
								this._updateChart(data);
							});
							
							})

							}}
						onClose={(isSuccess)=>{
							if(isSuccess){
								this.setState({
									createShow:false,
									saveSuccessText:I18N.SaveEffect.ConfigSuccess,
									detailInfo:null
								})
							}else {
								
								this.setState({
									createShow:false,
									detailInfo:null,
									chartData:null,
								},()=>{
									getDetail(this.props.effect.get('EnergyEffectId'),(data)=>{
										this._updateChart(data);
									});
									
								})
							}

						}}/>}
						{this.state.editShow && <Edit effect={this.props.effect.set('EnergyEffectItemId',this.state.detailInfo.getIn(['EffectItems',this.state.editIndex,"EnergyEffectItemId"]))}
																					editTagName={this.state.detailInfo.getIn(['EffectItems',this.state.editIndex,"TagName"])}
																					onSubmitDone={()=>{																						
																						this.setState({
																							detailInfo:null,
																							chartData:null,
																						},()=>{
																						getDetail(this.props.effect.get('EnergyEffectId'),(data)=>{
																								this._updateChart(data);
																							});																						
																						})
																						}}
																					onClose={()=>{
																										this.setState({
																										editShow:false,
																										editIndex:null,																										
																						},()=>{
																							{/*getDetail(this.props.effect.get('EnergyEffectId'),(data)=>{
																								this._updateChart(data);
																							});*/}
																							
																						})
																					}
																		
																					}
						/>}
						<Snackbar ref='snackbar' autoHideDuration={4000} open={!!this.state.saveSuccessText} onRequestClose={()=>{this.setState({saveSuccessText:null})}} message={this.state.saveSuccessText}/>
				</div>
			)
		}

  }
}

EffectDetail.propTypes = {
	customerId:React.PropTypes.number,
	hierarchyId:React.PropTypes.number,
  effect:React.PropTypes.object,
  onBack:React.PropTypes.func,
	canEdit:React.PropTypes.boolean,
	isFromBestList:React.PropTypes.boolean,
};

EffectDetail.defaultProps={
	isFromBestList:false
}
