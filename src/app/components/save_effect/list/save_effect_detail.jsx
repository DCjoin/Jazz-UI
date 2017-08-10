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
import {getDetail} from 'actions/save_effect_action.js';

function validValue(value) {
	return value!==null?util.getLabelData(value*1):'-';
}

export default class EffectDetail extends Component {

  constructor(props, ctx) {
        super(props)
        this._onChanged = this._onChanged.bind(this);
  }

  state={
    detailInfo:null
  }

  _onChanged(){
    this.setState({
      detailInfo:ListStore.getDetail()
    })
  }

  _handleEditTagChange(event, value){

  }

  _handleDeleteTagChange(event, value){

  }

  _renderTitle(){
    return(
      <div className="jazz-effect-detail-header">
        <span>
          <IconButton iconClassName="icon-return" onTouchTap={this.props.onBack} iconStyle={{fontSize:'17px'}} style={{width:'17px',height:'19px',padding:'0'}}/>
          <div className="jazz-effect-detail-header-title">{this.props.effect.get('EnergySolutionName')}</div>
        </span>
      </div>
    )
  }
  _renderSubTitle(){
    // var tag=this.state.detailInfo.get('Tags');
    var tag=Immutable.fromJS({a:1,b:3});
    var {ExecutedTime,EnergySystem,CalcState}=this.props.effect.toJS();
    if(tag.size===0){
      return (
        <div className="jazz-effect-detail-header-subtitle">
          <div className="jazz-effect-detail-header-subtitle-info">
            <span>
              <FontIcon className="icon-calendar1"/>
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
              <div className="operation">{I18N.Baseline.Button.Edit}</div>
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
    // var tags=this.state.detailInfo.get('EffectItems'),
          //  {EnergySaving,EnergySavingCosts,InvestmentAmount,InvestmentReturnCycle,EnergySavingUomId}=this.state.detailInfo.toJS();
    var {CalcState}=this.props.effect.toJS(),
        preTitle=CalcState===calcState.Being?I18N.SaveEffect.UtilNow:'';
    var tags=Immutable.fromJS([{TagId:1,TagName:'TagA'},{TagId:2,TagName:'TagB'}]),
        EnergySaving=1,
        EnergySavingCosts=1,
        InvestmentAmount=1,
        InvestmentReturnCycle=1,
        EnergySavingUomId=1;
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
      }
    },
    editProps = {
      text: I18N.Common.Button.Edit,
      menuItems: tags.map(tag=>(<MenuItem value={tag.get('TagId')} primaryText={tag.get('TagName')} />)),
      onItemClick: this._handleEditTagChange,
      buttonIcon: 'icon-arrow-unfold',
      buttonStyle:{marginLeft:'12px'}
    },
    deleteProps = {
      text: I18N.Common.Button.Delete,
      menuItems: tags.map(tag=>(<MenuItem value={tag.get('Id')} primaryText={tag.get('Name')} />)),
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

    return(
      <div className="jazz-effect-detail-content">
        <div className="jazz-effect-detail-content-header">
          <div className="jazz-effect-detail-content-header-title">{I18N.MainMenu.SaveEffect}</div>
          <div className="jazz-effect-detail-content-header-operation">
            <FlatButton label={I18N.Setting.Effect.Config}
                        style={style.btn} labelStyle={style.lable} secondary={true}/>
            <DropdownButton {...editProps}/>
            <DropdownButton {...deleteProps}/>
          </div>
        </div>
        <div className="jazz-effect-detail-content-save-energy">
            <IconText style={{width:'140px',marginLeft:'0px'}} icon={saveIcon} label={`${preTitle}${I18N.SaveEffect.EnergySaving}`} value={validValue(EnergySaving)} uom={util.getUomById(EnergySavingUomId).Code}/>
            <IconText style={{width:'140px',marginLeft:'0px'}} icon={costIcon} label={`${preTitle}${I18N.Setting.Effect.Cost}`} value={validValue(EnergySavingCosts)} uom="RMB"/>
            <IconText style={{width:'140px',marginLeft:'0px'}} icon={amountIcon} label={I18N.Setting.ECM.InvestmentAmount} value={validValue(InvestmentAmount)} uom="RMB"/>
            <IconText style={{width:'140px',marginLeft:'0px'}} icon={cycleIcon} label={I18N.Setting.ECM.PaybackPeriod} value={InvestmentReturnCycle || '-'}
                      uom={util.isNumber(InvestmentReturnCycle)?I18N.EM.Year:''}/>


        </div>
      </div>
    )
  }

  // componentDidMount(){
  //   getDetail(effect.get('EnergyEffectItemId'));
  //   ListStore.addChangeListener(this._onChanged);
  // }
  //
  // componentWillUnmount(){
  //   ListStore.removeChangeListener(this._onChanged);
  // }

  render(){
    return(
      <div className="jazz-effect-detail">
        {this._renderTitle()}
        {this._renderSubTitle()}
        {this._renderContent()}
      </div>
    )
  }
}

EffectDetail.propTypes = {
  effect:React.PropTypes.object,
  onBack:React.PropTypes.func,
};
