import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import moment from 'moment';
// import {EnergySystemArr} from '../../../constants/actionType/Effect.jsx';
import util from 'util/Util.jsx';
import ListStore from '../../../stores/save_effect/ListStore.jsx';

export class ItemForConsultant extends Component {

  getTitle(){
    var {isCalculated}=this.props.effect.toJS();
    return(
      <div className="jazz-effect-item-info-title">
        <span className="isPreferred"></span>
        <span className="name">厨房排油烟风机运行时间优化</span>
        {isCalculated!==null && <FontIcon className={isCalculated?"icon-revised-cn":"icon-revised-en"}/>}
      </div>
    )
  }

  getInfo(){
    var {startTime,EnergySystem,tagNumber,tagTotal,cost}=this.props.effect.toJS();
    return(
      <div className="jazz-effect-item-info-subTitle">
        <span>
          <span>{moment(util.DataConverter.JsonToDateTime(startTime)).format(I18N.DateTimeFormat.IntervalFormat.FullDate)}</span>
          <span>{I18N.Setting.Effect.Start}</span>
          {EnergySystem && <span>
                            <span>|</span>
                            <span>{ListStore.getEnergySystem(EnergySystem)}</span>
                           </span>}
        </span>
        <span>
          <span>{I18N.Setting.Effect.ConfiguredTag}</span>
          <span>{tagNumber}</span>
          <span>{`/${tagTotal}`}</span>
          <span>{tagNumber===tagTotal && <FontIcon className="icon-sync-ok"/>}</span>
        </span>
        <span>
          <span>{I18N.Setting.Effect.Cost}</span>
          <span>{`${util.getLabelData(cost)} RMB`}</span>
        </span>
      </div>
    )
  }

  render(){
    return(
      <div className="jazz-effect-item">
        <span className="jazz-effect-item-info">
          {this.getTitle()}
          {this.getInfo()}
        </span>
        <span className="jazz-effect-item-action">{I18N.Setting.Effect.Config}</span>
      </div>
    )
  }
}

ItemForConsultant.propTypes = {
  effect:React.PropTypes.object,
}


export class ItemForManager extends Component {

  getTitle(){
    var {isCalculated}=this.props.effect.toJS();
    return(
      <div className="jazz-effect-item-info-title">
        <span className="isPreferred"></span>
        <span className="name">厨房排油烟风机运行时间优化</span>
        {isCalculated!==null && <FontIcon className={isCalculated?"icon-revised-cn":"icon-revised-en"}/>}
      </div>
    )
  }

  getInfo(){
    var {startTime,EnergySystem}=this.props.effect.toJS();
    return(
      <div className="jazz-effect-item-info-subTitle">
        <span>
          <span>{moment(util.DataConverter.JsonToDateTime(startTime)).format(I18N.DateTimeFormat.IntervalFormat.FullDate)}</span>
          <span>{I18N.Setting.Effect.Start}</span>
          {EnergySystem && <span>
                            <span>|</span>
                            <span>{ListStore.getEnergySystem(EnergySystem)}</span>
                           </span>}
        </span>
      </div>
    )
  }

  getCost(){
    var {cost}=this.props.effect.toJS();
    return(
      <span className="jazz-effect-item-cost">
        <span>{I18N.Setting.Effect.Cost}</span>
        <span>{`${util.getLabelData(cost)} RMB`}</span>
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
    var {tagName,problemName}=this.props.effect.toJS();
    return(
      <span className="jazz-effect-item-draft-title">
        <div className="jazz-effect-item-draft-title-tag">{`${I18N.Setting.Effect.TagName}${tagName}`}</div>
        <div className="jazz-effect-item-draft-title-problem">{`${I18N.Setting.Effect.Problem}${problemName}`}</div>
      </span>
    )
  }

  getStep(){
    var {startTime,EnergySystem}=this.props.effect.toJS();
    return(
      <div className="jazz-effect-item-draft-stepper">
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
