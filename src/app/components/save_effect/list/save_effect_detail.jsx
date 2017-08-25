import React, { Component } from 'react';
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
import {getDetail,deleteItem,changeEnergySystemForEffect,getContrastChartData,getSavingChartData,saveBest} from 'actions/save_effect_action.js';
import { CircularProgress,Dialog,Snackbar} from 'material-ui';
import NewDialog from 'controls/NewDialog.jsx';
import PreCreate from '../create/pre_create.jsx';
import Create from '../create';
import Edit from '../edit';
import Reason from './reason.jsx'

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

function validValue(value) {
	return value!==null?util.getLabelData(value*1):'-';
}

function tansferReturnCycle(cycle){
	return cycle===0?I18N.Setting.ECM.InvestmentReturnCycle.ImmediateRecovery:cycle;
}

function getEffectItemId(tagId,tags){
	return tagId===-1?null:tags.find(item=>item.get("TagId")===tagId).get('EnergyEffectItemId')
}

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
		recommendReason:null
  }

  _onChanged(){
    this.setState({
      detailInfo:ListStore.getDetail(),
			chartData:ListStore.getDetailChart(),
			isBest:ListStore.getDetail().get("BestSolution")!==null,
			characteristics:ListStore.getDetail().get("BestSolution")===null?'':ListStore.getDetail().getIn(["BestSolution","Characteristics"]),
			recommendReason:ListStore.getDetail().get("BestSolution")===null?null:ListStore.getDetail().getIn(["BestSolution","recommendReason"]),
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
			displayChartType:type
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
						<IconButton iconClassName="icon-return" onTouchTap={this.props.onBack} iconStyle={{fontSize:'17px'}} style={{width:'17px',height:'19px',padding:'0'}}/>
						<div className="jazz-effect-detail-header-title">{this.props.effect.get('EnergySolutionName')}</div>
					</span>
					<span>
						{!this.state.isBest && <FlatButton label={I18N.SaveEffect.SetBest} onTouchTap={this._onBestShow.bind(this)}
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
    else {
      return (
        <div className="jazz-effect-detail-header-subtitle">
          <div className="jazz-effect-detail-header-subtitle-info">
            <span style={{marginBottom:'5px'}}>
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
						{tags.size===0?<div className="single">{tags.getIn([0,"TagName"])}</div>
													:     
													 <DropDownMenu
                   					 style={{height: '26px'}}
                    				 labelStyle={{fontSize:'14px',color:"#32ad3d",lineHeight:'26px',height:'26px',paddingLeft:'11px',paddingRight:'28px'}}
                    				 iconButton={<IconButton iconClassName="icon-arrow-unfold" iconStyle={{fontSize:"10px",color:"#32ad3d"}} style={{width:14,height:14}}/>}
                    				 iconStyle={{marginTop:'-12px',padding:'0',right:'15px',width:'24px',top:"2px"}}
                    				 value={this.state.displayTagId}
                    				 underlineStyle={{display:"none"}}
                    				 onChange={(e, selectedIndex, value)=>{
															 this.setState({displayTagId:value},
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
          cycleIcon=<FontIcon className="icon-pay-back-period" iconStyle ={iconStyle} color="#626469" style = {icontextstyle} />;

	  if(tags.size===0){
			return(
				<div className="jazz-effect-detail-content flex-center" style={{flexDirection:'column'}}>
					<FontIcon className="icon-weather-thunder" style={{fontSize:'60px'}} color="#32ad3d"/>
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
							<IconText style={{width:'140px',marginLeft:'0px'}} icon={saveIcon} label={`${preTitle}${I18N.SaveEffect.EnergySaving}`} value={validValue(EnergySaving)} uom={util.getUomById(EnergySavingUomId).Code}/>
							<IconText style={{width:'140px',marginLeft:'0px'}} icon={costIcon} label={`${preTitle}${I18N.Setting.Effect.Cost}`} value={validValue(EnergySavingCosts)} uom="RMB"/>
							<IconText style={{width:'140px',marginLeft:'0px'}} icon={amountIcon} label={I18N.Setting.ECM.InvestmentAmount} value={validValue(InvestmentAmount)} uom="RMB"/>
							<IconText style={{width:'140px',marginLeft:'0px'}} icon={cycleIcon} label={`${prePeriod}${I18N.Setting.ECM.PaybackPeriod}`} value={tansferReturnCycle(InvestmentReturnCycle) || '-'}
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
		var isCharacterSelected=(value)=>(this.state.characteristics.indexOf(value+'')>-1);
		let actions = [
			<FlatButton
			inDialog={true}
			primary={true}
			label={I18N.Common.Button.Save}
			style={{marginRight:'20px'}}
			disabled={!this.state.characteristics || !this.state.recommendReason}
			onTouchTap={()=>{
			this.setState({
					configBestShow:false,
				},()=>{
					saveBest(this.props.effect.get('EnergyEffectId'),this.state.characteristics,this.state.recommendReason)
				})
			}}
			/>,
			<FlatButton
			secondary={true}
			label={I18N.Common.Button.Cancel2}
			onTouchTap={()=>{
				this.setState({
					configBestShow:false,
					characteristics:ListStore.getDetail().get("BestSolution")===null?'':ListStore.getDetail().getIn(["BestSolution","Characteristics"]),
					recommendReason:ListStore.getDetail().get("BestSolution")===null?null:ListStore.getDetail().getIn(["BestSolution","recommendReason"]),
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
			titleStyle:{fontSize:'16px',fontWeight:'600',color:'#0f0f0f',padding:'15px 30px',borderBottom:'1px solid #e6e6e6'},
			style:{overflowY:'auto'}
		},style={
			btn:{
				selected:{
					borderRadius: '2px',
  				backgroundColor: '#0cad04',
					marginRight:'15px'
				},
				notSelected:{
					borderRadius: '2px',
  				border: 'solid 1px #9fa0a4',
					marginRight:'15px'
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
		var highCost=isCharacterSelected(characterType.HighCost),
				lessInvest=isCharacterSelected(characterType.LessInvest),
				easy=isCharacterSelected(characterType.Easy),
				highReturn=isCharacterSelected(characterType.HighReturn);
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

  componentDidMount(){
    getDetail(this.props.effect.get('EnergyEffectId'));
		this._getChartData(this.props.effect.get("EnergyEffectId"),null);
    ListStore.addChangeListener(this._onChanged);
  }

  componentWillUnmount(){
    ListStore.removeChangeListener(this._onChanged);
  }

  render(){
		if(this.state.detailInfo===null){
			return (
				<div className="jazz-effect-detail flex-center">
				 <CircularProgress  mode="indeterminate" size={80} />
			 </div>
			)
		}else {
		 var {EnergySolutionName,EnergyProblemId,EnergyEffectId,ExecutedTime,EnergySystem}=this.props.effect.toJS();
			return(
				<div className="jazz-effect-detail">
					{this._renderTitle()}
					{this._renderSubTitle()}
					{this._renderContent()}
					{this.state.deleteConfirmShow && this._renderDeleteDialog()}
					{this.state.configBestShow && this._renderConfigBestDialog()}
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
						onSubmitDone={()=>{getDetail(this.props.effect.get('EnergyEffectId'));}}
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
									detailInfo:null
								},()=>{
									getDetail(this.props.effect.get('EnergyEffectId'))
								})
							}

						}}/>}
						{this.state.editShow && <Edit effect={this.props.effect.set('EnergyEffectItemId',this.state.detailInfo.getIn(['EffectItems',this.state.editIndex,"EnergyEffectItemId"]))}
																					editTagName={this.state.detailInfo.getIn(['EffectItems',this.state.editIndex,"TagName"])}
																					onSubmitDone={()=>{getDetail(this.props.effect.get('EnergyEffectId'));}}
																					onClose={()=>{
																										this.setState({
																										editShow:false,
																										editIndex:null
																						},()=>{
																							getDetail(this.props.effect.get('EnergyEffectId'))
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
