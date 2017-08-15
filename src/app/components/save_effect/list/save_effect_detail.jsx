import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import util from 'util/Util.jsx';
import ListStore from 'stores/save_effect/ListStore.jsx';
import {calcState} from "constants/actionType/Effect.jsx";
import Immutable from 'immutable';
import FlatButton from "controls/NewFlatButton.jsx";
import DropdownButton from '../../../controls/NewDropdownButton.jsx';
import {IconText} from '../../ECM/MeasuresItem.jsx';
import {getDetail,deleteItem,changeEnergySystemForEffect} from 'actions/save_effect_action.js';
import { CircularProgress,Dialog,Snackbar} from 'material-ui';
import PreCreate from '../create/pre_create.jsx';
import Create from '../create';

function validValue(value) {
	return value!==null?util.getLabelData(value*1):'-';
}

function tansferReturnCycle(cycle){
	return cycle===0?I18N.Setting.ECM.InvestmentReturnCycle.ImmediateRecovery:cycle;
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
		createShow:false
  }

  _onChanged(){
    this.setState({
      detailInfo:ListStore.getDetail()
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

  _handleEditTagChange(event, value){

  }

  _handleDeleteTagChange(event, value){
		this.setState({
			deleteConfirmShow:true,
			deleteIndex:value,
		})
  }

  _renderTitle(){
    return(
			<div className="jazz-effect-detail-header-container">
				<div className="jazz-effect-detail-header">
					<span>
						<IconButton iconClassName="icon-return" onTouchTap={this.props.onBack} iconStyle={{fontSize:'17px'}} style={{width:'17px',height:'19px',padding:'0'}}/>
						<div className="jazz-effect-detail-header-title">{this.props.effect.get('EnergySolutionName')}</div>
					</span>
				</div>
			</div>

    )
  }
  _renderSubTitle(){
    var tag=this.state.detailInfo.get('EffectItems');
    // var tag=Immutable.fromJS({a:1,b:3});
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
              <FontIcon className="icon-calendar1" style={{fontSize:'14px',marginRight:'10px'}}/>
              <div className="font">
                <span>{moment(util.DataConverter.JsonToDateTime(ExecutedTime)).format(I18N.DateTimeFormat.IntervalFormat.FullDateMinute)}</span>
                <span>{I18N.Setting.Effect.Start}</span>
              </div>
              <div style={{margin:'0 20px'}}>|</div>
              {CalcState===calcState.Being?<FontIcon className="icon-sandglass" style={{fontSize:'14px'}}/>
            :<FontIcon className="icon-sync-ok" style={{fontSize:'14px'}}/>}
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

  _renderContent(){
    var tags=this.state.detailInfo.get('EffectItems'),
           {EnergySaving,EnergySavingCosts,InvestmentAmount,InvestmentReturnCycle,EnergySavingUomId}=this.state.detailInfo.toJS();
    var {CalcState}=this.props.effect.toJS(),
        preTitle=CalcState===calcState.Being?I18N.SaveEffect.UtilNow:'',
				prePeriod=CalcState===calcState.Being?I18N.SaveEffect.Predict:'';
    // var tags=Immutable.fromJS([{TagId:1,TagName:'TagA'},{TagId:2,TagName:'TagB'}]),
    //     EnergySaving=1,
    //     EnergySavingCosts=1,
    //     InvestmentAmount=1,
    //     InvestmentReturnCycle=1,
    //     EnergySavingUomId=1;
    var style={
      btn:{
        height:'30px',
        width:'100px',
        lineHeight:'30px',
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
				lineHeight:'30px',
				paddding:0
			}
    },
    editProps = {
      text: I18N.Common.Button.Edit,
      menuItems: tags.map((tag,index)=>(<MenuItem value={index} primaryText={tag.get('TagName')} />)),
      onItemClick: this._handleEditTagChange,
      buttonIcon: 'icon-arrow-unfold',
      buttonStyle:{marginLeft:'12px'}
    },
    deleteProps = {
      text: I18N.Common.Button.Delete,
      menuItems: tags.map((tag,index)=>(<MenuItem value={index} primaryText={tag.get('TagName')} />)),
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
												uom={util.isNumber(InvestmentReturnCycle)?I18N.EM.Year:''}/>


					</div>
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

  componentDidMount(){
    getDetail(this.props.effect.get('EnergyEffectId'));
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
					{this.state.energySystemDialogShow && <PreCreate isEdit={true}
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
};
