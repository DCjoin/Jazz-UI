import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import moment from 'moment';
// import {EnergySystemArr} from '../../../constants/actionType/Effect.jsx';
import util from 'util/Util.jsx';
import ListStore from '../../../stores/save_effect/ListStore.jsx';
import classNames from 'classnames';
import {calcState} from "../../../constants/actionType/Effect.jsx";
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

export class ItemForConsultant extends Component {

  getTitle(){
    var {CalcState,EnergySolutionName}=this.props.effect.toJS();
    return(
      <div className="jazz-effect-item-info-title">
        <span className="isPreferred"></span>
        <span className="name">{EnergySolutionName}</span>
        {CalcState!==null && <FontIcon className={CalcState===calcState.Being?"icon-revised-cn":"icon-revised-en"}/>}
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
          {EnergySystem && <span>|</span>}
          {EnergySystem && <span>{ListStore.getEnergySystem(EnergySystem)}</span>}
        </span>
        <span>
          <span>{I18N.Setting.Effect.ConfiguredTag}</span>
          <span style={{color:"#000000"}}>{ConfigedTagCount}</span>
          <span>{`/${TotalTagCount}`}</span>
          <span>{ConfigedTagCount===TotalTagCount && <FontIcon className="icon-sync-ok"/>}</span>
        </span>
        <span>
          <span>{I18N.Setting.Effect.Cost}</span>
          <span style={{color:"#000000"}}>{`${util.getLabelData(AnnualCostSaving)} RMB`}</span>
        </span>
      </div>
    )
  }

  render(){
    return(
      <div className={classNames({
          "active":false
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
        {CalcState!==null && <FontIcon className={CalcState===calcState.Being?"icon-revised-cn":"icon-revised-en"}/>}
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
    return(
      <div className="jazz-effect-item-draft-stepper">
        <Stepper linear={false}>
          <Step completed={ConfigStep>=1}>
            <StepLabel>
      Select campaign settings
    </StepLabel>
  </Step>
  <Step completed={false}>
    <StepLabel
      icon={<WarningIcon color={red500} />}
      style={{color: red500}}
    >
      Create an ad group
    </StepLabel>
  </Step>
  <Step completed={false}>
    <StepLabel>
      Create an ad
    </StepLabel>
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
        {this.getCost()}
      </div>
    )
  }
}

ItemForDraft.propTypes = {
  effect:React.PropTypes.object,
  onContinue:React.PropTypes.func,
  onDelete:React.PropTypes.func,
};
