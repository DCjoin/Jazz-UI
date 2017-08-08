import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import moment from 'moment';
// import {EnergySystemArr} from '../../../constants/actionType/Effect.jsx';
import util from 'util/Util.jsx';
import ListStore from '../../../stores/save_effect/ListStore.jsx';
import classNames from 'classnames';
import {calcState} from "../../../constants/actionType/Effect.jsx";
import {stepLabelProps} from '../../Diagnose/CreateDiagnose.jsx';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

class CalculatingIcon extends Component{
  render(){
    var iconStyle={
      fontSize:'10px',
      marginRight:'3px'
    }
    return(
      <div className="icon-calculating">
        <FontIcon className="icon-mainline" color="#32ad3d" style={iconStyle}/>
        <div>{I18N.SaveEffect.Calculating}</div>

      </div>
    )
  }
}

class CalculatedIcon extends Component{
  render(){
    var iconStyle={
      fontSize:'10px',
      marginRight:'3px'
    }
    return(
      <div className="icon-calculated">
        <FontIcon className="icon-sync-ok" color="#ffffff" style={iconStyle}/>
        <div>{I18N.SaveEffect.Calculated}</div>
      </div>
    )
  }
}

export class ItemForConsultant extends Component {

  getTitle(){
    var {CalcState,EnergySolutionName}=this.props.effect.toJS();
    return(
      <div className="jazz-effect-item-info-title">
        <span className="isPreferred"></span>
        <span className="name">{EnergySolutionName}</span>
        {CalcState!==null && CalcState===calcState.Being?<CalculatingIcon/>:<CalculatedIcon/>}
      </div>
    )
  }

  getInfo(){
    var {ExecutedTime,EnergySystem,ConfigedTagCount,TotalTagCount,AnnualCostSaving}=this.props.effect.toJS();
    return(
      <div className="jazz-effect-item-info-subTitle">
        <span>
          <span>{moment(util.DataConverter.JsonToDateTime(ExecutedTime)).format(I18N.DateTimeFormat.IntervalFormat.FullDate)}</span>
          <span>{I18N.Setting.Effect.Start}</span>
          {EnergySystem && ConfigedTagCount>0 && <span>|</span>}
          {EnergySystem && ConfigedTagCount>0 && <span>{ListStore.getEnergySystem(EnergySystem)}</span>}
        </span>
        {ConfigedTagCount>0 && <span>
          <span>{I18N.Setting.Effect.ConfiguredTag}</span>
          <span style={{color:"#000000"}}>{ConfigedTagCount}</span>
          <span>{`/${TotalTagCount}`}</span>
          <span>{ConfigedTagCount===TotalTagCount && <FontIcon className="icon-check-circle" color="#32ad3d" style={{fontSize:'14px',marginLeft:'10px'}}/>}</span>
        </span>}
        {ConfigedTagCount>0 && <span>
          <span>{I18N.Setting.Effect.Cost}</span>
          <span style={{color:"#000000"}}>{`${util.getLabelData(AnnualCostSaving)} RMB`}</span>
        </span>}
      </div>
    )
  }

  render(){
    var {ConfigedTagCount}=this.props.effect.toJS();
    return(
      <div className={classNames({
          "active":ConfigedTagCount!==0
        })}>
        <div className="jazz-effect-item">
          <span className="jazz-effect-item-info">
            {this.getTitle()}
            {this.getInfo()}
          </span>
          <span className="jazz-effect-item-action">{I18N.Setting.Effect.Config}</span>
        </div>
      </div>
    )
  }
}

ItemForConsultant.propTypes = {
  effect:React.PropTypes.object,
}


export class ItemForManager extends Component {

  getTitle(){
    var {CalcState,EnergySolutionName}=this.props.effect.toJS();
    return(
      <div className="jazz-effect-item-info-title">
        <span className="isPreferred"></span>
        <span className="name">{EnergySolutionName}</span>
        {CalcState!==null && CalcState===calcState.Being?<CalculatingIcon/>:<CalculatedIcon/>}
      </div>
    )
  }

  getInfo(){
    var {ExecutedTime,EnergySystem}=this.props.effect.toJS();
    return(
      <div className="jazz-effect-item-info-subTitle">
        <span>
          <span>{moment(util.DataConverter.JsonToDateTime(ExecutedTime)).format(I18N.DateTimeFormat.IntervalFormat.FullDate)}</span>
          <span>{I18N.Setting.Effect.Start}</span>
          {EnergySystem && <span>|</span>}
          {EnergySystem && <span>{ListStore.getEnergySystem(EnergySystem)}</span>}
        </span>
      </div>
    )
  }

  getCost(){
    var {AnnualCostSaving}=this.props.effect.toJS();
    return(
      <span className="jazz-effect-item-cost">
        <span>{I18N.Setting.Effect.Cost}</span>
        <span>{`${util.getLabelData(AnnualCostSaving)} RMB`}</span>
      </span>
    )
  }
  render(){
    return(
      <div className="jazz-effect-item">
        <span className="jazz-effect-item-info">
          {this.getTitle()}
          {this.getInfo()}
        </span>
        {this.getCost()}
      </div>
    )
  }
}

ItemForManager.propTypes = {
  effect:React.PropTypes.object,
};

export class ItemForDraft extends Component {

  getTitle(){
    var {TagName,EnergySolutionName}=this.props.effect.toJS();
    return(
      <span className="jazz-effect-item-draft-title">
        <div className="jazz-effect-item-draft-title-tag">{`${I18N.Setting.Effect.TagName}${TagName}`}</div>
        <div className="jazz-effect-item-draft-title-problem">{`${I18N.Setting.Effect.Problem}${EnergySolutionName}`}</div>
      </span>
    )
  }

  getStep(){
    var {ConfigStep}=this.props.effect.toJS();
    var step=ConfigStep-1;
    return(
      <div className="jazz-effect-item-draft-stepper">
        <Stepper activeStep={step} style={{width: '80%'}}>
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
      </div>
    )
  }

  getAction(){
    return(
      <span className="jazz-effect-item-draft-action">
        <span onClick={this.props.onContinue}>{I18N.Setting.Effect.ContinueConfig}</span>
        <span onClick={this.props.onDelete}>{I18N.Common.Button.Delete}</span>
      </span>
    )
  }
  render(){
    return(
      <div className="jazz-effect-item-draft">
        {this.getTitle()}
        {this.getStep()}
        {this.getAction()}
      </div>
    )
  }
}

ItemForDraft.propTypes = {
  effect:React.PropTypes.object,
  onContinue:React.PropTypes.func,
  onDelete:React.PropTypes.func,
};
